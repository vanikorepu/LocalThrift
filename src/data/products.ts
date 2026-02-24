export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  emoji: string;
  seller: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Vintage Denim Jacket',
    price: 45,
    category: 'Outerwear',
    description: 'Classic 90s denim jacket in excellent condition',
    emoji: '🧥',
    seller: 'Sarah M.',
  },
  {
    id: '2',
    name: 'Retro Band T-Shirt',
    price: 20,
    category: 'Tops',
    description: 'Authentic vintage band tee from the 80s',
    emoji: '👕',
    seller: 'Mike R.',
  },
  {
    id: '3',
    name: 'High-Waisted Jeans',
    price: 35,
    category: 'Bottoms',
    description: 'Trendy high-waisted mom jeans, size 28',
    emoji: '👖',
    seller: 'Emma L.',
  },
  {
    id: '4',
    name: 'Leather Boots',
    price: 60,
    category: 'Shoes',
    description: 'Genuine leather boots, barely worn',
    emoji: '👢',
    seller: 'John D.',
  },
  {
    id: '5',
    name: 'Floral Summer Dress',
    price: 30,
    category: 'Dresses',
    description: 'Beautiful floral print dress, perfect for summer',
    emoji: '👗',
    seller: 'Lisa K.',
  },
  {
    id: '6',
    name: 'Vintage Sunglasses',
    price: 15,
    category: 'Accessories',
    description: 'Cool retro sunglasses with UV protection',
    emoji: '🕶️',
    seller: 'Tom H.',
  },
  {
    id: '7',
    name: 'Wool Winter Coat',
    price: 80,
    category: 'Outerwear',
    description: 'Warm wool coat, great for winter',
    emoji: '🧥',
    seller: 'Anna B.',
  },
  {
    id: '8',
    name: 'Sneakers',
    price: 40,
    category: 'Shoes',
    description: 'Clean white sneakers, size 9',
    emoji: '👟',
    seller: 'Chris P.',
  },
];

export const categories = [
  'All',
  'Tops',
  'Bottoms',
  'Outerwear',
  'Dresses',
  'Shoes',
  'Accessories',
];