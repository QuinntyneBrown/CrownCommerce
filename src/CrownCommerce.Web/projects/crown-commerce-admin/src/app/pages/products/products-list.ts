import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CatalogService, type HairProduct } from 'api';

@Component({
  selector: 'app-products-list',
  imports: [
    RouterLink,
    CurrencyPipe,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
})
export class ProductsListPage implements OnInit {
  private readonly catalogService = inject(CatalogService);
  readonly products = signal<HairProduct[]>([]);
  displayedColumns = ['name', 'type', 'texture', 'length', 'price', 'origin', 'actions'];

  ngOnInit() {
    this.catalogService.getProducts().subscribe({
      next: (data) => this.products.set(data),
    });
  }
}
