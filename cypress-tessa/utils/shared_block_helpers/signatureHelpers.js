const signerRoles = {
  APPROVER: 'approver',
  VERIFIER: 'verifier',
};

export default {
  signerRoles,
  /**
   * Sign document as current user.
   * @param {string} signerRole - The role of the signer.
   * @param {(string|string[])} apiAliases - API Alias(es) to wait for after click.
   * @param {Object} userCredentials - Sign document user credentials
   * @param {string} userCredentials.password - User's password.
   * @param {string} [userCredentials.email] - User's email.
   */
  clickSignDocumentButton: (signerRole, apiAliases, email = null ) => {
    cy.get(`[data-testid="${signerRole}-sign-button"]`,{timeout:90000});
    cy.get(`[data-testid="${signerRole}-sign-button"]`).click();
    cy.get('.modal-content.e-signature-modal').should('exist');
    if (email !== null && cy.get('#email').should('exist')) {
      cy.get('#email')
        .type(email)
        .should('have.value', email);
    }
    cy.get('[data-testid="password-field"]')
      .type("password one two three")
    cy.get('input[value="Sign Document"]').click();
    cy.wait(apiAliases,{timeout:60000});
    cy.wait(2000);
    cy.reload();//To avoid failure in nightly run, added reload so that it will click Next button after signature get completed.
  },
  
  clickSignDocumentButtonAfterEdit: (index, signerRole, apiAliases, email = null ) => {
    cy.get(`[data-testid="${signerRole}-sign-button"]`).eq(index).click();
    cy.get('.modal-content.e-signature-modal').should('exist');
    if (email !== null && cy.get('#email').should('exist')) {
      cy.get('#email')
        .type(email)
        .should('have.value', email);
    }
    cy.get('[data-testid="password-field"]')
      .type("password one two three")
    cy.get('input[value="Sign Document"]').click();
    cy.wait(apiAliases,{timeout:60000});
    cy.wait(5000);
  },
};
