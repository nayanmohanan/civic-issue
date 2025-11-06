import { ChangeDetectionStrategy, Component, computed, inject, signal, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';
import { IssueService } from '../../services/issue.service';
import { IssueStatus } from '../../models/issue.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DatePipe, RouterLink, FormsModule],
})
export class IssueDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private issueService = inject(IssueService);

  issue = toSignal(
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id) {
          return of(undefined);
        }
        return this.issueService.getIssueById(id);
      })
    )
  );
  
  newStatus = signal<IssueStatus>('Pending');
  newRemark = signal('');
  
  constructor() {
    effect(() => {
      const currentIssue = this.issue();
      if (currentIssue) {
        this.newStatus.set(currentIssue.status);
        this.newRemark.set(currentIssue.remarks ?? '');
      }
    });
  }

  saveChanges() {
    const currentIssue = this.issue();
    if (currentIssue) {
      this.issueService.updateIssue(currentIssue.id, this.newStatus(), this.newRemark())
        .subscribe(() => {
          this.router.navigate(['/admin/issues/all']);
        });
    }
  }

  getStatusColor(status: IssueStatus): string {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
      case 'Resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  }
}
