// cypress/e2e/shop/product-list.cy.ts
import { ProductListPage } from '../../page-objects/shop/product-list-page';
import { ProductDetailPage } from '../../page-objects/shop/product-detail-page';
import { LoginPage } from '../../page-objects/auth/login-page';
import { NavBar } from '../../page-objects/components/nav-bar';

describe('Product List Functionality', () => {
  beforeEach(() => {
    // Login first
    cy.fixture('users').then(({ validUser }) => {
      cy.mockLoginSuccess();
      const loginPage = new LoginPage();
      loginPage.visit().login(validUser.email, validUser.password);
      cy.wait('@loginRequest');
    });

    // Mock products
    cy.mockProductList();
  });

  it('should display product list', () => {
    const productListPage = new ProductListPage();
    productListPage
      .visit()
      .wait('@productListRequest')
      .shouldShowProducts(3);
  });

  it('should filter products by category', () => {
    const productListPage = new ProductListPage();
    productListPage
      .visit()
      .wait('@productListRequest')
      .selectCategory('Vitamins')
      .shouldShowProducts(1)
      .shouldContainProduct('1');
  });

  it('should sort products by price (low to high)', () => {
    const productListPage = new ProductListPage();
    productListPage
      .visit()
      .wait('@productListRequest')
      .sortBy('price-low');
    
    // Check that the Omega-3 product (lowest price) is displayed first
    cy.get('[data-cy=product-grid] > a').first().should('contain', 'Omega-3');
  });

  it('should navigate to product detail page', () => {
    // Mock product detail
    cy.mockProductDetail('1');
    
    const productListPage = new ProductListPage();
    productListPage
      .visit()
      .wait('@productListRequest')
      .clickProduct('1');
    
    cy.url().should('include', '/products/1');
    
    const productDetailPage = new ProductDetailPage();
    productDetailPage.shouldShowProductName('Daily Multivitamin');
  });

  it('should handle navigation through navbar', () => {
    const navBar = new NavBar();
    const productListPage = new ProductListPage();
    
    productListPage.visit().wait('@productListRequest');
    
    navBar.navigateToCart();
    cy.url().should('include', '/cart');
    
    navBar.navigateToProducts();
    cy.url().should('include', '/products');
    
    navBar.navigateToOrderHistory();
    cy.url().should('include', '/order-history');
  });
});