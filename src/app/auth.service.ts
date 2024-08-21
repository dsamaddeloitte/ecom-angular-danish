import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.checkLoginStatus());
  public loggedIn$: Observable<boolean> = this.loggedInSubject.asObservable();
 
  constructor() {}
 
  private checkLoginStatus(): boolean {
    return !!localStorage.getItem('user');
  }
 
  login(useremail: string): void {
    localStorage.setItem('user', useremail);
    this.loggedInSubject.next(true);
  }
 
  logout(): void {
    localStorage.removeItem('user');
    this.loggedInSubject.next(false);
  }
 
  get isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }
}