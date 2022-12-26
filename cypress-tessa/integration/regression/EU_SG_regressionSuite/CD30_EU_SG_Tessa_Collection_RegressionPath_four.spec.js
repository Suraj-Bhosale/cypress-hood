import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_EU_SG_Regression/ordering_steps_regression.js';
import regressionCollectionSteps from "../../../utils/Regression_steps/CD30_EU_SG_Regression/collection_steps_regression.js";
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_EU_SG_Regression/common_happypath.js';
import dayjs from 'dayjs';
Cypress.env('runWithHelpers', false);

describe('EU SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Collection Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Shipping Summary', ()=>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCollectionSteps.shippingSummary.previousHappyPathSteps(scope);

      //[POS] Verify whether order can be approved after signature is done.
      regressionCollectionSteps.shippingSummary.verifySubmitWithSignature();

      //[POS] Verify whether 'View Summary' is enabled when signature is done.
      regressionCollectionSteps.shippingSummary.verifyViewSummaryWithSignature();

      //[POS] Verify that after editing the page the "Next" button of the "Collection Summary " page is disabled until the re-signature is done.
      regressionCollectionSteps.shippingSummary.reSignatureAfterEdit();
    });

    it('Collection IDM Test Results', ()=>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCollectionSteps.collectionIdmTestResultsEu.previousHappyPathSteps(scope);

      //C28431 [POS] Verify that the "Save and Close" button is disabled without selecting any value of toggle button.
      regressionCollectionSteps.collectionIdmTestResultsEu.noValueSelectedInToggle();

      //C28432 [POS] Verify that the "Save and Close" button is disabled with the toggle button selected as "NO".
      regressionCollectionSteps.collectionIdmTestResultsEu.negativeIdmSampleCollectionInToggle(scope.patientInformation);

      //C28433 [POS] Verify that "Save and Close" button is enabled only if there is some input given in the "Please provide rationale for response"  field.
      regressionCollectionSteps.collectionIdmTestResultsEu.inputFieldVisible();

      //C28434 [POS] Verify that the "Save and Close" button is enabled with the toggle button selected as "YES".
      regressionCollectionSteps.collectionIdmTestResultsEu.positiveIdmSampleCollectionInToggle(scope.patientInformation);

      //CC28435 [POS] Verify that Signature block appears once clicked on "Save and Close".
      regressionCollectionSteps.collectionIdmTestResultsEu.signatureBlock();
    });
  });
});