// cypress/page-objects/shop/cart-page.ts
import { BasePage } from '../base-page';

export class CartPage extends BasePage {
  // Selectors
  emptyCart = '[data-cy=empty-cart]';
  cartPage = '[data-cy=cart-page]';
  orderSummary = '[data-cy=order-summary]';
  checkoutButton = '[data-cy=checkout-button]';
  startShoppingButton = '[data-cy=start-shopping-button]';
  
  cartItem = (id: string) => `[data-cy=cart-item-${id}]`;
  itemQuantity = (id: string) => `[data-cy=item-quantity-${id}]`;
  removeItem = (id: string) => `[data-cy=remove-item-${id}]`;

  constructor() {
    super('/cart');
  }

  // Page actions
  updateQuantity(productId: string, quantity: number) {
    cy.get(this.itemQuantity(productId)).select(quantity.toString());
    return this;
  }

  removeItemFromCart(productId: string) {
    this.clickElement(this.removeItem(productId));
    return this;
  }

  proceedToCheckout() {
    this.clickElement(this.checkoutButton);
    return this;
  }

  continueShopping() {
    this.clickElement(this.startShoppingButton);
    return this;
  }

  // Assertions
  shouldBeEmpty() {
    this.shouldBeVisible(this.emptyCart);
    return this;
  }

  shouldNotBeEmpty() {
    this.shouldBeVisible(this.cartPage);
    return this;
  }

  shouldContainItem(productId: string) {
    this.shouldBeVisible(this.cartItem(productId));
    return this;
  }

  shouldNotContainItem(productId: string) {
    cy.get(this.cartItem(productId)).should('not.exist');
    return this;
  }

  shouldHaveItemQuantity(productId: string, quantity: number) {
    cy.get(this.itemQuantity(productId)).should('have.value', quantity.toString());
    return this;
  }

  shouldShowOrderSummary() {
    this.shouldBeVisible(this.orderSummary);
    return this;
  }
}