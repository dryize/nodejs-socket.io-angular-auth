export interface User {
  _id: string;
  emails: [string],
  provider: string,
  reference: string,
  displayName: string,
}
