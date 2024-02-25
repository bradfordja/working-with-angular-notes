# Route events

# List of route events that are fire by the Angular Router.  The Angular Router emits navigation events through the `Router.events` property, which you can subscribe to. Here are the main route events:

### 1. NavigationStart:
Fired when navigation starts.

**Use-case**: Useful for starting a spinner/loading indicator.

```typescript
router.events.subscribe(event => {
  if (event instanceof NavigationStart) {
    // Start loading spinner
  }
});
```

### 2. RouteConfigLoadStart:
Fired before the `Router` lazy loads a route configuration.

**Use-case**: Indicating to the user that data is being fetched before a lazy-loaded component is rendered.

```typescript
router.events.subscribe(event => {
  if (event instanceof RouteConfigLoadStart) {
    // Indicate data fetch for lazy-loaded component
  }
});
```

### 3. RouteConfigLoadEnd:
Fired after a route has been lazy loaded.

**Use-case**: Useful for stopping any indication or spinner that signifies data fetching for lazy-loaded components.

```typescript
router.events.subscribe(event => {
  if (event instanceof RouteConfigLoadEnd) {
    // Stop indicating data fetch for lazy-loaded component
  }
});
```

### 4. NavigationEnd:
Fired when navigation ends successfully.

**Use-case**: Stopping a spinner/loading indicator or logging successful navigations.

```typescript
router.events.subscribe(event => {
  if (event instanceof NavigationEnd) {
    // Stop loading spinner
    // Log successful navigation
  }
});
```

### 5. NavigationCancel:
Fired when navigation is canceled, for instance, by a route guard.

**Use-case**: Resetting UI elements or alerting the user about an unsuccessful navigation attempt due to conditions like unsaved changes.

```typescript
router.events.subscribe(event => {
  if (event instanceof NavigationCancel) {
    // Alert user about navigation cancel
  }
});
```

### 6. NavigationError:
Fired when navigation errors, due to an unexpected error.

**Use-case**: Displaying a generic error message to users or redirecting them to an error page.

```typescript
router.events.subscribe(event => {
  if (event instanceof NavigationError) {
    // Display error message or redirect to an error page
  }
});
```

### 7. GuardsCheckStart:
Fired when the router begins the guards phase of navigation.

**Use-case**: Debugging or logging the start of the guard checks.

```typescript
router.events.subscribe(event => {
  if (event instanceof GuardsCheckStart) {
    // Log the start of the guard check phase
  }
});
```

### 8. ChildActivationStart:
Fired when the router begins activating a route's children.

**Use-case**: Initiating specific logic before child route activation.

```typescript
router.events.subscribe(event => {
  if (event instanceof ChildActivationStart) {
    // Logic before child route activation
  }
});
```

### 9. ActivationStart:
Fired when the router starts activating a route.

**Use-case**: Triggering animations or logging route activation start.

```typescript
router.events.subscribe(event => {
  if (event instanceof ActivationStart) {
    // Logic or animations before route activation
  }
});
```

### 10. GuardsCheckEnd:
Fired when the router finishes the guards phase of navigation.

**Use-case**: Logging the completion of the guard checks.

```typescript
router.events.subscribe(event => {
  if (event instanceof GuardsCheckEnd) {
    // Log the end of the guard check phase
  }
});
```

### 11. ResolveStart:
Fired when the router starts resolving route data.

**Use-case**: Starting a spinner/loading indicator while waiting for data to be fetched.

```typescript
router.events.subscribe(event => {
  if (event instanceof ResolveStart) {
    // Start loading spinner for data fetch
  }
});
```

### 12. ResolveEnd:
Fired when the router finishes resolving route data.

**Use-case**: Stopping a spinner/loading indicator after data is fetched.

```typescript
router.events.subscribe(event => {
  if (event instanceof ResolveEnd) {
    // Stop loading spinner after data fetch
  }
});
```

### 13. ActivationEnd:
Fired when the router finishes activating a route.

**Use-case**: Concluding any animations or logic post route activation.

```typescript
router.events.subscribe(event => {
  if (event instanceof ActivationEnd) {
    // Conclude logic or animations after route activation
  }
});
```

### 14. ChildActivationEnd:
Fired when the router finishes activating a route's children.

**Use-case**: Finalizing specific logic after child route activation.

```typescript
router.events.subscribe(event => {
  if (event instanceof ChildActivationEnd) {
    // Logic after child route activation
  }
});
```

In summary, these route events provide hooks into various phases of the navigation process, allowing developers to execute logic at precise moments in the routing lifecycle.