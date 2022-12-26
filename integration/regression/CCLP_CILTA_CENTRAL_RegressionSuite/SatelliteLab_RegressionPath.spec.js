import ordering_steps from '../../../utils/HappyPath_steps/CCLP_CILTA_CENTRAL_HappyPath/ordering_steps_cilta';
import commonHappyPath from "../../../utils/Regression_steps/CCLP_CILTA_CENTRAL_RegressionPath/common_happyPath_steps"
import regressionSatelliteLabSteps from '../../../utils/Regression_steps/CCLP_CILTA_CENTRAL_RegressionPath/satelite_lab_steps_cilta'
import therapies from '../../../fixtures/therapy.json'
import input from '../../../fixtures/inputs.json';



context('CCLP US Therapy Ordering Regression Path', () => {
  const scope = {};
  const therapy = therapies.cclp_cilta
  const region = 'US';

  beforeEach(() => {
    cy.clearCookies();
    ordering_steps.orderingData(scope);
    commonHappyPath.commonAliases();
  });

  it('Verify Shipper', () => {
    commonHappyPath.commonOrderingHappyPath(scope,therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    regressionSatelliteLabSteps.verifyShipper.previousHappyPathSteps();

    //C25609 [POS] Verify the 'Next' button without entering data in "Scan or enter the COI Number found on the packing insert" field.
    regressionSatelliteLabSteps.verifyShipper.coiNumberPositive();

    //C25621 [NEG] Verify "Scan or enter the COI Number found on the packing insert" field with negative data.
    regressionSatelliteLabSteps.verifyShipper.coiNumberNegative();

    //C25623 [POS] Verify if the data is retained upon clicking 'Save & Close' button.
    regressionSatelliteLabSteps.verifyShipper.dataSavingWithsaveAndClosePositive();

    //C38212 [POS] Verify if the data is retained upon clicking 'Back' button from next step.
    regressionSatelliteLabSteps.verifyShipper.dataSavingWithBackButtonPositive();
  });

  it('Shipment Receipt Checklist', () => {
    commonHappyPath.commonOrderingHappyPath(scope,therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    regressionSatelliteLabSteps.shipmentReceiptChecklist.previousHappyPathSteps(therapy);

    //C38576 [POS] Verify if the 'Next' button is disabled until the  'Scan or enter the DIN/SEC-DIS or Apheresis bag identifier.' is not confirmed.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.scanAndEnterPositive();

    //C38577 [POS] Verify if the 'Next' button is disabled after giving negative data in 'Scan or enter the DIN/SEC-DIS or Apheresis bag identifier.' is not confirmed.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.scanAndEnterNegative();

    //C38578 [POS] Verify if the 'Next' button is enabled with or without entering data in  'List the serial number of the temperature monitoring device (if applicable to your country): (Optional)'  field.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.tempMonitoringPositive(input.day1Bag1Udn);

    //C38579 [POS] Verify if the 'Next' button is enabled with or without entering data in  "List the security seal number on the shipper (if applicable to your country):  (Optional)"  field.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.securitySealNoPositive();

    //C38580 [POS] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Does the downloaded temperature data..." and all other questions are answered.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.doesTempConformTogglePositive();

    //C38581 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Does the downloaded temperature data..." and all other questions are answered.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.doesTempConformToggleNegative();

    //C38582 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Does the downloaded temperature data..." and 'Details' are entered.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.doesTempConformToggleWithDataPositive();

    //C38583 [POS] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the apheresis bag inside..." and all other questions are answered.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.apheresisBagCondTogglePositive();

    //C38584 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the apheresis bag inside..." and all other questions are answered.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.apheresisBagCondToggleNegative();

    //C38585 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the apheresis bag inside..." and 'Details' are entered.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.apheresisBagCondToggleWithDataPositive();

    //C38586 [POS] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Will the apheresis bag be kept..." and all other questions are answered.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.coldShipperTogglePositive();

    //C38587 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Will the apheresis bag be kept..." and all other questions are answered.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.coldShipperToggleNegative();

    //C38588 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Will the apheresis bag be kept..." and 'Details' are entered.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.coldShipperToggleWithDataPositive();

    //C38589 [POS] Verify if the 'Next' button is enabled with or without entering data in  "Please enter additional comments about the receipt.  (Optional)"  field.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.additionalCommentsPositive();

    //C38590 [POS] Verify if the data is retained after clicking 'Save & Close' button.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.dataSavingWithSaveAndClosePositive();

    //C38591 [POS] Verify if the data is saving after clicking back button from next step.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.dataSavingWithBackButtonPositive();

  }),

  it('Shipment Receipt Checklist Summary', () => {
    commonHappyPath.commonOrderingHappyPath(scope,therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    regressionSatelliteLabSteps.shipmentReceiptChecklistSummary.previousHappyPathSteps(therapy);

    //C38357 [POS] Verify that the 'Next' button should be disabled after the "Confirmer" signature.
    regressionSatelliteLabSteps.shipmentReceiptChecklistSummary.checkNextButtonWithoutSignaturePositive();

    //C38358 [POS] Verify that the data gets saved after changing data by clicking on 'Edit' button next to "Details Of Shipment' section.
    regressionSatelliteLabSteps.shipmentReceiptChecklistSummary.detailsOfShipmentEditButtonPositive();

    //C38359 [POS] Verify if the 'Next' button is enabled after verifier's signature is signed.
    regressionSatelliteLabSteps.shipmentReceiptChecklistSummary.checkVerifierSignature();
  });

  it('Cryopreservation Bags', () => {
    commonHappyPath.commonOrderingHappyPath(scope,therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    regressionSatelliteLabSteps.cryopreservatioBags.previousHappyPathSteps(therapy);

    // C25747 [NEG] Verify that the 'Next' button is disabled on Cryopreservation (Confirm number of bags) Page.
    regressionSatelliteLabSteps.cryopreservatioBags.confirmNumberOfBags();  
      
    //C25748  [POS] Verify that the 'Next' button is disabled until you select the number of bags.  
    regressionSatelliteLabSteps.cryopreservatioBags.selectNumberOfBags(input.itemCount);      

    // C25749 [POS] Verify if the data is retained upon clicking 'Save & Close' button.
    regressionSatelliteLabSteps.cryopreservatioBags.dataSavingWithsaveAndClosePositive();   
  
  });

  it('Bag Storage', () => {
    commonHappyPath.commonOrderingHappyPath(scope,therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    regressionSatelliteLabSteps.bagStorage.previousHappyPathSteps(scope,therapy)

    //[C25868] [NEG] Verify the 'Next' button should be disabled on the Bag Storage page.
    regressionSatelliteLabSteps.bagStorage.verifyNextButtonStatus()

    //[C25869] [POS] Verify 'Next' button is disabled until you enter the COI Number.
    regressionSatelliteLabSteps.bagStorage.coiNumber()

    //[C25870] [POS] Verify the data is retained upon clicking 'Save & Close' button.
    regressionSatelliteLabSteps.bagStorage.saveAndClose()

    //[C38273] [POS] Verify that the selected data should be saved.
    regressionSatelliteLabSteps.bagStorage.backButton()
  });

  it('Cryopreservation Summary', () => {
    commonHappyPath.commonOrderingHappyPath(scope,therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    regressionSatelliteLabSteps.cryopreservaationSummary.previousHappyPathSteps(scope,therapy)

    //[[C25891] [POS] Verify that the 'Next' button is disabled on the 'Cryopreservation Summary' Page.
    //[C25892] [POS] Verify that the 'Next button is disabled until signature.
    regressionSatelliteLabSteps.cryopreservaationSummary.verifyNextButton()

    //[C25896] [POS] Verify the data should be retained upon clicking the 'Save & Close' button.
    regressionSatelliteLabSteps.cryopreservaationSummary.saveAndClose()

    //[C25893] [POS] Verify the 'Edit ' button for the 'Cryopreservation Summary' page works.
    regressionSatelliteLabSteps.cryopreservaationSummary.verifyEditButton()

  });
                  
  it('Print Packing Inserts', () => {
    commonHappyPath.commonOrderingHappyPath(scope,therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    regressionSatelliteLabSteps.printPackingInserts.previousHappyPathSteps(scope,therapy)

    //C25899 [POS] Verify that the 'Print Labels' button on  Print Packing inserts page works.
    //C25900[NEG] Verify that 'Next' button is disabled if checkbox is unticked for 'Confirm packing inserts are printed successfully'
    regressionSatelliteLabSteps.printPackingInserts.verifyNextButton()

    //C25901 [POS] Verify that the data is retained upon clicking the 'Save & Close' button.
    //C25902 [POS] Verify that the 'Next ' button is disabled until you tick the checkbox..
    regressionSatelliteLabSteps.printPackingInserts.checkBox()

    //C38274 [POS] Verify that the selected data should be saved.
    regressionSatelliteLabSteps.printPackingInserts.backButton()

  });

  it('Bag Selection  ', () => {
    commonHappyPath.commonOrderingHappyPath(scope,therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    regressionSatelliteLabSteps.bagSelection.previousHappyPathSteps(therapy);
  
    // C25903 [POS] Verify that 'Next' button is disabled on Bag Selection page.      
    regressionSatelliteLabSteps.bagSelection.bagSelectionPage();   
  
    // C25904 [NEG] Verify 'Next' button is disabled when you click on 'DO NOT SHIP' toggle.
    regressionSatelliteLabSteps.bagSelection.doNotShip();   
        
    // C25905 [POS] Verify 'Next' button should be disabled until you select 'Ship' toggle. 
    regressionSatelliteLabSteps.bagSelection.selectShipToggle();   
      
    // C25749 [POS] Verify if the data is retained upon clicking 'Save & Close' button.
    regressionSatelliteLabSteps.bagSelection.dataSavingWithsaveAndClosePositive();   
  
  });
  it('Cryopreservation Labels', () => {
    commonHappyPath.commonOrderingHappyPath(scope,therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    regressionSatelliteLabSteps.cryopreservationLabels.previousHappyPathSteps(therapy);

    // C25750 [NEG] Verify that 'Next' button is disabled on cryopreservation labels page. 
    regressionSatelliteLabSteps.cryopreservationLabels.cryopreservationLabelsPage();

    // C25753 [POS] Verify that 'Print Labels' button works.  
    regressionSatelliteLabSteps.cryopreservationLabels.printLabelsButton();

    // C25864 [NEG] Verify 'Next' button is disabled if COI is not entered for 'Scan or enter the COI bag identifier on Bag 1.'.      
    regressionSatelliteLabSteps.cryopreservationLabels.checkCassetteCoi()

    // C25863 [NEG] Verify 'Next' button is disabled if COI is not entered for 'Scan or enter the COI bag identifier on Cassette 1.'.   
    regressionSatelliteLabSteps.cryopreservationLabels.checkBagCoi();

    // C25754 [NEG] Verify 'Next' button is disbaled if checkbox for 'Confirm labels are printed successfully' is unticked.   
    regressionSatelliteLabSteps.cryopreservationLabels.confirmLabelsUnticked();

    // C25862 [NEG] Verify 'Next' button is disabled if checkbox for 'Verify labels have been attached to all collection bags' is unticked.     
    regressionSatelliteLabSteps.cryopreservationLabels.allCollectionBags();

    // C25865 [POS] Verify if 'Next' button is enabled until COIs are filled and Checkboxes are ticked. 
    regressionSatelliteLabSteps.cryopreservationLabels.filledAndTicked();

    // C25866 [POS] Verify if data is retained upon clicking 'Save & Close' button.
    regressionSatelliteLabSteps.cryopreservationLabels.dataSavingWithsaveAndClosePositive();
    
 });

  it('Sat Lab Transfer Product To Shipper', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy)
      commonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteLabSteps.satLabTransferProductToShipper.previousHappyPathSteps(therapy);
      //[[NEG] Verify that 'Next' button is disabled if 'Scan or enter the COI number on the packing insert.' is not filled.
      regressionSatelliteLabSteps.satLabTransferProductToShipper.negBagId()

      //	[NEG] Verify that 'Next' button is disabled if 'Scan or enter the COI Bag Identifier on the cassette label (Bag 1)' is not filled.
      regressionSatelliteLabSteps.satLabTransferProductToShipper.negCoi()

      // [NEG] Verify that 'Next' button is disabled if 'No' toggle is selected for 'Is the shipping container case intact? ...' and 'details' box is not filled.
      regressionSatelliteLabSteps.satLabTransferProductToShipper.negToggleCaseIntactEmpty()

      // [NEG] Verify that 'Next' button is disabled if none of the toggle is selected for 'Is the shipping container case intact? ...'.
      regressionSatelliteLabSteps.satLabTransferProductToShipper.negToggleCaseIntact()

      // [POS] Verify that 'Next' button is enabled if 'No' toggle is selected for 'Is the shipping container case intact? ...' and 'details' box is filled.
      regressionSatelliteLabSteps.satLabTransferProductToShipper.posToggleCaseIntact()

      // [NEG] Verify that 'Next' button is disabled if none of the toggle is selected for 'Was there a temperature out-of-range alarm received? ...'.
      regressionSatelliteLabSteps.satLabTransferProductToShipper.negToggleTempRangeEmpty()

      // [NEG] Verify that 'Next' button is disabled if 'Yes' toggle is selected for 'Was there a temperature out-of-range alarm received? ...'. and 'details' box is not filled
      regressionSatelliteLabSteps.satLabTransferProductToShipper.negToggleTempRange()

      // [POS] Verify that 'Next' button is enabled if 'Yes' toggle is selected for 'Was there a temperature out-of-range alarm received? ...'.and 'details' box is filled.
      regressionSatelliteLabSteps.satLabTransferProductToShipper.posToggleTempRange()


      // [NEG] Verify that 'Next' button is disabled if none of the toggle is selected for Confirm cryopreserved apheresis product cassette ...'.
      regressionSatelliteLabSteps.satLabTransferProductToShipper.negIsredTamperSealEmpty()

      // [NEG] Verify that 'Next' button is disabled if 'No' toggle is selected for Confirm cryopreserved apheresis product cassette ...' and details box is not filled.
      regressionSatelliteLabSteps.satLabTransferProductToShipper.negIsredTamperSeal()

      // [POS] Verify that 'Next' button is enabled if 'No' toggle is selected for Confirm cryopreserved apheresis product cassette ...' and 'details box is filled'.
      regressionSatelliteLabSteps.satLabTransferProductToShipper.posIsredTamperSeal()

      // [NEG] Verify that 'Next' button is disabled if none of the toggle is selected for 'Is the red wire tamper seal labeled "RACK" in place on the cassette rack?'.
      regressionSatelliteLabSteps.satLabTransferProductToShipper.negToggleProductsStatusEmpty()

      // [NEG] Verify that 'Next' button is disabled if 'No' toggle is selected for 'Is the red wire tamper seal labeled "RACK" in place on the cassette rack?' and details box is not filled.
      regressionSatelliteLabSteps.satLabTransferProductToShipper.negToggleProductsStatus()
  
      // [POS] Verify that 'Next' button is enabled if 'No' toggle is selected for 'Is the red wire tamper seal labeled "RACK" in place on the cassette rack?' and 'details' box is filled.
      regressionSatelliteLabSteps.satLabTransferProductToShipper.posToggleProductsStatus()

      //[POS] Verify that the data is retained on clicking 'Save & Close' button
      regressionSatelliteLabSteps.satLabTransferProductToShipper.posSaveAndClose()

      // [POS] Verify if the 'Back' link is working.
      regressionSatelliteLabSteps.satLabTransferProductToShipper.retainsValueUponClickingNext();
     
  });
  it('Sat Lab Shipping Checklist', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy)
      commonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteLabSteps.SatLabShippingChecklist.previousHappyPathSteps(therapy);

    // C25960	[NEG] Verify that 'Next' button is disabled if 'Please enter air waybill number for shipment..' is not filled. 
    regressionSatelliteLabSteps.SatLabShippingChecklist.negAirwayBillNumber()

    // C25961	[NEG] Verify that 'Next' button is disabled if 'Please enter the last 4 digits of the EVO-IS Number on the LN2 shipper lid..' is not filled.
    regressionSatelliteLabSteps.SatLabShippingChecklist.negInvalidEvo(scope)

    //C26215	[NEG] Verify that 'Next' button is disabled if 'Please enter the Tamper Seal Number on LN2 shipper lid...' is not filled.
    regressionSatelliteLabSteps.SatLabShippingChecklist.negTamperSealEmpty()

    // C26234	[NEG] Verify that 'Next' button is disabled if 'No' toggle is selected for 'Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?'.
    regressionSatelliteLabSteps.SatLabShippingChecklist.negEvoNumberListedOnAirWaybillNo()

    // C26235	[[POS] Verify that 'Next' button is enabled if 'No' toggle is selected for 'Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?'.
    regressionSatelliteLabSteps.SatLabShippingChecklist.posEvoNumberListedOnAirWaybillNoWithDetail()

    // C26219	[NEG] Verify that 'Next' button is disabled if none of the toggle is selected for 'Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?'.
    regressionSatelliteLabSteps.SatLabShippingChecklist.negEvoNumberListedOnAirWaybillNoSelection()

    // C26238	[NEG] Verify that 'Next' button is disabled if 'No' toggle is selected for 'Is the red wire tamper seal in place for the LN2 shipper lid?' and details box is not filled.
    regressionSatelliteLabSteps.SatLabShippingChecklist.negRedWireTamperSealNo()

    // C26243	[POS] Verify that 'Next' button is enabled if 'No' toggle is selected for 'Is the red wire tamper seal in place for the LN2 shipper lid?' 
    regressionSatelliteLabSteps.SatLabShippingChecklist.negRedWireTamperSealNoWithDetail()

    // C26240	[NEG] Verify that 'Next' button is disabled if none of the toggle is selected for 'Is the red wire tamper seal in place for the LN2 shipper lid?'
    regressionSatelliteLabSteps.SatLabShippingChecklist.negRedWireTamperSealNoSelection()

    // C26245	[[NEG] Verify that 'Next' button is disabled if 'No' toggle is selected for 'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal...' and details box is not filled.
    regressionSatelliteLabSteps.SatLabShippingChecklist.negTamperSealNumberListedOnAirWaybillNo()

    // C26246	[POS] Verify that 'Next' button is enabled if 'No' toggle is selected for 'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal...' and 'details' is filled.
    regressionSatelliteLabSteps.SatLabShippingChecklist.posTamperSealNumberListedOnAirWaybillNoWithDetail()

    // C26244	[[NEG] Verify that 'Next' button is disabled if none of the toggle is selected for 'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal...'
    regressionSatelliteLabSteps.SatLabShippingChecklist.negnegTamperSealNumberListedOnAirWaybillNoSelection()

    // C26248	[NEG] Verify that 'Next' button if 'No' toggle is selected for 'Is the packing insert(s) included with the shipper?' and details box is not filled.
    regressionSatelliteLabSteps.SatLabShippingChecklist.negShipperLabelIncludedWithShipperNo()

    // C26250	[POS] Verify that 'Next' button is enabled if 'No' toggle is selected for 'Is the packing insert(s) included with the shipper?' and 'details ' box is filled.
    regressionSatelliteLabSteps.SatLabShippingChecklist.posShipperLabelIncludedWithShipperNoWithDetail()

    // C26247	[NEG] Verify that 'Next' button is disabled if none of the toggle is selected for 'Is the packing insert(s) included with the shipper?'
    regressionSatelliteLabSteps.SatLabShippingChecklist.negShipperLabelIncludedWithShipperNoSelection()

    // C26253	[NEG] Verify that 'Next' button is disabled if 'No' toggle is selected for 'Is the Consignee kit pouch included with the shipper?' and details box is not filled.
    regressionSatelliteLabSteps.SatLabShippingChecklist.negConsigneeKitPouchIncludedNo()

    // C26254	[POS] Verify that 'Next' button is enabled if 'No' toggle is selected for 'Is the Consignee kit pouch included with the shipper?'
    regressionSatelliteLabSteps.SatLabShippingChecklist.posConsigneeKitPouchIncludedNoWithDetails()

    // C26252	[NEG] Verify that 'Next' button is disabled if none of the toggle is selected for 'Is the Consignee kit pouch included with the shipper?'
    regressionSatelliteLabSteps.SatLabShippingChecklist.negConsigneeKitPouchIncludedNoSelection()

    // C26276	[NEG] Verify that 'Next' button is disabled if 'No' toggle is selected for 'Is the shipping container secured?' and details box is not filled.
    regressionSatelliteLabSteps.SatLabShippingChecklist.negShippingContainerSecuredNo()

    // C26277	[POS] Verify that 'Next' button is enabled if 'No' toggle is selected for 'Is the shipping container secured?' and 'details' box is filled.
    regressionSatelliteLabSteps.SatLabShippingChecklist.posShippingContainerSecuredNoWithDetail()

    // C26255	[NEG] Verify that 'Next' button is disabled if none of the toggle is selected for 'Is the shipping container secured?'
    regressionSatelliteLabSteps.SatLabShippingChecklist.negShippingContainerSecuredNoSelection()

    // C26291	[POS] Verify that data is retained upon clicking 'Save & Close' button.
    regressionSatelliteLabSteps.SatLabShippingChecklist.posDataOnSaveAndClose()

    // C38521	[POS] Verify if the 'Back' link is working.
    regressionSatelliteLabSteps.SatLabShippingChecklist.posDataOnBackAndNext()
  });
  
  it('Cryopreservation Shipping Summary ', () => {  
    commonHappyPath.commonOrderingHappyPath(scope,therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    regressionSatelliteLabSteps.cryopreservationShippingSummary.previousHappyPathSteps(therapy,scope);

    // C26297 [POS] Verify that 'Done' button is disabled on Cryopreservation Shipping Summary page. 
    regressionSatelliteLabSteps.cryopreservationShippingSummary.doneButtonDisabled()

    // C26299 [POS] Verify that 'edit' button for 'Transfer Product To Shipper' works.  
     regressionSatelliteLabSteps.cryopreservationShippingSummary.editButtonTransfer();

    // C26321 [POS] Verify that 'edit' button for 'Condition of Shipment' works.    
    regressionSatelliteLabSteps.cryopreservationShippingSummary.editButtonCondition();

    // C26322 [POS] Verify that 'Done' button is disabled on until signature.   
    regressionSatelliteLabSteps.cryopreservationShippingSummary.signature();

    // C25749 [POS] Verify if the data is retained upon clicking 'Save & Close' button.
    regressionSatelliteLabSteps.cryopreservationShippingSummary.dataSavingWithsaveAndClosePositive();   
  
  });
  
  it('Check Statuses Of Satellite Module', () => {
     commonHappyPath.commonOrderingHappyPath(scope,therapy)
     commonHappyPath.commonCollectionHappyPath(scope);  

     regressionSatelliteLabSteps.checkStatusesOfSatelliteLabModule(scope,therapy)
    });
});