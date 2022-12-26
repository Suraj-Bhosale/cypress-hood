import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_EU_SG_Regression/ordering_steps_regression.js';
import regressionCollectionSteps from "../../../utils/Regression_steps/CD30_EU_SG_Regression/collection_steps_regression.js";
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_EU_SG_Regression/common_happypath.js';
import dayjs from 'dayjs';
Cypress.env('runWithHelpers', false);

describe('EU SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Collection Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Capture Collection Information' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
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

        regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
        regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
        regressionCollectionSteps.mncACollection.previousHappyPathSteps(scope);

        //C28450	[NEG] Verify with all fields as empty.
        regressionCollectionSteps.mncACollection.verifyEmptyFields();

        regressionCollectionSteps.mncACollection.validData();

        //C28460	[NEG] Verify MNC(A) Collection Instrument dropdown with no value selected.
        regressionCollectionSteps.mncACollection.dropdown1Empty();

        //C28461	[NEG] Verify Collection Program dropdown with no value selected.
        regressionCollectionSteps.mncACollection.dropdown2Empty();

        //C28462	[NEG] Verify Access Type dropdown with no value selected.
        regressionCollectionSteps.mncACollection.dropdown3Empty();

        //C28437	[POS] Verify that all drop-downs with "Other" option show a required response rationale.
        regressionCollectionSteps.mncACollection.verifyOtherOptionDropDown();

        //C28463	[NEG] Verify with nothing selected on Critical supplies toggle.
        regressionCollectionSteps.mncACollection.criticalSuppliesToggleUnselected();

        //C28438	[NEG] Verify by selecting 'No' on 'Critical supplies inspected toggle.
        regressionCollectionSteps.mncACollection.criticalSuppliesToggle();

        //C28464	[NEG] Verify with Collection date as empty.
        regressionCollectionSteps.mncACollection.collectionDateEmpty();

        //C28439	[NEG] Verify Next is disabled when collection date is a future date.
        regressionCollectionSteps.mncACollection.futureCollectionDate(futureDate);

        //C28458	[POS] Verify "Collection date" accepts past and current date.
        regressionCollectionSteps.mncACollection.collectionDateValid(pastDate, currentDate);

        //C28465	[NEG] Verify with Collection start time as empty
        regressionCollectionSteps.mncACollection.collectionStartTimeEmpty();

        //C28440	[NEG] Verify 'Collection start time' format.
        regressionCollectionSteps.mncACollection.collectionStartTimeFormat();

        //C28466	[NEG] Verify with Collection end time as empty
        regressionCollectionSteps.mncACollection.collectionEndTimeEmpty();

        //C28441	[NEG] Verify with 'Collection end time' having value less than 'Collection start time'.
        regressionCollectionSteps.mncACollection.collectionEndTimeFormat();

        //C28467	[NEG] Verify with Whole Blood Volume Processed as empty.
        regressionCollectionSteps.mncACollection.bloodVolumeEmpty();

        //C28454	[NEG] Verify 'Whole Blood Volume Processed' to not accept symbols and alphabets.
        regressionCollectionSteps.mncACollection.bloodVolumeNegative();

        //C28442	[POS] Verify 'Whole Blood Volume Processed' to accept only positive decimal values.
        regressionCollectionSteps.mncACollection.bloodVolumeValid();

        //C28468	[NEG] Verify with Total Anticoagulant in Product as empty.
        regressionCollectionSteps.mncACollection.totalAnticoagulantVolumeEmpty();

        //C28455	[NEG] Verify 'Total Anticoagulant in Product' to not accept symbol and alphabet values.
        regressionCollectionSteps.mncACollection.totalAnticoagulantVolumeNegative();

        //C28443	[POS] Verify 'Total Anticoagulant in Product' to accept only positive decimal values.
        regressionCollectionSteps.mncACollection.totalAnticoagulantVolumeValid();

        //C28469	[NEG] Verify with Enter Anticoagulant Type as empty.
        regressionCollectionSteps.mncACollection.anticoagulantTypeEmpty();

        //C28444	[POS] Verify 'Additional anticoagulant(s) Added' toggle shows additional fields.
        regressionCollectionSteps.mncACollection.additionalAnticoagulantToggle();

        //C28470	[NEG] Verify with Enter Additional Anticoagulant Type as empty.
        regressionCollectionSteps.mncACollection.additionalAnticoagulantTypeEmpty();

        //C28471	[NEG] Verify with Additional anticoagulant Volume as empty.
        regressionCollectionSteps.mncACollection.additionalAnticoagulantVolumeEmpty();

        //[NEG] Verify 'Additional anticoagulant Volume' to not accept symbol and alphabet values.
        regressionCollectionSteps.mncACollection.additionalAnticoagulantVolumeNegative();

        //C28445	[POS] Verify 'Additional anticoagulant Volume' accepts only positive decimal values.
        regressionCollectionSteps.mncACollection.additionalAnticoagulantVolumeValid();

        //C28446	[POS] Verify 'Autologous Plasma Volume' is optional.
        regressionCollectionSteps.mncACollection.autologousPlasmaVolumeOptional();

        //C28472	[NEG] Verify with Total Product Volume (including anticoagulant(s) and plasma) as empty.
        regressionCollectionSteps.mncACollection.totalProductVolumePlasmaEmpty();

        //C28459 [NEG] Verify 'Total Product Volume (including anticoagulant(s) and plasma)' to not accept symbols and alphabets.
        regressionCollectionSteps.mncACollection.totalProductVolumePlasmaNegative();

        //C28453 [POS] Verify 'Total Product Volume (including anticoagulant(s) and plasma)' only accepts positive numbers.
        regressionCollectionSteps.mncACollection.totalProductVolumePlasmaValid();

        //C28473 [NEG] Verify with Total MNC yield as empty
        regressionCollectionSteps.mncACollection.totalMncYieldEmpty();

        //C28456	[NEG] Verify 'Total MNC yield' to not accept symbol and alphabet values.
        regressionCollectionSteps.mncACollection.totalMncYieldNegative();

        //C28448	[POS] Verify 'Total MNC yield' accepts only positive numbers.
        regressionCollectionSteps.mncACollection.totalMncYieldValid();

        //C28474	[NEG] Verify with Total Product Volume (after CBC sampling) as empty.
        regressionCollectionSteps.mncACollection.totalProductVolumeEmpty();

        //C28457	[NEG] Verify 'Total Product Volume (after CBC sampling)' to not accept symbol and alphabet values.
        regressionCollectionSteps.mncACollection.totalProductVolumeNegative();

        //C28449 [POS] Verify 'Total Product Volume (after CBC sampling)'  accepts only positive numbers.
        regressionCollectionSteps.mncACollection.totalProductVolumeValid();

        //C28452	[POS] Verify data retains upon clicking 'Save and Close'.
        regressionCollectionSteps.mncACollection.verifySaveAndClose(scope.patientInformation, currentDate);

        //C28451	[POS] Verify data retains upon clicking 'Next'.
        regressionCollectionSteps.mncACollection.verifyNext(currentDate);
    });
  });
});


