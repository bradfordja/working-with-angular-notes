In Angular, a **directive** is a class that adds behavior to an element, component, or another directive in the template.

Angular directives are usually grouped into three categories:

1. **Component directives**
2. **Structural directives**
3. **Attribute directives**

## 1. Component Directive

A component is technically a directive with a template.

**Use case:** Build reusable UI blocks.

```ts
@Component({
  selector: 'app-user-card',
  template: `
    <article>
      <h2>{{ name }}</h2>
      <p>{{ role }}</p>
    </article>
  `
})
export class UserCardComponent {
  name = 'Julio';
  role = 'Frontend Engineer';
}
```

Usage:

```html
<app-user-card></app-user-card>
```

---

## 2. `*ngIf`

Conditionally adds or removes an element from the DOM.

**Use case:** Show content only when a condition is true.

```html
<p *ngIf="isLoggedIn">Welcome back!</p>
```

```ts
isLoggedIn = true;
```

With `else`:

```html
<p *ngIf="isLoggedIn; else loginMessage">Welcome back!</p>

<ng-template #loginMessage>
  <p>Please log in.</p>
</ng-template>
```

---

## 3. `*ngFor`

Repeats an element for each item in a collection.

**Use case:** Render lists, cards, rows, menus.

```html
<ul>
  <li *ngFor="let user of users">
    {{ user.name }} - {{ user.role }}
  </li>
</ul>
```

```ts
users = [
  { name: 'Julio', role: 'Developer' },
  { name: 'Maya', role: 'Designer' }
];
```

With `index`:

```html
<li *ngFor="let user of users; let i = index">
  {{ i + 1 }}. {{ user.name }}
</li>
```

---

## 4. `*ngSwitch`

Displays one block from multiple possible blocks.

**Use case:** Render different UI based on status, role, or type.

```html
<div [ngSwitch]="status">
  <p *ngSwitchCase="'loading'">Loading...</p>
  <p *ngSwitchCase="'success'">Data loaded.</p>
  <p *ngSwitchCase="'error'">Something went wrong.</p>
  <p *ngSwitchDefault>Unknown status.</p>
</div>
```

```ts
status = 'success';
```

---

## 5. `[ngClass]`

Dynamically adds or removes CSS classes.

**Use case:** Apply styles based on state.

```html
<button [ngClass]="{ active: isActive, disabled: isDisabled }">
  Save
</button>
```

```ts
isActive = true;
isDisabled = false;
```

CSS:

```css
.active {
  background: green;
  color: white;
}

.disabled {
  opacity: 0.5;
}
```

---

## 6. `[ngStyle]`

Dynamically applies inline styles.

**Use case:** Change colors, sizes, spacing, or visibility dynamically.

```html
<p [ngStyle]="{ color: textColor, fontSize: fontSize }">
  Dynamic style example
</p>
```

```ts
textColor = 'blue';
fontSize = '18px';
```

---

## 7. `[(ngModel)]`

Creates two-way binding between form input and component property.

**Use case:** Template-driven forms.

```html
<input [(ngModel)]="username" placeholder="Enter username" />

<p>Hello, {{ username }}</p>
```

```ts
username = '';
```

Requires `FormsModule`:

```ts
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [FormsModule]
})
export class AppModule {}
```

---

## 8. `[formGroup]`

Binds a reactive form group to a form element.

**Use case:** Reactive forms with validation and complex form logic.

```html
<form [formGroup]="profileForm" (ngSubmit)="submitForm()">
  <input formControlName="firstName" placeholder="First name" />
  <input formControlName="email" placeholder="Email" />

  <button type="submit">Submit</button>
</form>
```

```ts
profileForm = new FormGroup({
  firstName: new FormControl(''),
  email: new FormControl('')
});

submitForm() {
  console.log(this.profileForm.value);
}
```

Requires `ReactiveFormsModule`.

---

## 9. `formControlName`

Connects a form input to a control inside a reactive form.

**Use case:** Manage individual fields inside a `FormGroup`.

```html
<input formControlName="email" />
```

```ts
profileForm = new FormGroup({
  email: new FormControl('')
});
```

---

## 10. `[routerLink]`

Navigates between routes in an Angular app.

**Use case:** Client-side navigation without full page reloads.

```html
<a [routerLink]="['/dashboard']">Dashboard</a>
```

With route parameter:

```html
<a [routerLink]="['/users', user.id]">
  View User
</a>
```

---

## 11. `routerLinkActive`

Adds a CSS class when a route is active.

**Use case:** Highlight active navigation link.

```html
<a routerLink="/dashboard" routerLinkActive="active">
  Dashboard
</a>
```

CSS:

```css
.active {
  font-weight: bold;
  color: blue;
}
```

---

## 12. `ng-container`

Not a directive itself, but often used with structural directives.

**Use case:** Apply Angular logic without adding extra DOM elements.

```html
<ng-container *ngIf="isLoggedIn">
  <h2>Account</h2>
  <p>Welcome to your dashboard.</p>
</ng-container>
```

---

## 13. `ng-template`

Defines a template block that Angular can render later.

**Use case:** `else` blocks, reusable templates, dynamic rendering.

```html
<div *ngIf="hasData; else noData">
  Data loaded.
</div>

<ng-template #noData>
  <p>No data available.</p>
</ng-template>
```

---

## 14. `ng-content`

Used for content projection.

**Use case:** Build reusable wrapper components.

Card component:

```html
<article class="card">
  <ng-content></ng-content>
</article>
```

Usage:

```html
<app-card>
  <h2>Angular Interview Prep</h2>
  <p>This content is projected into the card.</p>
</app-card>
```

---

## 15. Custom Attribute Directive

Creates custom behavior for an existing element.

**Use case:** Highlight elements, control permissions, track clicks, apply reusable behavior.

```ts
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  constructor(private el: ElementRef) {
    this.el.nativeElement.style.backgroundColor = 'yellow';
  }
}
```

Usage:

```html
<p appHighlight>
  Highlight this text.
</p>
```

---

## 16. Custom Directive With `@Input`

Allows data to be passed into a directive.

```ts
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() appHighlight = 'yellow';

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.style.backgroundColor = this.appHighlight;
  }
}
```

Usage:

```html
<p appHighlight="lightblue">
  Highlight me blue.
</p>
```

---

## 17. Custom Directive With `@HostListener`

Listens to events on the host element.

**Use case:** Hover effects, click tracking, keyboard handling.

```ts
@Directive({
  selector: '[appHoverHighlight]'
})
export class HoverHighlightDirective {
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = 'lightyellow';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = 'transparent';
  }
}
```

Usage:

```html
<p appHoverHighlight>
  Hover over me.
</p>
```

---

## 18. Custom Directive With `@HostBinding`

Binds a property or class to the host element.

**Use case:** Add classes or attributes based on directive state.

```ts
@Directive({
  selector: '[appActive]'
})
export class ActiveDirective {
  @HostBinding('class.active')
  isActive = true;
}
```

Usage:

```html
<button appActive>
  Active Button
</button>
```

CSS:

```css
.active {
  border: 2px solid green;
}
```

---

## Interview Summary

Say this in an interview:

> Angular directives are classes that add behavior to DOM elements. Components are directives with templates. Structural directives like `*ngIf`, `*ngFor`, and `*ngSwitch` change the DOM layout. Attribute directives like `ngClass`, `ngStyle`, and custom directives change the appearance or behavior of existing elements. In Angular applications, directives help keep templates declarative, reusable, and easier to maintain.