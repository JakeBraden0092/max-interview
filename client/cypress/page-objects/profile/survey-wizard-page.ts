
import { BasePage } from '../base-page';

export class SurveyWizardPage extends BasePage {
  // Selectors
  multipleChoiceQuestion = '[data-cy=multiple-choice-question]';
  checkboxQuestion = '[data-cy=checkbox-question]';
  sliderQuestion = '[data-cy=slider-question]';
  sliderInput = '[data-cy=slider-input]';
  
  questionText = '[data-cy=question-text]';
  progressBar = '[data-cy=progress-bar]';
  
  nextButton = '[data-cy=next-button]';
  previousButton = '[data-cy=previous-button]';

  constructor() {
    super('/survey');
  }

  // Actions
  selectOption(value: string) {
    this.clickElement(`[data-cy=option-${value}]`);
    return this;
  }

  moveSlider(value: number) {
    cy.get(this.sliderInput).invoke('val', value).trigger('input');
    return this;
  }

  clickNext() {
    this.clickElement(this.nextButton);
    return this;
  }

  clickPrevious() {
    this.clickElement(this.previousButton);
    return this;
  }

  completeSurvey() {
    // Answer age question (multiple choice)
    this.selectOption('25-34').clickNext();
    
    // Answer activity level question (multiple choice)
    this.selectOption('moderate').clickNext();
    
    // Answer health goals question (checkbox)
    this.selectOption('weight_loss')
        .selectOption('energy')
        .clickNext();
    
    // Answer sleep question (slider)
    this.moveSlider(7).clickNext();
    
    // Answer stress question (slider)
    this.moveSlider(5).clickNext();
    
    // Answer diet question (multiple choice)
    this.selectOption('omnivore').clickNext();
    
    // Answer allergies question (checkbox)
    this.selectOption('none').clickNext();
    
    return this;
  }

  // Assertions
  shouldShowMultipleChoiceQuestion() {
    this.shouldBeVisible(this.multipleChoiceQuestion);
    return this;
  }

  shouldShowCheckboxQuestion() {
    this.shouldBeVisible(this.checkboxQuestion);
    return this;
  }

  shouldShowSliderQuestion() {
    this.shouldBeVisible(this.sliderQuestion);
    return this;
  }

  shouldShowQuestionText(text: string) {
    this.shouldContainText(this.questionText, text);
    return this;
  }
}