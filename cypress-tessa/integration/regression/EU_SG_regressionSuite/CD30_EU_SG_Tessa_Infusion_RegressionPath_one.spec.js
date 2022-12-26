import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_EU_SG_Regression/ordering_steps_regression.js';
import regressionInfusionSteps from '../../../utils/Regression_steps/CD30_EU_SG_Regression/infusion_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_EU_SG_Regression/common_happypath.js';
import dayjs from 'dayjs';
Cypress.env('runWithHelpers', false);

describe('EU SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Infusion Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Shipment Receipt Checklist ', () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope)
      regressionCommonHappyPath.commonManufacturingPathEU(scope);

      //C28534 [POS] Verify whether the user able to click "Next" button without entering data in "Scan or enter the COI number from the label on the cell collection bag" field.
      regressionInfusionSteps.shipmentReceiptChecklist.emptyAwb();

      //C28535 [POS]  Verify that without adding "additional comment" Next button should be enabled
      regressionInfusionSteps.shipmentReceiptChecklist.optionalField();

      //C28536 [POS] Verify that while switching back from Apheresis Product Receipt Summary page to Shipment receipt checklist page  selected values should be saved.
      regressionInfusionSteps.shipmentReceiptChecklist.retainValue();

      //C28537 [POS] Verify that after clicking the "Next" button a reason for change is asked upon changing values.
      regressionInfusionSteps.shipmentReceiptChecklist.changeValue();

      //C28538 [NEG] Verify that the next button is disabled if any one of the" Please provide rationale for response" fields  are empty.
      regressionInfusionSteps.shipmentReceiptChecklist.nextButtonDisable();
    });

    it('Shipment Receipt Summary', () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionCommonHappyPath.commonSatelliteLabPath(scope)
      regressionCommonHappyPath.commonManufacturingPathEU(scope);
      regressionInfusionSteps.shipmentReceiptSummary.previousHappyPathSteps();

      //C28531 [NEG] Verify Next and Print Summary is disabled without signature
      regressionInfusionSteps.shipmentReceiptSummary.verifyWithoutSignature();

      //C28532 [POS] Verify Next and Print Summary is enabled with signature
      regressionInfusionSteps.shipmentReceiptSummary.verifyWithSignature();
    })
  })
})
