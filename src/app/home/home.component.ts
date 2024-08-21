import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CartService } from '../../cart.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

interface UserProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  email: string;
  imageUrl: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule], // Add FormsModule to imports
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  http = inject(HttpClient);
  products: UserProduct[] = [];
  filteredProducts: UserProduct[] = [];
  cartService = inject(CartService);

  searchTerm: string = '';
  sortOrder: string = 'asc';

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.http
      .get<UserProduct[]>('http://localhost:3000/products')
      .subscribe((data) => {
        this.products = data;
        this.filteredProducts = data;
      });
  }

  addToCart(product: UserProduct, event: Event): void {
    event.preventDefault();
    this.cartService.addToCart(product);
  }

  trackById(index: number, product: UserProduct): string {
    return product.id;
  }

  searchProducts(): void {
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.sortProducts();
  }

  sortProducts(): void {
    this.filteredProducts.sort((a, b) => {
      return this.sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    });
  }
}
