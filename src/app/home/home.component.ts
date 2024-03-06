import { Component, inject } from '@angular/core';
import { CardService } from '../card.service';
import { Card, CardList } from '../../../interfaces';
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
    const filteredCards = this.cards.data.filter((card) =>
      card.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    if (searchTerm.length > 0) {
      this.searchedCards = filteredCards;
      this.paginatedCards = filteredCards.slice(startIndex, endIndex);
    } else {
      this.paginatedCards = this.cards.data.slice(startIndex, endIndex);
    }
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginatCards(this.searchTerm);
  }

  search(text: string) {
    this.searchTerm = text;
    this.paginatCards(text);
  }
}
