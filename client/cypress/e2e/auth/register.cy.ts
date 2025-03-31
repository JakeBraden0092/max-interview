// cypress/e2e/auth/register.cy.ts
import { RegisterPage } from '../../page-objects/auth/register-page';
import { LoginPage } from '../../page-objects/auth/login-page';

describe('Registration Functionality', () => {
  let registerPage: RegisterPage;

  beforeEach(() => {
    registerPage = new RegisterPage();
    registerPage.visit();
  });

  it('should display registration form', () => {
    registerPage
      .shouldBeVisible('[data-cy=register-page]')
      .shouldBeVisible('[data-cy=register-form]')
      .shouldBeVisible('[data-cy=email-input]')
      .shouldBeVisible('[data-cy=password-input]')
      .shouldBeVisible('[data-cy=confirm-password-input]')
      .shouldBeVisible('[data-cy=register-button]');
  });

  it('should validate email format', () => {
    registerPage
    .enterEmail('invalid-email');
    registerPage.getElement(registerPage.emailInput).blur();
    registerPage.shouldHaveEmailError();
  });

  it('should validate password requirements', () => {
    registerPage
      .enterEmail('valid@example.com')
      .enterPassword('short')
      registerPage.getElement(registerPage.passwordInput).blur()
      registerPage.shouldHavePasswordError();
  });

  it('should validate password confirmation', () => {
    registerPage
      .enterEmail('valid@example.com')
      .enterPassword('Password123!')
      .enterConfirmPassword('DifferentPassword123!')
      .getElement(registerPage.confirmPasswordInput).blur()
      registerPage.shouldHaveConfirmPasswordError();
  });

//   it('should show error for existing email', () => {
//     cy.mockRegisterFailure();
//     cy.fixture('users').then(({ validUser }) => {
//       registerPage
//         .register(validUser.email, 'Password123!')
//         .wait('@registerRequest')
//         .shouldShowRegisterError();
//     });
//   });

  it('should successfully register a new user', () => {
    cy.mockRegisterSuccess();
    cy.fixture('users').then(({ newUser }) => {
      registerPage
        .register(newUser.email, newUser.password)
        // .wait('@registerRequest');
      
      cy.url().should('include', '/profile');
    });
  });

  it('should navigate to login page', () => {
    registerPage.navigateToLogin();
    cy.url().should('include', '/auth/login');
    
    const loginPage = new LoginPage();
    loginPage.shouldBeVisible('[data-cy=login-page]');
  });
});