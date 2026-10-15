import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // POST /api/users
  registerUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // GET /api/users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}
