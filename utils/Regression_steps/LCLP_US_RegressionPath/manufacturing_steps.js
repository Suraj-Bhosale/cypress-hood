//import {singleSignature, ClickPrimaryActionButton,doubleSignature} from '../support/index.js';
import common from '../../../support/index.js'
import dayjs from 'dayjs';
import input from '../../../fixtures/inputs.json';
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers'
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers'
import regressionInput from '../../../fixtures/inputsRegression.json'
import manufacturingStepsRegression from '../../Regression_steps/LCLP_US_RegressionPath/manufacturing_steps';
import m_steps from '../../../utils/HappyPath_steps/LCLP_US_HappyPath/manufacturing_steps';


const verifier = 'quela@vineti.com'
const date = dayjs()
  .add(1, 'month')
  .add(0, 'days')
  .format('DD-MMM-YYYY')

const getManufAirWayBill = (scope, shippingRow) => {
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
      cy.visit('/manufacturing')
      inputHelpers.clicker(`tr[data-testid="manufacturing-${scope.coi}"]`)
      
      inputHelpers.scanAndVerifyCoi('manufacturing-airway-bill', scope.airWayBill)
      cy.log('manufacturingAirwayBill', scope.airWayBill)
    })
}

export default {
  openOrder: (coi) => {
    common.loginAs('steph');
    cy.visit('/manufacturing');
    cy.get('.manufacturing-row_coi')
      .contains('div', coi)
      .click();
  },

  collectionStatus: {
    //C21904
    viewDocumentButtonsEnabled: () => {
      inputChecker.checkState('div.step-view  div[data-test-id]:nth-of-type(5) button', 'not.be.disabled');
      inputChecker.checkState('div.step-view  div[data-test-id]:nth-of-type(6) button', 'not.be.disabled');
      inputChecker.checkState('div.step-view  div[data-test-id]:nth-of-type(7) button', 'not.be.disabled');
    }
  },

  verifyShipper: {
    previousHappyPathSteps: () => {
      m_steps.manufacturingCollectionSummary()
    },

    //C21900
    coiempty: () => {
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C25746
    checkWithInvalidCoiValues: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site', `${coi}-FP-01`, 'not.be.visible', 'be.disabled');
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site', `${coi}-APH-01`, 'not.be.visible', 'be.disabled')
      });
    },

    //C21912
    coiConfirmed: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site', `${coi}`, 'not.be.visible', 'be.disabled')
      });
    },

    //C33783
    checkForTheInfoSaved: () => {
      inputChecker.checkForTheInfoSavedClickingNextAndBack();
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    //C33785
    checkForBackButton: () => {
      inputChecker.checkDataSavingWithBackButton();
      inputChecker.nextButtonCheck('not.be.disabled')
    }
  },

  shipmentReceiptChecklist: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '');
      })
    },
    
    // C21913
    noDetailsProvided: () => {
      inputChecker.nextButtonCheck('be.disabled');
    },

    // C21917
    toggleShippingContainerCaseNeg: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=fail-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
      '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
      '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_intact_reason-input"]');
    },

    // C21918
    saveAndClosePos: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
      })
      inputChecker.nextButtonCheck("be.enabled");
    },

    // C21924
    invalidEvoIsNumberNeg: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
      '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
      '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.invalidEvoIsNumber, 'be.disabled');
    },

    // C29778
    toggleShippingContainerSecuredNeg: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="fail-button-zip_ties_secured_no_case"]',
      '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
      '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]');
    },

    // C29779
    toggleShipperLabelsNeg: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
      '[data-testid="fail-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
      '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/shipper_label_placed_reason-input"]');
    },

    // C29780
    toggleConsigneeKitPouchNeg: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
      '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="fail-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
      '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]');
    },

    // C29781
    toggleEvoIsNumberNeg: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
      '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="fail-button-evo_is_number"]',
      '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_is_number_reason-input"]');
    },

    // C29782
    toggleRedWireTamperSealNeg: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
      '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
      '[data-testid="fail-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]');
    },

    // C29783
    toggleTamperSealNumberNeg: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
      '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
      '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="fail-button-tamper_seal_match"]']);
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]');
    },

    // C30926
    emptyEvoIsNumberFieldNeg: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid="pass-button-shipping_container_intact"]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
        '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', "be.disabled");
    },

    // C30927
    emptyTamperSealNumberFieldNeg: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.clicker(['[data-testid="pass-button-shipping_container_intact"]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
        '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', "be.disabled");
    },

    // C30928
    shippingContainerCaseFieldNeg: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid="pass-button-zip_ties_secured_no_case"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C30929
    shippingContainerSecuredFieldNeg: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid="pass-button-shipping_container_intact"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C30930
    shipperLabelsIncludedFieldNeg: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid="pass-button-shipping_container_intact"]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
        '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C30931
    consigneeKitPouchFieldNeg: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid="pass-button-shipping_container_intact"]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
        '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-evo_is_number"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C30932
    evoIsNumberOnLN2ShipperLidNeg: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid="pass-button-shipping_container_intact"]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
        '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C30933
    redWireTamperSealNeg: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid="pass-button-shipping_container_intact"]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
        '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C31882
    tamperSealNumberNeg: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid="pass-button-shipping_container_intact"]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
        '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]']);
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C31883
    toggleShippingContainerCasePos: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=fail-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
        '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_intact_reason-input"]', 'some reason', "be.enabled");
    },

    // C31884
    toggleShippingContainerSecuredPos: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="fail-button-zip_ties_secured_no_case"]',
      '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
      '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]', 'some reason', "be.enabled");
    },

    // C31886
    toggleShipperLabelsPos: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
      '[data-testid="fail-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
      '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/shipper_label_placed_reason-input"]', 'some reason', "be.enabled");
    },

    // C31887
    toggleConsigneeKitPouchPos: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
      '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="fail-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
      '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]', 'some reason', "be.enabled");
    },

    // C31888
    toggleEvoIsNumberPos: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
      '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="fail-button-evo_is_number"]',
      '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_is_number_reason-input"]', 'some reason', "be.enabled");
    },

    // C31889
    toggleRedWireTamperSealPos: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
      '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
      '[data-testid="fail-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]', 'some reason', "be.enabled");
    },

    // C31890
    toggleTamperSealNumberPos: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
      '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
      '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="fail-button-tamper_seal_match"]']);
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]', 'some reason', "be.enabled");
    },

    // C31978
    posBackLinkCheck: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid="pass-button-shipping_container_intact"]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
        '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.checkDataSavingWithBackButton("be.enabled");
      inputHelpers.onClick('[data-testid="primary-button-action"]');
      inputChecker.checkAllToggleUnSelected();
      inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', "");
      inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', "");
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C30925
    nextButtonEnabledPos: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid="pass-button-shipping_container_intact"]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
        '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.nextButtonCheck("be.enabled");
    },

    // C33162
    posNextButtonCheck: () => {
      inputHelpers.onClick('[data-testid="primary-button-action"]');
      inputChecker.checkDataSavingWithBackButton("be.enabled");
    },

    // C21967
    reasonForChangeOnChangingValuePos: () => {
      cy.reload();
      inputHelpers.onClick('[data-testid="primary-button-action"]');
      inputChecker.backButtonCheck('[data-testid="back-nav-link"]');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.changedEvoIsNumber);
      inputChecker.reasonForChange();
    },
  },

  shipmentReceiptChecklistSummary: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '');
      })
      m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
    },

    // C21919 and // C21920
    nextButtonCheckWithOrWithoutSignature: () => {
      inputChecker.checkNextButtonWithAndWithoutSignature(2);
    },

    // C21968
    posAskToResign: () => {
      inputChecker.nextButtonCheck('be.enabled');
      inputChecker.backButtonCheck('[data-testid="back-nav-link"]');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.changedEvoIsNumber);
      inputChecker.reasonForChange();
      inputChecker.nextButtonCheck('be.disabled');
    }
  },

  transferProducttoIntermediaryOrFinalLN2StoragePart1: {

    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
      })
    },

    //C26764
    nextButtonDisabled: () => {
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C26765
    checkConfirmButtonDisabledForLN2Shipper: () => {
      inputChecker.checkState('[data-testid="ln-2-shipper-1-button"]', 'be.disabled')
    },

    //C21951
    checkConfirmButtonDisabledForCassetteLabel: () => {
      inputChecker.checkState('[data-testid="cassette-1-button"]', 'be.disabled')
    },

    //C21952
    checkConfirmButtonDisabledForCoiOnTheBag: () => {
      inputChecker.checkState('[data-testid="bag-identifier-1-button"]', 'be.disabled')
    },

    //C21953
    checkConfirmButtonEnabledForLN2Shipper: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.clearField('[data-testid="ln-2-shipper-1-input"]')
        inputChecker.inputStringValue('[data-testid="ln-2-shipper-1-input"]', coi)
        inputChecker.checkState('[data-testid="ln-2-shipper-1-button"]', 'not.be.disabled')
      })
    },

    //C21954
    checkConfirmButtonEnabledForCassetteLabel: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.clearField('[data-testid="cassette-1-input"]')
        inputChecker.inputStringValue('[data-testid="cassette-1-input"]', `${coi}-PRC-01`)
        inputChecker.checkState('[data-testid="cassette-1-button"]', 'not.be.disabled')
      })
    },

    //C21955
    checkConfirmButtonEnabledForCoiOnTheBag: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.clearField('[data-testid="bag-identifier-1-input"]')
        inputChecker.inputStringValue('[data-testid="bag-identifier-1-input"]', `${coi}-PRC-01`)
        inputChecker.checkState('[data-testid="bag-identifier-1-button"]', 'not.be.disabled')
      })
    },

    //C21956
    scanAndConfirmAllCoi: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyMultiplePos('ln-2-shipper-1', coi, 'be.visible')
        inputChecker.scanAndVerifyMultiplePos('cassette-1', `${coi}-PRC-01`, 'be.visible')
        inputChecker.scanAndVerifyMultiplePos('bag-identifier-1', `${coi}-PRC-01`, 'be.visible')
        inputChecker.nextButtonCheck('not.be.disabled')
      })
    },

    //C21958
    saveAndClose: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
      })
      inputChecker.nextButtonCheck("be.enabled");
    },

    //C25755
    checkInvalidDataForLN2Shipper: () => {
      inputChecker.scanAndVerifyMultipleNeg('ln-2-shipper-1', 'abcdef')
      inputChecker.scanAndVerifyMultipleNeg('ln-2-shipper-1', '123456')
    },

    //C25756
    checkInvalidDataForCassetteLabel: () => {
      inputChecker.scanAndVerifyMultipleNeg('cassette-1', 'abcdef')
      inputChecker.scanAndVerifyMultipleNeg('cassette-1', '123456')
    },

    //C25757
    checkInvalidDataForBag: () => {
      inputChecker.scanAndVerifyMultipleNeg('bag-identifier-1', 'abcdef')
      inputChecker.scanAndVerifyMultipleNeg('bag-identifier-1', '123456')
    }


  }, 

  transferProducttoIntermediaryOrFinalLN2StoragePart2: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '')
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber)
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope)
        m_steps.manufacturingTransferProductToStorage(coi)
      })
    }, 

    //C21948
    nextButtonEnabled: () => {
      inputChecker.nextButtonCheck('be.not.be.disabled')
    },

    //C21962
    checkConfirmButtonDisabledForLN2Shipper: () => {
      inputChecker.checkState('[data-testid="ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-action-trigger-button"]', 'be.disabled')
    },

    //C21963
    checkConfirmButtonDisabledForCassette: () => {
      inputChecker.checkState('[data-testid="cassette-1-button"]', 'be.disabled')
    },

    //C21964
    checkConfirmButtonEnabledForCassette: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.inputStringValue('[data-testid="cassette-1-input"]', `${coi}-PRC-01`)
        inputChecker.checkState('[data-testid="cassette-1-button"]', 'not.be.disabled')
      })
    },

    //C21965
    checkConfirmButtonEnabledForLN2Shipper: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.inputStringValue('[data-testid="ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-input-field"]', coi)
        inputChecker.checkState('[data-testid="ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-action-trigger-button"]', 'not.be.disabled')
        inputChecker.clearField('[data-testid="ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-input-field"]')
      })
    },

    //C25758
    checkInvalidDataForCassette: () => {
      inputChecker.scanAndVerifyMultipleNeg('cassette-1', 'abcdefg')
      inputChecker.clearField('[data-testid="cassette-1-input"]')
    },

    //C25759
    checkInvalidDataForLN2Shipper: () => {
      inputChecker.scanAndVerify('[data-testid="ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-input-field"]', '[data-testid="ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-action-trigger-button"]', 'abcdegf')
    }
  },

  productReceipt: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '')
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber)
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope)
        m_steps.manufacturingTransferProductToStorage(coi)
        m_steps.manufacturingTransferProductToStorage2(coi)
      })
    },

    subjectNumberNeg: () => {
      // C39284
      inputHelpers.clicker(['[data-testid="pass-button-ambient_temperature"]','[data-testid="pass-button-seal_in_place"]', '[data-testid="pass-button-expected_condition"]',
      '[data-testid="pass-button-free_from_cracks"]', '[data-testid="pass-button-placed_into_storage"]'])
      inputChecker.nextButtonCheck('be.disabled')
      inputChecker.scanAndVerifyCheck('patient-id', '1234', 'not.be.visible', 'be.disabled')
    },

    ambientTemperatureToggleNeg: (scope) => {
      // C39285
      inputChecker.scanAndVerifyCheck('patient-id', scope.patientInformation.subjectNumber, 'be.visible', 'not.be.disabled')
      inputChecker.clickOnCheck('[data-testid="pass-button-ambient_temperature"]','be.disabled')
      inputHelpers.clicker('[data-testid="fail-button-ambient_temperature"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/ambient_temperature_reason-input"]')
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    ambientTemperatureTogglePos: () => {
      // C39291
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/ambient_temperature_reason-input"]','test1')
      inputChecker.nextButtonCheck("be.enabled");
    },

    sealInPlaceToggleNeg: () => {
      // C39287
      inputHelpers.clicker('[data-testid="pass-button-ambient_temperature"]')
      inputChecker.clickOnCheck('[data-testid="pass-button-seal_in_place"]','be.disabled')
      inputHelpers.clicker('[data-testid="fail-button-seal_in_place"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]')
      inputChecker.nextButtonCheck("not.be.enabled");
    },
    sealInPlaceTogglePos: () => {
      // C39292
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]','test1')
      inputChecker.nextButtonCheck("be.enabled");
    },

    expectedConditionToggleNeg: () => {
      // C39288
      inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
      inputChecker.clickOnCheck('[data-testid="pass-button-expected_condition"]','be.disabled')
      inputHelpers.clicker('[data-testid="fail-button-expected_condition"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]')
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    expectedConditionTogglePos: () => {
      // // C39293
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]','test1')
      inputChecker.nextButtonCheck("be.enabled");
    },

    freeFromCracksToggleNeg: () => {
      // C39289
      inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
      inputChecker.clickOnCheck('[data-testid="pass-button-free_from_cracks"]','be.disabled')
      inputHelpers.clicker('[data-testid="fail-button-free_from_cracks"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/free_from_cracks_reason-input"]')
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    freeFromCracksTogglePos: () => {
      // // C39294
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/free_from_cracks_reason-input"]','test1')
      inputChecker.nextButtonCheck("be.enabled");
    },

    placedIntoStorageToggleNeg: () => {
      // C39290
      inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]')
      inputChecker.clickOnCheck('[data-testid="pass-button-placed_into_storage"]','be.disabled')
      inputHelpers.clicker('[data-testid="fail-button-placed_into_storage"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]')
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    placedIntoStorageTogglePos: () => {
      // // C39295
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]','test1')
      inputChecker.nextButtonCheck("be.enabled");
    },

    saveAndClosePos: () => {
      // C39286
      inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      })
    }
  },

  productReceiptSummary: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '')
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber)
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope)
        m_steps.manufacturingTransferProductToStorage(coi)
        m_steps.manufacturingTransferProductToStorage2(coi)
      })
      m_steps.manufacturingProductReceipt(scope.patientInformation);
    },
 
    verifySignaturePos: () => {
      // C39283
      inputChecker.checkNextButtonWithAndWithoutSignature('2')
    },
  },

  manufacturingStart: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '')
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber)
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope)
        m_steps.manufacturingTransferProductToStorage(coi)
        m_steps.manufacturingTransferProductToStorage2(coi)
      })
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(therapy, scope);
    },

    checkboxNeg: () => {
      // C39279
      inputChecker.nextButtonCheck('be.disabled')
    },

    saveAndClosePos: () => {
      // C39280
      inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]');
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      })
      inputChecker.nextButtonCheck('be.enabled')
    },
  },


  selectExpiryData: {
    previousHappyPathSteps: (scope, therapy) => {
      //cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
      })
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(therapy, scope)
      m_steps.manufacturingStart();
    },

    dataNotEntered: () => {
      //C21996
      inputHelpers.inputSingleField("[id='#/properties/lot_number-input']", regressionInput.manufacturing.inputNothing);
      inputHelpers.inputDateField("input[id='#/properties/item_expiry_date-input']", regressionInput.manufacturing.inputNothing)
      inputHelpers.inputSingleField("[id='#/properties/item_count-input']", regressionInput.manufacturing.inputNothing)
      inputChecker.nextButtonCheck('be.disabled');
    },

    invalidDateEntered: () => {
      //C22003
      inputHelpers.inputDateField("input[id='#/properties/item_expiry_date-input']", regressionInput.manufacturing.invalidExpiryDate)
      inputChecker.nextButtonCheck('be.disabled');

    },
    validDateEntered: () => {
      //C22004
      inputHelpers.inputDateField("input[id='#/properties/item_expiry_date-input']", regressionInput.manufacturing.validExpiryDateOne)

    },
    validNumberOfBagsEntered: () => {
      //C22005
      inputHelpers.inputSingleField('[id="#/properties/item_count-input"]', input.noOfBags)
    },

    invalidNumberOfBagsEntered: () => {
      //C22006
      inputHelpers.inputSingleField('[id="#/properties/item_count-input"]', regressionInput.manufacturing.invalidNumberofBags)
    },

    dateAndBagConfirmed: () => {
      //C22009
      inputHelpers.inputSingleField("[id='#/properties/lot_number-input']", input.lotNumber);
      inputHelpers.inputDateField("input[id='#/properties/item_expiry_date-input']", regressionInput.manufacturing.validExpiryDate)
      inputHelpers.inputSingleField('[id="#/properties/item_count-input"]', regressionInput.manufacturing.validNumberofBags)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    dataOnSaveAndClose: () => {
      //C22007
      inputHelpers.inputSingleField("[id='#/properties/lot_number-input']", input.lotNumber);
      inputHelpers.inputDateField("input[id='#/properties/item_expiry_date-input']", regressionInput.manufacturing.validExpiryDate)
      inputHelpers.inputSingleField('[id="#/properties/item_count-input"]', regressionInput.manufacturing.validNumberofBags)
      inputChecker.nextButtonCheck('not.be.disabled')
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
      })
    },
  },

  confirmExpiryData: {
    previousHappyPathSteps: (scope, therapy) => {
      //cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
      })
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(therapy, scope)
      m_steps.manufacturingStart();
      m_steps.manufacturingSelectExpiryData();
    },
    signatureNotDone: () => {
      //22010
      inputChecker.checkState("[data-testid='approver-sign-button']", "not.be.disabled")
      inputChecker.checkState("[data-testid='verifier-sign-button']", "be.disabled")
      inputChecker.nextButtonCheck('be.disabled');
    },
    signForConfirmerEnabled: () => {
      //22015
      inputChecker.checkState("[data-testid='approver-sign-button']", "not.be.disabled")
    },
    signForVerifierDisabled: () => {
      //22012
      inputChecker.checkState("[data-testid='verifier-sign-button']", "be.disabled")
      // cy.get("[data-testid='verifier-sign-button']").should('be.disabled')
    },

    checkNextButtonWithSignature: () => {
      //C22011
      inputChecker.checkNextButtonWithAndWithoutSignature('2')
    },
    askToResign: () => {
      //C22018
      cy.get(`[data-testid="back-nav-link"]`).click();
      inputChecker.nextButtonCheck('not.be.disabled')
      inputHelpers.inputSingleField('[id="#/properties/lot_number-input"]', regressionInput.manufacturing.lotNumberOne)
      inputChecker.reasonForChange();
      inputChecker.checkState("[data-testid='approver-sign-button']", "not.be.disabled")
      inputChecker.checkState("[data-testid='verifier-sign-button']", "be.disabled")
      inputChecker.nextButtonCheck('be.disabled')
    },
  },


  printFinalProductLabels: {
    previousHappyPathSteps: (scope, therapy) => {
      //cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
      })
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(therapy, scope)
      m_steps.manufacturingStart();
      m_steps.manufacturingSelectExpiryData();
      m_steps.manufacturingConfirmExpiryData();
    },


    printLablesClickable: () => {
      //C22021
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.popupMessageVisible('btn-print', 'banner-container-0');
    },

    confirmPrintLabelNeg: () => {
      //C22022
      inputChecker.nextButtonCheck('be.disabled');
    },

    confirmPrintLabelPos: () => {
      //C22023
      cy.reload();
      inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]');
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    signToConfirmAppearNextDisabledNeg: () => {
      //C22024
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      })
      actionButtonsHelper.checkActionButtonIsEnabled('primary'); //[BUG] Next button should be disabled without Signature
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature']);
    },

    checkForInfoSaved: (scope) => {
      //C22025 
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Patients")
      inputChecker.nextButtonCheck('not.be.disabled')
    }
  },

  confirmationOfLabelApplication: {
    previousHappyPathSteps: (scope, therapy) => {
      //cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
      })
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(therapy, scope)
      m_steps.manufacturingStart();
      m_steps.manufacturingSelectExpiryData();
      m_steps.manufacturingConfirmExpiryData();
      m_steps.manufacturingFinalLabels();
    },

    
    noOptionSelectedNeg: () => {
      //C38205
      inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    seventyMLButtonSelectedPos: () => {
      //C22028
      cy.reload();
      inputHelpers.clicker('[data-testid="right-button-radio"]');
      inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]');
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    checkboxUncheckedThirtyMLSelectedNeg: () => {
      //C22029
      cy.reload();
      inputHelpers.clicker('[data-testid="left-button-radio"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    checkboxUncheckedSeventyMLSelectedNeg: () => {
      //C22030
      cy.reload();
      inputHelpers.clicker('[data-testid="right-button-radio"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    checkForInfoSaved: (scope) => {
      //C22032
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Patients")
      inputChecker.nextButtonCheck('not.be.disabled')
    }
  },

  confirmationOfLabelApplicationPart2: {
    previousHappyPathSteps: (scope, therapy) => {
      //cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients');
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
        m_steps.manufacturingProductReceipt(scope.patientInformation);
        m_steps.manufacturingProductReceiptSummary(therapy, scope);
        m_steps.manufacturingStart();
        m_steps.manufacturingSelectExpiryData();
        m_steps.manufacturingConfirmExpiryData();
        m_steps.manufacturingFinalLabels();
        m_steps.manufacturingLabelApplicationIS(coi);
      })
    },

    //C22034
    confirmButtonDisabledforCoiBag: () => {
      inputChecker.checkState('[data-testid="bag-identifier-1-button"]', 'be.disabled');
    },

    //C22035
    confirmButtonDisbaledForCassette: () => {
      inputChecker.checkState('[data-testid="cassette-1-button"]', 'be.disabled');
    },

    //C22036
    confirmButtonEnabledForCoiBag: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.inputStringValue('[data-testid="bag-identifier-1-input"]', `${coi}-FPS-01`);
        inputChecker.checkState('[data-testid="bag-identifier-1-button"]', 'not.be.disabled');
      });
    },

    //C22037
    confirmButtonEnabledForcassette: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.inputStringValue('[data-testid="cassette-1-input"]', `${coi}-FPS-01`);
        inputChecker.checkState('[data-testid="cassette-1-button"]', 'not.be.disabled');
      });
    },

    //C39046
    invalidDataForCoiBag: () => {
      inputChecker.scanAndVerifyMultipleNeg('bag-identifier-1', 'abcdef');
      inputChecker.scanAndVerifyMultipleNeg('bag-identifier-1', '12345');
    },

    //C39047
    invalidDataForCassette: () => {
      inputChecker.scanAndVerifyMultipleNeg('cassette-1', 'abcdef');
      inputChecker.scanAndVerifyMultipleNeg('cassette-1', '12345');
    },

    //C22038
    confirmCheckboxUnchecked:  () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyMultiplePos('bag-identifier-1', `${coi}-FPS-01`, 'not.be.disabled');
        inputChecker.scanAndVerifyMultiplePos('cassette-1', `${coi}-FPS-01`, 'not.be.disabled');
        inputChecker.checkState('[data-testid="primary-button-action"]', 'be.disabled');
      })
    },

    //C22039
    confirmCheckboxChecked: () => {
      inputHelpers.clicker('[id="#/properties/data/properties/destruction_confirmed"]');
      inputChecker.checkState('[data-testid="primary-button-action"]', 'not.be.disabled');
    },

    //C22041
    saveAndClose: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations");
      });
      inputChecker.nextButtonCheck("be.enabled");
    }
},

  qualityRelease : {
    previousHappyPathSteps: (scope, therapy) => {
      //cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
        m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(therapy, scope)
      m_steps.manufacturingStart();
      m_steps.manufacturingSelectExpiryData();
      m_steps.manufacturingConfirmExpiryData();
      m_steps.manufacturingFinalLabels();
      m_steps.manufacturingLabelApplication(scope.coi);
      })
      

    },
    
    nextButtonDisabledNeg: () => {
      //22044
      inputChecker.nextButtonCheck('be.disabled');
    },
    nextButtonAfterTicking: () => {
      // C22045
      inputHelpers.clicker('[id="#/properties/data/properties/is_verified"]');
      inputChecker.nextButtonCheck('be.enabled')
    },
    signButtonEnabledAfterClickingNext: () => {
      // C22049
      cy.get('[data-testid="primary-button-action"]').click();
      inputChecker.checkState("[data-testid='approver-sign-button']", "not.be.disabled")
    },
    nextButtonAfterSignature: () => {
      // C24213
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.nextButtonCheck('be.enabled')
    }

  },


    bagSelection: {
    previousHappyPathSteps: (scope, therapy) => {
      //cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
        m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(therapy, scope)
      m_steps.manufacturingStart();
      m_steps.manufacturingSelectExpiryData();
      m_steps.manufacturingConfirmExpiryData();
      m_steps.manufacturingFinalLabels(therapy);
      m_steps.manufacturingLabelApplication(scope.coi);
      m_steps.manufacturingQualityRelease();
      })
      
    },
    nextButtonDisabledNeg: () => {
      // C24214
      inputChecker.nextButtonCheck('be.disabled');
    },
    doNotShipBag : () => {
      // C24217
      inputHelpers.clicker('[data-testid="fail-button-0"]')
      inputChecker.nextButtonCheck('be.disabled')
    },
    shipBag : ()=> {
      // C38600
      inputHelpers.clicker('[data-testid="pass-button-0"]')
      inputChecker.nextButtonCheck('not.be.disabled')
    },
    saveAndClosePos : () => {
      // C24220
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      },)
    }
  },
  transferProductToShipper: {
  previousHappyPathSteps: (scope, therapy) => {
      //cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
        m_steps.manufacturingProductReceipt(scope.patientInformation);
        m_steps.manufacturingProductReceiptSummary(therapy, scope)
        m_steps.manufacturingStart();
        m_steps.manufacturingSelectExpiryData();
        m_steps.manufacturingConfirmExpiryData();
        m_steps.manufacturingFinalLabels();
        m_steps.manufacturingLabelApplication(coi);
      });
      m_steps.manufacturingQualityRelease();
      m_steps.manufacturingBagSelection();
    },

    // C38407
    negCoiNotEnteredForBagIdentifier: () => {
      inputChecker.scanAndVerifyFieldAsEmpty('cassette-1', 'be.disabled');
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38408
    negCoiNotEnteredForShipperLabel: () => {
      inputChecker.scanAndVerifyFieldAsEmpty('ln-2-shipper-1', 'be.disabled');
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38413
    negToggleIsShippingContainerIntact: () => {
      inputHelpers.clicker(['[data-testid="fail-button-manufacturing_checklist_intact"]',
        '[data-testid="pass-button-manufacturing_checklist_temp_out_of_range"]']);
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/manufacturing_checklist_intact_reason-input"]');
      cy.get(`@coi`).then(coi => {
        inputHelpers.scanAndVerifyBags('cassette-1', `${coi}-FPS-01`);
        inputHelpers.scanAndVerifyBags('ln-2-shipper-1', coi);
      });
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38414
    negNothingSelectedForIsShippingContainer: () => {
      cy.reload();
      inputHelpers.clicker('[data-testid="pass-button-manufacturing_checklist_temp_out_of_range"]');
      inputChecker.checkForGreenCheck("cassette-1")
      inputChecker.checkForGreenCheck("ln-2-shipper-1")
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38415
    posToggleIsShippingContainerIntact: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="fail-button-manufacturing_checklist_intact"]',
        '[data-testid="pass-button-manufacturing_checklist_temp_out_of_range"]']);
      inputChecker.checkForGreenCheck("cassette-1");
      inputChecker.checkForGreenCheck("ln-2-shipper-1");
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/manufacturing_checklist_intact_reason-input"]', 'some reason', "be.enabled");
    },

    // C38416
    negToggleWasThereATemperature: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-manufacturing_checklist_intact"]',
        '[data-testid="fail-button-manufacturing_checklist_temp_out_of_range"]']);
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/manufacturing_checklist_temp_out_of_range_reason-input"]');
      inputChecker.checkForGreenCheck("cassette-1");
      inputChecker.checkForGreenCheck("ln-2-shipper-1");
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38417
    negNothingSelectedForWasThereATemperature: () => {
      cy.reload();
      inputHelpers.clicker('[data-testid="pass-button-manufacturing_checklist_intact"]');
      inputChecker.checkForGreenCheck("cassette-1")
      inputChecker.checkForGreenCheck("ln-2-shipper-1")
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38418
    posToggleWasThereATemperature: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-manufacturing_checklist_intact"]',
        '[data-testid="fail-button-manufacturing_checklist_temp_out_of_range"]']);
      inputChecker.checkForGreenCheck("cassette-1");
      inputChecker.checkForGreenCheck("ln-2-shipper-1");
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/manufacturing_checklist_temp_out_of_range_reason-input"]', 'some reason', "be.enabled");
    },

    // C38409
    posSaveAndCloseButtonCheck: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations");
      });
      inputChecker.checkForGreenCheck("cassette-1");
      inputChecker.checkForGreenCheck("ln-2-shipper-1");
      inputChecker.nextButtonCheck("be.enabled");
    }
  },

  shippingManufacturing: {
    previousHappyPathSteps: (scope, therapy) => {
      //cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
        m_steps.manufacturingProductReceipt(scope.patientInformation);
        m_steps.manufacturingProductReceiptSummary(therapy, scope)
        m_steps.manufacturingStart();
        m_steps.manufacturingSelectExpiryData();
        m_steps.manufacturingConfirmExpiryData();
        m_steps.manufacturingFinalLabels();
        m_steps.manufacturingLabelApplication(coi);
        m_steps.manufacturingQualityRelease();
        m_steps.manufacturingBagSelection();
        m_steps.manufacturingTransferProductToShipper(coi);
      });
    },

    // C38371
    negAirWaybillNotConfirmed: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputChecker.keepFieldsEmpty('manufacturing-airway-bill', 'be.disabled');
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38372
    negSubjectNumberOnAirWaybillNotEntered: (scope) => {
      getManufAirWayBill(scope, 1);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputChecker.checkForGreenCheck("manufacturing-airway-bill");
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38373
    negEvoIsNumberFieldLeftEmpty: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputChecker.checkForGreenCheck("manufacturing-airway-bill");
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38374
    negTamperSealNumberFieldLeftEmpty: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputChecker.checkForGreenCheck("manufacturing-airway-bill");
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38375
    posNextButtonCheckWithAllDetailsEntered: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputChecker.checkForGreenCheck("manufacturing-airway-bill");
      inputChecker.nextButtonCheck("be.enabled");
    },

    // C38376
    negToggleConfirmInvestigational: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="fail-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/investigational_product_reason-input"]');
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38377
    negNothingSelectedForConfirmInvestigational: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-cry_rack_label"]', '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38378
    posToggleConfirmInvestigational: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="fail-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/investigational_product_reason-input"]', 'some reason', "be.enabled");
    },

    // C38379
    negToggleIsRedWireTamperSeal: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="fail-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/cry_rack_label_reason-input"]');
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38380
    negNothingSelectedForIsRedWireTamperSeal: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="fail-button-investigational_product"]', '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38381
    posToggleIsRedWireTamperSeal: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="fail-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/cry_rack_label_reason-input"]', 'some reason', "be.enabled");
    },

    // C38382
    negToggleDoesEvoIsNumberListed: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="fail-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/evo_airway_bill_reason-input"]');
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38383
    negNothingSelectedForDoesEvoIsNumberListed: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="fail-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38384
    posToggleDoesEvoIsNumberListed: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="fail-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/evo_airway_bill_reason-input"]', 'some reason', "be.enabled");
    },

    // C38388
    negToggleIsTamperSealInPlace: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="fail-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_shipper_reason-input"]');
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38389
    negNothingSelectedForIsTamperSealInPlace: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38390
    posToggleIsTamperSealInPlace: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="fail-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_shipper_reason-input"]', 'some reason', "be.enabled");
    },

    // C38385
    negToggleDoesTamperSealNumberListed: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="fail-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_match_reason-input"]');
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38386
    negNothingSelectedForDoesTamperSealNumber: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]', '[data-testid="pass-button-evo_airway_bill"]',
        '[data-testid="pass-button-red_wire_tamper_shipper"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38387
    posToggleDoesTamperSealNumberListed: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="fail-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_match_reason-input"]', 'some reason', "be.enabled");
    },

    // C38391
    negToggleIsShipperLabelsIncluded: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="fail-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/shipper_label_placed_reason-input"]');
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38392
    negNothingSelectedForIsShipperLabelsIncluded: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]', '[data-testid="pass-button-tamper_seal_match"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38393
    posToggleIsShipperLabelsIncluded: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="fail-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/shipper_label_placed_reason-input"]', 'some reason', "be.enabled");
    },

    // C38394
    negToggleIsConsigneeKitPouch: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="fail-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/consignee_kit_pouch_inside_reason-input"]');
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38395
    negNothingSelectedForIsConsigneeKitPouch: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]', '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38396
    posToggleIsConsigneeKitPouch: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="fail-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/consignee_kit_pouch_inside_reason-input"]', 'some reason', "be.enabled");
    },

    // C38397
    negToggleIsShippingContainerSecured: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="fail-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/zip_ties_secured_reason-input"]');
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38398
    negNothingSelectedForIsShippingContainer: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]', '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38399
    posToggleIsShippingContainerSecured: () => {
      cy.reload();
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="fail-button-zip_ties_secured"]']);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/zip_ties_secured_reason-input"]', 'some reason', "be.enabled");
    },

    // C38406
    posSaveAndCloseButtonCheck: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations");
      });
      inputChecker.checkForGreenCheck("manufacturing-airway-bill");
      inputChecker.nextButtonCheck("be.enabled");
    },

    // C25845
    negInvalidEvoIsNumberCheck: () => {
      inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.invalidEvoIsNumber, 'be.disabled');
    }
  },

  shippingManufacturingSummary: {
    previousHappyPathSteps: (scope, therapy) => {
      //cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
        m_steps.manufacturingProductReceipt(scope.patientInformation);
        m_steps.manufacturingProductReceiptSummary(therapy, scope)
        m_steps.manufacturingStart();
        m_steps.manufacturingSelectExpiryData();
        m_steps.manufacturingConfirmExpiryData();
        m_steps.manufacturingFinalLabels();
        m_steps.manufacturingLabelApplication(coi);
        m_steps.manufacturingQualityRelease();
        m_steps.manufacturingBagSelection();
        m_steps.manufacturingTransferProductToShipper(coi);
      });
      m_steps.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, therapy);
    },

    // C38649
    posCheckForEditButtonWorking: () => {
      inputHelpers.clicker('[data-testid="edit-shipping_manufacturing"]')
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.changedTamperSealNumber);
      inputChecker.reasonForChange()
      inputChecker.checkValue('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.changedTamperSealNumber);
    },

    // C38650
    negDoneButtonCheck: () => {
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C38651
    posDoneButtonCheck: () => {
      const verifier = 'quela@vineti.com';
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], verifier);
      inputChecker.nextButtonCheck("be.enabled");
    },

    // C24644
    posReasonForChangePopUp: () => {
      inputChecker.nextButtonCheck('be.enabled');
      inputChecker.backButtonCheck('[data-testid="back-nav-link"]');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.changedEvoIsNumber);
      inputChecker.reasonForChange();
      inputChecker.nextButtonCheck('be.disabled');
    },

    // C38652
    posSaveAndCloseButtonCheck: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations");
      });
      inputChecker.nextButtonCheck("be.enabled");
    },
  },

  checkStatusesOfManufacturingModule: (scope, therapy) => {
    //C40072
    cy.openOrder('manufacturing','steph')
    cy.get(`@coi`).then((coi) => {
    cy.commonPagination(coi, 'Reservations')

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.collectionStatus,'Reservations',4)
        m_steps.manufacturingCollectionSummary()

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.verifyShipper,'Reservations',4)
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '');

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.shipmentReceiptChecklist,'Reservations',4)
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.shipmentReceiptChecklistSummary,'Reservations',4)
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.transferProductToStorage1,'Reservations',4)
        m_steps.manufacturingTransferProductToStorage(coi);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.transferProductToStorage2,'Reservations',4)
        m_steps.manufacturingTransferProductToStorage2(coi);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.productReceipt,'Reservations',4)
        m_steps.manufacturingProductReceipt(scope.patientInformation);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.productReceiptSummary,'Reservations',4)
        m_steps.manufacturingProductReceiptSummary(therapy, scope);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.manufacturingStart,'Reservations',4)
        m_steps.manufacturingStart();

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.selectExpiryData,'Reservations',4)
        m_steps.manufacturingSelectExpiryData();

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.confirmExpiryData,'Reservations',4)
        m_steps.manufacturingConfirmExpiryData();

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.printFinalProductLabels,'Reservations',4)
        m_steps.manufacturingFinalLabels(therapy);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.confirmLabelApplication1,'Reservations',4)
        m_steps.manufacturingLabelApplication(coi);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.qualityRelease,'Reservations',4)
        m_steps.manufacturingQualityRelease();

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.bagSelection,'Reservations',4)
        m_steps.manufacturingBagSelection();

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.transferProductToShipper,'Reservations',4)
        m_steps.manufacturingTransferProductToShipper(coi);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.shippingManufacturing,'Reservations',4)
        m_steps.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, therapy);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.shippingManufacturingSummary,'Reservations',4)
        m_steps.manufacturingShippingManufacturingSummary(therapy);

        cy.checkStatus(coi,regressionInput.manufacturing.statuses.shippingSummary,'Reservations',4)
    })
  }
}
