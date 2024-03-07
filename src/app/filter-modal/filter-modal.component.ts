import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { FilterEventData } from '../../../interfaces';
import { FormsModule } from '@angular/forms';
import { yugiohCardTypes, yugiohRaces } from '../../../constants';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-filter-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatSelect,
    FormsModule,
    MatFormFieldModule,
    MatOptionModule,
    MatRadioModule,
  ],
  template: `
    <div class="modal-content">
      <section class="container">
        <div class="radio-groups-container">
          <ng-container *ngFor="let filter of filters">
            <div class="radio-group">
              <mat-label>{{ filter.label }}</mat-label>
              <mat-radio-group
                [(ngModel)]="filter.selectedValue"
                (change)="
                  filterSelected(filter.selectedValue, filter.filterType)
                "
                class="radio-list"
              >
                <mat-radio-button
                  *ngFor="let option of filter.options"
                  [value]="option.value"
                  class="radioButton"
                >
                  {{ option.viewValue }}
                </mat-radio-button>
              </mat-radio-group>
            </div>
          </ng-container>
        </div>
        <div class="buttons">
          <button mat-button (click)="resetFilters()">Reset</button>
          <button mat-button (click)="closeDialog()">Apply</button>
        </div>
      </section>
    </div>
  `,
  styleUrl: './filter-modal.component.scss',
})
export class FilterModalComponent implements OnInit {
  filters: FilterOption[] = [];

  @Output() filterEvent = new EventEmitter<FilterEventData>();
  @Output() resetFiltersEvent = new EventEmitter<void>();
  initialFiltersState: FilterOption[] = []; // To store initial state

  ngOnInit() {
    // Initialize filter options
    this.filters = [
      {
        label: 'Card Type',
        options: yugiohCardTypes,
        selectedValue: this.getSelectedValueFromLocalStorage('frameType') || '',
        filterType: 'frameType',
      },
      {
        label: 'Race',
        options: yugiohRaces,
        selectedValue: this.getSelectedValueFromLocalStorage('race') || '',
        filterType: 'race',
      },
      // Add more filter options here
    ];

    this.initialFiltersState = this.filters.map((filter) => ({ ...filter }));
  }

  filterSelected(selectedValue: string, filterType: string) {
    localStorage.setItem(filterType, selectedValue);
  }

  getSelectedValueFromLocalStorage(key: string): string | null {
    const value = localStorage.getItem(key);
    return value !== null ? value : null;
  }

  constructor(public dialogRef: MatDialogRef<FilterModalComponent>) {}

  closeDialog(): void {
    // Emit filter event for each selected filter option
    this.filters.forEach((filter) => {
      if (filter.selectedValue) {
        const filterEventData: FilterEventData = {
          selected: filter.selectedValue,
          filterType: filter.filterType,
        };
        this.filterEvent.emit(filterEventData);
      }
    });

    // Close the dialog
    this.dialogRef.close();
  }

  resetFilters(): void {
    // Reset filters to initial state
    this.filters = this.initialFiltersState.map((filter) => ({ ...filter }));
    localStorage.clear();
    this.resetFiltersEvent.emit();
    this.dialogRef.close();
  }
}

interface FilterOption {
  label: string;
  options: any[]; // Array of filter options
  selectedValue: string; // Variable to store the selected value
  filterType: string; // Type of filter
}
