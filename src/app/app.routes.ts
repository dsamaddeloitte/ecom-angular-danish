import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SellComponent } from './sell/sell.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { LoginComponent } from './Auth/login/login.component';
import { SignUpComponent } from './Auth/sign-up/sign-up.component';
import { authGuard } from './auth.guard';  // Import the guard
 
export const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "sell",
    component: SellComponent,
    canActivate: [authGuard]  // Protect the route with the guard
  },
  {
    path: "checkout",
    component: CheckoutComponent
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "signup",
    component: SignUpComponent
  }
];