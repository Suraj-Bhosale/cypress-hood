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

    it('Final Release ', () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteLabSteps.finalRelease.previousHappyPathSteps(scope);

      //C21343 [NEG] Verify click on "Next" button without uploading a doc.
      regressionSatelliteLabSteps.finalRelease.verifyNextButtonNeg();

      //C25335 [POS] Verify that the data is saving after clicking "Save and Close" button.
      regressionSatelliteLabSteps.finalRelease.saveAndCloseButtonPositive();

      //C25336 [POS] Verify that the "Next" button is disabled after not signing the signature.
      regressionSatelliteLabSteps.finalRelease.verifyNextButtonWithoutSignaturePositive();

      //C21360 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionSatelliteLabSteps.finalRelease.backButtonPositive();
    });

    it('Select Bags to be Shipped', ()=>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteLabSteps.selectBagsToBeShipped.previousHappyPathSteps(scope);

      // [NEG] Verify whether the "Next" button is disabled when all the bags are selected as "Do Not Ship"
      regressionSatelliteLabSteps.selectBagsToBeShipped.allBagsDoNotShip();

      // [POS] Verify whether the "Next" button is enabled when atleast one bag is selected as "SHIP"
      regressionSatelliteLabSteps.selectBagsToBeShipped.singleBagShip();
    })
  });
});
