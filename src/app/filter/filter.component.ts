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

@Component({
  selector: 'app-filter',
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
      <mat-form-field>
        <mat-label>Card Type</mat-label>
        <mat-select
          [(ngModel)]="selectedCardType"
          (selectionChange)="filter($event.value, 'frameType')"
        >
          <mat-option *ngFor="let type of cardTypes" [value]="type.value">{{
            type.viewValue
          }}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Race</mat-label>
        <mat-select
          [(ngModel)]="selectedRace"
          (selectionChange)="filter($event.value, 'race')"
        >
          <mat-option *ngFor="let race of cardRaces" [value]="race.value">{{
            race.viewValue
          }}</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Search a Card</mat-label>
        <div class="search">
          <input matInput placeholder="Search" [(ngModel)]="value" />
          <button mat-icon-button (click)="search()">
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
  styleUrl: './filter.component.scss',
})
export class FilterComponent {
  value: string = '';
  selectedCardType: string = ''; // Variable to store the selected card type
  selectedRace: string = ''; // Variable to store the selected race
  pageSizeOptions: number[] = [20, 40, 60, 80, 100];
  cardTypes = yugiohCardTypes;
  cardRaces = yugiohRaces;

  @Input() cardLength!: number;
  @Input() pageSize!: number;
  @Output() searchEvent = new EventEmitter<string>();
  @Output() filterEvent = new EventEmitter<FilterEventData>();
  @Output() pageEvent = new EventEmitter<PageEvent>();

  search() {
    this.searchEvent.emit(this.value);
  }

  filter(selected: string, filterType: string) {
    if (filterType === 'frameType') {
      this.selectedCardType = selected; // Update selected card type
    } else if (filterType === 'race') {
      this.selectedRace = selected; // Update selected race
    }
    const filterEventData: FilterEventData = { selected, filterType };
    this.filterEvent.emit(filterEventData);
  }

  onPageChange($event: PageEvent) {
    this.pageEvent.emit($event);
  }
}
