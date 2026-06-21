import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `
    <div class="spinner-container">
      <mat-spinner [diameter]="diameter" />
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px 0;
    }
  `],
})
export class LoadingSpinnerComponent {
  @Input({ required: true }) loading = false;
  @Input() diameter = 40;
}
