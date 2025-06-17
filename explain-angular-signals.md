# 🧠 Angular Signals — Deep Dive for Senior Interviews

## 📌 What Are Angular Signals?

**Signals** in Angular (introduced in v16+) are a **reactivity primitive** that lets you manage state **without relying on RxJS** or zone-based change detection. They are **pull-based**, fine-grained, and **automatically update the DOM** when their value changes.

---

## 🧩 Core Concepts of Angular Signals

### 1. `signal<T>()`

Creates a reactive signal holding a value of type `T`.

```ts
import { signal } from '@angular/core';

const count = signal(0);

console.log(count()); // reading the value
count.set(5);         // setting a new value
count.update(n => n + 1); // incrementing the value
```

---

### 2. `computed(() => ...)`

Creates a **derived value** that automatically updates when its dependencies (other signals) change.

```ts
import { signal, computed } from '@angular/core';

const price = signal(100);
const tax = signal(0.15);

const total = computed(() => price() * (1 + tax()));

console.log(total()); // 115
```

---

### 3. `effect(() => ...)`

Runs **side effects** whenever dependent signals change.

```ts
import { signal, effect } from '@angular/core';

const count = signal(1);

effect(() => {
  console.log('Count changed to:', count());
});
```

---

## 💡 Why Use Signals?

| Feature | Benefit |
|--------|---------|
| Fine-grained reactivity | Updates only the affected parts of the UI |
| No manual subscriptions | Simpler than `BehaviorSubject` or `Observable` |
| Native integration | Built into Angular and change detection |
| Performance | Works without zones, enabling Zone-less apps |

---

## 🔧 Use Cases & Examples

### ✅ 1. Reactive Counter (Component State)

```ts
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: \`
    <h1>{{ count() }}</h1>
    <button (click)="increment()">+</button>
  \`
})
export class CounterComponent {
  count = signal(0);

  increment() {
    this.count.update(n => n + 1);
  }
}
```

---

### ✅ 2. Computed Full Name

```ts
import { signal, computed } from '@angular/core';

const firstName = signal('Alice');
const lastName = signal('Smith');

const fullName = computed(() => \`\${firstName()} \${lastName()}\`);

console.log(fullName()); // Alice Smith
```

---

### ✅ 3. Simple Reactive Form

```ts
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  template: \`
    <input [value]="name()" (input)="name.set($any($event.target).value)" />
    <p>Hello {{ name() }}</p>
  \`
})
export class ProfileComponent {
  name = signal('John');
}
```

---

### ✅ 4. Shared Signal in Service

```ts
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkMode = signal(false);

  isDarkMode = computed(() => this.darkMode());
  toggle = () => this.darkMode.set(!this.darkMode());
}
```

```ts
@Component({ standalone: true })
export class HeaderComponent {
  theme = inject(ThemeService);

  toggleTheme() {
    this.theme.toggle();
  }
}
```

---

### ✅ 5. Signal with Effect (Analytics Logging)

```ts
effect(() => {
  console.log('User logged in:', isLoggedIn());
});
```

---

## 🔄 Signals vs RxJS: Quick Comparison

| Feature | Angular Signals | RxJS |
|--------|------------------|------|
| Type | Pull-based | Push-based |
| Async support | No (use observables) | Yes |
| Ideal for | UI State | Streams, HTTP |
| Memory mgmt | Automatic | Manual subscriptions |

---

## 🚫 When Not to Use Signals

- For **streams**, **HTTP requests**, **debouncing**, or **cancellation** → use `RxJS`.
- For **global shared state**, use `ComponentStore`, `NgRx`, or a signal-based service.

---

## ✅ Summary

- Signals bring a **reactive**, **declarative**, and **performant** approach to Angular UI state.
- They replace `BehaviorSubject` in many cases and reduce boilerplate.
- Use `signal`, `computed`, and `effect` together to model app state cleanly.
