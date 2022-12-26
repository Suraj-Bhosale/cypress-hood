import regressionOrderingSteps from '../../../utils/Regression_steps/LCLP_US_RegressionPath/ordering_steps'
import regressionCollectionSteps from '../../../utils/Regression_steps/LCLP_US_RegressionPath/collection_steps'
import regressionManufacturingSteps from '../../../utils/Regression_steps/LCLP_US_RegressionPath/manufacturing_steps'
import regressionInfusionSteps from '../../../utils/Regression_steps/LCLP_US_RegressionPath/infusion_steps'
import regressionCommonHappyPath from '../../../utils/Regression_steps/LCLP_US_RegressionPath/common_happyPath_steps'
import order_steps from '../../../utils/HappyPath_steps/LCLP_US_HappyPath/ordering_steps'
import therapies from '../../../fixtures/therapy.json';

context('LCLP US Therapy Infusion Regression Path', () => {
    beforeEach(() => {
        cy.clearCookies();
        order_steps.orderingData(scope);
        regressionCommonHappyPath.commonAliases();
    });

    const scope = {};
    const therapy = therapies.lclp_us

    it('Check Statuses Of Infusion Module', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope,therapy)
        regressionInfusionSteps.checkStatusesOfInfusionModule(scope);
       
      });

    it('Receive Shipment', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope, therapy);

        // [NEG]Verify if 'next' button is disable if 'COI number found on LN2 shipper label' left empty 
        regressionInfusionSteps.receiveShipment.nextButtonDisabled();

        // [POS]Verify 'Next' button is enabled after coi is confirmed.         
        regressionInfusionSteps.receiveShipment.coiConfirmed();

    });

    it('Shipment Receipt Checklist', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope, therapy);
        regressionInfusionSteps.shipmentReceiptChecklist.previousHappyPathSteps(scope);
    
        
        //C25698 [NEG]Verify if 'next' button is disable if EVO-IS number is left empty and other fields are filled.
        regressionInfusionSteps.shipmentReceiptChecklist.emptyEvoIsNumberFieldNeg();
    
        //C25699 [NEG]Verify if 'next' button is disable if Tamper seal number is left empty and other fields are filled.
        regressionInfusionSteps.shipmentReceiptChecklist.emptyTamperSealNumberFieldNeg();
    
        //C25700 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact Janssen Site Manager for further instructions'
        regressionInfusionSteps.shipmentReceiptChecklist.shippingContainerCaseFieldNeg();
    
        //C25701 [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact Janssen Site Manager for further instructions'
        regressionInfusionSteps.shipmentReceiptChecklist.noShippingContainerCaseFieldNeg();
    
        //C25702 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact Janssen Site Manager for further instructions'
        regressionInfusionSteps.shipmentReceiptChecklist.toggleShippingContainerCasePos();
    
        //C25723 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Is the shipping container secured?'
        regressionInfusionSteps.shipmentReceiptChecklist.nothingToggleShippingContainer();
    
        //C25724[NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Is the shipping container secured?'
        regressionInfusionSteps.shipmentReceiptChecklist.noToggleShippingContainer();
    
        //C25725  [POS]Verify if 'next' button is Enabled after filling reason for No toggle Is the shipping container secured?'
        regressionInfusionSteps.shipmentReceiptChecklist.toggleShippingContainerCaseSecuredPos();
    
        //C25726 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Is the Janssen shipper label(s) included with the shipper?
        regressionInfusionSteps.shipmentReceiptChecklist.nothingToggleShipperLabel();
    
        //C25727 [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Is the Janssen shipper label(s) included with the shipper?'
        regressionInfusionSteps.shipmentReceiptChecklist.nothingToggleShipperLabel();
    
        //C25728 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Is the Janssen shipper label(s) included with the shipper?'
        regressionInfusionSteps.shipmentReceiptChecklist.toggleShipperLabelPos();
    
        //C25729 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Is the Consignee kit pouch included with the shipper?
        regressionInfusionSteps.shipmentReceiptChecklist.nothingSelectedForConsigneeKit();
    
        //C25730 [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Is the Consignee kit pouch included with the shipper?
        regressionInfusionSteps.shipmentReceiptChecklist.noToggleConsigneeKit();
    
        //C25731 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Is the Consignee kit pouch included with the shipper?'
        regressionInfusionSteps.shipmentReceiptChecklist.toggleConsigneeKitPos();
    
        //C25732 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?'
        regressionInfusionSteps.shipmentReceiptChecklist.nothingEvoNumber();
    
        //C25733 [NEG]Verify if 'next' button is disabled if 'No' selected for toggleDoes the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?
        regressionInfusionSteps.shipmentReceiptChecklist.noEvoNumber()
    
        //C25734 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?'
        regressionInfusionSteps.shipmentReceiptChecklist.toggleEvoNumberPos();
    
        //C25735 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Is the Red Wire Tamper Seal in place for the LN2 shipper lid?
        regressionInfusionSteps.shipmentReceiptChecklist.nothingRedTamperSeal();
    
        //C25736 [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Is the Red Wire Tamper Seal in place for the LN2 shipper lid?'
        regressionInfusionSteps.shipmentReceiptChecklist.noRedTamperSeal();
    
        //C25637 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?'
        regressionInfusionSteps.shipmentReceiptChecklist.toggleRedTamperPos();
    
        //C25738 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?
        regressionInfusionSteps.shipmentReceiptChecklist.nothingTamperSeal();
    
        //C25739 [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?
        regressionInfusionSteps.shipmentReceiptChecklist.noTamperSeal()
        
        //C25722 [POS] Verify that the data is retained on clicking 'Save & Close' button
        regressionInfusionSteps.shipmentReceiptChecklist.saveAndClosePos();
    
        //C28679 [POS]Verify if Back button is working
        regressionInfusionSteps.shipmentReceiptChecklist.posBackLinkCheck();
    });
    
    it('Shipment Receipt Summary', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope, therapy);
        regressionInfusionSteps.shipmentReceiptSummary.previousHappyPathSteps(scope);
    
    
        //C25751 [POS]Verify if 'Edit' button is working.
        regressionInfusionSteps.shipmentReceiptSummary.posEditButton();
    
        //C25752 [POS]Verify if the next button remains disabled until the user signs the document
        regressionInfusionSteps.shipmentReceiptSummary.nextButtonPos();
    
    
    });
    
    it('Transfer Product to Storage', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope, therapy);
        regressionInfusionSteps.transferProductToStorage.previousHappyPathSteps(scope);
    
        //C25825 [NEG]Verify if 'next' button is disabled if 'How will the Final Product be stored?' field left empty
        regressionInfusionSteps.transferProductToStorage.negNextButtonForFinalProduct();
        
        //C25827 [NEG]Verify if 'next' button is disabled if 'Scan or enter the COI Bag Identifier on the cassette.' left empty
        regressionInfusionSteps.transferProductToStorage.negNextButtonForCoiBag();
    
        //C25826 [NEG]Verify if 'next' button is disabled if 'Scan or enter the COI number on the LN2 shipper label.' left empty
        regressionInfusionSteps.transferProductToStorage.negNextButtonForLn2Shipper();
    });

    it('Product Receipt Checklist', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope, therapy);
        regressionInfusionSteps.productReceiptChecklist.previousHappyPathSteps(scope);

        // C25828 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Confirm investigational product cassette(s) were not exposed to ambient temperature 
        regressionInfusionSteps.productReceiptChecklist.nothingSelectedForInvestigationProductNeg();


        // C25829 [NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Confirm investigational product cassette(s) were not exposed to ambient temperature
        regressionInfusionSteps.productReceiptChecklist.noSelectedForInvestigationProductNeg();


        // C25830 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Confirm investigational product cassette(s) were not exposed to ambient temper
        regressionInfusionSteps.productReceiptChecklist.reasonFilledForInvestigationProductPOS();

        //C25848 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Was the tamper evident seal in place on the cassette rack?.' 
        regressionInfusionSteps.productReceiptChecklist.nothingSelectedForSealInPlaceNeg();


        //C25849 [NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Was the tamper evident seal in place on the cassette rack?'
        regressionInfusionSteps.productReceiptChecklist.noSelectedForSealInPlaceNeg();


        //C25850 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Was the tamper evident seal in place on the cassette rack?' 
        regressionInfusionSteps.productReceiptChecklist.reasonFilledForSealInPlacePos();


        //C25851 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Was there a temperature out-of-range alarm received? If yes, contact Janssen im
        regressionInfusionSteps.productReceiptChecklist.nothingSelectedForTempRangeNeg();


        //C25852 [NEG] Verify if 'next' button is disabled if 'Yes' selected for toggle ' Was there a temperature out-of-range alarm received? If yes, contact Janssen immedi
        regressionInfusionSteps.productReceiptChecklist.yesSelectedForTempRangeNeg();


        //C25853 [POS]Verify if 'next' button is Enabled after filling reason for Yes toggle 'Was there a temperature out-of-range alarm received? If yes, contact Janssen im
        regressionInfusionSteps.productReceiptChecklist.reasonFilledForTempRangedPos();

        //C25854 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Is each bag and cassette in the expected condition (e.g. no cassette damage, label a
        regressionInfusionSteps.productReceiptChecklist.nothingSelectedForExpecCondtionNeg();


        //C25855 [NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Is each bag and cassette in the expected condition (e.g. no cassette damage, label adh
        regressionInfusionSteps.productReceiptChecklist.noSelectedForExpecCondtionNeg();


        //C25856 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Is each bag and cassette in the expected condition (e.g. no cassette damage, label adhered)? If bag(s) or cassette(s) is not in expected condition, please contact Janssen fo'
        regressionInfusionSteps.productReceiptChecklist.reasonFilledForForExpecCondtionPos();


        //C25857 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Has the investigational product cassette(s) been placed into storage as per the c
        regressionInfusionSteps.productReceiptChecklist.nothingSelectedForStorageNeg();


        //C25858 [NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Has the investigational product cassette(s) been placed into storage as per the casse
        regressionInfusionSteps.productReceiptChecklist.noSelectedForStorageNeg();


        //C25859 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Has the investigational product cassette(s) been placed into storage as per the c
        regressionInfusionSteps.productReceiptChecklist.reasonFilledForStoragePos();
    });

    it('Product Receipt Summary', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope, therapy);
        regressionInfusionSteps.productReceiptSummary.previousHappyPathSteps(scope);

        //C25867 [POS]Verify if the next button remains disabled until the user signs the document 
        regressionInfusionSteps.productReceiptSummary.nextButtonPos();
    });
})
