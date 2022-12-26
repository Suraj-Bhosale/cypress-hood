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

    it('Pbmc Labels ', () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteLabSteps.pbmcLabels.previousHappyPathSteps(scope);

      //C21345 [NEG] Verify that the "Next" button should be disabled until the checkbox is not checked.
      regressionSatelliteLabSteps.pbmcLabels.verifyNextButtonNegative();

      //C21346 [POS] Verify that the data should be saved after clicking the "Save and close" button.
      regressionSatelliteLabSteps.pbmcLabels.saveAndCloseButton(scope.treatment.coi);

      //C22042 [POS]Verify that while switching back from the "PBMC Bags Information" to the "PBMC Labels" page the checkbox should be checked.
      regressionSatelliteLabSteps.pbmcLabels.retainValue();
    });

    it('PBMC bags information', ()=>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteLabSteps.pbmcBagsInformation.previousHappyPathSteps(scope);

      //[NEG]Verify the "Next" button remains disabled if the number of bags is negative or zero and the checkbox is checked.
      regressionSatelliteLabSteps.pbmcBagsInformation.bagsLessThanZeroAndCheckBoxChecked();

      //[POS] Verify the "Next" button is enabled only if input field for "How many bags resulted from today's PBMC processing?" is filled and checkbox "Apply Labels to Bags and Cassettes" is checked.
      regressionSatelliteLabSteps.pbmcBagsInformation.pbmcBagsFilledAndCheckboxIsChecked();

      //[POS]Verify the "Next" button is disabled until the signature is done.
      regressionSatelliteLabSteps.pbmcBagsInformation.nextDisabledUntilSign();
    });
  });
});
