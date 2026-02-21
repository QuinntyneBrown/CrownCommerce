import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  DividerComponent,
  ButtonComponent,
  StepCardComponent,
  ChecklistItemComponent,
  LoadingSpinnerComponent,
  ErrorStateComponent,
} from 'components';
import { ContentService } from 'api';
import type { HairCareGuide } from 'api';

@Component({
  selector: 'feat-hair-care-guide-page',
  standalone: true,
  imports: [
    DividerComponent,
    ButtonComponent,
    StepCardComponent,
    ChecklistItemComponent,
    LoadingSpinnerComponent,
    ErrorStateComponent,
  ],
  templateUrl: './hair-care-guide-page.html',
  styleUrl: './hair-care-guide-page.scss',
})
export class HairCareGuidePage implements OnInit {
  private readonly contentService = inject(ContentService);
  private readonly router = inject(Router);

  readonly guide = signal<HairCareGuide | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.contentService.getHairCareGuide().subscribe({
      next: (guide) => {
        this.guide.set(guide);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load hair care guide.');
        this.loading.set(false);
      },
    });
  }

  navigateToContact(): void {
    this.router.navigate(['/contact']);
  }
}
