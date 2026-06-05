export interface AdminUser {
  id: string;
  username: string;
  email: string;
  roles: string[];
  isActive: boolean;
}
