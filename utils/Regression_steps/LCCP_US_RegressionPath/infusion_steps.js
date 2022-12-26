import common from '../../../support/index.js'
import translationHelpers from '../../shared_block_helpers/translationHelpers'
import infusionAssertions from '../../../fixtures/infusionAssertions.json'
import input from '../../../fixtures/inputs.json'
import regressionInput from '../../../fixtures/inputsRegression.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers.js'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers.js'
import inf_steps from '../../../utils/HappyPath_steps/LCCP_US_HappyPath/infusion_steps';

export default {
  openOrder: () => {
    common.loginAs('phil');
    cy.visit('/infusion');
    cy.get('.patient-id')
      .contains(scope.patientInformation.subjectNumber)
      .click();
  },

  receiveShipment: {
    nextButtonDisabled: () => {
      // C25694
      inputChecker.nextButtonCheck('be.disabled')
    },
    coiConfirmed: () => {
      // C28678
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-manufacturing-site-to-infusion-lccp', `${coi}`, 'not.be.visible', 'be.disabled')
      });

    }
  },

  shipmentReceiptChecklist: {
    previousHappyPathSteps: (scope) => {
      cy.get(`@coi`).then(coi => {
        inf_steps.infusionReceiveShipment('manufacturing-site', '-lccp', coi);
      })
    },

    //C28935
    emptyEvoIsNumberFieldNeg: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid="pass-button-shipping_container_condition"]', '[data-testid="pass-button-zip_ties_secured"]',
        '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_match"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', "be.disabled");
    },

    //C28936
    emptyTamperSealNumberFieldNeg: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.clicker(['[data-testid="pass-button-shipping_container_condition"]', '[data-testid="pass-button-zip_ties_secured"]',
        '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_match"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', "be.disabled");
    },

    //C28937
    shippingContainerCaseFieldNeg: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid="pass-button-zip_ties_secured"]', '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-consignee_pouch_inside"]',
        '[data-testid="pass-button-evo_match"]', '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.nextButtonCheck("be.disabled");
    },

    //C28938 
    noShippingContainerCaseFieldNeg: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid="fail-button-shipping_container_condition"]', '[data-testid="pass-button-zip_ties_secured"]',
        '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_match"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C28939
    toggleShippingContainerCasePos: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=fail-button-shipping_container_condition]', '[data-testid="pass-button-zip_ties_secured"]',
        '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_match"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_condition_reason-input"]', 'some reason', "be.enabled");
    },

    //C28941 
    nothingToggleShippingContainer: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_condition]',
        '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_match"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.nextButtonCheck('be.disabled')
    },


    //C28942
    noToggleShippingContainer: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_condition]', '[data-testid="fail-button-zip_ties_secured"]',
        '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_match"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.nextButtonCheck('be.disabled');
    },


    //C28943
    toggleShippingContainerCaseSecuredPos: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_condition]', '[data-testid="fail-button-zip_ties_secured"]',
        '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_match"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]', 'some reason', "be.enabled");
    },

    //C28944
    nothingToggleShipperLabel: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_condition]', '[data-testid="pass-button-zip_ties_secured"]',
        '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_match"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C28945
    nothingToggleShipperLabel: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_condition]', '[data-testid="pass-button-zip_ties_secured"]',
        '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="fail-button-included_shipper_label"]', '[data-testid="pass-button-evo_match"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C28946 
    toggleShipperLabelPos: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_condition]', '[data-testid="pass-button-zip_ties_secured"]',
        '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="fail-button-included_shipper_label"]', '[data-testid="pass-button-evo_match"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/included_shipper_label_reason-input"]', 'some reason', "be.enabled");
    },

    //C28947 
    nothingSelectedForConsigneeKit: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_condition]', '[data-testid="pass-button-zip_ties_secured"]',
        '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-evo_match"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C28948
    noToggleConsigneeKit: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_condition]', '[data-testid="pass-button-zip_ties_secured"]',
        '[data-testid="fail-button-consignee_pouch_inside"]', '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-evo_match"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C28949 
    toggleConsigneeKitPos: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_condition]', '[data-testid="pass-button-zip_ties_secured"]',
        '[data-testid="fail-button-consignee_pouch_inside"]', '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-evo_match"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]', 'some reason', "be.enabled");
    },

    //C28950
    nothingEvoNumber: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_condition]', '[data-testid="pass-button-zip_ties_secured"]',
        '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-included_shipper_label"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C28951
    noEvoNumber: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_condition]', '[data-testid="pass-button-zip_ties_secured"]',
        '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-included_shipper_label"]', '[data-testid="fail-button-evo_match"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C28952
    toggleEvoNumberPos: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_condition]', '[data-testid="pass-button-zip_ties_secured"]',
        '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-included_shipper_label"]', '[data-testid="fail-button-evo_match"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_match_reason-input"]', 'some reason', "be.enabled");
    },

    //C28953
    nothingRedTamperSeal: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_condition]', '[data-testid="pass-button-zip_ties_secured"]',
        '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-included_shipper_label"]', '[data-testid="fail-button-evo_match"]',
        '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C28954 
    noRedTamperSeal: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_condition]', '[data-testid="pass-button-zip_ties_secured"]',
        '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-evo_match"]',
        '[data-testid="fail-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C28955
    toggleRedTamperPos: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_condition]', '[data-testid="pass-button-zip_ties_secured"]',
        '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-evo_match"]',
        '[data-testid="fail-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]', 'some reason', "be.enabled");
    },

    //C28956
    nothingTamperSeal: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_condition]', '[data-testid="pass-button-zip_ties_secured"]',
        '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-evo_match"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]']);
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C28957
    noTamperSeal: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_condition]', '[data-testid="pass-button-zip_ties_secured"]',
        '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-evo_match"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="fail-button-tamper_seal_match"]']);
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C28940
    saveAndClosePos: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Patients")
      })
    },

    //C28959
    posBackLinkCheck: () => {
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
      inputHelpers.clicker(['[data-testid=pass-button-shipping_container_condition]', '[data-testid="pass-button-zip_ties_secured"]',
        '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-evo_match"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.checkDataSavingWithBackButton("be.enabled");
    }

  },

  shipmentReceiptSummary: {
    previousHappyPathSteps: (scope) => {
      cy.get(`@coi`).then(coi => {
        inf_steps.infusionReceiveShipment('manufacturing-site', '-lccp', coi);
        inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber)
      })
    },

    //C25751
    posEditButton: () => {
      inputHelpers.clicker('[data-testid="edit-shipment_receipt_checklist"]');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.changedEvoIsNumber);
      inputHelpers.clicker('[data-testid="primary-button-action"]');
      inputChecker.inputSingleFieldCheck('[data-testid="reason-for-change-textarea"]', 'some reason', "be.enabled");
    },

    //C25752
    nextButtonPos: () => {
      inputChecker.nextButtonCheck('be.disabled')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], input.verifier[1])
      inputChecker.nextButtonCheck('not.be.disabled')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      })
    }
  },

  transferProductToStorage: {
    previousHappyPathSteps: (scope) => {
      cy.get(`@coi`).then(coi => {
        inf_steps.infusionReceiveShipment('manufacturing-site', '-lccp', coi);
        inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        inf_steps.infusionShipmentReceiptSummary(scope);
      })
    },

    //C25825
    negNextButtonForFinalProduct: () => {
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C25827
    negNextButtonForCoiBag: () => {
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C25826
    negNextButtonForLn2Shipper: () => {
      inputChecker.nextButtonCheck('be.disabled')
    }
  },

  productReceiptChecklist: {
    previousHappyPathSteps: (scope) => {
      cy.get(`@coi`).then(coi => {
        inf_steps.infusionReceiveShipment('manufacturing-site', '-lccp', coi);
        inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        inf_steps.infusionShipmentReceiptSummary(scope);
        inf_steps.infusionTransferProductToStorage(coi);
      })
    },

    nothingSelectedForInvestigationProductNeg: () => {
      //C28876
      inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
      inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
      inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
      inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    noSelectedForInvestigationProductNeg: () => {
      //C28877
      inputHelpers.clicker('[data-testid="fail-button-investigational_product"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    reasonFilledForInvestigationProductPOS: () => {
      //C28878
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/investigational_product_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    nothingSelectedForSealInPlaceNeg: () => {
      //C28879
      inputHelpers.clicker('[data-testid="pass-button-investigational_product"]');
      inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    noSelectedForSealInPlaceNeg: () => {
      //C28880
      inputHelpers.clicker('[data-testid="fail-button-seal_in_place"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    reasonFilledForSealInPlacePos: () => {
      //C28881
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    nothingSelectedForTempRangeNeg: () => {
      //C28882
      inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
      inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    yesSelectedForTempRangeNeg: () => {
      //C28883
      inputHelpers.clicker('[data-testid="fail-button-temperature_out_of_range"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    reasonFilledForTempRangedPos: () => {
      //C28884
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/temperature_out_of_range_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    nothingSelectedForExpecCondtionNeg: () => {
      //C28885	
      inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
      inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    noSelectedForExpecCondtionNeg: () => {
      //C28886
      inputHelpers.clicker('[data-testid="fail-button-expected_condition"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    reasonFilledForForExpecCondtionPos: () => {
      //C28887
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled');
    },

    nothingSelectedForStorageNeg: () => {
      //C28888
      inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
      inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    noSelectedForStorageNeg: () => {
      //C28889
      inputHelpers.clicker('[data-testid="fail-button-placed_into_storage"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    reasonFilledForStoragePos: () => {
      //C28890
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
    },
  },

  productReceiptSummary: {
    previousHappyPathSteps: (scope) => {
      cy.get(`@coi`).then(coi => {
        inf_steps.infusionReceiveShipment('manufacturing-site', '-lccp', coi);
        inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        inf_steps.infusionShipmentReceiptSummary(scope);
        inf_steps.infusionTransferProductToStorage(coi);
        inf_steps.infusionProductReceiptChecklist();
      })
    },

    nextButtonPos: () => {
      //C28891
      inputChecker.nextButtonCheck('be.disabled')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], input.verifier[1])
      inputChecker.nextButtonCheck('not.be.disabled')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      })
    },
  }
}