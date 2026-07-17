# Angular JWT Micro Frontend Sample

This is an interview-prep sample app that demonstrates a micro-frontend-style Angular shell using standalone components, route-level lazy loading, JWT-based authentication, permission-based authorization, guarded navigation, and sample feature views.

## Architecture

- `src/main.ts` is the shell application.
- `src/remotes/orders/orders.component.ts` is a lazy standalone orders feature.
- `src/remotes/billing/billing.component.ts` is a lazy standalone billing feature.
- `src/remotes/admin/admin.component.ts` is a lazy standalone admin feature.
- The shell owns login, JWT storage, route guards, menu filtering, and the HTTP JWT interceptor.
- Feature areas are loaded with `loadComponent`, which models micro frontend boundaries without requiring Module Federation tooling.

In a production micro frontend setup, these route-level boundaries could be moved into separately deployed remotes with Module Federation, import maps, or another runtime composition strategy.

## Demo Identities

| Identity | Role | Permissions |
| --- | --- | --- |
| Analyst | `user` | `orders:read`, `orders:create` |
| Manager | `manager` | `orders:read`, `orders:create`, `billing:read` |
| Admin | `admin` | `orders:read`, `orders:create`, `billing:read`, `admin:read`, `users:write` |

## Routes

| Route | View | Access |
| --- | --- | --- |
| `/login` | Sign-in screen | Public |
| `/dashboard` | Shell dashboard | Authenticated |
| `/orders` | Orders remote | `orders:read` |
| `/billing` | Billing remote | `billing:read` |
| `/admin` | Admin remote | `admin:read` |
| `/forbidden` | 403 page | Authenticated |

## Security Notes

This app creates a demo JWT in the browser so the flow is easy to inspect during interview prep. That is not how production tokens should be issued.

Production rules:

- Issue JWTs from a trusted backend or identity provider.
- Verify signature, issuer, audience, expiration, and token purpose on the server.
- Treat frontend route guards and menu filtering as UX only.
- Enforce authorization on every backend API request.
- Prefer HttpOnly Secure SameSite cookies or a BFF pattern for high-security browser apps.
- Avoid storing refresh tokens in `localStorage`.

## Run

```bash
npm install
npm start
```

Then open:

```txt
http://127.0.0.1:4200
```

## Interview Talking Points

- Standalone components remove the need for feature NgModules.
- `loadComponent` lazy-loads feature boundaries only when the user can navigate to them.
- `canMatch` prevents unauthorized lazy bundles from loading.
- The shell owns authentication state and route policy.
- Remote features stay focused on domain UI.
- JWT claims are useful for client UX but should not replace backend authorization.
