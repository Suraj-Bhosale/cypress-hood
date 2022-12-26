import actionButtonsHelper from '../shared_block_helpers/actionButtonHelpers';
const translationKeys = {
  APPROVE: 'Approve',
  CANCEL: 'Cancel',
  DEFAULT: 'Submit',
  DONE: 'Done',
  NEXT: 'Next',
  SUBMIT: 'Submit',
  SAVE_AND_CLOSE: 'Save & Close',
};
const actionButtonKeys = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  CANCEL: 'cancel',
};

export default {
  translationKeys,
  actionButtonKeys,
  /**
   * Click action button.
   * @param {string} actionButtonType - Type of action button.
   * @param {Object} [clickProps] - Click button properties
   * @param {(string|string[])} [clickProps.apiAliases] - API Alias(es) to wait for after click.
   * @param {string} [clickProps.labelName] - Button label.
   */
  clickActionButton: (actionButtonType, { apiAliases = null, labelName = null }) => {
    cy.log('clickActionButton', actionButtonType, apiAliases, labelName);
    cy.get(`[data-testid="${actionButtonType}-button-action"]`,{timeout:120000});
    actionButtonsHelper.checkActionButtonIsEnabled(actionButtonType);
    if (labelName) {
      cy.log('clickActionButton - with labelName', labelName);
      // disabling force click rule as it was added to fix flakiness
      // eslint-disable-next-line cypress/no-force
      cy.get(`[data-testid="${actionButtonType}-button-action"]`)
        .first()
        .should('contain', labelName)
        .trigger('mouseover')
        .should('be.enabled')
        .click({ force: true });
    } else {
      cy.log('clickActionButton - without labelName');
      // disabling force click rule as it was added to fix flakiness
      // eslint-disable-next-line cypress/no-force
      cy.get(`[data-testid="${actionButtonType}-button-action"]`)
        .first()
        .focus()
        .should('be.enabled')
        .click({ force: true });
    }
  },
  /**
   * Check that action button is DISABLED.
   * @param {string} actionButtonType - Type of action button.
   */
  checkActionButtonIsDisabled: actionButtonType => {
    cy.log('checkActionButtonIsDisabled', actionButtonType);
    cy.get(`[data-testid="${actionButtonType}-button-action"]`,{timeout:90000});
    cy.get(`[data-testid="${actionButtonType}-button-action"]`).should('be.disabled');
  },
  /**
   * Check that action button is ENABLED.
   * @param {string} actionButtonType - Type of action button.
   */
  checkActionButtonIsEnabled: actionButtonType => {
    cy.log('checkActionButtonIsEnabled', actionButtonType);
    cy.get(`[data-testid="${actionButtonType}-button-action"]`,{timeout:90000});
    cy.get(`[data-testid="${actionButtonType}-button-action"]`).should('be.enabled');
  },
  /**
   * Check that action button contains label.
   * @param {string} actionButtonType - Type of action button.
   * @param {string} labelName - Expected button label text.
   */
  checkActionButtonLabel: (actionButtonType, labelName) => {
    cy.log('checkActionButtonLabel', actionButtonType, labelName);
    cy.get(`[data-testid="${actionButtonType}-button-action"]`).should('contain', labelName);
  },
};
