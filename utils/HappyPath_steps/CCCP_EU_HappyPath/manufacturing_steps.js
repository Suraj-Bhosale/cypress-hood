import common from '../../../support/index.js';
import dayjs from 'dayjs';

const verifier = 'quela@vineti.com';
const date = dayjs()
  .add(1, 'month')
  .add(0, 'days')
  .format('DD-MMM-YYYY');

const getManufAirWayBill = (scope, shippingRow) => {
  common.loginAs('oliver');
  cy.visit('/ordering');
  cy.get('td[data-testid="patient-identifier"]')
    .contains(scope.patientInformation.subjectNumber)
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
export default {

  manufacturingCollectionSummary: () => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Collection Status');
    common.ClickPrimaryActionButton();
  },

  manufacturingVerifyShipper: (coi, shippingSite, therapy) => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Verify Shipper');
    cy.get(`[data-testid="ln-2-shipper-ship-bags-from-${shippingSite}-to-manufacturing-site${therapy}-input-field"]`).type(`${coi}`);
    cy.get(`[data-testid="ln-2-shipper-ship-bags-from-${shippingSite}-to-manufacturing-site${therapy}-action-trigger-button"]`).click(); //add therepy
    cy.wait('@labelVerifications');
    common.ClickPrimaryActionButton();
  },
  manufacturingShipmentReceiptChecklist: (evoLast4Digits, tamperSealNumber) => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Shipment Receipt Checklist');
    cy.get('[data-testid="pass-button-shipping_container_intact"').click();
    cy.get('[data-testid="pass-button-zip_ties_secured_no_case"]').click();
    cy.get('[data-testid="pass-button-shipper_label_placed"]').click();
    cy.get('[data-testid="pass-button-consignee_pouch_inside"]').click();
    cy.get('[data-testid="pass-button-red_wire_tamper_seal"]').click();
    cy.get('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]').type(evoLast4Digits);
    cy.get('[data-testid="pass-button-evo_is_number"]').click();
    cy.get('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]').type(tamperSealNumber);
    cy.get('[data-testid="pass-button-tamper_seal_match"]').click();
    common.ClickPrimaryActionButton();
  },

  manufacturingTransferProductToStorage: coi => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Transfer Product to Intermediary or Final LN2 Storage');
    cy.get('[data-testid="cassette-1-input"]').type(`${coi}-PRC-01`);
    cy.get('[data-testid="cassette-1-button"]').click();
    cy.wait('@labelVerifications');
    cy.get('[data-testid="ln-2-shipper-1-input"]').type(`${coi}`);
    cy.get('[data-testid="ln-2-shipper-1-button"]').click();
    cy.wait('@labelVerifications');
    cy.get('[data-testid="bag-identifier-1-input"]').type(`${coi}-PRC-01`);
    cy.get('[data-testid="bag-identifier-1-button"]').click();
    cy.wait('@labelVerifications');
    common.ClickPrimaryActionButton();
  },
  manufacturingTransferProductToStorage2: coi => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Transfer Product to Intermediary or Final LN2 Storage');
    common.ClickPrimaryActionButton();
  },
  manufacturingProductReceipt: patientData => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Product Receipt');
    cy.get('[data-testid="patient-id-input-field"]').type(patientData.subjectNumber);
    cy.get('[data-testid="pass-button-ambient_temperature"]').click();
    cy.get('[data-testid="pass-button-seal_in_place"]').click();
    cy.get('[data-testid="pass-button-expected_condition"]').click();
    cy.get('[data-testid="pass-button-free_from_cracks"]').click();
    cy.get('[data-testid="pass-button-placed_into_storage"]').click();
    cy.get('[data-testid="patient-id-action-trigger-button"]').click();
    common.ClickPrimaryActionButton();
  },

  manufacturingStart: () => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Manufacturing Start');
    cy.get('[id="#/properties/data/properties/is_confirmed"]').click();
    common.ClickPrimaryActionButton();
  },

  manufacturingLotNumber: () => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Select Expiry Data');
    cy.get('[id="#/properties/lot_number-input"]').type("lot number");
    cy.get('input[id="#/properties/item_expiry_date-input"]').type(date).blur();
    cy.get('input[id="#/properties/item_expiry_date-input"]').clear();
    cy.wait(3000);
    cy.get('input[id="#/properties/item_expiry_date-input"]').type(date).blur();
    cy.get('[id="#/properties/item_count-input"]').type('1');
    common.ClickPrimaryActionButton();
  },

  manufacturingFinalLabels: () => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Print Final Product Labels');
    cy.get('[id="#/properties/data/properties/is_confirmed"]').click();
    common.ClickPrimaryActionButton();
    common.singleSignature();
    common.ClickPrimaryActionButton();
  },
  manufacturingLabelApplication: coi => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Print Final Product Labels');
    cy.get('[data-testid="left-button-radio"]').click();
    cy.get('[id="#/properties/data/properties/is_confirmed"]').click();
    common.ClickPrimaryActionButton();
    cy.get('[data-testid="bag-identifier-1-input"]').type(`${coi}-FPS-01`);
    cy.get('[data-testid="bag-identifier-1-button"]').click();
    cy.wait('@labelVerifications');
    cy.get('[data-testid="cassette-1-input"]').type(`${coi}-FPS-01`);
    cy.get('[data-testid="cassette-1-button"]').click();
    cy.wait('@labelVerifications');
    cy.get('[id="#/properties/data/properties/destruction_confirmed"]').click();
    common.ClickPrimaryActionButton();
  },
  manufacturingLabelApplicationCCLPUS: coi => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Confirmation of Label Application');
    cy.get('[data-testid="bag-identifier-1-input"]').type(`${coi}-FPS-01`);
    cy.get('[data-testid="bag-identifier-1-button"]').click();
    cy.wait('@labelVerifications');
    cy.get('[data-testid="cassette-1-input"]').type(`${coi}-FPS-01`);
    cy.get('[data-testid="cassette-1-button"]').click();
    cy.wait('@labelVerifications');
    cy.get('[id="#/properties/data/properties/destruction_confirmed"]').click();
    common.ClickPrimaryActionButton();
  },
  manufacturingLabelApplicationIS: coi => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Confirmation of Label Application');
    cy.get('[data-testid="bag-identifier-1-input"]').type(`${coi}-FPS-01`);
    cy.get('[data-testid="bag-identifier-1-button"]').click();
    cy.wait('@labelVerifications');
    cy.get('[data-testid="cassette-1-input"]').type(`${coi}-FPS-01`);
    cy.get('[data-testid="cassette-1-button"]').click();
    cy.wait('@labelVerifications');
    cy.get('[data-testid="hebrew-cassette-1-input"]').type(`${coi}-FPS-01`);
    cy.get('[data-testid="hebrew-cassette-1-button"]').click();
    cy.wait('@labelVerifications');
    cy.get('[id="#/properties/data/properties/destruction_confirmed"]').click();
    common.ClickPrimaryActionButton();
  },

  manufacturingConfirLabelApplication: () => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Confirmation of Label Application');
    cy.get('[data-testid="left-button-radio"]').click();
    cy.get('[id="#/properties/data/properties/is_confirmed"]').click();
    common.ClickPrimaryActionButton();
    cy.get('[id="#/properties/data/properties/destruction_confirmed"]').click();
    common.ClickPrimaryActionButton();
  },

  manufacturingQualityRelease: () => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Quality Release');
    cy.get('[id="#/properties/data/properties/is_verified"]').click();
    common.ClickPrimaryActionButton();
    common.singleSignature();
    common.ClickPrimaryActionButton();
  },
  manufacturingBagSelection: () => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Bag Selection');
    cy.get('[data-testid="pass-button-0"]').click();
    common.ClickPrimaryActionButton();
  },
  manufacturingTransferProductToShipper: coi => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Transfer Product To Shipper');
    cy.get('[data-testid="pass-button-manufacturing_checklist_intact"]').click();
    cy.get('[data-testid="pass-button-manufacturing_checklist_temp_out_of_range"]').click();
    cy.get('[data-testid="cassette-1-input"]').type(`${coi}-FPS-01`);
    cy.get('[data-testid="cassette-1-button"]').click();
    cy.wait('@labelVerifications');
    cy.get("body").then($body => {
      if ($body.find('[data-testid="ln-2-shipper-1-input"]').length > 0) {
        cy.get('[data-testid="ln-2-shipper-1-input"]').then($header => {
          if ($header.is(':visible')) {
            cy.get('[data-testid="ln-2-shipper-1-input"]').type(coi);
            cy.get('[data-testid="ln-2-shipper-1-button"]').click();
            cy.wait('@labelVerifications');
            common.ClickPrimaryActionButton();
            return;
          }
        });
      } else {
        common.ClickPrimaryActionButton();
      }
    });
  },
  shippingManufacturing: (shippingRow, scope, subjectNumberInput, evoLast4Digits, tamperSealNumber) => {
    getManufAirWayBill(scope, shippingRow)
    cy.get('[id="#/properties/shipping_checklist/properties/subject_number-input"]').type(subjectNumberInput);
    cy.get('[data-testid="pass-button-investigational_product"]').click();
    cy.get('[data-testid="pass-button-cry_rack_label"]').click();
    cy.get('[id="#/properties/shipping_checklist/properties/evo_last_4_digits"]').type(evoLast4Digits);
    cy.get('[data-testid="pass-button-evo_airway_bill"]').click();
    cy.get('[data-testid="pass-button-red_wire_tamper_shipper"]').click();
    cy.get('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]').type(tamperSealNumber);
    cy.get('[data-testid="pass-button-tamper_seal_match"]').click();
    cy.get('[data-testid="pass-button-shipper_label_placed"]').click();
    cy.get('[data-testid="pass-button-consignee_kit_pouch_inside"]').click();
    cy.get('[data-testid="pass-button-zip_ties_secured"]').click();
    common.ClickPrimaryActionButton();
  },

  manufacturingSummaryVerify: (header) => {
    cy.get('[data-testid="h1-header"]').should('contain', header);
    common.doubleSignature(verifier);
    common.ClickPrimaryActionButton();
  }
};
