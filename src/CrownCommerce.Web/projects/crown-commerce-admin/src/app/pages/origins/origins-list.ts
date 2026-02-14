import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CatalogService, type HairOrigin } from 'api';

@Component({
  selector: 'app-origins-list',
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './origins-list.html',
  styleUrl: './origins-list.scss',
})
export class OriginsListPage implements OnInit {
  private readonly catalogService = inject(CatalogService);
  readonly origins = signal<HairOrigin[]>([]);
  displayedColumns = ['country', 'region', 'description', 'actions'];

  ngOnInit() {
    this.catalogService.getOrigins().subscribe({
      next: (data) => this.origins.set(data),
    });
  }
}
