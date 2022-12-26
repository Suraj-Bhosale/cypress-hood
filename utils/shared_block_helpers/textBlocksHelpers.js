const textBlockHelper = {
  verifyPageTitle: (title, subtitle) => {
    cy.get("[data-testid='h1-header']").should('contain', title);
    cy.get("[data-test-id='subtitle1-header']").should('contain', subtitle);
  },

  //TODO: multi headings
  verifySectionHeading: (title, description) => {
    cy.get("[data-testid='section-heading-title']").should('contain', title);
    cy.get("[data-testid='section-heading-description']").should('contain', description);
  },

  verifyPrintCounter: (heading, prints) => {
    cy.get('[data-testid="print-counter-block"]').should('contain', heading);
    prints.forEach(({ label, count }) => {
      cy.get('[data-testid="print-counter-block"]').should('contain', `${count} x ${label}`);
    });
  },
};

export default textBlockHelper;
