import common from '../../../support/index.js'
import translationHelpers from '../../shared_block_helpers/translationHelpers'
import infusionAssertions from '../../../fixtures/infusion_assertions_cilta.json'
import input from '../../../fixtures/inputs.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers.js'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers.js'
import therapy from '../../../fixtures/therapy.json'


export default {

  infusionReceiveShipment: (fromSite, therapy, coi) => {
    cy.log("Receive Shipment")

    translationHelpers.assertPageTitles("[data-test-id='infusion_receive_shipment']", "h1", infusionAssertions.receiveShipment.titleReciveShipment)

    if (Cypress.env('runWithTranslations')) {
      translationHelpers.assertSingleField('[data-testid=section-heading-title]', infusionAssertions.receiveShipment.verifyLn2Shipper)
      translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]', infusionAssertions.receiveShipment.scanOrEnterTheCoi)
     
        translationHelpers.assertSingleField(`[data-testid="ln-2-shipper-ship-bags-from-${fromSite}-to-infusion-${therapy.leg_name}-1-action-trigger-button"]`, infusionAssertions.receiveShipment.confirm)
    }

      inputHelpers.scanAndVerifyCoi(`ln-2-shipper-ship-bags-from-${fromSite}-to-infusion-${therapy.leg_name}-1`, coi)

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })

  },


  infusionShipmentReceiptChecklist: (therapy, evoLast4Digits, tamperSealNumber) => {

    cy.log("Shipment Receipt Checklist")

    translationHelpers.assertPageTitles("[data-test-id='infusion_shipment_receipt_checklist']", "h1", infusionAssertions.shipmentReceiptChecklist.titleShipmentReceiptChecklist)

    if (Cypress.env('runWithTranslations')) {
      translationHelpers.assertSingleField('[data-testid=section-heading-title]', infusionAssertions.shipmentReceiptChecklist.conditionAndDetailsOfShipment)

      translationHelpers.assertSingleField('[data-testid=section-heading-description]', infusionAssertions.shipmentReceiptChecklist.documentChecksPerformed)
        translationHelpers.assertSingleField('[data-testid=question-text-shipping_container_condition]', infusionAssertions.shipmentReceiptChecklist.containerCaseIntact_emea)
      translationHelpers.assertSingleField('[data-testid=question-text-zip_ties_secured]', infusionAssertions.shipmentReceiptChecklist.containerSecured)
      translationHelpers.assertSingleField('[data-testid=question-text-consignee_pouch_inside]', infusionAssertions.shipmentReceiptChecklist.consigneeKitPouchIncluded)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Please enter the last 4-digits of the EVO-IS Number on the LN2 shipper lid."]', infusionAssertions.shipmentReceiptChecklist.enterEvoIsNumber)
      translationHelpers.assertSingleField('[data-testid=question-text-evo_match]', infusionAssertions.shipmentReceiptChecklist.matchEvoIsNumbers)
      translationHelpers.assertSingleField('[data-testid=question-text-red_wire_tamper_seal]', infusionAssertions.shipmentReceiptChecklist.redWireTamperSeal)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Please enter the Tamper Seal Number on LN2 shipper lid."]', infusionAssertions.shipmentReceiptChecklist.enterTamperSealNumber)
      translationHelpers.assertSingleField('[data-testid=question-text-tamper_seal_match]', infusionAssertions.shipmentReceiptChecklist.matchTamperSealNumber)
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-shipping_container_condition] >')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-zip_ties_secured] >')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-consignee_pouch_inside] >')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-evo_match] >')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-red_wire_tamper_seal] >')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-tamper_seal_match] >')
    }

    inputHelpers.clicker('[data-testid="pass-button-shipping_container_condition"]')
    inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]')
    inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside"]')
    inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]')
    inputHelpers.clicker('[data-testid="pass-button-evo_match"]')
    inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
    inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', evoLast4Digits)
    inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', tamperSealNumber)

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  infusionShipmentReceiptSummary: (scope, therapy) => {

    cy.log("Shipment Receipt Summary")

    translationHelpers.assertPageTitles("[data-test-id='infusion_shipment_receipt_summary']", "h1", infusionAssertions.shipmentReceiptSummary.titleShipmentReceiptSummary)

    if (Cypress.env('runWithTranslations')) {
      translationHelpers.assertSingleField('[data-testid=section-heading-title]', infusionAssertions.shipmentReceiptSummary.shipmentDetails)
      // cy.get('[data-test-id="label-verification-step-row-block"]>>>')
      //   .eq(0)
      //   .contains(infusionAssertions.shipmentReceiptSummary.receivedShipperLabelId)
      translationHelpers.assertBlockLabel('[data-test-id="label-verification-step-row-block"]>>>', { index: 1, label: infusionAssertions.shipmentReceiptSummary.confirmed })

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'div', infusionAssertions.shipmentReceiptSummary.airwayBillNo)
      // translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'span', scope.patientInformation.siteNumber)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'div', infusionAssertions.shipmentReceiptSummary.COI)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'span', scope.coi)


      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'div', infusionAssertions.shipmentReceiptSummary.siteName)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'span', input.collectionSiteName1)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'div', infusionAssertions.shipmentReceiptSummary.orderId)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'span', scope.orderIdentifier)

      translationHelpers.assertBlockLabel('[data-test-id="step-header-block"]>>', {
        index: 0,
        label: infusionAssertions.shipmentReceiptSummary.conditionOfShipment,
      })
      translationHelpers.assertSingleField('[data-testid=edit-shipment_receipt_checklist] >', infusionAssertions.shipmentReceiptSummary.edit)
        translationHelpers.assertTxtFieldLayout(infusionAssertions.shipmentReceiptSummary.isShippingContainerCaseIntact_emea)
      translationHelpers.assertTxtFieldLayout(infusionAssertions.shipmentReceiptSummary.isContainerSecured)
      // translationHelpers.assertTxtFieldLayout(infusionAssertions.shipmentReceiptSummary.isLabelIncluded)
      translationHelpers.assertTxtFieldLayout(infusionAssertions.shipmentReceiptSummary.consigneeKitPouchIncluded)
      translationHelpers.assertTxtFieldLayout(infusionAssertions.shipmentReceiptSummary.matchEvoIsNumber)
      translationHelpers.assertTxtFieldLayout(infusionAssertions.shipmentReceiptSummary.redWireTamperSealPlaced)
      translationHelpers.assertTxtFieldLayout(infusionAssertions.shipmentReceiptSummary.matchTamperSealNumber)

      //Translation checks for values
      translationHelpers.assertTxtFieldLayout(infusionAssertions.shipmentReceiptSummary.enterEvoIsNumber, input.evoLast4Digits)
      translationHelpers.assertTxtFieldLayout(infusionAssertions.shipmentReceiptSummary.enterTamperSealNumber, input.tamperSealNumber)
    }
    const verifier = 'phil3@vineti.com';

    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], verifier)

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  },

  infusionProductReceiptChecklist: (therapy) => {

    cy.log('Product Receipt Checklist')

    translationHelpers.assertPageTitles("[data-test-id='infusion_product_receipt_checklist']", "h1", infusionAssertions.productReceiptChecklist.titleProductReceiptChecklist)

    if (Cypress.env('runWithTranslations')) {
      translationHelpers.assertSingleField('[data-testid=section-heading-title]', infusionAssertions.productReceiptChecklist.documentReceivingDetails)
      translationHelpers.assertBlockLabel('[data-testid="display-only"]>', {
        index: 0,
        label: infusionAssertions.productReceiptChecklist.apheresisId,
      })

      // translationHelpers.assertSingleField('[data-testid=question-text-cart_product]', infusionAssertions.productReceiptChecklist.cassetteWereNotExposed)
      translationHelpers.assertSingleField('[data-testid=question-text-cart_product]', infusionAssertions.productReceiptChecklist.cartProduct)
      translationHelpers.assertSingleField('[data-testid=question-text-seal_in_place]', infusionAssertions.productReceiptChecklist.tamperEvidentSealOnCassetteRack)
      translationHelpers.assertSingleField('[data-testid=question-text-temperature_out_of_range]', infusionAssertions.productReceiptChecklist.temperatureOutOfRangeAlarm)
      translationHelpers.assertSingleField('[data-testid=question-text-expected_condition]', infusionAssertions.productReceiptChecklist.cassetteInTheExpectedConditionEmea)
      translationHelpers.assertSingleField('[data-testid=question-text-placed_into_storage]', infusionAssertions.productReceiptChecklist.cassettePlacedIntoStorageAsPerTheCassetteLabel)
      translationHelpers.assertBlockLabel('[id="#/properties/product_receipt_checklist/properties/comments"]>', { index: 0, label: infusionAssertions.productReceiptChecklist.additionalComments })

      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-seal_in_place] >')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-temperature_out_of_range] >', 'No', 'Yes')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-expected_condition] >')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-placed_into_storage] >')
    }

    inputHelpers.clicker('[data-testid="pass-button-cart_product"]')
    inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
    inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
    inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
    inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })

  },


  infusionProductReceiptSummary: (scope, therapy) => {

    cy.log('Product Receipt Summary')

    translationHelpers.assertPageTitles("[data-test-id='infusion_product_receipt_summary']", "h1", infusionAssertions.productReceiptSummary.titleProductReceiptSummary)

    if (Cypress.env('runWithTranslations')) {
      // cy.get('[data-test-id="label-verification-step-row-block"]>>>')
      //   .eq(0)
      //   .contains(infusionAssertions.productReceiptSummary.receivedShipperLabelId)
      cy.get('[data-test-id="label-verification-step-row-block"]>>>')
        .eq(1)
        .contains(infusionAssertions.productReceiptSummary.confirmed)


      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'div', infusionAssertions.productReceiptSummary.airwayBillNumber)
      // translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'span', scope.patientInformation.siteNumber)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'div', infusionAssertions.productReceiptSummary.coi)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'span', scope.coi)


      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'div', infusionAssertions.productReceiptSummary.siteName)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'span', input.collectionSiteName1)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'div', infusionAssertions.productReceiptSummary.apheresisId)

      translationHelpers.assertSingleField('[data-testid="section-heading-title"]', infusionAssertions.productReceiptSummary.conditionOfProduct)

      translationHelpers.assertTxtFieldLayout(infusionAssertions.productReceiptSummary.confirmCassetteNotExposed)
      translationHelpers.assertTxtFieldLayout(infusionAssertions.productReceiptSummary.wasTamperEvidentSealInPlace)
      translationHelpers.assertTxtFieldLayout(infusionAssertions.productReceiptSummary.temperatureOutOfRangeAlarm, 'No', 'Yes')
      translationHelpers.assertTxtFieldLayout(infusionAssertions.productReceiptSummary.cassetteInTheExpectedConditionEmea)
      translationHelpers.assertTxtFieldLayout(infusionAssertions.productReceiptSummary.cassettePlacedIntoStorageAsPerTheCassetteLabel)

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 14, 'div', infusionAssertions.productReceiptSummary.additionalComments)

    }

    const verifier = 'phil3@vineti.com';
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], verifier)

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })
  }
}