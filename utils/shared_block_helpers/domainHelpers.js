const DomainTestHelperFunctions = {
  loginAndSelectTherapy: (username, password, therapy) => {
    cy.platformLogin(username, password);
    cy.visit('/ordering');
    cy.get('[data-testid="add-patient-button"]').click();
    cy.get(`[data-testid="execution-context-${therapy}"]`).click();
  },
};

export default DomainTestHelperFunctions;
