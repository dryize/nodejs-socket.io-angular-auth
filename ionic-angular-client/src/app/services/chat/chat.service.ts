import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ChatTokenResponse } from 'src/app/shared/models/chatTokenResponse.model copy';
import { map, take } from 'rxjs/operators';
import { Socket, SocketIoConfig } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private socket: Socket;

  constructor(private auth: AuthService, private http: HttpClient ) {
    console.log('init chat service');
    this.auth.authStateSubject.subscribe(state => {
      if(state == true){
        console.log('Connect');
        this.connect();
      }else{
        console.log('Disconnect');
        this.disconnect();
      }
    });
  }

  public setupListners(){
    this.socket.on('connection', (socket) => this.onConnection(socket));
    this.socket.on('message', (event) => this.onMessage(event));
    this.socket.on('auth', (event) => this.onAuth(event));
    this.socket.on('disconnect', (socket) => this.onDisconnect(socket));
  }

  private onConnection(socket: Socket){
    console.log('Socket onConnect', event);
  }

  private onMessage(event: any){
    console.log('Socket onMessage', event);
  }

  private onAuth(event: any){
    console.log('Socket onMessage', event);
  }

  private onDisconnect(socket: any){
    console.log('Socket onDisconnect', event);
  }

  private connect(){
    this.requestChatToken().pipe(take(1)).subscribe(tokenData => {
      if(this.socket == null){
        this.socket = new Socket({ url: `http://localhost:3000?token=${tokenData.token}&user=${tokenData}`, options: {} });
        this.setupListners();
      }else if(!this.socket.ioSocket.connected){
        this.socket.connect();
      }
      this.socket.emit('auth', {token: tokenData.token, user: tokenData.userId});
    });
  }

  private disconnect(){
    if(this.socket)this.socket.disconnect();
  }

  private requestChatToken(): Observable<ChatTokenResponse>{
    return this.http.post(`${environment.apiUrl}/auth/chatToken`, {})
            .pipe(map(resp => (new ChatTokenResponse()).deserialize(resp)));
  }
}
