export interface User {
  id: string;
  email: string;
  username: string;
  role_admin: boolean;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  apiKey: string;
  role_admin?: boolean;
}

export interface ResetPasswordRequest {
  newPassword: string;
}

export interface UpdateUserRoleRequest {
  role_admin: boolean;
}
