import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/ordering_steps_regression';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_SG_Regression/common_happypath.js';
Cypress.env('runWithHelpers', false);
describe('US-SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Ordering Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Schedule Collection', () => {
      regressionOrderingSteps.selectTherapyHappyPath('tesscar001-cd30car-t-us-sg');
      regressionOrderingSteps.scheduleCollection.previousHappyPathSteps(scope,'cd30UsEu');

      //C20802	[NEG] Verify when no date is selected on "Collection Date" field.
      regressionOrderingSteps.scheduleCollection.collectionDateNotSelectedScheduleCollection(scope.patientInformation);

      //C20690	[NEG] Verify the 'Contact Name' field as empty
      regressionOrderingSteps.scheduleCollection.blankContactNameScheduleCollection('collection_cd30_us_sg');

      //C20801	[NEG] Verify "Contact Phone Number" field as empty.
      regressionOrderingSteps.scheduleCollection.blankContactPhoneNumberScheduleCollection();

      //C20803	[POS] Verify with valid "Contact Name", "Contact Phone Number" and "Collection Date"
      regressionOrderingSteps.scheduleCollection.validDataScheduleCollection();

      //C20982	[POS] Verify that all the information is saved upon clicking "Save and Close".
      regressionOrderingSteps.scheduleCollection.verifySaveAndCloseScheduleCollection(scope.patientInformation);

      //C20812	[POS] Verify that all the information is saved upon clicking "Next"
      regressionOrderingSteps.scheduleCollection.verifyOnNextScheduleCollection();

    });

    it('Confirm Order', () => {
      regressionOrderingSteps.selectTherapyHappyPath('tesscar001-cd30car-t-us-sg');
      regressionOrderingSteps.confirmOrder.previousHappyPathSteps(scope,'collection_cd30_us_sg','cd30UsEu');

      //C21044 [NEG] Verify 'Submit Order' and 'View Summary' is disabled without signature.
      regressionOrderingSteps.confirmOrder.verifyWithoutSignature();

      //C24334	[POS] Verify data is retained upon edit.
      regressionOrderingSteps.confirmOrder.verifyEdit('[data-testid="txt-contact-person-collection_cd30_us_sg"]',
        '[data-testid="txt-phone-number-collection_cd30_us_sg"]', '[data-testid="txt-additional-notes-collection_cd30_us_sg"]');

      //C21045 [POS] Verify that 'View Summary' is enabled and order can be submitted with signature.
      regressionOrderingSteps.confirmOrder.verifyWithSignature();
    });
  });
});
