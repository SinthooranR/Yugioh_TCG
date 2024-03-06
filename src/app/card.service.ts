import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Card, CardList } from '../../interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private apiUrl = `https://db.ygoprodeck.com/api/v7/cardinfo.php`;

  getAllCards(): Observable<CardList> {
    return this.http.get<CardList>(this.apiUrl);
  }

  getCardById(id: number): Observable<Card> {
    return this.http.get<Card>(this.apiUrl + `/cards?id=${id}`);
  }

  constructor(private http: HttpClient) {}
}
