
import common from '../../../support/index.js'
import translationHelpers from '../../shared_block_helpers/translationHelpers'
import infusionAssertions from '../../../fixtures/infusionAssertions.json'
import input from '../../../fixtures/inputs.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers.js'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers.js'
import inf_steps from '../../../utils/HappyPath_steps/CCLP_EU_HappyPath/infusion_steps';
import regressionInput from '../../../fixtures/inputsRegression.json'

export default {
  receiveShipment: {
      // C40507
    negCoi: () => {
      inputChecker.nextButtonCheck('be.disabled')
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-world-distribution-center-to-infusion', `${coi}-APH-01`,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-world-distribution-center-to-infusion', `${coi}-FP-01`,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-world-distribution-center-to-infusion', `${coi}-PRC-01`,'not.be.visible','be.disabled')
      })
    },

    posDataOnNext: () => {
      // C40508
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-world-distribution-center-to-infusion', `${coi}`,'be.visible','not.be.disabled')
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
            inf_steps.infusionReceiveShipment('world-distribution-center', '', coi);
        })
    },
    
    //C29510
    emptyEvoIsNumberFieldNeg: () => {
        inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
        inputHelpers.clicker(['[data-testid="pass-button-shipping_container_condition"]', '[data-testid="pass-button-zip_ties_secured"]',
          '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_match"]',
          '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
        inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', "be.disabled");
    },

    //C29511
    emptyTamperSealNumberFieldNeg: () => {
        inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
        inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', "be.disabled");
    },

    // C29512
    negShippingContainerEmpty: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker('[data-testid="pass-button-shipping_container_condition"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

      //C29513	
    negShippingContainer: () => {
      inputHelpers.clicker('[data-testid="fail-button-shipping_container_condition"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_condition_reason-input"]');
    },

    // C29514
    posShippingContainer: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_condition_reason-input"]', 'some reason', "be.enabled");
    },
    
    //C29515
    negZipTiesSecuredEmpty: () => {
      inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    //C29516
    negZipTiesSecured: () => {
      inputHelpers.clicker('[data-testid="fail-button-zip_ties_secured"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]');
    },

    //C29517
    posZipTiesSecured: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]', 'some reason', "be.enabled");
    },

    //C29518
    negShipperLabelEmpty: () => {
      inputHelpers.clicker('[data-testid="pass-button-included_shipper_label"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    //C29519
    negShipperLabel: () => {
      inputHelpers.clicker('[data-testid="fail-button-included_shipper_label"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/included_shipper_label_reason-input"]');
    },

    //C29520
    posToggleShipperLabel: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/included_shipper_label_reason-input"]', 'some reason', "be.enabled");
    },
    
      //C29521
    negToggleIsConsigneeKitPouchEmpty: () => {
      inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    //C29522
    negToggleIsConsigneeKitPouch: () => {
      inputHelpers.clicker('[data-testid="fail-button-consignee_pouch_inside"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]');
    },

    // C29523
    posToggleIsConsigneeKitPouch: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]', 'some reason', "be.enabled");
    },

    //C295224
    negEvoMatchEmpty: () => {
      inputHelpers.clicker('[data-testid="pass-button-evo_match"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    //C295225
    negEvoMatch: () => {
      inputHelpers.clicker('[data-testid="fail-button-evo_match"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_match_reason-input"]');
    },
    
    //C295226
    posToggleDoesTamperSealNumberListed: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_match_reason-input"]', 'some reason', "be.enabled");
    },

    //C295227
    negRedWireTamperSealEmpty: () => {
      inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    //C295228
    negRedWireTamperSeal: () => {
      inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_seal"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]');
    },


    //C295229
    posRedWireTamperSeal: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]', 'some reason', "be.enabled");
    },

    //C295230
      negTamperSealMatchEmpty: () => {
      inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    //C295231
    negTamperSealMatch: () => {
      inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]');
    },
    
    //C295232
    PosTamperSealMatch: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]', 'some reason', "be.enabled");
    },

    //C295233
    posSaveAndCloseButtonCheck: (scope) => {
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients",true)
      inputChecker.nextButtonCheck("be.enabled");
      inputChecker.checkValue('[data-testid="fail-button-shipping_container_condition"]', 'false');
      inputChecker.checkValue('[data-testid="fail-button-zip_ties_secured"]', 'false');
      inputChecker.checkValue('[data-testid="fail-button-included_shipper_label"]', 'false');
      inputChecker.checkValue('[data-testid="fail-button-consignee_pouch_inside"]', 'false');
      inputChecker.checkValue('[data-testid="fail-button-tamper_seal_match"]', 'false');
      inputChecker.checkValue('[data-testid="fail-button-red_wire_tamper_seal"]', 'false');
    },
  },

  shipmentReceiptSummary: {
    previousHappyPathSteps: () => {
        cy.get(`@coi`).then(coi => {
          inf_steps.infusionReceiveShipment('world-distribution-center', '', coi);
          inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        })
    },

    //CC29553
    posEditButton: () => {
        inputHelpers.clicker('[data-testid="edit-shipment_receipt_checklist"]');
        inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.changedEvoIsNumber);
        inputChecker.reasonForChange()   
    },

    //C29554
    nextButtonPos: () => {
        inputChecker.checkNextButtonWithAndWithoutSignature('1')
    }
},

  transferProductToStorage: {
    previousHappyPathSteps: (scope) => {
      cy.get(`@coi`).then(coi => {
          inf_steps.infusionReceiveShipment('world-distribution-center', '', coi);
          inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
          inf_steps.infusionShipmentReceiptSummary(scope);
      })
    },
  
    negBagId: () => {
      //C40511
      inputChecker.keepFieldsEmptymultiBags('ln-2-shipper-1','be.disabled')
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultipleNeg("ln-2-shipper-1",coi+`-FP-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("ln-2-shipper-1",coi+`-APH-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("ln-2-shipper-1",coi+`-PRC-0${1}`)
      })
    },
    cassetteNeg: () => {
      //C40512
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
      // C40513
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultiplePos("cassette-1",coi+`-FPS-0${1}`,"be.visible")
      })
      inputChecker.nextButtonCheck("be.disabled")
    },

    saveAndClosePos: (scope) => {
      // C40514
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
          inf_steps.infusionReceiveShipment('world-distribution-center', '', coi);
          inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
          inf_steps.infusionShipmentReceiptSummary(scope);
          inf_steps.infusionTransferProductToStorage(coi);
      })
    },

    nothingSelectedForInvestigationProductNeg: () => {
        //C40515
      inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
      inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
      inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
      inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    noSelectedForInvestigationProductNeg: () => {
      //C40516
      inputHelpers.clicker('[data-testid="fail-button-investigational_product"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/investigational_product_reason-input"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    reasonFilledForInvestigationProductPOS: () => {
      //C40517
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/investigational_product_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    nothingSelectedForSealInPlaceNeg: () => {
      //C40518
      inputHelpers.clicker('[data-testid="pass-button-investigational_product"]');
      inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    noSelectedForSealInPlaceNeg: () => {
      //C40519
      inputHelpers.clicker('[data-testid="fail-button-seal_in_place"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    reasonFilledForSealInPlacePos: () => {
      //C40520
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    nothingSelectedForTempRangeNeg: () => {
      //C40521
      inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
      inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    noSelectedForTempRangeNeg: () => {
      //C40522
      inputHelpers.clicker('[data-testid="fail-button-temperature_out_of_range"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/temperature_out_of_range_reason-input"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    reasonFilledForTempRangedPos: () => {
      //C40523
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/temperature_out_of_range_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    nothingSelectedForExpecCondtionNeg: () => {
      //C40524
      inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
      inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    noSelectedForExpecCondtionNeg: () => {
      //C40525	
      inputHelpers.clicker('[data-testid="fail-button-expected_condition"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    reasonFilledForForExpecCondtionPos: () => {
      //C40526
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled');
    },

    nothingSelectedForStorageNeg: () => {
      //C40527
      inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
      inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    noSelectedForStorageNeg: () => {
      //C40528
      inputHelpers.clicker('[data-testid="fail-button-placed_into_storage"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    reasonFilledForStoragePos: () => {
      //C40529
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    posSaveAndCloseButtonCheck: (scope) => {
      //C40530
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
          inf_steps.infusionReceiveShipment('world-distribution-center', '', coi);
          inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
          inf_steps.infusionShipmentReceiptSummary(scope);
          inf_steps.infusionTransferProductToStorage(coi);
          inf_steps.infusionProductReceiptChecklist();
      })
  },

    nextButtonPos: () => {
        //C29557
        inputChecker.checkNextButtonWithAndWithoutSignature('1')
    },
  },

  checkStatusesOfInfusionModule: (scope) => {

    cy.openOrder('infusion','phil')
    cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
    cy.get(`@coi`).then((coi) => {
  inputHelpers.clickOnHeader('infusion')
  cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.infusion.statuses.ReciveShipment,'Patients',4)
  inf_steps.infusionReceiveShipment('manufacturing-site', '-cclp', coi);

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
  