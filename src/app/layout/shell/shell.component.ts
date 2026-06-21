import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthState } from '../../core/auth/auth.state';
import { AuthService } from '../../core/auth/auth.service';
import { CompanyConfigService } from '../../core/api/company-config.service';
import { MenusService } from '../../core/api/menus.service';
import { Menu } from '../../core/auth/auth.types';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent implements OnInit {
  readonly authState = inject(AuthState);
  private readonly authService = inject(AuthService);
  private readonly companyConfig = inject(CompanyConfigService);
  private readonly menusService = inject(MenusService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly isMobile = signal(false);

  ngOnInit(): void {
    this.companyConfig.load();
    this.loadMenus();
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait]).subscribe((result) => {
      this.isMobile.set(result.matches);
    });
  }

  private loadMenus(): void {
    this.menusService.getMyMenus().subscribe({
      next: (menus) => this.authState.menus.set(menus as Menu[]),
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
