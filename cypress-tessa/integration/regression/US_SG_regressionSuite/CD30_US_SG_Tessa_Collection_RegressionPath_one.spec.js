import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/ordering_steps_regression.js';
import regressionCollectionSteps from "../../../utils/Regression_steps/CD30_US_SG_Regression/collection_steps_regression.js";
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_SG_Regression/common_happypath.js';
import dayjs from 'dayjs';
Cypress.env('runWithHelpers', false);

describe('US-SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Collection Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Print Apheresis product labels', () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      //C21055 [POS]Verify that The "Next" button should be disabled until the user checks the checkbox.
      regressionCollectionSteps.printApheresisProductLabels.checkBox();

      //C21056 [POS]Verify that while switching back from "IDM Sample Collection" to the "Print Apheresis Product Labels" page the checkbox should retain the selected value.
      regressionCollectionSteps.printApheresisProductLabels.backButton();
    });

    it('IDM Sample Collection', () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCollectionSteps.idmSampleCollection.previousHappyPathSteps();

      //C21149 [POS] Verify that the "Next" button is disabled until any one value of the toggle button is not selected.
      regressionCollectionSteps.idmSampleCollection.noValueSelected();

      //C21147 [POS] Verify that the "Next" button is enabled with the toggle button selected as "No".
      regressionCollectionSteps.idmSampleCollection.negativeToggle();

      //C21151 [POS] Verify that the toggle button information is saved upon clicking the save and close button.
      regressionCollectionSteps.idmSampleCollection.saveAndClose(scope.patientInformation.subjectId);

      //C21150 [POS] Verify that while switching back from the "Subject Verification" to the "IDM Sample Collection" page the toggle button should retain the selected value.
      regressionCollectionSteps.idmSampleCollection.nextButtonPositive();
    });

    it('Subject Verification', () =>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCollectionSteps.subjectVerification.previousHappyPathSteps();
      //[POS]Verify that The "Next" button should be disabled until user check a checkbox.
      regressionCollectionSteps.subjectVerification.checkbox();

      //[POS]Verify thatSignature block should be visible once user clicks on "Next".
      regressionCollectionSteps.subjectVerification.signatureBlock();

      //[POS]Verify that while switching back from Collection Bag Identification to Print Apheresis Product Labels page the checkbox should retain the selected value.
      regressionCollectionSteps.subjectVerification.checkboxValueIsRetained();
    })

    it('Collection Bag Identification' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCollectionSteps.collectionBagIdentification.previousHappyPathSteps(scope);

      //C21233 [POS] Verify that user able to click "Next" button without entering data in "Scan or enter the COI number from the label on the cell collection bag" field.
      regressionCollectionSteps.collectionBagIdentification.scanCoiPositive(scope);

      //C33065 [NEG] Verify that user not able to click "Next" button after entering invalid-data in "Scan or enter the COI number from the label on the cell collection bag" field.
      regressionCollectionSteps.collectionBagIdentification.scanCoiNegative(scope);

      //C21072 [POS] Verify that user able to click "Next" button without entering data in "Scan or enter the DIN/Unique Donation Number/Apheresis ID from your site's labels." field.
      regressionCollectionSteps.collectionBagIdentification.enterAndConfirmPositive();

      //C21073 [POS] Verify that user able to click "Next" button without  check "Confirm that your site's pre-collection label has been applied to the bag" checkbox
      regressionCollectionSteps.collectionBagIdentification.preCollectionLabelCheckboxPositive();

      //C21074 [POS] Verify that user able to click "Next" button without  check  "Confirm that you have applied the sponsor-provided label to the collection bag" checkbox.
      regressionCollectionSteps.collectionBagIdentification.sponsorProvidedLabelCheckboxPositive();

      //C25337 [POS] Verify that the data is saving after clicking "Save and Close" button.
      regressionCollectionSteps.collectionBagIdentification.saveAndCloseButtonPositive(scope.patientInformation);

      //C25338 [POS] Verify after switching to next step after clicking "Next" button and then clicking "Back" button shouldn't change value in "Collection Bag Identification" step..
      regressionCollectionSteps.collectionBagIdentification.backButtonPositive();
    });
  });
});


