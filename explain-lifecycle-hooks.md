# Angular lifecycle hook methods

## Here are the lifecycle hook methods with sample code snippets:

### 1. **ngOnChanges**:
   Sample Use-case: Reacting to changes in input properties.

```typescript
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-sample',
  template: '<p>{{ inputValue }}</p>'
})
export class SampleComponent implements OnChanges {
  @Input() inputValue: string;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.inputValue) {
      console.log('Input property changed:', changes.inputValue.currentValue);
    }
  }
}
```

### 2. **ngOnInit**:
   Sample Use-case: Performing initial setup tasks and fetching data.

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sample',
  template: '<p>{{ data }}</p>'
})
export class SampleComponent implements OnInit {
  data: string;

  ngOnInit() {
    this.data = 'Initialized data';
    this.fetchDataFromService();
  }

  fetchDataFromService() {
    // Fetch data from a service and update the 'data' property
  }
}
```

### 3. **ngDoCheck**:
   Sample Use-case: Implementing custom change detection logic.

```typescript
import { Component, DoCheck } from '@angular/core';

@Component({
  selector: 'app-sample',
  template: '<p>{{ data }}</p>'
})
export class SampleComponent implements DoCheck {
  data: string;

  ngDoCheck() {
    // Custom change detection logic
    if (this.data !== 'Updated data') {
      this.data = 'Updated data';
    }
  }
}
```

### 4. **ngAfterContentInit**:
   Sample Use-case: Accessing and manipulating content projected into the component.

```typescript
import { Component, AfterContentInit } from '@angular/core';

@Component({
  selector: 'app-sample',
  template: '<ng-content></ng-content>'
})
export class SampleComponent implements AfterContentInit {
  ngAfterContentInit() {
    // Access and manipulate content projected into the component
    console.log('Content projection completed.');
  }
}
```

### 5. **ngAfterContentChecked**:
   Sample Use-case: Additional actions related to content projection after change detection.

```typescript
import { Component, AfterContentChecked } from '@angular/core';

@Component({
  selector: 'app-sample',
  template: '<ng-content></ng-content>'
})
export class SampleComponent implements AfterContentChecked {
  ngAfterContentChecked() {
    // Additional actions related to content projection after change detection
    console.log('Content checked.');
  }
}
```

### 6. **ngAfterViewInit**:
   Sample Use-case: Interacting with the component's view and performing actions that require access to the DOM.

```typescript
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-sample',
  template: '<p #myParagraph>Sample text</p>'
})
export class SampleComponent implements AfterViewInit {
  @ViewChild('myParagraph') paragraph: ElementRef;

  ngAfterViewInit() {
    // Interact with the component's view (e.g., access the paragraph element)
    this.paragraph.nativeElement.style.color = 'red';
  }
}
```

### 7. **ngAfterViewChecked**:
   Sample Use-case: Additional actions related to the view after change detection.

```typescript
import { Component, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-sample',
  template: '<p>{{ data }}</p>'
})
export class SampleComponent implements AfterViewChecked {
  data: string;

  ngAfterViewChecked() {
    // Additional actions related to the view after change detection
    console.log('View checked.');
  }
}
```

### 8. **ngOnDestroy**:
   Sample Use-case: Performing cleanup tasks, unsubscribing from observables, or releasing resources.

```typescript
import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-sample',
  template: '<p>Component content</p>'
})
export class SampleComponent implements OnDestroy {
  interval: any;

  constructor() {
    this.interval = setInterval(() => {
      console.log('Interval tick.');
    }, 1000);
  }

  ngOnDestroy() {
    // Cleanup tasks, unsubscribe from observables, or release resources
    clearInterval(this.interval);
    console.log('Component destroyed.');
  }
}
```

## These code snippets demonstrate the use of Angular lifecycle hooks for various scenarios. Understanding when and how to use these hooks is essential for managing component lifecycle and optimizing the performance of your Angular application.