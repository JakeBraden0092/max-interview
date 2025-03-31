// cypress/e2e/shop/order-history.cy.ts
import { OrderHistoryPage } from '../../page-objects/shop/order-history-page';
import { LoginPage } from '../../page-objects/auth/login-page';
import { ProductListPage } from '../../page-objects/shop/product-list-page';

describe('Order History', () => {
  beforeEach(() => {
    // Login first
    cy.fixture('users').then(({ validUser }) => {
      cy.mockLoginSuccess();
      const loginPage = new LoginPage();
      loginPage.visit().login(validUser.email, validUser.password);
      cy.wait('@loginRequest');
    });
  });

  it('should show empty state when no orders', () => {
    // Mock empty order history
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'GetOrders') {
        req.reply({
          data: {
            orders: []
          }
        });
      }
    }).as('emptyOrderHistoryRequest');
    
    const orderHistoryPage = new OrderHistoryPage();
    orderHistoryPage
      .visit()
      .wait('@emptyOrderHistoryRequest')
      .shouldShowNoOrders();
  });

  it('should display order history', () => {
    // Mock order history
    cy.mockOrderHistory();
    
    const orderHistoryPage = new OrderHistoryPage();
    orderHistoryPage
      .visit()
      .wait('@orderHistoryRequest')
      .shouldShowOrdersList()
      .shouldContainOrder('ORD-2023-1001')
      .shouldContainOrder('ORD-2023-0932');
  });

  it('should navigate to products when clicking start shopping', () => {
    // Mock empty order history
    cy.intercept('POST', '**/graphql', (req) => {
      if (req.body.operationName === 'GetOrders') {
        req.reply({
          data: {
            orders: []
          }
        });
      }
    }).as('emptyOrderHistoryRequest');
    
    const orderHistoryPage = new OrderHistoryPage();
    orderHistoryPage
      .visit()
      .wait('emptyOrderHistoryRequest')
      .shouldShowNoOrders()
      .startShopping();
    
    cy.url().should('include', '/products');
    
    const productListPage = new ProductListPage();
    productListPage.shouldBeVisible('[data-cy=product-list-page]');
  });
});