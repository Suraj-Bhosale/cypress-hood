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

    it('Final Quality Release', () =>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope)

      regressionManufacturingSteps.finalQualityReleaseEu.previousHappyPathSteps(scope);

      //C28320 [NEG] Verify click on "Next" button without uploading a doc.
      regressionManufacturingSteps.finalQualityReleaseEu.verifyNextButtonNegative();

      //C28321 [POS] Verify that the data is saving after clicking "Save and Close" button.
      regressionManufacturingSteps.finalQualityReleaseEu.saveAndCloseButtonPositive();

      //C28322 [POS] Verify that the "Next" button is disabled after not signing the signature.
      regressionManufacturingSteps.finalQualityReleaseEu.verifyNextButtonWithoutSignaturePositive();

      //C28323 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.finalQualityReleaseEu.backButtonPositive();
    });

    it('Sponser Release', () =>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope)

      regressionManufacturingSteps.sponserReleaseEu.previousHappyPathSteps(scope);

      //C28366 [POS] Verify that the "View Document" button should be enabled for 'Review PBMC Release Documents' and 'Review Quality Release Documents' sections.
      regressionManufacturingSteps.sponserReleaseEu.verifyViewDocumentButtonPositive();

      //C28367 [NEG] Verify click on "Next" button without uploading a doc.
      regressionManufacturingSteps.sponserReleaseEu.verifyNextButtonNegative();

      //C28368 [POS] Verify that the data is saving after clicking "Save and Close" button.
      regressionManufacturingSteps.sponserReleaseEu.saveAndCloseButtonPositive();

      //C28369 [POS] Verify that the "Next" button is disabled after not signing the signature.
      regressionManufacturingSteps.sponserReleaseEu.verifyNextButtonWithoutSignaturePositive();

      //C28370 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.sponserReleaseEu.backButtonPositive();
    });

    it('Select bags to be shipped', () =>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope)

      regressionManufacturingSteps.selectBagsToBeShippedEu.previousHappyPathSteps(scope);

      //C28312 [POS] Check whether the "Next" button is disabled when we enter the page for the first time.
      regressionManufacturingSteps.selectBagsToBeShippedEu.defaultValue();

      //C28313 [NEG] Check whether the "Next" button is disabled when all the bags are selected as "Do not ship"
      regressionManufacturingSteps.selectBagsToBeShippedEu.allBagsNegative();

      //C28314 [NEG] Check whether the "Next" button is enabled when atleast one bag is selected as "ship" and the remaining selected as "do not ship".
      regressionManufacturingSteps.selectBagsToBeShippedEu.singleBagPositive();

      //C28315 [POS] Check whether the selected options are saved when we switch between the next page and back again.
      regressionManufacturingSteps.selectBagsToBeShippedEu.nextAndBack();
    });
  })
})
