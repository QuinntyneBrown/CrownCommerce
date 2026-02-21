import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  AccordionItemComponent,
  ButtonComponent,
  LoadingSpinnerComponent,
  ErrorStateComponent,
} from 'components';
import { ContentService } from 'api';
import type { FaqItem } from 'api';

@Component({
  selector: 'feat-faq-page',
  standalone: true,
  imports: [
    AccordionItemComponent,
    ButtonComponent,
    LoadingSpinnerComponent,
    ErrorStateComponent,
  ],
  templateUrl: './faq-page.html',
  styleUrl: './faq-page.scss',
})
export class FaqPage implements OnInit {
  private readonly contentService = inject(ContentService);
  private readonly router = inject(Router);

  readonly faqs = signal<FaqItem[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly expandedIds = signal<Set<string>>(new Set());

  ngOnInit(): void {
    this.contentService.getFaqs().subscribe({
      next: (faqs) => {
        this.faqs.set(faqs);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load FAQs.');
        this.loading.set(false);
      },
    });
  }

  toggle(id: string): void {
    this.expandedIds.update(set => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  isExpanded(id: string): boolean {
    return this.expandedIds().has(id);
  }

  navigateToContact(): void {
    this.router.navigate(['/contact']);
  }
}
