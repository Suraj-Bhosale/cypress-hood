const LabelPrintingFunctions = {
  printLabels: postRequestAlias => {
    cy.get('[data-testid="btn-print"]')
      .first()
      .click();

    cy.wait(postRequestAlias)
      .its('status')
      .then(status => expect(status).to.eq(200));
  },

  confirmPrintCheckbox: () => {
    cy.get('span:contains("Confirmed")').click();
  },

  checkCount: (label, count) => {
    cy.get('[data-testid="print-counter-block"]').should('contain', `${count} x ${label}`);
  },
};

export default LabelPrintingFunctions;
