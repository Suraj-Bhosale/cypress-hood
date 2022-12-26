import order_steps from '../../../utils/HappyPath_steps/CMCP_US_HappyPath/ordering_steps'
import commonHappyPath from "../../../utils/Regression_steps/CMCP_US_RegressionPath/common_happyPath_steps"
import regressionOrderingSteps from '../../../utils/Regression_steps/CMCP_US_RegressionPath/ordering_steps'
import input from '../../../fixtures/inputs.json'
import therapies from '../../../fixtures/therapy.json'
import header from '../../../fixtures/assertions.json';

context('CMCP US Therapy Ordering Regression Path', () => {
  beforeEach(() => {
    cy.clearCookies();
    order_steps.orderingData(scope);
    commonHappyPath.commonAliases();
  });

  const scope = {};
  const therapy = therapies.cmcp_us
  const region = therapy.region;


  it('Check Statuses Of Ordering Module', () => {
    regressionOrderingSteps.checktheStatusesOfOrderingModule(therapy,scope,region)
  });

  it('Patient Information ', () => {
    regressionOrderingSteps.selectTherapyHappyPath(header.orders, therapy.context);

    regressionOrderingSteps.patientInformation.prescriber(scope.treatmentInformation, header.orderingSite, scope.patientHeaderBar, header);

    // [C40572] [NEG] Verify "Year of Birth" and Screening date fields with incorrect dates.
    regressionOrderingSteps.patientInformation.negYearOfBirthAndScreeningDate(scope.patientInformation);

    // [C40568] [NEG] Verify First name and Last name fields as empty
    regressionOrderingSteps.patientInformation.firstLastNamesEmpty(scope.patientInformation);

    // [C40570] [NEG] Verify ' Subject Number' input fields with negative test data.
    regressionOrderingSteps.patientInformation.keepSubjectNumberAsEmpty(scope.patientInformation);

    // [C40571] [NEG] Verify 'Site Number' input fields with negative test data.
    regressionOrderingSteps.patientInformation.keepSiteNumberAsEmpty(scope.patientInformation);

    // [C40569] [NEG] Check for the Next button when No sex is selected.
    regressionOrderingSteps.patientInformation.verifyNextButtonWithoutSelectingSex(scope.patientInformation);

    // [C40573] [POS] Check for the data saved after clicking next
    regressionOrderingSteps.patientInformation.checkForInfoSavedAfterClickingNext(scope.patientInformation);

  });

  it('Prescriber', () => {

    regressionOrderingSteps.selectTherapyHappyPath(header.orders, therapy.context);

    regressionOrderingSteps.SelectPrescriber.previousHappyPathSteps(scope, therapy);

    // [C40574] [NEG] Verify if the 'Next' button is disabled when 'Physician Name' is not selected on "Treatment Principal Investigator" page.
    regressionOrderingSteps.SelectPrescriber.negNoPhysicialSelected();

    // [C40575] [POS] Verify if the data is retained upon clicking 'Save &amp; Close' button.
    regressionOrderingSteps.SelectPrescriber.posSaveAndClose(scope.treatmentInformation, scope);

    // [C40576] [POS] Verify that a reason for change is asked upon changing values.
    regressionOrderingSteps.SelectPrescriber.posVerifyReasonForChange();
  });

  it('Scheduling', () => {
    regressionOrderingSteps.selectTherapyHappyPath(header.orders, therapy.context);

    regressionOrderingSteps.Scheduling.previousHappyPathSteps(scope, therapy);

    // C40671 [NEG]Verifying the 'Next' button is disabled when 'Contact Person' input field is kept empty and all other details are filled
    regressionOrderingSteps.Scheduling.contactPerson();

    // C40672 [POS] Verifying the 'Next' button is disabled when 'Contact Phone Number' input field is kept empty and all other details are filled
    regressionOrderingSteps.Scheduling.contactPhoneNumber();

    // C40667[NEG] Verify when no date is selected on "Collection Date" field.
    regressionOrderingSteps.Scheduling.checkNextButtonWithoutScheduling();

    // C40669	 [POS] Verify with valid "Contact Name", "Contact Phone Number" and  "Collection Date"
    regressionOrderingSteps.Scheduling.posvalues(region, therapy);

    //C40669 [POS] Verify if the data is retained upon clicking 'Save & Close' button. 
    regressionOrderingSteps.Scheduling.posSaveAndClose(scope)

    // C40670	[POS] Verify that all the information is saved upon clicking Next
    regressionOrderingSteps.Scheduling.checkForTheInfoSaved();
  });

  it('Confirmation', () => {
    regressionOrderingSteps.selectTherapyHappyPath(header.orders, therapy.context);

    regressionOrderingSteps.confirmation.previousHappyPathSteps(therapy, scope, region);

    //C37756 [POS] Verify if 'Patient information' can be edited by clicking on 'Edit' button next to 'Patient information' section. 
    regressionOrderingSteps.confirmation.verifyEditButton1();

    //C37757	[POS] Verify if 'Physician Name' can be changed by clicking on 'Edit' button next to 'Treatment Prescriber' section. 
    regressionOrderingSteps.confirmation.verifyEditButton2();

    //C37758[POS] Verify if 'Collection' details can be edited by clicking on 'Edit' button next to 'Collection' section. 
    regressionOrderingSteps.confirmation.verifyEditButton3();

    //C37759	[POS] Verify if 'Satellite Lab' details can be edited by clicking on 'Edit' button next to 'Satellite Lab' section.
    regressionOrderingSteps.confirmation.verifyEditButton4();

    //C37760 [POS] Verify if 'Infusion' details can be edited by clicking on 'Edit' button next to 'Infusion' section. 
    regressionOrderingSteps.confirmation.verifyEditButton5();

    // C40673	[POS] Verify that the  "Submit order " button is disabled when the signature is not provided and enabled when signature is provided
    regressionOrderingSteps.confirmation.verifySubmitButtonWithAndWithoutSign();

    //C37763 [POS] Verify if 'Close' button is working. 
    regressionOrderingSteps.confirmation.posCloseButton(scope);
  });

  it('Approval', () => {

    regressionOrderingSteps.selectTherapyHappyPath(header.orders, therapy.context);

    regressionOrderingSteps.approval.previousHappyPathSteps(therapy, scope, region);

    //C40677[POS] Verify if 'Patient information' can be edited by clicking on 'Edit' button next to 'Patient information' section.
    regressionOrderingSteps.approval.verifyEditButton1();

    //C40678 [POS] Verify if 'Physician Name' can be changed by clicking on 'Edit' button next to 'Treatment Prescriber' section. 
    regressionOrderingSteps.approval.verifyEditButton2();

    //C40679 [POS] Verify if 'Collection' details can be edited by clicking on 'Edit' button next to 'Collection' section.
    regressionOrderingSteps.approval.verifyEditButton3();

    //C40680	[POS] Verify if 'Satellite Lab' details can be edited by clicking on 'Edit' button next to 'Satellite Lab' section. 
    regressionOrderingSteps.approval.verifyEditButton4();

    //C40681 [POS] Verify if 'Infusion' details can be edited by clicking on 'Edit' button next to 'Infusion' section. 
    regressionOrderingSteps.approval.verifyEditButton5();

    // C40675[POS] Verify that the  "Approval " button is disabled when the signature is not provided and enabled when signature is provided
    regressionOrderingSteps.approval.verifySubmitButtonWithAndWithoutSign();

    //C40676 [POS] Verify if 'Close' button is working. 
    regressionOrderingSteps.approval.posCloseButton(scope);
  });
});