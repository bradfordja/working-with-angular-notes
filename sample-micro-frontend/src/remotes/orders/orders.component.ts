import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'mfe-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-heading">
      <p class="eyebrow">Orders remote</p>
      <h1>Order intake</h1>
      <p>This standalone component is lazy-loaded by the shell and protected by the <code>orders:read</code> permission.</p>
    </section>

    <section class="metric-grid">
      <article class="metric">
        <span>Open orders</span>
        <strong>128</strong>
        <small>18 need manual review</small>
      </article>
      <article class="metric">
        <span>Fulfillment SLA</span>
        <strong>96.4%</strong>
        <small>last 24 hours</small>
      </article>
      <article class="metric">
        <span>Created today</span>
        <strong>42</strong>
        <small>permission: orders:create</small>
      </article>
    </section>

    <section class="table-panel">
      <header>
        <h2>Queue</h2>
        <button type="button">Create order</button>
      </header>
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Status</th>
            <th>Risk</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let order of orders">
            <td>{{ order.id }}</td>
            <td>{{ order.customer }}</td>
            <td><span class="status">{{ order.status }}</span></td>
            <td>{{ order.risk }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  `
})
export class OrdersComponent {
  readonly orders = [
    { id: 'ORD-1042', customer: 'Northstar Studio', status: 'Ready', risk: 'Low' },
    { id: 'ORD-1043', customer: 'Pine Labs', status: 'Review', risk: 'Medium' },
    { id: 'ORD-1044', customer: 'Cobalt Health', status: 'Packed', risk: 'Low' }
  ];
}
