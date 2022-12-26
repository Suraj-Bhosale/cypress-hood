import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/ordering_steps_regression';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_SG_Regression/common_happypath.js';
Cypress.env('runWithHelpers', false);
describe('US-SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Ordering Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Confirm Subject Eligibility', () =>{
      regressionOrderingSteps.selectTherapyHappyPath('tesscar001-cd30car-t-us-sg');
      regressionOrderingSteps.confirmSubjectEligibilty.previousHappyPathSteps(scope,'collection_cd30_us_sg','cd30UsEu');

      // 	[POS] Verify that the "Next" button is disabled with the toggle button selected as "NO".
      regressionOrderingSteps.confirmSubjectEligibilty.toggleButtonNegativeConfirmSubjectEligibility();

      // [POS] Verify that the "Next" button is enabled with the toggle button selected as "YES".
      regressionOrderingSteps.confirmSubjectEligibilty.saveAndClosePositiveConfirmSubjectEligibility(scope.patientInformation);

      // [POS] Verify that the toggle button information is saved upon clicking the save and close button.
      regressionOrderingSteps.confirmSubjectEligibilty.toggleButtonPositiveConfirmSubjectEligibility(scope.patientInformation);

    });

    it('Approve Order', () => {
      regressionOrderingSteps.selectTherapyHappyPath('tesscar001-cd30car-t-us-sg');
      regressionOrderingSteps.approveOrder.previousHappyPathSteps(scope, 'collection_cd30_us_sg','cd30UsEu');

      // C21049	[NEG] Verify 'Approve Order' and 'View Summary' is disabled without signature.
      regressionOrderingSteps.approveOrder.verifyWithoutSignature();

      //C21052	[POS] Verify values are retained after edit.
      regressionOrderingSteps.approveOrder.verifyEdit('[data-testid="txt-contact-person-collection_cd30_us_sg"]',
        '[data-testid="txt-phone-number-collection_cd30_us_sg"]', '[data-testid="txt-additional-notes-collection_cd30_us_sg"]');

      //C21050	[POS] Verify that order can be approved and 'View Summary' is enabled after signature is done.
      regressionOrderingSteps.approveOrder.verifyWithSignature();
    });
  });
});
