import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  template: `
    <mat-toolbar class="navbar">
      <h1>Welcome to {{ title }}!</h1>
      <button
        mat-icon-button
        class="example-icon"
        aria-label="Example icon-button with menu icon"
      >
        <mat-icon>menu</mat-icon>
      </button>
    </mat-toolbar>
    <main>
      <router-outlet />
    </main>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage(event: Event) {
    localStorage.clear(); // Clear localStorage when the page is refreshed or closed
  }
  title = 'yugioh-tcg';
}
