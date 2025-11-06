import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IssueService } from '../../services/issue.service';
import { ModalComponent } from '../shared/modal.component';

@Component({
  selector: 'app-issue-report',
  templateUrl: './issue-report.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, CommonModule, ModalComponent],
})
export class IssueReportComponent {
  // FIX: Explicitly typed `fb` as `FormBuilder` to resolve a type inference issue with `inject`.
  private fb: FormBuilder = inject(FormBuilder);
  private issueService = inject(IssueService);
  private router = inject(Router);

  locations = ['Main Street', 'Oak Avenue', 'City Park', 'Downtown Plaza', 'Riverfront'];
  selectedFile = signal<File | null>(null);
  showPreview = signal(false);
  showSuccessModal = signal(false);

  issueForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    location: ['', Validators.required],
    media: [null],
  });

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile.set(input.files[0]);
    }
  }

  togglePreview(): void {
    if (this.issueForm.valid) {
      this.showPreview.update(v => !v);
    } else {
      this.issueForm.markAllAsTouched();
    }
  }

  onSubmit(): void {
    if (this.issueForm.valid) {
      const formValue = this.issueForm.value;
      this.issueService.addIssue({
        title: formValue.title!,
        description: formValue.description!,
        location: formValue.location!,
        mediaFile: this.selectedFile() ?? undefined
      }).subscribe(() => {
        this.showSuccessModal.set(true);
      });
    }
  }

  closeModalAndNavigate(): void {
    this.showSuccessModal.set(false);
    this.router.navigate(['/user/status']);
  }
}
