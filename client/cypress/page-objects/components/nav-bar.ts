// cypress/page-objects/components/nav-bar.ts
import { BasePage } from '../base-page';

export class NavBar extends BasePage {
  // Selectors
  logoLink = '[data-cy=logo-link]';
  productsLink = '[data-cy=products-link]';
  cartLink = '[data-cy=cart-link]';
  orderHistoryLink = '[data-cy=order-history-link]';
  userMenuButton = '[data-cy=user-menu-button]';
  userDropdown = '[data-cy=user-dropdown]';
  profileLink = '[data-cy=profile-link]';
  logoutButton = '[data-cy=logout-button]';
  
  // Mobile selectors
  mobileMenuButton = '[data-cy=mobile-menu-button]';
  mobileMenu = '[data-cy=mobile-menu]';
  mobileProductsLink = '[data-cy=mobile-products-link]';
  mobileCartLink = '[data-cy=mobile-cart-link]';
  mobileOrdersLink = '[data-cy=mobile-orders-link]';
  mobileProfileLink = '[data-cy=mobile-profile-link]';
  mobileLogoutButton = '[data-cy=mobile-logout-button]';

  // Page actions
  clickLogo() {
    this.clickElement(this.logoLink);
    return this;
  }

  navigateToProducts() {
    this.clickElement(this.productsLink);
    return this;
  }

  navigateToCart() {
    this.clickElement(this.cartLink);
    return this;
  }

  navigateToOrderHistory() {
    this.clickElement(this.orderHistoryLink);
    return this;
  }

  openUserMenu() {
    this.clickElement(this.userMenuButton);
    return this;
  }

  navigateToProfile() {
    this.openUserMenu();
    this.clickElement(this.profileLink);
    return this;
  }

  logout() {
    this.openUserMenu();
    this.clickElement(this.logoutButton);
    return this;
  }

  // Mobile actions
  openMobileMenu() {
    this.clickElement(this.mobileMenuButton);
    return this;
  }

  navigateToProductsMobile() {
    this.openMobileMenu();
    this.clickElement(this.mobileProductsLink);
    return this;
  }

  navigateToCartMobile() {
    this.openMobileMenu();
    this.clickElement(this.mobileCartLink);
    return this;
  }

  navigateToOrderHistoryMobile() {
    this.openMobileMenu();
    this.clickElement(this.mobileOrdersLink);
    return this;
  }

  navigateToProfileMobile() {
    this.openMobileMenu();
    this.clickElement(this.mobileProfileLink);
    return this;
  }

  logoutMobile() {
    this.openMobileMenu();
    this.clickElement(this.mobileLogoutButton);
    return this;
  }

  // Assertions
  shouldShowUserDropdown() {
    this.shouldBeVisible(this.userDropdown);
    return this;
  }

  shouldShowMobileMenu() {
    this.shouldBeVisible(this.mobileMenu);
    return this;
  }
}