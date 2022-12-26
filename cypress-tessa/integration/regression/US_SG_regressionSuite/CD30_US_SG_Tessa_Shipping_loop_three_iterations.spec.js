import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/ordering_steps_regression.js';
import regressionManufacturingSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/manufacturing_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_SG_Regression/common_happypath.js';

Cypress.env('runWithHelpers', false);

describe('Manufacturing Three Iterations', () => {
  let scope = {};

  describe('Manufacturing Three Iterations', () => {
    beforeEach(() => {
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Manufacturing Three Iterations', () =>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope);
      regressionManufacturingSteps.selectBagsToBeShippedGeneral.previousHappyPathSteps(scope);

      //C49096	Shipping loop with 3 iterations
      regressionManufacturingSteps.selectBagsToBeShippedGeneral.threeIterations(scope);
    });
  })
})
