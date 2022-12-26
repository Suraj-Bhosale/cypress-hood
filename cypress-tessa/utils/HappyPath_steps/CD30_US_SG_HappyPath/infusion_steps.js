import actionButtonsHelper from '../../../utils/shared_block_helpers/actionButtonHelpers';
import signatureHelpers from '../../../utils/shared_block_helpers/signatureHelpers';
import inputHelpers from '../../../utils/shared_block_helpers/inputFieldHelpers';
import inputChecker from '../../shared_block_helpers/inputFieldCheckHelpers';
import infusionAssertions from '../../../fixtures/infusionAssertions.json';
import translationHelpers from "../../../utils/shared_block_helpers/translationHelpers";
import inputs from '../../../fixtures/inputs.json';

export default {
  infusionAliases: () => {
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

  
  shipmentReceiptChecklist: () => {
    cy.log('Shipment Receipt Checklist');
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertPageTitles('[data-test-id="infusion_shipment_receipt_checklist"]','h1',
        infusionAssertions.shipmentReceiptChecklist.title)
      translationHelpers.assertSingleField('[data-testid="progress-receive_product-name"]',
        infusionAssertions.shipmentReceiptChecklist.phaseName);
      translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]',
        infusionAssertions.shipmentReceiptChecklist.shippingLabel,0)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Scan or enter the Air Waybill Number on the shipping label."]',
        infusionAssertions.shipmentReceiptChecklist.awbNumber)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Expected Air Waybill Number"]',
        infusionAssertions.shipmentReceiptChecklist.expectedAwb);
      translationHelpers.assertSingleField('[data-testid="question-text-manufacturing_awb_match"]',
        infusionAssertions.shipmentReceiptChecklist.manufacturingAwbNotMatch)
      translationHelpers.assertBlockLabelWithIndex('[data-test-id="shipping-checklist-block-block"]>>>>label',
      infusionAssertions.shipmentReceiptChecklist.rationalResponse,0)
      translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]',
        infusionAssertions.shipmentReceiptChecklist.sectionCondition,1)  
      translationHelpers.assertSingleField('[data-testid="question-text-shipping_intact"]',
        infusionAssertions.shipmentReceiptChecklist.shippingIntact)
      translationHelpers.assertSingleField('[data-testid="question-text-seal_intact"]',
        infusionAssertions.shipmentReceiptChecklist.sealIntact)
      }
    inputChecker.explicitWait('[data-test-id="infusion_shipment_receipt_checklist"]');
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/manufacturing_receipt_awb-input"]',
      inputs.infusion.global.mfgWrongAwb)
    inputHelpers.clicker('[data-testid="fail-button-manufacturing_awb_match"]')
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/manufacturing_awb_not_match_reason-input"]',
      inputs.infusion.global.mfgWrongAwbReason)
    inputHelpers.clicker('[data-testid="pass-button-shipping_intact"]')
    inputHelpers.clicker('[data-testid="pass-button-seal_intact"]')

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  shipmentReceiptChecklistEu: () => {
    cy.log('Shipment Receipt Checklist');
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertPageTitles('[data-test-id="infusion_shipment_receipt_checklist"]','h1',
        infusionAssertions.shipmentReceiptChecklist.title)
      translationHelpers.assertSingleField('[data-testid="progress-receive_product-name"]',
        infusionAssertions.shipmentReceiptChecklist.phaseName);
      }
    inputChecker.explicitWait('[data-test-id="infusion_shipment_receipt_checklist"]');  
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/manufacturing_receipt_awb-input"]',
      inputs.infusion.global.mfgWrongAwb)
    inputHelpers.clicker('[data-testid="fail-button-manufacturing_awb_match"]')
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/manufacturing_awb_not_match_reason-input"]',
      inputs.infusion.global.mfgWrongAwbReason)
    inputHelpers.clicker('[data-testid="pass-button-shipping_intact"]')
    inputHelpers.clicker('[data-testid="pass-button-seal_intact"]')

    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertSingleField('[data-testid="question-text-manufacturing_awb_match"]',
        infusionAssertions.shipmentReceiptChecklist.manufacturingAwbNotMatch)
      cy.get('[id="#/properties/shipping_receipt_checklist/properties/manufacturing_awb_not_match_reason"]')
        .invoke('text').should('equal', infusionAssertions.shipmentReceiptChecklist.rationalResponse)
      translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]',
        infusionAssertions.shipmentReceiptChecklist.shippingLabel,0)
      translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]',
        infusionAssertions.shipmentReceiptChecklist.sectionCondition,1)  
      translationHelpers.assertSingleField('[data-testid="question-text-shipping_intact"]',
        infusionAssertions.shipmentReceiptChecklist.shippingIntact)
      translationHelpers.assertSingleField('[data-testid="question-text-seal_intact"]',
        infusionAssertions.shipmentReceiptChecklist.sealIntact)
      cy.get('[id="#/properties/shipping_receipt_checklist/properties/manufacturing_awb_not_match_reason"]')
        .invoke('text').should('equal', infusionAssertions.shipmentReceiptChecklist.rationalResponse)
      }
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  shipmentReceiptSummary: () => {
    cy.log('Shipment Receipt Summary');
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertPageTitles('[data-test-id="infusion_shipment_receipt_summary"]','h1',
        infusionAssertions.shipmentReceiptSummary.title)
      translationHelpers.assertSingleField('[data-testid="progress-receive_product-name"]',
        infusionAssertions.shipmentReceiptSummary.phaseName);
      translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]',
        infusionAssertions.shipmentReceiptSummary.sectionChecklist,0)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Scan or enter the Air Waybill Number on the shipping label."]',
        infusionAssertions.shipmentReceiptSummary.manufacturingAwb)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Expected Air Waybill Number"]',
        infusionAssertions.shipmentReceiptSummary.expectedAwb);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',2,'div',
        infusionAssertions.shipmentReceiptSummary.awbNumber,0)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',3,'div',
        infusionAssertions.shipmentReceiptSummary.rationalResponse,0)
      translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]',
        infusionAssertions.shipmentReceiptSummary.sectionCondition,1)  
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the shipping container in good intact condition?"]',
        infusionAssertions.shipmentReceiptSummary.shippingIntact)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the seal on the shipper intact?"]',
        infusionAssertions.shipmentReceiptSummary.sealIntact)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Additional Comments (Optional)"]',
        infusionAssertions.shipmentReceiptSummary.additionalComments)
      translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]',
        infusionAssertions.shipmentReceiptSummary.review,2)
      }
    inputChecker.explicitWait('[data-test-id="infusion_shipment_receipt_summary"]');   
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  shipmentReceiptSummaryEu: () => {
    cy.log('Shipment Receipt Summary');
    if (Cypress.env('runWithHelpers')) {
    translationHelpers.assertPageTitles('[data-test-id="infusion_shipment_receipt_summary"]','h1',
      infusionAssertions.shipmentReceiptSummary.title)
    translationHelpers.assertSingleField('[data-testid="progress-receive_product-name"]',
      infusionAssertions.shipmentReceiptSummary.phaseName);
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]',
      infusionAssertions.shipmentReceiptSummary.sectionChecklist,0)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]',
      infusionAssertions.shipmentReceiptSummary.sectionCondition,1)  
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the shipping container in good intact condition?"]',
      infusionAssertions.shipmentReceiptSummary.shippingIntact)
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the seal on the shipper intact?"]',
      infusionAssertions.shipmentReceiptSummary.sealIntact)
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Additional Comments (Optional)"]',
      infusionAssertions.shipmentReceiptSummary.additionalComments)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]',
      infusionAssertions.shipmentReceiptSummary.review,2)
    }
    inputChecker.explicitWait('[data-test-id="infusion_shipment_receipt_summary"]'); 
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  finishedProductReceiptChecklist: (scope) => {
    cy.log('Finished Product Receipt Checklist');
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertPageTitles('[data-test-id="infusion_finished_product_receipt_checklist"]','h1',
        infusionAssertions.finishedProductReceiptChecklist.title)
      translationHelpers.assertSingleField('[data-testid="progress-receive_product-name"]',
        infusionAssertions.finishedProductReceiptChecklist.phaseName);
    }
    inputChecker.explicitWait('[data-test-id="infusion_finished_product_receipt_checklist"]'); 
    cy.get(`@coi`).then(coi =>{
      inputHelpers.scanAndVerifyBags('bag-identifier-1', coi+'-FP-01')
    });
    cy.get(`@coi`).then(coi =>{
      inputHelpers.scanAndVerifyBags('bag-identifier-3', coi+'-FP-03')
    });
    inputHelpers.clicker('[data-testid="pass-button-temp_data_conform"]')
    inputHelpers.clicker('[data-testid="pass-button-fp_condition"]')
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/fp_receipt_comment-input"]',
      inputs.infusion.global.addFpComment)
    if (Cypress.env('runWithHelpers')) {
      cy.get('[data-test-id="multiple-scan-block-block"]').first().invoke('text')
        .should('contain', infusionAssertions.finishedProductReceiptChecklist.scanBag1)
      cy.get('[data-test-id="multiple-scan-block-block"]').first().invoke('text')
        .should('contain', infusionAssertions.finishedProductReceiptChecklist.scanBag3)
      translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',
        0,'h3',infusionAssertions.finishedProductReceiptChecklist.bagScan,0)
      translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',
        1,'h3',infusionAssertions.finishedProductReceiptChecklist.condition,0);
      translationHelpers.assertSingleField('[data-testid="question-text-temp_data_conform"]',
        infusionAssertions.finishedProductReceiptChecklist.temperatureDataConformation);
      translationHelpers.assertSingleField('[data-testid="question-text-fp_condition"]',
        infusionAssertions.finishedProductReceiptChecklist.fpBagCondition);
    }

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  finishedProductReceiptSummary: () => {
    cy.log('Finished Product Receipt Summary');
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertPageTitles('[data-test-id="infusion_finished_product_receipt_summary"]','h1',
        infusionAssertions.finishedProductReceiptSummary.title)
      translationHelpers.assertSingleField('[data-testid="progress-receive_product-name"]',
        infusionAssertions.finishedProductReceiptChecklist.phaseName);
      cy.get('[data-test-id="multiple-scan-block-block"]').first().invoke('text')
        .should('contain', infusionAssertions.finishedProductReceiptSummary.scanBag1)
      cy.get('[data-test-id="multiple-scan-block-block"]').first().invoke('text')
        .should('contain', infusionAssertions.finishedProductReceiptSummary.scanBag3)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Does the temperature data conform to standards?"]',
        infusionAssertions.finishedProductReceiptSummary.tempData)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the finished product bag in expected good condition?"]',
         infusionAssertions.finishedProductReceiptSummary.expectedGoodCond)  
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Additional Comments (Optional)"]',
        infusionAssertions.finishedProductReceiptSummary.addData)
      translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',1,'h3',
        infusionAssertions.finishedProductReceiptSummary.review,0)
      }
    inputChecker.explicitWait('[data-test-id="infusion_finished_product_receipt_summary"]');    
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  sponsorReleaseDocuments: () => {
    cy.log('Sponsor Release Documents');
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertPageTitles('[data-test-id="infusion_sponsor_release_documents"]','h1',
        infusionAssertions.sponsorReleaseDocuments.title)
      translationHelpers.assertSingleField('[data-testid="progress-sponsor_release-name"]',
        infusionAssertions.sponsorReleaseDocuments.phase);
      translationHelpers.assertSectionChildElement('[data-test-id="page-title-block-block"]',0,'h6',
        infusionAssertions.sponsorReleaseDocuments.headerOne,0)
      translationHelpers.assertSectionChildElement('[data-test-id="page-title-block-block"]',1,'h6',
        infusionAssertions.sponsorReleaseDocuments.releaseDoc,0)
      translationHelpers.assertSectionChildElement('[data-test-id="page-title-block-block"]',2,'h6',
        infusionAssertions.sponsorReleaseDocuments.headerTwo,0)
      translationHelpers.assertSectionChildElement('[data-test-id="view-document-block"]',0,'p',
        infusionAssertions.sponsorReleaseDocuments.headerThree,0)
    }
    inputChecker.explicitWait('[data-test-id="infusion_sponsor_release_documents"]'); 
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  shipmentReceiptChecklistLoop: () => {
    cy.log('Shipment Receipt Checklist Loop');
    if (Cypress.env('runWithHelpers')) {
    translationHelpers.assertPageTitles('[data-test-id="infusion_shipment_receipt_checklist"]','h1',
      infusionAssertions.shipmentReceiptChecklist.title)
    }
    inputChecker.explicitWait('[data-test-id="infusion_shipment_receipt_checklist"]');
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/manufacturing_receipt_awb-input"]',
      inputs.infusion.global.mfgWrongAwb)
    inputHelpers.clicker('[data-testid="fail-button-manufacturing_awb_match"]')
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/manufacturing_awb_not_match_reason-input"]',
      inputs.infusion.global.mfgWrongAwbReason)
    inputHelpers.clicker('[data-testid="pass-button-shipping_intact"]')
    inputHelpers.clicker('[data-testid="pass-button-seal_intact"]')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  shipmentReceiptChecklistLoopEu: () => {
    cy.log('Shipment Receipt Checklist Loop');
    if (Cypress.env('runWithHelpers')) {
    translationHelpers.assertPageTitles('[data-test-id="infusion_shipment_receipt_checklist"]','h1',
      infusionAssertions.shipmentReceiptChecklist.title)
    }
    inputChecker.explicitWait('[data-test-id="infusion_shipment_receipt_checklist"]');
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/manufacturing_receipt_awb-input"]',
      inputs.infusion.global.mfgWrongAwb)
    inputHelpers.clicker('[data-testid="fail-button-manufacturing_awb_match"]')
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/manufacturing_awb_not_match_reason-input"]',
      inputs.infusion.global.mfgWrongAwbReason)
    inputHelpers.clicker('[data-testid="pass-button-shipping_intact"]')
    inputHelpers.clicker('[data-testid="pass-button-seal_intact"]')

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  shipmentReceiptSummaryLoop: () => {
    cy.log('Shipment Receipt Summary Loop');
    if (Cypress.env('runWithHelpers')) {
    translationHelpers.assertPageTitles('[data-test-id="infusion_shipment_receipt_summary"]','h1',
      infusionAssertions.shipmentReceiptSummary.title)
    }
    inputChecker.explicitWait('[data-test-id="infusion_shipment_receipt_summary"]');
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  shipmentReceiptSummaryLoopEu: () => {
    cy.log('Shipment Receipt Summary Loop');
    if (Cypress.env('runWithHelpers')) {
    translationHelpers.assertPageTitles('[data-test-id="infusion_shipment_receipt_summary"]','h1',
      infusionAssertions.shipmentReceiptSummary.title)
    }
    inputChecker.explicitWait('[data-test-id="infusion_shipment_receipt_summary"]');
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  finishedProductReceiptChecklistLoop: (scope) => {
    cy.log('Finished Product Receipt Checklist Loop');
    inputChecker.explicitWait('[data-test-id="infusion_finished_product_receipt_checklist"]');
    translationHelpers.assertPageTitles('[data-test-id="infusion_finished_product_receipt_checklist"]','h1',
      infusionAssertions.finishedProductReceiptChecklist.title)
    cy.get(`@coi`).then(coi =>{
      inputHelpers.scanAndVerifyBags('bag-identifier-2', coi+'-FP-02')
    });
    cy.get(`@coi`).then(coi =>{
      inputHelpers.scanAndVerifyBags('bag-identifier-4', coi+'-FP-04')
    });
    inputHelpers.clicker('[data-testid="pass-button-temp_data_conform"]')
    inputHelpers.clicker('[data-testid="pass-button-fp_condition"]')
    cy.get('[data-test-id="multiple-scan-block-block"]').first().invoke('text')
      .should('contain', infusionAssertions.finishedProductReceiptChecklist.scanBag2)
    cy.get('[data-test-id="multiple-scan-block-block"]').first().invoke('text')
      .should('contain', infusionAssertions.finishedProductReceiptChecklist.scanBag4)

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  finishedProductReceiptSummaryLoop: () => {
    cy.log('Finished Product Receipt Summary');
    if (Cypress.env('runWithHelpers')) {
    translationHelpers.assertPageTitles('[data-test-id="infusion_finished_product_receipt_summary"]','h1',
      infusionAssertions.finishedProductReceiptSummary.title)
    cy.get('[data-test-id="multiple-scan-block-block"]').first().invoke('text')
      .should('contain', infusionAssertions.finishedProductReceiptSummary.scanBag2)
   
    cy.get('[data-test-id="multiple-scan-block-block"]').first().invoke('text')
      .should('contain', infusionAssertions.finishedProductReceiptSummary.scanBag4)
    }
    inputChecker.explicitWait('[data-test-id="infusion_finished_product_receipt_summary"]');
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
       apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  sponsorReleaseDocumentsLoop: () => {
    cy.log('Sponsor Release Documents Loop');
    if (Cypress.env('runWithHelpers')) {

    translationHelpers.assertPageTitles('[data-test-id="infusion_sponsor_release_documents"]','h1',
      infusionAssertions.sponsorReleaseDocuments.title)
    }
    inputChecker.explicitWait('[data-test-id="infusion_sponsor_release_documents"]');
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    })
  }
}
