import common from '../support/index.js'
import translationHelpers from '../utils/shared_block_helpers/translationHelpers'
import wdcAssertions from '../fixtures/wdcAssertions.json'
import inputs from '../fixtures/inputs.json'
import actionButtonsHelper from '../utils/shared_block_helpers/actionButtonHelpers'
import signatureHelpers from './shared_block_helpers/signatureHelpers.js'
import inputHelpers from './shared_block_helpers/inputFieldHelpers.js'

const wdcHeaderTranslations = (coi) => {
  translationHelpers.assertSingleField('[data-testid="patientInformationHeader.coi"]', wdcAssertions.headers.coi)

  translationHelpers.assertSingleField('[data-testid="patientInformationHeader.coi-value"]', coi)

  translationHelpers.assertSingleField('[data-testid="patientInformationHeader.lot_number"]', wdcAssertions.headers.lotNumber)

  translationHelpers.assertSingleField('[data-testid="patientInformationHeader.lot_number-value"]', inputs.lotNumber)

  translationHelpers.assertSingleField('[data-testid="patientInformationHeader.therapy"]', wdcAssertions.headers.therapy)

  translationHelpers.assertSingleField('[data-testid="patientInformationHeader.therapy-value"]', wdcAssertions.headers.therapyValue)
}

const wdcSidebarTranslations = () => {
  translationHelpers.assertSingleField('[data-testid="progress-creation_of_final_product_shipment-name"]', wdcAssertions.sidebar.createFPshipment)

  translationHelpers.assertSingleField('[data-testid="progress-shipping_receipt-name"]', wdcAssertions.sidebar.shippingReciept)

  translationHelpers.assertSingleField('[data-testid="progress-storage-name"]', wdcAssertions.sidebar.storage)

  translationHelpers.assertSingleField('[data-testid="progress-product_receipt-name"]', wdcAssertions.sidebar.productReciept)

  translationHelpers.assertSingleField('[data-testid="progress-qp_release-name"]', wdcAssertions.sidebar.qpRelease)

  translationHelpers.assertSingleField('[data-testid="progress-labels-name"]', wdcAssertions.sidebar.labels)

  translationHelpers.assertSingleField('[data-testid="progress-shipping-name"]', wdcAssertions.sidebar.shipping)
}
const getWDCAirWayBillEmea = (scope, shippingRow) => {
  common.loginAs('oliver')
  cy.visit('/ordering')
  cy.wait(8000)
  cy.get('td[data-testid="patient-identifier"]')
    .contains(scope.patientInformation.patientId)
    .click()
  cy.get('[data-testid="td-stage-plane-icon"]')
    .eq(shippingRow)
    .parent()
    .parent()
    .parent()
    .find('[data-testid="td-stage-site-details"]')
    .invoke('text')
    .then((text) => {
      scope.manAirwayBill = text.substring(9, text.length)
      common.loginAs('steph')
      cy.visit('/wdc')
      cy.contains(scope.coi).click()

      inputHelpers.scanAndVerifyCoi('wdc-airway-bill', scope.manAirwayBill)
      cy.log('wdcAirWayBill', scope.manAirwayBill)
    })
}

const getWDCAirWayBill = (scope, shippingRow) => {
  common.loginAs('oliver')
  cy.visit('/ordering')
  cy.wait(8000)
  cy.get('td[data-testid="patient-identifier"]')
    .contains(scope.patientInformation.subjectNumber)
    .click()
  cy.get('[data-testid="td-stage-plane-icon"]')
    .eq(shippingRow)
    .parent()
    .parent()
    .parent()
    .find('[data-testid="td-stage-site-details"]')
    .invoke('text')
    .then((text) => {
      scope.airWayBill = text.substring(9, text.length)
      common.loginAs('steph')
      cy.visit('/wdc')
      cy.contains(scope.coi).click()

      inputHelpers.scanAndVerifyCoi('wdc-airway-bill', scope.airWayBill)

      cy.log('wdcAirWayBill', scope.airWayBill)
    })
}
export default {
  wdcScheduleFinalProductShipment: (coi, schedulingSteps, procedureName) => {
    if (Cypress.env('runWithTranslations')) {
      wdcHeaderTranslations(coi)
      wdcSidebarTranslations()

      //TITLE
      translationHelpers.assertPageTitles("[data-test-id='wdc_schedule_final_product_shipment']","h1",  wdcAssertions.createFPshipment.title)
    }
    cy.log('schedule date')
    cy.wait(5000)
    inputHelpers.clicker(`[data-testid="btn-next-${procedureName}"]`)
    cy.wait('@schedulingServiceAvailability')
    inputHelpers.clicker(`[data-testid="btn-next-${procedureName}"]`)
    cy.wait('@schedulingServiceAvailability')
    //cy.wait(5000)
    schedulingSteps.scheduleDate(procedureName, 7, true)
    cy.log('passed schedule date')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@getProcedures'],
    })
  },

  wdcVerifyShipper: (therapy, coi) => {
    if (Cypress.env('runWithTranslations')) {
      //TITLE
      translationHelpers.assertPageTitles("[data-test-id='wdc_verify_shipper']","h1",  wdcAssertions.verifyShipper.title)

      //SECTION HEADING
      translationHelpers.assertSingleField('[data-testid="section-heading-title"]', wdcAssertions.verifyShipper.sectionHeading)

      translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]', wdcAssertions.verifyShipper.scanCoiEmea)

      translationHelpers.assertChildElement('[data-test-id="bags-creation-block-block"]', 'p', wdcAssertions.verifyShipper.numberOfBags)
    }

    inputHelpers.scanAndVerifyCoi(`ln-2-shipper-ship-bags-from-manufacturing-site-to-world-distribution-center${therapy}`, coi)

    inputHelpers.inputSingleField('[id="#/properties/item_count-input"]', 1)
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  wdcShipmentReceiptChecklist: (evoLast4Digits, tamperSealNumber, isClinical = false) => {
    if (Cypress.env('runWithTranslations')) {
      //TITLE
      translationHelpers.assertPageTitles("[data-test-id='wdc_shipment_receipt_checklist']","h1",  wdcAssertions.shippingRecieptChecklist.title)

      //SECTION HEADING
      translationHelpers.assertSingleField('[data-testid="section-heading-title"]', wdcAssertions.shippingRecieptChecklist.sectionHeading)

      translationHelpers.assertSingleField('[data-testid="section-heading-description"]', wdcAssertions.shippingRecieptChecklist.description)

      //TOGGLES
      translationHelpers.assertSingleField('[data-testid="question-text-shipping_container_condition"]', wdcAssertions.shippingRecieptChecklist.labels.caseIntactEmea)

      translationHelpers.assertSingleField('[data-testid="question-text-zip_ties_secured_no_case"]', wdcAssertions.shippingRecieptChecklist.labels.containerSecure)

      //TODO: missing shipmentReceiptChecklist.temperatureMonitorKitQuestion.textKey cclp eu
      // translationHelpers.assertSingleField('[data-testid="question-text-temperature_monitor"]', wdcAssertions.shippingRecieptChecklist.labels.alarmRecieved)

      translationHelpers.assertSingleField('[data-testid="question-text-consignee_pouch_inside"]', wdcAssertions.shippingRecieptChecklist.labels.kitPouch)

      translationHelpers.assertSingleField('[data-testid="question-text-shipper_label"]', wdcAssertions.shippingRecieptChecklist.labels.shipperLabelEmea)

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Please enter the last 4-digits of the EVO-IS Number on the LN2 shipper lid."]', wdcAssertions.shippingRecieptChecklist.labels.evoIsNumber)

      translationHelpers.assertSingleField('[data-testid="question-text-evo_match"]', wdcAssertions.shippingRecieptChecklist.labels.evoListenedAWB)

      translationHelpers.assertSingleField('[data-testid="question-text-red_wire_tamper_seal"]', wdcAssertions.shippingRecieptChecklist.labels.redTamper)

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Please enter the Tamper Seal Number on LN2 shipper lid."]', wdcAssertions.shippingRecieptChecklist.labels.sealNumber)

      translationHelpers.assertSingleField('[data-testid="question-text-tamper_seal_match"]', wdcAssertions.shippingRecieptChecklist.labels.sealNumberonAWB)
    }

    cy.get('[data-testid="h1-header"]').should('contain', 'Shipment Receipt Checklist')
    inputHelpers.clicker('[data-testid=pass-button-shipping_container_condition]')
    inputHelpers.clicker('[data-testid=pass-button-zip_ties_secured_no_case]')
    inputHelpers.clicker('[data-testid=pass-button-consignee_pouch_inside]')
    inputHelpers.clicker('[data-testid=pass-button-shipper_label]')
    cy.get('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]')
      .first()
      .type(evoLast4Digits)
    inputHelpers.clicker('[data-testid=pass-button-evo_match]')
    inputHelpers.clicker('[data-testid=pass-button-red_wire_tamper_seal]')
    inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', tamperSealNumber)
    inputHelpers.clicker('[data-testid=pass-button-tamper_seal_match]')
    if (isClinical) {
      inputHelpers.clicker('[data-testid=pass-button-temperature_monitor]')
    }
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },


  wdcSummary: () => {
    // getManufAirWayBill(scope,shippingRow)
    if (Cypress.env('runWithTranslations')) {
      //TITLE
      translationHelpers.assertPageTitles("[data-test-id='wdc_shipment_receipt_checklist_summary']","h1",  wdcAssertions.shippingRecieptChecklistSummary.title)

      //SECTION HEADING
      translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', { index: 0, label: wdcAssertions.shippingRecieptChecklistSummary.sectionHeading })

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'div', wdcAssertions.shippingRecieptChecklistSummary.labels.manSite, 0)
      // translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      // 0,'span', patientData.siteNumber,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'div', wdcAssertions.shippingRecieptChecklistSummary.labels.treatmentSite, 0)
      // translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'span', patientData.siteNumber, 0)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'div', wdcAssertions.shippingRecieptChecklistSummary.labels.manAWB, 0)
      // translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      // 2,'span', manAirwayBill,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'div', wdcAssertions.shippingRecieptChecklistSummary.labels.orderId, 0)
      // translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'span', patientData.subjectNumber, 0)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'div', wdcAssertions.shippingRecieptChecklistSummary.labels.product, 0)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'span', wdcAssertions.shippingRecieptChecklistSummary.labels.productValue, 0)

      //SECTION HEADING 2
      translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', { index: 1, label: wdcAssertions.shippingRecieptChecklistSummary.sectionHeading2 })

      translationHelpers.assertSingleField(
        '[data-testid="txt-field-layout-Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact the Vein to Vein team."]',
        wdcAssertions.shippingRecieptChecklistSummary.labels.caseIntactEmea
      )
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the shipping container secured?"]', wdcAssertions.shippingRecieptChecklistSummary.labels.containerSecure)

      //TODO: missing shipmentReceiptChecklist.temperatureMonitor in cclpEU
      // translationHelpers.assertSingleField(
      //   '[data-testid="txt-field-layout-Was there a temperature out-of-range alarm received? If yes, meaning a Temperature Out-of-Range has occurred, proceed with unpacking immediately and then contact CDT to complete a TOR report."]',
      //   wdcAssertions.shippingRecieptChecklistSummary.labels.alarmRecieved
      // )
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the Consignee kit pouch included with the shipper?"]', wdcAssertions.shippingRecieptChecklistSummary.labels.kitPouch)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the packing insert included with the shipper?"]', wdcAssertions.shippingRecieptChecklistSummary.labels.shipperLabelEmea)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Please enter the last 4-digits of the EVO-IS Number on the LN2 shipper lid."]', wdcAssertions.shippingRecieptChecklistSummary.labels.evoIsNumber)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?"]', wdcAssertions.shippingRecieptChecklistSummary.labels.evoListenedAWB)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the Red Wire Tamper Seal in place for the LN2 shipper lid?"]', wdcAssertions.shippingRecieptChecklistSummary.labels.redTamper)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Please enter the Tamper Seal Number on LN2 shipper lid."]', wdcAssertions.shippingRecieptChecklistSummary.labels.sealNumber)
      translationHelpers.assertSingleField(
        '[data-testid="txt-field-layout-Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?"]',
        wdcAssertions.shippingRecieptChecklistSummary.labels.sealNumberonAWB
      )
    }

    const verifier = 'quela@vineti.com'
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], verifier)
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  wdcSummaryLCDC: () => {
    // getManufAirWayBill(scope,shippingRow)
    if (Cypress.env('runWithTranslations')) {
      //TITLE
      translationHelpers.assertPageTitles("[data-test-id='wdc_shipment_receipt_checklist_summary']","h1",  wdcAssertions.shippingRecieptChecklistSummary.title)

      //SECTION HEADING
      translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', { index: 0, label: wdcAssertions.shippingRecieptChecklistSummary.sectionHeading })

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'div', wdcAssertions.shippingRecieptChecklistSummary.labels.manufacturingSite, 0)
      // translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      // 0,'span', patientData.siteNumber,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'div', wdcAssertions.shippingRecieptChecklistSummary.labels.treatmentSite, 0)
      // translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'span', patientData.siteNumber, 0)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'div', wdcAssertions.shippingRecieptChecklistSummary.labels.manAWB, 0)
      // translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      // 2,'span', manAirwayBill,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'div', wdcAssertions.shippingRecieptChecklistSummary.labels.orderId, 0)
      // translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'span', patientData.subjectNumber, 0)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'div', wdcAssertions.shippingRecieptChecklistSummary.labels.product, 0)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'span', wdcAssertions.shippingRecieptChecklistSummary.labels.productValue, 0)

      //SECTION HEADING 2
      translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', { index: 1, label: wdcAssertions.shippingRecieptChecklistSummary.sectionHeading2 })

      translationHelpers.assertSingleField(
        '[data-testid="txt-field-layout-Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact the Vein to Vein team."]',
        wdcAssertions.shippingRecieptChecklistSummary.labels.caseIntactEmea
      )
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the shipping container secured?"]', wdcAssertions.shippingRecieptChecklistSummary.labels.containerSecure)

      //TODO: missing shipmentReceiptChecklist.temperatureMonitor in cclpEU
      // translationHelpers.assertSingleField(
      //   '[data-testid="txt-field-layout-Was there a temperature out-of-range alarm received? If yes, meaning a Temperature Out-of-Range has occurred, proceed with unpacking immediately and then contact CDT to complete a TOR report."]',
      //   wdcAssertions.shippingRecieptChecklistSummary.labels.alarmRecieved
      // )
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the Consignee kit pouch included with the shipper?"]', wdcAssertions.shippingRecieptChecklistSummary.labels.kitPouch)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the packing insert included with the shipper?"]', wdcAssertions.shippingRecieptChecklistSummary.labels.shipperLabelEmea)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Please enter the last 4-digits of the EVO-IS Number on the LN2 shipper lid."]', wdcAssertions.shippingRecieptChecklistSummary.labels.evoIsNumber)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?"]', wdcAssertions.shippingRecieptChecklistSummary.labels.evoListenedAWB)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the Red Wire Tamper Seal in place for the LN2 shipper lid?"]', wdcAssertions.shippingRecieptChecklistSummary.labels.redTamper)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Please enter the Tamper Seal Number on LN2 shipper lid."]', wdcAssertions.shippingRecieptChecklistSummary.labels.sealNumber)
      translationHelpers.assertSingleField(
        '[data-testid="txt-field-layout-Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?"]',
        wdcAssertions.shippingRecieptChecklistSummary.labels.sealNumberonAWB
      )
    }

    const verifier = 'quela@vineti.com'
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], verifier)
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  wdcTransferProductToStorage: (coi) => {
    if (Cypress.env('runWithTranslations')) {
      //TITLE
      translationHelpers.assertPageTitles("[data-test-id='wdc_transfer_product_to_storage']","h1",wdcAssertions.transferProductStorage.title)

      //SECTION HEADING
      translationHelpers.assertChildElement('[data-test-id="multiple-scan-block-block"]', 'h3', wdcAssertions.transferProductStorage.sectionHeading)

      translationHelpers.assertSingleField('[data-testid="bag-1-desc"]', wdcAssertions.transferProductStorage.description)

      // Labels
      cy.get('[data-test-id="multiple-scan-block-block"]').contains(wdcAssertions.transferProductStorage.labels.coiScanLN2)
      cy.get('[data-test-id="multiple-scan-block-block"]').contains(wdcAssertions.transferProductStorage.labels.coiScanCassete)
    }

    cy.get('[data-testid="h1-header"]').should('contain', 'Transfer Product To Storage')

    inputHelpers.scanAndVerifyBags('cassette-1', `${coi}-FPS-01`)

    inputHelpers.scanAndVerifyBags('ln-2-shipper-1', coi)

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  wdcProductReceipt: (pisNumber) => {
    if (Cypress.env('runWithTranslations')) {
      //TITLE
      translationHelpers.assertPageTitles("[data-test-id='wdc_product_receipt']","h1",  wdcAssertions.productReciept.title)

      //SECTION HEADING
      translationHelpers.assertSingleField('[data-testid="section-heading-title"]', wdcAssertions.productReciept.sectionHeading)

      //Labels
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'div', wdcAssertions.productReciept.labels.apheresisID)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'span', inputs.day1Bag1Udn)

      translationHelpers.assertSingleField('[data-testid="question-text-investigational_product"]', wdcAssertions.productReciept.labels.inverstProduct)

      translationHelpers.assertSingleField('[data-testid="question-text-seal_in_place"]', wdcAssertions.productReciept.labels.sealPlace)

      translationHelpers.assertSingleField('[data-testid="question-text-expected_condition"]', wdcAssertions.productReciept.labels.expectedCondition)

      translationHelpers.assertSingleField('[data-testid="question-text-vapor_phase"]', wdcAssertions.productReciept.labels.vaporPhase)

      translationHelpers.assertSingleField(
        '[data-testid="txt-field-layout-Please enter the expiry date as last 8 digits of the SEC-Product Identification Sequence (SEC-PIS) Number (Format needed: 12/JAN/2015 = 20150112). Please do not overwrite the pre-populated first 11 digits or you will not be able to proceed."]',
        wdcAssertions.productReciept.labels.expireDate
      )

      translationHelpers.assertSingleField('[data-testid="question-text-expiry_match"]', wdcAssertions.productReciept.labels.expityMatch)

      translationHelpers.assertSingleField('[id="#/properties/product_receipt_checklist/properties/comments"]', wdcAssertions.productReciept.labels.additionalComm)
    }

    cy.get('[data-testid="h1-header"]').should('contain', 'Product Receipt')
    inputHelpers.clicker('[data-testid=pass-button-investigational_product]')
    inputHelpers.clicker('[data-testid=pass-button-seal_in_place]')
    inputHelpers.clicker('[data-testid=pass-button-expected_condition]')
    inputHelpers.clicker('[data-testid=pass-button-vapor_phase]')
    cy.get('[id="#/properties/product_receipt_checklist/properties/pis_number-input"]').type(pisNumber) //do not replace this append
    inputHelpers.clicker('[data-testid=pass-button-expiry_match]')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  wdcProductRecieptSummary: (patientData) => {
    // getManufAirWayBill(scope,shippingRow)
    if (Cypress.env('runWithTranslations')) {
      //TITLE
      translationHelpers.assertPageTitles("[data-test-id='wdc_product_receipt_summary']","h1",  wdcAssertions.productRecieptSummary.title)

      //SECTION HEADING
      translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', { index: 0, label: wdcAssertions.productRecieptSummary.sectionHeading })

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'div', wdcAssertions.productRecieptSummary.labels.orderId, 0)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'span', patientData.patientId, 0)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'div', wdcAssertions.productRecieptSummary.labels.product, 0)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'span', wdcAssertions.productRecieptSummary.labels.productValue, 0)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'div', wdcAssertions.productRecieptSummary.labels.manAWB, 0)

      // translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      // 2,'span', manAirwayBill,0);

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'div', wdcAssertions.productRecieptSummary.labels.manSite, 0)

      // translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      // 3,'span', patientData.siteNumber,0);

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'div', wdcAssertions.productRecieptSummary.labels.siteNumberEmea, 0)

      //SECTION HEADING 2
      translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', { index: 1, label: wdcAssertions.productRecieptSummary.sectionHeading2Emea })

      cy.get('[data-test-id="multiple-scan-block-block"]').contains(wdcAssertions.productRecieptSummary.labels.shipperLabelEmea)
      cy.get('[data-test-id="multiple-scan-block-block"]').contains(wdcAssertions.productRecieptSummary.labels.cryoApheresisProductEmea)

      //SECTION HEADING 3
      cy.get('[data-test-id="step-header-block"]').find('h3').as('stepHeader')
      translationHelpers.assertBlockLabel('@stepHeader', { index: 0, label: wdcAssertions.productRecieptSummary.sectionHeading3 })

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 5, 'div', wdcAssertions.productReciept.labels.apheresisID)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 5, 'span', inputs.day1Bag1Udn)

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Lot number"]', wdcAssertions.productRecieptSummary.labels.lotNumber)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 6, 'span', patientData.orderingLotNumber)

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Confirm CAR-T product cassette(s) were not exposed to ambient temperature greater than 3 minutes."]', wdcAssertions.productRecieptSummary.labels.inverstProductEmea)

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Was tamper evident seal in place on the cassette rack?"]', wdcAssertions.productRecieptSummary.labels.sealPlace)

      translationHelpers.assertSingleField(
        '[data-testid="txt-field-layout-Was there a temperature out-of-range alarm received?  If yes, contact the Vein to Vein team for further instructions."]',
        wdcAssertions.productRecieptSummary.labels.temperatureRangeEmea
      )

      translationHelpers.assertSingleField(
        '[data-testid="txt-field-layout-Is each bag and cassette in expected condition (e.g. no cassette damage, label adhered)?  If bag(s) or cassette(s) is not in expected condition, please contact Janssen Vein to Vein team for further instructions."]',
        wdcAssertions.productRecieptSummary.labels.cassetteNotDamagedEmea
      )

      translationHelpers.assertSingleField(
        '[data-testid="txt-field-layout-Please enter the expiry date as last 8 digits of the SEC-Product Identification Sequence (SEC-PIS) Number (Format needed: 12/JAN/2015 = 20150112). Please do not overwrite the pre-populated first 11 digits or you will not be able to proceed."]',
        wdcAssertions.productRecieptSummary.labels.expireDate
      )


      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 19, 'div', wdcAssertions.productRecieptSummary.labels.additionalComm)
    }

    const verifier = 'quela@vineti.com'
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'],verifier)
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  wdcProductRecieptSummaryLCDC: (patientData) => {
    // getManufAirWayBill(scope,shippingRow)
    if (Cypress.env('runWithTranslations')) {
      //TITLE
      translationHelpers.assertPageTitles("[data-test-id='wdc_product_receipt_summary']","h1",  wdcAssertions.productRecieptSummary.title)

      //SECTION HEADING
      translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', { index: 0, label: wdcAssertions.productRecieptSummary.sectionHeading })

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'div', wdcAssertions.productRecieptSummary.labels.orderId, 0)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'span', patientData.patientId, 0)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'div', wdcAssertions.productRecieptSummary.labels.product, 0)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'span', wdcAssertions.productRecieptSummary.labels.productValue, 0)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'div', wdcAssertions.productRecieptSummary.labels.manAWB, 0)

      // translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      // 2,'span', manAirwayBill,0);

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'div', wdcAssertions.productRecieptSummary.labels.manufacturingSite, 0)

      // translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      // 3,'span', patientData.siteNumber,0);

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'div', wdcAssertions.productRecieptSummary.labels.siteNumberEmea, 0)

      //SECTION HEADING 2
      translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', { index: 1, label: wdcAssertions.productRecieptSummary.sectionHeading2 })

      cy.get('[data-test-id="multiple-scan-block-block"]').contains(wdcAssertions.productRecieptSummary.labels.shipperLabelEmea)
      cy.get('[data-test-id="multiple-scan-block-block"]').contains(wdcAssertions.productRecieptSummary.labels.cryoApheresisProductEmea)

      //SECTION HEADING 3
      cy.get('[data-test-id="step-header-block"]').find('h3').as('stepHeader')
      translationHelpers.assertBlockLabel('@stepHeader', { index: 0, label: wdcAssertions.productRecieptSummary.sectionHeading3 })

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 5, 'div', wdcAssertions.productReciept.labels.apheresisID)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 5, 'span', inputs.day1Bag1Udn)

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Lot number"]', wdcAssertions.productRecieptSummary.labels.lotNumber)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 6, 'span', patientData.orderingLotNumber)

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Confirm CAR-T product cassette(s) were not exposed to ambient temperature greater than 3 minutes."]', wdcAssertions.productRecieptSummary.labels.inverstProductEmea)

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Was the tamper evident seal in place on the cassette rack?"]', wdcAssertions.productRecieptSummary.labels.sealPlaceEmeaWDC)

      translationHelpers.assertSingleField(
        '[data-testid="txt-field-layout-Was there a temperature out-of-range alarm received? If yes, please contact the Vein to Vein team for further instructions."]',
        wdcAssertions.productRecieptSummary.labels.temperatureMonitorEmeaWDC
      )

      translationHelpers.assertSingleField(
        '[data-testid="txt-field-layout-Is each bag(s) and cassette(s) in expected condition (e.g. no cassette damage, label adhered)? If bag(s) or cassette(s) is not in expected condition, please contact the Vein to Vein team."]',
        wdcAssertions.productRecieptSummary.labels.expectedConditionEmeaWDC
      )

      translationHelpers.assertSingleField(
        '[data-testid="txt-field-layout-Please enter the expiry date as last 8 digits of the SEC-Product Identification Sequence (SEC-PIS) Number (Format needed: 12/JAN/2015 = 20150112). Please do not overwrite the pre-populated first 11 digits or you will not be able to proceed."]',
        wdcAssertions.productRecieptSummary.labels.expireDate
      )


      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 19, 'div', wdcAssertions.productRecieptSummary.labels.additionalComm)
    }

    const verifier = 'quela@vineti.com'
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'],verifier)
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  wdcQualityRelease: (scope, patientInformation) => {
    if (Cypress.env('runWithTranslations')) {
      //TITLE
      translationHelpers.assertPageTitles("[data-test-id='wdc_quality_release']","h1",wdcAssertions.qpReales.title )

      //SECTION HEADING 1
      translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', { index: 0, label: wdcAssertions.qpReales.sectionHeading })

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'div', wdcAssertions.qpReales.labels.name)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'span', `${patientInformation.firstName}${' '}${patientInformation.middleName}${' '}${patientInformation.lastName}`)

      //SECTION HEADING 2
      translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', { index: 1, label: wdcAssertions.qpReales.sectionHeading2 })

      cy.get('[data-test-id="scan-and-verify-with-metrics-block"]').contains(wdcAssertions.qpReales.labels.coiBagIdentifier)
      cy.get('[data-test-id="scan-and-verify-with-metrics-block"]').contains(wdcAssertions.qpReales.labels.bagIdentifier)
      cy.get('[data-test-id="scan-and-verify-with-metrics-block"]').contains(`${scope.coi}-FPS-01`)

      //SECTION HEADING 3
      translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', { index: 2, label: wdcAssertions.qpReales.sectionHeading3 })

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-I verify that this product is approved for release to ship."]', wdcAssertions.qpReales.labels.productApproved)
    }
    inputHelpers.clicker('[id="#/properties/data/properties/is_verified"]')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  wdcPrintShipperLabels: () => {
    if (Cypress.env('runWithTranslations')) {
      //TITLE
      translationHelpers.assertPageTitles("[data-test-id='wdc_print_packing_insert']","h1", wdcAssertions.printShipperLabel.titleEmea)

      translationHelpers.assertSectionChildElement('[data-testid="print-block-container"]', 0, 'p', wdcAssertions.printShipperLabel.labels.shipperLabelCoiEmea)

      translationHelpers.assertSectionChildElement('[data-testid="btn-print"]', 0, 'span', wdcAssertions.printShipperLabel.labels.shipperLabelButton)

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Confirm packing insert is printed successfully"]', wdcAssertions.printShipperLabel.labels.labelsPrintedEmea)
    }
    inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  wdcTransferProductToShipper: (coi, patientData) => {
    if (Cypress.env('runWithTranslations')) {
      //TITLE
      translationHelpers.assertPageTitles("[data-test-id='wdc_transfer_product_to_shipper']","h1",wdcAssertions.transferShipper.title)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'div', wdcAssertions.transferShipper.labels.apheresisID)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'span', inputs.day1Bag1Udn)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'div', wdcAssertions.transferShipper.labels.shipperFromWDC)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'div', wdcAssertions.transferShipper.labels.siteNumber)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'span', patientData.siteNumber)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'div', wdcAssertions.transferShipper.labels.subjectNumber)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'span', patientData.subjectNumber)

      translationHelpers.assertSingleField('[data-testid="question-text-container_damaged"]', wdcAssertions.transferShipper.labels.containerDamaged)

      translationHelpers.assertSingleField('[data-testid="question-text-container_secured"]', wdcAssertions.transferShipper.labels.containerSecured)

      translationHelpers.assertSingleField('[data-testid="question-text-tempreture_alarm"]', wdcAssertions.transferShipper.labels.temperatureAlarm)

      translationHelpers.assertSingleField('[data-testid="question-text-shipper_kit_pouch_included"]', wdcAssertions.transferShipper.labels.kitPouch)

      //SECTION HEADING 2
      translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', { index: 0, label: wdcAssertions.transferShipper.sectionHeading })

      translationHelpers.assertSingleField('[data-testid="section-heading-description"]', wdcAssertions.transferShipper.decription)

      //SECTION HEADING 3
      translationHelpers.assertBlockLabel('[data-testid="h1-header"]', { index: 1, label: wdcAssertions.transferShipper.sectionHeading2 })

      cy.get('[data-test-id="multiple-scan-block-block"]').contains(wdcAssertions.transferShipper.labels.coiBagIdentifier)
      cy.get('[data-test-id="multiple-scan-block-block"]').contains(wdcAssertions.transferShipper.labels.shipperLabelEmea)
      cy.get('[data-test-id="multiple-scan-block-block"]').contains(wdcAssertions.transferShipper.labels.decription)
    }

    inputHelpers.clicker('[data-testid=pass-button-container_damaged]')
    inputHelpers.clicker('[data-testid=pass-button-container_secured]')
    inputHelpers.clicker('[data-testid=pass-button-tempreture_alarm]')
    inputHelpers.clicker('[data-testid=pass-button-shipper_kit_pouch_included]')

    inputHelpers.scanAndVerifyBags('cassette-1', `${coi}-FPS-01`)

    inputHelpers.scanAndVerifyBags('ln-2-shipper-1', coi)

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  wdcShipping: (shippingRow, scope, evoLast4Digits, tamperSealNumber) => {
    if (Cypress.env('runWithTranslations')) {
      //TITLE
      translationHelpers.assertPageTitles("[data-test-id='wdc_shipping_world_distribution_center']","h1",wdcAssertions.shippingWDC.title )

      translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]', wdcAssertions.shippingWDC.labels.awb)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'div', wdcAssertions.shippingWDC.labels.lotNumber)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'span', inputs.lotNumber)

      //SECTION HEADING 2
      translationHelpers.assertSingleField('[data-testid="section-heading-title"]', wdcAssertions.shippingWDC.sectionHeading)

      translationHelpers.assertSingleField('[data-testid="question-text-confirm_not_exposed"]', wdcAssertions.shippingWDC.labels.confirmNorExposed)

      translationHelpers.assertSingleField('[data-testid="question-text-awb_match"]', wdcAssertions.shippingWDC.labels.awbMatch)

      translationHelpers.assertChildElement('[id="#/properties/shipping_checklist/properties/evo_last_4_digits_wdc"]', 'label', wdcAssertions.shippingWDC.labels.digitsWDC)

      translationHelpers.assertSingleField('[data-testid="question-text-evo_airway_bill_wdc"]', wdcAssertions.shippingWDC.labels.evoAWB)

      translationHelpers.assertChildElement('[id="#/properties/shipping_checklist/properties/tamper_seal_number_wdc"]', 'label', wdcAssertions.shippingWDC.labels.sealNumberWDC)

      translationHelpers.assertSingleField('[data-testid="question-text-tamper_seal_number_listed"]', wdcAssertions.shippingWDC.labels.sealNumberListened)

      translationHelpers.assertSingleField('[data-testid="question-text-red_wire_tamper"]', wdcAssertions.shippingWDC.labels.wireTamper)

      translationHelpers.assertSingleField('[data-testid="question-text-red_wire_tamper_shipper"]', wdcAssertions.shippingWDC.labels.wiretamperShipper)

      translationHelpers.assertSingleField('[data-testid="question-text-shipper_label_placed_wdc"]', wdcAssertions.shippingWDC.labels.shipperPlaced)

      translationHelpers.assertSingleField('[data-testid="question-text-consignee_kit_pouch_inside"]', wdcAssertions.shippingWDC.labels.kitPouch)

      translationHelpers.assertSingleField('[data-testid="question-text-qp_release_added"]', wdcAssertions.shippingWDC.labels.qpRelease)

      translationHelpers.assertSingleField('[data-testid="question-text-secured_container"]', wdcAssertions.shippingWDC.labels.secureContainer)

      translationHelpers.assertChildElement('[id="#/properties/shipping_checklist/properties/issues"]', 'label', wdcAssertions.shippingWDC.labels.additionalComment)
    }

    getWDCAirWayBill(scope, shippingRow)
    inputHelpers.clicker('[data-testid=pass-button-confirm_not_exposed]')
    inputHelpers.clicker('[data-testid=pass-button-awb_match]')
    cy.get('[id="#/properties/shipping_checklist/properties/evo_last_4_digits_wdc-input"]')
      .clear()
      .first()
      .type(inputs.evoLast4Digits)
    inputHelpers.clicker('[data-testid=pass-button-evo_airway_bill_wdc]')
    cy.get('[id="#/properties/shipping_checklist/properties/tamper_seal_number_wdc-input"]')
      .clear()
      .first()
      .type(tamperSealNumber)
    inputHelpers.clicker('[data-testid=pass-button-tamper_seal_number_listed]')
    inputHelpers.clicker('[data-testid=pass-button-red_wire_tamper]')
    inputHelpers.clicker('[data-testid=pass-button-red_wire_tamper_shipper]')
    inputHelpers.clicker('[data-testid=pass-button-shipper_label_placed_wdc]')
    inputHelpers.clicker('[data-testid=pass-button-consignee_kit_pouch_inside]')
    inputHelpers.clicker('[data-testid=pass-button-qp_release_added]')
    inputHelpers.clicker('[data-testid=pass-button-secured_container]')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  wdcShippingEmeaCcdc: (shippingRow, scope, evoLast4Digits, tamperSealNumber) => {
    getWDCAirWayBillEmea(scope, shippingRow)
    inputHelpers.clicker('[data-testid=pass-button-confirm_not_exposed]')
    cy.get('[id="#/properties/shipping_checklist/properties/evo_last_4_digits_wdc-input"]')
      .clear()
      .first()
      .type(evoLast4Digits)
    inputHelpers.clicker('[data-testid=pass-button-evo_airway_bill_wdc]')
    cy.get('[id="#/properties/shipping_checklist/properties/tamper_seal_number_wdc-input"]')
      .clear()
      .first()
      .type(tamperSealNumber)
    inputHelpers.clicker('[data-testid=pass-button-tamper_seal_number_listed]')
    inputHelpers.clicker('[data-testid=pass-button-red_wire_tamper]')
    inputHelpers.clicker('[data-testid=pass-button-red_wire_tamper_shipper]')
    inputHelpers.clicker('[data-testid=pass-button-shipper_label_placed_wdc]')
    inputHelpers.clicker('[data-testid=pass-button-consignee_kit_pouch_inside]')
    inputHelpers.clicker('[data-testid=pass-button-secured_container]')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  wdcShippingSummary: (coi, patientData) => {
    if (Cypress.env('runWithTranslations')) {
      //TITLE
      translationHelpers.assertPageTitles("[data-test-id='wdc_shipping_world_distribution_center_summary']","h1",  wdcAssertions.shippingWDCSummary.title)

      //SECTION HEADING
      translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', { index: 0, label: wdcAssertions.shippingWDCSummary.sectionHeadingEmea })

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'div', wdcAssertions.shippingWDCSummary.labels.orderId, 0)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'span', patientData.patientId, 0)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'div', wdcAssertions.shippingWDCSummary.labels.product, 0)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'span', wdcAssertions.shippingWDCSummary.labels.productValue, 0)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'div', wdcAssertions.shippingWDCSummary.labels.shipmentFrom, 0)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'div', wdcAssertions.shippingWDCSummary.labels.siteNumber, 0)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'span', wdcAssertions.shippingWDCSummary.labels.collectionSite, 0)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'div', wdcAssertions.shippingWDCSummary.labels.dateOfShipment, 0)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 6, 'div', wdcAssertions.shippingWDCSummary.labels.manAWB, 0)
      //    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      //    5,'span', wdcAirwayBill,0);

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 7, 'div', wdcAssertions.shippingWDCSummary.labels.apheresisID, 0)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 7, 'div', `${inputs.day1Bag1Udn} `, 1)
      
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 8, 'div', wdcAssertions.shippingWDCSummary.labels.numberOfBags, 0)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 8, 'div', inputs.itemCount, 1)

      cy.get('[data-test-id="multiple-scan-block-block"]').contains(wdcAssertions.shippingWDCSummary.labels.coiBagIdentifier)

      cy.get('[data-test-id="multiple-scan-block-block"]').contains(`${coi}-FP-01`)

      cy.get('[data-test-id="multiple-scan-block-block"]').contains(wdcAssertions.shippingWDCSummary.labels.labelProductEmea)

      cy.get('[data-test-id="multiple-scan-block-block"]').contains(coi)

      //SECTION HEADING 2
      translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', { index: 1, label: wdcAssertions.shippingWDCSummary.sectionHeading2 })

      translationHelpers.assertSingleField(
        '[data-testid="txt-field-layout-Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact Janssen Vein to Vein team."]',
        wdcAssertions.shippingWDCSummary.labels.caseIntactEmea
      )
      //    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the shipping container secured?"]',
      //    wdcAssertions.shippingWDCSummary.labels.containerSecure);
      translationHelpers.assertSingleField(
        '[data-testid="txt-field-layout-Was there a temperature out-of-range alarm received? If yes, contact Janssen Vein to Vein team immediately and do NOT proceed until further instructions are given."]',
        wdcAssertions.shippingWDCSummary.labels.temperatureAlarmEmea
      )
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Are the Shipper kit pouch and Consignee kit pouch included with the LN2 shipper?"]', wdcAssertions.shippingWDCSummary.labels.kitPouchIncluded)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Confirm CAR-T product cassette(s) were not exposed to ambient temperature greater than 3 minutes."]', wdcAssertions.shippingWDCSummary.labels.inverstProductEmea)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Please enter the last 4-digits of the EVO-IS Number on the LN2 shipper lid."]', wdcAssertions.shippingWDCSummary.labels.evoIsNumber)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?"]', wdcAssertions.shippingWDCSummary.labels.evoListenedAWB)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Please enter the Tamper Seal Number on LN2 shipper lid."]', wdcAssertions.shippingWDCSummary.labels.sealNumber)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?"]', wdcAssertions.shippingWDCSummary.labels.sealNumberonAWB)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the red wire tamper seal labeled “RACK” in place on the cassette rack?"]', wdcAssertions.shippingWDCSummary.labels.redWireRack)
      //    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the red wire tamper seal in place on the cassette rack?"]',
      //    wdcAssertions.shippingWDCSummary.labels.wireTamper);
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the red wire tamper seal in place for LN2 shipper lid?"]', wdcAssertions.shippingWDCSummary.labels.redTamper)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the packing insert included with the shipper?"]', wdcAssertions.shippingWDCSummary.labels.shipperLabelEmea)

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the Consignee kit pouch included with the shipper?"]', wdcAssertions.shippingWDCSummary.labels.kitPouch)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the shipper container secured?"]', wdcAssertions.shippingWDCSummary.labels.shipperSecured)

      // 35 in cclp eu
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 33, 'div', wdcAssertions.shippingWDCSummary.labels.additionalComment, 0)
    }

    const verifier = 'quela@vineti.com'
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], verifier)
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  wdcShippingSummaryLCDC: (coi, patientData) => {
    if (Cypress.env('runWithTranslations')) {
      //TITLE
      translationHelpers.assertPageTitles("[data-test-id='wdc_shipping_world_distribution_center_summary']","h1",  wdcAssertions.shippingWDCSummary.title)

      //SECTION HEADING
      translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', { index: 0, label: wdcAssertions.shippingWDCSummary.sectionHeadingEmea })

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'div', wdcAssertions.shippingWDCSummary.labels.orderId, 0)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'span', patientData.patientId, 0)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'div', wdcAssertions.shippingWDCSummary.labels.product, 0)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'span', wdcAssertions.shippingWDCSummary.labels.productValue, 0)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'div', wdcAssertions.shippingWDCSummary.labels.shipmentFrom, 0)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'div', wdcAssertions.shippingWDCSummary.labels.siteNumber, 0)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'span', wdcAssertions.shippingWDCSummary.labels.collectionSite, 0)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'div', wdcAssertions.shippingWDCSummary.labels.dateOfShipment, 0)

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 6, 'div', wdcAssertions.shippingWDCSummary.labels.manAWB, 0)
      //    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      //    5,'span', wdcAirwayBill,0);

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 7, 'div', wdcAssertions.shippingWDCSummary.labels.apheresisID, 0)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 7, 'div', `${inputs.day1Bag1Udn} `, 1)
      
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 8, 'div', wdcAssertions.shippingWDCSummary.labels.numberOfBags, 0)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 8, 'div', inputs.itemCount, 1)

      cy.get('[data-test-id="multiple-scan-block-block"]').contains(wdcAssertions.shippingWDCSummary.labels.coiBagIdentifierEmea)

      cy.get('[data-test-id="multiple-scan-block-block"]').contains(`${coi}-FP-01`)

      cy.get('[data-test-id="multiple-scan-block-block"]').contains(wdcAssertions.shippingWDCSummary.labels.labelProductEmea)

      cy.get('[data-test-id="multiple-scan-block-block"]').contains(coi)

      //SECTION HEADING 2
      translationHelpers.assertSingleField(
        '[data-testid="txt-field-layout-Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact the Vein to Vein team."]',
        wdcAssertions.shippingWDCSummary.labels.caseIntactEmeaWDC
      )
      //    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the shipping container secured?"]',
      //    wdcAssertions.shippingWDCSummary.labels.containerSecure);
      translationHelpers.assertSingleField(
        '[data-testid="txt-field-layout-Was there a temperature out-of-range alarm received? If yes, contact immediately CDT and do NOT proceed until further instructions are given."]',
        wdcAssertions.shippingWDCSummary.labels.temperatureAlarmEmeaLCDC
      )
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Are the Shipper kit pouch and Consignee kit pouch included with the LN2 shipper?"]', wdcAssertions.shippingWDCSummary.labels.kitPouchIncluded)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Confirm CAR-T product cassette(s) were not exposed to ambient temperature greater than 3 minutes."]', wdcAssertions.shippingWDCSummary.labels.inverstProductEmea)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Please enter the last 4-digits of the EVO-IS Number on the LN2 shipper lid."]', wdcAssertions.shippingWDCSummary.labels.evoIsNumber)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?"]', wdcAssertions.shippingWDCSummary.labels.evoListenedAWB)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Please enter the Tamper Seal Number on LN2 shipper lid."]', wdcAssertions.shippingWDCSummary.labels.sealNumber)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?"]', wdcAssertions.shippingWDCSummary.labels.sealNumberonAWB)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the red wire tamper seal labeled “RACK” in place on the cassette rack?"]', wdcAssertions.shippingWDCSummary.labels.redWireRack)
      //    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the red wire tamper seal in place on the cassette rack?"]',
      //    wdcAssertions.shippingWDCSummary.labels.wireTamper);
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the red wire tamper seal in place for LN2 shipper lid?"]', wdcAssertions.shippingWDCSummary.labels.redWire)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the packing insert included with the shipper?"]', wdcAssertions.shippingWDCSummary.labels.shipperLabelEmea)

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the Consignee kit pouch included with the shipper?"]', wdcAssertions.shippingWDCSummary.labels.kitPouch)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the shipper container secured?"]', wdcAssertions.shippingWDCSummary.labels.shipperSecured)

      // 35 in cclp eu
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 33, 'div', wdcAssertions.shippingWDCSummary.labels.additionalComment, 0)
    }

    const verifier = 'quela@vineti.com'
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], verifier)
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  wdcTransferProductToStorageEmea: (coi) => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Transfer Product To Storage')

    inputHelpers.scanAndVerifyBags('cassette-1', `${coi}-FP-01`)

    inputHelpers.scanAndVerifyBags('ln-2-shipper-1', coi)

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  wdcProductReceiptEmea: (pisNumber) => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Product Receipt')
    inputHelpers.clicker('[data-testid=pass-button-cart_product]')
    inputHelpers.clicker('[data-testid=pass-button-seal_in_place]')
    inputHelpers.clicker('[data-testid=pass-button-expected_condition]')
    inputHelpers.clicker('[data-testid=pass-button-vapor_phase]')
    cy.get('[id="#/properties/product_receipt_checklist/properties/pis_number-input"]').type(pisNumber)
    inputHelpers.clicker('[data-testid=pass-button-temperature_monitor]')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },
  wdcTransferProductToShipperEmeaCcdc: (coi) => {
    inputHelpers.clicker('[data-testid=pass-button-container_damaged]')
    inputHelpers.clicker('[data-testid=pass-button-tempreture_alarm]')
    inputHelpers.clicker('[data-testid=pass-button-shipper_kit_pouch_included]')
    inputHelpers.scanAndVerifyBags('cassette-1', `${coi}-FP-01`)

    inputHelpers.scanAndVerifyBags('ln-2-shipper-1', coi)

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },
}
