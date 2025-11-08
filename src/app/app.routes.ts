import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { AuthGuard } from './guards/auth-guard';

// App routes
// - Default redirects to /secure-admin (login)
// - /secure-admin: LoginComponent
// - /dashboard: Protected dashboard
// - Wildcard redirects to /secure-admin
export const routes: Routes = [
  { path: '', redirectTo: 'secure-admin', pathMatch: 'full' },
  { path: 'secure-admin', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'secure-admin' }
];
