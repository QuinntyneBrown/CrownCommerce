import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InquiryService, type Inquiry } from 'api';

@Component({
  selector: 'app-inquiries-list',
  imports: [
    DatePipe,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './inquiries-list.html',
  styleUrl: './inquiries-list.scss',
})
export class InquiriesListPage implements OnInit {
  private readonly inquiryService = inject(InquiryService);
  readonly inquiries = signal<Inquiry[]>([]);
  displayedColumns = ['name', 'email', 'phone', 'message', 'date', 'actions'];

  ngOnInit() {
    this.inquiryService.getInquiries().subscribe({
      next: (data) => this.inquiries.set(data),
    });
  }
}
