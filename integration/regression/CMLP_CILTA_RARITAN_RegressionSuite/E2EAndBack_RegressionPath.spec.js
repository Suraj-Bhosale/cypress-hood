import ordering_steps from '../../../utils/HappyPath_steps/CMLP_CILTA_RARITAN_HappyPath/ordering_steps_cilta';
import commonHappyPath from "../../../utils/Regression_steps/CMLP_CILTA_RARITAN_RegressionPath/common_happyPath_steps"
import e2eandback from '../../../utils/Regression_steps/CMLP_CILTA_RARITAN_RegressionPath/e2eandback_steps_clita'
import therapies from '../../../fixtures/therapy.json'

context('CMLP US Therapy Infusion Regression Path', () => {
    const scope = {};
    const therapy = therapies.cmlp_cilta
    const region = 'US';

    beforeEach(() => {
      cy.clearCookies();
      ordering_steps.orderingData(scope);
      commonHappyPath.commonAliases();
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      commonHappyPath.commonManufacturingHappyPath(scope);
      commonHappyPath.commonInfusionHappyPath(therapy,scope);
    });
    it('E2E AND BACK', () => {
     //	C40686	E2E and back    
      e2eandback.e2e.backbutton(scope,therapy);
      
    });

});
    