# Explain ngrx

## listed are the common ngrx methods with simple explanations, and sample use-cases with code snippets:

**1. Store:** The central store holds the entire application state.

**2. Reducer:** A pure function that specifies how the application state changes in response to actions.

**3. Action:** A plain JavaScript object that represents an intention to change the state. Actions must have a `type` property.

**4. Dispatch:** The process of sending an action to the store.

**5. Selector:** A function that retrieves specific pieces of state from the store.

**6. Effect:** A function that listens for actions and triggers side effects, such as API calls.

**7. createAction:** A utility function to create action objects.

**8. createReducer:** A utility function to create reducers.

**9. createFeatureSelector:** A utility function to create selectors for specific features in the store.

**10. createSelector:** A utility function to create memoized selectors.

**11. ofType:** An operator for effects to filter actions by their type.

**12. withLatestFrom:** An operator for effects to combine the latest action with the current state.

**13. StoreModule:** An NgModule to import ngrx store-related functionality into the application.

**14. EffectsModule:** An NgModule to import ngrx effects-related functionality into the application.

**15. StoreDevtoolsModule:** An NgModule to enable the ngrx developer tools in the browser.

## These are some of the most common ngrx methods and use-cases that demonstrate how to implement state management with ngrx in an Angular application.

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

