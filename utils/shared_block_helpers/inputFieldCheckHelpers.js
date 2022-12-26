import tableHelpers from '../../utils/shared_block_helpers/tableHelpers'
import actionButtonsHelper from '../shared_block_helpers/actionButtonHelpers';
import signatureHelpers from '../shared_block_helpers/signatureHelpers'
import inputs from '../../fixtures/inputs.json'
import common from '../../support/index';
const inputHelpers = {

  /*
    stateButton - - posible value: 'be.disabled', 'not.be.disabled'
  */
  inputSingleFieldCheck: (selector, value, stateButton) => {
    cy.get(selector).clear().type(value).blur();
    cy.get('[data-testid="primary-button-action"]').should(stateButton);
  },

  clearValueAndCheckForButton: (selector, stateButton) => {
    cy.get(selector).clear().clear().should('be.empty');
    cy.get('[data-testid="primary-button-action"]').should(stateButton);
  },

  clearInputField: (selector) => {
    cy.get(`[data-testid="${selector}-input"]`)
      .clear();
  },

  clearDropdownValue: (selector, value) => {
    cy.get(selector).should('have.text', value).clear();
  },
  clearDateField: (selector) => {
    cy.get(selector).last().clear()
  },

  /*
    Takes any string input for a given selector.
  */
  inputStringValue: (selector, value) => {
    cy.get(selector).type(value);
  },
  /*
    Next button check will check "Next" button
    when we are not giving any input in step and checking state of the "Next" button
  */
  //stateButton -  posible value: 'be.disabled', 'not.be.disabled'
  nextButtonCheck: (stateButton) => {
    cy.get('[data-testid="primary-button-action"]').should(stateButton);
  },

  backButtonCheck: (selector) => {
    cy.get(selector)
      .click();
  },
  /*
    This function takes the selector and check the states i.e.
    stateButton - posible value: 'be.disabled', 'not.be.disabled'
  */
  checkState: (selector, stateButton) => {
    cy.get(selector).should(stateButton);
  },

  /*
    Next button check will check "Next" button
    when we are not giving any input in step and checking state of the "Next" button
  */
  selectFirstOption: (selector) => {
    cy.get(selector).first().click();
  },

  /*
    checkDataSavingWithSaveAndClose function will check after
    clicking "Save and Close" button data is saving or not for all
    workflow.
  */

  checkDataSavingWithSaveAndClose: (uniqueId, stateButton, header,infusion=false) => {
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.SECONDARY, {});
    if (header == 'Patients'&& infusion==false) {
      common.loadCollection();
    }
    cy.commonPagination(uniqueId, header);
    cy.get("[data-testid='primary-button-action']", {
      timeout: 60000
    });
    cy.get("[data-testid='primary-button-action']").should(stateButton);
  },

  /*
    checkDataSavingWithBackButton function will check after
    clicking "Next" and then "Back" button data is saving or not.
  */
  checkDataSavingWithBackButton: (stateButton) => {
    cy.get('[data-testid="back-nav-link"]').click();
    cy.get("[data-testid='primary-button-action']").should(stateButton);
  },

  scanAndVerifyFieldAsEmpty: (selector, stateTriggerButton) => {
    cy.get(`[data-testid="${selector}-input"]`).should('be.empty')
    cy.get(`[data-testid="${selector}-button"]`).should(stateTriggerButton);
  },

  /*
    Input field helper loop for checking date inputs set.
    Iteration of x5 time vor verification.
    If somehow the content gets broken the 'else' variable
      cleans the content and rewrites again.
    stateButton - - posible value: 'be.disabled', 'not.be.disabled'
  */
  inputDateFieldCheck: (selector, value, stateButton) => {
    for (let i = 0; i < 5; i++) {
      cy.get(selector).then((text) => {
        if (text[0].value === value) {
          return;
        } else {
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
  enterAndConfirmCheck: (selector, value, stateMark, stateButton) => {
    cy.get(`[data-testid="input-enter-${selector}"]`)
      .type(value);
    cy.get(`[data-testid="input-confirm-${selector}"]`)
      .type(value);
    cy.get(`[data-testid="recordButton-${selector}"]`)
      .click();
    cy.reload();
    cy.get(`[data-testid="green-checkmark-${selector}"]`).should(stateMark);
    cy.get('[data-testid="primary-button-action"]').should(stateButton);
  },

  /*
    reload the page
  */
  reloadPage: () => {
    cy.reload();
  },

  /*
    statemark -  posible value: 'be.visible', 'not.be.visible'
    stateButton - posible value: 'be.disabled', 'not.be.disabled'
  */
  scanAndVerifyCheck: (selector, value, stateMark, stateButton) => {
    cy.get(`[data-testid="${selector}-input-field"]`)
      .type(value)
      .clear()
      .type(value);
    cy.get(`[data-testid="${selector}-action-trigger-button"]`)
      .click();
    let key = '.big-green-check-mark'
    cy.get('body').then($body => {

      if ($body.find(key).length == 0) {
        cy.log('Green Check Mark is not visible')
      } else {
        cy.get(key).should(stateMark);
      }

    })

    cy.get('[data-testid="primary-button-action"]').should(stateButton);
  },


  keepFieldsEmpty: (selector, stateTriggerButton) => {
    cy.get(`[data-testid="${selector}-input-field"]`)
      .clear();
    cy.get(`[data-testid="${selector}-action-trigger-button"]`).should(stateTriggerButton);
  },

  checkGreenCheckMarkVisibilityForScanAndVerify: (timeout = 5000) => {
    cy.get(".big-green-check-mark", {
      timeout: timeout
    }).should('be.visible');
  },

  scanAndVerifyMultipleNeg: (selector, value) => {
    cy.get(`[data-testid="${selector}-input"]`).clear().type(value);
    cy.get(`[data-testid="${selector}-button`).click();
    cy.get('.errorText').invoke('text').should('equal', 'Does not match')

  },

  scanAndVerifyMultiplePos: (selector, value, stateGreenCheckMark) => {
    cy.get(`[data-testid="${selector}-input"]`).clear().type(value);
    cy.get(`[data-testid="${selector}-button`).click();
    cy.get(`[data-testid="${selector}-check-mark"]`).should(stateGreenCheckMark);
  },

  keepFieldsEmptymultiBags: (selector, stateTriggerButton) => {
    cy.get(`[data-testid="${selector}-input"]`)
      .clear();
    cy.get(`[data-testid="${selector}-button"]`).should(stateTriggerButton);
  },

  checkGreenCheckMarkVisibilityMultiBags: (selector) => {
    cy.get(`[data-testid="${selector}-check-mark"]`).should('be.visible');
  },


  /*
    Verify input values.
  */
  checkValue: (selector, value, condition = 'have.value') => {
    cy.get(selector).should(condition, value);
  },

  /*
    Verify dropdown value.
  */
  checkDropdownValue: (selector, value) => {
    cy.get(selector).should('have.text', value);
  },

  detailsBoxForToggle: (selector) => {
    cy.get(selector).should('be.visible')
  },

  checkForGreenCheck: (selector) => {
    cy.get(`[data-testid="${selector}-check-mark"]`).should('be.visible')
  },

  checkForGreenCheckEnterAndConfirm: (selector) => {
    cy.get(`[data-testid="green-checkmark-${selector}"]`).should('be.visible')
  },
  /*
    stateButton - posible value: 'be.disabled', 'not.be.disabled'
  */
  dropDownInputCheck: (selector, index, value, stateButton) => {
    cy.get(selector).eq(index).select(value);
    cy.get('[data-testid="primary-button-action"]').should(stateButton);
  },

  // checkDataSavingWithSaveAndCloseOrdering: (scope) => {
  //   actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.SECONDARY, {
  //   });
  //   cy.get('td[data-testid="patient-identifier"]')
  //     .contains(scope.patientInformation.subjectNumber)
  //     .click();   
  //     cy.get('[data-testid="primary-button-action"]').should('not.be.disabled');
  // },

  /*
    this helper if for checkbox and toggle
    stateButton - posible value: 'be.disabled', 'not.be.disabled'
  */
  clickOnCheck: (selector, stateButton) => {
    cy.get(selector).click();
    cy.get('[data-testid="primary-button-action"]').should(stateButton);
  },

  dropDownSelect: (selector, index) => {
    cy.get(selector).click();
    cy.get(`${selector} .select-content li:nth-child(${index})`, {
      timeout: 60000
    });
    cy.get(`${selector} .select-content li:nth-child(${index})`).click();
  },

  /*
    explicit wait is a dynamic wait
  */
  explicitWait: (selector) => {
    cy.get(selector, {
      timeout: 60000
    });
  },

  /*
    Placeholder value can be any string value such as APH-01, PRC-01, PRC-02
  */
  inputCoiWithPlaceholder: (selector, coi, placeholder) => {
    cy.get(selector).type(coi + placeholder);
  },

  clearField: (selector) => {
    cy.get(selector).clear();
  },

  searchWithCoi: (selector, coi) => {
    cy.get(selector).contains(coi).click();
  },

  clickOnFilter: (filterId, optionText) => {
    cy.get(`[data-testid="filter-${filterId}"]`).click();
    cy.get(`#menu-${filterId}`)
      .contains(optionText)
      .click();
  },

  clickEdit: (selector, position) => {
    cy.get(selector).eq(position).click();
  },

  keepEnterAndConfirmFieldEmpty: (selector, StateRecordButton) => {
    cy.get(`[data-testid="input-enter-${selector}"]`).should('be.empty');
    cy.get(`[data-testid="input-confirm-${selector}"]`).should('be.empty');
    cy.get(`[data-testid="recordButton-${selector}"]`).should(StateRecordButton);
  },

  popupMessageVisible: (buttonSelector, messageSelector) => {
    cy.get(`[data-testid="${buttonSelector}"]`).click()
    cy.get(`[data-testid="${messageSelector}"]`).should('be.visible')
  },

  multiplePopupMessagesVisible: (selector, position, messageSelector) => {
    cy.get(selector).eq(position).click();
    cy.get(`[data-testid="${messageSelector}"]`).should('be.visible');
  },

  /**
   * To select different site from scheduling page
   * @param {string} selector  
   * example for selector '[data-testid="ddl-site-collection"]'
   */
  selectDifferentSite: (selector) => {
    cy.get(selector).click();
    cy.wait(2000);
    cy.get('#react-select-2-option-1').click();
  },

  verifyStringValue: (selector, value) => {
    cy.get(selector).contains(value);
  },

  /**
   * To click on next button and back button
   */
  checkForTheInfoSavedClickingNextAndBack: () => {
    cy.get(`[data-testid="primary-button-action"]`).click()
    cy.get(`[data-testid="back-nav-link"]`).click();
  },

  /*
statemark -  posible value: 'be.visible', 'not.be.visible'
stateButton - posible value: 'be.disabled', 'not.be.disabled'
*/
  identifierCoiLabelCheck: (selector, value, stateButton) => {
    cy.get(`[data-testid="${selector}-input-field"]`)
      .type(value);
    cy.get(`[data-testid="${selector}-action-trigger-button"]`)
      .click();
    cy.get(`[data-testid="${selector}-error-message"]`)
      .invoke('text')
      .should('equal', "Does not match");
    cy.get(`[data-testid="${selector}-action-trigger-button"]`).should(stateButton);
  },
  /**
   * Add reason for change with next button click
   */
  reasonForChange: () => {
    cy.get('[data-testid="primary-button-action"]').click();
    cy.get('[data-testid="reason-for-change-textarea"]').type("reason");
    cy.get('[data-testid="reason-for-change-save"]').click();
    cy.wait('@patchProcedureSteps')
  },

  checkNextButtonWithVariousInputs: (selector, value, stateButton) => {
    cy.get(selector).clear().clear().type(value)
    cy.get(`[data-testid="primary-button-action"]`).should(stateButton)
  },

  /**
    * Check Next button with and without signature.
    * Added page selector to avoid hardcoded wait
    * @param {string} index - The selecter to get the page.
    * @example
    * example for index " '0','1' "
  
    */
  checkNextButtonWithAndWithoutSignature: (index) => {
    cy.get(`[data-testid="primary-button-action"]`).should('be.disabled')
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], inputs.verifier[index])
    cy.get(`[data-testid="primary-button-action"]`).should('not.be.disabled')
  },

  // checkDataSavingWithSaveAndCloseCollection: (scope) => {
  //   actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.SECONDARY, {
  //   });
  //   common.loadCollection();
  //   cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
  // },

  /**
   * Check the label value after clicking next button and which only works with contain.
   * Added page selector to avoid hardcoded wait
   * @param {string} pageSelector - The selecter to get the page.
   * @param {string} selector - The selecter to get the label.
   * @param {string} value - Value of the label.
   * @example
   * example for pageSelector '[data-test-id="collection_shipping_summary"]'
   * example for selector '[data-test-id="txt-field-layout-someId-answer"]'
   * example for value 'Please enter the last 4 digits of the EVO-IS Number' 
   */
  checkLabelAfterNext: (pageSelector, selector, value) => {
    cy.get(pageSelector)
      .find(selector)
      .contains(value)
  },

  scanAndVerify: (inputselector, buttonSelector, value) => {
    cy.get(inputselector).clear().type(value);
    cy.get(buttonSelector).click();
    cy.get('.errorText').invoke('text').should('equal', 'Does not match')
  },
  /**
   * Check the next button after clicking No from toggle and will add the reason on description field.
   * @param {string} selectorOfYes - The selecter to get the yes option of checklist.
   * @example
   * example for selector '[data-test-id="pass-button-some-id"]'
   */
  toggleNoWithReasonchecker: (selectorOfYes) => {
    let selector = selectorOfYes.replace('pass-button-', '#/properties/shipping_checklist/properties/').replace('"]', '_reason-input"]')
    cy.get(selector).type('Reason')
    cy.get('[data-testid="primary-button-action"]').should("be.enabled");
  },

  checkAllToggleUnSelected: (partialClassName = "PassFailCheckbox-selected-") => {
    cy.get(`[class*="${partialClassName}"]`).should("not.exist");
  },
}

export default inputHelpers;