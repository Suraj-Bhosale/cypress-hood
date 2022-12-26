import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_EU_SG_Regression/ordering_steps_regression.js';
import regressionInfusionSteps from '../../../utils/Regression_steps/CD30_EU_SG_Regression/infusion_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_EU_SG_Regression/common_happypath.js';
import dayjs from 'dayjs';
Cypress.env('runWithHelpers', false);

describe('EU SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Infusion Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Finished Product Receipt Checklist' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope)
      regressionCommonHappyPath.commonManufacturingPathEU(scope);
      regressionInfusionSteps.finishedProductReceiptChecklist.previousHappyPathSteps();

      //C28521 [NEG] Verify the "Next" button without giving input in "Scan or enter the Bag ID from the label on the finished product bag 1" field.
      regressionInfusionSteps.finishedProductReceiptChecklist.scanAndVerifyOne();

      //C28522 [NEG] Verify the "Next" button without giving input in "Scan or enter the Bag ID from the label on the finished product bag 3" field.
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope)
      regressionCommonHappyPath.commonManufacturingPathEU(scope);
      regressionInfusionSteps.finishedProductReceiptChecklist.previousHappyPathSteps();
      regressionInfusionSteps.finishedProductReceiptChecklist.scanAndVerifyTwo();

      //C28523 [POS] Verify the "Next" button disabled after not selecting any value from "Does the temperature data conform to standards?" toggle button.
      regressionInfusionSteps.finishedProductReceiptChecklist.temperatureDataWithoutReasonConfirmTogglePositive();

      //C28524 [NEG] Verify the "Next" button while clicking "No" toggle button without giving reason in "Does the temperature data conform to standards?" field.
      regressionInfusionSteps.finishedProductReceiptChecklist.temperatureDataConfirmToggleWithoutReasonNegative();

      //C28525 [POS] Verify the "Next" button while clicking "No" toggle button in ""Does the temperature data conform to standards?" field with adding reason.
      regressionInfusionSteps.finishedProductReceiptChecklist.temperatureDataConfirmTogglePositive();

      //C28526 [POS] Verify the "Next" button disabled after not selecting any value from "Is the finished product bag in expected good condition?" toggle button.
      regressionInfusionSteps.finishedProductReceiptChecklist.fpConditionWithoutReasonTogglePositive();

      //C28527 [NEG] Verify the "Next" button while clicking "No" toggle button without giving reason in "Is the finished product bag in expected good condition?" field.
      regressionInfusionSteps.finishedProductReceiptChecklist.fpConditionToggleWithoutReasonNegative();

      //C28528 [POS] Verify the "Next" button while clicking "No" toggle button in "Is the finished product bag in expected good condition?" field with adding reason.
      regressionInfusionSteps.finishedProductReceiptChecklist.fpConditionTogglePositive();

      //C28529 [POS] Verify the "Next" button without entering data in "Additional Comments" optional text field.
      regressionInfusionSteps.finishedProductReceiptChecklist.additionalCommentBoxPositive();

      //C28530 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionInfusionSteps.finishedProductReceiptChecklist.backButtonPositive();
    });
  })
})
