import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
	{ path: '', redirectTo: 'secure-admin', pathMatch: 'full' },
	{ path: 'secure-admin', component: LoginComponent },
	{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
	{ path: '**', redirectTo: 'secure-admin' }
];
