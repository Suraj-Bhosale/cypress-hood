import regressionOrderingSteps from '../../../utils/Regression_steps/CCLP_CILTA_CENTRAL_RegressionPath/ordering_steps_cilta'
import commonHappyPath from "../../../utils/Regression_steps/CCLP_CILTA_CENTRAL_RegressionPath/common_happyPath_steps"
import regressionCancelSteps from '../../../utils/Regression_steps/CCLP_CILTA_CENTRAL_RegressionPath/cancel_steps_cilta';
import orderingStepsHappyPath from '../../../utils/HappyPath_steps/CCLP_CILTA_CENTRAL_HappyPath/ordering_steps_cilta';
import therapies from '../../../fixtures/therapy.json'
import header from '../../../fixtures/assertions.json';

context('CCLP US Therapy Ordering Regression Path', () => {
  const scope = {};
  const therapy = therapies.cclp_cilta
  const region = 'US';

  beforeEach(() => {
    cy.clearCookies();
    orderingStepsHappyPath.orderingData(scope);
    commonHappyPath.commonAliases();
  });

    it('Order Cancellation', () => {
      cy.openOrder('ordering','oliver')
      regressionOrderingSteps.selectTherapyHappyPath(therapy.context)
      orderingStepsHappyPath.AddPatientInformation(scope.patientInformation, "", therapy);
      orderingStepsHappyPath.SelectOrderingSite(scope.treatmentInformation,header.orderingSite,scope.patientHeaderBar,header);
      orderingStepsHappyPath.schedulingCheckAvailability(therapy)
      orderingStepsHappyPath.AddSchedulingOrder(header);
      orderingStepsHappyPath.SubmitOrder(scope, therapy);
      cy.commonPagination(scope.patientInformation.patientId,'Treatments per Patient')

      //C40101 [Neg] Verify the "Yes, cancel order" button is disabled when reason for cancellation and signature is not done.
      regressionCancelSteps.orderCancellation.cancelOrderButtonNegative();

      //C40102 [POS] Verify "Yes, cancel order" button is enabled after selecting option from  "reason for cancellation"  dropdown.
      regressionCancelSteps.orderCancellation.cancelOrderButtonPositive();

      //C40103 [NEG] Verify "Yes, cancel order" button is disabled when signature is not done.
      regressionCancelSteps.orderCancellation.cancelOrderButtonWithoutSignatureNegative();

      //C40104 [POS] Verify an additional box appears when "Other" is selected from dropdown.
      regressionCancelSteps.orderCancellation.additionReasonBoxPositive();

      //C40105 [POS] Verify "Yes, cancel order" button is disabled" after not doing approver signature.
      regressionCancelSteps.orderCancellation.checkDoNotCancelButtonPositive(scope);

      //C40106 [POS] Verify 'Yes, cancel order' button should be disabled after not adding 'Please provide details about your answer' field.
      regressionCancelSteps.orderCancellation.cancelButtonWithoutDataPositive();

      //C40107 [POS] Verify that after clicking  "Yes, cancel order" button, order should be cancel.
      regressionCancelSteps.orderCancellation.orderCancelPositive();
    })
  
});