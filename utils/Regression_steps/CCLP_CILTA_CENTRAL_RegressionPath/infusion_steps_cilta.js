
import input from '../../../fixtures/inputs.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers';
import inputChecker from '../../shared_block_helpers/inputFieldCheckHelpers';
import signatureHelpers from '../../shared_block_helpers/signatureHelpers'
import regressionInput from '../../../fixtures/inputsRegression.json'
import infusionHappyPath from '../../../utils/HappyPath_steps/CCLP_CILTA_CENTRAL_HappyPath/infusion_steps_cilta';
import header from '../../../fixtures/assertions.json';
import translationHelpers from '../../../utils/shared_block_helpers/translationHelpers';
import satLabAssertions from '../../../fixtures/satelliteLab_assertions_cilta.json';

export default {

   receiveShipment: {
      //C40810
      coiNumberPositive: () => {
         cy.log('Receive Shipment');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40811
      coiNumberNegative: () => {
         cy.log('Receive Shipment');
         inputChecker.identifierCoiLabelCheck('ln-2-shipper-ship-bags-from-manufacturing-site-to-infusion-us-cclp-cilta',regressionInput.infusion.nagativeCoiInput, 'be.disabled');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40812
      dataSavingWithBackButtonPositive: () => {
         cy.log('Receive Shipment');
         cy.get(`@coi`).then(coi => {
            inputHelpers.scanAndVerifyCoi('ln-2-shipper-ship-bags-from-manufacturing-site-to-infusion-us-cclp-cilta', coi);
         });
         actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
            apiAliases: ['@patchProcedureSteps', '@getProcedures']
         });
         inputChecker.checkDataSavingWithBackButton('be.visible');
         inputChecker.checkState('.big-green-check-mark','be.visible');
      }
   },

   shippingReceiptChecklist :{
      previousHappyPathSteps: (therapy) => {
         cy.log('Shipment Receipt Checklist');
         cy.get(`@coi`).then(coi => {
         infusionHappyPath.infusionReceiveShipment('manufacturing-site', therapy,coi);
         });
      },

      //C40821
      shippingContainerIntactTogglePositive: (evoLast4Digits,tamperSealNumber) => {
         cy.log('Shipment Receipt Checklist');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]');
         inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-evo_match"]');
         inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]',tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40822
      shippingContainerIntactToggleNegative: () => {
         cy.log('Shipment Receipt Checklist');
         inputHelpers.clicker('[data-testid="fail-button-shipping_container_condition"]');
         inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_condition_reason-input"]','be.visible');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40823
      shippingContainerIntactToggleWithDataPositive: () => {
         cy.log('Shipment Receipt Checklist');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_condition_reason-input"]',regressionInput.infusion.positiveDetailsReason);
         actionButtonsHelper.checkActionButtonIsEnabled('primary');
      },

      //C40824
      shippingContainerSecuredTogglePositive: (evoLast4Digits,tamperSealNumber) => {
         cy.log('Shipment Receipt Checklist');
         inputChecker.reloadPage();
         inputHelpers.clicker('[data-testid="pass-button-shipping_container_condition"]')
         inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]');
         inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-evo_match"]');
         inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]',tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40825
      shippingContainerSecuredToggleNegative: () => {
         cy.log('Shipment Receipt Checklist');
         inputHelpers.clicker('[data-testid="fail-button-zip_ties_secured"]');
         inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]','be.visible');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
         },

      //C40826
      shippingContainerSecuredToggleWithDataPositive: () => {
         cy.log('Shipment Receipt Checklist');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]',regressionInput.infusion.positiveDetailsReason);
         actionButtonsHelper.checkActionButtonIsEnabled('primary');
      },

      //C40827
      consigneePouchTogglePositive: (evoLast4Digits,tamperSealNumber) => {
         cy.log('Shipment Receipt Checklist');
         inputChecker.reloadPage();
         inputHelpers.clicker('[data-testid="pass-button-shipping_container_condition"]')
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]');
         inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-evo_match"]');
         inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]',tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40828
      consigneePouchToggleNegative: () => {
         cy.log('Shipment Receipt Checklist');
         inputHelpers.clicker('[data-testid="fail-button-consignee_pouch_inside"]');
         inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]','be.visible');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40829
      consigneePouchToggleWithDataPositive: () => {
         cy.log('Shipment Receipt Checklist');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]',regressionInput.infusion.positiveDetailsReason);
         actionButtonsHelper.checkActionButtonIsEnabled('primary');
      },

      //C40830
      redWireTampeTogglePositive: (evoLast4Digits,tamperSealNumber) => {
         cy.log('Shipment Receipt Checklist');
         inputChecker.reloadPage();
         inputHelpers.clicker('[data-testid="pass-button-shipping_container_condition"]')
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside"]');
         inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-evo_match"]');
         inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]',tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40831
      redWireTampeToggleNegative: () => {
         cy.log('Shipment Receipt Checklist');
         inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_seal"]');
         inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]','be.visible');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
         },

      //C40832
      redWireTampeToggleWithDataPositive: () => {
         cy.log('Shipment Receipt Checklist');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]',regressionInput.infusion.positiveDetailsReason);
         actionButtonsHelper.checkActionButtonIsEnabled('primary');
      },

      //C40833
      evoIsNumberInputPositive: (tamperSealNumber) => {
         cy.log('Shipment Receipt Checklist');
         inputChecker.reloadPage();
         inputHelpers.clicker('[data-testid="pass-button-shipping_container_condition"]')
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_match"]');
         inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]',tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40834
      evoIsNumberInputNegative: () => {
         cy.log('Shipment Receipt Checklist');
         inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',regressionInput.infusion.negativeEvoIsNumberInputThree);
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
         inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',regressionInput.infusion.negativeEvoIsNumberInputFive);
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40835
      evoIsNumberTogglePositive: (evoLast4Digits,tamperSealNumber) => {
         cy.log('Shipment Receipt Checklist');
         inputChecker.reloadPage();
         inputHelpers.clicker('[data-testid="pass-button-shipping_container_condition"]')
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]');
         inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',evoLast4Digits);
         inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]',tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40836
      evoIsNumberToggleNegative: () => {
         cy.log('Shipment Receipt Checklist');
         inputHelpers.clicker('[data-testid="fail-button-evo_match"]');
         inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_match_reason-input"]','be.visible');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40837
      evoIsNumberToggleWithDataPositive: () => {
         cy.log('Shipment Receipt Checklist');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_match_reason-input"]',regressionInput.infusion.positiveDetailsReason);
         actionButtonsHelper.checkActionButtonIsEnabled('primary');
      },

      //C40838
      tamperSealNoPositive: (evoLast4Digits) => {
         cy.log('Shipment Receipt Checklist');
         inputChecker.reloadPage();
         inputHelpers.clicker('[data-testid="pass-button-shipping_container_condition"]')
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]');
         inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-evo_match"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40839
      tamperSealMatchTogglePositive: (evoLast4Digits,tamperSealNumber) => {
         cy.log('Shipment Receipt Checklist');
         inputChecker.reloadPage();
         inputHelpers.clicker('[data-testid="pass-button-shipping_container_condition"]')
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]');
         inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-evo_match"]');
         inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]',tamperSealNumber);
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40840
      tamperSealMatchToggleNegative: () => {
         cy.log('Shipment Receipt Checklist');
         inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]');
         inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]','be.visible');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40841
      tamperSealMatchToggleWithDataPositive: () => {
         cy.log('Shipment Receipt Checklist');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]',regressionInput.infusion.positiveDetailsReason);
         actionButtonsHelper.checkActionButtonIsEnabled('primary');
      },

      //C40842
      dataSavingWithSaveAndClosePositive:(evoLast4Digits,tamperSealNumber)=> {
         cy.log('Shipment Receipt Checklist');
         inputChecker.reloadPage();
         inputHelpers.clicker('[data-testid="fail-button-shipping_container_condition"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_condition_reason-input"]',regressionInput.infusion.positiveToggleOne);

         inputHelpers.clicker('[data-testid=fail-button-zip_ties_secured]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]',regressionInput.infusion.positiveToggleTwo);

         inputHelpers.clicker('[data-testid=fail-button-consignee_pouch_inside]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]',regressionInput.infusion.positiveToggleFour);

         inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',evoLast4Digits);
         inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]',tamperSealNumber);

         inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_seal"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]',regressionInput.infusion.positiveToggleFive);

         inputHelpers.clicker('[data-testid="fail-button-evo_match"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_match_reason-input"]',regressionInput.infusion.positiveToggleSix);

         inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]',regressionInput.infusion.positiveToggleSeven);
         cy.get(`@coi`).then(coi => {
            inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
         });
         actionButtonsHelper.checkActionButtonIsEnabled('primary');
         inputChecker.checkValue('[data-testid="fail-button-shipping_container_condition"]', 'false');
         inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_condition_reason-input"]',regressionInput.infusion.positiveToggleOne);
         inputChecker.checkValue('[data-testid=fail-button-zip_ties_secured]', 'false');
         inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]',regressionInput.infusion.positiveToggleTwo);
         inputChecker.checkValue('[data-testid=fail-button-consignee_pouch_inside]', 'false');
         inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]',regressionInput.infusion.positiveToggleFour);
         inputChecker.checkValue('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',evoLast4Digits);
         inputChecker.checkValue('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]',tamperSealNumber);
         inputChecker.checkValue('[data-testid="fail-button-red_wire_tamper_seal"]', 'false');
         inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]',regressionInput.infusion.positiveToggleFive);
         inputChecker.checkValue('[data-testid="fail-button-evo_match"]', 'false');
         inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_match_reason-input"]',regressionInput.infusion.positiveToggleSix);
         inputChecker.checkValue('[data-testid="fail-button-tamper_seal_match"]', 'false');
         inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]',regressionInput.infusion.positiveToggleSeven);
      },

      //C40843
      dataSavingWithBackButtonPositive: (evoLast4Digits,tamperSealNumber) => {
         cy.log('Shipment Receipt Checklist');
         inputHelpers.clicker('[data-testid="pass-button-shipping_container_condition"]');
         inputHelpers.clicker('[data-testid=pass-button-zip_ties_secured]');
         inputHelpers.clicker('[data-testid=pass-button-consignee_pouch_inside]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_match"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
               apiAliases: ['@patchProcedureSteps', '@getProcedures']
         });
         inputChecker.checkDataSavingWithBackButton('be.visible');
         inputChecker.checkValue('[data-testid="pass-button-shipping_container_condition"]', 'true');
         inputChecker.checkValue('[data-testid=pass-button-zip_ties_secured]', 'true');
         inputChecker.checkValue('[data-testid=pass-button-consignee_pouch_inside]', 'true');
         inputChecker.checkValue('[data-testid="pass-button-red_wire_tamper_seal"]', 'true');
         inputChecker.checkValue('[data-testid="pass-button-evo_match"]', 'true');
         inputChecker.checkValue('[data-testid="pass-button-tamper_seal_match"]', 'true');
         inputChecker.checkValue('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',evoLast4Digits);
         inputChecker.checkValue('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]',tamperSealNumber);
      }
   },

   shipmentReceiptChecklistSummary :{
      previousHappyPathSteps: (evoLast4Digits,therapy,tamperSealNumber) => {
         cy.log('Shipment Receipt Checklist Summary');
         cy.get(`@coi`).then(coi => {
         infusionHappyPath.infusionReceiveShipment('manufacturing-site', therapy,coi);
         infusionHappyPath.infusionShipmentReceiptChecklist(therapy,evoLast4Digits,tamperSealNumber);
         });
      },

      //C40815
      detailsOfShipmentEditButtonPositive: (evoLast4Digits,tamperSealNumber) => {
         cy.log('Shipment Receipt Checklist Summary');
         inputHelpers.clicker('[data-testid="edit-shipment_receipt_checklist"]');
         inputChecker.explicitWait('[data-testid="fail-button-shipping_container_condition"]');

         inputHelpers.clicker('[data-testid="fail-button-shipping_container_condition"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_condition_reason-input"]',regressionInput.infusion.positiveToggleOne);

         inputHelpers.clicker('[data-testid=fail-button-zip_ties_secured]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]',regressionInput.infusion.positiveToggleTwo);

         inputHelpers.clicker('[data-testid=fail-button-consignee_pouch_inside]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]',regressionInput.infusion.positiveToggleThree);

         inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_seal"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]',regressionInput.infusion.positiveToggleFour);

         inputHelpers.clicker('[data-testid="fail-button-evo_match"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_match_reason-input"]',regressionInput.infusion.positiveToggleFive);

         inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]',regressionInput.infusion.positiveToggleSix);

         inputChecker.reasonForChange();
         inputChecker.explicitWait('[data-testid="display-only"]');
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 5, 'span', regressionInput.infusion.positiveToggleOne);
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 7, 'span', regressionInput.infusion.positiveToggleTwo);
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 9, 'span', regressionInput.infusion.positiveToggleThree);
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 11, 'span', regressionInput.infusion.positiveToggleFour);
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 14, 'span', regressionInput.infusion.positiveToggleFive);
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 17, 'span', regressionInput.infusion.positiveToggleSix);
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 12, 'span', evoLast4Digits);
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 15, 'span', tamperSealNumber);
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 4, 'span', regressionInput.infusion.positiveNoToggle);
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 6, 'span', regressionInput.infusion.positiveNoToggle);
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 8, 'span', regressionInput.infusion.positiveNoToggle);
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 10, 'span', regressionInput.infusion.positiveNoToggle);
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 13, 'span', regressionInput.infusion.positiveNoToggle);
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 16, 'span', regressionInput.infusion.positiveNoToggle);
         signatureHelpers.clickSignDocumentButton('approver', ['@postSignature']);
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
         signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], input.phil3Email);
         inputHelpers.clicker('[data-testid="edit-shipment_receipt_checklist"]');
         inputHelpers.clicker('[data-testid="pass-button-shipping_container_condition"]');
         inputHelpers.clicker('[data-testid=pass-button-zip_ties_secured]');
         inputHelpers.clicker('[data-testid=pass-button-consignee_pouch_inside]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_match"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputChecker.reasonForChange();
         inputChecker.explicitWait('[data-testid="display-only"]');
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 12, 'span', evoLast4Digits);
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 15, 'span', tamperSealNumber);
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 4, 'span', regressionInput.infusion.positiveYesToggle);
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 6, 'span', regressionInput.infusion.positiveYesToggle);
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 8, 'span', regressionInput.infusion.positiveYesToggle);
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 10, 'span', regressionInput.infusion.positiveYesToggle);
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 13, 'span', regressionInput.infusion.positiveYesToggle);
         translationHelpers.assertSectionChildElement('[data-testid=display-only]', 16, 'span', regressionInput.infusion.positiveYesToggle);
         },

      //C40816
      checkNextButtonWithoutSignaturePositive: () => {
         cy.log('Shipment Receipt Checklist Summary');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
         signatureHelpers.clickSignDocumentButton('approver', ['@postSignature']);
         actionButtonsHelper.checkActionButtonIsEnabled('secondary');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40817
      checkVerifierSignature:() => {
         cy.log('Shipment Receipt Checklist Summary');
         signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], input.phil3Email);
         actionButtonsHelper.checkActionButtonIsEnabled('secondary');
         actionButtonsHelper.checkActionButtonIsEnabled('primary');
      }
   },

   productReceiptChecklist :{
      previousHappyPathSteps: (evoLast4Digits,therapy,tamperSealNumber) => {
         cy.log('Product Receipt Checklist');
         cy.get(`@coi`).then(coi => {
         infusionHappyPath.infusionReceiveShipment('manufacturing-site', therapy,coi);
         infusionHappyPath.infusionShipmentReceiptChecklist(therapy,evoLast4Digits,tamperSealNumber);
         infusionHappyPath.infusionShipmentReceiptSummary();
         });
      },

      //C40776
      cartProductTogglePositive: () => {
         cy.log('Product Receipt Checklist');
         inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
         inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
         inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
         inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40777
      cartProductToggleNegative: () => {
         cy.log('Product Receipt Checklist');
         inputHelpers.clicker('[data-testid="fail-button-cart_product"]');
         inputChecker.checkState('[id="#/properties/product_receipt_checklist/properties/cart_product_reason-input"]','be.visible');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40778
      cartProductToggleWithDataPositive: () => {
         cy.log('Product Receipt Checklist');
         inputHelpers.inputSingleField('[id="#/properties/product_receipt_checklist/properties/cart_product_reason-input"]',regressionInput.infusion.positiveDetailsReason);
         actionButtonsHelper.checkActionButtonIsEnabled('primary');
      },

      //C40779
      temperatureOutOfRangeTogglePositive: () => {
         cy.log('Product Receipt Checklist');
         inputChecker.reloadPage();
         inputHelpers.clicker('[data-testid="pass-button-cart_product"]')
         inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
         inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
         inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40780
      temperatureOutOfRangeToggleNegative: () => {
         cy.log('Product Receipt Checklist');
         inputHelpers.clicker('[data-testid="fail-button-temperature_out_of_range"]');
         inputChecker.checkState('[id="#/properties/product_receipt_checklist/properties/temperature_out_of_range_reason-input"]','be.visible');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40781
      temperatureOutOfRangeToggleWithDataPositive: () => {
         cy.log('Product Receipt Checklist');
         inputHelpers.inputSingleField('[id="#/properties/product_receipt_checklist/properties/temperature_out_of_range_reason-input"]',regressionInput.infusion.positiveDetailsReason);
         actionButtonsHelper.checkActionButtonIsEnabled('primary');
      },

      //C40782
      sealInPlaceTogglePositive: () => {
         cy.log('Product Receipt Checklist');
         inputChecker.reloadPage();
         inputHelpers.clicker('[data-testid="pass-button-cart_product"]')
         inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
         inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
         inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40783
      sealInPlaceToggleNegative: () => {
         cy.log('Product Receipt Checklist');
         inputHelpers.clicker('[data-testid="fail-button-seal_in_place"]');
         inputChecker.checkState('[id="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]','be.visible');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40784
      sealInPlaceToggleWithDataPositive: () => {
         cy.log('Product Receipt Checklist');
         inputHelpers.inputSingleField('[id="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]',regressionInput.infusion.positiveDetailsReason);
         actionButtonsHelper.checkActionButtonIsEnabled('primary');
      },

      //C40785
      expectedConditionTogglePositive: () => {
         cy.log('Product Receipt Checklist');
         inputChecker.reloadPage();
         inputHelpers.clicker('[data-testid="pass-button-cart_product"]')
         inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
         inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
         inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40786
      expectedConditionToggleNegative: () => {
         cy.log('Product Receipt Checklist');
         inputHelpers.clicker('[data-testid="fail-button-expected_condition"]');
         inputChecker.checkState('[id="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]','be.visible');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40787
      expectedConditionToggleWithDataPositive: () => {
         cy.log('Product Receipt Checklist');
         inputHelpers.inputSingleField('[id="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]',regressionInput.infusion.positiveDetailsReason);
         actionButtonsHelper.checkActionButtonIsEnabled('primary');
      },

      //C40788
      placedIntoStorageTogglePositive: () => {
         cy.log('Product Receipt Checklist');
         inputChecker.reloadPage();
         inputHelpers.clicker('[data-testid="pass-button-cart_product"]')
         inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
         inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
         inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40789
      placedIntoStorageToggleNegative: () => {
         cy.log('Product Receipt Checklist');
         inputHelpers.clicker('[data-testid="fail-button-placed_into_storage"]');
         inputChecker.checkState('[id="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]','be.visible');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40790
      placedIntoStorageToggleWithDataPositive: () => {
         cy.log('Product Receipt Checklist');
         inputHelpers.inputSingleField('[id="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]',regressionInput.infusion.positiveDetailsReason);
         actionButtonsHelper.checkActionButtonIsEnabled('primary');
      },

      //C40791
      additionalCommentPositive: () => {
         cy.log('Product Receipt Checklist');
         inputChecker.reloadPage();
         inputHelpers.clicker('[data-testid="pass-button-cart_product"]')
         inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
         inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
         inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
         inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
         actionButtonsHelper.checkActionButtonIsEnabled('primary');
      },

      //C40792
      dataSavingWithSaveAndClosePositive: () => {
         cy.log('Product Receipt Checklist');
         inputChecker.reloadPage();
         inputHelpers.clicker('[data-testid="fail-button-cart_product"]');
         inputHelpers.inputSingleField('[id="#/properties/product_receipt_checklist/properties/cart_product_reason-input"]',regressionInput.infusion.positiveToggleOne);

         inputHelpers.clicker('[data-testid=fail-button-temperature_out_of_range]');
         inputHelpers.inputSingleField('[id="#/properties/product_receipt_checklist/properties/temperature_out_of_range_reason-input"]',regressionInput.infusion.positiveToggleTwo);

         inputHelpers.clicker('[data-testid=fail-button-seal_in_place]');
         inputHelpers.inputSingleField('[id="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]',regressionInput.infusion.positiveToggleThree);

         inputHelpers.clicker('[data-testid=fail-button-expected_condition]');
         inputHelpers.inputSingleField('[id="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]',regressionInput.infusion.positiveToggleFour);

         inputHelpers.clicker('[data-testid="fail-button-placed_into_storage"]');
         inputHelpers.inputSingleField('[id="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]',regressionInput.infusion.positiveToggleFive);
         inputHelpers.inputSingleField('[id="#/properties/product_receipt_checklist/properties/comments-input"]',regressionInput.infusion.positiveAdditionalComments);
         cy.get(`@coi`).then(coi => {
            inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
         });
         actionButtonsHelper.checkActionButtonIsEnabled('primary');
         inputChecker.checkValue('[data-testid="fail-button-cart_product"]', 'false');
         inputChecker.checkValue('[id="#/properties/product_receipt_checklist/properties/cart_product_reason-input"]',regressionInput.infusion.positiveToggleOne);
         inputChecker.checkValue('[data-testid="fail-button-temperature_out_of_range"]', 'false');
         inputChecker.checkValue('[id="#/properties/product_receipt_checklist/properties/temperature_out_of_range_reason-input"]',regressionInput.infusion.positiveToggleTwo);
         inputChecker.checkValue('[data-testid="fail-button-seal_in_place"]', 'false');
         inputChecker.checkValue('[id="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]',regressionInput.infusion.positiveToggleThree);
         inputChecker.checkValue('[data-testid="fail-button-expected_condition"]', 'false');
         inputChecker.checkValue('[id="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]',regressionInput.infusion.positiveToggleFour);
         inputChecker.checkValue('[data-testid="fail-button-placed_into_storage"]', 'false');
         inputChecker.checkValue('[id="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]',regressionInput.infusion.positiveToggleFive);
         inputChecker.checkValue('[id="#/properties/product_receipt_checklist/properties/comments-input"]',regressionInput.infusion.positiveAdditionalComments);

      },

      //C40793
      dataSavingWithBackButtonPositive: () => {
         cy.log('Product Receipt Checklist');
         inputHelpers.clicker('[data-testid="pass-button-cart_product"]')
         inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
         inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
         inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
         inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
         actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
             apiAliases: ['@patchProcedureSteps', '@getProcedures']
         });
         inputChecker.checkDataSavingWithBackButton('be.visible');
         inputChecker.checkValue('[data-testid="pass-button-cart_product"]', 'true');
         inputChecker.checkValue('[data-testid="pass-button-temperature_out_of_range"]', 'true');
         inputChecker.checkValue('[data-testid="pass-button-seal_in_place"]', 'true');
         inputChecker.checkValue('[data-testid="pass-button-expected_condition"]', 'true');
         inputChecker.checkValue('[data-testid="pass-button-placed_into_storage"]', 'true');
         inputChecker.checkValue('[id="#/properties/product_receipt_checklist/properties/comments-input"]',regressionInput.infusion.positiveAdditionalComments);
     }
   },

   productReceiptSummary :{
      previousHappyPathSteps: (evoLast4Digits,therapy,tamperSealNumber) => {
         cy.log('Product Receipt Summary');
         cy.get(`@coi`).then(coi => {
         infusionHappyPath.infusionReceiveShipment('manufacturing-site', therapy,coi);
         infusionHappyPath.infusionShipmentReceiptChecklist(therapy,evoLast4Digits,tamperSealNumber);
         infusionHappyPath.infusionShipmentReceiptSummary();
         infusionHappyPath.infusionProductReceiptChecklist();
         });
      },

      //C25943
      checkNextButtonWithoutVerifierSignaturePositive: () => {
         cy.log('Product Receipt Summary');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
         signatureHelpers.clickSignDocumentButton('approver', ['@postSignature']);
         actionButtonsHelper.checkActionButtonIsEnabled('secondary');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C25945
      checkVerifierSignature:() => {
         cy.log('Product Receipt Summary');
         signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], input.phil3Email);
         actionButtonsHelper.checkActionButtonIsEnabled('secondary');
         actionButtonsHelper.checkActionButtonIsEnabled('primary');
      }
   },

   checkStatusesOfInfusionModule: (scope, therapy) => {
      cy.get(`@coi`).then((coi) => {
      inputHelpers.clickOnHeader('infusion')
      cy.checkStatus(coi,regressionInput.infusion.statuses.ReciveShipment,'Reservations',4)
      infusionHappyPath.infusionReceiveShipment('manufacturing-site', therapy, coi);
    
      inputHelpers.clickOnHeader('infusion')
      cy.checkStatus(coi,regressionInput.infusion.statuses.ShipmentReceiptChecklist,'Reservations',4)
      infusionHappyPath.infusionShipmentReceiptChecklist(therapy, input.evoLast4Digits, input.tamperSealNumber, false,);
    
      inputHelpers.clickOnHeader('infusion')
      cy.checkStatus(coi,regressionInput.infusion.statuses.ShipmentReceiptSummary,'Reservations',4)
      infusionHappyPath.infusionShipmentReceiptSummary(scope, therapy);   
    
      inputHelpers.clickOnHeader('infusion')
      cy.checkStatus(coi,regressionInput.infusion.statuses.ProductReceiptChecklist,'Reservations',4)
      infusionHappyPath.infusionProductReceiptChecklist(therapy);
    
      inputHelpers.clickOnHeader('infusion')
      cy.checkStatus(coi,regressionInput.infusion.statuses.ProductReceiptSummary,'Reservations',4)
      infusionHappyPath.infusionProductReceiptSummary(scope, therapy);
        })
      }
}