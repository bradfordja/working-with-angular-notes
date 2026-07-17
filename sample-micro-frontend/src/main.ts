import { CommonModule } from '@angular/common';
import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, provideHttpClient, withInterceptors } from '@angular/common/http';
import { Component, Injectable, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CanActivateFn, CanMatchFn, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet, Routes, provideRouter, withComponentInputBinding } from '@angular/router';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';

type Role = 'user' | 'manager' | 'admin';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: Role;
  permissions: string[];
};

type JwtPayload = UserProfile & {
  iss: string;
  aud: string;
  iat: number;
  exp: number;
};

const USERS = {
  analyst: {
    id: 'usr_1001',
    name: 'Ava Analyst',
    email: 'ava@example.com',
    role: 'user',
    permissions: ['orders:read', 'orders:create']
  },
  manager: {
    id: 'usr_2001',
    name: 'Miles Manager',
    email: 'miles@example.com',
    role: 'manager',
    permissions: ['orders:read', 'orders:create', 'billing:read']
  },
  admin: {
    id: 'usr_3001',
    name: 'Nia Admin',
    email: 'nia@example.com',
    role: 'admin',
    permissions: ['orders:read', 'orders:create', 'billing:read', 'admin:read', 'users:write']
  }
} satisfies Record<string, UserProfile>;

function encodeBase64Url(value: object): string {
  return btoa(JSON.stringify(value))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '');
}

function decodeBase64Url<T>(value: string): T {
  const base64 = value.replaceAll('-', '+').replaceAll('_', '/');
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  return JSON.parse(atob(padded)) as T;
}

function createDemoJwt(user: UserProfile): string {
  const now = Math.floor(Date.now() / 1000);
  const header = encodeBase64Url({ alg: 'HS256', typ: 'JWT' });
  const payload = encodeBase64Url({
    ...user,
    iss: 'https://demo-auth.local',
    aud: 'angular-jwt-mfe-api',
    iat: now,
    exp: now + 60 * 30
  });

  return `${header}.${payload}.demo-signature`;
}

@Injectable({ providedIn: 'root' })
class AuthService {
  private readonly storageKey = 'demo.jwt';
  private readonly profileSubject = new BehaviorSubject<UserProfile | null>(this.readProfileFromToken());

  readonly profile$ = this.profileSubject.asObservable();
  readonly isAuthenticated$ = this.profile$.pipe(map(Boolean));

  get token(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  get profile(): UserProfile | null {
    return this.profileSubject.value;
  }

  login(username: keyof typeof USERS): void {
    const token = createDemoJwt(USERS[username]);
    localStorage.setItem(this.storageKey, token);
    this.profileSubject.next(this.readProfileFromToken());
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.profileSubject.next(null);
  }

  hasPermission(permission: string): boolean {
    return this.profile?.permissions.includes(permission) ?? false;
  }

  private readProfileFromToken(): UserProfile | null {
    const token = localStorage.getItem(this.storageKey);

    if (!token) {
      return null;
    }

    try {
      const [, payload] = token.split('.');
      const decoded = decodeBase64Url<JwtPayload>(payload);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp <= now || decoded.iss !== 'https://demo-auth.local' || decoded.aud !== 'angular-jwt-mfe-api') {
        localStorage.removeItem(this.storageKey);
        return null;
      }

      return {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
        permissions: decoded.permissions
      };
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}

const jwtInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const auth = inject(AuthService);
  const token = auth.token;

  if (!token || !request.url.startsWith('/api')) {
    return next(request);
  }

  return next(request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }));
};

const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.profile) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

const permissionGuard = (permission: string): CanMatchFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.profile) {
      return router.createUrlTree(['/login']);
    }

    if (!auth.hasPermission(permission)) {
      return router.createUrlTree(['/forbidden']);
    }

    return true;
  };
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="auth-page">
      <div class="auth-panel">
        <p class="eyebrow">Shell authentication</p>
        <h1>JWT sign-in for routed micro frontends</h1>
        <p class="copy">Pick a demo identity. The shell creates a short-lived JWT, stores it for the session, filters navigation, and guards lazy standalone feature areas.</p>

        <div class="login-grid">
          <button type="button" class="identity-card" (click)="login('analyst')">
            <span>Analyst</span>
            <strong>Orders only</strong>
            <small>orders:read, orders:create</small>
          </button>
          <button type="button" class="identity-card" (click)="login('manager')">
            <span>Manager</span>
            <strong>Orders + billing</strong>
            <small>billing:read</small>
          </button>
          <button type="button" class="identity-card" (click)="login('admin')">
            <span>Admin</span>
            <strong>Full sample access</strong>
            <small>admin:read, users:write</small>
          </button>
        </div>
      </div>
    </section>
  `
})
class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  login(username: keyof typeof USERS): void {
    this.auth.login(username);
    void this.router.navigateByUrl('/dashboard');
  }
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="page-heading">
      <p class="eyebrow">Shell dashboard</p>
      <h1>Micro frontend control center</h1>
      <p>Each tile below links to an independently lazy-loaded standalone feature area. The shell owns identity, route protection, and navigation policy.</p>
    </section>

    <section class="metric-grid">
      <article class="metric">
        <span>Active user</span>
        <strong>{{ auth.profile?.name }}</strong>
        <small>{{ auth.profile?.role }}</small>
      </article>
      <article class="metric">
        <span>JWT audience</span>
        <strong>angular-jwt-mfe-api</strong>
        <small>checked before profile restore</small>
      </article>
      <article class="metric">
        <span>Permissions</span>
        <strong>{{ auth.profile?.permissions?.length ?? 0 }}</strong>
        <small>used for route and menu gating</small>
      </article>
    </section>

    <section class="remote-grid">
      <a routerLink="/orders" class="remote-card">
        <span>Orders remote</span>
        <strong>Order intake and queue health</strong>
      </a>
      <a routerLink="/billing" class="remote-card">
        <span>Billing remote</span>
        <strong>Invoices and payment risk</strong>
      </a>
      <a routerLink="/admin" class="remote-card">
        <span>Admin remote</span>
        <strong>User access and tenant settings</strong>
      </a>
    </section>
  `
})
class DashboardComponent {
  readonly auth = inject(AuthService);
}

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="empty-state">
      <p class="eyebrow">403</p>
      <h1>Access denied</h1>
      <p>Your JWT is valid, but this route requires a permission your current identity does not have.</p>
      <a routerLink="/dashboard" class="button-link">Back to dashboard</a>
    </section>
  `
})
class ForbiddenComponent {}

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'orders',
        canMatch: [permissionGuard('orders:read')],
        loadComponent: () => import('./remotes/orders/orders.component').then(m => m.OrdersComponent)
      },
      {
        path: 'billing',
        canMatch: [permissionGuard('billing:read')],
        loadComponent: () => import('./remotes/billing/billing.component').then(m => m.BillingComponent)
      },
      {
        path: 'admin',
        canMatch: [permissionGuard('admin:read')],
        loadComponent: () => import('./remotes/admin/admin.component').then(m => m.AdminComponent)
      },
      { path: 'forbidden', component: ForbiddenComponent },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <ng-container *ngIf="auth.profile$ | async as profile; else signedOut">
      <div class="app-shell">
        <aside class="sidebar">
          <div class="brand">
            <span class="brand-mark">MF</span>
            <div>
              <strong>JWT Shell</strong>
              <small>Standalone Angular</small>
            </div>
          </div>

          <nav aria-label="Primary navigation">
            <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            <a routerLink="/orders" routerLinkActive="active" *ngIf="can('orders:read')">Orders</a>
            <a routerLink="/billing" routerLinkActive="active" *ngIf="can('billing:read')">Billing</a>
            <a routerLink="/admin" routerLinkActive="active" *ngIf="can('admin:read')">Admin</a>
          </nav>

          <div class="user-card">
            <span>{{ profile.name }}</span>
            <strong>{{ profile.email }}</strong>
            <small>{{ profile.permissions.join(' / ') }}</small>
            <button type="button" (click)="logout()">Sign out</button>
          </div>
        </aside>

        <main>
          <router-outlet></router-outlet>
        </main>
      </div>
    </ng-container>

    <ng-template #signedOut>
      <router-outlet></router-outlet>
    </ng-template>
  `
})
class AppComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => window.scrollTo({ top: 0 }));
  }

  can(permission: string): boolean {
    return this.auth.hasPermission(permission);
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigateByUrl('/login');
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([jwtInterceptor]))
  ]
}).catch(error => console.error(error));
