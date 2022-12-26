//import {singleSignature, ClickPrimaryActionButton,doubleSignature} from '../support/index.js';
import common from '../../../support/index.js';
import inputs from "../../../fixtures/inputs";
import dayjs from 'dayjs';
import translationHelpers from "../../shared_block_helpers/translationHelpers";
import manufacturingCiltaAssertion from '../../../fixtures/manufacturingCilta_assertion.json';
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers';
import signatureHelpers from '../../shared_block_helpers/signatureHelpers';
import therapy from '../../../fixtures/therapy.json'
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers.js';



const verifier = 'quela@vineti.com';
const date = dayjs()
  .add(1, 'month')
  .add(0, 'days')
  .format('DD-MMM-YYYY');

const getManufAirWayBill = (scope, shippingRow) => {
  common.loginAs('oliver');
  cy.visit('/ordering');
  cy.get('td[data-testid="patient-identifier"]')
    .contains(scope.patientInformation.patientId)
    .click();
  cy.get('[data-testid="td-stage-plane-icon"]').eq(shippingRow).parent().parent().parent().find('[data-testid="td-stage-site-details"]')
    .invoke('text')
    .then((text) => {
      scope.airWayBill = text.substring(9, text.length)
      common.loginAs('steph');
      cy.visit('/manufacturing');
      cy.get(`tr[data-testid="manufacturing-${scope.coi}"]`).click();
      cy.get('[data-testid="manufacturing-airway-bill-input-field"]').type(scope.airWayBill);
      cy.get('[data-testid="manufacturing-airway-bill-action-trigger-button"]').click();
      cy.wait('@labelVerifications');
      cy.log('manufacturingAirwayBill', scope.airWayBill)
    });
}

const actionButtonsTranslectionCheck = (
  primaryBtnlabel = actionButtonsHelper.translationKeys.NEXT,
  secondaryBtnLabel = actionButtonsHelper.translationKeys.SAVE_AND_CLOSE
) => {

  actionButtonsHelper.checkActionButtonLabel(actionButtonsHelper.actionButtonKeys.PRIMARY, primaryBtnlabel)
  actionButtonsHelper.checkActionButtonLabel(actionButtonsHelper.actionButtonKeys.SECONDARY, secondaryBtnLabel)
}
const manufacturingCiltaHeaderTranslations = () => {

  translationHelpers.assertSingleField('[data-testid="patientInformationHeader.coi"]',
    manufacturingCiltaAssertion.header.coi)

  translationHelpers.assertSingleField('[data-testid="patientInformationHeader.patient_id"]',
    manufacturingCiltaAssertion.header.orderId)

  translationHelpers.assertSingleField('[data-testid="patientInformationHeader.lot_number"]',
    manufacturingCiltaAssertion.header.lotNumber)

  translationHelpers.assertSingleField('[data-testid="patientInformationHeader.product"]',
    manufacturingCiltaAssertion.header.product)

}
const manufacturingCiltaPhaseTranslations = (therapy) => {

  translationHelpers.assertSingleField('[data-testid=progress-collection_summary-name]',
    manufacturingCiltaAssertion.phase.collectionSummary)

  translationHelpers.assertSingleField('[data-testid=progress-shipping_receipt-name]',
    manufacturingCiltaAssertion.phase.shippingReceipt)

  translationHelpers.assertSingleField('[data-testid=progress-storage-name]',
    manufacturingCiltaAssertion.phase.storage)

  translationHelpers.assertSingleField('[data-testid=progress-product_receipt-name]',
    manufacturingCiltaAssertion.phase.productReceipt)

  translationHelpers.assertSingleField('[data-testid=progress-manufacturing-name]',
    manufacturingCiltaAssertion.phase.manufacturing)

  translationHelpers.assertSingleField('[data-testid=progress-final_labels-name]',
    manufacturingCiltaAssertion.phase.finalLabels)

  translationHelpers.assertSingleField('[data-testid=progress-label_application-name]',
    manufacturingCiltaAssertion.phase.labelApplication)

  if (!['_emea_ccdc', '_emea_cc', '_emea_ccdc_qr', '_emea_cc_qr', '_emea_ccdc_qr'].includes(therapy.unique_id)) {

    translationHelpers.assertSingleField('[data-testid=progress-quality_approval-name]',
      manufacturingCiltaAssertion.phase.qualityApproval)
  }
  else {
    translationHelpers.assertSingleField('[data-testid=progress-release_to_ship-name]',
      manufacturingCiltaAssertion.phase.releaseShip)

  }

  translationHelpers.assertSingleField('[data-testid=progress-shipping-name]',
    manufacturingCiltaAssertion.phase.shipping)
}

export default {

  manufacturingCollectionSummary: (therapy) => {
    if (Cypress.env('runWithTranslations')) {

      manufacturingCiltaHeaderTranslations(therapy);
      manufacturingCiltaPhaseTranslations(therapy);

      //title
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_collection_status"]', 'h1',
        manufacturingCiltaAssertion.collectionStatus.title)

      //subtitle
      translationHelpers.assertSingleField('[data-testid=section-heading-title]',
        manufacturingCiltaAssertion.collectionStatus.subtitle)

      //label

        // translationHelpers.assertSingleField('[data-testid=block-itemIdentifiers] >>',
        //   manufacturingCiltaAssertion.collectionStatus.bagIdentifier)

        translationHelpers.assertBlockLabel('[data-test-id="specimen-status-block"] >>>>',
          { index: 0, label: manufacturingCiltaAssertion.collectionStatus.apheresisId })

        translationHelpers.assertBlockLabel('[data-test-id="specimen-status-block"] >>>',
          { index: 1, label: manufacturingCiltaAssertion.collectionStatus.numberOfBags })

      translationHelpers.assertBlockLabel('[data-test-id="view-document-block"] >>>>>',
        { index: 0, label: manufacturingCiltaAssertion.collectionStatus.collectionSummary })

      translationHelpers.assertBlockLabel('[data-test-id="view-document-block"] >>>>>',
        { index: 1, label: manufacturingCiltaAssertion.collectionStatus.viewDocument })

      translationHelpers.assertBlockLabel('[data-test-id="view-document-block"] >>>>>',
        { index: 2, label: manufacturingCiltaAssertion.collectionStatus.cryopreservationSummary })

      translationHelpers.assertBlockLabel('[data-test-id="view-document-block"] >>>>>',
        { index: 3, label: manufacturingCiltaAssertion.collectionStatus.viewDocument })

      translationHelpers.assertBlockLabel('[data-test-id="view-document-block"] >>>>>',
        { index: 4, label: manufacturingCiltaAssertion.collectionStatus.cryopreservationShippingSummary })

      translationHelpers.assertBlockLabel('[data-test-id="view-document-block"] >>>>>',
        { index: 5, label: manufacturingCiltaAssertion.collectionStatus.viewDocument })

      actionButtonsHelper.checkActionButtonLabel(actionButtonsHelper.actionButtonKeys.PRIMARY,
        actionButtonsHelper.translationKeys.NEXT)
    }
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
      {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
  },

  manufacturingVerifyShipper: (coi, therapy, fromSite, toSite) => {

    if (Cypress.env('runWithTranslations')) {

      //title
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_verify_shipper"]', 'h1',
        manufacturingCiltaAssertion.shippingReceipt.verifyShipper)

      //subtitle
      translationHelpers.assertSingleField('[data-testid=section-heading-title]',
        manufacturingCiltaAssertion.shippingReceipt.scanLn2)

      //label
      translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]',
        manufacturingCiltaAssertion.shippingReceipt.scanEnterCoi)

      actionButtonsHelper.checkActionButtonLabel(actionButtonsHelper.actionButtonKeys.PRIMARY,
        actionButtonsHelper.translationKeys.NEXT)

    }

    cy.get(`[data-testid="ln-2-shipper-ship-bags-${fromSite}-${toSite}-${therapy.leg_name}-input-field"]`).type(`${coi}`);
    cy.get(`[data-testid="ln-2-shipper-ship-bags-${fromSite}-${toSite}-${therapy.leg_name}-action-trigger-button"]`).click();
    cy.wait('@labelVerifications');

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
      {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
  },

  manufacturingShipmentReceiptChecklist: (evoLast4Digits, tamperSealNumber) => {
    if (Cypress.env('runWithTranslations')) {

      actionButtonsTranslectionCheck();

      //title
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_shipment_receipt_checklist"]', 'h1',
        manufacturingCiltaAssertion.shippingReceipt.shipmentReceiptChecklist)

      //subtitle
      translationHelpers.assertSingleField('[data-testid=section-heading-title]',
        manufacturingCiltaAssertion.shippingReceipt.conditionDetailsShipment)

      //labels
      translationHelpers.assertSingleField('[data-testid=section-heading-description]',
        manufacturingCiltaAssertion.shippingReceipt.completeSection)

      translationHelpers.assertSingleField('[data-testid=question-text-shipping_container_intact]',
        manufacturingCiltaAssertion.shippingReceipt.shippingContainerCase)

      translationHelpers.assertSingleField('[data-testid=question-text-zip_ties_secured_no_case]',
        manufacturingCiltaAssertion.shippingReceipt.shippingContainerSecured)

      translationHelpers.assertSingleField('[data-testid=question-text-shipper_label_placed]',
        manufacturingCiltaAssertion.shippingReceipt.packingInsertShipper)

      translationHelpers.assertSingleField('[data-testid=question-text-consignee_pouch_inside_no_kit]',
        manufacturingCiltaAssertion.shippingReceipt.consigneePouchShipper)

      translationHelpers.assertSingleField('[data-testid=question-text-red_wire_tamper_seal]',
        manufacturingCiltaAssertion.shippingReceipt.redWireTamper)

      translationHelpers.assertBlockLabel('[data-test-id="shipping-checklist-block-block"] >>>>>>',
        { index: 20, label: manufacturingCiltaAssertion.shippingReceipt.digitsOfEvo })

      translationHelpers.assertSingleField('[data-testid=question-text-evo_is_number]',
        manufacturingCiltaAssertion.shippingReceipt.airWaybillMatchEvo)

      translationHelpers.assertBlockLabel('[data-test-id="shipping-checklist-block-block"] >>>>>>',
        { index: 26, label: manufacturingCiltaAssertion.shippingReceipt.tamperSealNumber })

      translationHelpers.assertSingleField('[data-testid=question-text-tamper_seal_match]',
        manufacturingCiltaAssertion.shippingReceipt.tamperSealNumberOnAirWaybill)

      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-shipping_container_intact] >')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-zip_ties_secured_no_case] >')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-shipper_label_placed] > ')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-consignee_pouch_inside_no_kit] >')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-red_wire_tamper_seal] > ')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-evo_is_number] >')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-tamper_seal_match] >')

    }
    inputHelpers.clicker('[data-testid="pass-button-shipping_container_intact"]')
    inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured_no_case"]')
    inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]')
    inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside_no_kit"]')
    inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]')
    cy.get('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]').type(evoLast4Digits);
    inputHelpers.clicker('[data-testid="pass-button-evo_is_number"]')
    cy.get('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]').type(tamperSealNumber);
    inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
      {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
  },
  manufacturingShipReceiptSummaryVerify: (therapy, scope) => {

    if (Cypress.env('runWithTranslations')) {

      actionButtonsTranslectionCheck();

      //shippingReceiptSummary
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_shipment_receipt_checklist_summary"]', 'h1',
        manufacturingCiltaAssertion.shippingReceiptSummary.shipmentReceiptChecklistSummary)

      //subtitle
      translationHelpers.assertSingleField('[data-testid=section-heading-title]',
        manufacturingCiltaAssertion.shippingReceiptSummary.shipmentDetails)

      //labels
      // translationHelpers.assertBlockLabel('[data-test-id="label-verification-step-row-block"] >>>',
      //   { index: 0, label: manufacturingCiltaAssertion.shippingReceiptSummary.dateTimeReceived })

      translationHelpers.assertBlockLabel('[data-test-id="label-verification-step-row-block"] >>>',
        { index: 1, label: manufacturingCiltaAssertion.shippingReceiptSummary.confirmed })

      translationHelpers.assertBlockLabel('[data-test-id="label-verification-step-row-block"] >>>',
        { index: 2, label: scope.coi })

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'div',
        manufacturingCiltaAssertion.shippingReceiptSummary.treatmentSite)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'div',
        manufacturingCiltaAssertion.shippingReceiptSummary.orderId)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'span', scope.orderIdentifier)


      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'div',
        manufacturingCiltaAssertion.shippingReceiptSummary.airwayBillNumber)

      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingReceiptSummary.shippingContainerCaseIntact)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingReceiptSummary.shippingContainerSecuredSummary)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingReceiptSummary.packingInsertIncluded)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingReceiptSummary.ConsigneePouchIncluded)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingReceiptSummary.redWireTamperSeal)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingReceiptSummary.evoIsNumber, inputs.evoLast4Digits)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingReceiptSummary.airWaybillMatchEvoSummary)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingReceiptSummary.tamperSealNumberSummary, inputs.tamperSealNumber)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingReceiptSummary.airWaybillMatchTamper)

      translationHelpers.assertSingleField('[data-testid=approver-prompt]',
        manufacturingCiltaAssertion.shippingReceiptSummary.confirmer)
      translationHelpers.assertSingleField('[data-testid=verifier-prompt]',
        manufacturingCiltaAssertion.shippingReceiptSummary.verifier)
    }

    common.doubleSignature(verifier);
    //common.ClickPrimaryActionButton();
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
      {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
  },

  manufacturingTransferProductToStorageCCLP: (coi, therapy) => {
    if (Cypress.env('runWithTranslations')) {

      actionButtonsTranslectionCheck();
      //title
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_transfer_product_to_storage"]', 'h1',
        manufacturingCiltaAssertion.transferProductToStorage.transferProductTitle)

      //subtitle
      translationHelpers.assertBlockLabel('[data-testid=section-heading-title]',
        { index: 0, label: manufacturingCiltaAssertion.transferProductToStorage.note })

      translationHelpers.assertBlockLabel('[data-testid=h1-header]',
        { index: 1, label: manufacturingCiltaAssertion.transferProductToStorage.placeCassette })

      //label
      translationHelpers.assertBlockLabel('[data-testid=section-heading-description]',
        { index: 0, label: manufacturingCiltaAssertion.transferProductToStorage.noteDescription })

      translationHelpers.assertBlockLabel('[data-testid=section-heading-description]',
        { index: 1, label: manufacturingCiltaAssertion.transferProductToStorage.important })

      
        translationHelpers.assertSingleField('[data-testid=bag-1-desc]',
          manufacturingCiltaAssertion.transferProductToStorage.removeCassetteCclpCilta)
        translationHelpers.assertBlockLabel('[data-test-id="multiple-scan-block-block"] >>>>>',
          { index: 0, label: manufacturingCiltaAssertion.transferProductToStorage.scanOrEnterCoi })
        translationHelpers.assertBlockLabel('[data-test-id="multiple-scan-block-block"] >>>>>',
          { index: 2, label: manufacturingCiltaAssertion.transferProductToStorage.scanOrEnterCoiBag })
    }

    cy.get('[data-testid="h1-header"]').should('contain', 'Transfer Product to Intermediary or Final LN2 Storage');
    cy.get('[data-testid="cassette-1-input"]').type(`${coi}-PRC-01`);
    cy.get('[data-testid="cassette-1-button"]').click();
    cy.wait('@labelVerifications');
    cy.get('[data-testid="bag-identifier-1-input"]').type(`${coi}-PRC-01`);
    cy.get('[data-testid="bag-identifier-1-button"]').click();
    cy.wait('@labelVerifications');

    //common.ClickPrimaryActionButton();
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
      {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
  },
  
  manufacturingTransferProductToStorage2: coi => {
    if (Cypress.env('runWithTranslations')) {

      actionButtonsTranslectionCheck();
      //title
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_transfer_product_to_storage_2"]', 'h1',
        manufacturingCiltaAssertion.transferProductToStorage2.TransferProductToStorage2Title)

      //subtitle
      translationHelpers.assertSingleField('[data-testid=section-heading-title]',
        manufacturingCiltaAssertion.transferProductToStorage2.intermediaryStorage)

      //labels
      translationHelpers.assertSingleField('[data-testid=section-heading-description]',
        manufacturingCiltaAssertion.transferProductToStorage2.intermediaryStorageDescription)

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Enter the Time removed from intermediary storage (Optional)"]',
        manufacturingCiltaAssertion.transferProductToStorage2.enterTimeRemoved)

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Enter the time placed into LN2 storage (Optional)"]',
        manufacturingCiltaAssertion.transferProductToStorage2.enterTimePlaced)

      translationHelpers.assertBlockLabel('[data-testid=masked-input-label]',
        { index: 0, label: manufacturingCiltaAssertion.transferProductToStorage2.timeRemoved })

      translationHelpers.assertBlockLabel('[data-testid=masked-input-label]',
        { index: 1, label: manufacturingCiltaAssertion.transferProductToStorage2.timePlaced })
    }
    cy.get('[data-testid="h1-header"]').should('contain', 'Transfer Product to Intermediary or Final LN2 Storage');

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
      {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
  },

  manufacturingProductReceiptEmea: (patientId) => {
    cy.log("patient id", patientId)

    inputHelpers.clicker('[data-testid="pass-button-cryopreserved_apheresis_product"]');
    inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
    inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
    inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
    inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]');
    inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
    cy.get('[data-testid="#/properties/product_receipt_checklist/properties/comments-input"]')
      .type(inputs.additionalComments);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
      {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      });
  },

  manufacturingProductReceipt: (patientId, therapy) => {
    if (Cypress.env('runWithTranslations')) {

      actionButtonsTranslectionCheck();
      //title
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_product_receipt"]', 'h1',
        manufacturingCiltaAssertion.productReceipt.ProductReceiptTitle)
      //subtitle
      translationHelpers.assertSingleField('[data-testid=section-heading-title]',
        manufacturingCiltaAssertion.productReceipt.documentReceivingDetails)
      //labels
      translationHelpers.assertBlockLabel('[data-test-id="cryopreservation-summary-bags-block-block"] >>>>>',
        { index: 0, label: manufacturingCiltaAssertion.productReceipt.apheresisId })

      translationHelpers.assertSingleField('[data-testid=question-text-cryopreserved_apheresis_product]',
        manufacturingCiltaAssertion.productReceipt.cryopreservedApheresisProductCassette)

        translationHelpers.assertSingleField('[data-testid=question-text-temperature_out_of_range]',
          manufacturingCiltaAssertion.productReceipt.temperatureAlarmReceivedEmea)
        translationHelpers.assertSingleField('[data-testid=question-text-expected_condition]',
          manufacturingCiltaAssertion.productReceipt.bagAndCassetteExpectedConditionEmea)

      translationHelpers.assertSingleField('[data-testid=question-text-seal_in_place]',
        manufacturingCiltaAssertion.productReceipt.tamperEvidentSeal)

      translationHelpers.assertSingleField('[data-testid=question-text-free_from_cracks]',
        manufacturingCiltaAssertion.productReceipt.bagFreeFromCracks)

      translationHelpers.assertSingleField('[data-testid=question-text-placed_into_storage]',
        manufacturingCiltaAssertion.productReceipt.cryopreservedApheresisProductPlaced)

      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-cryopreserved_apheresis_product] >')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-temperature_out_of_range] >', "No", "Yes")
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-seal_in_place] >')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-expected_condition]>')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-free_from_cracks]>')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-placed_into_storage]>')


      translationHelpers.assertSectionChildElement('[data-test-id="shipping-checklist-block-block"]', 0, '[id="#/properties/product_receipt_checklist/properties/comments"] >',
        manufacturingCiltaAssertion.productReceipt.additionalComments)

      translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]',
        manufacturingCiltaAssertion.productReceipt.enterOrderId)

      translationHelpers.assertSingleField('[data-testid=patient-id-action-trigger-button]',
        manufacturingCiltaAssertion.productReceipt.confirm)
    }
    cy.log("patient id", patientId)

    inputHelpers.clicker('[data-testid="pass-button-cryopreserved_apheresis_product"]')
    inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
    inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
    inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
    inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]')
    inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
    cy.get('[data-testid="patient-id-input-field"]').type(patientId);
    inputHelpers.clicker('[data-testid="patient-id-action-trigger-button"]')
    cy.get('[data-testid="#/properties/product_receipt_checklist/properties/comments-input"]').type(inputs.additionalComments)
    cy.wait('@labelVerifications')

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
      {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
  },

  manufacturingProductReceiptSummaryVerifyEmea: () => {
    common.doubleSignature(verifier);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
      {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
  },

  manufacturingProductReceiptSummaryVerifyEmeaCc: (scope) => {

    if (Cypress.env('runWithTranslations')) {

      actionButtonsTranslectionCheck();

      translationHelpers.assertPageTitles('[data-test-id="manufacturing_product_receipt_summary"]', 'h1',
        manufacturingCiltaAssertion.productReceiptSummary.productReceiptSummaryTitle)

      //subtitle
      translationHelpers.assertBlockLabel('[data-testid=section-heading-title]',
        { index: 0, label: manufacturingCiltaAssertion.productReceiptSummary.shipmentDetails })

      translationHelpers.assertBlockLabel('[data-testid=section-heading-title]',
        { index: 1, label: manufacturingCiltaAssertion.productReceiptSummary.storage })

      translationHelpers.assertBlockLabel('[data-testid=section-heading-title]',
        { index: 2, label: manufacturingCiltaAssertion.productReceiptSummary.intermediaryStorage })

      translationHelpers.assertBlockLabel('[data-testid=section-heading-title]',
        { index: 3, label: manufacturingCiltaAssertion.productReceiptSummary.conditionOfShipment })


      //labels
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'div',
        manufacturingCiltaAssertion.productReceiptSummary.orderId)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'span', scope.orderIdentifier)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'div',
        manufacturingCiltaAssertion.productReceiptSummary.product)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'span', inputs.product)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'div',
        manufacturingCiltaAssertion.productReceiptSummary.treatmentSite)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'span', inputs.siteName)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'div',
        manufacturingCiltaAssertion.productReceiptSummary.apheresisId)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'span', inputs.apheresisId)

      translationHelpers.assertBlockLabel('[data-test-id="multiple-scan-block-block"] >>>>',
        { index: 0, label: manufacturingCiltaAssertion.productReceiptSummary.scanOrEnterCassetteLabel })

      translationHelpers.assertBlockLabel('[data-test-id="multiple-scan-block-block"] >>>>',
        { index: 4, label: manufacturingCiltaAssertion.productReceiptSummary.scanOrEnterCoi })



      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Enter the Time removed from intermediary storage (Optional)"]',
        manufacturingCiltaAssertion.productReceiptSummary.enterTimeRemoved)

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Enter the time placed into LN2 storage (Optional)"]',
        manufacturingCiltaAssertion.productReceiptSummary.enterTimePlaced)

      translationHelpers.assertBlockLabel('[data-test-id="label-verification-step-row-block"] >>>',
        { index: 0, label: manufacturingCiltaAssertion.productReceiptSummary.enterOrderIdWaybill })

      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.productReceiptSummary.confirmCryopreservedApheresis)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.productReceiptSummary.temperatureAlarmReceivedEmea, "No")
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.productReceiptSummary.tamperEvidentSeal)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.productReceiptSummary.bagAndCassetteExpectedConditionEmea)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.productReceiptSummary.bagFreeFromCracks)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.productReceiptSummary.cryopreservedApheresisProduct)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.productReceiptSummary.additionalComments, inputs.additionalComments)

      translationHelpers.assertSingleField('[data-testid=approver-prompt]',
        manufacturingCiltaAssertion.productReceiptSummary.confirmer)

      translationHelpers.assertSingleField('[data-testid=verifier-prompt]',
        manufacturingCiltaAssertion.productReceiptSummary.verifier)
    }
    common.doubleSignature(verifier);

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
      {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
  },


  manufacturingData: (lotNumber) => {
    if (Cypress.env('runWithTranslations')) {

      actionButtonsTranslectionCheck();
      //title
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_lot_number"]', 'h3',
        manufacturingCiltaAssertion.manufacturingData.manufacturingDataTitle)

      //subtitle
      translationHelpers.assertBlockLabel('[data-testid=section-heading-title]',
        { index: 1, label: manufacturingCiltaAssertion.manufacturingData.slectExpiryDate })

      translationHelpers.assertBlockLabel('[data-testid=section-heading-title]',
        { index: 2, label: manufacturingCiltaAssertion.manufacturingData.assignLotNumber })

      //labels
      translationHelpers.assertSingleField('[data-testid=section-heading-description]',
        manufacturingCiltaAssertion.manufacturingData.enteredInformation)

      translationHelpers.assertBlockLabel('[data-test-id="bags-creation-block-block"] >>>>>>',
        { index: 0, label: manufacturingCiltaAssertion.manufacturingData.expiryDate })

      translationHelpers.assertBlockLabel('[data-test-id="treatment-block-block"] >>>>>>',
        { index: 0, label: manufacturingCiltaAssertion.manufacturingData.lotNumber })
    }
    cy.get('input[id="#/properties/item_expiry_date-input"]').type(date).blur();
    cy.get('input[id="#/properties/item_expiry_date-input"]').clear();
    cy.wait(3000);
    cy.get('input[id="#/properties/item_expiry_date-input"]').type(date).blur();
    cy.get('[data-testid="#/properties/lot_number-input"]').type(lotNumber);

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
      {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })

    if (Cypress.env('runWithTranslations')) {

      actionButtonsTranslectionCheck();
      //title
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_manufacturing_data"]', 'h1',
        manufacturingCiltaAssertion.manufacturingData.manufacturingDataTitle)

      //subtitle
      translationHelpers.assertBlockLabel('[data-test-id="shipping-checklist-summary-block"] >>',
        { index: 0, label: manufacturingCiltaAssertion.manufacturingData.slectExpiryDate })

      translationHelpers.assertBlockLabel('[data-test-id="shipping-checklist-summary-block"] >>',
        { index: 2, label: manufacturingCiltaAssertion.manufacturingData.assignLotNumber })

      //labels
      translationHelpers.assertBlockLabel('[data-testid=display-only] >',
        { index: 0, label: manufacturingCiltaAssertion.manufacturingData.expiryDate })

      translationHelpers.assertBlockLabel('[data-testid=display-only] >',
        { index: 2, label: manufacturingCiltaAssertion.manufacturingData.lotNumber })

      translationHelpers.assertSingleField('[data-testid=approver-prompt]',
        manufacturingCiltaAssertion.manufacturingData.confirmer)

      translationHelpers.assertSingleField('[data-testid=verifier-prompt]',
        manufacturingCiltaAssertion.manufacturingData.verifier)

    }
    common.doubleSignature(verifier);
    //common.ClickPrimaryActionButton();
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
      {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
  },

  manufacturingFinalLabels: (therapy) => {
    if (Cypress.env('runWithTranslations')) {

      actionButtonsTranslectionCheck();
      //title
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_print_final_product_labels"]', 'h1',
        manufacturingCiltaAssertion.manufacturingFinalLabels.manufacturingFinalLabelsTitle)
      //subtitle
      translationHelpers.assertSingleField('[data-testid=section-heading-title]',
        manufacturingCiltaAssertion.manufacturingFinalLabels.bagsToShip)

      //labels
      translationHelpers.assertSingleField('[data-testid=btn-print]',
        manufacturingCiltaAssertion.manufacturingFinalLabels.buttonPrint)

      translationHelpers.assertBlockLabel('[data-testid="print-block-container"] >',
        { index: 0, label: manufacturingCiltaAssertion.manufacturingFinalLabels.printLabels })

      translationHelpers.assertBlockLabel('[data-testid=print-counter-block] >',
        { index: 0, label: manufacturingCiltaAssertion.manufacturingFinalLabels.totalLabelsPrinted })

        translationHelpers.assertBlockLabel('[data-testid=print-counter-block] >>',
          { index: 0, label: manufacturingCiltaAssertion.manufacturingFinalLabels.bagLabelCCQR })

        translationHelpers.assertBlockLabel('[data-testid=print-counter-block] >>',
          { index: 1, label: manufacturingCiltaAssertion.manufacturingFinalLabels.cassetteLabelCCQR })

        translationHelpers.assertBlockLabel('[data-testid=print-counter-block] >>',
          { index: 2, label: manufacturingCiltaAssertion.manufacturingFinalLabels.packingInsertCCQR })

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Confirm labels and packing insert(s) are printed successfully"]',
        manufacturingCiltaAssertion.manufacturingFinalLabels.confirmLabels)

      translationHelpers.assertBlockLabel('[data-test-id="checkbox-block-block"] >>>>>>>>',
        { index: 1, label: manufacturingCiltaAssertion.manufacturingFinalLabels.confirmed })


    }
    cy.get('[data-testid="h1-header"]').should('contain', 'Print Final Product Labels');
    cy.get('[id="#/properties/data/properties/is_confirmed"]').click();
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
      {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
    if (Cypress.env('runWithTranslations')) {

      actionButtonsTranslectionCheck();

      translationHelpers.assertBlockLabel('[data-test-id="checkbox-block-block"] >>>>>>>>',
        { index: 1, label: manufacturingCiltaAssertion.manufacturingFinalLabels.confirmed })

      translationHelpers.assertSingleField('[data-testid=approver-prompt]',
        manufacturingCiltaAssertion.manufacturingFinalLabels.confirmer)

    }
    common.singleSignature();

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
      {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
  },

  manufacturingLabelApplication: (coi, therapy) => {
    if (Cypress.env('runWithTranslations')) {

      actionButtonsTranslectionCheck();

      //title
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_label_select"]', 'h1',
        manufacturingCiltaAssertion.manufacturingLabelApplication.manufacturingLabelApplicationTitle)


      //subtitle
      translationHelpers.assertSingleField('[data-testid=section-heading-title]',
        manufacturingCiltaAssertion.manufacturingLabelApplication.selectLabelSet)

      translationHelpers.assertBlockLabel('[data-test-id="radio-button-block"] >>>>',
        { index: 0, label: manufacturingCiltaAssertion.manufacturingLabelApplication.selectBagVolume })

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-How many bags resulted from today’s manufacturing process?"]',
        manufacturingCiltaAssertion.manufacturingLabelApplication.questionBagResulted)

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Confirm bag labels have been attached to bag."]',
        manufacturingCiltaAssertion.manufacturingLabelApplication.questionBagLabels)

      translationHelpers.assertSingleField('[data-testid=left-button-radio]',
        manufacturingCiltaAssertion.manufacturingLabelApplication.leftRadio)

      translationHelpers.assertSingleField('[data-testid=right-button-radio]',
        manufacturingCiltaAssertion.manufacturingLabelApplication.rightRadio)

    }

    cy.get('[data-testid="left-button-radio"]').click();
    cy.get('[id="#/properties/item_count-input"]').type('1');
    cy.get('[id="#/properties/data/properties/is_confirmed"]').click();

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
      {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
    if (Cypress.env('runWithTranslations')) {

      actionButtonsTranslectionCheck();


      //subtitle
      translationHelpers.assertBlockLabel('[data-testid=h1-header]',
        { index: 1, label: manufacturingCiltaAssertion.manufacturingLabelApplication.verificationBagLabel })

      translationHelpers.assertSingleField('[data-testid=section-heading-title]',
        manufacturingCiltaAssertion.manufacturingLabelApplication.labelReconciliation)

      //labels

      translationHelpers.assertBlockLabel('[data-test-id="multiple-scan-block-block"] >>>',
        { index: 0, label: manufacturingCiltaAssertion.manufacturingLabelApplication.scanEnterCoi })

      translationHelpers.assertBlockLabel('[data-test-id="multiple-scan-block-block"] >>>',
        { index: 2, label: manufacturingCiltaAssertion.manufacturingLabelApplication.identifierCassette })

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Remaining labels have been returned to Quality for reconciliation as per site procedure"]',
        manufacturingCiltaAssertion.manufacturingLabelApplication.qualityReconciliation)

      translationHelpers.assertBlockLabel('[data-test-id="checkbox-block-block"] >>>>>>>>',
        { index: 1, label: manufacturingCiltaAssertion.manufacturingLabelApplication.confirmed })


    }

    cy.get('[data-testid="bag-identifier-1-input"]').type(`${coi}-FP-01`);
    cy.get('[data-testid="bag-identifier-1-button"]').click();
    cy.wait('@labelVerifications');
    cy.get('[data-testid="cassette-1-input"]').type(`${coi}-FP-01`);
    cy.get('[data-testid="cassette-1-button"]').click();
    cy.wait('@labelVerifications');
    cy.get('[id="#/properties/data/properties/destruction_confirmed"]').click();
    //common.ClickPrimaryActionButton();
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
      {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
  },

  manufacturingReleaseToShip: (therapy) => {
    if (Cypress.env('runWithTranslations')) {

      actionButtonsTranslectionCheck();

      //title
        translationHelpers.assertPageTitles('[data-test-id="manufacturing_release_to_ship"]', 'h1',
          manufacturingCiltaAssertion.manufacturingReleaseToShip.qualityApprovalShipment)

      //subtitle
      translationHelpers.assertBlockLabel('[data-testid=section-heading-title]',
        { index: 0, label: manufacturingCiltaAssertion.manufacturingReleaseToShip.patientInformation })

      translationHelpers.assertBlockLabel('[data-testid=section-heading-title]',
        { index: 1, label: manufacturingCiltaAssertion.manufacturingReleaseToShip.verify })

      //labels

      translationHelpers.assertBlockLabel('[data-test-id="ordering-summary-block"] >>>>',
        { index: 0, label: manufacturingCiltaAssertion.manufacturingReleaseToShip.name })

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-I verify that this product is approved to ship."]',
        manufacturingCiltaAssertion.manufacturingReleaseToShip.verifyProductApproved)

      translationHelpers.assertBlockLabel('[data-test-id="checkbox-block-block"] >>>>>>>>',
        { index: 1, label: manufacturingCiltaAssertion.manufacturingReleaseToShip.verify })
    }

    cy.get('[id="#/properties/data/properties/is_verified"]').click();

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
      {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })

    common.singleSignature();

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
      {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
  },

  manufacturingBagSelection: () => {
    if (Cypress.env('runWithTranslations')) {

      actionButtonsTranslectionCheck();
      //title
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_bag_selection"]', 'h1',
        manufacturingCiltaAssertion.manufacturingBagSelection.manufacturingBagSelectionTitle)

      //subtitle
      translationHelpers.assertSingleField('[data-testid=section-heading-title]',
        manufacturingCiltaAssertion.manufacturingBagSelection.selectBagToShip)

      //labels
      translationHelpers.assertSingleField('[data-testid=section-heading-description]',
        manufacturingCiltaAssertion.manufacturingBagSelection.shippingForInfusion)

      translationHelpers.assertBlockLabel('[data-test-id="shipping-toggle-block"] >>>>',
        { index: 0, label: manufacturingCiltaAssertion.manufacturingBagSelection.bag })

      translationHelpers.assertBlockLabel('[data-test-id="shipping-toggle-block"] >>>>',
        { index: 2, label: manufacturingCiltaAssertion.manufacturingBagSelection.dateCollected })

      translationHelpers.assertBlockLabel('[data-test-id="shipping-toggle-block"] >>>>',
        { index: 4, label: manufacturingCiltaAssertion.manufacturingBagSelection.bagIdentifier })

      translationHelpers.assertSingleField('[data-testid=pass-button-0]',
        manufacturingCiltaAssertion.manufacturingBagSelection.ship)

      translationHelpers.assertSingleField('[data-testid=fail-button-0]',
        manufacturingCiltaAssertion.manufacturingBagSelection.doNotShip)


    }

    cy.get('[data-testid="pass-button-0"]').click();

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
      {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
  },
  manufacturingTransferProductToShipper: (coi, therapy) => {
    if (Cypress.env('runWithTranslations')) {

      actionButtonsTranslectionCheck();
      //title
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_transfer_product_to_shipper"]', 'h1',
        manufacturingCiltaAssertion.manufacturingTransferProductToShipper.manufacturingTransferProductToShipperTitle)

      //subtitle
      translationHelpers.assertSingleField('[data-testid=section-heading-title]',
        manufacturingCiltaAssertion.manufacturingTransferProductToShipper.safetyNotice)

      translationHelpers.assertBlockLabel('[data-testid=h1-header]',
        { index: 1, label: manufacturingCiltaAssertion.manufacturingTransferProductToShipper.placeCassetteInShipper })

      //labels
      translationHelpers.assertSingleField('[data-testid=section-heading-description]',
        manufacturingCiltaAssertion.manufacturingTransferProductToShipper.note)

      translationHelpers.assertSingleField('[data-testid=bag-1-desc]',
        manufacturingCiltaAssertion.manufacturingTransferProductToShipper.removeCassette2)

      translationHelpers.assertBlockLabel('[data-test-id="multiple-scan-block-block"] >>>>>',
        { index: 2, label: manufacturingCiltaAssertion.manufacturingTransferProductToShipper.scanCoiPackingInsert })
      translationHelpers.assertBlockLabel('[data-test-id="multiple-scan-block-block"] >>>>>',
        { index: 0, label: manufacturingCiltaAssertion.manufacturingTransferProductToShipper.identifierOnCassetteEmeaCc })

    }


    cy.get('[data-testid="h1-header"]').should('contain', 'Transfer Product To Shipper');
    cy.get('[data-testid="cassette-1-input"]').type(`${coi}-FP-01`);
    cy.get('[data-testid="cassette-1-button"]').click();
    cy.wait('@labelVerifications');
    cy.get("body").then($body => {
      if ($body.find('[data-testid="coi-1-input"]').length > 0) {
        cy.get('[data-testid="coi-1-input"]').then($header => {
          if ($header.is(':visible')) {
            cy.get('[data-testid="coi-1-input"]').type(coi);
            cy.get('[data-testid="coi-1-button"]').click();
            cy.wait('@labelVerifications');
            //common.ClickPrimaryActionButton();
            actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
              {
                apiAliases: ['@patchProcedureSteps', '@getProcedures'],
              })
            return;
          }
        });
      } else {
        //common.ClickPrimaryActionButton();
        actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
          {
            apiAliases: ['@patchProcedureSteps', '@getProcedures'],
          })
      }
    });
  },

  shippingManufacturing: (shippingRow, scope, subjectNumberInput, evoLast4Digits, tamperSealNumber, therapy) => {
    getManufAirWayBill(scope, shippingRow)
    if (Cypress.env('runWithTranslations')) {

      actionButtonsTranslectionCheck();
      //title
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_shipping_manufacturing"]', 'h1',
        manufacturingCiltaAssertion.shippingManufacturing.shippingManufacturingTitle)

      //subtitle
      translationHelpers.assertSingleField('[data-testid=section-heading-title]',
        manufacturingCiltaAssertion.shippingManufacturing.checklist)

      //labels
      translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]',
        manufacturingCiltaAssertion.shippingManufacturing.airWaybillNumber)

      translationHelpers.assertSectionChildElement('[data-test-id="shipping-checklist-block-block"]', 0, '[id="#/properties/shipping_checklist/properties/order_id"] >',
        manufacturingCiltaAssertion.shippingManufacturing.orderIdAirWaybill)

      translationHelpers.assertSectionChildElement('[data-test-id="shipping-checklist-block-block"]', 0, '[id="#/properties/shipping_checklist/properties/evo_last_4_digits"] >',
        manufacturingCiltaAssertion.shippingManufacturing.ln2Shipper)

        translationHelpers.assertSingleField('[data-testid=question-text-case_intact_cilta]',
          manufacturingCiltaAssertion.shippingManufacturing.shippingContainerCaseEmea)

        translationHelpers.assertSingleField('[data-testid=question-text-temp_out_cilta]',
          manufacturingCiltaAssertion.shippingManufacturing.temperatureAlarmReceivedV2VEmea)

      translationHelpers.assertSingleField('[data-testid=question-text-evo_airway_bill]',
        manufacturingCiltaAssertion.shippingManufacturing.evoisNumberListed)

      translationHelpers.assertSectionChildElement('[data-test-id="shipping-checklist-block-block"]', 0, '[id="#/properties/shipping_checklist/properties/tamper_seal_number"] >',
        manufacturingCiltaAssertion.shippingManufacturing.tamperSealNumber)

      translationHelpers.assertSingleField('[data-testid=question-text-tamper_seal_match]',
        manufacturingCiltaAssertion.shippingManufacturing.tamperSealNumberListed)

      translationHelpers.assertSingleField('[data-testid=question-text-confirm_cassette_not_exposed]',
        manufacturingCiltaAssertion.shippingManufacturing.confirmCassette)

      translationHelpers.assertSingleField('[data-testid=question-text-packing_insert_cilta]',
        manufacturingCiltaAssertion.shippingManufacturing.packingInsert)

      translationHelpers.assertSingleField('[data-testid=question-text-consignee_kit_pouch_inside]',
        manufacturingCiltaAssertion.shippingManufacturing.consigneeKit)

      translationHelpers.assertSingleField('[data-testid=question-text-zip_ties_secured]',
        manufacturingCiltaAssertion.shippingManufacturing.shippingContainerSecured)

      translationHelpers.assertSingleField('[data-testid=question-text-red_wire_tamper]',
        manufacturingCiltaAssertion.shippingManufacturing.redWireTamperSeal)

      translationHelpers.assertSingleField('[data-testid=question-text-red_wire_tamper_shipper]',
        manufacturingCiltaAssertion.shippingManufacturing.ln2ShipperLid)

      translationHelpers.assertBlockLabel('[data-test-id="shipping-checklist-block-block"] >>>>',
        { index: 33, label: manufacturingCiltaAssertion.shippingManufacturing.additionalComments })

      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-case_intact_cilta]>')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-evo_airway_bill]>')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-tamper_seal_match]>')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-confirm_cassette_not_exposed]>')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-packing_insert_cilta]>')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-consignee_kit_pouch_inside]>')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-zip_ties_secured]>')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-red_wire_tamper]>')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-red_wire_tamper_shipper]>')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-temp_out_cilta]>', "No", "Yes")

    }
    cy.get('[id="#/properties/shipping_checklist/properties/order_id-input"]').type(subjectNumberInput);
    cy.get('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]').type(evoLast4Digits);
    inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]')
    inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]')
    inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]')
    inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]')
    cy.get('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]').type(tamperSealNumber);
    inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]')
    inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
    inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]')
    inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]')
    inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]')
    inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]')
    cy.get('[data-testid="#/properties/shipping_checklist/properties/issues-input"]').type(inputs.additionalComments)

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
      {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
  },

  manufacturingShippingManufacturingSummaryVerifyEmeaCc: (therapy, scope) => {

    if (Cypress.env('runWithTranslations')) {

      translationHelpers.assertPageTitles('[data-test-id="manufacturing_shipping_manufacturing_summary"]', 'h1',
        manufacturingCiltaAssertion.shippingManufacturingSummary.shippingManufacturingTitle)

      //subtitle
      translationHelpers.assertSingleField('[data-testid=section-heading-title]',
        manufacturingCiltaAssertion.shippingManufacturingSummary.shipmentSummary)

      translationHelpers.assertBlockLabel('[data-test-id="step-header-block"] >>',
        { index: 0, label: manufacturingCiltaAssertion.shippingManufacturingSummary.conditionShipmemt })

      //labels
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'div',
        manufacturingCiltaAssertion.shippingManufacturingSummary.apheresisId)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'span', inputs.apheresisId)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'div',
        manufacturingCiltaAssertion.shippingManufacturingSummary.orderId)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'span', scope.orderIdentifier)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'div',
        manufacturingCiltaAssertion.shippingManufacturingSummary.product)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'span', inputs.product)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'div',
        manufacturingCiltaAssertion.shippingManufacturingSummary.manufacturingFacility)

      translationHelpers.assertSectionChildElement('[data-testid=display-only] >', 7, 'span', inputs.treatmentSiteIncomingMaterial)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 4, 'div',
        manufacturingCiltaAssertion.shippingManufacturingSummary.airWaybill)
      // Selected bags
      translationHelpers.assertSectionChildElement('[data-test-id=specimen-status-block]', 0, 'span',
        manufacturingCiltaAssertion.shippingManufacturingSummary.dateBagsShipped, 0)

      translationHelpers.assertSectionChildElement('[data-test-id=specimen-status-block]', 0, 'span',
        manufacturingCiltaAssertion.shippingManufacturingSummary.totalNumberBags, 2)

      translationHelpers.assertSectionChildElement('[data-test-id=specimen-status-block]', 0, 'span',
        manufacturingCiltaAssertion.shippingManufacturingSummary.bag1Id, 4)

      translationHelpers.assertBlockLabel('[data-test-id="multiple-scan-block-block"] >>>>',
        { index: 0, label: manufacturingCiltaAssertion.shippingManufacturingSummary.cassetteRemoved })

      translationHelpers.assertBlockLabel('[data-test-id="multiple-scan-block-block"] >>>>',
        { index: 4, label: manufacturingCiltaAssertion.shippingManufacturingSummary.cassettePlaced })

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Airwaybill number for shipment"]',
        manufacturingCiltaAssertion.shippingManufacturingSummary.numberForShipment)

      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingManufacturingSummary.orderIdAir, inputs.subjectNumberInput)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingManufacturingSummary.evoisNumber, inputs.evoLast4Digits)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingManufacturingSummary.shippingContainerCaseEmea);
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingManufacturingSummary.temperatureAlarmReceivedV2VEmea, "No");
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingManufacturingSummary.evoisNumberListed)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingManufacturingSummary.tamperSealNumber, inputs.tamperSealNumber)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingManufacturingSummary.tamperSealNumberListed)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingManufacturingSummary.confirmCassette)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingManufacturingSummary.tamperSealNumberListed)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingManufacturingSummary.packingInsert)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingManufacturingSummary.consigneeKit)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingManufacturingSummary.shippingContainerSecured)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingManufacturingSummary.confirmCassette)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingManufacturingSummary.redWireTamperSeal)
      translationHelpers.assertTxtFieldLayout(manufacturingCiltaAssertion.shippingManufacturingSummary.ln2ShipperLid)

      translationHelpers.assertBlockLabel('[data-testid=display-only] >',

        { index: 58, label: manufacturingCiltaAssertion.shippingManufacturingSummary.additionalComments })


      translationHelpers.assertSingleField('[data-testid=edit-shipping_manufacturing]',
        manufacturingCiltaAssertion.shippingManufacturingSummary.edit)

      translationHelpers.assertBlockLabel('[data-test-id="multiple-scan-block-block"] >>>>',
        { index: 1, label: manufacturingCiltaAssertion.shippingManufacturingSummary.confirmed })

      translationHelpers.assertBlockLabel('[data-test-id="multiple-scan-block-block"] >>>>',
        { index: 5, label: manufacturingCiltaAssertion.shippingManufacturingSummary.confirmed })

      translationHelpers.assertSingleField('[data-testid=approver-prompt]',
        manufacturingCiltaAssertion.shippingManufacturingSummary.confirmer)

      translationHelpers.assertSingleField('[data-testid=verifier-prompt]',
        manufacturingCiltaAssertion.shippingManufacturingSummary.verifier)

      actionButtonsHelper.checkActionButtonLabel(actionButtonsHelper.actionButtonKeys.PRIMARY,
        actionButtonsHelper.translationKeys.DONE)
    }
    common.doubleSignature(verifier);

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY,
      {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      });
  },
}
