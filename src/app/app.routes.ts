import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CardDetailsComponent } from './card-details/card-details.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Home',
  },
  {
    path: 'card/:id',
    component: CardDetailsComponent,
    title: 'Details',
  },
];
