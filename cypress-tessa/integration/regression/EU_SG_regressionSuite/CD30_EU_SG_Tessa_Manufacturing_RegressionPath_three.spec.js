import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_EU_SG_Regression/ordering_steps_regression.js';
import regressionManufacturingSteps from '../../../utils/Regression_steps/CD30_EU_SG_Regression/manufacturing_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_EU_SG_Regression/common_happypath.js';
import dayjs from 'dayjs';
Cypress.env('runWithHelpers', false);

describe('EU SG Tesscar Regression Path', () => {
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
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope)

      regressionManufacturingSteps.manufacturingStartEu.previousHappyPathSteps(scope);

      //C28337 [NEG] Verify that "Next" button is disabled after giving incorrect input data in "Manufacturing Start Date (DD-MMM-YYYY)" field.
      regressionManufacturingSteps.manufacturingStartEu.nextButtonNegative(pastDate,currentDate,futureDate);

      //C28338 [NEG] Verify that "Next" button is disabled after not giving input data in "The manufacturing process of CD30.CAR-T Product has started" checkbox .
      regressionManufacturingSteps.manufacturingStartEu.checkBoxNegative(pastDate);

      //C28339 [POS] Verify that the data is saving after clicking "Save and Close" button.
      regressionManufacturingSteps.manufacturingStartEu.saveAndCloseButtonPositive(pastDate);

      //C28340 [POS] Verify that the "Next" button is disabled after not signing the signature.
      regressionManufacturingSteps.manufacturingStartEu.verifyNextButtonWithoutSignaturePositive();

      //C28341 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.manufacturingStartEu.backButtonPositive(pastDate,currentDate);
    })

    it('Harvesting' , () => {
      const futureDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      const currentDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      const pastDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope)

      regressionManufacturingSteps.harvestingEu.previousHappyPathSteps(scope);

      //C28295 [NEG] Verify the "Manufactured on" date field with empty data.
      regressionManufacturingSteps.harvestingEu.verifyManufacturedOnNegative(futureDate);

      //C28296 [NEG] Verify the "Expiration Date" field with invalid data.
      regressionManufacturingSteps.harvestingEu.verifyExpirationDateNegative(pastDate);

      //C28297 [POS] Verify that after clicking the "Save and Close" button the selected data should be saved.
      regressionManufacturingSteps.harvestingEu.saveAndCloseButtonPositive(currentDate,scope.treatment.coi);

      //C28298 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.harvestingEu.backButtonPositive();
    });

    it('Print Finished Product Bag Labels' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope)

      regressionManufacturingSteps.printFpBagLabelsEu.previousHappyPathSteps(scope);

      //C28088 [NEG] Verify that "Next" button is disabled after not giving input data in "Confirm that the expected bag labels printed correctly and are legible." checkbox .
      regressionManufacturingSteps.printFpBagLabelsEu.verifyNextButtonNegative();

      //C28089 [POS] Verify that the data is saving after clicking "Save and Close" button.
      regressionManufacturingSteps.printFpBagLabelsEu.saveAndCloseButtonPositive();

      //C28090 [POS] Verify that the "Next" button is disabled after not signing the signature.
      regressionManufacturingSteps.printFpBagLabelsEu.verifyNextButtonWithoutSignaturePositive();

      //C28091 [POS] Verify that the data is not missing after clicking "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.printFpBagLabelsEu.backButtonPositive();
    });
  })
})
