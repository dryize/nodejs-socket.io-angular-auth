import mongoose from 'mongoose';
import { ChatTokenData } from '../interfaces/auth.interface';

const chatTokenSchema = new mongoose.Schema({
  token: String,
  userId: String,
  expiresAt: Number
});

const ChatTokenModel = mongoose.model<ChatTokenData & mongoose.Document>('ChatToken', chatTokenSchema);

export default ChatTokenModel;
