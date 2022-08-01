import { Role } from './role';

export class User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: Role;
  token?: string;
  resultObj?: string;

  constructor(params?: any){
    this.id = params.id;
    this.email = params.email;
    this.password = params.password;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.avatar = params.avatar;
    this.role = params.role;
    this.token = params.token;
    this.resultObj = params.resultObj;

  }
}

