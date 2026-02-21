import { Component, inject, OnInit, signal } from '@angular/core';
import {
  DividerComponent,
  PolicyCardComponent,
  StepCardComponent,
  LoadingSpinnerComponent,
  ErrorStateComponent,
} from 'components';
import { ContentService } from 'api';
import type { ReturnsPolicy } from 'api';

@Component({
  selector: 'feat-returns-page',
  standalone: true,
  imports: [
    DividerComponent,
    PolicyCardComponent,
    StepCardComponent,
    LoadingSpinnerComponent,
    ErrorStateComponent,
  ],
  templateUrl: './returns-page.html',
  styleUrl: './returns-page.scss',
})
export class ReturnsPage implements OnInit {
  private readonly contentService = inject(ContentService);

  readonly policy = signal<ReturnsPolicy | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.contentService.getReturnsPolicy().subscribe({
      next: (policy) => {
        this.policy.set(policy);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load returns policy.');
        this.loading.set(false);
      },
    });
  }
}
