import regressionOrderingSteps from '../../../utils/Regression_steps/CCLP_US_RegressionPath/ordering_steps'
import regressionCollectionSteps from '../../../utils/Regression_steps/CCLP_US_RegressionPath/collection_steps'
import regressionManufacturingSteps from '../../../utils/Regression_steps/CCLP_US_RegressionPath/manufacturing_steps'
import regressionInfusionSteps from '../../../utils/Regression_steps/CCLP_US_RegressionPath/infusion_steps'
import regressionCommonHappyPath from '../../../utils/Regression_steps/CCLP_US_RegressionPath/common_happyPath_steps'
import therapies from "../../../fixtures/therapy.json"
import collection_steps from '../../../utils/HappyPath_steps/CCLP_US_HappyPath/collection_steps'
import order_steps from '../../../utils/HappyPath_steps/CCLP_US_HappyPath/ordering_steps'


context('CCLP US Therapy Collection Regression Path', () => {
    beforeEach(() => {
      cy.clearCookies();
      order_steps.orderingData(scope);
      regressionCommonHappyPath.commonAliases();
    });

    const scope = {};
    const therapy = therapies.cclp_us

    it('Check Statuses Of Infusion Module', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
      regressionCommonHappyPath.commonSatelliteHappyPath(scope);
      regressionCommonHappyPath.commonManufacturingHappyPath(scope,therapy)
      regressionInfusionSteps.checkStatusesOfInfusionModule(scope);
     
    });
  
    it('Receive Shipment', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
      regressionCommonHappyPath.commonSatelliteHappyPath(scope);
      regressionCommonHappyPath.commonManufacturingHappyPath(scope,therapy)
 
 
      // [NEG]Verify if 'next' button is disable if 'COI number found on LN2 shipper label' left empty 
      regressionInfusionSteps.receiveShipment.negCoi()

      // [POS]Verify if Back button is working 
      regressionInfusionSteps.receiveShipment.posDataOnNext()
     });
   it('Shipment Receipt Checklist', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
      regressionCommonHappyPath.commonSatelliteHappyPath(scope);
      regressionCommonHappyPath.commonManufacturingHappyPath(scope,therapy)
      regressionInfusionSteps.shipmentReceiptChecklist.previousHappyPathSteps()

      // [NEG]Verify if 'next' button is disable if EVO-IS number is left empty and other fields are filled. 
      regressionInfusionSteps.shipmentReceiptChecklist.emptyEvoIsNumberFieldNeg()

      // [NEG]Verify if 'next' button is disable if Tamper seal number is left empty and other fields are filled. 
      regressionInfusionSteps.shipmentReceiptChecklist.emptyTamperSealNumberFieldNeg()

      // [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact Janssen Site Manager for further instructions' 
      regressionInfusionSteps.shipmentReceiptChecklist.negShippingContainerEmpty()

      // [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact Janssen Site Manager for further instructions' 
      regressionInfusionSteps.shipmentReceiptChecklist.negShippingContainer()

      // [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact Janssen Site Manager for further instructions' 
      regressionInfusionSteps.shipmentReceiptChecklist.posShippingContainer()

      // [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Is the shipping container secured?' 
      regressionInfusionSteps.shipmentReceiptChecklist.negZipTiesSecuredEmpty()

      // [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Is the shipping container secured?' 
      regressionInfusionSteps.shipmentReceiptChecklist.negZipTiesSecured()

      // [POS]Verify if 'next' button is Enabled after filling reason for No toggle Is the shipping container secured?' 
      regressionInfusionSteps.shipmentReceiptChecklist.posZipTiesSecured()

      // [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Is the Janssen shipper label(s) included with the shipper? 
      regressionInfusionSteps.shipmentReceiptChecklist.negShipperLabelEmpty()

      // [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Is the Janssen shipper label(s) included with the shipper?' 
      regressionInfusionSteps.shipmentReceiptChecklist.negShipperLabel()

      // [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Is the Janssen shipper label(s) included with the shipper?' 
      regressionInfusionSteps.shipmentReceiptChecklist.posToggleShipperLabel()

      // [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Is the Consignee kit pouch included with the shipper? 
      regressionInfusionSteps.shipmentReceiptChecklist.negToggleIsConsigneeKitPouchEmpty()

      // [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Is the Consignee kit pouch included with the shipper? 
      regressionInfusionSteps.shipmentReceiptChecklist.negToggleIsConsigneeKitPouch()

      // [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Is the Consignee kit pouch included with the shipper?' 
      regressionInfusionSteps.shipmentReceiptChecklist.posToggleIsConsigneeKitPouch()

      // [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?' 
      regressionInfusionSteps.shipmentReceiptChecklist.negEvoMatchEmpty()

      // [NEG]Verify if 'next' button is disabled if 'No' selected for toggleDoes the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid? 
      regressionInfusionSteps.shipmentReceiptChecklist.negEvoMatch()

      // [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?' 
      regressionInfusionSteps.shipmentReceiptChecklist.posToggleDoesTamperSealNumberListed()
      
      // [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Is the Red Wire Tamper Seal in place for the LN2 shipper lid? 
      regressionInfusionSteps.shipmentReceiptChecklist.negRedWireTamperSealEmpty()

      // [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Is the Red Wire Tamper Seal in place for the LN2 shipper lid?' 
      regressionInfusionSteps.shipmentReceiptChecklist.negRedWireTamperSeal()

      // [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Is the Red Wire Tamper Seal in place for the LN2 shipper lid? 
      regressionInfusionSteps.shipmentReceiptChecklist.posRedWireTamperSeal()

      // [NEG]Verify if 'next' button is disabled if Nothing selected for toggle 'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid? 
      regressionInfusionSteps.shipmentReceiptChecklist.negTamperSealMatchEmpty()

      // [NEG]Verify if 'next' button is disabled if 'No' selected for toggle'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid? 
      regressionInfusionSteps.shipmentReceiptChecklist.negTamperSealMatch()

      // [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?' 
      regressionInfusionSteps.shipmentReceiptChecklist.PosTamperSealMatch()

      // [POS] Verify that the data is retained on clicking 'Save & Close' button 
      regressionInfusionSteps.shipmentReceiptChecklist.posSaveAndCloseButtonCheck(scope)
     })

   it('Shipment Receipt Summary', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
      regressionCommonHappyPath.commonSatelliteHappyPath(scope);
      regressionCommonHappyPath.commonManufacturingHappyPath(scope,therapy)
      regressionInfusionSteps.shipmentReceiptSummary.previousHappyPathSteps()

      // [POS]Verify if 'Edit' button is working. 
      regressionInfusionSteps.shipmentReceiptSummary.posEditButton()

      // [POS]Verify if the next button remains disabled until the user signs the document 
      regressionInfusionSteps.shipmentReceiptSummary.nextButtonPos()
   })

   it('Transfer Product To Storage', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
      regressionCommonHappyPath.commonSatelliteHappyPath(scope);
      regressionCommonHappyPath.commonManufacturingHappyPath(scope,therapy)
      regressionInfusionSteps.transferProductToStorage.previousHappyPathSteps()

      // [NEG]Verify if 'next' button is disabled if 'Scan or enter the COI number on the LN2 shipper label.' left empty 
      regressionInfusionSteps.transferProductToStorage.negBagId()

      // [NEG]Verify if 'next' button is disabled if 'Scan or enter the COI Bag Identifier on the cassette.' left empty 
      regressionInfusionSteps.transferProductToStorage.cassetteNeg()

      // [NEG]Verify if 'next' button is disabled if 'How will the Final Product be stored?' field left empty 
      regressionInfusionSteps.transferProductToStorage.finalProductNeg()

   //   [POS] Verify the data is saved upon clicking 'Save & Close ' button 
      regressionInfusionSteps.transferProductToStorage.saveAndClosePos(scope)
   })

   it('Product Receipt Checklist', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
      regressionCommonHappyPath.commonSatelliteHappyPath(scope);
      regressionCommonHappyPath.commonManufacturingHappyPath(scope,therapy)
      regressionInfusionSteps.productReceiptChecklist.previousHappyPathSteps()

      // [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Confirm investigational product cassette(s) were not exposed to ambient temperature greater than 3 minutes.' 
      regressionInfusionSteps.productReceiptChecklist.nothingSelectedForInvestigationProductNeg()

      // [NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Confirm investigational product cassette(s) were not exposed to ambient temperature greater than 3 minutes.' 
      regressionInfusionSteps.productReceiptChecklist.noSelectedForInvestigationProductNeg()

      // [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Confirm investigational product cassette(s) were not exposed to ambient temperature greater than 3 minutes' 
      regressionInfusionSteps.productReceiptChecklist.reasonFilledForInvestigationProductPOS()

      // [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Was the tamper evident seal in place on the cassette rack?.' 
      regressionInfusionSteps.productReceiptChecklist.nothingSelectedForSealInPlaceNeg()

      // [NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Was the tamper evident seal in place on the cassette rack?' 
      regressionInfusionSteps.productReceiptChecklist.noSelectedForSealInPlaceNeg()

        // [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Was the tamper evident seal in place on the cassette rack?' 
      regressionInfusionSteps.productReceiptChecklist.reasonFilledForSealInPlacePos()

      // [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Was there a temperature out-of-range alarm received? If yes, contact Janssen immediately and follow instructions in the CTPPM.' 
      regressionInfusionSteps.productReceiptChecklist.nothingSelectedForTempRangeNeg()

      // [NEG] Verify if 'next' button is disabled if 'Yes' selected for toggle ' Was there a temperature out-of-range alarm received? If yes, contact Janssen immediately and follow instructions in the CTPPM.' 
      regressionInfusionSteps.productReceiptChecklist.noSelectedForTempRangeNeg()

      // [POS]Verify if 'next' button is Enabled after filling reason for Yes toggle 'Was there a temperature out-of-range alarm received? If yes, contact Janssen immediately and follow instructions in the CTPPM' 
      regressionInfusionSteps.productReceiptChecklist.reasonFilledForTempRangedPos()

      // [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Is each bag and cassette in the expected condition (e.g. no cassette damage, label adhered)? If bag(s) or cassette(s) is not in expected condition, please contact Janssen for ' 
      regressionInfusionSteps.productReceiptChecklist.nothingSelectedForExpecCondtionNeg()

      // [NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Is each bag and cassette in the expected condition (e.g. no cassette damage, label adhered)? If bag(s) or cassette(s) is not in expected condition, please contact Janssen for f.' 
      regressionInfusionSteps.productReceiptChecklist.noSelectedForExpecCondtionNeg()

      // [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Is each bag and cassette in the expected condition (e.g. no cassette damage, label adhered)? If bag(s) or cassette(s) is not in expected condition, please contact Janssen fo' 
      regressionInfusionSteps.productReceiptChecklist.reasonFilledForForExpecCondtionPos()

      // [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Has the investigational product cassette(s) been placed into storage as per the cassette label: Store at ≤-120°C (-184°F), vapor phase of liquid nitrogen? This should be done.' 
      regressionInfusionSteps.productReceiptChecklist.nothingSelectedForStorageNeg()

      // [NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Has the investigational product cassette(s) been placed into storage as per the cassette label: Store at ≤-120°C (-184°F), vapor phase of liquid nitrogen? This should be done ev' 
      regressionInfusionSteps.productReceiptChecklist.noSelectedForStorageNeg()

      // [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Has the investigational product cassette(s) been placed into storage as per the cassette label: Store at ≤-120°C (-184°F), vapor phase of liquid nitrogen? This should be don' 
      regressionInfusionSteps.productReceiptChecklist.reasonFilledForStoragePos()

   //   [POS] Verify that the data is saving after clicking "Save and Close" button.  
      regressionInfusionSteps.productReceiptChecklist.posSaveAndCloseButtonCheck(scope)
   })

   it('Product Receipt Summary', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
      regressionCommonHappyPath.commonSatelliteHappyPath(scope);
      regressionCommonHappyPath.commonManufacturingHappyPath(scope,therapy)
      regressionInfusionSteps.productReceiptSummary.previousHappyPathSteps()

      // [POS]Verify if the next button remains disabled until the user signs the document 
      regressionInfusionSteps.productReceiptSummary.nextButtonPos()
   })
});