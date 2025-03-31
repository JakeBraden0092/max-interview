// cypress/page-objects/shop/checkout-page.ts
import { BasePage } from '../base-page';

export class CheckoutPage extends BasePage {
  // Selectors
  checkoutPage = '[data-cy=checkout-page]';
  checkoutSummary = '[data-cy=checkout-summary]';
  
  // Shipping information
  shippingFirstName = '[data-cy=shipping-firstName]';
  shippingLastName = '[data-cy=shipping-lastName]';
  shippingEmail = '[data-cy=shipping-email]';
  shippingPhone = '[data-cy=shipping-phone]';
  shippingAddressLine1 = '[data-cy=shipping-addressLine1]';
  shippingAddressLine2 = '[data-cy=shipping-addressLine2]';
  shippingCity = '[data-cy=shipping-city]';
  shippingState = '[data-cy=shipping-state]';
  shippingPostalCode = '[data-cy=shipping-postalCode]';
  shippingCountry = '[data-cy=shipping-country]';
  
  // Payment information
  paymentCreditCard = '[data-cy=payment-credit-card]';
  paymentPaypal = '[data-cy=payment-paypal]';
  paymentCardName = '[data-cy=payment-cardName]';
  paymentCardNumber = '[data-cy=payment-cardNumber]';
  paymentExpDate = '[data-cy=payment-expDate]';
  paymentCvv = '[data-cy=payment-cvv]';
  
  // Other elements
  saveInformation = '[data-cy=save-information]';
  placeOrderButton = '[data-cy=place-order-button]';

  constructor() {
    super('/checkout');
  }

  // Shipping information actions
  enterShippingFirstName(firstName: string) {
    this.typeText(this.shippingFirstName, firstName);
    return this;
  }

  enterShippingLastName(lastName: string) {
    this.typeText(this.shippingLastName, lastName);
    return this;
  }

  enterShippingEmail(email: string) {
    this.typeText(this.shippingEmail, email);
    return this;
  }

  enterShippingPhone(phone: string) {
    this.typeText(this.shippingPhone, phone);
    return this;
  }

  enterShippingAddress(address: string) {
    this.typeText(this.shippingAddressLine1, address);
    return this;
  }

  enterShippingCity(city: string) {
    this.typeText(this.shippingCity, city);
    return this;
  }

  enterShippingState(state: string) {
    this.typeText(this.shippingState, state);
    return this;
  }

  enterShippingPostalCode(postalCode: string) {
    this.typeText(this.shippingPostalCode, postalCode);
    return this;
  }

  selectShippingCountry(country: string) {
    cy.get(this.shippingCountry).select(country);
    return this;
  }

  // Payment information actions
  selectPaymentMethod(method: 'credit-card' | 'paypal') {
    if (method === 'credit-card') {
      this.clickElement(this.paymentCreditCard);
    } else {
      this.clickElement(this.paymentPaypal);
    }
    return this;
  }

  enterCardName(name: string) {
    this.typeText(this.paymentCardName, name);
    return this;
  }

  enterCardNumber(number: string) {
    this.typeText(this.paymentCardNumber, number);
    return this;
  }

  enterExpirationDate(date: string) {
    this.typeText(this.paymentExpDate, date);
    return this;
  }

  enterCvv(cvv: string) {
    this.typeText(this.paymentCvv, cvv);
    return this;
  }

  toggleSaveInformation() {
    this.clickElement(this.saveInformation);
    return this;
  }

  placeOrder() {
    this.clickElement(this.placeOrderButton);
    return this;
  }

  // Composite actions
  fillShippingInformation(userData: any) {
    this.enterShippingFirstName(userData.firstName)
        .enterShippingLastName(userData.lastName)
        .enterShippingEmail(userData.email)
        .enterShippingPhone(userData.phone)
        .enterShippingAddress(userData.address)
        .enterShippingCity(userData.city)
        .enterShippingState(userData.state)
        .enterShippingPostalCode(userData.postalCode);
    return this;
  }

  fillCreditCardInformation(cardData: any) {
    this.selectPaymentMethod('credit-card')
        .enterCardName(cardData.name)
        .enterCardNumber(cardData.number)
        .enterExpirationDate(cardData.expDate)
        .enterCvv(cardData.cvv);
    return this;
  }

  completeCheckout(userData: any, cardData: any) {
    this.fillShippingInformation(userData)
        .fillCreditCardInformation(cardData)
        .placeOrder();
    return this;
  }

  // Assertions
  shouldShowCheckoutPage() {
    this.shouldBeVisible(this.checkoutPage);
    return this;
  }

  shouldShowCheckoutSummary() {
    this.shouldBeVisible(this.checkoutSummary);
    return this;
  }
}