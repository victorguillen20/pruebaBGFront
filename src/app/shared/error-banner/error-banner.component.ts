import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  template: `
    @if (message) {
      <div class="error-banner">
        <mat-icon>error</mat-icon>
        <span>{{ message }}</span>
        @if (showRetry) {
          <button mat-button color="warn" (click)="retry.emit()">Reintentar</button>
        }
      </div>
    }
  `,
  styles: [`
    .error-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      margin: 16px 0;
      background: #fff3f3;
      border: 1px solid #f44336;
      border-radius: 4px;
      color: #d32f2f;
      font-size: 14px;
    }
  `],
})
export class ErrorBannerComponent {
  @Input() message = '';
  @Input() showRetry = true;
  @Output() retry = new EventEmitter<void>();
}
