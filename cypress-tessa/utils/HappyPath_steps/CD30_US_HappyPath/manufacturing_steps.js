import actionButtonsHelper from '../../../utils/shared_block_helpers/actionButtonHelpers';
import documentUploadHelper from '../../../utils/shared_block_helpers/documentUploadHelpers';
import signatureHelpers from '../../../utils/shared_block_helpers/signatureHelpers';
import inputHelpers from '../../../utils/shared_block_helpers/inputFieldHelpers';
import inputChecker from '../../shared_block_helpers/inputFieldCheckHelpers';
import manufacturingAssertions from '../../../fixtures/manufacturingAssertions.json';
import manufacturingAssertionsUs from '../../../fixtures/manufacturingAssertionsUs.json';
import translationHelpers from "../../../utils/shared_block_helpers/translationHelpers";
import inputs from "../../../fixtures/inputs.json";

export default {
  manufacturingAliases: () => {
    cy.server();
    cy.intercept('POST', '/documents').as('postDocuments');
    cy.intercept('POST', '/signatures').as('postSignatures');
    cy.intercept('POST', '/print').as('postPrint');
    cy.intercept("POST", "/graphql").as("patients");
    cy.intercept('POST', '/procedures').as('postProcedures');
    cy.intercept('POST', '/label_scans/values').as('createLabelScanValue');
    cy.intercept('POST', '/label_scans/verifications').as('labelVerifications');
    cy.intercept('PATCH', '/procedure_steps/*').as('patchProcedureSteps');
    cy.intercept('GET', '/procedures/*').as('getProcedures');
  },


  assignLotNumber: () => {
    cy.log('Lot Number');
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_lot_number"]','h1',
        manufacturingAssertions.lotNumberAssignment.title)
      translationHelpers.assertSingleField('[data-testid="progress-assign_lot-name"]',
        manufacturingAssertions.lotNumberAssignment.phaseName)
      translationHelpers.assertChildElement('[data-test-id="section-heading-block-block"]', 'h3',
        manufacturingAssertions.lotNumberAssignment.headerFirst)
      cy.get('[data-test-id="enter-and-confirm-block"]').find('> div').eq(0).find('> div').eq(0)
        .invoke('text').should('equal',manufacturingAssertions.lotNumberAssignment.recordLotText)
    }   
    inputChecker.explicitWait('[data-test-id="manufacturing_lot_number"]'); 
    inputHelpers.inputEnterAndConfirm('lot_number', inputs.manufacturing.global.lotNumber)
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },
 
  collectionSummary: () => {
    cy.log('Collection Summary');
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_collection_summary"]','h1',
        manufacturingAssertions.collectionSummary.title)
      translationHelpers.assertSingleField('[data-testid="progress-receive_materials-name"]',
        manufacturingAssertions.collectionSummary.phaseName)
      translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',
        0,'div', manufacturingAssertions.collectionSummary.sectionFirst,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        0,'div', manufacturingAssertions.collectionSummary.collectionDate,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        1,'div', manufacturingAssertions.collectionSummary.collectionIDMResults,0); 
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        1,'span', manufacturingAssertions.collectionSummary.collectionIDMResultsValue,0); 
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        2,'div', manufacturingAssertions.collectionSummary.dinUdn,0); 
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        2,'span', manufacturingAssertions.collectionSummary.dinUdnValue,0); 
      translationHelpers.assertSectionChildElement('[data-test-id="view-document-block"]',
        0,'p', manufacturingAssertions.collectionSummary.orderSummary,0);
      translationHelpers.assertSectionChildElement('[data-test-id="view-document-block"]',
        1,'p', manufacturingAssertions.collectionSummary.collectionSummary,0);
      }
    inputChecker.explicitWait('[data-test-id="manufacturing_collection_summary"]'); 
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  shipmentReceiptChecklist: () => {
    cy.log('Shipment Receipt Checklist');
    if (Cypress.env('runWithHelpers')) {
    translationHelpers.assertPageTitles('[data-test-id="manufacturing_shipment_receipt_checklist"]','h1',
      manufacturingAssertions.shipmentReceiptChecklist.title)
    translationHelpers.assertSingleField('[data-testid="progress-receive_materials-name"]',
      manufacturingAssertions.shipmentReceiptChecklist.phaseName)
    }
    inputChecker.explicitWait('[data-test-id="manufacturing_shipment_receipt_checklist"]'); 
    inputHelpers.inputSingleField('[data-testid="air-waybill-number-input-field"]',
      inputs.manufacturing.global.satLWrongAwb)
    inputHelpers.clicker('[data-testid="air-waybill-number-action-trigger-button"]')
    inputHelpers.clicker('[data-testid="fail-button-satellite_lab_awb_match"]')
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/satellite_lab_awb_not_match_reason-input"]',
      inputs.manufacturing.global.satLWrongAwbReason)
    inputHelpers.clicker('[data-testid="pass-button-shipping_container_condition"]')
    inputHelpers.clicker('[data-testid="pass-button-shipping_seal_intact"]')
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/comment-input"]',
      inputs.manufacturing.global.optCommentOne)
    if (Cypress.env('runWithHelpers')) {
    translationHelpers.assertSingleField('[data-testid="question-text-satellite_lab_awb_match"]',
      manufacturingAssertions.shipmentReceiptChecklist.satelliteAwbNotMatch);
    translationHelpers.assertSingleField('[id="#/properties/shipping_receipt_checklist/properties/satellite_lab_awb_not_match_reason"]',
      manufacturingAssertions.shipmentReceiptChecklist.rationalResponse)
    translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',0,
        'h3',manufacturingAssertions.shipmentReceiptChecklist.headerFirst,0)
    translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',1,
      'h3',manufacturingAssertions.shipmentReceiptChecklist.headerSecond,0)
    translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]',
      manufacturingAssertions.shipmentReceiptChecklist.awbDescription)
    translationHelpers.assertSingleField('[data-testid="question-text-shipping_container_condition"]',
      manufacturingAssertions.shipmentReceiptChecklist.shippingContainerCondition)
    translationHelpers.assertSingleField('[data-testid="question-text-shipping_seal_intact"]',
      manufacturingAssertions.shipmentReceiptChecklist.shippingSealIntact)
    }

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  shipmentReceiptSummary: () => {
    cy.log('Shipment Receipt Summary');
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_shipment_receipt_summary"]','h1',
        manufacturingAssertions.shipmentReceiptSummary.title)
      translationHelpers.assertSingleField('[data-testid="progress-receive_materials-name"]',
        manufacturingAssertions.shipmentReceiptSummary.phaseName)
      translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',0,'h3',
        manufacturingAssertions.shipmentReceiptSummary.headerFirst)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',0,'div',
        manufacturingAssertions.shipmentReceiptSummary.airwayBillno,0)
      translationHelpers.assertSectionChildElement('[data-test-id="step-header-block"]',0,'h3',
        manufacturingAssertions.shipmentReceiptSummary.headerSecond,0)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the shipping container in good intact condition?"]',
        manufacturingAssertions.shipmentReceiptSummary.shippingContainerCondition)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the seal on the shipper intact?"]',
        manufacturingAssertions.shipmentReceiptSummary.shippingSealIntact);
      }
    inputChecker.explicitWait('[data-test-id="manufacturing_shipment_receipt_summary"]');  
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  apheresisProductReceiptUs: () => {
    cy.log('Apheresis Product Receipt');
    if (Cypress.env('runWithHelpers')) {
    translationHelpers.assertPageTitles('[data-test-id="manufacturing_apheresis_product_receipt"]','h1',
      manufacturingAssertionsUs.apheresisProductReceipt.title)
    translationHelpers.assertSingleField('[data-testid="progress-receive_materials-name"]',
      manufacturingAssertionsUs.apheresisProductReceipt.phaseName)
    }
    inputChecker.explicitWait('[data-test-id="manufacturing_apheresis_product_receipt"]');
    cy.get(`@coi`).then(coi =>{
      inputHelpers.scanAndVerifyCoi(`coi`, coi)
    })
    inputHelpers.clicker('[data-testid="pass-button-aphereis_temperature_data"]')
    inputHelpers.clicker('[data-testid="pass-button-aphereis_bag_condition"]')
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/apheresis_optional_comments-input"]',
      inputs.manufacturing.us.optCommentAph)
    translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',0,
      'h3', manufacturingAssertions.apheresisProductReceipt.sectionHeadingFirst,0);
    translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',1,
      'h3', manufacturingAssertions.apheresisProductReceipt.sectionHeadingSecond,0);
    translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]',
      manufacturingAssertionsUs.apheresisProductReceipt.coiNumberVerification)
    translationHelpers.assertSingleField('[data-testid="question-text-aphereis_temperature_data"]',
      manufacturingAssertionsUs.apheresisProductReceipt.temperatureDataQuestion)
    translationHelpers.assertSingleField('[data-testid="question-text-aphereis_bag_condition"]',
      manufacturingAssertionsUs.apheresisProductReceipt.bagConditionQuestion)
    cy.get('[data-test-id="shipping-checklist-block-block"]').find('label').eq(2).invoke('text')
      .should('equal', manufacturingAssertionsUs.apheresisProductReceipt.additionalComments),
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  apheresisProductReceiptSummary: () => {
    cy.log('Apheresis Product Receipt Summary');
    if (Cypress.env('runWithHelpers')) {
    translationHelpers.assertPageTitles('[data-test-id="manufacturing_apheresis_product_receipt_summary"]','h1',
      manufacturingAssertions.apheresisProductReceiptSummary.title)
    translationHelpers.assertSingleField('[data-testid="progress-receive_materials-name"]',
      manufacturingAssertions.apheresisProductReceiptSummary.phaseName)
    translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',0,
      'h3', manufacturingAssertions.apheresisProductReceiptSummary.bagScan,0);
    translationHelpers.assertSectionChildElement('[data-test-id="shipping-checklist-summary-block-block"]',0,
      'h3', manufacturingAssertions.apheresisProductReceiptSummary.materialConditionDetails,0);
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the collection bag in expected good condition?"]',
      manufacturingAssertions.apheresisProductReceiptSummary.collectionBagCondition)
    translationHelpers.assertSingleField('[data-test-id="label-verification-step-row-block"]',
      manufacturingAssertions.apheresisProductReceiptSummary.scan)
    }
    inputChecker.explicitWait('[data-test-id="manufacturing_apheresis_product_receipt_summary"]');
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },
  
  apheresisProductReceiptSummaryUs: () => {
    cy.log('Apheresis Product Receipt Summary');
    if (Cypress.env('runWithHelpers')) {
    translationHelpers.assertPageTitles('[data-test-id="manufacturing_apheresis_product_receipt_summary"]','h1',
      manufacturingAssertions.apheresisProductReceiptSummary.title)
    translationHelpers.assertSingleField('[data-testid="progress-receive_materials-name"]',
      manufacturingAssertions.apheresisProductReceiptSummary.phaseName)
    translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',0,
      'h3', manufacturingAssertions.apheresisProductReceiptSummary.bagScan,0);
    translationHelpers.assertSectionChildElement('[data-test-id="shipping-checklist-summary-block-block"]',0,
      'h3', manufacturingAssertions.apheresisProductReceiptSummary.materialConditionDetails,0);
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the collection bag in expected good condition?"]',
      manufacturingAssertions.apheresisProductReceiptSummary.collectionBagConditionUs)
    }
    inputChecker.explicitWait('[data-test-id="manufacturing_apheresis_product_receipt_summary"]');
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  manufacturingStart: () => {
    cy.log('Manufacturing Start');
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_manufacturing_start"]','h1',
        manufacturingAssertions.manufacturingStart.title)
      translationHelpers.assertSingleField('[data-testid="progress-manufacture_product-name"]',
        manufacturingAssertions.manufacturingStart.phaseName)
      translationHelpers.assertSingleField('[data-testid="section-heading-title"]',
        manufacturingAssertions.manufacturingStart.header)
      translationHelpers.assertSingleField('[data-testid="MaterialDateControl-Label-#/properties/date"]',
        manufacturingAssertions.manufacturingStart.mfgDate)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-The manufacturing process of CD30.CAR-T Product has started."]',
        manufacturingAssertions.manufacturingStart.description)
      }
    inputChecker.explicitWait('[data-test-id="manufacturing_manufacturing_start"]');  
    inputHelpers.inputDateField('input[id="#/properties/date-input"]',
      inputs.manufacturing.global.mfgStartDate)
    inputHelpers.clicker('[id="#/properties/is_confirmed"]')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  harvestingUs: (pastDate, futureDate) => {
    cy.log('Harvesting');
    if (Cypress.env('runWithHelpers')) {
    translationHelpers.assertPageTitles('[data-test-id="manufacturing_harvesting"]','h1',
      manufacturingAssertionsUs.harvesting.title)
    translationHelpers.assertSingleField('[data-testid="progress-manufacture_product-name"]',
      manufacturingAssertionsUs.harvesting.phaseName)
    }
    inputChecker.explicitWait('[data-test-id="manufacturing_harvesting"]');
    inputHelpers.dropDownSelect('select[id="#/properties/custom_fields/properties/harvesting_total_volume"]', 0,
      inputs.manufacturing.us.optionOnePerBag)
    inputHelpers.inputDateField('input[id="#/properties/custom_fields/properties/harvest_start_date-input"]',
      pastDate)
    inputHelpers.inputDateField('input[id="#/properties/custom_fields/properties/harvest_end_date-input"]',
      futureDate)
    inputHelpers.dropDownSelect('select[id="#/properties/custom_fields/properties/harvesting_contents"]', 0,
      inputs.manufacturing.us.optionTwoCarPositiveViableTCells)
    if (Cypress.env('runWithHelpers')) {
    translationHelpers.assertSingleField('[data-testid="section-heading-title"]',
      manufacturingAssertionsUs.harvesting.headerFirst)
    translationHelpers.assertSingleField('[data-testid="section-heading-description"]',
      manufacturingAssertionsUs.harvesting.headerFirstDescription)
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',0,'div',
      manufacturingAssertionsUs.harvesting.textBagType50,0)
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',1,'div',
      manufacturingAssertionsUs.harvesting.textTotalVolume1030,0)
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',2,'div',
      manufacturingAssertionsUs.harvesting.text1E8Tcells,0)
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',4,'div',
      manufacturingAssertionsUs.harvesting.textBagType250,0)
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',5,'div',
      manufacturingAssertionsUs.harvesting.textTotalVolume3070,0)
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',6,'div',
      manufacturingAssertionsUs.harvesting.text3E8Tcells,0)
    translationHelpers.assertChildElement('[id="#/properties/custom_fields/properties/harvesting_total_volume"]', 'label',
      manufacturingAssertionsUs.harvesting.titleTotalVolume);
    translationHelpers.assertChildElement('[id="#/properties/custom_fields/properties/harvesting_contents"]', 'label',
      manufacturingAssertionsUs.harvesting.titleContents);
    translationHelpers.assertSingleField('[data-testid="MaterialDateControl-Label-#/properties/custom_fields/properties/harvest_start_date"]',
      manufacturingAssertionsUs.harvesting.titleHarvestStartDate)
    translationHelpers.assertSingleField('[data-testid="MaterialDateControl-Label-#/properties/custom_fields/properties/harvest_end_date"]',
      manufacturingAssertionsUs.harvesting.titleHarvestEndDate)
    }
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  printFpBagLabels: () => {
    cy.log('Print Finished Product Bag Labels');
    if (Cypress.env('runWithHelpers')) {
    translationHelpers.assertPageTitles('[data-test-id="manufacturing_print_fp_bag_labels"]','h1',
      manufacturingAssertions.printFpBagLabels.title)
    translationHelpers.assertSingleField('[data-testid="progress-print_labels-name"]',
      manufacturingAssertions.printFpBagLabels.phaseName);
    }
    inputChecker.explicitWait('[data-test-id="manufacturing_print_fp_bag_labels"]');
    inputHelpers.clicker('[data-testid="btn-print"]')
    inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]')
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertSingleField('[data-testid="banner-message-0"]',
        manufacturingAssertions.printFpBagLabels.successMessage),
      translationHelpers.assertSingleFieldWithContains('Print Finished Product labels',
        manufacturingAssertions.printFpBagLabels.printButtonDescription)
      translationHelpers.assertSectionChildElement('[data-testid="print-counter-block"]',0,'b',
        manufacturingAssertions.printFpBagLabels.labelText,0)
      translationHelpers.assertSingleFieldWithContains('Print Labels',
        manufacturingAssertions.printFpBagLabels.printButtonLabel)
      translationHelpers.assertSectionChildElement('[data-test-id="print-block-block"] >>>> div',
        0, 'span', manufacturingAssertions.printFpBagLabels.printButtonLabel, 0)
      translationHelpers.assertSingleFieldWithContains('Confirm that the expected bag labels printed correctly and are legible.',
        manufacturingAssertions.printFpBagLabels.checkboxDescription)
      translationHelpers.assertSingleFieldWithContains('Yes',
        manufacturingAssertions.printFpBagLabels.checkBoxLabel);
      }
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  confirmNumberOfBags: () => {
    cy.log('Confirm Number of Bags');
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_confirm_number_of_bags"]','h1',
        manufacturingAssertions.confirmNumberOfBags.title)
      translationHelpers.assertSingleField('[data-testid="progress-manufacture_complete-name"]',
        manufacturingAssertions.confirmNumberOfBags.phaseName)
      translationHelpers.assertSingleField('[data-testid="section-heading-title"]',
        manufacturingAssertions.confirmNumberOfBags.header)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-How many bags resulted from today\'s manufacturing process?"]',
        manufacturingAssertions.confirmNumberOfBags.bagCount)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Apply Labels to Bags and Cassettes"]',
        manufacturingAssertions.confirmNumberOfBags.checkbox)
      }
    inputChecker.explicitWait('[data-test-id="manufacturing_confirm_number_of_bags"]');  
    inputHelpers.inputSingleField('[id="#/properties/item_count-input"]',
      inputs.manufacturing.global.mfgBagCount)
    inputHelpers.clicker('[id="#/properties/data/properties/consent_received"]')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },
  confirmNumberOfBagsGeneral: () => {
    cy.log('Confirm Number of Bags');
    
    inputHelpers.inputSingleField('[id="#/properties/item_count-input"]',
      3)
    inputHelpers.clicker('[id="#/properties/data/properties/consent_received"]')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  manufacturingSummaryUs: () => {
    cy.log('Manufacturing Summary');
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_manufacturing_summary"]','h1',
        manufacturingAssertions.manufacturingSummary.title)
      translationHelpers.assertSingleField('[data-testid="progress-manufacture_complete-name"]',
        manufacturingAssertions.manufacturingSummary.phaseName)
      translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]', 0, 'h3',
        manufacturingAssertions.manufacturingSummary.headingSubjectInformation)
      translationHelpers.assertSectionChildElement('[data-test-id="step-header-block"]', 0, 'h3',
        manufacturingAssertions.manufacturingSummary.headingManufacturingStart)
      translationHelpers.assertSectionChildElement('[data-test-id="shipping-checklist-summary-block-block"]', 0, 'h3',
        manufacturingAssertions.manufacturingSummary.headingHarvesting)
      translationHelpers.assertSectionChildElement('[data-test-id="step-header-block"]', 1, 'h3',
        manufacturingAssertions.manufacturingSummary.headingPrint)
      translationHelpers.assertSectionChildElement('[data-test-id="shipping-checklist-summary-block-block"]', 1, 'h3',
        manufacturingAssertions.manufacturingSummary.headingConfirmBags)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'div',
        manufacturingAssertions.manufacturingSummary.subjectId,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'div',
        manufacturingAssertions.manufacturingSummary.apheresisId);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'div',
        manufacturingAssertions.manufacturingSummary.manufacturingStart);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'div',
        manufacturingAssertions.manufacturingSummary.manufacturingProcess);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'div',
        manufacturingAssertions.manufacturingSummary.totalVolume);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 5, 'div',
        manufacturingAssertions.manufacturingSummary.contents);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 6, 'div',
        manufacturingAssertions.manufacturingSummary.manufacturedOn);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 7, 'div',
        manufacturingAssertions.manufacturingSummary.expiration);
      translationHelpers.assertSectionChildElement('[data-test-id="checkbox-block-block"]', 0, 'p',
        manufacturingAssertions.manufacturingSummary.confirmBags);
      translationHelpers.assertSectionChildElement('[data-test-id="checkbox-block-block"]', 1, 'p',
        manufacturingAssertions.manufacturingSummary.applyBags);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',9,
        'div',manufacturingAssertions.manufacturingSummary.howManyBags,0)
      }
    inputChecker.explicitWait('[data-test-id="manufacturing_manufacturing_summary"]');  
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  qaRelease: () => {
    cy.log('QA Release');
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_qa_release"]','h1',
        manufacturingAssertionsUs.qaRelease.title)
      translationHelpers.assertSingleField('[data-testid="progress-qa_release-name"]',
        manufacturingAssertionsUs.qaRelease.phaseName)
      cy.get('[data-test-id="section-heading-block-block"]').eq(0).find('h3').eq(0).invoke('text')
        .should('equal', manufacturingAssertionsUs.qaRelease.headerFirst),
      translationHelpers.assertChildElement('[data-test-id="upload-files-block"]', 'p',
        manufacturingAssertionsUs.qaRelease.uploadText)
    }
    inputChecker.explicitWait('[data-test-id="manufacturing_qa_release"]'); 
    documentUploadHelper.multipleDocumentsUpload(['validpdf.pdf'], {
      encoding: 'base64',
      selector: '.btn-file-input input',
      type: 'application/pdf',
      inputType: 'input',
    });

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  sponserReleaseUs: () => {
    cy.log('Sponsor Release');
    cy.wait(2000);
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_sponser_release"]','h1',
        manufacturingAssertions.sponserRelease.title)
      translationHelpers.assertSingleField('[data-testid="progress-sponser_release-name"]',
        manufacturingAssertions.sponserRelease.phaseName)
      }
    inputChecker.explicitWait('[data-test-id="manufacturing_sponser_release"]');  
    documentUploadHelper.multipleDocumentsUpload(['validpdf.pdf'], {
      encoding: 'base64',
      selector: '.btn-file-input input',
      type: 'application/pdf',
      inputType: 'input',
    });
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',0,'h3',
        manufacturingAssertions.sponserRelease.reviewQa)
      translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',1,'h3',
        manufacturingAssertions.sponserRelease.upload)
      translationHelpers.assertSectionChildElement('[data-test-id="page-title-block-block"]',1,
          'h6',manufacturingAssertions.sponserRelease.qaConditional,0)   
      translationHelpers.assertSectionChildElement('[data-test-id="upload-files-block"]',1,
        'p',manufacturingAssertions.sponserRelease.uploadText)
    }

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures', '@postDocuments']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  sponserReleaseSummary: () => {
    cy.log('Sponsor Release Summary');
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_sponser_release_summary"]','h1',
        manufacturingAssertions.sponserReleaseSummary.title)
      translationHelpers.assertSingleField('[data-testid="progress-sponser_release-name"]',
        manufacturingAssertions.sponserReleaseSummary.phaseName)
      translationHelpers.assertChildElement('[data-test-id="view-document-block"]', 'p',
        manufacturingAssertions.sponserReleaseSummary.summaryText)
    }
    inputChecker.explicitWait('[data-test-id="manufacturing_sponser_release_summary"]'); 
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  selectBagsToBeShipped: () => {
    cy.log('Select Bags to be Shipped');
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_select_bags_to_be_shipped"]','h1',
        manufacturingAssertions.selectBagsToBeShipped.title)
      translationHelpers.assertSingleField('[data-testid="progress-ship_product-name"]',
        manufacturingAssertions.selectBagsToBeShipped.phaseName)
      translationHelpers.assertSingleField('[data-testid="section-heading-description"]',
        manufacturingAssertions.selectBagsToBeShipped.headerDescription)
    };
    inputChecker.explicitWait('[data-test-id="manufacturing_select_bags_to_be_shipped"]');
    inputHelpers.clicker('[data-testid="pass-button-0"]')
    inputHelpers.clicker('[data-testid="fail-button-1"]')
    inputHelpers.clicker('[data-testid="pass-button-2"]')
    inputHelpers.clicker('[data-testid="fail-button-3"]')

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },


  shippingChecklist: (scope) => {
    cy.log('Shipping Checklist');
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_shipping_checklist"]','h1',
        manufacturingAssertions.shippingChecklist.title)
      translationHelpers.assertSingleField('[data-testid="progress-ship_product-name"]',
        manufacturingAssertions.shippingChecklist.phaseName);
    }
    inputChecker.explicitWait('[data-test-id="manufacturing_shipping_checklist"]');
    cy.get(`@coi`).then(coi =>{
      inputHelpers.scanAndVerifyBags('bag-identifier-1', coi+'-FP-01')
    });
    cy.get(`@coi`).then(coi =>{
      inputHelpers.scanAndVerifyBags('bag-identifier-3', coi+'-FP-03')
    });
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/manufacturing_awb-input"]',
      inputs.manufacturing.us.manufacturingAwb)
    inputHelpers.clicker('[data-testid="pass-button-attach_shipping_labels_to_shipper"]')
    inputHelpers.clicker('[data-testid="pass-button-load_fp_into_shipper"]')
    inputHelpers.clicker('[data-testid="pass-button-summary_documents_in_shipper"]')
    inputHelpers.clicker('[data-testid="pass-button-manufacturing_shipper_sealed"]')

    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',0,
        'h3',manufacturingAssertions.shippingChecklist.bagScanHeader,0)
      translationHelpers.assertSingleField('[data-testid="question-text-attach_shipping_labels_to_shipper"]',
        manufacturingAssertions.shippingChecklist.attachShippingLabels)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Scan or enter the Air Waybill number on the shipping labels"]',
        manufacturingAssertions.shippingChecklist.awbNumber)
      translationHelpers.assertSingleField('[data-testid="question-text-load_fp_into_shipper"]',
        manufacturingAssertions.shippingChecklist.fpIntoIhipper);
      translationHelpers.assertSectionChildElement('[data-test-id="view-document-block"]',0,'p',
        manufacturingAssertions.shippingChecklist.printManufaturingSummary,0);
      translationHelpers.assertSingleField('[data-testid="question-text-summary_documents_in_shipper"]',
        manufacturingAssertions.shippingChecklist.packShipperToggleTwo);
      translationHelpers.assertSingleField('[data-testid="question-text-manufacturing_shipper_sealed"]',
        manufacturingAssertions.shippingChecklist.shipperSealed);
      translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',1,
        'h3',manufacturingAssertions.shippingChecklist.shippingLabelHeader,0);
      translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',2,
        'h3',manufacturingAssertions.shippingChecklist.packShipperHeader,0);
      translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',3,
        'h3',manufacturingAssertions.shippingChecklist.sealShipperHeader,0);
      }
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  
  shippingSummary: () => {
    cy.log('Shipping Summary');
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_shipping_summary"]','h1',
        manufacturingAssertions.shippingSummary.title)
      translationHelpers.assertSingleField('[data-testid="progress-ship_product-name"]',
        manufacturingAssertions.shippingSummary.phaseName)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Attach shipping labels to shipper."]',
        manufacturingAssertions.shippingSummary.attachLabels);
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Scan or enter the Air Waybill number on the shipping labels"]',
        manufacturingAssertions.shippingSummary.awbNumber)
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>div',manufacturingAssertions.shippingSummary.additionalComments,4)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Pack and load the finished product into the shipper according to the instructions provided."]',
        manufacturingAssertions.shippingSummary.packLoadFp)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Place summary documents in the shipper."]',
        manufacturingAssertions.shippingSummary.summaryDocuments)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Shipper has been sealed."]',
        manufacturingAssertions.shippingSummary.shipperSealed)
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>div',manufacturingAssertions.shippingSummary.additionalComments,12)
      }
    inputChecker.explicitWait('[data-test-id="manufacturing_shipping_summary"]');
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  selectBagsToBeShippedLoop: () => {
    cy.log('Select Bags to be Shipped Loop');
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_select_bags_to_be_shipped"]','h1',
        manufacturingAssertions.selectBagsToBeShipped.title)
    }
    inputHelpers.clicker('[data-testid="pass-button-0"]')
    inputHelpers.clicker('[data-testid="pass-button-1"]')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  shippingChecklistLoop: (scope) => {
    cy.log('Shipping Checklist Loop');
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_shipping_checklist"]','h1',
        manufacturingAssertions.shippingChecklist.title)
    }
    cy.get(`@coi`).then(coi =>{
      inputHelpers.scanAndVerifyBags('bag-identifier-2', coi+'-FP-02')
    });
    cy.get(`@coi`).then(coi =>{
      inputHelpers.scanAndVerifyBags('bag-identifier-4', coi+'-FP-04')
    });
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/manufacturing_awb-input"]',
      inputs.manufacturing.us.manufacturingAwbLoop)
    inputHelpers.clicker('[data-testid="pass-button-attach_shipping_labels_to_shipper"]')
    inputHelpers.clicker('[data-testid="pass-button-load_fp_into_shipper"]')
    inputHelpers.clicker('[data-testid="pass-button-summary_documents_in_shipper"]')
    inputHelpers.clicker('[data-testid="pass-button-manufacturing_shipper_sealed"]')

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  shippingSummaryLoop: () => {
    cy.log('Shipping Summary Loop');
    if (Cypress.env('runWithHelpers')) {
    translationHelpers.assertPageTitles('[data-test-id="manufacturing_shipping_summary"]','h1',
      manufacturingAssertions.shippingSummary.title)
    }
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  }
}
