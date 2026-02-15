import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SchedulingService, type Employee } from 'api';

export interface MeetingDialogData {
  meetingId: string;
  title: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  location?: string;
}

@Component({
  selector: 'app-new-meeting-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './new-meeting-dialog.html',
  styleUrl: './new-meeting-dialog.scss',
})
export class NewMeetingDialog {
  private readonly dialogRef = inject(MatDialogRef<NewMeetingDialog>);
  private readonly schedulingService = inject(SchedulingService);
  private readonly data = inject<MeetingDialogData | null>(MAT_DIALOG_DATA, { optional: true });

  readonly isEditMode = !!this.data?.meetingId;
  readonly title = signal(this.data?.title ?? '');
  readonly description = signal(this.data?.description ?? '');
  readonly date = signal<Date | null>(this.data?.date ?? null);
  readonly startTime = signal(this.data?.startTime ?? '09:00');
  readonly endTime = signal(this.data?.endTime ?? '10:00');
  readonly location = signal(this.data?.location ?? '');
  readonly isVirtual = signal(false);
  readonly selectedAttendees = signal<string[]>([]);
  readonly isSubmitting = signal(false);

  readonly employees = signal<Employee[]>([]);
  private currentEmployeeId = '';

  constructor() {
    this.schedulingService.getCurrentEmployee().subscribe((employee) => {
      this.currentEmployeeId = employee.id;
    });
    this.schedulingService.getEmployees().subscribe((employees) => {
      this.employees.set(employees);
    });
  }

  onSubmit(): void {
    const dateVal = this.date();
    if (!this.title().trim() || !dateVal) return;

    this.isSubmitting.set(true);

    const [startH, startM] = this.startTime().split(':').map(Number);
    const [endH, endM] = this.endTime().split(':').map(Number);

    const startDate = new Date(dateVal);
    startDate.setHours(startH, startM, 0, 0);

    const endDate = new Date(dateVal);
    endDate.setHours(endH, endM, 0, 0);

    if (this.isEditMode) {
      this.schedulingService
        .updateMeeting(this.data!.meetingId, {
          title: this.title().trim(),
          description: this.description().trim() || undefined,
          startTimeUtc: startDate.toISOString(),
          endTimeUtc: endDate.toISOString(),
          location: this.location().trim() || undefined,
        })
        .subscribe({
          next: (meeting) => this.dialogRef.close(meeting),
          error: () => this.isSubmitting.set(false),
        });
    } else {
      this.schedulingService
        .createMeeting({
          title: this.title().trim(),
          description: this.description().trim() || undefined,
          startTimeUtc: startDate.toISOString(),
          endTimeUtc: endDate.toISOString(),
          location: this.isVirtual() ? undefined : (this.location().trim() || undefined),
          isVirtual: this.isVirtual(),
          organizerId: this.currentEmployeeId,
          attendeeEmployeeIds: this.selectedAttendees(),
        })
        .subscribe({
          next: (meeting) => this.dialogRef.close(meeting),
          error: () => this.isSubmitting.set(false),
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
