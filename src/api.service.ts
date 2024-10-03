import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private auth0APIUrl = 'https://dev-05goxzwbcxrtn5fz.us.auth0.com/';
  private apiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  setAuth0Token(): Observable<any> {
    return this.http.post<any>(`${this.auth0APIUrl}/oauth/token`, {
      "client_id":"ceTuzqvNK7YYndF6rseNuHqCvsvFACp4",
      "client_secret":"h8QR1s0-2NL4cqWS_433TURIQKJFH9ofJ9uklcilfiWac__ZXeHz_ytnIWKqfaBC",
      "audience":"https://dev-05goxzwbcxrtn5fz.us.auth0.com/api/v2/",
      "grant_type":"client_credentials"
    });
  }

  getAuth0UsersRole(id: string, token: string): Observable<any> {
    return this.http.get<any>(`${this.auth0APIUrl}/api/v2/users/${id}/roles`, { headers: { Authorization: `Bearer ${token}`} });
  }

  getUsersIncidents(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/incidents?email=${encodeURIComponent(email)}`);
  }
  
  createUsersIncident(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/incident`, data);
  }
  
  updateUsersIncident(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/incident/${id}`, data);
  }
  
  deleteUsersIncident(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/incident/${id}`);
  }
}
