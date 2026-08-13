Angular typically handles JWT authentication by receiving a token after login, storing it appropriately, and using an HTTP interceptor to attach it to protected API requests.

The common architecture is:

Angular
   │
   │ POST /auth/login
   │ username + password
   ▼
Backend / Spring Boot
   │
   │ validates credentials
   │
   ▼
Returns JWT / establishes cookie
   │
   ▼
Angular
   │
   │ subsequent API request
   │ Authorization: Bearer <JWT>
   ▼
Spring Boot API
   │
   ▼
Validate JWT → Authorize → Response

1. Login request

Angular sends credentials to the backend:

export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  accessToken: string;
}
login(username: string, password: string) {
  const body: LoginRequest = {
    username,
    password
  };
  return this.http.post<LoginResponse>(
    '/api/auth/login',
    body
  );
}

The backend might return:

{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9..."
}

2. Where should Angular store the JWT?

There are two common approaches.

localStorage is easy:

localStorage.setItem('access_token', response.accessToken);

But it is accessible to JavaScript, so an XSS vulnerability could expose it.

For higher-security applications, a common design is to keep the access token short-lived/in memory and use a Secure, HttpOnly, SameSite cookie for the refresh/session credential. Because an HttpOnly cookie cannot be read by Angular JavaScript, it reduces token theft through XSS. Cookie-based designs also need appropriate CSRF protections.

3. HTTP interceptor

You don’t want every service doing this:

this.http.get('/api/users', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

Instead, use an interceptor.

With modern Angular’s functional interceptor style:

import {
  HttpInterceptorFn
} from '@angular/common/http';
export const authInterceptor: HttpInterceptorFn =
  (req, next) => {
    const token =
      localStorage.getItem('access_token');
    if (token) {
      const authRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(authRequest);
    }
    return next(req);
  };

Then configure it:

import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
});

Now:

this.http.get('/api/users');

automatically becomes approximately:

GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

4. Route protection with guards

Angular can also prevent users from navigating to protected pages.

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token =
    localStorage.getItem('access_token');
  if (token) {
    return true;
  }
  return router.createUrlTree(['/login']);
};

Route:

{
  path: 'admin',
  component: AdminComponent,
  canActivate: [authGuard]
}

However, this is only client-side navigation protection. It is not real authorization security.

The backend must still validate the JWT and permissions.

5. Roles and authorization

Suppose the JWT contains claims such as:

{
  "sub": "julio",
  "roles": [
    "USER",
    "ADMIN"
  ],
  "exp": 1786590000
}

Angular can use the claims to control the UI:

if (authService.hasRole('ADMIN')) {
  // display admin functionality
}

For example:

@if (authService.hasRole('ADMIN')) {
  <button>Delete User</button>
}

But again, hiding the button is not security.

The backend must enforce:

DELETE /api/users/100
JWT valid?
   ↓
ADMIN role?
   ↓
YES → execute
NO  → 403 Forbidden

6. Handle expired tokens

JWT access tokens should normally have a relatively short lifetime.

For example:

Access Token
    │
    ├── valid → API request succeeds
    │
    └── expired
          │
          ▼
       401
          │
          ▼
     Refresh flow
          │
          ▼
     New access token
          │
          ▼
      Retry request

An interceptor can detect:

if (error.status === 401) {
  // refresh authentication
}

A senior-level implementation must also prevent multiple simultaneous 401 responses from triggering multiple refresh requests. Usually you coordinate refresh with RxJS so one refresh operation supplies the new token to waiting requests.

7. 401 vs 403

This distinction is important in interviews:

401 Unauthorized
→ Authentication failed
→ Missing, invalid, or expired credentials
403 Forbidden
→ Authentication succeeded
→ User doesn't have permission

Senior interview answer

A concise answer would be:

“In Angular, I normally centralize JWT authentication in an authentication service and HTTP interceptor. After authentication, the access token is attached to API requests using the Authorization: Bearer header. Route guards control client-side navigation, while the backend remains responsible for validating the JWT and enforcing roles and permissions. For stronger security, I avoid treating localStorage as the ideal long-term token store; I prefer short-lived access tokens with a secure refresh/session strategy, often involving Secure, HttpOnly, SameSite cookies. I also handle token expiration and 401 responses centrally in the interceptor and prevent concurrent requests from causing multiple refresh operations.”

For a Spring Boot + Angular interview, the important distinction is: Angular manages the client authentication state and sends credentials; Spring Security performs the actual JWT validation and authorization.