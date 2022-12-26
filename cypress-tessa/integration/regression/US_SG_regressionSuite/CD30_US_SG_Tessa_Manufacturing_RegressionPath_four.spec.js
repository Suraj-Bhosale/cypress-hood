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

    it('Confirm Number Of Bags' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope);
      regressionManufacturingSteps.confirmNumberOfBags.previousHappyPathSteps(scope);

      //C24196 [NEG] Verify that the "Next" button should be disabled if the "How many bags resulted from today's manufacturing process?" field is kept empty.
      regressionManufacturingSteps.confirmNumberOfBags.emptyData();

      //C24197 [NEG] Verify "How many bags resulted from today's manufacturing process?" input field with invalid data.
      regressionManufacturingSteps.confirmNumberOfBags.invalidData();

      //C24278 [POS] Verify that after a click on the "Save and Close" button selected data should be saved.
      regressionManufacturingSteps.confirmNumberOfBags.saveAndClose(scope.treatment.coi);

      //C22151 [POS] Verify that the data is not missing after clicking the "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.confirmNumberOfBags.retainValue();
    });

    it('Manufacturing Summary' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope);
      regressionManufacturingSteps.manufacturingSummary.previousHappyPathSteps(scope);

      //C22063 [POS] Verify the "View Summary" button before and after signature.
      regressionManufacturingSteps.manufacturingSummary.viewSummary();

      //C22101 [POS] Verify the "Edit" button for "Manufacturing Start" page.
      regressionManufacturingSteps.manufacturingSummary.editButton1();

      //C22102 [POS] Verify that after editing the "Harvesting" page the "Next" button is disabled on the manufacturing summary page until the re-signature is done.
      regressionManufacturingSteps.manufacturingSummary.editButton2();

      //C22103 [POS] Verify the "Edit" button of the "Print finished product bag labels" page.
      regressionManufacturingSteps.manufacturingSummary.editButton3();

      //C22104 [POS] Verify the "Edit" button of "Confirm number of bags" page.
      regressionManufacturingSteps.manufacturingSummary.editButton4();
    });

    it('Conditional Quality Release', () =>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope);

      regressionManufacturingSteps.conditionalQualityRelease.previousHappyPathSteps(scope);

      //C22051 [NEG] Verify click on "Next" button without uploading a doc.
      regressionManufacturingSteps.conditionalQualityRelease.verifyNextButtonNegative();

      //C22057 [POS] Verify that the data is saving after clicking "Save and Close" button.
      regressionManufacturingSteps.conditionalQualityRelease.saveAndCloseButtonPositive();

      //C22055 [POS] Verify that the "Next" button is disabled after not signing the signature.
      regressionManufacturingSteps.conditionalQualityRelease.verifyNextButtonWithoutSignaturePositive();

      //C22056 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.conditionalQualityRelease.backButtonPositive();
    });
  })
})
