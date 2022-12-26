import regressionOrderingSteps from '../../../utils/Regression_steps/CCLP_JP_RegressionPath/ordering_steps'
import regressionCollectionSteps from '../../../utils/Regression_steps/CCLP_JP_RegressionPath/collection_steps'
import regressionManufacturingSteps from '../../../utils/Regression_steps/CCLP_JP_RegressionPath/manufacturing_steps'
import regressionInfusionSteps from '../../../utils/Regression_steps/CCLP_JP_RegressionPath/infusion_steps'
import regressionCommonHappyPath from '../../../utils/Regression_steps/CCLP_JP_RegressionPath/common_happyPath_steps'
import therapies from "../../../fixtures/therapy.json"
import collection_steps from '../../../utils/HappyPath_steps/CCLP_JP_HappyPath/collection_steps'
import order_steps from '../../../utils/HappyPath_steps/CCLP_JP_HappyPath/ordering_steps'

context('CCLP JP Therapy Collection Regression Path', () => {
  beforeEach(() => {
    cy.clearCookies();
    order_steps.orderingData(scope);
    regressionCommonHappyPath.commonAliases();
  });

  const scope = {};
  const therapy = therapies.cclp_jp
  const region = therapy.region;


  it('Check Status Of Collection Module', () => {

  });

  it('Patient Verification', () => {
    regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy, region)

    regressionCollectionSteps.patientVerification.previousHappyPathSteps(scope)

    //[POS] Verify that 'next' button should be disabled until the user signs the document
    regressionCollectionSteps.patientVerification.nextButtonPos()

  });

  it('Collection Bag Identification', () => {

    regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy, region)

    regressionCollectionSteps.collectionBagIdentification.previousHappyPathSteps(scope)

    //[NEG] Verify if the 'next' button is disabled if the 'Pre-Collection Information' field is left empty
    regressionCollectionSteps.collectionBagIdentification.apheresisDateEmpty()

    //[NEG] Verify if the 'next ' button is disabled when a future date is selected in 'Pre-Collection Information' 
    regressionCollectionSteps.collectionBagIdentification.apheresisDateFutureNeg()

    //[POS]Verify if the 'next' button is enabled on filling in the present and past dates in 'Pre-Collection Information'
    regressionCollectionSteps.collectionBagIdentification.apheresisDatePos()

    //[NEG] Verify if the 'next' button is disable if the 'Scan or enter the DIN/Unique Donation Number/Apheresis ID' is empty.
    regressionCollectionSteps.collectionBagIdentification.apheresisIdNeg()

    //[NEG] Verify if the 'next' button is disabled when 'Verify your site’s pre-collection label has been affixed to the cell collection bag' checkbox is not checked
    regressionCollectionSteps.collectionBagIdentification.isSiteLabelsAppliedNeg()

    //[POS] Verify if the data is saved.
    regressionCollectionSteps.collectionBagIdentification.checkForInfoSaved()

  });

  it('Collection Bag Label Printing', () => {
    regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy, region)

    regressionCollectionSteps.collectionBagLabelPrinting.previousHappyPathSteps(scope)

    //[POS] Verify if the 'Print Labels' button is clickable.
    regressionCollectionSteps.collectionBagLabelPrinting.printLablesClickable()

    //[NEG] Verify if the 'next' button remains disabled when 'Confirm labels are printed successfully' checkbox is not checked 
    regressionCollectionSteps.collectionBagLabelPrinting.confirmPrintLabelNeg()

    //[NEG] Verify if the 'next' button remains disabled when 'Verify the apheresis label has been affixed to the collection bag' checkbox is not checked.
    regressionCollectionSteps.collectionBagLabelPrinting.verifyApplyLabelNeg()

    //[POS] Verify that the data is retained upon clicking 'Save and Close' button
    regressionCollectionSteps.collectionBagLabelPrinting.checkForInfoSaved(scope)

  });

  it('Collection Procedure Information', () => {

    regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy, region)

    regressionCollectionSteps.collectionProcedureInformation.previousHappyPathSteps(scope, therapy)

    //   [NEG] Verify 'Patient Weight (in Kg)' with invalid data. 
    regressionCollectionSteps.collectionProcedureInformation.verifyInvalidPatientWait()

  });

  it('Bag Data Entry', () => {

  });

  it('Collection Summary', () => {

  });

  it('Change Of Custody', () => {

  });

  it('Confirm Change Of Custody', () => {

  });

  it('Collection Transfer Product To Shipper', () => {

  });

  it('Collection Shipment Checklist', () => {

  });

  it('Collection Shipping Summary', () => {

  });
});