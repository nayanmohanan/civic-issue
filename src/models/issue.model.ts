export type IssueStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  mediaUrl?: string;
  mediaFileName?: string;
  status: IssueStatus;
  reporter: string;
  reportedDate: string; // Changed from Date to string
  remarks?: string;
}
