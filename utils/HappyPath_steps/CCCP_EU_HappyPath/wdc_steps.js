import common from '../../../support/index.js';

const getWDCAirWayBillEmea = (scope, shippingRow) => {
    common.loginAs('oliver');
    cy.visit('/ordering');
    cy.wait(8000)
    cy.get('td[data-testid="patient-identifier"]')
        .contains(scope.patientInformation.patientId)
        .click();
    cy.get('[data-testid="td-stage-plane-icon"]').eq(shippingRow).parent().parent().parent().find('[data-testid="td-stage-site-details"]')
        .invoke('text')
        .then((text) => {
            scope.airWayBill = text.substring(9, text.length)
            common.loginAs('steph');
            cy.visit('/wdc');
            cy.contains(scope.coi).click();
            cy.get('[data-testid=wdc-airway-bill-input-field]').type(scope.airWayBill);
            cy.get('[data-testid=wdc-airway-bill-action-trigger-button]').click();
            cy.wait('@labelVerifications');
            cy.log('wdcAirWayBill', scope.airWayBill)
        });
}
const getWDCAirWayBill = (scope, shippingRow) => {
    common.loginAs('oliver');
    cy.visit('/ordering');
    cy.wait(8000)
    cy.get('td[data-testid="patient-identifier"]')
        .contains(scope.patientInformation.subjectNumber)
        .click();
    cy.get('[data-testid="td-stage-plane-icon"]').eq(shippingRow).parent().parent().parent().find('[data-testid="td-stage-site-details"]')
        .invoke('text')
        .then((text) => {
            scope.airWayBill = text.substring(9, text.length)
            common.loginAs('steph');
            cy.visit('/wdc');
            cy.contains(scope.coi).click();
            cy.get('[data-testid=wdc-airway-bill-input-field]').type(scope.airWayBill);
            cy.get('[data-testid=wdc-airway-bill-action-trigger-button]').click();
            cy.wait('@labelVerifications');
            cy.log('wdcAirWayBill', scope.airWayBill)
        });
}
export default {

    wdcVerifyShipper: (therapy, coi) => {
        cy.get(`[data-testid=ln-2-shipper-ship-bags-from-manufacturing-site-to-world-distribution-center${therapy}-input-field]`).type(`${coi}`);
        cy.get(`[data-testid=ln-2-shipper-ship-bags-from-manufacturing-site-to-world-distribution-center${therapy}-action-trigger-button]`).click();
        cy.get('[id="#/properties/item_count-input"]').type(1)
        common.ClickPrimaryActionButton();
    },

    wdcShipmentReceiptChecklist: (evoLast4Digits, tamperSealNumber) => {
        cy.get('[data-testid="h1-header"]').should('contain', 'Shipment Receipt Checklist');
        cy.get('[data-testid=pass-button-shipping_container_condition]').click();
        cy.get('[data-testid=pass-button-zip_ties_secured_no_case]').click();
        cy.get('[data-testid=pass-button-temperature_monitor]').click();
        cy.get('[data-testid=pass-button-consignee_pouch_inside]').click();
        cy.get('[data-testid=pass-button-shipper_label]').click();
        cy.get('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]').type(evoLast4Digits);
        cy.get('[data-testid=pass-button-evo_match]').click();
        cy.get('[data-testid=pass-button-red_wire_tamper_seal]').click();
        cy.get('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]').type(tamperSealNumber);
        cy.get('[data-testid=pass-button-tamper_seal_match]').click();
        common.ClickPrimaryActionButton();
    },

    wdcTransferProductToStorage: coi => {
        cy.get('[data-testid="h1-header"]').should('contain', 'Transfer Product To Storage');
        cy.get('[data-testid="ln-2-shipper-1-input"]').type(`${coi}`);
        cy.get('[data-testid="ln-2-shipper-1-button"]').click();
        cy.wait('@labelVerifications');
        cy.get('[data-testid="cassette-1-input"]').type(`${coi}-FPS-01`);
        cy.get('[data-testid="cassette-1-button"]').click();
        cy.wait('@labelVerifications');
        common.ClickPrimaryActionButton();
    },

    wdcTransferProductToStorageEmea: coi => {
        cy.get('[data-testid="h1-header"]').should('contain', 'Transfer Product To Storage');
        cy.get('[data-testid="ln-2-shipper-1-input"]').type(`${coi}`);
        cy.get('[data-testid="ln-2-shipper-1-button"]').click();
        cy.wait('@labelVerifications');
        cy.get('[data-testid="cassette-1-input"]').type(`${coi}-FP-01`);
        cy.get('[data-testid="cassette-1-button"]').click();
        cy.wait('@labelVerifications');
        common.ClickPrimaryActionButton();
    },

    wdcProductReceipt: (pisNumber) => {
        cy.get('[data-testid="h1-header"]').should('contain', 'Product Receipt');
        cy.get('[data-testid=pass-button-investigational_product]').click();
        cy.get('[data-testid=pass-button-seal_in_place]').click();
        cy.get('[data-testid=pass-button-expected_condition]').click();
        cy.get('[data-testid=pass-button-vapor_phase]').click();
        cy.get('[id="#/properties/product_receipt_checklist/properties/pis_number-input"]').type(pisNumber);
        cy.get('[data-testid=pass-button-expiry_match]').click();
        common.ClickPrimaryActionButton();
    },

    wdcProductReceiptEmea: (pisNumber) => {
        cy.get('[data-testid="h1-header"]').should('contain', 'Product Receipt');
        cy.get('[data-testid=pass-button-cart_product]').click();
        cy.get('[data-testid=pass-button-seal_in_place]').click();
        cy.get('[data-testid=pass-button-temperature_monitor]').click();
        cy.get('[data-testid=pass-button-expected_condition]').click();
        cy.get('[data-testid=pass-button-vapor_phase]').click();
        cy.get('[id="#/properties/product_receipt_checklist/properties/pis_number-input"]').type(pisNumber);
        common.ClickPrimaryActionButton();
    },

    wdcPrintShipperLabels: () => {
        cy.get('[id="#/properties/data/properties/is_confirmed"]').click();
        common.ClickPrimaryActionButton();
        common.singleSignature();
        common.ClickPrimaryActionButton();
    },

    wdcQualityRelease: () => {
        cy.get('[id="#/properties/data/properties/is_verified"]').click();
        common.ClickPrimaryActionButton();
        common.singleSignature();
        common.ClickPrimaryActionButton();
    },

    wdcScheduleFinalProductShipment: (schedulingSteps, procedureName) => {
        cy.log('schedule date');
        cy.wait(6000)
        cy.get(`[data-testid="btn-next-${procedureName}"]`).click();
        cy.wait('@schedulingServiceAvailability');
        cy.wait(6000)
        cy.get(`[data-testid="btn-next-${procedureName}"]`).click();
        cy.wait('@schedulingServiceAvailability');
        cy.wait(7000)
        schedulingSteps.scheduleDate(procedureName, 10, true);
        cy.log('passed schedule date');
        common.ClickPrimaryActionButton();
    },

    wdcTransferProductToShipper: coi => {
        cy.get('[data-testid=pass-button-container_damaged]').click();
        cy.get('[data-testid=pass-button-container_secured]').click();
        cy.get('[data-testid=pass-button-tempreture_alarm]').click();
        cy.get('[data-testid=pass-button-shipper_kit_pouch_included]').click();
        cy.get('[data-testid="cassette-1-input"]').type(`${coi}-FPS-01`);
        cy.get('[data-testid="cassette-1-button"]').click();
        cy.wait('@labelVerifications');
        cy.get('[data-testid="ln-2-shipper-1-input"]').type(`${coi}`);
        cy.get('[data-testid="ln-2-shipper-1-button"]').click();
        cy.wait('@labelVerifications');
        common.ClickPrimaryActionButton();
    },

    wdcTransferProductToShipperEmeaCcdc: coi => {
        cy.get('[data-testid=pass-button-container_damaged]').click();
        cy.get('[data-testid=pass-button-tempreture_alarm]').click();
        cy.get('[data-testid=pass-button-shipper_kit_pouch_included]').click();
        cy.get('[data-testid="cassette-1-input"]').type(`${coi}-FP-01`);
        cy.get('[data-testid="cassette-1-button"]').click();
        cy.wait('@labelVerifications');
        cy.get('[data-testid="ln-2-shipper-1-input"]').type(`${coi}`);
        cy.get('[data-testid="ln-2-shipper-1-button"]').click();
        cy.wait('@labelVerifications');
        common.ClickPrimaryActionButton();
    },

    wdcShipping: (shippingRow, scope, evoLast4Digits, tamperSealNumber) => {
        getWDCAirWayBill(scope, shippingRow)
        cy.get('[data-testid=pass-button-confirm_not_exposed]').click();
        cy.get('[data-testid=pass-button-awb_match]').click();
        cy.get('[id="#/properties/shipping_checklist/properties/evo_last_4_digits_wdc-input"]').clear().first().type(evoLast4Digits);
        cy.get('[data-testid=pass-button-evo_airway_bill_wdc]').click();
        cy.get('[id="#/properties/shipping_checklist/properties/tamper_seal_number_wdc-input"]').clear().first().type(tamperSealNumber);
        cy.get('[data-testid=pass-button-tamper_seal_number_listed]').click();
        cy.get('[data-testid=pass-button-red_wire_tamper]').click();
        cy.get('[data-testid=pass-button-red_wire_tamper_shipper]').click();
        cy.get('[data-testid=pass-button-shipper_label_placed_wdc]').click();
        cy.get('[data-testid=pass-button-consignee_kit_pouch_inside]').click();
        cy.get('[data-testid=pass-button-qp_release_added]').click();
        cy.get('[data-testid=pass-button-secured_container]').click();
        common.ClickPrimaryActionButton();
    },

    wdcShippingEmeaCcdc: (shippingRow, scope, evoLast4Digits, tamperSealNumber) => {
        getWDCAirWayBillEmea(scope, shippingRow);
        cy.get('[data-testid=pass-button-confirm_not_exposed]').click();
        cy.get('[id="#/properties/shipping_checklist/properties/evo_last_4_digits_wdc-input"]').clear().first().type(evoLast4Digits);
        cy.get('[data-testid=pass-button-evo_airway_bill_wdc]').click();
        cy.get('[id="#/properties/shipping_checklist/properties/tamper_seal_number_wdc-input"]').clear().first().type(tamperSealNumber);
        cy.get('[data-testid=pass-button-tamper_seal_number_listed]').click();
        cy.get('[data-testid=pass-button-red_wire_tamper]').click();
        cy.get('[data-testid=pass-button-red_wire_tamper_shipper]').click();
        cy.get('[data-testid=pass-button-shipper_label_placed_wdc]').click();
        cy.get('[data-testid=pass-button-consignee_kit_pouch_inside]').click();
        cy.get('[data-testid=pass-button-secured_container]').click();
        common.ClickPrimaryActionButton();
    },

    wdcSummary: () => {
        const verifier = 'quela@vineti.com';
        common.doubleSignature(verifier);
        common.ClickPrimaryActionButton();
    }


}
