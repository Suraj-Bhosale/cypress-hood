import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/ordering_steps_regression.js';
import regressionSatelliteLabSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/satellite_lab_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_SG_Regression/common_happypath.js';
Cypress.env('runWithHelpers', false);

describe('US-SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Satellite Lab Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Shipment Receipt Checklist' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteLabSteps.shipmentReceiptChecklist.previousHappyPathSteps(scope);

      //C36697 [POS] Verify the "Scan or enter the Air Waybill Number on the shipping label" field with empty data.
      regressionSatelliteLabSteps.shipmentReceiptChecklist.emptyAwd();

      //C36698 [POS] Verify the "Next" button after clicking the "Yes" value of all toggle buttons.
      regressionSatelliteLabSteps.shipmentReceiptChecklist.positiveToggle();

      //C21304 [POS] Verify the "Scan or enter the Air Waybill Number on the shipping label" field with invalid data.
      regressionSatelliteLabSteps.shipmentReceiptChecklist.validAwb();

      //C21294 [POS] Verify that while switching back from the "Apheresis Product Receipt Summary" page to the "Shipment receipt checklist" page all the selected values of toggle buttons should be saved.
      regressionSatelliteLabSteps.shipmentReceiptChecklist.nextButtonPositive();

      //C21302 [POS] Verify that reason for the change is asked upon changing the values.
      regressionSatelliteLabSteps.shipmentReceiptChecklist.changeValue();

      //C21313 [NEG] Verify that the next button should be disabled until the "Please provide a rationale for response" field is not filled.
      regressionSatelliteLabSteps.shipmentReceiptChecklist.nextButtonDisable();
    });

    it('Shipment Receipt Summary', () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteLabSteps.shipmentReceiptSummary.previousHappyPathSteps(scope);

      //C21710	[POS] Verify that upon edit the values are retained
      regressionSatelliteLabSteps.shipmentReceiptSummary.verifyEdit();

      //C21711	[NEG] Verify "Next" is disabled without signature
      regressionSatelliteLabSteps.shipmentReceiptSummary.verifyWithoutSignature();

      // C21712	[POS] Verify "Next is enabled with signature
      regressionSatelliteLabSteps.shipmentReceiptSummary.verifyWithSignature();
    });

    it('Apheresis Product Receipt', () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteLabSteps.apheresisProductReceipt.previousHappyPathSteps(scope);

      // [NEG] Enter Invalid value in "Scan or enter the COI number from the label on the cell collection bag." field
      regressionSatelliteLabSteps.apheresisProductReceipt.invalidCoi();

      // [NEG] Verify whether the "Next" button is enabled when the "Please provide rationale for response." is kept empty.
      regressionSatelliteLabSteps.apheresisProductReceipt.emptyReasonField(scope.treatment.coi);

      // [POS] Verify whether the "Next" button is enabled when the "Please provide rationale for response." is filled.
      regressionSatelliteLabSteps.apheresisProductReceipt.reasonFieldFilled();
    });
  });
});
