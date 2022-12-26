const LabelScanningFunctions = {
  /**
   * Scan in text values into multiple scan block
   * @param {Map<string,string>} verify map of data test id element key to valid text input
   */
  multipleScanBlock: verify => {
    for (let [key, value] of verify) {
      cy.log(`Verifying Multiple Label Scan for ${value}`);
      cy.get(`[data-testid="${key}-input"]`)
        .type('12345')
        .should('have.value', '12345');
      cy.get(`[data-testid="${key}-button"]`).click();
      cy.get('.errorText').should('contain', 'Does not match');

      cy.get(`[data-testid="${key}-input"]`)
        .clear()
        .should('have.value', '')
        .type(value)
        .should('have.value', value);
      cy.get(`[data-testid="${key}-button"`).click();
      cy.get(`[data-testid="${key}-check-mark"]`).should('exist');
      cy.get('.errorText').should('not.exist');
    }
  },
  /**
   * Scan in text value into label verification input
   * @param {string} key data test id element key
   * @param {string} correctText valid label text input
   */
  labelVerificationBlock: (key, correctText) => {
    cy.get(`[data-testid="${key}-input-field"]`)
      .type('12345')
      .should('have.value', '12345');
    cy.get(`[data-testid="${key}-action-trigger-button"]`).click();
    cy.get('.warning').should('exist');

    cy.get(`[data-testid="${key}-input-field"]`)
      .clear()
      .should('have.value', '')
      .type(correctText)
      .should('have.value', correctText);
    cy.get(`[data-testid="${key}-action-trigger-button"]`).click();

    cy.get(`[data-testid="${key}-check-mark"]`).should('be.visible');
    cy.get('.warning').should('not.exist');
  },
  getCoi: dataArray => {
    let coi = '';
    dataArray.forEach(step => {
      if (step.type === 'treatments') {
        coi = step.attributes.coi;
      }
    });
    return coi;
  },
};

export default LabelScanningFunctions;
