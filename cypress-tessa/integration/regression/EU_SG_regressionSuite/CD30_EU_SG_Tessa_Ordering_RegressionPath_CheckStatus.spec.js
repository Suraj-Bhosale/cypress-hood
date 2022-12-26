import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_EU_SG_Regression/ordering_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_EU_SG_Regression/common_happypath.js';

Cypress.env('runWithHelpers', false);
describe('EU SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Ordering Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Check Statuses Of Ordering Module', () => {
      regressionOrderingSteps.selectTherapyHappyPath('tesscar001-cd30car-t-eu-sg');
      regressionOrderingSteps.checkStatusesOfOrderingModule(scope);
    });
  });
});
