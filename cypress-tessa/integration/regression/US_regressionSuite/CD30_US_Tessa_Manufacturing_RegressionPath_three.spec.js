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

    it('Harvesting' , () => {
      const futureDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      const currentDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      const pastDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us', scope, 'cd30Us');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);

      regressionManufacturingSteps.harvestingUs.previousHappyPathSteps(scope);

      //C33050 [NEG] Verify the "Total Volume" field with empty data.
      regressionManufacturingSteps.harvestingUs.negativeTotalVolume(futureDate);

      //C33051 [NEG] Verify the "Contents" field with empty data.
      regressionManufacturingSteps.harvestingUs.negativeContents(futureDate);

      //C28135 [NEG] Verify the "Manufactured on" date field with empty data.
      regressionManufacturingSteps.harvestingUs.verifyManufacturedOnNegative(futureDate);

      //C28136 [NEG] Verify the "Expiration Date" field with invalid data.
      regressionManufacturingSteps.harvestingUs.verifyExpirationDateNegative(pastDate);

      //C28137 [POS] Verify that after clicking the "Save and Close" button the selected data should be saved.
      regressionManufacturingSteps.harvestingUs.saveAndCloseButtonPositive(currentDate,scope.treatment.coi);

      //C28138 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.harvestingUs.backButtonPositive();
    });

    it('Print Finished Product Bag Labels' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us', scope, 'cd30Us');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);

      regressionManufacturingSteps.printFpBagLabelsUs.previousHappyPathSteps(scope);

      //C28299 [NEG] Verify that "Next" button is disabled after not giving input data in "Confirm that the expected bag labels printed correctly and are legible." checkbox .
      regressionManufacturingSteps.printFpBagLabelsUs.verifyNextButtonNegative();

      //C28300 [POS] Verify that the data is saving after clicking "Save and Close" button.
      regressionManufacturingSteps.printFpBagLabelsUs.saveAndCloseButtonPositive();

      //C28301 [POS] Verify that the "Next" button is disabled after not signing the signature.
      regressionManufacturingSteps.printFpBagLabelsUs.verifyNextButtonWithoutSignaturePositive();

      //C28302 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.printFpBagLabelsUs.backButtonPositive();
    });

    it('Confirm Number Of Bags' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us', scope, 'cd30Us');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionManufacturingSteps.confirmNumberOfBagsUs.previousHappyPathSteps(scope);

      //C28148 [NEG] Verify that the "Next" button should be disabled if the "How many bags resulted from today's manufacturing process?" field is kept empty.
      regressionManufacturingSteps.confirmNumberOfBagsUs.emptyData();

      //C28149 [NEG] Verify "How many bags resulted from today's manufacturing process?" input field with invalid data.
      regressionManufacturingSteps.confirmNumberOfBagsUs.invalidData();

      //C28150 [pos] Verify that after a click on the "Save and Close" button selected data should be saved.
      regressionManufacturingSteps.confirmNumberOfBagsUs.saveAndClose(scope.treatment.coi);

      //C28147 [POS] Verify that the data is not missing after clicking the "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.confirmNumberOfBagsUs.retainValue();
    });
  })
})
