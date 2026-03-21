export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  inventory: number;
  featured: boolean;
  notes: string[];
  category: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = {
  name: string;
  description: string;
  price: number;
  inventory: number;
  featured: boolean;
  notes: string[];
  category: string;
  image: string;
};
