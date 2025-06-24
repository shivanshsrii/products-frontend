import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Product {
  id?: number;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://productsmock-1.onrender.com/api/products'; // Replace with your deployed backend API

  constructor(private http: HttpClient) {}

  // 🔹 Add Product (FormData - image file supported)
  addProduct(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  // 🔹 Get All Products
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  // 🔹 Get Product by ID (for update)
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // 🔹 Update Product
  updateProduct(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  // 🔹 Delete Product
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
