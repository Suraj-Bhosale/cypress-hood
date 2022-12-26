import regressionOrderingSteps from '../../../utils/Regression_steps/CMLP_US_RegressionPath/ordering_steps'
import regressionCollectionSteps from '../../../utils/Regression_steps/CMLP_US_RegressionPath/collection_steps'
import regressionManufacturingSteps from '../../../utils/Regression_steps/CMLP_US_RegressionPath/manufacturing_steps'
import regressionSatelliteSteps from '../../../utils/Regression_steps/CMLP_US_RegressionPath/satelite_lab_steps'
import regressionInfusionSteps from '../../../utils/Regression_steps/CMLP_US_RegressionPath/infusion_steps'
import regressionCommonHappyPath from '../../../utils/Regression_steps/CMLP_US_RegressionPath/common_happyPath_steps'
import order_steps from '../../../utils/Regression_steps/CMLP_US_RegressionPath/ordering_steps'
import therapies from '../../../fixtures/therapy.json'
import input from '../../../fixtures/inputs.json'

context('CMLP US Therapy Satellite Regression Path', () => {
    beforeEach(() => {
      cy.clearCookies();
      order_steps.orderingData(scope);
      regressionCommonHappyPath.commonAliases();
    });

    const scope = {};
    const therapy = therapies.cmlp_us
    

    it('Check Statuses Of Satellite Module', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope);

      //CCCP-US- SatelliteLab:Check the status of each step for SatelliteLab module
      regressionSatelliteSteps.checktheStatusesOfSatelliteModule()
     
    });
  
    it('Sat Lab Collection Summary', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope);

      //[POS] Verify if the data is retained upon clicking 'Save & Close' button.
      regressionSatelliteSteps.satLabCollectionSummary.posSaveAndClose(scope);
     
    });
    
    it('Sat Lab Verify Shipment', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteSteps.satLabVerifyShipment.previousHappyPathSteps(scope)

      //[NEG] Verify "Scan or enter the COI Number found on the packing insert" input field with invalid inputs
      regressionSatelliteSteps.satLabVerifyShipment.coiBagIdentifierOnBagNeg();

      // [POS] Verify if the data is retained upon clicking 'Save & Close' button.
      regressionSatelliteSteps.satLabVerifyShipment.saveAndCloseButtonPositive();

      // [POS] Verify if the 'Back' link is working.
      regressionSatelliteSteps.satLabVerifyShipment.retainsValueUponClickingNext();
    });

    it('Sat Lab Shipment Checklist', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteSteps.satLabShipmentChecklist.previousHappyPathSteps('manufacturing-site', '-2003-cmlp-us', scope.coi);

      // [NEG] Verify if the 'Next' button is disabled until the bag identifier for"Scan the bag identifier" input field is not confirmed.
      regressionSatelliteSteps.satLabShipmentChecklist.coiBagIdentifierOnBagNeg();

      // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Does the downloaded temperature data..." and all other questions are answered.
      regressionSatelliteSteps.satLabShipmentChecklist.toggleEmptyDownloadTemp();

      // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Is the apheresis bag inside..." and all other questions are answered.
      regressionSatelliteSteps.satLabShipmentChecklist.toggleEmptyApheresisBag();

      // [NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question "Will the apheresis bag be kept..." and all other questions are answered.
      regressionSatelliteSteps.satLabShipmentChecklist.toggleEmptyApheresisTwo();

      // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Does the downloaded temperature data..." and all other questions are answered.
      regressionSatelliteSteps.satLabShipmentChecklist.toggleDownloadTempNeg();

      // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Is the apheresis bag inside..." and all other questions are answered.
      regressionSatelliteSteps.satLabShipmentChecklist.toggleApheresisBagNeg();

      // [NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question "Will the apheresis bag be kept..." and all other questions are answered.
      regressionSatelliteSteps.satLabShipmentChecklist.toggleApheresisTwoNeg();

      // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Will the apheresis bag be kept..." and 'Details' are entered.
      regressionSatelliteSteps.satLabShipmentChecklist.toggleApheresisTwoPos();

      // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Is the apheresis bag inside..." and 'Details' are entered.
      regressionSatelliteSteps.satLabShipmentChecklist.toggleApheresisBagPos();

      // [POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question "Does the downloaded temperature data..." and 'Details' are entered.
      regressionSatelliteSteps.satLabShipmentChecklist.toggleDownloadTempPos();

      // [POS] Verify if the data is retained upon clicking 'Save & Close' button.
      regressionSatelliteSteps.satLabShipmentChecklist.saveAndClosePos();

      // [POS] Verify if the 'Back' link is working.
      regressionSatelliteSteps.satLabShipmentChecklist.retainsValueUponClickingNext();

     
    });

    it('Sat Lab Shipment Checklist Summary', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
     regressionCommonHappyPath.commonCollectionHappyPath(scope)
     regressionSatelliteSteps.satLabShipmentChecklistSummary.previousHappyPathSteps('manufacturing-site', '-2003-cmlp-us', scope.coi)

     //[POS] Verify if the 'Reason for change' pop-up is appeared on clicking 'Edit' button next to "Details Of Shipment' section.
     regressionSatelliteSteps.satLabShipmentChecklistSummary.verifyEditPos()

     //[POS] Verify that the "Next" button is disabled when the signature is not provided and enabled when signature is provided
     regressionSatelliteSteps.satLabShipmentChecklistSummary.verifySignaturePos()

     //[POS] Verify if the data is retained after clicking 'Save & Close' button.
     regressionSatelliteSteps.satLabShipmentChecklistSummary.saveAndClosePos()
     
     
    });

    it('Sat Lab Cryopreservation', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope)
      regressionSatelliteSteps.satLabCryopreservation.previousHappyPathSteps('manufacturing-site', '-2003-cmlp-us', scope.coi)

        // [NEG] Verify if the 'Next' button is disabled until the 'Number of bags formulated for Cryopreservation' input field is left empty. 
      regressionSatelliteSteps.satLabCryopreservation.verifyNextButtonNeg()

        // [POS] Verify if the data is retained after clicking 'Save & Close' button. 
      regressionSatelliteSteps.satLabCryopreservation.verifySaveAndClose()
    });

    it('Sat Lab Cryopreservation Labels', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope)
      regressionSatelliteSteps.satLabCryopreservationLabels.previousHappyPathSteps('manufacturing-site', '-2003-cmlp-us', scope.coi)

      //[NEG] Verify  'Scan or enter the COI bag identifier on Cassette 1' with invalid data.
      regressionSatelliteSteps.satLabCryopreservationLabels.scanCassetteNeg()

      //[NEG] Verify  'Scan or enter the COI bag identifier on Bag 1' with incorrect data.
      regressionSatelliteSteps.satLabCryopreservationLabels.scanBagNeg()

      //[NEG]  Verify if the 'Next'  button is disabled until  the checkbox for  "Verify labels have been attached to all collection bags" is not checked and all other details are filled.
      regressionSatelliteSteps.satLabCryopreservationLabels.isVerifyLabelsNeg()

      //[NEG]  Verify if the 'Next'  button is disabled until  the checkbox for  "Confirm labels are printed successfully" is not checked and all other details are filled.
      regressionSatelliteSteps.satLabCryopreservationLabels.isConfirmLabelsNeg()

      //[POS] Verify if the signature block appears after clicking 'Next' button on Cryopreservation Labels page and also verifies confirmer's signature.
      regressionSatelliteSteps.satLabCryopreservationLabels.verifySignature()

      //[POS] Verify if the data is retained after clicking 'Save & Close' button. 
      regressionSatelliteSteps.satLabCryopreservationLabels.verifySaveAndClose()

      //[POS] Verify if the 'Back' link is working.
      regressionSatelliteSteps.satLabCryopreservationLabels.retainsValueUponClickingBack()
          
    });

    it('Sat Lab Bag Storage', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteSteps.satLabBagStorage.previousHappyPathSteps('manufacturing-site', '-2003-cmlp-us', scope.coi);

      // [NEG] Verify the "Scan or Enter the COI-based bag identifier for moving bag to storage (Bag 1)" input field with invalid data
      regressionSatelliteSteps.satLabBagStorage.coiBagIdentifierOnBagNeg();

      // [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionSatelliteSteps.satLabBagStorage.saveAndCloseButtonPositive();

      // [POS] Verify if the 'Back' link is working.
      regressionSatelliteSteps.satLabBagStorage.retainsValueUponClickingNext();
    });

    it('Sat Lab Cryopreservation Data', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteSteps.satLabCryopreservationData.previousHappyPathSteps('manufacturing-site', '-2003-cmlp-us', scope.coi,input);

      // [NEG] Verify the  "Scan or enter the bag identifier prior to entering bag details (Bag 1)" with invalid inputs
      regressionSatelliteSteps.satLabCryopreservationData.coiBagIdentifierOnBagNeg();

      // [NEG] Verify if the 'Next' button is disabled until the "Start Time of Cryopreservation (24h)" input field is left empty and all other details are filled.
      regressionSatelliteSteps.satLabCryopreservationData.cryoTimeNeg();

      // [NEG] Verify if the 'Next' button is disabled until the "Total MNC Cells (in e^9)" input field is left empty and all other details are filled.
      regressionSatelliteSteps.satLabCryopreservationData.totalCellFieldNeg();

      // [NEG] Verify if the 'Next' button is disabled until the "Product Volume (Cells + CS10) in mL" input field is left empty and all other details are filled.
      regressionSatelliteSteps.satLabCryopreservationData.productVolumeNeg();

      // [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionSatelliteSteps.satLabCryopreservationData.saveAndCloseButtonPositive();

      // [POS] Verify if the 'Back' link is working.
      regressionSatelliteSteps.satLabCryopreservationData.retainsValueUponClickingNext();

    });

    it('Sat Lab Cryopreservation Summary', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteSteps.satLabCryopreservationSummary.previousHappyPathSteps('manufacturing-site', '-2003-cmlp-us', scope.coi,input);

      // [POS] Verify if 'Edit' button next to 'Cryopreservation Data' section is working.
      regressionSatelliteSteps.satLabCryopreservationSummary.posEditButton();

      // [POS] Verify if the next button remains disabled until the user signs the document and enabled after signs the document
      regressionSatelliteSteps.satLabCryopreservationSummary.checkNextButtonWithAndWithoutSig();
     
     //[POS] Verify if the data is retained after clicking 'Save & Close' button.
     regressionSatelliteSteps.satLabCryopreservationSummary.saveAndClosePos()
    });


    it('Sat Lab Bag Selection', () => {
      regressionCommonHappyPath.commonOrderingHappyPath(scope,therapy)
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteSteps.satLabBagSelection.previousHappyPathSteps('manufacturing-site', '-2003-cmlp-us', scope.coi,input);

      // 	[NEG] Verify if the 'Next' button is disabled when any of the 'MANUFACTURING' or 'STORAGE' button on the bag selection page is not selected.
      regressionSatelliteSteps.satLabBagSelection.negNoInputForBagSelection();

      // 	[NEG] Verify if the 'Next' button is disabled when 'STORAGE' button on the bag selection page is selected. 
      regressionSatelliteSteps.satLabBagSelection.negStorage();

      // [POS] Verify if the data is retained after clicking 'Save & Close' button.
      regressionSatelliteSteps.satLabBagSelection.saveAndClosePos();

    });

  });
