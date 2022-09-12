export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  CONSUMER = 'consumer',
}

export interface User {
  sub: string;
  preferred_username: string;
  resource_access: Role[];
}
