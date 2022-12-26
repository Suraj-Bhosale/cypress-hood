
import inputChecker from "./inputFieldCheckHelpers";
const inputHelpers = {
  /**
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
  /**
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
  /**
  Should be tested completely, there are some dependencies.
  Make sure to always use as a first step on the UI page, then continue
  with the other checks.
  */
  inputEnterAndConfirm: (selector, value) => {
    cy.get(`[data-testid="input-enter-${selector}"]`).type(value)
    cy.get(`[data-testid="input-confirm-${selector}"]`).type(value)
    cy.get(`[data-testid="recordButton-${selector}"]`).click()
    cy.wait("@createLabelScanValue");
    cy.reload()
    cy.get(`[data-testid="green-checkmark-${selector}"]`).should("be.visible")
  },

  /**
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
        return
      }
      else {
        cy.get(`[data-testid="${selector}-action-trigger-button"]`).click();
      }
    })
  },

  enterDinAndConfirm: (selector, value) => {
    cy.get(`[data-testid="${selector}-input-field"]`).type(value);
    cy.get(`[data-testid="${selector}-action-trigger-button"]`).click();
    cy.wait("@labelVerifications");
    let key = '.big-green-check-mark'
    cy.get('body').find(key).its('length').then(res => {
      if (res > 0) {
        return
      }
      else {
        cy.get(`[data-testid="${selector}-action-trigger-button"]`).click();
      }
    })
  },

  checkMarkVisible: (selector) => {
    cy.get(selector).should('be.visible');
  },

  /**
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
        return
      }
      else {
        cy.get(`[data-testid="${selector}-button"]`).click();
      }
    })
  },
  scanAndVerifyBags: (selector, value) => {
    cy.get(`[data-testid="${selector}-input"]`).clear().type(value);
    cy.get(`[data-testid="${selector}-button"]`).click();
    cy.wait("@labelVerifications");
    let key = `[data-testid="${selector}-check-mark"]`
    cy.get('body').find(key).its('length').then(res => {
      if (res > 0) {
        return
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

  clicker: (selectors) => {
    if (Array.isArray(selectors)) {
      selectors.forEach(selector => {
        cy.get(selector)
        .click();
      });
    }
    else {
      cy.get(selectors)
      .click();
    }
  },

  onClick: (selector) => {
      cy.get(selector)
        .click()
    },

  dropDownSelectTwo: (selector, index) => {
    inputHelpers.clicker(selector)
    inputHelpers.clicker(`[data-testid="option-${index}"]`)
  },

 /* This method is used to select different site 
  site -  posible values: Test COE 1, Test COE 2
  siteName -collection,ordering
  */

  changeInstitutionData: (site,siteName,contactPerson,phoneNumber,dropDown = true) => {
      if (dropDown === true) {
        cy.wait(10000);
        cy.get(`[data-testid="ddl-site-${siteName}"]`).click()
        cy.contains(site,{timeout:10000}).click({force:true})
    }
    cy.get(`[data-testid="txt-contact-person-${siteName}"]`)
      .clear()
      .type(contactPerson);

    cy.get(`[data-testid="txt-phone-number-${siteName}"]`)
      .clear()
      .type(phoneNumber);
  cy.get('body').then((body) => {
    if (body.find(`[data-testid*=day-available-${siteName}]`).length > 0 && !body.find(`[data-testid*=day-available-${siteName}]`).children().first().is(':empty')) {
      cy.get(`[data-testid*=day-available-${siteName}]`).first().click();
    } else {
      cy.get(`[data-testid="btn-next-${siteName}"]`).click();
      cy.get(`[data-testid="btn-prev-${siteName}"]`).click();
      inputChecker.explicitWait(`[data-testid*=day-available-${siteName}]`)
      cy.get(`[data-testid*=day-available-${siteName}]`).first().click()
    }
  })
},

  clickOnHeader: (phase) =>{
    cy.wait(4000)
    cy.get(`[data-testid="nav_li_${phase}"]`).click()
  },
}

export default inputHelpers
