// cypress/page-objects/profile/profile-wizard-page.ts
import { BasePage } from '../base-page';

export class ProfileWizardPage extends BasePage {
  // Selectors
  personalInfoStep = '[data-cy=personal-info-step]';
  addressStep = '[data-cy=address-step]';
  mailingAddressStep = '[data-cy=mailing-address-step]';
  preferencesStep = '[data-cy=preferences-step]';
  
  firstNameInput = '[data-cy=firstName-input]';
  lastNameInput = '[data-cy=lastName-input]';
  phoneInput = '[data-cy=phone-input]';
  dateOfBirthInput = '[data-cy=dateOfBirth-input]';
  
  addressLine1Input = '[data-cy=addressLine1-input]';
  cityInput = '[data-cy=city-input]';
  stateInput = '[data-cy=state-input]';
  postalCodeInput = '[data-cy=postalCode-input]';
  
  sameAsBillingCheckbox = '[data-cy=sameAsBilling-checkbox]';
  
  emailNotificationsCheckbox = '[data-cy=emailNotifications-checkbox]';
  smsNotificationsCheckbox = '[data-cy=smsNotifications-checkbox]';
  
  nextButton = '[data-cy=next-button]';
  previousButton = '[data-cy=previous-button]';

  constructor() {
    super('/profile');
  }

  // Personal info step
  enterFirstName(firstName: string) {
    this.typeText(this.firstNameInput, firstName);
    return this;
  }

  enterLastName(lastName: string) {
    this.typeText(this.lastNameInput, lastName);
    return this;
  }

  enterPhone(phone: string) {
    this.typeText(this.phoneInput, phone);
    return this;
  }

  enterDateOfBirth(date: string) {
    this.typeText(this.dateOfBirthInput, date);
    return this;
  }

  // Address step
  enterAddressLine1(address: string) {
    this.typeText(this.addressLine1Input, address);
    return this;
  }

  enterCity(city: string) {
    this.typeText(this.cityInput, city);
    return this;
  }

  enterState(state: string) {
    this.typeText(this.stateInput, state);
    return this;
  }

  enterPostalCode(postalCode: string) {
    this.typeText(this.postalCodeInput, postalCode);
    return this;
  }

  // Actions
  clickNext() {
    this.clickElement(this.nextButton);
    this.clickElement(this.nextButton);
    return this;
  }

  clickPrevious() {
    this.clickElement(this.previousButton);
    this.clickElement(this.previousButton);
    return this;
  }

  toggleSameAsBilling() {
    this.clickElement(this.sameAsBillingCheckbox);
    return this;
  }

  fillPersonalInfo(firstName: string, lastName: string, phone: string, dateOfBirth: string) {
    this.enterFirstName(firstName)
        .enterLastName(lastName)
        .enterPhone(phone)
        .enterDateOfBirth(dateOfBirth);
    return this;
  }

  fillAddressInfo(address: string, city: string, state: string, postalCode: string) {
    this.enterAddressLine1(address)
        .enterCity(city)
        .enterState(state)
        .enterPostalCode(postalCode);
    return this;
  }

  completeProfileWizard(userData: any) {
    // Fill personal info step
    this.fillPersonalInfo(
      userData.firstName,
      userData.lastName,
      userData.phone,
      userData.dateOfBirth
    );
    this.clickNext();

    // Fill address step
    this.fillAddressInfo(
      userData.address,
      userData.city,
      userData.state,
      userData.postalCode
    );
    this.clickNext();

    // Mailing address step - use same as billing
    this.clickNext();

    // Preferences step
    this.clickNext();

    return this;
  }

  // Assertions
  shouldBeOnPersonalInfoStep() {
    this.shouldBeVisible(this.personalInfoStep);
    return this;
  }

  shouldBeOnAddressStep() {
    this.shouldBeVisible(this.addressStep);
    return this;
  }

  shouldBeOnMailingAddressStep() {
    this.shouldBeVisible(this.mailingAddressStep);
    return this;
  }

  shouldBeOnPreferencesStep() {
    this.shouldBeVisible(this.preferencesStep);
    return this;
  }
}