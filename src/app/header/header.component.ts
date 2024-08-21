import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../cart.service';
import { AuthService } from '../auth.service'; // Adjust the path as necessary

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  router = inject(Router);
  authService = inject(AuthService);
  cartService = inject(CartService);
  isLoggedIn: boolean = false;
  cartCount: number = 0;

  ngOnInit(): void {
    this.authService.loggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.cartService.cart$.subscribe((cart) => {
      this.cartCount = cart.length;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['login']);
  }

  goToCheckout(): void {
    this.router.navigate(['checkout']);
  }
}
