import { Deserializable } from './deserializable.model';


export class AuthReponse extends Deserializable{
    token: string;
    expiresIn: number;
    displayName: string;
}