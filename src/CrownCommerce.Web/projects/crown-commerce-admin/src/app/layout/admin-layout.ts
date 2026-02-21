import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

interface NavItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-admin-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatIconModule,
    MatIconButton,
    MatToolbarModule,
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {
  navItems: NavItem[] = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'inventory_2', label: 'Products', route: '/products' },
    { icon: 'public', label: 'Origins', route: '/origins' },
    { icon: 'mail', label: 'Inquiries', route: '/inquiries' },
    { icon: 'star', label: 'Testimonials', route: '/testimonials' },
    { icon: 'group', label: 'Subscribers', route: '/subscribers' },
    { icon: 'people', label: 'Employees', route: '/employees' },
    { icon: 'calendar_month', label: 'Schedule', route: '/schedule' },
    { icon: 'event', label: 'Book Meeting', route: '/meetings/new' },
    { icon: 'forum', label: 'Conversations', route: '/conversations' },
    { icon: 'view_carousel', label: 'Hero Content', route: '/hero-content' },
    { icon: 'verified', label: 'Trust Bar', route: '/trust-bar' },
    { icon: 'admin_panel_settings', label: 'Users', route: '/users' },
    { icon: 'contacts', label: 'Customers', route: '/customers' },
    { icon: 'trending_up', label: 'Leads', route: '/leads' },
    { icon: 'photo_library', label: 'Gallery', route: '/gallery' },
    { icon: 'quiz', label: 'FAQs', route: '/faqs' },
    { icon: 'article', label: 'Pages', route: '/content-pages' },
    { icon: 'campaign', label: 'Campaigns', route: '/campaigns' },
    { icon: 'receipt_long', label: 'Orders', route: '/orders' },
  ];
}
