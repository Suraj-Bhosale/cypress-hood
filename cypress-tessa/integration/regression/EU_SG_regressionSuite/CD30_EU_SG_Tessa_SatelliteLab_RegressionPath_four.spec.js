import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_EU_SG_Regression/ordering_steps_regression.js';
import regressionSatelliteLabSteps from '../../../utils/Regression_steps/CD30_EU_SG_Regression/satellite_lab_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_EU_SG_Regression/common_happypath.js';
Cypress.env('runWithHelpers', false);

describe('EU-SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Satellite Lab Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Process Pbmc Summary ', () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteLabSteps.processPbmcSummary.previousHappyPathSteps(scope);

      //C21448 [POS] Verify the "Edit" button of the "Process PBMC Summary" page.
      regressionSatelliteLabSteps.processPbmcSummary.verifyEditButtonPositive();

      //C21449 [POS] Verify the "View Summary" button before and after signature.
      regressionSatelliteLabSteps.processPbmcSummary.verifyViewSummaryPositive();
    });

    it('Conditional Release ', () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteLabSteps.conditionalRelease.previousHappyPathSteps(scope);

      //C21342 [NEG] Verify click on "Next" button without uploading a doc.
      regressionSatelliteLabSteps.conditionalRelease.verifyNextButtonNeg();

      //C25332 [POS] Verify that the data is saving after clicking "Save and Close" button.
      regressionSatelliteLabSteps.conditionalRelease.saveAndCloseButtonPositive();

      //C25333 [POS] Verify that the "Next" button is disabled after not signing the signature.
      regressionSatelliteLabSteps.conditionalRelease.verifyNextButtonWithoutSignaturePositive();

      //C21356 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionSatelliteLabSteps.conditionalRelease.backButtonPositive();
    });
  });
});
