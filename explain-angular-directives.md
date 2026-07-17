Below is an interview-friendly list of the **main Angular directives you should know**. In Angular, directives are classes that add behavior to elements. There are 3 big categories: **components**, **attribute directives**, and **structural directives**.

Sources: [Angular directives guide](https://angular.dev/guide/directives), [Angular router reference](https://angular.dev/guide/routing/router-reference), [Angular forms guide](https://angular.dev/guide/forms), [Angular NgIf API](https://angular.dev/api/common/NgIf).

**1. Component Directive**
A component is technically a directive with a template. It is the most common directive type.

Use case: create reusable UI blocks.

```ts
@Component({
  selector: 'app-user-card',
  template: `
    <h3>{{ name }}</h3>
  `,
})
export class UserCardComponent {
  name = 'Julio';
}
```

Usage:

```html
<app-user-card />
```

**2. `ngClass`**
Adds or removes CSS classes dynamically.

Use case: apply conditional styling.

```html
<button [ngClass]="{ active: isActive, disabled: isDisabled }">
  Save
</button>
```

```ts
isActive = true;
isDisabled = false;
```

**3. `ngStyle`**
Adds or removes inline styles dynamically.

Use case: dynamic colors, widths, font sizes.

```html
<div [ngStyle]="{ color: statusColor, 'font-size.px': fontSize }">
  Status
</div>
```

```ts
statusColor = 'green';
fontSize = 18;
```

**4. `ngModel`**
Creates two-way binding for template-driven forms.

Use case: simple forms.

```html
<input [(ngModel)]="username" name="username" />
<p>Hello {{ username }}</p>
```

```ts
username = '';
```

Requires:

```ts
imports: [FormsModule]
```

**5. `ngIf`**
Conditionally adds or removes an element from the DOM.

Use case: show content only when a condition is true.

```html
<p *ngIf="isLoggedIn">Welcome back!</p>
```

Modern Angular prefers `@if`:

```html
@if (isLoggedIn) {
  <p>Welcome back!</p>
} @else {
  <p>Please log in.</p>
}
```

Note: `NgIf` is deprecated in newer Angular versions in favor of `@if`.

**6. `ngFor`**
Loops over a list and renders one element per item.

Use case: display arrays.

```html
<li *ngFor="let user of users">
  {{ user.name }}
</li>
```

Modern Angular prefers `@for`:

```html
@for (user of users; track user.id) {
  <li>{{ user.name }}</li>
}
```

```ts
users = [
  { id: 1, name: 'Ana' },
  { id: 2, name: 'Sam' },
];
```

**7. `ngSwitch`, `ngSwitchCase`, `ngSwitchDefault`**
Displays one view from multiple possible cases.

Use case: status-based UI.

```html
<div [ngSwitch]="role">
  <p *ngSwitchCase="'admin'">Admin dashboard</p>
  <p *ngSwitchCase="'user'">User dashboard</p>
  <p *ngSwitchDefault>Guest dashboard</p>
</div>
```

Modern Angular prefers `@switch`:

```html
@switch (role) {
  @case ('admin') {
    <p>Admin dashboard</p>
  }
  @case ('user') {
    <p>User dashboard</p>
  }
  @default {
    <p>Guest dashboard</p>
  }
}
```

**8. `router-outlet`**
Marks where routed components should appear.

Use case: single-page app routing.

```html
<nav>
  <a routerLink="/">Home</a>
  <a routerLink="/users">Users</a>
</nav>

<router-outlet />
```

**9. `routerLink`**
Navigates without refreshing the full page.

Use case: internal navigation.

```html
<a routerLink="/users">Users</a>
<a [routerLink]="['/users', user.id]">View User</a>
```

**10. `routerLinkActive`**
Adds a CSS class when a route is active.

Use case: highlight active navigation link.

```html
<a
  routerLink="/users"
  routerLinkActive="active"
  [routerLinkActiveOptions]="{ exact: true }"
>
  Users
</a>
```

**11. `[formControl]`**
Binds a standalone `FormControl` to an input.

Use case: reactive forms with a single control.

```ts
favoriteColor = new FormControl('');
```

```html
<input [formControl]="favoriteColor" />
<p>{{ favoriteColor.value }}</p>
```

Requires:

```ts
imports: [ReactiveFormsModule]
```

**12. `[formGroup]`**
Binds a `FormGroup` to a form.

Use case: reactive forms with multiple fields.

```ts
form = new FormGroup({
  email: new FormControl(''),
  password: new FormControl(''),
});
```

```html
<form [formGroup]="form">
  <input formControlName="email" />
  <input formControlName="password" type="password" />
</form>
```

**13. `formControlName`**
Connects an input to a control inside a `FormGroup`.

Use case: common reactive form fields.

```html
<input formControlName="email" />
```

```ts
form = new FormGroup({
  email: new FormControl(''),
});
```

**14. `formGroupName`**
Binds a nested `FormGroup`.

Use case: nested form objects.

```ts
form = new FormGroup({
  address: new FormGroup({
    city: new FormControl(''),
    state: new FormControl(''),
  }),
});
```

```html
<form [formGroup]="form">
  <div formGroupName="address">
    <input formControlName="city" />
    <input formControlName="state" />
  </div>
</form>
```

**15. `formArrayName`**
Binds a nested `FormArray`.

Use case: dynamic fields like phone numbers, skills, addresses.

```ts
form = new FormGroup({
  skills: new FormArray([
    new FormControl('Angular'),
  ]),
});

get skills() {
  return this.form.get('skills') as FormArray;
}
```

```html
<form [formGroup]="form">
  <div formArrayName="skills">
    @for (skill of skills.controls; track $index) {
      <input [formControlName]="$index" />
    }
  </div>
</form>
```

**16. Validation Directives**
Angular also has built-in validator directives used with forms.

Use case: form validation.

```html
<input
  name="email"
  [(ngModel)]="email"
  required
  email
  minlength="5"
  maxlength="50"
/>
```

Common validation directives:

```text
required
email
minlength
maxlength
min
max
pattern
```

Reactive form version:

```ts
email = new FormControl('', [
  Validators.required,
  Validators.email,
]);
```

**17. Custom Attribute Directive**
Changes behavior or appearance of an existing element.

Use case: highlight an element on hover.

```ts
@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = 'yellow';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = '';
  }
}
```

Usage:

```html
<p appHighlight>Hover over me</p>
```

**18. Custom Structural Directive**
Changes DOM layout by adding or removing elements.

Use case: custom permission-based rendering.

```ts
@Directive({
  selector: '[appIfRole]',
})
export class IfRoleDirective {
  @Input() set appIfRole(role: string) {
    if (role === 'admin') {
      this.view.createEmbeddedView(this.template);
    } else {
      this.view.clear();
    }
  }

  constructor(
    private template: TemplateRef<any>,
    private view: ViewContainerRef
  ) {}
}
```

Usage:

```html
<div *appIfRole="'admin'">
  Admin only content
</div>
```

**Interview Summary**
Angular directives are used to attach behavior to DOM elements. The main types are **components**, **attribute directives**, and **structural directives**. Common built-in directives include `ngClass`, `ngStyle`, `ngModel`, `ngIf`, `ngFor`, router directives like `routerLink`, and form directives like `formGroup` and `formControlName`. In modern Angular, `@if`, `@for`, and `@switch` are preferred over older structural directives like `*ngIf`, `*ngFor`, and `ngSwitch`.