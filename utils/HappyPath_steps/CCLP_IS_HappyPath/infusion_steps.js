import common from '../../../support/index.js';

export default {

  infusionReceiveShipment: (fromSite, therapy, coi) => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Receive Shipment');
    cy.get(`[data-testid="ln-2-shipper-ship-bags-from-${fromSite}-to-infusion${therapy}-input-field"]`).type(coi);
    cy.get(`[data-testid="ln-2-shipper-ship-bags-from-${fromSite}-to-infusion${therapy}-action-trigger-button"]`).click();
    cy.wait('@labelVerifications');
    common.ClickPrimaryActionButton();
  },
  infusionShipmentReceiptChecklist: (evoLast4Digits, tamperSealNumber) => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Shipment Receipt Checklist');
    cy.get('[data-testid="pass-button-shipping_container_condition"]').click();
    cy.get('[data-testid="pass-button-zip_ties_secured"]').click();
    cy.get('[data-testid="pass-button-included_shipper_label"]').click();
    cy.get('[data-testid="pass-button-consignee_pouch_inside"]').click();
    // cy.get('[data-testid="pass-button-red_wire_tamper_seal"]').click();
    cy.get('[data-testid="pass-button-evo_match"]').click();
    cy.get('[data-testid="pass-button-red_wire_tamper_seal"]').click();
    cy.get('[data-testid="pass-button-tamper_seal_match"]').click();
    cy.get('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]').type(evoLast4Digits);
    cy.get('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]').type(tamperSealNumber);
    common.ClickPrimaryActionButton();
  },
  infusionShipmentReceiptSummary: () => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Shipment Receipt Summary');
    const verifier = 'phil3@vineti.com';
    common.doubleSignature(verifier);
    common.ClickPrimaryActionButton();
  },

  infusionQualityRelease: () => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Quality Release');
    cy.get('[id="#/properties/data/properties/is_verified"]').click();
    common.ClickPrimaryActionButton();
    common.singleSignature();
    common.ClickPrimaryActionButton();
  },

  infusionTransferProductToStorage: (coi, isFpStored = true) => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Transfer Product To Storage');
    if (isFpStored) {
      cy.get('[id="#/properties/custom_fields/properties/how_fp_stored"]')
        .eq(1)
        .select('Local LN2 storage');
    }
    cy.get('[data-testid="cassette-1-input"]').type(`${coi}-FPS-01`);
    cy.get('[data-testid="cassette-1-button"]').click();
    cy.wait('@labelVerifications');
    cy.get('[data-testid="ln-2-shipper-1-input"]').type(`${coi}`);
    cy.get('[data-testid="ln-2-shipper-1-button"]').click();
    cy.wait('@labelVerifications');
    common.ClickPrimaryActionButton();
  },
  infusionProductReceiptChecklist: () => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Product Receipt Checklist');
    cy.get('[data-testid="pass-button-investigational_product"]').click();
    cy.get('[data-testid="pass-button-temperature_out_of_range"]').click();
    cy.get('[data-testid="pass-button-seal_in_place"]').click();
    cy.get('[data-testid="pass-button-expected_condition"]').click();
    cy.get('[data-testid="pass-button-placed_into_storage"]').click();
    common.ClickPrimaryActionButton();
  },
  infusionProductReceiptSummary: () => {
    cy.get('[data-testid="h1-header"]').should('contain', 'Product Receipt Summary');
    const verifier = 'phil3@vineti.com';
    common.doubleSignature(verifier);
    common.ClickPrimaryActionButton();
  }
}