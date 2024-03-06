import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
  ],
  template: `
    <mat-form-field class="example-full-width">
      <mat-label>Search a Card</mat-label>
      <input matInput placeholder="Search" [(ngModel)]="value" />
      <button (click)="search()">Search</button>
    </mat-form-field>
    <mat-paginator
      [length]="cardLength"
      [pageSize]="pageSize"
      [pageSizeOptions]="pageSizeOptions"
      (page)="onPageChange($event)"
    ></mat-paginator>
  `,
  styleUrl: './filter.component.scss',
})
export class FilterComponent {
  value: string = '';
  pageSizeOptions: number[] = [20, 40, 60, 80, 100];
  @Input() cardLength!: number;
  @Input() pageSize!: number;
  @Output() searchEvent = new EventEmitter<string>();
  @Output() pageEvent = new EventEmitter<PageEvent>();

  search() {
    this.searchEvent.emit(this.value);
  }

  onPageChange($event: PageEvent) {
    this.pageEvent.emit($event);
  }
}
