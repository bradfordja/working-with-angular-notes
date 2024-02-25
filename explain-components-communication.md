# Angular Component to Component Communicate

## In Angular, components often need to communicate with each other to share data or events. This communication can be achieved in various ways, depending on the relationship between the components (parent-child, unrelated, etc.). Below are different approaches to enable communication between Angular components:

### 1. Parent to Child Communication

- **Using `@Input()` Decorator**: The parent component can pass data down to its child components using the `@Input()` decorator.
  
  **Parent Component HTML:**
  ```html
  <app-child [childMessage]="parentMessage"></app-child>
  ```
  
  **Child Component TypeScript:**
  ```typescript
  import { Component, Input } from '@angular/core';

  @Component({
    selector: 'app-child',
    template: `<p>{{ childMessage }}</p>`
  })
  export class ChildComponent {
    @Input() childMessage: string;
  }
  ```

### 2. Child to Parent Communication

- **Using `@Output()` Decorator and `EventEmitter`**: The child component can send data back to the parent using the `@Output()` decorator along with an `EventEmitter`.
  
  **Child Component TypeScript:**
  ```typescript
  import { Component, Output, EventEmitter } from '@angular/core';

  @Component({
    selector: 'app-child',
    template: `<button (click)="sendMessage()">Send Message</button>`
  })
  export class ChildComponent {
    @Output() messageEvent = new EventEmitter<string>();

    sendMessage() {
      this.messageEvent.emit('Hello from Child!');
    }
  }
  ```
  
  **Parent Component HTML:**
  ```html
  <app-child (messageEvent)="receiveMessage($event)"></app-child>
  ```

### 3. Through a Shared Service

- **Using a Service**: For components that do not have a direct parent-child relationship, a shared service using Angular's dependency injection can facilitate communication. The service can use observables (such as `BehaviorSubject`) to allow components to subscribe and react to data changes.
  
  **Shared Service:**
  ```typescript
  import { Injectable } from '@angular/core';
  import { BehaviorSubject } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class SharedService {
    private messageSource = new BehaviorSubject<string>('default message');
    currentMessage = this.messageSource.asObservable();

    changeMessage(message: string) {
      this.messageSource.next(message);
    }
  }
  ```
  
  **Component Subscription:**
  ```typescript
  import { Component, OnInit } from '@angular/core';
  import { SharedService } from './shared.service';

  @Component({
    selector: 'app-sibling',
    template: `<p>{{ message }}</p>`
  })
  export class SiblingComponent implements OnInit {
    message: string;

    constructor(private sharedService: SharedService) { }

    ngOnInit() {
      this.sharedService.currentMessage.subscribe(message => this.message = message);
    }
  }
  ```

### 4. Using ViewChild and ViewChildren

- **`@ViewChild` and `@ViewChildren`**: These decorators can be used for parent components to call methods or access properties of child components directly.
  
  **Parent Component TypeScript:**
  ```typescript
  import { Component, ViewChild } from '@angular/core';
  import { ChildComponent } from './child.component';

  @Component({
    selector: 'app-parent',
    template: `<app-child></app-child>`
  })
  export class ParentComponent {
    @ViewChild(ChildComponent) child: ChildComponent;

    ngAfterViewInit() {
      console.log(this.child.childMessage);
    }
  }
  ```

### 5. Using NgModel with Two-Way Binding

- For simple scenarios where a parent and child need to share and edit the same data, `[(ngModel)]` can be used for two-way binding.
  
  **Parent Component HTML:**
  ```html
  <app-child [(ngModel)]="parentMessage"></app-child>
  ```

# Each of these methods has its own use case and advantages, depending on the structure and requirements of your Angular application. Understanding when and how to use these communication strategies is key to building efficient and maintainable Angular applications.