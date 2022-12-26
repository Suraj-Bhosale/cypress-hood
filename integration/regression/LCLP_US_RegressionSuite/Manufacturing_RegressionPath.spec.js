import regressionOrderingSteps from '../../../utils/Regression_steps/LCLP_US_RegressionPath/ordering_steps'
import regressionCollectionSteps from '../../../utils/Regression_steps/LCLP_US_RegressionPath/collection_steps'
import regressionManufacturingSteps from '../../../utils/Regression_steps/LCLP_US_RegressionPath/manufacturing_steps'
import regressionInfusionSteps from '../../../utils/Regression_steps/LCLP_US_RegressionPath/infusion_steps'
import regressionCommonHappyPath from '../../../utils/Regression_steps/LCLP_US_RegressionPath/common_happyPath_steps'
import order_steps from '../../../utils/HappyPath_steps/LCLP_US_HappyPath/ordering_steps'
import collection_steps from '../../../utils/HappyPath_steps/LCLP_US_HappyPath/collection_steps'
import manufacturing_steps from '../../../utils/HappyPath_steps/LCLP_US_HappyPath/manufacturing_steps';
import commonHappyPath from "../../../utils/Regression_steps/LCLP_US_RegressionPath/common_happyPath_steps"
import therapies from '../../../fixtures/therapy.json';
import inputHelpers from '../../../utils/shared_block_helpers/inputFieldCheckHelpers'

context('LCLP US Therapy Manufacturing Regression Path', () => {
    const scope = {};
    const therapy = therapies.lclp_us

    beforeEach(() => {
        cy.clearCookies();
        order_steps.orderingData(scope);
        regressionCommonHappyPath.commonAliases();
    });

    it('Check Status Of Manufacturing Module', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);

        regressionManufacturingSteps.checkStatusesOfManufacturingModule(scope, therapy)
    });

    it('Collection Status', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);

        // C21904 [POS]View Document button should be Enabled
        regressionManufacturingSteps.collectionStatus.viewDocumentButtonsEnabled();
    });


    it('Verify Shipper ', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionManufacturingSteps.verifyShipper.previousHappyPathSteps(scope, therapy);

        //C21900 [NEG] Verify the 'Next' button should be disabled if the COI is not Enterd
        regressionManufacturingSteps.verifyShipper.coiempty();

        //C25746 [NEG] Verify if Next button is disable functionality of Invalid values for Coi Is entered.
        regressionManufacturingSteps.verifyShipper.checkWithInvalidCoiValues();

        //C21912 [POS] Verify the 'Next' button should be enabled  after the COI number is confirmed 
        regressionManufacturingSteps.verifyShipper.coiConfirmed();

        //C33783 [POS] Verify that all the information is saved upon clicking Next. 
        regressionManufacturingSteps.verifyShipper.checkForTheInfoSaved();

        //C33785 [POS] Verify if 'Back' button is working. 
        regressionManufacturingSteps.verifyShipper.checkForBackButton()
    });

    it('Shipment Receipt Checklist', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
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
        regressionManufacturingSteps.shipmentReceiptChecklistSummary.previousHappyPathSteps(scope, therapy);

        // [NEG] Verify the 'Next' button should be disabled on Shipment Receipt Checklist Summary page.
        // [POS] Verify the 'Next' button should be enabled only if the confirmer and verifier signature are signed on Shipment Receipt Checklist Summary page.
        regressionManufacturingSteps.shipmentReceiptChecklistSummary.nextButtonCheckWithOrWithoutSignature();

        // [POS]  Verify that it should ask to resign the signatures if any changes are made on the shipment receipt checklist page.
        regressionManufacturingSteps.shipmentReceiptChecklistSummary.posAskToResign();
    });

    it('Transfer Product to Intermediary Part1', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy)
        regressionManufacturingSteps.transferProducttoIntermediaryOrFinalLN2StoragePart1.previousHappyPathSteps(scope, therapy)

        //C26764 [NEG] Verify the 'Next' button should be disabled on Transfer Product to Intermediary or Final LN2 Storage page
        regressionManufacturingSteps.transferProducttoIntermediaryOrFinalLN2StoragePart1.nextButtonDisabled()

        //C26765 [NEG] Verify if the 'Confirm' button is disabled for 'Scan the COI on the LN2 shipper'
        regressionManufacturingSteps.transferProducttoIntermediaryOrFinalLN2StoragePart1.checkConfirmButtonDisabledForLN2Shipper()

        //C21951 [NEG] Verify if the 'Confirm' button is disabled for 'Scan the COI on the cassette label'
        regressionManufacturingSteps.transferProducttoIntermediaryOrFinalLN2StoragePart1.checkConfirmButtonDisabledForCassetteLabel()

        //C21952 [NEG] Verify if the 'Confirm' button is disabled for 'Scan the COI on the bag'
        regressionManufacturingSteps.transferProducttoIntermediaryOrFinalLN2StoragePart1.checkConfirmButtonDisabledForCoiOnTheBag()

        //C25755 [NEG] Verify "Scan the COI on the LN2 shipper" Confirm button when no/invalid data is filled
        regressionManufacturingSteps.transferProducttoIntermediaryOrFinalLN2StoragePart1.checkInvalidDataForLN2Shipper()

        //C25756 [NEG] Verify "Scan the COI on the cassette label" Confirm button when no/invalid data is filled
        regressionManufacturingSteps.transferProducttoIntermediaryOrFinalLN2StoragePart1.checkInvalidDataForCassetteLabel()

        //C25757 [NEG] Verify "Scan the COI on the bag" Confirm button when no/invalid data is filled
        regressionManufacturingSteps.transferProducttoIntermediaryOrFinalLN2StoragePart1.checkInvalidDataForBag()

        //C21953 [POS] Verify if the 'Confirm' button is enabled for 'Scan the COI on the LN2 shipper'
        regressionManufacturingSteps.transferProducttoIntermediaryOrFinalLN2StoragePart1.checkConfirmButtonEnabledForLN2Shipper()

        //C21954 [POS] Verify if the 'Confirm' button is enabled for 'Scan the COI on the cassette label'
        regressionManufacturingSteps.transferProducttoIntermediaryOrFinalLN2StoragePart1.checkConfirmButtonEnabledForCassetteLabel()

        //C21955 [POS] Verify if the 'Confirm' button is enabled for 'Scan the COI on the bag'
        regressionManufacturingSteps.transferProducttoIntermediaryOrFinalLN2StoragePart1.checkConfirmButtonEnabledForCoiOnTheBag()

        //C21956 [POS] Verify the 'Next' button should be enabled if all the COI's are entered and confirmed    
        regressionManufacturingSteps.transferProducttoIntermediaryOrFinalLN2StoragePart1.scanAndConfirmAllCoi()

        //C21958 [POS] Verify the data is saved after clicking 'Save & Close' button on Transfer Product to Intermediary or Final LN2 Storage page.
        regressionManufacturingSteps.transferProducttoIntermediaryOrFinalLN2StoragePart1.saveAndClose()
    })

    it('transfer Product to Intermediary Part2', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy)
        regressionManufacturingSteps.transferProducttoIntermediaryOrFinalLN2StoragePart2.previousHappyPathSteps(scope, therapy)

        //C21959 [POS] Verify the 'Next' button should be enabled on Transfer Product to Intermediary or Final LN2 Storage page     //passing
        regressionManufacturingSteps.transferProducttoIntermediaryOrFinalLN2StoragePart2.nextButtonEnabled()

        //C21962 [NEG] Verify if the 'Confirm' button is disabled for 'Scan the COI on the LN2 shipper'
        regressionManufacturingSteps.transferProducttoIntermediaryOrFinalLN2StoragePart2.checkConfirmButtonDisabledForLN2Shipper()

        //C21963 [NEG] Verify if the 'Confirm' button is disabled for 'Scan the COI on the cassette label'
        regressionManufacturingSteps.transferProducttoIntermediaryOrFinalLN2StoragePart2.checkConfirmButtonDisabledForCassette()

        //C21964 [POS] Verify if the 'Confirm' button is enabled for 'Scan the COI on the cassette label'
        regressionManufacturingSteps.transferProducttoIntermediaryOrFinalLN2StoragePart2.checkConfirmButtonEnabledForCassette()

        //C21965 [POS] Verify if the 'Confirm' button is enabled for 'Scan the COI on the LN2 shipper'
        regressionManufacturingSteps.transferProducttoIntermediaryOrFinalLN2StoragePart2.checkConfirmButtonEnabledForLN2Shipper()

        //C25758 [NEG] Verify "Scan the COI on the cassette label" Confirm button when no/invalid data is filled        
        regressionManufacturingSteps.transferProducttoIntermediaryOrFinalLN2StoragePart2.checkInvalidDataForCassette()

        //C25759 [NEG] Verify "Scan or enter the COI on the LN2 shipper label" Confirm button when no/invalid data is filled
        regressionManufacturingSteps.transferProducttoIntermediaryOrFinalLN2StoragePart2.checkInvalidDataForLN2Shipper()
    });

    it('product Receipt', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionManufacturingSteps.productReceipt.previousHappyPathSteps(scope, therapy);

        // [NEG]Verify with invalid data and if the 'next' button is disabled incase of 'Subject number on air waybill.' field left empty 
        regressionManufacturingSteps.productReceipt.subjectNumberNeg();

        // [NEG]Verify if the 'next' button remains disabled if a positive option for "Confirm cryopreserved apheresis product cassette(s) were not exposed to ambient temperature greater than 3 minutes." is not being selected and kept empty 
        regressionManufacturingSteps.productReceipt.ambientTemperatureToggleNeg(scope);

        // [POS] Verify if the 'Next' button is enabled when 'NO' toggle button is selected for the question "Confirm cryopreserved apheresis product cassette(s) were not exposed .." and '' details "are entered. 
        regressionManufacturingSteps.productReceipt.ambientTemperatureTogglePos();

        // [NEG]Verify if the 'next' button remains disabled if a positive option for "Was the tamper evident seal in place on the cassette rack?" is not being selected and kept empty 
        regressionManufacturingSteps.productReceipt.sealInPlaceToggleNeg();

        // [POS] Verify if the 'Next' button is enabled when 'NO' toggle button is selected for the question "Was the tamper evident seal in place on the cassette rack?." and '' details "are entered. 
        regressionManufacturingSteps.productReceipt.sealInPlaceTogglePos();

        // [NEG]Verify if the 'next' button remains disabled if a positive option for "Is each bag and cassette in the expected condition (e.g. no cassette damage, label adhered)? If bag(s) or cassette(s) is not in expected" is not being selected and kept empty 
        regressionManufacturingSteps.productReceipt.expectedConditionToggleNeg();

        // [POS] Verify if the 'Next' button is enabled when 'NO' toggle button is selected for the question "Is each bag and cassette in the expected condition (e.g. no cassette damage, label adhered)? If bag(s) or cassette(s) is." and '' details "are entered. 
        regressionManufacturingSteps.productReceipt.expectedConditionTogglePos();

        // [NEG]Verify if the 'next' button remains disabled if a positive option for "Is the bag free from cracks, openings, or other visible damage that could potentially compromise the integrity of the material? If bag(s" is not being selected and kept empty 
        regressionManufacturingSteps.productReceipt.freeFromCracksToggleNeg();

        // [POS] Verify if the 'Next' button is enabled when 'NO' toggle button is selected for the question "Is the bag free from cracks, openings, or other visible damage that could potentially compromise the integrity of the mat" and '' details "are entered. 
        regressionManufacturingSteps.productReceipt.freeFromCracksTogglePos();

        // [NEG]Verify if the 'next' button remains disabled if a positive option for "Has the cryopreserved apheresis product been placed into storage as per the cassette label: Store at ≤-120°C (-184°F), vapor phase of li" is not being selected and kept empty 
        regressionManufacturingSteps.productReceipt.placedIntoStorageToggleNeg();

        // [POS] Verify if the 'Next' button is enabled when 'NO' toggle button is selected for the question "Has the cryopreserved apheresis product been placed into storage as per the cassette label: Store at ≤-120°C (-184°F), va" and '' details "are entered. 
        regressionManufacturingSteps.productReceipt.placedIntoStorageTogglePos();

        // [POS] Verify the data is saved upon clicking 'Save & Close' button on product receipt page. 
        regressionManufacturingSteps.productReceipt.saveAndClosePos();


    });

    it('product Receipt Summary', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionManufacturingSteps.productReceiptSummary.previousHappyPathSteps(scope, therapy)

        // [NEG] Verify the 'Next' button should be disabled until the signature is signed and enabled once the signature is signed. 
        regressionManufacturingSteps.productReceiptSummary.verifySignaturePos();

    });

    it('manufacturing Start', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionManufacturingSteps.manufacturingStart.previousHappyPathSteps(scope, therapy);

        // [NEG] Verify the confirmed checkbox is unticked. 
        regressionManufacturingSteps.manufacturingStart.checkboxNeg();

        //[POS] Verify the data is saved upon clicking 'Save & Close' button on Manufacturing Start page. 
        regressionManufacturingSteps.manufacturingStart.saveAndClosePos();
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

        //C22021 [POS] Verify if the 'Print Labels' button is clickable.
        regressionManufacturingSteps.printFinalProductLabels.printLablesClickable();

        //C22022 [NEG] Verify the 'Next' button should be disabled when 'Confirm labels are printed successfully' checkbox is not checked.
        regressionManufacturingSteps.printFinalProductLabels.confirmPrintLabelNeg();

        //C22023[POS] Verify the 'Next' button should be enabled after clicking on the 'Confirmed' checkbox on Print final product labels page. 
        regressionManufacturingSteps.printFinalProductLabels.confirmPrintLabelPos();

        //C22024 [Neg] Verify the 'Sign To Confirm' button should be appear and 'Next' button should be disabled.[BUG]
        regressionManufacturingSteps.printFinalProductLabels.signToConfirmAppearNextDisabledNeg();

        //C22025 [POS] Verify the data is saved upon clicking 'Save & Close ' button 
        regressionManufacturingSteps.printFinalProductLabels.checkForInfoSaved(scope)
    });

    it('confirmation Of Label ApplicationPart1', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionManufacturingSteps.confirmationOfLabelApplication.previousHappyPathSteps(scope, therapy);

        //C38205 [NEG]Verify if Nothing is selected from 'label size attached to bag', next button is disabled
        regressionManufacturingSteps.confirmationOfLabelApplication.noOptionSelectedNeg();

        //C22028 [POS]Verify if the '70ML' buttons is selected ,Next button is Enabled 
        regressionManufacturingSteps.confirmationOfLabelApplication.seventyMLButtonSelectedPos();

        //C22029 [NEG] Verify if the confirmed checkbox is unticked and 30 ml is selected ,next button should be disabled 
        regressionManufacturingSteps.confirmationOfLabelApplication.checkboxUncheckedThirtyMLSelectedNeg();

        //C22030 [NEG] Verify if the confirmed checkbox is unticked and 70 ml is selected, next button should be disabled 
        regressionManufacturingSteps.confirmationOfLabelApplication.checkboxUncheckedSeventyMLSelectedNeg();

        //C22032 [POS] Verify the data is saved upon clicking 'Save & Close ' button
        regressionManufacturingSteps.confirmationOfLabelApplication.checkForInfoSaved(scope);

    });

    it('confirmation Of Label Application Part2', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.previousHappyPathSteps(scope, therapy);

        //C22034 [NEG] Verify the 'Confirm' button is disabled for 'Scan or enter the COI with bag identifier on bag 1.'
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmButtonDisabledforCoiBag();

        //C22035 [NEG] Verify the 'Confirm' button is disabled for 'Scan or enter the COI with bag identifier on cassette 1.'
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmButtonDisbaledForCassette();

        //C22036 [NEG] Verify the 'Confirm' button is enabled for 'Scan or enter the COI with bag identifier on bag 1.'
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmButtonEnabledForCoiBag();

        //C22037 [NEG] Verify the 'Confirm' button is enabled for 'Scan or enter the COI with bag identifier on cassette 1.'
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmButtonEnabledForcassette();

        //C39046 [NEG] Verify the 'Next' button should remain disabled if invalid input is given for 'Scan or enter the COI with bag identifier on bag 1.'
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.invalidDataForCoiBag();

        //C39047 [NEG] Verify the 'Next' button should remain disabled if invalid input is given for 'Scan or enter the COI with bag identifier on cassette 1.'
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.invalidDataForCassette();

        //C22038 [NEG] Verify the 'Next' button remain diabled if checkbox is not checked.
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmCheckboxUnchecked();

        //C22039 [POS] Verify the 'Next' button enabled if checkbox is checked.
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmCheckboxChecked();

        //C22041 [POS] Verify the data is saved upon clicking 'Save & Close ' button
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
});