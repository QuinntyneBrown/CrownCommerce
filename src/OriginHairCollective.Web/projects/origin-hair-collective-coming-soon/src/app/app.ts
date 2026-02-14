import { Component, inject, signal } from '@angular/core';
import {
  LogoComponent,
  DividerComponent,
  BadgeComponent,
  SocialIconsComponent,
  EmailSignupComponent,
  SocialLink,
} from 'components';
import { NewsletterService } from 'api';

@Component({
  selector: 'app-root',
  imports: [
    LogoComponent,
    DividerComponent,
    BadgeComponent,
    SocialIconsComponent,
    EmailSignupComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly newsletterService = inject(NewsletterService);
  protected readonly submitStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

  protected readonly socialLinks: SocialLink[] = [
    { platform: 'instagram', href: 'https://instagram.com/originhaircollective' },
    { platform: 'email', href: 'mailto:hello@originhaircollective.com' },
  ];

  onEmailSubmit(email: string): void {
    this.submitStatus.set('loading');
    this.newsletterService.subscribe({ email, tags: ['origin-coming-soon'] }).subscribe({
      next: () => this.submitStatus.set('success'),
      error: () => this.submitStatus.set('error'),
    });
  }
}
