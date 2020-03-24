import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { DataStoredInToken, TokenData, ChatTokenData } from '../interfaces/auth.interface';
import { User } from '../interfaces/users.interface';
import UserModel from '../models/users.model';
import ChatTokenModel from '../models/chatToken.model';
import { google } from 'googleapis';

class AuthService {
  public users = UserModel;
  public chatToken = ChatTokenModel;

  public async ceateSocialUser(token: string, access: string){
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    google.options({auth: oauth2Client});
    oauth2Client.credentials = {id_token: token, access_token: access};

    const people = google.people('v1');
    const res = await  people.people.get({resourceName: 'people/me', personFields: 'names,emailAddresses'});
    console.log(res.data);
    let displayName: string = res.data.names[0].displayName;
    let emails: string[] = [];
    res.data.emailAddresses.forEach(em => {
      if(em.metadata.verified){
        emails.push(em.value);
      }
    });

    const createUserData: User = await this.users.create({ 
      emails,
      displayName,
      provider: 'google',
      reference: res.data.resourceName
    });

    const tokenData = this.createToken(createUserData);
    return {tokenData, user: createUserData};
  }


  public async createChatToken(user: User, ip: string){
    const now = (new Date()).getTime();
    const token = await bcrypt.hash(`${user._id}_${user.emails[0]}_${ip}_${now}`, 10);
    const expiresAt = now + (2*60*1000);
    const chatToken: ChatTokenData = await this.chatToken.create({
      token,
      expiresAt,
      ip,
      userId: user._id
    });
    return chatToken;
  }

  public async validateChatToken(token: string, userid: string, ip: string){
    const chatToken: ChatTokenData = await this.chatToken.findOne({token: token, userId: userid, ip: ip, expiresAt: {$gt: (new Date()).getTime()}});
    if(chatToken == null){
      console.log('Toen not found', token)
      throw new Error('Token not found');
    }
    return this.users.findOne({_id: chatToken.userId});
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id, email: user.emails[0] };
    const secret: string = process.env.JWT_SECRET;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: jwt.sign(dataStoredInToken, secret, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
