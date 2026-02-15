import { Component, computed, HostListener, inject, NgZone, OnDestroy, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { API_CONFIG, AuthService, SchedulingService, TeamHubService } from 'api';

interface NavItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-teams-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './teams-layout.html',
  styleUrl: './teams-layout.scss',
})
export class TeamsLayout implements OnDestroy {
  private static readonly IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly authService = inject(AuthService);
  private readonly schedulingService = inject(SchedulingService);
  private readonly teamHub = inject(TeamHubService);
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone);
  private readonly apiBaseUrl = inject(API_CONFIG).baseUrl;
  private currentEmployeeId = '';
  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private isIdle = false;

  readonly userName = signal('');
  readonly userInitials = signal('');
  readonly userRole = signal('');

  private readonly currentEmployee = toSignal(
    this.schedulingService.getCurrentEmployee(),
    { initialValue: null }
  );

  constructor() {
    // Set user info from auth user immediately
    const authUser = this.authService.user();
    if (authUser) {
      this.userName.set(`${authUser.firstName} ${authUser.lastName.charAt(0)}.`);
      this.userInitials.set(`${authUser.firstName.charAt(0)}${authUser.lastName.charAt(0)}`.toUpperCase());
    }

    // Once employee data loads, update with employee info and set presence
    this.schedulingService.getCurrentEmployee().subscribe({
      next: (employee) => {
        this.userName.set(`${employee.firstName} ${employee.lastName.charAt(0)}.`);
        this.userInitials.set(`${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`.toUpperCase());
        this.userRole.set(employee.jobTitle);
        this.currentEmployeeId = employee.id;
        this.schedulingService.updatePresence(employee.id, { presence: 'Online' }).subscribe();
        this.teamHub.connect();
        this.resetIdleTimer();
      },
      error: () => {
        // Fallback to auth user data
        if (authUser) {
          this.userRole.set('Team Member');
        }
      },
    });
  }

  @HostListener('window:beforeunload')
  onBeforeUnload(): void {
    if (!this.currentEmployeeId) return;
    const url = `${this.apiBaseUrl}/api/scheduling/employees/${this.currentEmployeeId}/presence`;
    const body = JSON.stringify({ presence: 'Offline' });
    navigator.sendBeacon(url, new Blob([body], { type: 'application/json' }));
  }

  @HostListener('window:mousemove')
  @HostListener('window:keydown')
  @HostListener('window:click')
  onUserActivity(): void {
    if (!this.currentEmployeeId) return;

    if (this.isIdle) {
      this.isIdle = false;
      this.schedulingService.updatePresence(this.currentEmployeeId, { presence: 'Online' }).subscribe();
      this.teamHub.updatePresence(this.currentEmployeeId, 'Online');
    }

    this.resetIdleTimer();
  }

  ngOnDestroy(): void {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.teamHub.disconnect();
  }

  private resetIdleTimer(): void {
    if (this.idleTimer) clearTimeout(this.idleTimer);

    this.ngZone.runOutsideAngular(() => {
      this.idleTimer = setTimeout(() => {
        if (!this.currentEmployeeId) return;
        this.isIdle = true;
        this.ngZone.run(() => {
          this.schedulingService.updatePresence(this.currentEmployeeId, { presence: 'Away' }).subscribe();
          this.teamHub.updatePresence(this.currentEmployeeId, 'Away');
        });
      }, TeamsLayout.IDLE_TIMEOUT_MS);
    });
  }

  logout(): void {
    if (this.currentEmployeeId) {
      this.schedulingService
        .updatePresence(this.currentEmployeeId, { presence: 'Offline' })
        .subscribe({
          complete: () => {
            this.authService.logout();
            this.router.navigate(['/login']);
          },
          error: () => {
            this.authService.logout();
            this.router.navigate(['/login']);
          },
        });
    } else {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

  readonly navItems: NavItem[] = [
    { icon: 'home', label: 'Home', route: '/home' },
    { icon: 'chat', label: 'Chat', route: '/chat' },
    { icon: 'calendar_month', label: 'Meetings', route: '/meetings' },
    { icon: 'group', label: 'Team', route: '/team' },
  ];

  private readonly breakpoint$ = this.breakpointObserver.observe([
    '(min-width: 1024px)',
    '(min-width: 768px) and (max-width: 1023px)',
  ]);

  private readonly breakpointResult = toSignal(
    this.breakpoint$.pipe(
      map((result) => {
        if (result.breakpoints['(min-width: 1024px)']) return 'desktop';
        if (result.breakpoints['(min-width: 768px) and (max-width: 1023px)']) return 'tablet';
        return 'mobile';
      })
    ),
    { initialValue: 'desktop' as const }
  );

  readonly isDesktop = computed(() => this.breakpointResult() === 'desktop');
  readonly isTablet = computed(() => this.breakpointResult() === 'tablet');
  readonly isMobile = computed(() => this.breakpointResult() === 'mobile');
}
