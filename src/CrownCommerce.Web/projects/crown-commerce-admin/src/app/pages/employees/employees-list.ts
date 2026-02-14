import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { SchedulingService, type Employee } from 'api';

type StatusFilter = 'all' | 'Active' | 'Inactive' | 'OnLeave';

@Component({
  selector: 'app-employees-list',
  imports: [
    DatePipe,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatChipsModule,
  ],
  templateUrl: './employees-list.html',
  styleUrl: './employees-list.scss',
})
export class EmployeesListPage implements OnInit {
  private readonly schedulingService = inject(SchedulingService);

  readonly employees = signal<Employee[]>([]);
  readonly selectedStatus = signal<StatusFilter>('all');
  readonly displayedColumns = ['name', 'jobTitle', 'department', 'timeZone', 'status', 'actions'];

  readonly stats = computed(() => {
    const emps = this.employees();
    return [
      { label: 'Total', value: emps.length, icon: 'people', color: 'var(--primary)' },
      { label: 'Active', value: emps.filter(e => e.status === 'Active').length, icon: 'check_circle', color: 'var(--success)' },
      { label: 'On Leave', value: emps.filter(e => e.status === 'OnLeave').length, icon: 'event_busy', color: 'var(--warning)' },
      { label: 'Kenya Team', value: emps.filter(e => e.timeZone === 'Africa/Nairobi').length, icon: 'public', color: 'var(--info)' },
    ];
  });

  readonly filteredEmployees = computed(() => {
    const status = this.selectedStatus();
    if (status === 'all') return this.employees();
    return this.employees().filter(e => e.status === status);
  });

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.schedulingService.getEmployees().subscribe({
      next: (data) => this.employees.set(data),
      error: (err) => console.error('Failed to load employees', err),
    });
  }

  onStatusChange(status: StatusFilter) {
    this.selectedStatus.set(status);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active': return 'chip chip--success';
      case 'Inactive': return 'chip chip--error';
      case 'OnLeave': return 'chip chip--warning';
      default: return 'chip chip--default';
    }
  }

  getTimeZoneLabel(tz: string): string {
    switch (tz) {
      case 'Africa/Nairobi': return 'Kenya (EAT)';
      case 'America/New_York': return 'New York (ET)';
      case 'America/Los_Angeles': return 'Los Angeles (PT)';
      default: return tz;
    }
  }
}
