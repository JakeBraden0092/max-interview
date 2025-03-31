// cypress/e2e/profile/profile-wizard.cy.ts
import { ProfileWizardPage } from '../../page-objects/profile/profile-wizard-page';
import { SurveyWizardPage } from '../../page-objects/profile/survey-wizard-page';
import { LoginPage } from '../../page-objects/auth/login-page';

describe('Profile Wizard', () => {
  beforeEach(() => {
    // Login as incomplete profile user
    cy.mockLoginSuccess({
      profileCompleted: false,
      surveyCompleted: false
    });
    
    const loginPage = new LoginPage();
    loginPage.visit().login('incomplete@example.com', 'password123');
    // cy.wait('@loginRequest');
    
    // Should redirect to profile wizard
    cy.url().should('include', '/profile');
    
    // Mock profile update
    cy.mockUpdateProfileSuccess();
  });

  it('should display profile wizard with initial step', () => {
    const profileWizardPage = new ProfileWizardPage();
    profileWizardPage.shouldBeOnPersonalInfoStep();
  });

  it('should navigate through steps', () => {
    const profileWizardPage = new ProfileWizardPage();
    
    // Fill and proceed to next step
    profileWizardPage
      .fillPersonalInfo('John', 'Doe', '555-123-4567', '1990-01-01')
      .clickNext()
      .shouldBeOnAddressStep();
    
    // Fill and proceed to next step
    profileWizardPage
      .fillAddressInfo('123 Main St', 'Anytown', 'CA', '12345')
      .clickNext()
      .shouldBeOnMailingAddressStep();
    
    // Proceed with same as billing
    profileWizardPage
      .clickNext()
      .shouldBeOnPreferencesStep();
  });

  it('should validate required fields', () => {
    const profileWizardPage = new ProfileWizardPage();
    
    // Try to proceed without filling required fields
    profileWizardPage.clickNext();

    cy.get('[data-cy=firstName-input]').clear().blur()
    cy.get('[data-cy=lastName-input]').clear().blur()
    
    // Should show validation errors
    cy.get('[data-cy=firstName-error]').should('be.visible');
    cy.get('[data-cy=lastName-error]').should('be.visible');
    
    // Should still be on first step
    profileWizardPage.shouldBeOnPersonalInfoStep();
  });

  it('should complete profile wizard and redirect to survey', () => {
    const profileWizardPage = new ProfileWizardPage();
    
    cy.fixture('users').then(({ validUser }) => {
      profileWizardPage.completeProfileWizard(validUser);
      
      // Wait for profile update request
    //   cy.wait('@updateProfileRequest');
      
      // Should redirect to survey
      cy.url().should('include', '/survey');
      
      // Verify survey page is displayed
      const surveyWizardPage = new SurveyWizardPage();
      surveyWizardPage.shouldShowMultipleChoiceQuestion();
    });
  });
});