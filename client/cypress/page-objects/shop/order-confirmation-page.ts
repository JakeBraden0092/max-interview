// cypress/page-objects/shop/order-confirmation-page.ts
import { BasePage } from '../base-page';

export class OrderConfirmationPage extends BasePage {
  // Selectors
  confirmationPage = '[data-cy=order-confirmation-page]';
  orderNumber = '[data-cy=order-number]';
  continueShoppingLink = '[data-cy=continue-shopping-link]';

  constructor() {
    super('/order-confirmation');
  }

  visitWithOrderId(orderId: string) {
    cy.visit(`/order-confirmation/${orderId}`);
    return this;
  }

  // Page actions
  continueShopping() {
    this.clickElement(this.continueShoppingLink);
    return this;
  }

  // Assertions
  shouldShowConfirmationPage() {
    this.shouldBeVisible(this.confirmationPage);
    return this;
  }

  shouldShowOrderNumber(orderId: string) {
    this.shouldContainText(this.orderNumber, orderId);
    return this;
  }
}