import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AdminUser } from '../models/admin-user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.apiUrl}/api/admin/users/list`);
  }

  toggleActive(userId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/api/admin/users/${userId}/toggle-active`, {});
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/admin/users/${userId}`);
  }

  registerUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/users/register`, userData);
  }
}
