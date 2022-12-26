import ordering_steps from '../../../utils/HappyPath_steps/CMLP_CILTA_RARITAN_HappyPath/ordering_steps_cilta';
import commonHappyPath from "../../../utils/Regression_steps/CMLP_CILTA_RARITAN_RegressionPath/common_happyPath_steps"
import regressionOrderingSteps from '../../../utils/Regression_steps/CMLP_CILTA_RARITAN_RegressionPath/ordering_steps_cilta'
import regressionCollectionSteps from '../../../utils/Regression_steps/CMLP_CILTA_RARITAN_RegressionPath/collection_steps_cilta'
import therapies from '../../../fixtures/therapy.json'


context('CMLP CILTA US Therapy Collection Regression Path', () => {
  const scope = {};
  const therapy = therapies.cmlp_cilta
  const region = 'US';

  beforeEach(() => {
    cy.clearCookies();
    ordering_steps.orderingData(scope);
    commonHappyPath.commonAliases();
    commonHappyPath.commonOrderingHappyPath(scope, therapy);
  });

  it('Patient Verification', () => {
    // C29900 [POS] Verify that "next" button should be disabled until the user signs the document.
    regressionCollectionSteps.patientVerification.nextButtonPos()
  });

  it('Collection Bag Identification', () => {
    regressionCollectionSteps.collectionBagIdentification.previousHappyPathSteps(scope)

    // C29886 [NEG] Verify if the "Next" button is disable if the "Scan or enter the DIN/Unique Donation Number/Apheresis ID" field is left empty.
    regressionCollectionSteps.collectionBagIdentification.apheresisIdNeg()

    // C29887 [NEG] Verify if the "Next" button is disable if the "Scan or enter the DIN/Unique Donation Number/Apheresis ID" field is left empty.
      regressionCollectionSteps.collectionBagIdentification.isSiteLabelsAppliedNeg()
      
    // C29889 C29888 [POS]Verify Back button is working.
      regressionCollectionSteps.collectionBagIdentification.backBtnPos()
  });

  it('Collection Bag Label Printing', () => {
    regressionCollectionSteps.collectionBagLabelPrinting.previousHappyPathSteps(scope)

    // C29890 [POS] Verify if the "Print Labels" button is clickable.
    regressionCollectionSteps.collectionBagLabelPrinting.printLablesClickable()

    // C29891 [NEG] Verify if the "next" button is disabled when "Confirm labels are printed successfully" checkbox is not checked.
    regressionCollectionSteps.collectionBagLabelPrinting.confirmPrintLabelNeg()

    // C29893 C29892 [NEG] Verify if "Next" button is disabled when the Signature is not signed.
      regressionCollectionSteps.collectionBagLabelPrinting.nextButtonPos()
    //   bug: next button is enabled
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