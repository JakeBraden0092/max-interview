// cypress/page-objects/shop/product-detail-page.ts
import { BasePage } from '../base-page';

export class ProductDetailPage extends BasePage {
  // Selectors
  productImage = '[data-cy=product-image]';
  productName = '[data-cy=product-name]';
  productPrice = '[data-cy=product-price]';
  productDescription = '[data-cy=product-description]';
  
  tabDescription = '[data-cy=tab-description]';
  tabDetails = '[data-cy=tab-details]';
  tabBenefits = '[data-cy=tab-benefits]';
  
  productIngredients = '[data-cy=product-ingredients]';
  productUsage = '[data-cy=product-usage]';
  productBenefits = '[data-cy=product-benefits]';
  
  quantitySelect = '[data-cy=quantity-select]';
  addToCartButton = '[data-cy=add-to-cart-button]';

  constructor() {
    super('/products');
  }

  visitWithOrderId(productId: string) {
    cy.visit(`/products/${productId}`);
    return this;
  }

  // Page actions
  selectTab(tab: 'description' | 'details' | 'benefits') {
    switch (tab) {
      case 'description':
        this.clickElement(this.tabDescription);
        break;
      case 'details':
        this.clickElement(this.tabDetails);
        break;
      case 'benefits':
        this.clickElement(this.tabBenefits);
        break;
    }
    return this;
  }

  selectQuantity(quantity: number) {
    cy.get(this.quantitySelect).select(quantity.toString());
    return this;
  }

  addToCart() {
    this.clickElement(this.addToCartButton);
    return this;
  }

  addToCartWithQuantity(quantity: number) {
    this.selectQuantity(quantity).addToCart();
    return this;
  }

  // Assertions
  shouldShowProductName(name: string) {
    this.shouldContainText(this.productName, name);
    return this;
  }

  shouldShowProductPrice(price: string) {
    this.shouldContainText(this.productPrice, price);
    return this;
  }

  shouldShowProductDescription(description: string) {
    this.shouldContainText(this.productDescription, description);
    return this;
  }

  shouldShowIngredients() {
    this.shouldBeVisible(this.productIngredients);
    return this;
  }

  shouldShowUsage() {
    this.shouldBeVisible(this.productUsage);
    return this;
  }

  shouldShowBenefits() {
    this.shouldBeVisible(this.productBenefits);
    return this;
  }
}