export class BasePage {
    url: string;
  
    constructor(url: string = '/') {
      this.url = url;
    }
  
    visit() {
      cy.visit(this.url);
      return this;
    }

    visitWithOrderId(orderId: string) {
        cy.visit(`/order-confirmation/${orderId}`);
        return this;
    }
  
    getElement(selector: string) {
      return cy.get(selector);
    }
  
    clickElement(selector: string) {
      this.getElement(selector).click({force: true});
      return this;
    }
  
    typeText(selector: string, text: string) {
      this.getElement(selector).clear().type(text);
      return this;
    }
  
    shouldBeVisible(selector: string) {
      this.getElement(selector).should('be.visible');
      return this;
    }
  
    shouldContainText(selector: string, text: string) {
      this.getElement(selector).should('contain', text);
      return this;
    }
  
    shouldHaveUrl(url: string) {
      cy.url().should('include', url);
      return this;
    }
  
    wait(alias: string) {
      cy.wait(alias);
      return this;
    }
  }