export class Deserializable {
    
    deserialize(input: any) {
        Object.assign(this, input);
        return this;
    }
}