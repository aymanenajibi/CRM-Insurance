// types/user.ts
export interface User {
  id: number;
  username: string;
  email: string;
  role: "user" | "admin";
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  role?: "user" | "admin";
}

export interface UserStatusData {
  active: boolean;
}

export interface UserFormData {
  username: string;
  email: string;
  password: string;
  role: "user" | "admin";
}