import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ContentService, type Testimonial } from 'api';

@Component({
  selector: 'app-testimonials-list',
  imports: [
    DatePipe,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './testimonials-list.html',
  styleUrl: './testimonials-list.scss',
})
export class TestimonialsListPage implements OnInit {
  private readonly contentService = inject(ContentService);
  readonly testimonials = signal<Testimonial[]>([]);
  displayedColumns = ['customer', 'rating', 'review', 'date', 'actions'];

  ngOnInit() {
    this.contentService.getTestimonials().subscribe({
      next: (data) => this.testimonials.set(data),
    });
  }
}
