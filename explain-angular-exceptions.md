Below is a deep-dive you can use for interviews and real Angular work. The key idea: **handle recoverable errors locally where you have context; use global handling for unexpected/unrecoverable errors and logging.**

Angular docs make this same distinction: Angular reports **unhandled** errors to the root `ErrorHandler`, but application code should use `try/catch`, RxJS `catchError`, and local handling where the operation happens. Sources: [Angular unhandled errors](https://angular.dev/best-practices/error-handling), [ErrorHandler API](https://angular.dev/api/core/ErrorHandler), [HttpClient request failure](https://angular.dev/guide/http/making-requests), [HttpErrorResponse](https://angular.dev/api/common/http/HttpErrorResponse).

**1. Local Exception Handling**
Local handling means catching the error close to the feature that caused it.

Use local handling when:
- You can recover from the error.
- You can show a specific UI message.
- You know what fallback state makes sense.
- The error belongs to a specific action, form, API call, or component.

Example with `try/catch`:

```ts
saveUser() {
  try {
    this.validateUser(this.user);
    this.status = 'User is valid';
  } catch (error) {
    this.status = 'Please fix the user information';
    console.error('Validation failed', error);
  }
}

validateUser(user: User) {
  if (!user.email) {
    throw new Error('Email is required');
  }
}
```

Interview line:

```text
I handle expected errors locally because the component or service has the context to recover and show the right user message.
```

**2. Local HTTP Error Handling**
Most Angular API errors are handled through RxJS because `HttpClient` returns observables. Angular wraps HTTP failures in `HttpErrorResponse`.

```ts
getUser(id: number) {
  return this.http.get<User>(`/api/users/${id}`).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 404) {
        return of(null);
      }

      if (error.status === 0) {
        return throwError(() => new Error('Network error'));
      }

      return throwError(() => error);
    })
  );
}
```

Component usage:

```ts
user$ = this.userService.getUser(10).pipe(
  catchError(() => {
    this.errorMessage = 'Could not load user';
    return of(null);
  })
);
```

Template:

```html
@if (errorMessage) {
  <p class="error">{{ errorMessage }}</p>
}

@if (user$ | async; as user) {
  <h2>{{ user.name }}</h2>
}
```

Good interview explanation:

```text
For HTTP calls, I usually handle expected statuses locally. For example, 404 might show “user not found,” 401 might redirect to login, and 500 might show a retry message.
```

**3. Global HTTP Error Handling with Interceptors**
An HTTP interceptor is good for cross-cutting errors: auth failures, logging, standard headers, retry rules, or global toast messages.

Functional interceptor example:

```ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // redirect to login, clear token, etc.
        console.error('Unauthorized request');
      }

      if (error.status >= 500) {
        console.error('Server error', error.message);
      }

      return throwError(() => error);
    })
  );
};
```

Register it:

```ts
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([errorInterceptor])
    ),
  ],
});
```

Use case:

```text
Use an interceptor when the same HTTP error behavior should apply across the whole app.
```

Important: do not put all UI-specific logic in the interceptor. A profile page and checkout page may need different messages.

**4. Global Angular Exception Handling with `ErrorHandler`**
Angular’s `ErrorHandler` is the global hook for unhandled exceptions.

Use it for:
- Logging to monitoring tools.
- Capturing unexpected framework/runtime errors.
- Recording current route/user/session.
- Sending errors to Sentry, Datadog, App Insights, etc.

```ts
import { ErrorHandler, Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private router = inject(Router);

  handleError(error: unknown): void {
    const url = this.router.url;

    console.error('Global Angular error', {
      url,
      error,
    });

    // Example:
    // this.monitoringService.captureException(error, { url });
  }
}
```

Register globally:

```ts
bootstrapApplication(AppComponent, {
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
});
```

Interview line:

```text
Global ErrorHandler is not where I recover from normal business errors. I use it to report unexpected errors and keep observability consistent.
```

**5. Browser-Level Global Errors**
Some errors happen outside Angular’s normal execution path. Modern Angular supports forwarding browser-level `error` and `unhandledrejection` events to Angular’s `ErrorHandler`.

```ts
import {
  provideBrowserGlobalErrorListeners,
} from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideBrowserGlobalErrorListeners(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ],
});
```

Use case:

```text
This helps catch unhandled promise rejections or browser-level errors that Angular might not otherwise see.
```

**6. Async Pipe Errors**
If an observable used by `async` pipe errors and you do not catch it, Angular can forward it as an unhandled error. Better: transform the stream into a UI state.

Less ideal:

```html
<p>{{ user$ | async }}</p>
```

Better:

```ts
userState$ = this.userService.getUser(1).pipe(
  map(user => ({ loading: false, user, error: null })),
  startWith({ loading: true, user: null, error: null }),
  catchError(error =>
    of({
      loading: false,
      user: null,
      error: 'Unable to load user',
    })
  )
);
```

```html
@if (userState$ | async; as state) {
  @if (state.loading) {
    <p>Loading...</p>
  } @else if (state.error) {
    <p>{{ state.error }}</p>
  } @else if (state.user) {
    <h2>{{ state.user.name }}</h2>
  }
}
```

**7. RxJS `catchError`: Return or Rethrow**
Inside `catchError`, you either return a fallback observable or rethrow.

Fallback:

```ts
products$ = this.http.get<Product[]>('/api/products').pipe(
  catchError(() => of([]))
);
```

Rethrow:

```ts
products$ = this.http.get<Product[]>('/api/products').pipe(
  catchError(error => {
    console.error('Product request failed', error);
    return throwError(() => error);
  })
);
```

Rule of thumb:

```text
Return fallback when the UI can continue. Rethrow when a higher layer should decide what to do.
```

**8. Retry Handling**
Use retry for temporary failures, but avoid retrying every error blindly.

```ts
getProducts() {
  return this.http.get<Product[]>('/api/products').pipe(
    retry({ count: 2, delay: 1000 }),
    catchError(error => {
      return throwError(() => error);
    })
  );
}
```

Better conditional approach:

```ts
getProducts() {
  return this.http.get<Product[]>('/api/products').pipe(
    retry({
      count: 2,
      delay: (error: HttpErrorResponse) => {
        if (error.status >= 500 || error.status === 0) {
          return timer(1000);
        }

        return throwError(() => error);
      },
    })
  );
}
```

Use case:

```text
Retry network or 5xx errors. Do not retry validation errors like 400 or unauthorized errors like 401.
```

**9. Form and Validation Errors**
Form validation errors are not usually exceptions. They are expected states.

```ts
form = new FormGroup({
  email: new FormControl('', [
    Validators.required,
    Validators.email,
  ]),
});
```

```html
<input formControlName="email" />

@if (form.controls.email.hasError('required')) {
  <p>Email is required</p>
}

@if (form.controls.email.hasError('email')) {
  <p>Enter a valid email</p>
}
```

Good interview point:

```text
I do not throw exceptions for normal form validation. I use Angular validators and show validation messages through form state.
```

**10. Route-Level Error Handling**
Route errors often happen in guards, resolvers, or lazy-loaded modules.

Resolver example:

```ts
export const userResolver: ResolveFn<User | null> = route => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.getUser(Number(route.paramMap.get('id'))).pipe(
    catchError(() => {
      router.navigate(['/not-found']);
      return of(null);
    })
  );
};
```

Guard example:

```ts
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
```

Use case:

```text
Handle navigation-related errors at the routing layer, not inside random components.
```

**11. Component-Level Error Boundary Pattern**
Angular does not have React-style error boundaries in the same way, but you can create state-based boundaries.

```ts
@Component({
  selector: 'app-safe-panel',
  template: `
    @if (error) {
      <p class="error">Something went wrong.</p>
      <button (click)="reload()">Retry</button>
    } @else {
      <ng-content />
    }
  `,
})
export class SafePanelComponent {
  error = false;

  reload() {
    this.error = false;
  }
}
```

For real recoverable errors, you usually model the error in component state:

```ts
loadData() {
  this.loading = true;
  this.error = '';

  this.api.getDashboard().pipe(
    catchError(() => {
      this.error = 'Could not load dashboard';
      return of(null);
    }),
    finalize(() => {
      this.loading = false;
    })
  ).subscribe(data => {
    this.dashboard = data;
  });
}
```

**12. Service Layer Error Mapping**
A clean pattern is to keep raw HTTP details in services and expose domain-friendly errors.

```ts
export class UserNotFoundError extends Error {}
export class NetworkUnavailableError extends Error {}

getUser(id: number): Observable<User> {
  return this.http.get<User>(`/api/users/${id}`).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 404) {
        return throwError(() => new UserNotFoundError());
      }

      if (error.status === 0) {
        return throwError(() => new NetworkUnavailableError());
      }

      return throwError(() => error);
    })
  );
}
```

Component:

```ts
this.userService.getUser(id).pipe(
  catchError(error => {
    if (error instanceof UserNotFoundError) {
      this.message = 'User not found';
    } else {
      this.message = 'Unexpected error';
    }

    return of(null);
  })
).subscribe();
```

Use case:

```text
The service translates technical errors into domain errors. The component decides how to display them.
```

**13. Promise / `async await` Handling**
If you use promises, use `try/catch`.

```ts
async loadUser() {
  try {
    this.user = await firstValueFrom(this.userService.getUser(1));
  } catch (error) {
    this.errorMessage = 'Unable to load user';
  }
}
```

Avoid unhandled promise rejections:

```ts
this.loadUser().catch(error => {
  console.error('Load user failed', error);
});
```

**14. What Angular Catches vs What You Catch**
Angular catches errors in framework-invoked code, such as:
- Component constructors
- Lifecycle hooks
- Template evaluation
- Some framework-managed async paths

You catch errors in code you directly call:
- Service method calls
- Button click business logic
- HTTP observables
- Promise chains
- Form submission flows

Example:

```ts
onSubmit() {
  try {
    this.paymentService.validate(this.form.value);
  } catch {
    this.error = 'Invalid payment details';
  }
}
```

**15. What Not To Do**
Avoid swallowing errors silently:

```ts
catchError(() => EMPTY)
```

This can make bugs invisible.

Better:

```ts
catchError(error => {
  this.logger.error(error);
  this.message = 'Something went wrong';
  return of(null);
})
```

Avoid showing raw backend messages directly:

```ts
this.message = error.error.message;
```

Better:

```ts
this.message = 'Unable to save changes. Please try again.';
```

Avoid using global `ErrorHandler` for expected business cases like:
- Invalid login
- User not found
- Required field missing
- 400 validation failure
- Empty search result

**16. Testing Error Handling**
Test local fallback behavior:

```ts
it('shows error when user load fails', () => {
  userService.getUser.and.returnValue(
    throwError(() => new Error('Failed'))
  );

  component.loadUser();

  expect(component.errorMessage).toBe('Unable to load user');
});
```

Test global handler:

```ts
it('logs global errors', () => {
  const handler = TestBed.inject(ErrorHandler);

  spyOn(console, 'error');

  handler.handleError(new Error('Boom'));

  expect(console.error).toHaveBeenCalled();
});
```

Angular TestBed rethrows unexpected framework errors by default, which is useful because tests should not hide unexpected exceptions.

**Interview Answer**
A polished interview answer could sound like this:

```text
In Angular, I separate expected recoverable errors from unexpected errors. Expected errors are handled locally in components, services, forms, guards, resolvers, or RxJS streams using try/catch and catchError. This lets me show specific messages and recover with fallback state. For cross-cutting HTTP behavior, I use interceptors, especially for 401, 403, 500, logging, and retry rules. For unexpected unhandled exceptions, I provide a custom ErrorHandler and optionally browser global error listeners to send errors to monitoring. I avoid relying on global handlers for business errors because they lack the context needed for good recovery.
```