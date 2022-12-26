import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/ordering_steps_regression.js';
import regressionInfusionSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/infusion_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_SG_Regression/common_happypath.js';
import dayjs from 'dayjs';
Cypress.env('runWithHelpers', false);

describe('US-SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Infusion Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Finished Product Receipt Checklist' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope);
      regressionCommonHappyPath.commonManufacturingPath(scope);
      regressionInfusionSteps.finishedProductReceiptChecklist.previousHappyPathSteps();

      //C24285 [NEG] Verify the "Next" button without giving input in "Scan or enter the Bag ID from the label on the finished product bag 1" field.
      regressionInfusionSteps.finishedProductReceiptChecklist.scanAndVerifyOne(scope);
    });

  })
})
