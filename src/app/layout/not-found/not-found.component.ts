import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  template: `
    <div class="not-found">
      <h1>404</h1>
      <p>P&aacute;gina no encontrada</p>
      <button mat-raised-button color="primary" routerLink="/dashboard">Volver al inicio</button>
    </div>
  `,
  styles: [`
    .not-found { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 60vh; gap: 16px; }
    .not-found h1 { font-size: 72px; margin: 0; color: #3f51b5; }
    .not-found p { font-size: 18px; color: #666; }
  `],
})
export class NotFoundComponent {}
