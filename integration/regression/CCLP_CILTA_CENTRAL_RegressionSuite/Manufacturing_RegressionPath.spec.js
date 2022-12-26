import ordering_steps from '../../../utils/HappyPath_steps/CCLP_CILTA_CENTRAL_HappyPath/ordering_steps_cilta';
import commonHappyPath from "../../../utils/Regression_steps/CCLP_CILTA_CENTRAL_RegressionPath/common_happyPath_steps"
import regressionmftgSteps from '../../../utils/Regression_steps/CCLP_CILTA_CENTRAL_RegressionPath/manufacturing_steps_cilta'
import therapies from '../../../fixtures/therapy.json'
import dayjs from 'dayjs';
import input from '../../../fixtures/inputs.json';


context('CCLP US Therapy Manufacturing Regression Path', () => {
    const scope = {};
    const therapy = therapies.cclp_cilta
    const region = 'US';
  
    beforeEach(() => {
      cy.clearCookies();
      ordering_steps.orderingData(scope);
      commonHappyPath.commonAliases();
    });
  
    it('Verify Shipper', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      regressionmftgSteps.verifyShipper.previousHappyPathSteps();
  
      //C38643 [POS] Verify the 'Next' button without entering data in "Scan or enter the COI Number found on the LN2 packing insert" field.
      regressionmftgSteps.verifyShipper.coiNumberPositive();
  
      //C38644 [NEG] Verify "Scan or enter the COI Number found on the LN2 packing insert" field with negative data.
      regressionmftgSteps.verifyShipper.coiNumberNegative();
  
      //C38645 [POS] Verify if the data is retained upon clicking 'Back' button from next step.
      regressionmftgSteps.verifyShipper.dataSavingWithBackButtonPositive();
    });
    
    it('Shipment Receipt Checklist', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
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
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      regressionmftgSteps.shipmentReceiptChecklistSummary.previousHappyPathSteps(input.evoLast4Digits,therapy,input.tamperSealNumber);

      //C25527 [POS] Verify if the 'Next' button is disabled after confirmer's signature is signed.
      regressionmftgSteps.shipmentReceiptChecklistSummary.checkNextButtonWithoutSignaturePositive();

      //C25528 [POS] Verify if the 'Next' button is enabled after verifier's signature is signed.
      regressionmftgSteps.shipmentReceiptChecklistSummary.checkVerifierSignature();
    });

    it('Transfer Product To Intermediary', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      regressionmftgSteps.transferProductToIntermediary.previousHappyPathSteps(scope,therapy);

      //C25618 [NEG] Verify that the green checkmark will be visible when correct COI number for ''Scan the COI on the bag" is entered.
      regressionmftgSteps.transferProductToIntermediary.negativeValueOfCoi()

      //C25617 [NEG] Verify that  the 'Next' button is disabled when COI number for ''Scan the COI on the cassette label" is not confirmed and all other fields are filled.
      //C39299 [NEG] Verify that the "Next" button should be disabled if incorrect value of COI enters in the "Scan or enter the COI on the cassette label" input field.
      regressionmftgSteps.transferProductToIntermediary.emptyCoi()

      //C25616[POS] Verify that the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.transferProductToIntermediary.saveAndClose()

      //C38847 Verify that while switching back from " Transfer Product to Intermediary or Final LN2 Storage" to the "Transfer product" step the entered data should be retained.
      regressionmftgSteps.transferProductToIntermediary.retainValue()
    });

    it('Transfer Product to Intermediary or Final LN2 Storage (Part 2)', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      regressionmftgSteps.transferProductToIntermediary2.previousHappyPathSteps(scope,therapy);

      //C25655 [POS] Verify if the 'Next' button is enabled on the Intermediary Storage page.
      regressionmftgSteps.transferProductToIntermediary2.checkNextButton()

      //C25656 [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.transferProductToIntermediary2.saveAndClose()
    });

    it('Product Receipt', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      regressionmftgSteps.productReceipt.previousHappyPathSteps(scope,therapy);
      
      // C26556 [NEG]Verify if 'Next' button is disabled when none of the checklist questions are answered. 
      regressionmftgSteps.productReceipt.noChecklistAnswered()
        
      // C26468 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Confirm cryopreserved apheresis product cassette(s).....' and all other questions are answered.   
      regressionmftgSteps.productReceipt.noSelectForCassette()
  
      // C26469 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Confirm cryopreserved apheresis product cassette(s)....' and all other questions are answered.  
      regressionmftgSteps.productReceipt.nothingSelectForCassette()
    
      // C26470 [POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question 'Confirm cryopreserved apheresis product cassette(s)....' and 'Details' are entered.  
      regressionmftgSteps.productReceipt.commentOnCassette()
    
      // C26472 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Was there a temperature out-of-range alarm received? ....' and all other questions are answered.  
      regressionmftgSteps.productReceipt.noSelectFortemperature()
    
      // C26473 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Was there a temperature out-of-range alarm received? ....' and all other questions are answered.  
      regressionmftgSteps.productReceipt.nothingSelectForTemperature()
    
      // C26474 [POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question 'Was there a temperature out-of-range alarm received? ....' and 'Details' are entered.  
      regressionmftgSteps.productReceipt.commentForTemperature()
    
      // C26475 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Was the tamper evident seal in place...?" and all other questions are answered.     
      regressionmftgSteps.productReceipt.noSelectForTamper()

      // C26476 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Was the tamper evident seal in place...?" and all other questions are answered.   
      regressionmftgSteps.productReceipt.nothingSelectForTamper()
  
      // C26477 [POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question "Was the tamper evident seal in place...?" and 'Details' are entered.   
      regressionmftgSteps.productReceipt.commentForTamper()
  
      // C26478 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is each bag and cassette in...." and all other questions are answered.  
      regressionmftgSteps.productReceipt.noSelectForCassetteAndBag()
    
      // C26479 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is each bag and cassette in...." and all other questions are answered.
      regressionmftgSteps.productReceipt.nothingSelectForCassetteAndBag()
      
      // C26480 [POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question "Is each bag and cassette in...." and 'Details' are entered.  
      regressionmftgSteps.productReceipt.commentOnForCassetteAndBag()
    
      // C26481 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Does the EVO-IS Number listed on the Air Waybill.....?' and all other questions are answered.     
      regressionmftgSteps.productReceipt.damageBags()

      // C26482 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Does the EVO-IS Number listed on the Air Waybill....? and all other questions are answered.'      
      regressionmftgSteps.productReceipt.nothingSelectForDamageBags()

      // C26483 [POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question 'Does the EVO-IS Number listed on the Air Waybill.....?' and 'Details' are entered. 
      regressionmftgSteps.productReceipt.commetsForDamageBags()
    
      // C26484 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Has the cryopreserved apheresis product..." and all other questions are answered.     
      regressionmftgSteps.productReceipt.noSelectForStorage()

      // C26485 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Has the cryopreserved apheresis product...." and all other questions are answered.  
      regressionmftgSteps.productReceipt.nothingSelectForStorage()
    
      // C26486 [POS] Verify if the 'Next' button is enabled when all other questions are answered, 'NO' toggle button is selected for the question "Has the cryopreserved apheresis product...." and 'Details' are entered.    
      regressionmftgSteps.productReceipt.commentForForStorage()

      //C25693 [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.productReceipt.saveAndClose()
    });

    it('Product Receipt Summary', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      regressionmftgSteps.productReceipSummary.previousHappyPathSteps(scope,therapy);

      //C25693 [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.productReceipSummary.saveAndClose()
    });

    it('Manufacturing Data', () => {
      const currentDate = dayjs().add(0, 'day').format('DD-MMM-YYYY');
      const pastDate = dayjs().subtract(1, 'day').format('DD-MMM-YYYY');
      
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      regressionmftgSteps.manufacturingData.previousHappyPathSteps(scope,therapy);

      //C39212 [NEG] Verify that the next button should be disabled if the date filed is kept empty.
      regressionmftgSteps.manufacturingData.emptyDate()

      //C39213 [NEG] Verify that the next button should be disabled if the "lot number" input filed is kept empty
      regressionmftgSteps.manufacturingData.emptyLotNumber(currentDate)

      //C39214 [NEG] Verify that the next button should be disabled if the past date is entered.
      regressionmftgSteps.manufacturingData.invalidDate(pastDate)

      //C25839 Verify if the 'Next button is disabled after the confirmer's signature is signed.
      //C25840 Verify if the 'Next' button is enabled after verifier's signature is signed.
      regressionmftgSteps.manufacturingData.signature(currentDate)

      //C25841 [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.manufacturingData.saveAndClose()

      //C39215 [POS] Verify that the selected data should be retained while switching back from the "Print Final Product Labels" page to "Manufacturing data" page.
      regressionmftgSteps.manufacturingData.retainValue()
    }),

    it('Print Final Product Labels', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      regressionmftgSteps.printFinalProductLabels.previousHappyPathSteps(scope,therapy);

      //C25843 [NEG] Verify if the 'Next' button is disabled until the 'Confirm labels and packing insert(s) are printed successfully' checkbox is not checked.
      //C25844 [POS] Verify if the 'Next' button is enabled after the 'Confirm labels and packing insert(s) are printed successfully' checkbox is checked.
      regressionmftgSteps.printFinalProductLabels.verifyNextButton()

      //C25847 [Verify if the signature block appears after clicking the 'Next' button and also verify the confirmer's signature.
      regressionmftgSteps.printFinalProductLabels.signature()

      //C25842 [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.printFinalProductLabels.saveAndClose()

      //C38894 [POS] Verify that after switching back from ' Bag Selection" page to the "Print Packing inserts" page checkbox should remain the checked.
      regressionmftgSteps.printFinalProductLabels.retainValue()
    });

    it('Confirmation Of Label Application', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      regressionmftgSteps.confirmationOfLabelApplication.previousHappyPathSteps(scope,therapy);

      //C25878 [NEG] Verify if the 'Next button is disabled until 'Select bag volume' is not selected and all other fields are filled.
      regressionmftgSteps.confirmationOfLabelApplication.emptyToggle()

      //C25879 [NEG] Verify if the 'Next' button is disabled until 'How many bags resulted from today's manufacturing process?' input field is empty and all other fields are filled.
      regressionmftgSteps.confirmationOfLabelApplication.emptyBag()

      //C25880 [NEG] Verify if the 'Next' button is disabled until the checkbox 'Confirm bag labels have been attached to bag' is not checked and all other fields are filled.
      regressionmftgSteps.confirmationOfLabelApplication.checkbox()

      //C25881 [POS] Verify if the 'Next' button is enabled after the checkbox 'Confirm bag labels have been attached to bag' is checked and all other fields are filled.
      regressionmftgSteps.confirmationOfLabelApplication.negativeNumberOfBag()

      //C25877 [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.confirmationOfLabelApplication.saveAndClose()

      //C38990 [POS] Verify that after switching back from ' Bag Selection" page to "Print Packing inserts"  page checkbox should remain the checked
      regressionmftgSteps.confirmationOfLabelApplication.retainValue()
    });

    it('Confirmation Of Label Application part2 ', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      regressionmftgSteps.confirmationOfLabelApplicationPart2.previousHappyPathSteps(scope,therapy);

      //C26241 [NEG] Verify that the green checkmark should be visible when correct coi is entered in the "Scan or enter the COI with bag identifier on cassette 1" field
      regressionmftgSteps.confirmationOfLabelApplicationPart2.cassetteLabel()

      //C26239 [NEG] Verify if the 'Next' button is disabled when COI number for 'Scan or enter the COI with bag identifier on bag 1' is not confirmed and all other fields are filled.
      regressionmftgSteps.confirmationOfLabelApplicationPart2.coiField()

      //C26237 [NEG] Verify if the 'Next' button is disabled until the checkbox 'Confirm bag labels have been attached to bag' is not checked and all other fields are filled.
      regressionmftgSteps.confirmationOfLabelApplicationPart2.checkBox()

      //C26242 [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.confirmationOfLabelApplicationPart2.saveAndClose()

      //C39043 [POS] Verify that the data should be retained while switching back from the "Quality Approval for Shipment" page to "Confirmation Of Label Application " page.
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

      //C27721 [NEG] Verify if the 'Next' button is disabled until the air waybill number for "Please enter air waybill number for shipment" is not confirmed and all other questions and fields are answered and filled.
      regressionmftgSteps.shippingManufacturing.airwayBillNumberBlank();

      //C27722 [NEG] Verify if the 'Next' button is disabled until the order ID for "Please enter Order ID on air waybill" is not confirmed and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.orderIdBlank(scope);

      //C27723 [NEG] Verify if the 'Next' button is disabled until the EVO-IS Number for "Please enter the last 4-digits of the EVO-IS Number..." is not entered and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.evoLast4DigitsBlank();

      //C27724 [NEG] Verify if the 'Next' button is disabled until the Tamper Seal Number for "Please enter the Tamper Seal Number on LN2 shipper lid" is not entered and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.tamperSealNumberumberBlank();

      //C27726 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the shipping container case intact?" and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.shipperCaseIntactNeg();

      //C27728 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the shipping container case intact?..." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.shipperCaseIntactBlank();

      //C27727 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the shipping container case intact?..." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.shipperCaseIntactPos();

      //C27762 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Was there a temperature out-of-range...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.tempOutOfRangeNeg();

      //C27763 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Was there a temperature out-of-range...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.tempOutOfRangeBlank();

      //C27764 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Was there a temperature out-of-range...." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.tempOutOfRangePos();

      //C27793 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Does the EVO-IS Number listed on the Air Waybill...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.airwayBillMatchTamperNeg();

      //C27794 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Does the EVO-IS Number listed on the Air Waybill...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.airwayBillMatchTamperBlank();

      //C27795 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Does the EVO-IS Number listed on the Air Waybill...." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.airwayBillMatchTamperPos();

      //C27797 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Does the Tamper Seal Number listed on the Air Waybill...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.tamperSealMatchNeg();

      //C27798 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Does the Tamper Seal Number listed on the Air Waybill...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.tamperSealMatchBlank();

      //C27799 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Does the Tamper Seal Number listed on the Air Waybill...." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.tamperSealMatchPos();

      //C27801 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Confirm cassette(s) were not exposed...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.cassetteNotExposedNeg();

      //C27802 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Confirm cassette(s) were not exposed...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.cassetteNotExposedBlank();

      //C27803 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Confirm cassette(s) were not exposed...." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.cassetteNotExposedPos();

      //C27806 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the packing insert(s) included...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.packingInsertNeg();

      //C27807 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the packing insert(s) included...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.packingInsertBlank();

      //C27808 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the packing insert(s) included...." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.packingInsertPos();

      //C27809 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the Consignee kit pouch included...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.consigneeKitPouchNeg();

      //C27810 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the Consignee kit pouch included...." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.consigneeKitPouchBlank();

      //C27811 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the Consignee kit pouch included...." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.consigneeKitPouchPos();

      //C27813 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the shipping container secured?" and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.shippingContainerSecureNeg();

      //C27814 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the shipping container secured?" and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.shippingContainerSecureBlank();

      //C27815 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the shipping container secured?" and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.shippingContainerSecurePos();

      //C27816 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the red wire tamper seal labeled..." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.redWireSealLabelNeg();

      //C27817 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the red wire tamper seal labeled..." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.redWireSealLabelBlank();

      //C27818 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the red wire tamper seal labeled..." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.redWireSealLabelPos();

      //C27820 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the red wire tamper seal..." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.redWireSealInPlaceNeg();

      //C27821 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the red wire tamper seal..." and all other questions are answered.
      regressionmftgSteps.shippingManufacturing.redWireSealInPlaceBlank();

      //C27822 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the red wire tamper seal..." and 'Details' are entered.
      regressionmftgSteps.shippingManufacturing.redWireSealInPlacePos();

      //C27823 [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.shippingManufacturing.verifySaveAndCloseBtn();
    });

    it('Shipping Manufacturing Summary', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      regressionmftgSteps.shippingManufacturingSummary.previousHappyPathSteps(scope,therapy);

     //C27825	[POS] Verify if the 'Edit' button next to "Condition Of Shipment" is working.
      regressionmftgSteps.shippingManufacturingSummary.verifyEditBtn();

     //C26381 [NEG] Verify if the 'Next' button is disabled after confirmer's signature is signed.
      regressionmftgSteps.shippingManufacturingSummary.checkNextButtonWithoutSignatureNeg();

     //C26382 [POS] Verify if the 'Next' button is enabled after verifier's signature is signed.
      regressionmftgSteps.shippingManufacturingSummary.checkVerifierSignature();

     //C26383	[POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionmftgSteps.shippingManufacturingSummary.verifySaveAndCloseBtn();
    });
  
  it('Check Status Of Manufacturing Module', () => {
        commonHappyPath.commonOrderingHappyPath(scope,therapy);
        commonHappyPath.commonCollectionHappyPath(scope);
        commonHappyPath.commonSatelliteLabHappyPath(scope);
        regressionmftgSteps.checkStatusesOfManufacturingModule(scope, therapy)
    });
  });