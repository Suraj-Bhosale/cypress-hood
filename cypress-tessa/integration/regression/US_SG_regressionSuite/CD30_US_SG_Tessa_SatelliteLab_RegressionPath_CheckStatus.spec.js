import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/ordering_steps_regression.js';
import regressionSatelliteLabSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/satellite_lab_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_SG_Regression/common_happypath.js';
Cypress.env('runWithHelpers', false);

describe('US-SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Satellite Lab Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Check Statuses Of SatelliteLab Module', () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteLabSteps.checkStatusesOfSatelliteLabModule(scope);
    });
  });
});
