import common from '../../../support/index.js'
import translationHelpers from '../../shared_block_helpers/translationHelpers'
import infusionAssertions from '../../../fixtures/infusionAssertions.json'
import regressionInput from '../../../fixtures/inputsRegression.json'
import input from '../../../fixtures/inputs.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers.js'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers.js'
import inf_steps from '../../../utils/HappyPath_steps/LCLP_US_HappyPath/infusion_steps';
import regressionInput from '../../../fixtures/inputsRegression.json'

export default {
    openOrder: () => {
        common.loginAs('phil');
        cy.visit('/infusion');
        cy.get('.patient-id')
            .contains(scope.patientInformation.subjectNumber)
            .click();
    },

    receiveShipment: {
        nextButtonDisabled: () =>{
            // C25694
            inputChecker.nextButtonCheck('be.disabled')
        },
        coiConfirmed: () => {
            // C28678
            cy.get(`@coi`).then(coi => {
                inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-manufacturing-site-to-infusion', `${coi}`, 'not.be.visible', 'be.disabled')
              });    
              
            }
    },

    shipmentReceiptChecklist: {
        previousHappyPathSteps: (scope) => {
            cy.get(`@coi`).then(coi => {
                inf_steps.infusionReceiveShipment('manufacturing-site', '', coi);
            })
        },
    
        //C25698 
        emptyEvoIsNumberFieldNeg: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid="pass-button-shipping_container_condition"]', '[data-testid="pass-button-zip_ties_secured"]',
              '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_match"]',
              '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
            inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', "be.disabled");
        },
    
        //C25699 
        emptyTamperSealNumberFieldNeg: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.clicker(['[data-testid="pass-button-shipping_container_condition"]', '[data-testid="pass-button-zip_ties_secured"]',
              '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_match"]',
              '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
            inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', "be.disabled");
        },
    
        //C25700 
        shippingContainerCaseFieldNeg: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid="pass-button-zip_ties_secured"]','[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-consignee_pouch_inside"]', 
                '[data-testid="pass-button-evo_match"]','[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
            inputChecker.nextButtonCheck("be.disabled");
        },
    
        //C25701 
        noShippingContainerCaseFieldNeg: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid="fail-button-shipping_container_condition"]', '[data-testid="pass-button-zip_ties_secured"]',
              '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_match"]',
              '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
            inputChecker.nextButtonCheck('be.disabled');
        },
    
        //C25702 
        toggleShippingContainerCasePos: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid=fail-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured"]',
              '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_match"]',
              '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
            inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_condition_reason-input"]', 'some reason', "be.enabled");
        },
    
        //C25723 
        nothingToggleShippingContainer: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', 
              '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_match"]',
              '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
            inputChecker.nextButtonCheck('be.disabled')
        },
    
        
        //C25724
        noToggleShippingContainer: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="fail-button-zip_ties_secured"]',
              '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_match"]',
              '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
            inputChecker.nextButtonCheck('be.disabled');
        },
    
    
        //C25725  
        toggleShippingContainerCaseSecuredPos: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="fail-button-zip_ties_secured"]',
              '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_match"]',
              '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
            inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]', 'some reason', "be.enabled");
        },
    
        //C25726 
        nothingToggleShipperLabel: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="fail-button-zip_ties_secured"]',
              '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_match"]',
              '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
            inputChecker.nextButtonCheck('be.disabled');
        },
    
        //C25727 
        nothingToggleShipperLabel : () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured"]',
              '[data-testid="pass-button-consignee_pouch_inside"]','[data-testid="fail-button-included_shipper_label"]' , '[data-testid="pass-button-evo_match"]',
              '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
            inputChecker.nextButtonCheck('be.disabled');
        },
    
        //C25728 
        toggleShipperLabelPos: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured"]',
              '[data-testid="pass-button-consignee_pouch_inside"]','[data-testid="fail-button-included_shipper_label"]' , '[data-testid="pass-button-evo_match"]',
              '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
            inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/included_shipper_label_reason-input"]', 'some reason', "be.enabled");
        },
    
        //C25729 
        nothingSelectedForConsigneeKit: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured"]',
              '[data-testid="pass-button-included_shipper_label"]' , '[data-testid="pass-button-evo_match"]',
              '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
            inputChecker.nextButtonCheck('be.disabled');
        },
    
        //C25730 
        noToggleConsigneeKit: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured"]',
              '[data-testid="fail-button-consignee_pouch_inside"]','[data-testid="pass-button-included_shipper_label"]' , '[data-testid="pass-button-evo_match"]',
              '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
            inputChecker.nextButtonCheck('be.disabled');
        },
    
        //C25731 
        toggleConsigneeKitPos: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured"]',
              '[data-testid="fail-button-consignee_pouch_inside"]','[data-testid="pass-button-included_shipper_label"]' , '[data-testid="pass-button-evo_match"]',
              '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
            inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]', 'some reason', "be.enabled");
        },
    
        //C25732 
        nothingEvoNumber: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured"]',
              '[data-testid="pass-button-consignee_pouch_inside"]','[data-testid="pass-button-included_shipper_label"]',
              '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);  
            inputChecker.nextButtonCheck('be.disabled'); 
        },
    
        //C25733 
        noEvoNumber: ()=> {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured"]',
              '[data-testid="pass-button-consignee_pouch_inside"]','[data-testid="pass-button-included_shipper_label"]' , '[data-testid="fail-button-evo_match"]',
              '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
            inputChecker.nextButtonCheck('be.disabled');
        },
    
        //C25734 
        toggleEvoNumberPos: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured"]',
              '[data-testid="pass-button-consignee_pouch_inside"]','[data-testid="pass-button-included_shipper_label"]' , '[data-testid="fail-button-evo_match"]',
              '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
            inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_match_reason-input"]', 'some reason', "be.enabled");    
        },
    
        //C25735 
        nothingRedTamperSeal: ()=> {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured"]',
              '[data-testid="pass-button-consignee_pouch_inside"]','[data-testid="pass-button-included_shipper_label"]' , '[data-testid="fail-button-evo_match"]',
              '[data-testid="pass-button-tamper_seal_match"]']);
            inputChecker.nextButtonCheck('be.disabled');
        },
    
        //C25736 
        noRedTamperSeal: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured"]',
            '[data-testid="pass-button-consignee_pouch_inside"]','[data-testid="pass-button-included_shipper_label"]' , '[data-testid="pass-button-evo_match"]',
            '[data-testid="fail-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
            inputChecker.nextButtonCheck('be.disabled');
        },
    
        //C25637 
        toggleRedTamperPos: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured"]',
            '[data-testid="pass-button-consignee_pouch_inside"]','[data-testid="pass-button-included_shipper_label"]' , '[data-testid="pass-button-evo_match"]',
            '[data-testid="fail-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
            inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]', 'some reason', "be.enabled");    
        },
        
        //C25738 
        nothingTamperSeal: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured"]',
            '[data-testid="pass-button-consignee_pouch_inside"]','[data-testid="pass-button-included_shipper_label"]' , '[data-testid="pass-button-evo_match"]',
            '[data-testid="pass-button-red_wire_tamper_seal"]']);
            inputChecker.nextButtonCheck('be.disabled')
        },
    
        //C25739 
        noTamperSeal: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured"]',
            '[data-testid="pass-button-consignee_pouch_inside"]','[data-testid="pass-button-included_shipper_label"]' , '[data-testid="pass-button-evo_match"]',
            '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="fail-button-tamper_seal_match"]']);
            inputChecker.nextButtonCheck('be.disabled');
        },
    
        //C25722 
        saveAndClosePos: () => {
            cy.get(`@coi`).then(coi => {
              inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Patients")
            })
            inputChecker.nextButtonCheck("be.enabled");
          },
    
        //C28679
        posBackLinkCheck: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
            inputHelpers.clicker(['[data-testid=pass-button-shipping_container_intact]', '[data-testid="pass-button-zip_ties_secured"]',
            '[data-testid="pass-button-consignee_pouch_inside"]','[data-testid="pass-button-included_shipper_label"]' , '[data-testid="pass-button-evo_match"]',
            '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
            inputChecker.checkDataSavingWithBackButton("be.enabled");
            inputHelpers.onClick('[data-testid="primary-button-action"]');
        }
    
    },
    
    shipmentReceiptSummary: {
        previousHappyPathSteps: (scope) => {
            cy.get(`@coi`).then(coi => {
                inf_steps.infusionReceiveShipment('manufacturing-site', '', coi);
                inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
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
                inf_steps.infusionReceiveShipment('manufacturing-site', '', coi);
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
                inf_steps.infusionReceiveShipment('manufacturing-site', '', coi);
                inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
                inf_steps.infusionShipmentReceiptSummary(scope);
                inf_steps.infusionTransferProductToStorage(coi);
            })
        },

        nothingSelectedForInvestigationProductNeg: () => {
            //C25828
            inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
            inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
            inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
            inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
            inputChecker.nextButtonCheck('be.disabled')
        },

        noSelectedForInvestigationProductNeg: () => {
            //C25829
            cy.reload();
            inputHelpers.clicker('[data-testid="fail-button-investigational_product"]');
            inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
            inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
            inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
            inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
            inputChecker.nextButtonCheck('be.disabled')
        },

        reasonFilledForInvestigationProductPOS: () => {
            //C25830
            inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/investigational_product_reason-input"]', input.reason)
            inputChecker.nextButtonCheck('not.be.disabled')
        },

        nothingSelectedForSealInPlaceNeg: () => {
            //C25848
            cy.reload();
            inputHelpers.clicker('[data-testid="pass-button-investigational_product"]');
            inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
            inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
            inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
            inputChecker.nextButtonCheck('be.disabled')
        },

        noSelectedForSealInPlaceNeg: () => {
            //C25849
            cy.reload();
            inputHelpers.clicker('[data-testid="pass-button-investigational_product"]');
            inputHelpers.clicker('[data-testid="fail-button-seal_in_place"]');
            inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
            inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
            inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
            inputChecker.nextButtonCheck('be.disabled')
        },

        reasonFilledForSealInPlacePos: () => {
            //C25850
            inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]', input.reason)
            inputChecker.nextButtonCheck('not.be.disabled')
        },

        nothingSelectedForTempRangeNeg: () => {
            //C25851
            cy.reload();
            inputHelpers.clicker('[data-testid="pass-button-investigational_product"]');
            inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
            inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
            inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
            inputChecker.nextButtonCheck('be.disabled')
        },

        yesSelectedForTempRangeNeg: () => {
            //C25852
            cy.reload();
            inputHelpers.clicker('[data-testid="pass-button-investigational_product"]');
            inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
            inputHelpers.clicker('[data-testid="fail-button-temperature_out_of_range"]');
            inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
            inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
            inputChecker.nextButtonCheck('be.disabled')
        },

        reasonFilledForTempRangedPos: () => {
            //C25853	
            inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/temperature_out_of_range_reason-input"]', input.reason)
            inputChecker.nextButtonCheck('not.be.disabled')
        },

        nothingSelectedForExpecCondtionNeg: () => {
            //C25854	
            cy.reload();
            inputHelpers.clicker('[data-testid="pass-button-investigational_product"]');
            inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
            inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
            inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
            inputChecker.nextButtonCheck('be.disabled');
        },

        noSelectedForExpecCondtionNeg: () => {
            //C25855	
            cy.reload();
            inputHelpers.clicker('[data-testid="pass-button-investigational_product"]');
            inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
            inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
            inputHelpers.clicker('[data-testid="fail-button-expected_condition"]');
            inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
            inputChecker.nextButtonCheck('be.disabled');
        },

        reasonFilledForForExpecCondtionPos: () => {
            //C25856
            inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]', input.reason)
            inputChecker.nextButtonCheck('not.be.disabled');
        },

        nothingSelectedForStorageNeg: () => {
            //C25857
            cy.reload();
            inputHelpers.clicker('[data-testid="pass-button-investigational_product"]');
            inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
            inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
            inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
            inputChecker.nextButtonCheck('be.disabled')
        },

        noSelectedForStorageNeg: () => {
            //C25858	
            cy.reload();
            inputHelpers.clicker('[data-testid="pass-button-investigational_product"]');
            inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
            inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
            inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
            inputHelpers.clicker('[data-testid="fail-button-placed_into_storage"]');
            inputChecker.nextButtonCheck('be.disabled')
        },

        reasonFilledForStoragePos: () => {
            //C25859
            inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]', input.reason)
            inputChecker.nextButtonCheck('not.be.disabled')
        },
    },

    productReceiptSummary: {
        previousHappyPathSteps: (scope) => {
            cy.get(`@coi`).then(coi => {
                inf_steps.infusionReceiveShipment('manufacturing-site', '', coi);
                inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
                inf_steps.infusionShipmentReceiptSummary(scope);
                inf_steps.infusionTransferProductToStorage(coi);
                inf_steps.infusionProductReceiptChecklist();
            })
        },

        nextButtonPos: () => {
            //C25867
            inputChecker.nextButtonCheck('be.disabled')
            signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
            signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], input.verifier[1])
            inputChecker.nextButtonCheck('not.be.disabled')
            actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
                apiAliases: ['@patchProcedureSteps', '@getProcedures']
            })
        },
    },

    checkStatusesOfInfusionModule: (scope) => {

        cy.openOrder('infusion','phil')
        cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
        cy.get(`@coi`).then((coi) => {
      inputHelpers.clickOnHeader('infusion')
      cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.infusion.statuses.ReciveShipment,'Patients',4)
      inf_steps.infusionReceiveShipment('manufacturing-site', '', coi);
    
      inputHelpers.clickOnHeader('infusion')
      cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.infusion.statuses.ShipmentReceiptChecklist,'Patients',4)
      inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
    
      inputHelpers.clickOnHeader('infusion')
      cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.infusion.statuses.ShipmentReceiptSummary,'Patients',4)
      inf_steps.infusionShipmentReceiptSummary(scope);
    
      inputHelpers.clickOnHeader('infusion')
      cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.infusion.statuses.TransferProductToStorage,'Patients',4)
      inf_steps.infusionTransferProductToStorage(coi);
    
      inputHelpers.clickOnHeader('infusion')
      cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.infusion.statuses.ProductReceiptChecklist,'Patients',4)
      inf_steps.infusionProductReceiptChecklist();
    
      inputHelpers.clickOnHeader('infusion')
      cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.infusion.statuses.ProductReceiptSummary,'Patients',4)
      inf_steps.infusionProductReceiptSummary(scope);
        })
      }
}