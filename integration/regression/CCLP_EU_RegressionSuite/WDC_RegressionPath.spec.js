import regressionOrderingSteps from '../../../utils/Regression_steps/CCLP_EU_RegressionPath/ordering_steps'
import regressionCollectionSteps from '../../../utils/Regression_steps/CCLP_EU_RegressionPath/collection_steps'
import regressionWdcSteps from '../../../utils/Regression_steps/CCLP_EU_RegressionPath/wdc_steps'
import regressionManufacturingSteps from '../../../utils/Regression_steps/CCLP_EU_RegressionPath/manufacturing_steps'
import regressionSatelliteSteps from '../../../utils/Regression_steps/CCLP_EU_RegressionPath/satelite_lab_steps'
import regressionInfusionSteps from '../../../utils/Regression_steps/CCLP_EU_RegressionPath/infusion_steps'
import regressionCommonHappyPath from '../../../utils/Regression_steps/CCLP_EU_RegressionPath/common_happyPath_steps'
import order_steps from '../../../utils/HappyPath_steps/CCLP_EU_HappyPath/ordering_steps'
import therapies from '../../../fixtures/therapy.json'
import input from '../../../fixtures/inputs.json'
import schedulingSteps from '../../../utils/HappyPath_steps/scheduling_steps'

context('CCLP EU Therapy WDC Regression Path', () => {
    beforeEach(() => {
      cy.clearCookies();
      order_steps.orderingData(scope);
      regressionCommonHappyPath.commonAliases();
    });

    const scope = {};
    const therapy = therapies.cclp_eu
    
    it('Check Statuses Of WDC Module', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy)
        regressionCommonHappyPath.commonSatelliteHappyPath(scope)
        regressionCommonHappyPath.commonManufacturingHappyPath(scope)

        regressionWdcSteps.checkStatusForWdcModule(scope, therapy, schedulingSteps)
    });

    it('Schedule Final Product Shipment', () => {
     
    });

    it('Verify Shipper', () => {
     
    });

    it('Shipment Receipt Checklist', () => {
     
    });

    it('Shipment Receipt Checklist Summary', () => {
     
    });

    it('Transfer Product To Storage', () => {
     
    });

    it('Product Receipt', () => {
     
    });

    it('Product Reciept Summary', () => {
     
    });

    it('Quality Release', () => {
     
    });

    it('Print Shipper Label', () => {
     
    });

    it('Transfer Product To Shipper', () => {
     
    });

    it('Shipping World Distribution Center', () => {
     
    });

    it('Shipping World Distribution Center Summary', () => {
     
    });
})

    