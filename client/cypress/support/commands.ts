/// <reference types="cypress" />

// Auth commands
Cypress.Commands.add('mockLoginSuccess', function(user = {}) {
  const defaultUser = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    profileCompleted: true,
    surveyCompleted: true
  };

  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'SignIn') {
      req.reply({
        data: {
          signIn: {
            token: 'fake-jwt-token',
            user: { ...defaultUser, ...user }
          }
        }
      });
    }
  }).as('loginRequest');
});

Cypress.Commands.add('mockLoginFailure', function() {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'SignIn') {
      req.reply({
        errors: [
          {
            message: 'Invalid email or password',
            locations: [{ line: 1, column: 1 }],
            path: ['signIn']
          }
        ]
      });
    }
  }).as('loginRequest');
});

Cypress.Commands.add('mockRegisterSuccess', function(user = {}) {
  const defaultUser = {
    id: '1',
    email: 'new@example.com',
    profileCompleted: false,
    surveyCompleted: false
  };

  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'SignUp') {
      req.reply({
        data: {
          signUp: {
            token: 'fake-jwt-token',
            user: { ...defaultUser, ...user }
          }
        }
      });
    }
  }).as('registerRequest');
});

Cypress.Commands.add('mockRegisterFailure', function(message = 'Email already in use') {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'SignUp') {
      req.reply({
        errors: [
          {
            message,
            locations: [{ line: 1, column: 1 }],
            path: ['signUp']
          }
        ]
      });
    }
  }).as('registerRequest');
});

Cypress.Commands.add('mockForgotPasswordSuccess', function() {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'ForgotPassword') {
      req.reply({
        data: {
          forgotPassword: true
        }
      });
    }
  }).as('forgotPasswordRequest');
});

Cypress.Commands.add('mockForgotPasswordFailure', function() {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'ForgotPassword') {
      req.reply({
        errors: [
          {
            message: 'Email not found',
            locations: [{ line: 1, column: 1 }],
            path: ['forgotPassword']
          }
        ]
      });
    }
  }).as('forgotPasswordRequest');
});

// Profile commands
Cypress.Commands.add('mockUpdateProfileSuccess', function(user = {}) {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'UpdateProfile') {
      req.reply({
        data: {
          updateProfile: {
            ...user,
            profileCompleted: true
          }
        }
      });
    }
  }).as('updateProfileRequest');
});

Cypress.Commands.add('mockUpdateSurveySuccess', function() {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'UpdateSurvey') {
      req.reply({
        data: {
          updateSurvey: {
            surveyCompleted: true
          }
        }
      });
    }
  }).as('updateSurveyRequest');
});

// Product commands
Cypress.Commands.add('mockProductList', function() {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'GetProducts') {
      cy.fixture('products').then(({ products }) => {
        req.reply({
          data: {
            products
          }
        });
      });
    }
  }).as('productListRequest');
});

Cypress.Commands.add('mockProductDetail', function(productId) {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'GetProduct') {
      cy.fixture('products').then(({ products }) => {
        const product = products.find((p:any) => p.id === productId);
        req.reply({
          data: {
            product
          }
        });
      });
    }
  }).as('productDetailRequest');
});

// Cart commands
Cypress.Commands.add('mockAddToCartSuccess', function() {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'AddToCart') {
      req.reply({
        data: {
          addToCart: true
        }
      });
    }
  }).as('addToCartRequest');
});

Cypress.Commands.add('mockUpdateCartItemSuccess', function() {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'UpdateCartItem') {
      req.reply({
        data: {
          updateCartItem: true
        }
      });
    }
  }).as('updateCartItemRequest');
});

Cypress.Commands.add('mockRemoveCartItemSuccess', function() {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'RemoveCartItem') {
      req.reply({
        data: {
          removeCartItem: true
        }
      });
    }
  }).as('removeCartItemRequest');
});

// Order commands
Cypress.Commands.add('mockPlaceOrderSuccess', function() {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'PlaceOrder') {
      req.reply({
        data: {
          placeOrder: {
            id: 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase()
          }
        }
      });
    }
  }).as('placeOrderRequest');
});

Cypress.Commands.add('mockOrderHistory', function() {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'GetOrders') {
      cy.fixture('orders').then(({ orders }) => {
        req.reply({
          data: {
            orders
          }
        });
      });
    }
  }).as('orderHistoryRequest');
});

Cypress.Commands.add('mockOrderDetail', function(orderId) {
  cy.intercept('POST', '**/graphql', (req) => {
    if (req.body.operationName === 'GetOrder') {
      cy.fixture('orders').then(({ orders }) => {
        const order = orders.find((o:any) => o.id === orderId);
        req.reply({
          data: {
            order
          }
        });
      });
    }
  }).as('orderDetailRequest');
});

// Auth helpers
Cypress.Commands.add('login', function(email, password) {
  cy.visit('/auth/login');
  cy.get('[data-cy=email-input]').type(email);
  cy.get('[data-cy=password-input]').type(password);
  cy.get('[data-cy=login-button]').click();
});

Cypress.Commands.add('loginWithMock', function(email, password, user = {}) {
  cy.mockLoginSuccess(user);
  cy.login(email, password);
  cy.wait('@loginRequest');
});

// Navigation helpers
Cypress.Commands.add('navigateToProducts', function() {
  cy.get('[data-cy=products-link]').click();
});

Cypress.Commands.add('navigateToCart', function() {
  cy.get('[data-cy=cart-link]').click();
});

Cypress.Commands.add('navigateToOrderHistory', function() {
  cy.get('[data-cy=order-history-link]').click();
});

Cypress.Commands.add('navigateToProfile', function() {
  cy.get('[data-cy=user-menu-button]').click();
  cy.get('[data-cy=profile-link]').click();
});

Cypress.Commands.add('logout', function() {
  cy.get('[data-cy=user-menu-button]').click();
  cy.get('[data-cy=logout-button]').click();
});

// Checkout helpers
Cypress.Commands.add('fillShippingInfo', function(user) {
  cy.get('[data-cy=shipping-firstName]').type(user.firstName);
  cy.get('[data-cy=shipping-lastName]').type(user.lastName);
  cy.get('[data-cy=shipping-email]').type(user.email);
  cy.get('[data-cy=shipping-phone]').type(user.phone);
  cy.get('[data-cy=shipping-addressLine1]').type(user.address);
  cy.get('[data-cy=shipping-city]').type(user.city);
  cy.get('[data-cy=shipping-state]').type(user.state);
  cy.get('[data-cy=shipping-postalCode]').type(user.postalCode);
  cy.get('[data-cy=shipping-country]').select(user.country);
});

Cypress.Commands.add('fillCreditCardInfo', function(card) {
  cy.get('[data-cy=payment-credit-card]').click();
  cy.get('[data-cy=payment-cardName]').type(card.name);
  cy.get('[data-cy=payment-cardNumber]').type(card.number);
  cy.get('[data-cy=payment-expDate]').type(card.expDate);
  cy.get('[data-cy=payment-cvv]').type(card.cvv);
});

// Shopping cart helpers
Cypress.Commands.add('addProductToCart', function(productId, quantity = 1) {
  cy.mockProductDetail(productId);
  cy.mockAddToCartSuccess();
  cy.visit(`/products/${productId}`);
  cy.wait('@productDetailRequest');
  if (quantity > 1) {
    cy.get('[data-cy=quantity-select]').select(quantity.toString());
  }
  cy.get('[data-cy=add-to-cart-button]').click();
  cy.wait('@addToCartRequest');
});

Cypress.Commands.add('completeCheckout', function(userData, cardData) {
  cy.mockPlaceOrderSuccess();
  cy.visit('/checkout');
  cy.fillShippingInfo(userData);
  cy.fillCreditCardInfo(cardData);
  cy.get('[data-cy=place-order-button]').click();
  cy.wait('@placeOrderRequest');
});