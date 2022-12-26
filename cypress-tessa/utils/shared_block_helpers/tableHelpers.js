export default {
    clickOnFilter: (filterId, optionText) => {
      cy.get(`[data-testid="filter-${filterId}"]`).click();
      cy.get(`#menu-${filterId}`)
        .contains(optionText)
        .click();
    },
  };
