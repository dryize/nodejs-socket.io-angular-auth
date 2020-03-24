import { Deserializable } from './deserializable.model';


export class ChatTokenResponse extends Deserializable{
    token: string;
    expiresAt: number;
    userId: string;
}