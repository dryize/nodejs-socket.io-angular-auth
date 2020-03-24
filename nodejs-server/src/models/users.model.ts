import mongoose from 'mongoose';
import { User } from '../interfaces/users.interface';

const userSchema = new mongoose.Schema({
  emails: [String],
  provider: String,
  reference: String,
  displayName: String,
  createdAt: Date
}, { timestamps: true });

const UserModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default UserModel;
