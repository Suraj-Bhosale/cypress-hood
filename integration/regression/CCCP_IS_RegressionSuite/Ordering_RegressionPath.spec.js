import order_steps from '../../../utils/HappyPath_steps/CCCP_IS_HappyPath/ordering_steps'
import commonHappyPath from "../../../utils/Regression_steps/CCCP_IS_RegressionPath/common_happyPath_steps"
import regressionOrderingSteps from '../../../utils/Regression_steps/CCCP_IS_RegressionPath/ordering_steps'
import therapies from '../../../fixtures/therapy.json'
import header from '../../../fixtures/assertions.json';

context('CCCP IS Therapy Ordering Regression Path', () => {
  beforeEach(() => {
    cy.clearCookies();
    order_steps.orderingData(scope);
    commonHappyPath.commonAliases();
  });

  const scope = {};
  const therapy = therapies.cccp_is
  const region = therapy.region;
  

  it('Check Statuses Of Ordering Module', () => {
    regressionOrderingSteps.checktheStatusesOfOrderingModule(therapy,scope,region)
   
  });

  it('Patient Information ', () => {
   regressionOrderingSteps.selectTherapyHappyPath(header.orders,therapy.context);

   regressionOrderingSteps.patientInformation.prescriber(scope.treatmentInformation, header.orderingSite,scope.patientHeaderBar,header);
   
   //[NEG] Verify Next button is disabled when Patient Id field is kept empty. 
   regressionOrderingSteps.patientInformation.emptyPatientId(scope.patientInformation)

   ////[NEG] Verify "Year of Birth" and Screening date with incorrect dates. 
   regressionOrderingSteps.patientInformation.negYearOfBirthAndScreeningDate(scope.patientInformation);

   // [NEG] Verify First name and Last name fields as empty
   regressionOrderingSteps.patientInformation.firstLastNamesEmpty(scope.patientInformation);

   // [NEG] Verify Subject Number as Empty field.
   regressionOrderingSteps.patientInformation.keepSubjectNumberAsEmpty(scope.patientInformation);

   //	[NEG] Verify Site Number as Empty field
   regressionOrderingSteps.patientInformation.keepSiteNumberAsEmpty(scope.patientInformation);

   // [NEG]Check for the Next button when No sex is selected. 
   regressionOrderingSteps.patientInformation.verifyNextButtonWithoutSelectingSex(scope.patientInformation);

   // [POS] Check for the data saved after clicking next 
   regressionOrderingSteps.patientInformation.checkForInfoSavedAfterClickingNext(scope.patientInformation);
   
  });

  it('Prescriber', () => {

    regressionOrderingSteps.selectTherapyHappyPath(header.orders,therapy.context);


    regressionOrderingSteps.SelectPrescriber.previousHappyPathSteps(scope,therapy);

    //[NEG] Verify that "Next" Button is disabled until physician is selected from the dropdown.
    regressionOrderingSteps.SelectPrescriber.negNoPhysicianSelected();

    //[POS] Verify that the selected physician is saved after clicking on Save and Close button.
    regressionOrderingSteps.SelectPrescriber.posSaveAndClose(scope.treatmentInformation,scope);

    //[POS] Verify that a reason for change is asked upon changing values.
    regressionOrderingSteps.SelectPrescriber.posVerifyReasonForChange();
  });


  it('Scheduling', () => {
    regressionOrderingSteps.selectTherapyHappyPath(header.orders,therapy.context);

    regressionOrderingSteps.scheduleCollection.previousHappyPathSteps( therapy,scope);

    // [NEG]Verifying the 'Next' button is disabled when 'Contact Person' input field is kept empty and all other details are filled
    regressionOrderingSteps.scheduleCollection.contactPerson();

    // [NEG] Verifying the 'Next' button is disabled when 'Contact Phone Number' input field is kept empty and all other details are filled
    regressionOrderingSteps.scheduleCollection.contactPhoneNumber();

    // C21934 [NEG] Verify when no date is selected on "Collection Date" field.
    regressionOrderingSteps.scheduleCollection.checkNextButtonWithoutScheduling();

    // [POS] Verify with valid "Contact Name", "Contact Phone Number" and  "Collection Date"
    regressionOrderingSteps.scheduleCollection.posvalues(region,therapy);

    regressionOrderingSteps.scheduleCollection.posSaveAndClose(scope)

    // [POS] Verify that all the information is saved upon clicking Next
    regressionOrderingSteps.scheduleCollection.checkForTheInfoSaved();
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
    regressionOrderingSteps.approval.verifySubmitButtonWithAndWithoutSign();
   
  });

});