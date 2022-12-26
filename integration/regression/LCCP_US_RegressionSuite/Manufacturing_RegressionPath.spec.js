import regressionOrderingSteps from '../../../utils/Regression_steps/LCCP_US_RegressionPath/ordering_steps'
import regressionCollectionSteps from '../../../utils/Regression_steps/LCCP_US_RegressionPath/collection_steps'
import regressionManufacturingSteps from '../../../utils/Regression_steps/LCCP_US_RegressionPath/manufacturing_steps'
import regressionInfusionSteps from '../../../utils/Regression_steps/LCCP_US_RegressionPath/infusion_steps'
import regressionCommonHappyPath from '../../../utils/Regression_steps/LCCP_US_RegressionPath/common_happyPath_steps'
import order_steps from '../../../utils/HappyPath_steps/LCCP_US_HappyPath/ordering_steps'
import collection_steps from '../../../utils/HappyPath_steps/LCCP_US_HappyPath/collection_steps'
import manufacturing_steps from '../../../utils/HappyPath_steps/LCCP_US_HappyPath/manufacturing_steps';
import commonHappyPath from "../../../utils/Regression_steps/LCCP_US_RegressionPath/common_happyPath_steps"
import therapies from '../../../fixtures/therapy.json';
import inputHelpers from '../../../utils/shared_block_helpers/inputFieldCheckHelpers'

context('LCCP US Therapy Manufacturing Regression Path', () => {
    const scope = {};
    const therapy = therapies.lccp_us

    beforeEach(() => {
        cy.clearCookies();
        order_steps.orderingData(scope);
        regressionCommonHappyPath.commonAliases(); 
    });

    it('Check Status Of Manufacturing Module', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);

        regressionManufacturingSteps.checkStatusOfManufacturingModule(scope, therapy)
    });

    it('Collection Status', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);

        // C39980 [POS] Verify the 'view document button enabled for the collection status page. 
        regressionManufacturingSteps.collectionStatus.viewDocumentButtonsEnabled();
    });

    it('Verify Shipper ', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionManufacturingSteps.verifyShipper.previousHappyPathSteps(scope, therapy);

        //C40047 [NEG] Verify the 'Next' button should be disabled if the COI is not entered 
        regressionManufacturingSteps.verifyShipper.coiempty();

        //C40049 [NEG] Verify if Next button is disable functionality of Invalid values for Coi Is entered.
        regressionManufacturingSteps.verifyShipper.checkWithInvalidCoiValues();

        //C40048 [POS] Verify the 'Next' button should be enabled  after the COI number is confirmed 
        regressionManufacturingSteps.verifyShipper.coiConfirmed();

        //C40050 [POS] Verify that all the information is saved upon clicking Next. 
        regressionManufacturingSteps.verifyShipper.checkForTheInfoSaved();

        //C40051 [POS] Verify if 'Back' button is working. 
        regressionManufacturingSteps.verifyShipper.checkForBackButton()
    });

    it('product Receipt Summary', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionManufacturingSteps.selectExpiryData.previousHappyPathSteps(scope, therapy);

        //C32452 [NEG] Verify the 'Next' button should be disabled until the signature is signed and enabled once the signature is signed. 
        regressionManufacturingSteps.productReceiptSummary.verifySignaturePos();
    }),

    it('manufacturing Start', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionManufacturingSteps.selectExpiryData.previousHappyPathSteps(scope, therapy);

        //C32460 [NEG] Verify the confirmed checkbox is unticked. 
        regressionManufacturingSteps.manufacturingStart.checkboxNeg();

        //C32463 [POS] Verify the data is saved upon clicking 'Save & Close' button on Manufacturing Start page. 
        regressionManufacturingSteps.manufacturingStart.saveAndClosePos();
    }),

      
    it('Shipment Receipt Checklist', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionManufacturingSteps.shipmentReceiptChecklist.previousHappyPathSteps(scope, therapy);

        //[NEG] Verify the EVO-IS Number on the LN2 shipper lid with incorrect data (it should take only 4 digits number)
        regressionManufacturingSteps.shipmentReceiptChecklist.invalidFourDigitEvoIsNo();

        //	[NEG] Verify Next button when "Please enter the Tamper Seal Number on LN2 shipper lid" field is kept empty. 
        regressionManufacturingSteps.shipmentReceiptChecklist.invalidTamperSealNo();

        //[NEG] Verify if 'No' is selected for case Container intact toggle , it should ask for a reason. 
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleShippingCaseContainerCaseNeg();

        //	[POS]Verify if 'next' button is enabled after filling reason for No toggle for 'case Container intact' .
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleShippingCaseContaineWithReason();

        // [NEG] Verify if 'No' is selected for Is the shipping container secured? , it should ask for a reason.
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleShippingContainerSecuredNeg();

        //[POS]Verify if 'next' button is enabled after filling reason for No toggle for 'Is the shipping container secured?'' 
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleShippingContainerSecuredWithReason();

        //	[NEG] Verify if 'No' is selected for "Is the shipper label(s) included with the shipper?" , it should ask for a reason. 
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleShipperLabelsNeg();

        //[POS]Verify if 'next' button is enabled after filling reason for No toggle 'Is the shipper label(s) included with the shipper?' 
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleShipperLabelsWithReason();

        //[NEG] Verify if 'No' is selected for"Is the Consignee kit pouch included with the shipper?" , it should ask for a reason.
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleConsigneeKitPouchNeg();

        //	[POS]Verify if 'next' button is enabled after filling reason for No toggle for 'Is the Consignee kit pouch included with the shipper?"' 
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleConsigneeKitPouchWithReason();

        //[NEG] Verify if 'No' is selected for"Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?", it should ask for a 
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleEvoIsNumberNeg();

       //	[POS]Verify if 'next' button is enabled after filling reason for No toggle for '"Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?".' 	
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleEvoIsNumberwithReason();

         //[NEG] Verify if 'No' is selected for "Is the Red Wire Tamper Seal in place for the LN2 shipper lid?" , it should ask for a reason. 
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleRedWireTamperSealNeg();

        //[POS]Verify if 'next' button is enabled after filling reason for No toggle for 'Is the Red Wire Tamper Seal in place for the LN2 shipper lid?"'
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleRedWireTamperSealwithReason();

        //[NEG] Verify if 'No' is selected for "Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?" , it should ask for a reason. 		
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleTamperSealNumberNeg();

        //	[POS]Verify if 'next' button is enabled after filling reason for No toggle for 'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal 
        regressionManufacturingSteps.shipmentReceiptChecklist.toggleTamperSealNumberWithReason();

        //	[POS] Verify the data is saved after clicking 'Save & Close' button on shipment receipt checklist page. 
        regressionManufacturingSteps.shipmentReceiptChecklist.saveAndClosePos();

        //	[POS] Verify that a reason for change is asked upon changing values. 
        regressionManufacturingSteps.shipmentReceiptChecklist.reasonForChangeOnChangingValuePos();
    });

    it('Shipment Receipt Checklist Summary', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionManufacturingSteps.shipmentReceiptChecklistSummary.previousHappyPathSteps();

        // [NEG] Verify the 'Next' button should be disabled until the signature is signed and enabled once the signature is signed.
        regressionManufacturingSteps.shipmentReceiptChecklistSummary.nextButtonCheckWithOrWithoutSignature();

        // 	[POS] Verify the 'Next' button if it is disabled after changes are made on the shipment receipt checklist page using back button.
        regressionManufacturingSteps.shipmentReceiptChecklistSummary.posAskToResign();
    });

    it('Transfer Product to Intermediary or Final LN2 Storage (Part 1)', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.previousHappyPathSteps();

        //C32426 [NEG] Verify the 'Next' button should be disabled on Transfer Product to Intermediary or Final LN2 Storage page
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.nextButtonDisabled();

        //C32427 [NEG] Verify if the 'Confirm' button is disabled for 'Scan the COI on the LN2 shipper'
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.checkConfirmButtonDisabledForLN2Shipper();

        //C32428 [NEG] Verify if the 'Confirm' button is disabled for 'Scan the COI on the cassette label'
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.checkConfirmButtonDisabledForCassetteLabel();

        //C32429 [NEG] Verify if the 'Confirm' button is disabled for 'Scan the COI on the bag'
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.checkConfirmButtonDisabledForCoiOnTheBag();

        //C32435 [NEG] Verify "Scan the COI on the LN2 shipper" Confirm button when no/invalid data is filled
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.checkInvalidDataForLN2Shipper();

        //C32436 [NEG] Verify "Scan the COI on the cassette label" Confirm button when no/invalid data is filled
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.checkInvalidDataForCassetteLabel();

        //C32437 [NEG] Verify "Scan the COI on the bag" Confirm button when no/invalid data is filled
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.checkInvalidDataForBag();

        //C32430 [POS] Verify if the 'Confirm' button is enabled for 'Scan the COI on the LN2 shipper'
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.checkConfirmButtonEnabledForLN2Shipper();

        //C32431 [POS] Verify if the 'Confirm' button is enabled for 'Scan the COI on the cassette label'
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.checkConfirmButtonEnabledForCassetteLabel();

        //C32432 [POS] Verify if the 'Confirm' button is enabled for 'Scan the COI on the bag'
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.checkConfirmButtonEnabledForCoiOnTheBag();

        //C32433 [POS] Verify the 'Next' button should be enabled if all the COI's are entered and confirmed  
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.scanAndConfirmAllCoi();

        //C32434 [POS] Verify the data is saved after clicking 'Save & Close' button on Transfer Product to Intermediary or Final LN2 Storage page.
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart1.saveAndClose();
    });

    it('Transfer Product to Intermediary or Final LN2 Storage (Part 2)', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart2.previousHappyPathSteps();

        //C32438 [POS] Verify the 'Next' button should be enabled on Transfer Product to Intermediary or Final LN2 Storage page
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart2.nextButtonEnabled();

        //C32439 [NEG] Verify if the 'Confirm' button is disabled for 'Scan the COI on the LN2 shipper'
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart2.checkConfirmButtonDisabledForLN2Shipper();

        //C32440 [NEG] Verify if the 'Confirm' button is disabled for 'Scan the COI on the cassette label'
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart2.checkConfirmButtonDisabledForCassette();

        //C32441 [POS] Verify if the 'Confirm' button is enabled for 'Scan the COI on the cassette label'
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart2.checkConfirmButtonEnabledForCassette();

        //C32442 [POS] Verify if the 'Confirm' button is enabled for 'Scan the COI on the LN2 shipper'
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart2.checkConfirmButtonEnabledForLN2Shipper();

        //C32443 [NEG] Verify "Scan the COI on the cassette label" Confirm button when no/invalid data is filled       
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart2.checkInvalidDataForCassette();

        //C32444 [NEG] Verify "Scan or enter the COI on the LN2 shipper label" Confirm button when no/invalid data is filled
        regressionManufacturingSteps.transferProductToIntermediaryOrFinalLN2StoragePart2.checkInvalidDataForLN2Shipper();
    });

    it('Product Receipt', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionManufacturingSteps.productReceipt.previousHappyPathSteps();

        //C40933 [NEG]Verify with invalid data and if the 'next' button is disabled incase of 'Subject number on air waybill.' field left empty 
        regressionManufacturingSteps.productReceipt.subjectNumberNeg();

        //C40934 [NEG]Verify if the 'next' button remains disabled if a positive option for "Confirm cryopreserved apheresis product cassette(s) were not exposed to ambient temperature greater than 3 minutes." is not being selected and kept empty 
        regressionManufacturingSteps.productReceipt.ambientTemperatureToggleNeg(scope);

        //C40940 [POS] Verify if the 'Next' button is enabled when 'NO' toggle button is selected for the question "Confirm cryopreserved apheresis product cassette(s) were not exposed .." and '' details "are entered. 
        regressionManufacturingSteps.productReceipt.ambientTemperatureTogglePos();

        //C40936 [NEG]Verify if the 'next' button remains disabled if a positive option for "Was the tamper evident seal in place on the cassette rack?" is not being selected and kept empty 
        regressionManufacturingSteps.productReceipt.sealInPlaceToggleNeg();

        //C40941 [POS] Verify if the 'Next' button is enabled when 'NO' toggle button is selected for the question "Was the tamper evident seal in place on the cassette rack?." and '' details "are entered. 
        regressionManufacturingSteps.productReceipt.sealInPlaceTogglePos();

        //C40937 [NEG]Verify if the 'next' button remains disabled if a positive option for "Is each bag and cassette in the expected condition (e.g. no cassette damage, label adhered)? If bag(s) or cassette(s) is not in expected" is not being selected and kept empty 
        regressionManufacturingSteps.productReceipt.expectedConditionToggleNeg();

        //C40942 [POS] Verify if the 'Next' button is enabled when 'NO' toggle button is selected for the question "Is each bag and cassette in the expected condition (e.g. no cassette damage, label adhered)? If bag(s) or cassette(s) is." and '' details "are entered. 
        regressionManufacturingSteps.productReceipt.expectedConditionTogglePos();

        //C40938 [NEG]Verify if the 'next' button remains disabled if a positive option for "Is the bag free from cracks, openings, or other visible damage that could potentially compromise the integrity of the material? If bag(s" is not being selected and kept empty 
        regressionManufacturingSteps.productReceipt.freeFromCracksToggleNeg();

        //C40942 [POS] Verify if the 'Next' button is enabled when 'NO' toggle button is selected for the question "Is the bag free from cracks, openings, or other visible damage that could potentially compromise the integrity of the mat" and '' details "are entered. 
        regressionManufacturingSteps.productReceipt.freeFromCracksTogglePos();

        //C40939 [NEG]Verify if the 'next' button remains disabled if a positive option for "Has the cryopreserved apheresis product been placed into storage as per the cassette label: Store at ≤-120°C (-184°F), vapor phase of li" is not being selected and kept empty 
        regressionManufacturingSteps.productReceipt.placedIntoStorageToggleNeg();

        //C40944 [POS] Verify if the 'Next' button is enabled when 'NO' toggle button is selected for the question "Has the cryopreserved apheresis product been placed into storage as per the cassette label: Store at ≤-120°C (-184°F), va" and '' details "are entered. 
        regressionManufacturingSteps.productReceipt.placedIntoStorageTogglePos();

        //C40935 [POS] Verify the data is saved upon clicking 'Save & Close' button on product receipt page. 
        regressionManufacturingSteps.productReceipt.saveAndClosePos();
    });

    it('select Expiry Data', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionManufacturingSteps.selectExpiryData.previousHappyPathSteps(scope, therapy);

        //[NEG] Verify the 'Next' button should be disabled on Select Expiry Date page. 
        regressionManufacturingSteps.selectExpiryData.dataNotEntered();

        //[NEG] Verify the expiry date with invalid dates 
        regressionManufacturingSteps.selectExpiryData.invalidDateEntered();

        //[POS] Verify the expiry date with valid dates 
        regressionManufacturingSteps.selectExpiryData.validDateEntered();

        //[POS] Verify the number of bags be a valid number 
        regressionManufacturingSteps.selectExpiryData.validNumberOfBagsEntered()

        //[NEG] Verify the number of bags with a invalid number 
        regressionManufacturingSteps.selectExpiryData.invalidNumberOfBagsEntered()

        //[POS] Verify the 'Next' button should be enabled after all the correct data is entered on the Select Expiry Date page. 
        regressionManufacturingSteps.selectExpiryData.dateAndBagConfirmed()

        //[POS] Verify the data is saved upon clicking 'Save & Close' button on Select Expiry Date page. 
        regressionManufacturingSteps.selectExpiryData.dataOnSaveAndClose()
    });

    it('confirm Expiry Data', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
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
        regressionManufacturingSteps.printFinalProductLabels.previousHappyPathSteps(scope, therapy);

        //C40122 [POS] Verify if the 'Print Labels' button is clickable.
        regressionManufacturingSteps.printFinalProductLabels.printLablesClickable();

        //C40123 [NEG] Verify the 'Next' button should be disabled when 'Confirm labels are printed successfully' checkbox is not checked.
        regressionManufacturingSteps.printFinalProductLabels.confirmPrintLabelNeg();

        //C40124 [POS] Verify the 'Next' button should be enabled after clicking on the 'Confirmed' checkbox on Print final product labels page. 
        regressionManufacturingSteps.printFinalProductLabels.confirmPrintLabelPos();

        //C40125 [Neg] Verify the 'Sign To Confirm' button should be appear and 'Next' button should be disabled.[BUG]
        regressionManufacturingSteps.printFinalProductLabels.signToConfirmAppearNextDisabledNeg();

        //C40126 [POS] Verify the data is saved upon clicking 'Save & Close ' button 
        regressionManufacturingSteps.printFinalProductLabels.checkForInfoSaved(scope)
    });

    it('confirmation Of Label ApplicationPart1', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
       regressionManufacturingSteps.confirmationOfLabelApplication.previousHappyPathSteps(scope, therapy);

        //C40131 [NEG]Verify if Nothing is selected from 'label size attached to bag', next button is disabled
        regressionManufacturingSteps.confirmationOfLabelApplication.noOptionSelectedNeg();

        //C40127 [POS]Verify if the '70ML' buttons is selected ,Next button is Enabled 
        regressionManufacturingSteps.confirmationOfLabelApplication.seventyMLButtonSelectedPos();

        //C40128 [NEG] Verify if the confirmed checkbox is unticked and 30 ml is selected ,next button should be disabled 
        regressionManufacturingSteps.confirmationOfLabelApplication.checkboxUncheckedThirtyMLSelectedNeg();

        //C40129 [NEG] Verify if the confirmed checkbox is unticked and 70 ml is selected, next button should be disabled 
        regressionManufacturingSteps.confirmationOfLabelApplication.checkboxUncheckedSeventyMLSelectedNeg();

        //C40130 [POS] Verify the data is saved upon clicking 'Save & Close ' button
        regressionManufacturingSteps.confirmationOfLabelApplication.checkForInfoSaved(scope);
    });   
    
    it('Confirmation of Label Application (Part 2)', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.previousHappyPathSteps(scope, therapy);

         //C32491 [NEG] Verify the 'Confirm' button is disabled for 'Scan or enter the COI with bag identifier on bag 1.' 
         regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmButtonDisabledforCoiBag();

         //C32492 [NEG] Verify the 'Confirm' button is disabled for 'Scan or enter the COI with bag identifier on cassette 1.' 
         regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmButtonDisbaledForCassette();
 
         //C32493 [NEG] Verify the 'Confirm' button is enabled for 'Scan or enter the COI with bag identifier on bag 1.' 
         regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmButtonEnabledForCoiBag();
 
         //C32494 [NEG] Verify the 'Confirm' button is enabled for 'Scan or enter the COI with bag identifier on cassette 1.'
         regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmButtonEnabledForcassette();

         //C40931 [NEG] Verify the 'Next' button should remain disabled if invalid input is given for 'Scan or enter the COI with bag identifier on bag 1.' 
         regressionManufacturingSteps.confirmationOfLabelApplicationPart2.invalidDataForCoiBag();
 
         //C40932 [NEG] Verify the 'Next' button should remain disabled if invalid input is given for 'Scan or enter the COI with bag identifier on cassette 1.'
         regressionManufacturingSteps.confirmationOfLabelApplicationPart2.invalidDataForCassette();
 
         //C32495 [NEG] Verify the confirmed checkbox is unticked.
         regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmCheckboxUnchecked();
 
         //C32496 [POS] Verify the confirmed checkbox is ticked. 
         regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmCheckboxChecked();
 
         //C32498 [POS] Verify the data is saved upon clicking 'Save & Close ' button
         //regressionManufacturingSteps.confirmationOfLabelApplicationPart2.saveAndClose();
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

        // [NEG] Verify the 'Next' button should be disabled on the Bag Selection page 
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
        regressionManufacturingSteps.transferProductToShipper.previousHappyPathSteps(scope, therapy);

        // [POS] Verify  'Scan or enter the COI bag identifier on Cassette 1.' field for Invalid values.
        regressionManufacturingSteps.transferProductToShipper.invalidBagIdentifier();

        // [POS] Verify 'Scan or enter the COI number on the shipper label' field for invalid values.
        regressionManufacturingSteps.transferProductToShipper.invalidCoiForShipperLabel();

        // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the shipping container case intact?..." and all other questions are answered.
        regressionManufacturingSteps.transferProductToShipper.negNothingSelectedForIsShippingContainer();

        // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the shipping container case intact?...." and all other questions are answered.
        regressionManufacturingSteps.transferProductToShipper.negToggleSelectedShippingContainerIntact();

        // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the shipping container case intact?..." and 'Details' are entered.
        regressionManufacturingSteps.transferProductToShipper.posToggleIsShippingContainerIntact();

        // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Was there a temperature out-of-range...." and all other questions are answered.
        regressionManufacturingSteps.transferProductToShipper.negNothingSelectedForWasThereATemperature();

        // [NEG] Verify if the 'Next' button is disabled when 'YES' toggle button is selected for the question "Was there a temperature out-of-range...." and all other questions are answered.
        regressionManufacturingSteps.transferProductToShipper.negToggleWasThereATemperature();

        // [POS] Verify if the 'Next' button is enabled when all other questions are answered, 'YES' toggle button is selected for the question "Was there a temperature out-of-range...." and 'Details' are entered.
        regressionManufacturingSteps.transferProductToShipper.posToggleWasThereATemperature();

        // [POS] Verify if the data is retained after clicking 'Save & Close' button.
        regressionManufacturingSteps.transferProductToShipper.posSaveAndCloseButtonCheck();
    });

    it('Shipping Manufacturing', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionManufacturingSteps.shippingManufacturing.previousHappyPathSteps(scope, therapy);

        // [NEG] Verify if the 'Next' button is disabled until the air waybill number for "Please enter air waybill number for shipment" is not confirmed and all other questions and fields are answered and filled.
        regressionManufacturingSteps.shippingManufacturing.negAirWaybillNotConfirmed();

        // [NEG] Verify if the 'Next' button is disabled until the "Subject Number on air waybill" input field is left empty and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negSubjectNumberOnAirWaybillNotEntered(scope);

        // [NEG] Verify if the 'Next' button is disabled until the EVO-IS Number for "Please enter the last 4-digits of the EVO-IS Number..." is not entered and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.invalidEvoIsNumber();

        // [NEG] Verify if the 'Next' button is disabled until the Tamper Seal Number for "Please enter the Tamper Seal Number on LN2 shipper lid" is not entered and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negTamperSealNumberFieldLeftEmpty();

        // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Confirm investigational product cassette(s)...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negNothingSelectedForConfirmInvestigational();

         // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Confirm investigational product cassette(s)...." and all other questions are answered.
         regressionManufacturingSteps.shippingManufacturing.negToggleConfirmInvestigational();

        // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Confirm investigational product cassette(s)...." and 'Details' are entered.
        regressionManufacturingSteps.shippingManufacturing.posToggleConfirmInvestigational();

        // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the red wire tamper seal labeled...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negNothingSelectedForIsRedWireTamperSeal();

        // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the red wire tamper seal labeled...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negToggleIsRedWireTamperSeal();

        // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the red wire tamper seal labeled...." and 'Details' are entered.
        regressionManufacturingSteps.shippingManufacturing.posToggleIsRedWireTamperSeal();

        // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Does the EVO-IS Number listed on the Air Waybill...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negNothingSelectedForDoesEvoIsNumberListed();

        // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Does the EVO-IS Number listed on the Air Waybill...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negToggleDoesEvoIsNumberListed();

        // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Does the EVO-IS Number listed on the Air Waybill...." and 'Details' are entered.
        regressionManufacturingSteps.shippingManufacturing.posToggleDoesEvoIsNumberListed();

        // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the red wire tamper seal in place...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negNothingSelectedForIsTamperSealInPlace();

        // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the red wire tamper seal in place...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negToggleIsTamperSealInPlace();

        // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the red wire tamper seal in place...." and 'Details' are entered.
        regressionManufacturingSteps.shippingManufacturing.posToggleIsTamperSealInPlace();

        // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Does the Tamper Seal Number listed on the Air Waybill...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negNothingSelectedForDoesTamperSealNumber();

        // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Does the Tamper Seal Number listed on the Air Waybill...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negToggleDoesTamperSealNumberListed();

        // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Does the Tamper Seal Number listed on the Air Waybill...." and 'Details' are entered.
        regressionManufacturingSteps.shippingManufacturing.posToggleDoesTamperSealNumberListed();

         // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the shipper label(s) included...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negNothingSelectedForIsShipperLabelsIncluded();

        // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the shipper label(s) included...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negToggleIsShipperLabelsIncluded();

        // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the shipper label(s) included...." and 'Details' are entered.
        regressionManufacturingSteps.shippingManufacturing.posToggleIsShipperLabelsIncluded();

        // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the Consignee kit pouch included...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negNothingSelectedForIsConsigneeKitPouch();

        // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the Consignee kit pouch included...." and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negToggleIsConsigneeKitPouch()

        // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the Consignee kit pouch included...." and 'Details' are entered.
        regressionManufacturingSteps.shippingManufacturing.posToggleIsConsigneeKitPouch();

        // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the shipping container secured?" and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negNothingSelectedForIsShippingContainer();

        // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the shipping container secured?" and all other questions are answered.
        regressionManufacturingSteps.shippingManufacturing.negToggleIsShippingContainerSecured();

        // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the shipping container secured?" and 'Details' are entered.
        regressionManufacturingSteps.shippingManufacturing.posToggleIsShippingContainerSecured();

        // [POS] Verify if the data is retained after clicking 'Save & Close' button.
        regressionManufacturingSteps.shippingManufacturing.posSaveAndCloseButtonCheck();
    });
    
    it('Shipping Manufacturing Summary', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
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