import ordering_steps from '../../../utils/HappyPath_steps/CCLP_CILTA_CENTRAL_HappyPath/ordering_steps_cilta';
import commonHappyPath from "../../../utils/Regression_steps/CCLP_CILTA_CENTRAL_RegressionPath/common_happyPath_steps"
import regressionCollectionSteps from '../../../utils/Regression_steps/CCLP_CILTA_CENTRAL_RegressionPath/collection_steps_cilta'
import therapies from '../../../fixtures/therapy.json'
Cypress.env('runWithTranslations', false);

context('CCLP US Therapy Collection Regression Path', () => {
  let scope = {};
  const therapy = therapies.cclp_cilta
  const region = 'US';

  beforeEach(() => {
    cy.clearCookies();
    ordering_steps.orderingData(scope);
    commonHappyPath.commonAliases();
    commonHappyPath.commonOrderingHappyPath(scope, therapy)
  });

  it('Patient Verification', () => {
    // C24795 [POS] Verify that "next" button should be disabled until the user signs the document.
    regressionCollectionSteps.patientVerification.nextButtonPos()
  });

  it('Collection Bag Identification', () => {
    regressionCollectionSteps.collectionBagIdentification.previousHappyPathSteps(scope)

    // C24852 [NEG] Verify if the "Next" button is disable if the "Scan or enter the DIN/Unique Donation Number/Apheresis ID" field is left empty.
    regressionCollectionSteps.collectionBagIdentification.apheresisIdNeg()

    // C24852 [NEG] Verify if the "Next" button is disable if the "Scan or enter the DIN/Unique Donation Number/Apheresis ID" field is left empty.
    regressionCollectionSteps.collectionBagIdentification.isSiteLabelsAppliedNeg()
  });

  it('Collection Bag Label Printing', () => {
    regressionCollectionSteps.collectionBagLabelPrinting.previousHappyPathSteps(scope)

    // C24854 [POS] Verify if the "Print Labels" button is clickable.
    regressionCollectionSteps.collectionBagLabelPrinting.printLablesClickable()

    // C24856 [NEG] Verify if the "next" button is disabled when "Confirm labels are printed successfully" checkbox is not checked.
    regressionCollectionSteps.collectionBagLabelPrinting.confirmPrintLabelNeg()

    // C24855 [NEG] Verify if "Next" button is disabled when the Signature is not signed.
    // regressionCollectionSteps.collectionBagLabelPrinting.nextButtonPos() bug : next button is enabled
  });

  it('Collection Procedure Information', () => {
    regressionCollectionSteps.collectionProcedureInformation.previousHappypathSteps(therapy,scope);

    //C24861	[NEG] Verify if 'next' button is disable if 'Patient Weight (in Kg)' is invalid or Patient weight left empty.
    regressionCollectionSteps.collectionProcedureInformation.patientWeightInvalid();

    //C24862	[NEG] Verify if the 'next' button remains disabled if 'End time for collection' field is left empty.
    regressionCollectionSteps.collectionProcedureInformation.endTimeBlank();
  });

  it('Collection Summary', () => {
      regressionCollectionSteps.collectionSummary.previousHappypathSteps(therapy,scope);

      //C24863	[POS] Verify if the 'edit ' button is working. 
      regressionCollectionSteps.collectionSummary.verifyEditBtn();

      //C24864	[NEG] Verify if 'Print' button is disable until user signs the document.
      regressionCollectionSteps.collectionSummary.printBtnDisable();

      //C24865	[POS]Verify if the next button remains disabled until the user signs the document.
      regressionCollectionSteps.collectionSummary.verifyNextBtn();

      //C24866	[POS] Verify if 'Print' button is working. 
      regressionCollectionSteps.collectionSummary.printBtnEnable();
  });

  it('Transfer Product to Shipper', () => {
      regressionCollectionSteps.transferProductToShipper.previousHappypathSteps(therapy,scope);

      //C24868	[NEG]Verify if 'next' button is disabled if DIN is left empty
      regressionCollectionSteps.transferProductToShipper.dinBlank(scope.coi);

      //C24867	[NEG]Verify if 'next' button is disabled COI left empty 
      regressionCollectionSteps.transferProductToShipper.coiBlank();

      //[POS] Verify if data is retained after clicking 'Save and close' button
      regressionCollectionSteps.transferProductToShipper.verifySaveAndCloseBtn(scope);
  });

  it('Shipment Checklist', () => {
    regressionCollectionSteps.shipmentChecklist.previousHappypathSteps(therapy,scope);

    //C24870	[NEG]Verify if the next button is disabled if the 'Please enter air waybill number for shipment.' field is empty 
    regressionCollectionSteps.shipmentChecklist.airwayBillEmpty();

    //C24871 [NEG] Verify Negative status of toggle for 'Confirm MNC (US only), Apheresis material was not exposed to ambient temperature greater than 60 minutes.'
    regressionCollectionSteps.shipmentChecklist.confirmMncNeg(scope);

    //C24872	[NEG]Verify Negative status of toggle for ' Has the apheresis material been placed into shipper at 2-8°C as per the apheresis bag Label?'
    regressionCollectionSteps.shipmentChecklist.idmSampleNeg();

    //C24873	[NEG]Verify Negative status of toggle for ' Has the infectious disease marker (IDM) samples or results been placed into the shipper?If not applicable, select NO and then enter ‘N/A’ in the comments box under question.'
    regressionCollectionSteps.shipmentChecklist.tempMonitorNeg();

    //C24875	[POS] Verify if data is saved after clicking 'save and close' button 
    regressionCollectionSteps.shipmentChecklist.verifySaveAndCloseBtn(scope);
  });

  it('Shipment Summary', () => {
    regressionCollectionSteps.shipmentSummary.previousHappypathSteps(therapy,scope);

    //C24876	[POS] Verify if Edit buttons are working 
    regressionCollectionSteps.shipmentSummary.verifyEditBtn();

    //C24877	[POS] Verify if the Done button remains disabled until the user signs the document
    regressionCollectionSteps.shipmentSummary.verifyDoneBtn();
  });

  it('Check Statuses Of Collection Module', () => {
      regressionCollectionSteps.checkStatusesOfCollectionModule(scope,therapy);
  });
});