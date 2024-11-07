export enum Role {
  Manager = "manager",
  Employee = "employee"
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
}