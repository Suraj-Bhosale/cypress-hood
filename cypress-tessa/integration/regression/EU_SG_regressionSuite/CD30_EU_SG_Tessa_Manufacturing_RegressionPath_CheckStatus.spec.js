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

    it('Check Statuses Of Manufacturing Module', () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope)
      regressionManufacturingSteps.checkStatusesOfManufacturingModule(scope);
    });
  })
})
