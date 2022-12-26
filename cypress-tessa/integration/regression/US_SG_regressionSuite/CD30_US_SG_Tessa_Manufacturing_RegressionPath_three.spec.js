import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/ordering_steps_regression.js';
import regressionManufacturingSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/manufacturing_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_SG_Regression/common_happypath.js';
import dayjs from 'dayjs';
Cypress.env('runWithHelpers', false);

describe('US-SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Manufacturing Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Manufacturing Start' , () => {
      const futureDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      const currentDate = dayjs().add(0, 'day').format('DD-MMM-YYYY');
      const pastDate = dayjs().subtract(1, 'day').format('DD-MMM-YYYY');
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope);

      regressionManufacturingSteps.manufacturingStart.previousHappyPathSteps(scope);

      //C21758 [NEG] Verify that "Next" button is disabled after giving incorrect input data in "Manufacturing Start Date (DD-MMM-YYYY)" field.
      regressionManufacturingSteps.manufacturingStart.nextButtonNegative(pastDate,currentDate,futureDate);

      //CC21759 [NEG] Verify that "Next" button is disabled after not giving input data in "The manufacturing process of CD30.CAR-T Product has started" checkbox .
      regressionManufacturingSteps.manufacturingStart.checkBoxNegative(pastDate);

      //C21760 [POS] Verify that the data is saving after clicking "Save and Close" button.
      regressionManufacturingSteps.manufacturingStart.saveAndCloseButtonPositive(pastDate);

      //C21819 [POS] Verify that the "Next" button is disabled after not signing the signature.
      regressionManufacturingSteps.manufacturingStart.verifyNextButtonWithoutSignaturePositive();

      //C21776 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.manufacturingStart.backButtonPositive(pastDate,currentDate);
    })

    it('Harvesting' , () => {
      const futureDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      const currentDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      const pastDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope);

      regressionManufacturingSteps.harvesting.previousHappyPathSteps(scope);

      //C21874 [NEG] Verify the "Manufactured on" date field with empty data and check "Next" button disabled.
      regressionManufacturingSteps.harvesting.verifyManufacturedOnNegative(futureDate);

      //C21875 [NEG] Verify the "Expiration Date" field with invalid data.
      regressionManufacturingSteps.harvesting.verifyExpirationDateNegative(pastDate);

      //C21879 [POS] Verify that after clicking the "Save and Close" button the selected data should be saved.
      regressionManufacturingSteps.harvesting.saveAndCloseButtonPositive(currentDate,scope.treatment.coi);

      //C21878 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.harvesting.backButtonPositive();
    });

    it('Print Finished Product Bag Labels' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope);

      regressionManufacturingSteps.printFpBagLabels.previousHappyPathSteps(scope);

      //C21863 [NEG] Verify that "Next" button is disabled after not giving input data in "Confirm that the expected bag labels printed correctly and are legible." checkbox .
      regressionManufacturingSteps.printFpBagLabels.verifyNextButtonNegative();

      //C21864 [POS] Verify that the data is saving after clicking "Save and Close" button.
      regressionManufacturingSteps.printFpBagLabels.saveAndCloseButtonPositive();

      //C21866 [POS] Verify that the "Next" button is disabled after not signing the signature.
      regressionManufacturingSteps.printFpBagLabels.verifyNextButtonWithoutSignaturePositive();

      //C21865 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.printFpBagLabels.backButtonPositive();
    });
  })
})
