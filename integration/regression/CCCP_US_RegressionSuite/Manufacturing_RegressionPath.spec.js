import regressionOrderingSteps from '../../../utils/Regression_steps/CCCP_US_RegressionPath/ordering_steps'
import regressionCollectionSteps from '../../../utils/Regression_steps/CCCP_US_RegressionPath/collection_steps'
import regressionManufacturingSteps from '../../../utils/Regression_steps/CCCP_US_RegressionPath/manufacturing_steps'
import regressionInfusionSteps from '../../../utils/Regression_steps/CCCP_US_RegressionPath/infusion_steps'
import regressionCommonHappyPath from '../../../utils/Regression_steps/CCCP_US_RegressionPath/common_happyPath_steps'
import collection_steps from '../../../utils/Regression_steps/CCCP_US_RegressionPath/collection_steps'
import m_steps from '../../../utils/HappyPath_steps/CCCP_US_HappyPath/manufacturing_steps';
import commonHappyPath from "../../../utils/Regression_steps/CCCP_US_RegressionPath/common_happyPath_steps"
import order_steps from '../../../utils/HappyPath_steps/CCCP_US_HappyPath/ordering_steps'
import therapies from '../../../fixtures/therapy.json';

context('CCCP US Therapy Manufacturing Regression Path', () => {
    beforeEach(() => {
        cy.clearCookies();
        order_steps.orderingData(scope);
        regressionCommonHappyPath.commonAliases();
    });

    const scope = {};
    const therapy = therapies.cccp_us

    it('Check Status Of Manufacturing Module', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope, therapy);
        regressionManufacturingSteps.checkStatusesOfManufacturingModule(scope, therapy)
    });

    it('Collection Status', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope, therapy);

        // C32166 [POS]View Document button should be Enabled
        regressionManufacturingSteps.collectionStatus.viewDocumentButtonsEnabled();
    });

    it('Verify Shipper ', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope, therapy);
        regressionManufacturingSteps.verifyShipper.previousHappyPathSteps(scope, therapy);

        //C38349	[NEG] Verify the 'Next' button should be disabled if the COI is not entered 
        regressionManufacturingSteps.verifyShipper.coiEmptyNeg();

        //C38351 [NEG] Verify if Next button is disable functionality of Invalid values for Coi Is entered.
        regressionManufacturingSteps.verifyShipper.checkWithInvalidCoiValuesNeg();

        //C38350[POS] Verify the 'Next' button should be enabled  after the COI number is confirmed 
        regressionManufacturingSteps.verifyShipper.coiConfirmedPos();

        //C38352 [POS] Verify that all the information is saved upon clicking Next. 
        regressionManufacturingSteps.verifyShipper.checkForTheInfoSavedPos();

        //C38353 [POS] Verify if 'Back' button is working. 
        regressionManufacturingSteps.verifyShipper.checkForBackButtonPos()
    });

    it('Transfer Product to Intermediary or Final LN2 Storage (Part 1)', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.previousHappyPathSteps(scope);

        //C32005 [NEG] Verify the 'Next' button should be disabled on Transfer Product to Intermediary or Final LN2 Storage page
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.nextButtonDisabled();

        //C32006 [NEG] Verify if the 'Confirm' button is disabled for 'Scan the COI on the LN2 shipper'
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.checkConfirmButtonDisabledForLN2Shipper();

        //C32007 [NEG] Verify if the 'Confirm' button is disabled for 'Scan the COI on the cassette label'
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.checkConfirmButtonDisabledForCassetteLabel();

        //C32008 [NEG] Verify if the 'Confirm' button is disabled for 'Scan the COI on the bag'
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.checkConfirmButtonDisabledForCoiOnTheBag();

        //C32009 [POS] Verify if the 'Confirm' button is enabled for 'Scan the COI on the LN2 shipper'
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.checkConfirmButtonEnabledForLN2Shipper();

        //C32010 [POS] Verify if the 'Confirm' button is enabled for 'Scan the COI on the cassette label'
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.checkConfirmButtonEnabledForCassetteLabel();

        //C32011 [POS] Verify if the 'Confirm' button is enabled for 'Scan the COI on the bag'
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.checkConfirmButtonEnabledForCoiOnTheBag();

        //C32014	[NEG] Verify "Scan the COI on the LN2 shipper" Confirm button when no/invalid data is filled
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.checkInvalidDataForLN2Shipper();

        //C32015	[NEG] Verify "Scan the COI on the cassette label" Confirm button when no/invalid data is filled
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.checkInvalidDataForCassetteLabel();

        //C32016	[NEG] Verify "Scan the COI on the bag" Confirm button when no/invalid data is filled
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.checkInvalidDataForBag();

        //C32013 [POS] Verify the data is saved after clicking 'Save & Close' button on Transfer Product to Intermediary or Final LN2 Storage page.
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.saveAndClose();
    });

    it('Transfer Product to Intermediary or Final LN2 Storage (Part 2)', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart2.previousHappyPathSteps(scope);

        //C32017	[POS] Verify the 'Next' button should be enabled on Transfer Product to Intermediary or Final LN2 Storage page
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart2.nextButtonEnabled();

        //C32018	[NEG] Verify if the 'Confirm' button is disabled for 'Scan the COI on the LN2 shipper' 
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart2.checkConfirmButtonDisabledForLN2Shipper();

        //C32019	[NEG] Verify if the 'Confirm' button is disabled for 'Scan the COI on the cassette label'
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart2.checkConfirmButtonDisabledForCassette();

        //C32020	[POS] Verify if the 'Confirm' button is enabled for 'Scan the COI on the cassette label' 
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart2.checkConfirmButtonEnabledForCassette();

        //C32021	[POS] Verify if the 'Confirm' button is enabled for 'Scan the COI on the LN2 shipper' 
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart2.checkConfirmButtonEnabledForLN2Shipper();

        //C32022	[NEG] Verify "Scan the COI on the cassette label" Confirm button when no/invalid data is filled 
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart2.checkInvalidDataForCassette();
        
        //C32023	[NEG] Verify "Scan or enter the COI on the LN2 shipper label" Confirm button when no/invalid data is filled
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart2.checkInvalidDataForLN2Shipper();
    });
  
    it('Shipment Receipt Checklist', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionManufacturingSteps.shipmentReceiptChecklist.previousHappyPathSteps(scope, therapy);

        // [NEG] Verify the 'Next' button should be disabled on shipment receipt checklist page
        regressionManufacturingSteps.shipmentReceiptChecklist.noDetailsProvided();

        // [NEG] Verify negative status for 'Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact Janssen CSC logistics.'  toggle.
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleShippingContainerCaseNeg();

        // [NEG] Verify negative status for 'Is the shipping container secured?' toggle.
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleShippingContainerSecuredNeg();

        // [NEG] Verify negative status for 'Is the shipper label(s) included with the shipper?'
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleShipperLabelsNeg();

        // [NEG] Verify negative status for 'Is the Consignee kit pouch included with the shipper?' Toggle .
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleConsigneeKitPouchNeg();

        // [NEG] Verify negative status for 'Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?' toggle.
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleEvoIsNumberNeg();

        // [NEG] Verify negative status for 'Is the Red Wire Tamper Seal in place for the LN2 shipper lid?' toggle.
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleRedWireTamperSealNeg();

        // [NEG] Verify negative status for 'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?' toggle.
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleTamperSealNumberNeg();

        // [NEG] Verify if 'next' button is disable if EVO-IS number is left empty and other fields are filled.
        regressionManufacturingSteps.shipmentReceiptChecklist.emptyEvoIsNumberFieldNeg();

        // [NEG] Verify if 'next' button is disabled if Tamper Seal number is left empty and other fields are filled.
        regressionManufacturingSteps.shipmentReceiptChecklist.emptyTamperSealNumberFieldNeg();

        // [NEG] Verify if 'next' button is disable if 'Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact Janssen CSC logistics.' is left empty and other fields are filled.
        regressionManufacturingSteps.shipmentReceiptChecklist.shippingContainerCaseFieldNeg();

        // [NEG] Verify if 'next' button is disable if 'Is the shipping container secured?' is left empty and other fields are filled.
        regressionManufacturingSteps.shipmentReceiptChecklist.shippingContainerSecuredFieldNeg();

        // [NEG] Verify if 'next' button is disable if 'Is the shipper label(s) included with the shipper?' is left empty and other fields are filled.
        regressionManufacturingSteps.shipmentReceiptChecklist.shipperLabelsIncludedFieldNeg();

        // [NEG] Verify if 'next' button is disable if 'Is the Consignee kit pouch included with the shipper?' is left empty and other fields are filled.
        regressionManufacturingSteps.shipmentReceiptChecklist.consigneeKitPouchFieldNeg();

        // [NEG] Verify if 'next' button is disable if 'Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?' is left empty and other fields are filled.
        regressionManufacturingSteps.shipmentReceiptChecklist.evoIsNumberOnLN2ShipperLidNeg();

        // [NEG] Verify if 'next' button is disable if 'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?' is left empty and other fields are filled.
        regressionManufacturingSteps.shipmentReceiptChecklist.tamperSealNumberNeg();

        // [NEG] Verify if 'next' button is disable if 'Is the Red Wire Tamper Seal in place for the LN2 shipper lid?' is left empty and other fields are filled.
        regressionManufacturingSteps.shipmentReceiptChecklist.redWireTamperSealNeg();

        // [POS] Verify if 'next' button is enabled after filling reason for No toggle 'Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact Janssen CSC logistics.'
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleShippingContainerCasePos();

        // [POS] Verify if 'next' button is enabled after filling reason for No toggle 'Is the shipping container secured?'
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleShippingContainerSecuredPos();

        // [POS] Verify if 'next' button is enabled after filling reason for No toggle 'Is the shipper label(s) included with the shipper?'
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleShipperLabelsPos();

        // [POS] Verify if 'next' button is enabled after filling reason for No toggle 'Is the Consignee kit pouch included with the shipper?'
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleConsigneeKitPouchPos();

        // [POS] Verify if 'next' button is enabled after filling reason for No toggle 'Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?'
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleEvoIsNumberPos();

        // [POS] Verify if 'next' button is enabled after filling reason for No toggle 'Is the Red Wire Tamper Seal in place for the LN2 shipper lid?'
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleRedWireTamperSealPos();

        // [POS] Verify if 'next' button is enabled after filling reason for No toggle 'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?'
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleTamperSealNumberPos();

        // [POS] Verify if 'Back' button is working.
        regressionManufacturingSteps.shipmentReceiptChecklist.posBackLinkCheck();

        // [NEG] Verify the EVO-IS Number on the LN2 shipper lid with incorrect data.
        regressionManufacturingSteps.shipmentReceiptChecklist.invalidEvoIsNumberNeg();

        // [POS] Verify if the next button is enabled on the Shipment Receipt Checklist page.
        regressionManufacturingSteps.shipmentReceiptChecklist.nextButtonEnabledPos();

        // [POS] Verify the data is saved on the shipment receipt checklist page.
        regressionManufacturingSteps.shipmentReceiptChecklist.saveAndClosePos();

        // [POS] Verify 'Next' button is working.
        regressionManufacturingSteps.shipmentReceiptChecklist.posNextButtonCheck();

        // [POS] Verify that a reason for change is asked upon changing values.
        regressionManufacturingSteps.shipmentReceiptChecklist.reasonForChangeOnChangingValuePos();
    });

    it('Shipment Receipt Checklist Summary', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionManufacturingSteps.shipmentReceiptChecklistSummary.previousHappyPathSteps(scope, therapy);

        // [NEG] Verify the 'Next' button should be disabled on Shipment Receipt Checklist Summary page.
        // [POS] Verify the 'Next' button should be enabled only if the confirmer and verifier signature are signed on Shipment Receipt Checklist Summary page.
        regressionManufacturingSteps.shipmentReceiptChecklistSummary.nextButtonCheckWithOrWithoutSignature();

        // [POS]  Verify that it should ask to resign the signatures if any changes are made on the shipment receipt checklist page.
        regressionManufacturingSteps.shipmentReceiptChecklistSummary.posAskToResign();
    });

    it('Product Receipt', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope, therapy);
        regressionManufacturingSteps.productReceipt.previousHappyPathSteps(scope)

        //C32024 [NEG] Verify the 'Next' button should be disabled on product receipt page
        regressionManufacturingSteps.productReceipt.nextButtonDisabled();

        //C40000 and C40001 
        regressionManufacturingSteps.productReceipt.checkNoAndInvalidAirwayBill();

        //C39999 [POS] Verify the "Confirm" button should enable after "Subject number on air waybill." is filled
        regressionManufacturingSteps.productReceipt.checkConfirmButtonEnabledForAirwaywayBill(scope);

        //C40002 [NEG] Verify the "Next" button should remain disabled when "Confirm cryopreserved apheresis product cassette(s) were not exposed to ambient temperature greater than 3 minutes." toggle is not selected. 
        regressionManufacturingSteps.productReceipt.noSelectForAmbientTemperature();

        //C40003 [NEG]Verify the "Next" button is disabled when "No" is selected for "Confirm cryopreserved apheresis product cassette(s) were not exposed to ambient temperature greater than 3 minutes." toggle.
        regressionManufacturingSteps.productReceipt.selectNoForAmbientTemperature();

        //C40004 [POS]Verify the "Next" button enabled when "No" is selected for "Confirm cryopreserved apheresis product cassette(s) were not exposed to ambient temperature greater than 3 minutes." toggle and fill "Details" input field with valid reason.	
        regressionManufacturingSteps.productReceipt.selectNoForAmbientTemperatureWithDetailsData()

        //C40005 [NEG] Verify the "Next" button should remain disabled when "Was the tamper evident seal in place on the cassette rack?" toggle is not selected.
        regressionManufacturingSteps.productReceipt.noSelectForSealInPlace();

        //C40011 [NEG]Verify the "Next" button is disabled when "No" is selected for "Was the tamper evident seal in place on the cassette rack?" toggle.
        regressionManufacturingSteps.productReceipt.selectNoForSealInPlace();

        //C40007 [POS]Verify the "Next" button enabled when "No" is selected for "Was the tamper evident seal in place on the cassette rack?" toggle and fill "Details" input field with valid reason. 
        regressionManufacturingSteps.productReceipt.selectNoForSealInPlaceWithDetailsData();

        //C40008 [NEG] Verify the "Next" button should remain disabled when "Is each bag and cassette in the expected condition (e.g. no cassette damage, label adhered)? If ..." toggle is not selected.
        regressionManufacturingSteps.productReceipt.noSelectForExpectedCondition();

        //C40012 [NEG]Verify the "Next" button is disabled when "No" is selected for "Is each bag and cassette in the expected condition (e.g. no cassette damage, label adhered)? If ..." toggle. 
        regressionManufacturingSteps.productReceipt.selectNoForExpectedCondition();

        //C40010 [POS]Verify the "Next" button enabled when "No" is selected for "Is each bag and cassette in the expected condition (e.g. no cassette..." toggle and fill "Details" input field with valid reason.	
        regressionManufacturingSteps.productReceipt.selectNoForExpectedConditionWithDetailsData();

        //C40013 [NEG] Verify the "Next" button should remain disabled when "Is the bag free from cracks, openings, or other..." to
        regressionManufacturingSteps.productReceipt.noSelectForFreeFromCracks();

        //C40014 [NEG]Verify the "Next" button is disabled when "No" is selected for "Is the bag free from cracks, openings, or other ..." toggle. 	
        regressionManufacturingSteps.productReceipt.selectNoForFreeFromCracks();

        //C40015 [POS]Verify the "Next" button enabled when "No" is selected for "Is the bag free from cracks, openings..." toggle and fill "Details" input field with valid reaso
        regressionManufacturingSteps.productReceipt.selectNoForFreeFromCracksWithDetailsData();

        //C40016 [NEG] Verify the "Next" button should remain disabled when "Has the cryopreserved apheresis product been placed into storage as per..." toggle is not selected.
        regressionManufacturingSteps.productReceipt.noSelectForPlacedIntoStorage();

        //C40017 [NEG]Verify the "Next" button is disabled when "No" is selected for "Has the cryopreserved apheresis product been placed into storage as per..." toggle. 
        regressionManufacturingSteps.productReceipt.selectNoForPlacedIntoStorage();

        //C40018 [POS]Verify the "Next" button enabled when "No" is selected for "Has the cryopreserved apheresis product been placed into storage as per..." toggle and fill "Details" input field with valid reason.
        regressionManufacturingSteps.productReceipt.selectNoForPlacedIntoStorageDetailsData();

        //C40019 [POS] Verify the data is saved upon clicking 'Save & Close' button on product receipt page.
        regressionManufacturingSteps.productReceipt.saveAndClose();
    });

    it('Product Receipt Summary', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope, therapy);
        regressionManufacturingSteps.productReceiptSummary.previousHappyPathSteps(scope, therapy);
       
        //C32031 [NEG] Verify the 'Next' button should be disabled on Product Receipt Summary page.
        regressionManufacturingSteps.productReceiptSummary.nextButtonDisabledNeg();

        //C32032 [POS] Verify the 'Next' button should be enabled on Product Receipt Summary page after the user signs the signatures.
        regressionManufacturingSteps.productReceiptSummary.nextButtonEnabled();

        //C32037 [Manual] Checking signature document on the Product Receipt Summary page
        regressionManufacturingSteps.productReceiptSummary.manualCheckSignatureDocument();
    });

    it('Manufacturing Start', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope, therapy);
        regressionManufacturingSteps.manufacturingStart.previousHappyPathSteps(scope, therapy);

        //C32038 [NEG] Verify the 'Next' button should be disabled on Manufacturing Start page.
        regressionManufacturingSteps.manufacturingStart.nextButtonDisabledNeg();

        //C32039 [NEG] Verify the confirmed checkbox is unticked.
        regressionManufacturingSteps.manufacturingStart.checkboxUnticked();

        //C32041 [POS] Verify the 'Next' button should be enabled after the confirmed checkbox is ticked.
        regressionManufacturingSteps.manufacturingStart.nextButtonAfterTicking();
    });

   it('select Expiry Data', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope, therapy);
        regressionManufacturingSteps.selectExpiryData.previousHappyPathSteps(scope, therapy);

        //[NEG] Verify the 'Next' button should be disabled on Select Expiry Date page. 
        regressionManufacturingSteps.selectExpiryData.dataNotEntered();

        //[NEG] Verify the expiry date with invalid dates 
        regressionManufacturingSteps.selectExpiryData.invalidDateEntered();

        //[POS] Verify the expiry date with valid dates 
        regressionManufacturingSteps.selectExpiryData.validDateEntered();

        //[POS] Verify the number of bags be a valid number 
        regressionManufacturingSteps.selectExpiryData.validNumberOfBagsEntered();

        //[NEG] Verify the number of bags with a invalid number 
        regressionManufacturingSteps.selectExpiryData.invalidNumberOfBagsEntered();

        //[POS] Verify the 'Next' button should be enabled after all the correct data is entered on the Select Expiry Date page. 
        regressionManufacturingSteps.selectExpiryData.dateAndBagConfirmed();

        //[POS] Verify the data is saved upon clicking 'Save & Close' button on Select Expiry Date page. 
        regressionManufacturingSteps.selectExpiryData.dataOnSaveAndClose();
    });
      
    it('confirm Expiry Data', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope, therapy);
        regressionManufacturingSteps.confirmExpiryData.previousHappyPathSteps(scope, therapy);

        //[NEG] Verify the 'Next' button should be disabled on Confirm Expiry Date page. 
        regressionManufacturingSteps.confirmExpiryData.signatureNotDone();

        //[POS] Verify the 'Sign To Confirm' button for Confirmer should be enabled on Confirm Expiry Date page 
        regressionManufacturingSteps.confirmExpiryData.signForConfirmerEnabled();

        //[NEG] Verify the 'Sign To Confirm' button for Verifier should be disabled on Confirm Expiry Date page 
        regressionManufacturingSteps.confirmExpiryData.signForVerifierDisabled();

        // [POS] Verify that it should ask to resign the signatures if any changes are made on the Select Expiry Date page. 
        regressionManufacturingSteps.confirmExpiryData.askToResign();

        // [POS] Verify the 'Next' button should be enabled on the Confirm Expiry Date page after the user signs the signatures. 
        regressionManufacturingSteps.confirmExpiryData.checkNextButtonWithSignature();
    });

    it('Print Final Product Labels', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope, therapy);

        regressionManufacturingSteps.printFinalProductLabels.previousHappyPathSteps(scope, therapy);

        //C38494 [POS] Verify if the 'Print Labels' button is clickable.
        regressionManufacturingSteps.printFinalProductLabels.printLablesClickable();

        //C38495 [NEG] Verify the 'Next' button should be disabled when 'Confirm labels are printed successfully' checkbox is not checked.
        regressionManufacturingSteps.printFinalProductLabels.confirmPrintLabelNeg();

        //C38496[POS] Verify the 'Next' button should be enabled after clicking on the 'Confirmed' checkbox on Print final product labels page. 
        regressionManufacturingSteps.printFinalProductLabels.confirmPrintLabelPos();

        //C38497 [Neg] Verify the 'Sign To Confirm' button should be appear and 'Next' button should be disabled.[BUG]
        regressionManufacturingSteps.printFinalProductLabels.signToConfirmAppearNextDisabledNeg();

        //C38498 [POS] Verify the data is saved upon clicking 'Save & Close ' button 
        regressionManufacturingSteps.printFinalProductLabels.checkForInfoSaved(scope);
    });

    it('confirmation Of Label ApplicationPart1', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope, therapy);
        regressionManufacturingSteps.confirmationOfLabelApplication.previousHappyPathSteps(scope, therapy);

        //C38536 [NEG] Verify the 'Next' button should be disabled on Confirmation of label application page 
        regressionManufacturingSteps.confirmationOfLabelApplication.nextButtonDisabledNeg();

        //C38543 [NEG]Verify if Nothing is selected from 'label size attached to bag', next button is disabled
        regressionManufacturingSteps.confirmationOfLabelApplication.noOptionSelectedNeg();

        //C38537 [POS] Verify if the '30ML' buttons is selected ,Next button is Enabled 
        regressionManufacturingSteps.confirmationOfLabelApplication.thirtyMLButtonSelectedPos();

        //C38538 [POS]Verify if the '70ML' buttons is selected ,Next button is Enabled 
        regressionManufacturingSteps.confirmationOfLabelApplication.seventyMLButtonSelectedPos();

        //C38539 [NEG] Verify if the confirmed checkbox is unticked and 30 ml is selected ,next button should be disabled 
        regressionManufacturingSteps.confirmationOfLabelApplication.checkboxUncheckedThirtyMLSelectedNeg();

        //C38540[NEG] Verify if the confirmed checkbox is unticked and 70 ml is selected, next button should be disabled 
        regressionManufacturingSteps.confirmationOfLabelApplication.checkboxUncheckedSeventyMLSelectedNeg();

        //C38541 [POS] Verify 'Next' button should be enabled on confirmation of label application page after filling all the right details. 
        regressionManufacturingSteps.confirmationOfLabelApplication.rightDetailsPos();

        //C38542 [POS] Verify the data is saved upon clicking 'Save & Close ' button
        regressionManufacturingSteps.confirmationOfLabelApplication.checkForInfoSaved(scope);
    });

    it('Confirmation of Label Application (Part 2)', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope, therapy);
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.previousHappyPathSteps(scope, therapy);

        //C32069 [NEG] Verify the 'Next' button should be disabled on Confirmation of label application page
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.checkNextButtonDisabled();

        //C32070 [NEG] Verify the 'Confirm' button is disabled for 'Scan or enter the COI with bag identifier on bag 1.' 
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmButtonDisabledforCoiBag();

        //C32071 [NEG] Verify the 'Confirm' button is disabled for 'Scan or enter the COI with bag identifier on cassette 1.'
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmButtonDisbaledForCassette();

        //C32072 [NEG] Verify the 'Confirm' button is enabled for 'Scan or enter the COI with bag identifier on bag 1.'
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmButtonEnabledForCoiBag();

        //C32073 [NEG] Verify the 'Confirm' button is enabled for 'Scan or enter the COI with bag identifier on cassette 1.'
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmButtonEnabledForcassette();

        //C39702 [NEG] Verify the 'Next' button should remain disabled if invalid input is given for 'Scan or enter the COI with bag identifier on bag 1.'
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.invalidDataForCoiBag();

        //C39703 [NEG] Verify the 'Next' button should remain disabled if invalid input is given for 'Scan or enter the COI with bag identifier on cassette 1.'
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.invalidDataForCassette();

        //C32074 [NEG] Verify the confirmed checkbox is unticked. 
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmCheckboxUnchecked();

        //C32075 [POS] Verify the confirmed checkbox is ticked. 
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmCheckboxChecked();

        //C32077 [POS] Verify the data is saved upon clicking 'Save & Close ' button
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.saveAndClose();
    });

    it('quality Release', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionManufacturingSteps.qualityRelease.previousHappyPathSteps(scope, therapy);

        // [NEG] Verify the 'Next' button should be disabled on the quality release page. 
        regressionManufacturingSteps.qualityRelease.nextButtonDisabledNeg();

        // [NEG] Verify the 'Next' button should be enabled when 'I verify that this product is approved to ship.' checkbox is checked. 
        regressionManufacturingSteps.qualityRelease.nextButtonAfterTicking();

        // [POS] Verify the 'Sign To Confirm' button should be enabled after clicking on the 'Next' button 
        regressionManufacturingSteps.qualityRelease.signButtonEnabledAfterClickingNext();

        // [POS] Verify after signing the page, the 'Next' button should be enabled again. 
        regressionManufacturingSteps.qualityRelease.nextButtonAfterSignature();
    });

    it('bag Selection', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionManufacturingSteps.bagSelection.previousHappyPathSteps(scope, therapy);

        // [NEG] Verify that next button should be disabled if none of the toggle is selected.         
        regressionManufacturingSteps.bagSelection.nextButtonDisabledNeg();

        // [NEG} Verify that the next button is disabled if 'do no ship' toggle has been selected.
        regressionManufacturingSteps.bagSelection.doNotShipBag();
        
        // [NEG} Verify that 'Next' button is disabled until 'Ship' toggle is selected. 
        regressionManufacturingSteps.bagSelection.shipBag();

        // [POS] Verify the data is saved upon clicking 'Save & Close ' button 
        regressionManufacturingSteps.bagSelection.saveAndClosePos();
    });

    it('Transfer Product To Shipper', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionManufacturingSteps.transferProductToShipper.previousHappyPathSteps(scope, therapy);

        // [NEG] Verify if the 'Next' button is disabled when COI number for 'Scan or enter the COI with bag identifier on cassette 1' is not confirmed and all other fields are filled.
        regressionManufacturingSteps.transferProductToShipper.negCoiNotEnteredForBagIdentifier();

        // [NEG] Verify if the 'Next' button is disabled when COI number for 'Scan or enter the COI number on the shipper label' is not confirmed and all other fields are filled.
        regressionManufacturingSteps.transferProductToShipper.negCoiNotEnteredForShipperLabel();

        // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the shipping container case intact?...." and all other questions are answered.
        regressionManufacturingSteps.transferProductToShipper.negToggleIsShippingContainerIntact();

        // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the shipping container case intact?..." and all other questions are answered.
        regressionManufacturingSteps.transferProductToShipper.negNothingSelectedForIsShippingContainer();

        // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the shipping container case intact?..." and 'Details' are entered.
        regressionManufacturingSteps.transferProductToShipper.posToggleIsShippingContainerIntact();

        // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Was there a temperature out-of-range...." and all other questions are answered.
        regressionManufacturingSteps.transferProductToShipper.negToggleWasThereATemperature();

        // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Was there a temperature out-of-range...." and all other questions are answered.
        regressionManufacturingSteps.transferProductToShipper.negNothingSelectedForWasThereATemperature();

        // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Was there a temperature out-of-range...." and 'Details' are entered.
        regressionManufacturingSteps.transferProductToShipper.posToggleWasThereATemperature();

        // [POS] Verify if the data is retained after clicking 'Save & Close' button.
        regressionManufacturingSteps.transferProductToShipper.posSaveAndCloseButtonCheck();
    });

    it('Shipping Manufacturing', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionManufacturingSteps.shippingManufacturing.previousHappyPathSteps(scope, therapy);

        // [NEG] Verify if the 'Next' button is disabled until the air waybill number for "Please enter air waybill number for shipment" is not confirmed and all other questions and fields are answered and filled.
        regressionManufacturingSteps.shippingManufacturing.negAirWaybillNotConfirmed();

        // [NEG] Verify if the 'Next' button is disabled until the "Subject Number on air waybill" input field is left empty and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negSubjectNumberOnAirWaybillNotEntered(scope);

        // [NEG] Verify if the 'Next' button is disabled until the EVO-IS Number for "Please enter the last 4-digits of the EVO-IS Number..." is not entered and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negEvoIsNumberFieldLeftEmpty();

        // [NEG] Verify if the 'Next' button is disabled until the Tamper Seal Number for "Please enter the Tamper Seal Number on LN2 shipper lid" is not entered and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negTamperSealNumberFieldLeftEmpty();

        // [NEG]Verify if 'Next' button is disabled when none of the checklist questions are answered and input fields are also not filled.
        regressionManufacturingSteps.shippingManufacturing.posNextButtonCheckWithAllDetailsEntered();

        // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Confirm investigational product cassette(s)...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negToggleConfirmInvestigational();

        // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Confirm investigational product cassette(s)...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negNothingSelectedForConfirmInvestigational();

        // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Confirm investigational product cassette(s)...." and 'Details' are entered.
        regressionManufacturingSteps.shippingManufacturing.posToggleConfirmInvestigational();

        // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the red wire tamper seal labeled...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negToggleIsRedWireTamperSeal();

        // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the red wire tamper seal labeled...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negNothingSelectedForIsRedWireTamperSeal();

        // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the red wire tamper seal labeled...." and 'Details' are entered.
        regressionManufacturingSteps.shippingManufacturing.posToggleIsRedWireTamperSeal();

        // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Does the EVO-IS Number listed on the Air Waybill...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negToggleDoesEvoIsNumberListed();

        // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Does the EVO-IS Number listed on the Air Waybill...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negNothingSelectedForDoesEvoIsNumberListed();

        // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Does the EVO-IS Number listed on the Air Waybill...." and 'Details' are entered.
        regressionManufacturingSteps.shippingManufacturing.posToggleDoesEvoIsNumberListed();

        // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the red wire tamper seal in place...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negToggleIsTamperSealInPlace();

        // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the red wire tamper seal in place...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negNothingSelectedForIsTamperSealInPlace();

        // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the red wire tamper seal in place...." and 'Details' are entered.
        regressionManufacturingSteps.shippingManufacturing.posToggleIsTamperSealInPlace();

        // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Does the Tamper Seal Number listed on the Air Waybill...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negToggleDoesTamperSealNumberListed();

        // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Does the Tamper Seal Number listed on the Air Waybill...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negNothingSelectedForDoesTamperSealNumber();

        // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Does the Tamper Seal Number listed on the Air Waybill...." and 'Details' are entered.
        regressionManufacturingSteps.shippingManufacturing.posToggleDoesTamperSealNumberListed();

        // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the shipper label(s) included...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negToggleIsShipperLabelsIncluded();

        // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the shipper label(s) included...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negNothingSelectedForIsShipperLabelsIncluded();

        // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the shipper label(s) included...." and 'Details' are entered.
        regressionManufacturingSteps.shippingManufacturing.posToggleIsShipperLabelsIncluded();

        // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the Consignee kit pouch included...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negToggleIsConsigneeKitPouch();

        // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the Consignee kit pouch included...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negNothingSelectedForIsConsigneeKitPouch();

        // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the Consignee kit pouch included...." and 'Details' are entered.
        regressionManufacturingSteps.shippingManufacturing.posToggleIsConsigneeKitPouch();

        // [NEG] Verify the EVO-IS Number on the LN2 shipper lid with incorrect data (it should take only 4 digits number)
        regressionManufacturingSteps.shippingManufacturing.negInvalidEvoIsNumberCheck();

        // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the shipping container secured?" and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negToggleIsShippingContainerSecured();

        // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the shipping container secured?" and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negNothingSelectedForIsShippingContainer();

        // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the shipping container secured?" and 'Details' are entered.
        regressionManufacturingSteps.shippingManufacturing.posToggleIsShippingContainerSecured();

        // [POS] Verify if the data is retained after clicking 'Save & Close' button.
        regressionManufacturingSteps.shippingManufacturing.posSaveAndCloseButtonCheck();
    });

    it('Shipping Manufacturing Summary', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionManufacturingSteps.shippingManufacturingSummary.previousHappyPathSteps(scope, therapy);

        // [POS] Verify if the 'Edit' button next to "Condition Of Shipment" is working.
        regressionManufacturingSteps.shippingManufacturingSummary.posCheckForEditButtonWorking();

        // [NEG] Verify if the 'Done' button is disabled after confirmer's signature is signed.
        regressionManufacturingSteps.shippingManufacturingSummary.negDoneButtonCheck();

        // [POS] Verify if the 'Done' button is enabled after verifier's signature is signed.
        regressionManufacturingSteps.shippingManufacturingSummary.posDoneButtonCheck();

        // [POS] Verify if the data is retained after clicking 'Save & Close' button.
        regressionManufacturingSteps.shippingManufacturingSummary.posSaveAndCloseButtonCheck();

        // [POS] Verify that it should ask to resign the signatures if any changes are made on the Shipping Manufacturing Summary page.
        regressionManufacturingSteps.shippingManufacturingSummary.posReasonForChangePopUp();
    });
})
