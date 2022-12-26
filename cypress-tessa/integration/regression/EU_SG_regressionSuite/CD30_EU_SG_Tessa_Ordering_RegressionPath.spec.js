import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_EU_SG_Regression/ordering_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_EU_SG_Regression/common_happypath.js';

Cypress.env('runWithHelpers', false);
describe('EU SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Ordering Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Subject Registration', () => {
      regressionOrderingSteps.selectTherapyHappyPath('tesscar001-cd30car-t-eu-sg');
      //C28259 '[NEG]  Verify the "Please enter the Date of Birth in the format of DD-MMM-YYYY (e.g. 31-JAN-1990) or MMM-YYYY (e.g. JAN-1990) or YYYY (e.g. 1990)
      regressionOrderingSteps.subjectRegistration.dobNegative(scope.patientInformation, scope.treatmentInformation);

      //C28260 '[POS]  Verify the "Please enter the Date of Birth in the format of DD-MMM-YYYY (e.g. 31-JAN-1990) or MMM-YYYY (e.g. JAN-1990) or YYYY (e.g. 1990) Or N/A"  field with valid data.'
      regressionOrderingSteps.subjectRegistration.dobPositive(scope.patientInformation);

      //C28261 '[NEG] Verify the "Subject ID" field with invalid data'
      regressionOrderingSteps.subjectRegistration.subjectIdNegative();

      //C28262 '[POS]  Verify the  "Subject ID"  field with valid data.'
      regressionOrderingSteps.subjectRegistration.subjectIdPositive(scope.patientInformation);

      //C28263'[POS]  Verify the  "The consent has been obtained from the subject" toggle button  with No button value.'
      regressionOrderingSteps.subjectRegistration.toggleButtonNegative();

      //C28264 [POS]  Verify the  "The consent has been obtained from the subject" toggle button  with selecting "No" button value.
      regressionOrderingSteps.subjectRegistration.toggleButtonPositive(scope.patientInformation);

      //C28265 [NEG]  Verify the  "Site Name"  dropdown without selecting value in it.
      regressionOrderingSteps.subjectRegistration.siteNameDropDownNegative(scope.patientInformation);

      //C28266 [POS] Verify after switching to next step after clicking "Next" button and then clicking "Back" button shouldn't change value in "Subject Registration" step.
      regressionOrderingSteps.subjectRegistration.nextButtonPositive(scope.patientInformation,scope.treatmentInformation);

    });

    it('Principle Investigator Information', () => {
      regressionOrderingSteps.selectTherapyHappyPath('tesscar001-cd30car-t-eu-sg');
      regressionOrderingSteps.principalInvestigatorInformation.previousHappyPathSteps(scope,'cd30Eu');

      //C28254 [POS]Verify that The "Next" button should be disabled until any physician name is not selected.
      regressionOrderingSteps.principalInvestigatorInformation.defaultdropdownPositive();

      //C28257 Verify that while switching between the "Principal Investigator" page to the "Subject Registration" page and back again the default value of "Dropdown" should be empty.
      regressionOrderingSteps.principalInvestigatorInformation.backbuttonPositive(scope.treatmentInformation);

      //C28255 [POS]Verify that the selected physician name is saved  after click on save and close button.
      regressionOrderingSteps.principalInvestigatorInformation.saveandcloseButtonPositive(scope.treatmentInformation,scope.patientInformation.subjectId);

      //C28256 [POS]Verify that while switching back from the "Schedule Collection" to "Principal Investigator Information" page the dropdown should retain the selected physician name.
      regressionOrderingSteps.principalInvestigatorInformation.nextbuttonPositive(scope.treatmentInformation);

    });

    it('Schedule Collection', () => {
      regressionOrderingSteps.selectTherapyHappyPath('tesscar001-cd30car-t-eu-sg');
      regressionOrderingSteps.scheduleCollectionEu.previousHappyPathSteps(scope,'cd30Eu');

      //C28275	[NEG] Verify when no date is selected on "Collection Date" field.
      regressionOrderingSteps.scheduleCollectionEu.collectionDateNotSelectedScheduleCollection(scope.patientInformation);

      //C28273	[NEG] Verify the "Contact Name" field as empty
      regressionOrderingSteps.scheduleCollectionEu.blankContactNameScheduleCollection('collection_cd30_eu_sg');

      //C28274	[NEG] Verify "Contact Phone Number" field as empty.
      regressionOrderingSteps.scheduleCollectionEu.blankContactPhoneNumberScheduleCollection();

      //C28276	[POS] Verify with valid "Contact Name", "Contact Phone Number" and "Collection Date"
      regressionOrderingSteps.scheduleCollectionEu.validDataScheduleCollection();

      //C28278	[POS] Verify that all the information is saved upon clicking "Save and Close".
      regressionOrderingSteps.scheduleCollectionEu.verifySaveAndCloseScheduleCollection(scope.patientInformation);

      //C28277	[POS] Verify that all the information is saved upon clicking "Next"
      regressionOrderingSteps.scheduleCollectionEu.verifyOnNextScheduleCollection();
    });

    it('Confirm Order', () => {
      regressionOrderingSteps.selectTherapyHappyPath('tesscar001-cd30car-t-eu-sg');
      regressionOrderingSteps.confirmOrder.previousHappyPathSteps(scope,'collection_cd30_eu_sg','cd30Eu');

      //C28287 [NEG] Verify 'Submit Order' and 'View Summary' is disabled without signature.
      regressionOrderingSteps.confirmOrder.verifyWithoutSignature();

      //C28289	[POS] Verify data is retained upon edit.
      regressionOrderingSteps.confirmOrder.verifyEdit('[data-testid="txt-contact-person-collection_cd30_eu_sg"]',
        '[data-testid="txt-phone-number-collection_cd30_eu_sg"]', '[data-testid="txt-additional-notes-collection_cd30_eu_sg"]');

      //C28288 [POS] Verify that 'View Summary' is enabled and order can be submitted with signature.
      regressionOrderingSteps.confirmOrder.verifyWithSignature();
    });

    it('Confirm Subject Eligibility', () =>{
      regressionOrderingSteps.selectTherapyHappyPath('tesscar001-cd30car-t-eu-sg');
      regressionOrderingSteps.confirmSubjectEligibilty.previousHappyPathSteps(scope,'collection_cd30_eu_sg','cd30Eu');

      // 	[POS] Verify that the "Next" button is disabled with the toggle button selected as "NO".
      regressionOrderingSteps.confirmSubjectEligibilty.toggleButtonNegativeConfirmSubjectEligibility();

      // [POS] Verify that the "Next" button is enabled with the toggle button selected as "YES".
      regressionOrderingSteps.confirmSubjectEligibilty.saveAndClosePositiveConfirmSubjectEligibility(scope.patientInformation);

      // [POS] Verify that the toggle button information is saved upon clicking the save and close button.
      regressionOrderingSteps.confirmSubjectEligibilty.toggleButtonPositiveConfirmSubjectEligibility(scope.patientInformation);

    });

    it('Approve Order', () => {
      regressionOrderingSteps.selectTherapyHappyPath('tesscar001-cd30car-t-eu-sg');
      regressionOrderingSteps.approveOrder.previousHappyPathSteps(scope,'collection_cd30_eu_sg','cd30Eu');

      // C21049	[NEG] Verify 'Approve Order' and 'View Summary' is disabled without signature.
      regressionOrderingSteps.approveOrder.verifyWithoutSignature();

      //C21052	[POS] Verify values are retained after edit.
      regressionOrderingSteps.approveOrder.verifyEdit('[data-testid="txt-contact-person-collection_cd30_eu_sg"]',
        '[data-testid="txt-phone-number-collection_cd30_eu_sg"]', '[data-testid="txt-additional-notes-collection_cd30_eu_sg"]');

      //C21050	[POS] Verify that order can be approved and 'View Summary' is enabled after signature is done.
      regressionOrderingSteps.approveOrder.verifyWithSignature();
    });
  });
});
