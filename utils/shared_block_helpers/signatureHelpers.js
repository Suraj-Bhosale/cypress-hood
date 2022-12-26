const signerRoles = {
  APPROVER: 'approver',
  VERIFIER: 'verifier',
};

const signatureHelpers = {
  signerRoles,
  /**
   * Sign document as current user.
   * @param {string} signerRole - The role of the signer.
   * @param {(string|string[])} apiAliases - API Alias(es) to wait for after click.
   * @param {Object} userCredentials - Sign document user credentials
   * @param {string} userCredentials.password - User's password.
   * @param {string} [userCredentials.email] - User's email.
   */
  clickSignDocumentButton: (signerRole, apiAliases, email = null,index=0 ) => {
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
    cy.wait(apiAliases);
  },
};

export default signatureHelpers;
