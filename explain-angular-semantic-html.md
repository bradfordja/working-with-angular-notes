The category you’re thinking of is usually called **semantic HTML**.

More specifically:

- `section`, `article`, `nav`, and `aside` are **sectioning content elements**
- `header`, `footer`, `main`, and `nav` often create **landmarks** for accessibility
- `card` is **not** a native HTML tag; it is usually a UI pattern implemented with `<article>`, `<section>`, or a framework component like `<mat-card>`

In Angular, you use these tags exactly like normal HTML inside component templates.

## What Is Semantic HTML?

Semantic HTML means using HTML elements that describe the meaning of the content, not just its appearance.

Instead of writing:

```html
<div class="top-bar"></div>
<div class="menu"></div>
<div class="content"></div>
<div class="bottom"></div>
```

You write:

```html
<header></header>
<nav></nav>
<main></main>
<footer></footer>
```

This helps:

- screen readers understand the page
- search engines understand structure
- developers read your code faster
- browsers expose better accessibility landmarks
- your CSS and Angular templates stay more meaningful

---

# Core Semantic Layout Tags

## `header`

Represents introductory content for a page, section, article, or component.

Common uses:

- site masthead
- page heading area
- article title block
- toolbar area
- dashboard section heading

Example:

```html
<header>
  <h1>Angular Interview Prep</h1>
  <p>Practice questions, notes, and examples.</p>
</header>
```

Angular example:

```html
<header class="app-header">
  <h1>{{ appTitle }}</h1>

  <button type="button" (click)="toggleTheme()">
    Toggle Theme
  </button>
</header>
```

```ts
export class AppComponent {
  appTitle = 'Angular Interview Prep';

  toggleTheme() {
    console.log('Theme toggled');
  }
}
```

Important note: `header` does not have to be only at the top of the whole page. An `article` can have its own `header`.

```html
<article>
  <header>
    <h2>Angular Change Detection</h2>
    <p>Updated July 17, 2026</p>
  </header>

  <p>Change detection keeps the template in sync with component state.</p>
</article>
```

---

## `nav`

Represents a block of major navigation links.

Common uses:

- main site navigation
- sidebar navigation
- pagination
- table of contents
- breadcrumb navigation

Example:

```html
<nav aria-label="Main navigation">
  <a href="/home">Home</a>
  <a href="/topics">Topics</a>
  <a href="/practice">Practice</a>
</nav>
```

Angular Router example:

```html
<nav aria-label="Main navigation">
  <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
  <a routerLink="/questions" routerLinkActive="active">Questions</a>
  <a routerLink="/notes" routerLinkActive="active">Notes</a>
</nav>
```

Use `aria-label` when you have multiple navs:

```html
<nav aria-label="Main navigation">...</nav>
<nav aria-label="Pagination">...</nav>
```

Not every group of links needs `nav`. Use it for important navigation regions.

---

## `main`

Represents the primary content of the page.

There should usually be **one visible `main` element per page**.

Example:

```html
<main>
  <h1>Practice Questions</h1>
  <p>Select a topic to begin.</p>
</main>
```

Angular shell layout:

```html
<header>
  <h1>Angular Interview Prep</h1>
</header>

<nav aria-label="Main navigation">
  <a routerLink="/questions">Questions</a>
  <a routerLink="/flashcards">Flashcards</a>
</nav>

<main>
  <router-outlet></router-outlet>
</main>

<footer>
  <small>&copy; 2026</small>
</footer>
```

This is one of the most useful semantic tags in Angular apps because your routed page content belongs inside `main`.

---

## `section`

Represents a thematic section of content.

Use it when the content forms a meaningful group, usually with a heading.

Good use:

```html
<section>
  <h2>Component Lifecycle</h2>
  <p>Angular components move through creation, change detection, and destruction.</p>
</section>
```

Less useful:

```html
<section class="wrapper">
  <div>Random styling container</div>
</section>
```

If it is only for layout or styling, use `div`.

Angular example with `*ngFor`:

```html
<main>
  <section *ngFor="let topic of topics">
    <h2>{{ topic.title }}</h2>
    <p>{{ topic.description }}</p>
  </section>
</main>
```

```ts
export class TopicsComponent {
  topics = [
    {
      title: 'Components',
      description: 'Reusable UI building blocks in Angular.'
    },
    {
      title: 'Services',
      description: 'Shared logic and state managed through dependency injection.'
    },
    {
      title: 'Routing',
      description: 'Navigation between application views.'
    }
  ];
}
```

Use `section` when the block deserves a heading.

---

## `article`

Represents self-contained content that could stand alone or be reused elsewhere.

Common uses:

- blog post
- news item
- forum post
- product card
- question card
- comment
- review
- documentation entry

Example:

```html
<article>
  <h2>What is dependency injection?</h2>
  <p>Dependency injection is a design pattern Angular uses to provide dependencies to classes.</p>
</article>
```

Angular example for question cards:

```html
<article class="question-card" *ngFor="let question of questions">
  <header>
    <h2>{{ question.title }}</h2>
    <p>Difficulty: {{ question.difficulty }}</p>
  </header>

  <p>{{ question.prompt }}</p>

  <footer>
    <button type="button" (click)="markReviewed(question.id)">
      Mark reviewed
    </button>
  </footer>
</article>
```

```ts
export class QuestionsComponent {
  questions = [
    {
      id: 1,
      title: 'Angular Components',
      difficulty: 'Beginner',
      prompt: 'What is the purpose of an Angular component?'
    },
    {
      id: 2,
      title: 'Dependency Injection',
      difficulty: 'Intermediate',
      prompt: 'How does Angular resolve injected services?'
    }
  ];

  markReviewed(id: number) {
    console.log(`Reviewed question ${id}`);
  }
}
```

This is often the best semantic replacement for a “card” when the card represents one standalone item.

---

## `aside`

Represents secondary or tangential content.

Common uses:

- sidebar
- related links
- notes
- callouts
- filters
- ads
- supplementary explanations

Example:

```html
<aside>
  <h2>Related Topics</h2>
  <ul>
    <li>Services</li>
    <li>Dependency Injection</li>
    <li>Providers</li>
  </ul>
</aside>
```

Angular dashboard example:

```html
<main class="layout">
  <section>
    <h1>Angular Services</h1>
    <p>Services are used to share logic and data across components.</p>
  </section>

  <aside>
    <h2>Study Tips</h2>
    <ul>
      <li *ngFor="let tip of tips">{{ tip }}</li>
    </ul>
  </aside>
</main>
```

```ts
export class TopicDetailComponent {
  tips = [
    'Know how dependency injection works.',
    'Understand provider scopes.',
    'Practice explaining singleton services.'
  ];
}
```

Use `aside` when the content supports the main content but is not the main content itself.

---

## `footer`

Represents footer content for a page, section, or article.

Common uses:

- copyright
- author info
- metadata
- article actions
- related links
- pagination controls

Example:

```html
<footer>
  <small>&copy; 2026 Angular Interview Prep</small>
</footer>
```

Inside an article:

```html
<article>
  <h2>RxJS Observables</h2>
  <p>Observables represent streams of asynchronous values.</p>

  <footer>
    <p>Last reviewed: July 17, 2026</p>
  </footer>
</article>
```

Angular example:

```html
<footer class="app-footer">
  <small>&copy; {{ currentYear }} {{ appName }}</small>
</footer>
```

```ts
export class FooterComponent {
  appName = 'Angular Interview Prep';
  currentYear = new Date().getFullYear();
}
```

---

# Other Useful Semantic HTML Tags

## `figure` and `figcaption`

Use for self-contained media, diagrams, images, code illustrations, or charts with captions.

```html
<figure>
  <img src="assets/change-detection.png" alt="Angular change detection diagram" />
  <figcaption>Angular checks component templates after state changes.</figcaption>
</figure>
```

Angular example:

```html
<figure *ngIf="diagramUrl">
  <img [src]="diagramUrl" [alt]="diagramAlt" />
  <figcaption>{{ caption }}</figcaption>
</figure>
```

```ts
export class DiagramComponent {
  diagramUrl = 'assets/component-tree.png';
  diagramAlt = 'Angular component tree diagram';
  caption = 'Parent and child components form a component tree.';
}
```

---

## `address`

Represents contact information for a person, organization, or article author.

```html
<address>
  Contact: <a href="mailto:hello@example.com">hello@example.com</a>
</address>
```

Do not use `address` for any random physical address unless it is truly contact information for the surrounding content.

---

## `time`

Represents a date, time, or duration in a machine-readable way.

```html
<time datetime="2026-07-17">July 17, 2026</time>
```

Angular example:

```html
<p>
  Last updated:
  <time [attr.datetime]="updatedAtIso">
    {{ updatedAt | date: 'longDate' }}
  </time>
</p>
```

```ts
export class ArticleComponent {
  updatedAt = new Date('2026-07-17');
  updatedAtIso = this.updatedAt.toISOString();
}
```

---

## `mark`

Highlights text for relevance.

```html
<p>
  Angular uses <mark>dependency injection</mark> to provide services.
</p>
```

Angular search result example:

```html
<p>
  Result matched topic:
  <mark>{{ searchTerm }}</mark>
</p>
```

For complex highlighting, avoid injecting raw HTML unless sanitized carefully.

---

## `details` and `summary`

Creates a native expandable disclosure widget.

```html
<details>
  <summary>What is Angular?</summary>
  <p>Angular is a TypeScript-based framework for building web applications.</p>
</details>
```

Angular FAQ example:

```html
<details *ngFor="let item of faqs">
  <summary>{{ item.question }}</summary>
  <p>{{ item.answer }}</p>
</details>
```

```ts
export class FaqComponent {
  faqs = [
    {
      question: 'What is a component?',
      answer: 'A component controls a portion of the UI through a template and class.'
    },
    {
      question: 'What is a service?',
      answer: 'A service contains reusable logic or shared state.'
    }
  ];
}
```

This is great when you do not need a custom accordion component.

---

## `dialog`

Represents a modal or non-modal dialog.

```html
<dialog #dialog>
  <h2>Confirm Review</h2>
  <p>Mark this question as reviewed?</p>

  <button type="button" (click)="dialog.close()">Cancel</button>
  <button type="button" (click)="confirm()">Confirm</button>
</dialog>

<button type="button" (click)="dialog.showModal()">
  Open Dialog
</button>
```

Angular component example:

```html
<button type="button" (click)="reviewDialog.showModal()">
  Mark reviewed
</button>

<dialog #reviewDialog>
  <h2>Mark as reviewed?</h2>
  <p>This question will move to your completed list.</p>

  <form method="dialog">
    <button value="cancel">Cancel</button>
    <button value="confirm" (click)="markReviewed()">Confirm</button>
  </form>
</dialog>
```

```ts
export class ReviewDialogComponent {
  markReviewed() {
    console.log('Question reviewed');
  }
}
```

For large production apps, Angular Material’s `MatDialog` is often used instead, but native `dialog` is still a real semantic HTML element.

---

# About `card`

`card` is not a standard HTML element.

This is not valid semantic HTML in the normal sense:

```html
<card>
  <h2>Angular Components</h2>
</card>
```

Browsers will render unknown elements, but they have no built-in semantic meaning.

Better options:

Use `article` for standalone card content:

```html
<article class="card">
  <h2>Components</h2>
  <p>Learn how Angular components work.</p>
</article>
```

Use `section` for grouped page content:

```html
<section class="card">
  <h2>Progress</h2>
  <p>You reviewed 12 questions today.</p>
</section>
```

Use Angular Material if your app uses Material:

```html
<mat-card>
  <mat-card-header>
    <mat-card-title>Components</mat-card-title>
  </mat-card-header>

  <mat-card-content>
    <p>Practice Angular component interview questions.</p>
  </mat-card-content>

  <mat-card-actions>
    <button mat-button>Start</button>
  </mat-card-actions>
</mat-card>
```

Use a custom Angular component when the card is part of your design system:

```html
<app-topic-card
  *ngFor="let topic of topics"
  [topic]="topic"
  (selected)="openTopic($event)">
</app-topic-card>
```

Inside `app-topic-card.component.html`:

```html
<article class="topic-card">
  <h2>{{ topic.title }}</h2>
  <p>{{ topic.description }}</p>

  <button type="button" (click)="selected.emit(topic)">
    Open
  </button>
</article>
```

So the Angular component is named like a card, but the internal HTML can still be semantic.

---

# Full Angular Layout Example

```html
<header class="app-header">
  <h1>{{ title }}</h1>

  <nav aria-label="Main navigation">
    <a routerLink="/topics" routerLinkActive="active">Topics</a>
    <a routerLink="/questions" routerLinkActive="active">Questions</a>
    <a routerLink="/progress" routerLinkActive="active">Progress</a>
  </nav>
</header>

<main class="app-main">
  <section aria-labelledby="featured-heading">
    <h2 id="featured-heading">Featured Topics</h2>

    <article class="card" *ngFor="let topic of topics">
      <header>
        <h3>{{ topic.title }}</h3>
        <p>{{ topic.level }}</p>
      </header>

      <p>{{ topic.description }}</p>

      <footer>
        <button type="button" (click)="startTopic(topic.id)">
          Start
        </button>
      </footer>
    </article>
  </section>

  <aside aria-labelledby="tips-heading">
    <h2 id="tips-heading">Study Tips</h2>

    <ul>
      <li *ngFor="let tip of tips">{{ tip }}</li>
    </ul>
  </aside>
</main>

<footer class="app-footer">
  <small>&copy; {{ year }} {{ title }}</small>
</footer>
```

```ts
export class AppComponent {
  title = 'Angular Interview Prep';
  year = new Date().getFullYear();

  topics = [
    {
      id: 1,
      title: 'Components',
      level: 'Beginner',
      description: 'Understand templates, inputs, outputs, and component state.'
    },
    {
      id: 2,
      title: 'Dependency Injection',
      level: 'Intermediate',
      description: 'Learn how Angular provides services and resolves dependencies.'
    }
  ];

  tips = [
    'Explain concepts out loud.',
    'Practice small code examples.',
    'Compare Angular features with plain TypeScript.'
  ];

  startTopic(id: number) {
    console.log(`Starting topic ${id}`);
  }
}
```

---

# Quick Decision Guide

Use `header` for intro or heading areas.

Use `nav` for major navigation links.

Use `main` for the primary routed page content.

Use `section` for a meaningful group of related content, usually with a heading.

Use `article` for standalone, reusable content like a post, card, question, review, or product.

Use `aside` for supporting content like sidebars, tips, filters, and related links.

Use `footer` for closing metadata, copyright, or actions.

Use `div` when the element is only for layout or styling.

Use an Angular component like `<app-card>` for reuse, but put semantic HTML such as `<article>` inside it.