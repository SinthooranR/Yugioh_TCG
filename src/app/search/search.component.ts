import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { yugiohCardTypes, yugiohRaces } from '../../../constants';
import { FilterEventData } from '../../../interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelect,
    MatOptionModule,
    MatPaginatorModule,
    MatIconModule,
  ],
  template: `
    <section>
      <mat-form-field appearance="outline">
        <mat-label>Search a Card</mat-label>
        <div class="search">
          <input matInput placeholder="Search" [(ngModel)]="value" />
          <button mat-icon-button (click)="search()" class="searchButton">
            <mat-icon aria-hidden="false" aria-label="Search icon"
              >search</mat-icon
            >
          </button>
        </div>
      </mat-form-field>
      <mat-paginator
        [length]="cardLength"
        [pageSize]="pageSize"
        [pageSizeOptions]="pageSizeOptions"
        (page)="onPageChange($event)"
        class="paginator"
      ></mat-paginator>
    </section>
  `,
  styleUrl: './search.component.scss',
})
export class SearchComponent {
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
