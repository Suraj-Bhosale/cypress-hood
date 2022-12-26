import order_steps from '../../../utils/HappyPath_steps/CCLP_IS_HappyPath/ordering_steps'
import commonHappyPath from "../../../utils/Regression_steps/CCLP_IS_RegressionPath/common_happyPath_steps"
import regressionOrderingSteps from '../../../utils/Regression_steps/CCLP_IS_RegressionPath/ordering_steps'
import therapies from '../../../fixtures/therapy.json'
import header from '../../../fixtures/assertions.json';

context('CCLP IS Therapy Ordering Regression Path', () => {
  beforeEach(() => {
    cy.clearCookies();
    order_steps.orderingData(scope);
    commonHappyPath.commonAliases();
  });

  const scope = {};
  const therapy = therapies.cclp_is
  const region = therapy.region;
  

  it('Check Statuses Of Ordering Module', () => {
   
  });

  it('Patient Information ', () => {
   
  });

  it('Prescriber', () => {

  });

  it('Scheduling', () => {
   
  });

  it('Confirmation', () => {
   
   
  });

  it('Approval', () => {
    
   
  });

});