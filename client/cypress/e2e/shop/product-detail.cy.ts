// cypress/e2e/shop/product-detail.cy.ts
import { ProductDetailPage } from '../../page-objects/shop/product-detail-page';
import { CartPage } from '../../page-objects/shop/cart-page';
import { LoginPage } from '../../page-objects/auth/login-page';

describe('Product Detail Page', () => {
  beforeEach(() => {
    // Login first
    cy.fixture('users').then(({ validUser }) => {
      cy.mockLoginSuccess();
      const loginPage = new LoginPage();
      loginPage.visit().login(validUser.email, validUser.password);
      cy.wait('@loginRequest');
    });
    
    // Mock product detail for product 1
    cy.mockProductDetail('1');
    cy.mockAddToCartSuccess();
  });

  it('should display product details', () => {
    const productDetailPage = new ProductDetailPage();
    productDetailPage
      .visitWithOrderId('1')
      .wait('@productDetailRequest')
      .shouldShowProductName('Daily Multivitamin')
      .shouldShowProductPrice('$24.99')
      .shouldShowProductDescription('Comprehensive vitamin and mineral supplement for daily wellness.');
  });

  it('should switch between tabs', () => {
    const productDetailPage = new ProductDetailPage();
    productDetailPage
      .visitWithOrderId('1')
      .wait('@productDetailRequest')
      .selectTab('details')
      .shouldShowIngredients()
      .shouldShowUsage()
      .selectTab('benefits')
      .shouldShowBenefits();
  });

  it('should add product to cart', () => {
    const productDetailPage = new ProductDetailPage();
    productDetailPage
      .visitWithOrderId('1')
      .wait('@productDetailRequest')
      .selectQuantity(3)
      .addToCart()
      .wait('@addToCartRequest');
    
    // Verify in cart
    const cartPage = new CartPage();
    cartPage
      .visit()
      .shouldContainItem('1')
      .shouldHaveItemQuantity('1', 3);
  });
});