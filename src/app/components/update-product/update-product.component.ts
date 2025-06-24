import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {
  productForm!: FormGroup;
  productId!: number;
  imageFile!: File;
  imagePreviewUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productId = +this.route.snapshot.paramMap.get('id')!;
    this.initForm();

    this.productService.getProductById(this.productId).subscribe(product => {
      this.productForm.patchValue(product);
      this.imagePreviewUrl = product.imageUrl || '';
    });
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      description: [''],
      image: [null]
    });
  }

  onImageSelected(event: any) {
    this.imageFile = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result as string;
    };
    reader.readAsDataURL(this.imageFile);
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    const formData = new FormData();
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('price', this.productForm.get('price')?.value);
    formData.append('description', this.productForm.get('description')?.value || '');
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    this.productService.updateProduct(this.productId, formData).subscribe({
      next: () => {
        alert('Product updated!');
        this.router.navigate(['/products']);
      },
      error: err => {
        console.error('Update failed:', err);
        alert('Failed to update product.');
      }
    });
  }
}
