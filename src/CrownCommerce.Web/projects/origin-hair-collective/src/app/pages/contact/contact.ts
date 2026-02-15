import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent, SectionHeaderComponent } from 'components';
import { InquiryService } from 'api';

@Component({
  selector: 'app-contact',
  imports: [FormsModule, ButtonComponent, SectionHeaderComponent],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class ContactPage {
  private readonly inquiryService = inject(InquiryService);

  name = '';
  email = '';
  phone = '';
  message = '';

  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly error = signal<string | null>(null);

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
