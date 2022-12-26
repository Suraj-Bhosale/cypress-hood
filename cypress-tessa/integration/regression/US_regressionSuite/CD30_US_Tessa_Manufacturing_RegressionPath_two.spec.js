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

    it('Apheresis Product Receipt' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us', scope, 'cd30Us');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);

      regressionManufacturingSteps.apheresisProductReceiptUs.previousHappyPathSteps(scope);

      //C34278 [POS] Verify that user not able to click "Next" button without entering data in "Scan or enter the COI number from the label on the cell collection bag" field.
      regressionManufacturingSteps.apheresisProductReceiptUs.scanAndVerifyPositives();

      //C34279 [NEG] Verify that user not able to click "Next" button after entering invalid data in "Scan or enter the COI number from the label on the cell collection bag" field.
      regressionManufacturingSteps.apheresisProductReceiptUs.scanAndVerifyNegative();

      //C34286 [POS] Verify the "Next" button disabled after not selecting any value from temperature data toggle button.
      regressionManufacturingSteps.apheresisProductReceiptUs.withoutSelectingTemToggleButtonPositive();

      //C34287 [NEG] Verify the "Next" button while clicking "No"  temperature data toggle button without giving reason.
      regressionManufacturingSteps.apheresisProductReceiptUs.temtoggleButtonNegative();

      //C34288 [POS] Verify the "Next" button while clicking "No" temperature data toggle button.
      regressionManufacturingSteps.apheresisProductReceiptUs.temtoggleButtonPositive();

      //C34280 [POS] Verify the "Next" button disabled after not selecting any value from bag condition bag condition toggle button.
      regressionManufacturingSteps.apheresisProductReceiptUs.withoutSelectingBagConditionToggleButtonPositive();

      //C34281 [NEG] Verify the "Next" button while clicking "No" bag condition toggle button without giving reason.
      regressionManufacturingSteps.apheresisProductReceiptUs.bagConditiontoggleButtonNegative();

      //C34282 [POS] Verify the "Next" button while clicking "No" toggle button.
      regressionManufacturingSteps.apheresisProductReceiptUs.bagConditiontoggleButtonPositive();

      //C34283 [POS] Verify the "Next" button without entering data in Additional Comments  (Optional) field.
      regressionManufacturingSteps.apheresisProductReceiptUs.additionalCommentPositive();

      //C34284 [POS] Verify that the data is saving after clicking "Save and Close" button.
      regressionManufacturingSteps.apheresisProductReceiptUs.saveAndCloseButtonPositive();
      
      //C34285 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.apheresisProductReceiptUs.backButtonPositive();
    });

    it('Apheresis Product Receipt Summary' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us', scope, 'cd30Us');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);

      regressionManufacturingSteps.apheresisProductReceiptSummaryUs.previousHappyPathSteps(scope);

      //C34291 [POS] Verify the "View Summary" button is disabled before signature and enabled after signature.
      regressionManufacturingSteps.apheresisProductReceiptSummaryUs.verifyNextButtonWithoutSignaturePositive();

      //C34292 [POS] Verify that after editing the page the "Next" button is disabled on the "PBMC Receipt Summary" page until re-signature is done.
      regressionManufacturingSteps.apheresisProductReceiptSummaryUs.verifyDataWithEditButtonPositive();
    });

    it('Manufacturing Start' , () => {
      const futureDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      const currentDate = dayjs().add(0, 'day').format('DD-MMM-YYYY');
      const pastDate = dayjs().subtract(1, 'day').format('DD-MMM-YYYY');
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us', scope, 'cd30Us');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);

      regressionManufacturingSteps.manufacturingStartUs.previousHappyPathSteps(scope);

      //C28068 [NEG] Verify that "Next" button is disabled after giving incorrect input data in "Manufacturing Start Date (DD-MMM-YYYY)" field.
      regressionManufacturingSteps.manufacturingStartUs.nextButtonNegative(pastDate,currentDate,futureDate);

      //C28069 [NEG] Verify that "Next" button is disabled after not giving input data in "The manufacturing process of CD30.CAR-T Product has started" checkbox .
      regressionManufacturingSteps.manufacturingStartUs.checkBoxNegative(pastDate);

      //C28070 [POS] Verify that the data is saving after clicking "Save and Close" button.
      regressionManufacturingSteps.manufacturingStartUs.saveAndCloseButtonPositive(pastDate);

      //C28071 [POS] Verify that the "Next" button is disabled after not signing the signature.
      regressionManufacturingSteps.manufacturingStartUs.verifyNextButtonWithoutSignaturePositive();

      //C28072 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.manufacturingStartUs.backButtonPositive(pastDate,currentDate);
    })
  })
})
