import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // must match the backend limit (5 MB)

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
            <th>Photo</th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of users">
            <td>
              <img *ngIf="user.photoUrl; else initials" [src]="user.photoUrl" [alt]="user.name" class="avatar" />
              <ng-template #initials>
                <div class="avatar placeholder">{{ user.name.charAt(0).toUpperCase() }}</div>
              </ng-template>
            </td>
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td class="actions">
              <input #picker type="file" accept="image/png,image/jpeg,image/webp" hidden
                     (change)="onPhotoSelected(user, picker)" />
              <button (click)="picker.click()" [disabled]="uploadingId === user.id">
                {{ uploadingId === user.id ? 'Uploading...' : (user.photoUrl ? 'Change photo' : 'Upload photo') }}
              </button>
            </td>
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
    th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #ddd; vertical-align: middle; }
    th { background: #f2f2f2; }
    tr:hover { background: #fafafa; }
    .avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; display: block; }
    .placeholder {
      background: #c5cae9;
      color: #3f51b5;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .actions { text-align: right; }
    button {
      padding: 6px 12px;
      background: #3f51b5;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      white-space: nowrap;
    }
    button:disabled { background: #9fa8da; cursor: not-allowed; }
    .info { text-align: center; color: #888; padding: 20px; }
    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 15px;
    }
  `]
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  errorMessage = '';
  uploadingId: number | null = null;

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

  onPhotoSelected(user: User, picker: HTMLInputElement): void {
    const file = picker.files?.[0];
    picker.value = ''; // allow choosing the same file again later
    if (!file || user.id == null) {
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      this.errorMessage = 'Photo is too large (max 5 MB).';
      return;
    }

    this.errorMessage = '';
    this.uploadingId = user.id;
    this.userService.uploadPhoto(user.id, file).subscribe({
      next: (updated) => {
        user.photoUrl = updated.photoUrl;
        this.uploadingId = null;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Photo upload failed.';
        this.uploadingId = null;
      }
    });
  }
}
