import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'mfe-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="page-heading">
      <p class="eyebrow">Admin remote</p>
      <h1>Access administration</h1>
      <p>This remote is available only when the JWT profile includes <code>admin:read</code>.</p>
    </section>

    <section class="table-panel">
      <header>
        <h2>User access</h2>
        <button type="button">Invite user</button>
      </header>
      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Role</th>
            <th>Permissions</th>
            <th>MFA</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of users">
            <td>{{ user.name }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.permissions }}</td>
            <td><span class="status">{{ user.mfa }}</span></td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="remote-grid compact">
      <article class="remote-card">
        <span>Policy</span>
        <strong>Deny by default</strong>
      </article>
      <article class="remote-card">
        <span>JWT validation</span>
        <strong>Signature, iss, aud, exp</strong>
      </article>
      <article class="remote-card">
        <span>Backend rule</span>
        <strong>Never trust route hiding</strong>
      </article>
    </section>
  `
})
export class AdminComponent {
  readonly users = [
    { name: 'Ava Analyst', role: 'user', permissions: 'orders', mfa: 'Enabled' },
    { name: 'Miles Manager', role: 'manager', permissions: 'orders, billing', mfa: 'Enabled' },
    { name: 'Nia Admin', role: 'admin', permissions: 'all sample scopes', mfa: 'Required' }
  ];
}
