import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_Regression/ordering_steps_regression.js';
import regressionManufacturingSteps from '../../../utils/Regression_steps/CD30_US_Regression/manufacturing_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_Regression/common_happypath.js';
import dayjs from 'dayjs';
Cypress.env('runWithHelpers', false);

describe('Manufacturing Three Iterations', () => {
  let scope = {};

  describe('Manufacturing Three Iterations', () => {
    beforeEach(() => {
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Manufacturing Three Iterations', () =>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us', scope, 'cd30Us');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionManufacturingSteps.selectBagsToBeShippedGeneral.previousHappyPathSteps(scope);

      //C36670	Shipping loop with 3 iterations 
      regressionManufacturingSteps.selectBagsToBeShippedGeneral.threeIterations(scope);
    });
  })
})
