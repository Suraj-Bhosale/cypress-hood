import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_Regression/common_happypath.js';
import e2eandback from '../../../utils/Regression_steps/CD30_US_Regression/e2e_and_back_steps.js';
import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_Regression/ordering_steps_regression.js';

context('US Therapy', () => {
  let scope = {};

  beforeEach(() => {
    cy.clearCookies();
    regressionOrderingSteps.orderingData(scope);
    regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us', scope, 'cd30Us');
    regressionCommonHappyPath.commonCollectionHappyPath(scope);
    regressionCommonHappyPath.commonManufacturingPathUS(scope);
    regressionCommonHappyPath.commonInfusionHappyPath(scope);
  });
  
  it('E2E AND BACK- US', () => {
    e2eandback.e2e.backbutton(scope);
  });
});

