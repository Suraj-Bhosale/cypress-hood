import inputHelpers from '../../shared_block_helpers/inputFieldHelpers.js'
import translationHelpers from '../../shared_block_helpers/translationHelpers.js'
import common from '../../../support/index.js'
import therapies from '../../../fixtures/therapy.json'
import satelliteLabAssertions from '../../../fixtures/satelliteLabAssertions.json'
import inputs from '../../../fixtures/inputs.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers.js'

const getSatAirWayBill = (scope, shippingRow, testId) => {
  common.loginAs('oliver')
  cy.visit('/ordering')
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
      cy.visit('/satellite_lab')
      cy.wait(3000)
      cy.contains(scope.coi).click()
      if (testId) {
        inputHelpers.inputSingleField(`[id="${testId}"]`, scope.airWayBill)
      } else {
        inputHelpers.scanAndVerifyCoi('satellite-airway-bill', scope.airWayBill)
      }
      cy.log('satLabAirWayBill', scope.airWayBill)
    })
}

const actionButtonsTranslectionCheck = (
  primaryBtnlabel = actionButtonsHelper.translationKeys.NEXT,
  secondaryBtnLabel = actionButtonsHelper.translationKeys.CLOSE
) => {

  actionButtonsHelper.checkActionButtonLabel(actionButtonsHelper.actionButtonKeys.PRIMARY, primaryBtnlabel)
  actionButtonsHelper.checkActionButtonLabel(actionButtonsHelper.actionButtonKeys.SECONDARY, secondaryBtnLabel)
}

const headersTranslationsCheck = (therapy = {}) => {
  // headers
  translationHelpers.assertSingleField('[data-testid="patientInformationHeader.name"]', satelliteLabAssertions.satHeader.name)
  translationHelpers.assertSingleField('[data-testid="patientInformationHeader.therapy"]', satelliteLabAssertions.satHeader.therapy)
  translationHelpers.assertSingleField('[data-testid="patientInformationHeader.coi"]', satelliteLabAssertions.satHeader.coi)
}

const phasesTranslationsCheck = (therapy = {}) => {
  // Phases
  translationHelpers.assertSingleField('[data-testid="progress-collection_summary-name"]', satelliteLabAssertions.satPhases.collectionSummary)
  translationHelpers.assertSingleField('[data-testid="progress-shipment_receipt-name"]', satelliteLabAssertions.satPhases.shipmentReceipt)
  translationHelpers.assertSingleField('[data-testid="progress-cryopreservation-name"]', satelliteLabAssertions.satPhases.cryopreservation)

  if (['_cmcp_us', '_cmlp_us'].includes(therapy.scheduler_suffix)) {
    translationHelpers.assertSingleField('[data-testid="progress-bag_selection-name"]', satelliteLabAssertions.satPhases.bag_selection)
  } else {
    translationHelpers.assertSingleField('[data-testid="progress-labels-name"]', satelliteLabAssertions.satPhases.labels)
    translationHelpers.assertSingleField('[data-testid="progress-shipping-name"]', satelliteLabAssertions.satPhases.shipping)
  }
}

const shippingReciptChecklistSummaryTranslationCheck = (scope) => {
  // section
  translationHelpers.assertSingleField('[data-testid="section-heading-title"]', satelliteLabAssertions.shipmentReceiptSummary.shipment_details_section)
  translationHelpers.assertChildElement('[data-test-id="step-header-block"]', 'h3', satelliteLabAssertions.shipmentReceiptSummary.details_section)
  translationHelpers.assertChildElement('[data-test-id="label-verification-step-row-block"]', 'div', satelliteLabAssertions.shipmentReceiptSummary.recive_shipper, 2)
  //labels
  translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'div', satelliteLabAssertions.shipmentReceiptSummary.site_number)
  translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'span', scope.patientInformation.siteNumber)
  translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'div', satelliteLabAssertions.shipmentReceiptSummary.awb_track)
  translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'div', satelliteLabAssertions.shipmentReceiptSummary.subject_number)
  translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'span', scope.patientInformation.subjectNumber)
  translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'div', satelliteLabAssertions.shipmentReceiptSummary.apheresis_id)
  translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'span', inputs.din)
  translationHelpers.assertSectionChildElement('[data-testid=display-only]', 4, 'div', satelliteLabAssertions.shipmentReceiptSummary.bag_identifier)
  translationHelpers.assertSectionChildElement('[data-testid=display-only]', 4, 'span', `${scope.coi}-APH-01`)
  translationHelpers.assertSectionChildElement('[data-test-id=multiple-scan-block-block]', 0, 'div', satelliteLabAssertions.shipmentReceiptSummary.bag_id_cpl, 3)
  translationHelpers.assertSectionChildElement('[data-testid=display-only]', 5, 'div', satelliteLabAssertions.shipmentReceiptSummary.list_serial_number)
  translationHelpers.assertSectionChildElement('[data-testid=display-only]', 6, 'div', satelliteLabAssertions.shipmentReceiptSummary.list_security_seal_number)
  translationHelpers.assertTxtFieldLayout(satelliteLabAssertions.shipmentReceiptCheck.does_temp_confirm2);
  translationHelpers.assertTxtFieldLayout(satelliteLabAssertions.shipmentReceiptCheck.cry_aph_bag, "No");
  translationHelpers.assertSingleField('[data-test-id="shipping-checklist-summary-block-block"] >>>>> :nth(12)', satelliteLabAssertions.shipmentReceiptSummary.cold_Shipper2)
  // remaining display only are blank
  // translationHelpers.assertSectionChildElement('[data-testid=display-only]', 13, 'div', satelliteLabAssertions.shipmentReceiptSummary.additional_comments) //not picking it up
  translationHelpers.assertBlockLabel('[data-testid=approver-prompt]', {
    index: 0,
    label: satelliteLabAssertions.shipmentReceiptSummary.confirmer_text,
  })
  translationHelpers.assertBlockLabel('[data-testid=verifier-prompt]', {
    index: 0,
    label: satelliteLabAssertions.shipmentReceiptSummary.verifier_text,
  })
}


export default {
  satLabCollectionSummary: (scope, therapy) => {
    cy.log('Collection Summary')

    if (Cypress.env('runWithTranslations')) {
      headersTranslationsCheck()

      phasesTranslationsCheck(therapy)

      // title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_collection_summary"]', 'h1', satelliteLabAssertions.collectionSummary.title)

      // section
      translationHelpers.assertChildElement('[data-test-id="collection-summary-block"]', 'h3', satelliteLabAssertions.collectionSummary.section_patient_info, 0)
      translationHelpers.assertChildElement('[data-test-id="collection-summary-block"]', 'h3', satelliteLabAssertions.collectionSummary.section_procedure_details, 1)
      translationHelpers.assertChildElement('[data-test-id="collection-summary-block"]', 'h3', satelliteLabAssertions.collectionSummary.section_bag_information, 2)

      // labels
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'div', satelliteLabAssertions.collectionSummary.coi)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'span', scope.coi)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'div', satelliteLabAssertions.collectionSummary.subject_number)
      //translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'span', scope.patientInformation.subjectNumber)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'div', satelliteLabAssertions.collectionSummary.site_number)
      // translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'span', scope.patientInformation.siteNumber)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'div', satelliteLabAssertions.collectionSummary.date_of_apheresis)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'span', inputs.apheresisDate)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 4, 'div', satelliteLabAssertions.collectionSummary.patient_weight)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 4, 'div', `${inputs.patientWeightSatLab} kg`, 1)

      if (therapy.region.includes('EU')) {
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 5, 'div', satelliteLabAssertions.collectionSummary.apheresis_id_eu)
      } else {
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 5, 'div', satelliteLabAssertions.collectionSummary.apheresis_id)
      }
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 5, 'span', inputs.din)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 6, 'div', satelliteLabAssertions.collectionSummary.coi_bag_identifier)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 6, 'span', `${scope.coi}-APH-01`)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 7, 'div', satelliteLabAssertions.collectionSummary.collected_product_volume)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 7, 'span', inputs.collectedProductVolume)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 8, 'div', satelliteLabAssertions.collectionSummary.whole_blood_processed)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 8, 'span', inputs.wholeBloodProcessed)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 9, 'div', satelliteLabAssertions.collectionSummary.anticoagulant_type)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 9, 'span', inputs.anticoagulantType)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 10, 'div', satelliteLabAssertions.collectionSummary.anticoagulant_volume)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 10, 'span', inputs.anticoagulantVolume)

      //TODO: time value
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 11, 'div', satelliteLabAssertions.collectionSummary.start_time)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 12, 'div', satelliteLabAssertions.collectionSummary.end_time)

      //Buttons

    }

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  satLabVerifyShipment: (toSite, therapy, coi) => {
    cy.log('Verify Shipper')

    if (Cypress.env('runWithTranslations')) {


      // title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_verify_shipper"]', 'h1', satelliteLabAssertions.shipmentReceipt.title)

      if (therapy == '-cccp') {
        //TODO: no heading
        translationHelpers.assertSingleField('[data-testid="section-heading-title"]', satelliteLabAssertions.shipmentReceipt.scan_ln2_section)
      }

      translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]', satelliteLabAssertions.shipmentReceipt.enter_coi)

      //Buttons

    }

    inputHelpers.scanAndVerifyCoi(`ln-2-shipper-ship-bags-from-apheresis-site-to-${toSite}${therapy}`, coi)

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  satLabShipmentChecklist: (coi) => {
    cy.log('Shipment Receipt Checklist')

    if (Cypress.env('runWithTranslations')) {
      // title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_shipment_receipt_checklist"]', 'h1', satelliteLabAssertions.shipmentReceiptCheck.title)

      // section
      translationHelpers.assertSingleField('[data-testid="section-heading-title"]', satelliteLabAssertions.shipmentReceiptCheck.details_shipment_section)

      translationHelpers.assertChildElement('[data-test-id="multiple-scan-block-block"]', 'div', satelliteLabAssertions.shipmentReceiptCheck.bag_identifier, 4)

      translationHelpers.assertSingleField('[id="#/properties/shipping_receipt_checklist/properties/monitoring_device_number"]', satelliteLabAssertions.shipmentReceiptCheck.list_serial_number)

      translationHelpers.assertSingleField('[id="#/properties/shipping_receipt_checklist/properties/security_seal_number"]', satelliteLabAssertions.shipmentReceiptCheck.list_security_seal_number)

      translationHelpers.assertChildElement('[id="#/properties/shipping_receipt_checklist/properties/issues"]', 'label', satelliteLabAssertions.shipmentReceiptCheck.additional_comments)

      translationHelpers.assertSingleField('[data-testid="question-text-does_temperature_conform"]', satelliteLabAssertions.shipmentReceiptCheck.does_temp_confirm2)

      translationHelpers.assertSingleField('[data-testid="question-text-cry_aph_bag"]', satelliteLabAssertions.shipmentReceiptCheck.cry_aph_bag)

      translationHelpers.assertSingleField('[data-testid="question-text-cold_shipper"]', satelliteLabAssertions.shipmentReceiptCheck.cold_Shipper2)


      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-does_temperature_conform] >')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-cry_aph_bag] >')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-cold_shipper] >')
    }

    inputHelpers.inputSingleField('[data-testid=bag-identifier-1-input]', `${coi}-APH-01`)
    inputHelpers.clicker('[data-testid=bag-identifier-1-button]')

    inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]')
    inputHelpers.clicker('[data-testid=fail-button-cry_aph_bag]')

    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/cry_aph_bag_reason-input"]', 'some text')

    inputHelpers.clicker('[data-testid=pass-button-cold_shipper]')

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  satLabShipmentChecklistSummary: (scope) => {
    cy.log('Shipment Receipt Checklist Summary')

    if (Cypress.env('runWithTranslations')) {
      // title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_shipment_receipt_checklist_summary"]', 'h1', satelliteLabAssertions.shipmentReceiptSummary.title)

      shippingReciptChecklistSummaryTranslationCheck(scope)
    }

    const verifier = 'quela@vineti.com'

    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], verifier)

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  satLabShipmentChecklistSummaryCMCP: (scope) => {
    cy.log('Shipment Receipt Checklist Summary')
    if (Cypress.env('runWithTranslations')) {
      // title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_shipment_receipt_checklist_summary"]', 'h1', satelliteLabAssertions.shipmentReceiptSummary.title)

      shippingReciptChecklistSummaryTranslationCheck(scope)

    }

    const verifier = 'central_cell_lab_operator_pharmacist@vineti.com'

    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], verifier)

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  satLabCryopreservation: (itemCount) => {
    cy.log('Cryopreservation')

    if (Cypress.env('runWithTranslations')) {
      // title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_cryopreservation_bags"]', 'h1', satelliteLabAssertions.satLabCryopreservation.title)

      // section
      translationHelpers.assertSingleField('[data-testid="section-heading-title"]', satelliteLabAssertions.satLabCryopreservation.confirm_section)

      translationHelpers.assertSingleField(`[data-testid="txt-field-layout-${satelliteLabAssertions.satLabCryopreservation.number_bags}"]`, satelliteLabAssertions.satLabCryopreservation.number_bags)


    }
    inputHelpers.inputSingleField('input[id="#/properties/item_count-input"]', itemCount)
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  satLabCryopreservationLabels: (coi) => {
    cy.log('Cryopreservation Labels')

    if (Cypress.env('runWithTranslations')) {
      // title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_cryopreservation_labels"]', 'h1', satelliteLabAssertions.satLabCryopreservationLabels.title)

      // section
      //TODO: ADD missing header key
      // translationHelpers.assertSingleField('[data-testid="section-heading-title"]',
      // satelliteLabAssertions.satLabCryopreservationLabels.confirm_section);

      translationHelpers.assertSingleField(`[data-testid="txt-field-layout-${satelliteLabAssertions.satLabCryopreservationLabels.confirm_label}"]`, satelliteLabAssertions.satLabCryopreservationLabels.confirm_label)

      translationHelpers.assertSectionChildElement('[data-test-id=multiple-scan-block-block]', 0, 'h3', satelliteLabAssertions.satLabCryopreservationLabels.apply_bag)
      translationHelpers.assertSectionChildElement('[data-test-id=multiple-scan-block-block]', 0, '[data-testid="bag-1-desc"]', satelliteLabAssertions.satLabCryopreservationLabels.identifier_bag)
      translationHelpers.assertSectionChildElement('[data-test-id=multiple-scan-block-block]', 0, 'div', satelliteLabAssertions.satLabCryopreservationLabels.scan_cassette, 5)
      // translationHelpers.assertSectionChildElement('[data-test-id=multiple-scan-block-block]',0 ,'div',satelliteLabAssertions.satLabCryopreservationLabels.scan_bag,6); //find this
      translationHelpers.assertSingleField(`[data-testid="txt-field-layout-${satelliteLabAssertions.satLabCryopreservationLabels.verify_bag}"]`, satelliteLabAssertions.satLabCryopreservationLabels.verify_bag)


    }

    cy.get('[data-testid="txt-field-layout-Confirm labels are printed successfully-answer"]')
      .find('svg')
      .click()

    inputHelpers.scanAndVerifyBags('cassette-1', `${coi}-PRC-01`)

    inputHelpers.scanAndVerifyBags('bag-identifier-1', `${coi}-PRC-01`)

    cy.get('[data-testid="txt-field-layout-Verify labels have been attached to all collection bags-answer"]')
      .find('svg')
      .click()
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  satLabBagStorageEU: (coi) => {
    //TODO: CCCP uS also set naming
    cy.log('Bag Storage')

    if (Cypress.env('runWithTranslations')) {
      // title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_bag_storage"]', 'h1', satelliteLabAssertions.satLabBagStorage.title)

      // section
      translationHelpers.assertSectionChildElement('[data-test-id=multiple-scan-block-block]', 0, 'h3', satelliteLabAssertions.satLabBagStorage.store_cassette)

      translationHelpers.assertSectionChildElement('[data-test-id=multiple-scan-block-block]', 0, 'div', satelliteLabAssertions.satLabBagStorage.coi_scan_descEU, 5)


    }
    cy.wait(2000)

    inputHelpers.scanAndVerifyBags('bag-identifier-1', `${coi}-PRC-01`)

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  satLabBagStorage: (coi, therapy) => {
    //CCCP EU
    cy.log('Bag Storage')

    if (Cypress.env('runWithTranslations')) {
      // title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_bag_storage"]', 'h1', satelliteLabAssertions.satLabBagStorage.title)

      // section
      translationHelpers.assertSectionChildElement('[data-test-id=multiple-scan-block-block]', 0, 'h3', satelliteLabAssertions.satLabBagStorage.store_cassette)
      if (therapy.region == 'CCLP US' || ['_cmcp_us', '_cmlp_us'].includes(therapy.scheduler_suffix)) {
        translationHelpers.assertSectionChildElement('[data-test-id=multiple-scan-block-block]', 0, 'div', satelliteLabAssertions.satLabBagStorage.coi_scan_descEU, 5)
      } else {
        translationHelpers.assertSectionChildElement('[data-test-id=multiple-scan-block-block]', 0, 'div', satelliteLabAssertions.satLabBagStorage.coi_scan_desc, 5)
      }


    }
    cy.wait(2000)
    inputHelpers.scanAndVerifyBags('cassette-1', `${coi}-PRC-01`)

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  satLabCryopreservationData: (inputs, coi) => {
    const { maskedInputControl, totalCells, productVolume } = inputs

    cy.log('Cryopreservation Data')

    if (Cypress.env('runWithTranslations')) {
      // title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_cryopreservation_data"]', 'h1', satelliteLabAssertions.satLabCryopreservationData.title)
      // section
      translationHelpers.assertSingleField('[data-testid="masked-input-label"]', satelliteLabAssertions.satLabCryopreservationData.start_time)

      translationHelpers.assertSectionChildElement('[data-test-id=scan-and-verify-with-metrics-block]', 0, 'h3', satelliteLabAssertions.satLabCryopreservationData.bag_section)

      translationHelpers.assertSectionChildElement('[data-test-id=scan-and-verify-with-metrics-block]', 0, 'div', satelliteLabAssertions.satLabCryopreservationData.scan_bag, 5)

      translationHelpers.assertSingleField('[id="#/properties/custom_fields/properties/total_cells"]', satelliteLabAssertions.satLabCryopreservationData.total_cell)

      translationHelpers.assertSingleField('[id="#/properties/product_volume"]', satelliteLabAssertions.satLabCryopreservationData.prod_vol)


    }

    inputHelpers.inputSingleField('[data-testid=masked-input-control]', maskedInputControl)

    inputHelpers.scanAndVerifyBags('bag-identifier-1', `${coi}-PRC-01`)

    inputHelpers.inputSingleField('input[id="#/properties/custom_fields/properties/total_cells-input"]', totalCells)
    inputHelpers.inputSingleField('input[id="#/properties/product_volume-input"]', productVolume)
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  satLabCryopreservationSummary: (scope) => {
    cy.log('Cryopreservation Summary')

    if (Cypress.env('runWithTranslations')) {
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_cryopreservation_summary"]', 'h1', satelliteLabAssertions.satLabCryopreservationSummary.title)
      // section
      translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]', 0, 'h3', satelliteLabAssertions.satLabCryopreservationSummary.shipment_details_section)
      translationHelpers.assertSectionChildElement('[data-test-id="step-header-block"]', 0, 'h3', satelliteLabAssertions.satLabCryopreservationSummary.details_section)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'div', satelliteLabAssertions.satLabCryopreservationSummary.site_number)
      // translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'span', scope.patientInformation.siteNumber)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'div', satelliteLabAssertions.satLabCryopreservationSummary.subject_number)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'span', scope.patientInformation.subjectNumber)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'div', satelliteLabAssertions.satLabCryopreservationSummary.apheresis_id)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'span', inputs.din)
      // TODO: date value check
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'div', satelliteLabAssertions.satLabCryopreservationSummary.start_time)
      // translationHelpers.assertSectionChildElement('[data-testid=display-only]',0 ,'span',satelliteLabAssertions.satLabCryopreservationSummary.site_number);

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 4, 'div', satelliteLabAssertions.satLabCryopreservationSummary.bag_identifier)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 4, 'span', `${scope.coi}-PRC-01`)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 5, 'div', satelliteLabAssertions.satLabCryopreservationSummary.total_cell)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 5, 'span', inputs.totalCells)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 6, 'div', satelliteLabAssertions.satLabCryopreservationSummary.prod_vol)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 6, 'span', inputs.productVolume)

      translationHelpers.assertChildElement('[data-test-id="label-verification-step-row-block"]', 'div', satelliteLabAssertions.satLabCryopreservationSummary.scan_shipper, 2)


    }

    const verifier = 'quela@vineti.com'
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], verifier)
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  satLabPrintShipperLabels: () => {
    cy.log('Print Shipper labels')

    if (Cypress.env('runWithTranslations')) {
      // title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_print_shipper_labels"]', 'h1', satelliteLabAssertions.satLabPrintShipperLabels.title)

      // section
      translationHelpers.assertSectionChildElement('[data-testid=print-block-container]', 0, 'p', satelliteLabAssertions.satLabPrintShipperLabels.print_shipper)

      translationHelpers.assertSingleField(`[data-testid="txt-field-layout-${satelliteLabAssertions.satLabPrintShipperLabels.confirm_label}"]`, satelliteLabAssertions.satLabPrintShipperLabels.confirm_label)


    }

    cy.get('body').then(($body) => {
      if ($body.find('[data-testid="txt-field-layout-Confirm labels are printed successfully-answer"]').length > 0) {
        cy.get('[data-testid="txt-field-layout-Confirm labels are printed successfully-answer"]').then(($header) => {
          if ($header.is(':visible')) {
            //previous changes was not working for cccp us eu is
            inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]')
          }
        })
      } else {
        cy.get('[id="#/properties/data/properties/is_confirmed"]')
          .find('svg')
          .click()
      }
    })
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  satLabPrintShipperLabelsEU: () => {
    cy.log('Print Shipper labels')

    if (Cypress.env('runWithTranslations')) {
      // title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_print_shipper_labels"]', 'h1', satelliteLabAssertions.satLabPrintShipperLabels.title)

      // section
      translationHelpers.assertSectionChildElement('[data-testid=print-block-container]', 0, 'p', satelliteLabAssertions.satLabPrintShipperLabels.print_shipper)

      translationHelpers.assertSingleField(`[data-testid="txt-field-layout-${satelliteLabAssertions.satLabPrintShipperLabels.confirm_label}"]`, satelliteLabAssertions.satLabPrintShipperLabels.confirm_label)

    }

    cy.get('[id="#/properties/data/properties/is_confirmed"]')
      .find('svg')
      .click()

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  satLabBagSelection: () => {
    cy.log('Bag Selection')

    if (Cypress.env('runWithTranslations')) {
      // title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_bag_selection"]', 'h1', satelliteLabAssertions.satLabBagSelection.title)

      translationHelpers.assertSingleField('[data-testid="section-heading-title"]', satelliteLabAssertions.satLabBagSelection.section)

    }

    inputHelpers.clicker('[data-testid=pass-button-0]')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  satLabTransferProductToShipper: (therapy, coi) => {
    cy.log('Transfer Product To Shipper')

    if (Cypress.env('runWithTranslations')) {
      // title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_transfer_product_to_shipper"]', 'h1', satelliteLabAssertions.satLabTransferProductToShipper.title)

      translationHelpers.assertSingleField('[data-testid="question-text-case_intact_1"]', satelliteLabAssertions.satLabTransferProductToShipper.case_intact_1)

      translationHelpers.assertSingleField('[data-testid="question-text-temp_out_of_range_1"]', satelliteLabAssertions.satLabTransferProductToShipper.temp_out_of_range_1)

      translationHelpers.assertSingleField('[data-testid="question-text-ambient_temperature_exposure"]', satelliteLabAssertions.satLabTransferProductToShipper.ambient_temperature_exposure)

      translationHelpers.assertSingleField('[data-testid="question-text-red_wire_tamper_seal_labeled_rack"]', satelliteLabAssertions.satLabTransferProductToShipper.red_wire_tamper_seal_labeled_rack)

      translationHelpers.assertSingleField('[data-testid="section-heading-description"]', satelliteLabAssertions.satLabTransferProductToShipper.section_heading_description)

      translationHelpers.assertSectionChildElement('[data-test-id=multiple-scan-block-block]', 0, 'h3', satelliteLabAssertions.satLabTransferProductToShipper.capture_casset)

      translationHelpers.assertSectionChildElement('[data-test-id=multiple-scan-block-block]', 0, 'span', satelliteLabAssertions.satLabTransferProductToShipper.remove_cassette)


    }

    inputHelpers.scanAndVerifyBags('cassette-1', `${coi}-PRC-01`)

    inputHelpers.clicker('[data-testid="pass-button-case_intact_1"')
    inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"')

    inputHelpers.scanAndVerifyBags('ln-2-shipper-1', coi)

    inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"')
    inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  satLabShippingChecklistEU: (shippingRow, evoLast4Digits, tamperSealNumber, scope) => {
    cy.log('Shipment Checklist')

    if (Cypress.env('runWithTranslations')) {
      // title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_shipment_checklist"]', 'h1', satelliteLabAssertions.satLabShippingChecklist.title)

      translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]', satelliteLabAssertions.satLabShippingChecklist.airway)

      translationHelpers.assertSectionChildElement('[data-test-id=multiple-scan-block-block]', 0, 'div', satelliteLabAssertions.satLabShippingChecklist.shipper_id, 3)

      translationHelpers.assertSectionChildElement('[id="#/properties/shipping_checklist/properties/evo_is_id"]', 0, 'label', satelliteLabAssertions.satLabShippingChecklist.ln2_shipper)

      translationHelpers.assertSectionChildElement('[id="#/properties/shipping_checklist/properties/tamper_seal_number"]', 0, 'label', satelliteLabAssertions.satLabShippingChecklist.confirm_tamper)

      translationHelpers.assertSectionChildElement('[id="#/properties/shipping_checklist/properties/issues"]', 0, 'label', satelliteLabAssertions.satLabShippingChecklist.aadditional_comment)

      translationHelpers.assertMultiField('[data-testid="question-text-evo_airway_bill"]', satelliteLabAssertions.satLabShippingChecklist.confirm_ln2_shipper)

      translationHelpers.assertMultiField('[data-testid="question-text-red_wire"]', satelliteLabAssertions.satLabShippingChecklist.confirm_wire)

      translationHelpers.assertMultiField('[data-testid="question-text-tamper_seal_match"]', satelliteLabAssertions.satLabShippingChecklist.air_way_tamper)

      translationHelpers.assertMultiField('[data-testid="question-text-shipper_label_placed"]', satelliteLabAssertions.satLabShippingChecklist.packingInsert)

      translationHelpers.assertMultiField('[data-testid="question-text-consignee_kit_pouch_inside"]', satelliteLabAssertions.satLabShippingChecklist.consignee)

      translationHelpers.assertMultiField('[data-testid="question-text-zip_ties_secured"]', satelliteLabAssertions.satLabShippingChecklist.confirm_secure_shipper)


    }
    getSatAirWayBill(scope, shippingRow)
    cy.wait(1000)
    inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/evo_is_id-input"]', evoLast4Digits)
    inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', tamperSealNumber)
    inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]')
    inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]')
    inputHelpers.clicker('[data-testid="pass-button-red_wire"]')
    inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
    inputHelpers.clicker('[data-testid=pass-button-consignee_kit_pouch_inside]')
    inputHelpers.clicker('[data-testid=pass-button-zip_ties_secured]')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  satLabShippingChecklist: (shippingRow, evoLast4Digits, tamperSealNumber, scope, testId) => {
    cy.log(' ')

    if (Cypress.env('runWithTranslations')) {
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_shipment_checklist"]', 'h1', satelliteLabAssertions.satLabShippingChecklist.title)


      translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]', satelliteLabAssertions.satLabShippingChecklist.airway)

      translationHelpers.assertSectionChildElement('[data-test-id=multiple-scan-block-block]', 0, 'div', satelliteLabAssertions.satLabShippingChecklist.shipper_id, 3)

      translationHelpers.assertSectionChildElement('[id="#/properties/shipping_checklist/properties/evo_is_id"]', 0, 'label', satelliteLabAssertions.satLabShippingChecklist.ln2_shipper)

      translationHelpers.assertSectionChildElement('[id="#/properties/shipping_checklist/properties/tamper_seal_number"]', 0, 'label', satelliteLabAssertions.satLabShippingChecklist.confirm_tamper)

      translationHelpers.assertSectionChildElement('[id="#/properties/shipping_checklist/properties/issues"]', 0, 'label', satelliteLabAssertions.satLabShippingChecklist.aadditional_comment)

      translationHelpers.assertMultiField('[data-testid="question-text-evo_airway_bill"]', satelliteLabAssertions.satLabShippingChecklist.confirm_ln2_shipper)

      translationHelpers.assertMultiField('[data-testid="question-text-red_wire"]', satelliteLabAssertions.satLabShippingChecklist.confirm_wire)

      translationHelpers.assertMultiField('[data-testid="question-text-tamper_seal_match"]', satelliteLabAssertions.satLabShippingChecklist.air_way_tamper)

      //translationHelpers.assertMultiField('[data-testid="question-text-shipper_label_placed"]', satelliteLabAssertions.satLabShippingChecklist.confirm_shipper)
      translationHelpers.assertMultiField('[data-testid="question-text-shipper_label_placed"]', satelliteLabAssertions.satLabShippingChecklist.packingInsert)


      translationHelpers.assertMultiField('[data-testid="question-text-consignee_kit_pouch_inside"]', satelliteLabAssertions.satLabShippingChecklist.consignee)

      translationHelpers.assertMultiField('[data-testid="question-text-zip_ties_secured"]', satelliteLabAssertions.satLabShippingChecklist.confirm_secure_shipper)


    }
    getSatAirWayBill(scope, shippingRow, testId)
    cy.get('[data-testid="h1-header"]').should('contain', 'Shipment Checklist')
    cy.wait(1000)
    // cy.wait('@labelVerifications'); //TODO: check if needen or not
    inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/evo_is_id-input"]', evoLast4Digits)
    inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', tamperSealNumber)
    inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]')
    inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]')
    inputHelpers.clicker('[data-testid="pass-button-red_wire"]')
    inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
    inputHelpers.clicker('[data-testid=pass-button-consignee_kit_pouch_inside]')
    inputHelpers.clicker('[data-testid=pass-button-zip_ties_secured]')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  satShippingSummaryVerify: (scope, therapy) => {
    cy.log('Cryopreservation Shipping Summary')

    if (Cypress.env('runWithTranslations')) {


      // title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_cryopreservation_shipping_summary"]', 'h1', satelliteLabAssertions.satShippingSummaryVerify.title)

      // section
      translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]', 0, 'h3', satelliteLabAssertions.satShippingSummaryVerify.shipment_details_section)

      translationHelpers.assertSectionChildElement('[data-test-id="step-header-block"]', 0, 'h3', satelliteLabAssertions.satShippingSummaryVerify.shipper_section)

      translationHelpers.assertSectionChildElement('[data-test-id="step-header-block"]', 1, 'h3', satelliteLabAssertions.satShippingSummaryVerify.shipment_condition_section)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'div', satelliteLabAssertions.satShippingSummaryVerify.subject_number)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'span', scope.patientInformation.subjectNumber)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'div', satelliteLabAssertions.satShippingSummaryVerify.study_number)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'span', inputs.studyNumber)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'div', satelliteLabAssertions.satShippingSummaryVerify.site_number)
      // translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'span', scope.patientInformation.siteNumber)

      //TODO: due to async nature we are just checking if a value is present
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'div', satelliteLabAssertions.satShippingSummaryVerify.awb)
      // translationHelpers.assertSectionChildElement(
      //   '[data-testid=display-only]',
      //   3,
      //   'span',
      //   satelliteLabAssertions.satShippingSummaryVerify.awb
      // )

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 4, 'div', satelliteLabAssertions.satShippingSummaryVerify.evo_is)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 4, 'span', inputs.evoLast4Digits)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 5, 'div', satelliteLabAssertions.satShippingSummaryVerify.coi)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 5, 'span', scope.coi)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 6, 'div', satelliteLabAssertions.satShippingSummaryVerify.apheresis_id)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 6, 'span', inputs.din)

      translationHelpers.assertSingleField(`[data-testid="txt-field-layout-${satelliteLabAssertions.satShippingSummaryVerify.case_intact_1}"]`, satelliteLabAssertions.satShippingSummaryVerify.case_intact_1)

      translationHelpers.assertSingleField(
        `
      [data-testid="txt-field-layout-${satelliteLabAssertions.satShippingSummaryVerify.temp_out_of_range_1}"]`,
        satelliteLabAssertions.satShippingSummaryVerify.temp_out_of_range_1
      )

      translationHelpers.assertChildElement('[data-test-id="multiple-scan-block-block"]', 'div', satelliteLabAssertions.satShippingSummaryVerify.bag_id_desc, 3)

      //TODO: test shipper id desc

      translationHelpers.assertSingleField(`[data-testid="txt-field-layout-${satelliteLabAssertions.satShippingSummaryVerify.ambient_temperature_exposure}"]`, satelliteLabAssertions.satShippingSummaryVerify.ambient_temperature_exposure)

      translationHelpers.assertSingleField(`[data-testid='txt-field-layout-${satelliteLabAssertions.satShippingSummaryVerify.red_wire_tamper_seal_labeled_rack}']`, satelliteLabAssertions.satShippingSummaryVerify.red_wire_tamper_seal_labeled_rack)

      translationHelpers.assertChildElement('[data-test-id="label-verification-step-row-block"]', 'div', satelliteLabAssertions.satShippingSummaryVerify.airway, 2)

      translationHelpers.assertSingleField(`[data-testid="txt-field-layout-${satelliteLabAssertions.satShippingSummaryVerify.ln2_shipper}"]`, satelliteLabAssertions.satShippingSummaryVerify.ln2_shipper)

      translationHelpers.assertSingleField(`[data-testid="txt-field-layout-${satelliteLabAssertions.satShippingSummaryVerify.confirm_ln2_shipper}"]`, satelliteLabAssertions.satShippingSummaryVerify.confirm_ln2_shipper)

      translationHelpers.assertSingleField(`[data-testid="txt-field-layout-${satelliteLabAssertions.satShippingSummaryVerify.confirm_wire}"]`, satelliteLabAssertions.satShippingSummaryVerify.confirm_wire)

      translationHelpers.assertSingleField(`[data-testid="txt-field-layout-${satelliteLabAssertions.satShippingSummaryVerify.confirm_tamper}"]`, satelliteLabAssertions.satShippingSummaryVerify.confirm_tamper)

      translationHelpers.assertSingleField(`[data-testid="txt-field-layout-${satelliteLabAssertions.satShippingSummaryVerify.air_way_tamper}"]`, satelliteLabAssertions.satShippingSummaryVerify.air_way_tamper)

      translationHelpers.assertSingleField(`[data-testid="txt-field-layout-${satelliteLabAssertions.satShippingSummaryVerify.packingInsert}"]`, satelliteLabAssertions.satShippingSummaryVerify.packingInsert)

      translationHelpers.assertSingleField(`[data-testid="txt-field-layout-${satelliteLabAssertions.satShippingSummaryVerify.consignee}"]`, satelliteLabAssertions.satShippingSummaryVerify.consignee)

      translationHelpers.assertSingleField(`[data-testid="txt-field-layout-${satelliteLabAssertions.satShippingSummaryVerify.confirm_secure_shipper}"]`, satelliteLabAssertions.satShippingSummaryVerify.confirm_secure_shipper)

      translationHelpers.assertSingleField(`[data-testid="txt-field-layout-${satelliteLabAssertions.satShippingSummaryVerify.aadditional_comment}"]`, satelliteLabAssertions.satShippingSummaryVerify.aadditional_comment)

      //actionButtonTranslationCheck(actionButtonsHelper.translationKeys.DONE)
      actionButtonsHelper.checkActionButtonLabel(actionButtonsHelper.actionButtonKeys.PRIMARY,
        actionButtonsHelper.translationKeys.DONE)
    }

    const verifier = 'quela@vineti.com'
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], verifier)
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },
}
