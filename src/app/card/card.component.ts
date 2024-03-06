import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Card } from '../../../interfaces';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div>
      <a [routerLink]="['/card', card.id]">
        <img [src]="card.card_images[0].image_url" />
      </a>
    </div>
  `,
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() card!: Card;
}
