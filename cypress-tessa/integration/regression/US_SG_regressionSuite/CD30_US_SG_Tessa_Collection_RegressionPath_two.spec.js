import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/ordering_steps_regression.js';
import regressionCollectionSteps from "../../../utils/Regression_steps/CD30_US_SG_Regression/collection_steps_regression.js";
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_SG_Regression/common_happypath.js';
import dayjs from 'dayjs';
Cypress.env('runWithHelpers', false);

describe('US-SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Collection Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Capture Collection Information' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCollectionSteps.captureCollectionInformation.previousHappyPathSteps(scope);

      //C21206	[NEG] Verify that the "Next" button is disabled when either "Subject Height" or "Subject Weight" field is empty
      regressionCollectionSteps.captureCollectionInformation.nextButtonDisabled();

      //C21203	[NEG] Verify that the "Subject Height" field does not accept alphabets or special characters.
      regressionCollectionSteps.captureCollectionInformation.subjectHeightFeildNegative();

      //C21204	[NEG] Verify that the "Subject Weight" field does not accept alphabets or special characters.
      regressionCollectionSteps.captureCollectionInformation.subjectWeightFeildNegative();

      //C21205	[POS] Verify that the "Subject Height" and "Subject Weight" fields accepts decimal values.
      regressionCollectionSteps.captureCollectionInformation.bothfieldsPositive();
    })

    it('MNC (A) Collection', () => {
      const futureDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      const pastDate = dayjs().subtract(1, 'day').format('DD-MMM-YYYY');
      const currentDate = dayjs().format('DD-MMM-YYYY');

      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCollectionSteps.mncACollection.previousHappyPathSteps(scope);

      //C21189	[NEG] Verify with all fields as empty.
      regressionCollectionSteps.mncACollection.verifyEmptyFields();

      regressionCollectionSteps.mncACollection.validData();

      //C26411	[NEG] Verify MNC(A) Collection Instrument dropdown with no value selected.
      regressionCollectionSteps.mncACollection.dropdown1Empty();

      //C26412	[NEG] Verify Collection Program dropdown with no value selected.
      regressionCollectionSteps.mncACollection.dropdown2Empty();

      //C26413	[NEG] Verify Access Type dropdown with no value selected.
      regressionCollectionSteps.mncACollection.dropdown3Empty();

      //C21173	[POS] Verify that all drop-downs with "Other" option show a required response rationale.
      regressionCollectionSteps.mncACollection.verifyOtherOptionDropDown();

      //C26414	[NEG] Verify with nothing selected on Critical supplies toggle.
      regressionCollectionSteps.mncACollection.criticalSuppliesToggleUnselected();

      //C21174	[NEG] Verify by selecting 'No' on 'Critical supplies inspected toggle.
      regressionCollectionSteps.mncACollection.criticalSuppliesToggle();

      //C26415	[NEG] Verify with Collection date as empty.
      regressionCollectionSteps.mncACollection.collectionDateEmpty();

      //C21175	[NEG] Verify Next is disabled when collection date is a future date.
      regressionCollectionSteps.mncACollection.futureCollectionDate(futureDate);

      //C26409	[POS] Verify "Collection date" accepts past and current date.
      regressionCollectionSteps.mncACollection.collectionDateValid(pastDate, currentDate);

      //C26416	[NEG] Verify with Collection start time as empty
      regressionCollectionSteps.mncACollection.collectionStartTimeEmpty();

      //C21176	[NEG] Verify with 3 digits for 'Collection start time'.
      regressionCollectionSteps.mncACollection.collectionStartTimeFormat();

      //C26417	[NEG] Verify with Collection end time as empty
      regressionCollectionSteps.mncACollection.collectionEndTimeEmpty();

      //C21177	[NEG] Verify with 'Collection end time' having value less than 'Collection start time'.
      regressionCollectionSteps.mncACollection.collectionEndTimeFormat();

      //C26418	[NEG] Verify with Whole Blood Volume Processed as empty.
      regressionCollectionSteps.mncACollection.bloodVolumeEmpty();

      //C24681	[NEG] Verify 'Whole Blood Volume Processed' to not accept symbols and alphabets.
      regressionCollectionSteps.mncACollection.bloodVolumeNegative();

      //C21178	[POS] Verify 'Whole Blood Volume Processed' to accept only positive decimal values.
      regressionCollectionSteps.mncACollection.bloodVolumeValid();

      //C26419	[NEG] Verify with Total Anticoagulant in Product as empty.
      regressionCollectionSteps.mncACollection.totalAnticoagulantVolumeEmpty();

      //C24686	[NEG] Verify 'Total Anticoagulant in Product' to not accept symbol and alphabet values.
      regressionCollectionSteps.mncACollection.totalAnticoagulantVolumeNegative();

      //C21179	[POS] Verify 'Total Anticoagulant in Product' to accept only positive decimal values.
      regressionCollectionSteps.mncACollection.totalAnticoagulantVolumeValid();

      //C26420	[NEG] Verify with Enter Anticoagulant Type as empty.
      regressionCollectionSteps.mncACollection.anticoagulantTypeEmpty();

      //C21180	[POS] Verify 'Additional anticoagulant(s) Added' toggle shows additional fields.
      regressionCollectionSteps.mncACollection.additionalAnticoagulantToggle();

      //C26421	[NEG] Verify with Enter Additional Anticoagulant Type as empty.
      regressionCollectionSteps.mncACollection.additionalAnticoagulantTypeEmpty();

      //C26422	[NEG] Verify with Additional anticoagulant Volume as empty.
      regressionCollectionSteps.mncACollection.additionalAnticoagulantVolumeEmpty();

      //[NEG] Verify 'Additional anticoagulant Volume' to not accept symbol and alphabet values.
      regressionCollectionSteps.mncACollection.additionalAnticoagulantVolumeNegative();

      //C21182	[POS] Verify 'Additional anticoagulant Volume' accepts only positive decimal values.
      regressionCollectionSteps.mncACollection.additionalAnticoagulantVolumeValid();

      //C21183	[POS] Verify 'Autologous Plasma Volume' is optional.
      regressionCollectionSteps.mncACollection.autologousPlasmaVolumeOptional();

      //C26423	[NEG] Verify with Total Product Volume (including anticoagulant(s) and plasma) as empty.
      regressionCollectionSteps.mncACollection.totalProductVolumePlasmaEmpty();

      //C26410 [NEG] Verify 'Total Product Volume (including anticoagulant(s) and plasma)' to not accept symbols and alphabets.
      regressionCollectionSteps.mncACollection.totalProductVolumePlasmaNegative();

      //C21198 [POS] Verify 'Total Product Volume (including anticoagulant(s) and plasma)' only accepts positive numbers.
      regressionCollectionSteps.mncACollection.totalProductVolumePlasmaValid();

      //C26424 [NEG] Verify with Total MNC yield as empty
      regressionCollectionSteps.mncACollection.totalMncYieldEmpty();

      //C24688	[NEG] Verify 'Total MNC yield' to not accept symbol and alphabet values.
      regressionCollectionSteps.mncACollection.totalMncYieldNegative();

      //C21186	[POS] Verify 'Total MNC yield' accepts only positive numbers.
      regressionCollectionSteps.mncACollection.totalMncYieldValid();

      //C26425	[NEG] Verify with Total Product Volume (after CBC sampling) as empty.
      regressionCollectionSteps.mncACollection.totalProductVolumeEmpty();

      //C24692	[NEG] Verify 'Total Product Volume (after CBC sampling)' to not accept symbol and alphabet values.
      regressionCollectionSteps.mncACollection.totalProductVolumeNegative();

      //C21187 [POS] Verify 'Total Product Volume (after CBC sampling)'  accepts only positive numbers.
      regressionCollectionSteps.mncACollection.totalProductVolumeValid();

      //C21192	[POS] Verify data retains upon clicking 'Save and Close'.
      regressionCollectionSteps.mncACollection.verifySaveAndClose(scope.patientInformation, currentDate);

      //C21191	[POS] Verify data retains upon clicking 'Next'.
      regressionCollectionSteps.mncACollection.verifyNext(currentDate);
    });
  });
});


