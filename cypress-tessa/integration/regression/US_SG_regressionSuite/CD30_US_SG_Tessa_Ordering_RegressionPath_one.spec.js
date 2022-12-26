import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/ordering_steps_regression';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_SG_Regression/common_happypath.js';
Cypress.env('runWithHelpers', false);
describe('US-SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Ordering Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Subject Registration', () => {
      regressionOrderingSteps.selectTherapyHappyPath('tesscar001-cd30car-t-us-sg');
      //C26449 '[NEG]  Verify the "Please enter the Date of Birth in the format of DD-MMM-YYYY (e.g. 31-JAN-1990) or MMM-YYYY (e.g. JAN-1990) or YYYY (e.g. 1990)
      regressionOrderingSteps.subjectRegistration.dobNegative(scope.patientInformation, scope.treatmentInformation);

      //C20923 '[POS]  Verify the "Please enter the Date of Birth in the format of DD-MMM-YYYY (e.g. 31-JAN-1990) or MMM-YYYY (e.g. JAN-1990) or YYYY (e.g. 1990) Or N/A"  field with valid data.'
      regressionOrderingSteps.subjectRegistration.dobPositive(scope.patientInformation);

      //C20911 '[NEG] Verify the "Subject ID" field with invalid data'
      regressionOrderingSteps.subjectRegistration.subjectIdNegative();

      //C20924 '[POS]  Verify the  "Subject ID"  field with valid data.'
      regressionOrderingSteps.subjectRegistration.subjectIdPositive(scope.patientInformation);

      //C20922'[POS]  Verify the  "The consent has been obtained from the subject" toggle button  with No button value.'
      regressionOrderingSteps.subjectRegistration.toggleButtonNegative();

      //C26455 [POS]  Verify the  "The consent has been obtained from the subject" toggle button  with selecting "No" button value.
      regressionOrderingSteps.subjectRegistration.toggleButtonPositive(scope.patientInformation);

      //C26452 [NEG]  Verify the  "Site Name"  dropdown without selecting value in it.
      regressionOrderingSteps.subjectRegistration.siteNameDropDownNegative(scope.patientInformation);

      //C26453 [POS] Verify after switching to next step after clicking "Next" button and then clicking "Back" button shouldn't change value in "Subject Registration" step.
      regressionOrderingSteps.subjectRegistration.nextButtonPositive(scope.patientInformation,scope.treatmentInformation);

    });

    it('Principle Investigator Information', () => {
      regressionOrderingSteps.selectTherapyHappyPath('tesscar001-cd30car-t-us-sg');
      regressionOrderingSteps.principalInvestigatorInformation.previousHappyPathSteps(scope,'cd30UsEu');

      //C20691 [POS]Verify that the "Next" button should be disabled until any physician name is not selected.
      regressionOrderingSteps.principalInvestigatorInformation.defaultdropdownPositive();

      //C20698 [POS] Verify that while switching between the "Principal Investigator" page to the "Subject Registration" page and back again the default value of "Dropdown" should be empty.
      regressionOrderingSteps.principalInvestigatorInformation.backbuttonPositive(scope.treatmentInformation);

      //C20695 [POS]Verify that the selected physician name is saved  after click on save and close button.
      regressionOrderingSteps.principalInvestigatorInformation.saveandcloseButtonPositive(scope.treatmentInformation,scope.patientInformation.subjectId);

      //C20696 [POS]Verify that while switching back from the "Schedule Collection" to "Principal Investigator Information" page the dropdown should retain the selected physician name.
      regressionOrderingSteps.principalInvestigatorInformation.nextbuttonPositive(scope.treatmentInformation);

    });
  });
});
