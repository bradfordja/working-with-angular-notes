# ⚛️ Angular NgRx — Deep Dive for Senior Interviews

## 📌 What is NgRx?

**NgRx** is a **state management library** for Angular applications inspired by **Redux**. It uses **RxJS observables** to manage state in a **reactive**, **predictable**, and **centralized** way.

---

## 🧩 Core Concepts of NgRx

### 1. **Store**

The global state container — a single source of truth.

```ts
Store<{ users: User[] }>
```

---

### 2. **Actions**

Events that describe something that happened in the app.

```ts
export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction('[User] Load Success', props<{ users: User[] }>());
```

---

### 3. **Reducers**

Pure functions that take the current state and an action, and return a new state.

```ts
const initialState: UserState = { users: [], loading: false };

const userReducer = createReducer(
  initialState,
  on(loadUsers, state => ({ ...state, loading: true })),
  on(loadUsersSuccess, (state, { users }) => ({ ...state, users, loading: false }))
);
```

---

### 4. **Selectors**

Functions used to select, transform, and derive slices of state.

```ts
export const selectUsers = createSelector(
  selectUserState,
  (state: UserState) => state.users
);
```

---

### 5. **Effects**

Side-effect handlers (e.g., API calls) using RxJS and observables.

```ts
@Injectable()
export class UserEffects {
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUsers),
      switchMap(() => this.userService.getUsers().pipe(
        map(users => loadUsersSuccess({ users })),
        catchError(error => of(loadUsersFailure({ error })))
      ))
    )
  );

  constructor(private actions$: Actions, private userService: UserService) {}
}
```

---

## 💼 Use Case Example: User Feature

### ✅ Action
```ts
export const loadUsers = createAction('[User Page] Load Users');
```

### ✅ Reducer
```ts
export const userReducer = createReducer(
  initialState,
  on(loadUsers, state => ({ ...state, loading: true }))
);
```

### ✅ Effect
```ts
loadUsers$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadUsers),
    switchMap(() => this.userService.getAll().pipe(
      map(users => loadUsersSuccess({ users }))
    ))
  )
);
```

### ✅ Selector
```ts
export const selectAllUsers = createSelector(
  selectUserFeature,
  (state: UserState) => state.users
);
```

### ✅ Component
```ts
this.store.select(selectAllUsers).subscribe(users => {
  this.users = users;
});
```

---

## 📘 Common NgRx Interview Questions

### 1. What is the role of `Actions` in NgRx?
**Answer:** They represent events in your app. Think of them as messages sent to update the store.

```ts
createAction('[Login Page] User Login');
```

---

### 2. How do `Reducers` work in NgRx?
**Answer:** Reducers handle state transitions based on the dispatched actions.

```ts
on(userLoginSuccess, (state, { user }) => ({ ...state, user }));
```

---

### 3. What are `Effects` and why are they useful?
**Answer:** Effects handle asynchronous operations (like API calls) outside the reducer.

---

### 4. Difference between `select` and `createSelector`?
**Answer:** 
- `store.select(...)` accesses store state.
- `createSelector(...)` creates reusable selector functions with memoization.

---

### 5. How do you manage error handling in NgRx?
**Answer:** Use separate failure actions with `catchError` in effects.

```ts
catchError(error => of(loginFailure({ error })))
```

## 💼 Use Example Code-Snipped: User Feature
### 1. **Creating an Action:**

```typescript
import { createAction } from '@ngrx/store';

export const increment = createAction('[Counter Component] Increment');
export const decrement = createAction('[Counter Component] Decrement');
```

### 2. **Creating a Reducer:**

```typescript
import { createReducer, on } from '@ngrx/store';
import { increment, decrement } from './counter.actions';

export const initialState = 0;

export const counterReducer = createReducer(
  initialState,
  on(increment, (state) => state + 1),
  on(decrement, (state) => state - 1)
);
```

### 3. **Creating a Selector:**

```typescript
import { createSelector } from '@ngrx/store';
import { AppState } from './app.state';

export const selectCounter = (state: AppState) => state.counter;

export const selectDoubledCounter = createSelector(
  selectCounter,
  (counter) => counter * 2
);
```

### 4. **Creating an Effect:**

```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { increment, decrement } from './counter.actions';

@Injectable()
export class CounterEffects {
  incrementByTwo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(increment),
      map(() => decrement())
    )
  );

  constructor(private actions$: Actions) {}
}
```

### 5. **Using Store and Dispatch in a Component:**

```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { increment, decrement } from './counter.actions';

@Component({
  selector: 'app-counter',
  template: `
    <button (click)="increment()">Increment</button>
    <button (click)="decrement()">Decrement</button>
  `
})
export class CounterComponent {
  constructor(private store: Store) {}

  increment() {
    this.store.dispatch(increment());
  }

  decrement() {
    this.store.dispatch(decrement());
  }
}
```




## ✅ Summary

| Concept   | Purpose                          | Related Function        |
|-----------|----------------------------------|--------------------------|
| Store     | Holds app state                  | `StoreModule.forRoot()` |
| Actions   | Describe events                  | `createAction`          |
| Reducers  | Handle state transitions         | `createReducer`, `on`   |
| Selectors | Read slices of state             | `createSelector`        |
| Effects   | Handle side-effects (API, etc.)  | `createEffect`          |

---

NgRx helps build **robust, testable**, and **scalable** applications with a **clear separation of concerns**. Mastering its concepts will greatly benefit any senior Angular developer.
