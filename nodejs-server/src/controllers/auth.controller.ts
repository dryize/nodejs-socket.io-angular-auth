import { NextFunction, Request, Response } from 'express';
import AuthService from '../services/auth.service';
import { User } from '../interfaces/users.interface';
import { RequestWithUser, ChatTokenData } from '../interfaces/auth.interface';

class AuthController {
  public authService = new AuthService();

  public createGoogle = async(req: Request, res: Response, next: NextFunction) => {
    try {
      const {tokenData, user} = await this.authService.ceateSocialUser(req.body.idToken, req.body.accessToken);
      res.status(201).json({...tokenData , displayName: user.displayName});
    } catch (error) {
      next(error);
    }
  }

  public chatToken = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userData: User = req.user;
    try {
      const chatToken: ChatTokenData = await this.authService.createChatToken(userData, req.ip);
      res.status(200).json(chatToken);
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
