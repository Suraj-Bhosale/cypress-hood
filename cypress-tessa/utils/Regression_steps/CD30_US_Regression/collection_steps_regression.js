import tableHelpers from "../../shared_block_helpers/tableHelpers";
import regressionInput from '../../../fixtures/inputsRegression.json';
import inputChecker from '../../shared_block_helpers/inputFieldCheckHelpers';
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers';
import collectionAssertions from '../../../fixtures/collectionAssertions.json';
import signatureHelpers from '../../shared_block_helpers/signatureHelpers';
import translationHelpers from "../../shared_block_helpers/translationHelpers";
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers';
import inputs from '../../../fixtures/inputs.json';
import inputsRegression from "../../../fixtures/inputsRegression.json";
import collectionRegressionInputs from '../../../fixtures/collectionRegressionInputs.json';
import collectionStepsHappyPath from "../../HappyPath_steps/CD30_US_HappyPath/collection_steps";

export default {

  printApheresisProductLabels: {
    checkBox: () => {
      cy.log('Print Apheresis Product Labels')
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.clickOnCheck('[data-testid="btn-print"]','be.disabled');
      inputChecker.clickOnCheck('[id="#/properties/data/properties/is_confirmed"]','not.be.disabled')
    },
     //C21110
    backButton: () => {
      cy.log('Print Apheresis Product Labels')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.checkState("[data-testid='approver-sign-button']",'not.be.disabled');
      // inputChecker.nextButtonCheck('be.disabled'); Bug
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      inputChecker.nextButtonCheck('not.be.disabled');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.explicitWait('[data-test-id="collection_idm_sample_collection"]')
      inputChecker.checkDataSavingWithBackButton('not.be.disabled','[data-test-id="collection_print_apheresis_product_labels"]')
    }
  },

  idmSampleCollection: {
    previousHappyPathSteps: () => {
      collectionStepsHappyPath.printApheresisProductLabels();
    },
    //C21149
    noValueSelected:()=>{
      cy.log('Idm Sample Collection')
      inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled')
      inputChecker.nextButtonCheck('be.disabled');
    },
     //C21147
    negativeToggle: ()=>{
      cy.log('Idm Sample Collection')
      inputChecker.clickOnCheck('[data-testid="fail-button-idm_test_sample_toggle"]','be.disabled')
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/idm_test_sample_toggle_reason-input"]',regressionInput.collection.idmSampleCollection.positivePleaseProvideRationaleForResponse,'not.be.disabled')
      inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled')
    },
    //C21151
    saveAndClose: (subjectId) => {
      cy.log('Idm Sample Collection')
      inputChecker.clickOnCheck('[data-testid="pass-button-idm_test_sample_toggle"]','not.be.disabled')
      inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled')
      inputChecker.checkDataSavingWithSaveAndClose(subjectId,'not.be.disabled','');
      inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled')
    },
    //C21150
    nextButtonPositive: () => {
      cy.log('Idm Sample Collection')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.explicitWait('[data-test-id="collection_subject_verification"]')
      inputChecker.checkDataSavingWithBackButton('be.enabled','[data-test-id="collection_idm_sample_collection"]')
      inputHelpers.inputSingleField('[data-testid="pass-button-idm_test_sample_toggle"]','true');
    }
  },

  subjectVerification: {
    previousHappyPathSteps: () => {
      collectionStepsHappyPath.printApheresisProductLabels();
      collectionStepsHappyPath.idmSampleCollection();
    },
    //C21068
    checkbox: ()=>{
      cy.log('Subject Verification')
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.clickOnCheck('[id="#/properties/data/properties/checkbox_key"]','be.enabled')
      inputChecker.nextButtonCheck('be.enabled');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    },
    //C21130
    signatureBlock:()=>{
      cy.log('Subject Verification')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignatures'],'arlene3@vineti.com',);
      inputChecker.nextButtonCheck('be.enabled');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    },
    //C21161
    checkboxValueIsRetained: () =>{
      cy.log('Subject Verification')
      inputChecker.checkDataSavingWithBackButton('be.enabled','[data-test-id="collection_subject_verification"]');
    }
  },

  collectionBagIdentification: {
    previousHappyPathSteps: (scope) => {
      collectionStepsHappyPath.printApheresisProductLabels();
      collectionStepsHappyPath.idmSampleCollection();
      collectionStepsHappyPath.subjectVerification();
    },

    //C21233, C33079, C33088
    scanCoiPositive: (scope) => {
      cy.log('Collection Bag Identification');
      inputHelpers.clicker('label[id="#/properties/data/properties/pre_collection_label_applied"]');
      inputChecker.clickOnCheck('label[id="#/properties/data/properties/sponsor_provided_key_label_applied"]','be.disabled');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C33065, C33080, C33089
    scanCoiNegative: (scope) => {
      cy.log('Collection Bag Identification');
      cy.get(`@coi`).then(coi => {
        inputHelpers.inputSingleField('[data-testid="coi-input-field"]',
        coi+'-PRC-01');
      });
      inputHelpers.clicker('[data-testid="coi-action-trigger-button"]')
      inputChecker.checkState('[data-testid="coi-action-trigger-button"]','be.disabled');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C21072, C33081, C33090
    enterAndConfirmPositive: () => {
      cy.log('Collection Bag Identification');
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck(`coi`, coi,'be.visible','be.disabled');
      });
      inputHelpers.clicker('label[id="#/properties/data/properties/pre_collection_label_applied"]');
      inputChecker.clickOnCheck('label[id="#/properties/data/properties/sponsor_provided_key_label_applied"]','not.be.disabled');
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },

    //C21073, C33082, C33091
    preCollectionLabelCheckboxPositive: () => {
      cy.log('Collection Bag Identification');
      inputChecker.clickOnCheck('label[id="#/properties/data/properties/pre_collection_label_applied"]','be.disabled');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C21074, C33083, C33092
    sponsorProvidedLabelCheckboxPositive: () => {
      cy.log('Collection Bag Identification');
      inputHelpers.clicker('label[id="#/properties/data/properties/pre_collection_label_applied"]');
      inputChecker.clickOnCheck('label[id="#/properties/data/properties/sponsor_provided_key_label_applied"]','be.disabled');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
      inputHelpers.clicker('label[id="#/properties/data/properties/pre_collection_label_applied"]');
    },

    //C25337, C33084, C33093
    saveAndCloseButtonPositive: (patientInformation) => {
      cy.log('Collection Bag Identification');
      inputHelpers.clicker('label[id="#/properties/data/properties/pre_collection_label_applied"]');
      inputHelpers.clicker('label[id="#/properties/data/properties/sponsor_provided_key_label_applied"]');
      inputChecker.checkDataSavingWithSaveAndClose(patientInformation.subjectId,'not.be.disabled','');
      inputChecker.checkState('.big-green-check-mark','be.visible');
    },

    //C25338, C33085, C33094
    backButtonPositive: () => {
      cy.log('Collection Bag Identification');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.explicitWait('[data-test-id="collection_capture_collection_information"]');
      inputChecker.checkDataSavingWithBackButton('not.be.disabled','[data-test-id="collection_collection_bag_identification"]');
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
      inputChecker.enterAndConfirmCheck('day_1_bag_1_udn',inputs.collection.global.uniqueDonationNumber,'be.visible','not.be.disabled');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.explicitWait('[data-test-id="collection_capture_collection_information"]');
      inputChecker.checkDataSavingWithBackButton('not.be.disabled','[data-test-id="collection_collection_bag_identification"]');
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
      inputChecker.checkState('[data-testid="green-checkmark-day_1_bag_1_udn"]','be.visible');
      inputChecker.checkState('.big-green-check-mark','be.visible');
    }
  },

  captureCollectionInformation:{
    previousHappyPathSteps: (scope) => {
      collectionStepsHappyPath.printApheresisProductLabels();
      collectionStepsHappyPath.idmSampleCollection();
      collectionStepsHappyPath.subjectVerification();
      collectionStepsHappyPath.collectionBagIdentification(scope.treatment.coi);
    },
    //C21206
    nextButtonDisabled: () => {
      cy.log('Capture Collection Information')
      translationHelpers.assertSingleField('[data-testid="#/properties/custom_fields/properties/patient_height-input"]','');
      translationHelpers.assertSingleField('[data-testid="#/properties/patient_weight-input"]','');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },
    //C21204
    subjectHeightFeildNegative: () =>{
      cy.log('Capture Collection Information')
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/patient_height-input"]','abcdef');
      translationHelpers.assertSingleField('[data-testid="#/properties/custom_fields/properties/patient_height-input"]','');
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/patient_height-input"]','!@#$');
      translationHelpers.assertSingleField('[data-testid="#/properties/custom_fields/properties/patient_height-input"]','');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },
    //C21204
    subjectWeightFeildNegative: () =>{
      cy.log('Capture Collection Information')
      inputHelpers.inputSingleField('[data-testid="#/properties/patient_weight-input"]','abcdef');
      translationHelpers.assertSingleField('[data-testid="#/properties/patient_weight-input"]','');
      inputHelpers.inputSingleField('[data-testid="#/properties/patient_weight-input"]','!@#$');
      translationHelpers.assertSingleField('[data-testid="#/properties/patient_weight-input"]','');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },
    //C21205
    bothfieldsPositive: () =>{
      cy.log('Capture Collection Information')
      inputHelpers.inputSingleField('[data-testid="#/properties/patient_weight-input"]','120.80');
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/patient_height-input"]','154.20');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    }
  },

  mncACollection: {
    previousHappyPathSteps: (scope) => {
      collectionStepsHappyPath.printApheresisProductLabels();
      collectionStepsHappyPath.idmSampleCollection();
      collectionStepsHappyPath.subjectVerification();
      collectionStepsHappyPath.collectionBagIdentification(scope.treatment.coi);
      collectionStepsHappyPath.captureCollectionInformation();
    },

    validData: () => {
      cy.wait(2000);
      cy.get('select[id$="#/properties/custom_fields/properties/collection_instrument"]').select('spectraOptia');
      cy.get('select[id$="#/properties/custom_fields/properties/collection_program"]').select('mnc');
      cy.get('select[id$="#/properties/custom_fields/properties/venous_access"]').select('centralVenousCatheter');
      cy.get('[data-testid$="pass-button-critical_supplies_inspected"]').click();
      cy.get('[id="#/properties/apheresis_date-input"]').type('22-Feb-2021');
      cy.get('[id="collection_start_time"]').type('1111');
      cy.get('[id="collection_end_time"]').type('1212');
      cy.get('[id="#/properties/custom_fields/properties/whole_blood_processed_two-input"]').type('1234');
      cy.get('[id="#/properties/custom_fields/properties/anticoagulant_volume-input"]').type('1234');
      cy.get('[id="#/properties/custom_fields/properties/anticoagulant_type-input"]').type('Test01');
      cy.get('[data-testid="fail-button-is_additional_anticoagulant_added"]').click();
      cy.get('[id="#/properties/custom_fields/properties/product_volume-input"]').type('123');
      cy.get('[id="#/properties/custom_fields/properties/total_mnc_yield-input"]').type('N/a');
      cy.get('[id="#/properties/custom_fields/properties/total_collected_product_volume-input"]').type('N/a');
    },

    //C21189
    verifyEmptyFields: () => {
      cy.log('C21189 [NEG] Verify with all fields as empty.');
      cy.wait(1000);
      cy.get('[data-testid="primary-button-action"]').should('be.disabled');
    },

    //C26411
    dropdown1Empty: () => {
      cy.log("C26411	[NEG] Verify MNC(A) Collection Instrument dropdown with no value selected.")
      inputHelpers.dropDownSelect('select[id$="#/properties/custom_fields/properties/collection_instrument"]', '','');
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C26412
    dropdown2Empty: () => {
      cy.log("C26412	[NEG] Verify Collection Program dropdown with no value selected. ");
      inputHelpers.dropDownSelect('select[id$="#/properties/custom_fields/properties/collection_program"]', '','');
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C26413
    dropdown3Empty: () => {
      cy.log("C26413	[NEG] Verify Access Type dropdown with no value selected.")
      inputHelpers.dropDownSelect('select[id$="#/properties/custom_fields/properties/venous_access"]', '','');
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C21173
    verifyOtherOptionDropDown: () => {
      cy.log('C21173 [POS] Verify that all drop-downs with "Other" option show a required response rationale.');
      inputHelpers.dropDownSelect('select[id$="#/properties/custom_fields/properties/collection_instrument"]', '','other');
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/other_collection_instrument-input"]', 'Other instrument');
      inputChecker.nextButtonCheck('be.disabled');

      inputHelpers.dropDownSelect('select[id$="#/properties/custom_fields/properties/collection_program"]', '', 'other');
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/other_collection_program-input"]', 'Other program');
      inputChecker.nextButtonCheck('be.disabled');

      inputHelpers.dropDownSelect('select[id$="#/properties/custom_fields/properties/venous_access"]', '', 'other');
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/other_venous_access-input"]', 'Other access');
      inputChecker.nextButtonCheck('be.enabled');
    },

    //C26414
    criticalSuppliesToggleUnselected: () => {
      cy.log('C26414	[NEG] Verify with nothing selected on Critical supplies toggle.');
      inputHelpers.clicker('[data-testid$="pass-button-critical_supplies_inspected"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C21174
    criticalSuppliesToggle: () => {
      cy.log('C21174	[NEG] Verify by selecting "No" on "Critical supplies inspected toggle".');
      inputHelpers.clicker('[data-testid$="fail-button-critical_supplies_inspected"]');
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.clicker('[data-testid$="pass-button-critical_supplies_inspected"]');
      inputChecker.nextButtonCheck('be.enabled');
    },

    //C21175
    futureCollectionDate: (futureDate) => {
      cy.log('C21175	[NEG] Verify Next is disabled when collection date is a future date.');
      cy.wait(1000);
      inputHelpers.inputDateField('[id="#/properties/apheresis_date-input"]', futureDate);
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C26415
    collectionDateEmpty: () => {
      cy.log("C26415	[NEG] Verify with Collection date as empty.")
      inputChecker.clearField('[id="#/properties/apheresis_date-input"]');
      inputHelpers.clicker('[id="#/properties/custom_fields/properties/product_volume-input"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C26409
    collectionDateValid: (pastDate, currentDate) => {
      cy.log('C26409	[POS] Verify "Collection date" accepts past and current date.');
      inputHelpers.inputDateField('[id="#/properties/apheresis_date-input"]', pastDate);
      inputChecker.nextButtonCheck('be.enabled');
      inputHelpers.inputDateField('[id="#/properties/apheresis_date-input"]', currentDate);
      inputChecker.nextButtonCheck('be.enabled');
    },

    //C26416
    collectionStartTimeEmpty: () => {
      cy.log('C26416	[NEG] Verify with Collection start time as empty ');
      inputChecker.clearField('[id="collection_start_time"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C21176
    collectionStartTimeFormat: () => {
      cy.log('C21176	[NEG] Verify "Collection start time" format.');
      cy.wait(1000);
      inputHelpers.inputSingleField('[id="collection_start_time"]', '111');
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.inputSingleField('[id="collection_start_time"]', '1111');
      inputChecker.nextButtonCheck('be.enabled');
    },

    //C26417
    collectionEndTimeEmpty: () => {
      cy.log('C26417	[NEG] Verify with Collection end time as empty');
      inputChecker.clearField('[id="collection_end_time"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C21177
    collectionEndTimeFormat: () => {
      cy.log('C21177	[NEG] Verify with "Collection end time" having value less than "Collection start time".');
      cy.wait(1000);
      inputHelpers.inputSingleField('[id="collection_end_time"]', '1059');
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.inputSingleField('[id="collection_end_time"]', '1212');
      inputChecker.nextButtonCheck('be.enabled');
    },

    //C26418
    bloodVolumeEmpty: () => {
      cy.log("C26418	[NEG] Verify with Whole Blood Volume Processed as empty.");
      inputChecker.clearField('[id="#/properties/custom_fields/properties/whole_blood_processed_two-input"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C24681
    bloodVolumeNegative: () => {
      cy.log("C24681	[NEG] Verify 'Whole Blood Volume Processed' to not accept symbols and alphabets.");
      cy.wait(1000);
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/whole_blood_processed_two-input"]', '-!@');
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/whole_blood_processed_two-input"]', 'abc');
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C21178
    bloodVolumeValid: () => {
      cy.log("C21178	[POS] Verify 'Whole Blood Volume Processed' to accept only positive decimal values.");
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/whole_blood_processed_two-input"]', '1234');
      inputChecker.nextButtonCheck('be.enabled');
    },

    //C26419
    totalAnticoagulantVolumeEmpty: () => {
      cy.log("C26419	[NEG] Verify with Total Anticoagulant in Product as empty. ");
      inputChecker.clearField('[id="#/properties/custom_fields/properties/anticoagulant_volume-input"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C24686
    totalAnticoagulantVolumeNegative: () => {
      cy.log("C24686	[NEG] Verify 'Total Anticoagulant in Product' to not accept symbol and alphabet values.");
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/anticoagulant_volume-input"]', '-!@');
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/anticoagulant_volume-input"]', 'abc');
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C21179
    totalAnticoagulantVolumeValid: () => {
      cy.log("C21179	[POS] Verify 'Total Anticoagulant in Product' accepts positive decimal values.");
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/anticoagulant_volume-input"]', '1234');
      inputChecker.nextButtonCheck('be.enabled');
    },

    //C26420
    anticoagulantTypeEmpty: () => {
      cy.log("C26420	[NEG] Verify with Enter Anticoagulant Type as empty.");
      inputChecker.clearField('[data-testid="#/properties/custom_fields/properties/anticoagulant_type-input"]');
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/anticoagulant_type-input"]', 'A234');
      inputChecker.nextButtonCheck('be.enabled');
    },

    //C21180
    additionalAnticoagulantToggle: () => {
      cy.log("C21180	[POS] Verify 'Additional anticoagulant(s) Added' toggle shows additional fields.");
      cy.wait(1000);
      inputHelpers.clicker('[data-testid="pass-button-is_additional_anticoagulant_added"]');
      inputChecker.checkState('[data-testid="#/properties/custom_fields/properties/additional_anticoagulant_type-input"]', 'be.visible');
      inputChecker.checkState('[data-testid="#/properties/custom_fields/properties/additional_anticoagulant_volume-input"]', 'be.visible');
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C26421
    additionalAnticoagulantTypeEmpty: () => {
      cy.log("C26421	[NEG] Verify with Enter Additional Anticoagulant Type as empty.");
      inputChecker.clearField('[data-testid="#/properties/custom_fields/properties/additional_anticoagulant_type-input"]');
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/additional_anticoagulant_type-input"]', 'A234');
    },

    //C26422
    additionalAnticoagulantVolumeEmpty: () => {
      cy.log("C26422	[NEG] Verify with Additional anticoagulant Volume as empty.")
      inputChecker.clearField('[data-testid="#/properties/custom_fields/properties/additional_anticoagulant_volume-input"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    //To Do
    additionalAnticoagulantVolumeNegative: () => {
      cy.log("[NEG] Verify 'Additional anticoagulant Volume' to not accept symbol and alphabet values.");
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/additional_anticoagulant_volume-input"]', '-!@');
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/additional_anticoagulant_volume-input"]', 'abc');
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C21182
    additionalAnticoagulantVolumeValid: () => {
      cy.log("C21182	[POS] Verify 'Additional anticoagulant Volume' accepts only positive decimal values.");
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/additional_anticoagulant_volume-input"]', '123');
      inputChecker.nextButtonCheck('be.enabled');
    },

    //C21183
    autologousPlasmaVolumeOptional: () => {
      cy.log("C21183	[POS] Verify 'Autologous Plasma Volume' is optional.");
      inputChecker.clearField('[data-testid="#/properties/custom_fields/properties/autologous_plasma_volume-input"]');
      inputChecker.nextButtonCheck('be.enabled');
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/autologous_plasma_volume-input"]', '123');
      inputChecker.nextButtonCheck('be.enabled');
    },

    //C26423
    totalProductVolumePlasmaEmpty: () => {
      cy.log("C26423	[NEG] Verify with Total Product Volume (including anticoagulant(s) and plasma) as empty.");
      inputChecker.clearField('[id="#/properties/custom_fields/properties/product_volume-input"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C26410
    totalProductVolumePlasmaNegative: () => {
      cy.log("C26410 [NEG] Verify 'Total Product Volume (including anticoagulant(s) and plasma)' to not accept symbols and alphabets.");
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/product_volume-input"]', '-!@');
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/product_volume-input"]', 'abc');
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C21198
    totalProductVolumePlasmaValid: () => {
      cy.log("C21198 [POS] Verify 'Total Product Volume (including anticoagulant(s) and plasma)' only accepts positive numbers.");
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/product_volume-input"]', '123');
      inputChecker.nextButtonCheck('be.enabled');

    },

    //C26424
    totalMncYieldEmpty: () => {
      cy.log("C26424 [NEG] Verify with Total MNC yield as empty.");
      inputChecker.clearField('[data-testid="#/properties/custom_fields/properties/total_mnc_yield-input"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C24688
    totalMncYieldNegative: () => {
      cy.log("C24688	[NEG] Verify 'Total MNC yield' to not accept symbol and alphabet values. ");
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/total_mnc_yield-input"]', '-!@');
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/total_mnc_yield-input"]', 'abc');
      inputChecker.nextButtonCheck('be.disabled');
    },


    //C21186
    totalMncYieldValid: ()=> {
      cy.log("C21186	[POS] Verify 'Total MNC yield' accepts only positive numbers.");
      cy.wait(1000);
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/total_mnc_yield-input"]', 'N/a');
      inputChecker.nextButtonCheck('be.enabled');
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/total_mnc_yield-input"]', '1234');
      inputChecker.nextButtonCheck('be.enabled');

    },

    //C26425
    totalProductVolumeEmpty: () => {
      cy.log("C26425	[NEG] Verify with Total Product Volume (after CBC sampling) as empty. ");
      inputChecker.clearField('[id="#/properties/custom_fields/properties/total_collected_product_volume-input"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C24692
    totalProductVolumeNegative: () => {
      cy.log("C24692	[NEG] Verify 'Total Product Volume (after CBC sampling)' to not accept symbol and alphabet values.");
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/total_collected_product_volume-input"]', '-!@');
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/total_collected_product_volume-input"]', 'abc');
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C21187
    totalProductVolumeValid: () => {
      cy.log("C21187 [POS] Verify 'Total Product Volume (after CBC sampling)'  accepts only positive numbers.");
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/total_collected_product_volume-input"]', 'N/a');
      inputChecker.nextButtonCheck('be.enabled');
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/total_collected_product_volume-input"]', '1234');
      inputChecker.nextButtonCheck('be.enabled');
    },

    //C21191
    verifyNext: (currentDate) => {
      cy.log("C21191	[POS] Verify data retains upon clicking 'Next'.");
      cy.wait(1000);
      cy.get('[data-testid="primary-button-action"]')
        .click();
      inputChecker.explicitWait('[data-test-id="collection_collection_summary"]');
      cy.get('[data-testid="back-nav-link"]')
        .click();
      cy.wait(1000);
      inputChecker.checkValue('select[id$="#/properties/custom_fields/properties/collection_instrument"]', 'other');
      inputChecker.checkValue('select[id$="#/properties/custom_fields/properties/collection_program"]', 'other');
      inputChecker.checkValue('select[id$="#/properties/custom_fields/properties/venous_access"]', 'other');
      inputChecker.checkValue('[id="#/properties/apheresis_date-input"]', currentDate);
      inputChecker.checkValue('[id="collection_start_time"]', '11:11');
      inputChecker.checkValue('[id="collection_end_time"]', '12:12');
      inputChecker.checkValue('[id="#/properties/custom_fields/properties/whole_blood_processed_two-input"]', '1234');
      inputChecker.checkValue('[id="#/properties/custom_fields/properties/anticoagulant_volume-input"]', '1234');
      inputChecker.checkValue('[id="#/properties/custom_fields/properties/anticoagulant_type-input"]', 'A234');
      inputChecker.checkValue('[id="#/properties/custom_fields/properties/product_volume-input"]', '123');
      inputChecker.checkValue('[id="#/properties/custom_fields/properties/total_mnc_yield-input"]', '1234');
      inputChecker.checkValue('[id="#/properties/custom_fields/properties/total_collected_product_volume-input"]', '1234');
      inputChecker.nextButtonCheck('be.enabled');
    },

    //C21192
    verifySaveAndClose: (patientData, currentDate) => {
      cy.log("C21192	[POS] Verify data retains upon clicking 'Save and Close'.");
      cy.wait(1000);
      inputChecker.checkDataSavingWithSaveAndClose(patientData.subjectId,'not.be.disabled','');
      cy.wait(1000);
      inputChecker.checkValue('select[id$="#/properties/custom_fields/properties/collection_instrument"]', 'other');
      inputChecker.checkValue('select[id$="#/properties/custom_fields/properties/collection_program"]', 'other');
      inputChecker.checkValue('select[id$="#/properties/custom_fields/properties/venous_access"]', 'other');
      inputChecker.checkValue('[id="#/properties/apheresis_date-input"]', currentDate);
      inputChecker.checkValue('[id="collection_start_time"]', '11:11');
      inputChecker.checkValue('[id="collection_end_time"]', '12:12');
      inputChecker.checkValue('[id="#/properties/custom_fields/properties/whole_blood_processed_two-input"]', '1234');
      inputChecker.checkValue('[id="#/properties/custom_fields/properties/anticoagulant_volume-input"]', '1234');
      inputChecker.checkValue('[id="#/properties/custom_fields/properties/anticoagulant_type-input"]', 'A234');
      inputChecker.checkValue('[id="#/properties/custom_fields/properties/product_volume-input"]', '123');
      inputChecker.checkValue('[id="#/properties/custom_fields/properties/total_mnc_yield-input"]', '1234');
      inputChecker.checkValue('[id="#/properties/custom_fields/properties/total_collected_product_volume-input"]', '1234');
      inputChecker.nextButtonCheck('be.enabled');
    }
  },

  collectionSummary:{
    previousHappyPathSteps: (scope) => {
      collectionStepsHappyPath.printApheresisProductLabels();
      collectionStepsHappyPath.idmSampleCollection();
      collectionStepsHappyPath.subjectVerification();
      collectionStepsHappyPath.collectionBagIdentification(scope.treatment.coi);
      collectionStepsHappyPath.captureCollectionInformation();
      collectionStepsHappyPath.mncACollection();
    },
    //C21208
    verifySubmitWithSignature: () => {
      cy.log('Collection Summary')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignatures'],'arlene3@vineti.com',);
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },

    //C21047
    verifyViewSummaryWithSignature: () => {
      cy.log('Collection Summary')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignatures'],'arlene3@vineti.com',);
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      cy.reload();
      inputChecker.checkState('[name="viewDocumentViewSummary"]','be.enabled');
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },

    checkEditFunctionalityCci: () =>{
      cy.log('Collection Summary')
      inputHelpers.clicker('[data-testid="edit-capture_collection_information"]');
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/patient_height-input"]',collectionRegressionInputs.subjectHeight);
      inputHelpers.inputSingleField('[data-testid="#/properties/patient_weight-input"]',collectionRegressionInputs.subjectWeight);
      inputHelpers.clicker('[data-testid="primary-button-action"]');
      inputHelpers.inputSingleField("[data-testid='reason-for-change-textarea']","Testing")
      inputHelpers.clicker('[data-testid="reason-for-change-save"]');
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
           3,'div', collectionAssertions.collectionSummary.subjectHeightLabel,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
           3,'span', '56',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
           4,'div', collectionAssertions.collectionSummary.subjectWeightLabel,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
           4,'div', '58 kg',1);
    },

    checkEditFunctionalityMnc: () => {
      cy.log('Collection Summary')
      inputHelpers.clicker('[data-testid="edit-mnc_a_collection"]');
      inputHelpers.dropDownSelect('select[id$="#/properties/custom_fields/properties/collection_instrument"]', 0,
      inputsRegression.collection.collectionSummary.selFenwalAmicus);
      inputHelpers.clicker('[data-testid="primary-button-action"]');
      inputHelpers.inputSingleField("[data-testid='reason-for-change-textarea']","Testing")
      inputHelpers.clicker('[data-testid="reason-for-change-save"]');
      cy.wait(2000)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
           5,'div', collectionAssertions.collectionSummary.mnAaCollectionInformation,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
           5,'span', 'Fenwal Amicus',0);
    }
  },

  shippingChecklist: {
    previousHappyPathSteps: (scope) => {
      collectionStepsHappyPath.printApheresisProductLabels();
      collectionStepsHappyPath.idmSampleCollection();
      collectionStepsHappyPath.subjectVerification();
      collectionStepsHappyPath.collectionBagIdentification(scope.treatment.coi);
      collectionStepsHappyPath.captureCollectionInformation();
      collectionStepsHappyPath.mncACollection();
      collectionStepsHappyPath.collectionSummary();
    },

    //C21152, C33917, C33934
    enterAndConfirmPositive: () => {
      cy.log('Shipping checklist');
      inputHelpers.clicker('[data-testid="pass-button-attach_shipping"]');
      inputHelpers.clicker('[data-testid="pass-button-place_product_into_shipper"]');
      inputHelpers.clicker('[data-testid="pass-button-place_summary_document"]');
      inputChecker.clickOnCheck('[data-testid="pass-button-shipper_sealed"]','be.disabled');
      inputChecker.enterAndConfirmCheck('air_waybill_number', inputs.collection.global.awb,'be.visible','be.disabled');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C24886, C33918, C33935
    attachShippingWithoutTogglePositive: () => {
      cy.log('Shipping checklist');
      inputHelpers.clicker('[data-testid="pass-button-place_product_into_shipper"]');
      inputHelpers.clicker('[data-testid="pass-button-place_summary_document"]');
      inputChecker.clickOnCheck('[data-testid="pass-button-shipper_sealed"]','be.disabled');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C24887, C33919, C33936
    attachShippingToggleWithoutReasonNegative: () => {
      cy.log('Shipping checklist');
      inputHelpers.clicker('[data-testid="fail-button-attach_shipping"]');
      inputChecker.checkState('[data-testid="#/properties/custom_fields/properties/attach_shipping_reason-input"]','be.visible');
      inputHelpers.clicker('[data-testid="pass-button-shipper_sealed"]');
      inputChecker.clickOnCheck('[data-testid="pass-button-shipper_sealed"]','be.disabled');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C21133, C33920, C33937
    attachShippingTogglePositive: () => {
      cy.log('Shipping checklist');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/attach_shipping_reason-input"]', regressionInput.collection.shippingChecklist.positivePleaseProvideRationaleForResponseOne,'not.be.disabled');
    },

    //C24892, C33921, C33938
    placeProductIntoShipperWithoutTogglePositive: () => {
      cy.log('Shipping checklist');
      inputHelpers.clicker('[data-testid="pass-button-attach_shipping"]');
      inputHelpers.clicker('[data-testid="pass-button-place_product_into_shipper"]');
      inputHelpers.clicker('[data-testid="pass-button-shipper_sealed"]');
      inputChecker.clickOnCheck('[data-testid="pass-button-shipper_sealed"]','be.disabled');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C24893, C33922, C33939
    placeProductIntoShipperToggleWithoutReasonNegative: () => {
      cy.log('Shipping checklist');
      inputHelpers.clicker('[data-testid="fail-button-place_product_into_shipper"]');
      inputChecker.checkState('[data-testid="#/properties/custom_fields/properties/place_product_into_shipper_reason-input"]','be.visible');
      inputHelpers.clicker('[data-testid="pass-button-shipper_sealed"]');
      inputChecker.clickOnCheck('[data-testid="pass-button-shipper_sealed"]','be.disabled');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C21135, C33923,C33940
    placeProductIntoShipperTogglePositive: () => {
      cy.log('Shipping checklist');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/place_product_into_shipper_reason-input"]', regressionInput.collection.shippingChecklist.positivePleaseProvideRationaleForResponseTwo,'not.be.disabled');
    },

    //C21137, C33924, C33941
    checkSummaryDocumentTogglePositive: () => {
      cy.log('Shipping checklist');
      inputChecker.checkState('[name="viewDocumentViewSummary"]','not.be.disabled');
    },

    //C24898, C33925, C33942
    placeSummaryDocumentWithoutTogglePositive: () => {
      cy.log('Shipping checklist');
      inputHelpers.clicker('[data-testid="pass-button-place_product_into_shipper"]');
      inputHelpers.clicker('[data-testid="pass-button-place_summary_document"]');
      inputHelpers.clicker('[data-testid="pass-button-shipper_sealed"]');
      inputChecker.clickOnCheck('[data-testid="pass-button-shipper_sealed"]','be.disabled');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C24899, C33926, C33943
    placeSummaryDocumentToggleWithoutReasonNegative: () => {
      cy.log('Shipping checklist');
      inputHelpers.clicker('[data-testid="fail-button-place_summary_document"]');
      inputChecker.checkState('[data-testid="#/properties/custom_fields/properties/place_summary_document_reason-input"]','be.visible');
      inputHelpers.clicker('[data-testid="pass-button-shipper_sealed"]');
      inputChecker.clickOnCheck('[data-testid="pass-button-shipper_sealed"]','be.disabled');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C21139, C33927, C33944
    placeSummaryDocumentTogglePositive: () => {
      cy.log('Shipping checklist');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/place_summary_document_reason-input"]', regressionInput.collection.shippingChecklist.positivePleaseProvideRationaleForResponseThree,'not.be.disabled');
    },

    //C24908, C33928, C33945
    shipperSealedWithoutTogglePositive: () => {
      cy.log('Shipping checklist');
      inputHelpers.clicker('[data-testid="pass-button-place_summary_document"]');
      inputChecker.clickOnCheck('[data-testid="pass-button-shipper_sealed"]','be.disabled');
    },
    //C24904, C33929, C33946
    shipperSealedToggleWithoutReasonNegative: () => {
      cy.log('Shipping checklist');
      inputHelpers.clicker('[data-testid="fail-button-shipper_sealed"]');
      inputChecker.checkState('[data-testid="#/properties/custom_fields/properties/shipper_sealed_reason-input"]','be.visible');
      inputHelpers.clicker('[data-testid="pass-button-place_summary_document"]');
      inputChecker.clickOnCheck('[data-testid="pass-button-place_summary_document"]','be.disabled');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },
    //C21143, C33930, C33947
    shipperSealedTogglePositive: () => {
      cy.log('Shipping checklist');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/shipper_sealed_reason-input"]', regressionInput.collection.shippingChecklist.positivePleaseProvideRationaleForResponseFour,'not.be.disabled');
    },
    //C21146, C33931, C33948
    additionalCommentBoxPositive: () => {
      cy.log('Shipping checklist');
      inputChecker.nextButtonCheck('not.be.disabled');
    },
    //C26457, C33932, C33949
    saveAndCloseButtonPositive: (patientInformation) => {
      cy.log('Shipping checklist');
      cy.reload();
      inputHelpers.clicker('[data-testid="fail-button-attach_shipping"]');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/attach_shipping_reason-input"]', regressionInput.collection.shippingChecklist.positivePleaseProvideRationaleForResponseOne,'be.disabled');
      inputHelpers.clicker('[data-testid="fail-button-place_product_into_shipper"]');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/place_product_into_shipper_reason-input"]', regressionInput.collection.shippingChecklist.positivePleaseProvideRationaleForResponseTwo,'be.disabled');
      inputHelpers.clicker('[data-testid="fail-button-place_summary_document"]');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/place_summary_document_reason-input"]', regressionInput.collection.shippingChecklist.positivePleaseProvideRationaleForResponseThree,'be.disabled');
      inputHelpers.clicker('[data-testid="fail-button-shipper_sealed"]');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/shipper_sealed_reason-input"]', regressionInput.collection.shippingChecklist.positivePleaseProvideRationaleForResponseFour,'not.be.disabled');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/shipper_sealed_comment-input"]', regressionInput.collection.shippingChecklist.positiveAdditionalComments,'not.be.disabled');
      inputChecker.checkDataSavingWithSaveAndClose(patientInformation.subjectId,'not.be.disabled','');
      inputChecker.checkToggle('[data-testid="fail-button-attach_shipping"]');
      inputChecker.checkToggle('[data-testid="fail-button-place_product_into_shipper"]');
      inputChecker.checkToggle('[data-testid="fail-button-place_summary_document"]');
      inputChecker.checkToggle('[data-testid="fail-button-shipper_sealed"]');
      inputChecker.checkValue('[data-testid="#/properties/custom_fields/properties/attach_shipping_reason-input"]', regressionInput.collection.shippingChecklist.positivePleaseProvideRationaleForResponseOne);
      inputChecker.checkValue('[data-testid="#/properties/custom_fields/properties/place_product_into_shipper_reason-input"]', regressionInput.collection.shippingChecklist.positivePleaseProvideRationaleForResponseTwo);
      inputChecker.checkValue('[data-testid="#/properties/custom_fields/properties/place_summary_document_reason-input"]', regressionInput.collection.shippingChecklist.positivePleaseProvideRationaleForResponseThree);
      inputChecker.checkValue('[data-testid="#/properties/custom_fields/properties/shipper_sealed_reason-input"]', regressionInput.collection.shippingChecklist.positivePleaseProvideRationaleForResponseFour);
      inputChecker.checkState('[data-testid="green-checkmark-air_waybill_number"]','be.visible');

    },
    //C26458, C33933, C33950
    backButtonPositive: () => {
      cy.log('Shipping checklist');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.explicitWait('[data-test-id="collection_shipping_summary"]');
      inputChecker.checkDataSavingWithBackButton('not.be.disabled','[data-test-id="collection_shipping_checklist"]');
      inputChecker.checkToggle('[data-testid="fail-button-attach_shipping"]');
      inputChecker.checkToggle('[data-testid="fail-button-place_product_into_shipper"]');
      inputChecker.checkToggle('[data-testid="fail-button-place_summary_document"]');
      inputChecker.checkToggle('[data-testid="fail-button-shipper_sealed"]');
      inputChecker.checkValue('[data-testid="#/properties/custom_fields/properties/attach_shipping_reason-input"]', regressionInput.collection.shippingChecklist.positivePleaseProvideRationaleForResponseOne);
      inputChecker.checkValue('[data-testid="#/properties/custom_fields/properties/place_product_into_shipper_reason-input"]', regressionInput.collection.shippingChecklist.positivePleaseProvideRationaleForResponseTwo);
      inputChecker.checkValue('[data-testid="#/properties/custom_fields/properties/place_summary_document_reason-input"]', regressionInput.collection.shippingChecklist.positivePleaseProvideRationaleForResponseThree);
      inputChecker.checkValue('[data-testid="#/properties/custom_fields/properties/shipper_sealed_reason-input"]', regressionInput.collection.shippingChecklist.positivePleaseProvideRationaleForResponseFour);
      inputChecker.checkState('[data-testid="green-checkmark-air_waybill_number"]','be.visible');
      inputHelpers.clicker('[data-testid="pass-button-attach_shipping"]')
      inputHelpers.clicker('[data-testid="pass-button-place_product_into_shipper"]')
      inputHelpers.clicker('[data-testid="pass-button-place_summary_document"]')
      inputHelpers.clicker('[data-testid="pass-button-shipper_sealed"]')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      });
      inputChecker.checkState('[data-testid="reason-for-change-textarea"]','be.visible');
    }
  },

  shippingSummary: {
    previousHappyPathSteps: (scope) => {
      collectionStepsHappyPath.printApheresisProductLabels();
      collectionStepsHappyPath.idmSampleCollection();
      collectionStepsHappyPath.subjectVerification();
      collectionStepsHappyPath.collectionBagIdentification(scope.treatment.coi);
      collectionStepsHappyPath.captureCollectionInformation();
      collectionStepsHappyPath.mncACollection();
      collectionStepsHappyPath.collectionSummary();
      collectionStepsHappyPath.shippingChecklist();
    },
    //C21299
    verifySubmitWithSignature: () => {
      cy.log('Shipping Summary')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      inputChecker.checkState('[data-testid="primary-button-action"]', 'be.enabled');
    },
    //C21301
    verifyViewSummaryWithSignature: () => {
      cy.log('Shipping Summary')
      cy.reload();
      inputChecker.checkState('[name="viewDocumentViewSummary"]', 'be.enabled')
      inputChecker.checkState('[data-testid="primary-button-action"]', 'be.enabled')
    },
    //C21914
    reSignatureAfterEdit: () => {
      cy.log('Shipping Summary')
      inputChecker.selectFirstOption('[data-testid="edit-shipping_checklist"]');
      inputHelpers.clicker('[data-testid="fail-button-attach_shipping"]')
      inputChecker.inputStringValue('[data-testid="#/properties/custom_fields/properties/attach_shipping_reason-input"]', "Test Reason");
      inputHelpers.clicker('[data-testid="fail-button-place_product_into_shipper"]');
      inputChecker.inputStringValue('[data-testid="#/properties/custom_fields/properties/place_product_into_shipper_reason-input"]', "Test Reason");
      inputHelpers.clicker('[data-testid="fail-button-place_summary_document"]')
      inputChecker.inputStringValue('[data-testid="#/properties/custom_fields/properties/place_summary_document_reason-input"]', "Test Reason");
      inputHelpers.clicker('[data-testid="fail-button-shipper_sealed"]')
      inputChecker.inputStringValue('[data-testid="#/properties/custom_fields/properties/shipper_sealed_reason-input"]', "Test Reason");
      inputChecker.checkState("[data-testid='primary-button-action']", 'be.visible')
      inputHelpers.clicker("[data-testid='primary-button-action']")
      inputChecker.inputStringValue('[data-testid="reason-for-change-textarea"]','Test789')
      inputHelpers.clicker('[data-testid="reason-for-change-save"]')

      translationHelpers.assertBlockData('[data-test-id="collection-summary-block"]>>>>>div',
        {index:0,label:collectionAssertions.shippingSummary.attachShipperLabel,value:'No '})

      translationHelpers.assertBlockData('[data-test-id="collection-summary-block"]>>>>>div',
           {index:1,label:collectionAssertions.shippingSummary.toggleReason,value:'Test Reason '})

      translationHelpers.assertBlockData('[data-test-id="collection-summary-block"]>>>>>div',
           {index:2,label:collectionAssertions.shippingSummary.placeProductIntoShipper,value:'No '})

      translationHelpers.assertBlockData('[data-test-id="collection-summary-block"]>>>>>div',
          {index:3,label:collectionAssertions.shippingSummary.toggleReason,value:'Test Reason '})

      translationHelpers.assertBlockData('[data-test-id="collection-summary-block"]>>>>>div',
          {index:4,label:collectionAssertions.shippingSummary.placeSummaryDoc,value:'No '})

      translationHelpers.assertBlockData('[data-test-id="collection-summary-block"]>>>>>div',
          {index:5,label:collectionAssertions.shippingSummary.toggleReason,value:'Test Reason '})

      translationHelpers.assertBlockData('[data-test-id="collection-summary-block"]>>>>>div',
          {index:6,label:collectionAssertions.shippingSummary.shipperSealed,value:'No '})

      translationHelpers.assertBlockData('[data-test-id="collection-summary-block"]>>>>>div',
          {index:7,label:collectionAssertions.shippingSummary.toggleReason,value:'Test Reason '})

      inputChecker.checkState("[data-testid='approver-sign-button']", 'be.enabled')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    }
  },

  collectionIdmTestResults :{
    previousHappyPathSteps: (scope) => {
      collectionStepsHappyPath.printApheresisProductLabels();
      collectionStepsHappyPath.idmSampleCollection();
      collectionStepsHappyPath.subjectVerification();
      collectionStepsHappyPath.collectionBagIdentification(scope.treatment.coi);
      collectionStepsHappyPath.captureCollectionInformation();
      collectionStepsHappyPath.mncACollection();
      collectionStepsHappyPath.collectionSummary();
      collectionStepsHappyPath.shippingChecklist();
      collectionStepsHappyPath.shippingSummary();
    },
     //C21155
    noValueSelectedInToggle: ()=>{
      cy.log('Collection Idm Test Results')
      inputChecker.nextButtonCheck('be.disabled')
    },
    //C21153
    negativeIdmSampleCollectionInToggle :()=> {
      cy.log('Collection Idm Test Results')
      inputHelpers.clicker("[data-testid='fail-button-update_idm_test_results']");
      inputChecker.checkState("[id='#/properties/custom_fields/properties/update_idm_test_results_reason']",'be.visible');
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C21225
    inputFieldVisible: ()=>{
      cy.log('Collection Idm Test Results')
      inputChecker.inputStringValue("[id='#/properties/custom_fields/properties/update_idm_test_results_reason']",'Test')
      inputChecker.nextButtonCheck('be.enabled')
    },
    //C21154
    positiveIdmSampleCollectionInToggle: ()=>{
      cy.log('Collection Idm Test Results')
      inputChecker.clickOnCheck("[data-testid='pass-button-update_idm_test_results']",'be.visible')

    },
    //C21226
    signatureBlock: ()=>{
      cy.log('Collection Idm Test Results')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.checkState("[data-testid='collection_idm_test_results-collection_idm_test_results_cd_30_us_eu-signature-block']", 'be.visible')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    }
  },

  collectionIdmTestResultsEu :{
    previousHappyPathSteps: (scope) => {
      collectionStepsHappyPath.printApheresisProductLabels();
      collectionStepsHappyPath.idmSampleCollection();
      collectionStepsHappyPath.subjectVerification();
      collectionStepsHappyPath.collectionBagIdentification(scope.treatment.coi);
      collectionStepsHappyPath.captureCollectionInformation();
      collectionStepsHappyPath.mncACollection();
      collectionStepsHappyPath.collectionSummary();
      collectionStepsHappyPath.shippingChecklist();
      collectionStepsHappyPath.shippingSummary();
    },
     //C28431
    noValueSelectedInToggle: ()=>{
      cy.log('Collection Idm Test Results')
      inputChecker.nextButtonCheck('be.disabled')
    },
    //C28432
    negativeIdmSampleCollectionInToggle :()=> {
      cy.log('Collection Idm Test Results')
      inputHelpers.clicker("[data-testid='fail-button-update_idm_test_results']");
      inputChecker.checkState("[id='#/properties/custom_fields/properties/update_idm_test_results_reason']",'be.visible');
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C28433
    inputFieldVisible: ()=>{
      cy.log('Collection Idm Test Results')
      inputChecker.inputStringValue("[id='#/properties/custom_fields/properties/update_idm_test_results_reason']",'Test')
      inputChecker.nextButtonCheck('be.enabled')
    },
    //C28434
    positiveIdmSampleCollectionInToggle: ()=>{
      cy.log('Collection Idm Test Results')
      inputChecker.clickOnCheck("[data-testid='pass-button-update_idm_test_results']",'be.visible')

    },
    //C28435
    signatureBlock: ()=>{
      cy.log('Collection Idm Test Results')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.checkState("[data-testid='collection_idm_test_results-collection_idm_test_results_cd_30_eu-signature-block']", 'be.visible')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    }
  },

  collectionIdmTestResultsUs :{
    previousHappyPathSteps: (scope) => {
      collectionStepsHappyPath.printApheresisProductLabels();
      collectionStepsHappyPath.idmSampleCollection();
      collectionStepsHappyPath.subjectVerification();
      collectionStepsHappyPath.collectionBagIdentification(scope.treatment.coi);
      collectionStepsHappyPath.captureCollectionInformation();
      collectionStepsHappyPath.mncACollection();
      collectionStepsHappyPath.collectionSummary();
      collectionStepsHappyPath.shippingChecklist();
      collectionStepsHappyPath.shippingSummary();
    },
     //C28018
    noValueSelectedInToggle: ()=>{
      cy.log('Collection Idm Test Results')
      inputChecker.nextButtonCheck('be.disabled')
    },
    //C28019
    negativeIdmSampleCollectionInToggle: ()=> {
      cy.log('Collection Idm Test Results')
      inputHelpers.clicker("[data-testid='fail-button-update_idm_test_results']");
      inputChecker.checkState("[id='#/properties/custom_fields/properties/update_idm_test_results_reason']",'be.visible');
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C28020
    inputFieldVisible: ()=>{
      cy.log('Collection Idm Test Results')
      inputChecker.inputStringValue("[id='#/properties/custom_fields/properties/update_idm_test_results_reason']",'Test')
      inputChecker.nextButtonCheck('be.enabled')
    },
    //C28021
    positiveIdmSampleCollectionInToggle: ()=>{
      cy.log('Collection Idm Test Results')
      inputChecker.clickOnCheck("[data-testid='pass-button-update_idm_test_results']",'be.visible')

    },
    //C28022
    signatureBlock: ()=>{
      cy.log('Collection Idm Test Results')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.checkState("[data-testid=approver-sign-button]", 'be.visible')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    }
  },

  checkStatusesOfCollectionModule: (scope) => {
    cy.get(`@coi`).then((coi) => {
      inputChecker.explicitWait('[data-test-id="collection_print_apheresis_product_labels"]');
      inputChecker.clickOnHeader('collection')
      inputChecker.clickOnFilter('appointment', 'All');
      cy.checkStatus(scope.patientInformation.subjectId,regressionInput.collection.statuses.printApheresisProductLabels,'Subjects',4)
      collectionStepsHappyPath.printApheresisProductLabels();
      inputChecker.explicitWait('[data-test-id="collection_idm_sample_collection"]');

      inputChecker.clickOnHeader('collection')
      inputChecker.clickOnFilter('appointment', 'All');
      cy.checkStatus(scope.patientInformation.subjectId,regressionInput.collection.statuses.idmSampleCollection,'Subjects',4)
      collectionStepsHappyPath.idmSampleCollection();
      inputChecker.explicitWait('[data-test-id="collection_subject_verification"]');

      inputChecker.clickOnHeader('collection')
      inputChecker.clickOnFilter('appointment', 'All');
      cy.checkStatus(scope.patientInformation.subjectId,regressionInput.collection.statuses.subjectVerification,'Subjects',4)
      collectionStepsHappyPath.subjectVerification();
      inputChecker.explicitWait('[data-test-id="collection_collection_bag_identification"]');

      inputChecker.clickOnHeader('collection')
      inputChecker.clickOnFilter('appointment', 'All');
      cy.checkStatus(scope.patientInformation.subjectId,regressionInput.collection.statuses.collectionBagIdentification,'Subjects',4)
      collectionStepsHappyPath.collectionBagIdentification();
      inputChecker.explicitWait('[data-test-id="collection_capture_collection_information"]');

      inputChecker.clickOnHeader('collection')
      inputChecker.clickOnFilter('appointment', 'All');
      cy.checkStatus(scope.patientInformation.subjectId,regressionInput.collection.statuses.captureCollectionInformation,'Subjects',4)
      collectionStepsHappyPath.captureCollectionInformation();
      inputChecker.explicitWait('[data-test-id="collection_mnc_a_collection"]');

      inputChecker.clickOnHeader('collection')
      inputChecker.clickOnFilter('appointment', 'All');
      cy.checkStatus(scope.patientInformation.subjectId,regressionInput.collection.statuses.mncACollection,'Subjects',4)
      collectionStepsHappyPath.mncACollection();
      inputChecker.explicitWait('[data-test-id="collection_collection_summary"]');

      inputChecker.clickOnHeader('collection')
      inputChecker.clickOnFilter('appointment', 'All');
      cy.checkStatus(scope.patientInformation.subjectId,regressionInput.collection.statuses.collectionSummary,'Subjects',4)
      collectionStepsHappyPath.collectionSummary();
      inputChecker.explicitWait('[data-test-id="collection_shipping_checklist"]');

      inputChecker.clickOnHeader('collection')
      inputChecker.clickOnFilter('appointment', 'All');
      cy.checkStatus(scope.patientInformation.subjectId,regressionInput.collection.statuses.shippingChecklist,'Subjects',4)
      collectionStepsHappyPath.shippingChecklist();
      inputChecker.explicitWait('[data-test-id="collection_shipping_summary"]');

      inputChecker.clickOnHeader('collection')
      inputChecker.clickOnFilter('appointment', 'All');
      cy.checkStatus(scope.patientInformation.subjectId,regressionInput.collection.statuses.shippingSummary,'Subjects',4)
      collectionStepsHappyPath.shippingSummary();
      inputChecker.explicitWait('[data-test-id="collection_collection_idm_test_results"]');

      inputChecker.clickOnHeader('collection')
      inputChecker.clickOnFilter('appointment', 'All');
      cy.checkStatus(scope.patientInformation.subjectId,regressionInput.collection.statuses.collectionIdmTestResults,'Subjects',4)
      collectionStepsHappyPath.collectionIdmTestResults();

      inputChecker.clickOnFilter('appointment', 'All');
      cy.checkStatus(scope.patientInformation.subjectId,regressionInput.collection.statuses.completed,'Subjects',4)
     }
    )
  }
};
