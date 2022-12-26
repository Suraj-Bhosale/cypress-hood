import regressionInfusionSteps from '../../../utils/Regression_steps/LCCP_US_RegressionPath/infusion_steps'
import regressionCommonHappyPath from '../../../utils/Regression_steps/LCCP_US_RegressionPath/common_happyPath_steps'
import order_steps from '../../../utils/HappyPath_steps/LCCP_US_HappyPath/ordering_steps'
import therapies from '../../../fixtures/therapy.json';

context('LCCP US Therapy Infusion Regression Path', () => {
    beforeEach(() => {
        cy.clearCookies();
        order_steps.orderingData(scope);
        regressionCommonHappyPath.commonAliases();
    });

    const scope = {};
    const therapy = therapies.lccp_us

    it('Check Status Of Infusion Module', () => {

    });

    it('Receive Shipment', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope, therapy);

        // C28873 [NEG]Verify if 'next' button is disable if 'COI number found on LN2 shipper label' left empty 
        regressionInfusionSteps.receiveShipment.nextButtonDisabled();

        // C40185 [POS]Verify 'Next' button is enabled after coi is confirmed.         
        regressionInfusionSteps.receiveShipment.coiConfirmed();

    });

    it.only('Shipment Receipt Checklist', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope, therapy);
        regressionInfusionSteps.shipmentReceiptChecklist.previousHappyPathSteps(scope);

         
        //C28935 [NEG]Verify if 'next' button is disable if EVO-IS number is left empty and other fields are filled.
        regressionInfusionSteps.shipmentReceiptChecklist.emptyEvoIsNumberFieldNeg();
    
        //C28936 [NEG]Verify if 'next' button is disable if Tamper seal number is left empty and other fields are filled.
        regressionInfusionSteps.shipmentReceiptChecklist.emptyTamperSealNumberFieldNeg();
    
        //C28937 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact Janssen Site Manager for further instructions'
        regressionInfusionSteps.shipmentReceiptChecklist.shippingContainerCaseFieldNeg();
    
        //C28938 [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact Janssen Site Manager for further instructions'
        regressionInfusionSteps.shipmentReceiptChecklist.noShippingContainerCaseFieldNeg();
    
        //C28939 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact Janssen Site Manager for further instructions'
        regressionInfusionSteps.shipmentReceiptChecklist.toggleShippingContainerCasePos();
    
        //C28941 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Is the shipping container secured?'
        regressionInfusionSteps.shipmentReceiptChecklist.nothingToggleShippingContainer();
    
        //C28942 [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Is the shipping container secured?'
        regressionInfusionSteps.shipmentReceiptChecklist.noToggleShippingContainer();
    
        //C28943  [POS]Verify if 'next' button is Enabled after filling reason for No toggle Is the shipping container secured?'
        regressionInfusionSteps.shipmentReceiptChecklist.toggleShippingContainerCaseSecuredPos();
    
        //C28944 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Is the Janssen shipper label(s) included with the shipper?
        regressionInfusionSteps.shipmentReceiptChecklist.nothingToggleShipperLabel();
    
        //C28945 [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Is the Janssen shipper label(s) included with the shipper?'
        regressionInfusionSteps.shipmentReceiptChecklist.nothingToggleShipperLabel();
    
        //C28946 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Is the Janssen shipper label(s) included with the shipper?'
        regressionInfusionSteps.shipmentReceiptChecklist.toggleShipperLabelPos();
    
        //C28947 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Is the Consignee kit pouch included with the shipper?
        regressionInfusionSteps.shipmentReceiptChecklist.nothingSelectedForConsigneeKit();
    
        //C28948 [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Is the Consignee kit pouch included with the shipper?
        regressionInfusionSteps.shipmentReceiptChecklist.noToggleConsigneeKit();
    
        //C28949 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Is the Consignee kit pouch included with the shipper?'
        regressionInfusionSteps.shipmentReceiptChecklist.toggleConsigneeKitPos();
    
        //C28950 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?'
        regressionInfusionSteps.shipmentReceiptChecklist.nothingEvoNumber();
    
        //C28951 [NEG]Verify if 'next' button is disabled if 'No' selected for toggleDoes the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?
        regressionInfusionSteps.shipmentReceiptChecklist.noEvoNumber()
    
        //C28952 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?'
        regressionInfusionSteps.shipmentReceiptChecklist.toggleEvoNumberPos();
    
        //C28953 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Is the Red Wire Tamper Seal in place for the LN2 shipper lid?
        regressionInfusionSteps.shipmentReceiptChecklist.nothingRedTamperSeal();
    
        //C28954 [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Is the Red Wire Tamper Seal in place for the LN2 shipper lid?'
        regressionInfusionSteps.shipmentReceiptChecklist.noRedTamperSeal();
    
        //C28955 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?'
        regressionInfusionSteps.shipmentReceiptChecklist.toggleRedTamperPos();
    
        //C25756 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?
        regressionInfusionSteps.shipmentReceiptChecklist.nothingTamperSeal();
    
        //C28957 [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?
        regressionInfusionSteps.shipmentReceiptChecklist.noTamperSeal()
        
        //C28940 [POS] Verify that the data is retained on clicking 'Save & Close' button
        regressionInfusionSteps.shipmentReceiptChecklist.saveAndClosePos();
    
        //C28959 [POS]Verify if Back button is working
        regressionInfusionSteps.shipmentReceiptChecklist.posBackLinkCheck();


    });

    it('Product Receipt Checklist', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope, therapy);
        regressionInfusionSteps.productReceiptChecklist.previousHappyPathSteps(scope);

        // C28876	 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Confirm investigational product cassette(s) were not exposed to ambient temperature 
        regressionInfusionSteps.productReceiptChecklist.nothingSelectedForInvestigationProductNeg();


        // C28877 [NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Confirm investigational product cassette(s) were not exposed to ambient temperature
        regressionInfusionSteps.productReceiptChecklist.noSelectedForInvestigationProductNeg();


        // C28878 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Confirm investigational product cassette(s) were not exposed to ambient temper
        regressionInfusionSteps.productReceiptChecklist.reasonFilledForInvestigationProductPOS();

        //C28879	 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Was the tamper evident seal in place on the cassette rack?.' 
        regressionInfusionSteps.productReceiptChecklist.nothingSelectedForSealInPlaceNeg();


        //C28880 [NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Was the tamper evident seal in place on the cassette rack?'
        regressionInfusionSteps.productReceiptChecklist.noSelectedForSealInPlaceNeg();


        //C28881 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Was the tamper evident seal in place on the cassette rack?' 
        regressionInfusionSteps.productReceiptChecklist.reasonFilledForSealInPlacePos();


        //C28882 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Was there a temperature out-of-range alarm received? If yes, contact Janssen im
        regressionInfusionSteps.productReceiptChecklist.nothingSelectedForTempRangeNeg();


        //C28883 [NEG] Verify if 'next' button is disabled if 'Yes' selected for toggle ' Was there a temperature out-of-range alarm received? If yes, contact Janssen immedi
        regressionInfusionSteps.productReceiptChecklist.yesSelectedForTempRangeNeg();


        //C28884 [POS]Verify if 'next' button is Enabled after filling reason for Yes toggle 'Was there a temperature out-of-range alarm received? If yes, contact Janssen im
        regressionInfusionSteps.productReceiptChecklist.reasonFilledForTempRangedPos();

        //C28885 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Is each bag and cassette in the expected condition (e.g. no cassette damage, label a
        regressionInfusionSteps.productReceiptChecklist.nothingSelectedForExpecCondtionNeg();


        //C28886 [NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Is each bag and cassette in the expected condition (e.g. no cassette damage, label adh
        regressionInfusionSteps.productReceiptChecklist.noSelectedForExpecCondtionNeg();


        //C28887 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Is each bag and cassette in the expected condition (e.g. no cassette damage, label adhered)? If bag(s) or cassette(s) is not in expected condition, please contact Janssen fo'
        regressionInfusionSteps.productReceiptChecklist.reasonFilledForForExpecCondtionPos();


        //C28888 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Has the investigational product cassette(s) been placed into storage as per the c
        regressionInfusionSteps.productReceiptChecklist.nothingSelectedForStorageNeg();


        //C28889 [NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Has the investigational product cassette(s) been placed into storage as per the casse
        regressionInfusionSteps.productReceiptChecklist.noSelectedForStorageNeg();


        //C28890 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Has the investigational product cassette(s) been placed into storage as per the c
        regressionInfusionSteps.productReceiptChecklist.reasonFilledForStoragePos();
    });

    it('Product Receipt Summary', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope, therapy);
        regressionInfusionSteps.productReceiptSummary.previousHappyPathSteps(scope);

        //C28891 [POS]Verify if the next button remains disabled until the user signs the document 
        regressionInfusionSteps.productReceiptSummary.nextButtonPos();
    });
})