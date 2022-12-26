import dayjs from 'dayjs';
import inputChecker from '../../utils/shared_block_helpers/inputFieldCheckHelpers';
export const setUpCapacity = (count, dayCount) => {
  cy.wait(5000)
  for (let i = 0; i < dayCount; i++) {
    const date = dayjs()
      .add(i + 1, 'day').format('YYYY-MM-DD')
    cy.log(date);
    cy.get("body").then((body) => {
      if (body.find(`[data-testid*=txt-field-amount-${date}]`).length == 3) {
        cy.wait(2000)
        cy.get(`[data-testid*=txt-field-amount-${date}]`).eq(0).focus().clear().type(count).blur();
        cy.get(`[data-testid*=txt-field-amount-${date}]`).eq(1).focus().clear().type(count).blur();
        cy.get(`[data-testid*=txt-field-amount-${date}]`).eq(2).focus().clear().type(count).blur();
      } else if (body.find(`[data-testid*=txt-field-amount-${date}]`).length == 0) {
        cy.wait(2000)
        cy.get("[data-testid*=btn-next-week]").click({ force: true });
        inputChecker.explicitWait(`[data-testid*=txt-field-amount-${date}]`); 
        cy.get(`[data-testid*=txt-field-amount-${date}]`).first().focus().clear().type(count).blur();
        cy.wait(2000)
      }
      else {
        cy.wait(2000)
        cy.get(`[data-testid*=txt-field-amount-${date}]`).first().focus().clear().type(count).blur();
        cy.wait(2000)
      }
    })
    ;
  }
};

