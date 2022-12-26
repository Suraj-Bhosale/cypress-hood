import ordering_steps from '../../../utils/HappyPath_steps/CMLP_CILTA_RARITAN_HappyPath/ordering_steps_cilta';
import commonHappyPath from "../../../utils/Regression_steps/CMLP_CILTA_RARITAN_RegressionPath/common_happyPath_steps"
import regressionInfusionSteps from '../../../utils/Regression_steps/CMLP_CILTA_RARITAN_RegressionPath/infusion_steps_cilta'
import therapies from '../../../fixtures/therapy.json'
import input from '../../../fixtures/inputs.json';


context('CMLP US Therapy Infusion Regression Path', () => {
    const scope = {};
    const therapy = therapies.cmlp_cilta
    const region = 'US';

    beforeEach(() => {
      cy.clearCookies();
      ordering_steps.orderingData(scope);
      commonHappyPath.commonAliases();
    });

    it('Receive Shipment', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      commonHappyPath.commonManufacturingHappyPath(scope);
      

      //C40807 [POS] Verify the 'Next' button without entering data in "Scan or enter the COI Number found on the LN2 packing insert" field.
      regressionInfusionSteps.receiveShipment.coiNumberPositive();

      //C40808 [NEG] Verify "Scan or enter the COI Number found on the LN2 packing insert" field with negative data.
      regressionInfusionSteps.receiveShipment.coiNumberNegative();

      //C40809 [POS] Verify if the data is retained upon clicking 'Back' button from next step.
      regressionInfusionSteps.receiveShipment.dataSavingWithBackButtonPositive();
    });

    it('Shipment Receipt Checklist', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      commonHappyPath.commonManufacturingHappyPath(scope);
      
      regressionInfusionSteps.shippingReceiptChecklist.previousHappyPathSteps(therapy);

      //C40844 [POS] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the shipping container case intact?..." and all other questions are answered.
      regressionInfusionSteps.shippingReceiptChecklist.shippingContainerIntactTogglePositive(input.evoLast4Digits, input.tamperSealNumber);

      //C40845 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the shipping container case intact?...and all other questions are answered'
      regressionInfusionSteps.shippingReceiptChecklist.shippingContainerIntactToggleNegative();

      //C40846 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the shipping container case intact?... and 'Details' are entered.
      regressionInfusionSteps.shippingReceiptChecklist.shippingContainerIntactToggleWithDataPositive();

      //C40847 [POS] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the shipping container secured?' and all other questions are answered.
      regressionInfusionSteps.shippingReceiptChecklist.shippingContainerSecuredTogglePositive(input.evoLast4Digits, input.tamperSealNumber);

      //C40848 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the shipping container secured?' and all other questions are answered.
      regressionInfusionSteps.shippingReceiptChecklist.shippingContainerSecuredToggleNegative();

      //C40849 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the shipping container secured?' and 'Details' are entered.
      regressionInfusionSteps.shippingReceiptChecklist.shippingContainerSecuredToggleWithDataPositive();

      //C40850 [POS] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the Consignee pouch included with the shipper?' and all other questions are answered.
      regressionInfusionSteps.shippingReceiptChecklist.consigneePouchTogglePositive(input.evoLast4Digits, input.tamperSealNumber);

      //C40851 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the Consignee pouch included with the shipper?' and all other questions are answered.
      regressionInfusionSteps.shippingReceiptChecklist.consigneePouchToggleNegative();

      //C40852 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the Consignee pouch included with the shipper?' and 'Details' are entered.
      regressionInfusionSteps.shippingReceiptChecklist.consigneePouchToggleWithDataPositive();

      //C40853 [POS] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the Red Wire Tamper Seal in place for the LN2 shipper lid?' and all other questions are answered.
      regressionInfusionSteps.shippingReceiptChecklist.redWireTampeTogglePositive(input.evoLast4Digits, input.tamperSealNumber);

      //C40854 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the Red Wire Tamper Seal in place for the LN2 shipper lid?' and all other questions are answered.
      regressionInfusionSteps.shippingReceiptChecklist.redWireTampeToggleNegative();

      //C40855 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the Red Wire Tamper Seal in place for the LN2 shipper lid?' and 'Details' are entered.
      regressionInfusionSteps.shippingReceiptChecklist.redWireTampeToggleWithDataPositive();

      //C40856 [POS] Verify if the 'Next' button is disabled until 'EVO-IS Number on the LN2 shipper lid' input field is left empty and all other fields are filled.
      regressionInfusionSteps.shippingReceiptChecklist.evoIsNumberInputPositive(input.tamperSealNumber);

      //C40857 [NEG] Verify if the 'Next' button is disabled after giving negative data in  'EVO-IS Number on the LN2 shipper lid' input field.
      regressionInfusionSteps.shippingReceiptChecklist.evoIsNumberInputNegative();

      //C40858 [POS] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Does the EVO-IS Number listed on the Air Waybill....? and all other questions are answered.'
      regressionInfusionSteps.shippingReceiptChecklist.evoIsNumberTogglePositive(input.evoLast4Digits, input.tamperSealNumber);

      //C40859 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Does the EVO-IS Number listed on the Air Waybill.....?' and all other questions are answered.
      regressionInfusionSteps.shippingReceiptChecklist.evoIsNumberToggleNegative();

      //C40860 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Does the EVO-IS Number listed on the Air Waybill.....?' and 'Details' are entered.
      regressionInfusionSteps.shippingReceiptChecklist.evoIsNumberToggleWithDataPositive();

      //C40861 [POS] Verify if the 'Next' button is disabled until 'Tamper Seal Number on LN2 shipper lid' input field is left empty and all other fields are filled.
      regressionInfusionSteps.shippingReceiptChecklist.tamperSealNoPositive(input.evoLast4Digits);

      //C40862 [POS] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Does the Tamper Seal Number listed on the Air Waybill....? and all other questions are answered.'
      regressionInfusionSteps.shippingReceiptChecklist.tamperSealMatchTogglePositive(input.evoLast4Digits, input.tamperSealNumber);

      //C40863 [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Does the Tamper Seal Number listed on the Air Waybill...?' and all other questions are answered.
      regressionInfusionSteps.shippingReceiptChecklist.tamperSealMatchToggleNegative();

      //C40864 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Does the Tamper Seal Number listed on the Air Waybill...?' and 'Details' are entered.
      regressionInfusionSteps.shippingReceiptChecklist.tamperSealMatchToggleWithDataPositive();

      //C40865 [POS] Verify that the data is retained on clicking 'Save & Close' button
      regressionInfusionSteps.shippingReceiptChecklist.dataSavingWithSaveAndClosePositive(input.evoLast4Digits, input.tamperSealNumber);

      //C40866 [POS] Verify if the data is retained after clicking 'Back' button from next step.
      regressionInfusionSteps.shippingReceiptChecklist.dataSavingWithBackButtonPositive(input.evoLast4Digits, input.tamperSealNumber);
    }),

    it('Shipment Receipt Checklist Summary', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      commonHappyPath.commonManufacturingHappyPath(scope);
      
      regressionInfusionSteps.shipmentReceiptChecklistSummary.previousHappyPathSteps(input.evoLast4Digits,therapy,input.tamperSealNumber);

      //C40818 [POS] Verify that the data gets save after editing with "Edit" button.
      regressionInfusionSteps.shipmentReceiptChecklistSummary.detailsOfShipmentEditButtonPositive(input.evoLast4Digits, input.tamperSealNumber);

      //C40819 [POS] Verify the "Next"  button should remain disabled when only "Verifier" signature is signed.
      regressionInfusionSteps.shipmentReceiptChecklistSummary.checkNextButtonWithoutSignaturePositive();

      //C40820 [POS]Verify the "Next" button should enabled after both signature are signed.
      regressionInfusionSteps.shipmentReceiptChecklistSummary.checkVerifierSignature();
    });

    it('Product Receipt Checklist', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      commonHappyPath.commonManufacturingHappyPath(scope);
      
      regressionInfusionSteps.productReceiptChecklist.previousHappyPathSteps(input.evoLast4Digits,therapy,input.tamperSealNumber);

      //C40758	[POS]Verify if 'next' button is disabled if Nothing selected for toggle ' Confirm CAR-T product cassette(s) were not exposed to ambient temperature greater than 3 minutes.'
      regressionInfusionSteps.productReceiptChecklist.cartProductTogglePositive();

      //C40759	[NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Confirm CAR-T product cassette(s) were not exposed to ambient temperature greater than 3 minutes.'
      regressionInfusionSteps.productReceiptChecklist.cartProductToggleNegative();

      //C40760	[POS]Verify if 'next' button is Enabled after filling reason for No toggle ' Confirm CAR-T product cassette(s) were not exposed to ambient temperature greater than 3 minutes.'
      regressionInfusionSteps.productReceiptChecklist.cartProductToggleWithDataPositive();

      //C40761	[POS] Verify if 'next' button is disabled if Nothing selected for toggle  ' Was there a temperature out-of-range alarm received? If yes, meaning a Temperature Out-of-Range (TOR) has occurred, proceed with
      regressionInfusionSteps.productReceiptChecklist.temperatureOutOfRangeTogglePositive();

      //C40762	[NEG] Verify if 'next' button is disabled if 'Yes selected for toggle ' Was there a temperature out-of-range alarm received? If yes, meaning a Temperature Out-of-Range (TOR) has  immediately and then follow the TOR procedures outlined in the ma'
      regressionInfusionSteps.productReceiptChecklist.temperatureOutOfRangeToggleNegative();

      //C40763 [POS]Verify if 'next' button is Enabled after filling reason for Yes toggle ' Was there a temperature out-of-range alarm received? If yes, meaning a Temperature Out-of-Range (TOR) immediately and then follow the TOR procedures outlined in the ma'
      regressionInfusionSteps.productReceiptChecklist.temperatureOutOfRangeToggleWithDataPositive();

      //C40764 [POS]Verify if 'next' button is disabled if Nothing selected for toggle ' Was the tamper evident seal in place on the cassette rack?'
      regressionInfusionSteps.productReceiptChecklist.sealInPlaceTogglePositive();

      //C40765 [NEG]Verify if 'next' button is disabled if 'No' selected for toggle  ' Was the tamper evident seal in place on the cassette rack?'
      regressionInfusionSteps.productReceiptChecklist.sealInPlaceToggleNegative();

      //C40766 [POS]Verify if 'next' button is Enabled after filling reason for No toggle  ' Was the tamper evident seal in place on the cassette rack?'
      regressionInfusionSteps.productReceiptChecklist.sealInPlaceToggleWithDataPositive();

      //C40767 [POS]Verify if 'next' button is disabled if Nothing selected for toggle ' Is each bag and cassette in the expected (e.g. no cassette damage,? If bag(s) or cassette(s) is not in expected condition, please contact Janssen for further instructions.'
      regressionInfusionSteps.productReceiptChecklist.expectedConditionTogglePositive();

      //C40768 [NEG]Verify if 'next' button is disabled if 'No' selected for toggle ' Is each bag and cassette in the exected cition (e.g. no cassette damage,)? If bag(s) or cassette(s) is not in expected condition, please contact Janssen for further instructions.'
      regressionInfusionSteps.productReceiptChecklist.expectedConditionToggleNegative();

      //C40769 [POS]Verify if 'next' button is Enabled after filling reason for No toggle ' Is each bag and cassette in the expected condition (e.g. no cassette damage, adhered)? If bag(s) or cassette(s) condition, please contact Janssen for further instructions.'
      regressionInfusionSteps.productReceiptChecklist.expectedConditionToggleWithDataPositive();

      //C40770 [POS]Verify if 'next' button is disabled if Nothing selected for toggle ' Has the CAR-T product cassette(s) been label: Store at ≤-120°C (-184°F), vapor phase of liquid nitrogen? This should be done even if there are any issues with the shipm'
      regressionInfusionSteps.productReceiptChecklist.placedIntoStorageTogglePositive();

      //C40771 [NEG] Verify if 'next' button is Enabled after filling reason for No toggle ' Has the CAR-T product cassette(s) placed : Store at ≤-120°C (-184°F), vapor phase of liquid nitrogen? This should be done even if there are any issues with the shipm'
      regressionInfusionSteps.productReceiptChecklist.placedIntoStorageToggleNegative();

      //C40772 [POS]Verify if 'next' button is Enabled after filling reason for No toggle ' Has the CAR-T product cassette(s) been placed into : Store at ≤-120°C (-184°F),  liquid nitrogen? This should be done even if there are any issues with the shipm'
      regressionInfusionSteps.productReceiptChecklist.placedIntoStorageToggleWithDataPositive();

      //C40773 [POS]Verify if 'next' button is Enabled after not filling data in 'Please enter additional comments about the receipt.' optional field.
      regressionInfusionSteps.productReceiptChecklist.additionalCommentPositive();

      //C40774 [POS] Verify that the data is retained on clicking 'Save & Close' button
      regressionInfusionSteps.productReceiptChecklist.dataSavingWithSaveAndClosePositive();

      //C40775 [POS] Verify if the data is retained after clicking 'Back' button from next step.
      regressionInfusionSteps.productReceiptChecklist.dataSavingWithBackButtonPositive();

    });

    it('Product Receipt Summary', () => {
      commonHappyPath.commonOrderingHappyPath(scope,therapy);
      commonHappyPath.commonCollectionHappyPath(scope);
      commonHappyPath.commonSatelliteLabHappyPath(scope);
      commonHappyPath.commonManufacturingHappyPath(scope);
      
      regressionInfusionSteps.productReceiptSummary.previousHappyPathSteps(input.evoLast4Digits,therapy,input.tamperSealNumber);

      //C40813 [POS]Verify the "Next" button should remain disbaled after signing the "Confirmer" signature.
      regressionInfusionSteps.productReceiptSummary.checkNextButtonWithoutVerifierSignaturePositive();

      //C40814 [POS]Verify the "Next" button is enabled when both signature are signed.
      regressionInfusionSteps.productReceiptSummary.checkVerifierSignature();
    })
  
    it('Check Statuses Of Infusion Module', () => {
    commonHappyPath.commonOrderingHappyPath(scope, therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    commonHappyPath.commonSatelliteLabHappyPath(scope);
    commonHappyPath.commonManufacturingHappyPath(scope);
    regressionInfusionSteps.checkStatusesOfInfusionModule(scope, therapy);
  });
  });