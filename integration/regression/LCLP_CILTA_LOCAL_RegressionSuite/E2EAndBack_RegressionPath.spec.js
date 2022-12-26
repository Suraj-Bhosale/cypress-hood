import ordering_steps from '../../../utils/HappyPath_steps/LCLP_CILTA_LOCAL_HappyPath/ordering_steps_cilta';
import commonHappyPath from "../../../utils/Regression_steps/LCLP_CILTA_LOCAL_RegressionPath/common_happyPath_steps"
import e2eandback from '../../../utils/Regression_steps/LCLP_CILTA_LOCAL_RegressionPath/e2eandback_steps_clita'
import therapies from '../../../fixtures/therapy.json'

context('LCLP US Therapy E2E AND BACK', () => {
 
  const scope = {};
  const therapy = therapies.lclp_cilta
  const region = 'US';

    beforeEach(() => {
      cy.clearCookies();
      ordering_steps.orderingData(scope);
      commonHappyPath.commonAliases();
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonManufacturingHappyPath(scope);
      commonHappyPath.commonInfusionHappyPath(therapy,scope);
    });
    it('E2E AND BACK', () => {
      //	C40684	E2E and back   
      e2eandback.e2e.backbutton(scope,therapy);
      
    });

});
    