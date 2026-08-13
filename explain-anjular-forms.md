# Angular Forms — Senior Interview Prep

Angular provides two primary approaches for building forms:

Approach	Best For
Template-Driven Forms	Small/simple forms
Reactive Forms	Complex, scalable, enterprise applications

For a senior Angular interview, spend most of your preparation on Reactive Forms.

## 1. Template-Driven vs Reactive Forms

Template-Driven Forms

Most of the form logic is defined in the HTML template using directives such as ngModel.
```html
<form #userForm="ngForm">
  <input
    type="text"
    name="username"
    [(ngModel)]="username"
    required
  />
  <button [disabled]="userForm.invalid">
    Submit
  </button>
</form>
```
Characteristics:

Simple
Less TypeScript
Two-way binding
Uses ngModel
Good for small forms
Less control for complex validation

Reactive Forms

The form model is created explicitly in TypeScript.
```ts
import {
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
userForm = new FormGroup({
  username: new FormControl('', Validators.required),
  email: new FormControl('', [
    Validators.required,
    Validators.email
  ])
});
```
HTML:
```html
<form
  [formGroup]="userForm"
  (ngSubmit)="submit()">
  <input formControlName="username">
  <input formControlName="email">
  <button
    type="submit"
    [disabled]="userForm.invalid">
    Submit
  </button>
</form>
```
For enterprise applications, Reactive Forms are usually preferred because they’re easier to test and support complex validation, dynamic controls, and reactive programming.

⸻

## 2. Important Reactive Form Classes

You should know these four extremely well:
```ts
FormControl
FormGroup
FormArray
FormBuilder
```
FormControl

Represents one input.

name = new FormControl('');

Conceptually:
```tx
FormControl
     │
     ├── value
     ├── valid / invalid
     ├── touched / untouched
     ├── dirty / pristine
     └── errors
```
For example:
```ts
email = new FormControl('', [
  Validators.required,
  Validators.email
]);
```
⸻

## 3. FormGroup

A FormGroup represents a collection of controls.
```ts
userForm = new FormGroup({
  firstName: new FormControl(''),
  lastName: new FormControl(''),
  email: new FormControl('', [
    Validators.required,
    Validators.email
  ])
});
```
Get the entire object:
```ts
console.log(this.userForm.value);
```
Result:
```ts
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john@example.com"
}
```
Access one field:
```ts
this.userForm.get('email')?.value;
```
⸻

## 4. FormBuilder

FormBuilder reduces boilerplate.

Instead of:
```ts
new FormGroup({
  firstName: new FormControl(''),
  lastName: new FormControl('')
});
```
you can use:
```ts
constructor(
  private fb: FormBuilder
) {}
userForm = this.fb.group({
  firstName: [''],
  lastName: [''],
  email: ['', [
    Validators.required,
    Validators.email
  ]]
});
```
Modern Angular also supports strongly typed/non-nullable forms:
```ts
private fb = inject(NonNullableFormBuilder);
userForm = this.fb.group({
  firstName: [''],
  lastName: [''],
  email: ['', [
    Validators.required,
    Validators.email
  ]]
});
```
This gives better TypeScript type safety.

⸻

## 5. FormArray

This is a common senior interview topic.

Use FormArray when the number of fields is dynamic.

For example, a user can have multiple phone numbers:
```tx
User
 ├── name
 ├── email
 └── phones
      ├── phone 1
      ├── phone 2
      └── phone 3
```
Example:
```ts
userForm = this.fb.group({
  name: [''],
  phones: this.fb.array([])
});
```
Getter:
```ts
get phones(): FormArray {
  return this.userForm.get('phones') as FormArray;
}
```
Add a phone:
```ts
addPhone(): void {
  this.phones.push(
    this.fb.control('')
  );
}
```
Remove:
```ts
removePhone(index: number): void {
  this.phones.removeAt(index);
}
```
⸻

## 6. Built-in Validators

Angular provides common validators.
```ts
email: ['', [
  Validators.required,
  Validators.email
]]
```
Other examples:
```ts
Validators.required
Validators.email
Validators.minLength(8)
Validators.maxLength(50)
Validators.min(18)
Validators.max(100)
Validators.pattern(...)
```
Example password:
```ts
password: ['', [
  Validators.required,
  Validators.minLength(8)
]]
```
⸻

## 7. Displaying Validation Errors

You usually don’t want errors displayed before the user interacts with a field.
```ts
@if (
  userForm.get('email')?.invalid &&
  userForm.get('email')?.touched
) {
  <div>
    Invalid email address
  </div>
}
```
Better:
```ts
@if (
  userForm.controls.email.hasError('required') &&
  userForm.controls.email.touched
) {
  <span>Email is required.</span>
}
@if (
  userForm.controls.email.hasError('email')
) {
  <span>Enter a valid email.</span>
}
```
⸻

## 8. Form State

Angular automatically tracks form state.

valid
invalid
dirty
pristine
touched
untouched
pending
disabled
enabled

Interview example:

What is the difference between dirty and touched?

dirty means the user changed the value.

touched means the user entered and then left the control.

⸻

## 9. setValue() vs patchValue()

This is a very common Angular interview question.

Suppose:

userForm = this.fb.group({
  firstName: [''],
  lastName: [''],
  email: ['']
});

setValue()

You must provide every control:

this.userForm.setValue({
  firstName: 'John',
  lastName: 'Smith',
  email: 'john@example.com'
});

This would fail:

this.userForm.setValue({
  firstName: 'John'
});

because fields are missing.

patchValue()

Updates only specified fields:

this.userForm.patchValue({
  firstName: 'John'
});

Easy interview answer:

setValue() requires the complete form structure, while patchValue() allows partial updates.

⸻

## 10. valueChanges

Reactive Forms integrate naturally with RxJS.

this.userForm
  .get('email')
  ?.valueChanges
  .subscribe(value => {
    console.log(value);
  });

A practical search example:

this.searchControl.valueChanges
  .pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(search =>
      this.api.search(search)
    )
  )
  .subscribe(results => {
    this.results = results;
  });

This is an excellent senior-level example because it combines:

Reactive Forms
      ↓
valueChanges
      ↓
RxJS
      ↓
debounceTime
      ↓
distinctUntilChanged
      ↓
switchMap
      ↓
REST API

⸻

## 11. Custom Validators

Suppose usernames cannot contain spaces.

import {
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
export function noSpacesValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value;
  if (value?.includes(' ')) {
    return {
      noSpaces: true
    };
  }
  return null;
}

Use it:

username: ['', [
  Validators.required,
  noSpacesValidator
]]

⸻

## 12. Cross-Field Validation

Another important senior topic.

Example:

password
confirmPassword

You need to compare two fields.

export function passwordMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  const password =
    control.get('password')?.value;
  const confirmPassword =
    control.get('confirmPassword')?.value;
  return password === confirmPassword
    ? null
    : { passwordMismatch: true };
}

Apply it to the group:

userForm = this.fb.group(
  {
    password: [''],
    confirmPassword: ['']
  },
  {
    validators: passwordMatchValidator
  }
);

Notice that the validator is attached to the FormGroup, because validation depends on multiple controls.

⸻

## 13. Async Validators

An async validator typically calls a backend.

Example:

User enters username
       ↓
Angular
       ↓
API call
       ↓
Does username exist?
       ↓
YES → invalid
NO  → valid

For example:

usernameExistsValidator(
  control: AbstractControl
): Observable<ValidationErrors | null> {
  return this.userService
    .usernameExists(control.value)
    .pipe(
      map(exists =>
        exists
          ? { usernameExists: true }
          : null
      )
    );
}

This is useful for:

Username availability
Email uniqueness
Account-number validation
Server-side business rules

⸻

## 14. Submitting a Form to REST API

A typical enterprise flow:

submit(): void {
  if (this.userForm.invalid) {
    this.userForm.markAllAsTouched();
    return;
  }
  const request = this.userForm.getRawValue();
  this.userService
    .createUser(request)
    .subscribe({
      next: response => {
        console.log('Created:', response);
      },
      error: error => {
        console.error(error);
      }
    });
}

Service:

createUser(user: UserRequest) {
  return this.http.post<UserResponse>(
    '/api/users',
    user
  );
}

Architecture:

HTML Form
    ↓
FormGroup
    ↓
Validators
    ↓
Component
    ↓
Service
    ↓
HttpClient
    ↓
POST /api/users
    ↓
Spring Boot / Node API

⸻

## 15. reset()

After successful submission:

this.userForm.reset();

You can also reset with defaults:

this.userForm.reset({
  firstName: '',
  lastName: '',
  email: ''
});

⸻

## 16. Disabled Controls and getRawValue()

This is a useful senior interview gotcha.

Suppose:

userForm = this.fb.group({
  username: ['john'],
  accountId: [{ value: '12345', disabled: true }]
});

Calling:

this.userForm.value

normally excludes disabled controls.

But:

this.userForm.getRawValue();

includes them.

Interview answer:

“value excludes disabled controls, while getRawValue() includes them.”

⸻

## 17. ControlValueAccessor

For senior Angular roles, understand ControlValueAccessor.

It allows a custom component to behave like a native Angular form control.

For example:

<app-phone-number
  formControlName="phone">
</app-phone-number>

Your custom component can participate in:

FormControl
validation
dirty/touched state
disabled state
value changes

This is important when building reusable enterprise component libraries.

⸻

## 18. Common Interview Questions

Why use Reactive Forms?

Reactive Forms provide explicit form models, strong testability, complex validation, dynamic controls, RxJS integration, and better scalability for enterprise applications.

FormGroup vs FormControl?

A FormControl represents an individual field, while a FormGroup manages a collection of related controls.

FormGroup vs FormArray?

FormGroup represents a known structure with named controls; FormArray represents a dynamic collection of controls.

setValue() vs patchValue()?

setValue() requires the entire structure; patchValue() performs partial updates.

Synchronous vs asynchronous validators?

Synchronous validators immediately return validation results. Async validators return a Promise or Observable and are commonly used for server-side validation.

What is valueChanges?

It’s an Observable that emits whenever the value of a control or form changes.

What is ControlValueAccessor?

It is Angular’s interface for integrating custom components with Angular’s forms API.

Does Angular form validation replace backend validation?

No. Client-side validation improves UX, but the backend must independently validate all incoming data.

⸻

Senior-level answer to memorize

“Angular provides Template-Driven and Reactive Forms. For enterprise applications, I generally prefer Reactive Forms because they provide an explicit, testable form model and work well with RxJS. I use FormControl for individual fields, FormGroup for structured forms, and FormArray for dynamic collections. Validation can be synchronous, asynchronous, or cross-field. I use typed forms for compile-time safety, valueChanges for reactive behavior, and ControlValueAccessor when creating reusable custom form components. Client-side validation improves user experience, but the API remains responsible for authoritative validation and security.”

That answer covers most of what a senior interviewer wants to hear.