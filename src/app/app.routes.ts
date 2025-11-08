import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { AuthGuard } from './guards/auth-guard';

// Base-href aware routing
// When base href is "/secure-admin/", the empty path ('') maps to that base path.
// So we render LoginComponent for '' and keep dashboard as a child path.
export const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];
