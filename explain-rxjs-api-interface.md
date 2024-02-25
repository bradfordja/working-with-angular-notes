# Explain rxjs API Interface

## Let's dive into some of the most common RxJS API interfaces. Here are 25 of them, along with their explanations and use-cases:

### 1. **Observable<T>**

    - **Explanation**: Represents a lazy push-based collection.
    - **Use-case**: When you need to create a stream of data.

    ```typescript
    import { Observable } from 'rxjs';
    
    const observable: Observable<string> = new Observable(observer => {
      observer.next('Hello from Observable!');
      observer.complete();
    });
    ```

### 2. **Observer<T>**

    - **Explanation**: An interface for a consumer of push-based notifications.
    - **Use-case**: When you want to react to an observable emitting a value.

    ```typescript
    const observer = {
      next: val => console.log(val),
      error: err => console.log('Error:', err),
      complete: () => console.log('Completed')
    };
    observable.subscribe(observer);
    ```

### 3. **Subscription**

    - **Explanation**: Represents the execution of an Observable.
    - **Use-case**: To unsubscribe and clean up resources.

    ```typescript
    import { Subscription } from 'rxjs';
    
    const subscription: Subscription = observable.subscribe(val => console.log(val));
    subscription.unsubscribe();
    ```

### 4. **Subject<T>**

    - **Explanation**: Both an Observable and Observer. Can multicast to many observers.
    - **Use-case**: When you want multiple subscribers to see the same data.

    ```typescript
    import { Subject } from 'rxjs';
    
    const subject = new Subject<string>();
    subject.subscribe(val => console.log(val));
    subject.next('Hello from Subject!');
    ```

### 5. **BehaviorSubject<T>**

    - **Explanation**: A type of subject that has a current value.
    - **Use-case**: When you want an observable that gives the last value upon subscription.

    ```typescript
    import { BehaviorSubject } from 'rxjs';
    
    const behaviorSubject = new BehaviorSubject<string>('Initial value');
    behaviorSubject.subscribe(val => console.log(val));
    behaviorSubject.next('New value');
    ```

### 6. **ReplaySubject<T>**

    - **Explanation**: A type of subject that can send old values to new subscribers.
    - **Use-case**: When you want to cache emitted values.

    ```typescript
    import { ReplaySubject } from 'rxjs';
    
    const replaySubject = new ReplaySubject<string>(2); // buffer of 2 values
    replaySubject.next('First');
    replaySubject.next('Second');
    replaySubject.next('Third');
    replaySubject.subscribe(val => console.log(val));
    ```

### 7. **AsyncSubject<T>**

    - **Explanation**: A variant of Subject that only emits the last value (and only the last value) emitted by the source Observable, and only when the source completes.
    - **Use-case**: Useful for returning the last value of asynchronous operations.

    ```typescript
    import { AsyncSubject } from 'rxjs';
    
    const asyncSubject = new AsyncSubject();
    asyncSubject.subscribe(val => console.log(val));
    asyncSubject.next('Value');
    asyncSubject.complete();
    ```

### 8. **SchedulerLike**

    - **Explanation**: An interface for a scheduling unit of work.
    - **Use-case**: To control the execution context of tasks or to delay their execution.

    ```typescript
    import { Observable, asyncScheduler } from 'rxjs';

    const observable = new Observable(observer => {
      observer.next('Value');
      observer.complete();
    }, asyncScheduler);

    observable.subscribe(val => console.log(val));
    ```

### 9. **Notification<T>**

    - **Explanation**: Represents the metadata of an Observable execution.
    - **Use-case**: Can be used to log the lifecycle events of observables.

    ```typescript
    import { Notification } from 'rxjs';

    const notification = new Notification('N', 'Hello');
    console.log(notification.kind); // prints: N
    ```

### 10. **Subscriber<T>**

    - **Explanation**: A type of Observer.
    - **Use-case**: Extends the Observer to include the subscription logic.

    ```typescript
    import { Subscriber } from 'rxjs';

    const subscriber = new Subscriber(
      val => console.log(val),
      err => console.error(err),
      () => console.log('Completed')
    );
    observable.subscribe(subscriber);
    ```

### 11. **OperatorFunction<T, R>**

    - **Explanation**: Represents a function that is used to transform one observable into another.
    - **Use-case**: Creating custom operators.

    ```typescript
    import { OperatorFunction } from 'rxjs';
    import { filter } from 'rxjs/operators';

    const customOperator: OperatorFunction<number, number> = filter((value: number) => value > 2);
    ```

### 12. **UnaryFunction<T, R>**

    - **Explanation**: Represents a function that takes an argument of type `T` and returns a value of type `R`.
    - **Use-case**: Creating functions to work with observables.

    ```typescript
    import { UnaryFunction } from 'rxjs';
    import { Observable } from 'rxjs';

    const double: UnaryFunction<Observable<number>, Observable<number>> = source => 
      new Observable(observer => {
        source.subscribe(
          value => observer.next(value * 2),
          err => observer.error(err),
          () => observer.complete()
        );
      });
    ```

### 13. **TeardownLogic**

    - **Explanation**: Describes the resources that need to be disposed when calling `unsubscribe`.
    - **Use-case**: Cleaning up resources after an observable completes.

    ```typescript
    import { Observable, TeardownLogic } from 'rxjs';

    const observable = new Observable<number>(observer => {
      // Emit values
      observer.next(1);

      // Teardown logic
      return (): TeardownLogic => {
        console.log("Clean up resources");
      };
    });

    const subscription = observable.subscribe();
    subscription.unsubscribe();  // prints: Clean up resources
    ```

### 14. **MonoTypeOperatorFunction<T>**

    - **Explanation**: An OperatorFunction which returns an Observable of the same type.
    - **Use-case**: Commonly used with pipeable operators.

    ```typescript
    import { MonoTypeOperatorFunction } from 'rxjs';
    import { map } from 'rxjs/operators';

    const doubleValue: MonoTypeOperatorFunction<number> = map(value => value * 2);
    ```

### 15. **SubscribableOrPromise<T>**

    - **Explanation**: Represents a value that is either an Observable or a Promise.
    - **Use-case**: Useful when writing functions that can accept both Promises and Observables.

    ```typescript
    function handleValue<T>(value: SubscribableOrPromise<T>): void {
      if (isObservable(value)) {
        value.subscribe(result => console.log(result));
      } else {
        value.then(result => console.log(result));
      }
    }
    ```

This list provides an overview of some of the core interfaces in RxJS. However, it's worth noting that the full RxJS library has many more interfaces, functions, and features, and it's always beneficial to delve into the official documentation to grasp its full capabilities and intricacies.