import regressionOrderingSteps from '../../../utils/Regression_steps/CCCP_IS_RegressionPath/ordering_steps'
import regressionCollectionSteps from '../../../utils/Regression_steps/CCCP_IS_RegressionPath/collection_steps'
import regressionManufacturingSteps from '../../../utils/Regression_steps/CCCP_IS_RegressionPath/manufacturing_steps'
import regressionSatelliteSteps from '../../../utils/Regression_steps/CCCP_IS_RegressionPath/satelite_lab_steps'
import regressionInfusionSteps from '../../../utils/Regression_steps/CCCP_IS_RegressionPath/infusion_steps'
import regressionCommonHappyPath from '../../../utils/Regression_steps/CCCP_IS_RegressionPath/common_happyPath_steps'
import order_steps from '../../../utils/HappyPath_steps/CCCP_IS_HappyPath/ordering_steps'
import therapies from '../../../fixtures/therapy.json'
import input from '../../../fixtures/inputs.json'

context('CCCP IS Therapy Satellite Regression Path', () => {
    beforeEach(() => {
      cy.clearCookies();
      order_steps.orderingData(scope);
      regressionCommonHappyPath.commonAliases();
    });

    const scope = {};
    const therapy = therapies.cccp_is
    

    it('Check Statuses Of Satellite Module', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope,therapy);

      //CCCP-IS- SatelliteLab:Check the status of each step for SatelliteLab module
      regressionSatelliteSteps.checkStatusesOfSatelliteLabModule(scope,therapy);
    });
  
    it('Sat Lab Collection Summary', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope,therapy);

      // [POS] Verify if the data is retained upon clicking 'Save & Close' button.
      regressionSatelliteSteps.satLabCollectionSummary.posSaveAndClose(scope);
     
    });
    it('Sat Lab Verify Shipment', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope,therapy);
      regressionSatelliteSteps.satLabVerifyShipment.previousHappyPathSteps(scope,therapy);

      // [NEG] Verify "Scan or enter the COI Number found on the packing insert" input field with invalid inputs
      regressionSatelliteSteps.satLabVerifyShipment.coiBagIdentifierOnBagNeg();

      // [POS] Verify if the data is retained upon clicking 'Save & Close' button.
      regressionSatelliteSteps.satLabVerifyShipment.saveAndCloseButtonPositive();

      // [POS] Verify if the 'Back' link is working.
      regressionSatelliteSteps.satLabVerifyShipment.retainsValueUponClickingNext();
      
    });
    

    it('Sat Lab Shipment Checklist', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope,therapy);
      regressionSatelliteSteps.satLabShipmentChecklist.previousHappyPathSteps('satellite-lab', '-cccp-is',scope);

      // [NEG] Verify if the 'Next' button is disabled until the bag identifier for"Scan the bag identifier" input field is not confirmed.
      regressionSatelliteSteps.satLabShipmentChecklist.coiBagIdentifierOnBagNeg();

      // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Does the downloaded temperature data..." and all other questions are answered.
      regressionSatelliteSteps.satLabShipmentChecklist.toggleEmptyDownloadTemp();

      // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the apheresis bag inside..." and all other questions are answered.
      regressionSatelliteSteps.satLabShipmentChecklist.toggleEmptyApheresisBag();

      // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Will the apheresis bag be kept..." and all other questions are answered.
      regressionSatelliteSteps.satLabShipmentChecklist.toggleEmptyApheresisTwo();

      // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Does the downloaded temperature data..." and all other questions are answered.
      regressionSatelliteSteps.satLabShipmentChecklist.toggleDownloadTempNeg();

      // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the apheresis bag inside..." and all other questions are answered.
      regressionSatelliteSteps.satLabShipmentChecklist.toggleApheresisBagNeg();

      // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Will the apheresis bag be kept..." and all other questions are answered.
      regressionSatelliteSteps.satLabShipmentChecklist.toggleApheresisTwoNeg();

      // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Will the apheresis bag be kept..." and 'Details' are entered.
      regressionSatelliteSteps.satLabShipmentChecklist.toggleApheresisTwoPos();

      // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the apheresis bag inside..." and 'Details' are entered.
      regressionSatelliteSteps.satLabShipmentChecklist.toggleApheresisBagPos();

      // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Does the downloaded temperature data..." and 'Details' are entered.
      regressionSatelliteSteps.satLabShipmentChecklist.toggleDownloadTempPos();

      // [POS] Verify if the data is retained upon clicking 'Save & Close' button.
      regressionSatelliteSteps.satLabShipmentChecklist.saveAndClosePos();

      // [POS] Verify if the 'Back' link is working.
      regressionSatelliteSteps.satLabShipmentChecklist.retainsValueUponClickingNext();

     
    });
     

    it('Sat Lab Shipment Checklist Summary', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
     regressionCommonHappyPath.commonCollectionHappyPath(scope,therapy)
     regressionSatelliteSteps.shipmentReceiptChecklistSummary.previousHappyPathSteps(scope, '-cccp-is','satellite-lab')

     //[POS] Verify if the 'Reason for change' pop-up is appeared on clicking 'Edit' button next to "Details Of Shipment' section.
     regressionSatelliteSteps.shipmentReceiptChecklistSummary.verifyEditPos()

     //[POS] Verify if the 'Next' button is enabled after verifier's signature is signed.
     regressionSatelliteSteps.shipmentReceiptChecklistSummary.verifySignaturePos()

     //[POS] Verify if the data is retained after clicking 'Save & Close' button.
     regressionSatelliteSteps.shipmentReceiptChecklistSummary.saveAndClosePos()
     
    });

    
    it('Sat Lab Cryopreservation', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope,therapy)
      regressionSatelliteSteps.cryopreservation.previousHappyPathSteps(scope, '-cccp-is','satellite-lab', input)

        // [NEG] Verify if the 'Next' button is disabled until the 'Number of bags formulated for Cryopreservation' input field is left empty. 
      regressionSatelliteSteps.cryopreservation.verifyNextButtonNeg()

        // [POS] Verify if the data is retained after clicking 'Save & Close' button. 
      regressionSatelliteSteps.cryopreservation.verifySaveAndClose()

    });
  
     
    it('Sat Lab Cryopreservation Labels', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope,therapy)
      regressionSatelliteSteps.satLabCryopreservationLabels.previousHappyPathSteps(scope, '-cccp-is','satellite-lab', input)

      //[NEG] Verify  'Scan or enter the COI bag identifier on Cassette 1' with invalid data.
      regressionSatelliteSteps.satLabCryopreservationLabels.scanCassetteNeg()

      //[NEG] Verify  'Scan or enter the COI bag identifier on Bag 1' with incorrect data.
      regressionSatelliteSteps.satLabCryopreservationLabels.scanBagNeg()

      //[NEG]  Verify if the 'Next'  button is disabled until  the checkbox for  "Verify labels have been attached to all collection bags" is not checked and all other details are filled.
      regressionSatelliteSteps.satLabCryopreservationLabels.isVerifyLabelsNeg()

      //[NEG]  Verify if the 'Next'  button is disabled until  the checkbox for  "Confirm labels are printed successfully" is not checked and all other details are filled.
      regressionSatelliteSteps.satLabCryopreservationLabels.isConfirmLabelsNeg()

      //[POS] Verify if the signature block appears after clicking 'Next' button on Cryopreservation Labels page and also verifies confirmer's signature.
      regressionSatelliteSteps.satLabCryopreservationLabels.verifySignature()

      //[POS] Verify if the data is retained after clicking 'Save & Close' button. 
      regressionSatelliteSteps.satLabCryopreservationLabels.verifySaveAndClose()

      //[POS] Verify if the 'Back' link is working.
      regressionSatelliteSteps.satLabCryopreservationLabels.retainsValueUponClickingBack()
      
    });
    
     
    it('Sat Lab Bag Storage', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope,therapy);
      regressionSatelliteSteps.satLabBagStorage.previousHappyPathSteps(scope, '-cccp-is','satellite-lab',input);

      // [NEG] Verify the "Scan or Enter the COI-based bag identifier for moving bag to storage (Bag 1)" input field with invalid data
      regressionSatelliteSteps.satLabBagStorage.coiBagIdentifierOnBagNeg();

      // [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionSatelliteSteps.satLabBagStorage.saveAndCloseButtonPositive();

      // [POS] Verify if the 'Back' link is working.
      regressionSatelliteSteps.satLabBagStorage.retainsValueUponClickingNext();
     
    });
  
     
    it('Sat Lab Cryopreservation Data', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope,therapy);
      regressionSatelliteSteps.cryopreservationData.previousHappyPathSteps(scope, '-cccp-is','satellite-lab',input);

      // [NEG] Verify the  "Scan or enter the bag identifier prior to entering bag details (Bag 1)" with invalid inputs
      regressionSatelliteSteps.cryopreservationData.coiBagIdentifierOnBagNeg();

      // [NEG] Verify if the 'Next' button is disabled until the "Start Time of Cryopreservation (24h)" input field is left empty and all other details are filled.
      regressionSatelliteSteps.cryopreservationData.cryoTimeNeg();

      // [NEG] Verify if the 'Next' button is disabled until the "Total MNC Cells (in e^9)" input field is left empty and all other details are filled.
      regressionSatelliteSteps.cryopreservationData.totalCellFieldNeg();

      // [NEG] Verify if the 'Next' button is disabled until the "Product Volume (Cells + CS10) in mL" input field is left empty and all other details are filled.
      regressionSatelliteSteps.cryopreservationData.productVolumeNeg();

      // [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionSatelliteSteps.cryopreservationData.saveAndCloseButtonPositive();

      // [POS] Verify if the 'Back' link is working.
      regressionSatelliteSteps.cryopreservationData.retainsValueUponClickingNext();

     
    });

    
    it('Sat Lab Cryopreservation Summary', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope,therapy);
      regressionSatelliteSteps.satLabCryopreservationSummary.previousHappyPathSteps(scope, '-cccp-is','satellite-lab',input);

      // [POS] Verify if 'Edit' button next to 'Cryopreservation Data' section is working.
      regressionSatelliteSteps.satLabCryopreservationSummary.posEditButton();

      // [POS] Verify if the next button remains disabled until the user signs the document and enabled after signs the document
      regressionSatelliteSteps.satLabCryopreservationSummary.checkNextButtonWithAndWithoutSig();
     
    });

    
    it('Sat Lab Print Shipper Labels', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope,therapy);
      regressionSatelliteSteps.satLabPrintShipperLabels.previousHappyPathSteps(scope, '-cccp-is','satellite-lab',input);

      // [POS] Verify if the 'Print Labels' button is clickable.
      regressionSatelliteSteps.satLabPrintShipperLabels.printLablesClickable();

      // [NEG] Verify if the 'Next' button is disabled until the "Confirm labels are printed successfully" check box is not checked.
      regressionSatelliteSteps.satLabPrintShipperLabels.confirmPrintLabelNeg();

       // [POS] Verify if the data is retained after clicking 'Save & Close' button.
       regressionSatelliteSteps.satLabPrintShipperLabels.saveAndClosePos();

    });
   
    it('Sat Lab Bag Selection', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope,therapy);
      regressionSatelliteSteps.bagSelection.previousHappyPathSteps(scope, '-cccp-is','satellite-lab',input);

      // [NEG] Verify if the 'Next' button is disabled when any of the 'SHIP' or 'DO NOT SHIP' button on the bag selection page is not selected.
      regressionSatelliteSteps.bagSelection.negNoInputForBagSelection();

      // [NEG] Verify if the 'Next' button is disabled when 'Do Not Ship' button on the bag selection page is selected.
      regressionSatelliteSteps.bagSelection.negDoNotShipBag();

      // [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionSatelliteSteps.bagSelection.saveAndClosePos();

     });
   

    it('Sat Lab Transfer Product To Shipper', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope,therapy);
      regressionSatelliteSteps.satLabTransferProductToShipper.previousHappyPathSteps(scope, '-cccp-is','satellite-lab',input);
      //[NEG] Verify if the next button is disabled when 'Scan or enter the COI Bag Identifier on the cassette label (Bag 1)' field is empty
      regressionSatelliteSteps.satLabTransferProductToShipper.negBagId()

      //	[NEG] Verify if the next button is disabled when 'Scan or enter the COI number on the LN2 shipper label.' is empty 
      regressionSatelliteSteps.satLabTransferProductToShipper.negCoi()

      // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the shipping container case intact?..." and all other questions are answered.
      regressionSatelliteSteps.satLabTransferProductToShipper.negToggleCaseIntactEmpty()

      // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the shipping container case intact?..." and all other questions are answered.
      regressionSatelliteSteps.satLabTransferProductToShipper.negToggleCaseIntact()

      // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the shipping container case intact?..." and 'Details' are entered.
      regressionSatelliteSteps.satLabTransferProductToShipper.posToggleCaseIntact()

      // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Was there a temperature out-of-range..." and all other questions are answered.
      regressionSatelliteSteps.satLabTransferProductToShipper.negToggleTempRangeEmpty()

      // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Was there a temperature out-of-range..." and all other questions are answered.
      regressionSatelliteSteps.satLabTransferProductToShipper.negToggleTempRange()

      // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Was there a temperature out-of-range..." and 'Details' are entered.
      regressionSatelliteSteps.satLabTransferProductToShipper.posToggleTempRange()

      // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the red wire tamper seal..." and all other questions are answered.
      regressionSatelliteSteps.satLabTransferProductToShipper.negIsredTamperSealEmpty()

      // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the red wire tamper seal..." and all other questions are answered.
      regressionSatelliteSteps.satLabTransferProductToShipper.negIsredTamperSeal()

      // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the red wire tamper seal..." and 'Details' are entered.
      regressionSatelliteSteps.satLabTransferProductToShipper.posIsredTamperSeal()

      // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Confirm cryopreserved apheresis product..." and all other questions are answered.
      regressionSatelliteSteps.satLabTransferProductToShipper.negToggleProductsStatusEmpty()

      // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Confirm cryopreserved apheresis product..." and all other questions are answered.
      regressionSatelliteSteps.satLabTransferProductToShipper.negToggleProductsStatus()
  
      // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Confirm cryopreserved apheresis product..." and 'Details' are entered.
      regressionSatelliteSteps.satLabTransferProductToShipper.posToggleProductsStatus()

      //[POS] Verify that the data is retained on clicking 'Save & Close' button
      regressionSatelliteSteps.satLabTransferProductToShipper.posSaveAndClose()

      // [POS] Verify if the 'Back' link is working.
      regressionSatelliteSteps.satLabTransferProductToShipper.retainsValueUponClickingNext();
     
     });
    

    it('Sat Lab Shipping Checklist', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope,therapy);
      regressionSatelliteSteps.SatLabShippingChecklist.previousHappyPathSteps(scope, '-cccp-is','satellite-lab',input);

      //[NEG] Verify if the 'Next' button is disabled until air waybill number for "Please enter air waybill number for shipment" input field is not confirmed. 
    regressionSatelliteSteps.SatLabShippingChecklist.negAirwayBillNumber()

    //[NEG] Verify if the 'Next' button is disabled until "Please enter the last 4 digits of the EVO-IS Number on the LN2 shipper lid" input field is left empty. 
    regressionSatelliteSteps.SatLabShippingChecklist.negInvalidEvo(scope)

    //[NEG] Verify if the 'Next' button is disabled until "Please enter the Tamper Seal Number on LN2 shipper lid" input field is left empty. 
    regressionSatelliteSteps.SatLabShippingChecklist.negTamperSealEmpty()
   
    // 	[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Does the EVO-IS Number listed on
    regressionSatelliteSteps.SatLabShippingChecklist.negEvoNumberListedOnAirWaybillNoSelection()

     //	[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Does the EVO-IS Number listed on the Air Waybill..." and all other questions are answered. 		
    regressionSatelliteSteps.SatLabShippingChecklist.negEvoNumberListedOnAirWaybillNo()

   //	[POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question "Does the EVO-IS Number listed on the Air Waybill..." and 'Details' are entered.
    regressionSatelliteSteps.SatLabShippingChecklist.posEvoNumberListedOnAirWaybillNoWithDetail()

     //[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the red wire tamper seal in place..." and all other questions are answered. 			
     regressionSatelliteSteps.SatLabShippingChecklist.negRedWireTamperSealNoSelection()

    //[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the red wire tamper seal in place..." and all other questi
    regressionSatelliteSteps.SatLabShippingChecklist.negRedWireTamperSealNo()
    
    //	[POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question "Is the red wire tamper seal in place..." and 'Details' are entered. 	
    regressionSatelliteSteps.SatLabShippingChecklist.posRedWireTamperSealNoWithDetail()

    //	[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Does the Tamper Seal Number listed on the Air Waybill..." and all other questions are answered. 			
    regressionSatelliteSteps.SatLabShippingChecklist.negTamperSealNumberListedOnAirWaybillNo()

    //	[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Does the Tamper Seal Number listed on the Air Waybill..." and all other questions are answered. 
    regressionSatelliteSteps.SatLabShippingChecklist.negnegTamperSealNumberListedOnAirWaybillNoSelection()

    //[POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question "Does the Tamper Seal Number listed on the Air Waybill..." and 'Details' are entered. 			
    regressionSatelliteSteps.SatLabShippingChecklist.posTamperSealNumberListedOnAirWaybillNoWithDetail()

      //	[POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question "Does the Tamper Seal Number listed on the Air Waybill..." and 'Details' are entered. 				
    regressionSatelliteSteps.SatLabShippingChecklist.negShipperLabelIncludedWithShipperNo()

     // //[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the shipper label(s) included with the shipper?" and all other questions are answered. 
     regressionSatelliteSteps.SatLabShippingChecklist.negShipperLabelIncludedWithShipperNoSelection()

    //	[POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question "Is the shipper label(s) included with the shipper?" and 'Details' are entered. 			
    regressionSatelliteSteps.SatLabShippingChecklist.posShipperLabelIncludedWithShipperNoWithDetail()
   
    //	[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the Consignee kit pouch included with the shipper?" and all other questions are answered. 		
    regressionSatelliteSteps.SatLabShippingChecklist.negConsigneeKitPouchIncludedNo()

     //[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the shipper label(s) included with the shipper?" and all other questions are answered. 			
     regressionSatelliteSteps.SatLabShippingChecklist.negConsigneeKitPouchIncludedNoSelection()

    //	[POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question "Is the Consignee kit pouch included with the shipper?" and 'Details' are entered. 			
    regressionSatelliteSteps.SatLabShippingChecklist.posConsigneeKitPouchIncludedNoWithDetails()
   
    //	[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the shipping container secured?" and all other questions are answered. 	
    regressionSatelliteSteps.SatLabShippingChecklist.negShippingContainerSecuredNo()

    //[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the shipping container secured?" and all other questions are answered. 	
    regressionSatelliteSteps.SatLabShippingChecklist.negShippingContainerSecuredNoSelection()

    //	[POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question "Is the shipping container secured?" and 'Details' are entered. 	
    regressionSatelliteSteps.SatLabShippingChecklist.posShippingContainerSecuredNoWithDetail()

    //	[POS] Verify if the data is retained after clicking 'Save & Close' button. 
    regressionSatelliteSteps.SatLabShippingChecklist.posDataOnSaveAndClose()

   //[POS] Verify if the 'Back' link is working.
    regressionSatelliteSteps.SatLabShippingChecklist.posDataOnBackAndNext()
     });
  
    
    it('Sat Shipping Summary Verify', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope,therapy);
      regressionSatelliteSteps.SatShippingSummaryVerify.previousHappyPathSteps(scope, '-cccp-is','satellite-lab',input);

      //[POS] Verify if the details of 'Transfer Product To Shipper' can edited by clicking on 'Edit' button.
    regressionSatelliteSteps.SatShippingSummaryVerify.posEditTransferProductToShipper()

    //	[POS] Verify if the details of 'Condition Of Shipment' can edited by clicking on 'Edit' button.	
    regressionSatelliteSteps.SatShippingSummaryVerify.posEditConditionOfShipment()

    //[NEG] Verify if the 'Done' button is disabled after confirmer's signature is signed. 		
    regressionSatelliteSteps.SatShippingSummaryVerify.negNextButtonOnConfirmerSign()

    //	[POS] Verify if the 'Done' button is enabled after verifier's signature is signed. 		
    regressionSatelliteSteps.SatShippingSummaryVerify.posDoneButtonOnVerifierSign()

    //	[POS] Verify if the data is retained after clicking 'Save & Close' button. 
    regressionSatelliteSteps.SatShippingSummaryVerify.posDataOnSaveAndClose()
    });
  });
