# Explain guards 

## Angular guards are interfaces that allow you to control navigation between routes. They serve as checkpoints, determining whether or not navigation can proceed. Here’s a basic rundown of the guards you mentioned:

### 1. **CanActivate**:
    - Purpose: Decide if a route can be activated.
    - Example: Preventing unauthorized users from accessing a page.
    ```typescript
    class AuthGuard implements CanActivate {
      constructor(private authService: AuthService) {}

      canActivate(): boolean {
        return this.authService.isLoggedIn();
      }
    }
    ```

### 2. **CanActivateChild**:
    - Purpose: Decide if child routes of a route can be activated.
    - Example: Blocking access to all child routes of an admin section for unauthorized users.
    ```typescript
    class ChildAuthGuard implements CanActivateChild {
      constructor(private authService: AuthService) {}

      canActivateChild(): boolean {
        return this.authService.isAdmin();
      }
    }
    ```

### 3. **CanLoad**:
    - Purpose: Decide if a module can be loaded lazily.
    - Example: Preventing the application from lazily loading a module for users without specific permissions.
    ```typescript
    class LoadGuard implements CanLoad {
      constructor(private authService: AuthService) {}

      canLoad(): boolean {
        return this.authService.canLoadModule();
      }
    }
    ```

### 4. **CanDeactivate**:
    - Purpose: Decide if navigation away from a route can proceed.
    - Example: Warning a user about unsaved changes before they leave a page.
    ```typescript
    class UnsavedChangesGuard implements CanDeactivate<SomeComponent> {
      canDeactivate(component: SomeComponent): boolean {
        return component.areChangesSaved() || window.confirm("Unsaved changes! Are you sure you want to leave?");
      }
    }
    ```

### 5. **Resolve**:
    - Purpose: Pre-fetch data before a route is activated.
    - Example: Ensuring user data is fetched before displaying a user profile.
    ```typescript
    class UserProfileResolver implements Resolve<User> {
      constructor(private userService: UserService) {}

      resolve(route: ActivatedRouteSnapshot): Observable<User> {
        const userId = route.paramMap.get('id');
        return this.userService.getUserById(userId);
      }
    }
    ```

These guards can be added to your routes in the route configuration:

```typescript
const routes: Routes = [
  { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard], resolve: { user: UserProfileResolver } },
  //... other routes
];
```

## Remember, the above examples are simple and for illustrative purposes. In real-world applications, you might have to handle more complex scenarios with these guards.