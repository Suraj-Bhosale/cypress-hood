import regressionOrderingSteps from '../../../utils/Regression_steps/CCCP_US_RegressionPath/ordering_steps'
import regressionCollectionSteps from '../../../utils/Regression_steps/CCCP_US_RegressionPath/collection_steps'
import regressionManufacturingSteps from '../../../utils/Regression_steps/CCCP_US_RegressionPath/manufacturing_steps'
import regressionInfusionSteps from '../../../utils/Regression_steps/CCCP_US_RegressionPath/infusion_steps'
import regressionCommonHappyPath from '../../../utils/Regression_steps/CCCP_US_RegressionPath/common_happyPath_steps'
import order_steps from '../../../utils/Regression_steps/CCCP_US_RegressionPath/ordering_steps'
import therapies from '../../../fixtures/therapy.json'

context('CCCP US Therapy Collection Regression Path', () => {
    beforeEach(() => {
      cy.clearCookies();
      order_steps.orderingData(scope);
      regressionCommonHappyPath.commonAliases();
    });

    const scope = {};
    const therapy = therapies.cccp_us
    const region = therapy.region;
    

    it('Check Statuses Of Collection Module', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCollectionSteps.checkStatusesOfCollectionModule(scope,therapy);
     
    });

    it('Central Label Printing', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCollectionSteps.centralLabelPrinting.previousHappyPathSteps(scope)

      //[NEG] Verify if the 'next' button remains disabled when the 'Confirm label is printed successfully' under 'Collection Labels' remains unchecked
      regressionCollectionSteps.centralLabelPrinting.collectionLabelCheckbox()

      // 	[NEG]Verify if 'next' button remains disabled when 'Confirm label is printed successfully' under 'Shipper Labels' remains as unchecked 
      regressionCollectionSteps.centralLabelPrinting.shipperLabelCheckbox()

      //[POS] Verify the data being retained on clicking the 'Close' button 
      regressionCollectionSteps.centralLabelPrinting.checkForDataSaved(scope)

    });

    it('Label Shipping', () => {
     
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCollectionSteps.labelShipping.previousHappyPathSteps(scope,therapy)

      //	[NEG] Verify that the 'next' button remains disabled until the signature has been provided 
      regressionCollectionSteps.labelShipping.verifyNextButtonWithoutSignature()

      //[POS] Verify if the signature is being retained upon clicking 'Close' button
      regressionCollectionSteps.labelShipping.checkForDataSaved(scope)

    });

    it('Patient Verification', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
      regressionCollectionSteps.patientVerification.previousHappyPathSteps(scope, therapy)
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
      regressionCollectionSteps.collectionBagLabel.previousHappyPathSteps(scope, therapy)

      // [NEG] Verify the 'next' button remains disabled if the 'Verify the apheresis label has been affixed to the collection bag' remains as unchecked 
      regressionCollectionSteps.collectionBagLabel.checkboxNeg();

      // [POS] Verify the data being retained on clicking the 'Save & Close' button 
      regressionCollectionSteps.collectionBagLabel.checkForDataSaved(scope);
     
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

      //  [NEG]Verify with invalid data and if the 'next' button is disabled incase of 'Collected Product Volume in mL' field left empty 
      regressionCollectionSteps.bagDataEntryDay.invalidProductVolume()

      // [NEG]Verify with invalid data and if the 'next' button is disabled incase of 'Whole Blood Processed in L' field left empty 
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

    it('Change Of Custody', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCollectionSteps.changeOfCustody.previousHappyPathSteps(scope,therapy)

      // [NEG] Verify 'Scan or enter the Bag ID to confirm receipt' field with invalid inputs 
      regressionCollectionSteps.changeOfCustody.negVerifyInvalidBagId()

      // [POS] Verify if the next button is disabled until the user signs the document 
      regressionCollectionSteps.changeOfCustody.posCheckNextButtonWithAndWithoutSig()

      // [POS]Verify that all the information is saved upon clicking Next 
      regressionCollectionSteps.changeOfCustody.posDataOnNext(scope)
    });

    it('Confirm Change Of Custody', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCollectionSteps.confirmChangeOfCustody.previousHappyPathSteps(scope,therapy)

      // [NEG] Verify 'Scan or enter the Bag ID to confirm receipt' field with invalid inputs 
      regressionCollectionSteps.confirmChangeOfCustody.negVerifyInvalidBagId()

      // [POS] Verify if the next button is disabled until the user signs the document 
      regressionCollectionSteps.confirmChangeOfCustody.posCheckNextButtonWithAndWithoutSig()

      // [POS]Verify that all the information is saved upon clicking Next 
      regressionCollectionSteps.confirmChangeOfCustody.posDataOnNext(scope)
    });

    it('Collection Transfer Product To Shipper', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCollectionSteps.collectionTransferProductToShipper.previousHappyPathSteps(scope,therapy)
  
      // [NEG] Verify 'Scan or enter the COI number on the LN2 shipper label.' with invalid inputs 
      regressionCollectionSteps.collectionTransferProductToShipper.negCoi()

      // [POS] Verify that the data is retained on clicking 'Save & Close' button 
      regressionCollectionSteps.collectionTransferProductToShipper.saveAndClosePos(scope)

      //[POS]Verify that all the information is saved upon clicking Next 
      regressionCollectionSteps.collectionTransferProductToShipper.posDataOnNext()
    });

    it('Collection Shipment Checklist', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCollectionSteps.collectionShipmentChecklist.previousHappyPathSteps(scope,therapy)
        
      // [NEG]Verify if the 'next' button is disabled if the 'Air Waybill Number or Shipment Tracking Identification' field is left empty 
      regressionCollectionSteps.collectionShipmentChecklist.airWaybillEmpty();

      // [NEG]Verify if the 'next' button remains disabled if a positive option for 'Confirm MNC, Apheresis was not exposed to ambient temperature greater than 60 minutes' is not being selected 
      regressionCollectionSteps.collectionShipmentChecklist.negApheresisNotExposedToTemp(scope);

      // [POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question "Confirm MNC, Apheresis was not exposed to ambient temperature .." and '' additional information "are entered. 
      regressionCollectionSteps.collectionShipmentChecklist.posApheresisNotExposedToTempNoWithDescription();

      // [NEG]Verify if the 'next' button remains disabled if a positive option for 'Has the infectious disease marker (IDM) samples been placed into the shipper?' is not being selected 
      regressionCollectionSteps.collectionShipmentChecklist.negHasInfectiousDiseaseMarker();

      // [POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question "Has the infectious disease marker (IDM) samples .." and '' additional information "are entered. 
      regressionCollectionSteps.collectionShipmentChecklist.posHasInfectiousDiseaseMarkerNoWithDescription();

      // [NEG]Verify if the 'next' button remains disabled if a positive option for 'Has the temperature monitor been activated?' is not being selected 
      regressionCollectionSteps.collectionShipmentChecklist.negHasTemperatureMonitorActivated();

      // [POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question "Has the temperature monitor been activated? .." and '' additional information "are entered. 
      regressionCollectionSteps.collectionShipmentChecklist.posHasTemperatureMonitorActivatedNoWithReason();

    // [POS] Verify that the data is retained on clicking 'Save & Close' button	
      regressionCollectionSteps.collectionShipmentChecklist.checkForDataSaved(scope);
   
  });

    it('Collection Shipping Summary', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
      regressionCollectionSteps.collectionShippingSummary.previousHappyPathSteps(scope,therapy)
      // [POS] Verify if the 'edit ' buttons are working. 
      regressionCollectionSteps.collectionShippingSummary.posEditButton(scope)

      // [POS]Verify if the 'done' button remains disabled until the user signs the document 
      regressionCollectionSteps.collectionShippingSummary.checkNextButtonWithAndWithoutSignature()
    });
  });




