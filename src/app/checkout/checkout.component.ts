import { Component, OnInit, inject } from '@angular/core';
import { CartService } from '../../cart.service';
import { CommonModule } from '@angular/common';
declare let paypal: any;
interface UserProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  email: string;
  imageUrl: string;
}
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  cartService = inject(CartService);
  cartItems: UserProduct[] = [];
  ngOnInit(): void {
    this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
    });
    this.loadPaypalScript().then(() => {
      this.renderPaypalButton();
    });
  }
  loadPaypalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if ((window as any).paypal) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src =
        'https://www.paypal.com/sdk/js?client-id=AahLA6zvaKBKZkEoL5KjWYOsfGzOSExOldbqlUOaBrKzzI_7UtvnLFTUxND-QI6X2SA8LwKvwFVzSNTg';
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.body.appendChild(script);
    });
  }
  renderPaypalButton(): void {
    paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: this.sumPrice().toFixed(2), // Ensure the value is a string with 2 decimal places
                  currency: 'INR',
                },
              },
            ],
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            alert('Transaction completed by ' + details.payer.name.given_name);
            // Optionally clear the cart or perform other post-transaction logic
            this.cartService.clearCart();
          });
        },
        onError: (err: any) => {
          console.error('PayPal Checkout onError', err);
        },
      })
      .render('#paypal-button-container');
  }
  removeFromCart(product: UserProduct): void {
    const currentCart = this.cartService.getCartItems();
    const updatedCart = currentCart.filter((item) => item.id !== product.id);
    this.cartService.updateCart(updatedCart);
  }
  sumPrice(): number {
    return this.cartItems.reduce((total, item) => total + item.price, 0);
  }
}
