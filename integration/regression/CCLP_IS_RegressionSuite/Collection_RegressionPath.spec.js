import regressionOrderingSteps from '../../../utils/Regression_steps/CCLP_IS_RegressionPath/ordering_steps'
import regressionCollectionSteps from '../../../utils/Regression_steps/CCLP_IS_RegressionPath/collection_steps'
import regressionInfusionSteps from '../../../utils/Regression_steps/CCLP_IS_RegressionPath/infusion_steps'
import regressionCommonHappyPath from '../../../utils/Regression_steps/CCLP_IS_RegressionPath/common_happyPath_steps'
import order_steps from '../../../utils/Regression_steps/CCLP_IS_RegressionPath/ordering_steps'
import therapies from '../../../fixtures/therapy.json'

context('CCLP IS Therapy Collection Regression Path', () => {
    beforeEach(() => {
      cy.clearCookies();
      order_steps.orderingData(scope);
      regressionCommonHappyPath.commonAliases();
    });

    const scope = {};
    const therapy = therapies.cclp_is
    const region = therapy.region;
    

    it('Check Statuses Of Collection Module', () => {
     
    });

    it('Patient Verification', () => {
     
    });
  
    it('Collection Bag Identification', () => {
      
    });
  
    it('Collection Bag Label', () => {
     
    });

    it('Collection Procedure Information', () => {
     
    });

    it('Bag Data Entry', () => {
     
    });

    it('Collection Summary', () => {
     
    });

    it('Change Of Custody', () => {
     
    });

    it('Confirm Change Of Custody', () => {
     
    });

    it('Collection Transfer Product To Shipper', () => {
     
    });

    it('Collection Shipment Checklist', () => {
     
    });

    it('Collection Shipping Summary', () => {
     
    });
  });
