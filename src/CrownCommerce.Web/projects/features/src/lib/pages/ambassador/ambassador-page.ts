import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  DividerComponent,
  ButtonComponent,
  BenefitCardComponent,
  StepCardComponent,
  FormInputComponent,
  FormTextareaComponent,
  FormSelectComponent,
  LoadingSpinnerComponent,
  ErrorStateComponent,
} from 'components';
import { AmbassadorService } from 'api';
import type { AmbassadorProgram } from 'api';

@Component({
  selector: 'feat-ambassador-page',
  standalone: true,
  imports: [
    FormsModule,
    DividerComponent,
    ButtonComponent,
    BenefitCardComponent,
    StepCardComponent,
    FormInputComponent,
    FormTextareaComponent,
    FormSelectComponent,
    LoadingSpinnerComponent,
    ErrorStateComponent,
  ],
  templateUrl: './ambassador-page.html',
  styleUrl: './ambassador-page.scss',
})
export class AmbassadorPage implements OnInit {
  private readonly ambassadorService = inject(AmbassadorService);

  readonly program = signal<AmbassadorProgram | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly submitting = signal(false);
  readonly submitted = signal(false);
  readonly submitError = signal<string | null>(null);

  fullName = '';
  email = '';
  phone = '';
  instagramHandle = '';
  tiktokHandle = '';
  followerCount = '';
  whyJoin = '';

  readonly followerOptions = [
    { label: 'Select range', value: '' },
    { label: '1K - 5K', value: '1K-5K' },
    { label: '5K - 10K', value: '5K-10K' },
    { label: '10K - 50K', value: '10K-50K' },
    { label: '50K - 100K', value: '50K-100K' },
    { label: '100K+', value: '100K+' },
  ];

  ngOnInit(): void {
    this.ambassadorService.getProgramInfo().subscribe({
      next: (program) => {
        this.program.set(program);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load ambassador program information.');
        this.loading.set(false);
      },
    });
  }

  applyNow(): void {
    if (!this.fullName || !this.email || !this.instagramHandle || !this.whyJoin) {
      this.submitError.set('Please fill in all required fields.');
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);

    this.ambassadorService.applyForProgram({
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      instagramHandle: this.instagramHandle,
      tiktokHandle: this.tiktokHandle || undefined,
      followerCount: this.followerCount,
      whyJoin: this.whyJoin,
    }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitted.set(true);
      },
      error: () => {
        this.submitting.set(false);
        this.submitError.set('Failed to submit application. Please try again.');
      },
    });
  }

  scrollToApply(): void {
    document.querySelector('.ambassador__apply')?.scrollIntoView({ behavior: 'smooth' });
  }
}
