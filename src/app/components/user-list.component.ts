import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>Registered Users</h2>

      <div *ngIf="isLoading" class="info">Loading users...</div>
      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div *ngIf="!isLoading && !errorMessage && users.length === 0" class="info">
        No users yet. Register the first one!
      </div>

      <table *ngIf="users.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of users">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .card {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    h2 { color: #333; margin-top: 0; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f2f2f2; }
    tr:hover { background: #fafafa; }
    .info { text-align: center; color: #888; padding: 20px; }
    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 10px;
      border-radius: 4px;
    }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(private userService: UserService) {}

  // Runs once when the page opens
  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load users. Make sure the Spring Boot backend is running.';
        this.isLoading = false;
      }
    });
  }
}
