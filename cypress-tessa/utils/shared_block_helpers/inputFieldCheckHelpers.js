import tableHelpers from '../../utils/shared_block_helpers/tableHelpers'
import actionButtonsHelper from '../shared_block_helpers/actionButtonHelpers';
const inputHelpers = {


/*
  stateButton - - posible value: 'be.disabled', 'not.be.disabled'
*/
  inputSingleFieldCheck: (selector,value,stateButton) => {
    cy.get(selector).clear().type(value).blur();
    cy.get('[data-testid="primary-button-action"]').should(stateButton);
  },

/*
  Takes any string input for a given selector.
*/
  inputStringValue: (selector,value) => {
    cy.get(selector).type(value);
  },

/*
  Next button check will check "Next" button
  when we are not giving any input in step and checking state of the "Next" button
*/
  nextButtonCheck: (stateButton) => {
    cy.get('[data-testid="primary-button-action"]',{timeout:60000});
    cy.get('[data-testid="primary-button-action"]').should(stateButton);
  },
 
  backButtonCheck: (selector) => {
    cy.get(selector,{timeout:60000});
    cy.get(selector)
      .click();
  },
/*
  This function takes the selector and check the states i.e.
  stateButton - posible value: 'be.disabled', 'not.be.disabled'
*/
  checkState: (selector, stateButton) => {
    cy.get(selector,{timeout:60000}).should(stateButton);
  },

/*
  Next button check will check "Next" button
  when we are not giving any input in step and checking state of the "Next" button
*/
  selectFirstOption: (selector) => {
    cy.get(selector,{timeout:60000});
    cy.get(selector).first().click();
  },

/*
  checkDataSavingWithSaveAndClose function will check after
  clicking "Save and Close" button data is saving or not for all
  workflow.
*/
  checkDataSavingWithSaveAndClose: (subjectId,stateButton,coi) => {
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.SECONDARY, {
    });
    cy.wait(3000)
    cy.get('header',{timeout:60000});
    cy.get('header').then(($header) => {
      if ($header.text().includes('Treatments per Subject')) {
        cy.paginationForSubjectId(subjectId);
        cy.get("[data-testid='primary-button-action']",{timeout:60000});
        cy.get("[data-testid='primary-button-action']").should(stateButton);
      } else if ($header.text().includes('Subjects')) {
          cy.paginationForSubjectId(subjectId);
          cy.get("[data-testid='primary-button-action']",{timeout:60000});
          cy.get("[data-testid='primary-button-action']").should(stateButton);
      } else if ($header.text().includes('Reservations')) {
          cy.paginationForCoi();
          cy.get("[data-testid='primary-button-action']",{timeout:60000});
          cy.get("[data-testid='primary-button-action']").should(stateButton);
      }
    });
  },

/*
  checkDataSavingWithBackButton function will check after
  clicking "Next" and then "Back" button data is saving or not.
*/
  checkDataSavingWithBackButton: (stateButton, explicitWaitSelector) => {
    cy.get('[data-testid="back-nav-link"]',{timeout:80000}).click();
    cy.get(explicitWaitSelector,{timeout:60000});
    cy.get("[data-testid='primary-button-action']").should(stateButton);
  },

/*
  Input field helper loop for checking date inputs set.
  Iteration of x5 time vor verification.
  If somehow the content gets broken the 'else' variable
    cleans the content and rewrites again.
  stateButton - - posible value: 'be.disabled', 'not.be.disabled'
*/
  inputDateFieldCheck: (selector,value,stateButton) => {
    for(let i=0; i<5; i++ )
      {
        cy.get(selector).then((text) => {
          if(text[0].value === value){
            return;
          }else{
            cy.get(selector).clear().type(value).blur();
          }
        })
      }
    cy.get('[data-testid="primary-button-action"]').should(stateButton);
  },

/*
  statemark -  posible value: 'be.visible', 'not.be.visible'
  stateButton - posible value: 'be.disabled', 'not.be.disabled'
*/
  enterAndConfirmCheck: (selector,value,stateMark,stateButton ) => {
    cy.get(`[data-testid="input-enter-${selector}"]`)
      .type(value);
    cy.get(`[data-testid="input-confirm-${selector}"]`)
      .type(value);
    cy.get(`[data-testid="recordButton-${selector}"]`)
      .click();
    cy.reload();
    cy.get(`[data-testid="green-checkmark-${selector}"]`,{timeout:80000});
    cy.get(`[data-testid="green-checkmark-${selector}"]`).should(stateMark);
    cy.get('[data-testid="primary-button-action"]').should(stateButton);
  },

/*
  statemark -  posible value: 'be.visible', 'not.be.visible'
  stateButton - posible value: 'be.disabled', 'not.be.disabled'
*/
  scanAndVerifyCheck: (selector,value,stateMark,stateButton) => {
    cy.get(`[data-testid="${selector}-input-field"]`)
      .type(value);
    cy.get(`[data-testid="${selector}-action-trigger-button"]`)
      .click();
    cy.reload();
    cy.get(".big-green-check-mark",{timeout:80000});
    cy.get(".big-green-check-mark").should(stateMark);
    cy.get('[data-testid="primary-button-action"]').should(stateButton);
  },

/*
  Verify input values.
*/
  checkValue: (selector, value, condition = 'have.value') => {
    cy.get(selector,{timeout:60000});
    cy.get(selector).should(condition, value);
  },

/*
  Verify dropdown value.
*/
  checkDropdownValue: (selector, value) => {
    cy.get(selector).should('have.text',value);
  },

/*
  stateButton - posible value: 'be.disabled', 'not.be.disabled'
*/
  dropDownInputCheck: (selector,index,value,stateButton) => {
    cy.get(selector).eq(index).select(value);
    cy.get('[data-testid="primary-button-action"]').should(stateButton);
  },

/*
  this helper if for checkbox and toggle
  stateButton - posible value: 'be.disabled', 'not.be.disabled'
*/
  clickOnCheck: (selector,stateButton) => {
    cy.get(selector,{timeout:60000});
    cy.get(selector).click();
    cy.wait(2000);
    cy.get('[data-testid="primary-button-action"]',{timeout:60000});
    cy.get('[data-testid="primary-button-action"]').should(stateButton);
  },

  dropDownSelect: (selector, index) => {
    cy.get(selector,{timeout:60000});
    cy.get(selector).click();
    cy.get(`${selector} .select-content li:nth-child(${index})`,{timeout:60000});
    cy.get(`${selector} .select-content li:nth-child(${index})`).click();
  },

/*
  explicit wait is a dynamic wait
*/
  explicitWait: (selector) => {
    cy.get(selector,{timeout:60000});
  },

/*
  Placeholder value can be any string value such as APH-01, PRC-01, PRC-02
*/
  inputCoiWithPlaceholder:(selector,coi,placeholder) => {
    cy.get(selector).type(coi+placeholder);
  },

  clearField:(selector) => {
    cy.get(selector,{timeout:60000});
    cy.get(selector).clear();
  },

  searchWithCoi: (selector,coi) => {
    cy.get(selector).contains(coi).click();
  },
  
  clickOnFilter: (filterId, optionText) => {
    cy.get(`[data-testid="filter-${filterId}"]`,{timeout:60000});
    cy.get(`[data-testid="filter-${filterId}"]`).click();
    cy.get(`#menu-${filterId}`)
      .contains(optionText)
      .click();
  },
 
  checkToggle: (selector, length = 6) => {
    cy.get(selector, {timeout: 60000}).invoke('attr','class')
    .then(classes => cy.log(classes.split(' ').length))
    cy.get(selector, {timeout: 60000}).invoke('attr','class')
    .then(classes => classes.split(' '))
    .should('have.length', length);
  },


  clickEdit: (selector, position) => {
    cy.get(selector).eq(position).click();
  },

  clickOnHeader: (phase) =>{
    cy.get(`[data-testid="nav_li_${phase}"]`,{timeout:60000}).click();
    cy.wait(3000)
  },
}

export default inputHelpers;
