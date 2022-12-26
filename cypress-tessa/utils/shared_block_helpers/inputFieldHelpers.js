import translationHelpers from "./translationHelpers";

const inputHelpers = {
/*
  Input field helper loop for checking single value inputs.
  Iteration of x3 time vor verification.
  If somehow the content gets broken the 'else' variable
    cleans the content and rewrites again.
*/
  inputSingleField: (selector, value) => {
    for (let i = 0; i < 3; i++) {
      cy.get(selector).then((text) => {
        if (text[0].value === value) {
          return
        } else {
          cy.get(selector)
            .last().clear()
            .type(value)
        }
      })
    }
  },

/*
  Verify input values.
*/
  checkValue: (selector, value) => {
    cy.get(selector).should('have.value',value);
  },

/*
  Input field helper loop for checking date inputs set.
  Iteration of x5 time vor verification.
  If somehow the content gets broken the 'else' variable
    cleans the content and rewrites again.
*/
  inputDateField: (selector, value) => {
    for (let i = 0; i < 5; i++) {
      cy.get(selector).then((text) => {
        if (text[0].value === value) {
          return
        } else {
          cy.get(selector)
            .last().clear()
            .type(value).blur()
        }
      })
    }
  },

/*
  Should be tested completely, there are some dependencies.
  Make sure to always use as a first step on the UI page, then continue
  with the other checks.
*/
  inputEnterAndConfirm: (selector, value) => {
    cy.get(`[data-testid="input-enter-${selector}"]`).type(value);
    cy.get(`[data-testid="input-confirm-${selector}"]`).type(value);
    cy.get(`[data-testid="recordButton-${selector}"]`).click();
    cy.wait("@createLabelScanValue");
    cy.reload();
    cy.get(`[data-testid="green-checkmark-${selector}"]`,{timeout:80000});
    cy.get(`[data-testid="green-checkmark-${selector}"]`).should("be.visible");
  },

/*
  Make sure to always use as a first step on the UI page, then continue
  with the other checks.
*/
  scanAndVerifyCoi: (selector, value) => {
    cy.get(`[data-testid="${selector}-input-field"]`).type(value);
    cy.get(`[data-testid="${selector}-action-trigger-button"]`).click();
    cy.wait("@labelVerifications");
    let key = '.big-green-check-mark'
    cy.get('body').find(key).its('length').then(res => {
      if (res > 0) {
        return;
      }
      else {
        cy.get(`[data-testid="${selector}-action-trigger-button"]`).click();
      }
    })
  },

/*
  Same functionality as "scanAndVerifyCoi" helper but with 
  different selectors for Bag scanning
  No need to add page refreshing.
*/
  scanAndVerifyBags: (selector, value) => {
    cy.get(`[data-testid="${selector}-input"]`).type(value);
    cy.get(`[data-testid="${selector}-button"]`).click();
    cy.wait("@labelVerifications");
    let key = `[data-testid="${selector}-check-mark"]`
    cy.get('body').find(key).its('length').then(res => {
      if (res > 0) {
        return;
      }
      else {
        cy.get(`[data-testid="${selector}-button"]`).click();
      }
    })
  },

  dropDownSelect: (selector, index, value) => {
    cy.get(selector)
      .eq(index)
      .select(value);
  },

  clicker: (selector) => {
    cy.get(selector,{timeout:60000});
    cy.get(selector)
      .click();
  },
  
  checkSummaryValue: (parentSelector, parentValue, childPosition, attribute, value) => {
    translationHelpers.assertSingleField(parentSelector, parentValue);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        childPosition, attribute, value, 0);
  }
}

export default inputHelpers;
