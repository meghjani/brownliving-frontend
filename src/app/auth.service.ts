import { Injectable } from '@angular/core';
// Import the AuthService type from the SDK
import { AuthService as Auth0Service } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;

  constructor(private auth0: Auth0Service) {
    auth0.user$.subscribe((u: any) => {
      if (u.email) this.isAuthenticated = true;
      else this.isAuthenticated = false;
    });
  }

  isAuthenticatedUser(): boolean {
    return this.isAuthenticated;
  }

  logout(): void {
    this.isAuthenticated = false;
  }
}
