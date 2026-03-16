import { Product } from '@jservices/contracts';

export interface CatalogRepository {
  getProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
}
