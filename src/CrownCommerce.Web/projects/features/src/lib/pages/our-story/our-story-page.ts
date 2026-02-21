import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  SectionHeaderComponent,
  DividerComponent,
  ButtonComponent,
  TimelineCardComponent,
  BenefitCardComponent,
  LoadingSpinnerComponent,
  ErrorStateComponent,
} from 'components';
import { ContentService } from 'api';
import type { BrandStory } from 'api';

@Component({
  selector: 'feat-our-story-page',
  standalone: true,
  imports: [
    SectionHeaderComponent,
    DividerComponent,
    ButtonComponent,
    TimelineCardComponent,
    BenefitCardComponent,
    LoadingSpinnerComponent,
    ErrorStateComponent,
  ],
  templateUrl: './our-story-page.html',
  styleUrl: './our-story-page.scss',
})
export class OurStoryPage implements OnInit {
  private readonly contentService = inject(ContentService);
  private readonly router = inject(Router);

  readonly story = signal<BrandStory | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.contentService.getBrandStory().subscribe({
      next: (story) => {
        this.story.set(story);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load our story.');
        this.loading.set(false);
      },
    });
  }

  navigateToShop(): void {
    this.router.navigate(['/shop']);
  }
}
