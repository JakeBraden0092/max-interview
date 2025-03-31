// cypress/e2e/profile/survey-wizard.cy.ts
import { SurveyWizardPage } from '../../page-objects/profile/survey-wizard-page';
import { LoginPage } from '../../page-objects/auth/login-page';
import { ProductListPage } from '../../page-objects/shop/product-list-page';

describe('Survey Wizard', () => {
  beforeEach(() => {
    // Login as user with complete profile but incomplete survey
    cy.mockLoginSuccess({
      profileCompleted: true,
      surveyCompleted: false
    });
    
    const loginPage = new LoginPage();
    loginPage.visit().login('test@example.com', 'password123');
    // cy.wait('@loginRequest');
    
    // Should redirect to survey wizard
    cy.url().should('include', '/survey');
    
    // Mock survey update
    cy.mockUpdateSurveySuccess();
  });

  it('should display survey wizard with first question', () => {
    const surveyWizardPage = new SurveyWizardPage();
    surveyWizardPage.shouldShowMultipleChoiceQuestion();
  });

  it('should navigate between questions', () => {
    const surveyWizardPage = new SurveyWizardPage();
    
    // Answer first question and go to next
    surveyWizardPage
      .selectOption('25-34')
      .clickNext()
      .shouldShowMultipleChoiceQuestion();
    
    // Go back to previous question
    surveyWizardPage
      .clickPrevious()
      .shouldShowMultipleChoiceQuestion();
  });

  it('should display different question types', () => {
    const surveyWizardPage = new SurveyWizardPage();
    
    // Check multiple choice question
    surveyWizardPage
      .shouldShowMultipleChoiceQuestion()
      .selectOption('25-34')
      .clickNext();
    
    // Check another multiple choice question
    surveyWizardPage
      .shouldShowMultipleChoiceQuestion()
      .selectOption('moderate')
      .clickNext();
    
    // Check checkbox question
    surveyWizardPage
      .shouldShowCheckboxQuestion()
      .selectOption('weight_loss')
      .clickNext();
    
    // Check slider question
    surveyWizardPage.shouldShowSliderQuestion();
  });

  it('should require an answer for multiple choice questions', () => {
    const surveyWizardPage = new SurveyWizardPage();
    
    // Try to proceed without selecting an option
    surveyWizardPage.clickNext();
    
    // Should still be on first question
    surveyWizardPage.shouldShowMultipleChoiceQuestion();
    
    // Next button should be disabled
    cy.get('[data-cy=next-button]').should('be.disabled');
  });

  it('should complete survey and redirect to products', () => {
    const surveyWizardPage = new SurveyWizardPage();
    
    // Complete the entire survey
    surveyWizardPage.completeSurvey();
    
    // Wait for survey update request
    // cy.wait('@updateSurveyRequest');
    
    // Should redirect to products
    cy.url().should('include', '/products');
    
    // Verify products page is displayed
    const productListPage = new ProductListPage();
    productListPage.shouldBeVisible('[data-cy=product-list-page]');
  });
});