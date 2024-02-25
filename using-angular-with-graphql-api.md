# Using GraphQL api

## Below is a sample Angular web application using GraphQL to manage users. We'll create modules, components, and services to handle CRUD operations (create, read, update, delete) for users.

### 1. **Modules:**

We'll create two modules: `AppModule` (the root module) and `UsersModule` (a feature module for user-related components).

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { UsersModule } from './users/users.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, UsersModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```typescript
// users/users.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './users-list/users-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserService } from './user.service';

@NgModule({
  declarations: [UsersListComponent, UserDetailComponent, UserFormComponent],
  imports: [CommonModule],
  providers: [UserService]
})
export class UsersModule { }
```

### 2. **Components:**

We'll create three components: `UsersListComponent` (to list all users), `UserDetailComponent` (to view user details), and `UserFormComponent` (to create/update users).

```typescript
// users/users-list/users-list.component.ts
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user.model';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html'
})
export class UsersListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe(users => this.users = users);
  }
}
```

```typescript
// users/user-detail/user-detail.component.ts
import { Component, Input } from '@angular/core';
import { User } from '../user.model';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html'
})
export class UserDetailComponent {
  @Input() user: User;
}
```

```typescript
// users/user-form/user-form.component.ts
import { Component, Input } from '@angular/core';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent {
  @Input() user: User;

  constructor(private userService: UserService) { }

  saveUser() {
    if (this.user.id) {
      this.userService.updateUser(this.user).subscribe();
    } else {
      this.userService.createUser(this.user).subscribe();
    }
  }

  deleteUser() {
    if (this.user.id) {
      this.userService.deleteUser(this.user.id).subscribe();
    }
  }
}
```

### 3. **Services:**

We'll create a `UserService` to interact with the GraphQL API for user operations.

```typescript
// users/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable()
export class UserService {
  private apiUrl = 'https://api.example.com/graphql'; // Replace with your GraphQL API endpoint

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    // Implement your GraphQL query to get users
    // Example: return this.http.post<User[]>(this.apiUrl, { query: 'YOUR_GRAPHQL_QUERY' });
  }

  createUser(user: User): Observable<User> {
    // Implement your GraphQL mutation to create a user
    // Example: return this.http.post<User>(this.apiUrl, { query: 'YOUR_GRAPHQL_MUTATION', variables: { input: user } });
  }

  updateUser(user: User): Observable<User> {
    // Implement your GraphQL mutation to update a user
    // Example: return this.http.post<User>(this.apiUrl, { query: 'YOUR_GRAPHQL_MUTATION', variables: { input: user } });
  }

  deleteUser(userId: string): Observable<any> {
    // Implement your GraphQL mutation to delete a user
    // Example: return this.http.post<any>(this.apiUrl, { query: 'YOUR_GRAPHQL_MUTATION', variables: { id: userId } });
  }
}
```

**Sample Use-case:**

In this sample application, you can create, read, update, and delete users. The `UsersListComponent` fetches the list of users using the `UserService`, and the `UserFormComponent` allows you to create new users or update existing ones. The `UserDetailComponent` displays the details of a selected user.

Please note that the actual GraphQL queries and mutations will depend on your specific GraphQL API and server implementation. Replace the placeholders in the code with the correct API endpoints and GraphQL queries/mutations to make the application work with your backend.

## This sample application demonstrates how to build an Angular web app using GraphQL APIs to manage users. It covers the implementation of modules, components, and services to handle user data CRUD operations efficiently.