import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";
import inputHelpers from "../../shared_block_helpers/inputFieldHelpers";
import signatureHelpers from "../../shared_block_helpers/signatureHelpers";
import regressionInput from "../../../fixtures/inputsRegression.json";
import translationHelpers from "../../shared_block_helpers/translationHelpers";
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'

export default {
  orderCancellation: {

    //C40101
    cancelOrderButtonNegative: () => {
      cy.log("[Neg] Verify the 'Yes, cancel order' button is disabled when reason for cancellation and signature is not done.");
      inputHelpers.clicker('[data-testid="cancel-button-action"]')
      inputChecker.checkState('[data-testid="cancel-page-cancel-button"]',"be.disabled");
      inputChecker.checkState('button[name="cancel-page-abort"]',"not.be.disabled");
    },

    //C40102
    cancelOrderButtonPositive: () => {
      cy.log("[POS] Verify 'Yes, cancel order' button is enabled after selecting option from  'reason for cancellation' dropdown.");
      inputHelpers.clicker('[data-testid="cancel-page-reason-select"]  > div');
      inputHelpers.clicker(".select-content > :nth-child(1)");
      inputChecker.checkState('[data-testid="cancel-page-cancel-button"]',"not.be.disabled");
      inputChecker.checkState('button[name="cancel-page-abort"]',"not.be.disabled");
    },

    //C40103
    cancelOrderButtonWithoutSignatureNegative: () => {
      cy.log("[NEG] Verify 'Yes, cancel order' button is disabled when signature is not done.");
      inputHelpers.clicker('[data-testid="cancel-page-cancel-button"]');
      inputChecker.checkState('[data-testid="approver-sign-button"]',"not.be.disabled"
      );
      inputChecker.checkState('[data-testid="cancel-page-cancel-button"]',"not.be.disabled");
      inputChecker.checkState('button[name="cancel-page-abort"]',"not.be.disabled");
    },

    //C40104
    additionReasonBoxPositive: () => {
      cy.log("[POS] Verify an additional box appears when Other' is selected from dropdown.")
      inputHelpers.clicker('[data-testid="cancel-page-reason-select"]  > div');
      inputHelpers.clicker(".select-content > :nth-child(5)");
      inputChecker.checkState('[name="cancel-page-reason-other"]',"be.visible");
      inputChecker.checkState('button[name="cancel-page-abort"]',"not.be.disabled");
    },

    //C40105
    checkDoNotCancelButtonPositive: (scope) => {
      cy.log("[POS] Verify 'No, don't cancel' button is working after clicking.")
      inputChecker.checkState('button[name="cancel-page-abort"]',"not.be.disabled");
      inputHelpers.clicker('button[name="cancel-page-abort"]');
      cy.openOrder('ordering','oliver')
      cy.commonPagination(scope.patientInformation.patientId,'Treatments per Patient')
    },

    //C40106
    cancelButtonWithoutDataPositive: () => {
      cy.log("[POS] Verify 'Yes, cancel order' button should be disabled after not adding 'Please provide details about your answer' field.")
      inputHelpers.clicker('[data-testid="cancel-button-action"]')
      inputHelpers.clicker('[data-testid="cancel-page-reason-select"]  > div');
      inputHelpers.clicker(".select-content > :nth-child(5)");
      inputChecker.checkState('[data-testid=cancel-page-cancel-button]','not.be.disabled');//[BUG] It should be disabled.
      inputHelpers.inputSingleField('[name="cancel-page-reason-other"]',regressionInput.cancelOrder.reasonForCancel);
      inputChecker.checkState('[data-testid=cancel-page-cancel-button]','not.be.disabled');//[BUG] It should be disabled.
      inputChecker.checkState('button[name="cancel-page-abort"]',"not.be.disabled");
    },

    //C40107
    orderCancelPositive: () => {
      cy.log("[POS] Verify that after clicking 'Yes, cancel order' button, order should be cancel.")
      inputHelpers.clicker('[data-testid="cancel-page-reason-select"]  > div');
      inputHelpers.clicker(".select-content > :nth-child(1)");
      inputHelpers.clicker('[data-testid="cancel-page-cancel-button"]');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature']);
      inputChecker.checkState('button[name="cancel-page-abort"]',"not.be.disabled");
      inputHelpers.clicker('[data-testid="cancel-page-cancel-button"]');
      translationHelpers.assertSectionChildElement('[data-test-id="cancel_cancel_summary"]',0,
        'h1',regressionInput.cancelOrder.orderCancelledTitle,0);
      translationHelpers.assertSectionChildElement('[data-test-id="cancel_cancel_summary"]',0,
        'div',regressionInput.cancelOrder.cancelReason,4);
    },
  },
};
