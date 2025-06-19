import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Product {
  id?: number;
  name: string;
  price: number;
  imageUrl?: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  newProduct: Product = { name: '', price: 0 };
  selectedFile?: File;

  apiUrl = 'https://productsmock-1.onrender.com/api/products';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.http.get<Product[]>(this.apiUrl).subscribe((data) => {
      this.products = data;
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  addProduct() {
    const formData = new FormData();
    formData.append('name', this.newProduct.name);
    formData.append('price', this.newProduct.price.toString());
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.http.post<Product>(this.apiUrl, formData).subscribe(() => {
      this.getProducts();
      this.newProduct = { name: '', price: 0 };
      this.selectedFile = undefined;
    });
  }

  deleteProduct(id: number) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.getProducts();
    });
  }
}
