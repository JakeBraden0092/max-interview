// cypress.d.ts
/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable<Subject = any> {
      // Auth commands
      mockLoginSuccess(user?: Record<string, any>): Chainable<void>
      mockLoginFailure(): Chainable<void>
      mockRegisterSuccess(user?: Record<string, any>): Chainable<void>
      mockRegisterFailure(message?: string): Chainable<void>
      mockForgotPasswordSuccess(): Chainable<void>
      mockForgotPasswordFailure(): Chainable<void>
      
      // Profile commands
      mockUpdateProfileSuccess(user?: Record<string, any>): Chainable<void>
      mockUpdateSurveySuccess(): Chainable<void>
      
      // Product commands
      mockProductList(): Chainable<void>
      mockProductDetail(productId: string): Chainable<void>
      
      // Cart commands
      mockAddToCartSuccess(): Chainable<void>
      mockUpdateCartItemSuccess(): Chainable<void>
      mockRemoveCartItemSuccess(): Chainable<void>
      
      // Order commands
      mockPlaceOrderSuccess(): Chainable<void>
      mockOrderHistory(): Chainable<void>
      mockOrderDetail(orderId: string): Chainable<void>
      
      // Auth helpers
      login(email: string, password: string): Chainable<void>
      loginWithMock(email: string, password: string, user?: Record<string, any>): Chainable<void>
      
      // Navigation helpers
      navigateToProducts(): Chainable<void>
      navigateToCart(): Chainable<void>
      navigateToOrderHistory(): Chainable<void>
      navigateToProfile(): Chainable<void>
      logout(): Chainable<void>
      
      // Checkout helpers
      fillShippingInfo(user: Record<string, any>): Chainable<void>
      fillCreditCardInfo(card: Record<string, any>): Chainable<void>
      
      // Shopping cart helpers
      addProductToCart(productId: string, quantity?: number): Chainable<void>
      completeCheckout(userData: Record<string, any>, cardData: Record<string, any>): Chainable<void>
    }
  }