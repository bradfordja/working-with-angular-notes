# Explain template-driven forms

## Template-driven forms are a way to handle form inputs and validations in Angular using the template of your component. It's called "template-driven" because you define the form structure directly in the HTML template. These forms are easy to set up and are suitable for simple forms with basic validations.

Let's create a simple example of a template-driven form for user registration:

### 1. **Step 1: Import FormsModule**
   First, you need to import the `FormsModule` in your Angular module to enable template-driven forms.

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Import FormsModule

@NgModule({
  imports: [BrowserModule, FormsModule], // Add FormsModule to the imports array
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### 2. **Step 2: Create the Form in the Template**
   In your component's HTML template, you can create the form using form controls like `<input>`, `<select>`, and `<textarea>`. You can use Angular's two-way data binding (using `[(ngModel)]`) to link form controls to properties in your component.

```html
<form (ngSubmit)="onSubmit()">
  <div>
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" [(ngModel)]="user.name" required>
  </div>

  <div>
    <label for="email">Email:</label>
    <input type="email" id="email" name="email" [(ngModel)]="user.email" required>
  </div>

  <div>
    <label for="password">Password:</label>
    <input type="password" id="password" name="password" [(ngModel)]="user.password" required>
  </div>

  <button type="submit">Register</button>
</form>
```

### 3. **Step 3: Handle Form Submission**
   In your component class, you can define the `user` object to hold form data. You can then implement the `onSubmit()` method to handle form submission, perform validations, and submit the data to the server or perform any other actions.

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html'
})
export class RegistrationComponent {
  user = {
    name: '',
    email: '',
    password: ''
  };

  onSubmit() {
    if (this.isValid()) {
      // Submit the user data to the server or perform other actions
      console.log('User registered:', this.user);
    }
  }

  isValid() {
    // Perform custom validations if needed
    return this.user.name && this.user.email && this.user.password;
  }
}
```

In this example, we've created a simple registration form with fields for name, email, and password. We use `[(ngModel)]` to bind form controls to properties in the `user` object. The `onSubmit()` method handles form submission and `isValid()` method performs custom validations to check if the form is valid.

## Template-driven forms are easy to work with and are suitable for simple forms with basic validations. For more complex forms and validations, Angular also provides Reactive Forms, which offer greater flexibility and control.