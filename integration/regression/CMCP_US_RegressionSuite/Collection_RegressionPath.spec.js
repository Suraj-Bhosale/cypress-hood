import regressionOrderingSteps from '../../../utils/Regression_steps/CMCP_US_RegressionPath/ordering_steps'
import regressionCollectionSteps from '../../../utils/Regression_steps/CMCP_US_RegressionPath/collection_steps'
import regressionInfusionSteps from '../../../utils/Regression_steps/CMCP_US_RegressionPath/infusion_steps'
import regressionCommonHappyPath from '../../../utils/Regression_steps/CMCP_US_RegressionPath/common_happyPath_steps'
import order_steps from '../../../utils/Regression_steps/CMCP_US_RegressionPath/ordering_steps'
import therapies from '../../../fixtures/therapy.json'

context('CMCP US Therapy Collection Regression Path', () => {
  beforeEach(() => {
    cy.clearCookies();
    order_steps.orderingData(scope);
    regressionCommonHappyPath.commonAliases();
    beforeEach(() => {
      cy.clearCookies();
      order_steps.orderingData(scope);
      regressionCommonHappyPath.commonAliases();
    });

    const scope = {};
    const therapy = therapies.cmcp_us
    const region = therapy.region;
    

    it('Check Statuses Of Collection Module', () => {
     
    });

    it('Central Label Printing', () => {

    });

    it('Label Shipping', () => {

    });

    it('Patient Verification', () => {
     
    });
  
    it('Collection Bag Identification', () => {
      
    });
  
    it('Collection Bag Label', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
      regressionCollectionSteps.collectionBagLabel.previousHappyPathSteps(scope, therapy);

      //C25761 [NEG] Verify the 'next' button remains disabled if the 'Verify the apheresis label has been affixed to the collection bag' remains as unchecked
      regressionCollectionSteps.collectionBagLabel.nextButtonDisabled();

      //C25762 [POS] Verify the data being retained on clicking the 'Save & Close' button
      regressionCollectionSteps.collectionBagLabel.saveAndClose(scope);

      //C25763 [POS] Verify if the signature is being retained upon clicking 'Close' button
      regressionCollectionSteps.collectionBagLabel.retainSignature(scope);
    });

    it('Collection Procedure Information', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
      regressionCollectionSteps.collectionProcedureInformation.previousHappyPathSteps(scope, therapy);

      //C25554 [NEG] Verify if the 'next' button remains disabled if 'Patient Weight (in Kg)' is left empty
      regressionCollectionSteps.collectionProcedureInformation.nextButonDisabledForPatientWeight();

      //C25553 [NEG] Verify 'Patient Weight (in Kg)' with invalid data.
      regressionCollectionSteps.collectionProcedureInformation.verifyInvalidPatientWeight();
    });

    it('Bag Data Entry', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
      regressionCollectionSteps.bagDataEntry.previousHappyPathSteps(scope, therapy);
      
      //C25558 [NEG] Verify if the 'next' button is disabled when the 'Scan Collection Bag COI' field is left empty 
      regressionCollectionSteps.bagDataEntry.bagCoiAsEmpty();

      //C25559 [NEG]Verify with invalid data and if the 'next' button is disabled incase of 'Collected Product Volume in mL' field left empty
      regressionCollectionSteps.bagDataEntry.invalidProductVolume();

      //C25560 [NEG]Verify with invalid data and if the 'next' button is disabled incase of 'Whole Blood Processed in L' field left empty
      regressionCollectionSteps.bagDataEntry.invalidBloodProcessed();

      //C25561 [NEG]Verify if the 'next' button is disabled incase of 'Anticoagulant Type' field left empty 
      regressionCollectionSteps.bagDataEntry.anticoagulantTypeAsEmpty();

      //C25562 [NEG]Verify with invalid data and if the 'next' button is disabled incase of 'Anticoagulant Volume in mL' field left empty 
      regressionCollectionSteps.bagDataEntry.invalidAnticoagulantVolume();

      //C40970 [NEG] Verify Next button with Invalid Start Time
      regressionCollectionSteps.bagDataEntry.invalidStartTime();

      //C40971 [NEG] Verify Next button with Invalid End Time 
      regressionCollectionSteps.bagDataEntry.invalidEndTime();

      //C25564 [POS] Verify if data is retained upon clicking 'Save & Close' button 
      regressionCollectionSteps.bagDataEntry.checkForInfoSaved(scope);
    });

    it('Collection Summary', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
      regressionCollectionSteps.collectionSummary.previousHappyPathSteps(scope,therapy);

      //C25565	[POS] Verify if the 'edit ' buttons are working.
      regressionCollectionSteps.collectionSummary.posEditButton();

      //C25566	[POS]Verify if the next button remains disabled until the user signs the document 
      regressionCollectionSteps.collectionSummary.checkNextButtonWithAndWithoutSig();

      //C25567	[POS] Verify if 'Print' button is enabled as soon as the document is signed
      regressionCollectionSteps.collectionSummary.checkPrintButtonEnbaled();
    });

    it('Change Of Custody', () => {
     
    });

    it('Confirm Change Of Custody', () => {
     
    });

    it('Collection Transfer Product To Shipper', () => {
     
    });

    it('Collection Shipment Checklist', () => {
     
    });

    it('Collection Shipping Summary', () => {
     
    });
  });

  const scope = {};
  const therapy = therapies.cmcp_us
  const region = therapy.region;


  it('Check Statuses Of Collection Module', () => {

  });

  it('Central Label Printing', () => {

  });

  it('Label Shipping', () => {

  });

  it('Patient Verification', () => {

  });

  it('Collection Bag Identification', () => {

  });

  it('Collection Bag Label', () => {

  });

  it('Collection Procedure Information', () => {

  });

  it('Bag Data Entry', () => {

  });

  it('Collection Summary', () => {

  });

  it('Confirm Change of Custody- Arlene(Part- 1)', () => {
    regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
    regressionCollectionSteps.confirmChangeOfCustodyArlene.previousHappyPathSteps(scope,therapy)

    // [NEG] Verify 'Scan Collection Bag COI' field with invalid inputs 
    regressionCollectionSteps.confirmChangeOfCustodyArlene.negVerifyInvalidBagId()

    // [POS] Verify if the next button is disabled until the user signs the document 
    regressionCollectionSteps.confirmChangeOfCustodyArlene.posCheckNextButtonWithAndWithoutSig()

    // [POS]Verify that all the information is saved upon clicking Next 
    regressionCollectionSteps.confirmChangeOfCustodyArlene.posDataOnNext(scope)
   
  });


it('Confirm Change of Custody- Phil (Part-2)', () => {
    regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
    regressionCollectionSteps.confirmChangeOfCustodyPhil.previousHappyPathSteps(scope,therapy)

    // [NEG] Verify 'Scan or enter the Bag ID to confirm receipt' field with invalid inputs 
    regressionCollectionSteps.confirmChangeOfCustodyPhil.negVerifyInvalidBagId()

    // [POS] Verify if the next button is disabled until the user signs the document 
    regressionCollectionSteps.confirmChangeOfCustodyPhil.posCheckNextButtonWithAndWithoutSig()

    // [POS]Verify that all the information is saved upon clicking Next 
    regressionCollectionSteps.confirmChangeOfCustodyPhil.posDataOnNext()

});

it('Transfer Product To Shipper', () => {
    regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
    regressionCollectionSteps.collectionTransferProductToShipper.previousHappyPathSteps(scope,therapy)

    // [NEG] Verify 'Scan or enter the COI number on the LN2 shipper label.' with invalid inputs 
    regressionCollectionSteps.collectionTransferProductToShipper.negCoi();

    // [POS] Verify that the data is retained on clicking 'Save & Close' button 
    regressionCollectionSteps.collectionTransferProductToShipper.saveAndClosePos(scope);

    //[POS]Verify that all the information is saved upon clicking Next  
    regressionCollectionSteps.collectionTransferProductToShipper.posDataOnNext();

});

it('Shipment Checklist', () => {
    regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
    regressionCollectionSteps.shipmentChecklist.previousHappyPathSteps(scope,therapy)

    // [NEG]Verify if the 'next' button is disabled if the 'Air Waybill Number or Shipment Tracking Identification' field is left empty 
    regressionCollectionSteps.shipmentChecklist.airWaybillEmpty();

    // [NEG]Verify if the 'next' button remains disabled if a positive option for 'Confirm MNC, Apheresis was not exposed to ambient temperature greater than 60 minutes' is not being selected 
    regressionCollectionSteps.shipmentChecklist.negApheresisNotExposedToTemp(scope);

    // [POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question "Confirm MNC, Apheresis was not exposed to ambient temperature .." and '' additional information "are entered. 
    regressionCollectionSteps.shipmentChecklist.posApheresisNotExposedToTempNoWithDescription();

    // [NEG]Verify if the 'next' button remains disabled if a positive option for 'Has the infectious disease marker (IDM) samples been placed into the shipper?' is not being selected 
    regressionCollectionSteps.shipmentChecklist.negHasInfectiousDiseaseMarker();

    // [POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question "Has the infectious disease marker (IDM) samples .." and '' additional information "are entered. 
    regressionCollectionSteps.shipmentChecklist.posHasInfectiousDiseaseMarkerNoWithDescription();

    // [NEG]Verify if the 'next' button remains disabled if a positive option for 'Has the temperature monitor been activated?' is not being selected 
    regressionCollectionSteps.shipmentChecklist.negHasTemperatureMonitorActivated();

    // [POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question "Has the temperature monitor been activated? .." and '' additional information "are entered. 
    regressionCollectionSteps.shipmentChecklist.posHasTemperatureMonitorActivatedNoWithReason();

  // [POS] Verify that the data is retained on clicking 'Save & Close' button	
    regressionCollectionSteps.shipmentChecklist.checkForDataSaved(scope);

});

it('Cryopreservation Shipping Summary ', () => {
  regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
  regressionCollectionSteps.cryopreservationShippingSummary.previousHappyPathSteps(scope)

  // [POS] Verify if the 'edit ' buttons are working. 
  regressionCollectionSteps.cryopreservationShippingSummary.posEditButton(scope)

  // [POS]Verify if the 'done' button remains disabled until the user signs the document 
  regressionCollectionSteps.cryopreservationShippingSummary.checkNextButtonWithAndWithoutSignature()
 
});
});
