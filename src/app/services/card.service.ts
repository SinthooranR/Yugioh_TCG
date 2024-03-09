import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CardList, FilterOption } from '../models/interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private apiUrl = `https://db.ygoprodeck.com/api/v7/cardinfo.php`;

  getAllCards(
    filters: { term: string; type: string }[] = []
  ): Observable<CardList> {
    // If filters are provided, construct the URL with filter parameters
    let url = this.apiUrl;
    if (filters && filters.length > 0) {
      const filterParams = filters
        .map((filter) => `${filter.type}=${filter.term}`)
        .join('&');
      url += `?${filterParams}`;
    }
    return this.http.get<CardList>(url);
  }

  getCardById(id: number): Observable<CardList> {
    return this.http.get<CardList>(`${this.apiUrl}?id=${id}`);
  }

  constructor(private http: HttpClient) {}
}
