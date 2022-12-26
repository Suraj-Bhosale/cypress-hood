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

    it('Final Quality Release', () =>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope);

      regressionManufacturingSteps.finalQualityRelease.previousHappyPathSteps(scope);

      //C22065 [NEG] Verify click on "Next" button without uploading a doc.
      regressionManufacturingSteps.finalQualityRelease.verifyNextButtonNegative();

      //C22066 [POS] Verify that the data is saving after clicking "Save and Close" button.
      regressionManufacturingSteps.finalQualityRelease.saveAndCloseButtonPositive();

      //C22067 [POS] Verify that the "Next" button is disabled after not signing the signature.
      regressionManufacturingSteps.finalQualityRelease.verifyNextButtonWithoutSignaturePositive();

      //C22068 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.finalQualityRelease.backButtonPositive();
    });

    it('Sponser Release', () =>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope);

      regressionManufacturingSteps.sponserRelease.previousHappyPathSteps(scope);

      //C22141 [POS] Verify that the "View Document" button should be enabled for 'Review PBMC Release Documents' and 'Review QP Release Documents' sections.
      regressionManufacturingSteps.sponserRelease.verifyViewDocumentButtonPositive();

      //C22143 [NEG] Verify click on "Next" button without uploading a doc.
      regressionManufacturingSteps.sponserRelease.verifyNextButtonNegative();

      //C22144 [POS] Verify that the data is saving after clicking "Save and Close" button.
      regressionManufacturingSteps.sponserRelease.saveAndCloseButtonPositive();

      //C22145 [POS] Verify that the "Next" button is disabled after not signing the signature.
      regressionManufacturingSteps.sponserRelease.verifyNextButtonWithoutSignaturePositive();

      //C22146 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.sponserRelease.backButtonPositive();
    });

    it('Select bags to be shipped', () =>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope);

      regressionManufacturingSteps.selectBagsToBeShipped.previousHappyPathSteps(scope);

      //C22114 [POS] Check whether the "Next" button is disabled when we enter the page for the first time.
      regressionManufacturingSteps.selectBagsToBeShipped.defaultValue();

      //C22115 [NEG] Check whether the "Next" button is disabled when all the bags are selected as "Do not ship"
      regressionManufacturingSteps.selectBagsToBeShipped.allBagsNegative();

      //C22116 [NEG] Check whether the "Next" button is enabled when atleast one bag is selected as "ship" and the remaining selected as "do not ship".
      regressionManufacturingSteps.selectBagsToBeShipped.singleBagPositive();

      //C22117 [POS] Check whether the selected options are saved when we switch between the next page and back again.
      regressionManufacturingSteps.selectBagsToBeShipped.nextAndBack();
    });
  })
})
