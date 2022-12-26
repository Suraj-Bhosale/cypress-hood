import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_Regression/ordering_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_Regression/common_happypath.js';
Cypress.env('runWithHelpers', false);
describe('US-Tesscar Regression Path', () => {
  let scope = {};

  describe('Ordering Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Subject Registration', () => {
      regressionOrderingSteps.selectTherapyHappyPath('tesscar001-cd30car-t-us');
      //C28487 '[NEG]  Verify the "Please enter the Date of Birth in the format of DD-MMM-YYYY (e.g. 31-JAN-1990) or MMM-YYYY (e.g. JAN-1990) or YYYY (e.g. 1990)
      regressionOrderingSteps.subjectRegistration.dobNegative(scope.patientInformation, scope.treatmentInformation);

      //C28488 '[POS]  Verify the "Please enter the Date of Birth in the format of DD-MMM-YYYY (e.g. 31-JAN-1990) or MMM-YYYY (e.g. JAN-1990) or YYYY (e.g. 1990) Or N/A"  field with valid data.'
      regressionOrderingSteps.subjectRegistration.dobPositive(scope.patientInformation);

      //C28489 '[NEG] Verify the "Subject ID" field with invalid data'
      regressionOrderingSteps.subjectRegistration.subjectIdNegative();

      //C28490 '[POS]  Verify the  "Subject ID"  field with valid data.'
      regressionOrderingSteps.subjectRegistration.subjectIdPositive(scope.patientInformation);

      //C28491'[POS]  Verify the  "The consent has been obtained from the subject" toggle button  with No button value.'
      regressionOrderingSteps.subjectRegistration.toggleButtonNegative();

      //C28492 [POS]  Verify the  "The consent has been obtained from the subject" toggle button  with selecting "No" button value.
      regressionOrderingSteps.subjectRegistration.toggleButtonPositive(scope.patientInformation);

      //C28493 [NEG]  Verify the  "Site Name"  dropdown without selecting value in it.
      regressionOrderingSteps.subjectRegistration.siteNameDropDownNegative(scope.patientInformation);

      //C28494 [POS] Verify after switching to next step after clicking "Next" button and then clicking "Back" button shouldn't change value in "Subject Registration" step.
      regressionOrderingSteps.subjectRegistration.nextButtonPositive(scope.patientInformation,scope.treatmentInformation);

    });

    it('Principle Investigator Information', () => {
      regressionOrderingSteps.selectTherapyHappyPath('tesscar001-cd30car-t-us');
      regressionOrderingSteps.principalInvestigatorInformation.previousHappyPathSteps(scope,'cd30Us');

      //C28482 [POS]Verify that The "Next" button should be disabled until any physician name is not selected.
      regressionOrderingSteps.principalInvestigatorInformation.defaultdropdownPositive();

      //C28485 [POS] Verify that while switching between the "Principal Investigator" page to the "Subject Registration" page and back again the default value of "Dropdown" should be empty.
      regressionOrderingSteps.principalInvestigatorInformation.backbuttonPositive(scope.treatmentInformation);

      //C28483 [POS]Verify that the selected physician name is saved  after click on save and close button.
      regressionOrderingSteps.principalInvestigatorInformation.saveandcloseButtonPositive(scope.treatmentInformation,scope.patientInformation.subjectId);

      //C28484 [POS]Verify that while switching back from the "Schedule Collection" to "Principal Investigator Information" page the dropdown should retain the selected physician name.
      regressionOrderingSteps.principalInvestigatorInformation.nextbuttonPositive(scope.treatmentInformation);

    });
  });
});
