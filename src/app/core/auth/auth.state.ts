import { Injectable, signal, computed } from '@angular/core';
import { User, Menu } from './auth.types';

@Injectable({ providedIn: 'root' })
export class AuthState {
  readonly currentUser = signal<User | null>(null);
  readonly menus = signal<Menu[]>([]);
  readonly role = computed(() => this.currentUser()?.role ?? null);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.role() === 'Admin');
}
