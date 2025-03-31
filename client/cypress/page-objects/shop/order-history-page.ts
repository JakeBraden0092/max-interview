// cypress/page-objects/shop/order-history-page.ts
import { BasePage } from '../base-page';

export class OrderHistoryPage extends BasePage {
  // Selectors
  orderHistoryPage = '[data-cy=order-history-page]';
  noOrders = '[data-cy=no-orders]';
  ordersList = '[data-cy=orders-list]';
  startShoppingButton = '[data-cy=start-shopping-button]';
  
  // Order specific selectors
  order = (id: string) => `[data-cy=order-${id}]`;
  viewOrderButton = (id: string) => `[data-cy=view-order-${id}]`;
  trackOrderButton = (id: string) => `[data-cy=track-order-${id}]`;

  constructor() {
    super('/order-history');
  }

  // Page actions
  startShopping() {
    this.clickElement(this.startShoppingButton);
    return this;
  }

  viewOrderDetails(orderId: string) {
    this.clickElement(this.viewOrderButton(orderId));
    return this;
  }

  trackOrder(orderId: string) {
    this.clickElement(this.trackOrderButton(orderId));
    return this;
  }

  // Assertions
  shouldShowOrderHistoryPage() {
    this.shouldBeVisible(this.orderHistoryPage);
    return this;
  }

  shouldShowNoOrders() {
    this.shouldBeVisible(this.noOrders);
    return this;
  }

  shouldShowOrdersList() {
    this.shouldBeVisible(this.ordersList);
    return this;
  }

  shouldContainOrder(orderId: string) {
    this.shouldBeVisible(this.order(orderId));
    return this;
  }

  shouldNotContainOrder(orderId: string) {
    cy.get(this.order(orderId)).should('not.exist');
    return this;
  }
}