// cypress/e2e/shop/checkout.cy.ts
import { CheckoutPage } from '../../page-objects/shop/checkout-page';
import { CartPage } from '../../page-objects/shop/cart-page';
import { ProductDetailPage } from '../../page-objects/shop/product-detail-page';
import { OrderConfirmationPage } from '../../page-objects/shop/order-confirmation-page';
import { LoginPage } from '../../page-objects/auth/login-page';

describe('Checkout Process', () => {
  beforeEach(() => {
    // Login first
    cy.fixture('users').then(({ validUser }) => {
      cy.mockLoginSuccess();
      const loginPage = new LoginPage();
      loginPage.visit().login(validUser.email, validUser.password);
      cy.wait('@loginRequest');
    });
    
    // Add product to cart
    cy.mockProductDetail('1');
    cy.mockAddToCartSuccess();
    
    const productDetailPage = new ProductDetailPage();
    productDetailPage
      .visitWithOrderId('1')
      .wait('@productDetailRequest')
      .addToCart()
      .wait('@addToCartRequest');
    
    // Navigate to checkout
    const cartPage = new CartPage();
    cartPage
      .visit()
      .proceedToCheckout();
    
    // Mock place order
    cy.mockPlaceOrderSuccess();
  });

  it('should show checkout page with summary', () => {
    const checkoutPage = new CheckoutPage();
    checkoutPage
      .shouldShowCheckoutPage()
      .shouldShowCheckoutSummary();
  });

  it('should allow selection of payment methods', () => {
    const checkoutPage = new CheckoutPage();
    
    // Test credit card method
    checkoutPage
      .selectPaymentMethod('credit-card')
      .shouldBeVisible(checkoutPage.paymentCardName);
    
    // Test PayPal method
    checkoutPage
      .selectPaymentMethod('paypal')
      .shouldBeVisible('[data-cy=payment-paypal]');
  });

  it('should complete checkout process with credit card', () => {
    cy.fixture('users').then(({ validUser, creditCard }) => {
      const checkoutPage = new CheckoutPage();
      checkoutPage
        .fillShippingInformation(validUser)
        .fillCreditCardInformation(creditCard)
        .placeOrder()
        .wait('@placeOrderRequest');
      
      // Check redirect to confirmation page
      const orderConfirmationPage = new OrderConfirmationPage();
      orderConfirmationPage.shouldShowConfirmationPage();
    });
  });

  it('should validate required fields', () => {
    const checkoutPage = new CheckoutPage();
    
    // Clear first name and try to submit
    checkoutPage
      .typeText(checkoutPage.shippingFirstName, ' ')
      .getElement(checkoutPage.shippingFirstName).clear()
    checkoutPage.placeOrder();
    
    // Check for error
    cy.get('[data-cy=firstName-error]').should('be.visible');
    
    // URL should still be checkout
    cy.url().should('include', '/checkout');
  });
});