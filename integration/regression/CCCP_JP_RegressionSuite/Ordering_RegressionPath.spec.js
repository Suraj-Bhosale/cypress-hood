import order_steps from '../../../utils/HappyPath_steps/CCCP_JP_HappyPath/ordering_steps'
import commonHappyPath from "../../../utils/Regression_steps/CCCP_JP_RegressionPath/common_happyPath_steps"
import regressionOrderingSteps from '../../../utils/Regression_steps/CCCP_JP_RegressionPath/ordering_steps'
import therapies from '../../../fixtures/therapy.json'
import header from '../../../fixtures/assertions.json';

context('CCCP JP Therapy Ordering Regression Path', () => {
  beforeEach(() => {
    cy.clearCookies();
    order_steps.orderingData(scope);
    commonHappyPath.commonAliases();
  });

  const scope = {};
  const therapy = therapies.cccp_jp
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