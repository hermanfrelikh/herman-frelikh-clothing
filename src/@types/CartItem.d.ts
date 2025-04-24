export interface CartItem {
  id: number;
  product_id: number;
  size: string;
  quantity: number;
  title: string;
  price: number;
  images: string[];
  rating?: number;
  gender?: string;
  category?: string;
}
