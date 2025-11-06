import { Injectable, signal, computed, effect } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Issue, IssueStatus } from '../models/issue.model';

// Mock data to start with if local storage is empty
const MOCK_ISSUES: Issue[] = [
    {
      id: 'IS-1',
      title: 'Large Pothole on Main St',
      description: 'There is a very large and dangerous pothole in the middle of Main Street, right in front of the public library. It has already caused a flat tire on my car.',
      location: 'Main Street',
      status: 'Pending',
      reporter: 'Alice Johnson',
      reportedDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
      mediaFileName: 'pothole.jpg'
    },
    {
      id: 'IS-2',
      title: 'Flickering Streetlight at City Park',
      description: 'The streetlight at the main entrance of City Park has been flickering for the past week. It\'s a safety concern for people visiting the park in the evening.',
      location: 'City Park',
      status: 'In Progress',
      reporter: 'Bob Williams',
      reportedDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
      remarks: 'Electrical department has been notified and a crew is scheduled to inspect it this week.'
    },
    {
      id: 'IS-3',
      title: 'Overflowing Trash Can',
      description: 'The trash can near the bus stop on Oak Avenue is constantly overflowing. It\'s attracting pests and creating a mess.',
      location: 'Oak Avenue',
      status: 'Resolved',
      reporter: 'Charlie Brown',
      reportedDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
      remarks: 'Sanitation crew cleared the can and has added an additional pickup to their route for this location.'
    }
  ];

@Injectable({ providedIn: 'root' })
export class IssueService {
  private readonly STORAGE_KEY = 'complaint_portal_issues';
  private readonly issues = signal<Issue[]>([]);

  allIssues = computed(() => this.issues());

  constructor() {
    this.loadIssuesFromStorage();
    // Effect to save to local storage whenever issues change
    effect(() => {
      this.saveIssuesToStorage(this.issues());
    });
  }

  private loadIssuesFromStorage(): void {
    try {
      const storedIssues = localStorage.getItem(this.STORAGE_KEY);
      if (storedIssues) {
        this.issues.set(JSON.parse(storedIssues));
      } else {
        this.issues.set(MOCK_ISSUES);
        this.saveIssuesToStorage(MOCK_ISSUES);
      }
    } catch (e) {
      console.error('Error reading from local storage', e);
      this.issues.set(MOCK_ISSUES);
    }
  }

  private saveIssuesToStorage(issues: Issue[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(issues));
    } catch (e) {
      console.error('Error writing to local storage', e);
    }
  }

  // This method is kept for components that expect an observable to trigger loading.
  loadIssues(): Observable<Issue[]> {
    this.loadIssuesFromStorage();
    return of(this.issues());
  }

  getIssueById(id: string): Observable<Issue | undefined> {
    const issue = this.issues().find(i => i.id === id);
    return of(issue);
  }
  
  addIssue(issueData: { title: string; description: string; location: string; mediaFile?: File }): Observable<Issue> {
    const newIssue: Issue = {
        id: `IS-${Date.now()}`,
        title: issueData.title,
        description: issueData.description,
        location: issueData.location,
        mediaFileName: issueData.mediaFile?.name,
        // In a real app, mediaFile would be uploaded and a URL returned.
        // We will just store the filename for this mock service.
        status: 'Pending',
        reporter: 'Current User', // Hardcoded for simplicity
        reportedDate: new Date().toISOString(),
    };

    this.issues.update(issues => [newIssue, ...issues]); // Add new issues to the top
    
    return of(newIssue);
  }

  updateIssue(id: string, status: IssueStatus, remarks: string): Observable<Issue> {
    let updatedIssue: Issue | undefined;
    this.issues.update(issues => 
        issues.map(issue => {
            if (issue.id === id) {
                updatedIssue = { ...issue, status, remarks };
                return updatedIssue;
            }
            return issue;
        })
    );

    if (updatedIssue) {
        return of(updatedIssue);
    } else {
        return throwError(() => new Error('Failed to update issue: not found'));
    }
  }
}