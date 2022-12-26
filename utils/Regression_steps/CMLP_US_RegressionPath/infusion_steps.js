import common from '../../../support/index.js'
import translationHelpers from '../../shared_block_helpers/translationHelpers'
import infusionAssertions from '../../../fixtures/infusionAssertions.json'
import input from '../../../fixtures/inputs.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers.js'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers.js'
import inf_steps from '../../../utils/HappyPath_steps/CMLP_US_HappyPath/infusion_steps';
import regressionInput from '../../../fixtures/inputsRegression.json'

export default {
  receiveShipment: {
      
    negCoi: () => {
      inputChecker.nextButtonCheck('be.disabled')
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-manufacturing-site-to-infusion-2003-cmlp-us', `${coi}-APH-01`,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-manufacturing-site-to-infusion-2003-cmlp-us', `${coi}-FP-01`,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-manufacturing-site-to-infusion-2003-cmlp-us', `${coi}-PRC-01`,'not.be.visible','be.disabled')
      })
    },

    posDataOnNext: () => {
      
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-manufacturing-site-to-infusion-2003-cmlp-us', `${coi}`,'be.visible','not.be.disabled')
      })
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      });
      inputChecker.checkDataSavingWithBackButton('be.enabled');
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      }
    },

  shipmentReceiptChecklist: {
    previousHappyPathSteps: () => {
        cy.get(`@coi`).then(coi => {
            inf_steps.infusionReceiveShipment('manufacturing-site', '-2003-cmlp-us', coi);
        })
    },
    

    emptyEvoIsNumberFieldNeg: () => {
        inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
        inputHelpers.clicker(['[data-testid="pass-button-shipping_container_condition"]', '[data-testid="pass-button-zip_ties_secured"]',
          '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_match"]',
          '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
        inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', "be.disabled");
    },


    emptyTamperSealNumberFieldNeg: () => {
        inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
        inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', "be.disabled");
    },


    negShippingContainerEmpty: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker('[data-testid="pass-button-shipping_container_condition"]')
      inputChecker.nextButtonCheck("be.disabled");
    },


    negShippingContainer: () => {
      inputHelpers.clicker('[data-testid="fail-button-shipping_container_condition"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_condition_reason-input"]');
    },


    posShippingContainer: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_condition_reason-input"]', 'some reason', "be.enabled");
    },
    
        negZipTiesSecuredEmpty: () => {
      inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

        negZipTiesSecured: () => {
      inputHelpers.clicker('[data-testid="fail-button-zip_ties_secured"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]');
    },

        posZipTiesSecured: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]', 'some reason', "be.enabled");
    },

        negShipperLabelEmpty: () => {
      inputHelpers.clicker('[data-testid="pass-button-included_shipper_label"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

        negShipperLabel: () => {
      inputHelpers.clicker('[data-testid="fail-button-included_shipper_label"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/included_shipper_label_reason-input"]');
    },

        posToggleShipperLabel: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/included_shipper_label_reason-input"]', 'some reason', "be.enabled");
    },
    

          negToggleIsConsigneeKitPouchEmpty: () => {
      inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

        negToggleIsConsigneeKitPouch: () => {
      inputHelpers.clicker('[data-testid="fail-button-consignee_pouch_inside"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]');
    },

    
    posToggleIsConsigneeKitPouch: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]', 'some reason', "be.enabled");
    },

        negEvoMatchEmpty: () => {
      inputHelpers.clicker('[data-testid="pass-button-evo_match"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

        negEvoMatch: () => {
      inputHelpers.clicker('[data-testid="fail-button-evo_match"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_match_reason-input"]');
    },
    
        posToggleDoesTamperSealNumberListed: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_match_reason-input"]', 'some reason', "be.enabled");
    },

        negRedWireTamperSealEmpty: () => {
      inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

        negRedWireTamperSeal: () => {
      inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_seal"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]');
    },


        posRedWireTamperSeal: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]', 'some reason', "be.enabled");
    },

          negTamperSealMatchEmpty: () => {
      inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

        negTamperSealMatch: () => {
      inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]');
    },
    
        PosTamperSealMatch: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]', 'some reason', "be.enabled");
    },

        posSaveAndCloseButtonCheck: (scope) => {
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients",true)
      inputChecker.nextButtonCheck("be.enabled");
      inputChecker.checkValue('[data-testid="pass-button-shipping_container_condition"]', 'true');
      inputChecker.checkValue('[data-testid="pass-button-zip_ties_secured"]', 'true');
      inputChecker.checkValue('[data-testid="pass-button-included_shipper_label"]', 'true');
      inputChecker.checkValue('[data-testid="pass-button-consignee_pouch_inside"]', 'true');
      inputChecker.checkValue('[data-testid="pass-button-tamper_seal_match"]', 'true');
      inputChecker.checkValue('[data-testid="pass-button-red_wire_tamper_seal"]', 'true');
    },
  },

  shipmentReceiptSummary: {
    previousHappyPathSteps: () => {
        cy.get(`@coi`).then(coi => {
            inf_steps.infusionReceiveShipment('manufacturing-site', '-2003-cmlp-us', coi);
            inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        })
    },

        posEditButton: () => {
        inputHelpers.clicker('[data-testid="edit-shipment_receipt_checklist"]');
        inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.changedEvoIsNumber);
        inputChecker.reasonForChange()   
    },

        nextButtonPos: () => {
        inputChecker.checkNextButtonWithAndWithoutSignature('1')
    }
},

  transferProductToStorage: {
    previousHappyPathSteps: (scope) => {
      cy.get(`@coi`).then(coi => {
          inf_steps.infusionReceiveShipment('manufacturing-site', '-2003-cmlp-us', coi);
          inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
          inf_steps.infusionShipmentReceiptSummary(scope);
      })
    },
  
    negBagId: () => {
            inputChecker.keepFieldsEmptymultiBags('ln-2-shipper-1','be.disabled')
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultipleNeg("ln-2-shipper-1",coi+`-FP-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("ln-2-shipper-1",coi+`-APH-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("ln-2-shipper-1",coi+`-PRC-0${1}`)
      })
    },
    cassetteNeg: () => {
            cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultiplePos("ln-2-shipper-1",coi,"be.visible")
      })
      inputChecker.scanAndVerifyFieldAsEmpty('cassette-1','be.disabled')
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultipleNeg("cassette-1",coi+`-FP-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("cassette-1",coi+`-APH-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("cassette-1",coi+`-PRC-0${1}`)
      })
    },
    
    finalProductNeg: () => {
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultiplePos("cassette-1",coi+`-FPS-0${1}`,"be.visible")
      })
      inputChecker.nextButtonCheck("be.disabled")
    },

    saveAndClosePos: (scope) => {
      cy.get('[id="#/properties/custom_fields/properties/how_fp_stored"]').eq(1).select('Local LN2 storage')
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients",true)
      inputChecker.nextButtonCheck('not.be.disabled')
      inputChecker.checkForGreenCheck("cassette-1")
      inputChecker.checkForGreenCheck("ln-2-shipper-1")
    }
  },
  productReceiptChecklist: {
    previousHappyPathSteps: (scope) => {
      cy.get(`@coi`).then(coi => {
          inf_steps.infusionReceiveShipment('manufacturing-site', '-2003-cmlp-us', coi);
          inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
          inf_steps.infusionShipmentReceiptSummary(scope);
          inf_steps.infusionTransferProductToStorage(coi);
      })
    },

    nothingSelectedForInvestigationProductNeg: () => {
              inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
      inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
      inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
      inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    noSelectedForInvestigationProductNeg: () => {
            inputHelpers.clicker('[data-testid="fail-button-investigational_product"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/investigational_product_reason-input"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    reasonFilledForInvestigationProductPOS: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/investigational_product_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    nothingSelectedForSealInPlaceNeg: () => {
            inputHelpers.clicker('[data-testid="pass-button-investigational_product"]');
      inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    noSelectedForSealInPlaceNeg: () => {
            inputHelpers.clicker('[data-testid="fail-button-seal_in_place"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    reasonFilledForSealInPlacePos: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    nothingSelectedForTempRangeNeg: () => {
            inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
      inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    noSelectedForTempRangeNeg: () => {
            inputHelpers.clicker('[data-testid="fail-button-temperature_out_of_range"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/temperature_out_of_range_reason-input"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    reasonFilledForTempRangedPos: () => {
            inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/temperature_out_of_range_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    nothingSelectedForExpecCondtionNeg: () => {
            inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
      inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    noSelectedForExpecCondtionNeg: () => {
      
      inputHelpers.clicker('[data-testid="fail-button-expected_condition"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    reasonFilledForForExpecCondtionPos: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled');
    },

    nothingSelectedForStorageNeg: () => {
      inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
      inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    noSelectedForStorageNeg: () => {
      inputHelpers.clicker('[data-testid="fail-button-placed_into_storage"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    reasonFilledForStoragePos: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    posSaveAndCloseButtonCheck: (scope) => {
      
      inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients",true)
      inputChecker.nextButtonCheck("be.enabled");
      inputChecker.checkValue('[data-testid="pass-button-seal_in_place"]', 'true');
      inputChecker.checkValue('[data-testid="pass-button-temperature_out_of_range"]', 'true');
      inputChecker.checkValue('[data-testid="pass-button-expected_condition"]', 'true');
      inputChecker.checkValue('[data-testid="pass-button-placed_into_storage"]', 'true');
      inputChecker.checkValue('[data-testid="pass-button-investigational_product"]', 'true');
  },
},

productReceiptSummary: {
    previousHappyPathSteps: (scope) => {
        cy.get(`@coi`).then(coi => {
            inf_steps.infusionReceiveShipment('manufacturing-site', '-2003-cmlp-us', coi);
            inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
            inf_steps.infusionShipmentReceiptSummary(scope);
            inf_steps.infusionTransferProductToStorage(coi);
            inf_steps.infusionProductReceiptChecklist();
        })
    },

    nextButtonPos: () => {
      inputChecker.checkNextButtonWithAndWithoutSignature('1')
    },
  },

  checkStatusesOfInfusionModule: (scope) => {

    cy.openOrder('infusion','phil')
    cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
    cy.get(`@coi`).then((coi) => {
  inputHelpers.clickOnHeader('infusion')
  cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.infusion.statuses.ReciveShipment,'Patients',4)
  inf_steps.infusionReceiveShipment('manufacturing-site', '-2003-cmlp-us', coi);

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
  