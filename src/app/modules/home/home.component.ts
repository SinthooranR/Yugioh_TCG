import { Component, ViewChild, inject } from '@angular/core';
import { CardService } from '../../services/card.service';
import { Card, CardList, FilterEventData } from '../../models/interfaces';
import { CardComponent } from '../../components/card/card.component';
import { CommonModule } from '@angular/common';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { SearchComponent } from '../../components/search/search.component';
import { FilterModalComponent } from '../../components/filter-modal/filter-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PaginatorIntlService } from '../../services/paginator-intl.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CardComponent,
    CommonModule,
    SearchComponent,
    MatIcon,
    MatButtonModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorIntlService }],
  template: `
    <div class="filterContainer">
      <div class="filterButton">
        <button
          mat-icon-button
          aria-label="Example icon button with a vertical three dot icon"
          (click)="openFilterDialog()"
        >
          <mat-icon>filter_list</mat-icon>
        </button>
      </div>
      <app-search
        (searchEvent)="search($event)"
        (pageEvent)="onPageChange($event)"
        [cardLength]="searchedCards.length"
        [pageSize]="pageSize"
      ></app-search>
    </div>
    <div class="cardListContainer">
      <app-card *ngFor="let card of paginatedCards" [card]="card"></app-card>
    </div>
  `,

  styleUrl: './home.component.scss',
})
export class HomeComponent {
  cardService: CardService = inject(CardService);
  cards: CardList = { data: [] };
  searchedCards: Card[] = [...this.cards.data];
  paginatedCards: Card[] = [];
  @ViewChild(SearchComponent) searchComponent!: SearchComponent;

  pageSize: number = 20;
  currentPage: number = 0;
  searchTerm = '';
  filterTerm = '';
  appliedFilter = '';

  filterTerms: { term: string; type: string }[] = [];

  ngOnInit() {
    this.cardService.getAllCards().subscribe({
      next: (v) => {
        this.cards = v;
      },
      error: (e) => console.error(e),
      complete: () => this.paginatCards(this.searchTerm),
    });
  }

  paginatCards(searchTerm: string) {
    let filteredCards = [...this.cards.data];

    // Apply search term filter
    if (searchTerm.length > 0) {
      filteredCards = filteredCards.filter((card) =>
        card.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Apply each filter term from filterTerms array
    this.filterTerms.forEach(({ term, type }) => {
      if (term.length > 0 && type.length > 0) {
        filteredCards = filteredCards.filter(
          (card) => (card as any)[type].toLowerCase() === term.toLowerCase()
        );
      }
    });

    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;

    this.searchedCards = filteredCards;
    this.paginatedCards = filteredCards.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginatCards(this.searchTerm);
  }

  search(text: string) {
    this.currentPage = 0;
    this.searchTerm = text;
    this.paginatCards(this.searchTerm);
    this.resetPage();
  }

  filter(data: FilterEventData) {
    // Check if an object with the same type exists in the filterTerms array
    const existingFilterIndex = this.filterTerms.findIndex(
      (filter) => filter.type === data.filterType
    );

    // If an object with the same type exists, replace it; otherwise, add a new object
    if (existingFilterIndex !== -1) {
      this.filterTerms[existingFilterIndex] = {
        term: data.selected,
        type: data.filterType,
      };
    } else {
      this.filterTerms.push({ term: data.selected, type: data.filterType });
    }

    // Update filterTerm to the latest filterTerm
    this.filterTerm = this.filterTerms.map((filter) => filter.term).join(',');
    this.search(this.searchTerm);
  }

  resetFilters(): void {
    this.filterTerms = []; // Reset filter terms
    this.filterTerm = ''; // Reset filter term
    this.searchTerm = ''; // Reset search term
    this.currentPage = 0; // Reset current page
    this.paginatCards(this.searchTerm);
    this.resetPage();
  }

  constructor(public dialog: MatDialog) {}

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterModalComponent, {
      width: '80%',
      data: {
        cardLength: this.searchedCards.length, // Pass the value of cardLength
      },
    });

    dialogRef.componentInstance.filterEvent.subscribe(
      (data: FilterEventData) => {
        this.filter(data);
      }
    );

    dialogRef.componentInstance.resetFiltersEvent.subscribe(() => {
      this.resetFilters();
    });

    //When dialogue closes we check the paginator to help push back to page 1 when a filter is applied
    dialogRef.afterClosed().subscribe(() => {
      this.resetPage();
    });
  }

  resetPage() {
    // Accessing paginator object from SearchComponent
    if (this.searchComponent && this.searchComponent.paginator) {
      const paginator = this.searchComponent.paginator;

      // Update the paginator's length property
      paginator.length = this.searchedCards.length;

      // Reset to the first page
      if (paginator.pageIndex !== 0) {
        paginator.firstPage();
      }
    }
  }
}
