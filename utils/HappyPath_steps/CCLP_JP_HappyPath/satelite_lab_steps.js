import common from '../../../support/index.js';

const getSatAirWayBill = (scope, shippingRow, testId) => {
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
            cy.visit('/satellite_lab');
            cy.wait(3000)
            cy.contains(scope.coi).click();
            if (testId) {
                cy.get(`[id="${testId}"]`).type(scope.airWayBill);
            }
            else {
                cy.get('[data-testid="satellite-airway-bill-input-field"]').type(scope.airWayBill);
                cy.get('[data-testid="satellite-airway-bill-action-trigger-button"]').click();
            }
            cy.wait('@labelVerifications');
            cy.log('satLabAirWayBill', scope.airWayBill)
        });
}
export default {

    satLabCollectionSummary: () => {
        common.ClickPrimaryActionButton();
    },

    satLabVerifyShipment: (toSite, therapy, coi) => {
        cy.get(`[data-testid=ln-2-shipper-ship-bags-from-apheresis-site-to-${toSite}${therapy}-input-field]`).type(coi);
        cy.get(`[data-testid="ln-2-shipper-ship-bags-from-apheresis-site-to-${toSite}${therapy}-action-trigger-button"]`).click();
        cy.wait('@labelVerifications');
        common.ClickPrimaryActionButton();
    },

    satLabShipmentChecklist: coi => {
        cy.get('[data-testid=bag-identifier-1-input]').type(`${coi}-APH-01`);
        cy.get('[data-testid=bag-identifier-1-button]').click();
        cy.get('[data-testid=pass-button-does_temperature_conform]').click();
        cy.get('[data-testid=fail-button-cry_aph_bag]').click();
        cy.get('[data-testid="#/properties/shipping_receipt_checklist/properties/cry_aph_bag_reason-input"]').type('some text');
        cy.get('[data-testid=pass-button-cold_shipper]').click();
        common.ClickPrimaryActionButton();
    },

    satLabShipmentChecklistSummary: () => {
        const verifier = 'quela@vineti.com';
        common.doubleSignature(verifier);
        common.ClickPrimaryActionButton();
    },

    satLabCryopreservation: (itemCount) => {
        cy.get('input[id="#/properties/item_count-input"]').type(itemCount);
        common.ClickPrimaryActionButton();
    },

    satLabCryopreservationLabels: coi => {
        cy.get('[data-testid="txt-field-layout-Confirm labels are printed successfully-answer"]')
            .find('svg')
            .click()
        cy.get('[data-testid=cassette-1-input]').type(`${coi}-PRC-01`);
        cy.get('[data-testid=cassette-1-button]').click();
        cy.wait('@labelVerifications');
        cy.get('[data-testid=bag-identifier-1-input]').type(`${coi}-PRC-01`);
        cy.get('[data-testid=bag-identifier-1-button]').click();
        cy.wait('@labelVerifications');
        cy.get('[data-testid="txt-field-layout-Verify labels have been attached to all collection bags-answer"]')
            .find('svg')
            .click()
        common.ClickPrimaryActionButton();
        common.singleSignature();
        common.ClickPrimaryActionButton();
    },

    satLabBagStorageEU: coi => {
        cy.wait(2000)
        cy.get('[data-testid=bag-identifier-1-input]').type(`${coi}-PRC-01`);
        cy.get('[data-testid=bag-identifier-1-button]').click();
        cy.wait('@labelVerifications');
        common.ClickPrimaryActionButton();

    },

    satLabBagStorage: coi => {
        cy.wait(2000)
        cy.get('[data-testid=cassette-1-input]').type(`${coi}-PRC-01`);
        cy.get('[data-testid=cassette-1-button').click();
        cy.wait('@labelVerifications');
        common.ClickPrimaryActionButton();
    },

    satLabCryopreservationData: (maskedInputControl, totalCells, productVolume, coi) => {
        cy.get('[data-testid=masked-input-control]').type(maskedInputControl);
        cy.get('[data-testid=bag-identifier-1-input]').type(`${coi}-PRC-01`);
        cy.get('[data-testid=bag-identifier-1-button]').click();
        cy.wait('@labelVerifications');
        cy.get('input[id="#/properties/custom_fields/properties/total_cells-input"]').type(totalCells);
        cy.get('input[id="#/properties/product_volume-input"]').type(productVolume);
        common.ClickPrimaryActionButton();
    },

    satLabCryopreservationSummary: () => {
        const verifier = 'quela@vineti.com';
        common.doubleSignature(verifier);
        common.ClickPrimaryActionButton();
    },

    satLabPrintShipperLabels: () => {
        cy.get("body").then($body => {
            if ($body.find('[data-testid="txt-field-layout-Confirm labels are printed successfully-answer"]').length > 0) {
                cy.get('[data-testid="txt-field-layout-Confirm labels are printed successfully-answer"]').then($header => {
                    if ($header.is(':visible')) {
                        cy.get('[data-testid="txt-field-layout-Confirm labels are printed successfully-answer"]').click();
                    }
                });
            } else {
                cy.get('[id="#/properties/data/properties/is_confirmed"]')
                    .find('svg')
                    .click()
            }
        });
        common.ClickPrimaryActionButton();
        common.singleSignature();
        common.ClickPrimaryActionButton();
    },

    satLabBagSelection: () => {
        cy.get('[data-testid=pass-button-0]').click();
        common.ClickPrimaryActionButton();
    },

    satLabTransferProductToShipper: (therapy, coi) => {
        cy.get('[data-testid="cassette-1-input"]').type(`${coi}-PRC-01`);
        cy.get('[data-testid="cassette-1-button"]').click();
        cy.get('[data-testid="pass-button-case_intact_1"').click();
        cy.get('[data-testid="pass-button-temp_out_of_range_1"').click();
        cy.wait('@labelVerifications');
        cy.get('[data-testid="ln-2-shipper-1-input"]').type(`${coi}`);
        cy.get('[data-testid="ln-2-shipper-1-button"]').click();
        cy.wait('@labelVerifications');
        cy.get('[data-testid="pass-button-ambient_temperature_exposure"').click();
        cy.get('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"').click();
        common.ClickPrimaryActionButton();
    },


    satLabShippingChecklistEU: (shippingRow, evoLast4Digits, tamperSealNumber, scope) => {
        cy.get('[data-testid="h1-header"]').should('contain', 'Shipment Checklist');
        getSatAirWayBill(scope, shippingRow)
        cy.wait(1000)
        cy.wait('@labelVerifications');
        cy.get('input[id="#/properties/shipping_checklist/properties/evo_is_id-input"]').type(evoLast4Digits);
        cy.get('input[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]').type(tamperSealNumber);
        cy.get('[data-testid="pass-button-evo_airway_bill"]').click();
        cy.get('[data-testid="pass-button-shipper_label_placed"]').click();
        cy.get('[data-testid="pass-button-red_wire"]').click();
        cy.get('[data-testid="pass-button-tamper_seal_match"]').click();
        cy.get('[data-testid=pass-button-consignee_kit_pouch_inside]').click();
        cy.get('[data-testid=pass-button-zip_ties_secured]').click();
        common.ClickPrimaryActionButton();
    },

    satLabShippingChecklist: (shippingRow, evoLast4Digits, tamperSealNumber, scope, testId) => {
        getSatAirWayBill(scope, shippingRow, testId)
        cy.get('[data-testid="h1-header"]').should('contain', 'Shipment Checklist');
        cy.wait(1000)
        cy.wait('@labelVerifications');
        cy.get('input[id="#/properties/shipping_checklist/properties/evo_is_id-input"]').type(evoLast4Digits);
        cy.get('input[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]').type(tamperSealNumber);
        cy.get('[data-testid="pass-button-evo_airway_bill"]').click();
        cy.get('[data-testid="pass-button-shipper_label_placed"]').click();
        cy.get('[data-testid="pass-button-red_wire"]').click();
        cy.get('[data-testid="pass-button-tamper_seal_match"]').click();
        cy.get('[data-testid=pass-button-consignee_kit_pouch_inside]').click();
        cy.get('[data-testid=pass-button-zip_ties_secured]').click();
        common.ClickPrimaryActionButton();
    },

    satSummaryVerify: () => {
        const verifier = 'quela@vineti.com';
        common.doubleSignature(verifier);
        common.ClickPrimaryActionButton();
    },
}