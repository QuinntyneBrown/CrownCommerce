import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SchedulingService, type Employee } from 'api';

const CHANNEL_ICONS = ['tag', 'forum', 'campaign', 'code', 'bug_report', 'design_services', 'science', 'rocket_launch'];

@Component({
  selector: 'app-new-channel-dialog',
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './new-channel-dialog.html',
  styleUrl: './new-channel-dialog.scss',
})
export class NewChannelDialog {
  private readonly dialogRef = inject(MatDialogRef<NewChannelDialog>);
  private readonly schedulingService = inject(SchedulingService);

  readonly channelName = signal('');
  readonly channelType = signal('Public');
  readonly channelIcon = signal('tag');
  readonly selectedMembers = signal<string[]>([]);
  readonly isSubmitting = signal(false);

  readonly employees = signal<Employee[]>([]);
  readonly icons = CHANNEL_ICONS;
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
    if (!this.channelName().trim()) return;

    this.isSubmitting.set(true);

    this.schedulingService
      .createChannel({
        name: this.channelName().trim(),
        icon: this.channelIcon(),
        channelType: this.channelType(),
        createdByEmployeeId: this.currentEmployeeId,
        participantEmployeeIds: this.selectedMembers(),
      })
      .subscribe({
        next: (channel) => this.dialogRef.close(channel),
        error: () => this.isSubmitting.set(false),
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
