import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_Regression/ordering_steps_regression.js';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_Regression/common_happypath.js';
Cypress.env('runWithHelpers', false);
describe('US-Tesscar Regression Path', () => {
  let scope = {};

  describe('Ordering Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Schedule Collection', () => {
      regressionOrderingSteps.selectTherapyHappyPath('tesscar001-cd30car-t-us');
      regressionOrderingSteps.scheduleCollectionUs.previousHappyPathSteps(scope,'cd30Us');

      //C28503	[NEG] Verify when no date is selected on "Collection Date" field. 
      regressionOrderingSteps.scheduleCollectionUs.collectionDateNotSelectedScheduleCollection(scope.patientInformation);

      //C28501	[NEG] Verify the 'Contact Name' field as empty 
      regressionOrderingSteps.scheduleCollectionUs.blankContactNameScheduleCollection('collection_cd30_us');

      //C28502	[NEG] Verify "Contact Phone Number" field as empty.
      regressionOrderingSteps.scheduleCollectionUs.blankContactPhoneNumberScheduleCollection();

      //C28504	[POS] Verify with valid "Contact Name", "Contact Phone Number" and "Collection Date" 
      regressionOrderingSteps.scheduleCollectionUs.validDataScheduleCollection();

      //C28506	[POS] Verify that all the information is saved upon clicking "Save and Close". 
      regressionOrderingSteps.scheduleCollectionUs.verifySaveAndCloseScheduleCollection(scope.patientInformation);

      //C28505	[POS] Verify that all the information is saved upon clicking "Next" 
      regressionOrderingSteps.scheduleCollectionUs.verifyOnNextScheduleCollection();

    });

    it('Confirm Order', () => {
      regressionOrderingSteps.selectTherapyHappyPath('tesscar001-cd30car-t-us');
      regressionOrderingSteps.confirmOrder.previousHappyPathSteps(scope,'collection_cd30_us','cd30Us');

      //C28515 [NEG] Verify 'Submit Order' and 'View Summary' is disabled without signature. 
      regressionOrderingSteps.confirmOrder.verifyWithoutSignature();

      //C28517	[POS] Verify data is retained upon edit. 
      regressionOrderingSteps.confirmOrder.verifyEdit('[data-testid="txt-contact-person-collection_cd30_us"]',
        '[data-testid="txt-phone-number-collection_cd30_us"]', '[data-testid="txt-additional-notes-collection_cd30_us"]');

      //C28516 [POS] Verify that 'View Summary' is enabled and order can be submitted with signature.
      regressionOrderingSteps.confirmOrder.verifyWithSignature();
    });
  });
});
