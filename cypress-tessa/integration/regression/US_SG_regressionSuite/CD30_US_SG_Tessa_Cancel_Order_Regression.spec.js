import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/ordering_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_SG_Regression/common_happypath.js';
import regressionCancelSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/cancel_order_regression.js';
import orderingStepsHappyPath from '../../../utils/HappyPath_steps/CD30_US_SG_HappyPath/ordering_steps';

describe('US-SG Tesscar Regression Path', () => {
describe('Cancel Order Flow', () => {
  let scope = {};
  Cypress.env('runWithHelpers', false);
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    }),

    it('Order Cancellation', () => {
        cy.log('login oliver');
        cy.platformLogin('oliver@vineti.com');
        cy.visit('/ordering');
        orderingStepsHappyPath.createOrder();
        orderingStepsHappyPath.selectTherapy('tesscar001-cd30car-t-us-sg');
        orderingStepsHappyPath.subjectRegistration(scope.patientInformation,scope.treatmentInformation);
        orderingStepsHappyPath.principal_investigator_information(scope.treatmentInformation);
        orderingStepsHappyPath.scheduleCollection('collection_cd30_us_sg');
        orderingStepsHappyPath.confirmOrder(scope.treatmentInformation);
        orderingStepsHappyPath.confirm_subject_eligibility();
        orderingStepsHappyPath.approveOrder();
        cy.getCoi(scope.patientInformation)

        // C36257 [Neg] Verify the "Yes, cancel order" button is disabled when reason for cancellation and signature is not done.
        regressionCancelSteps.orderCancellation.cancelOrderButtonNegative();

        // C36258 [POS] Verify "Yes, cancel order" button is enabled after selecting option from  "reason for cancellation"  dropdown.
        regressionCancelSteps.orderCancellation.cancelOrderButtonPositive();

        // C36259 [NEG] Verify "Yes, cancel order" button is disabled when signature is not done.
        regressionCancelSteps.orderCancellation.cancelOrderButtonWithoutSignatureNegative();

        // C36260 [POS] Verify an additional box appears when "Other" is selected from dropdown.
        regressionCancelSteps.orderCancellation.additionReasonBoxPositive();

        // C36261 [POS] Verify that after clicking  "Yes, cancel order" button, order should be cancel.
        regressionCancelSteps.orderCancellation.orderCancelPositive(scope);
    })
  })
});