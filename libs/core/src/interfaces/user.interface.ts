export enum EUserRole {
  ADMIN = 'admin',
  URL_CREATOR = 'url-creator',
}

export interface IUser {
  email: string;
  username: string;
  password: string;
  role: EUserRole;
}
