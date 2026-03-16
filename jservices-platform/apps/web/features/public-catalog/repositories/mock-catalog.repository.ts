import { Product } from '@jservices/contracts';
import { catalogMock } from '@/mocks/catalog.mock';
import { CatalogRepository } from './catalog.repository';

export const mockCatalogRepository: CatalogRepository = {
  async getProducts(): Promise<Product[]> {
    return catalogMock;
  },
  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return catalogMock.find(p => p.slug === slug);
  }
};
