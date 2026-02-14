import { Component, inject, signal } from '@angular/core';
import {
  LogoComponent,
  DividerComponent,
  CountdownTimerComponent,
  EmailSignupComponent,
} from 'components';
import { NewsletterService } from 'api';

@Component({
  selector: 'app-coming-soon',
  imports: [
    LogoComponent,
    DividerComponent,
    CountdownTimerComponent,
    EmailSignupComponent,
  ],
  templateUrl: './coming-soon.html',
  styleUrl: './coming-soon.scss',
})
export class ComingSoonPage {
  private readonly newsletterService = inject(NewsletterService);
  protected readonly submitStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  readonly launchDate = '2026-09-01T00:00:00';

  onEmailSubmitted(email: string) {
    this.submitStatus.set('loading');
    this.newsletterService.subscribe({ email, tags: ['mane-haus-coming-soon'] }).subscribe({
      next: () => this.submitStatus.set('success'),
      error: () => this.submitStatus.set('error'),
    });
  }
}
