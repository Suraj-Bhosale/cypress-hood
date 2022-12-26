import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_EU_SG_Regression/ordering_steps_regression.js';
import regressionManufacturingSteps from '../../../utils/Regression_steps/CD30_EU_SG_Regression/manufacturing_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_EU_SG_Regression/common_happypath.js';
import dayjs from 'dayjs';
Cypress.env('runWithHelpers', false);

describe('Positive flow with 3 bags shipped', () => {
  let scope = {};

  describe('Positive flow with 3 bags shipped', () => {
    beforeEach(() => {
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Positive flow with 3 bags shipped', () =>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope)

      regressionManufacturingSteps.selectBagsToBeShippedGeneral.previousHappyPathSteps(scope);

      //C49162	Positive flow with 3 Bags shipped.
      regressionManufacturingSteps.selectBagsToBeShippedGeneral.positiveFlowWithThreeBagsShipped(scope);
    });
  })
})


