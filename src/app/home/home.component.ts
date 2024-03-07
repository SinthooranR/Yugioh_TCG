import { Component, inject } from '@angular/core';
import { CardService } from '../card.service';
import { Card, CardList, FilterEventData } from '../../../interfaces';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CardComponent, CommonModule, FilterComponent],
  template: `<app-filter
      (searchEvent)="search($event)"
      (pageEvent)="onPageChange($event)"
      (filterEvent)="filter($event)"
      [cardLength]="searchTerm ? searchedCards.length : cards.data.length"
      [pageSize]="pageSize"
    ></app-filter>
    <div class="cardListContainer">
      <app-card *ngFor="let card of paginatedCards" [card]="card"></app-card>
    </div>`,
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  cardService: CardService = inject(CardService);
  cards: CardList = { data: [] };
  searchedCards: Card[] = [];
  paginatedCards: Card[] = [];

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
      complete: () =>
        this.paginatCards(this.searchTerm, this.filterTerm, this.appliedFilter),
    });
  }

  paginatCards(searchTerm: string, filterTerm: string, filterType: string) {
    let filteredCards = this.cards.data;

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
    this.paginatCards(this.searchTerm, this.filterTerm, this.appliedFilter);
  }

  search(text: string) {
    this.searchTerm = text;
    this.paginatCards(this.searchTerm, this.filterTerm, this.appliedFilter);
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

    this.paginatCards(this.searchTerm, this.filterTerm, data.filterType);
  }
}
