import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DividerComponent,
  ButtonComponent,
  ContactInfoCardComponent,
  FormInputComponent,
  FormTextareaComponent,
  FormSelectComponent,
  ChecklistItemComponent,
} from 'components';
import { InquiryService } from 'api';
import type { ContactSubject } from 'api';

@Component({
  selector: 'feat-contact-page',
  standalone: true,
  imports: [
    FormsModule,
    DividerComponent,
    ButtonComponent,
    ContactInfoCardComponent,
    FormInputComponent,
    FormTextareaComponent,
    FormSelectComponent,
    ChecklistItemComponent,
  ],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.scss',
})
export class ContactPage {
  private readonly inquiryService = inject(InquiryService);

  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly submitError = signal<string | null>(null);

  name = '';
  email = '';
  subject: ContactSubject = 'general';
  message = '';

  readonly contactInfo = [
    { icon: '✉', title: 'Email Us', description: 'hello@originhair.ca' },
    { icon: '📍', title: 'Visit Us', description: '123 Queen Street West, Mississauga, ON L5B 1C8' },
    { icon: '📞', title: 'Call Us', description: '+1 (905) 555-0123\nMon-Fri 9am-6pm EST' },
  ];

  readonly subjectOptions = [
    { label: 'General Inquiry', value: 'general' },
    { label: 'Order Issue', value: 'order-issue' },
    { label: 'Product Inquiry', value: 'product-inquiry' },
    { label: 'Returns', value: 'returns' },
    { label: 'Wholesale', value: 'wholesale' },
    { label: 'Other', value: 'other' },
  ];

  readonly responseFeatures = [
    'Response within 24 hours',
    'Typical reply in under 4hr',
    'Dedicated account team',
  ];

  submitForm(): void {
    if (!this.name || !this.email || !this.message) {
      this.submitError.set('Please fill in all required fields.');
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);

    this.inquiryService.createContactInquiry({
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message,
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitted.set(true);
      },
      error: () => {
        this.submitting.set(false);
        this.submitError.set('Failed to send message. Please try again.');
      },
    });
  }
}
