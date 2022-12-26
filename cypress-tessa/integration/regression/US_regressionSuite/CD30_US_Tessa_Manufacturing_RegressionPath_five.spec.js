import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_Regression/ordering_steps_regression.js';
import regressionManufacturingSteps from '../../../utils/Regression_steps/CD30_US_Regression/manufacturing_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_Regression/common_happypath.js';
import dayjs from 'dayjs';
Cypress.env('runWithHelpers', false);

describe('US Tesscar Regression Path', () => {
  let scope = {};

  describe('Manufacturing Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    })

    it('Select bags to be shipped', () =>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us', scope, 'cd30Us');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);

      regressionManufacturingSteps.selectBagsToBeShippedUs.previousHappyPathSteps(scope);

      //C28123 [POS] Check whether the "Next" button is disabled when we enter the page for the first time.
      regressionManufacturingSteps.selectBagsToBeShippedUs.defaultValue();

      //C28124 [NEG] Check whether the "Next" button is disabled when all the bags are selected as "Do not ship"
      regressionManufacturingSteps.selectBagsToBeShippedUs.allBagsNegative();

      //C28125 [NEG] Check whether the "Next" button is enabled when atleast one bag is selected as "ship" and the remaining selected as "do not ship".
      regressionManufacturingSteps.selectBagsToBeShippedUs.singleBagPositive();

      //C28126 [POS] Check whether the selected options are saved when we switch between the next page and back again.
      regressionManufacturingSteps.selectBagsToBeShippedUs.nextAndBack();
    });

    it('Shipping Checklist', ()=>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us', scope, 'cd30Us');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);

      regressionManufacturingSteps.shippingChecklistUs.previousHappyPathSteps(scope);

      //C28141 [NEG] Verify that the incorrect BAG ID with format "COI-APH-BAG N0." and then "COI-PRC-WRONG_BAG_NO." is entered in "Scan or enter the BAG ID from the label on the PBMC Bag" input field
      regressionManufacturingSteps.shippingChecklistUs.incorrectBagID(scope.treatment.coi);
      //C28142 [POS] Verify that the correct BAG ID with format "COI-PRC-BAG N0." is entered in "Scan or enter the BAG ID from the label on the PBMC Bag" input field and "Confirm" is checked.
      regressionManufacturingSteps.shippingChecklistUs.correctBagID(scope.treatment.coi);
      //C28143 [POS] Verify that all toggle buttons are selected as "Yes" and Airway bill number is filled and confirmed as"123" and click on "Record".
      regressionManufacturingSteps.shippingChecklistUs.allTogglesYesAirwayBillFilled();
      //C28144 [POS] Verify that selecting "NO" in toggle button  results into an input box "Please provide rationale for response" and "Next" button is disabled.
      regressionManufacturingSteps.shippingChecklistUs.oneToggleButtonNO();
      //C28145 [POS] Verify the "Next" button remains disabled until the input box is filled with text.
      regressionManufacturingSteps.shippingChecklistUs.noTextNoNext();
      //C28146 [POS] Verify that button "View Summary" is clickable.
      regressionManufacturingSteps.shippingChecklistUs.printSummary();
    });

    it('Shipping Summary', ()=> {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us', scope, 'cd30Us');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);

      regressionManufacturingSteps.shippingSummaryUs.previousHappyPathSteps(scope);

      //C28139 [NEG] Verify Next and Print Summary is disabled without signature
      regressionManufacturingSteps.shippingSummaryUs.verifyWithoutSignature('[name="manufacturingPhaseCd30UsShippingSummaryPrintSummary"]');

      //C28140 [POS] Verify Next and Print Summary is enabled with signature
      regressionManufacturingSteps.shippingSummaryUs.verifyWithSignature('[name="manufacturingPhaseCd30UsShippingSummaryPrintSummary"]');
    })
  })
})
