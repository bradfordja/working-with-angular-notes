
# Using Angular patterns development

## Angular is a platform and framework for building single-page client applications using HTML and TypeScript. Angular developers often rely on design patterns to solve common problems in a consistent and efficient manner. These patterns help in making the code more modular, scalable, and maintainable. Here are some of the most common Angular patterns with explanations and sample use-cases, including code snippets:

### 1. Singleton Services

- **Explanation**: Singleton services are instances of a class that are created once and shared throughout the application. This pattern is useful for sharing data and functionality across components.
- **Use-case**: A user authentication service that stores the current user's information.
- **Code-snippet**:
```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User;

  constructor() { }

  setUser(user: User) {
    this.currentUser = user;
  }

  getUser(): User {
    return this.currentUser;
  }
}
```

### 2. Observable Data Services

- **Explanation**: This pattern involves creating services that use RxJS Observables to manage and stream data asynchronously across components.
- **Use-case**: A live chat application where messages need to be updated in real-time.
- **Code-snippet**:
```typescript
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

  addMessage(message: Message) {
    this.messagesSubject.next([...this.messagesSubject.value, message]);
  }
}
```

### 3. Lazy Loading Modules

- **Explanation**: Lazy loading is a pattern where you load Angular modules only when they are needed, rather than loading all at once. This improves the startup time.
- **Use-case**: Loading the admin module only when the user navigates to the admin section.
- **Code-snippet**:
```typescript
// In app-routing.module.ts
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];
```

### 4. Component Communication using @Input/@Output

- **Explanation**: This pattern involves parent-child component communication using `@Input` to pass data down to child components, and `@Output` along with `EventEmitter` to send data up from child to parent components.
- **Use-case**: A todo list where a parent component manages the list and child components display each todo item.
- **Code-snippet**:
```typescript
// Parent component
@Component({
  selector: 'app-todo-list',
  template: `<app-todo-item *ngFor="let todo of todos" [todo]="todo" (delete)="deleteTodo($event)"></app-todo-item>`
})
export class TodoListComponent {
  todos: Todo[] = [];
  
  deleteTodo(todo: Todo) {
    this.todos = this.todos.filter(t => t !== todo);
  }
}

// Child component
@Component({
  selector: 'app-todo-item',
  template: `<div>{{ todo.title }} <button (click)="onDelete()">Delete</button></div>`
})
export class TodoItemComponent {
  @Input() todo: Todo;
  @Output() delete = new EventEmitter<Todo>();

  onDelete() {
    this.delete.emit(this.todo);
  }
}
```

### 5. Decorators

- **Explanation**: Decorators are a design pattern used to separate modification or decoration of a class without modifying the original source code. In Angular, decorators like `@Component`, `@Directive`, `@Pipe`, and `@Injectable` are used extensively to define metadata for classes.
- **Use-case**: Defining a new component.
- **Code-snippet**:
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: `<h1>Hello, Angular!</h1>`
})
export class ExampleComponent {}
```

## These patterns are fundamental to Angular development, enabling developers to build robust, efficient, and scalable applications. By understanding and applying these patterns, developers can leverage Angular's powerful features to their fullest.