/// <reference types="cypress" />

describe('Login Flow', () => {
    beforeEach(() => {
      // Visit the login page before each test
      cy.visit('/auth/login');
    });
  
    it('displays the login form', () => {
      // Check if the login page is rendered correctly
      cy.get('[data-cy=login-page]').should('be.visible');
      cy.get('[data-cy=login-form]').should('be.visible');
      cy.get('[data-cy=email-input]').should('be.visible');
      cy.get('[data-cy=password-input]').should('be.visible');
      cy.get('[data-cy=login-button]').should('be.visible');
      cy.get('[data-cy=register-link]').should('be.visible');
    });
  
    it('shows error message with invalid credentials', () => {
      // Type invalid email and password
      cy.get('[data-cy=email-input]').type('invalid@example.com');
      cy.get('[data-cy=password-input]').type('wrongpassword');
      
      // Submit the form
      cy.get('[data-cy=login-button]').click();
      
      // Check if error message is displayed
      cy.get('[data-cy=login-error]').should('be.visible');
    });
  
    it('validates email format', () => {
      // Type invalid email format
      cy.get('[data-cy=email-input]').type('invalid-email');
      cy.get('[data-cy=email-input]').blur();
      
      // Check if validation error is displayed
      cy.get('[data-cy=email-error]').should('be.visible');
      
      // Login button should be disabled
      cy.get('[data-cy=login-button]').should('be.disabled');
    });
  
    it('navigates to register page', () => {
      // Click on register link
      cy.get('[data-cy=register-link]').click();
      
      // Check if redirected to register page
      cy.url().should('include', '/auth/register');
      cy.get('[data-cy=register-page]').should('be.visible');
    });
  
    it('successfully logs in with valid credentials', () => {
      // Intercept the login API call
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.operationName === 'SignIn') {
          req.reply({
            data: {
              signIn: {
                token: 'fake-jwt-token',
                user: {
                  id: '1',
                  email: 'test@example.com',
                  firstName: 'Test',
                  lastName: 'User',
                  profileCompleted: true,
                  surveyCompleted: true
                }
              }
            }
          });
        }
      }).as('loginRequest');
      
      // Type valid email and password
      cy.get('[data-cy=email-input]').type('test@example.com');
      cy.get('[data-cy=password-input]').type('password123');
      
      // Submit the form
      cy.get('[data-cy=login-button]').click();
      
      // Wait for the API call to complete
      cy.wait('@loginRequest');
      
      // Check if redirected to products page
      cy.url().should('include', '/products');
    });
  
    it('redirects to profile wizard if profile not completed', () => {
      // Intercept the login API call
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.operationName === 'SignIn') {
          req.reply({
            data: {
              signIn: {
                token: 'fake-jwt-token',
                user: {
                  id: '1',
                  email: 'test@example.com',
                  firstName: '',
                  lastName: '',
                  profileCompleted: false,
                  surveyCompleted: false
                }
              }
            }
          });
        }
      }).as('loginRequest');
      
      // Type valid email and password
      cy.get('[data-cy=email-input]').type('test@example.com');
      cy.get('[data-cy=password-input]').type('password123');
      
      // Submit the form
      cy.get('[data-cy=login-button]').click();
      
      // Wait for the API call to complete
      cy.wait('@loginRequest');
      
      // Check if redirected to profile wizard
      cy.url().should('include', '/profile');
    });
  
    it('redirects to survey if profile completed but survey not completed', () => {
      // Intercept the login API call
      cy.intercept('POST', '**/graphql', (req) => {
        if (req.body.operationName === 'SignIn') {
          req.reply({
            data: {
              signIn: {
                token: 'fake-jwt-token',
                user: {
                  id: '1',
                  email: 'test@example.com',
                  firstName: 'Test',
                  lastName: 'User',
                  profileCompleted: true,
                  surveyCompleted: false
                }
              }
            }
          });
        }
      }).as('loginRequest');
      
      // Type valid email and password
      cy.get('[data-cy=email-input]').type('test@example.com');
      cy.get('[data-cy=password-input]').type('password123');
      
      // Submit the form
      cy.get('[data-cy=login-button]').click();
      
      // Wait for the API call to complete
      cy.wait('@loginRequest');
      
      // Check if redirected to survey
      cy.url().should('include', '/survey');
    });
  });