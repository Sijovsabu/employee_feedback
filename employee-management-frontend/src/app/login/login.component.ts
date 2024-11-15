import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  userType: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  onLogin() {
    if (!this.userType || !this.password) {
      alert('Please fill all fields');
      return;
    }
    this.authService.login(this.userType, this.password);
  }
}
