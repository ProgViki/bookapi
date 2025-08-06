import { Role, User } from '@prisma/client';

export interface IUser extends User {}

export interface IAuthUser {
  id: number;
  email: string;
  role: Role;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister {
  email: string;
  password: string;
  name?: string;
  role?: Role;
}