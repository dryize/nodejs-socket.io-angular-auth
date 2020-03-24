import AuthService from "./auth.service";
import UserModel from "models/users.model";
import { User } from "interfaces/users.interface";


class ChatService {

  private auth: AuthService = new AuthService();
  private connections: { [id: string] : SocketIO.Socket; } = {};
  private pendingConnections: { [id: string] : SocketIO.Socket; } = {};

  
  constructor(private io: SocketIO.Server){
    this.io.on('connection', (event: SocketIO.Socket) => this.onConnection(event));
    this.io.on('disconnect', (event: SocketIO.Socket) => this.onDisconnect(event));
  }

  private async onConnection(socket: SocketIO.Socket){
    console.log('onConnect', socket.conn.request._query);

    if(socket.conn.request._query['token']){
      //if token specified, authenticate onConnect and listen to connection
      const token = socket.conn.request._query['token'];
      const userId = socket.conn.request._query['user'];
      try{
        const user: User = await this.auth.validateChatToken(token, userId, socket.conn.request.ip)
        this.listenToClientSocket(socket);
      }catch(e){
        socket.disconnect();
      }
    }else{
      //i f token is not specified, set auth timeout and listen for auth event for token
      // pendingConnections dictionary will hold the socket until authenticated
      this.pendingConnections[socket.id] = socket;
      const authTimeout: number = process.env.SOCKET_ATUH_TIMEOUT ? Number(process.env.SOCKET_ATUH_TIMEOUT) : 15000;
      
      // decline after 15 sec
      setTimeout(() => {
        if(this.pendingConnections[socket.id]){
          console.log(`Force disconnect ${socket.id}`);
          this.pendingConnections[socket.id].disconnect();
          delete this.pendingConnections[socket.id];
        }
      },authTimeout)
      
      //listen for auth event
      socket.on('auth', (event) => this.onAuth(socket.id, event));
    }
  }

  /**
   * Listen to client socket for message event
   */
  private listenToClientSocket(socket: SocketIO.Socket){
    this.connections[socket.id] = socket;
    this.connections[socket.id].on('message', (msg: any) => this.onMessage(socket.id, msg));
  }

  /**
   * auth message event handler
   * client is supposed to fire auth event with 'chat auth token' and 'user id'
   * listener with authenticate request and start listening to message
   */
  private async onAuth(socketId: string ,data: any){
    console.log('SocketIO onAuth', data);
    try{
      const user: User = await this.auth.validateChatToken(data.token, data.user, this.pendingConnections[socketId].conn.request.ip)
      this.listenToClientSocket(this.pendingConnections[socketId])
    }catch(e){
      this.pendingConnections[socketId].disconnect();
    }
    delete this.pendingConnections[socketId];
  }

  private onMessage(socketId: string, msg: any){
    console.log(`SocketIO onMessage ${socketId}`, msg);
  }

  private onDisconnect(socket: SocketIO.Socket){
    console.log('SocketIO onDisconnect', socket.id);
  }

}

export default ChatService;
