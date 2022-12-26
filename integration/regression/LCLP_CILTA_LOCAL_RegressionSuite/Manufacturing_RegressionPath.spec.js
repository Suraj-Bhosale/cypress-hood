

import ordering_steps from '../../../utils/HappyPath_steps/LCLP_CILTA_LOCAL_HappyPath/ordering_steps_cilta';
import commonHappyPath from "../../../utils/Regression_steps/LCLP_CILTA_LOCAL_RegressionPath/common_happyPath_steps"
import regressionmftgSteps from '../../../utils/Regression_steps/LCLP_CILTA_LOCAL_RegressionPath/manufacturing_steps_cilta'
import therapies from '../../../fixtures/therapy.json'
import dayjs from 'dayjs';
import input from '../../../fixtures/inputs.json';


context('LCLP US Therapy Manufacturing Regression Path', () => {
    const scope = {};
    const therapy = therapies.lclp_cilta
    const region = 'US';
  
    beforeEach(() => {
      cy.clearCookies();
      ordering_steps.orderingData(scope);
      commonHappyPath.commonAliases();
    });
  
    it('Verify Shipper', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      regressionmftgSteps.verifyShipper.previousHappyPathSteps();
  
      //C38646 [POS] Verify the 'Next' button without entering data in "Scan or enter the COI Number found on the LN2 packing insert" field.
      regressionmftgSteps.verifyShipper.coiNumberPositive();
  
      //C38647 [NEG] Verify "Scan or enter the COI Number found on the LN2 packing insert" field with negative data.
      regressionmftgSteps.verifyShipper.coiNumberNegative();
  
      //C38648 [POS] Verify if the data is retained upon clicking 'Back' button from next step.
      regressionmftgSteps.verifyShipper.dataSavingWithBackButtonPositive();
    });

    
    it('Shipment Receipt Checklist', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      regressionmftgSteps.shippingReceiptChecklist.previousHappyPathSteps(therapy);

      //C25284 [POS] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the shipping container case intact?..." and all other questions are answered.
      regressionmftgSteps.shippingReceiptChecklist.shippingContainerIntactTogglePositive(input.evoLast4Digits, input.tamperSealNumber);

      //C25279 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the shipping container case intact?...and all other questions are answered'
      regressionmftgSteps.shippingReceiptChecklist.shippingContainerIntactToggleNegative();

      //C26461 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the shipping container case intact?... and 'Details' are entered.
      regressionmftgSteps.shippingReceiptChecklist.shippingContainerIntactToggleWithDataPositive();

      //C25289 [POS] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the shipping container secured?' and all other questions are answered.
      regressionmftgSteps.shippingReceiptChecklist.shippingContainerSecuredTogglePositive(input.evoLast4Digits, input.tamperSealNumber);

      //C25288 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the shipping container secured?' and all other questions are answered.
      regressionmftgSteps.shippingReceiptChecklist.shippingContainerSecuredToggleNegative();

      //C26462 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the shipping container secured?' and 'Details' are entered.
      regressionmftgSteps.shippingReceiptChecklist.shippingContainerSecuredToggleWithDataPositive();

      //C25290 [POS] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the packing insert included with the shipper?' and all other questions are answered.
      regressionmftgSteps.shippingReceiptChecklist.packingInsertTogglePositive(input.evoLast4Digits, input.tamperSealNumber);

      //C25286 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the packing insert included with the shipper?' and all other questions are answered.
      regressionmftgSteps.shippingReceiptChecklist.packingInsertToggleNegative();

      //C26463 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the packing insert included with the shipper?' and 'Details' are entered.
      regressionmftgSteps.shippingReceiptChecklist.packingInsertToggleWithDataPositive();

      //C25285 [POS] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the Consignee pouch included with the shipper?' and all other questions are answered.
      regressionmftgSteps.shippingReceiptChecklist.consigneePouchTogglePositive(input.evoLast4Digits, input.tamperSealNumber);

      //C25316 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the Consignee pouch included with the shipper?' and all other questions are answered.
      regressionmftgSteps.shippingReceiptChecklist.consigneePouchToggleNegative();

      //C26464 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the Consignee pouch included with the shipper?' and 'Details' are entered.
      regressionmftgSteps.shippingReceiptChecklist.consigneePouchToggleWithDataPositive();

      //C25322 [POS] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the Red Wire Tamper Seal in place for the LN2 shipper lid?' and all other questions are answered.
      regressionmftgSteps.shippingReceiptChecklist.redWireTampeTogglePositive(input.evoLast4Digits, input.tamperSealNumber);

      //C25321 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the Red Wire Tamper Seal in place for the LN2 shipper lid?' and all other questions are answered.
      regressionmftgSteps.shippingReceiptChecklist.redWireTampeToggleNegative();

      //C26465 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the Red Wire Tamper Seal in place for the LN2 shipper lid?' and 'Details' are entered.
      regressionmftgSteps.shippingReceiptChecklist.redWireTampeToggleWithDataPositive();

      //C25146 [POS] Verify if the 'Next' button is disabled until 'EVO-IS Number on the LN2 shipper lid' input field is left empty and all other fields are filled.
      regressionmftgSteps.shippingReceiptChecklist.evoIsNumberInputPositive(input.tamperSealNumber);

      //C38654 [NEG] Verify if the 'Next' button is disabled after giving negative data in  'EVO-IS Number on the LN2 shipper lid' input field.
      regressionmftgSteps.shippingReceiptChecklist.evoIsNumberInputNegative();

      //C25324 [POS] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Does the EVO-IS Number listed on the Air Waybill....? and all other questions are answered.'
      regressionmftgSteps.shippingReceiptChecklist.evoIsNumberTogglePositive(input.evoLast4Digits, input.tamperSealNumber);

      //C25323 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Does the EVO-IS Number listed on the Air Waybill.....?' and all other questions are answered.
      regressionmftgSteps.shippingReceiptChecklist.evoIsNumberToggleNegative();

      //C26466 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Does the EVO-IS Number listed on the Air Waybill.....?' and 'Details' are entered.
      regressionmftgSteps.shippingReceiptChecklist.evoIsNumberToggleWithDataPositive();
      
      //C25147 [POS] Verify if the 'Next' button is disabled until 'Tamper Seal Number on LN2 shipper lid' input field is left empty and all other fields are filled.
      regressionmftgSteps.shippingReceiptChecklist.tamperSealNoPositive(input.evoLast4Digits);

      //C25326 [POS] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Does the Tamper Seal Number listed on the Air Waybill....? and all other questions are answered.' 
      regressionmftgSteps.shippingReceiptChecklist.tamperSealMatchTogglePositive(input.evoLast4Digits, input.tamperSealNumber);

      //C25325 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Does the Tamper Seal Number listed on the Air Waybill...?' and all other questions are answered.
      regressionmftgSteps.shippingReceiptChecklist.tamperSealMatchToggleNegative();

      //C26467 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Does the Tamper Seal Number listed on the Air Waybill...?' and 'Details' are entered.
      regressionmftgSteps.shippingReceiptChecklist.tamperSealMatchToggleWithDataPositive();

      //C25438 [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.shippingReceiptChecklist.dataSavingWithSaveAndClosePositive(input.evoLast4Digits, input.tamperSealNumber);

      //C38653 [POS] Verify if the data is retained after clicking 'Back' button from next step.
      regressionmftgSteps.shippingReceiptChecklist.dataSavingWithBackButtonPositive(input.evoLast4Digits, input.tamperSealNumber);
    }),

    it('Shipment Receipt Checklist Summary', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      regressionmftgSteps.shipmentReceiptChecklistSummary.previousHappyPathSteps(input.evoLast4Digits,therapy,input.tamperSealNumber);

      //C38832 [POS] Verify if the 'Next' button is disabled after confirmer's signature is signed.
      regressionmftgSteps.shipmentReceiptChecklistSummary.checkNextButtonWithoutSignaturePositive();

      //C38833 [POS] Verify if the 'Next' button is enabled after verifier's signature is signed.
      regressionmftgSteps.shipmentReceiptChecklistSummary.checkVerifierSignature();
    });

    it('Transfer Product to Intermediary or Final LN2 Storage', () => {
      regressionmftgSteps.transferProductToIntermediary.previousHappyPathSteps(scope,therapy);

      //C39825 [NEG] Verify that the Next button should be disabled if "Enter the DIN/SEC-DIS/Apheresis ID for Cryopreservation Bag" filed is kept empty.
      regressionmftgSteps.transferProductToIntermediary.negativeDin()

      //C39824 [NEG] Verify that the Next button should be disabled if "Enter the DIN/SEC-DIS/Apheresis ID for Cryopreservation Cassette" field is kept empty
      regressionmftgSteps.transferProductToIntermediary.negativeApheresisID()

      //C39823 [NEG] Verify that the Next button should be disabled if the "Enter the Bag Identifier" field is kept empty.
      regressionmftgSteps.transferProductToIntermediary.negativeBagIdentifier()

      //C39828 [NEG] Verify that the data should be saved after clicking the 'save and close button'.
      //C39826 [POS] Verify the status of the Next button by keeping all the optional fields empty
      regressionmftgSteps.transferProductToIntermediary.saveAndClose()

      //C39827 [POS] Verify that the data should be retain while switching back from " Transfer Product to Intermediary or Final LN2 Storage (part2)" to "Transfer Product to Intermediary or Final LN2 Storage" page.
      regressionmftgSteps.transferProductToIntermediary.retainValue()
      
    });

    it('Transfer Product to Intermediary or Final LN2 Storage (Part 2)', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      regressionmftgSteps.transferProductToIntermediary2.previousHappyPathSteps(scope,therapy);

      //	C39784	[POS] Verify if the 'Next' button is enabled on the Intermediary Storage page.
      regressionmftgSteps.transferProductToIntermediary2.checkNextButton()

      //C39785[POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.transferProductToIntermediary2.saveAndClose()
    });

    it('Product Receipt', () => {
 
      regressionmftgSteps.productReceipt.previousHappyPathSteps(scope,therapy);
      
      // C39786 [NEG]Verify if 'Next' button is disabled when none of the checklist questions are answered. 
      regressionmftgSteps.productReceipt.noChecklistAnswered()
        // C39805 [NEG] Verify if the 'Next' button is disabled until the order ID for "Please enter Order ID on air waybill" is not confirmed and all other questions are answered.      
        regressionmftgSteps.productReceipt.checkConfirmButtonForAirwayBill(scope)
        
      // C39787 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Confirm cryopreserved apheresis product cassette(s).....' and all other questions are answered.   
      regressionmftgSteps.productReceipt.noSelectForCassette(scope)
  
      // C39788 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Confirm cryopreserved apheresis product cassette(s)....' and all other questions are answered.  
      regressionmftgSteps.productReceipt.nothingSelectForCassette()
    
      // C39789 [POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question 'Confirm cryopreserved apheresis product cassette(s)....' and 'Details' are entered.  
      regressionmftgSteps.productReceipt.commentOnCassette()
    
      // C39790 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Was there a temperature out-of-range alarm received? ....' and all other questions are answered.  
      regressionmftgSteps.productReceipt.noSelectFortemperature()
    
      // C39791 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Was there a temperature out-of-range alarm received? ....' and all other questions are answered.  
      regressionmftgSteps.productReceipt.nothingSelectForTemperature()
    
      // C39792 [POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question 'Was there a temperature out-of-range alarm received? ....' and 'Details' are entered.  
      regressionmftgSteps.productReceipt.commentForTemperature()
    
      // C39793 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Was the tamper evident seal in place...?" and all other questions are answered.     
      regressionmftgSteps.productReceipt.noSelectForTamper()

      // C39794 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Was the tamper evident seal in place...?" and all other questions are answered.   
      regressionmftgSteps.productReceipt.nothingSelectForTamper()
  
      // C39795 [POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question "Was the tamper evident seal in place...?" and 'Details' are entered.   
      regressionmftgSteps.productReceipt.commentForTamper()
  
      // C39796 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is each bag and cassette in...." and all other questions are answered.  
      regressionmftgSteps.productReceipt.noSelectForCassetteAndBag()
    
      // C39797 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is each bag and cassette in...." and all other questions are answered.
      regressionmftgSteps.productReceipt.nothingSelectForCassetteAndBag()
      
      // C39798 [POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question "Is each bag and cassette in...." and 'Details' are entered.  
      regressionmftgSteps.productReceipt.commentOnForCassetteAndBag()
    
      // C39799 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Does the EVO-IS Number listed on the Air Waybill.....?' and all other questions are answered.     
      regressionmftgSteps.productReceipt.damageBags()

      // C39800 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Does the EVO-IS Number listed on the Air Waybill....? and all other questions are answered.'      
      regressionmftgSteps.productReceipt.nothingSelectForDamageBags()

      // C39801 [POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question 'Does the EVO-IS Number listed on the Air Waybill.....?' and 'Details' are entered. 
      regressionmftgSteps.productReceipt.commetsForDamageBags()
    
      // C39802 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Has the cryopreserved apheresis product..." and all other questions are answered.     
      regressionmftgSteps.productReceipt.noSelectForStorage()

      // C39803 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Has the cryopreserved apheresis product...." and all other questions are answered.  
      regressionmftgSteps.productReceipt.nothingSelectForStorage()
    
      // C39804 [POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question "Has the cryopreserved apheresis product...." and 'Details' are entered.    
      regressionmftgSteps.productReceipt.commentForForStorage()

      //C39806 [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.productReceipt.saveAndClose()
    });

    it('Product Receipt Summary', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      regressionmftgSteps.productReceipSummary.previousHappyPathSteps(scope,therapy);

      //C39807 [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.productReceipSummary.saveAndClose()
    });
     
    it('Manufacturing Data', () => {

      const currentDate = dayjs().add(0, 'day').format('DD-MMM-YYYY');
      const pastDate = dayjs().subtract(1, 'day').format('DD-MMM-YYYY');
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      regressionmftgSteps.manufacturingData.previousHappyPathSteps(scope,input.evoLast4Digits,therapy,input.tamperSealNumber);

      //C39583 [NEG] Verify that the next button should be disabled if the date filed is kept empty.
      regressionmftgSteps.manufacturingData.emptyDate()

      //C39584 [NEG] Verify that the next button should be disabled if the "lot number" input filed is kept empty
      regressionmftgSteps.manufacturingData.emptyLotNumber(currentDate)

      //C39585 [NEG] Verify that the next button should be disabled if the past date is entered..
      regressionmftgSteps.manufacturingData.invalidDate(pastDate)

      //C39580 Verify if the 'Next button is disabled after the confirmer's signature is signed.
      //C39581 Verify if the 'Next' button is enabled after verifier's signature is signed.
      regressionmftgSteps.manufacturingData.signature(currentDate)

      //C39582 [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.manufacturingData.saveAndClose()

      //C39586 [POS] Verify that the selected data should be retained while switching back from the "Print Final Product Labels" page to "Manufacturing data" page.
      regressionmftgSteps.manufacturingData.retainValue()

    })

    it('Print Final Product Labels', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      regressionmftgSteps.printFinalProductLabels.previousHappyPathSteps(scope,input.evoLast4Digits,therapy,input.tamperSealNumber);

      //C39810 [NEG] Verify if the 'Next' button is disabled until the 'Confirm labels and packing insert(s) are printed successfully' checkbox is not checked.
      //C39811 [POS] Verify if the 'Next' button is enabled after the 'Confirm labels and packing insert(s) are printed successfully' checkbox is checked.
      regressionmftgSteps.printFinalProductLabels.verifyNextButton()

      //C39812 [Verify if the signature block appears after clicking the 'Next' button and also verify the confirmer's signature.
      regressionmftgSteps.printFinalProductLabels.signature()

      //C39813 [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.printFinalProductLabels.saveAndClose()

      //C39814 [POS] Verify that after switching back from ' Bag Selection" page to the "Print Packing inserts" page checkbox should remain the checked.
      regressionmftgSteps.printFinalProductLabels.retainValue()

    });

    it('Confirmation Of Label Application', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      regressionmftgSteps.confirmationOfLabelApplication.previousHappyPathSteps(scope,input.evoLast4Digits,therapy,input.tamperSealNumber);

      //C39574 [NEG] Verify if the 'Next button is disabled until 'Select bag volume' is not selected and all other fields are filled.
      regressionmftgSteps.confirmationOfLabelApplication.emptyToggle()

      //C39575 [NEG] Verify if the 'Next' button is disabled until 'How many bags resulted from today's manufacturing process?' input field is empty and all other fields are filled.
      regressionmftgSteps.confirmationOfLabelApplication.emptyBag()

      //C39576 [NEG] Verify if the 'Next' button is disabled until the checkbox 'Confirm bag labels have been attached to bag' is not checked and all other fields are filled.
      regressionmftgSteps.confirmationOfLabelApplication.checkbox()

      //C39577 [POS] Verify if the 'Next' button is enabled after the checkbox 'Confirm bag labels have been attached to bag' is checked and all other fields are filled.
      regressionmftgSteps.confirmationOfLabelApplication.negativeNumberOfBag()

      //C39578 [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.confirmationOfLabelApplication.saveAndClose()

      //C39579 [POS] Verify that after switching back from ' Bag Selection" page to "Print Packing inserts"  page checkbox should remain the checked
      regressionmftgSteps.confirmationOfLabelApplication.retainValue()

    });

    it('Confirmation Of Label Application part2 ', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      regressionmftgSteps.confirmationOfLabelApplicationPart2.previousHappyPathSteps(scope,therapy);

      //C39985 [NEG] Verify that the green checkmark should be visible when correct coi is entered in the "Scan or enter the COI with bag identifier on cassette 1" field
      regressionmftgSteps.confirmationOfLabelApplicationPart2.cassetteLabel()

      //C39984 [NEG] Verify if the 'Next' button is disabled when COI number for 'Scan or enter the COI with bag identifier on bag 1' is not confirmed and all other fields are filled.
      regressionmftgSteps.confirmationOfLabelApplicationPart2.coiField()

      //C39986 [NEG] Verify if the 'Next' button is disabled until the checkbox 'Confirm bag labels have been attached to bag' is not checked and all other fields are filled.
      regressionmftgSteps.confirmationOfLabelApplicationPart2.checkBox()

      //C39987 [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.confirmationOfLabelApplicationPart2.saveAndClose()

      //C39988 [POS] Verify that the data should be retained while switching back from the "Quality Approval for Shipment" page to "Confirmation Of Label Application " page.
      regressionmftgSteps.confirmationOfLabelApplicationPart2.retainValue()

    });

  it('Quality Release', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
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
      regressionmftgSteps.shippingManufacturing.previousHappyPathSteps(scope,therapy);

      //C39665 [NEG] Verify if the 'Next' button is disabled until the air waybill number for "Please enter air waybill number for shipment" is not confirmed and all other questions and fields are answered and filled.
      regressionmftgSteps.shippingManufacturing.airwayBillNumberBlank();

      //C39666 [NEG] Verify if the 'Next' button is disabled until the order ID for "Please enter Order ID on air waybill" is not confirmed and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.orderIdBlank(scope);

      //C39667 [NEG] Verify if the 'Next' button is disabled until the EVO-IS Number for "Please enter the last 4-digits of the EVO-IS Number..." is not entered and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.evoLast4DigitsBlank();

      //C39668 [NEG] Verify if the 'Next' button is disabled until the Tamper Seal Number for "Please enter the Tamper Seal Number on LN2 shipper lid" is not entered and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.tamperSealNumberumberBlank();

      //C39669 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the shipping container case intact?" and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.shipperCaseIntactNeg();

      //C39670 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the shipping container case intact?..." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.shipperCaseIntactBlank();

      //C39671 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the shipping container case intact?..." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.shipperCaseIntactPos();

      //C39672 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Was there a temperature out-of-range...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.tempOutOfRangeNeg();

      //C39673 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Was there a temperature out-of-range...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.tempOutOfRangeBlank();

      //C39674 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Was there a temperature out-of-range...." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.tempOutOfRangePos();

      //C39675 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Does the EVO-IS Number listed on the Air Waybill...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.airwayBillMatchTamperNeg();

      //C39676 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Does the EVO-IS Number listed on the Air Waybill...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.airwayBillMatchTamperBlank();

      //C39677 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Does the EVO-IS Number listed on the Air Waybill...." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.airwayBillMatchTamperPos();

      //C39678 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Does the Tamper Seal Number listed on the Air Waybill...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.tamperSealMatchNeg();

      //C39679 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Does the Tamper Seal Number listed on the Air Waybill...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.tamperSealMatchBlank();

      //C39680 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Does the Tamper Seal Number listed on the Air Waybill...." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.tamperSealMatchPos();

      //C39681 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Confirm cassette(s) were not exposed...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.cassetteNotExposedNeg();

      //C39682 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Confirm cassette(s) were not exposed...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.cassetteNotExposedBlank();

      //C39683 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Confirm cassette(s) were not exposed...." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.cassetteNotExposedPos();

      //C39684 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the packing insert(s) included...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.packingInsertNeg();

      //C39685 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the packing insert(s) included...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.packingInsertBlank();

      //C39686 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the packing insert(s) included...." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.packingInsertPos();

      //C39687 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the Consignee kit pouch included...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.consigneeKitPouchNeg();

      //C39688 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the Consignee kit pouch included...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.consigneeKitPouchBlank();

      //C39689 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the Consignee kit pouch included...." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.consigneeKitPouchPos();

      //C39690 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the shipping container secured?" and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.shippingContainerSecureNeg();

      //C39691 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the shipping container secured?" and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.shippingContainerSecureBlank();

      //C39692 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the shipping container secured?" and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.shippingContainerSecurePos();

      //C39693 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the red wire tamper seal labeled..." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.redWireSealLabelNeg();

      //C39694 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the red wire tamper seal labeled..." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.redWireSealLabelBlank();

      //C39695 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the red wire tamper seal labeled..." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.redWireSealLabelPos();

      //C39696 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the red wire tamper seal..." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.redWireSealInPlaceNeg();

      //C39697 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the red wire tamper seal..." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.redWireSealInPlaceBlank();

      //C39698 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the red wire tamper seal..." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.redWireSealInPlacePos();

      //C39699 [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.shippingManufacturing.verifySaveAndCloseBtn();
    });

    it('Shipping Manufacturing Summary', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      regressionmftgSteps.shippingManufacturingSummary.previousHappyPathSteps(scope,therapy);

     //C39661	[POS] Verify if the 'Edit' button next to "Condition Of Shipment" is working.
      regressionmftgSteps.shippingManufacturingSummary.verifyEditBtn();

     //C39662 [NEG] Verify if the 'Next' button is disabled after confirmer's signature is signed.
      regressionmftgSteps.shippingManufacturingSummary.checkNextButtonWithoutSignatureNeg();

     //C39663 [POS] Verify if the 'Next' button is enabled after verifier's signature is signed.
      regressionmftgSteps.shippingManufacturingSummary.checkVerifierSignature();

     //C39664	[POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.shippingManufacturingSummary.verifySaveAndCloseBtn();
    });
  
    it('Check Status Of Manufacturing Module', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      regressionmftgSteps.checkStatusesOfManufacturingModule(scope, therapy)
    });
  });