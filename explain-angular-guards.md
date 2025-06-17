# 🛡️ Angular Route Guards — Deep Dive for Senior Interviews

## 📌 What Are Angular Guards?

**Angular Route Guards** are interfaces that allow you to **control navigation** to and from routes based on custom logic (e.g., authentication, roles, unsaved changes, etc.).

Guards are executed **before routing** occurs, and they return:
- `true` / `false`
- A `UrlTree` for redirection
- An `Observable<boolean | UrlTree>`
- A `Promise<boolean | UrlTree>`

---

## 🧩 Core Types of Route Guards

### 1. `CanActivate`
Controls whether the route can be **navigated to**.

```ts
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    return this.authService.isLoggedIn()
      ? true
      : this.router.parseUrl('/login');
  }
}
```

### 2. `CanActivateChild`
Controls whether **child routes** can be activated.

```ts
@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivateChild {
  constructor(private auth: AuthService) {}

  canActivateChild(): boolean {
    return this.auth.hasRole('admin');
  }
}
```

### 3. `CanDeactivate<T>`
Checks if the user can leave the current route (used for unsaved form warnings).

```ts
export interface CanComponentDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({ providedIn: 'root' })
export class UnsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate): boolean | Observable<boolean> {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
```

### 4. `CanLoad`
Prevents **lazy-loaded modules** from loading unless condition is met.

```ts
@Injectable({ providedIn: 'root' })
export class AuthLoadGuard implements CanLoad {
  constructor(private auth: AuthService) {}

  canLoad(): boolean {
    return this.auth.isLoggedIn();
  }
}
```

### 5. `Resolve<T>`
Preloads data before the route gets activated.

```ts
@Injectable({ providedIn: 'root' })
export class UserResolver implements Resolve<User> {
  constructor(private userService: UserService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    return this.userService.getUserById(route.params['id']);
  }
}
```

---

## 🔧 Applying Guards in Routes

```ts
const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivateChild: [AdminGuard],
    children: [
      { path: 'settings', component: AdminSettingsComponent }
    ]
  },
  {
    path: 'edit-profile',
    component: EditProfileComponent,
    canDeactivate: [UnsavedChangesGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
    canLoad: [AuthLoadGuard]
  },
  {
    path: 'profile/:id',
    component: UserProfileComponent,
    resolve: { user: UserResolver }
  }
];
```

---

## 📘 Common Angular Guard Interview Questions

### 1. Difference between `CanActivate` vs `CanLoad`?
- `CanActivate`: Prevents navigation to a route.
- `CanLoad`: Prevents lazy-loaded module from being downloaded.

---

### 2. When to use `CanDeactivate`?
Use it to **warn users about unsaved changes** before leaving a form page.

---

### 3. Can Guards return Observables?
Yes. All guards can return `Observable<boolean | UrlTree>`, `Promise<boolean>`, or `boolean`.

---

### 4. How does a `Resolver` work?
It runs **before** the component loads and injects data into the route.

---

### 5. Can multiple guards be used on a route?
Yes. You can apply multiple guards in arrays like `canActivate: [AuthGuard, AdminGuard]`.

---

## ✅ Summary

| Guard Type         | Purpose                                   |
|--------------------|-------------------------------------------|
| `CanActivate`      | Block or allow route navigation           |
| `CanActivateChild` | Block or allow navigation to child routes |
| `CanDeactivate`    | Prevent exit with unsaved changes         |
| `CanLoad`          | Block lazy-loaded modules                 |
| `Resolve`          | Preload data before routing               |

---

Angular Guards are essential for building **secure**, **predictable**, and **user-friendly** routing flows in modern Angular applications.

