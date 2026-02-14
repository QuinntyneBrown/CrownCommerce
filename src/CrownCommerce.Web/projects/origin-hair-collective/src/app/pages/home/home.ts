import { Component } from '@angular/core';
import {
  ButtonComponent,
  BadgeComponent,
  SectionHeaderComponent,
  TrustBarItemComponent,
  ProductCardComponent,
  BenefitCardComponent,
  TestimonialCardComponent,
  DividerComponent,
} from 'components';

@Component({
  selector: 'app-home',
  imports: [
    ButtonComponent,
    BadgeComponent,
    SectionHeaderComponent,
    TrustBarItemComponent,
    ProductCardComponent,
    BenefitCardComponent,
    TestimonialCardComponent,
    DividerComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage {
  // SVG icons for lucide icons used in the design
  readonly sparklesIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>`;

  readonly heartIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;

  readonly usersIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;

  readonly trustItems = [
    {
      text: '100% Virgin Hair',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>`,
    },
    {
      text: 'Free Shipping Over $150',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>`,
    },
    {
      text: '30-Day Quality Guarantee',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,
    },
    {
      text: 'Canadian Black-Owned',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    },
  ];

  readonly communityPhotos = [
    { url: 'https://images.unsplash.com/photo-1612041712051-ed5c64a4646f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80', alt: 'Hair style 1' },
    { url: 'https://images.unsplash.com/photo-1583743599150-3b6048ecf084?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80', alt: 'Hair style 2' },
    { url: 'https://images.unsplash.com/photo-1760135119333-bc76583e498a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80', alt: 'Hair style 3' },
    { url: 'https://images.unsplash.com/photo-1631214500115-598fc2cb8d2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80', alt: 'Hair style 4' },
    { url: 'https://images.unsplash.com/photo-1560564066-a3a5cfc81584?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80', alt: 'Hair style 5' },
    { url: 'https://images.unsplash.com/photo-1709971393539-d95f2c0eae43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600&q=80', alt: 'Hair style 6' },
  ];
}
