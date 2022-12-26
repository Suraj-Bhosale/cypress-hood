import regressionOrderingSteps from '../../../utils/Regression_steps/CCCP_EU_RegressionPath/ordering_steps'
import regressionCollectionSteps from '../../../utils/Regression_steps/CCCP_EU_RegressionPath/collection_steps'
import regressionManufacturingSteps from '../../../utils/Regression_steps/CCCP_EU_RegressionPath/manufacturing_steps'
import regressionSatelliteSteps from '../../../utils/Regression_steps/CCCP_EU_RegressionPath/satelite_lab_steps'
import regressionInfusionSteps from '../../../utils/Regression_steps/CCCP_EU_RegressionPath/infusion_steps'
import regressionCommonHappyPath from '../../../utils/Regression_steps/CCCP_EU_RegressionPath/common_happyPath_steps'
import order_steps from '../../../utils/Regression_steps/CCCP_EU_RegressionPath/ordering_steps'
import therapies from '../../../fixtures/therapy.json'
import input from '../../../fixtures/inputs.json'

context('CCCP EU Therapy Satellite Regression Path', () => {
    beforeEach(() => {
      cy.clearCookies();
      order_steps.orderingData(scope);
      regressionCommonHappyPath.commonAliases();
    });

    const scope = {};
    const therapy = therapies.cclp_eu
    

    it('Check Statuses Of Satellite Module', () => {
     
    });
  
    it('Sat Lab Collection Summary', () => {
    
    });
    it('Sat Lab Verify Shipment', () => {
    
    });
    it('Sat Lab Shipment Checklist', () => {
     
    });
    it('Sat Lab Shipment Checklist Summary', () => {
    
    });
    it('Sat Lab Cryopreservation', () => {
     
    });
    it('Sat Lab Cryopreservation Labels', () => {
     
    });
    it('Sat Lab Bag StorageEU', () => {
     
    });
    it('Sat Lab Cryopreservation Data', () => {
    
     
    });
    it('Sat Lab Cryopreservation Summary', () => {
    
    });
    it('Sat Lab Print Shipper Labels', () => {
     

    });

    it('Sat Lab Bag Selection', () => {
     
    });

    it('Sat Lab Transfer Product To Shipper', () => {
      
    });

    it('Sat Lab Shipping Checklist', () => {
     
    });
    
    it('Sat Shipping Summary Verify', () => {
     
    });
  });
