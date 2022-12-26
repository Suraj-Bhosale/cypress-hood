import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/ordering_steps_regression.js';
import regressionSatelliteLabSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/satellite_lab_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_SG_Regression/common_happypath.js';
Cypress.env('runWithHelpers', false);

describe('US-SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Satellite Lab Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Shipping Checklist', ()=>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteLabSteps.shippingChecklist.previousHappyPathSteps(scope);

      //[NEG] Verify that the incorrect BAG ID with format "COI-APH-BAG N0." and then "COI-PRC-WRONG_BAG_NO." is entered in "Scan or enter the BAG ID from the label on the PBMC Bag" input field
      regressionSatelliteLabSteps.shippingChecklist.incorrectBagID(scope.treatment.coi);

      //[POS] Verify that the correct BAG ID with format "COI-PRC-BAG N0." is entered in "Scan or enter the BAG ID from the label on the PBMC Bag" input field and "Confirm" is checked.
      regressionSatelliteLabSteps.shippingChecklist.correctBagID(scope.treatment.coi);

      //[POS] Verify that all toggle buttons are selected as "Yes" and Airway bill number is filled and confirmed as"123" and click on "Record".
      //regressionSatelliteLabSteps.shippingChecklist.allTogglesYesAirwayBillFilled();
      //[POS] Verify that selecting "NO" in toggle button  results into an input box "Please provide rationale for response" and "Next" button is disabled.
      regressionSatelliteLabSteps.shippingChecklist.oneToggleButtonNO();

      //[POS] Verify the "Next" button remains disabled until the input box is filled with text.
      regressionSatelliteLabSteps.shippingChecklist.noTextNoNext();

      //[POS] Verify that button "View Summary" is clickable.
      regressionSatelliteLabSteps.shippingChecklist.viewSummary();
    })

    it('Shipping Summary', ()=>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteLabSteps.shippingSummary.previousHappyPathSteps(scope);

      //[POS] Verify "Edit" button of "Shipping Summary" page and "Next" button of the editable page.
      regressionSatelliteLabSteps.shippingSummary.editAndNextButtonOnPrevPage();

      //[POS] Verify "View Summary" button is disabled before signature and enabled after signature.
      regressionSatelliteLabSteps.shippingSummary.viewSummaryBeforeAndAfterSign();

      //[POS]Verify that after editing the page the "Next" button is disabled on Shipping summary page until re-signature is done.
      regressionSatelliteLabSteps.shippingSummary.nextButtonDisabledUntilSignature(scope.treatment.coi);
    })
  });
});
