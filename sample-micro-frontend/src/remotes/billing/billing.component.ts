import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'mfe-billing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-heading">
      <p class="eyebrow">Billing remote</p>
      <h1>Billing operations</h1>
      <p>This view requires <code>billing:read</code>. Analyst users are redirected to the forbidden page before this bundle loads.</p>
    </section>

    <section class="metric-grid">
      <article class="metric">
        <span>Month revenue</span>
        <strong>$842k</strong>
        <small>recognized</small>
      </article>
      <article class="metric">
        <span>Past due</span>
        <strong>$31k</strong>
        <small>7 invoices</small>
      </article>
      <article class="metric">
        <span>Disputes</span>
        <strong>4</strong>
        <small>needs finance review</small>
      </article>
    </section>

    <section class="split-layout">
      <article class="work-panel">
        <h2>Invoice health</h2>
        <div class="bar-row" *ngFor="let item of health">
          <span>{{ item.label }}</span>
          <div><i [style.width.%]="item.value"></i></div>
          <strong>{{ item.value }}%</strong>
        </div>
      </article>
      <article class="work-panel">
        <h2>Security note</h2>
        <p>The shell attaches the JWT to same-origin <code>/api</code> calls with an interceptor. A real backend would verify the signature, issuer, audience, expiration, and resource permissions.</p>
      </article>
    </section>
  `
})
export class BillingComponent {
  readonly health = [
    { label: 'Paid', value: 82 },
    { label: 'Pending', value: 13 },
    { label: 'Past due', value: 5 }
  ];
}
