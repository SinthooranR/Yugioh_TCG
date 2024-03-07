import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardService } from '../card.service';
import { Card } from '../../../interfaces';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [],
  template: ` <p>card-details works!</p> `,
  styleUrl: './card-details.component.scss',
})
export class CardDetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  cardService: CardService = inject(CardService);
  card: Card = {
    id: 0,
    name: '',
    type: '',
    frameType: '',
    desc: '',
    atk: 0,
    def: 0,
    level: 0,
    race: '',
    attribute: '',
    archetype: '',
    ygoprodeck_url: '',
    card_images: [
      {
        id: 0,
        image_url: '',
        image_url_small: '',
        image_url_cropped: '',
      },
    ],
    card_prices: [
      {
        ebay_price: 0,
        amazon_price: 0,
      },
    ],
  };
  cardId = Number(this.route.snapshot.params['id']);
  ngOnInit() {
    this.cardService.getCardById(this.cardId).subscribe({
      next: (v) => {
        this.card = v.data[0];
        console.log('TEST', this.card); // Move console.log here
      },
      error: (e) => console.error(e),
      complete: () => 'complete',
    });
  }
}
