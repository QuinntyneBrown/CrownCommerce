import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { SchedulingService } from 'api';
import { map } from 'rxjs';
import { TIME_ZONES, type Meeting, type ActivityItem, type TimeZoneCard } from '../../data/mock-data';

const MEETING_COLORS = ['#C9A052', '#B8816B', '#2E7D32', '#E65100', '#1565C0', '#8B6914'];
const ACTIVITY_COLORS: Record<string, string> = { message: '#C9A052', meeting: '#B8816B', task: '#2E7D32', file: '#E65100' };

@Component({
  selector: 'app-home',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage {
  private readonly schedulingService = inject(SchedulingService);
  private readonly now = new Date();

  readonly greeting = computed(() => {
    const hour = this.now.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  });

  readonly todayFormatted = computed(() => {
    return this.now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  });

  readonly timeZones = signal<TimeZoneCard[]>(TIME_ZONES);

  private readonly apiMeetings = toSignal(
    this.schedulingService.getUpcomingMeetings(3).pipe(
      map((meetings) =>
        meetings.map((m, i) => {
          const start = new Date(m.startTimeUtc);
          const end = new Date(m.endTimeUtc);
          return {
            id: i + 1,
            title: m.title,
            startTime: start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            endTime: end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
            date: start.toISOString().split('T')[0],
            color: MEETING_COLORS[i % MEETING_COLORS.length],
            participants: m.attendees.map((a) => ({
              name: a.employeeName,
              initials: a.employeeName.split(' ').map((p) => p[0]?.toUpperCase() ?? '').join('').slice(0, 2),
            })),
            location: m.location ?? undefined,
            isVirtual: m.location === null,
          } as Meeting;
        })
      )
    ),
    { initialValue: [] as Meeting[] }
  );

  readonly upcomingMeetings = computed(() => this.apiMeetings());

  readonly activities = signal<ActivityItem[]>([]);
  readonly hasMoreActivities = signal(false);
  readonly isLoadingMoreActivities = signal(false);
  private readonly activityPageSize = 6;
  private loadedActivityCount = 0;
  private currentEmployeeId = '';

  readonly searchQuery = signal('');
  readonly isSearchOpen = signal(false);

  readonly searchResults = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return { meetings: [] as Meeting[], activities: [] as ActivityItem[] };
    return {
      meetings: (this.apiMeetings() ?? []).filter((m) => m.title.toLowerCase().includes(query)),
      activities: this.activities().filter(
        (a) => a.title.toLowerCase().includes(query) || a.description.toLowerCase().includes(query)
      ),
    };
  });

  constructor() {
    this.schedulingService.getCurrentEmployee().subscribe((emp) => {
      this.currentEmployeeId = emp.id;
      this.loadActivities();
    });
  }

  toggleSearch(): void {
    this.isSearchOpen.update((v) => !v);
    if (!this.isSearchOpen()) {
      this.searchQuery.set('');
    }
  }

  onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  private loadActivities(): void {
    this.schedulingService.getActivityFeed(this.currentEmployeeId, this.activityPageSize).subscribe((items) => {
      this.loadedActivityCount = items.length;
      this.hasMoreActivities.set(items.length >= this.activityPageSize);
      this.activities.set(
        items.map((item, i) => ({
          id: i + 1,
          type: item.type as ActivityItem['type'],
          icon: item.icon,
          title: item.title,
          description: item.description,
          time: this.formatRelativeTime(item.occurredAt),
          color: ACTIVITY_COLORS[item.type] ?? '#6366F1',
        }))
      );
    });
  }

  loadMoreActivities(): void {
    if (this.isLoadingMoreActivities() || !this.currentEmployeeId) return;
    this.isLoadingMoreActivities.set(true);
    this.schedulingService.getActivityFeed(this.currentEmployeeId, this.activityPageSize, this.loadedActivityCount).subscribe({
      next: (items) => {
        const mapped = items.map((item, i) => ({
          id: this.loadedActivityCount + i + 1,
          type: item.type as ActivityItem['type'],
          icon: item.icon,
          title: item.title,
          description: item.description,
          time: this.formatRelativeTime(item.occurredAt),
          color: ACTIVITY_COLORS[item.type] ?? '#6366F1',
        }));
        this.loadedActivityCount += items.length;
        this.hasMoreActivities.set(items.length >= this.activityPageSize);
        this.activities.update((prev) => [...prev, ...mapped]);
        this.isLoadingMoreActivities.set(false);
      },
      error: () => this.isLoadingMoreActivities.set(false),
    });
  }

  getCurrentTime(offset: string): string {
    const utcOffset = parseInt(offset.replace('UTC', ''), 10) || 0;
    const utc = new Date(this.now.getTime() + this.now.getTimezoneOffset() * 60000);
    const local = new Date(utc.getTime() + utcOffset * 3600000);
    return local.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  private formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const diffMs = this.now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }
}
