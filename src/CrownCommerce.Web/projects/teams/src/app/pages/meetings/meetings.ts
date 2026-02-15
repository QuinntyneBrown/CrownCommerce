import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { SchedulingService, type CalendarEvent } from 'api';
import type { Meeting } from '../../data/mock-data';
import { NewMeetingDialog, type MeetingDialogData } from './new-meeting-dialog';

interface WeekDay {
  date: Date;
  dayName: string;
  dayNumber: number;
  dateStr: string;
  isToday: boolean;
}

const MEETING_COLORS = ['#6366F1', '#FF6B6B', '#22C55E', '#FCD34D', '#06B6D4', '#F97316'];

@Component({
  selector: 'app-meetings',
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './meetings.html',
  styleUrl: './meetings.scss',
})
export class MeetingsPage {
  private readonly schedulingService = inject(SchedulingService);
  private readonly dialog = inject(MatDialog);
  private readonly today = new Date();
  private currentEmployeeId = '';

  readonly selectedDate = signal(this.formatDate(this.today));
  readonly apiMeetings = signal<Meeting[]>([]);
  readonly hasMoreMeetings = signal(false);
  readonly isLoadingMore = signal(false);
  private readonly pageSize = 50;
  private loadedMeetingCount = 0;

  readonly weekDays = computed<WeekDay[]>(() => {
    const start = new Date(this.today);
    start.setDate(start.getDate() - start.getDay() + 1); // Monday
    const days: WeekDay[] = [];
    const todayStr = this.formatDate(this.today);

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      days.push({
        date: d,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: d.getDate(),
        dateStr: this.formatDate(d),
        isToday: this.formatDate(d) === todayStr,
      });
    }
    return days;
  });

  readonly filteredMeetings = computed(() => this.apiMeetings());

  readonly currentMonthYear = computed(() => {
    const d = new Date(this.selectedDate());
    return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  });

  constructor() {
    this.schedulingService.getCurrentEmployee().subscribe((emp) => {
      this.currentEmployeeId = emp.id;
    });

    effect(() => {
      const dateStr = this.selectedDate();
      if (!dateStr) return;
      const startUtc = `${dateStr}T00:00:00Z`;
      const endUtc = `${dateStr}T23:59:59Z`;

      this.schedulingService.getCalendarEvents(startUtc, endUtc, undefined, 0, this.pageSize).subscribe((events) => {
        this.loadedMeetingCount = events.length;
        this.hasMoreMeetings.set(events.length >= this.pageSize);
        this.apiMeetings.set(events.map((e, i) => this.mapEventToMeeting(e, i)));
      });
    });
  }

  selectDate(dateStr: string) {
    this.selectedDate.set(dateStr);
  }

  openNewMeetingDialog(): void {
    const dialogRef = this.dialog.open(NewMeetingDialog, { width: '480px' });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.refreshMeetings();
    });
  }

  respondToMeeting(meeting: Meeting, response: 'Accepted' | 'Declined'): void {
    if (!meeting.apiId || !this.currentEmployeeId) return;

    this.schedulingService
      .respondToMeeting(meeting.apiId, this.currentEmployeeId, response)
      .subscribe(() => {
        this.apiMeetings.update((meetings) =>
          meetings.map((m) => (m.id === meeting.id ? { ...m, rsvpStatus: response } : m))
        );
      });
  }

  editMeeting(meeting: Meeting): void {
    if (!meeting.apiId) return;

    const [startH, startM] = this.parseTime(meeting.startTime);
    const [endH, endM] = this.parseTime(meeting.endTime);

    const data: MeetingDialogData = {
      meetingId: meeting.apiId,
      title: meeting.title,
      date: new Date(meeting.date),
      startTime: `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}`,
      endTime: `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`,
      location: meeting.location,
    };

    const dialogRef = this.dialog.open(NewMeetingDialog, { width: '480px', data });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.refreshMeetings();
    });
  }

  cancelMeeting(meeting: Meeting): void {
    if (!meeting.apiId || !confirm(`Cancel "${meeting.title}"?`)) return;

    this.schedulingService.cancelMeeting(meeting.apiId).subscribe(() => {
      this.apiMeetings.update((meetings) => meetings.filter((m) => m.id !== meeting.id));
    });
  }

  joinMeeting(meeting: Meeting): void {
    if (!meeting.joinUrl) return;
    window.open(meeting.joinUrl, '_blank', 'width=1024,height=768,menubar=no,toolbar=no');
  }

  exportMeetingToICal(meeting: Meeting): void {
    if (!meeting.apiId) return;

    this.schedulingService.exportMeetingToICal(meeting.apiId).subscribe((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${meeting.title.replace(/\s+/g, '_')}.ics`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  loadMoreMeetings(): void {
    if (this.isLoadingMore()) return;
    const dateStr = this.selectedDate();
    if (!dateStr) return;

    this.isLoadingMore.set(true);
    const startUtc = `${dateStr}T00:00:00Z`;
    const endUtc = `${dateStr}T23:59:59Z`;

    this.schedulingService.getCalendarEvents(startUtc, endUtc, undefined, this.loadedMeetingCount, this.pageSize).subscribe({
      next: (events) => {
        const offset = this.loadedMeetingCount;
        const more = events.map((e, i) => this.mapEventToMeeting(e, offset + i));
        this.loadedMeetingCount += events.length;
        this.hasMoreMeetings.set(events.length >= this.pageSize);
        this.apiMeetings.update((prev) => [...prev, ...more]);
        this.isLoadingMore.set(false);
      },
      error: () => this.isLoadingMore.set(false),
    });
  }

  private refreshMeetings(): void {
    const current = this.selectedDate();
    this.selectedDate.set('');
    this.selectedDate.set(current);
  }

  private parseTime(timeStr: string): [number, number] {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return [0, 0];
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toUpperCase();
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return [hours, minutes];
  }

  private formatDate(d: Date): string {
    return d.toISOString().split('T')[0];
  }

  private mapEventToMeeting(event: CalendarEvent, index: number): Meeting {
    const start = new Date(event.startTimeUtc);
    const end = new Date(event.endTimeUtc);
    return {
      id: index + 1,
      title: event.title,
      startTime: start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      endTime: end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      date: this.formatDate(start),
      color: MEETING_COLORS[index % MEETING_COLORS.length],
      participants: [{ name: event.organizerName, initials: this.getInitials(event.organizerName) }],
      location: event.location ?? undefined,
      isVirtual: event.joinUrl !== null,
      joinUrl: event.joinUrl ?? undefined,
      apiId: event.id,
      rsvpStatus: 'Pending' as const,
    };
  }

  private getInitials(name: string): string {
    return name.split(' ').map((p) => p[0]?.toUpperCase() ?? '').join('').slice(0, 2);
  }
}
