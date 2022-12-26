import regressionOrderingSteps from '../../../utils/Regression_steps/LCCP_US_RegressionPath/ordering_steps'
import regressionCollectionSteps from '../../../utils/Regression_steps/LCCP_US_RegressionPath/collection_steps'
import regressionInfusionSteps from '../../../utils/Regression_steps/LCCP_US_RegressionPath/infusion_steps'
import regressionCommonHappyPath from '../../../utils/Regression_steps/LCCP_US_RegressionPath/common_happyPath_steps'
import order_steps from '../../../utils/HappyPath_steps/LCCP_US_HappyPath/ordering_steps'
import therapies from '../../../fixtures/therapy.json'

context('LCCP US Therapy Collection Regression Path', () => {
  beforeEach(() => {
    cy.clearCookies();
    order_steps.orderingData(scope);
    regressionCommonHappyPath.commonAliases();
  });

  const scope = {};
  const therapy = therapies.lccp_us
  const region = therapy.region;

  it('Check Status Of Collection Module', () => {

  });

  it('Central Label Printing', () => {
    regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)

    // C39543 [POS] Verify if all 'Print Labels' button is clickable.
    regressionCollectionSteps.centralLabelPrinting.printLablesClickablePos();

    //	C25765	[NEG] Verify if the 'next' button remains disabled when the 'Confirm label is printed successfully' under 'Collection Labels' remains unchecked 
    regressionCollectionSteps.centralLabelPrinting.collectionUncheckNextButtonDisabledNeg();

    //	[NEG]Verify if 'next' button remains disabled when 'Confirm label is printed successfully' under 'Shipper Labels' remains as unchecked 
    regressionCollectionSteps.centralLabelPrinting.shipperUncheckNextButtonDisabledNeg();

    //[NEG] Verify if the 'next' button remains disabled when the 'Confirm label is printed successfully' under 'Cryopreservation Labels' remains unchecked 
    regressionCollectionSteps.centralLabelPrinting.cryoUncheckNextButtonDisabledNeg();

    //[POS] Verify the data being retained on clicking the 'Close' button
    regressionCollectionSteps.centralLabelPrinting.checkForInfoSaved(scope);

    //C25768 [NEG] Verify that the 'next' button remains disabled until the signature has been provided
    regressionCollectionSteps.centralLabelPrinting.signToConfirmAppearNextDisabledNeg();
  });

  it('Ship Labels To Collection Site ', () => {
    regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
    regressionCollectionSteps.shipLabelsToCollectionSite.previousHappyPathSteps(scope, therapy)

    //C25770	[NEG] Verify that the 'next' button remains disabled until the signature has been provided 
    regressionCollectionSteps.shipLabelsToCollectionSite.signToConfirmAppearNextDisabledNeg();
  });

  it('Patient Verification', () => {
    regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
    regressionCollectionSteps.patientVerification.previousHappyPathSteps(scope, therapy)

    //C25351	[POS] Verify that 'next' button should be disabled until the user signs the document 
    regressionCollectionSteps.patientVerification.nextButtonPos();
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

    // [NEG] Verify the 'next' button remains disabled if the 'Verify the apheresis label has been affixed to the collection bag" remains as unchecked.nting.
    regressionCollectionSteps.collectionBagLabelPrinting.negVerifyApheresisCheckboxUnchecked();

    //[POS] Verify that the data is retained upon clicking 'Save and Close' button
    regressionCollectionSteps.collectionBagLabelPrinting.posSaveAndCloseButtonCheck(scope);

    // [POS] Verify if the data is retained upon clicking 'Save & Close' button after providing signature.
    regressionCollectionSteps.collectionBagLabelPrinting.checkForInfoSavedAfterSignature(scope)
  });

  it('Collection Procedure Information', () => {
    regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
    regressionCollectionSteps.collectionProcedureInformation.previousHappyPathSteps(scope, therapy)

    //	[NEG] Verify 'Patient Weight (in Kg)' with invalid data. 
    regressionCollectionSteps.collectionProcedureInformation.negVerifyInvalidPatientWeight()
  });

  it('Bag Data Entry - Day 1', () => {
    regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
    regressionCollectionSteps.bagDataEntryDay1.previousHappyPathSteps(scope, therapy)

    //	[NEG] Verify if the 'next' button is disabled when the 'Scan Collection Bag COI' field is left empty 
    regressionCollectionSteps.bagDataEntryDay1.bagCoiAsEmpty()

    //[NEG]Verify 'Collected Product Volume in mL' field with invalid data 
    regressionCollectionSteps.bagDataEntryDay1.invalidProductVolume()

    //	[NEG]Verify 'Whole Blood Processed in L' field with Invalid data 
    regressionCollectionSteps.bagDataEntryDay1.invalidBloodProcessed()

    //	[NEG]Verify 'Anticoagulant Type' field as empty.
    regressionCollectionSteps.bagDataEntryDay1.anticoagulantTypeAsEmpty()

    //[NEG]Verify 'Anticoagulant Volume in mL' field with invalid data 
    regressionCollectionSteps.bagDataEntryDay1.invalidAnticoagulantVolume()

    //	[NEG] Verify Next button with Invalid Start Time
    regressionCollectionSteps.bagDataEntryDay1.invalidStartTime()

    //[NEG] Verify Next button with Invalid End Time 
    regressionCollectionSteps.bagDataEntryDay1.invalidEndTime()

    //[POS] Verify if data is retained upon clicking 'Save & Close' button 
    regressionCollectionSteps.bagDataEntryDay1.checkForInfoSaved(scope)
  });

  it('Collection Summary', () => {
    regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
    regressionCollectionSteps.collectionSummary.previousHappyPathSteps(scope, therapy)

    //	[POS] Verify if the 'edit ' buttons are working.
    regressionCollectionSteps.collectionSummary.posEditButton()

    //	[POS]Verify if the next button remains disabled until the user signs the document 
    regressionCollectionSteps.collectionSummary.checkNextButtonWithAndWithoutSign()
  });

  it('Confirm Change of Custody- Arlene(Part- 1)', () => {
    regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
    regressionCollectionSteps.confirmChangeOfCustodyArlene.previousHappyPathSteps(scope,therapy)
   
    // C40069 [NEG] Verify 'Scan Collection Bag COI' field with invalid input
    regressionCollectionSteps.confirmChangeOfCustodyArlene.negVerifyInvalidBagId()
   
    // C40071  [POS] Verify that all the information is saved upon clicking Next
    regressionCollectionSteps.confirmChangeOfCustodyArlene.posDataOnNext(scope)
   
  });

  it('Confirm Change of Custody- Phil (Part-2)', () => {

    regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)

    regressionCollectionSteps.confirmChangeOfCustodyPhil.previousHappyPathSteps(scope,therapy)

    //C40073 [NEG] Verify 'Scan or enter the Bag ID to confirm receipt' field with invalid inputs
    regressionCollectionSteps.confirmChangeOfCustodyPhil.negVerifyInvalidBagId()

    //C40074  [POS] Verify if the next button is disabled until the user signs the document
    regressionCollectionSteps.confirmChangeOfCustodyPhil.posCheckNextButtonWithAndWithoutSig()

    //C40075  [POS] Verify that all the information is saved upon clicking Next
    regressionCollectionSteps.confirmChangeOfCustodyPhil.posDataOnNext()
   
  });
  it('Cryopreservation Labels', () => {
    regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)

    regressionCollectionSteps.cryopreservationLabels.previousHappyPathSteps(scope,therapy)
 
    //40077  [NEG] Verify if the next button is disabled when 'Number of bags formulated for cryopreservation?' field is empty
    regressionCollectionSteps.cryopreservationLabels.verifyNumberOfBagsEmpty()

    //C40078 [POS]Verify that the data is retained upon clicking 'Save & Close' button
    regressionCollectionSteps.cryopreservationLabels.posSaveAndClose(scope)

    // C40080 [POS] Verify that all the information is saved upon clicking Next
    regressionCollectionSteps.cryopreservationLabels.posDataOnNext()
  });

  it('Shipper Labels', () => {
    regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)

    regressionCollectionSteps.shipperLabels.previousHappyPathSteps(scope,therapy)

    // C25785 [NEG] Verify if the next button is disabled when 'Verify labels have been attached to all collection bags' checkbox is not checked
    regressionCollectionSteps.shipperLabels.checkboxNeg();

    //C25786 [POS]Verify that the data is retained upon clicking 'Save & Close' button
    regressionCollectionSteps.shipperLabels.saveAndCloseButtonPositive(scope);

    //C40093 [POS] Verify that all the information is saved upon clicking Next
    regressionCollectionSteps.shipperLabels.retainsValueUponClickingNext();
  });

  

  it('Bag Storage', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy);
      regressionCollectionSteps.collectionBagStorage.previousHappyPathSteps(scope,therapy);

      // [NEG] Verify if the next button is disabled when field for 'STORE CASSETTE 1' is empty 
      regressionCollectionSteps.collectionBagStorage.coiBagIdentifierOnBagNeg();

      // [POS]Verify that the data is retained upon clicking 'Save & Close' button 
      regressionCollectionSteps.collectionBagStorage.checkSaveAndClose(scope);
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

  });

  it('Cryopreservation Summary', () => {

      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)

      regressionCollectionSteps.cryopreservationSummary.previousHappyPathSteps(scope,therapy)

      //[POS] Verify if the 'edit' button on 'Cryopreservation Data' is working
      regressionCollectionSteps.cryopreservationSummary.posEditButton()

      //[POS] Verify if the next button remains disabled until the user signs the document and enabled after signs the document
      regressionCollectionSteps.cryopreservationSummary.checkNextButtonWithAndWithoutSig()

      // [POS] Verify that signature is retained on clicking 'Save & Close' button 
      regressionCollectionSteps.cryopreservationSummary.checkSaveandClose(scope)
  });

  it('Bag Selection', () => {
    regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
    regressionCollectionSteps.bagSelection.previousHappyPathSteps(scope,therapy)

    //C25818 [NEG] Verify if the next button is disabled in case no shipment has been selected
    regressionCollectionSteps.bagSelection.noShipmentIsSelected()

    //C25819 [NEG] Verify that incase of one bag if 'do not ship' is selected the 'next' button remains disabled
    regressionCollectionSteps.bagSelection.doNOtShipOptionSelected()

    //C25820 [POS] Verify that the data is retained on clicking 'Save & Close' button
    regressionCollectionSteps.bagSelection.saveAndClose()
  });

  it('Transfer Product To Shipper', () => {
    regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
    regressionCollectionSteps.transferProductToShipper.previousHappyPathSteps(scope,therapy)

    //C25803 [NEG] Verify if the next button is disabled when 'Scan or enter the COI Bag Identifier on the cassette label (Bag 1)' field is empty 
    regressionCollectionSteps.transferProductToShipper.coiBagEmpty()

    //C25804 [NEG] Verify if the next button is disabled when 'Scan or enter the COI number on the LN2 shipper label.' is empty
    regressionCollectionSteps.transferProductToShipper.coiLN2ShipperEmpty()

    //C40682 [POS]Verify the "Confirm" button should enable when "Scan or enter the COI Bag Identifier on the cassette label (Bag 1)" is filled
    regressionCollectionSteps.transferProductToShipper.checkConfirmButtonForCoiBag();

    //C40683 [POS]Verify the "Confirm" button should enable when "Scan or enter the COI number on the LN2 shipper label." is filled
    regressionCollectionSteps.transferProductToShipper.checkConfirmButtonForLN2Shipper();

    //C40795 [NEG]Verify the "Next" button should remain disabled when "Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact your Janssen Cell Therapy Coordinator." toggle is not selected.
    regressionCollectionSteps.transferProductToShipper.caseIntactToggleNotSelected()

    //C40796 [NEG]Verify the "Next" button should be disabled when "No" for "Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact your Jansse" toggle is selected and details input field is empty.
    regressionCollectionSteps.transferProductToShipper.caseIntactSelectNoToggle()

    //C40797 [POS]Verify the "Next" button enables when "No" is selected for "Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact " toggle and valid reason is giving for the details input field.
    regressionCollectionSteps.transferProductToShipper.caseIntactWithFillDetailsField()

    //C40798 [NEG]Verify the "Next" button should remain disabled when "Was there a temperature out-of-range alarm received? If yes..." toggle is not selected.
    regressionCollectionSteps.transferProductToShipper.tempOutOfRangeNotselected()

    //C40799 [NEG]Verify the "Next" button should be disabled when "No" for "Was there a temperature out-of-range alarm received? If yes, please..." toggle is selected and details input field is empty.
    regressionCollectionSteps.transferProductToShipper.tempOutOfRangeSelectNoToggle()

    //C40800 [POS]Verify the "Next" button enables when "No" is selected for "Was there a temperature out-of-range alarm..." toggle and valid reason is giving for the details input field.
    regressionCollectionSteps.transferProductToShipper.tempOutOfRangeWithFillDetailsField()

    //C40801 [NEG]Verify the "Next" button should remain disabled when "Confirm cryopreserved apheresis product cassette(s) were not exposed to ambient temperature greater than 3 minutes" toggle is not selected.
    regressionCollectionSteps.transferProductToShipper.ambientTemperatureNotSelected()

    //C40802 [NEG]Verify the "Next" button should be disabled when "No" for "Confirm cryopreserved apheresis product cassette(s) were not exposed to ambient temperature greater than 3 minutes" toggle is selected and details input field is empty.
    regressionCollectionSteps.transferProductToShipper.ambientTemperatureSelectNoToggle()

    //C40803 [POS]Verify the "Next" button enables when "No" is selected for "Confirm cryopreserved apheresis product cassette(s) were not exposed to ambient temperature greater than 3 minutes" toggle and valid reason is giving for the details input field.
    regressionCollectionSteps.transferProductToShipper.ambientTemperatureWithFillDetailsField()

    //C40804 [NEG]Verify the "Next" button should remain disabled when "Is the red wire tamper seal labeled "RACK" in place on the cassette rack?" toggle is not selected.
    regressionCollectionSteps.transferProductToShipper.tamperSealNotSelected()

    //C40805 [NEG]Verify the "Next" button should be disabled when "No" for "Is the red wire tamper seal labeled "RACK" in place on the cassette rack?" toggle is selected and details input field is empty.
    regressionCollectionSteps.transferProductToShipper.amperSealSelectNoToggle()

    //C40806 [POS]Verify the "Next" button enables when "No" is selected for "Is the red wire tamper seal labeled "RACK" in place on the cassette rack?" toggle and valid reason is giving for the details input field.
    regressionCollectionSteps.transferProductToShipper.amperSealWithFillDetailsField()

    //C25809 [POS] Verify that the data is retained on clicking 'Save & Close' button
    regressionCollectionSteps.transferProductToShipper.saveAndClose(scope)
  });

  it('Shipment Checklist', () => {
    regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
    regressionCollectionSteps.shipmentChecklist.previousHappyPathSteps(scope,therapy)

    //C25810 [NEG]Verify if the next button is disabled if the 'Please enter air waybill number for shipment.' field is empty
    regressionCollectionSteps.shipmentChecklist.airwayBillNumberEmpty()

    //C40868 [NEG]Verify the "Confirm" button should enable after "Please enter air waybill number for shipment." is filled.
    regressionCollectionSteps.shipmentChecklist.checkConfirmButtonEnabled(scope)

    //C40869 [NEG]Verify the "Next" button should remain disabled when "Please enter the last 4 digits of the EVO-IS Number on the LN2 shipper lid" input field is empty
    regressionCollectionSteps.shipmentChecklist.evoIsNumberEmpty();

    //C40870 [NEG]Verify the "Next" button should be disabled when "Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?" toggle is not selected.
    regressionCollectionSteps.shipmentChecklist.evoAirwayBillNotSelected()

    //C40871 [NEG]Verify the "Next" button should be disabled when "No" is selected for "Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?" toggle.
    regressionCollectionSteps.shipmentChecklist.evoAirwayBillSelectNoToggle()

    //C40872 [POS]Verify the "Next" button should enable when "No" is selected for "Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?" toggle and valid reason given for details.
    regressionCollectionSteps.shipmentChecklist.evoAirwayBillWithFillDetailsField()

    //C40882 [NEG]Verify the "Next" button should be disabled when "Is the red wire tamper seal in place for the LN2 shipper lid?" toggle is not selected. 
    regressionCollectionSteps.shipmentChecklist.redWireTamperNotSelected()

    //C40883 [NEG]Verify the "Next" button should be disabled when "No" is selected for "Is the red wire tamper seal in place for the LN2 shipper lid?" toggle. 
    regressionCollectionSteps.shipmentChecklist.redWireTamperSelectNoToggle()

    //C40884 [POS]Verify the "Next" button should enable when "No" is selected for "Is the red wire tamper seal in place for the LN2 shipper lid?" toggle and valid reason given for details.
    regressionCollectionSteps.shipmentChecklist.redWireTamperWithFillDetailsField()

    //C40897 [NEG]Verify the "Next" button should disabled when "Please enter the Tamper Seal Number on LN2 shipper lid." input field is empty.
    regressionCollectionSteps.shipmentChecklist.tamperSealNumberEmpty()

    //C40885 [NEG]Verify the "Next" button should be disabled when "Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?" toggle is not selected.
    regressionCollectionSteps.shipmentChecklist.tamperSealNotSelected()

    //C40886 [NEG]Verify the "Next" button should be disabled when "No" is selected for "Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?" toggle.
    regressionCollectionSteps.shipmentChecklist.tamperSealSelectNoToggle()

    //C40887 [POS]Verify the "Next" button should enable when "No" is selected for "Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?" toggle and valid reason given for details.
    regressionCollectionSteps.shipmentChecklist.tamperSealWithFillDetailsField()

    //C40888 [NEG]Verify the "Next" button should be disabled when "Is the shipper label(s) included with the shipper?" toggle is not selected. 
    regressionCollectionSteps.shipmentChecklist.shipperLabelNotSelected()

    //C40889 [NEG]Verify the "Next" button should be disabled when "No" is selected for "Is the shipper label(s) included with the shipper?" toggle. 
    regressionCollectionSteps.shipmentChecklist.shipperLabelSelectNoToggle()

    //C40890 [POS]Verify the "Next" button should enable when "No" is selected for "Is the shipper label(s) included with the shipper?" toggle and valid reason given for details.
    regressionCollectionSteps.shipmentChecklist.shipperLabelWithFillDetailsField()

    //C40891 [NEG]Verify the "Next" button should be disabled when "Is the Consignee kit pouch included with the shipper?" toggle is not selected. 
    regressionCollectionSteps.shipmentChecklist.consigneeKitNotSelected()

    //C40892 [NEG]Verify the "Next" button should be disabled when "No" is selected for "Is the Consignee kit pouch included with the shipper?" toggle. 
    regressionCollectionSteps.shipmentChecklist.consigneeKitSelectNoToggle()

    //C40893 [POS]Verify the "Next" button should enable when "No" is selected for "Is the Consignee kit pouch included with the shipper?" toggle and valid reason given for details.
    regressionCollectionSteps.shipmentChecklist.consigneeKitWithFillDetailsField()

    //C40894 [NEG]Verify the "Next" button should be disabled when "Is the shipping container secured?" toggle is not selected. 
    regressionCollectionSteps.shipmentChecklist.zipTiesNotSelected()

    //C40895 [NEG]Verify the "Next" button should be disabled when "No" is selected for "Is the shipping container secured?" toggle. 
    regressionCollectionSteps.shipmentChecklist.zipTiesSelectNoToggle()

    //C40896 [POS]Verify the "Next" button should enable when "No" is selected for "Is the shipping container secured?" toggle and valid reason given for details.
    regressionCollectionSteps.shipmentChecklist.zipTiesWithFillDetailsField()

    //C25817 [POS] Verify that the data is retained on clicking 'Save & Close' button
    regressionCollectionSteps.shipmentChecklist.saveAndCloseShipment(scope)
  });

  it('Cryopreservation Shipping Summary ', () => {
    regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
    regressionCollectionSteps.checktheStatusesOfCollectionModule.previousHappyPathSteps(scope,therapy)

    //C25834 [POS] Verify if the 'edit ' buttons are working.
    regressionCollectionSteps.cryopreservationShippingSummary.posEditButton()
  });
});