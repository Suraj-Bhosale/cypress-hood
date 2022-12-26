import regressionOrderingSteps from '../../../utils/Regression_steps/CCCP_IS_RegressionPath/ordering_steps'
import regressionCollectionSteps from '../../../utils/Regression_steps/CCCP_IS_RegressionPath/collection_steps'
import regressionManufacturingSteps from '../../../utils/Regression_steps/CCCP_IS_RegressionPath/manufacturing_steps'
import regressionInfusionSteps from '../../../utils/Regression_steps/CCCP_IS_RegressionPath/infusion_steps'
import regressionCommonHappyPath from '../../../utils/Regression_steps/CCCP_IS_RegressionPath/common_happyPath_steps'
import order_steps from '../../../utils/HappyPath_steps/CCCP_IS_HappyPath/ordering_steps'
import collection_steps from '../../../utils/Regression_steps/CCCP_IS_RegressionPath/collection_steps'
import manufacturing_steps from '../../../utils/HappyPath_steps/CCCP_IS_HappyPath/manufacturing_steps';
import commonHappyPath from "../../../utils/Regression_steps/CCCP_IS_RegressionPath/common_happyPath_steps"
import therapies from '../../../fixtures/therapy.json';

context('CCCP_IS Therapy Infusion Regression Path', () => {
    beforeEach(() => {
        cy.clearCookies();
        order_steps.orderingData(scope);
        regressionCommonHappyPath.commonAliases();
    });

    const scope = {};
    const therapy = therapies.cccp_is

    it('Check Statuses Of Infusion Module', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope,therapy);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope,therapy)
        regressionInfusionSteps.checkStatusesOfInfusionModule(scope);
       
      });

    it('Receive Shipment', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope, therapy);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope, therapy);

        // C29678 [NEG]Verify if 'next' button is disable if 'COI number found on LN2 shipper label' left empty 
        regressionInfusionSteps.receiveShipment.nextButtonDisabledNeg();

        // C29679 [POS]Verify if Next button Enabled after Coi confirmed 
        regressionInfusionSteps.receiveShipment.checkNextEnabled();
    });

    it('Shipment Receipt Checklist', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope, therapy);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope, therapy);
        regressionInfusionSteps.shipmentReceiptChecklist.previousHappyPathSteps(scope);

         //C29633 [NEG]Verify if 'next' button is disable if EVO-IS number is left empty and other fields are filled.
         regressionInfusionSteps.shipmentReceiptChecklist.emptyEvoIsNumberFieldNeg();
    
         //C29634 [NEG]Verify if 'next' button is disable if Tamper seal number is left empty and other fields are filled.
         regressionInfusionSteps.shipmentReceiptChecklist.emptyTamperSealNumberFieldNeg();
     
         //C29635 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact Janssen Site Manager for further instructions'
         regressionInfusionSteps.shipmentReceiptChecklist.shippingContainerCaseFieldNeg();
     
         //C29636 [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact Janssen Site Manager for further instructions'
         regressionInfusionSteps.shipmentReceiptChecklist.noShippingContainerCaseFieldNeg();
     
         //C29637 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact Janssen Site Manager for further instructions'
         regressionInfusionSteps.shipmentReceiptChecklist.toggleShippingContainerCasePos();
     
         //C29638 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Is the shipping container secured?'
         regressionInfusionSteps.shipmentReceiptChecklist.nothingToggleShippingContainer();
     
         //C29639 [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Is the shipping container secured?'
         regressionInfusionSteps.shipmentReceiptChecklist.noToggleShippingContainer();
     
         //C29640 [POS]Verify if 'next' button is Enabled after filling reason for No toggle Is the shipping container secured?'
         regressionInfusionSteps.shipmentReceiptChecklist.toggleShippingContainerCaseSecuredPos();
     
         //C29641 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Is the Janssen shipper label(s) included with the shipper?
         regressionInfusionSteps.shipmentReceiptChecklist.nothingToggleShipperLabel();
     
         //C29642 [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Is the Janssen shipper label(s) included with the shipper?'
         regressionInfusionSteps.shipmentReceiptChecklist.nothingToggleShipperLabel();
     
         //C29643 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Is the Janssen shipper label(s) included with the shipper?'
         regressionInfusionSteps.shipmentReceiptChecklist.toggleShipperLabelPos();
     
         //C29644 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Is the Consignee kit pouch included with the shipper?
         regressionInfusionSteps.shipmentReceiptChecklist.nothingSelectedForConsigneeKit();
     
         //C29645 [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Is the Consignee kit pouch included with the shipper?
         regressionInfusionSteps.shipmentReceiptChecklist.noToggleConsigneeKit();
     
         //C29646 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Is the Consignee kit pouch included with the shipper?'
         regressionInfusionSteps.shipmentReceiptChecklist.toggleConsigneeKitPos();
     
         //C29647 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?'
         regressionInfusionSteps.shipmentReceiptChecklist.nothingEvoNumber();
     
         //C29648 [NEG]Verify if 'next' button is disabled if 'No' selected for toggleDoes the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?
         regressionInfusionSteps.shipmentReceiptChecklist.noEvoNumber()
     
         //C29649 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?'
         regressionInfusionSteps.shipmentReceiptChecklist.toggleEvoNumberPos();
     
         //C29650 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Is the Red Wire Tamper Seal in place for the LN2 shipper lid?
         regressionInfusionSteps.shipmentReceiptChecklist.nothingRedTamperSeal();
     
         //C29651 [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Is the Red Wire Tamper Seal in place for the LN2 shipper lid?'
         regressionInfusionSteps.shipmentReceiptChecklist.noRedTamperSeal();
     
         //C29652 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?'
         regressionInfusionSteps.shipmentReceiptChecklist.toggleRedTamperPos();
     
         //C29653 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?
         regressionInfusionSteps.shipmentReceiptChecklist.nothingTamperSeal();
     
         //C29654 [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?
         regressionInfusionSteps.shipmentReceiptChecklist.noTamperSeal()
         
         //C29656 [POS] Verify that the data is retained on clicking 'Save & Close' button
         regressionInfusionSteps.shipmentReceiptChecklist.saveAndClosePos();
     
         //C29657 [POS]Verify if Back button is working
         regressionInfusionSteps.shipmentReceiptChecklist.posBackLinkCheck();
    });

    it('Shipment Receipt Summary', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope, therapy);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope, therapy);
        regressionInfusionSteps.shipmentReceiptSummary.previousHappyPathSteps(scope);

        //C29676 [POS]Verify if 'Edit' button is working.
        regressionInfusionSteps.shipmentReceiptSummary.posEditButton();
    
        //C29677 [POS]Verify if the next button remains disabled until the user signs the document
        regressionInfusionSteps.shipmentReceiptSummary.nextButtonPos();
    });

    it('Transfer Product to Storage', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope, therapy);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope, therapy);
        regressionInfusionSteps.transferProductToStorage.previousHappyPathSteps(scope);

        //C29673 [NEG]Verify if 'next' button is disabled if 'How will the Final Product be stored?' field left empty
        regressionInfusionSteps.transferProductToStorage.negNextButtonForFinalProduct();
        
        //C29674[NEG]Verify if 'next' button is disabled if 'Scan or enter the COI Bag Identifier on the cassette.' left empty
        regressionInfusionSteps.transferProductToStorage.negNextButtonForCoiBag();
    
        //C29675 [NEG]Verify if 'next' button is disabled if 'Scan or enter the COI number on the LN2 shipper label.' left empty
        regressionInfusionSteps.transferProductToStorage.negNextButtonForLn2Shipper();

    });

    it('Product Receipt Checklist', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope, therapy);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope, therapy);
        regressionInfusionSteps.productReceiptChecklist.previousHappyPathSteps(scope);

        // C29658 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Confirm investigational product cassette(s) were not exposed to ambient temperature 
        regressionInfusionSteps.productReceiptChecklist.nothingSelectedForInvestigationProductNeg();


        // C29659 [NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Confirm investigational product cassette(s) were not exposed to ambient temperature
        regressionInfusionSteps.productReceiptChecklist.noSelectedForInvestigationProductNeg();


        // C29660 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Confirm investigational product cassette(s) were not exposed to ambient temper
        regressionInfusionSteps.productReceiptChecklist.reasonFilledForInvestigationProductPOS();

        //C29661 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Was the tamper evident seal in place on the cassette rack?.' 
        regressionInfusionSteps.productReceiptChecklist.nothingSelectedForSealInPlaceNeg();


        //C29662 [NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Was the tamper evident seal in place on the cassette rack?'
        regressionInfusionSteps.productReceiptChecklist.noSelectedForSealInPlaceNeg();


        //C29663 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Was the tamper evident seal in place on the cassette rack?' 
        regressionInfusionSteps.productReceiptChecklist.reasonFilledForSealInPlacePos();


        //CC29664 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Was there a temperature out-of-range alarm received? If yes, contact Janssen im
        regressionInfusionSteps.productReceiptChecklist.nothingSelectedForTempRangeNeg();


        //C29665 [NEG] Verify if 'next' button is disabled if 'Yes' selected for toggle ' Was there a temperature out-of-range alarm received? If yes, contact Janssen immedi
        regressionInfusionSteps.productReceiptChecklist.yesSelectedForTempRangeNeg();


        //C29666 [POS]Verify if 'next' button is Enabled after filling reason for Yes toggle 'Was there a temperature out-of-range alarm received? If yes, contact Janssen im
        regressionInfusionSteps.productReceiptChecklist.reasonFilledForTempRangedPos();

        //C29667 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Is each bag and cassette in the expected condition (e.g. no cassette damage, label a
        regressionInfusionSteps.productReceiptChecklist.nothingSelectedForExpecCondtionNeg();


        //C29668 [NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Is each bag and cassette in the expected condition (e.g. no cassette damage, label adh
        regressionInfusionSteps.productReceiptChecklist.noSelectedForExpecCondtionNeg();


        //C29669 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Is each bag and cassette in the expected condition (e.g. no cassette damage, label adhered)? If bag(s) or cassette(s) is not in expected condition, please contact Janssen fo'
        regressionInfusionSteps.productReceiptChecklist.reasonFilledForForExpecCondtionPos();


        //C29670 [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Has the investigational product cassette(s) been placed into storage as per the c
        regressionInfusionSteps.productReceiptChecklist.nothingSelectedForStorageNeg();


        //C29671 [NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Has the investigational product cassette(s) been placed into storage as per the casse
        regressionInfusionSteps.productReceiptChecklist.noSelectedForStorageNeg();


        //C29672 [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Has the investigational product cassette(s) been placed into storage as per the c
        regressionInfusionSteps.productReceiptChecklist.reasonFilledForStoragePos();
    });

    it('Product Receipt Summary', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope, therapy);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope, therapy);
        regressionInfusionSteps.productReceiptSummary.previousHappyPathSteps(scope);

        //C29680 [POS]Verify if the next button remains disabled until the user signs the document 
        regressionInfusionSteps.productReceiptSummary.nextButtonPos();

    });

    it('Quality Release', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope, therapy);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope, therapy);
        regressionInfusionSteps.qualityRelease.previousHappyPathSteps(scope);

        //C29685    [NEG]Verify if Next button is disabled if checkbox for 'I verify that this product is approved for release' is not checked. 
        regressionInfusionSteps.qualityRelease.nextButtonDisabledNeg();

        //C39460    [POS]Verify if Next button is Enabled after checkbox for 'I verify that this product is approved for release' checked.
        regressionInfusionSteps.qualityRelease.checkBoxCheckedPos();

        //C39461    [Neg]Verify if Next button is Disabled until user signs the document.
        regressionInfusionSteps.qualityRelease.signToConfirmAppearPos();
    });
})