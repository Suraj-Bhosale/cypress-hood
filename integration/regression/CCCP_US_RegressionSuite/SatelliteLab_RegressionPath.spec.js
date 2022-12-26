import regressionOrderingSteps from '../../../utils/Regression_steps/CCCP_US_RegressionPath/ordering_steps'
import regressionCollectionSteps from '../../../utils/Regression_steps/CCCP_US_RegressionPath/collection_steps'
import regressionManufacturingSteps from '../../../utils/Regression_steps/CCCP_US_RegressionPath/manufacturing_steps'
import regressionSatelliteSteps from '../../../utils/Regression_steps/CCCP_US_RegressionPath/satelite_lab_steps'
import regressionInfusionSteps from '../../../utils/Regression_steps/CCCP_US_RegressionPath/infusion_steps'
import regressionCommonHappyPath from '../../../utils/Regression_steps/CCCP_US_RegressionPath/common_happyPath_steps'
import order_steps from '../../../utils/HappyPath_steps/CCCP_US_HappyPath/ordering_steps'
import therapies from '../../../fixtures/therapy.json'
import input from '../../../fixtures/inputs.json'

context('CCCP US Therapy Satellite Regression Path', () => {
    beforeEach(() => {
      cy.clearCookies();
      order_steps.orderingData(scope);
      regressionCommonHappyPath.commonAliases();
    });

    const scope = {};
    const therapy = therapies.cccp_us
    

    it('Check Statuses Of Satellite Module', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope);

      //CCCP-US- SatelliteLab:Check the status of each step for SatelliteLab module
      regressionSatelliteSteps.checkStatusesOfSatelliteLabModule(scope,therapy);
    });
  
    it('Sat Lab Collection Summary', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope);

      // [POS] Verify if the data is retained upon clicking 'Save & Close' button.
      regressionSatelliteSteps.collectionSummary.posSaveAndClose(scope);
     
    });
    it('Sat Lab Verify Shipment', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
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
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteSteps.satLabShipmentChecklist.previousHappyPathSteps(scope, '-cccp','satellite-lab');

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
     regressionCommonHappyPath.commonCollectionHappyPath(scope)
     regressionSatelliteSteps.shipmentReceiptChecklistSummary.previousHappyPathSteps(scope, '-cccp','satellite-lab')

     //[POS] Verify if the 'Reason for change' pop-up is appeared on clicking 'Edit' button next to "Details Of Shipment' section.
     regressionSatelliteSteps.shipmentReceiptChecklistSummary.verifyEditPos()

      //[POS] Verify that the "Next" button is disabled when the signature is not provided and enabled when signature is provided
     regressionSatelliteSteps.shipmentReceiptChecklistSummary.verifySignaturePos()

     //[POS] Verify if the data is retained after clicking 'Save & Close' button.
     regressionSatelliteSteps.shipmentReceiptChecklistSummary.saveAndClosePos()
     
    });
    it('Sat Lab Cryopreservation', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope)
      regressionSatelliteSteps.cryopreservation.previousHappyPathSteps(scope, '-cccp','satellite-lab', input)

        // [NEG] Verify if the 'Next' button is disabled until the 'Number of bags formulated for Cryopreservation' input field is left empty. 
      regressionSatelliteSteps.cryopreservation.verifyNextButtonNeg()

        // [POS] Verify if the data is retained after clicking 'Save & Close' button. 
      regressionSatelliteSteps.cryopreservation.verifySaveAndClose()

    });
    it('Sat Lab Cryopreservation Labels', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope)
      regressionSatelliteSteps.cryopreservationLabels.previousHappyPathSteps(scope, '-cccp','satellite-lab', input)

      //[NEG] Verify  'Scan or enter the COI bag identifier on Cassette 1' with invalid data.
      regressionSatelliteSteps.cryopreservationLabels.scanCassetteNeg()

      //[NEG] Verify  'Scan or enter the COI bag identifier on Bag 1' with incorrect data.
      regressionSatelliteSteps.cryopreservationLabels.scanBagNeg()

      //[NEG]  Verify if the 'Next'  button is disabled until  the checkbox for  "Verify labels have been attached to all collection bags" is not checked and all other details are filled.
      regressionSatelliteSteps.cryopreservationLabels.isVerifyLabelsNeg()

      //[NEG]  Verify if the 'Next'  button is disabled until  the checkbox for  "Confirm labels are printed successfully" is not checked and all other details are filled.
      regressionSatelliteSteps.cryopreservationLabels.isConfirmLabelsNeg()

      //[POS] Verify if the signature block appears after clicking 'Next' button on Cryopreservation Labels page and also verifies confirmer's signature.
      regressionSatelliteSteps.cryopreservationLabels.verifySignature()

      //[POS] Verify if the data is retained after clicking 'Save & Close' button. 
      regressionSatelliteSteps.cryopreservationLabels.verifySaveAndClose()

      //[POS] Verify if the 'Back' link is working.
      regressionSatelliteSteps.cryopreservationLabels.retainsValueUponClickingBack()
      
    });
    it('Sat Lab Bag StorageEU', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteSteps.satLabBagStorage.previousHappyPathSteps(scope, '-cccp','satellite-lab',input);

      // [NEG] Verify the "Scan or Enter the COI-based bag identifier for moving bag to storage (Bag 1)" input field with invalid data
      regressionSatelliteSteps.satLabBagStorage.coiBagIdentifierOnBagNeg();

      // [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionSatelliteSteps.satLabBagStorage.saveAndCloseButtonPositive();

      // [POS] Verify if the 'Back' link is working.
      regressionSatelliteSteps.satLabBagStorage.retainsValueUponClickingNext();

     
    });
    it('Sat Lab Cryopreservation Data', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteSteps.cryopreservationData.previousHappyPathSteps(scope, '-cccp','satellite-lab',input);

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
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteSteps.satLabCryopreservationSummary.previousHappyPathSteps(scope, '-cccp','satellite-lab',input);

      // [POS] Verify if 'Edit' button next to 'Cryopreservation Data' section is working.
      regressionSatelliteSteps.satLabCryopreservationSummary.posEditButton();

      // [POS] Verify if the next button remains disabled until the user signs the document and enabled after signs the document
      regressionSatelliteSteps.satLabCryopreservationSummary.checkNextButtonWithAndWithoutSig();

      //[POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionSatelliteSteps.satLabCryopreservationSummary.saveAndClosePos()
     
    });
    it('Sat Lab Print Shipper Labels', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteSteps.satLabPrintShipperLabels.previousHappyPathSteps(scope, '-cccp','satellite-lab',input);

      // [POS] Verify if the 'Print Labels' button is clickable.
      regressionSatelliteSteps.satLabPrintShipperLabels.printLablesClickable();

      // [NEG] Verify if the 'Next' button is disabled until the "Confirm labels are printed successfully" check box is not checked.
      regressionSatelliteSteps.satLabPrintShipperLabels.confirmPrintLabelNeg();

      // [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionSatelliteSteps.satLabPrintShipperLabels.saveAndClosePos();

    });

    it('Sat Lab Bag Selection', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteSteps.bagSelection.previousHappyPathSteps(scope, '-cccp','satellite-lab',input);

      // [NEG] Verify if the 'Next' button is disabled when any of the 'SHIP' or 'DO NOT SHIP' button on the bag selection page is not selected.
      regressionSatelliteSteps.bagSelection.negNoInputForBagSelection();

      // [NEG] Verify if the 'Next' button is disabled when 'Do Not Ship' button on the bag selection page is selected.
      regressionSatelliteSteps.bagSelection.negDoNotShipBag();

      // [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionSatelliteSteps.bagSelection.saveAndClosePos();


    });

    it('Sat Lab Transfer Product To Shipper', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteSteps.satLabTransferProductToShipper.previousHappyPathSteps(scope, '-cccp','satellite-lab',input);
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
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteSteps.SatLabShippingChecklist.previousHappyPathSteps(scope, '-cccp','satellite-lab',input);

    // C34845	[NEG]
    regressionSatelliteSteps.SatLabShippingChecklist.negAirwayBillNumber()
   // C34846	[NEG]
    regressionSatelliteSteps.SatLabShippingChecklist.negInvalidEvo(scope)
    //C34847	[NEG]
    regressionSatelliteSteps.SatLabShippingChecklist.negTamperSealEmpty()
    // C34848	[NEG]
    regressionSatelliteSteps.SatLabShippingChecklist.negEvoNumberListedOnAirWaybillNo()
    // C34849	[POS]
    regressionSatelliteSteps.SatLabShippingChecklist.posEvoNumberListedOnAirWaybillNoWithDetail()
    // C34850	[NEG]
    regressionSatelliteSteps.SatLabShippingChecklist.negEvoNumberListedOnAirWaybillNoSelection()
    // C34851	[NEG]
    regressionSatelliteSteps.SatLabShippingChecklist.negRedWireTamperSealNo()
    // C34852	[POS]
    regressionSatelliteSteps.SatLabShippingChecklist.negRedWireTamperSealNoWithDetail()
    // C34853	[NEG]
    regressionSatelliteSteps.SatLabShippingChecklist.negRedWireTamperSealNoSelection()
    // C34854	[NEG]
    regressionSatelliteSteps.SatLabShippingChecklist.negTamperSealNumberListedOnAirWaybillNo()
    // C34855	[POS]
    regressionSatelliteSteps.SatLabShippingChecklist.posTamperSealNumberListedOnAirWaybillNoWithDetail()
    // C34856	[NEG]
    regressionSatelliteSteps.SatLabShippingChecklist.negnegTamperSealNumberListedOnAirWaybillNoSelection()
    // C34857	[NEG]
    regressionSatelliteSteps.SatLabShippingChecklist.negShipperLabelIncludedWithShipperNo()
    // C34858	[POS]
    regressionSatelliteSteps.SatLabShippingChecklist.posShipperLabelIncludedWithShipperNoWithDetail()
    // C34859	[NEG]
    regressionSatelliteSteps.SatLabShippingChecklist.negShipperLabelIncludedWithShipperNoSelection()
    // C34860	[NEG]
    regressionSatelliteSteps.SatLabShippingChecklist.negConsigneeKitPouchIncludedNo()
    // C34861	[POS]
    regressionSatelliteSteps.SatLabShippingChecklist.posConsigneeKitPouchIncludedNoWithDetails()
    // C34862	[NEG]
    regressionSatelliteSteps.SatLabShippingChecklist.negConsigneeKitPouchIncludedNoSelection()
    // C34863	[NEG]
    regressionSatelliteSteps.SatLabShippingChecklist.negShippingContainerSecuredNo()
    // C34864	[POS]
    regressionSatelliteSteps.SatLabShippingChecklist.posShippingContainerSecuredNoWithDetail()
    // C34865	[NEG]
    regressionSatelliteSteps.SatLabShippingChecklist.negShippingContainerSecuredNoSelection()
    // C34866	[POS]
    regressionSatelliteSteps.SatLabShippingChecklist.posDataOnSaveAndClose()
    // C34867	[POS]
    regressionSatelliteSteps.SatLabShippingChecklist.posDataOnBackAndNext()
    });
    
    it('Sat Shipping Summary Verify', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteSteps.SatShippingSummaryVerify.previousHappyPathSteps(scope, '-cccp','satellite-lab',input);

      // C34875	[POS]
    regressionSatelliteSteps.SatShippingSummaryVerify.posEditTransferProductToShipper()
    // C34876	[POS]			
    regressionSatelliteSteps.SatShippingSummaryVerify.posEditConditionOfShipment()
    // C34877	[NEG]			
    regressionSatelliteSteps.SatShippingSummaryVerify.negNextButtonOnConfirmerSign()
    // C34878	[POS]			
    regressionSatelliteSteps.SatShippingSummaryVerify.posDoneButtonOnVerifierSign()
    // C34879	[POS]
    regressionSatelliteSteps.SatShippingSummaryVerify.posDataOnSaveAndClose()
    });
  });
