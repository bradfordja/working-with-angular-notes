Below is a deep interview-prep dive into **Angular Directives and custom directives**.

**Core Idea**

In Angular, a **directive** is a class that adds behavior to something in the DOM.

Angular has three directive categories:

| Type | Purpose | Example |
|---|---|---|
| Component | Directive with a template | `@Component` |
| Attribute directive | Changes appearance/behavior of an existing element | `ngClass`, `ngStyle`, custom highlight |
| Structural directive | Changes DOM structure by adding/removing views | `*ngIf`, `*ngFor`, custom `*hasPermission` |

Angular’s docs define attribute directives as directives that change the behavior or appearance of an element, component, or another directive. Structural directives change layout by adding/removing DOM elements. [Angular directives docs](https://angular.dev/guide/directives)

**Directive vs Component**

A component is technically a directive with a template.

```ts
@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.html',
})
export class UserCardComponent {}
```

A directive usually has no template:

```ts
@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {}
```

Interview answer:

> Every component is a directive, but not every directive is a component. Components own a template. Attribute and structural directives attach behavior to existing templates.

**Attribute Directives**

Attribute directives modify an existing host element.

Example usage:

```html
<p appHighlight>Hover over me</p>
```

Directive:

```ts
import { Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.renderer.setStyle(
      this.el.nativeElement,
      'backgroundColor',
      'yellow'
    );
  }
}
```

This works, but interviewers may ask about `ElementRef`.

**ElementRef vs Renderer2**

`ElementRef` gives direct access to the native DOM element:

```ts
this.el.nativeElement.style.backgroundColor = 'yellow';
```

But direct DOM access is less ideal because Angular may run in different rendering environments: browser, server-side rendering, web workers, tests, etc.

`Renderer2` is Angular’s abstraction for safely manipulating DOM-like targets:

```ts
this.renderer.setStyle(this.el.nativeElement, 'color', 'red');
```

Interview answer:

> I prefer `Renderer2` over direct DOM manipulation because it keeps the directive more compatible with Angular’s rendering abstraction and SSR-style environments.

**Directive Inputs**

Custom directives often accept inputs.

Usage:

```html
<p [appHighlight]="'lightblue'">Hello</p>
```

Directive:

```ts
import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective implements OnChanges {
  @Input() appHighlight = 'yellow';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges() {
    this.renderer.setStyle(
      this.el.nativeElement,
      'backgroundColor',
      this.appHighlight
    );
  }
}
```

Notice the input name matches the selector:

```ts
@Input() appHighlight = 'yellow';
```

That lets you write:

```html
<p [appHighlight]="'pink'">Text</p>
```

You can also use an alias:

```ts
@Input('appHighlight') color = 'yellow';
```

**Host Bindings**

A directive often needs to bind properties, attributes, styles, or classes on its host element.

Older style:

```ts
import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appHoverClass]',
})
export class HoverClassDirective {
  @HostBinding('class.is-hovering')
  isHovering = false;

  @HostListener('mouseenter')
  onMouseEnter() {
    this.isHovering = true;
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isHovering = false;
  }
}
```

Usage:

```html
<button appHoverClass>Save</button>
```

Modern Angular docs note that the `host` metadata property is preferred over `@HostListener` for new code, while `@HostListener` remains available for compatibility. [Angular HostListener docs](https://angular.dev/api/core/HostListener)

Modern style:

```ts
@Directive({
  selector: '[appHoverClass]',
  host: {
    '[class.is-hovering]': 'isHovering',
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class HoverClassDirective {
  isHovering = false;

  onMouseEnter() {
    this.isHovering = true;
  }

  onMouseLeave() {
    this.isHovering = false;
  }
}
```

Interview answer:

> Host bindings let a directive declaratively modify its host element without manually querying the DOM.

**Host Events**

A directive can listen to events on its host:

```ts
@Directive({
  selector: '[appClickTracker]',
  host: {
    '(click)': 'trackClick($event)',
  },
})
export class ClickTrackerDirective {
  trackClick(event: MouseEvent) {
    console.log('Clicked', event);
  }
}
```

It can also listen globally:

```ts
@Directive({
  selector: '[appEscapeClose]',
  host: {
    '(document:keydown.escape)': 'close()',
  },
})
export class EscapeCloseDirective {
  close() {
    console.log('Escape pressed');
  }
}
```

Global targets can include `document:`, `window:`, and `body:` according to Angular’s directive host event API. [Angular Directive API](https://angular.dev/api/core/Directive)

**Structural Directives**

Structural directives change what exists in the DOM.

Classic examples:

```html
<div *ngIf="isLoggedIn">Welcome</div>

<li *ngFor="let user of users">
  {{ user.name }}
</li>
```

Angular’s modern control flow syntax introduced `@if`, `@for`, and `@switch`, but structural directives are still important for custom reusable DOM rendering behavior.

A structural directive usually works with:

```ts
TemplateRef
ViewContainerRef
```

Angular docs describe a structural directive as one that injects `TemplateRef` and `ViewContainerRef` and programmatically renders the template. [Angular ng-template docs](https://angular.dev/guide/templates/ng-template)

**What the Asterisk Means**

This:

```html
<p *appUnless="isHidden">Visible</p>
```

is shorthand for:

```html
<ng-template [appUnless]="isHidden">
  <p>Visible</p>
</ng-template>
```

The `*` syntax tells Angular to wrap that element in an `<ng-template>`.

Important interview point:

> You can only use one structural directive with `*` on a single element because Angular expands it into one `<ng-template>`. If you need multiple, use `<ng-container>`.

Example:

```html
<ng-container *ngIf="isLoggedIn">
  <li *ngFor="let item of items">
    {{ item }}
  </li>
</ng-container>
```

Angular documents this “one structural directive per element” rule. [Angular structural directives docs](https://v18.angular.dev/guide/directives/structural-directives/)

**Custom Structural Directive: `appUnless`**

Usage:

```html
<p *appUnless="isLoggedIn">
  Please log in.
</p>
```

Implementation:

```ts
import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

@Directive({
  selector: '[appUnless]',
})
export class UnlessDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input()
  set appUnless(condition: boolean) {
    if (!condition && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (condition && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
```

Mental model:

```txt
TemplateRef = the chunk of template Angular can render
ViewContainerRef = the place where Angular can insert/remove that template
createEmbeddedView = render it
clear = remove it
```

**Custom Permission Directive**

Very interview-relevant for real apps.

Usage:

```html
<button *appHasPermission="'invoice:delete'">
  Delete Invoice
</button>
```

Implementation:

```ts
@Directive({
  selector: '[appHasPermission]',
})
export class HasPermissionDirective {
  private requiredPermission = '';
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input()
  set appHasPermission(permission: string) {
    this.requiredPermission = permission;
    this.updateView();
  }

  private updateView() {
    const allowed = this.authService.hasPermission(this.requiredPermission);

    if (allowed && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    }

    if (!allowed && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
```

Important caveat:

> A permission directive is UX, not security. The backend must still authorize the API request.

**Directive Selectors**

Directives commonly use attribute selectors:

```ts
@Directive({
  selector: '[appTooltip]',
})
```

Usage:

```html
<button appTooltip>Info</button>
```

You can also make selectors more specific:

```ts
@Directive({
  selector: 'input[appTrim]',
})
```

Usage:

```html
<input appTrim />
```

This directive only applies to `input` elements with `appTrim`.

**Standalone Directives**

Modern Angular supports standalone directives by default.

```ts
@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective {}
```

Then import it directly into a standalone component:

```ts
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HighlightDirective],
  template: `
    <p appHighlight>Profile</p>
  `,
})
export class ProfileComponent {}
```

Angular’s `@Directive` API notes that directives are standalone by default unless configured otherwise, and NgModule-based directives can use `standalone: false`. [Angular Directive API](https://angular.dev/api/core/Directive)

**Directive Lifecycle Hooks**

Directives can use lifecycle hooks just like components:

```ts
export class ResizeDirective implements OnInit, OnDestroy {
  ngOnInit() {
    console.log('Directive initialized');
  }

  ngOnDestroy() {
    console.log('Directive destroyed');
  }
}
```

Common hooks in directives:

```txt
ngOnInit
ngOnChanges
ngDoCheck
ngAfterViewInit
ngOnDestroy
```

Use `ngOnDestroy` for cleanup:

```ts
private subscription?: Subscription;

ngOnInit() {
  this.subscription = this.service.events$.subscribe();
}

ngOnDestroy() {
  this.subscription?.unsubscribe();
}
```

**Using DestroyRef**

Modern Angular also supports `DestroyRef` for cleanup patterns.

```ts
import { DestroyRef, Directive, inject } from '@angular/core';

@Directive({
  selector: '[appLogger]',
})
export class LoggerDirective {
  private destroyRef = inject(DestroyRef);

  constructor() {
    const id = setInterval(() => {
      console.log('tick');
    }, 1000);

    this.destroyRef.onDestroy(() => {
      clearInterval(id);
    });
  }
}
```

Good interview answer:

> In custom directives, cleanup matters because directives often attach listeners, subscriptions, observers, timers, or third-party behavior to DOM elements.

**Directive Outputs**

Directives can emit events.

Usage:

```html
<input appTrimOnBlur (trimmed)="save($event)" />
```

Directive:

```ts
@Directive({
  selector: '[appTrimOnBlur]',
  host: {
    '(blur)': 'handleBlur()',
  },
})
export class TrimOnBlurDirective {
  @Output() trimmed = new EventEmitter<string>();

  constructor(private el: ElementRef<HTMLInputElement>) {}

  handleBlur() {
    const value = this.el.nativeElement.value.trim();
    this.el.nativeElement.value = value;
    this.trimmed.emit(value);
  }
}
```

**Directive Composition API**

Angular supports applying directives to a component/directive through `hostDirectives`.

Example:

```ts
@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.html',
  hostDirectives: [MenuBehaviorDirective],
})
export class AdminMenuComponent {}
```

Angular applies host directives statically at compile time, and host directive inputs/outputs are not exposed by default unless explicitly listed. [Angular directive composition docs](https://angular.dev/guide/directives/directive-composition-api)

Example with exposed inputs:

```ts
@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.html',
  hostDirectives: [
    {
      directive: MenuBehaviorDirective,
      inputs: ['menuId: id'],
      outputs: ['menuClosed: closed'],
    },
  ],
})
export class AdminMenuComponent {}
```

Usage:

```html
<app-admin-menu
  id="main-menu"
  (closed)="logClosed()"
/>
```

Interview answer:

> Directive composition lets us reuse host behavior without inheritance or manually adding the directive in every template.

**Common Built-In Directives**

Attribute directives:

```html
<div [ngClass]="{ active: isActive }"></div>

<div [ngStyle]="{ color: textColor }"></div>

<input [(ngModel)]="name" />
```

Structural directives:

```html
<div *ngIf="visible"></div>

<li *ngFor="let item of items"></li>

<div [ngSwitch]="role">
  <p *ngSwitchCase="'admin'">Admin</p>
  <p *ngSwitchDefault>User</p>
</div>
```

Modern Angular also has built-in control flow:

```html
@if (visible) {
  <div>Visible</div>
}

@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
}
```

But for interviews, you should still understand `*ngIf`, `*ngFor`, and custom structural directives because they reveal how Angular templates work under the hood.

**Attribute vs Structural Directive**

Great interview comparison:

```txt
Attribute directive:
- Changes behavior or appearance
- Does not usually create/remove DOM
- Works on an existing host element
- Example: highlight, tooltip, autofocus, mask input

Structural directive:
- Changes DOM structure
- Uses TemplateRef and ViewContainerRef
- Creates/removes embedded views
- Example: *ngIf, *ngFor, *appHasPermission
```

**Common Interview Questions**

**Q: What is a directive in Angular?**

A directive is a class decorated with `@Directive` that adds behavior to elements in Angular templates.

**Q: What are the types of directives?**

Components, attribute directives, and structural directives.

**Q: What is the difference between a component and directive?**

A component is a directive with a template. Attribute and structural directives usually do not own templates.

**Q: What is an attribute directive?**

A directive that changes the appearance or behavior of an existing element.

**Q: What is a structural directive?**

A directive that changes DOM layout by adding, removing, or repeating template views.

**Q: What does `*` mean in `*ngIf`?**

It is shorthand for wrapping the element in an `<ng-template>` and applying the structural directive there.

**Q: Why can’t we put two structural directives on one element?**

Because the shorthand expands to a single `<ng-template>`, and Angular would not know how to order multiple structural transformations. Use `<ng-container>` to layer them.

**Q: What are `TemplateRef` and `ViewContainerRef`?**

`TemplateRef` represents a template fragment. `ViewContainerRef` is where Angular can insert, move, or remove embedded views.

**Q: Why use `Renderer2`?**

It abstracts DOM manipulation and is safer than directly touching `nativeElement`.

**Q: What is `host` metadata?**

It declares bindings and listeners on the directive’s host element.

**Q: What is `hostDirectives`?**

It lets a component or directive statically apply other standalone directives to its host, enabling behavior composition.

**Common Mistakes**

Avoid this:

```ts
this.el.nativeElement.style.color = 'red';
```

Prefer:

```ts
this.renderer.setStyle(this.el.nativeElement, 'color', 'red');
```

Avoid using structural directives for simple styling.

Bad:

```html
<div *appMakeRed>Text</div>
```

Better:

```html
<div appMakeRed>Text</div>
```

Avoid using attribute directives for authorization security.

```html
<button *appHasPermission="'admin'">Delete</button>
```

This only hides UI. The API still needs real authorization.

Avoid leaking subscriptions/listeners.

```ts
ngOnDestroy() {
  this.subscription.unsubscribe();
}
```

**Strong Interview Summary**

> Angular directives let us attach behavior to DOM elements and templates. Components are directives with templates, attribute directives modify existing elements, and structural directives change the DOM by creating or removing embedded views. Attribute directives are useful for things like highlighting, tooltips, input masks, autofocus, or behavior composition. Structural directives use `TemplateRef` and `ViewContainerRef` and power patterns like `*ngIf`, `*ngFor`, and custom permission rendering. For custom directives, I pay attention to selector design, inputs/outputs, host bindings, cleanup, and avoiding direct DOM manipulation when `Renderer2` or declarative host bindings are better.