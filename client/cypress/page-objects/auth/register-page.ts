// cypress/page-objects/auth/register-page.ts
import { BasePage } from '../../page-objects/base-page';

export class RegisterPage extends BasePage {
  // Selectors
  emailInput = '[data-cy=email-input]';
  passwordInput = '[data-cy=password-input]';
  confirmPasswordInput = '[data-cy=confirm-password-input]';
  registerButton = '[data-cy=register-button]';
  errorMessage = '[data-cy=register-error]';
  loginLink = '[data-cy=login-link]';

  constructor() {
    super('/auth/register');
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

  enterConfirmPassword(password: string) {
    this.typeText(this.confirmPasswordInput, password);
    return this;
  }

  clickRegister() {
    this.clickElement(this.registerButton);
    return this;
  }

  register(email: string, password: string) {
    this.enterEmail(email)
        .enterPassword(password)
        .enterConfirmPassword(password)
        .clickRegister();
    return this;
  }

  navigateToLogin() {
    this.clickElement(this.loginLink);
    return this;
  }

  // Assertions
  shouldShowRegisterError() {
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

  shouldHaveConfirmPasswordError() {
    this.shouldBeVisible('[data-cy=confirm-password-error]');
    return this;
  }
}