import regressionOrderingSteps from '../../../utils/Regression_steps/LCLP_US_RegressionPath/ordering_steps'
import regressionCollectionSteps from '../../../utils/Regression_steps/LCLP_US_RegressionPath/collection_steps'
import regressionManufacturingSteps from '../../../utils/Regression_steps/LCLP_US_RegressionPath/manufacturing_steps'
import regressionInfusionSteps from '../../../utils/Regression_steps/LCLP_US_RegressionPath/infusion_steps'
import regressionCommonHappyPath from '../../../utils/Regression_steps/LCLP_US_RegressionPath/common_happyPath_steps'
import therapies from "../../../fixtures/therapy.json"
import collection_steps from '../../../utils/HappyPath_steps/LCLP_US_HappyPath/collection_steps'
import order_steps from '../../../utils/HappyPath_steps/LCLP_US_HappyPath/ordering_steps'


context('LCLP US Therapy Collection Regression Path', () => {
    beforeEach(() => {
      cy.clearCookies();
      order_steps.orderingData(scope);
      regressionCommonHappyPath.commonAliases();
    });

    const scope = {};
    const therapy = therapies.lclp_us

    it('Check Statuses Of Collection Module', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCollectionSteps.checkStatusesOfCollectionModule(scope,therapy);
     
    });
  
    it('Patient Verification', () => {
     regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)

     regressionCollectionSteps.patientVerification.previousHappyPathSteps(scope)

     //[POS] Verify that 'next' button should be disabled until the user signs the document
     regressionCollectionSteps.patientVerification.nextButtonPos()
    });
  
    it('Collection Bag Identification', () => {
          
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
  
      regressionCollectionSteps.collectionBagIdentification.previousHappyPathSteps(scope)
  
        //[NEG] Verify if the 'next' button is disabled if the 'Pre-Collection Information' field is left empty
      regressionCollectionSteps.collectionBagIdentification.apheresisDateEmpty()
  
        //[NEG] Verify if the 'next ' button is disabled when a future date is selected in 'Pre-Collection Information' 
      regressionCollectionSteps.collectionBagIdentification.apheresisDateFutureNeg()
  
        //[POS]Verify if the 'next' button is enabled on filling in the present and past dates in 'Pre-Collection Information'
      regressionCollectionSteps.collectionBagIdentification.apheresisDatePos()
  
        //[NEG] Verify if the 'next' button is disable if the 'Scan or enter the DIN/Unique Donation Number/Apheresis ID' is empty.
      regressionCollectionSteps.collectionBagIdentification.apheresisIdNeg()
  
        //[NEG] Verify if the 'next' button is disabled when 'Verify your site's pre-collection label has been affixed to the cell collection bag' checkbox is not checked
      regressionCollectionSteps.collectionBagIdentification.isSiteLabelsAppliedNeg()
  
        //[POS] Verify if the data is saved.
      regressionCollectionSteps.collectionBagIdentification.checkForInfoSaved()
      });
  
    it('Collection Bag Label Printing', () => {
     regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)

     regressionCollectionSteps.collectionBagLabelPrinting.previousHappyPathSteps(scope)

     //[POS] Verify if the 'Print Labels' button is clickable.
     regressionCollectionSteps.collectionBagLabelPrinting.printLablesClickable()

     //[NEG] Verify if the 'next' button remains disabled when 'Confirm labels are printed successfully' checkbox is not checked 
     regressionCollectionSteps.collectionBagLabelPrinting.confirmPrintLabelNeg()

     //[NEG] Verify if the 'next' button remains disabled when 'Verify the apheresis label has been affixed to the collection bag' checkbox is not checked.
     regressionCollectionSteps.collectionBagLabelPrinting.verifyApplyLabelNeg()

     //[POS] Verify that the data is retained upon clicking 'Save and Close' button
     regressionCollectionSteps.collectionBagLabelPrinting.checkForInfoSaved(scope)

    });

    it('Collection Procedure Information', () => {

      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)

      regressionCollectionSteps.collectionProcedureInformation.previousHappyPathSteps(scope,therapy)

      //	[NEG] Verify 'Patient Weight (in Kg)' with invalid data. 
      regressionCollectionSteps.collectionProcedureInformation.verifyInvalidPatientWait()
     
    });

    it('Bag Data Entry - Day 1', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)

      regressionCollectionSteps.bagDataEntryDay.previousHappyPathSteps(scope,therapy)

      //	[NEG] Verify if the 'next' button is disabled when the 'Scan Collection Bag COI' field is left empty 
      regressionCollectionSteps.bagDataEntryDay.bagCoiAsEmpty()

      //[NEG]Verify 'Collected Product Volume in mL' field with invalid data 
      regressionCollectionSteps.bagDataEntryDay.invalidProductVolume()

      //	[NEG]Verify 'Whole Blood Processed in L' field with Invalid data 
      regressionCollectionSteps.bagDataEntryDay.invalidBloodProcessed()

      //	[NEG]Verify 'Anticoagulant Type' field as empty.
      regressionCollectionSteps.bagDataEntryDay.anticoagulantTypeAsEmpty()

      //[NEG]Verify 'Anticoagulant Volume in mL' field with invalid data 
      regressionCollectionSteps.bagDataEntryDay.invalidAnticoagulantVolume()

      //	[NEG] Verify Next button with Invalid Start Time
      regressionCollectionSteps.bagDataEntryDay.invalidStartTime()

      //[NEG] Verify Next button with Invalid End Time 
      regressionCollectionSteps.bagDataEntryDay.invalidEndTime()

      //[POS] Verify if data is retained upon clicking 'Save & Close' button 
      regressionCollectionSteps.bagDataEntryDay.checkForInfoSaved(scope)
     
    });

    it('Collection Summary', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)

      regressionCollectionSteps.collectionSummary.previousHappyPathSteps(scope,therapy)

      //	[POS] Verify if the 'edit ' buttons are working.
      regressionCollectionSteps.collectionSummary.posEditButton()

      //	[POS]Verify if the next button remains disabled until the user signs the document 
      regressionCollectionSteps.collectionSummary.checkNextButtonWithAndWithoutSig()


    });

    it('Confirm Change of Custody- Arlene(Part- 1)', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCollectionSteps.confirmChangeOfCustodyArlene.previousHappyPathSteps(scope,therapy)

      // [NEG] Verify 'Scan Collection Bag COI' field with invalid inputs 
      regressionCollectionSteps.confirmChangeOfCustodyArlene.negVerifyInvalidBagId()

      // [POS] Verify if the next button is disabled until the user signs the document 
      regressionCollectionSteps.confirmChangeOfCustodyArlene.posCheckNextButtonWithAndWithoutSig()

      //  [POS] Verify that all the information is saved upon clicking Next 
      regressionCollectionSteps.confirmChangeOfCustodyArlene.posDataOnNext(scope)
     
    });

    it('Confirm Change of Custody- Phil (Part-2)', () => {

      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)

      regressionCollectionSteps.confirmChangeOfCustodyPhil.previousHappyPathSteps(scope,therapy)

      // [NEG] Verify 'Scan or enter the Bag ID to confirm receipt' field with invalid inputs 
      regressionCollectionSteps.confirmChangeOfCustodyPhil.negVerifyInvalidBagId()

      // [POS] Verify if the next button is disabled until the user signs the document 
      regressionCollectionSteps.confirmChangeOfCustodyPhil.posCheckNextButtonWithAndWithoutSig()

      // [POS] Verify that all the information is saved upon clicking Next 
      regressionCollectionSteps.confirmChangeOfCustodyPhil.posDataOnNext()
     
    });

    it('Cryopreservation Labels', () => {

      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)

      regressionCollectionSteps.cryopreservationLabels.previousHappyPathSteps(scope,therapy)

      regressionCollectionSteps.cryopreservationLabels.verifyNumberOfBagsEmpty()

      regressionCollectionSteps.cryopreservationLabels.posSaveAndClose(scope)

      regressionCollectionSteps.cryopreservationLabels.posDataOnNext()

     
    });

    it('Shipper Labels', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)

      regressionCollectionSteps.shipperLabels.previousHappyPathSteps(scope,therapy)

    // [NEG]Verify 'Apply bag 1 labels' Fields with Invalid inputs
      regressionCollectionSteps.shipperLabels.coiBagIdentifierOnBagNeg();

    // [NEG]Verify 'Apply bag 1 labels' Fields with Invalid inputs
      regressionCollectionSteps.shipperLabels.coiCassetteOnBagNeg();

    // [NEG] Verify if the next button is disabled when 'Verify labels have been attached to all collection bags' checkbox is not checked
      regressionCollectionSteps.shipperLabels.checkboxNeg();

    // [POS]Verify that the data is retained upon clicking 'Save & Close' button
      regressionCollectionSteps.shipperLabels.saveAndCloseButtonPositive(scope);

    // [POS] Verify that all the information is saved upon clicking Next
      regressionCollectionSteps.shipperLabels.retainsValueUponClickingNext();
     
    });
    
    it('Bag Storage', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)

      regressionCollectionSteps.collectionBagStorage.previousHappyPathSteps(scope,therapy)

    // [NEG] Verify 'STORE CASSETTE 1' field with invalid inputs
      regressionCollectionSteps.collectionBagStorage.coiBagIdentifierOnBagNeg();

    // [POS]Verify that the data is retained upon clicking 'Save & Close' button
      regressionCollectionSteps.collectionBagStorage.saveAndCloseButtonPositive(scope);

    // [POS] Verify that all the information is saved upon clicking Next
      regressionCollectionSteps.collectionBagStorage.retainsValueUponClickingNext();
     
    });

    it('Cryopreservation Data', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)

      regressionCollectionSteps.cryopreservationData.previousHappyPathSteps(scope,therapy)

      // [NEG] Verify 'Scan or enter the bag identifier prior to entering bag details (Bag 1)' field with invalid inputs
      regressionCollectionSteps.cryopreservationData.coiBagIdentifierOnBagNeg();

      // [NEG] Verify 'Total MNC Cells (in e^9)' with invalid data
      regressionCollectionSteps.cryopreservationData.totalCellFieldNeg();

      // [NEG] Verify 'Product Volume (Cells + CS10) in mL' with invalid data
      regressionCollectionSteps.cryopreservationData.productVolumeNeg();

      // [POS]Verify that the data is retained upon clicking 'Save & Close' button
      regressionCollectionSteps.cryopreservationData.saveAndCloseButtonPositive(scope);

      // [POS] Verify that all the information is saved upon clicking Next
      regressionCollectionSteps.cryopreservationData.retainsValueUponClickingNext();
     
    });

    it('Cryopreservation Summary', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)

      regressionCollectionSteps.cryopreservationSummary.previousHappyPathSteps(scope,therapy)

      //[POS] Verify if the 'edit' button on 'Cryopreservation Data' is working
      regressionCollectionSteps.cryopreservationSummary.posEditButton()

      //[POS] Verify if the next button remains disabled until the user signs the document and enabled after signs the document
      regressionCollectionSteps.cryopreservationSummary.checkNextButtonWithAndWithoutSig()

    });

    it('Bag Selection', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)

      regressionCollectionSteps.cryopreservationBagSelection.previousHappyPathSteps(scope,therapy)

      //[NEG] Verify if the next button is disabled in case no shipment has been selected
      regressionCollectionSteps.cryopreservationBagSelection.negNoInputForBagSelection()

      //[NEG] Verify that incase of one bag if 'do not ship' is selected the 'next' button remains disabled
      regressionCollectionSteps.cryopreservationBagSelection.negDoNotShipBag()
    });

    it('Transfer Product To Shipper', () => {

      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)

      regressionCollectionSteps.cryopreservationTransferProductToShipper.previousHappyPathSteps(scope,therapy)

      //[NEG] Verify if the next button is disabled when 'Scan or enter the COI Bag Identifier on the cassette label (Bag 1)' field is empty
      regressionCollectionSteps.cryopreservationTransferProductToShipper.negBagId()

      //	[NEG] Verify if the next button is disabled when 'Scan or enter the COI number on the LN2 shipper label.' is empty 
      regressionCollectionSteps.cryopreservationTransferProductToShipper.negCoi()

      //	[NEG] Verify negative status for 'Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact Janssen.' toggle 	
      regressionCollectionSteps.cryopreservationTransferProductToShipper.negToggleCaseIntact()

      //	[NEG] Verify negative status for 'Was there a temperature out-of-range alarm received? If yes, contact Janssen immediately and do NOT proceed until further instructions are given' toggle 	
      regressionCollectionSteps.cryopreservationTransferProductToShipper.negToggleTempRange()

      //	[NEG] Verify negative status for 'Confirm cryopreserved apheresis product cassette(s) were not exposed to ambient temperature greater than 3 minutes' toggle 		
      regressionCollectionSteps.cryopreservationTransferProductToShipper.negIsredTamperSeal()

      //	[NEG] Verify negative status for 'Is the red wire tamper seal labeled "RACK" in place on the cassette rack?' toggle 
      regressionCollectionSteps.cryopreservationTransferProductToShipper.negToggleProductsStatus()

      //[POS] Verify that the data is retained on clicking 'Save & Close' button
      regressionCollectionSteps.cryopreservationTransferProductToShipper.posSaveAndClose(scope)
     
    });

    it('Shipment Checklist', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
      regressionCollectionSteps.shipmentChecklist.previousHappyPathSteps(scope, therapy)

      // C21629	[NEG]
      regressionCollectionSteps.shipmentChecklist.airWaybillEmpty()
      // C21631	[NEG]	
      regressionCollectionSteps.shipmentChecklist.negEvoIsNumberMatch(scope)
      // C21632	[NEG]
      regressionCollectionSteps.shipmentChecklist.negIsRedTamperSeal()
      // C21633	[NEG]
      regressionCollectionSteps.shipmentChecklist.negTamperSealNumberMatch()
      // C21634	[NEG]			
      regressionCollectionSteps.shipmentChecklist.negIsShipperLabelIncluded()
      // C21635	[NEG]
      regressionCollectionSteps.shipmentChecklist.negIsConsigneeKitPouchIncluded();
      //C21636 [NEG]
      regressionCollectionSteps.shipmentChecklist.negISZipTiesSecured();
      // C21637	[POS]
      regressionCollectionSteps.shipmentChecklist.dataOnSaveAndClose(scope);
    
    });
    
    it('Cryopreservation Shipping Summary ', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
      regressionCollectionSteps.cryopreservationShippingSummary.previousHappyPathSteps(scope)
      // C25831	[POS] Verify if the 'edit ' buttons are working. 
      regressionCollectionSteps.cryopreservationShippingSummary.posEditButton(scope)
      regressionCollectionSteps.cryopreservationShippingSummary.checkNextButtonWithAndWithoutSignature()


    });


  });