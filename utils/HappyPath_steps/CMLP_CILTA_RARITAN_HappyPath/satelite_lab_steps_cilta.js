import common from '../../../support/index.js';
import translationHelpers from '../../shared_block_helpers/translationHelpers';
import actionButtonHelper from '../../shared_block_helpers/actionButtonHelpers';
import satLabAssertions from '../../../fixtures/satelliteLab_assertions_cilta.json';
import inputs from '../../../fixtures/inputs.json';
import signatureHelpers from '../../shared_block_helpers/signatureHelpers';
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers.js';

const getSatAirWayBill = (scope, shippingRow, testId) => {
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

const getManAirWayBill = (scope, shippingRow, testId) => {
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
      cy.visit('/satellite_lab');
      cy.wait(3000)
      cy.contains(scope.coi).click();
      if (testId) {
        cy.get(`[id="${testId}"]`).type(scope.airWayBill);
      }
      else {
        cy.get(`[data-testid="manufacturing-airway-bill-input-field"]`).type(scope.airWayBill);
        cy.get(`[data-testid="manufacturing-airway-bill-action-trigger-button"]`).click();
      }
      cy.wait('@labelVerifications');
      cy.log('manufacturingAirwayBill', scope.airWayBill)
    });
}

//translation Headers
const satLabHeaders = () => {
  //name
  translationHelpers.assertSingleField('[data-testid="patientInformationHeader.name"]', satLabAssertions.satLabHeader.name);
  //coi
  translationHelpers.assertSingleField('[data-testid="patientInformationHeader.coi"]', satLabAssertions.satLabHeader.coi);
  // order id
  translationHelpers.assertSingleField('[data-testid="patientInformationHeader.patient_id"]', satLabAssertions.satLabHeader.orderId);
  //product
  translationHelpers.assertSingleField('[data-testid="patientInformationHeader.product"]', satLabAssertions.satLabHeader.product);

};

//translation phases
const satLabPhases = (therapy) => {
  if (therapy.unique_id == "_cmlp_cilta") {
    translationHelpers.assertSingleField('[data-testid=progress-print_labels-name]', satLabAssertions.satLabPhases.printLabels);
  }
  //collection summary
  translationHelpers.assertSingleField('[data-testid=progress-collection_summary-name]', satLabAssertions.satLabPhases.collectionSummary);
  //shipment receipt
  translationHelpers.assertSingleField('[data-testid=progress-shipment_receipt-name]', satLabAssertions.satLabPhases.shipmentReceipt);
  //cryopreservation
  translationHelpers.assertSingleField('[data-testid=progress-cryopreservation-name]', satLabAssertions.satLabPhases.cryopreservation);
  //labels
  if (therapy.unique_id != "_cmlp_cilta") {
    translationHelpers.assertSingleField('[data-testid=progress-labels-name]', satLabAssertions.satLabPhases.labels);
    //shipping
    translationHelpers.assertSingleField('[data-testid=progress-shipping-name]', satLabAssertions.satLabPhases.shipping);
  }
}

//button
const actionButtonTranslationCheck = (
  primaryBtnlabel = actionButtonHelper.translationKeys.NEXT,
  secondaryBtnLabel = actionButtonHelper.translationKeys.SAVE_AND_CLOSE
) => {
  actionButtonHelper.checkActionButtonLabel(actionButtonHelper.actionButtonKeys.PRIMARY, primaryBtnlabel);
  actionButtonHelper.checkActionButtonLabel(actionButtonHelper.actionButtonKeys.SECONDARY, secondaryBtnLabel);
}

export default {

  satLabPrintCryopreservationLabels: () => {
    cy.get('[data-testid="txt-field-layout-Confirm labels are printed successfully-answer"]')
      .find('svg')
      .click()
    common.singleSignature();
    common.ClickPrimaryActionButton();
  },

  satLabCollectionSummary: (scope, therapy) => {

    //translations
    if (Cypress.env('runWithTranslations')) {

      satLabHeaders();
      satLabPhases(therapy);

      //title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_collection_summary"]', 'h1', satLabAssertions.collectionSummary.pageTitle);

      //section titles
      //patient data
      translationHelpers.assertChildElement('[data-test-id="collection-summary-block"]', 'h3', satLabAssertions.collectionSummary.patientdata, 0);
      //procedure details
      translationHelpers.assertChildElement('[data-test-id="collection-summary-block"]', 'h3', satLabAssertions.collectionSummary.procedureDetails, 1);
      //bag information
      translationHelpers.assertChildElement('[data-test-id="collection-summary-block"]', 'h3', satLabAssertions.collectionSummary.bagInformation, 2);

      //coi
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'div', satLabAssertions.collectionSummary.coi);
      //value
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'span', scope.coi);

      //order id
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'div', satLabAssertions.collectionSummary.orderId);
      //value TODO value failing
      // translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'span', scope.patientInformation.orderId);

      //collection site name
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'div', satLabAssertions.collectionSummary.collectionSite);
      // if (therapy.context == "execution-context-cilta-cel-jnj-us-cmlp" || therapy.unique_id == "_cclp_cilta") {
      //   translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'div', satLabAssertions.collectionSummary.collectionSiteName);
      // }
      // else {
      //   translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'div', satLabAssertions.collectionSummary.collectionSite);
      // }

      //value
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'span', inputs.siteName2);

      //day of birth
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'div', satLabAssertions.collectionSummary.dayOfBirth);
      //value
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'span', scope.patientInformation.dayOfBirth);

      //month of birth
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 4, 'div', satLabAssertions.collectionSummary.monthOfBirth);
      //value
      // translationHelpers.assertSectionChildElement('[data-testid=display-only]', 4, 'span', inputs.monthOfBirth);

      //year of birth
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 5, 'div', satLabAssertions.collectionSummary.yearOfBirth);
      //value
      // translationHelpers.assertSectionChildElement('[data-testid=display-only]', 5, 'div', inputs.yearOfBirthSatLabCommercial, 1);

      //date of aph
      if (therapy.unique_id == '_cmlp_cilta' || therapy.unique_id == '_cclp_cilta') {
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 6, 'div', satLabAssertions.collectionSummary.medicalRecordNumber);
        // translationHelpers.assertSectionChildElement('[data-testid=display-only]', 6, 'div', scope.patientInformation.medicalRecordNumber, 1);

        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 7, 'div', satLabAssertions.collectionSummary.dateOfAph);
        // translationHelpers.assertSectionChildElement('[data-testid=display-only]', 7, 'span', inputs.apheresisDate);

        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 8, 'div', satLabAssertions.collectionSummary.patientWeight);
        // translationHelpers.assertSectionChildElement('[data-testid=display-only]', 8, 'div', inputs.patientWeight, 1);
        if (therapy.context == 'execution-context-cilta-cel-jnj-us-cmlp' || therapy.context == 'execution-context-cilta-cel-jnj-us-cclp' || therapy.unique_id == '_emea_cc' || herapy.unique_id == '_emea_ccdc_qr' || therapy.unique_id == '_emea_ccdc') {
          translationHelpers.assertSectionChildElement('[data-testid=display-only]', 9, 'div', satLabAssertions.collectionSummary.dinSec);
        } else {
          translationHelpers.assertSectionChildElement('[data-testid=display-only]', 9, 'div', satLabAssertions.collectionSummary.din);
          // translationHelpers.assertSectionChildElement('[data-testid=display-only]', 9, 'span', inputs.din);

          translationHelpers.assertSectionChildElement('[data-testid=display-only]', 10, 'div', satLabAssertions.collectionSummary.endTime);
          translationHelpers.assertSectionChildElement('[data-testid=display-only]', 7, 'div', satLabAssertions.collectionSummary.dateOfAph);
          translationHelpers.assertSectionChildElement('[data-testid=display-only]', 8, 'div', satLabAssertions.collectionSummary.patientWeight)
        }
      }
      else if (therapy.unique_id == "_emea_cc_qr" || therapy.unique_id == '_emea_cc' || therapy.unique_id == '_emea_ccdc_qr' || therapy.unique_id == '_emea_ccdc') {
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 8, 'div', satLabAssertions.collectionSummary.dinSec);
      } else {
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 6, 'div', satLabAssertions.collectionSummary.dateOfAph);
        //value
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 6, 'span', inputs.apheresisDate);

        //patient weight
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 7, 'div', satLabAssertions.collectionSummary.patientWeight);
        //value
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 7, 'div', inputs.patientWeight, 1);

        //bag din
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 8, 'div', satLabAssertions.collectionSummary.din);
        //value
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 8, 'span', inputs.din);

        //end time
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 9, 'div', satLabAssertions.collectionSummary.endTime);
      }
      //value
      //TODO (value is dynamic)

      //button translation
      actionButtonTranslationCheck();
    }

    actionButtonHelper.clickActionButton(actionButtonHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    });
  },

  satLabVerifyShipment: (coi, therapy, fromSite, toSite) => {

    //translations
    if (Cypress.env('runWithTranslations')) {

      //title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_verify_shipper"]', 'h1', satLabAssertions.verifyShipper.title);

      //description translation
      translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]', satLabAssertions.verifyShipper.scanCoi);

      //button translations
      actionButtonTranslationCheck();

    }
    inputHelpers.scanAndVerifyCoi(`ln-2-shipper-ship-bags-${fromSite}-${toSite}-${therapy.leg_name}`, coi);

    actionButtonHelper.clickActionButton(actionButtonHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    });
  },

  satLabShipmentChecklist: (DIN, therapy) => {

    //translations
    if (Cypress.env('runWithTranslations')) {

      //title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_shipment_receipt_checklist"]', 'h1', satLabAssertions.shipmentReceiptChecklist.title);

      //section title
      translationHelpers.assertSingleField('[data-testid=section-heading-title]', satLabAssertions.shipmentReceiptChecklist.detailsOfShipment);

      //description translation
      if (therapy.unique_id == '_cmlp_cilta' || therapy.unique_id == '_cclp_cilta' || therapy.unique_id == '_emea_cc' || therapy.unique_id == '_emea_ccdc_qr' || therapy.unique_id == '_emea_ccdc' || therapy.unique_id == '_emea_cc_qr') {
        translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]', satLabAssertions.shipmentReceiptChecklist.scanOrEnterDescription);
      }
      else {
        translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]', satLabAssertions.shipmentReceiptChecklist.scanOrEnterDin);
      }

      //list the serial number
      translationHelpers.assertSingleField('[id="#/properties/shipping_receipt_checklist/properties/monitoring_device_number"]', satLabAssertions.shipmentReceiptChecklist.listSerialNumber);
      //list security seal number
      translationHelpers.assertSingleField('[id="#/properties/shipping_receipt_checklist/properties/security_seal_number"]', satLabAssertions.shipmentReceiptChecklist.listSecuritySealNumber);
      //additional comments
      translationHelpers.assertSingleField('[id="#/properties/shipping_receipt_checklist/properties/issues"]', satLabAssertions.shipmentReceiptChecklist.additionalComments);

      //toggle translations
      // if (therapy.unique_id == '_emea_cc' || therapy.unique_id == '_emea_ccdc_qr' || therapy.unique_id == '_cclp_cilta' || therapy.unique_id == '_emea_ccdc'|| therapy.unique_id == '_emea_cc_qr') {
      //   translationHelpers.assertSingleField('[data-testid=question-text-does_temperature_conform]', satLabAssertions.shipmentReceiptChecklist.tempratureQuestion2);
      //   translationHelpers.assertSingleField('[data-testid=question-text-cold_shipper]', satLabAssertions.shipmentReceiptChecklist.coldShipperQuestion2);
      // }
      // else {
      //   translationHelpers.assertSingleField('[data-testid=question-text-does_temperature_conform]', satLabAssertions.shipmentReceiptChecklist.tempratureQuestion);
      //   translationHelpers.assertSingleField('[data-testid=question-text-cold_shipper]', satLabAssertions.shipmentReceiptChecklist.coldShipperQuestion);
      // }
      translationHelpers.assertSingleField('[data-testid=question-text-cry_aph_bag]', satLabAssertions.shipmentReceiptChecklist.aphQuestion);

      //toggle button
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-does_temperature_conform] >')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-cry_aph_bag] >')
      translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-cold_shipper] >')

      //button translations
      actionButtonTranslationCheck();
    };

    inputHelpers.inputSingleField('[data-testid="day-1-bag-1-udn-input-field"]',DIN);
    inputHelpers.clicker('[data-testid="day-1-bag-1-udn-action-trigger-button"]');
    inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]');
    inputHelpers.clicker('[data-testid=fail-button-cry_aph_bag]');
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/cry_aph_bag_reason-input"]','some text');
    inputHelpers.clicker('[data-testid=pass-button-cold_shipper]');

    actionButtonHelper.clickActionButton(actionButtonHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    });
  },

  satLabShipmentChecklistSummary: (scope, therapy) => {

    //translations
    if (Cypress.env('runWithTranslations')) {

      //title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_shipment_receipt_checklist_summary"]', 'h1', satLabAssertions.shipmentReceiptChecklistSummary.title);

      //section title
      translationHelpers.assertChildElement('[data-test-id="satellite_lab_shipment_receipt_checklist_summary"]', 'h3', satLabAssertions.shipmentReceiptChecklistSummary.shipmentDetails, 0);
      translationHelpers.assertChildElement('[data-test-id="satellite_lab_shipment_receipt_checklist_summary"]', 'h3', satLabAssertions.shipmentReceiptChecklistSummary.detailsOfShipment, 1);

      //lables
      //received packing
      // translationHelpers.assertSectionChildElement('[data-test-id="label-verification-step-row-block"]', 0, 'div', satLabAssertions.shipmentReceiptChecklistSummary.receivedPacking, 2);
      //value
      // translationHelpers.assertSectionChildElement('[data-test-id="label-verification-step-row-block"]', 0, 'div', scope.coi, 6);

      //Din( details of shipment)
      // if (therapy.context == "execution-context-cilta-cel-jnj-us-cmlp" || therapy.unique_id == '_cclp_cilta') {
      //   translationHelpers.assertSectionChildElement('[data-test-id="label-verification-step-row-block"]', 1, 'div', satLabAssertions.shipmentReceiptChecklistSummary.aphBagTransferredCmplCilta, 2);
      // }
      // else {
      //   translationHelpers.assertSectionChildElement('[data-test-id="label-verification-step-row-block"]', 1, 'div', satLabAssertions.shipmentReceiptChecklistSummary.aphBagTransferred, 2);
      // }

      //value
      translationHelpers.assertSectionChildElement('[data-test-id="label-verification-step-row-block"]', 1, 'div', inputs.din, 6);

      //site name
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'div', satLabAssertions.shipmentReceiptChecklistSummary.siteName);
      //value
      if (therapy.unique_id == '_cmlp_cilta' || therapy.unique_id == '_cclp_cilta') {
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'div', satLabAssertions.shipmentReceiptChecklistSummary.airwayBill);
        translationHelpers.assertBlockLabel("[data-testid*='txt-field-layout-Will the apheresis bag be kept in the cold shipper until time of cryopreservation? If not, please record']", { index: 0, label: satLabAssertions.shipmentReceiptChecklistSummary.coldShipperQuestion2 });
        translationHelpers.assertBlockLabel("[data-testid*='txt-field-layout-Will the apheresis bag be kept in the cold shipper until time of cryopreservation? If not, please record']", { index: 1, label: 'Yes ' });
        if (therapy.unique_id == '_cclp_cilta' || therapy.context == 'execution-context-cilta-cel-jnj-us-cmlp') {
          translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'span', inputs.siteName2);
        } else
          translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'span', inputs.cryoInstitution);
      } else {
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'span', inputs.siteName2);
      }
      //airwayBill
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'div', satLabAssertions.shipmentReceiptChecklistSummary.airwayBill);
      //value TODO
      // translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1 , 'span' , 'some text');

      //order id
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'div', satLabAssertions.shipmentReceiptChecklistSummary.orderId);
      //value TODO value failing
      // translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2 , 'span' , scope.patientInformation.orderId);

      //din (shipment details)
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'div', satLabAssertions.shipmentReceiptChecklistSummary.dinSec);
      //value
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'span', inputs.din);

      //list the serial number
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 4, 'div', satLabAssertions.shipmentReceiptChecklistSummary.listSerialNumber);
      //list security seal number
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 5, 'div', satLabAssertions.shipmentReceiptChecklistSummary.listSecuritySealNumber);
      //additional comments
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 12, 'div', satLabAssertions.shipmentReceiptChecklistSummary.additionalComments);

      //toggle question translations
      // if (therapy.unique_id == '_emea_cc' || therapy.unique_id == '_emea_ccdc_qr' || therapy.unique_id == '_cclp_cilta' || therapy.unique_id == '_emea_ccdc' || therapy.unique_id == '_cmlp_cilta' || therapy.unique_id == '_emea_cc_qr') {
      //   translationHelpers.assertTxtFieldLayout(satLabAssertions.shipmentReceiptChecklistSummary.tempratureQuestion2);
      // } else {
      //   translationHelpers.assertTxtFieldLayout(satLabAssertions.shipmentReceiptChecklistSummary.tempratureQuestion,);
      // }
      translationHelpers.assertTxtFieldLayout(satLabAssertions.shipmentReceiptChecklistSummary.aphQuestion, "No");
      // translationHelpers.assertSingleField(`[data-testid="txt-field-layout-${satLabAssertions.shipmentReceiptChecklistSummary.coldShipperQuestion}"]`, satLabAssertions.shipmentReceiptChecklistSummary.coldShipperQuestion);

      //signature translations
      translationHelpers.assertSingleField('[data-testid=approver-prompt]', satLabAssertions.shipmentReceiptChecklistSummary.confirmerPrompt);
      translationHelpers.assertSingleField('[data-testid=verifier-prompt]', satLabAssertions.shipmentReceiptChecklistSummary.verifierPrompt);

      //button translations
      actionButtonTranslationCheck();

    }
    const verifier = 'quela@vineti.com';
    common.doubleSignature(verifier);
    actionButtonHelper.clickActionButton(actionButtonHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    });
  },

  satLabCryopreservation: (itemCount) => {

    //translations
    if (Cypress.env('runWithTranslations')) {

      //title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_cryopreservation_bags"]', 'h1', satLabAssertions.cryopreservationBags.title);

      //section title
      translationHelpers.assertSingleField('[data-testid=section-heading-title]', satLabAssertions.cryopreservationBags.confirmNumberOfBags);

      //description translation
      translationHelpers.assertSingleField(`[data-testid="txt-field-layout-${satLabAssertions.cryopreservationBags.numberOfBagsdescription}"]`, satLabAssertions.cryopreservationBags.numberOfBagsdescription);

      //button translations
      actionButtonTranslationCheck();
    };

    cy.get('input[id="#/properties/item_count-input"]').type(itemCount);
    actionButtonHelper.clickActionButton(actionButtonHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    });
  },

  satLabCryopreservationLabels: (coi, scope) => {
    if (Cypress.env('runWithTranslations')) {
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_cryopreservation_labels"]', 'h1', satLabAssertions.cryopreservationLabels.cmlpTitle);
      translationHelpers.assertBlockLabel('[data-testid=h1-header]', { index: 1, label: satLabAssertions.cryopreservationLabels.applyBag });
      translationHelpers.assertSingleField('[data-testid=bag-1-desc]', satLabAssertions.cryopreservationLabels.identifyLabelForBag1);
      translationHelpers.assertBlockLabel('[data-test-id="multiple-scan-block-block"]>>>', { index: 0, label: satLabAssertions.cryopreservationLabels.scanOrEnterCoiBagIdentifierCassette });
      translationHelpers.assertBlockLabel('[data-test-id="multiple-scan-block-block"]>>>', { index: 2, label: satLabAssertions.cryopreservationLabels.scanOrEnterCoiBagIdentifierBag });
      translationHelpers.assertTxtFieldLayout(satLabAssertions.cryopreservationLabels.verifyLabelAttached, "Confirmed");
      actionButtonTranslationCheck();
    }
    cy.get('[data-testid=cassette-1-input]').type(`${coi}-PRC-01`);
    cy.get('[data-testid=cassette-1-button]').click();
    cy.wait('@labelVerifications');
    cy.get('[data-testid=bag-identifier-1-input]').type(`${coi}-PRC-01`);
    cy.get('[data-testid=bag-identifier-1-button]').click();
    cy.wait('@labelVerifications');
    cy.get('[id="#/properties/data/properties/is_verified"]')
      .find('svg')
      .click()
    common.ClickPrimaryActionButton();
    common.singleSignature();
    common.ClickPrimaryActionButton();
  },

  satLabCryopreservationLabelscclp: (coi, label) => {
    //translations
    if (Cypress.env('runWithTranslations')) {
      //title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_cryopreservation_labels"]', 'h1', satLabAssertions.cryopreservationLabels.title);

      //section heading
      translationHelpers.assertSingleField('[data-testid=section-heading-title]', satLabAssertions.cryopreservationLabels.printLabels);
      translationHelpers.assertChildElement('[data-test-id="multiple-scan-block-block"]', 'h3', satLabAssertions.cryopreservationLabels.applyBag);

      //print block translations
      translationHelpers.assertChildElement('[data-testid=print-counter-block]', 'b', satLabAssertions.cryopreservationLabels.totalLabels);
      translationHelpers.assertSectionChildElement('[data-testid=print-counter-block]', 0, 'li', `8 x Cryopreservation Cassette Labels - ${label}`);
      translationHelpers.assertSectionChildElement('[data-testid=print-counter-block]', 0, 'li', `4 x Cryopreservation Bag Labels - ${label}`, 1);

      //checkbox field
      translationHelpers.assertSingleField(`[data-testid="txt-field-layout-${satLabAssertions.cryopreservationLabels.confirmLabels}"]`, satLabAssertions.cryopreservationLabels.confirmLabels);
      translationHelpers.assertSingleField(`[data-testid="txt-field-layout-${satLabAssertions.cryopreservationLabels.verifyLabels}"]`, satLabAssertions.cryopreservationLabels.verifyLabels);

      //label description translations
      translationHelpers.assertSingleField('[data-testid=bag-1-desc]', satLabAssertions.cryopreservationLabels.identifyTheLabel);
      translationHelpers.assertSectionChildElement('[data-test-id="multiple-scan-block-block"]', 0, 'div', satLabAssertions.cryopreservationLabels.cassetteBag1, 5);
      translationHelpers.assertSectionChildElement('[data-test-id="multiple-scan-block-block"]', 0, 'div', satLabAssertions.cryopreservationLabels.identifierBag1, 11);

      //button translations
      actionButtonTranslationCheck();

    };
    cy.get('[data-testid="txt-field-layout-Confirm labels are printed successfully-answer"]')
      .find('svg')
      .click()
    cy.get('[data-testid=cassette-1-input]').type(`${coi}-PRC-01`);
    cy.get('[data-testid=cassette-1-button]').click();
    cy.wait('@labelVerifications');
    cy.get('[data-testid=bag-identifier-1-input]').type(`${coi}-PRC-01`);
    cy.get('[data-testid=bag-identifier-1-button]').click();
    cy.wait('@labelVerifications');
    cy.get('[id="#/properties/data/properties/is_verified"]')
      .find('svg')
      .click()
    actionButtonHelper.clickActionButton(actionButtonHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    });
    if (Cypress.env('runWithTranslations')) {

      //signature translations
      translationHelpers.assertSingleField('[data-testid=approver-prompt]', satLabAssertions.cryopreservationLabels.confirmerPrompt);
    }

    common.singleSignature();

    actionButtonHelper.clickActionButton(actionButtonHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    });
  },

  satLabBagStorageEU: coi => {
    cy.wait(2000)
    cy.get('[data-testid=bag-identifier-1-input]').type(`${coi}-PRC-01`);
    cy.get('[data-testid=bag-identifier-1-button]').click();
    cy.wait('@labelVerifications');
    common.ClickPrimaryActionButton();

  },

  satLabBagStorage: coi => {
    //translations
    if (Cypress.env('runWithTranslations')) {
      //title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_bag_storage"]', 'h1', satLabAssertions.bagStorage.title);

      //section title
      translationHelpers.assertChildElement('[data-test-id="satellite_lab_bag_storage"]', 'h3', satLabAssertions.bagStorage.storeCassette);

      //label description translation
      translationHelpers.assertSectionChildElement('[data-test-id="multiple-scan-block-block"]', 0, 'div', satLabAssertions.bagStorage.scanOrEnter, 3);

      //button translations
      actionButtonTranslationCheck();
    };

    cy.get('[data-testid=cassette-1-input]').type(`${coi}-PRC-01`);
    cy.get('[data-testid=cassette-1-button').click();
    cy.wait('@labelVerifications');
    actionButtonHelper.clickActionButton(actionButtonHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    });
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

  satLabPrintShipperLabels: (therapy = {}, label) => {
    //translations
    if (Cypress.env('runWithTranslations')) {
      //title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_print_packing_inserts"]', 'h1', satLabAssertions.printPackingInserts.title);

      //description translations
      translationHelpers.assertSingleField(`[data-testid="txt-field-layout-${satLabAssertions.printPackingInserts.confirmPacking}"]`, satLabAssertions.printPackingInserts.confirmPacking);

      //print block translationi
      if (therapy.unique_id == '_cclp_cilta') {
        translationHelpers.assertChildElement('[data-testid=print-counter-block]', 'b', `Cryopreservation Packing insert - ${label}`);
        translationHelpers.assertChildElement('[data-testid=print-counter-block]', 'li', `1 x Cryopreservation Packing insert - ${label}`);
        translationHelpers.assertChildElement('[data-testid=print-block-container]', 'p', satLabAssertions.printPackingInserts.printPackingWithoutCoi);
      } else if (therapy.unique_id == "_emea_cc_qr" || therapy.unique_id == '_emea_cc' || therapy.unique_id == '_emea_ccdc_qr' || therapy.unique_id == '_emea_ccdc') {
        translationHelpers.assertChildElement('[data-testid=print-counter-block]', 'b', satLabAssertions.printPackingInserts.totalLabels);
        translationHelpers.assertChildElement('[data-testid=print-counter-block]', 'li', `2 x Cryopreservation Packing insert - ${label}`);
        translationHelpers.assertChildElement('[data-testid=print-block-container]', 'p', satLabAssertions.printPackingInserts.printPackingWithoutCoi);
      } else {
        translationHelpers.assertChildElement('[data-testid=print-block-container]', 'p', satLabAssertions.printPackingInserts.printPacking);
        translationHelpers.assertChildElement('[data-testid=print-counter-block]', 'b', satLabAssertions.printPackingInserts.totalLabels);
        translationHelpers.assertChildElement('[data-testid=print-counter-block]', 'li', `2 x Cryopreservation Packing insert - ${label}`);
      }
      //button translation
      actionButtonTranslationCheck();
    }
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
    actionButtonHelper.clickActionButton(actionButtonHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    });

    if (Cypress.env('runWithTranslations')) {

      //signature translation
      translationHelpers.assertSingleField('[data-testid=approver-prompt]', satLabAssertions.printPackingInserts.confirmerPrompt);

    };
    common.singleSignature();

    actionButtonHelper.clickActionButton(actionButtonHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    });
  },

  satLabBagSelection: () => {
    //translations
    if (Cypress.env('runWithTranslations')) {
      //title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_bag_selection"]', 'h1', satLabAssertions.bagSelection.title);

      //section title
      translationHelpers.assertChildElement('[data-test-id="section-heading-block-block"]', 'h3', satLabAssertions.bagSelection.confirmNumberOfBags);

      //labels
      translationHelpers.assertChildElement('[data-test-id="shipping-toggle-block"]', 'div', satLabAssertions.bagSelection.bag1, 3);
      //TODO fing selector for date collected and bag identifier

      //toggle buttons
      translationHelpers.assertSingleField('[data-testid=pass-button-0]', satLabAssertions.bagSelection.ship);
      translationHelpers.assertSingleField('[data-testid=fail-button-0]', satLabAssertions.bagSelection.doNotShip);

      //button translations
      actionButtonTranslationCheck();
    }
    cy.get('[data-testid=pass-button-0]').click();
    actionButtonHelper.clickActionButton(actionButtonHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    });
  },

  satLabTransferProductToShipper: (coi, therapy) => {

    //translations
    if (Cypress.env('runWithTranslations')) {
      //title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_transfer_product_to_shipper"]', 'h1', satLabAssertions.transferProductToShipper.title);

      //section title
      translationHelpers.assertChildElement('[data-test-id="multiple-scan-block-block"]', 'h3', satLabAssertions.transferProductToShipper.cassetteTimestamps);

      //description translations
      //capture capsule cassette 1 timestamps
      translationHelpers.assertChildElement('[data-test-id="multiple-scan-block-block"]', 'span', satLabAssertions.transferProductToShipper.removeCassetteDescription, 0);
      //cryopreserved aph bags description
      translationHelpers.assertSingleField('[data-testid=section-heading-description]', satLabAssertions.transferProductToShipper.importantDescription);

      //label description
      //cassette label
      translationHelpers.assertChildElement('[data-test-id="multiple-scan-block-block"]', 'div', satLabAssertions.transferProductToShipper.cassetteLabel, 3);
      //Ln2 packing insert
      if (therapy.unique_id == '_cclp_cilta') {
        translationHelpers.assertChildElement('[data-test-id="multiple-scan-block-block"]', 'div', satLabAssertions.transferProductToShipper.scanCoiFromPackingInsert, 11);
      } else {
        translationHelpers.assertChildElement('[data-test-id="multiple-scan-block-block"]', 'div', satLabAssertions.transferProductToShipper.ln2_packing_insert, 11);
      }

      //toggle question translations
      //is the shipping container case intact
      translationHelpers.assertSingleField('[data-testid=question-text-case_intact_1]', satLabAssertions.transferProductToShipper.caseIntact);
      //was there a temprature out of range alarm reached
      translationHelpers.assertSingleField('[data-testid=question-text-temp_out_of_range_1]', satLabAssertions.transferProductToShipper.temp_out_of_range);
      //Confirm cryopreserved apheresis product cassette(s) were not exposed
      translationHelpers.assertSingleField('[data-testid=question-text-ambient_temperature_exposure]', satLabAssertions.transferProductToShipper.ambient_temperature_exposure);
      //is the red wiretamper seal labelled
      translationHelpers.assertSingleField('[data-testid=question-text-red_wire_tamper_seal_labeled_rack]', satLabAssertions.transferProductToShipper.red_wire_temper_seal);

      //button translations
      actionButtonTranslationCheck();

    }

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

    actionButtonHelper.clickActionButton(actionButtonHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    });
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
    cy.get('[data-testid="#/properties/shipping_checklist/properties/issues-input"]').type('comment')
    common.ClickPrimaryActionButton();
  },

  satLabShippingChecklist: (shippingRow, evoLast4Digits, tamperSealNumber, scope, testId) => {

    //translations
    if (Cypress.env('runWithTranslations')) {
      //title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_shipment_checklist"]', 'h1', satLabAssertions.shipmentChecklist.title);

      //label descriptions
      //enter airway bill
      // translationHelpers.assertChildElement('[data-test-id="label-verification-step-row-block"]', 'div', satLabAssertions.shipmentChecklist.airwaybillNumber, 2);
      //EVO-IS number
      translationHelpers.assertSingleField('[id="#/properties/shipping_checklist/properties/evo_is_id"]', satLabAssertions.shipmentChecklist.evoNumber);
      //tamper seal number
      translationHelpers.assertSingleField('[id="#/properties/shipping_checklist/properties/tamper_seal_number"]', satLabAssertions.shipmentChecklist.tamperSealNumber);
      //additional comment
      translationHelpers.assertSingleField('[id="#/properties/shipping_checklist/properties/issues"]', satLabAssertions.shipmentChecklist.additionalComments);

      //toggle questions
      // evo
      translationHelpers.assertSingleField('[data-testid=question-text-evo_airway_bill]', satLabAssertions.shipmentChecklist.evoQuestion);
      //red wire temper seal in place
      translationHelpers.assertSingleField('[data-testid=question-text-red_wire]', satLabAssertions.shipmentChecklist.red_wire_tamper_seal_question);
      //tamper seal number listed on airwaybill
      translationHelpers.assertSingleField('[data-testid=question-text-tamper_seal_match]', satLabAssertions.shipmentChecklist.tamper_seal_number_question);
      //packing insert
      translationHelpers.assertSingleField('[data-testid=question-text-shipper_label_placed]', satLabAssertions.shipmentChecklist.packing_insert_question);
      //consignee kit poch
      translationHelpers.assertSingleField('[data-testid=question-text-consignee_kit_pouch_inside]', satLabAssertions.shipmentChecklist.consignee_kit_pouch_question);
      //container secured
      translationHelpers.assertSingleField('[data-testid=question-text-zip_ties_secured]', satLabAssertions.shipmentChecklist.shipping_container_secured_question);

      //button translations
      actionButtonTranslationCheck();
    }
    getSatAirWayBill(scope, shippingRow, testId)
    cy.get('[data-testid="h1-header"]').should('contain', 'Shipment Checklist');
    cy.wait(1000)
    // cy.wait('@labelVerifications');
    cy.get('input[id="#/properties/shipping_checklist/properties/evo_is_id-input"]').type(evoLast4Digits);
    cy.get('input[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]').type(tamperSealNumber);
    cy.get('[data-testid="pass-button-evo_airway_bill"]').click();
    cy.get('[data-testid="pass-button-shipper_label_placed"]').click();
    cy.get('[data-testid="pass-button-red_wire"]').click();
    cy.get('[data-testid="pass-button-tamper_seal_match"]').click();
    cy.get('[data-testid="pass-button-consignee_kit_pouch_inside"]').click();
    cy.get('[data-testid="pass-button-zip_ties_secured"]').click();
    cy.get('[data-testid="#/properties/shipping_checklist/properties/issues-input"]').type('comment')
    actionButtonHelper.clickActionButton(actionButtonHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    });
  },

  satLabShippingChecklistCMLP: (shippingRow, evoLast4Digits, tamperSealNumber, scope, testId) => {
    getManAirWayBill(scope, shippingRow, testId)
    cy.log('the last 4', evoLast4Digits)
    cy.get('[data-testid="h1-header"]').should('contain', 'Shipment Checklist');
    cy.wait(1000)
    cy.get('input[id="#/properties/shipping_checklist/properties/cry_evo_is_id-input"]').clear().type(evoLast4Digits);
    cy.get('input[id="#/properties/shipping_checklist/properties/cry_tamper_seal_number-input"]').clear().type(tamperSealNumber);
    cy.get('[data-testid="pass-button-evo_airway_bill"]').click();
    cy.get('[data-testid="pass-button-shipper_label_placed"]').click();
    cy.get('[data-testid="pass-button-red_wire"]').click();
    cy.get('[data-testid="pass-button-tamper_seal_match"]').click();
    cy.get('[data-testid="pass-button-cry_consignee_kit_pouch_inside"]').click();
    cy.get('[data-testid="pass-button-cry_zip_ties_secured"]').click();
    common.ClickPrimaryActionButton();
  },

  satShippingSummaryVerify: (scope, therapy) => {
    if (Cypress.env('runWithTranslations')) {
      //title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_cryopreservation_shipping_summary"]', 'h1', satLabAssertions.cryopreservationShippingSummary.title);

      //section title
      translationHelpers.assertChildElement('[data-test-id="satellite_lab_cryopreservation_shipping_summary"]', 'h3', satLabAssertions.cryopreservationSummary.procedureDetails, 0);
      translationHelpers.assertChildElement('[data-test-id="satellite_lab_cryopreservation_shipping_summary"]', 'h3', satLabAssertions.cryopreservationShippingSummary.transferProductToShipper, 1);
      if (therapy.unique_id == '_cclp_cilta') {
        translationHelpers.assertChildElement('[data-test-id="satellite_lab_cryopreservation_shipping_summary"]', 'h3', satLabAssertions.cryopreservationShippingSummary.conditionOfShipment, 2);
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 6, 'div', satLabAssertions.cryopreservationShippingSummary.dinSecDis);
        translationHelpers.assertBlockLabel(' [data-testid=display-only]>', { index: 14, label: satLabAssertions.cryopreservationShippingSummary.numberOfBags });
        translationHelpers.assertBlockLabel(' [data-testid=display-only]>', { index: 15, label: '1 ' });
      } else {
        translationHelpers.assertChildElement('[data-test-id="satellite_lab_cryopreservation_shipping_summary"]', 'h3', satLabAssertions.cryopreservationShippingSummary.conditionOfShipment, 3);
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 6, 'div', satLabAssertions.cryopreservationShippingSummary.dinSec);

        translationHelpers.assertBlockLabel(' [data-test-id="specimen-status-block"]>>>>', { index: 0, label: satLabAssertions.cryopreservationShippingSummary.dateBagIdentifiedToBeShipped });

        translationHelpers.assertBlockLabel(' [data-test-id="specimen-status-block"]>>>', { index: 1, label: satLabAssertions.cryopreservationShippingSummary.numberOfBags });
        translationHelpers.assertSingleField('[data-testid="total-number-of-bags"]', '1')

        translationHelpers.assertBlockLabel(' [data-test-id="specimen-status-block"]>>>>', { index: 2, label: satLabAssertions.cryopreservationShippingSummary.bag1Identifier });
        cy.get('[data-testid="block-itemIdentifiers"]').contains(`${scope.coi}-PRC-01`);
        cy.get('[data-test-id="label-verification-step-row-block"]>>>').contains(satLabAssertions.cryopreservationShippingSummary.confirmed);

        translationHelpers.assertSingleField('[data-testid="section-heading-description"]', satLabAssertions.cryopreservationShippingSummary.importantDescription)

      }
      //label translations
      //order id
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'div', satLabAssertions.cryopreservationSummary.orderId);
      //  translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0 , 'span', scope.patientInformation.patientId);

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'div', satLabAssertions.cryopreservationShippingSummary.product);
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'span', satLabAssertions.cryopreservationShippingSummary.ciltaCel);

      //site name
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'div', satLabAssertions.cryopreservationSummary.siteName);
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'span', inputs.cryoInstitution);

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'div', satLabAssertions.cryopreservationShippingSummary.airwayBillNumber);

      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 4, 'div', satLabAssertions.cryopreservationShippingSummary.evoISNumber);
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 4, 'span', inputs.evoLast4Digits);

      //coi
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 5, 'div', satLabAssertions.cryopreservationSummary.coi);
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 5, 'span', scope.coi);

      //din
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 6, 'span', inputs.din);

      // translationHelpers.assertChildElement('[data-test-id="label-verification-step-row-block"]', 'div', satLabAssertions.cryopreservationShippingSummary.dateOfShipment, 2);

      //scan or enter coi
      translationHelpers.assertChildElement('[data-test-id="multiple-scan-block-block"]', 'div', satLabAssertions.cryopreservationShippingSummary.dateAndTimeCryopreservedApheresisProductCassette, 3);
      translationHelpers.assertChildElement('[data-test-id="multiple-scan-block-block"]', 'div', `${scope.coi}-PRC-01`, 6);

      translationHelpers.assertBlockLabel('[data-test-id="multiple-scan-block-block"]>>>>', { index: 4, label: satLabAssertions.cryopreservationShippingSummary.dateAndTimePackagedCryopreservedApheresis });
      translationHelpers.assertBlockLabel('[data-test-id="multiple-scan-block-block"]>>>>', { index: 6, label: scope.coi });

      //value
      //   translationHelpers.assertChildElement('[data-test-id="multiple-scan-block-block"]', 'div', `${scope.coi}-PRC-01` , 6);

      translationHelpers.assertSingleField('[data-testid=approver-prompt]', satLabAssertions.cryopreservationSummary.confirmerPrompt);
      translationHelpers.assertSingleField('[data-testid=verifier-prompt]', satLabAssertions.cryopreservationSummary.verifierPrompt);

      translationHelpers.assertTxtFieldLayout(satLabAssertions.transferProductToShipper.caseIntact);
      translationHelpers.assertTxtFieldLayout(satLabAssertions.transferProductToShipper.temp_out_of_range, 'No');
      translationHelpers.assertTxtFieldLayout(satLabAssertions.shipmentChecklist.tamper_seal_number_question);
      translationHelpers.assertSingleField(`[data-testid='txt-field-layout-Is the red wire tamper seal labeled "RACK" in place on the cassette rack?']`, satLabAssertions.transferProductToShipper.red_wire_temper_seal);
      translationHelpers.assertSingleField(`[data-testid='txt-field-layout-Is the red wire tamper seal labeled "RACK" in place on the cassette rack?-answer']`, 'Yes ');

      translationHelpers.assertTxtFieldLayout(satLabAssertions.transferProductToShipper.ambient_temperature_exposure);
      translationHelpers.assertTxtFieldLayout(satLabAssertions.shipmentChecklist.evoNumber, '1234');
      translationHelpers.assertTxtFieldLayout(satLabAssertions.shipmentChecklist.evoQuestion);
      translationHelpers.assertTxtFieldLayout(satLabAssertions.shipmentChecklist.red_wire_tamper_seal_question);
      translationHelpers.assertTxtFieldLayout(satLabAssertions.shipmentChecklist.tamperSealNumber, '321');
      translationHelpers.assertTxtFieldLayout(satLabAssertions.shipmentChecklist.packing_insert_question);
      translationHelpers.assertTxtFieldLayout(satLabAssertions.cryopreservationShippingSummary.consigneeKitPouch);
      translationHelpers.assertTxtFieldLayout(satLabAssertions.shipmentChecklist.shipping_container_secured_question)
      translationHelpers.assertTxtFieldLayout(satLabAssertions.shipmentChecklist.additionalComments, 'comment')


      //button translations
      actionButtonTranslationCheck('Done');
    }
    const verifier = 'quela@vineti.com';
    common.doubleSignature(verifier);
    actionButtonHelper.clickActionButton(actionButtonHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    });
  },

  satLabCryopreservationData: ( productVolume) => {
    // cy.get('[data-testid=masked-input-control]').type(maskedInputControl);
    // cy.get('[data-testid=bag-identifier-1-input]').type(`${coi}-PRC-01`);
    // cy.get('[data-testid=bag-identifier-1-button]').click();
    // cy.wait('@labelVerifications');
    // cy.get('input[id="#/properties/custom_fields/properties/total_cells-input"]').type(totalCells);
    cy.get('[data-testid="#/properties/shipping_receipt_checklist/properties/volume_1-input"]').type(productVolume);
    common.ClickPrimaryActionButton();
  },

  satSummaryVerify: (scope, therapy) => {
    if (Cypress.env('runWithTranslations')) {
      //title
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_cryopreservation_summary"]', 'h1', satLabAssertions.cryopreservationSummary.title);

      //section title
      translationHelpers.assertChildElement('[data-test-id="satellite_lab_cryopreservation_summary"]', 'h3', satLabAssertions.cryopreservationSummary.procedureDetails, 0);
      if (therapy.unique_id == "_emea_ccdc_qr") {
        translationHelpers.assertChildElement('[data-test-id="satellite_lab_cryopreservation_summary"]', 'h3', satLabAssertions.cryopreservationSummary.bagStorage, 1);
      } else if (therapy.unique_id == "_cmlp_cilta") {
        translationHelpers.assertBlockLabel('[data-test-id="multiple-scan-block-block"]>>>>', { index: 0, label: satLabAssertions.cryopreservationSummary.scanCoiFromCassette });
        translationHelpers.assertBlockLabel('[data-test-id="multiple-scan-block-block"]>>>>', { index: 4, label: satLabAssertions.cryopreservationSummary.scanCoiFromBag });
        translationHelpers.assertBlockLabel('[data-test-id="multiple-scan-block-block"]>>>>', { index: 1, label: satLabAssertions.cryopreservationSummary.confirmed });
        translationHelpers.assertBlockLabel('[data-test-id="multiple-scan-block-block"]>>>>', { index: 5, label: satLabAssertions.cryopreservationSummary.confirmed });
        translationHelpers.assertSingleField('[data-testid=cassette-1-value]', `${scope.coi}-PRC-01`);
        translationHelpers.assertSingleField('[data-testid=bag-identifier-1-value]', `${scope.coi}-PRC-01`);
        translationHelpers.assertChildElement('[data-test-id="satellite_lab_cryopreservation_summary"]', 'h3', satLabAssertions.cryopreservationSummary.cryopreservationLabels, 1);
      } else {
        translationHelpers.assertChildElement('[data-test-id="satellite_lab_cryopreservation_summary"]', 'h3', satLabAssertions.cryopreservationSummary.cryopreservationData, 1);
        //label description translations
        //scanned packing
        translationHelpers.assertChildElement('[data-test-id="label-verification-step-row-block"]', 'div', satLabAssertions.cryopreservationSummary.scannedPacking, 2);
        //value
        translationHelpers.assertChildElement('[data-test-id="label-verification-step-row-block"]', 'div', scope.coi, 6);

        //scan or enter coi
        translationHelpers.assertChildElement('[data-test-id="multiple-scan-block-block"]', 'div', satLabAssertions.cryopreservationSummary.scanOrEnter, 3);
        //value
        translationHelpers.assertChildElement('[data-test-id="multiple-scan-block-block"]', 'div', `${scope.coi}-PRC-01`, 6);
      }
      //label translations
      //site name
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'div', satLabAssertions.cryopreservationSummary.siteName);
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'span', inputs.cryoInstitution);

      //order id
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'div', satLabAssertions.cryopreservationSummary.orderId);
      //value TODO value failing
      // translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'span', scope.patientInformation.patientId);
      //coi
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'div', satLabAssertions.cryopreservationSummary.coi);
      //value
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'span', scope.coi);

      //din
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'div', satLabAssertions.cryopreservationSummary.dinSec);
      //value
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'span', inputs.din);




      //signature
      translationHelpers.assertSingleField('[data-testid=approver-prompt]', satLabAssertions.cryopreservationSummary.confirmerPrompt);
      translationHelpers.assertSingleField('[data-testid=verifier-prompt]', satLabAssertions.cryopreservationSummary.verifierPrompt);

      //button translations
      actionButtonTranslationCheck();
    }
    const verifier = 'quela@vineti.com';
    common.doubleSignature(verifier);
    actionButtonHelper.clickActionButton(actionButtonHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    });
  },
}