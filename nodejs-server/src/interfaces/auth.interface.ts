import { Request } from 'express';
import { User } from './users.interface';

export interface DataStoredInToken {
  _id: string;
  email: string
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface ChatTokenData {
  token: string,
  userId: string,
  ip: string,
  expiresAt: number
}

export interface RequestWithUser extends Request {
  user: User;
}
