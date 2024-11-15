import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Use `inject` instead of `Inject`
  const userLoggedInString = localStorage.getItem('userLoggedIn');

  if (userLoggedInString === 'true') {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
