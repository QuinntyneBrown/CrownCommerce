import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent, SectionHeaderComponent } from 'components';
import { CatalogService, InquiryService } from 'api';
import type { HairProduct } from 'api';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, ButtonComponent, SectionHeaderComponent],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactPage implements OnInit {
  private readonly inquiryService = inject(InquiryService);
  private readonly catalogService = inject(CatalogService);

  name = '';
  email = '';
  phone = '';
  message = '';
  productId = '';

  readonly products = signal<HairProduct[]>([]);

  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.catalogService.getProducts().subscribe({
      next: (products) => this.products.set(products),
      error: () => {},
    });
  }

  submit(): void {
    if (!this.name || !this.email || !this.message) {
      this.error.set('Please fill in all required fields.');
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    this.inquiryService.createInquiry({
      name: this.name,
      email: this.email,
      phone: this.phone || undefined,
      message: this.message,
      productId: this.productId || undefined,
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitted.set(true);
      },
      error: () => {
        this.submitting.set(false);
        this.error.set('Failed to send. Please try again.');
      },
    });
  }
}
