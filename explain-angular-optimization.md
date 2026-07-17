# Angular optimization

Here are strong Angular optimization topics for interview prep. A good interview answer is usually: **measure first, reduce initial bundle, reduce change detection work, optimize rendering, optimize network/assets, then cache wisely**.

Sources used: Angular performance docs, lazy routes, `@defer`, image warnings, and incremental hydration docs.

**1. Lazy Load Routes**
Lazy loading keeps large feature areas out of the initial JavaScript bundle. Load admin, dashboard, settings, reports, etc. only when the user navigates there.

```ts
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
];
```

Interview line: “I lazy-load non-critical routes to reduce the initial bundle and improve startup time.”

**2. Use `@defer` for Heavy Components**
Angular’s `@defer` delays loading parts of a template until needed, such as charts, comments, maps, or below-the-fold widgets.

```html
@defer (on viewport) {
  <app-heavy-chart />
} @placeholder {
  <p>Chart loading soon...</p>
} @loading {
  <p>Loading chart...</p>
}
```

You can also trigger on interaction:

```html
@defer (on interaction) {
  <app-recommendations />
} @placeholder {
  <button>Show recommendations</button>
}
```

Interview line: “I use deferrable views for expensive UI that is not needed during first paint.”

**3. Use `OnPush` Change Detection**
By default, Angular checks many components during change detection. `OnPush` tells Angular to check a component mainly when its inputs change, events happen, or signals/observables update.

```ts
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: `
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent {
  @Input() user!: { name: string; email: string };
}
```

Interview line: “I use `OnPush` with immutable data to reduce unnecessary component checks.”

**4. Use `track` / `trackBy` for Lists**
Without tracking, Angular may recreate DOM nodes unnecessarily when arrays change.

Modern Angular control flow:

```html
@for (user of users; track user.id) {
  <app-user-card [user]="user" />
}
```

Older `ngFor` style:

```html
<div *ngFor="let user of users; trackBy: trackByUserId">
  {{ user.name }}
</div>
```

```ts
trackByUserId(index: number, user: { id: number }) {
  return user.id;
}
```

Interview line: “For large lists, I track by stable IDs so Angular reuses DOM nodes.”

**5. Avoid Calling Functions Directly in Templates**
Template functions can run repeatedly during change detection.

Less ideal:

```html
<p>{{ calculateTotal(cartItems) }}</p>
```

Better:

```ts
total = computed(() =>
  this.cartItems().reduce((sum, item) => sum + item.price, 0)
);
```

```html
<p>{{ total() }}</p>
```

Interview line: “I avoid expensive template expressions and move derived values into signals, computed values, or cached properties.”

**6. Use Signals for Fine-Grained Reactivity**
Signals can make state updates more explicit and efficient.

```ts
import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-cart',
  template: `
    <p>Items: {{ count() }}</p>
    <p>Total: {{ total() }}</p>
  `,
})
export class CartComponent {
  items = signal([
    { name: 'Book', price: 20 },
    { name: 'Pen', price: 5 },
  ]);

  count = computed(() => this.items().length);

  total = computed(() =>
    this.items().reduce((sum, item) => sum + item.price, 0)
  );
}
```

Interview line: “Signals help reduce broad state updates and make derived state easier to optimize.”

**7. Optimize Images**
Images often hurt performance more than Angular itself. Use proper dimensions, responsive images, lazy loading for below-the-fold images, and eager loading for the LCP image.

```html
<img
  ngSrc="/assets/hero.jpg"
  width="1200"
  height="600"
  priority
  alt="Dashboard preview"
/>
```

For non-critical images:

```html
<img
  ngSrc="/assets/avatar.jpg"
  width="80"
  height="80"
  loading="lazy"
  alt="User avatar"
/>
```

Interview line: “I optimize image size, dimensions, lazy loading, and prioritize the LCP image.”

**8. Use Production Builds**
Production builds enable optimizations like minification, tree-shaking, and build-time optimizations.

```bash
ng build --configuration production
```

You can inspect bundle size:

```bash
ng build --stats-json
```

Interview line: “I always compare production bundles and inspect what is increasing JavaScript size.”

**9. Split Large Components**
Very large components often cause unnecessary re-rendering and hard-to-control state. Split them into smaller smart/container and presentational components.

```html
<app-user-filters
  (filtersChanged)="loadUsers($event)"
/>

<app-user-list
  [users]="users()"
/>
```

```ts
@Component({
  selector: 'app-user-list',
  template: `
    @for (user of users(); track user.id) {
      <app-user-card [user]="user" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  users = input.required<User[]>();
}
```

Interview line: “I split large screens into smaller `OnPush` components to reduce rendering cost and improve maintainability.”

**10. Virtual Scroll for Large Lists**
Rendering thousands of rows kills performance. Virtual scrolling renders only what is visible.

```bash
npm install @angular/cdk
```

```html
<cdk-virtual-scroll-viewport itemSize="48" class="viewport">
  <div *cdkVirtualFor="let item of items">
    {{ item.name }}
  </div>
</cdk-virtual-scroll-viewport>
```

```css
.viewport {
  height: 400px;
  width: 100%;
}
```

Interview line: “For large lists, pagination or virtual scroll is better than rendering everything.”

**11. Cache HTTP Requests**
Avoid repeated API calls for data that does not change often.

```ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private users$ = this.http
    .get<User[]>('/api/users')
    .pipe(shareReplay(1));

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.users$;
  }
}
```

Interview line: “I use caching with `shareReplay`, state management, or browser caching to avoid duplicate network requests.”

**12. Debounce User Input**
For search boxes, do not call the API on every keystroke.

```ts
searchControl = new FormControl('');

results$ = this.searchControl.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(query => this.api.searchUsers(query ?? ''))
);
```

Interview line: “I debounce search inputs and use `switchMap` to cancel stale requests.”

**13. Use SSR, SSG, and Hydration**
Server-side rendering improves perceived load time and SEO. Hydration lets Angular reuse server-rendered DOM instead of rebuilding everything.

```ts
// app.config.ts
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig = {
  providers: [
    provideClientHydration(),
  ],
};
```

Interview line: “For public or SEO-heavy pages, I consider SSR, prerendering, and hydration.”

**14. Use Incremental Hydration for Advanced SSR Apps**
Incremental hydration allows parts of the page to stay non-interactive until needed, reducing initial work.

```ts
import {
  provideClientHydration,
  withIncrementalHydration,
} from '@angular/platform-browser';

export const appConfig = {
  providers: [
    provideClientHydration(withIncrementalHydration()),
  ],
};
```

```html
@defer (hydrate on interaction) {
  <app-heavy-widget />
}
```

Interview line: “For SSR apps with complex pages, incremental hydration can reduce the initial JavaScript and hydration cost.”

**15. Unsubscribe and Prevent Memory Leaks**
Memory leaks slow apps over time. Prefer `async` pipe or `takeUntilDestroyed`.

```ts
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

ngOnInit() {
  this.userService.getUsers()
    .pipe(takeUntilDestroyed())
    .subscribe(users => {
      this.users = users;
    });
}
```

Even better with `async` pipe:

```html
@for (user of users$ | async; track user.id) {
  <p>{{ user.name }}</p>
}
```

Interview line: “I prevent memory leaks by using `async` pipe or `takeUntilDestroyed`.”

**16. Reduce Third-Party Bundle Size**
Large libraries can inflate the app. Import only what you need.

Less ideal:

```ts
import * as _ from 'lodash';
```

Better:

```ts
import debounce from 'lodash-es/debounce';
```

Or use native JavaScript:

```ts
const activeUsers = users.filter(user => user.active);
```

Interview line: “I check bundle impact before adding dependencies and prefer tree-shakable imports.”

**17. Use Preloading Strategically**
Lazy loading is good, but some routes should preload after startup.

```ts
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
```

Interview line: “I lazy-load initial bundles, then preload likely next routes after the app becomes usable.”

**18. Profile Before Optimizing**
Use Angular DevTools, Chrome Performance tab, Lighthouse, and bundle analysis.

```bash
ng build --configuration production --stats-json
```

Interview line: “I measure first with Angular DevTools, Chrome DevTools, Lighthouse, and bundle stats before guessing.”

A strong interview summary:

```text
To optimize Angular apps, I start by measuring performance. Then I reduce initial JavaScript using lazy routes and @defer, reduce rendering work with OnPush, trackBy, signals, and smaller components, optimize lists with virtual scroll, optimize images and assets, cache HTTP calls, debounce user input, prevent memory leaks, and use SSR/hydration when initial load and SEO matter.
```