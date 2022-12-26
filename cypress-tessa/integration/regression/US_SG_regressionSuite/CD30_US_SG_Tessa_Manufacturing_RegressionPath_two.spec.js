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

    it('PBMC Receipt', () =>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope);

      regressionManufacturingSteps.pbmcReceipt.previousHappyPathSteps(scope);

      //C21831	[NEG] Verify whether the "Next" button is enabled when invalid bag Id is entered.
      regressionManufacturingSteps.pbmcReceipt.invalidBagId(scope);

      //C21832	[NEG] verify whether the "Next" button is enabled when the provide rationale for response fields are kept empty
      regressionManufacturingSteps.pbmcReceipt.responseEmpty(scope);

      //C21833	[POS]verify whether the "Next" button is enabled when the provide rationale for response fields are filled
      regressionManufacturingSteps.pbmcReceipt.responseFilled();
    });

    it('Pbmc Receipt Summary' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope);

      regressionManufacturingSteps.pbmcReceiptSummary.previousHappyPathSteps(scope);

      //C21761 [POS] Verify the "View Summary" button is disabled before signature and enabled after signature.
      regressionManufacturingSteps.pbmcReceiptSummary.viewSummary();

      //C21762 [POS] Verify that after editing the page the "Next" button is disabled on the "PBMC Receipt Summary" page until re-signature is done.
      regressionManufacturingSteps.pbmcReceiptSummary.editButton();
    });

    it('Temperature Data' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');

      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope);

      regressionManufacturingSteps.temperatureData.previousHappyPathSteps(scope);

      //C21693 [NEG] Verify the "Next" button disabled after not selecting any value from toggle button.
      regressionManufacturingSteps.temperatureData.verifyNextButtonPositive();

      //C21911 [NEG] Verify the "Next" button while clicking "No" toggle button without giving reason.
      regressionManufacturingSteps.temperatureData.noToggleButtonNegative();

      //C21654 [POS] Verify the "Next" button while clicking "No" toggle button.
      regressionManufacturingSteps.temperatureData.noToggleButtonPositive();

      //C21657 [POS] Verify that the data is saving after clicking "Save and Close" button.
      regressionManufacturingSteps.temperatureData.saveAndCloseButtonPositive(scope.treatment.coi);

      //C21909 [POS] Verify that the "Next" button is disabled after not signing the signature.
      regressionManufacturingSteps.temperatureData.verifyNextButtonWithoutSignaturePositive();

      //C21658 [POS] Verify that the data is not moving after clicking "Next" button and then returning to same step with "Back" button.
      regressionManufacturingSteps.temperatureData.backButtonPositive();
    });
  })
})
