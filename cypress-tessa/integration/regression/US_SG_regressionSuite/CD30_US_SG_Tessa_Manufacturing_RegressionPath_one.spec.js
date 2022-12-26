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

    it('Lot Number' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope);

      //C21663 [NEG] Verify the "Enter And Confirm" field with empty data.
      regressionManufacturingSteps.lotNumber.emptyData(scope);

      //C21671 [POS] Verify that while switching back from the "Collection Summary" page to the "Lot Number" page selected value should retain.
      regressionManufacturingSteps.lotNumber.retainValue(scope.treatment.coi);
    });

    it('Shipment Receipt Checklist', () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope);

      regressionManufacturingSteps.shipmentReceiptChecklist.previousHappyPathSteps(scope);

      //C21972 [NEG] Verify whether the user able to click "Next" button without entering Air waybill.
      regressionManufacturingSteps.shipmentReceiptChecklist.emptyAwb('[data-testid="satellite-awb-action-trigger-button"]');

      //C21973 [NEG] Verify invalid Air waybill.
      regressionManufacturingSteps.shipmentReceiptChecklist.invalidAwb(
        '[data-testid="satellite-awb-input-field"]',
        '[data-testid="satellite-awb-action-trigger-button"]',
        '[data-testid="satellite-awb-error-message"]'
        );

      //C21974 [POS]  Verify that without adding "additional comment" Next button is enabled.
      regressionManufacturingSteps.shipmentReceiptChecklist.optionalField(
        '[data-testid="pass-button-satellite_lab_awb_match"]',
        '[data-testid="pass-button-shipping_container_condition"]',
        '[data-testid="pass-button-shipping_seal_intact"]'
      );

      //C21975 [POS] Verify that the values are retained.
      regressionManufacturingSteps.shipmentReceiptChecklist.retainValue(
        '[data-testid="pass-button-satellite_lab_awb_match"]',
        '[data-testid="pass-button-shipping_container_condition"]',
        '[data-testid="pass-button-shipping_seal_intact"]'
      );

      //C21976 [POS] Verify that reason for change is asked upon changing values.
      regressionManufacturingSteps.shipmentReceiptChecklist.reasonForChange(
        '[data-testid="fail-button-satellite_lab_awb_match"]',
        '[data-testid="#/properties/shipping_receipt_checklist/properties/satellite_lab_awb_not_match_reason-input"]'
      );

      //C21977 [NEG] Verify that the next button is disabled if any one of the "Please provide rationale for response" fields  are empty.
      regressionManufacturingSteps.shipmentReceiptChecklist.nextButtonDisabled(
        '[data-testid="fail-button-shipping_seal_intact"]'
      );
    });

    it('Shipment Receipt Summary' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope);

      regressionManufacturingSteps.shipmentReceiptSummary.previousHappyPathSteps(scope);

      //C21787 [POS] Verify the "View Summary" button is disabled before signature and enabled after signature.
      regressionManufacturingSteps.shipmentReceiptSummary.viewSummary();

      //C21788 [POS]Verify that after editing the page the "Next" button is disabled on the "Shipment Receipt Summary " page until re-signature is done.
      regressionManufacturingSteps.shipmentReceiptSummary.editButton();
    });
  })
})
