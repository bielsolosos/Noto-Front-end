export interface UserResponse {
  id: string;
  username: string;
  email: string;
  profileImageUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  roles: string[];
}

export interface TokenResponse {
  token: string;
  refreshToken: string;
}
