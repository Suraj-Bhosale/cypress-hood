import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/ordering_steps_regression.js';
import regressionInfusionSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/infusion_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_SG_Regression/common_happypath.js';
import dayjs from 'dayjs';
Cypress.env('runWithHelpers', false);

describe('US-SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Infusion Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Finished Product Receipt Checklist' , () => {

      //C24797 [NEG] Verify the "Next" button without giving input in "Scan or enter the Bag ID from the label on the finished product bag 3" field.

      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope);
      regressionCommonHappyPath.commonManufacturingPath(scope);
      regressionInfusionSteps.finishedProductReceiptChecklist.previousHappyPathSteps();
      regressionInfusionSteps.finishedProductReceiptChecklist.scanAndVerifyTwo(scope);

      //C24807 [NEG] Verify the "Next" button disabled after not selecting any value from "Does the temperature data conform to standards?" toggle button.
      regressionInfusionSteps.finishedProductReceiptChecklist.temperatureDataWithoutReasonConfirmTogglePositive();

      //C24808 [NEG] Verify the "Next" button   while clicking "No" toggle button without giving reason in "Does the temperature data conform to standards?" field.
      regressionInfusionSteps.finishedProductReceiptChecklist.temperatureDataConfirmToggleWithoutReasonNegative();

      //C24809 [POS] Verify the "Next" button while clicking "No" toggle button in ""Does the temperature data conform to standards?" field with adding reason.
      regressionInfusionSteps.finishedProductReceiptChecklist.temperatureDataConfirmTogglePositive();

      //C24813 [NEG] Verify the "Next" button disabled after not selecting any value from "Is the finished product bag in expected good condition?" toggle button.
      regressionInfusionSteps.finishedProductReceiptChecklist.fpConditionWithoutReasonTogglePositive();

      //C24814 [NEG] Verify the "Next" button   while clicking "No" toggle button without giving reason in "Is the finished product bag in expected good condition?" field.
      regressionInfusionSteps.finishedProductReceiptChecklist.fpConditionToggleWithoutReasonNegative();

      //C24815 [POS] Verify the "Next" button while clicking "No" toggle button in "Is the finished product bag in expected good condition?" field with adding reason.
      regressionInfusionSteps.finishedProductReceiptChecklist.fpConditionTogglePositive();

      //C25133 [POS] Verify the "Next" button without entering data in "Additional Comments" optional text field.
      regressionInfusionSteps.finishedProductReceiptChecklist.additionalCommentBoxPositive();

      //C24817 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionInfusionSteps.finishedProductReceiptChecklist.backButtonPositive();
    });
  })
})
