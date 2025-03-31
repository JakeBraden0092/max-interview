import { BasePage } from '../../page-objects/base-page';

export class LoginPage extends BasePage {
  // Selectors
  emailInput = '[data-cy=email-input]';
  passwordInput = '[data-cy=password-input]';
  loginButton = '[data-cy=login-button]';
  errorMessage = '[data-cy=login-error]';
  registerLink = '[data-cy=register-link]';
  forgotPasswordLink = '[data-cy=forgot-password-link]';
  rememberMeCheckbox = '[data-cy=remember-me-checkbox]';

  constructor() {
    super('/auth/login');
  }

  // Page actions
  enterEmail(email: string) {
    this.typeText(this.emailInput, email);
    return this;
  }

  enterPassword(password: string) {
    this.typeText(this.passwordInput, password);
    return this;
  }

  clickLogin() {
    this.clickElement(this.loginButton);
    return this;
  }

  login(email: string, password: string) {
    this.enterEmail(email)
        .enterPassword(password)
        .clickLogin();
    return this;
  }

  toggleRememberMe() {
    this.clickElement(this.rememberMeCheckbox);
    return this;
  }

  navigateToRegister() {
    this.clickElement(this.registerLink);
    return this;
  }

  navigateToForgotPassword() {
    this.clickElement(this.forgotPasswordLink);
    return this;
  }

  // Assertions
  shouldShowLoginError() {
    this.shouldBeVisible(this.errorMessage);
    return this;
  }

  shouldHaveEmailError() {
    this.shouldBeVisible('[data-cy=email-error]');
    return this;
  }

  shouldHavePasswordError() {
    this.shouldBeVisible('[data-cy=password-error]');
    return this;
  }
}