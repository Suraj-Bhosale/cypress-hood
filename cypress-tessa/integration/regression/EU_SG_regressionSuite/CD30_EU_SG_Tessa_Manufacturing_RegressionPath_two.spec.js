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

    it('PBMC Receipt' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope)

      regressionManufacturingSteps.pbmcReceiptEu.previousHappyPathSteps(scope);

      //C32678 [NEG] Verify that user not able to click "Next" button without entering data in " Scan or enter the Bag ID from the label on the PBMC bag" field
      regressionManufacturingSteps.pbmcReceiptEu.scanAndVerifyEmptyNegative();

      //C32679 [NEG] Verify that user not able to click "Next" button after entering invalid data in "Scan or enter the Bag ID from the label on the PBMC bag" field.
      regressionManufacturingSteps.pbmcReceiptEu.scanAndVerifyInvalidNegative();

      //C32682 [NEG] Verify the "Next" button disabled after not selecting any value from ""Is the PBMC bag in expected good condition?"" toggle button.
      regressionManufacturingSteps.pbmcReceiptEu.withoutSelectingFirstBagConditionToggleButtonNegative();

      //C32683 [NEG] Verify the "Next" button while clicking "No" for ""Is the PBMC bag in expected good condition?"" toggle button without giving reason.
      regressionManufacturingSteps.pbmcReceiptEu.firstBagConditiontoggleButtonNegative();

      //C50114 [NEG] Verify the "Next" button after not selecting any value from "I have received the total number of bags as displayed above" toggle button
      regressionManufacturingSteps.pbmcReceiptEu.withoutSelectingSecondBagConditiontoggleButtonNegative();

      //C50115 [NEG] Verify the "Next" button while clicking "No" for ""I have received the total number of bags as displayed above"" toggle button without giving reason.
      regressionManufacturingSteps.pbmcReceiptEu.secondBagConditiontoggleButtonNegative();

      //C32753 [POS] Verify the "Next" button without entering data in Additional Comments  (Optional) field.
      regressionManufacturingSteps.pbmcReceiptEu.additionalCommentPositive();

      //C32755 [POS] Verify that the data is saving after clicking "Save and Close" button.
      regressionManufacturingSteps.pbmcReceiptEu.saveAndCloseButtonPositive(scope.treatment.coi);

      //C32757 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.pbmcReceiptEu.backButtonPositive();
    });

    it('PBMC Receipt Summary' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope)

      regressionManufacturingSteps.pbmcReceiptSummaryEu.previousHappyPathSteps(scope);

      //C32762 [POS] Verify the "Next" button after not signing the signature.
      regressionManufacturingSteps.pbmcReceiptSummaryEu.verifyNextButtonWithoutSignaturePositive();

      //C32763 [POS] Verify the changes after click on the edit button.
      regressionManufacturingSteps.pbmcReceiptSummaryEu.verifyDataWithEditButtonPositive();
    });

    it('Temperature Data' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope)

      regressionManufacturingSteps.temperatureDataEu.previousHappyPathSteps(scope);

      //C28342 [NEG] Verify the "Next" button disabled after not selecting any value from toggle button.
      regressionManufacturingSteps.temperatureDataEu.verifyNextButtonPositive();

      //C28343 [NEG] Verify the "Next" button while clicking "No" toggle button without giving reason.
      regressionManufacturingSteps.temperatureDataEu.noToggleButtonNegative();

      //C28344 [POS] Verify the "Next" button while clicking "No" toggle button.
      regressionManufacturingSteps.temperatureDataEu.noToggleButtonPositive();

      //C28345 [POS] Verify that the data is saving after clicking "Save and Close" button.
      regressionManufacturingSteps.temperatureDataEu.saveAndCloseButtonPositive(scope.treatment.coi);

      //C28346 [POS] Verify that the "Next" button is disabled after not signing the signature.
      regressionManufacturingSteps.temperatureDataEu.verifyNextButtonWithoutSignaturePositive();

      //C28347 [POS] Verify that the data is not moving after clicking "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.temperatureDataEu.backButtonPositive();
    });
  })
})
