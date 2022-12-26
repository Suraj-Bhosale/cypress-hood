import common from '../../../support/index.js'
import translationHelpers from '../../shared_block_helpers/translationHelpers'
import infusionAssertions from '../../../fixtures/infusionAssertions.json'
import input from '../../../fixtures/inputs.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers.js'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers.js'
import inf_steps from '../../../utils/HappyPath_steps/CMCP_US_HappyPath/infusion_steps';
import regressionInput from '../../../fixtures/inputsRegression.json'


export default {
  receiveShipment: {

    negCoi: () => {
      //C29101
      inputChecker.nextButtonCheck('be.disabled')
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-manufacturing-site-to-infusion-cmcp-us', `${coi}-APH-01`, 'not.be.visible', 'be.disabled')
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-manufacturing-site-to-infusion-cmcp-us', `${coi}-FP-01`, 'not.be.visible', 'be.disabled')
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-manufacturing-site-to-infusion-cmcp-us', `${coi}-PRC-01`, 'not.be.visible', 'be.disabled')
      })
    },

    posDataOnNext: () => {
      //C29102
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-manufacturing-site-to-infusion-cmcp-us', `${coi}`, 'be.visible', 'not.be.disabled')
      })
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      });
      inputChecker.checkDataSavingWithBackButton('be.enabled');
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
    }
  },

  productReceiptChecklist: {
    previousHappyPathSteps: (scope) => {
      cy.get(`@coi`).then(coi => {
        inf_steps.infusionReceiveShipment('manufacturing-site', '-cmcp-us', coi);
        inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        inf_steps.infusionShipmentReceiptSummary(scope);
        inf_steps.infusionTransferProductToStorage(coi);
      })
    },

    nothingSelectedForInvestigationProductNeg: () => {
      //C29081
      inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
      inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
      inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
      inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    noSelectedForInvestigationProductNeg: () => {
      //C29082
      inputHelpers.clicker('[data-testid="fail-button-investigational_product"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/investigational_product_reason-input"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    reasonFilledForInvestigationProductPOS: () => {
      //C29083
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/investigational_product_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    nothingSelectedForSealInPlaceNeg: () => {
      //C29084
      inputHelpers.clicker('[data-testid="pass-button-investigational_product"]');
      inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    noSelectedForSealInPlaceNeg: () => {
      //C29085
      inputHelpers.clicker('[data-testid="fail-button-seal_in_place"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    reasonFilledForSealInPlacePos: () => {
      //C29086
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    nothingSelectedForTempRangeNeg: () => {
      //C29087
      inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
      inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    noSelectedForTempRangeNeg: () => {
      //C29088
      inputHelpers.clicker('[data-testid="fail-button-temperature_out_of_range"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/temperature_out_of_range_reason-input"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    reasonFilledForTempRangedPos: () => {
      //C29089
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/temperature_out_of_range_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    nothingSelectedForExpecCondtionNeg: () => {
      //C29090
      inputHelpers.clicker('[data-testid="pass-button-temperature_out_of_range"]');
      inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    noSelectedForExpecCondtionNeg: () => {
      //C29091
      inputHelpers.clicker('[data-testid="fail-button-expected_condition"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    reasonFilledForForExpecCondtionPos: () => {
      //C29092
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled');
    },

    nothingSelectedForStorageNeg: () => {
      //C29093
      inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
      inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    noSelectedForStorageNeg: () => {
      //C29094
      inputHelpers.clicker('[data-testid="fail-button-placed_into_storage"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    reasonFilledForStoragePos: () => {
      //C29095
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]', input.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    posSaveAndCloseButtonCheck: (scope) => {
      //C41002
      inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Patients", true)
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
        inf_steps.infusionReceiveShipment('manufacturing-site', '-cmcp-us', coi);
        inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        inf_steps.infusionShipmentReceiptSummary(scope);
        inf_steps.infusionTransferProductToStorage(coi);
        inf_steps.infusionProductReceiptChecklist();
      })
    },

    nextButtonPos: () => {
      //C29103
      inputChecker.checkNextButtonWithAndWithoutSignature('1')
    },
  },

  checkStatusOfInfusionModule: (scope) => {

    cy.openOrder('infusion', 'phil')
    cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
    cy.get(`@coi`).then((coi) => {
      inputHelpers.clickOnHeader('infusion')
      cy.checkStatus(scope.patientInformation.subjectNumber, regressionInput.infusion.statuses.ReciveShipment, 'Patients', 4)
      inf_steps.infusionReceiveShipment('manufacturing-site', '-cmcp-us', coi);

      inputHelpers.clickOnHeader('infusion')
      cy.checkStatus(scope.patientInformation.subjectNumber, regressionInput.infusion.statuses.ShipmentReceiptChecklist, 'Patients', 4)
      inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);

      inputHelpers.clickOnHeader('infusion')
      cy.checkStatus(scope.patientInformation.subjectNumber, regressionInput.infusion.statuses.ShipmentReceiptSummary, 'Patients', 4)
      inf_steps.infusionShipmentReceiptSummary(scope);

      inputHelpers.clickOnHeader('infusion')
      cy.checkStatus(scope.patientInformation.subjectNumber, regressionInput.infusion.statuses.TransferProductToStorage, 'Patients', 4)
      inf_steps.infusionTransferProductToStorage(coi);

      inputHelpers.clickOnHeader('infusion')
      cy.checkStatus(scope.patientInformation.subjectNumber, regressionInput.infusion.statuses.ProductReceiptChecklist, 'Patients', 4)
      inf_steps.infusionProductReceiptChecklist();

      inputHelpers.clickOnHeader('infusion')
      cy.checkStatus(scope.patientInformation.subjectNumber, regressionInput.infusion.statuses.ProductReceiptSummary, 'Patients', 4)
      inf_steps.infusionProductReceiptSummary(scope);
    })
  }
}