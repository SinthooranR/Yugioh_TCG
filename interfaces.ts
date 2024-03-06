export interface CardList {
  data: Card[];
}

export interface Card {
  id: number;
  name: string;
  type: string;
  frameType: string;
  desc: string;
  atk: number;
  def: number;
  level: number;
  race: string;
  attribute: string;
  archetype: string;
  ygoprodeck_url: string;
  card_images: [
    {
      id: number;
      image_url: string;
      image_url_small: string;
      image_url_cropped: string;
    }
  ];
  card_prices: [
    {
      ebay_price: number;
      amazon_price: number;
    }
  ];
}
