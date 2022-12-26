
import common from '../../../support/index.js'
import translationHelpers from '../../shared_block_helpers/translationHelpers'
import infusionAssertions from '../../../fixtures/infusionAssertions.json'
import input from '../../../fixtures/inputs.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers.js'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers.js'
import inf_steps from '../../../utils/HappyPath_steps/CCLP_US_HappyPath/infusion_steps';
import regressionInput from '../../../fixtures/inputsRegression.json'

export default {
  receiveShipment: {
      // C29005
    negCoi: () => {
      inputChecker.nextButtonCheck('be.disabled')
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-manufacturing-site-to-infusion-cclp', `${coi}-APH-01`,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-manufacturing-site-to-infusion-cclp', `${coi}-FP-01`,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-manufacturing-site-to-infusion-cclp', `${coi}-PRC-01`,'not.be.visible','be.disabled')
      })
    },

    posDataOnNext: () => {
      // C29006
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-manufacturing-site-to-infusion-cclp', `${coi}`,'be.visible','not.be.disabled')
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
            inf_steps.infusionReceiveShipment('manufacturing-site', '-cclp', coi);
        })
    },
    
    //C28960 
    emptyEvoIsNumberFieldNeg: () => {
        inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.tamperSealNumber);
        inputHelpers.clicker(['[data-testid="pass-button-shipping_container_condition"]', '[data-testid="pass-button-zip_ties_secured"]',
          '[data-testid="pass-button-included_shipper_label"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_match"]',
          '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
        inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', "be.disabled");
    },

    //C28961
    emptyTamperSealNumberFieldNeg: () => {
        inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.infusion.evoIsNumber);
        inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', "be.disabled");
    },

    // C28963
    negShippingContainerEmpty: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker('[data-testid="pass-button-shipping_container_condition"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

      //C28964	
    negShippingContainer: () => {
      inputHelpers.clicker('[data-testid="fail-button-shipping_container_condition"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_condition_reason-input"]');
    },

    // C28965
    posShippingContainer: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_condition_reason-input"]', 'some reason', "be.enabled");
    },
    
    //C28966
    negZipTiesSecuredEmpty: () => {
      inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    //C28967
    negZipTiesSecured: () => {
      inputHelpers.clicker('[data-testid="fail-button-zip_ties_secured"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]');
    },

    //C28968
    posZipTiesSecured: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]', 'some reason', "be.enabled");
    },

    //C28969
    negShipperLabelEmpty: () => {
      inputHelpers.clicker('[data-testid="pass-button-included_shipper_label"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    //C28970
    negShipperLabel: () => {
      inputHelpers.clicker('[data-testid="fail-button-included_shipper_label"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/included_shipper_label_reason-input"]');
    },

    //C28971
    posToggleShipperLabel: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/included_shipper_label_reason-input"]', 'some reason', "be.enabled");
    },
    

      //C28972
    negToggleIsConsigneeKitPouchEmpty: () => {
      inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    //C28973
    negToggleIsConsigneeKitPouch: () => {
      inputHelpers.clicker('[data-testid="fail-button-consignee_pouch_inside"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]');
    },

    // C28974
    posToggleIsConsigneeKitPouch: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]', 'some reason', "be.enabled");
    },

    //C28975
    negEvoMatchEmpty: () => {
      inputHelpers.clicker('[data-testid="pass-button-evo_match"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    //C28976
    negEvoMatch: () => {
      inputHelpers.clicker('[data-testid="fail-button-evo_match"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_match_reason-input"]');
    },
    
    //C28977
    posToggleDoesTamperSealNumberListed: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_match_reason-input"]', 'some reason', "be.enabled");
    },

    //C28978
    negRedWireTamperSealEmpty: () => {
      inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    //C28979
    negRedWireTamperSeal: () => {
      inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_seal"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]');
    },


    //C28980
    posRedWireTamperSeal: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]', 'some reason', "be.enabled");
    },

    //C28981
      negTamperSealMatchEmpty: () => {
      inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    //C28982
    negTamperSealMatch: () => {
      inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]');
    },
    
    //C28983
    PosTamperSealMatch: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]', 'some reason', "be.enabled");
    },

    //C28984
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
            inf_steps.infusionReceiveShipment('manufacturing-site', '-cclp', coi);
            inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        })
    },

    //C29003
    posEditButton: () => {
        inputHelpers.clicker('[data-testid="edit-shipment_receipt_checklist"]');
        inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.infusion.changedEvoIsNumber);
        inputChecker.reasonForChange()   
    },

    //C29004
    nextButtonPos: () => {
        inputChecker.checkNextButtonWithAndWithoutSignature('1')
    }
},

  transferProductToStorage: {
    previousHappyPathSteps: (scope) => {
      cy.get(`@coi`).then(coi => {
          inf_steps.infusionReceiveShipment('manufacturing-site', '-cclp', coi);
          inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
          inf_steps.infusionShipmentReceiptSummary(scope);
      })
    },
  
    negBagId: () => {
      //C36426
      inputChecker.keepFieldsEmptymultiBags('ln-2-shipper-1','be.disabled')
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultipleNeg("ln-2-shipper-1",coi+`-FP-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("ln-2-shipper-1",coi+`-APH-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("ln-2-shipper-1",coi+`-PRC-0${1}`)
      })
    },
    cassetteNeg: () => {
      //C36427
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
          inf_steps.infusionReceiveShipment('manufacturing-site', '-cclp', coi);
          inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
          inf_steps.infusionShipmentReceiptSummary(scope);
          inf_steps.infusionTransferProductToStorage(coi);
      })
    },

    nothingSelectedForInvestigationProductNeg: () => {
        //C28985
      inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
      inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
      inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
      inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    noSelectedForInvestigationProductNeg: () => {
      //C28986
      inputHelpers.clicker('[data-testid="fail-button-investigational_product"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/investigational_product_reason-input"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    reasonFilledForInvestigationProductPOS: () => {
      //C28987
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/investigational_product_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    nothingSelectedForSealInPlaceNeg: () => {
      //C28988
      inputHelpers.clicker('[data-testid="pass-button-investigational_product"]');
      inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    noSelectedForSealInPlaceNeg: () => {
      //C28989
      inputHelpers.clicker('[data-testid="fail-button-seal_in_place"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    reasonFilledForSealInPlacePos: () => {
      //C28990
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    nothingSelectedForTempRangeNeg: () => {
      //C28991
      inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
      inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    noSelectedForTempRangeNeg: () => {
      //C28992
      inputHelpers.clicker('[data-testid="fail-button-temperature_out_of_range"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/temperature_out_of_range_reason-input"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    reasonFilledForTempRangedPos: () => {
      //C28993
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/temperature_out_of_range_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    nothingSelectedForExpecCondtionNeg: () => {
      //C28994
      inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
      inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    noSelectedForExpecCondtionNeg: () => {
      //C28995	
      inputHelpers.clicker('[data-testid="fail-button-expected_condition"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    reasonFilledForForExpecCondtionPos: () => {
      //C28996
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled');
    },

    nothingSelectedForStorageNeg: () => {
      //C28997
      inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
      inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    noSelectedForStorageNeg: () => {
      //C28998
      inputHelpers.clicker('[data-testid="fail-button-placed_into_storage"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    reasonFilledForStoragePos: () => {
      //C28999
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    posSaveAndCloseButtonCheck: (scope) => {
      // C20115
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
            inf_steps.infusionReceiveShipment('manufacturing-site', '-cclp', coi);
            inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
            inf_steps.infusionShipmentReceiptSummary(scope);
            inf_steps.infusionTransferProductToStorage(coi);
            inf_steps.infusionProductReceiptChecklist();
        })
    },

    nextButtonPos: () => {
        //C29007
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
  