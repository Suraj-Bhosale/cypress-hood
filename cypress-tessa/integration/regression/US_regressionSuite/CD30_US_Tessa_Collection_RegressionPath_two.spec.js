import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_Regression/ordering_steps_regression.js';
import regressionCollectionSteps from "../../../utils/Regression_steps/CD30_US_Regression/collection_steps_regression.js";
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_Regression/common_happypath.js';
import dayjs from 'dayjs';
Cypress.env('runWithHelpers', false);

describe('US Tesscar Regression Path', () => {
  let scope = {};

  describe('Collection Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Capture Collection Information' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us', scope, 'cd30Us');
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

        regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us', scope, 'cd30Us');
        regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
        regressionCollectionSteps.mncACollection.previousHappyPathSteps(scope);

        //C28036	[NEG] Verify with all fields as empty.
        regressionCollectionSteps.mncACollection.verifyEmptyFields();

        regressionCollectionSteps.mncACollection.validData();

        //C28046	[NEG] Verify MNC(A) Collection Instrument dropdown with no value selected.
        regressionCollectionSteps.mncACollection.dropdown1Empty();

        //C28047	[NEG] Verify Collection Program dropdown with no value selected.
        regressionCollectionSteps.mncACollection.dropdown2Empty();

        //C28048	[NEG] Verify Access Type dropdown with no value selected.
        regressionCollectionSteps.mncACollection.dropdown3Empty();

        //C28023	[POS] Verify that all drop-downs with "Other" option show a required response rationale.
        regressionCollectionSteps.mncACollection.verifyOtherOptionDropDown();

        //C28049	[NEG] Verify with nothing selected on Critical supplies toggle.
        regressionCollectionSteps.mncACollection.criticalSuppliesToggleUnselected();

        //C28024	[NEG] Verify by selecting 'No' on 'Critical supplies inspected toggle.
        regressionCollectionSteps.mncACollection.criticalSuppliesToggle();

        //C28050	[NEG] Verify with Collection date as empty.
        regressionCollectionSteps.mncACollection.collectionDateEmpty();

        //C28025	[NEG] Verify Next is disabled when collection date is a future date.
        regressionCollectionSteps.mncACollection.futureCollectionDate(futureDate);

        //C28044	[POS] Verify "Collection date" accepts past and current date.
        regressionCollectionSteps.mncACollection.collectionDateValid(pastDate, currentDate);

        //C28051	[NEG] Verify with Collection start time as empty
        regressionCollectionSteps.mncACollection.collectionStartTimeEmpty();

        //C28026	[NEG] Verify 'Collection start time' format.
        regressionCollectionSteps.mncACollection.collectionStartTimeFormat();

        //C28052	[NEG] Verify with Collection end time as empty
        regressionCollectionSteps.mncACollection.collectionEndTimeEmpty();

        //C28027	[NEG] Verify with 'Collection end time' having value less than 'Collection start time'.
        regressionCollectionSteps.mncACollection.collectionEndTimeFormat();

        //C28053	[NEG] Verify with Whole Blood Volume Processed as empty.
        regressionCollectionSteps.mncACollection.bloodVolumeEmpty();

        //C28040	[NEG] Verify 'Whole Blood Volume Processed' to not accept symbols and alphabets.
        regressionCollectionSteps.mncACollection.bloodVolumeNegative();

        //C28028	[POS] Verify 'Whole Blood Volume Processed' to accept only positive decimal values.
        regressionCollectionSteps.mncACollection.bloodVolumeValid();

        //C28054	[NEG] Verify with Total Anticoagulant in Product as empty.
        regressionCollectionSteps.mncACollection.totalAnticoagulantVolumeEmpty();

        //C28041	[NEG] Verify 'Total Anticoagulant in Product' to not accept symbol and alphabet values.
        regressionCollectionSteps.mncACollection.totalAnticoagulantVolumeNegative();

        //C28029	[POS] Verify 'Total Anticoagulant in Product' to accept only positive decimal values.
        regressionCollectionSteps.mncACollection.totalAnticoagulantVolumeValid();

        //C28055	[NEG] Verify with Enter Anticoagulant Type as empty.
        regressionCollectionSteps.mncACollection.anticoagulantTypeEmpty();

        //C28030	[POS] Verify 'Additional anticoagulant(s) Added' toggle shows additional fields.
        regressionCollectionSteps.mncACollection.additionalAnticoagulantToggle();

        //C28056	[NEG] Verify with Enter Additional Anticoagulant Type as empty.
        regressionCollectionSteps.mncACollection.additionalAnticoagulantTypeEmpty();

        //C28057	[NEG] Verify with Additional anticoagulant Volume as empty.
        regressionCollectionSteps.mncACollection.additionalAnticoagulantVolumeEmpty();

        //[NEG] Verify 'Additional anticoagulant Volume' to not accept symbol and alphabet values.
        regressionCollectionSteps.mncACollection.additionalAnticoagulantVolumeNegative();

        //C28031	[POS] Verify 'Additional anticoagulant Volume' accepts only positive decimal values.
        regressionCollectionSteps.mncACollection.additionalAnticoagulantVolumeValid();

        //C28032	[POS] Verify 'Autologous Plasma Volume' is optional.
        regressionCollectionSteps.mncACollection.autologousPlasmaVolumeOptional();

        //C28058	[NEG] Verify with Total Product Volume (including anticoagulant(s) and plasma) as empty.
        regressionCollectionSteps.mncACollection.totalProductVolumePlasmaEmpty();

        //C28045 [NEG] Verify 'Total Product Volume (including anticoagulant(s) and plasma)' to not accept symbols and alphabets.
        regressionCollectionSteps.mncACollection.totalProductVolumePlasmaNegative();

        //C28039 [POS] Verify 'Total Product Volume (including anticoagulant(s) and plasma)' only accepts positive numbers.
        regressionCollectionSteps.mncACollection.totalProductVolumePlasmaValid();

        //C28059 [NEG] Verify with Total MNC yield as empty
        regressionCollectionSteps.mncACollection.totalMncYieldEmpty();

        //C28042	[NEG] Verify 'Total MNC yield' to not accept symbol and alphabet values.
        regressionCollectionSteps.mncACollection.totalMncYieldNegative();

        //C28034	[POS] Verify 'Total MNC yield' accepts only positive numbers.
        regressionCollectionSteps.mncACollection.totalMncYieldValid();

        //C28060	[NEG] Verify with Total Product Volume (after CBC sampling) as empty.
        regressionCollectionSteps.mncACollection.totalProductVolumeEmpty();

        //C28043	[NEG] Verify 'Total Product Volume (after CBC sampling)' to not accept symbol and alphabet values.
        regressionCollectionSteps.mncACollection.totalProductVolumeNegative();

        //C28035 [POS] Verify 'Total Product Volume (after CBC sampling)'  accepts only positive numbers.
        regressionCollectionSteps.mncACollection.totalProductVolumeValid();

        //C28038	[POS] Verify data retains upon clicking 'Save and Close'.
        regressionCollectionSteps.mncACollection.verifySaveAndClose(scope.patientInformation, currentDate);

        //C28037	[POS] Verify data retains upon clicking 'Next'.
        regressionCollectionSteps.mncACollection.verifyNext(currentDate);
    });
  });
});
