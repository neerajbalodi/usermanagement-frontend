import { Routes } from '@angular/router';
import { RegisterComponent } from './components/user.register';
import { UserListComponent } from './components/user-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent },
  { path: 'users', component: UserListComponent },
  { path: '**', redirectTo: 'register' }
];
