export default {
  fill: ({ field, firstValue, secondValue, doesNotMatchText }) => {
    if (!secondValue) {
      secondValue = firstValue
    }
    const enterSelector = `[data-testid="input-enter-${field}"]`
    const confirmSelector = `[data-testid="input-confirm-${field}"]`
    const recordButtonSelector = `[data-testid="recordButton-${field}"]`
    cy.get(enterSelector).type(firstValue)
    cy.get(recordButtonSelector).should('be.disabled')
    cy.get(confirmSelector).type(secondValue + secondValue)
    cy.get(recordButtonSelector).should('not.be.disabled')
    cy.get(recordButtonSelector).click()
    cy.get(enterSelector)
      .parent()
      .parent()
      .should('contain', doesNotMatchText)
    cy.get(confirmSelector).clear()
    cy.get(recordButtonSelector).should('be.disabled')
    cy.get(confirmSelector).type(secondValue)
    cy.get(recordButtonSelector).click()
    cy.get(`[data-testid="green-checkmark-${field}"]`)
  },
}
