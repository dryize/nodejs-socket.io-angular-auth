import { Deserializable } from './deserializable.model';


export class User extends Deserializable{
    id: string;
    displayName: string;
}