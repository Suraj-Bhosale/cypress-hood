import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";
import inputHelpers from "../../shared_block_helpers/inputFieldHelpers";
import signatureHelpers from "../../shared_block_helpers/signatureHelpers";
import regressionInput from "../../../fixtures/inputsRegression.json";
import translationHelpers from "../../shared_block_helpers/translationHelpers";

export default {
  orderCancellation: {
    happyPath: () => {
      cy.log("Order cancel");
      inputHelpers.clicker('[data-testid="cancel-page-reason-select"]  > div');
      inputHelpers.clicker(".select-content > :nth-child(1)");
      signatureHelpers.clickSignDocumentButton("approver", ["@postSignature"]);
      inputHelpers.clicker('[data-testid="cancel-page-cancel-button"]');
      cy.wait(10000);
      inputHelpers.clicker('[data-testid="cancel-page-cancel-button"]');
    },
    //C36257, C36039, C36262
    cancelOrderButtonNegative: () => {
      cy.log("[Neg] Verify the 'Yes, cancel order' button is disabled when reason for cancellation and signature is not done.");
      inputHelpers.clicker('[data-testid="cancel-button-action"]')
      inputChecker.checkState('[data-testid="cancel-page-cancel-button"]',"be.disabled");
    },

    //C36258, C36040, C36263
    cancelOrderButtonPositive: () => {
      cy.log("[POS] Verify 'Yes, cancel order' button is enabled after selecting option from  'reason for cancellation' dropdown.");
      inputHelpers.clicker('[data-testid="cancel-page-reason-select"]  > div');
      inputHelpers.clicker(".select-content > :nth-child(1)");
      inputChecker.checkState('[data-testid="cancel-page-cancel-button"]',"not.be.disabled");
    },

    //C36259, C36041, C36264
    cancelOrderButtonWithoutSignatureNegative: () => {
      cy.log("[NEG] Verify 'Yes, cancel order' button is disabled when signature is not done.");
      inputHelpers.clicker('[data-testid="cancel-page-cancel-button"]');
      inputChecker.checkState('[data-testid="approver-sign-button"]',"not.be.disabled"
      );
      inputChecker.checkState('[data-testid="cancel-page-cancel-button"]',"not.be.disabled");
    },

    //C36260, C36042, C36265
    additionReasonBoxPositive: () => {
      cy.log("[POS] Verify an additional box appears when Other' is selected from dropdown.")
      inputHelpers.clicker('[data-testid="cancel-page-reason-select"]  > div');
      inputHelpers.clicker(".select-content > :nth-child(5)");
      inputChecker.checkState('[name="cancel-page-reason-other"]',"be.visible");
    },

    //C36261, C36201, C36266
    orderCancelPositive: (scope) => {
      cy.log("[POS] Verify that after clicking 'Yes, cancel order' button, order should be cancel.")
      inputHelpers.inputSingleField('[name="cancel-page-reason-other"]',regressionInput.cancelOrder.reasonForCancel);
      inputHelpers.clicker('button[name="cancel-page-abort"]');
      cy.getCoi(scope.patientInformation)
      inputHelpers.clicker('[data-testid="cancel-button-action"]')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      inputHelpers.clicker('[data-testid="cancel-page-cancel-button"]');
      translationHelpers.assertSectionChildElement('[data-test-id="cancel_cancel_summary"]',0,
        'h1',regressionInput.cancelOrder.orderCancelledTitle,0);
      translationHelpers.assertSectionChildElement('[data-test-id="cancel_cancel_summary"]',0,
        'div',regressionInput.cancelOrder.cancelReason,4);
    },
  },
};
