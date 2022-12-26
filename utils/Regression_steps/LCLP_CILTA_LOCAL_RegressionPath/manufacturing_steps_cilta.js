
import input from '../../../fixtures/inputs.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers';
import inputChecker from '../../shared_block_helpers/inputFieldCheckHelpers';
import signatureHelpers from '../../shared_block_helpers/signatureHelpers'
import regressionInput from '../../../fixtures/inputsRegression.json'
import mftgHappyPath from '../../../utils/HappyPath_steps/LCLP_CILTA_LOCAL_HappyPath/manufacturing_steps_cilta';
import translationHelpers from '../../../utils/shared_block_helpers/translationHelpers';

const getManufAirWayBill = (scope, shippingRow) => {
	cy.openOrder('ordering','oliver')
   cy.commonPagination(scope.patientInformation.patientId,'Treatments per Patient')
   cy.get('[data-testid="td-stage-plane-icon"]').eq(shippingRow).parent().parent().parent().find('[data-testid="td-stage-site-details"]')
     .invoke('text')
     .then((text) => {
       scope.airWayBill = text.substring(9, text.length)
       cy.openOrder('manufacturing','steph')
       cy.get(`@coi`).then(coi => { 
         cy.commonPagination(coi,'Reservations')
       });
       cy.get('[data-testid="manufacturing-airway-bill-input-field"]').type(scope.airWayBill);
       cy.get('[data-testid="manufacturing-airway-bill-action-trigger-button"]').click();
       cy.wait('@labelVerifications');
       cy.log('manufacturingAirwayBill', scope.airWayBill)
     });
 }

export default {
verifyShipper: {
    previousHappyPathSteps: () => {
        mftgHappyPath.manufacturingCollectionSummary();
    },

    //C38646
    coiNumberPositive: () => {
        cy.log('Verify Shipper');
        actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C38647
    coiNumberNegative: () => {
        cy.log('Verify Shipper');
        inputChecker.identifierCoiLabelCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-us-lclp-cilta',regressionInput.satelliteLab.nagativeCoiInput, 'be.disabled');
        actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C38648
    dataSavingWithBackButtonPositive: () => {
        cy.log('Verify Shipper');
        cy.get(`@coi`).then(coi => {
            inputHelpers.scanAndVerifyCoi('ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-us-lclp-cilta', coi);
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
            mftgHappyPath.manufacturingCollectionSummary();
            mftgHappyPath.manufacturingVerifyShipper(coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');
            });
        },
    
        //C25284
        shippingContainerIntactTogglePositive: (evoLast4Digits,tamperSealNumber) => {
            cy.log('Shipment Receipt Checklist');
            inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured_no_case"]');
            inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]');
            inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside_no_kit"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]');
            inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',evoLast4Digits);
            inputHelpers.clicker('[data-testid="pass-button-evo_is_number"]');
            inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]',tamperSealNumber);
            inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },
    
        //C25279
        shippingContainerIntactToggleNegative: () => {
            cy.log('Shipment Receipt Checklist');
            inputHelpers.clicker('[data-testid="fail-button-shipping_container_intact"]');
            inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_intact_reason-input"]','be.visible');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
         },
    
         //C26461
        shippingContainerIntactToggleWithDataPositive: () => {
            cy.log('Shipment Receipt Checklist');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_intact_reason-input"]',regressionInput.manufacturing.positiveDetailsReason);
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
        }, 
    
        //C25289
        shippingContainerSecuredTogglePositive: (evoLast4Digits,tamperSealNumber) => {
            cy.log('Shipment Receipt Checklist');
            inputChecker.reloadPage();
            inputHelpers.clicker('[data-testid="pass-button-shipping_container_intact"]')
            inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]');
            inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside_no_kit"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]');
            inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',evoLast4Digits);
            inputHelpers.clicker('[data-testid="pass-button-evo_is_number"]');
            inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]',tamperSealNumber);
            inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
         },
     
         //C25288
         shippingContainerSecuredToggleNegative: () => {
            cy.log('Shipment Receipt Checklist');
            inputHelpers.clicker('[data-testid="fail-button-zip_ties_secured_no_case"]');
            inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]','be.visible');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
          },
     
          //C26462
         shippingContainerSecuredToggleWithDataPositive: () => {
            cy.log('Shipment Receipt Checklist');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]',regressionInput.manufacturing.positiveDetailsReason);
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
         }, 
    
         //C25290
         packingInsertTogglePositive: (evoLast4Digits,tamperSealNumber) => {
            cy.log('Shipment Receipt Checklist');
            inputChecker.reloadPage();
            inputHelpers.clicker('[data-testid="pass-button-shipping_container_intact"]')
            inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured_no_case"]');
            inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside_no_kit"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]');
            inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',evoLast4Digits);
            inputHelpers.clicker('[data-testid="pass-button-evo_is_number"]');
            inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]',tamperSealNumber);
            inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
         },
     
         //C25286
         packingInsertToggleNegative: () => {
            cy.log('Shipment Receipt Checklist');
            inputHelpers.clicker('[data-testid="fail-button-shipper_label_placed"]');
            inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/shipper_label_placed_reason-input"]','be.visible');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
          },
     
          //C26463
         packingInsertToggleWithDataPositive: () => {
            cy.log('Shipment Receipt Checklist');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/shipper_label_placed_reason-input"]',regressionInput.manufacturing.positiveDetailsReason);
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
         }, 
    
         //C25285
         consigneePouchTogglePositive: (evoLast4Digits,tamperSealNumber) => {
            cy.log('Shipment Receipt Checklist');
            inputChecker.reloadPage();
            inputHelpers.clicker('[data-testid="pass-button-shipping_container_intact"]')
            inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured_no_case"]');
            inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]');
            inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',evoLast4Digits);
            inputHelpers.clicker('[data-testid="pass-button-evo_is_number"]');
            inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]',tamperSealNumber);
            inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
         },
     
         //C25316
         consigneePouchToggleNegative: () => {
            cy.log('Shipment Receipt Checklist');
            inputHelpers.clicker('[data-testid="fail-button-consignee_pouch_inside_no_kit"]');
            inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]','be.visible');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
          },
     
          //C26464
         consigneePouchToggleWithDataPositive: () => {
            cy.log('Shipment Receipt Checklist');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]',regressionInput.manufacturing.positiveDetailsReason);
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
         }, 
    
         //C25322
         redWireTampeTogglePositive: (evoLast4Digits,tamperSealNumber) => {
            cy.log('Shipment Receipt Checklist');
            inputChecker.reloadPage();
            inputHelpers.clicker('[data-testid="pass-button-shipping_container_intact"]')
            inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured_no_case"]');
            inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]');
            inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside_no_kit"]');
            inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',evoLast4Digits);
            inputHelpers.clicker('[data-testid="pass-button-evo_is_number"]');
            inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]',tamperSealNumber);
            inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
         },
     
         //C25321
         redWireTampeToggleNegative: () => {
            cy.log('Shipment Receipt Checklist');
            inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_seal"]');
            inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]','be.visible');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
          },
     
          //C26465
         redWireTampeToggleWithDataPositive: () => {
            cy.log('Shipment Receipt Checklist');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]',regressionInput.manufacturing.positiveDetailsReason);
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
         }, 
    
         //C25146
         evoIsNumberInputPositive: (tamperSealNumber) => {
            cy.log('Shipment Receipt Checklist');
            inputChecker.reloadPage();
            inputHelpers.clicker('[data-testid="pass-button-shipping_container_intact"]')
            inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured_no_case"]');
            inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]');
            inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside_no_kit"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]');
            inputHelpers.clicker('[data-testid="pass-button-evo_is_number"]');
            inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]',tamperSealNumber);
            inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
         },
    
         //C38654
         evoIsNumberInputNegative: () => {
            cy.log('Shipment Receipt Checklist');
            inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',regressionInput.manufacturing.negativeEvoIsNumberInputThree);
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
            inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',regressionInput.manufacturing.negativeEvoIsNumberInputFive);
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
         },
    
         //C25324
         evoIsNumberTogglePositive: (evoLast4Digits,tamperSealNumber) => {
            cy.log('Shipment Receipt Checklist');
            inputChecker.reloadPage();
            inputHelpers.clicker('[data-testid="pass-button-shipping_container_intact"]')
            inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured_no_case"]');
            inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]');
            inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside_no_kit"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]');
            inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',evoLast4Digits);
            inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]',tamperSealNumber);
            inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
         },
     
         //C25323
         evoIsNumberToggleNegative: () => {
            cy.log('Shipment Receipt Checklist');
            inputHelpers.clicker('[data-testid="fail-button-evo_is_number"]');
            inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_is_number_reason-input"]','be.visible');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
          },
     
          //C26466
         evoIsNumberToggleWithDataPositive: () => {
            cy.log('Shipment Receipt Checklist');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_is_number_reason-input"]',regressionInput.manufacturing.positiveDetailsReason);
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
         }, 
    
         //C25147
         tamperSealNoPositive: (evoLast4Digits) => {
            cy.log('Shipment Receipt Checklist');
            inputChecker.reloadPage();
            inputHelpers.clicker('[data-testid="pass-button-shipping_container_intact"]')
            inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured_no_case"]');
            inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]');
            inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside_no_kit"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]');
            inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',evoLast4Digits);
            inputHelpers.clicker('[data-testid="pass-button-evo_is_number"]');
            inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
         },
    
         //C25326
         tamperSealMatchTogglePositive: (evoLast4Digits,tamperSealNumber) => {
            cy.log('Shipment Receipt Checklist');
            inputChecker.reloadPage();
            inputHelpers.clicker('[data-testid="pass-button-shipping_container_intact"]')
            inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured_no_case"]');
            inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]');
            inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside_no_kit"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]');
            inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',evoLast4Digits);
            inputHelpers.clicker('[data-testid="pass-button-evo_is_number"]');
            inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]',tamperSealNumber);
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
         },
     
         //C25325
         tamperSealMatchToggleNegative: () => {
            cy.log('Shipment Receipt Checklist');
            inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]');
            inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]','be.visible');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
          },
     
          //C26467
         tamperSealMatchToggleWithDataPositive: () => {
            cy.log('Shipment Receipt Checklist');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]',regressionInput.manufacturing.positiveDetailsReason);
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
         }, 
    
         //C25438
         dataSavingWithSaveAndClosePositive: (evoLast4Digits,tamperSealNumber) => {
            cy.log('Shipment Receipt Checklist');
            inputChecker.reloadPage();
            inputHelpers.clicker('[data-testid="fail-button-shipping_container_intact"]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_intact_reason-input"]',regressionInput.manufacturing.positiveToggleOne);
    
            inputHelpers.clicker('[data-testid=fail-button-zip_ties_secured_no_case]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]',regressionInput.manufacturing.positiveToggleTwo);
    
            inputHelpers.clicker('[data-testid=fail-button-shipper_label_placed]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/shipper_label_placed_reason-input"]',regressionInput.manufacturing.positiveToggleThree);
    
            inputHelpers.clicker('[data-testid=fail-button-consignee_pouch_inside_no_kit]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]',regressionInput.manufacturing.positiveToggleFour);
    
            inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',evoLast4Digits);
            inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]',tamperSealNumber);
    
            inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_seal"]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]',regressionInput.manufacturing.positiveToggleFive);
    
            inputHelpers.clicker('[data-testid="fail-button-evo_is_number"]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_is_number_reason-input"]',regressionInput.manufacturing.positiveToggleSix);
    
            inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]',regressionInput.manufacturing.positiveToggleSeven);
    
            cy.get(`@coi`).then(coi => {
            inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
            });
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
       
            inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_intact_reason-input"]',regressionInput.manufacturing.positiveToggleOne);
            inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]',regressionInput.manufacturing.positiveToggleTwo);
            inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/shipper_label_placed_reason-input"]',regressionInput.manufacturing.positiveToggleThree);
            inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]',regressionInput.manufacturing.positiveToggleFour);
            inputChecker.checkValue('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',evoLast4Digits);
            inputChecker.checkValue('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]',tamperSealNumber);
            inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]',regressionInput.manufacturing.positiveToggleFive);
            inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_is_number_reason-input"]',regressionInput.manufacturing.positiveToggleSix);
            inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]',regressionInput.manufacturing.positiveToggleSeven);
          },
    
         //C38653
         dataSavingWithBackButtonPositive: (evoLast4Digits,tamperSealNumber) => {
            cy.log('Shipment Receipt Checklist');
            actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
                apiAliases: ['@patchProcedureSteps', '@getProcedures']
            });
            inputChecker.checkDataSavingWithBackButton('be.visible');
            inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_intact_reason-input"]',regressionInput.manufacturing.positiveToggleOne);
            inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]',regressionInput.manufacturing.positiveToggleTwo);
            inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/shipper_label_placed_reason-input"]',regressionInput.manufacturing.positiveToggleThree);
            inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]',regressionInput.manufacturing.positiveToggleFour);
            inputChecker.checkValue('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]',evoLast4Digits);
            inputChecker.checkValue('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]',tamperSealNumber);
            inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]',regressionInput.manufacturing.positiveToggleFive);
            inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_is_number_reason-input"]',regressionInput.manufacturing.positiveToggleSix);
            inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]',regressionInput.manufacturing.positiveToggleSeven);
        }
      },

      shipmentReceiptChecklistSummary :{
         previousHappyPathSteps: (evoLast4Digits,therapy,tamperSealNumber) => {
             cy.log('Shipment Receipt Checklist Summary');
             cy.get(`@coi`).then(coi => { 
             mftgHappyPath.manufacturingCollectionSummary();
             mftgHappyPath.manufacturingVerifyShipper(coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');
             mftgHappyPath.manufacturingShipmentReceiptChecklist(evoLast4Digits,tamperSealNumber);
             });
         },
     
         //C38832
         checkNextButtonWithoutSignaturePositive: () => {
             cy.log('Shipment Receipt Checklist Summary');
             actionButtonsHelper.checkActionButtonIsDisabled('primary');
             signatureHelpers.clickSignDocumentButton('approver', ['@postSignature']);
             actionButtonsHelper.checkActionButtonIsEnabled('secondary');
             actionButtonsHelper.checkActionButtonIsDisabled('primary');
           },
     
         //C38833
         checkVerifierSignature:() => {
             cy.log('Shipment Receipt Checklist Summary');
             signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], input.quelaEmail);
             actionButtonsHelper.checkActionButtonIsEnabled('secondary');
             actionButtonsHelper.checkActionButtonIsEnabled('primary');
         }
   },
   
   transferProductToIntermediary: {
      previousHappyPathSteps: (scope, therapy) => {
         cy.get(`@coi`).then(coi => {
            mftgHappyPath.manufacturingCollectionSummary();
            mftgHappyPath.manufacturingVerifyShipper(coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');
            mftgHappyPath.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
            mftgHappyPath.manufacturingShipReceiptSummaryVerify(therapy, scope)
    })
      },
      //C39825
      negativeDin: () => {
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/bag_label_1-input"]',input.din,"be.disabled")
         inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/cryo_cassete_din_1-input"]',input.din,"be.disabled")
         inputChecker.keepFieldsEmpty("day-1-bag-1-udn",'be.visible')
         inputChecker.nextButtonCheck('be.disabled')
       
      },
      //C39824
      negativeApheresisID: () => {
         cy.reload()
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/bag_label_1-input"]',input.din,"be.disabled")
         inputHelpers.enterDinAndConfirm('day-1-bag-1-udn',input.din);
         inputChecker.nextButtonCheck('be.disabled')
      },
       //C39823
      negativeBagIdentifier: () => {
         cy.reload()
         inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/cryo_cassete_din_1-input"]',input.din,"be.disabled")
         inputChecker.nextButtonCheck('be.disabled')
      },
      //C39826,C39828
      saveAndClose: () => {
         cy.reload()
         inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/bag_label_1-input"]',input.din,"be.disabled")
         inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/cryo_cassete_din_1-input"]',input.din,"be.enabled")
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
         cy.get(`@coi`).then(coi => {
         inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
         });
         inputChecker.checkState('.big-green-check-mark','be.visible');
         inputChecker.nextButtonCheck('be.enabled')
      },
      retainValue: () => {
         //C39827
         actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
            apiAliases: ['@patchProcedureSteps', '@getProcedures'] })
         inputChecker.nextButtonCheck('be.enabled')
         inputChecker.checkDataSavingWithBackButton('be.enabled')
         inputChecker.checkState('.big-green-check-mark','be.visible');
      }
   },

   transferProductToIntermediary2: {
      previousHappyPathSteps: (scope, therapy) => {
         cy.get(`@coi`).then(coi => {
            mftgHappyPath.manufacturingCollectionSummary();
            mftgHappyPath.manufacturingVerifyShipper(coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');
            mftgHappyPath.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
            mftgHappyPath.manufacturingShipReceiptSummaryVerify(therapy, scope);
            mftgHappyPath.manufacturingTransferProductToStorage(coi, therapy);
    })
      },
      checkNextButton: () => {
         //C39784
         cy.log('C25655')
         inputChecker.nextButtonCheck('be.enabled')   
            },
      saveAndClose: () => {
         //C39785
         cy.log('C25656')
         inputChecker.nextButtonCheck('be.enabled')
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
         cy.get(`@coi`).then(coi => {
         inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
         });
         inputChecker.nextButtonCheck('be.enabled')
      },
   },
   productReceipt: {
      previousHappyPathSteps: (scope,therapy) => {
         cy.get(`@coi`).then(coi => {
            mftgHappyPath.manufacturingCollectionSummary();
            mftgHappyPath.manufacturingVerifyShipper(coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');
            mftgHappyPath.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
            mftgHappyPath.manufacturingShipReceiptSummaryVerify(therapy, scope);
            mftgHappyPath.manufacturingTransferProductToStorage(coi, therapy);
            mftgHappyPath.manufacturingTransferProductToStorage2(coi);
          })
      },
      noChecklistAnswered: () => {
         //C39786
         cy.log('C39786')
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },
      checkConfirmButtonForAirwayBill: (scope) => {
         //C39805
         cy.log('C39805')
       inputHelpers.clicker('[data-testid="pass-button-cryopreserved_apheresis_product"]')
       inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
       inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
       inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
       inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]')
       inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
       inputHelpers.inputSingleField('[data-testid="patient-id-input-field"]',scope.patientInformation.patientId);
       inputChecker.checkState('[data-testid="patient-id-action-trigger-button"]','be.visible');
       inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/comments-input"]',input.additionalComments);
       inputChecker.nextButtonCheck('be.disabled');
      },
      noSelectForCassette: (scope) => {
         //C39787
         cy.log('C39787')
       inputHelpers.clicker('[data-testid="fail-button-cryopreserved_apheresis_product"]')
       inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
       inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
       inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
       inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]')
       inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
       inputHelpers.inputSingleField('[data-testid=patient-id-input-field]',scope.patientInformation.patientId);
       inputHelpers.clicker('[data-testid="patient-id-action-trigger-button"]')
       inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/comments-input"]',input.additionalComments);
       inputChecker.nextButtonCheck('be.disabled');
      },
      nothingSelectForCassette: () => {
         //C39788
         cy.log('C39788')
       inputChecker.reloadPage();
       inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
       inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
       inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
       inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]')
       inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
       inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/comments-input"]',input.additionalComments);
       inputChecker.nextButtonCheck('be.disabled');
      },
      commentOnCassette: () => {
         //C39789
         cy.log('C39789')
       inputChecker.reloadPage();
       inputHelpers.clicker('[data-testid="fail-button-cryopreserved_apheresis_product"]')
       inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/cryopreserved_apheresis_product_reason-input"]',input.additionalComments)
       inputHelpers.clicker('[data-testid="fail-button-temperature_out_of_range"]')
       inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
       inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
       inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]')
       inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
       inputChecker.nextButtonCheck('be.disabled');
      },  
      noSelectFortemperature: () => {
         //C39790
         cy.log('C39790')
       inputChecker.reloadPage();
       inputHelpers.clicker('[data-testid="pass-button-cryopreserved_apheresis_product"]')
       inputHelpers.clicker('[data-testid="fail-button-temperature_out_of_range"]')
       inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
       inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
       inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]')
       inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
       inputChecker.nextButtonCheck('be.disabled');
      },
      nothingSelectForTemperature: () => {
         //C39791
         cy.log('C39791')
       inputChecker.reloadPage();
       inputHelpers.clicker('[data-testid="pass-button-cryopreserved_apheresis_product"]')
       inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
       inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
       inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]')
       inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
       inputChecker.nextButtonCheck('be.disabled');
      },
      commentForTemperature: () => {
         //C39792
         cy.log('C39792')
       inputChecker.reloadPage();
       inputHelpers.clicker('[data-testid="pass-button-cryopreserved_apheresis_product"]')
       inputHelpers.clicker('[data-testid="fail-button-temperature_out_of_range"]')
       inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/temperature_out_of_range_reason-input"]',input.additionalComments)
       inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
       inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
       inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]')
       inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
       inputChecker.nextButtonCheck('be.enabled')
      }, 
      noSelectForTamper: () => {
         //C39793
         cy.log('C39793')
       inputChecker.reloadPage();
       inputHelpers.clicker('[data-testid="pass-button-cryopreserved_apheresis_product"]')
       inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
       inputHelpers.clicker('[data-testid="fail-button-seal_in_place"]')
       inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
       inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]')
       inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
       inputChecker.nextButtonCheck('be.disabled');
      }, 
      nothingSelectForTamper: () => {
         //C39794
         cy.log('C39794')
       inputChecker.reloadPage();
       inputHelpers.clicker('[data-testid="pass-button-cryopreserved_apheresis_product"]')
       inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
       inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
       inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]')
       inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
       inputChecker.nextButtonCheck('be.disabled');
      },  
      commentForTamper: () => {
         //C39795
         cy.log('C39795')
       inputChecker.reloadPage();
       inputHelpers.clicker('[data-testid="pass-button-cryopreserved_apheresis_product"]')
       inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
       inputHelpers.clicker('[data-testid="fail-button-seal_in_place"]')
       inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]',input.additionalComments)
       inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
       inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]')
       inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
       inputChecker.nextButtonCheck('be.enabled')
      }, 
      noSelectForCassetteAndBag: () => {
         //C39796
         cy.log('C39796')
       inputChecker.reloadPage();
       inputHelpers.clicker('[data-testid="pass-button-cryopreserved_apheresis_product"]')
       inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
       inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
       inputHelpers.clicker('[data-testid="fail-button-expected_condition"]')
       inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]')
       inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
       inputChecker.nextButtonCheck('be.disabled');
      },  
      nothingSelectForCassetteAndBag: () => {
         //C39797
         cy.log('C39797')
       inputChecker.reloadPage();
       inputHelpers.clicker('[data-testid="pass-button-cryopreserved_apheresis_product"]')
       inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
       inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
       inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]')
       inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
       inputChecker.nextButtonCheck('be.disabled');
      },   
      commentOnForCassetteAndBag: () => {
         //C39798
         cy.log('C39798')
       inputChecker.reloadPage();
       inputHelpers.clicker('[data-testid="pass-button-cryopreserved_apheresis_product"]')
       inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
       inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
       inputHelpers.clicker('[data-testid="fail-button-expected_condition"]')
       inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]',input.additionalComments)
       inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]')
       inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
       inputChecker.nextButtonCheck('be.enabled')
      }, 
      damageBags: () => {
         //C39799
         cy.log('C39799')
       inputChecker.reloadPage();
       inputHelpers.clicker('[data-testid="pass-button-cryopreserved_apheresis_product"]')
       inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
       inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
       inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
       inputHelpers.clicker('[data-testid="fail-button-free_from_cracks"]')
       inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
       inputChecker.nextButtonCheck('be.disabled');
      },  
       nothingSelectForDamageBags: () => {
         //C39800
         cy.log('C39800')
       inputChecker.reloadPage();
       inputHelpers.clicker('[data-testid="pass-button-cryopreserved_apheresis_product"]')
       inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
       inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
       inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
       inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
       inputChecker.nextButtonCheck('be.disabled');
      },
      commetsForDamageBags: () => {
         //C39801
         cy.log('C39801')
       inputChecker.reloadPage();
       inputHelpers.clicker('[data-testid="pass-button-cryopreserved_apheresis_product"]')
       inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
       inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
       inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
       inputHelpers.clicker('[data-testid="fail-button-free_from_cracks"]')
       inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/free_from_cracks_reason-input"]',input.additionalComments)
       inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
       inputChecker.nextButtonCheck('be.enabled')
      },
      noSelectForStorage: () => {
         //C39802
         cy.log('C39802')
       inputChecker.reloadPage();
       inputHelpers.clicker('[data-testid="pass-button-cryopreserved_apheresis_product"]')
       inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
       inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
       inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
       inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]')
       inputHelpers.clicker('[data-testid="fail-button-placed_into_storage"]')
       inputChecker.nextButtonCheck('be.disabled');
      },
      nothingSelectForStorage: () => {
         //C39803
         cy.log('C39803')
       inputChecker.reloadPage();
       inputHelpers.clicker('[data-testid="pass-button-cryopreserved_apheresis_product"]')
       inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
       inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
       inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
       inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]')
       inputChecker.nextButtonCheck('be.disabled');
      },
      commentForForStorage: () => {
         //C39804
         cy.log('C39804')
       inputChecker.reloadPage();
       inputHelpers.clicker('[data-testid="pass-button-cryopreserved_apheresis_product"]')
       inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
       inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
       inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
       inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]')
       inputHelpers.clicker('[data-testid="fail-button-placed_into_storage"]')
       inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]',input.additionalComments)
       inputChecker.nextButtonCheck('be.enabled')
      },
      saveAndClose: () => {
         //C39806
         cy.log('C39806')
         inputChecker.reloadPage();
         inputHelpers.clicker('[data-testid="pass-button-cryopreserved_apheresis_product"]')
         inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]')
         inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
         inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
         inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]')
         inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
         actionButtonsHelper.checkActionButtonIsEnabled('primary');
         cy.get(`@coi`).then(coi => {
         inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
         });
         inputChecker.nextButtonCheck('be.enabled')
      },
   },
   
   productReceipSummary: {
      previousHappyPathSteps: (scope,therapy) => {
         cy.get(`@coi`).then(coi => {
            mftgHappyPath.manufacturingCollectionSummary();
            mftgHappyPath.manufacturingVerifyShipper(coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');
            mftgHappyPath.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
            mftgHappyPath.manufacturingShipReceiptSummaryVerify(therapy, scope);
            mftgHappyPath.manufacturingTransferProductToStorage(coi, therapy);
            mftgHappyPath.manufacturingTransferProductToStorage2(coi);
            mftgHappyPath.manufacturingProductReceipt(scope.patientInformation.patientId, therapy);
          })
      },
      saveAndClose: () => {
         //C39807
         cy.log('C25693')
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
         signatureHelpers.clickSignDocumentButton('approver', ['@postSignature']);
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
         signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], input.quelaEmail)
         actionButtonsHelper.checkActionButtonIsEnabled('primary');
         cy.get(`@coi`).then(coi => {
         inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
         });
         inputChecker.nextButtonCheck('be.enabled')
      },
   },

   manufacturingData: {
      previousHappyPathSteps: (scope,evoLast4Digits,therapy,tamperSealNumber) => {
         cy.get(`@coi`).then(coi => {
            mftgHappyPath.manufacturingCollectionSummary();
            mftgHappyPath.manufacturingVerifyShipper(coi, therapy,'from-apheresis-site', 'to-manufacturing-site');
            mftgHappyPath.manufacturingShipmentReceiptChecklist(evoLast4Digits,tamperSealNumber);
            mftgHappyPath.manufacturingShipReceiptSummaryVerify(therapy, scope);
            mftgHappyPath.manufacturingTransferProductToStorage(coi, therapy);
            mftgHappyPath.manufacturingTransferProductToStorage2(coi);
            mftgHappyPath.manufacturingProductReceipt(scope.patientInformation.patientId, therapy);
            mftgHappyPath.manufacturingProductReceiptSummaryVerifyEmeaLc(therapy, scope);
         }) 
      },
      emptyDate: () => {
         //C39583
         cy.log("Manufacturing Data")
         inputChecker.nextButtonCheck('be.disabled');
         inputChecker.inputSingleFieldCheck('[data-testid="#/properties/lot_number-input"]',regressionInput.manufacturing.validLotNumber,"be.disabled");
      },
      emptyLotNumber: (currentDate) => {
         //C39584
         cy.log("Manufacturing Data")
         cy.reload();
         inputChecker.nextButtonCheck('be.disabled');
        inputChecker.inputSingleFieldCheck('input[id="#/properties/item_expiry_date-input"]',currentDate,"be.disabled")
      },
      invalidDate: (pastDate) => {
         //C39585
         cy.log("Manufacturing Data")
         cy.reload();
         inputChecker.nextButtonCheck('be.disabled');
         inputChecker.inputSingleFieldCheck('[data-testid="#/properties/lot_number-input"]',regressionInput.manufacturing.validLotNumber,"be.disabled");
         inputChecker.inputSingleFieldCheck('input[id="#/properties/item_expiry_date-input"]',regressionInput.manufacturing.invalidDateFormat,"be.disabled")
         inputChecker.inputSingleFieldCheck('input[id="#/properties/item_expiry_date-input"]',pastDate,"be.disabled")
      },
      signature: (currentDate) => {
         //C39580,C39581
         cy.log("Manufacturing Data")
         cy.reload();
         inputChecker.inputSingleFieldCheck('[data-testid="#/properties/lot_number-input"]',regressionInput.manufacturing.validLotNumber,"be.disabled");
         inputChecker.inputSingleFieldCheck('input[id="#/properties/item_expiry_date-input"]',currentDate,"not.be.disabled")
         actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
         apiAliases: ['@patchProcedureSteps', '@getProcedures'] })
         inputChecker.nextButtonCheck('be.disabled');
         inputChecker.checkState('[data-testid="approver-sign-button"]','be.enabled');
         inputChecker.checkState('[data-testid="verifier-sign-button"]','be.disabled');
         signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
         inputChecker.nextButtonCheck('be.disabled');
         inputChecker.checkState('[data-testid="verifier-sign-button"]','not.be.disabled');
         signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], input.quelaEmail)
         inputChecker.nextButtonCheck('not.be.disabled');
      },
      saveAndClose: () => {
         //C39582
         cy.log("Manufacturing Data")
         inputChecker.nextButtonCheck('not.be.disabled');
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
         cy.get(`@coi`).then(coi => {
         inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
         });
         inputChecker.nextButtonCheck('not.be.disabled');
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
      },
      retainValue: () => {
         //C39583
         cy.log("Manufacturing Data")
         inputChecker.reloadPage();
         inputChecker.nextButtonCheck('not.be.disabled')
         actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
            apiAliases: ['@patchProcedureSteps', '@getProcedures'] })
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.checkDataSavingWithBackButton('be.enabled')
      }
   },

   printFinalProductLabels: {
      previousHappyPathSteps: (scope,evoLast4Digits,therapy,tamperSealNumber) => {
         cy.get(`@coi`).then(coi => {
            mftgHappyPath.manufacturingCollectionSummary();
            mftgHappyPath.manufacturingVerifyShipper(coi, therapy,'from-apheresis-site', 'to-manufacturing-site');
            mftgHappyPath.manufacturingShipmentReceiptChecklist(evoLast4Digits,tamperSealNumber);
            mftgHappyPath.manufacturingShipReceiptSummaryVerify(therapy, scope);
            mftgHappyPath.manufacturingTransferProductToStorage(coi, therapy);
            mftgHappyPath.manufacturingTransferProductToStorage2(coi);
            mftgHappyPath.manufacturingProductReceipt(scope.patientInformation.patientId, therapy);
            mftgHappyPath.manufacturingProductReceiptSummaryVerifyEmeaLc(therapy, scope);
            mftgHappyPath.manufacturingData(input.expiryDate, scope.patientInformation.orderingLotNumber);
         })
      },
      verifyNextButton: () => {
         //C39810,C39811
         cy.log('Print Final Product Labels')
         inputChecker.nextButtonCheck('be.disabled');
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
         inputChecker.clickOnCheck('[data-testid="btn-print"]','be.disabled');
         inputChecker.clickOnCheck('[id="#/properties/data/properties/is_confirmed"]','not.be.disabled')
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
      },
      signature: () => {
         //C39812
         cy.log('Print Final Product Labels')
         actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
            apiAliases: ['@patchProcedureSteps', '@getProcedures']
         });
         inputChecker.checkState("[data-testid='approver-sign-button']",'not.be.disabled');
         //inputChecker.nextButtonCheck('be.disabled'); Bug
         signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
         cy.wait(1000)
         inputChecker.nextButtonCheck('not.be.disabled');
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
      },
      saveAndClose: () => {
         //C39813
         cy.get(`@coi`).then(coi => {
         inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
         });
         inputChecker.nextButtonCheck('not.be.disabled');
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
      },
      retainValue: () => {
         //C39814
         actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
            apiAliases: ['@patchProcedureSteps', '@getProcedures'] })
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.checkDataSavingWithBackButton('be.enabled')
      }
   },

   confirmationOfLabelApplication: {
      previousHappyPathSteps: (scope,evoLast4Digits,therapy,tamperSealNumber) => {
         cy.get(`@coi`).then(coi => {
            mftgHappyPath.manufacturingCollectionSummary();
            mftgHappyPath.manufacturingVerifyShipper(coi, therapy,'from-apheresis-site', 'to-manufacturing-site');
            mftgHappyPath.manufacturingShipmentReceiptChecklist(evoLast4Digits,tamperSealNumber);
            mftgHappyPath.manufacturingShipReceiptSummaryVerify(therapy, scope);
            mftgHappyPath.manufacturingTransferProductToStorage(coi, therapy);
            mftgHappyPath.manufacturingTransferProductToStorage2(coi);
            mftgHappyPath.manufacturingProductReceipt(scope.patientInformation.patientId, therapy);
            mftgHappyPath.manufacturingProductReceiptSummaryVerifyEmeaLc(therapy, scope);
            mftgHappyPath.manufacturingData(input.expiryDate, scope.patientInformation.orderingLotNumber);
            mftgHappyPath.manufacturingFinalLabels(therapy);
            cy.wait(2000)
         })
      },
      emptyToggle: () => {
         //C25878
         cy.log("Confirmation Of Label Application")
         inputChecker.reloadPage();
         inputChecker.inputSingleFieldCheck('[id="#/properties/item_count-input"]',regressionInput.manufacturing.validNumberofBags,'be.disabled')
         inputChecker.clickOnCheck('[id="#/properties/data/properties/is_confirmed"]','be.disabled')
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
      },
      emptyBag: () => {
         //C25879
         cy.log("Confirmation Of Label Application")
         inputChecker.reloadPage();
         inputHelpers.clicker('[data-testid="left-button-radio"]')
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.clickOnCheck('[id="#/properties/data/properties/is_confirmed"]','be.disabled')
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
      },
      checkbox: () => {
         //C25880
         cy.log("Confirmation Of Label Application")
         inputChecker.reloadPage();
         inputHelpers.clicker('[data-testid="left-button-radio"]')
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.inputSingleFieldCheck('[id="#/properties/item_count-input"]',regressionInput.manufacturing.validNumberofBags,'be.disabled')
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
      },
      negativeNumberOfBag: () => {
         //C25881
         cy.log("Confirmation Of Label Application")
         inputChecker.reloadPage();
         inputHelpers.clicker('[data-testid="left-button-radio"]')
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.clickOnCheck('[id="#/properties/data/properties/is_confirmed"]','be.disabled')
         inputChecker.inputSingleFieldCheck('[id="#/properties/item_count-input"]',regressionInput.manufacturing.negativedNumberofBags,'be.disabled')
         inputChecker.inputSingleFieldCheck('[id="#/properties/item_count-input"]',regressionInput.manufacturing.invalidData,'be.disabled')
         inputChecker.inputSingleFieldCheck('[id="#/properties/item_count-input"]',regressionInput.manufacturing.negativeSpecialCharecters,'be.disabled')
         inputChecker.inputSingleFieldCheck('[id="#/properties/item_count-input"]',regressionInput.manufacturing.negativeNumber,'be.disabled')
         inputChecker.inputSingleFieldCheck('[id="#/properties/item_count-input"]',regressionInput.manufacturing.negativeData,'be.disabled')
         inputChecker.inputSingleFieldCheck('[id="#/properties/item_count-input"]',regressionInput.manufacturing.validNumberofBags,'not.be.disabled')
      },
      saveAndClose: () => {
         //C25877
         cy.log("Confirmation Of Label Application")
         inputChecker.nextButtonCheck('not.be.disabled');
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
         cy.get(`@coi`).then(coi => {
         inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
         });
         inputChecker.nextButtonCheck('not.be.disabled');
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
      },
      retainValue: () => {
         //C38894
         cy.log("Confirmation Of Label Application")
         inputChecker.reloadPage();
         inputChecker.nextButtonCheck('not.be.disabled')
         actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
            apiAliases: ['@patchProcedureSteps', '@getProcedures'] })
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.checkDataSavingWithBackButton('be.enabled')
         inputChecker.checkValue('[data-testid="left-button-radio"]',"true")
      }
   },

   confirmationOfLabelApplicationPart2: {
      previousHappyPathSteps: (scope,therapy) => {
         cy.get(`@coi`).then(coi => {
            mftgHappyPath.manufacturingCollectionSummary();
            mftgHappyPath.manufacturingVerifyShipper(coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');
            mftgHappyPath.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
            mftgHappyPath.manufacturingShipReceiptSummaryVerify(therapy, scope);
            mftgHappyPath.manufacturingTransferProductToStorage(coi, therapy);
            mftgHappyPath.manufacturingTransferProductToStorage2(coi);
            mftgHappyPath.manufacturingProductReceipt(scope.patientInformation.patientId, therapy);
            mftgHappyPath.manufacturingProductReceiptSummaryVerifyEmeaLc(therapy, scope);
            mftgHappyPath.manufacturingData(input.expiryDate, scope.patientInformation.orderingLotNumber);
            mftgHappyPath.manufacturingFinalLabels(therapy);
            cy.wait(2000)
            inputHelpers.clicker('[data-testid="left-button-radio"]')
            inputChecker.inputSingleFieldCheck('[id="#/properties/item_count-input"]',regressionInput.manufacturing.validNumberofBags,'be.disabled')
            inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]')
            actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
               apiAliases: ['@patchProcedureSteps', '@getProcedures'] })
            cy.wait(2000)
         })
      },
      cassetteLabel: () => {
         //C39985
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
         cy.get(`@coi`).then(coi => {
         inputChecker.scanAndVerifyMultipleNeg("cassette-1", coi + `-PRC-0${1}`)
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.scanAndVerifyMultipleNeg("cassette-1", coi + `-APH-0${1}`)
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.scanAndVerifyMultipleNeg("cassette-1", coi)
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.scanAndVerifyMultiplePos("cassette-1",`${coi}-FP-01`, "be.visible")
         inputChecker.nextButtonCheck('be.disabled')
      })
      },
      coiField: () => {
         //C39984
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
         inputChecker.clickOnCheck('[id="#/properties/data/properties/destruction_confirmed"]','be.disabled')
         cy.get(`@coi`).then(coi => {
         inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1", coi + `-PRC-0${1}`)
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1", coi + `-APH-0${1}`)
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1", coi)
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.scanAndVerifyMultiplePos("bag-identifier-1",`${coi}-FP-01`, "be.visible")
         inputChecker.nextButtonCheck('be.enabled')
         })
      },
      checkBox: () => {
         //C39986
         inputChecker.clickOnCheck('[id="#/properties/data/properties/destruction_confirmed"]','be.disabled')
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
      },
      saveAndClose: () => {
         //C39987
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.clickOnCheck('[id="#/properties/data/properties/destruction_confirmed"]','be.enabled')
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
         cy.get(`@coi`).then(coi => {
         inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
         });
         inputChecker.checkState('[data-testid="cassette-1-check-mark"]','be.visible');
         inputChecker.checkState('[data-testid="bag-identifier-1-check-mark"]','be.visible');
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
         inputChecker.nextButtonCheck('be.enabled')
      },
      retainValue: () => {
         //C39988
         actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
            apiAliases: ['@patchProcedureSteps', '@getProcedures'] })
         inputChecker.nextButtonCheck('not.be.enabled')
         inputChecker.checkDataSavingWithBackButton('be.enabled')
         inputChecker.checkState('[data-testid="cassette-1-check-mark"]','be.visible');
         inputChecker.checkState('[data-testid="bag-identifier-1-check-mark"]','be.visible');
      }
   },
   qualityRelease : {
      previousHappyPathSteps: (scope, therapy) => {
         cy.get(`@coi`).then(coi => {
            mftgHappyPath.manufacturingCollectionSummary();
            mftgHappyPath.manufacturingVerifyShipper(coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');
            mftgHappyPath.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
            mftgHappyPath.manufacturingShipReceiptSummaryVerify(therapy, scope);
            mftgHappyPath.manufacturingTransferProductToStorage(coi, therapy);
            mftgHappyPath.manufacturingTransferProductToStorage2(coi);
            mftgHappyPath.manufacturingProductReceipt(scope.patientInformation.patientId, therapy);
            mftgHappyPath.manufacturingProductReceiptSummaryVerifyEmeaLc(therapy, scope);
            mftgHappyPath.manufacturingData(input.expiryDate, scope.patientInformation.orderingLotNumber);
            mftgHappyPath.manufacturingFinalLabels(therapy);
            mftgHappyPath.manufacturingLabelApplication(coi, therapy);
         })
      },

      nextButtonDisabledNeg: () => {
         cy.log("C39548 [NEG] Verify if the 'Next' button is disabled until the checkbox next to 'I verify that this product is approved to ship' is not checked.")
         inputChecker.nextButtonCheck('be.disabled');
      },

      nextButtonAfterTicking: () => {
         cy.log("C39549 [POS] Verify if the 'Next' button is enabled after the 'Confirm labels and packing insert(s) are printed successfully' checkbox is checked.")
         inputHelpers.clicker('[id="#/properties/data/properties/is_verified"]');
         inputChecker.nextButtonCheck('be.enabled')
      },

      signButtonEnabledAfterClickingNext: () => {
         cy.log("C39550 [POS] Verify the 'Sign To Confirm' button should be enabled after clicking on the 'Next' button")
         inputHelpers.clicker('[data-testid="primary-button-action"]');
         inputChecker.checkState("[data-testid='approver-sign-button']", "not.be.disabled")
         inputChecker.nextButtonCheck('be.disabled')
      },

      saveAndClose: () => {
         cy.log("C39551 [POS] Verify if the data is retained after clicking 'Save & Close' button.")
         signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
         inputChecker.nextButtonCheck('be.enabled')
         cy.get(`@coi`).then(coi => {
            inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
         }); 
      }
   },

   bagSelection: {
      previousHappyPathSteps: (scope, therapy) => {
         cy.get(`@coi`).then(coi => {
            mftgHappyPath.manufacturingCollectionSummary();
            mftgHappyPath.manufacturingVerifyShipper(coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');
            mftgHappyPath.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
            mftgHappyPath.manufacturingShipReceiptSummaryVerify(therapy, scope);
            mftgHappyPath.manufacturingTransferProductToStorage(coi, therapy);
            mftgHappyPath.manufacturingTransferProductToStorage2(coi);
            mftgHappyPath.manufacturingProductReceipt(scope.patientInformation.patientId, therapy);
            mftgHappyPath.manufacturingProductReceiptSummaryVerifyEmeaLc(therapy, scope);
            mftgHappyPath.manufacturingData(input.expiryDate, scope.patientInformation.orderingLotNumber);
            mftgHappyPath.manufacturingFinalLabels(therapy);
            mftgHappyPath.manufacturingLabelApplication(coi, therapy);
            mftgHappyPath.manufacturingQualityApproval();
         })
      },

      // C39552
      nextButtonDisabledNeg: () => {
         cy.log("[NEG] Verify if the 'Next' button is disabled when any of the 'SHIP' or 'DO NOT SHIP' button on the bag selection page is not selected.") 
         inputChecker.nextButtonCheck('be.disabled');
      },

      // C39553
      doNotShipBag : () => {
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'Do Not Ship' button on the bag selection page is selected.")
         inputHelpers.clicker('[data-testid="fail-button-0"]')
         inputChecker.nextButtonCheck('be.disabled')
      },

      // C39554
      saveAndClosePos : () => {
         cy.log("[POS] Verify if the data is retained after clicking 'Save & Close' button.")
         inputHelpers.clicker('[data-testid="pass-button-0"]')
         inputChecker.nextButtonCheck('not.be.disabled')
         cy.get(`@coi`).then(coi => {
         inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
         });
      }
   },

   transferProductToShipper: {
      previousHappyPathSteps: (scope, therapy) => {
         cy.get(`@coi`).then(coi => {
            mftgHappyPath.manufacturingCollectionSummary();
            mftgHappyPath.manufacturingVerifyShipper(coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');
            mftgHappyPath.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
            mftgHappyPath.manufacturingShipReceiptSummaryVerify(therapy, scope);
            mftgHappyPath.manufacturingTransferProductToStorage(coi, therapy);
            mftgHappyPath.manufacturingTransferProductToStorage2(coi);
            mftgHappyPath.manufacturingProductReceipt(scope.patientInformation.patientId, therapy);
            mftgHappyPath.manufacturingProductReceiptSummaryVerifyEmeaLc(therapy, scope);
            mftgHappyPath.manufacturingData(input.expiryDate, scope.patientInformation.orderingLotNumber);
            mftgHappyPath.manufacturingFinalLabels(therapy);
            mftgHappyPath.manufacturingLabelApplication(coi, therapy);
            mftgHappyPath.manufacturingQualityApproval();
            mftgHappyPath.manufacturingBagSelection();
         })
      },
      
      // C39555
      negCoiNotEnteredForBagIdentifier: () => {
         cy.get(`@coi`).then(coi => {
         inputHelpers.scanAndVerifyBags('coi-1', coi);
         inputChecker.scanAndVerifyMultipleNeg("cassette-1", coi + `-PRC-0${1}`)
         inputChecker.scanAndVerifyMultipleNeg("cassette-1", coi + `-APH-0${1}`)
         inputChecker.scanAndVerifyMultipleNeg("cassette-1", coi)
         })
         inputChecker.nextButtonCheck('be.disabled')
      },

      // C39556
      negCoiNotEnteredForShipperLabel: () => {
         inputChecker.checkForGreenCheck("coi-1");
      },

      // C39557
      posSaveAndCloseButtonCheck: () => {
         cy.get(`@coi`).then(coi => {
         inputChecker.scanAndVerifyMultiplePos("cassette-1", `${coi}-FP-01`, "be.visible")
         inputChecker.nextButtonCheck('not.be.disabled')
         inputChecker.checkDataSavingWithSaveAndClose(coi, 'not.be.disabled', "Reservations");
         });
         inputChecker.checkForGreenCheck("cassette-1");
         inputChecker.checkForGreenCheck("coi-1");
      }
   },

   shippingManufacturing : {
      previousHappyPathSteps: (scope,therapy) => {
         cy.get(`@coi`).then(coi => {
            mftgHappyPath.manufacturingCollectionSummary();
            mftgHappyPath.manufacturingVerifyShipper(coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');
            mftgHappyPath.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
            mftgHappyPath.manufacturingShipReceiptSummaryVerify(therapy, scope);
            mftgHappyPath.manufacturingTransferProductToStorage(coi, therapy);
            mftgHappyPath.manufacturingTransferProductToStorage2(coi);
            mftgHappyPath.manufacturingProductReceipt(scope.patientInformation.patientId, therapy);
            mftgHappyPath.manufacturingProductReceiptSummaryVerifyCilta(therapy, scope);
            mftgHappyPath.manufacturingData(input.expiryDate, scope.patientInformation.orderingLotNumber);
            mftgHappyPath.manufacturingFinalLabels(therapy);
            mftgHappyPath.manufacturingLabelApplication(coi, therapy);
            mftgHappyPath.manufacturingQualityApproval();
            mftgHappyPath.manufacturingBagSelection();
            mftgHappyPath.manufacturingTransferProductToShipper(coi, therapy);
         })
      },

      //C39665
      airwayBillNumberBlank: () => {
         cy.log("[NEG] Verify if the 'Next' button is disabled until the air waybill number for 'Please enter air waybill number for shipment' is not confirmed and all other questions and fields are answered and filled.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39666
      orderIdBlank: (scope) => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled until the order ID for 'Please enter Order ID on air waybill' is not confirmed and all other questions are answered.");
         getManufAirWayBill(scope,1);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39667
      evoLast4DigitsBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled until the EVO-IS Number for 'Please enter the last 4-digits of the EVO-IS Number...' is not entered and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39668
      tamperSealNumberumberBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled until the Tamper Seal Number for 'Please enter the Tamper Seal Number on LN2 shipper lid' is not entered and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39669
      shipperCaseIntactNeg: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the shipping container case intact?' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="fail-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39670
      shipperCaseIntactBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the shipping container case intact?...' and all other questions are answered. ");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39671
      shipperCaseIntactPos: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the shipping container case intact?...' and 'Details' are entered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="fail-button-case_intact_cilta"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/case_intact_cilta_reason-input"]',input.reason);
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
      },
      
      //C39672
      tempOutOfRangeNeg: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Was there a temperature out-of-range....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="fail-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39673
      tempOutOfRangeBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Was there a temperature out-of-range....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39674
      tempOutOfRangePos: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Was there a temperature out-of-range....' and 'Details' are entered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="fail-button-temp_out_cilta"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/temp_out_cilta_reason-input"]',input.reason);
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
      },

      //C39675
      airwayBillMatchTamperNeg: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Does the EVO-IS Number listed on the Air Waybill....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="fail-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39676
      airwayBillMatchTamperBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Does the EVO-IS Number listed on the Air Waybill....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39677
      airwayBillMatchTamperPos: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Does the EVO-IS Number listed on the Air Waybill....' and 'Details' are entered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="fail-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_airway_bill_reason-input"]',input.reason);
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
      },

      //C39678
      tamperSealMatchNeg: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Does the Tamper Seal Number listed on the Air Waybill....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39679
      tamperSealMatchBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Does the Tamper Seal Number listed on the Air Waybill....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39680
      tamperSealMatchPos: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Does the Tamper Seal Number listed on the Air Waybill....' and 'Details' are entered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_match_reason-input"]',input.reason);
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
      },

      //C39681
      cassetteNotExposedNeg: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Confirm cassette(s) were not exposed....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="fail-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39682
      cassetteNotExposedBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Confirm cassette(s) were not exposed....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39683
      cassetteNotExposedPos: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Confirm cassette(s) were not exposed....' and 'Details' are entered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="fail-button-confirm_cassette_not_exposed"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/confirm_cassette_not_exposed_reason-input"]',input.reason);
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
      },

      //C39684
      packingInsertNeg: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the packing insert(s) included....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="fail-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39685
      packingInsertBlank: () => {
         inputChecker.reloadPage();
         cy.log("[[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the packing insert(s) included....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39686
      packingInsertPos: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the packing insert(s) included....' and 'Details' are entered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="fail-button-packing_insert_cilta"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/packing_insert_cilta_reason-input"]',input.reason);
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
      },

      //C39687
      consigneeKitPouchNeg: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the Consignee kit pouch included....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="fail-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39688
      consigneeKitPouchBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the Consignee kit pouch included....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39689
      consigneeKitPouchPos: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the Consignee kit pouch included....' and 'Details' are entered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="fail-button-consignee_kit_pouch_inside"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/consignee_kit_pouch_inside_reason-input"]',input.reason);
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
      },

      //C39690
      shippingContainerSecureNeg: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the shipping container secured?' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="fail-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39691
      shippingContainerSecureBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the shipping container secured?' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39692
      shippingContainerSecurePos: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the shipping container secured?' and 'Details' are entered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="fail-button-zip_ties_secured"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/zip_ties_secured_reason-input"]',input.reason);
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
      },

      //C39693
      redWireSealLabelNeg: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the red wire tamper seal labeled...' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39694
      redWireSealLabelBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the red wire tamper seal labeled...' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39695
      redWireSealLabelPos: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the red wire tamper seal labeled...' and 'Details' are entered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_reason-input"]',input.reason);
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
      },

      //C39696
      redWireSealInPlaceNeg: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the red wire tamper seal...' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39697
      redWireSealInPlaceBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the red wire tamper seal...' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C39698
      redWireSealInPlacePos: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the red wire tamper seal...' and 'Details' are entered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_shipper_reason-input"]',input.reason);
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
      },

      //C39699
      verifySaveAndCloseBtn: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the data is retained after clicking 'Save & Close' button.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
         cy.get(`@coi`).then(coi => {
         inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
         });
         inputChecker.nextButtonCheck('not.be.disabled');
      },
   },

   shippingManufacturingSummary: {
      previousHappyPathSteps: (scope,therapy) => {
         cy.get(`@coi`).then(coi => {
            mftgHappyPath.manufacturingCollectionSummary();
            mftgHappyPath.manufacturingVerifyShipper(coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');
            mftgHappyPath.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
            mftgHappyPath.manufacturingShipReceiptSummaryVerify(therapy, scope);
            mftgHappyPath.manufacturingTransferProductToStorage(coi, therapy);
            mftgHappyPath.manufacturingTransferProductToStorage2(coi);
            mftgHappyPath.manufacturingProductReceipt(scope.patientInformation.patientId, therapy);
            mftgHappyPath.manufacturingProductReceiptSummaryVerifyCilta(therapy, scope);
            mftgHappyPath.manufacturingData(input.expiryDate, scope.patientInformation.orderingLotNumber);
            mftgHappyPath.manufacturingFinalLabels(therapy);
            mftgHappyPath.manufacturingLabelApplication(coi, therapy);
            mftgHappyPath.manufacturingQualityApproval();
            mftgHappyPath.manufacturingBagSelection();
            mftgHappyPath.manufacturingTransferProductToShipper(coi, therapy);
            mftgHappyPath.shippingManufacturing(1,scope,input.orderId,input.evoLast4Digits,input.tamperSealNumber,therapy);
         })
      },

      //C39661
      verifyEditBtn:() => {
         inputHelpers.clicker('[data-testid="edit-shipping_manufacturing"]');
         inputHelpers.clicker('[data-testid="fail-button-case_intact_cilta"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/case_intact_cilta_reason-input"]', input.reason);
         inputChecker.reasonForChange();
         translationHelpers.assertSingleField('[data-testid=display-only]>div>span:nth(9)', "No");
      },

      //C39662
      checkNextButtonWithoutSignatureNeg: () => {
         cy.log('[NEG] Verify if the "Next" button is disabled after confirmers signature is signed.');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
         signatureHelpers.clickSignDocumentButton('approver', ['@postSignature']);
         actionButtonsHelper.checkActionButtonIsEnabled('secondary');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C39663  
      checkVerifierSignature:() => {
         cy.log('[POS] Verify if the "Next" button is enabled after verifiers signature is signed.');
         signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], input.quelaEmail);
         actionButtonsHelper.checkActionButtonIsEnabled('secondary');
         actionButtonsHelper.checkActionButtonIsEnabled('primary');
      },

      //C39664	
      verifySaveAndCloseBtn: () => {
         cy.log("[POS] Verify if the data is retained after clicking 'Save & Close' button.");
         inputChecker.nextButtonCheck('be.enabled');
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
         cy.get(`@coi`).then(coi => {
         inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
         });
         inputChecker.nextButtonCheck('not.be.disabled');
      },
   },

   checkStatusesOfManufacturingModule: (scope, therapy) => {
     cy.get(`@coi`).then((coi) => {
        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.collectionStatus,'Reservations',4)
        mftgHappyPath.manufacturingCollectionSummary(therapy);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.verifyShipper,'Reservations',4)
        mftgHappyPath.manufacturingVerifyShipper(coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.shipmentReceiptChecklist,'Reservations',4)
        mftgHappyPath.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.shipmentReceiptChecklistSummary,'Reservations',4)
        mftgHappyPath.manufacturingShipReceiptSummaryVerify(therapy, scope);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.transferProductToStorage1,'Reservations',4)
        mftgHappyPath.manufacturingTransferProductToStorage(coi, therapy);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.transferProductToStorage2,'Reservations',4)
        mftgHappyPath.manufacturingTransferProductToStorage2(coi);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.productReceipt,'Reservations',4)
        mftgHappyPath.manufacturingProductReceipt(scope.patientInformation.patientId, therapy);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.productReceiptSummary,'Reservations',4)
        mftgHappyPath.manufacturingProductReceiptSummaryVerifyEmeaLc(therapy, scope);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.selectExpiryData,'Reservations',4)
        mftgHappyPath.manufacturingData(input.expiryDate, scope.patientInformation.orderingLotNumber);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.printFinalProductLabels,'Reservations',4)
        mftgHappyPath.manufacturingFinalLabels(therapy);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.confirmLabelApplication1,'Reservations',4)
        mftgHappyPath.manufacturingLabelApplication(coi, therapy);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.qualityApproval,'Reservations',4)
        mftgHappyPath.manufacturingQualityApproval();

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.bagSelection,'Reservations',4)
        mftgHappyPath.manufacturingBagSelection();

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.transferProductToShipper,'Reservations',4)
        mftgHappyPath.manufacturingTransferProductToShipper(coi, therapy);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.shippingManufacturing,'Reservations',4)
        mftgHappyPath.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, therapy);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.shippingManufacturingSummary,'Reservations',4)
        mftgHappyPath.manufacturingShippingManufacturingSummaryVerifyCilta(therapy, scope);

        cy.checkStatus(coi,regressionInput.manufacturing.statuses.shippingSummary,'Reservations',4)
    })
  }
}
    