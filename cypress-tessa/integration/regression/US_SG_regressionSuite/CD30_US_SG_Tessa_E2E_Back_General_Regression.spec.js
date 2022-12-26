import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_SG_Regression/common_happypath.js';
import e2eandback from '../../../utils/Regression_steps/CD30_US_SG_Regression/e2e_and_back_steps.js';
import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/ordering_steps_regression.js';

context('US-SG Therapy', () => {
  let scope = {};

  beforeEach(() => {
    cy.clearCookies();
    regressionOrderingSteps.orderingData(scope);
    regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
    regressionCommonHappyPath.commonCollectionHappyPath(scope);
    regressionCommonHappyPath.commonSatelliteLabPath(scope)
    regressionCommonHappyPath.commonManufacturingPath(scope);
    regressionCommonHappyPath.commonInfusionHappyPath(scope);
  });

  it('E2E AND BACK-US_SG', () => {
    e2eandback.e2e.backbutton(scope);
  });
});

