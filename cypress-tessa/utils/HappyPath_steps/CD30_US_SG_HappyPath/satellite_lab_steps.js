import inputHelpers from '../../shared_block_helpers/inputFieldHelpers';
import inputChecker from '../../shared_block_helpers/inputFieldCheckHelpers';
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers';
import documentUploadHelper from '../../shared_block_helpers/documentUploadHelpers';
import signatureHelpers from '../../shared_block_helpers/signatureHelpers';
import translationHelpers from "../../shared_block_helpers/translationHelpers";
import inputs from "../../../fixtures/inputs.json";
import satelliteLabAssertions from '../../../fixtures/satelliteLabAssertions.json';


export default {
  satelliteLabAliases: () => {
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


  collectionSummary: () => {
    cy.log('Collection Summary');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="satellite_lab_collection_summary"]','h1',
      satelliteLabAssertions.collectionSummary.stepTitle)
    translationHelpers.assertChildElement('[data-test-id="section-heading-block-block"]', 'h3',
      satelliteLabAssertions.collectionSummary.sectionHeading);
    translationHelpers.assertBlockLabel('[data-testid="display-only"]>div',
      {index: 0, label: satelliteLabAssertions.collectionSummary.collectionDateLabel})
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 1, label: satelliteLabAssertions.collectionSummary.collectionIDMLabel, value: satelliteLabAssertions.collectionSummary.collectionIDMValue})
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 2, label: satelliteLabAssertions.collectionSummary.dinLabel, value: satelliteLabAssertions.collectionSummary.dinValue})
    translationHelpers.assertBlockLabel('[data-test-id="view-document-block"]>>>>div',
      {index: 0, label: satelliteLabAssertions.collectionSummary.orderSummary})
    translationHelpers.assertBlockLabel('[data-test-id="view-document-block"]>>>>div',
      {index: 1, label: satelliteLabAssertions.collectionSummary.viewSummary})
    }
    inputChecker.explicitWait('[data-test-id="satellite_lab_collection_summary"]'); 
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  shipmentReceiptChecklist: () => {
    cy.log('Shipment Receipt Checklist');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="satellite_lab_shipment_receipt_checklist"]','h1',
      satelliteLabAssertions.shipmentReceiptChecklist.stepTitle)
    translationHelpers.assertSingleField('[data-testid="progress-receive_materials-name"]',
      satelliteLabAssertions.shipmentReceiptChecklist.phaseName);
    }
    inputChecker.explicitWait('[data-test-id="satellite_lab_shipment_receipt_checklist"]'); 
    inputHelpers.inputSingleField('[data-testid="air-waybill-number-input-field"]',
      inputs.satelliteLab.global.satelliteLabWrongAwb)
    inputHelpers.clicker('[data-testid="air-waybill-number-action-trigger-button"]')
    inputHelpers.clicker('[data-testid="fail-button-collection_awb_match"]')
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/collection_awb_not_match_reason-input"]',
      inputs.satelliteLab.global.sLabWrongAwbReason)
    inputHelpers.clicker('[data-testid="pass-button-shipping_container_intact"]')
    inputHelpers.clicker('[data-testid="pass-button-shipper_seal_intact"]')
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]', satelliteLabAssertions.shipmentReceiptChecklist.scanAndEnter)
    translationHelpers.assertSingleField('[data-testid="question-text-collection_awb_match"]', satelliteLabAssertions.shipmentReceiptChecklist.satelliteAwbNotMatch)
    translationHelpers.assertSingleField('[id="#/properties/shipping_checklist/properties/collection_awb_not_match_reason"]>label', satelliteLabAssertions.shipmentReceiptChecklist.rationalResponse)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]', satelliteLabAssertions.shipmentReceiptChecklist.sectionHeading1, 0)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]', satelliteLabAssertions.shipmentReceiptChecklist.sectionHeading2, 1)
    translationHelpers.assertSingleField('[data-testid="question-text-shipping_container_intact"]', satelliteLabAssertions.shipmentReceiptChecklist.shippingContainer)
    translationHelpers.assertSingleField('[data-testid="question-text-shipper_seal_intact"]', satelliteLabAssertions.shipmentReceiptChecklist.shipperSeal)
    translationHelpers.assertSingleField('[for="#/properties/custom_fields/properties/additional_comments-input"]', satelliteLabAssertions.shipmentReceiptChecklist.additionalComments)
    }
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });;
  },

  shipmentReceiptSummary: () => {
    cy.log('Shipment Receipt Summary');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="satellite_lab_shipment_receipt_summary"]','h1',
      satelliteLabAssertions.shipmentReceiptSummary.stepTitle)
    translationHelpers.assertSingleField('[data-testid="progress-receive_materials-name"]',
      satelliteLabAssertions.shipmentReceiptSummary.phaseName)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]', satelliteLabAssertions.shipmentReceiptSummary.sectionHeading1, 0)
    translationHelpers.assertSingleField('[data-test-id="collection-summary-block"]>>h3', satelliteLabAssertions.shipmentReceiptSummary.sectionHeading2)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]', satelliteLabAssertions.shipmentReceiptSummary.sectionHeading3, 1)
    translationHelpers.assertBlockLabelWithIndex('[data-test-id="label-verification-step-row-block"]>>>div', satelliteLabAssertions.shipmentReceiptSummary.scanAndEnter, 0)
    translationHelpers.assertBlockLabelWithIndex('[data-test-id="label-verification-step-row-block"]>>>div', satelliteLabAssertions.shipmentReceiptSummary.scanAndEnterValue, 1)
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 0, label: satelliteLabAssertions.shipmentReceiptSummary.satelliteAwbNotMatch, value: satelliteLabAssertions.shipmentReceiptSummary.satelliteAwbNotMatchValue})
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 1, label: satelliteLabAssertions.shipmentReceiptSummary.rationalResponse, value: satelliteLabAssertions.shipmentReceiptSummary.rationalResponseValue})
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 2, label: satelliteLabAssertions.shipmentReceiptSummary.shippingContainer, value: satelliteLabAssertions.shipmentReceiptSummary.shippingContainerValue})
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 3, label: satelliteLabAssertions.shipmentReceiptSummary.shipperSeal, value: satelliteLabAssertions.shipmentReceiptSummary.shipperSealValue})
    }
    inputChecker.explicitWait('[data-test-id="satellite_lab_shipment_receipt_summary"]'); 
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  apheresisProductReceipt: () => {
    cy.log('Apheresis Product Receipt');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="satellite_lab_apheresis_product_receipt"]','h1',
      satelliteLabAssertions.apheresisProductReceipt.stepTitle)
    translationHelpers.assertSingleField('[data-testid="progress-receive_materials-name"]',
      satelliteLabAssertions.apheresisProductReceipt.phaseName)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]', satelliteLabAssertions.apheresisProductReceipt.sectionHeading1, 0)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]', satelliteLabAssertions.apheresisProductReceipt.sectionHeading2, 1)
    translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]',
      satelliteLabAssertions.apheresisProductReceipt.scanAndVerifyLabel)
    translationHelpers.assertSingleField('[data-testid="question-text-temperature_data"]',
      satelliteLabAssertions.apheresisProductReceipt.tempDataconfirmToggleLabel)
    translationHelpers.assertSingleField('[data-testid="question-text-collection_bag_condition"]',
      satelliteLabAssertions.apheresisProductReceipt.collectionBagExpectedToggleLabel)
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Additional Comments"]',
      satelliteLabAssertions.apheresisProductReceipt.additionalComment)
    }
    inputChecker.explicitWait('[data-test-id="satellite_lab_apheresis_product_receipt"]'); 
    cy.get(`@coi`).then(coi => {
      inputHelpers.scanAndVerifyCoi('coi', coi)
    })
    inputHelpers.clicker('[data-testid="pass-button-temperature_data"]')
    inputHelpers.clicker('[data-testid="pass-button-collection_bag_condition"]')
    inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/apheresis_additional_comment-input"]',
      inputs.satelliteLab.global.addBox)
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  apheresisProductReceiptSummary: () => {
    cy.log('Apheresis Product Receipt Summary');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="satellite_lab_apheresis_product_receipt_summary"]','h1',
      satelliteLabAssertions.apheresisProductReceiptSummary.stepTitle)
    translationHelpers.assertSingleField('[data-testid="progress-receive_materials-name"]',
      satelliteLabAssertions.apheresisProductReceiptSummary.phaseName)
    translationHelpers.assertSingleField('[data-test-id="step-header-block"]>>h3', satelliteLabAssertions.apheresisProductReceiptSummary.sectionHeading1)
    translationHelpers.assertSingleField('[data-test-id="collection-summary-block"]>>h3', satelliteLabAssertions.apheresisProductReceiptSummary.sectionHeading2)
    translationHelpers.assertSingleField('[data-testid="section-heading-title"]', satelliteLabAssertions.apheresisProductReceiptSummary.sectionHeading3)
    translationHelpers.assertBlockLabelWithIndex('[data-test-id="label-verification-step-row-block"]>>>div', satelliteLabAssertions.apheresisProductReceiptSummary.scanAndVerifyLabel, 0)
    translationHelpers.assertBlockLabelWithIndex('[data-test-id="label-verification-step-row-block"]>>>div', satelliteLabAssertions.apheresisProductReceiptSummary.confirmed, 1)
    cy.get(`@coi`).then(coi => {
      translationHelpers.assertBlockLabelWithIndex('[data-test-id="label-verification-step-row-block"]>>>div', coi, 2)
    })
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 0, label: satelliteLabAssertions.apheresisProductReceiptSummary.tempDataconfirmToggleLabel, value: satelliteLabAssertions.apheresisProductReceiptSummary.collectionBagExpectedToggleValue});
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 1, label: satelliteLabAssertions.apheresisProductReceiptSummary.collectionBagExpectedToggleLabel, value: satelliteLabAssertions.apheresisProductReceiptSummary.collectionBagExpectedToggleValue});
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 2, label: satelliteLabAssertions.apheresisProductReceiptSummary.additionalComment, value: satelliteLabAssertions.apheresisProductReceiptSummary.additionalCommentValue});
    translationHelpers.assertBlockLabelWithIndex('[data-testid="edit-apheresis_product_receipt"]>span', satelliteLabAssertions.apheresisProductReceiptSummary.edit, 0);
    translationHelpers.assertBlockLabelWithIndex('[data-testid="edit-apheresis_product_receipt"]>span', satelliteLabAssertions.apheresisProductReceiptSummary.edit, 1);
    }
    inputChecker.explicitWait('[data-test-id="satellite_lab_apheresis_product_receipt_summary"]'); 
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  cryopreservationDate: () => {
    cy.log('Cryopreservation Date');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="satellite_lab_cryopreservation_date"]','h1',
      satelliteLabAssertions.cryopreservationDate.stepTitle)
    translationHelpers.assertSingleField('[data-testid="progress-process_pbmc-name"]',
      satelliteLabAssertions.cryopreservationDate.phaseName)
    translationHelpers.assertSingleField('[data-testid="section-heading-title"]',
      satelliteLabAssertions.cryopreservationDate.sectionHeading)
    translationHelpers.assertSingleField('[data-test-id="treatment-block-block"]>>>>label',
      satelliteLabAssertions.cryopreservationDate.cryoDate)
    }
    inputChecker.explicitWait('[data-test-id="satellite_lab_cryopreservation_date"]'); 
    inputHelpers.inputDateField('[id="#/properties/custom_fields/properties/date_of_cryopreservation-input"]',
      inputs.satelliteLab.global.cryopreservationDate)
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  pbmcLabels: () => {
    cy.log('PBMC Labels');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="satellite_lab_pbmc_labels"]','h1',
      satelliteLabAssertions.pbmcLabels.stepTitle)
    translationHelpers.assertSingleField('[data-testid="progress-process_pbmc-name"]',
      satelliteLabAssertions.pbmcLabels.phaseName)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]',
      satelliteLabAssertions.pbmcLabels.sectionHeading, 0)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="print-counter-block"]>b',
      satelliteLabAssertions.pbmcLabels.labelText, 0)
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Confirm that the expected labels printed correctly and are legible."]',
      satelliteLabAssertions.pbmcLabels.checkboxDescription)
    translationHelpers.assertBlockLabelWithIndex('[data-test-id="checkbox-block-block"]>>>>>>>>span',
      satelliteLabAssertions.pbmcLabels.checkBoxLabel, 1)
    }
    inputChecker.explicitWait('[data-test-id="satellite_lab_pbmc_labels"]'); 
    inputHelpers.clicker('[data-testid="btn-print"]')
    inputHelpers.clicker('[id="#/properties/data/properties/expected_labels_printed"]')
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertSingleField('[data-testid="banner-message-0"]',
      satelliteLabAssertions.pbmcLabels.successMessage)
    }
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  pbmcLabelsEu: () => {
    cy.log('PBMC Labels');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="satellite_lab_pbmc_labels"]','h1',
      satelliteLabAssertions.pbmcLabelsEu.stepTitle)
    translationHelpers.assertSingleField('[data-testid="progress-process_pbmc-name"]',
      satelliteLabAssertions.pbmcLabelsEu.phaseName)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]',
      satelliteLabAssertions.pbmcLabelsEu.sectionHeading, 0)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="print-counter-block"]>b',
      satelliteLabAssertions.pbmcLabelsEu.labelText, 0)
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Confirm that the expected labels printed correctly and are legible."]',
      satelliteLabAssertions.pbmcLabelsEu.checkboxDescription)
    translationHelpers.assertBlockLabelWithIndex('[data-test-id="checkbox-block-block"]>>>>>>>>span',
      satelliteLabAssertions.pbmcLabelsEu.checkBoxLabel, 1)
    }
    inputChecker.explicitWait('[data-test-id="satellite_lab_pbmc_labels"]'); 
    inputHelpers.inputDateField('[id="#/properties/custom_fields/properties/date_of_cryopreservation-input"]',
      inputs.satelliteLab.global.cryopreservationDate)
    inputHelpers.clicker('[data-testid="btn-print"]')
    inputHelpers.clicker('[id="#/properties/data/properties/expected_labels_printed"]')
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertSingleField('[data-testid="banner-message-0"]',
      satelliteLabAssertions.pbmcLabelsEu.successMessage)
    }
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  pbmcBagsInformation: () => {
    cy.log('PBMC Bags Information');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="satellite_lab_pbmc_bags_information"]','h1',
      satelliteLabAssertions.pbmcBagsInformation.stepTitle)
    translationHelpers.assertSingleField('[data-testid="progress-process_pbmc-name"]',
      satelliteLabAssertions.pbmcBagsInformation.phaseName)
    translationHelpers.assertSingleField('[data-test-id="section-heading-block-block"]>>h3',
      satelliteLabAssertions.pbmcBagsInformation.sectionHeading),
    translationHelpers.assertChildElement('[data-test-id="bags-creation-block-block"]', 'p',
      satelliteLabAssertions.pbmcBagsInformation.inputFieldTitle),
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Apply Labels to Bags and Cassettes"]',
      satelliteLabAssertions.pbmcBagsInformation.checkboxDescription),
    translationHelpers.assertBlockLabelWithIndex('[data-test-id="checkbox-block-block"]>>>>>>>>span', satelliteLabAssertions.pbmcBagsInformation.checkBoxLabel, 1)
    }
    inputChecker.explicitWait('[data-test-id="satellite_lab_pbmc_bags_information"]'); 
    inputHelpers.inputSingleField('[id="#/properties/item_count-input"]',
      inputs.satelliteLab.global.bagCount)
    inputHelpers.clicker('[id="#/properties/data/properties/is_applied"]')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  processPbmcSummary: () => {
    cy.log('Process PBMC Summary');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="satellite_lab_process_pbmc_summary"]','h1',
      satelliteLabAssertions.processPbmcSummary.stepTitle)
    translationHelpers.assertSingleField('[data-testid="progress-process_pbmc-name"]',
      satelliteLabAssertions.processPbmcSummary.phaseName)
    translationHelpers.assertSingleField('[data-test-id="step-header-block"]>>h3', satelliteLabAssertions.processPbmcSummary.sectionFirst)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]', satelliteLabAssertions.processPbmcSummary.sectionSecond, 0)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]', satelliteLabAssertions.processPbmcSummary.sectionThird, 1)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>div', satelliteLabAssertions.processPbmcSummary.cryoDate, 0)
    translationHelpers.assertChildElement('[data-test-id="bags-creation-block-block"]', 'p',
      satelliteLabAssertions.processPbmcSummary.resultedBags),
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Confirm that the expected labels printed correctly and are legible."]',
      satelliteLabAssertions.processPbmcSummary.labelsPrinted)
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Apply Labels to Bags and Cassettes"]',
      satelliteLabAssertions.processPbmcSummary.bagCassettes)
    }
    inputChecker.explicitWait('[data-test-id="satellite_lab_process_pbmc_summary"]'); 
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  conditionalRelease: () => {
    cy.log('Conditional Release');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="satellite_lab_conditional_release"]','h1',
      satelliteLabAssertions.conditionalRelease.stepTitle)
    translationHelpers.assertSingleField('[data-testid="progress-release_pbmc-name"]',
      satelliteLabAssertions.conditionalRelease.phaseName)
    }
    inputChecker.explicitWait('[data-test-id="satellite_lab_conditional_release"]'); 
    documentUploadHelper.multipleDocumentsUpload(['validpdf.pdf'], {
      encoding: 'base64',
      selector: '.btn-file-input input',
      type: 'application/pdf',
      inputType: 'input',
    });
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertSingleField('[data-testid="section-heading-title"]',
      satelliteLabAssertions.conditionalRelease.headerFirst)
    translationHelpers.assertChildElement('[data-test-id="upload-files-block"]', 'p',
      satelliteLabAssertions.conditionalRelease.uploadText),
    translationHelpers.assertChildElement('[data-test-id="upload-files-block"]', 'h5',
      satelliteLabAssertions.conditionalRelease.uploadDescription)
    }
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  finalRelease: () => {
    cy.log('Final Release');
    cy.wait(2000);
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="satellite_lab_final_release"]','h1',
      satelliteLabAssertions.finalRelease.stepTitle)
    translationHelpers.assertSingleField('[data-testid="progress-release_pbmc-name"]',
      satelliteLabAssertions.finalRelease.phaseName)
    }
    inputChecker.explicitWait('[data-test-id="satellite_lab_final_release"]');
    documentUploadHelper.multipleDocumentsUpload(['validpdf.pdf'], {
      encoding: 'base64',
      selector: '.btn-file-input input',
      type: 'application/pdf',
      inputType: 'input',
    });
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertSingleField('[data-testid="section-heading-title"]',
      satelliteLabAssertions.finalRelease.headerFirst),
    translationHelpers.assertChildElement('[data-test-id="upload-files-block"]', 'p',
      satelliteLabAssertions.finalRelease.uploadText),
    translationHelpers.assertChildElement('[data-test-id="upload-files-block"]', 'h5',
      satelliteLabAssertions.finalRelease.uploadDescription)
    }
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  selectBagsToBeShipped: () => {
    cy.log('Select Bags To Be Shipped');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="satellite_lab_select_bags_to_be_shipped"]','h1',
      satelliteLabAssertions.selectBagsToBeShipped.stepTitle)
    translationHelpers.assertSingleField('[data-testid="progress-ship_materials-name"]',
      satelliteLabAssertions.selectBagsToBeShipped.phaseName)
    }
    inputChecker.explicitWait('[data-test-id="satellite_lab_select_bags_to_be_shipped"]'); 
    inputHelpers.clicker('[data-testid="pass-button-0"]')
    inputHelpers.clicker('[data-testid="fail-button-1"]')
    inputHelpers.clicker('[data-testid="pass-button-2"]')
    inputHelpers.clicker('[data-testid="fail-button-3"]')
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertChildElement('[data-test-id="section-heading-block-block"]', 'h3',
      satelliteLabAssertions.selectBagsToBeShipped.headerFirst)
    translationHelpers.assertSingleField('[data-testid="section-heading-description"]',
      satelliteLabAssertions.selectBagsToBeShipped.headerDescription)
    translationHelpers.assertBlockLabelWithIndex('[data-test-id="shipping-toggle-block"]>>>>>>span',
      satelliteLabAssertions.selectBagsToBeShipped.passToggle, 0)
    translationHelpers.assertBlockLabelWithIndex('[data-test-id="shipping-toggle-block"]>>>>>>span',
      satelliteLabAssertions.selectBagsToBeShipped.failToggle, 1)
    }
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  shippingChecklist: () => {
    cy.log('Shipping Checklist');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="satellite_lab_shipping_checklist"]','h1',
      satelliteLabAssertions.shippingChecklist.stepTitle)
    translationHelpers.assertSingleField('[data-testid="progress-ship_materials-name"]',
      satelliteLabAssertions.shippingChecklist.phaseName)
    }
    inputChecker.explicitWait('[data-test-id="satellite_lab_shipping_checklist"]'); 
    inputHelpers.inputEnterAndConfirm('satellite_awb', inputs.satelliteLab.global.satelliteAwb)
    cy.get(`@coi`).then(coi => {
      inputHelpers.scanAndVerifyBags('bag-identifier-1', `${coi}-PRC-01`)
      inputHelpers.scanAndVerifyBags('bag-identifier-3', `${coi}-PRC-03`)
    })
    inputHelpers.clicker('[data-testid="pass-button-shipping_labels_attached"]')
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/awb_comment-input"]',
      inputs.satelliteLab.global.awbComment)
    inputHelpers.clicker('[data-testid="pass-button-fp_into_shipper"]')
    inputHelpers.clicker('[data-testid="pass-button-summary_documents"]')
    inputHelpers.clicker('[data-testid="pass-button-shipper_sealed"]')
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/shipper_sealed_comment-input"]',
      inputs.satelliteLab.global.shipperComment)
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]',
      satelliteLabAssertions.shippingChecklist.bagScan, 0)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]',
      satelliteLabAssertions.shippingChecklist.shippingLabel, 1)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]',
      satelliteLabAssertions.shippingChecklist.packShipper, 2)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]',
      satelliteLabAssertions.shippingChecklist.sealShipper, 3)
    translationHelpers.assertSingleField('[data-testid="question-text-shipping_labels_attached"]',
      satelliteLabAssertions.shippingChecklist.shippingLablesAttached)
    translationHelpers.assertSingleField('[data-testid="question-text-fp_into_shipper"]',
      satelliteLabAssertions.shippingChecklist.packShipperQuestion)
    translationHelpers.assertChildElement('[data-test-id="view-document-block"]', 'p',
      satelliteLabAssertions.shippingChecklist.viewSummaryDescription),
    translationHelpers.assertSingleField('[data-testid="question-text-summary_documents"]',
      satelliteLabAssertions.shippingChecklist.summaryDocuments)
    translationHelpers.assertSingleField('[data-testid="question-text-shipper_sealed"]',
      satelliteLabAssertions.shippingChecklist.sealShipperQuestion)
    }
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  shippingSummary: () => {
    cy.log('Shipping Summary');
    if (Cypress.env('runWithHelpers')){
    translationHelpers.assertPageTitles('[data-test-id="satellite_lab_shipping_summary"]','h1',
      satelliteLabAssertions.shippingSummary.stepTitle)
    translationHelpers.assertSingleField('[data-testid="progress-ship_materials-name"]',
      satelliteLabAssertions.shippingSummary.phaseName),
    translationHelpers.assertBlockLabelWithIndex('[data-test-id="step-header-block"]>>h3',
      satelliteLabAssertions.shippingSummary.sectionTitleFirst, 0),
    translationHelpers.assertBlockLabelWithIndex('[data-test-id="step-header-block"]>>h3',
      satelliteLabAssertions.shippingSummary.sectionTitleSecond, 1),
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Attach shipping labels to shipper."]',
      satelliteLabAssertions.shippingSummary.shipperLabels),
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Pack and load the PBMC bags into the shipper according to the instructions provided."]',
      satelliteLabAssertions.shippingSummary.packingInstructions),
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Place summary documents in the shipper."]',
      satelliteLabAssertions.shippingSummary.summaryDocuments)
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Shipper has been sealed."]',
      satelliteLabAssertions.shippingSummary.shipperSealed)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]',
      satelliteLabAssertions.shippingSummary.ship, 0),
    translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]',
      satelliteLabAssertions.shippingSummary.doNotShip, 1)
    }
    inputChecker.explicitWait('[data-test-id="satellite_lab_shipping_summary"]'); 
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  }
}
