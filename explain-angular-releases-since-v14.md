As of **July 17, 2026**, the latest stable Angular line is **Angular 22**. Angular’s release page lists **v22.0.0** as active, released **June 3, 2026**, and npm shows `@angular/core` latest as **22.0.7**.

**Angular 14**
Main theme: typed forms and first step toward standalone Angular.

Use case: safer reactive forms with TypeScript catching form mistakes.

```ts
const loginForm = new FormGroup({
  email: new FormControl('', { nonNullable: true }),
  password: new FormControl('', { nonNullable: true }),
});

const email: string = loginForm.controls.email.value;
```

Standalone components were introduced as developer preview:

```ts
@Component({
  selector: 'app-user',
  standalone: true,
  template: `<h2>User</h2>`,
})
export class UserComponent {}
```

**Angular 15**
Main theme: standalone APIs became stable, reducing dependency on `NgModule`.

Use case: build apps with standalone components and provider functions.

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ],
});
```

Directive composition API was also added for reusable behavior:

```ts
@Component({
  selector: 'app-button',
  standalone: true,
  hostDirectives: [TooltipDirective],
  template: `<button><ng-content /></button>`,
})
export class ButtonComponent {}
```

`NgOptimizedImage` became stable for image performance:

```html
<img
  ngSrc="/assets/hero.jpg"
  width="1200"
  height="600"
  priority
  alt="Hero"
/>
```

**Angular 16**
Main theme: Signals arrived.

Use case: manage reactive state without relying only on RxJS.

```ts
count = signal(0);
double = computed(() => this.count() * 2);

increment() {
  this.count.update(value => value + 1);
}
```

Required inputs became available:

```ts
@Component({
  selector: 'app-user-card',
  template: `{{ name }}`,
})
export class UserCardComponent {
  @Input({ required: true }) name!: string;
}
```

Cleaner subscription cleanup arrived with `DestroyRef` / `takeUntilDestroyed`:

```ts
this.userService.getUsers()
  .pipe(takeUntilDestroyed())
  .subscribe(users => this.users = users);
```

**Angular 17**
Main theme: modern template syntax and deferrable views.

Use case: replace `*ngIf`, `*ngFor`, and `ngSwitch` with cleaner built-in control flow.

```html
@if (user) {
  <h2>{{ user.name }}</h2>
} @else {
  <p>No user found</p>
}

@for (item of items; track item.id) {
  <p>{{ item.name }}</p>
}
```

Deferrable views help reduce initial bundle size:

```html
@defer (on viewport) {
  <app-heavy-chart />
} @placeholder {
  <p>Chart placeholder...</p>
}
```

Signals became stable in core APIs.

**Angular 18**
Main theme: hydration, zoneless experiments, and Material 3.

Use case: improve SSR apps so user interactions during hydration are not lost.

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideClientHydration(withEventReplay()),
  ],
});
```

Experimental zoneless change detection:

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
  ],
});
```

Router redirects became more flexible:

```ts
export const routes: Routes = [
  {
    path: 'old-dashboard',
    redirectTo: () => '/dashboard',
  },
];
```

**Angular 19**
Main theme: standalone by default and more stable signal APIs.

Use case: new components no longer need `standalone: true`.

```ts
@Component({
  selector: 'app-profile',
  template: `<h2>Profile</h2>`,
})
export class ProfileComponent {}
```

Signal inputs became more practical:

```ts
@Component({
  selector: 'app-user-card',
  template: `<h2>{{ name() }}</h2>`,
})
export class UserCardComponent {
  name = input.required<string>();
}
```

Model inputs help with two-way binding:

```ts
@Component({
  selector: 'app-counter',
  template: `
    <button (click)="count.update(v => v + 1)">
      {{ count() }}
    </button>
  `,
})
export class CounterComponent {
  count = model(0);
}
```

**Angular 20**
Main theme: stabilization of modern reactivity and hydration.

Use case: use `linkedSignal` when state depends on another signal but can still be updated.

```ts
selectedUser = signal<User | null>(null);

displayName = linkedSignal(() =>
  this.selectedUser()?.name ?? 'Guest'
);
```

`toSignal` became stable for RxJS interop:

```ts
users = toSignal(this.http.get<User[]>('/api/users'), {
  initialValue: [],
});
```

Zoneless moved from experimental toward developer preview:

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
  ],
});
```

Incremental hydration became stable:

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideClientHydration(withIncrementalHydration()),
  ],
});
```

**Angular 21**
Main theme: AI tooling, Signal Forms preview, Angular Aria, and more production-ready modern APIs.

Use case: start experimenting with signal-based forms.

```ts
// Shape may vary by exact minor version because Signal Forms started experimental.
const user = signal({
  name: '',
  email: '',
});
```

Angular v21 also introduced Angular MCP Server tooling for better AI-assisted Angular development, and Angular Aria for accessible headless UI patterns.

Router state also moved more toward signals:

```ts
lastNav = this.router.lastSuccessfulNavigation;
// In newer Angular versions, signal-style APIs may need invocation.
```

**Angular 22**
Main theme: Angular becomes more signal-first and performance-first by default.

Important change: `OnPush` is now the default change detection strategy for components that do not specify one. To keep old eager behavior explicitly:

```ts
@Component({
  selector: 'app-legacy-widget',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `{{ value }}`,
})
export class LegacyWidgetComponent {
  value = 'old behavior';
}
```

`HttpClient` now uses Fetch by default. If you need old XHR behavior, such as upload progress compatibility:

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withXhr()),
  ],
});
```

Resource APIs are stable for async signal-based data:

```ts
userId = signal(1);

userResource = resource({
  request: () => ({ id: this.userId() }),
  loader: ({ request }) =>
    fetch(`/api/users/${request.id}`).then(res => res.json()),
});
```

Template usage:

```html
@if (userResource.isLoading()) {
  <p>Loading...</p>
} @else if (userResource.hasValue()) {
  <h2>{{ userResource.value().name }}</h2>
}
```

**Interview Summary**
From Angular 14 to 22, Angular moved from `NgModule`-heavy, zone-based, RxJS-centered development toward **standalone components, typed forms, Signals, built-in control flow, deferrable views, SSR hydration, zoneless change detection, signal-based forms, and performance-first defaults like OnPush**.

Sources: [Angular releases](https://angular.dev/reference/releases), [Angular version compatibility](https://angular.dev/reference/versions), [typed forms](https://angular.dev/guide/forms/typed-forms), [standalone migration](https://angular.dev/reference/migrations/standalone), [NgOptimizedImage](https://angular.dev/guide/image-optimization), [Angular v21 event](https://angular.dev/events/v21), [Resource API](https://angular.dev/api/core/resource).