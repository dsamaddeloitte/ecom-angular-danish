import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
 
interface UserProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  email: string;
  imageUrl: string;
}
 
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = new BehaviorSubject<UserProduct[]>([]);
  cart$ = this.cart.asObservable();
 
  addToCart(product: UserProduct): void {
    const currentCart = this.cart.value;
    this.cart.next([...currentCart, product]);
  }
 
  getCartItems(): UserProduct[] {
    return this.cart.value;
  }
 
  clearCart(): void {
    this.cart.next([]);
  }
 
  updateCart(updatedCart: UserProduct[]): void {
    this.cart.next(updatedCart);
  }
}