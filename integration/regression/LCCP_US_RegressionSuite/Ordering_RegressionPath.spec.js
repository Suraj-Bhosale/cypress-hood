import order_steps from '../../../utils/HappyPath_steps/LCCP_US_HappyPath/ordering_steps';
import commonHappyPath from "../../../utils/Regression_steps/LCCP_US_RegressionPath/common_happyPath_steps"
import regressionOrderingSteps from '../../../utils/Regression_steps/LCCP_US_RegressionPath/ordering_steps'
import therapies from '../../../fixtures/therapy.json'
import header from '../../../fixtures/assertions.json';

context('LCCP US Therapy Ordering Regression Path', () => {
  beforeEach(() => {
    cy.clearCookies();
    order_steps.orderingData(scope);
    commonHappyPath.commonAliases();
  });

  const scope = {};
  const therapy = therapies.lccp_us
  const region = therapy.region;


  it('Check Status Of Ordering Module', () => {
    regressionOrderingSteps.checktheStatusOfOrderingModule(therapy, scope, region)
  });

  it('Patient Information ', () => {
    regressionOrderingSteps.selectTherapyHappyPath(header.orders, therapy.context)

    //C22741 [NEG] Verify Next button is disabled when No treatment ordering site is selected from the dropdown.
    regressionOrderingSteps.patientInformation.treatmentOrderingSelectNeg(scope.patientInformation)

    //C22742 [NEG] Verify "Year of Birth" and Screening date with incorrect dates.
    regressionOrderingSteps.patientInformation.yearOFBirthAndScreeningNeg(scope.patientInformation)

    //C38285 [NEG] Verify First name and Last name fields as empty
    regressionOrderingSteps.patientInformation.noFirstAndLastNameNeg(scope.patientInformation)

    //C38286 [NEG] Verify Subject Number as Empty field.
    regressionOrderingSteps.patientInformation.subjectNumberEmpty(scope.patientInformation)

    //C38287 [NEG] Verify Site Number as Empty field
    regressionOrderingSteps.patientInformation.siteNumberEmpty(scope.patientInformation)

    //C38288 [NEG]Check for the Next button when No sex is selected.
    regressionOrderingSteps.patientInformation.sexFieldEmpty()

    //C38289 [POS] Check for the data saved after clicking next
    regressionOrderingSteps.patientInformation.checkDataSavedForAllFields(scope.patientInformation)

  });

  it('Select Prescriber', () => {
    regressionOrderingSteps.selectTherapyHappyPath(header.orders, therapy.context)
    regressionOrderingSteps.selectPrescriber.previousHappyPathSteps(scope, therapy)

    //C22743 [NEG] Verify that "Next" Button is disabled until physician is selected from the dropdown.
    regressionOrderingSteps.selectPrescriber.physicianNameNotSelected()

    //C22744 [POS] Verify that the selected physician is saved after clicking on Save and Close button.
    regressionOrderingSteps.selectPrescriber.saveAndClose(scope.treatmentInformation, scope)

    //C22745 [POS] Verify that a reason for change is asked upon changing values.
    regressionOrderingSteps.selectPrescriber.reasonForChange()
  });

  it('Scheduling', () => {
    regressionOrderingSteps.selectTherapyHappyPath(header.orders,therapy.context);
    regressionOrderingSteps.scheduleCollection.previousHappyPathSteps( therapy,scope);

    // [NEG]Verifying the 'Next' button is disabled when 'Contact Person' input field is kept empty and all other details are filled
    regressionOrderingSteps.scheduleCollection.contactPerson();

    // [POS] Verifying the 'Next' button is disabled when 'Contact Phone Number' input field is kept empty and all other details are filled
    regressionOrderingSteps.scheduleCollection.contactPhoneNumber();

    // C21934 [NEG] Verify when no date is selected on "Collection Date" field.
    regressionOrderingSteps.scheduleCollection.checkNextButtonWithoutScheduling();

    // [POS] Verify with valid "Contact Name", "Contact Phone Number" and  "Collection Date"
    regressionOrderingSteps.scheduleCollection.posvalues(region,therapy);

    // [POS] Verify that the data is saving after clicking "Save and Close" button. 
    regressionOrderingSteps.scheduleCollection.posSaveAndClose(scope);

    // [POS] Verify that all the information is saved upon clicking Next
    regressionOrderingSteps.scheduleCollection.checkForTheInfoSaved(scope);
  });

  it('Confirmation', () => {
    regressionOrderingSteps.selectTherapyHappyPath(header.orders,therapy.context);
    regressionOrderingSteps.confirmation.previousHappyPathSteps( therapy,scope,region);

    // [POS] Verify that Edit buttons take you to the related pages
    regressionOrderingSteps.confirmation.verifyEditButtons(scope.treatmentInformation);

    // [POS] Verify that the  "Submit order " button is disabled when the signature is not provided and enabled when signature is provided
    regressionOrderingSteps.confirmation.verifySubmitButtonWithAndWithoutSign();
  });

  it('Approval', () => {
    regressionOrderingSteps.selectTherapyHappyPath(header.orders,therapy.context);

    regressionOrderingSteps.approval.previousHappyPathSteps( therapy,scope,region);

    // [POS] Verify that Edit buttons take you to the related pages
    regressionOrderingSteps.approval.verifyEditButtons(scope.treatmentInformation);

    // [POS] Verify that the  "Approval " button is disabled when the signature is not provided and enabled when signature is provided
    regressionOrderingSteps.approval.verifyApprovalButtonWithAndWithoutSign();
  });
});