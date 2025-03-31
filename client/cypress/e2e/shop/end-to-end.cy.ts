// cypress/e2e/shop/end-to-end.cy.ts
import { LoginPage } from '../../page-objects/auth/login-page';
import { ProductListPage } from '../../page-objects/shop/product-list-page';
import { ProductDetailPage } from '../../page-objects/shop/product-detail-page';
import { CartPage } from '../../page-objects/shop/cart-page';
import { CheckoutPage } from '../../page-objects/shop/checkout-page';
import { OrderConfirmationPage } from '../../page-objects/shop/order-confirmation-page';

describe('End-to-End Shopping Flow', () => {
  beforeEach(() => {
    // Set up mocks
    cy.mockLoginSuccess();
    cy.mockProductList();
    cy.mockAddToCartSuccess();
    cy.mockPlaceOrderSuccess();
    
    // Login
    cy.fixture('users').then(({ validUser }) => {
      const loginPage = new LoginPage();
      loginPage.visit().login(validUser.email, validUser.password);
    //   cy.wait('@loginRequest');
    });
  });

  it('should complete the entire shopping flow', () => {
    // Visit product list
    const productListPage = new ProductListPage();
    productListPage
      .visit()
    //   .wait('@productListRequest');
    
    // Mock product detail for product 1
    cy.mockProductDetail('1');
    
    // Select a product
    productListPage.clickProduct('1');
    // cy.wait('@productDetailRequest');
    
    // Add product to cart
    const productDetailPage = new ProductDetailPage();
    productDetailPage
      .addToCartWithQuantity(2)
    //   .wait('@addToCartRequest');
    
    // Go to cart
    const cartPage = new CartPage();
    cartPage
      .visit()
      .shouldContainItem('1')
      .shouldHaveItemQuantity('1', 2)
      .proceedToCheckout();
    
    // Fill checkout information
    cy.fixture('users').then(({ validUser, creditCard }) => {
      const checkoutPage = new CheckoutPage();
      checkoutPage
        .shouldShowCheckoutPage()
        .fillShippingInformation(validUser)
        .fillCreditCardInformation(creditCard)
        .placeOrder()
        // .wait('@placeOrderRequest');
    });
    
    // Check order confirmation
    const orderConfirmationPage = new OrderConfirmationPage();
    orderConfirmationPage
      .shouldShowConfirmationPage()
      .continueShopping();
    
    // Should redirect back to products
    cy.url().should('include', '/products');
    
    // Optional: Check that the cart is now empty
    cartPage
      .visit()
      .shouldBeEmpty();
  });
  
  it('should add multiple products to cart', () => {
    // Mock product details
    cy.mockProductDetail('1');
    cy.mockProductDetail('2');
    
    // Visit first product and add to cart
    const productDetailPage = new ProductDetailPage();
    productDetailPage
      .visitWithOrderId('1')
    //   .wait('@productDetailRequest')
      .addToCart()
    //   .wait('@addToCartRequest');
      
    // Visit second product and add to cart
    productDetailPage
      .visitWithOrderId('2')
    //   .wait('@productDetailRequest')
      .addToCart()
    //   .wait('@addToCartRequest');
    
    // Go to cart and verify
    const cartPage = new CartPage();
    cartPage
      .visit()
      .shouldContainItem('1')
      .shouldContainItem('2')
      .shouldShowOrderSummary();
  });
  
  it('should update cart quantities', () => {
    // Mock product detail
    cy.mockProductDetail('1');
    
    // Add product to cart
    const productDetailPage = new ProductDetailPage();
    productDetailPage
      .visitWithOrderId('1')
    //   .wait('@productDetailRequest')
      .addToCart()
    //   .wait('@addToCartRequest');
    
    // Update quantity in cart
    const cartPage = new CartPage();
    cartPage
      .visit()
      .shouldContainItem('1')
      .updateQuantity('1', 3)
      .shouldHaveItemQuantity('1', 3);
  });
  
  it('should remove items from cart', () => {
    // Mock product details
    cy.mockProductDetail('1');
    cy.mockProductDetail('2');
    
    // Add two products to cart
    const productDetailPage = new ProductDetailPage();
    productDetailPage
      .visitWithOrderId('1')
    //   .wait('@productDetailRequest')
      .addToCart()
    //   .wait('@addToCartRequest');
      
    productDetailPage
      .visitWithOrderId('2')
    //   .wait('@productDetailRequest')
      .addToCart()
    //   .wait('@addToCartRequest');
    
    // Remove one item from cart
    const cartPage = new CartPage();
    cartPage
      .visit()
      .shouldContainItem('1')
      .shouldContainItem('2')
      .removeItemFromCart('1')
      .shouldNotContainItem('1')
      .shouldContainItem('2');
  });
});