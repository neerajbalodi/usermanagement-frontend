import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2>Register User</h2>

      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>

      <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
        <div class="form-group">
          <label for="name">Full Name</label>
          <input type="text" id="name" name="name" [(ngModel)]="user.name"
                 required placeholder="Enter your full name" />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" [(ngModel)]="user.email"
                 required email placeholder="Enter your email" />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" [(ngModel)]="user.password"
                 required minlength="6" placeholder="Minimum 6 characters" />
        </div>

        <button type="submit" [disabled]="registerForm.invalid || isLoading">
          {{ isLoading ? 'Registering...' : 'Register' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .card {
      max-width: 400px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    h2 { text-align: center; color: #333; margin-top: 0; }
    .form-group { margin-bottom: 18px; }
    label { display: block; margin-bottom: 6px; color: #555; font-weight: 500; }
    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 15px;
      box-sizing: border-box;
    }
    input.ng-invalid.ng-touched { border-color: #e53935; }
    button {
      width: 100%;
      padding: 12px;
      background: #3f51b5;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
    }
    button:disabled { background: #9fa8da; cursor: not-allowed; }
    .error-message {
      background: #ffebee;
      color: #c62828;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 15px;
      text-align: center;
    }
  `]
})
export class RegisterComponent {
  user: User = { name: '', email: '', password: '' };
  isLoading = false;
  errorMessage = '';

  constructor(private userService: UserService, private router: Router) {}

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.registerUser(this.user).subscribe({
      next: () => {
        // Registered! Go to the users list to see the new user.
        this.router.navigate(['/users']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Registration failed. Is the backend running?';
        this.isLoading = false;
      }
    });
  }
}
