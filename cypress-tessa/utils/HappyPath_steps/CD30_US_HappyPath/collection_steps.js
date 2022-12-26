import tableHelpers from '../../shared_block_helpers/tableHelpers';
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers';
import inputChecker from '../../shared_block_helpers/inputFieldCheckHelpers';
import collectionAssertions from '../../../fixtures/collectionAssertions.json';
import signatureHelpers from '../../shared_block_helpers/signatureHelpers';
import translationHelpers from "../../shared_block_helpers/translationHelpers";
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers';
import inputs from '../../../fixtures/inputs.json';
export default {
  collectionAliases: () => {
    cy.server();
    cy.intercept('POST', '/documents').as('postDocuments');
    cy.intercept('POST', '/signatures').as('postSignatures');
    cy.intercept('POST', '/print').as('postPrint');
    cy.intercept("POST", "/graphql").as("patients");
    cy.intercept('PATCH', '/procedure_steps/*').as('patchProcedureSteps');
    cy.intercept('GET', '/procedures/*').as('getProcedures');
    cy.intercept('POST', '/label_scans/values').as('createLabelScanValue');
    cy.intercept('POST', '/label_scans/verifications').as('labelVerifications');
  },

  printApheresisProductLabels: () => {
    cy.log('Print Apheresis Product Labels');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="collection_print_apheresis_product_labels"]','h1',
      collectionAssertions.printApheresisProductLabels.stepTitle)
    translationHelpers.assertSingleField('[data-testid="progress-print_labels-name"]',
      collectionAssertions.printApheresisProductLabels.phaseName)
    translationHelpers.assertSectionChildElement('[data-testid="print-block-container"]', 
         0,'p', collectionAssertions.printApheresisProductLabels.printButtonDescription, 0)
    translationHelpers.assertSectionChildElement('[data-test-id="print-block-block"] >>>> div',
         0, 'span', collectionAssertions.printApheresisProductLabels.printButtonLabel, 0)
    translationHelpers.assertSectionChildElement('[data-test-id="checkbox-block-block"]>>>>> div',
         0, 'p', collectionAssertions.printApheresisProductLabels.checkboxDescription, 0)
    translationHelpers.assertSectionChildElement('[data-test-id="checkbox-block-block"]>>>>>> div',
         2, 'span', collectionAssertions.printApheresisProductLabels.checkBoxLabel, 2)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]', 
      collectionAssertions.printApheresisProductLabels.sectionHeading, 0)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]', 
      collectionAssertions.printApheresisProductLabels.sectionHeading2, 1)
    }
    inputChecker.explicitWait('[data-test-id="collection_print_apheresis_product_labels"]');
    inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]')
    inputHelpers.clicker('[data-testid="btn-print"]')
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertSingleField('[data-testid="banner-message-0"]',
      collectionAssertions.printApheresisProductLabels.successMessage)
    }
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  idmSampleCollection: () => {
    cy.log('IDM Sample Collection');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="collection_idm_sample_collection"]','h1',
      collectionAssertions.idmSampleCollection.stepTitle)
    translationHelpers.assertSingleField('[data-testid=progress-verify_sample_collection-name]',
      collectionAssertions.idmSampleCollection.phaseName)
    translationHelpers.assertSingleField('[data-testid="section-heading-title"]',
      collectionAssertions.idmSampleCollection.sectionHeading)
    translationHelpers.assertSingleField('[data-testid="question-text-idm_test_sample_toggle"]',
      collectionAssertions.idmSampleCollection.toggleDescribtion)
    }
    inputChecker.explicitWait('[data-test-id="collection_idm_sample_collection"]');
    inputHelpers.clicker('[data-testid="pass-button-idm_test_sample_toggle"]')
    inputChecker.checkState("[data-testid='primary-button-action']", 'not.be.disabled')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  subjectVerification: () => {
    cy.log('Subject Verification');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="collection_subject_verification"]','h1',
      collectionAssertions.subjectVerification.stepTitle)
    translationHelpers.assertSingleField('[data-testid=progress-confirm_identity-name]',
      collectionAssertions.subjectVerification.phaseName)
    translationHelpers.assertSingleField('[data-testid="section-heading-title"]',
      collectionAssertions.subjectVerification.sectionHeading)
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-To verify the Subject identification, please use at least two methods such as Photo ID, Hospital ID and/or Verbal Verification."]',
      collectionAssertions.subjectVerification.checkboxDescription)
    translationHelpers.assertSectionChildElement('[data-test-id="checkbox-block-block"]>>>>>> div',
       2, 'span', collectionAssertions.subjectVerification.checkBoxLabel, 2)
    }
    inputChecker.explicitWait('[data-test-id="collection_subject_verification"]');
    inputHelpers.clicker('label[id="#/properties/data/properties/checkbox_key"]')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    signatureHelpers.clickSignDocumentButton('verifier', ['@postSignatures'],'arlene3@vineti.com',);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  collectionBagIdentification: () => {
    cy.log('Capture Collection Information');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="collection_collection_bag_identification"]','h1',
      collectionAssertions.collectionBagIdentification.stepTitle)
    translationHelpers.assertSingleField('[data-testid=progress-perform_collection-name]',
      collectionAssertions.collectionBagIdentification.phaseName)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]',
      collectionAssertions.collectionBagIdentification.sectionHeading1, 0)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]',
      collectionAssertions.collectionBagIdentification.sectionHeading2, 1)
    translationHelpers.assertSectionChildElement('[data-test-id="enter-and-confirm-block"]>div',
      0, 'div', collectionAssertions.collectionBagIdentification.enterAndConfirmDescription, 0);
    translationHelpers.assertSectionChildElement('[data-test-id="enter-and-confirm-block"]>>>div',
      0, 'label', collectionAssertions.collectionBagIdentification.enterLabel, 0)
    translationHelpers.assertSectionChildElement('[data-test-id="enter-and-confirm-block"]>>>div',
      1, 'label', collectionAssertions.collectionBagIdentification.confirmLabel, 0)
    translationHelpers.assertSectionChildElement('[data-test-id="checkbox-block-block"]>>>>>div',
      0, 'p', collectionAssertions.collectionBagIdentification.checkbox1Description, 0)
    translationHelpers.assertSectionChildElement('[data-test-id="checkbox-block-block"]>>>>>>div',
      2, 'span', collectionAssertions.collectionBagIdentification.checkboxLabel, 2)
    translationHelpers.assertSectionChildElement('[data-test-id="checkbox-block-block"]>>>>>div',
      2, 'p', collectionAssertions.collectionBagIdentification.checkbox2Description, 0)
    translationHelpers.assertSectionChildElement('[data-test-id="checkbox-block-block"]>>>>>>div',
      5, 'span', collectionAssertions.collectionBagIdentification.checkboxLabel, 2)
    translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]',
      collectionAssertions.collectionBagIdentification.scanAndVerifyLabel)
    translationHelpers.assertSingleField('[data-testid="recordButton-day_1_bag_1_udn"]',
      collectionAssertions.collectionBagIdentification.recordButtonLabel)
    }
    inputChecker.explicitWait('[data-test-id="collection_collection_bag_identification"]');
    inputHelpers.inputEnterAndConfirm('day_1_bag_1_udn' , inputs.collection.global.uniqueDonationNumber)
    cy.get(`@coi`).then(coi => { 
      inputHelpers.scanAndVerifyCoi(`coi`, coi)
    })
    inputHelpers.clicker('label[id="#/properties/data/properties/pre_collection_label_applied"]')
    inputHelpers.clicker('label[id="#/properties/data/properties/sponsor_provided_key_label_applied"]')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  captureCollectionInformation: () => {
    cy.log('Capture Collection Information');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="collection_capture_collection_information"]','h1',
      collectionAssertions.captureCollectionInformation.stepTitle)
    translationHelpers.assertSingleField('[data-testid=progress-perform_collection-name]',
      collectionAssertions.captureCollectionInformation.phaseName)
    translationHelpers.assertSingleField('[data-testid="section-heading-title"]',
      collectionAssertions.captureCollectionInformation.sectionHeading)
    translationHelpers.assertSectionChildElement('[data-test-id="patient-block-block"]>>>div',
        0, 'label', collectionAssertions.captureCollectionInformation.subjectHeightLabel, 0)
    translationHelpers.assertSectionChildElement('[data-test-id="collection-session-block-block"]>>>div',
        0, 'label', collectionAssertions.captureCollectionInformation.subjectWeightLabel, 0)
    }
    inputChecker.explicitWait('[data-test-id="collection_capture_collection_information"]');
    inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/patient_height-input"]',
      inputs.collection.global.subjectHeight)
    inputHelpers.inputSingleField('[data-testid="#/properties/patient_weight-input"]',
      inputs.collection.global.subjectWeight)
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  mncACollection: () => {
    cy.log('MNC(A) Collection');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="collection_mnc_a_collection"]','h1',
      collectionAssertions.mncCollectionInformation.stepTitle)
    translationHelpers.assertSingleField('[data-testid="question-text-critical_supplies_inspected"]',
      collectionAssertions.mncCollectionInformation.criticalSupplies)
    translationHelpers.assertSingleField('[data-testid=progress-perform_collection-name]',
      collectionAssertions.mncCollectionInformation.phaseName)
    translationHelpers.assertSingleField('[data-testid="section-heading-title"]', collectionAssertions.mncCollectionInformation.sectionHeading1)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="select-control-label"]', collectionAssertions.mncCollectionInformation.collectionInstrument, 0),
    translationHelpers.assertBlockLabelWithIndex('[data-testid="select-control-label"]', collectionAssertions.mncCollectionInformation.collectionProgram, 1),
    translationHelpers.assertBlockLabelWithIndex('[data-testid="select-control-label"]', collectionAssertions.mncCollectionInformation.accessType, 2)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="MaterialDateControl-Label-#/properties/apheresis_date"]', collectionAssertions.mncCollectionInformation.collectionDate, 0)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="masked-input-label"]', collectionAssertions.mncCollectionInformation.collectionStartTime, 0)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="masked-input-label"]', collectionAssertions.mncCollectionInformation.collectionEndTime, 1)
    translationHelpers.assertSectionChildElement('[id="#/properties/custom_fields/properties/whole_blood_processed_two"]',
        0, 'label' , collectionAssertions.mncCollectionInformation.wholeBloodVolume, 0)
    translationHelpers.assertSectionChildElement('[id="#/properties/custom_fields/properties/anticoagulant_volume"]',
        0, 'label' , collectionAssertions.mncCollectionInformation.totalAnticoagulant, 0)
    translationHelpers.assertSectionChildElement('[id="#/properties/custom_fields/properties/anticoagulant_type"]',
        0, 'label' , collectionAssertions.mncCollectionInformation.anticoagulantType, 0)
    translationHelpers.assertSingleField('[id="#/properties/custom_fields/properties/autologous_plasma_volume"]>label',
         collectionAssertions.mncCollectionInformation.autologousPlasmaVolume)
    translationHelpers.assertSectionChildElement('[id="#/properties/custom_fields/properties/product_volume"]',
        0, 'label' , collectionAssertions.mncCollectionInformation.totalProductVolume, 0)
    translationHelpers.assertSectionChildElement('[id="#/properties/custom_fields/properties/total_mnc_yield"]',
        0, 'label' , collectionAssertions.mncCollectionInformation.totalMNCYield, 0)
    translationHelpers.assertSectionChildElement('[id="#/properties/custom_fields/properties/total_collected_product_volume"]',
        0, 'label' , collectionAssertions.mncCollectionInformation.totalProductVolumeAfterSampling, 0)
    }
    inputChecker.explicitWait('[data-test-id="collection_mnc_a_collection"]');
    inputHelpers.dropDownSelect('select[id$="#/properties/custom_fields/properties/collection_instrument"]', 0, 
      inputs.collection.global.selSpectraOptia)
    inputHelpers.dropDownSelect('select[id$="#/properties/custom_fields/properties/collection_program"]', 0, 
      inputs.collection.global.selMnc)
    inputHelpers.dropDownSelect('select[id$="#/properties/custom_fields/properties/venous_access"]', 0, 
      inputs.collection.global.selVenusCat)
    inputHelpers.clicker('[data-testid$="fail-button-critical_supplies_inspected"]')
   if (Cypress.env('runWithHelpers')){
   translationHelpers.assertSectionChildElement('[id="#/properties/custom_fields/properties/critical_supplies_not_inspected_reason"]',
       0, 'label' , collectionAssertions.mncCollectionInformation.rationalForResponse, 0)
   }
    inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/critical_supplies_not_inspected_reason-input"]',
      inputs.collection.global.reasonCritical)
    inputHelpers.inputDateField('[id="#/properties/apheresis_date-input"]',
      inputs.collection.global.mncInputDate)
    inputHelpers.inputSingleField('[id="collection_start_time"]',
      inputs.collection.global.mncStartTime)
    inputHelpers.inputSingleField('[id="collection_end_time"]',
      inputs.collection.global.mncEndTime)
    inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/whole_blood_processed_two-input"]',
      inputs.collection.global.bloodProcessedInput)
    inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/anticoagulant_volume-input"]',
      inputs.collection.global.anticoagulantVolumeInput)
    inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/anticoagulant_type-input"]',
      inputs.collection.global.anticoagulantTypeInput)
    inputHelpers.clicker('[data-testid="fail-button-is_additional_anticoagulant_added"]')
    inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/product_volume-input"]', 
      inputs.collection.global.productVolumeInput)
    inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/total_mnc_yield-input"]',
      inputs.collection.global.totalYieldInput)
    inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/total_collected_product_volume-input"]',
      inputs.collection.global.totalVolumeInput)
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  collectionSummary: () => {
    cy.log('Collection Summary');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="collection_collection_summary"]','h1',
      collectionAssertions.collectionSummary.stepTitle)
    translationHelpers.assertSingleField('[data-testid=progress-perform_collection-name]',
      collectionAssertions.collectionSummary.phaseName)
    translationHelpers.assertSectionChildElement('[data-test-id="collection-summary-block"]',
      0,'h3', collectionAssertions.collectionSummary.sectionHeading1, 0);
    translationHelpers.assertSectionChildElement('[data-test-id="collection-summary-block"]',
      1,'h3', collectionAssertions.collectionSummary.sectionHeading2, 0);
    translationHelpers.assertSectionChildElement('[data-test-id="collection-summary-block"]',
      2,'h3', collectionAssertions.collectionSummary.sectionHeading3, 0);
    translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',
      0,'h3', collectionAssertions.collectionSummary.sectionHeading4, 0);
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Scan or enter the DIN/Unique Donation Number/Apheresis ID from your site\'s labels."]',
      collectionAssertions.collectionSummary.enterAndConfirmDescription);
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Confirm that your site\'s pre-collection label has been applied to the bag."]',
      collectionAssertions.collectionSummary.checkbox1Description);
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Confirm that you have applied the sponsor-provided label to the collection bag."]',
      collectionAssertions.collectionSummary.checkbox2Description);
    translationHelpers.assertSectionChildElement('[data-test-id="label-verification-step-row-block"]',
      0, 'div', collectionAssertions.collectionSummary.scanAndVerifyLabel, 2);
    cy.get(`@coi`).then(coi => { 
        translationHelpers.assertBlockLabelWithIndex('[data-test-id="label-verification-step-row-block"]>>>div', coi, 2)
    })
    translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>div',
      collectionAssertions.collectionSummary.dinNumber , 1)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>div',
      collectionAssertions.collectionSummary.yesLabel, 2)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>div',
      collectionAssertions.collectionSummary.yesLabel, 4)
    translationHelpers.assertBlockLabelWithIndex('[data-test-id="label-verification-step-row-block"]>>> div',
      collectionAssertions.collectionSummary.confirmed, 1)  
    translationHelpers.assertBlockData('[data-testid="display-only"]',
        {index: 3, label: collectionAssertions.collectionSummary.subjectHeightLabel, value: collectionAssertions.collectionSummary.subjectHeightValue})
    translationHelpers.assertBlockData('[data-testid="display-only"]',
        {index: 4, label: collectionAssertions.collectionSummary.subjectWeightLabel, value: collectionAssertions.collectionSummary.subjectWeightValue})
    translationHelpers.assertBlockData('[data-testid="display-only"]',
        {index: 5, label: collectionAssertions.collectionSummary.mnAaCollectionInformation, value: collectionAssertions.collectionSummary.mnAaCollectionInformationValue})
    translationHelpers.assertBlockData('[data-testid="display-only"]',
        {index: 6, label: collectionAssertions.collectionSummary.collectionProgram, value: collectionAssertions.collectionSummary.collectionProgramValue})
    translationHelpers.assertBlockData('[data-testid="display-only"]',
        {index: 7, label: collectionAssertions.collectionSummary.venousAccess, value: collectionAssertions.collectionSummary.venousAccessValue});
    translationHelpers.assertBlockData('[data-testid="display-only"]',
        {index: 8, label: collectionAssertions.collectionSummary.criticalSuppliesInspected, value: collectionAssertions.collectionSummary.criticalSuppliesInspectedValue});
    translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>div',
        collectionAssertions.collectionSummary.collectionDate , 20)
    translationHelpers.assertSingleField('[data-testid="#/properties/collection_session/properties/apheresis_date"]',
        inputs.collection.global.mncInputDate);
    translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>div',
        collectionAssertions.collectionSummary.collectionStartTime , 22)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>div',
        collectionAssertions.collectionSummary.collectionEndTime , 24)
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 13, label: collectionAssertions.collectionSummary.wholeBloodVolumeProcessed, value: collectionAssertions.collectionSummary.wholeBloodVolumeProcessedValue});
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      13,'span', inputs.collection.global.bloodProcessedInput,0);
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 14, label: collectionAssertions.collectionSummary.totalAnticoagulantInProduct, value: collectionAssertions.collectionSummary.totalAnticoagulantInProductValue});
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      14,'span', inputs.collection.global.anticoagulantVolumeInput,0);
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 15, label: collectionAssertions.collectionSummary.enterAnticoagulantType, value: collectionAssertions.collectionSummary.enterAnticoagulantTypeValue});
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      15,'span', inputs.collection.global.anticoagulantTypeInput,0);
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 16, label: collectionAssertions.collectionSummary.additionalAnticoagulantAdded, value: collectionAssertions.collectionSummary.additionalAnticoagulantAddedValue});
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 17, label: collectionAssertions.collectionSummary.autologousPlasmaVolume, value: collectionAssertions.collectionSummary.autologousPlasmaVolumeValue});
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 18, label: collectionAssertions.collectionSummary.productVolume, value: collectionAssertions.collectionSummary.productVolumeValue});
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      18,'span', inputs.collection.global.productVolumeInput,0);
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 19, label: collectionAssertions.collectionSummary.totalMncYield, value:collectionAssertions.collectionSummary.totalMncYieldValue});
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      19,'span', inputs.collection.global.totalYieldInput,0); 
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 20, label: collectionAssertions.collectionSummary.totalProductVolume, value: collectionAssertions.collectionSummary.totalProductVolumeValue});
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      20,'span', inputs.collection.global.totalVolumeInput,0);   
    }
    inputChecker.explicitWait('[data-test-id="collection_collection_summary"]');
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    signatureHelpers.clickSignDocumentButton('verifier', ['@postSignatures'],'arlene3@vineti.com',);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  shippingChecklist: () => {
    cy.log('Shipping Checklist');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="collection_shipping_checklist"]','h1',
      collectionAssertions.shippingChecklist.stepTitle)
    translationHelpers.assertSingleField('[data-testid=progress-ship_materials-name]',
      collectionAssertions.shippingChecklist.phaseName)
    }
    inputChecker.explicitWait('[data-test-id="collection_shipping_checklist"]');
    inputHelpers.inputEnterAndConfirm('air_waybill_number', inputs.collection.global.awb)
    inputHelpers.clicker('[data-testid="pass-button-attach_shipping"]')
    inputHelpers.clicker('[data-testid="pass-button-place_product_into_shipper"]')
    inputHelpers.clicker('[data-testid="pass-button-place_summary_document"]')
    inputHelpers.clicker('[data-testid="pass-button-shipper_sealed"]')
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]', collectionAssertions.shippingChecklist.sectionHeading1, 0);
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]', collectionAssertions.shippingChecklist.sectionHeading2, 1);
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]', collectionAssertions.shippingChecklist.sectionHeading3, 2);
    translationHelpers.assertSingleField('[data-testid="question-text-attach_shipping"]', collectionAssertions.shippingChecklist.attachShipperLabel);
    translationHelpers.assertSectionChildElement('[data-test-id="enter-and-confirm-block"]',
      0, 'div',collectionAssertions.shippingChecklist.scanOrEnterAirway, 1)
    translationHelpers.assertSectionChildElement('[data-test-id="enter-and-confirm-block"]>>>div',
      0, 'label', collectionAssertions.shippingChecklist.doubleValueEnter, 0)
    translationHelpers.assertSectionChildElement('[data-test-id="enter-and-confirm-block"]>>>div',
      1, 'label', collectionAssertions.shippingChecklist.doubleValueConfirm, 0)
    translationHelpers.assertSingleField('[data-testid="question-text-place_product_into_shipper"',collectionAssertions.shippingChecklist.placeProductIntoShipper, 0)
    translationHelpers.assertSingleField('[data-test-id="view-document-block"]>>>>>p', collectionAssertions.shippingChecklist.checkSummaryDoc, 0)
    translationHelpers.assertSingleField('[data-test-id="view-document-block"]>>>>>>span', collectionAssertions.shippingChecklist.viewSummary, 0);
    translationHelpers.assertSingleField('[data-testid="question-text-place_summary_document"]', collectionAssertions.shippingChecklist.placeSummaryDoc, 0)
    translationHelpers.assertSingleField('[data-testid="question-text-shipper_sealed"]', collectionAssertions.shippingChecklist.shipperSealed, 0)
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Additional Comments"]', collectionAssertions.shippingChecklist.additionalComment, 0)
    translationHelpers.assertSingleFieldWithContains('Additional Comments',
      collectionAssertions.shippingChecklist.additionalComment);
    }
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  shippingSummary: () => {
    cy.log('Shipping Summary');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="collection_shipping_summary"]','h1',
      collectionAssertions.shippingSummary.stepTitle)
    translationHelpers.assertSingleField('[data-testid=progress-ship_materials-name]',
      collectionAssertions.shippingSummary.phaseName)
    translationHelpers.assertBlockLabelWithIndex('[data-test-id="collection-summary-block"]>>h3', collectionAssertions.shippingSummary.sectionHeading1, 0);
    translationHelpers.assertBlockLabelWithIndex('[data-test-id="collection-summary-block"]>>h3', collectionAssertions.shippingSummary.sectionHeading2, 1);
    translationHelpers.assertBlockLabelWithIndex('[data-test-id="collection-summary-block"]>>h3', collectionAssertions.shippingSummary.sectionHeading3, 2);
    translationHelpers.assertSingleField('[data-testid="section-heading-title"]', collectionAssertions.shippingSummary.sectionHeading4);
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 0, label: collectionAssertions.shippingSummary.attachShipperLabel, value: collectionAssertions.shippingSummary.attachShipperLabelValue})
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 1, label: collectionAssertions.shippingSummary.scanOrEnterAirway, value: collectionAssertions.shippingSummary.scanOrEnterAirwayValue})
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 3, label: collectionAssertions.shippingSummary.placeProductIntoShipper, value: collectionAssertions.shippingSummary.placeProductIntoShipperValue})  
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 4, label: collectionAssertions.shippingSummary.placeSummaryDoc, value: collectionAssertions.shippingSummary.placeSummaryDocValue})
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 5, label: collectionAssertions.shippingSummary.shipperSealed, value: collectionAssertions.shippingSummary.shipperSealedValue})
    translationHelpers.assertBlockLabel('[data-testid="display-only"]',
      {index: 6, label: collectionAssertions.shippingSummary.additionalComment})
    }
    inputChecker.explicitWait('[data-test-id="collection_shipping_summary"]');
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  collectionIdmTestResults: () => {
    cy.log('Shipping Summary');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="collection_collection_idm_test_results"]','h1',
      collectionAssertions.collectionIdmTestResults.stepTitle)
    translationHelpers.assertSingleField('[data-testid=progress-update_idm_test_results-name]',
      collectionAssertions.collectionIdmTestResults.phaseName)
    translationHelpers.assertSingleField('[data-testid="section-heading-title"]',
      collectionAssertions.collectionIdmTestResults.sectionHeading),
    translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>div',
      collectionAssertions.collectionIdmTestResults.collectionDate, 0)
    translationHelpers.assertSingleField('[data-testid="question-text-update_idm_test_results"]',
      collectionAssertions.collectionIdmTestResults.toggleDescribtion)
    }
    inputChecker.explicitWait('[data-test-id="collection_collection_idm_test_results"]');
    inputHelpers.clicker('[data-testid="pass-button-update_idm_test_results"]')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  }
};
