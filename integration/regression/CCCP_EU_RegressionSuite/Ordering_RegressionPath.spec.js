import order_steps from '../../../utils/HappyPath_steps/CCCP_EU_HappyPath/ordering_steps'
import commonHappyPath from "../../../utils/Regression_steps/CCCP_EU_RegressionPath/common_happyPath_steps"
import regressionOrderingSteps from '../../../utils/Regression_steps/CCCP_EU_RegressionPath/ordering_steps'
import therapies from '../../../fixtures/therapy.json'
import header from '../../../fixtures/assertions.json';

context('CCCP EU Therapy Ordering Regression Path', () => {
  beforeEach(() => {
    cy.clearCookies();
    order_steps.orderingData(scope);
    commonHappyPath.commonAliases();
  });

  const scope = {};
  const therapy = therapies.cclp_eu
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