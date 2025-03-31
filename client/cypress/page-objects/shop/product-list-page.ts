// cypress/page-objects/shop/product-list-page.ts
import { BasePage } from '../base-page';

export class ProductListPage extends BasePage {
  // Selectors
  categoryFilter = '[data-cy=category-filter]';
  sortFilter = '[data-cy=sort-filter]';
  productGrid = '[data-cy=product-grid]';
  productCard = (id: string) => `[data-cy=product-${id}]`;

  constructor() {
    super('/products');
  }

  // Page actions
  selectCategory(category: string) {
    cy.get(this.categoryFilter).select(category);
    return this;
  }

  sortBy(option: string) {
    cy.get(this.sortFilter).select(option);
    return this;
  }

  clickProduct(productId: string) {
    this.clickElement(this.productCard(productId));
    return this;
  }

  // Assertions
  shouldShowProducts(count: number) {
    cy.get(`${this.productGrid} > a`).should('have.length', count);
    return this;
  }

  shouldContainProduct(productId: string) {
    this.shouldBeVisible(this.productCard(productId));
    return this;
  }

  shouldShowProductName(productId: string, name: string) {
    cy.get(this.productCard(productId)).should('contain', name);
    return this;
  }

  shouldShowProductPrice(productId: string, price: string) {
    cy.get(this.productCard(productId)).should('contain', price);
    return this;
  }
}