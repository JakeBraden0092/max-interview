// cypress/e2e/full-journey.cy.ts
import { LoginPage } from '../page-objects/auth/login-page';
import { ProfileWizardPage } from '../page-objects/profile/profile-wizard-page';
import { SurveyWizardPage } from '../page-objects/profile/survey-wizard-page';
import { ProductListPage } from '../page-objects/shop/product-list-page';
import { ProductDetailPage } from '../page-objects/shop/product-detail-page';
import { CartPage } from '../page-objects/shop/cart-page';
import { CheckoutPage } from '../page-objects/shop/checkout-page';
import { OrderConfirmationPage } from '../page-objects/shop/order-confirmation-page';

describe('End-to-End User Journey', () => {
  let testUser: any;
  let creditCard: any;

  before(() => {
    // Load test data
    cy.fixture('users').then((users) => {
      // Use a dedicated test user for e2e tests
      testUser = users.newUser;
      creditCard = users.creditCard;
    });
  });

  it('should complete the full user journey from registration to purchase', () => {
    // Step 1: Register a new user
    const email = `test.${Date.now()}@example.com`;
    const password = 'Password123!';
    
    cy.visit('/auth/register');

    // Fill registration form
    cy.get('[data-cy=email-input]').type(email);
    cy.get('[data-cy=password-input]').type(password);
    cy.get('[data-cy=confirm-password-input]').type(password);
    cy.get('[data-cy=register-button]').click();

    // Step 2: Complete the profile wizard
    // Should be automatically redirected to the profile wizard
    cy.url().should('include', '/profile');
    
    // Verify we're on the personal info step
    cy.get('[data-cy=personal-info-step]').should('be.visible');

    // Fill personal information
    cy.get('[data-cy=firstName-input]').type(testUser.firstName);
    cy.get('[data-cy=lastName-input]').type(testUser.lastName);
    cy.get('[data-cy=phone-input]').type(testUser.phone);
    cy.get('[data-cy=dateOfBirth-input]').type(testUser.dateOfBirth);
    cy.get('[data-cy=next-button]').click().click();

    // Fill address information
    cy.get('[data-cy=address-step]').should('be.visible');
    cy.get('[data-cy=addressLine1-input]').type(testUser.address);
    cy.get('[data-cy=city-input]').type(testUser.city);
    cy.get('[data-cy=state-input]').type(testUser.state);
    cy.get('[data-cy=postalCode-input]').type(testUser.postalCode);
    cy.get('[data-cy=next-button]').click().click();

    // Mailing address step - use same as billing
    cy.get('[data-cy=mailing-address-step]').should('be.visible');
    cy.get('[data-cy=next-button]').click().click();

    // Preferences step
    cy.get('[data-cy=preferences-step]').should('be.visible');
    // Select email notifications checkbox (make sure it's checked)
    cy.get('[data-cy=emailNotifications-checkbox]').check({force: true});
    // Optionally select SMS notifications
    cy.get('[data-cy=smsNotifications-checkbox]').check({force: true});
    // Select language preference
    cy.get('[data-cy=language-select]').select('en');
    // Then proceed
    // cy.get('[data-cy=next-button]').click();

    // Step 3: Complete the health survey
    // Should be automatically redirected to the survey
    cy.url().should('include', '/survey');

    // Answer each survey question
    // Age question
    // All waits are demo purpose only @jb remove
    cy.wait(1000)
    cy.get('[data-cy=multiple-choice-question]').should('be.visible');
    cy.get('[data-cy=option-25-34]').click();
    cy.get('[data-cy=next-button]').click();

    // Activity level question
    cy.wait(1000)
    cy.get('[data-cy=option-moderate]').click();
    cy.get('[data-cy=next-button]').click().click();

            // Sleep question (slider)

            cy.wait(1000)
            cy.get('[data-cy=slider-question]').should('be.visible');
            
            cy.get('[data-cy=slider-input]').invoke('val', 7).trigger('click');
            cy.get('[data-cy=next-button]').click().click();


    // Diet question
    cy.wait(1000)
    cy.get('[data-cy=option-omnivore]').click();
    cy.wait(400)
    cy.get('[data-cy=next-button]').click().click();

    // Step 4: Browse products
    // Should be redirected to the products page after completing the survey
    cy.url().should('include', '/products');
    cy.get('[data-cy=product-list-page]').should('be.visible');

    // Test filtering and sorting
    cy.get('[data-cy=category-filter]').select('Vitamins');
    cy.get('[data-cy=sort-filter]').select('price-low');
    
    // Click on the first product
    cy.get('[data-cy=product-grid] > a').first().click();

    // Step 5: View product details
    cy.url().should('include', '/products/');
    
    // Explore product tabs
    cy.get('[data-cy=tab-description]').should('be.visible').click();
    cy.get('[data-cy=tab-details]').should('be.visible').click();
    cy.get('[data-cy=tab-benefits]').should('be.visible').click();
    
    // Select quantity and add to cart
    cy.get('[data-cy=quantity-select]').select('2');
    cy.get('[data-cy=add-to-cart-button]').click();

    // Add a second product
    cy.get('[data-cy=products-link]').click();
    cy.url().should('include', '/products');
    
    // Select a different category
    cy.get('[data-cy=category-filter]').select('Supplements');
    
    // Click on the first product in this category
    cy.get('[data-cy=product-grid] > a').first().click();
    cy.get('[data-cy=add-to-cart-button]').click();

    // Step 6: View shopping cart
    cy.get('[data-cy=cart-link]').click();
    cy.url().should('include', '/cart');
    
    // Verify cart contents
    cy.get('[data-cy=cart-page]').should('be.visible');
    
    // Update quantity of an item
    cy.get('[data-cy=item-quantity-5]').select('3');
    
    // Proceed to checkout
    cy.get('[data-cy=checkout-button]').click();

    // Step 7: Complete checkout
    cy.url().should('include', '/checkout');
    cy.get('[data-cy=checkout-page]').should('be.visible');
    
    // Fill shipping information
    cy.get('[data-cy=shipping-firstName]').type(testUser.firstName);
    cy.get('[data-cy=shipping-lastName]').type(testUser.lastName);
    cy.get('[data-cy=shipping-email]').clear().type(email);
    cy.get('[data-cy=shipping-phone]').type(testUser.phone);
    cy.get('[data-cy=shipping-addressLine1]').type(testUser.address);
    cy.get('[data-cy=shipping-city]').type(testUser.city);
    cy.get('[data-cy=shipping-state]').type(testUser.state);
    cy.get('[data-cy=shipping-postalCode]').type(testUser.postalCode);
    
    // Fill payment information
    cy.get('[data-cy=payment-credit-card]').click();
    cy.get('[data-cy=payment-cardName]').type(creditCard.name);
    cy.get('[data-cy=payment-cardNumber]').type(creditCard.number);
    cy.get('[data-cy=payment-expDate]').type(creditCard.expDate);
    cy.get('[data-cy=payment-cvv]').type(creditCard.cvv);
    
    // Place order
    cy.get('[data-cy=place-order-button]').click();

    // Step 8: Verify order confirmation
    cy.url().should('include', '/order-confirmation');
    cy.get('[data-cy=order-confirmation-page]').should('be.visible');
    cy.get('[data-cy=order-number]').should('be.visible');
    
    // Continue shopping
    cy.get('[data-cy=continue-shopping-link]').click();
    cy.url().should('include', '/products');

    // Step 9: View order history
    cy.get('[data-cy=order-history-link]').click();
    cy.url().should('include', '/order-history');
    cy.get('[data-cy=order-history-page]').should('be.visible');
    
    // Verify the order is in the history
    cy.get('[data-cy=orders-list]').should('be.visible');
    
    // Step 10: Logout
    cy.get('[data-cy=user-menu-button]').click();
    cy.get('[data-cy=logout-button]').click();
    
    // Verify redirect to login page
    cy.url().should('include', '/auth/login');
    cy.get('[data-cy=login-page]').should('be.visible');
  });
});