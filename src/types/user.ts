export interface User {
  id: string;
  name: string;
  email: string;
  premium: boolean;
  createdAt: Date;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}