// cypress/e2e/auth/forgot-password.cy.ts
import { ForgotPasswordPage } from '../../page-objects/auth/forgot-password-page';
import { LoginPage } from '../../page-objects/auth/login-page';

describe('Forgot Password Functionality', () => {
  let forgotPasswordPage: ForgotPasswordPage;

  beforeEach(() => {
    forgotPasswordPage = new ForgotPasswordPage();
    forgotPasswordPage.visit();
  });

  it('should display forgot password form', () => {
    forgotPasswordPage
      .shouldBeVisible('[data-cy=forgot-password-page]')
      .shouldBeVisible('[data-cy=reset-form]')
      .shouldBeVisible('[data-cy=email-input]')
      .shouldBeVisible('[data-cy=submit-button]');
  });

  it('should validate email format', () => {
    forgotPasswordPage
    .enterEmail('invalid-email');
    forgotPasswordPage.getElement(forgotPasswordPage.emailInput).blur();
    forgotPasswordPage.shouldHaveEmailError();
  });

  it('should show success message for valid email', () => {
    cy.mockForgotPasswordSuccess();
    cy.fixture('users').then(({ validUser }) => {
      forgotPasswordPage
        .requestPasswordReset(validUser.email)
        // .wait('@forgotPasswordRequest')
        .shouldShowSuccess();
    });
  });

  it('should navigate back to login page', () => {
    forgotPasswordPage.navigateToLogin();
    cy.url().should('include', '/auth/login');
    
    const loginPage = new LoginPage();
    loginPage.shouldBeVisible('[data-cy=login-page]');
  });
});