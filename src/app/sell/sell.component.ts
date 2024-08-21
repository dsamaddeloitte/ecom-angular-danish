import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface UserProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  email: string;
  imageUrl: string;
}

@Component({
  selector: 'app-sell',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css'],
})
export class SellComponent implements OnInit {
  http = inject(HttpClient);
  products: UserProduct[] = [];
  userEmail: string | null = null;
  productForm: UserProduct = {
    id: this.generateRandomId(),
    name: '',
    description: '',
    price: 0,
    email: '',
    imageUrl: '',
  };
  isUpdating: boolean = false;
  updatingProductId: number | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  generateRandomId(): string {
    const randomId = Math.floor(10000 + Math.random() * 90000);
    return randomId.toString();
  }

  ngOnInit(): void {
    this.userEmail = localStorage.getItem('user');
    if (this.userEmail) {
      this.productForm.email = this.userEmail;
      this.http
        .get<UserProduct[]>('http://localhost:3000/products')
        .subscribe((data: UserProduct[]) => {
          this.products = data.filter(
            (product: UserProduct) => product.email === this.userEmail
          );
        });
    } else {
      console.log('No user email found in localStorage');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.productForm.imageUrl = this.imagePreview;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  addProduct(): void {
    this.productForm.id = this.generateRandomId(); // Ensure the ID is unique each time a product is added
    this.http
      .post<UserProduct>('http://localhost:3000/products', this.productForm)
      .subscribe((newProduct: UserProduct) => {
        this.products.push(newProduct);
        this.resetForm();
      });
  }

  updateProduct(product: UserProduct, event: Event): void {
    event.preventDefault();
    this.isUpdating = true;
    this.updatingProductId = parseInt(product.id) ?? null;
    this.productForm = { ...product };
    this.imagePreview = product.imageUrl;
  }

  deleteProduct(id: string, event: Event): void {
    event.preventDefault();
    console.log(id);
    this.http.delete(`http://localhost:3000/products/${id}`).subscribe(() => {
      this.products = this.products.filter((product) => product.id !== id);
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.isUpdating && this.updatingProductId) {
      this.http
        .put<UserProduct>(
          `http://localhost:3000/products/${this.updatingProductId}`,
          this.productForm
        )
        .subscribe((updatedProduct: UserProduct) => {
          const index = this.products.findIndex(
            (product) => parseInt(product.id) === this.updatingProductId
          );
          if (index !== -1) {
            this.products[index] = updatedProduct;
          }
          this.resetForm();
        });
    } else {
      this.addProduct();
    }
  }

  resetForm(): void {
    this.productForm = {
      id: this.generateRandomId(),
      name: '',
      description: '',
      price: 0,
      email: this.userEmail!,
      imageUrl: '',
    };
    this.isUpdating = false;
    this.updatingProductId = null;
    this.selectedFile = null;
    this.imagePreview = null;
  }
}
