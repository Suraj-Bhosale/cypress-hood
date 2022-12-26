import common from '../../../support/index';
import assertions from '../../../fixtures/assertions.json';
import inputs from '../../../fixtures/inputs.json';

export const getCollAirWayBill = (scope, testId) => {
  common.loginAs('oliver');
  cy.visit('/ordering');
  cy.get('td[data-testid="patient-identifier"]')
    .contains(scope.patientInformation.subjectNumber)
    .click();
  cy.get('[data-testid="td-stage-plane-icon"]').eq(0).parent().parent().parent().find('[data-testid="td-stage-site-details"]')
    .invoke('text')
    .then((text) => {
      scope.airWayBill = text.substring(9, text.length)
      common.loginAs('phil');
      cy.visit('/collection');
      cy.wait(3000)
      common.loadCollection();
      cy.get(`tr[data-testid="treatment-${scope.coi}"]`).click();
      if (testId) {
        cy.get(`[data-testid="${testId}"]`).type(scope.airWayBill);
      } else {
        cy.get('[data-testid="collection-airway-bill-input-field"]').type(scope.airWayBill);
        cy.get('[data-testid="collection-airway-bill-action-trigger-button"]').click();
      }
      cy.wait('@labelVerifications');
      cy.log('collectionAirwayBill', scope.airWayBill)
    });
}
export default {
  centralLabelPrinting: () => {
    cy.get("[data-testid='h1-header']").should('contain', assertions.centralLabelPrinting);
    cy.get("body").then($body => {
      if ($body.find('[id="#/properties/data/properties/is_collection_labels_confirmed"]').length > 0) {
        //evaluates as true if button exists at all
        cy.get('[id="#/properties/data/properties/is_collection_labels_confirmed"]').then($header => {
          if ($header.is(':visible')) {
            cy.get('[id="#/properties/data/properties/is_collection_labels_confirmed"]').click();
          }
        });
      }
    });
    cy.get("body").then($body => {
      if ($body.find('[id="#/properties/data/properties/is_cryopreservation_labels_confirmed"]').length > 0) {
        //evaluates as true if button exists at all
        cy.get('[id="#/properties/data/properties/is_cryopreservation_labels_confirmed"]').then($header => {
          if ($header.is(':visible')) {
            cy.get('[id="#/properties/data/properties/is_cryopreservation_labels_confirmed"]').click();
          }
        });
      }
    });
    cy.get('[id="#/properties/data/properties/is_shipper_labels_confirmed"]').click();
    common.ClickPrimaryActionButton();
    common.singleSignature();
    common.ClickPrimaryActionButton();
  },

  labelShipping: () => {
    cy.get("[data-testid='h1-header']").should('contain', assertions.labelShipping);
    common.singleSignature();
    common.ClickPrimaryActionButton();
  },

  patientVerification: () => {
    common.doubleSignature(inputs.verifier[0]);
    common.ClickPrimaryActionButton();
  },

  collectionBagIdentification: (region = '') => {
    cy.get('[data-test-id="collection_bag_1_identification"] h1').should(
      'contain',
      assertions.collectionBagIdentification
    );
    cy.get('[data-testid="patientInformationHeader.subject_number-value"]').contains(/\d{4}/);
    cy.get('[data-testid="txt-field-layout-Scan or enter the DIN/SEC-DIS/Apheresis ID."]')
      .first()
      .should('contain', assertions.clUDNDescription);
    cy.get('[data-testid=primary-button-action]').should('be.disabled');
    cy.get('[data-test-id="collection_bag_1_identification"] h3').should(
      'contain',
      assertions.collectionBagSectionHeader
    );
    cy.get('[data-testid="#/properties/custom_fields/properties/din_entry-input"]')
      .first()
      .clear()
      .type(inputs.clUDN);
    cy.get("body").then($body => {
      if ($body.find('[id="#/properties/custom_fields/properties/pre_collection_label_applied"]').length > 0) {
        //evaluates as true if button exists at all
        cy.get('[id="#/properties/custom_fields/properties/pre_collection_label_applied"]').then($header => {
          if ($header.is(':visible')) {
            cy.get('[id="#/properties/custom_fields/properties/pre_collection_label_applied"]').click();
          }
        });
      }
    });

    cy.get('input[id="#/properties/apheresis_date-input"]').type(inputs.apheresisDate).blur();
    common.ClickPrimaryActionButton();
  },

  collectionBagLabel: () => {
    cy.get('[data-testid="patientInformationHeader.subject_number-value"]').contains(/\d{4}/);
    cy.get('[id="#/properties/data/properties/is_verified"]').click();
    common.ClickPrimaryActionButton();
    common.singleSignature();
    common.ClickPrimaryActionButton();
  },

  collectionBagLabelCentralPrinting: () => {
    //cy.get('[data-testid="patientInformationHeader.subject_number-value"]').contains(/\d{4}/);
    cy.get('[id="#/properties/data/properties/is_confirmed"]').click();
    cy.get('[id="#/properties/data/properties/is_verified"]').click();
    common.ClickPrimaryActionButton();
    common.singleSignature();
    common.ClickPrimaryActionButton();
  },

  collectionProcedureInformation: () => {
    // cy.get('[data-testid="pass-button-cbc_collected"]').click();
    cy.get('[id="#/properties/patient_weight-input"]').type(inputs.patientWeight);
    common.ClickPrimaryActionButton();
  },
  bagDataEntryDay: coi => {
    cy.get('[data-testid="bag-1-identifier-input-field"]').type(`${coi}-APH-01`);
    cy.get('[data-testid="bag-1-identifier-action-trigger-button"]').click();
    cy.wait('@labelVerifications');
    cy.get('[id="#/properties/collected_product_volume-input"]').type(inputs.collectedProductVolume);
    cy.get('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]').type(inputs.wholeBloodProcessed);
    cy.get('[data-testid="#/properties/anticoagulant_type-input"]').type(inputs.anticoagulantType);
    cy.get('[id="#/properties/anticoagulant_volume-input"]').type(inputs.anticoagulantVolume);
    cy.get('[id="collection_start_time"]').type(inputs.collectionStartTime);
    cy.get('[id="collection_end_time"]').type(inputs.collectionEndTime);
    common.ClickPrimaryActionButton();
  },
  collectionSummary: () => {
    cy.get('[data-test-id="collection_collection_summary"] h1').should(
      'contain',
      assertions.collectionSummary
    );
    common.doubleSignature(inputs.verifier[0]);
    common.ClickPrimaryActionButton();
  },

  changeOfCustody: coi => {
    cy.get('[data-testid="bag-1-identifier-input-field"]').type(`${coi}-APH-01`);
    cy.get('[data-testid="bag-1-identifier-action-trigger-button"]').click();
    common.ClickPrimaryActionButton();
    common.singleSignature();
    common.ClickPrimaryActionButton();
  },
  confirmChangeOfCustody: coi => {
    cy.get('[data-testid="bag-1-identifier-input-field"]').type(`${coi}-APH-01`);
    cy.get('[data-testid="bag-1-identifier-action-trigger-button"]').click();
    common.ClickPrimaryActionButton();
    common.singleSignature();
    common.ClickPrimaryActionButton();
  },
  confirmNumberofBags: () => {
    cy.get('[id="#/properties/item_count-input"]').type(inputs.itemCount);
    common.ClickPrimaryActionButton();
  },
  shipperLabels: coi => {
    cy.get('[data-testid="bag-identifier-1-input"]').type(`${coi}-PRC-01`);
    cy.get('[data-testid="bag-identifier-1-button"]').click();
    cy.wait('@labelVerifications');
    cy.get('[data-testid="cassette-1-input"]').type(`${coi}-PRC-01`);
    cy.get('[data-testid="cassette-1-button"]').click();
    cy.wait('@labelVerifications');
    //cy.get('[id="#/properties/data/properties/is_confirmed"]').click();
    cy.get("body").then($body => {
      if ($body.find('[id="#/properties/data/properties/is_confirmed"]').length > 0) {
        //evaluates as true if button exists at all
        cy.get('[id="#/properties/data/properties/is_confirmed"]').then($header => {
          if ($header.is(':visible')) {
            cy.get('[id="#/properties/data/properties/is_confirmed"]').click();
          }
        });
      }
    });
    common.ClickPrimaryActionButton();
  },

  collectionBagStorage: coi => {
    cy.get('[data-testid="bag-identifier-1-input"]').type(`${coi}-PRC-01`);
    cy.get('[data-testid="bag-identifier-1-button"]').click();
    cy.wait('@labelVerifications');
    common.ClickPrimaryActionButton();
  },

  cryopreservationData: coi => {
    cy.get('[data-testid="bag-identifier-1-input"]').type(`${coi}-PRC-01`);
    cy.get('[data-testid="bag-identifier-1-button"]').click();
    cy.wait('@labelVerifications');
    cy.get('[id="#/properties/custom_fields/properties/cell_concentration-input"]').type("222");
    cy.get('[id="#/properties/custom_fields/properties/total_cells-input"]').type(inputs.totalCells);
    cy.get('[id="#/properties/product_volume-input"]').type(inputs.productVolume);
    common.ClickPrimaryActionButton();
  },

  cryopreservationDataLocal: coi => {
    cy.get('[data-testid="bag-identifier-1-input"]').type(`${coi}-PRC-01`);
    cy.get('[data-testid="bag-identifier-1-button"]').click();
    cy.wait('@labelVerifications');
    cy.get('[id="#/properties/custom_fields/properties/total_cells-input"]').type(inputs.totalCells);
    cy.get('[id="#/properties/product_volume-input"]').type(inputs.productVolume);
    common.ClickPrimaryActionButton();
  },
  cryopreservationSummary: () => {
    cy.get('[data-testid="h1-header"]').should('contain', assertions.cryopreservationSummary);
    common.doubleSignature(inputs.verifier[1]);
    common.ClickPrimaryActionButton();
  },

  cryopreservationBagSelection: () => {
    cy.get('[data-testid="h1-header"]').should('contain', assertions.bagSelection);
    cy.get('[data-testid="pass-button-0"]').click();
    common.ClickPrimaryActionButton();
  },
  //lccp
  cryopreservationTransferProductToShipper: (coi) => {
    cy.get('[data-testid="h1-header"]').should('contain', assertions.transferProductToShipper);
    // cy.get('[data-testid='+input+']').type(coi);
    // cy.get('[data-testid='+button+']').click();
    cy.get('[data-testid="cassette-1-input"]').type(`${coi}-PRC-01`);
    cy.get('[data-testid="cassette-1-button"]').click();
    cy.get('[data-testid="pass-button-case_intact_1"').click();
    cy.get('[data-testid="pass-button-temp_out_of_range_1"').click();
    cy.wait('@labelVerifications');
    cy.get('[data-testid="ln-2-shipper-1-input"]').type(`${coi}`);
    cy.get('[data-testid="ln-2-shipper-1-button"]').click();
    cy.wait('@labelVerifications');
    cy.get('[data-testid="pass-button-ambient_temperature_exposure"').click();
    cy.get('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]').click();
    common.ClickPrimaryActionButton();
  },

  cryopreservationShipmentChecklist: scope => {
    getCollAirWayBill(scope)
    cy.get('[data-testid="h1-header"]').should('contain', assertions.shipmentChecklist);

    cy.get('[data-testid="#/properties/shipping_checklist/properties/evo_is_id-input"]').type(1234);
    cy.get('[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]').type(1234);
    cy.get('[data-testid="pass-button-evo_airway_bill"]').click();
    cy.get('[data-testid="pass-button-red_wire"]').click();
    cy.get('[data-testid="pass-button-tamper_seal_match"]').click();
    cy.get('[data-testid="pass-button-shipper_label_placed"]').click();
    cy.get('[data-testid="pass-button-consignee_kit_pouch_inside"]').click();
    cy.get('[data-testid="pass-button-zip_ties_secured"]').click();
    common.ClickPrimaryActionButton();
  },

  cryopreservationShippingSummary: () => {
    //const confirmerSelector = '[data-testid="shipping_summary-collection_shipping_summary-signature-block"]';
    //cy.get('[data-testid="h1-header"]').should('contain', assertions.shippingSummary);
    common.doubleSignature(inputs.verifier[1]);
    common.ClickPrimaryActionButton();
  },

  collectionTransferProductToShipper: (coi, input, button) => {
    cy.get('[data-testid="h1-header"]').should('contain', assertions.transferProductToShipper);
    cy.get('[data-testid=' + input + ']').type(coi);
    cy.get('[data-testid=' + button + ']').click();
    cy.wait('@labelVerifications');
    common.ClickPrimaryActionButton();
  },

  //is-cclp cryopreservationShipmentChecklist
  collectionShipmentChecklist: (scope, testId) => {
    getCollAirWayBill(scope, testId)

    cy.get('[data-testid="h1-header"]').should('contain', assertions.collectionShipmentChecklis);
    cy.wait('@labelVerifications');
    cy.get('[data-testid="pass-button-apheresis_not_exposed"]').click();
    cy.get('[data-testid="pass-button-temperature_monitor_active"]').click();

    cy.get("body").then($body => {
      if ($body.find('[data-testid=pass-button-idm_placed_into_shipper]').length > 0) {
        //evaluates as true if button exists at all
        cy.get('[data-testid=pass-button-idm_placed_into_shipper]').then($header => {
          if ($header.is(':visible')) {
            cy.get('[data-testid=pass-button-idm_placed_into_shipper]').click();
          }
        });
      }
    });
    common.ClickPrimaryActionButton();
  },

  //is-cclp, lccp cryopreservationShippingSummary
  collectionShippingSummary: () => {
    //cy.get('[data-testid="h1-header"]').should('contain', assertions.collectionShippingSummary);
    //const verifier = 'phil3@vineti.com';
    common.doubleSignature(inputs.verifier[1]);
    common.ClickPrimaryActionButton();
  },

}
