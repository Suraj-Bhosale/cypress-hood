import ordering_steps from '../../../utils/HappyPath_steps/LCLP_CILTA_LOCAL_HappyPath/ordering_steps_cilta';
import commonHappyPath from "../../../utils/Regression_steps/LCLP_CILTA_LOCAL_RegressionPath/common_happyPath_steps"
import regressionCollectionSteps from '../../../utils/Regression_steps/LCLP_CILTA_LOCAL_RegressionPath/collection_steps_cilta'
import therapies from '../../../fixtures/therapy.json'


context('LCLP CILTA US Therapy Collection Regression Path', () => {
  const scope = {};
  const therapy = therapies.lclp_cilta;
  const region = 'US';

  beforeEach(() => {
    cy.clearCookies();
    ordering_steps.orderingData(scope);
    commonHappyPath.commonAliases();
    commonHappyPath.commonOrderingHappyPath(scope, therapy);
  });

  it('Patient Verification', () => {
    // C29855 [POS] Verify that "next" button should be disabled until the user signs the document.
    regressionCollectionSteps.patientVerification.nextButtonPos()
  });

  it('Collection Bag Identification', () => {
    regressionCollectionSteps.collectionBagIdentification.previousHappyPathSteps(scope)

    // C29841 [NEG] Verify if the "Next" button is disable if the "Scan or enter the DIN/Unique Donation Number/Apheresis ID" field is left empty.
    regressionCollectionSteps.collectionBagIdentification.apheresisIdNeg()

    // C29842 [NEG] Verify if the "Next" button is disable if the "Scan or enter the DIN/Unique Donation Number/Apheresis ID" field is left empty.
    regressionCollectionSteps.collectionBagIdentification.isSiteLabelsAppliedNeg()
      
    // C29843 C29844 [POS]Verify Back button is working.
    regressionCollectionSteps.collectionBagIdentification.backBtnPos()
  });

  it('Collection Bag Label Printing', () => {
    regressionCollectionSteps.collectionBagLabelPrinting.previousHappyPathSteps(scope)

    // C29845 [POS] Verify if the "Print Labels" button is clickable.
    regressionCollectionSteps.collectionBagLabelPrinting.printLablesClickable()

    // C29846 [NEG] Verify if the "next" button is disabled when "Confirm labels are printed successfully" checkbox is not checked.
    regressionCollectionSteps.collectionBagLabelPrinting.confirmPrintLabelNeg()

    // C29847 C29848 [NEG] Verify if "Next" button is disabled when the Signature is not signed.
    regressionCollectionSteps.collectionBagLabelPrinting.nextButtonPos()
    //   bug: next button is enabled
  });

  it('Collection Procedure Information', () => {
    regressionCollectionSteps.collectionProcedureInformation.previousHappypathSteps(therapy,scope);

    //C29849 C29850	[NEG] Verify if 'next' button is disable if 'Patient Weight (in Kg)' is invalid or Patient weight left empty.
    regressionCollectionSteps.collectionProcedureInformation.patientWeightInvalid();

    //C29851	[NEG] Verify if the 'next' button remains disabled if 'End time for collection' field is left empty.
    regressionCollectionSteps.collectionProcedureInformation.endTimeBlank();
  });

  it('Collection Summary', () => {
    regressionCollectionSteps.collectionSummary.previousHappypathSteps(therapy,scope);

    //C29856	[POS] Verify if the 'edit ' button is working. 
    regressionCollectionSteps.collectionSummary.verifyEditBtn();

    //C29857	[NEG] Verify if 'Print' button is disable until user signs the document.
    regressionCollectionSteps.collectionSummary.printBtnDisable();

    //C29858	[POS]Verify if the next button remains disabled until the user signs the document.
    regressionCollectionSteps.collectionSummary.verifyNextBtn();

    //C29859	[POS] Verify if 'Print' button is working. 
    regressionCollectionSteps.collectionSummary.printBtnEnable();
  });

  it('Cryopreservation Labels', () => {
    regressionCollectionSteps.cryopreservationLabels.previousHappypathSteps(therapy,scope);

    //C29883	[NEG]Verify if 'next' button is disabled if DIN is left empty
    regressionCollectionSteps.cryopreservationLabels.dinBlank();

    //C29882	[NEG]Verify if 'next' button is disabled when Number of bags formulated for cryopreservation is blank.
    regressionCollectionSteps.cryopreservationLabels.numberOfBagsBlank();

    //C29884 [POS] Verify if data is retained after clicking 'Save and close' button
    regressionCollectionSteps.cryopreservationLabels.verifySaveAndCloseBtn(scope);
  });

  it('Cryopreservation bag label and Packing Insert', () => {
    regressionCollectionSteps.cryopreservationBagLabelAndPackingInsert.previousHappypathSteps(therapy,scope);

    //C29864	[NEG] Verify if 'next' button is disabled when 'Scan or Enter DIN' is empty.
    regressionCollectionSteps.cryopreservationBagLabelAndPackingInsert.cryopreservationBagLabelEmpty();

    //C29863	[[NEG]Verify if the next button is disabled if the 'Enter the Bag Identifier' field is empty
    regressionCollectionSteps.cryopreservationBagLabelAndPackingInsert.bagIdentifierEmpty();

    //C29875	[NEG] Verify if 'Next' button is disabled when 'Enter the DIN/SEC-DIS/Apheresis ID for Cryopreservation Cassette' is blank.
    regressionCollectionSteps.cryopreservationBagLabelAndPackingInsert.cryopreservationCassetteEmpty();

    //C29876	[NEG]Verify if 'Next' button is disabled when 'Verify that the DIN/SEC-DIS/Apheresis ID match for the bag' checkbox be not checked.
    regressionCollectionSteps.cryopreservationBagLabelAndPackingInsert.dinCheckboxEmpty();

    //C29880	[POS] Verify if data is saved after clicking 'save and close' button 
    regressionCollectionSteps.cryopreservationBagLabelAndPackingInsert.verifySaveAndCloseBtn(scope);
  });

  it('Cryopreservation Summary', () => {
    regressionCollectionSteps.cryopreservationSummary.previousHappypathSteps(therapy,scope);

    //C38300	[POS] Verify if the Done button remains disabled until the user signs the document
    regressionCollectionSteps.cryopreservationSummary.verifyNextBtn();
  });

  it('Transfer product to Shipper', () => {
    regressionCollectionSteps.transferProductToShipper.previousHappypathSteps(therapy,scope);

   //C38669	[NEG]Verify if 'Next' button is disabled when 'COI number found on the Packing Insert' is not entered.
    regressionCollectionSteps.transferProductToShipper.coiBlank();

   //C38670 [NEG]Verify if 'Next' button is disabled when 'NO' is selected for 'Is the shipping container case intact?' and reason is not entered.
    regressionCollectionSteps.transferProductToShipper.shipperContainerIntactNeg(scope.coi);

   //C38671	[POS]Verify if 'Next' button is enabled when 'NO' toggle button is selected for Is the shipping container case intact?' and reason is entered.
    regressionCollectionSteps.transferProductToShipper.shipperContainerIntactPos();

   //C38672	[NEG]Verify if 'Next' button is disabled when 'NO' is selected for 'Was there a temperature out-of-range alarm received?' and reason is not entered.
    regressionCollectionSteps.transferProductToShipper.tempOutOfRangeNeg();

   //C38673 [POS]Verify if 'Next' button is enabled when 'NO' toggle button is selected for 'Was there a temperature out-of-range alarm received?' and reason is entered.
    regressionCollectionSteps.transferProductToShipper.tempOutOfRangePos();

   //C38674 [NEG]Verify if 'Next' button is disabled when 'Bag Identifier' is not entered.
    regressionCollectionSteps.transferProductToShipper.bagIdentifierBlank();

   //C38675 [NEG]Verify if 'Next' button is disabled when 'NO' is selected for 'Confirm cryopreserved apheresis product cassette(s) were not exposed to ambient temperature' and reason is not entered.
    regressionCollectionSteps.transferProductToShipper.ambientTempNeg();

   //C38676 [POS]Verify if 'Next' button is enabled when 'NO' toggle button is selected for 'Confirm cryopreserved apheresis product cassette(s) were not exposed to ambient temperature' and reason is entered.
    regressionCollectionSteps.transferProductToShipper.ambientTempPos();

   //C38677 [NEG]Verify if 'Next' button is disabled when 'NO' is selected for 'Is the red wire tamper seal labeled "RACK" in place on the cassette rack?' and reason is not entered.
    regressionCollectionSteps.transferProductToShipper.tamperSealNeg();

   //C38678 [POS]Verify if 'Next' button is enabled when 'NO' toggle button is selected for 'Is the red wire tamper seal labeled 'RACK' in place on the cassette rack?' and reason is entered.
    regressionCollectionSteps.transferProductToShipper.tamperSealPos();

   //C38679	[POS]Verify if 'Save & Close' button works. 
    regressionCollectionSteps.transferProductToShipper.verifySaveAndCloseBtn(scope);
  });

  it('Shipment Checklist', () => {
    regressionCollectionSteps.shipmentChecklist.previousHappypathSteps(therapy,scope);

    //C38655	[NEG]Verify if 'Next' button is disabled when 'air waybill number for shipment' is not entered.
    regressionCollectionSteps.shipmentChecklist.airWayBillBlank();

    //C38656	[NEG]Verify if 'Next' button is disabled when 'last 4 digits of the EVO-IS Number on the LN2 shipper lid' is not entered. 
    regressionCollectionSteps.shipmentChecklist.last4DigitEvoisBlank(scope);

    //C38657 [NEG]Verify if 'Next' button is disabled when 'NO' toggle button is selected for 'Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?' and reason is not entered.
    regressionCollectionSteps.shipmentChecklist.airwaybillMatchNeg();

    //C38658 [POS]Verify if 'Next' button is enabled when 'NO' toggle button is selected for 'Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?' and reason is entered.
    regressionCollectionSteps.shipmentChecklist.airwaybillMatchPos();

    //C38659 [NEG]Verify if 'Next' button is disabled when 'NO' toggle button is selected for 'Is the red wire tamper seal in place for the LN2 shipper lid?' and reason is not entered.
    regressionCollectionSteps.shipmentChecklist.redWireTamperSealNeg();

    //C38660 [POS]Verify if 'Next' button is enabled when 'NO' toggle button is selected for 'Is the red wire tamper seal in place for the LN2 shipper lid?' and reason is entered.
    regressionCollectionSteps.shipmentChecklist.redWireTamperSealPos();

    //C38661 [NEG]Verify if 'Next' button is disabled when 'Tamper Seal Number on LN2 shipper lid' is not entered.
    regressionCollectionSteps.shipmentChecklist.tamperSealNumberBlank();

    //C38662 [NEG]Verify if 'Next' button is disabled when 'NO' toggle button is selected for 'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number' and reason is not entered.
    regressionCollectionSteps.shipmentChecklist.tamperSealNumberMatchAirwayBillNeg();

    //C38663 [POS]Verify if 'Next' button is enabled when 'NO' toggle button is selected for 'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number and reason is entered.
    regressionCollectionSteps.shipmentChecklist.tamperSealNumberMatchAirwayBillPos();

    //C38664 [NEG]Verify if 'Next' button is disabled when 'NO' is selected for 'Is the Consignee kit pouch included with the shipper?' and reason is not entered.
    regressionCollectionSteps.shipmentChecklist.consigneeKitPouchNeg();

    //C38665 [POS]Verify if 'Next' button is enabled when 'NO' toggle button is selected for 'Is the Consignee kit pouch included with the shipper?' and reason is entered.
    regressionCollectionSteps.shipmentChecklist.consigneeKitPouchPos();

    //C38666 [NEG]Verify if 'Next' button is disabled when 'NO' is selected for 'Is the shipping container secured?' and reason is not entered.
    regressionCollectionSteps.shipmentChecklist.shippingContainerSecureNeg();

    //C38667 [POS]Verify if 'Next' button is enabled when 'NO' toggle button is selected for 'Is the shipping container secured?' and reason is entered.
    regressionCollectionSteps.shipmentChecklist.shippingContainerSecurePos();

    //C38668 [POS]Verify if 'Save & Close' button works.
    regressionCollectionSteps.shipmentChecklist.verifySaveAndCloseBtn(scope);
  });

  it('Shipment Summary', () => {
    regressionCollectionSteps.shipmentSummary.previousHappypathSteps(therapy,scope);

    //C29861	[POS] Verify if Edit buttons are working 
    regressionCollectionSteps.shipmentSummary.verifyEditBtn();

    //C29862	[POS] Verify if the Done button remains disabled until the user signs the document
    regressionCollectionSteps.shipmentSummary.verifyDoneBtn();
  });

  it('Check Statuses Of Collection Module', () => {
    regressionCollectionSteps.checkStatusesOfCollectionModule(scope,therapy);
  });
});