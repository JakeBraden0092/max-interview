// cypress/e2e/shop/cart.cy.ts
import { CartPage } from '../../page-objects/shop/cart-page';
import { ProductDetailPage } from '../../page-objects/shop/product-detail-page';
import { CheckoutPage } from '../../page-objects/shop/checkout-page';
import { LoginPage } from '../../page-objects/auth/login-page';

describe('Cart Page', () => {
  beforeEach(() => {
    // Login first
    cy.fixture('users').then(({ validUser }) => {
      cy.mockLoginSuccess();
      const loginPage = new LoginPage();
      loginPage.visit().login(validUser.email, validUser.password);
      cy.wait('@loginRequest');
    });
    
    cy.mockAddToCartSuccess();
  });

  it('should show empty cart message when cart is empty', () => {
    const cartPage = new CartPage();
    cartPage
      .visit()
      .shouldBeEmpty();
  });

  it('should display products in cart', () => {
    // Mock product detail and add to cart
    cy.mockProductDetail('1');
    
    const productDetailPage = new ProductDetailPage();
    productDetailPage
      .visitWithOrderId('1')
      .wait('@productDetailRequest')
      .addToCart()
      .wait('@addToCartRequest');
    
    const cartPage = new CartPage();
    cartPage
      .visit()
      .shouldNotBeEmpty()
      .shouldContainItem('1')
      .shouldShowOrderSummary();
  });

  it('should update product quantity', () => {
    // Mock product detail and add to cart
    cy.mockProductDetail('1');
    
    const productDetailPage = new ProductDetailPage();
    productDetailPage
      .visitWithOrderId('1')
      .wait('@productDetailRequest')
      .addToCart()
      .wait('@addToCartRequest');
    
    const cartPage = new CartPage();
    cartPage
      .visit()
      .shouldContainItem('1')
      .updateQuantity('1', 4)
      .shouldHaveItemQuantity('1', 4);
  });

  it('should remove product from cart', () => {
    // Mock product detail and add to cart
    cy.mockProductDetail('1');
    
    const productDetailPage = new ProductDetailPage();
    productDetailPage
      .visitWithOrderId('1')
      .wait('@productDetailRequest')
      .addToCart()
      .wait('@addToCartRequest');
    
    const cartPage = new CartPage();
    cartPage
      .visit()
      .shouldContainItem('1')
      .removeItemFromCart('1')
      .shouldBeEmpty();
  });

  it('should navigate to checkout', () => {
    // Mock product detail and add to cart
    cy.mockProductDetail('1');
    
    const productDetailPage = new ProductDetailPage();
    productDetailPage
      .visitWithOrderId('1')
      .wait('@productDetailRequest')
      .addToCart()
      .wait('@addToCartRequest');
    
    const cartPage = new CartPage();
    cartPage
      .visit()
      .shouldContainItem('1')
      .proceedToCheckout();
    
    cy.url().should('include', '/checkout');
    
    const checkoutPage = new CheckoutPage();
    checkoutPage.shouldShowCheckoutPage();
  });

  it('should navigate back to products', () => {
    const cartPage = new CartPage();
    cartPage
      .visit()
      .shouldBeEmpty()
      .continueShopping();
    
    cy.url().should('include', '/products');
  });
});