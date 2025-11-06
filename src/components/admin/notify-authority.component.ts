import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { IssueService } from '../../services/issue.service';

@Component({
  selector: 'app-notify-authority',
  templateUrl: './notify-authority.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, CommonModule],
})
export class NotifyAuthorityComponent {
  private issueService = inject(IssueService);

  issues = this.issueService.allIssues;
  departments = ['Municipality', 'Water Board', 'Health Department', 'Electrical Department'];

  selectedIssueId = signal('');
  selectedDepartment = signal('');
  message = signal('');
  notificationSent = signal(false);

  constructor() {
    this.issueService.loadIssues().subscribe();
  }

  sendNotification() {
    if (this.selectedIssueId() && this.selectedDepartment() && this.message()) {
      // Logic to send notification would go here using an HTTP call to the backend
      console.log('Sending notification:', {
        issueId: this.selectedIssueId(),
        department: this.selectedDepartment(),
        message: this.message(),
      });
      this.notificationSent.set(true);
      
      // Reset form after a delay
      setTimeout(() => {
        this.notificationSent.set(false);
        this.selectedIssueId.set('');
        this.selectedDepartment.set('');
        this.message.set('');
      }, 3000);
    }
  }
}
