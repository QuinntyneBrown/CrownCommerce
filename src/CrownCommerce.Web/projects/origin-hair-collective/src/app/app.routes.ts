import { Routes } from '@angular/router';
import { MainLayout } from './components/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home').then(m => m.HomePage),
      },
      {
        path: 'shop',
        loadComponent: () => import('features').then(m => m.ShopPage),
      },
      {
        path: 'product/:id',
        loadComponent: () => import('features').then(m => m.ProductDetailPage),
      },
      {
        path: 'cart',
        loadComponent: () => import('features').then(m => m.CartPage),
      },
      {
        path: 'checkout',
        loadComponent: () => import('features').then(m => m.CheckoutPage),
      },
      {
        path: 'contact',
        loadComponent: () => import('features').then(m => m.ContactPage),
      },
      {
        path: 'faq',
        loadComponent: () => import('features').then(m => m.FaqPage),
      },
      {
        path: 'about',
        loadComponent: () => import('features').then(m => m.OurStoryPage),
      },
      {
        path: 'hair-care-guide',
        loadComponent: () => import('features').then(m => m.HairCareGuidePage),
      },
      {
        path: 'shipping-info',
        loadComponent: () => import('features').then(m => m.ShippingInfoPage),
      },
      {
        path: 'returns',
        loadComponent: () => import('features').then(m => m.ReturnsPage),
      },
      {
        path: 'bundles',
        loadComponent: () => import('features').then(m => m.BundlesPage),
      },
      {
        path: 'closures',
        loadComponent: () => import('features').then(m => m.ClosuresPage),
      },
      {
        path: 'frontals',
        loadComponent: () => import('features').then(m => m.FrontalsPage),
      },
      {
        path: 'bundle-deals',
        loadComponent: () => import('features').then(m => m.BundleDealsPage),
      },
      {
        path: 'wholesale',
        loadComponent: () => import('features').then(m => m.WholesalePage),
      },
      {
        path: 'ambassador',
        loadComponent: () => import('features').then(m => m.AmbassadorPage),
      },
      {
        path: '**',
        loadComponent: () => import('features').then(m => m.NotFoundPage),
      },
    ],
  },
];
