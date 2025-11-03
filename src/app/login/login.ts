import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

declare const handleCredentialResponse: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {
  googleClientId = environment.googleClientId;
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    // Check if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    // Load Google Sign-In script
    this.loadGoogleScript();
    
    // Make handleCredentialResponse available globally
    (window as any).handleCredentialResponse = this.handleCredentialResponse.bind(this);
  }

  loadGoogleScript(): void {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  handleCredentialResponse(response: any): void {
    this.ngZone.run(() => {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(response.credential).subscribe({
        next: (authResponse) => {
          this.isLoading = false;
          if (authResponse.success) {
            this.router.navigate(['/dashboard']);
          } else {
            this.errorMessage = authResponse.message || 'Access Denied. Your account is not authorized.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login error:', error);
          this.errorMessage = 'Login failed. Please try again or contact support.';
        }
      });
    });
  }

  triggerGoogleLogin(): void {
    // Programmatically trigger the Google Sign-In flow
    const googleLoginWrapper = document.createElement('div');
    googleLoginWrapper.style.display = 'none';
    googleLoginWrapper.classList.add('g_id_signin');
    googleLoginWrapper.setAttribute('data-type', 'standard');
    document.body.appendChild(googleLoginWrapper);
    
    // Initialize Google Sign-In on the hidden element
    if ((window as any).google) {
      (window as any).google.accounts.id.renderButton(googleLoginWrapper, {
        type: 'standard',
        size: 'large',
      });
      
      // Trigger click on the hidden button
      setTimeout(() => {
        const btn = googleLoginWrapper.querySelector('div[role="button"]') as HTMLElement;
        if (btn) {
          btn.click();
        }
      }, 100);
    }
  }
}