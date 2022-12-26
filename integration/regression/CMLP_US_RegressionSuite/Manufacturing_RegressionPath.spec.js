import regressionOrderingSteps from '../../../utils/Regression_steps/CMLP_US_RegressionPath/ordering_steps'
import regressionCollectionSteps from '../../../utils/Regression_steps/CMLP_US_RegressionPath/collection_steps'
import regressionManufacturingSteps from '../../../utils/Regression_steps/CMLP_US_RegressionPath/manufacturing_steps'
import regressionInfusionSteps from '../../../utils/Regression_steps/CMLP_US_RegressionPath/infusion_steps'
import regressionCommonHappyPath from '../../../utils/Regression_steps/CMLP_US_RegressionPath/common_happyPath_steps'
import order_steps from '../../../utils/HappyPath_steps/CMLP_US_HappyPath/ordering_steps'
import collection_steps from '../../../utils/HappyPath_steps/CMLP_US_HappyPath/collection_steps'
import manufacturing_steps from '../../../utils/HappyPath_steps/CMLP_US_HappyPath/manufacturing_steps';
import commonHappyPath from "../../../utils/Regression_steps/CMLP_US_RegressionPath/common_happyPath_steps"
import therapies from '../../../fixtures/therapy.json';

context('CMLP US Therapy Manufacturing Regression Path', () => {
    const scope = {};
    const therapy = therapies.cmlp_us
    const region = therapy.region;


    beforeEach(() => {
        cy.clearCookies();
        order_steps.orderingData(scope);
        regressionCommonHappyPath.commonAliases();
    });

    it('Check Status Of Manufacturing Module', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionManufacturingSteps.checkStatusesOfManufacturingModule(scope, therapy)
    });

    it('manufacturing Start', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);

        // [NEG] Verify the confirmed checkbox is unticked. 
        regressionManufacturingSteps.manufacturingStart.checkboxNeg();

        //[POS] Verify the data is saved upon clicking 'Save & Close' button on Manufacturing Start page. 
        regressionManufacturingSteps.manufacturingStart.saveAndClosePos();
    });

    it('Select Expiry Data', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionManufacturingSteps.selectExpiryData.previousHappyPathSteps();

        //[NEG] Verify the expiry date with invalid dates 
        regressionManufacturingSteps.selectExpiryData.negExpiryDate()

        //[NEG] Verify the number of bags with a invalid number
        regressionManufacturingSteps.selectExpiryData.negNumberOfBags()

        //[NEG] Verify 'Enter the Lot that the product is occupying' with empty field. 
        regressionManufacturingSteps.selectExpiryData.negEmptyLot()

        //[POS] Verify the data is saved upon clicking 'Save & Close' button on Select Expiry Date page.
        regressionManufacturingSteps.selectExpiryData.saveAndClosePos()

    });

    it('Confirm Expiry Data', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionManufacturingSteps.confirmExpiryData.previousHappyPathSteps();

        //[POS] Verify the 'Next' button should be disabled until the signatures is signed and enabled once the signature is signed. 
        regressionManufacturingSteps.confirmExpiryData.verifySignaturePos()

        //	[POS] Verify that it should ask to resign the signatures if any changes are made on the Select Expiry Date page. 
        regressionManufacturingSteps.confirmExpiryData.posAskToResign()

        //[POS] Verify the data is saved upon clicking 'Save & Close' button on Confirm Expiry Date page. 
        regressionManufacturingSteps.confirmExpiryData.saveAndClosePos()
    });

    it('Print Final Product Labels', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionManufacturingSteps.printFinalProductLabels.previousHappyPathSteps();

        //[POS] Verify Print Labels button should send request to print labels on Print final product labels page 
        regressionManufacturingSteps.printFinalProductLabels.PosPrintLabelMessage()

        //[NEG] Verify the 'Next' button should be disabled when 'Confirm labels are printed successfully' checkbox is not checked. 
        regressionManufacturingSteps.printFinalProductLabels.confirmPrintLabelNeg()

        //	[POS] Verify the signature on the Print Final Product Labels page.
        regressionManufacturingSteps.printFinalProductLabels.verifySignaturePos()

        //[POS] Verify the data is saved upon clicking 'Save & Close ' button
        regressionManufacturingSteps.printFinalProductLabels.saveAndClosePos()
    });

    it('confirmation Of Label ApplicationPart1', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionManufacturingSteps.confirmationOfLabelApplication.previousHappyPathSteps();


        //[NEG] Verify that "Next" button is disabled when checkbox is unchecked 
        regressionManufacturingSteps.confirmationOfLabelApplication.checkboxNeg();

        // [NEG]Verify that next button is disabled when "Select label size attached to bag." field kept empty 
        regressionManufacturingSteps.confirmationOfLabelApplication.noOptionSelectedRadioButtonNeg();

        // [POS] Verify that "Next" button is enabled when '70ML' radio button was selected on the confirmation of label application page 
        regressionManufacturingSteps.confirmationOfLabelApplication.seventyMLButtonSelectedPos();

        //C22032 [POS] Verify the data is saved upon clicking 'Save & Close ' button
        regressionManufacturingSteps.confirmationOfLabelApplication.saveAndClosePos();

    });

    it('confirmation Of Label Application Part2', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.previousHappyPathSteps();

        // [NEG]Verify with invalid data and if the 'next' button is disabled incase of ' 'Scan or enter the COI with bag identifier on bag 1.' field left empty' 
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.negBagId();

        // [NEG]Verify with invalid data and if the 'next' button is disabled incase of 'Scan or enter the COI with bag identifier on cassette 1.' field kept empty 
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.cassetteNeg();

        // [NEG] Verify that "Next" button is disabled when checkbox is unticked. 
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.checkboxNeg();

        // [POS] Verify the data is saved upon clicking 'Save & Close ' button 
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.saveAndClosePos();
    });

    it('quality Release', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionManufacturingSteps.qualityRelease.previousHappyPathSteps();

        // [NEG] Verify the 'Next' button should be disabled when 'I verify that this product is approved to ship.' checkbox is not checked. 
        regressionManufacturingSteps.qualityRelease.checkBoxNeg();

        // [POS] Verify Next button should be disabled before signing the page and Should be enabled once the signature is done. 
        regressionManufacturingSteps.qualityRelease.checkNextButtonWithAndWithoutSignature();

        // [POS] Verify the data is saved upon clicking 'Save & Close ' button 
        regressionManufacturingSteps.qualityRelease.saveAndClosePos();
    });

    
    it('bag Selection', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionManufacturingSteps.bagSelection.previousHappyPathSteps();

        //	[POS] Verify if we do not select any option for Bag1,'Next' button will be disable
        regressionManufacturingSteps.bagSelection.noOptionSelected();

        //[NEG} Verify if we 'do not ship' bag , 'Next' button will be disabled. 
        regressionManufacturingSteps.bagSelection.doNotShipBag();

        // [POS] Verify the data is saved upon clicking 'Save & Close ' button 
        regressionManufacturingSteps.bagSelection.saveAndClosePos();
        });

        

        it('Transfer Product To Shipper', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionManufacturingSteps.transferProductToShipper.previousHappyPathSteps();
    
        // [NEG] Verify if the 'Next' button is disabled when COI number for 'Scan or enter the COI with bag identifier on cassette 1' is not confirmed and all other fields are filled.
         regressionManufacturingSteps.transferProductToShipper.invalidBagIdentifier();
    
        // [NEG] Verify if the 'Next' button is disabled when COI number for 'Scan or enter the COI number on the shipper label' is not confirmed and all other fields are filled.
        regressionManufacturingSteps.transferProductToShipper.invalidCoiForShipperLabel();
    
        // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the shipping container case intact?..." and all other questions are answered.
        regressionManufacturingSteps.transferProductToShipper.negNothingSelectedForIsShippingContainer();
    
        // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the shipping container case intact?...." and all other questions are answered.
        regressionManufacturingSteps.transferProductToShipper.negToggleSelectedShippingContainerIntact();
    
        // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the shipping container case intact?..." and 'Details' are entered.
        regressionManufacturingSteps.transferProductToShipper.posToggleIsShippingContainerIntact();
    
        // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Was there a temperature out-of-range...." and all other questions are answered.
        regressionManufacturingSteps.transferProductToShipper.negNothingSelectedForWasThereATemperature();
    
        // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Was there a temperature out-of-range...." and all other questions are answered.
        regressionManufacturingSteps.transferProductToShipper.negToggleWasThereATemperature();
    
        // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Was there a temperature out-of-range...." and 'Details' are entered.
        regressionManufacturingSteps.transferProductToShipper.posToggleWasThereATemperature();
    
        // [POS] Verify if the data is retained after clicking 'Save & Close' button.
        regressionManufacturingSteps.transferProductToShipper.posSaveAndCloseButtonCheck();
        });
        
    
        it('Shipping Manufacturing', () => {
            regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
            regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
            regressionCommonHappyPath.commonSatelliteHappyPath(scope);
            regressionManufacturingSteps.shippingManufacturing.previousHappyPathSteps();
    
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
  
});