import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MediaResponse } from '../models/media.model';
import { PageResponsePagination } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  uploadMedia(file: File): Observable<MediaResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<MediaResponse>(`${this.apiUrl}/api/media/upload`, formData);
  }

  uploadProfileImage(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<void>(`${this.apiUrl}/api/users/profile-image`, formData);
  }

  getMedia(page: number = 0, size: number = 20, filter?: string): Observable<PageResponsePagination<MediaResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
      
    if (filter) {
      params = params.set('filter', filter);
    }

    return this.http.get<PageResponsePagination<MediaResponse>>(`${this.apiUrl}/api/media`, { params });
  }

  deleteMedia(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/media/${id}`);
  }
}
