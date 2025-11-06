import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeToggleComponent } from '../shared/theme-toggle.component';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ThemeToggleComponent],
})
export class UserLayoutComponent {}
