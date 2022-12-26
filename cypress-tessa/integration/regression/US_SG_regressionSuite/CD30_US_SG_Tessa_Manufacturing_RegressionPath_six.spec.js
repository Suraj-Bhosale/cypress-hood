import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/ordering_steps_regression.js';
import regressionManufacturingSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/manufacturing_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_SG_Regression/common_happypath.js';
import dayjs from 'dayjs';
Cypress.env('runWithHelpers', false);

describe('US-SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Manufacturing Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Shipping Checklist', ()=>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope);

      regressionManufacturingSteps.shippingChecklist.previousHappyPathSteps(scope);

      //C22106 [NEG] Verify that the incorrect BAG ID with format "COI-APH-BAG N0." and then "COI-PRC-WRONG_BAG_NO." is entered in "Scan or enter the BAG ID from the label on the PBMC Bag" input field
      regressionManufacturingSteps.shippingChecklist.incorrectBagID(scope.treatment.coi);
      //C22107 [POS] Verify that the correct BAG ID with format "COI-PRC-BAG N0." is entered in "Scan or enter the BAG ID from the label on the PBMC Bag" input field and "Confirm" is checked.
      regressionManufacturingSteps.shippingChecklist.correctBagID(scope.treatment.coi);
      //C22108 [POS] Verify that all toggle buttons are selected as "Yes" and Airway bill number is filled and confirmed as"123" and click on "Record".
      regressionManufacturingSteps.shippingChecklist.allTogglesYesAirwayBillFilled();
      //C22109 [POS] Verify that selecting "NO" in toggle button  results into an input box "Please provide rationale for response" and "Next" button is disabled.
      regressionManufacturingSteps.shippingChecklist.oneToggleButtonNO();
      //C22110 [POS] Verify the "Next" button remains disabled until the input box is filled with text.
      regressionManufacturingSteps.shippingChecklist.noTextNoNext();
      //C22111 [POS] Verify that button "View Summary" is clickable.
      regressionManufacturingSteps.shippingChecklist.printSummary();
    });

    it('Shipping Summary', ()=> {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope);

      regressionManufacturingSteps.shippingSummary.previousHappyPathSteps(scope);
      //C26534 [NEG] Verify Next and Print Summary is disabled without signature
      regressionManufacturingSteps.shippingSummary.verifyWithoutSignature('[name="manufacturingPhaseCd30UsEuShippingSummaryPrintSummary"]');
      //C26535 [POS] Verify Next and Print Summary is enabled with signature
      regressionManufacturingSteps.shippingSummary.verifyWithSignature('[name="manufacturingPhaseCd30UsEuShippingSummaryPrintSummary"]');
    })
  })
})
