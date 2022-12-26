import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_EU_SG_Regression/ordering_steps_regression';
import regressionSatelliteLabSteps from '../../../utils/Regression_steps/CD30_EU_SG_Regression/satellite_lab_steps_regression';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_EU_SG_Regression/common_happypath.js';
Cypress.env('runWithHelpers', false);

describe('EU-SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Satellite Lab Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Apheresis Product Receipt Summary ', () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteLabSteps.apheresisProductReceiptSummary.previousHappyPathSteps(scope);

      //C21337 [NEG] Verify after not doing confirmer signature "Next" button should be disabled.
      regressionSatelliteLabSteps.apheresisProductReceiptSummary.withoutSignCheckNextButtonNegative();

      //C21334 [POS] Verify "View Summary" button before and after signature.
      regressionSatelliteLabSteps.apheresisProductReceiptSummary.verifyViewSummaryPositive();

      //C21331 [POS] Verify "Edit" button for "Apheresis Product Receipt Summary" page.
      regressionSatelliteLabSteps.apheresisProductReceiptSummary.verifyEditButtonPositive();

      //C21333 [POS] Verify the resign signature after updating value through "Edit" button.
      regressionSatelliteLabSteps.apheresisProductReceiptSummary.verifySignatureAfterEditButtonPositive(scope);
    });

    it('Cryopreservation Date', ()=>{
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCommonHappyPath.commonCollectionHappyPath(scope);
      regressionSatelliteLabSteps.cryopreservationDate.previousHappyPathSteps(scope);

      //	C25861	[POS] Verify that Upon clicking on "Save and Close" the selected date is saved.
      regressionSatelliteLabSteps.cryopreservationDate.verifySaveandClose(scope.treatment.coi);

      // C25860	[POS] Verify that Data is retained upon clicking on "Next" button and the returning back to the same step.
      regressionSatelliteLabSteps.cryopreservationDate.verifyNextButton();
    });
  });
});
