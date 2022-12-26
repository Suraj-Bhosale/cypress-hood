export default {
  setUpCapacity: (count, weekCount) => {
    cy.wait(5000)
    for (let i = 0; i < weekCount; i++) {
      cy.get("body").then((body) => {
        if (body.find(`[data-testid*=txt-field-amount]`).length == 2) {
          cy.get(`[data-testid*=txt-field-amount]`).first().clear().type(count);
          cy.get(`[data-testid*=txt-field-amount]`).last().clear().type(count);
        } else {
          cy.get(`[data-testid*=txt-field-amount]`).first().clear().type(count);
        }
        cy.get("[data-testid*=btn-next-week]").click();
      });
    }
  },
  institutionManufShared: () => {
    cy.contains("Test Institution 1").click();
    cy.get('[data-testid="qualificationsLink"]').click();
    cy.wait(4000);
    cy.get('[data-testid="label-shared-capability-all-checkbox"]').click();
    cy.get('[data-testid="btn-save-and-close"]').click();
    cy.wait('@patchQualifications')
  },
};
