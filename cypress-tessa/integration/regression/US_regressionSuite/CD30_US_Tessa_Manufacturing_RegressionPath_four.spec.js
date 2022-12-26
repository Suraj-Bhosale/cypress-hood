import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_Regression/ordering_steps_regression.js';
import regressionManufacturingSteps from '../../../utils/Regression_steps/CD30_US_Regression/manufacturing_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_Regression/common_happypath.js';
import dayjs from 'dayjs';
Cypress.env('runWithHelpers', false);

describe('US Tesscar Regression Path', () => {
  let scope = {};

  describe('Manufacturing Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Manufacturing Summary' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us', scope, 'cd30Us');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionManufacturingSteps.manufacturingSummaryUs.previousHappyPathSteps(scope);

      //C28098 [POS] Verify the "View Summary" button before and after signature.
      regressionManufacturingSteps.manufacturingSummaryUs.viewSummary();

      //C28099 [POS] Verify the "Edit" button for "Manufacturing Start" page.
      regressionManufacturingSteps.manufacturingSummaryUs.editButton1();

      //C28100 [POS] Verify that after editing the "Harvesting" page the "Next" button is disabled on the manufacturing summary page until the re-signature is done.
      regressionManufacturingSteps.manufacturingSummaryUs.editButton2();

      //C28101 [POS] Verify the "Edit" button of the "Print finished product bag labels" page.
      regressionManufacturingSteps.manufacturingSummaryUs.editButton3();

      //C28102 [POS] Verify the "Edit" button of "Confirm number of bags" page.
      regressionManufacturingSteps.manufacturingSummaryUs.editButton4();
    });

    it('QA Release', () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us', scope, 'cd30Us');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);

      regressionManufacturingSteps.qaRelease.previousHappyPathSteps(scope);

      //C28073 [NEG] Verify click on "Next" button without uploading a doc.
      regressionManufacturingSteps.qaRelease.verifyNextButtonNegative();

      //C28074 [POS] Verify that the data is saving after clicking "Save and Close" button.
      regressionManufacturingSteps.qaRelease.saveAndCloseButtonPositive();

      //C28076 [POS] Verify that the "Next" button is disabled after not signing the signature.
      regressionManufacturingSteps.qaRelease.verifyNextButtonWithoutSignaturePositive();

      //C28077 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.qaRelease.backButtonPositive();
    })

    it('Sponser Release', () =>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us', scope, 'cd30Us');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);

      regressionManufacturingSteps.sponserReleaseUs.previousHappyPathSteps(scope);

      //C28082 [POS] Verify that the "View Document" button should be enabled for 'Review PBMC Release Documents' and 'Review QP Release Documents' sections.
      regressionManufacturingSteps.sponserReleaseUs.verifyViewDocumentButtonPositive();

      //C28083 [NEG] Verify click on "Next" button without uploading a doc.
      regressionManufacturingSteps.sponserReleaseUs.verifyNextButtonNegative();

      //C28084 [POS] Verify that the data is saving after clicking "Save and Close" button.
      regressionManufacturingSteps.sponserReleaseUs.saveAndCloseButtonPositive();

      //C28085 [POS] Verify that the "Next" button is disabled after not signing the signature.
      regressionManufacturingSteps.sponserReleaseUs.verifyNextButtonWithoutSignaturePositive();

      //C28086 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.sponserReleaseUs.backButtonPositive();
    });
  })
})
