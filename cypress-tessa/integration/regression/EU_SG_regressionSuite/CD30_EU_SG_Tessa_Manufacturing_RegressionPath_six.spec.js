import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_EU_SG_Regression/ordering_steps_regression.js';
import regressionManufacturingSteps from '../../../utils/Regression_steps/CD30_EU_SG_Regression/manufacturing_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_EU_SG_Regression/common_happypath.js';
import dayjs from 'dayjs';
Cypress.env('runWithHelpers', false);

describe('EU SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Manufacturing Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Shipping Checklist', ()=>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope)
      regressionManufacturingSteps.shippingChecklistEu.previousHappyPathSteps(scope);

      //C28326 [NEG] Verify that the incorrect BAG ID with format "COI-APH-BAG N0." and then "COI-PRC-WRONG_BAG_NO." is entered in "Scan or enter the BAG ID from the label on the PBMC Bag" input field
      regressionManufacturingSteps.shippingChecklistEu.incorrectBagID(scope.treatment.coi);
      //C28327 [POS] Verify that the correct BAG ID with format "COI-PRC-BAG N0." is entered in "Scan or enter the BAG ID from the label on the PBMC Bag" input field and "Confirm" is checked.
      regressionManufacturingSteps.shippingChecklistEu.correctBagID(scope.treatment.coi);
      //C28328 [POS] Verify that all toggle buttons are selected as "Yes" and Airway bill number is filled and confirmed as"123" and click on "Record".
      regressionManufacturingSteps.shippingChecklistEu.allTogglesYesAirwayBillFilled();
      //C28329 [POS] Verify that selecting "NO" in toggle button  results into an input box "Please provide rationale for response" and "Next" button is disabled.
      regressionManufacturingSteps.shippingChecklistEu.oneToggleButtonNO();
      //C28330 [POS] Verify the "Next" button remains disabled until the input box is filled with text.
      regressionManufacturingSteps.shippingChecklistEu.noTextNoNext();
      //C28331 [POS] Verify that button "Print Summary" is clickable.
      regressionManufacturingSteps.shippingChecklistEu.printSummary();
    });

    it('Shipping Summary', ()=> {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope)
      regressionManufacturingSteps.shippingSummaryEu.previousHappyPathSteps(scope);

      //C28362 [NEG] Verify Next and Print Summary is disabled without signature
      regressionManufacturingSteps.shippingSummaryEu.verifyWithoutSignature('[name="manufacturingPhaseCd30EuShippingSummaryPrintSummary"]');

      //C28363 [POS] Verify Next and Print Summary is enabled with signature
      regressionManufacturingSteps.shippingSummaryEu.verifyWithSignature('[name="manufacturingPhaseCd30EuShippingSummaryPrintSummary"]');
    })
  })
})
