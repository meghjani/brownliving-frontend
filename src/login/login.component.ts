import { Component } from '@angular/core';
// Import the AuthService type from the SDK
import { AuthService } from '@auth0/auth0-angular';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService as authService } from '../app/auth.service'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  // Inject the authentication service into your component through the constructor
  constructor(public auth: AuthService, private router: Router, private authGuardService: authService) {
    auth.user$.subscribe((u: any) => { if (u?.email) this.router.navigateByUrl('/dashboard') })
  }
}
