import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <span class="brand">User Management</span>
      <div class="links">
        <a routerLink="/register" routerLinkActive="active">Register</a>
        <a routerLink="/users" routerLinkActive="active">Users</a>
      </div>
    </nav>

    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .navbar {
      background: #3f51b5;
      color: white;
      padding: 15px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .brand { font-size: 20px; font-weight: bold; }
    .links a {
      color: white;
      text-decoration: none;
      margin-left: 15px;
      padding: 6px 12px;
      border-radius: 4px;
    }
    .links a.active { background: rgba(255, 255, 255, 0.25); }
    main { padding: 30px 20px; }
  `]
})
export class AppComponent {}
