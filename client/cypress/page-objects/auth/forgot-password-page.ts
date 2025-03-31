// cypress/page-objects/auth/forgot-password-page.ts
import { BasePage } from '../base-page';

export class ForgotPasswordPage extends BasePage {
  // Selectors
  emailInput = '[data-cy=email-input]';
  submitButton = '[data-cy=submit-button]';
  errorMessage = '[data-cy=reset-error]';
  successMessage = '[data-cy=reset-success]';
  backToLoginLink = '[data-cy=back-to-login]';

  constructor() {
    super('/auth/forgot-password');
  }

  // Page actions
  enterEmail(email: string) {
    this.typeText(this.emailInput, email);
    return this;
  }

  clickSubmit() {
    this.clickElement(this.submitButton);
    return this;
  }

  requestPasswordReset(email: string) {
    this.enterEmail(email).clickSubmit();
    return this;
  }

  navigateToLogin() {
    this.clickElement(this.backToLoginLink);
    return this;
  }

  // Assertions
  shouldShowError() {
    this.shouldBeVisible(this.errorMessage);
    return this;
  }

  shouldShowSuccess() {
    this.shouldBeVisible(this.successMessage);
    return this;
  }

  shouldHaveEmailError() {
    this.shouldBeVisible('[data-cy=email-error]');
    return this;
  }
}