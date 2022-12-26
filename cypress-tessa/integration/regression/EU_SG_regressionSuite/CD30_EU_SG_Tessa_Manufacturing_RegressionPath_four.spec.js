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

    it('Confirm Number Of Bags' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope)

      regressionManufacturingSteps.confirmNumberOfBagsEu.previousHappyPathSteps(scope);

      //C28373 [NEG] Verify that the "Next" button should be disabled if the "How many bags resulted from today's manufacturing process?" field is kept empty.
      regressionManufacturingSteps.confirmNumberOfBagsEu.emptyData();

      //C28374 [NEG] Verify "How many bags resulted from today's manufacturing process?" input field with invalid data.
      regressionManufacturingSteps.confirmNumberOfBagsEu.invalidData();

      //C28375 [pos] Verify that after a click on the "Save and Close" button selected data should be saved.
      regressionManufacturingSteps.confirmNumberOfBagsEu.saveAndClose(scope.treatment.coi);

      //C28372 [POS] Verify that the data is not missing after clicking the "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.confirmNumberOfBagsEu.retainValue();
    });

    it('Manufacturing Summary' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope)

      regressionManufacturingSteps.manufacturingSummaryEu.previousHappyPathSteps(scope);

      //C28332 [POS] Verify the "View Summary" button before and after signature.
      regressionManufacturingSteps.manufacturingSummaryEu.viewSummary();

      //C28333 [POS] Verify the "Edit" button for "Manufacturing Start" page.
      regressionManufacturingSteps.manufacturingSummaryEu.editButton1();

      //C28334 [POS] Verify that after editing the "Harvesting" page the "Next" button is disabled on the manufacturing summary page until the re-signature is done.
      regressionManufacturingSteps.manufacturingSummaryEu.editButton2();

      //C28335 [POS] Verify the "Edit" button of the "Print finished product bag labels" page.
      regressionManufacturingSteps.manufacturingSummaryEu.editButton3();

      //C28336 [POS] Verify the "Edit" button of "Confirm number of bags" page.
      regressionManufacturingSteps.manufacturingSummaryEu.editButton4();
    });

    it('Conditional Quality Release', () =>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope)

      regressionManufacturingSteps.conditionalQualityReleaseEu.previousHappyPathSteps(scope);

      //C28357 [NEG] Verify click on "Next" button without uploading a doc.
      regressionManufacturingSteps.conditionalQualityReleaseEu.verifyNextButtonNegative();

      //C28358 [POS] Verify that the data is saving after clicking "Save and Close" button.
      regressionManufacturingSteps.conditionalQualityReleaseEu.saveAndCloseButtonPositive();

      //C28359 [POS] Verify that the "Next" button is disabled after not signing the signature.
      regressionManufacturingSteps.conditionalQualityReleaseEu.verifyNextButtonWithoutSignaturePositive();

      //C28360 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.conditionalQualityReleaseEu.backButtonPositive();
    });
  })
})
