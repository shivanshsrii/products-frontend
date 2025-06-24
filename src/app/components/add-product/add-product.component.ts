import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // ✅ Add this

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, RouterModule], // ✅ Add RouterModule
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  productForm: FormGroup;
  imageFile!: File;
  imagePreviewUrl: string = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router // ✅ Inject Router
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(1)]],
      description: [''],
      image: [null, Validators.required]
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
  console.log('Form submitted');
  // if (this.productForm.invalid || !this.imageFile) {
  //   console.log('Form is invalid or image not selected');
  //   return;
  // }

  const formData = new FormData();
  formData.append('name', this.productForm.get('name')?.value);
  formData.append('price', this.productForm.get('price')?.value);
  formData.append('description', this.productForm.get('description')?.value);
  formData.append('image', this.imageFile);

  console.log('Sending data:', formData);

  this.productService.addProduct(formData).subscribe({
    next: () => {
      alert('Product added successfully!');
      this.productForm.reset();
      this.imagePreviewUrl = '';
      this.router.navigate(['/products']);
    },
    error: err => {
      console.error('Error adding product:', err);
      alert('Failed to add product');
    }
  });
}
}
