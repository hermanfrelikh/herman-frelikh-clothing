export interface CartItem {
  id: number;
  product_id: number;
  size: string;
  quantity: number;
  title: string;
  price: number;
  images: string[];
  rating?: number; // Опционально
  gender?: string; // Опционально
  category?: string; // Опционально
}
