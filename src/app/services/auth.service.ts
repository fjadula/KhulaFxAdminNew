import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AdminUser, AuthResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<AdminUser | null>;
  public currentUser: Observable<AdminUser | null>;

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('adminUser');
    this.currentUserSubject = new BehaviorSubject<AdminUser | null>(
      stored ? JSON.parse(stored) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AdminUser | null {
    return this.currentUserSubject.value;
  }

  login(credential: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/Auth/google`, { credential })
      .pipe(map(response => {
        if (response.success && response.token) {
          const user: AdminUser = {
            email: response.email,
            name: response.name
          };
          localStorage.setItem('adminUser', JSON.stringify(user));
          localStorage.setItem('adminToken', response.token);
          this.currentUserSubject.next(user);
        }
        return response;
      }));
  }

  logout(): void {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
