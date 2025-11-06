import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

import { IssueService } from '../../services/issue.service';
import { Issue, IssueStatus } from '../../models/issue.model';

@Component({
  selector: 'app-issues-list',
  templateUrl: './issues-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DatePipe, RouterLink],
})
export class IssuesListComponent {
  private issueService = inject(IssueService);
  private route = inject(ActivatedRoute);

  private statusParam = toSignal(
    this.route.paramMap.pipe(map(params => params.get('status')))
  );

  constructor() {
    this.issueService.loadIssues().subscribe();
  }

  title = computed(() => {
    const status = this.statusParam();
    switch (status) {
      case 'pending': return 'Pending Issues';
      case 'in-progress': return 'In Progress Issues';
      case 'resolved': return 'Resolved Issues';
      default: return 'All Issues';
    }
  });

  filteredIssues = computed(() => {
    const issues = this.issueService.allIssues();
    const status = this.statusParam();

    if (!status || status === 'all') {
      return issues;
    }

    const filterStatus = status.replace('-', ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
        
    return issues.filter(issue => issue.status === filterStatus);
  });
  
  getStatusColor(status: IssueStatus): string {
    switch (status) {
      case 'Pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'In Progress':
        return 'text-blue-600 dark:text-blue-400';
      case 'Resolved':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  }
}
