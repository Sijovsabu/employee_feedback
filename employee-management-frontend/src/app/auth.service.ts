import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  login(userType: string, password: string): boolean {
    if (userType === 'admin' && password === 'admin') {
      localStorage.setItem('userLoggedIn', 'true'); // Set
      this.router.navigate(['/admin']);
      return true;
    } else if (userType === 'employee' && password === '123') {
      localStorage.setItem('userLoggedIn', 'true'); // Set
      this.router.navigate(['/employee']);
      return true;
    } else {
      alert('Invalid Credentials');
      return false;
    }
  }
}
