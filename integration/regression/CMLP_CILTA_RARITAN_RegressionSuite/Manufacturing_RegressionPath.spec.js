import ordering_steps from '../../../utils/HappyPath_steps/CMLP_CILTA_RARITAN_HappyPath/ordering_steps_cilta';
import commonHappyPath from "../../../utils/Regression_steps/CMLP_CILTA_RARITAN_RegressionPath/common_happyPath_steps";
import regressionmftgSteps from '../../../utils/Regression_steps/CMLP_CILTA_RARITAN_RegressionPath/manufacturing_steps_cilta';
import therapies from '../../../fixtures/therapy.json'
import dayjs from 'dayjs';

context('CMLP CILTA US Therapy Manufacturing Regression Path', () => {
    const scope = {};
    const therapy = therapies.cmlp_cilta
    const region = 'US';
  
    beforeEach(() => {
      cy.clearCookies();
      ordering_steps.orderingData(scope);
      commonHappyPath.commonAliases();
    });  

    it('Manufacturing Data', () => {
      const currentDate = dayjs().add(0, 'day').format('DD-MMM-YYYY');
      const pastDate = dayjs().subtract(1, 'day').format('DD-MMM-YYYY');
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
    
      //C39942 [NEG] Verify that the next button should be disabled if the date filed is kept empty.
      regressionmftgSteps.manufacturingData.emptyDate()

      //C39943 [NEG] Verify that the next button should be disabled if the "lot number" input filed is kept empty
      regressionmftgSteps.manufacturingData.emptyLotNumber(currentDate)

      //C39944 [NEG] Verify that the next button should be disabled if the past date is entered..
      regressionmftgSteps.manufacturingData.invalidDate(pastDate)

      //C39939 Verify if the 'Next button is disabled after the confirmer's signature is signed.
      //C39940 Verify if the 'Next' button is enabled after verifier's signature is signed.
      regressionmftgSteps.manufacturingData.signature(currentDate)

      //C39941 [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.manufacturingData.saveAndClose()

      //C39945 [POS] Verify that the selected data should be retained while switching back from the "Print Final Product Labels" page to "Manufacturing data" page.
      regressionmftgSteps.manufacturingData.retainValue()

    }),

    it('Print Final Product Labels', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      regressionmftgSteps.printFinalProductLabels.previousHappyPathSteps(scope,therapy);

      //C39928 [NEG] Verify if the 'Next' button is disabled until the 'Confirm labels and packing insert(s) are printed successfully' checkbox is not checked.
      //C39929 [POS] Verify if the 'Next' button is enabled after the 'Confirm labels and packing insert(s) are printed successfully' checkbox is checked.
      regressionmftgSteps.printFinalProductLabels.verifyNextButton()

      //C39930 [Verify if the signature block appears after clicking the 'Next' button and also verify the confirmer's signature.
      regressionmftgSteps.printFinalProductLabels.signature()

      //C39931 [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.printFinalProductLabels.saveAndClose()

      //C39933 [POS] Verify that after switching back from ' Bag Selection" page to the "Print Packing inserts" page checkbox should remain the checked.
      regressionmftgSteps.printFinalProductLabels.retainValue()

      });
    
    it('Confirmation Of Label Application', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      regressionmftgSteps.confirmationOfLabelApplication.previousHappyPathSteps(scope,therapy);

      //C39933 [NEG] Verify if the 'Next button is disabled until 'Select bag volume' is not selected and all other fields are filled.
      regressionmftgSteps.confirmationOfLabelApplication.emptyToggle()
      
      //C39934 [NEG] Verify if the 'Next' button is disabled until 'How many bags resulted from today's manufacturing process?' input field is empty and all other fields are filled.
      regressionmftgSteps.confirmationOfLabelApplication.emptyBag()

      //C39935 [NEG] Verify if the 'Next' button is disabled until the checkbox 'Confirm bag labels have been attached to bag' is not checked and all other fields are filled.
      regressionmftgSteps.confirmationOfLabelApplication.checkbox()

      //C39936 [POS] Verify if the 'Next' button is enabled after the checkbox 'Confirm bag labels have been attached to bag' is checked and all other fields are filled.
      regressionmftgSteps.confirmationOfLabelApplication.negativeNumberOfBag()

      //C39937 [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.confirmationOfLabelApplication.saveAndClose()

      //C39938 [POS] Verify that after switching back from ' Bag Selection" page to "Print Packing inserts"  page checkbox should remain the checked
      regressionmftgSteps.confirmationOfLabelApplication.retainValue()

    });

    it('Confirmation Of Label Application part2 ', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      regressionmftgSteps.confirmationOfLabelApplicationPart2.previousHappyPathSteps(scope,therapy);

      //C39947 [NEG] Verify that the green checkmark should be visible when correct coi is entered in the "Scan or enter the COI with bag identifier on cassette 1" field
      regressionmftgSteps.confirmationOfLabelApplicationPart2.cassetteLabel()

      //C39946 [NEG] Verify if the 'Next' button is disabled when COI number for 'Scan or enter the COI with bag identifier on bag 1' is not confirmed and all other fields are filled.
      regressionmftgSteps.confirmationOfLabelApplicationPart2.coiField()

      //C39948 [NEG] Verify if the 'Next' button is disabled until the checkbox 'Confirm bag labels have been attached to bag' is not checked and all other fields are filled.
      regressionmftgSteps.confirmationOfLabelApplicationPart2.checkBox()

      //C39949 [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.confirmationOfLabelApplicationPart2.saveAndClose()

      //C39950 [POS] Verify that the data should be retained while switching back from the "Quality Approval for Shipment" page to "Confirmation Of Label Application " page.
      regressionmftgSteps.confirmationOfLabelApplicationPart2.retainValue()

    });


    it('Quality Release', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      regressionmftgSteps.qualityRelease.previousHappyPathSteps(scope,therapy);

        // [NEG] Verify if the 'Next' button is disabled until the checkbox next to 'I verify that this product is approved to ship' is not checked. 
        regressionmftgSteps.qualityRelease.nextButtonDisabledNeg();

        // [POS] Verify if the 'Next' button is enabled after the 'Confirm labels and packing insert(s) are printed successfully' checkbox is checked. 
        regressionmftgSteps.qualityRelease.nextButtonAfterTicking();

        // [POS] Verify the 'Sign To Confirm' button should be enabled after clicking on the 'Next' button 
        regressionmftgSteps.qualityRelease.signButtonEnabledAfterClickingNext();

        // [POS] Verify if the data is retained after clicking 'Save & Close' button.
        regressionmftgSteps.qualityRelease.saveAndClose();
    });
  
    it('Bag Selection', () => {
        commonHappyPath.commonOrderingHappyPath(scope,therapy);
        commonHappyPath.commonCollectionHappyPath(scope);
        commonHappyPath.commonSatelliteLabHappyPath(scope);
        regressionmftgSteps.bagSelection.previousHappyPathSteps(scope,therapy);

        // [NEG] Verify that next button should be disabled if none of the toggle is selected. 
        regressionmftgSteps.bagSelection.nextButtonDisabledNeg();

        // [NEG} Verify that the next button is disabled if 'do no ship' toggle has been selected.
        regressionmftgSteps.bagSelection.doNotShipBag();

        // [POS] Verify the data is saved upon clicking 'Save & Close ' button 
        regressionmftgSteps.bagSelection.saveAndClosePos();

    });

    it('Transfer Product to Shipper', () => {
        commonHappyPath.commonOrderingHappyPath(scope,therapy);
        commonHappyPath.commonCollectionHappyPath(scope);
        commonHappyPath.commonSatelliteLabHappyPath(scope);
        regressionmftgSteps.transferProductToShipper.previousHappyPathSteps(scope,therapy);

        // [NEG] Verify if the 'Next' button is disabled when COI number for 'Scan or enter the COI with bag identifier on cassette 1' is not confirmed and all other fields are filled. 
        regressionmftgSteps.transferProductToShipper.negCoiNotEnteredForBagIdentifier();

        // [NEG] Verify if the 'Next' button is disabled when COI number for 'Scan or enter the COI number on the shipper label' is not confirmed and all other fields are filled.
        regressionmftgSteps.transferProductToShipper.negCoiNotEnteredForShipperLabel();

        // [POS] Verify the data is saved upon clicking 'Save & Close ' button 
        regressionmftgSteps.transferProductToShipper.posSaveAndCloseButtonCheck();
    });   

    it('Shipping Manufacturing', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      regressionmftgSteps.shippingManufacturing.previousHappyPathSteps(scope,therapy);

      //C36789 [NEG] Verify if the 'Next' button is disabled until the air waybill number for "Please enter air waybill number for shipment" is not confirmed and all other questions and fields are answered and filled.
      regressionmftgSteps.shippingManufacturing.airwayBillNumberBlank();

      //C36790 [NEG] Verify if the 'Next' button is disabled until the order ID for "Please enter Order ID on air waybill" is not confirmed and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.orderIdBlank(scope);

      //C36791 [NEG] Verify if the 'Next' button is disabled until the EVO-IS Number for "Please enter the last 4-digits of the EVO-IS Number..." is not entered and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.evoLast4DigitsBlank();

      //C36792 [NEG] Verify if the 'Next' button is disabled until the Tamper Seal Number for "Please enter the Tamper Seal Number on LN2 shipper lid" is not entered and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.tamperSealNumberumberBlank();

      //C36794 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the shipping container case intact?" and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.shipperCaseIntactNeg();

      //C36793 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the shipping container case intact?..." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.shipperCaseIntactBlank();

      //C36795 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the shipping container case intact?..." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.shipperCaseIntactPos();

      //C36797 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Was there a temperature out-of-range...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.tempOutOfRangeNeg();

      //C36796 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Was there a temperature out-of-range...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.tempOutOfRangeBlank();

      //C36798 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Was there a temperature out-of-range...." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.tempOutOfRangePos();

      //C36800 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Does the EVO-IS Number listed on the Air Waybill...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.airwayBillMatchTamperNeg();

      //C36799 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Does the EVO-IS Number listed on the Air Waybill...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.airwayBillMatchTamperBlank();

      //C36801 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Does the EVO-IS Number listed on the Air Waybill...." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.airwayBillMatchTamperPos();

      //C36803 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Does the Tamper Seal Number listed on the Air Waybill...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.tamperSealMatchNeg();

      //C36802 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Does the Tamper Seal Number listed on the Air Waybill...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.tamperSealMatchBlank();

      //C36804 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Does the Tamper Seal Number listed on the Air Waybill...." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.tamperSealMatchPos();

      //C36806 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Confirm cassette(s) were not exposed...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.cassetteNotExposedNeg();

      //C36805 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Confirm cassette(s) were not exposed...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.cassetteNotExposedBlank();

      //C36807 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Confirm cassette(s) were not exposed...." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.cassetteNotExposedPos();

      //C36809 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the packing insert(s) included...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.packingInsertNeg();

      //C36808 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the packing insert(s) included...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.packingInsertBlank();

      //C36810 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the packing insert(s) included...." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.packingInsertPos();

      //C36812 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the Consignee kit pouch included...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.consigneeKitPouchNeg();

      //C36811 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the Consignee kit pouch included...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.consigneeKitPouchBlank();

      //C36813 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the Consignee kit pouch included...." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.consigneeKitPouchPos();

      //C36815 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the shipping container secured?" and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.shippingContainerSecureNeg();

      //C36814 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the shipping container secured?" and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.shippingContainerSecureBlank();

      //C36816 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the shipping container secured?" and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.shippingContainerSecurePos();

      //C36818 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the red wire tamper seal labeled..." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.redWireSealLabelNeg();

      //C36817 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the red wire tamper seal labeled..." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.redWireSealLabelBlank();

      //C36819 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the red wire tamper seal labeled..." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.redWireSealLabelPos();

      //C36821 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the red wire tamper seal..." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.redWireSealInPlaceNeg();

      //C36820 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the red wire tamper seal..." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.redWireSealInPlaceBlank();

      //C36823 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the red wire tamper seal..." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.redWireSealInPlacePos();

      //C36788 [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.shippingManufacturing.verifySaveAndCloseBtn();
    });

    it('Shipping Manufacturing Summary', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      regressionmftgSteps.shippingManufacturingSummary.previousHappyPathSteps(scope,therapy);

     //C40034	[POS] Verify if the 'Edit' button next to "Condition Of Shipment" is working.
      regressionmftgSteps.shippingManufacturingSummary.verifyEditBtn();

     //C40035 [NEG] Verify if the 'Next' button is disabled after confirmer's signature is signed.
      regressionmftgSteps.shippingManufacturingSummary.checkNextButtonWithoutSignatureNeg();

     //C40036 [POS] Verify if the 'Next' button is enabled after verifier's signature is signed.
      regressionmftgSteps.shippingManufacturingSummary.checkVerifierSignature();

     //C40037	[POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.shippingManufacturingSummary.verifySaveAndCloseBtn();
    });
  
    it('Check Status Of Manufacturing Module', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      regressionmftgSteps.checkStatusesOfManufacturingModule(scope, therapy)
    });
});