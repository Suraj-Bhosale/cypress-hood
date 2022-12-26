import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/ordering_steps_regression.js';
import regressionCollectionSteps from "../../../utils/Regression_steps/CD30_US_SG_Regression/collection_steps_regression.js";
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_SG_Regression/common_happypath.js';

Cypress.env('runWithHelpers', false);

describe('US-SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Collection Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Shipping Summary', ()=>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCollectionSteps.shippingSummary.previousHappyPathSteps(scope);

      //[POS] Verify whether order can be approved after signature is done.
      regressionCollectionSteps.shippingSummary.verifySubmitWithSignature();

      //[POS] Verify whether 'View Summary' is enabled when signature is done.
      regressionCollectionSteps.shippingSummary.verifyViewSummaryWithSignature();

      //[POS] Verify that after editing the page the "Next" button of the "Collection Summary " page is disabled until the re-signature is done.
      regressionCollectionSteps.shippingSummary.reSignatureAfterEdit();
    });

    it('Collection IDM Test Results', ()=>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCollectionSteps.collectionIdmTestResults.previousHappyPathSteps(scope);

      //C21155 [POS] Verify that the "Save and Close" button is disabled without selecting any value of toggle button.
      regressionCollectionSteps.collectionIdmTestResults.noValueSelectedInToggle();

      //C21153 [POS] Verify that the "Save and Close" button is disabled with the toggle button selected as "NO".
      regressionCollectionSteps.collectionIdmTestResults.negativeIdmSampleCollectionInToggle(scope.patientInformation);

       //C21225 [POS] Verify that "Save and Close" button is enabled only if there is some input given in the "Please provide rationale for response"  field.
      regressionCollectionSteps.collectionIdmTestResults.inputFieldVisible();

      //C21154 [POS] Verify that the "Save and Close" button is enabled with the toggle button selected as "YES".
      regressionCollectionSteps.collectionIdmTestResults.positiveIdmSampleCollectionInToggle(scope.patientInformation);

      //C21226 [POS] Verify that Signature block appears once clicked on "Save and Close".
      regressionCollectionSteps.collectionIdmTestResults.signatureBlock();
    });
  });
});


