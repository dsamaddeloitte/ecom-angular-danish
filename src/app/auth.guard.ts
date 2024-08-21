import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
 
Injectable({
  providedIn: 'root'
})
export const authGuard: CanActivateFn = () => {
  const router = new Router();
 
  const user = localStorage.getItem('user');
  if (user) {
    return true;
  } else {
    router.navigate(['login']);
    return false;
  }
};