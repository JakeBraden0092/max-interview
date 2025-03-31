import { LoginPage } from '../../page-objects/auth/login-page';
import { RegisterPage } from '../../page-objects/auth/register-page';
import { ForgotPasswordPage } from '../../page-objects/auth/forgot-password-page';

describe('Login Functionality', () => {
  let loginPage: LoginPage;

  beforeEach(() => {
    loginPage = new LoginPage();
    loginPage.visit();
  });

  it('should display login form', () => {
    loginPage
      .shouldBeVisible('[data-cy=login-page]')
      .shouldBeVisible('[data-cy=login-form]')
      .shouldBeVisible('[data-cy=email-input]')
      .shouldBeVisible('[data-cy=password-input]')
      .shouldBeVisible('[data-cy=login-button]');
  });

  //TO-DO: Implement when auth guard

//   it('should show error message with invalid credentials', () => {
//     cy.mockLoginFailure();

//     loginPage
//       .login('invalid@example.com', 'wrongpassword')
//     //   .wait('@loginRequest')
//       .shouldShowLoginError();
//   });

  it('should validate email format', () => {
    loginPage
    .enterEmail('invalid-email');
    loginPage.getElement(loginPage.emailInput).blur();
    loginPage.shouldHaveEmailError();
  });

  it('should navigate to register page', () => {
    loginPage.navigateToRegister();
    cy.url().should('include', '/auth/register');
    
    const registerPage = new RegisterPage();
    registerPage.shouldBeVisible('[data-cy=register-page]');
  });
  
  it('should navigate to forgot password page', () => {
    loginPage.navigateToForgotPassword();
    cy.url().should('include', '/auth/forgot-password');
    
    const forgotPasswordPage = new ForgotPasswordPage();
    forgotPasswordPage.shouldBeVisible('[data-cy=forgot-password-page]');
  });

  it('should successfully login with valid credentials', () => {
    cy.fixture('users').then(({ validUser }) => {
      cy.mockLoginSuccess();

      loginPage
        .login(validUser.email, validUser.password)
        // .wait('@loginRequest');
        
      cy.url().should('include', '/profile');
    });
  });


  //@TO-DO: Implement when auth guard in pace


//   it('should redirect to profile wizard if profile not completed', () => {
//     cy.fixture('users').then(({ incompleteProfileUser }) => {
//       cy.mockLoginSuccess({
//         profileCompleted: false,
//         surveyCompleted: false
//       });

//       loginPage
//         .login(incompleteProfileUser.email, incompleteProfileUser.password)
//         // .wait('@loginRequest');
      
//       cy.url().should('include', '/profile');
//     });
//   });

//   it('should redirect to survey if profile completed but survey not completed', () => {
//     cy.mockLoginSuccess({
//       profileCompleted: true,
//       surveyCompleted: false
//     });

//     loginPage
//       .login('test@example.com', 'password123')
//     //   .wait('@loginRequest');
    
//     cy.url().should('include', '/survey');
//   });
});