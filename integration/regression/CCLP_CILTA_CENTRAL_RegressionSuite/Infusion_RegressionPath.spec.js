import ordering_steps from '../../../utils/HappyPath_steps/CCLP_CILTA_CENTRAL_HappyPath/ordering_steps_cilta';
import commonHappyPath from "../../../utils/Regression_steps/CCLP_CILTA_CENTRAL_RegressionPath/common_happyPath_steps"
import regressionInfusionSteps from '../../../utils/Regression_steps/CCLP_CILTA_CENTRAL_RegressionPath/infusion_steps_cilta'
import therapies from '../../../fixtures/therapy.json'
import input from '../../../fixtures/inputs.json';


context('CCLP US Therapy Infusion Regression Path', () => {
  const scope = {};
  const therapy = therapies.cclp_cilta
  const region = 'US';

  beforeEach(() => {
    cy.clearCookies();
    ordering_steps.orderingData(scope);
    commonHappyPath.commonAliases();
  });

  it('Receive Shipment', () => {
    commonHappyPath.commonOrderingHappyPath(scope, therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    commonHappyPath.commonSatelliteLabHappyPath(scope);
    commonHappyPath.commonManufacturingHappyPath(scope);
      

    //C40810 [POS] Verify the 'Next' button without entering data in "Scan or enter the COI Number found on the LN2 packing insert" field.
    regressionInfusionSteps.receiveShipment.coiNumberPositive();

    //C40811 [NEG] Verify "Scan or enter the COI Number found on the LN2 packing insert" field with negative data.
    regressionInfusionSteps.receiveShipment.coiNumberNegative();

    //C40812 [POS] Verify if the data is retained upon clicking 'Back' button from next step.
    regressionInfusionSteps.receiveShipment.dataSavingWithBackButtonPositive();
  });

  it('Shipment Receipt Checklist', () => {
    commonHappyPath.commonOrderingHappyPath(scope, therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    commonHappyPath.commonSatelliteLabHappyPath(scope);
    commonHappyPath.commonManufacturingHappyPath(scope);
      
    regressionInfusionSteps.shippingReceiptChecklist.previousHappyPathSteps(therapy);

    //C40821 [POS] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the shipping container case intact?..." and all other questions are answered.
    regressionInfusionSteps.shippingReceiptChecklist.shippingContainerIntactTogglePositive(input.evoLast4Digits, input.tamperSealNumber);

    //C40822 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the shipping container case intact?...and all other questions are answered'
    regressionInfusionSteps.shippingReceiptChecklist.shippingContainerIntactToggleNegative();

    //C40823 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the shipping container case intact?... and 'Details' are entered.
    regressionInfusionSteps.shippingReceiptChecklist.shippingContainerIntactToggleWithDataPositive();

    //C40824 [POS] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the shipping container secured?' and all other questions are answered.
    regressionInfusionSteps.shippingReceiptChecklist.shippingContainerSecuredTogglePositive(input.evoLast4Digits, input.tamperSealNumber);

    //C40825 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the shipping container secured?' and all other questions are answered.
    regressionInfusionSteps.shippingReceiptChecklist.shippingContainerSecuredToggleNegative();

    //C40826 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the shipping container secured?' and 'Details' are entered.
    regressionInfusionSteps.shippingReceiptChecklist.shippingContainerSecuredToggleWithDataPositive();

    //C40827 [POS] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the Consignee pouch included with the shipper?' and all other questions are answered.
    regressionInfusionSteps.shippingReceiptChecklist.consigneePouchTogglePositive(input.evoLast4Digits, input.tamperSealNumber);

    //C40828 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the Consignee pouch included with the shipper?' and all other questions are answered.
    regressionInfusionSteps.shippingReceiptChecklist.consigneePouchToggleNegative();

    //C40829 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the Consignee pouch included with the shipper?' and 'Details' are entered.
    regressionInfusionSteps.shippingReceiptChecklist.consigneePouchToggleWithDataPositive();

    //C40830 [POS] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the Red Wire Tamper Seal in place for the LN2 shipper lid?' and all other questions are answered.
    regressionInfusionSteps.shippingReceiptChecklist.redWireTampeTogglePositive(input.evoLast4Digits, input.tamperSealNumber);

    //C40831 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the Red Wire Tamper Seal in place for the LN2 shipper lid?' and all other questions are answered.
    regressionInfusionSteps.shippingReceiptChecklist.redWireTampeToggleNegative();

    //C40832 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the Red Wire Tamper Seal in place for the LN2 shipper lid?' and 'Details' are entered.
    regressionInfusionSteps.shippingReceiptChecklist.redWireTampeToggleWithDataPositive();

    //C40833 [POS] Verify if the 'Next' button is disabled until 'EVO-IS Number on the LN2 shipper lid' input field is left empty and all other fields are filled.
    regressionInfusionSteps.shippingReceiptChecklist.evoIsNumberInputPositive(input.tamperSealNumber);

    //C40834 [NEG] Verify if the 'Next' button is disabled after giving negative data in  'EVO-IS Number on the LN2 shipper lid' input field.
    regressionInfusionSteps.shippingReceiptChecklist.evoIsNumberInputNegative();

    //C40835 [POS] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Does the EVO-IS Number listed on the Air Waybill....? and all other questions are answered.'
    regressionInfusionSteps.shippingReceiptChecklist.evoIsNumberTogglePositive(input.evoLast4Digits, input.tamperSealNumber);

    //C40836 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Does the EVO-IS Number listed on the Air Waybill.....?' and all other questions are answered.
    regressionInfusionSteps.shippingReceiptChecklist.evoIsNumberToggleNegative();

    //C40837 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Does the EVO-IS Number listed on the Air Waybill.....?' and 'Details' are entered.
    regressionInfusionSteps.shippingReceiptChecklist.evoIsNumberToggleWithDataPositive();

    //C40838 [POS] Verify if the 'Next' button is disabled until 'Tamper Seal Number on LN2 shipper lid' input field is left empty and all other fields are filled.
    regressionInfusionSteps.shippingReceiptChecklist.tamperSealNoPositive(input.evoLast4Digits);

    //C40839 [POS] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Does the Tamper Seal Number listed on the Air Waybill....? and all other questions are answered.'
    regressionInfusionSteps.shippingReceiptChecklist.tamperSealMatchTogglePositive(input.evoLast4Digits, input.tamperSealNumber);

    //C40840 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Does the Tamper Seal Number listed on the Air Waybill...?' and all other questions are answered.
    regressionInfusionSteps.shippingReceiptChecklist.tamperSealMatchToggleNegative();

    //C40841 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Does the Tamper Seal Number listed on the Air Waybill...?' and 'Details' are entered.
    regressionInfusionSteps.shippingReceiptChecklist.tamperSealMatchToggleWithDataPositive();

    //C40842 [POS] Verify that the data is retained on clicking 'Save & Close' button
    regressionInfusionSteps.shippingReceiptChecklist.dataSavingWithSaveAndClosePositive(input.evoLast4Digits, input.tamperSealNumber);

    //C40843 [POS] Verify if the data is retained after clicking 'Back' button from next step.
    regressionInfusionSteps.shippingReceiptChecklist.dataSavingWithBackButtonPositive(input.evoLast4Digits, input.tamperSealNumber);
  }),

    it('Shipment Receipt Checklist Summary', () => {
      commonHappyPath.commonOrderingHappyPath(scope, therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      commonHappyPath.commonManufacturingHappyPath(scope);
      
      regressionInfusionSteps.shipmentReceiptChecklistSummary.previousHappyPathSteps(input.evoLast4Digits, therapy, input.tamperSealNumber);

      //C40815 [POS] Verify that the data gets save after editing with "Edit" button.
      regressionInfusionSteps.shipmentReceiptChecklistSummary.detailsOfShipmentEditButtonPositive(input.evoLast4Digits, input.tamperSealNumber);

      //C40816 [POS] Verify the "Next"  button should remain disabled when only "Verifier" signature is signed.
      regressionInfusionSteps.shipmentReceiptChecklistSummary.checkNextButtonWithoutSignaturePositive();

      //C40817 [POS]Verify the "Next" button should enabled after both signature are signed.
      regressionInfusionSteps.shipmentReceiptChecklistSummary.checkVerifierSignature();
    });

  it('Product Receipt Checklist', () => {
    commonHappyPath.commonOrderingHappyPath(scope, therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    commonHappyPath.commonSatelliteLabHappyPath(scope);
    commonHappyPath.commonManufacturingHappyPath(scope);
      
    regressionInfusionSteps.productReceiptChecklist.previousHappyPathSteps(input.evoLast4Digits, therapy, input.tamperSealNumber);

    //C40776	[POS]Verify if 'next' button is disabled if Nothing selected for toggle ' Confirm CAR-T product cassette(s) were not exposed to ambient temperature greater than 3 minutes.'
    regressionInfusionSteps.productReceiptChecklist.cartProductTogglePositive();

    //C40777	[NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Confirm CAR-T product cassette(s) were not exposed to ambient temperature greater than 3 minutes.'
    regressionInfusionSteps.productReceiptChecklist.cartProductToggleNegative();

    //C40778	[POS]Verify if 'next' button is Enabled after filling reason for No toggle ' Confirm CAR-T product cassette(s) were not exposed to ambient temperature greater than 3 minutes.'
    regressionInfusionSteps.productReceiptChecklist.cartProductToggleWithDataPositive();

    //C40779	[POS] Verify if 'next' button is disabled if Nothing selected for toggle  ' Was there a temperature out-of-range alarm received? If yes, meaning a Temperature Out-of-Range (TOR) has occurred, proceed with
    regressionInfusionSteps.productReceiptChecklist.temperatureOutOfRangeTogglePositive();

    //C40780	[NEG] Verify if 'next' button is disabled if 'Yes selected for toggle ' Was there a temperature out-of-range alarm received? If yes, meaning a Temperature Out-of-Range (TOR) has  immediately and then follow the TOR procedures outlined in the ma'
    regressionInfusionSteps.productReceiptChecklist.temperatureOutOfRangeToggleNegative();

    //C40781 [POS]Verify if 'next' button is Enabled after filling reason for Yes toggle ' Was there a temperature out-of-range alarm received? If yes, meaning a Temperature Out-of-Range (TOR) immediately and then follow the TOR procedures outlined in the ma'
    regressionInfusionSteps.productReceiptChecklist.temperatureOutOfRangeToggleWithDataPositive();

    //C40782 [POS]Verify if 'next' button is disabled if Nothing selected for toggle ' Was the tamper evident seal in place on the cassette rack?'
    regressionInfusionSteps.productReceiptChecklist.sealInPlaceTogglePositive();

    //C40783 [NEG]Verify if 'next' button is disabled if 'No' selected for toggle  ' Was the tamper evident seal in place on the cassette rack?'
    regressionInfusionSteps.productReceiptChecklist.sealInPlaceToggleNegative();

    //C40784 [POS]Verify if 'next' button is Enabled after filling reason for No toggle  ' Was the tamper evident seal in place on the cassette rack?'
    regressionInfusionSteps.productReceiptChecklist.sealInPlaceToggleWithDataPositive();

    //C40785 [POS]Verify if 'next' button is disabled if Nothing selected for toggle ' Is each bag and cassette in the expected (e.g. no cassette damage,? If bag(s) or cassette(s) is not in expected condition, please contact Janssen for further instructions.'
    regressionInfusionSteps.productReceiptChecklist.expectedConditionTogglePositive();

    //C40786 [NEG]Verify if 'next' button is disabled if 'No' selected for toggle ' Is each bag and cassette in the exected cition (e.g. no cassette damage,)? If bag(s) or cassette(s) is not in expected condition, please contact Janssen for further instructions.'
    regressionInfusionSteps.productReceiptChecklist.expectedConditionToggleNegative();

    //C40787 [POS]Verify if 'next' button is Enabled after filling reason for No toggle ' Is each bag and cassette in the expected condition (e.g. no cassette damage, adhered)? If bag(s) or cassette(s) condition, please contact Janssen for further instructions.'
    regressionInfusionSteps.productReceiptChecklist.expectedConditionToggleWithDataPositive();

    //C40788 [POS]Verify if 'next' button is disabled if Nothing selected for toggle ' Has the CAR-T product cassette(s) been label: Store at ≤-120°C (-184°F), vapor phase of liquid nitrogen? This should be done even if there are any issues with the shipm'
    regressionInfusionSteps.productReceiptChecklist.placedIntoStorageTogglePositive();

    //C40789 [NEG] Verify if 'next' button is Enabled after filling reason for No toggle ' Has the CAR-T product cassette(s) placed : Store at ≤-120°C (-184°F), vapor phase of liquid nitrogen? This should be done even if there are any issues with the shipm'
    regressionInfusionSteps.productReceiptChecklist.placedIntoStorageToggleNegative();

    //C40790 [POS]Verify if 'next' button is Enabled after filling reason for No toggle ' Has the CAR-T product cassette(s) been placed into : Store at ≤-120°C (-184°F),  liquid nitrogen? This should be done even if there are any issues with the shipm'
    regressionInfusionSteps.productReceiptChecklist.placedIntoStorageToggleWithDataPositive();

    //C40791 [POS]Verify if 'next' button is Enabled after not filling data in 'Please enter additional comments about the receipt.' optional field.
    regressionInfusionSteps.productReceiptChecklist.additionalCommentPositive();

    //C40792 [POS] Verify that the data is retained on clicking 'Save & Close' button
    regressionInfusionSteps.productReceiptChecklist.dataSavingWithSaveAndClosePositive();

    //C40783 [POS] Verify if the data is retained after clicking 'Back' button from next step.
    regressionInfusionSteps.productReceiptChecklist.dataSavingWithBackButtonPositive();

  });

  it('Product Receipt Summary', () => {
    commonHappyPath.commonOrderingHappyPath(scope, therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    commonHappyPath.commonSatelliteLabHappyPath(scope);
    commonHappyPath.commonManufacturingHappyPath(scope);
      
    regressionInfusionSteps.productReceiptSummary.previousHappyPathSteps(input.evoLast4Digits, therapy, input.tamperSealNumber);

    //C25943 [POS]Verify the "Next" button should remain disabled after signing the "Confirmer" signature.
    regressionInfusionSteps.productReceiptSummary.checkNextButtonWithoutVerifierSignaturePositive();

    //C25945 [POS]Verify the "Next" button is enabled when both signature are signed.
    regressionInfusionSteps.productReceiptSummary.checkVerifierSignature();
  })
  
  it('Check Statuses Of Infusion Module', () => {
    commonHappyPath.commonOrderingHappyPath(scope, therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    commonHappyPath.commonSatelliteLabHappyPath(scope);
    commonHappyPath.commonManufacturingHappyPath(scope);
    regressionInfusionSteps.checkStatusesOfInfusionModule(scope, therapy);
  });
})