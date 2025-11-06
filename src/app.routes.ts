import { Routes } from '@angular/router';
import { UserLayoutComponent } from './components/user/user-layout.component';
import { AdminLayoutComponent } from './components/admin/admin-layout.component';
import { LandingComponent } from './components/user/landing.component';
import { IssueReportComponent } from './components/user/issue-report.component';
import { StatusComponent } from './components/user/status.component';
import { HelpSupportComponent } from './components/user/help-support.component';
import { IssuesListComponent } from './components/admin/issues-list.component';
import { IssueDetailComponent } from './components/admin/issue-detail.component';
import { NotifyAuthorityComponent } from './components/admin/notify-authority.component';

export const APP_ROUTES: Routes = [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
  {
    path: 'user',
    component: UserLayoutComponent,
    children: [
      { path: '', component: LandingComponent },
      { path: 'issue-report', component: IssueReportComponent },
      { path: 'status', component: StatusComponent },
      { path: 'help-support', component: HelpSupportComponent },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'issues/all', pathMatch: 'full' },
      { path: 'issues/:status', component: IssuesListComponent },
      { path: 'issue/:id', component: IssueDetailComponent },
      { path: 'notify-authority', component: NotifyAuthorityComponent },
    ],
  },
  { path: '**', redirectTo: 'user' },
];
