import ordering_steps from '../../../utils/HappyPath_steps/CMLP_CILTA_RARITAN_HappyPath/ordering_steps_cilta';
import commonHappyPath from "../../../utils/Regression_steps/CMLP_CILTA_RARITAN_RegressionPath/common_happyPath_steps"
import regressionSatelliteLabSteps from '../../../utils/Regression_steps/CMLP_CILTA_RARITAN_RegressionPath/satelite_lab_steps_cilta'
import therapies from '../../../fixtures/therapy.json'
import inputs from '../../../fixtures/inputs.json';


context('CMLP US Therapy Ordering Regression Path', () => {
  const scope = {};
  const therapy = therapies.cmlp_cilta
  const region = 'US';

  beforeEach(() => {
    cy.clearCookies();
    ordering_steps.orderingData(scope);
    commonHappyPath.commonAliases();
  });

  it('Verify Shipper', () => {
    commonHappyPath.commonOrderingHappyPath(scope,therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    regressionSatelliteLabSteps.verifyShipper.previousHappyPathSteps();

    //C38215 [POS] Verify the 'Next' button without entering data in "Scan or enter the COI Number found on the packing insert" field.
    regressionSatelliteLabSteps.verifyShipper.coiNumberPositive();

    //C38216 [NEG] Verify "Scan or enter the COI Number found on the packing insert" field with negative data.
    regressionSatelliteLabSteps.verifyShipper.coiNumberNegative();

    //C38217 [POS] Verify if the data is retained upon clicking 'Save & Close' button.
    regressionSatelliteLabSteps.verifyShipper.dataSavingWithsaveAndClosePositive();

    //C38218 [POS] Verify if the data is retained upon clicking 'Back' button from next step.
    regressionSatelliteLabSteps.verifyShipper.dataSavingWithBackButtonPositive();
  });

  it('Shipment Receipt Checklist', () => {
    commonHappyPath.commonOrderingHappyPath(scope,therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    regressionSatelliteLabSteps.shipmentReceiptChecklist.previousHappyPathSteps(therapy);

    //C36370 [POS] Verify if the 'Next' button is disabled until the  'Scan or enter the DIN/SEC-DIS or Apheresis bag identifier.' is not confirmed.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.scanAndEnterPositive();

    //C38463 [POS] Verify if the 'Next' button is disabled after giving negative data in 'Scan or enter the DIN/SEC-DIS or Apheresis bag identifier.' is not confirmed.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.scanAndEnterNegative();

    //C38476 [POS] Verify if the 'Next' button is enabled with or without entering data in  'List the serial number of the temperature monitoring device (if applicable to your country): (Optional)'  field.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.tempMonitoringPositive(inputs.day1Bag1Udn);

    //C38483 [POS] Verify if the 'Next' button is enabled with or without entering data in  "List the security seal number on the shipper (if applicable to your country):  (Optional)"  field.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.securitySealNoPositive();

    //C36371 [POS] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Does the downloaded temperature data..." and all other questions are answered.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.doesTempConformTogglePositive();

    //C36372 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Does the downloaded temperature data..." and all other questions are answered.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.doesTempConformToggleNegative();

    //C36373 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Does the downloaded temperature data..." and 'Details' are entered.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.doesTempConformToggleWithDataPositive();

    //C36374 [POS] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the apheresis bag inside..." and all other questions are answered.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.apheresisBagCondTogglePositive();

    //C36375 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the apheresis bag inside..." and all other questions are answered.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.apheresisBagCondToggleNegative();

    //C36376 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the apheresis bag inside..." and 'Details' are entered.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.apheresisBagCondToggleWithDataPositive();

    //C36377 [POS] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Will the apheresis bag be kept..." and all other questions are answered.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.coldShipperTogglePositive();

    //C36378 [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Will the apheresis bag be kept..." and all other questions are answered.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.coldShipperToggleNegative();

    //C36379 [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Will the apheresis bag be kept..." and 'Details' are entered.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.coldShipperToggleWithDataPositive();

    //C38484 [POS] Verify if the 'Next' button is enabled with or without entering data in  "Please enter additional comments about the receipt.  (Optional)"  field.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.additionalCommentsPositive();

    //C36380 [POS] Verify if the data is retained after clicking 'Save & Close' button.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.dataSavingWithSaveAndClosePositive();

    //C36381 [POS] Verify if the data is saving after clicking back button from next step.
    regressionSatelliteLabSteps.shipmentReceiptChecklist.dataSavingWithBackButtonPositive();

  }),

  it('Shipment Receipt Checklist Summary', () => {
    commonHappyPath.commonOrderingHappyPath(scope,therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    regressionSatelliteLabSteps.shipmentReceiptChecklistSummary.previousHappyPathSteps(therapy);

    //C36318 [POS] Verify that the 'Next' button should be disabled after the "Confirmer" signature.
    regressionSatelliteLabSteps.shipmentReceiptChecklistSummary.checkNextButtonWithoutSignaturePositive();

    //C36317 [POS] Verify that the data gets saved after changing data by clicking on 'Edit' button next to "Details Of Shipment' section.
    regressionSatelliteLabSteps.shipmentReceiptChecklistSummary.detailsOfShipmentEditButtonPositive();

    //C36319 [POS] Verify if the 'Next' button is enabled after verifier's signature is signed.
    regressionSatelliteLabSteps.shipmentReceiptChecklistSummary.checkVerifierSignature();
  });

  it('Cryopreservation Bags', () => {
    commonHappyPath.commonOrderingHappyPath(scope,therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    regressionSatelliteLabSteps.cryopreservatioBags.previousHappyPathSteps(scope,therapy);

    //C36334  [NEG] Verify if the 'Next' button is disabled until the 'Number of bags formulated for Cryopreservation' input field is left empty. 
    regressionSatelliteLabSteps.cryopreservatioBags.confirmNumberOfBags();  
      
    //C39001  [POS] Verify that the 'Next' button is disabled until you select the number of bags.  
    regressionSatelliteLabSteps.cryopreservatioBags.selectNumberOfBags(inputs.itemCount);      

    // C36335 [POS] Verify if the data is retained after clicking 'Save & Close' button. 
    regressionSatelliteLabSteps.cryopreservatioBags.dataSavingWithsaveAndClosePositive();   
  
  });

  it('Cryopreservation Labels', () => {
    commonHappyPath.commonOrderingHappyPath(scope,therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    regressionSatelliteLabSteps.cryopreservationLabels.previousHappyPathSteps(scope,therapy);

    // C36330 [NEG] Verify if the 'Next' button is disabled until the COI number for 'Scan or enter the COI bag identifier on Cassette 1' is not confirmed and all other details are filled.
    regressionSatelliteLabSteps.cryopreservationLabels.checkBagCoi();

    // C36331 [NEG] Verify if the 'Next' button is disabled until the COI number for 'Scan or enter the COI bag identifier on Bag 1' is not confirmed and all other details are filled.     
    regressionSatelliteLabSteps.cryopreservationLabels.checkCassetteCoi()

    // C36332 [POS] Verify if the signature block appears after clicking 'Next' button on Cryopreservation Labels page and also verifies confirmer's signature.  
    regressionSatelliteLabSteps.cryopreservationLabels.signatureBlock();

    // C36333 [POS] Verify if data is retained upon clicking 'Save & Close' button.
    regressionSatelliteLabSteps.cryopreservationLabels.dataSavingWithsaveAndClosePositive();

    //  C36534  [POS] Verify if the 'Back' link is working. 
    regressionSatelliteLabSteps.cryopreservationLabels.backButton();
    
 });
  it('Cryopreservation summary', () => {
    commonHappyPath.commonOrderingHappyPath(scope,therapy);
    commonHappyPath.commonCollectionHappyPath(scope);
    regressionSatelliteLabSteps.cryopreservationSummary.previousHappyPathSteps(scope,therapy);

    //C36325 [NEG] Verify if the 'Next' button is disabled after confirmer's signature is signed.
    //C36326 [POS] Verify if the 'Next' button is enabled after verifier's signature is signed.
    regressionSatelliteLabSteps.cryopreservationSummary.verifyNextButton();

    //C36327 [POS] Verify if the data is retained after clicking 'Save & Close' button.
    regressionSatelliteLabSteps.cryopreservationSummary.saveAndClose();

  });

  it('Check Statuses Of Satellite Module', () => {
     commonHappyPath.commonOrderingHappyPath(scope,therapy)
     commonHappyPath.commonCollectionHappyPath(scope);  

     regressionSatelliteLabSteps.checkStatusesOfSatelliteLabModule(scope,therapy)
    });
});