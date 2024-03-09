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

export interface FilterEventData {
  selected: string;
  filterType: string;
}

export interface FilterOption {
  label: string;
  options: any[]; // Array of filter options
  selected: string; // Variable to store the selected value
  filterType: string; // Type of filter
}
