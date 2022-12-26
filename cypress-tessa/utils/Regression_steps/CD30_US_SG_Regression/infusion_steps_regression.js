import actionButtonsHelper from '../../../utils/shared_block_helpers/actionButtonHelpers';
import regressionInput from '../../../fixtures/inputsRegression.json';
import signatureHelpers from '../../../utils/shared_block_helpers/signatureHelpers';
import inputHelpers from '../../../utils/shared_block_helpers/inputFieldHelpers';
import inputChecker from '../../../utils/shared_block_helpers/inputFieldCheckHelpers';
import inputs from '../../../fixtures/inputs.json';
import infusionStepsHappyPath from '../../../utils/HappyPath_steps/CD30_US_SG_HappyPath/infusion_steps';

export default {
  infusionAliases: () => {
    cy.server();
    cy.intercept('POST', '/documents').as('postDocuments');
    cy.intercept('POST', '/signatures').as('postSignatures');
    cy.intercept('POST', '/print').as('postPrint');
    cy.intercept('POST', '/procedures').as('postProcedures');
    cy.intercept('PATCH', '/procedure_steps/*').as('patchProcedureSteps');
    cy.intercept('GET', '/procedures/*').as('getProcedures');
  },

  openOrder: () => {
    cy.log('login Phil');
    cy.platformLogin('Phil@vineti.com');
    cy.visit('/infusion');
    cy.wait(2000)
    cy.get(`@coi`).then(coi =>{
      cy.contains(coi).click();
    });
  },

  shipmentReceiptChecklist:{

    emptyAwb: () => {
      inputChecker.nextButtonCheck('be.disabled');
    },

    optionalField: () => {
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/manufacturing_receipt_awb-input"]', "123", "be.disabled");
      inputChecker.clickOnCheck('[data-testid="pass-button-manufacturing_awb_match"]', "be.disabled");
      inputChecker.clickOnCheck('[data-testid="pass-button-shipping_intact"]', "be.disabled");
      inputChecker.clickOnCheck('[data-testid="pass-button-seal_intact"]', "be.enabled");
    },

    retainValue: () => {
      inputChecker.clickOnCheck("[data-testid='primary-button-action']", "be.enabled");
      inputChecker.clickOnCheck('[data-testid="back-nav-link"]', "be.enabled");
      inputChecker.checkToggle('[data-testid="pass-button-manufacturing_awb_match"]');
      inputChecker.checkToggle('[data-testid="pass-button-shipping_intact"]');
      inputChecker.checkToggle('[data-testid="pass-button-seal_intact"]');
      inputChecker.nextButtonCheck('be.enabled');
    },

    changeValue: () => {
      inputChecker.clickOnCheck("[data-testid='primary-button-action']", "be.enabled");
      cy.wait(1500);
      inputChecker.clickOnCheck('[data-testid="back-nav-link"]', "be.enabled");
      inputChecker.clickOnCheck('[data-testid="fail-button-manufacturing_awb_match"]', "be.disabled");
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/manufacturing_awb_not_match_reason-input"]', "Test", "be.enabled");
      inputHelpers.clicker("[data-testid='primary-button-action']");
      inputHelpers.inputSingleField('[data-testid="reason-for-change-textarea"]',"Testing");
      inputHelpers.clicker('[data-testid="reason-for-change-save"]');
    },

    //C21313
    nextButtonDisable: () => {
      inputChecker.nextButtonCheck('be.enabled');
      cy.wait(1500);
      inputChecker.clickOnCheck('[data-testid="back-nav-link"]', "be.enabled");
      inputChecker.clickOnCheck('[data-testid="fail-button-seal_intact"]', "be.disabled");
    }
  },

    shipmentReceiptSummary:{
      previousHappyPathSteps: () => {
        infusionStepsHappyPath.shipmentReceiptChecklist();
      },

      verifyWithoutSignature: () => {
        inputChecker.clickOnCheck("[data-testid='primary-button-action']", 'be.disabled');
        inputChecker.checkState('[name="viewDocumentPrintSummary"]', 'be.disabled');
      },

      verifyWithSignature: () => {
        inputChecker.nextButtonCheck('be.disabled');
        signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
        inputChecker.checkState('[name="viewDocumentPrintSummary"]', 'be.enabled');
        inputChecker.nextButtonCheck('be.enabled');
      }
    },

    finishedProductReceiptChecklist:{
      previousHappyPathSteps: () => {
        infusionStepsHappyPath.shipmentReceiptChecklist();
        infusionStepsHappyPath.shipmentReceiptSummary();
      },

      //C24285, C28152, C28521
      scanAndVerifyOne: () => {
        cy.log('Finished Product Receipt Checklist');
        cy.get(`@coi`).then(coi =>{
          inputHelpers.scanAndVerifyBags('bag-identifier-3', coi+'-FP-03')
        });
        inputHelpers.clicker('[data-testid="pass-button-temp_data_conform"]')
        inputHelpers.clicker('[data-testid="pass-button-fp_condition"]')
        inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/fp_receipt_comment-input"]',
          inputs.infusion.global.addFpComment);
        inputChecker.nextButtonCheck('be.disabled');

        cy.get(`@coi`).then(coi => {
          inputHelpers.inputSingleField('[data-testid=bag-identifier-1-input]',
          coi+'-PRC-01');
        });
        inputHelpers.clicker('[data-testid="bag-identifier-1-button"]')
        actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C24797, C28153, C28522
      scanAndVerifyTwo: () => {
        cy.log('Finished Product Receipt Checklist');
        cy.get(`@coi`).then(coi =>{
          inputHelpers.scanAndVerifyBags('bag-identifier-1', coi+'-FP-01')
        });
        inputHelpers.clicker('[data-testid="pass-button-temp_data_conform"]')
        inputHelpers.clicker('[data-testid="pass-button-fp_condition"]')
        inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/fp_receipt_comment-input"]',
          inputs.infusion.global.addFpComment);
        inputChecker.nextButtonCheck('be.disabled');
        cy.get(`@coi`).then(coi => {
          inputHelpers.inputSingleField('[data-testid=bag-identifier-3-input]',
          coi+'-PRC-01');
        });
        inputHelpers.clicker('[data-testid="bag-identifier-3-button"]')
        actionButtonsHelper.checkActionButtonIsDisabled('primary');
        inputChecker.clearField('[data-testid=bag-identifier-3-input]');
        cy.get(`@coi`).then(coi =>{
          inputHelpers.scanAndVerifyBags('bag-identifier-3', coi+'-FP-03')
        });
      },

      //C24807, C28154, C28523
      temperatureDataWithoutReasonConfirmTogglePositive: () => {
        cy.log('Finished Product Receipt Checklist');
        inputChecker.clickOnCheck('[data-testid="pass-button-temp_data_conform"]','be.disabled');
      },

      //C24808, C28155, C28524
      temperatureDataConfirmToggleWithoutReasonNegative: () => {
        cy.log('Finished Product Receipt Checklist');
        inputHelpers.clicker('[data-testid="fail-button-temp_data_conform"]');
        inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/temp_data_conform_reason-input"]','be.visible');
        inputChecker.nextButtonCheck('be.disabled');
      },

      //C24809, C28156, C28525
      temperatureDataConfirmTogglePositive: () => {
        cy.log('Finished Product Receipt Checklist');
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/temp_data_conform_reason-input"]', regressionInput.infusion.finishedProductReceiptChecklist.positivePleaseProvideRationaleForResponseOne,'not.be.disabled');
      },

      //C24813, C28157, C28526
      fpConditionWithoutReasonTogglePositive: () => {
        cy.log('Finished Product Receipt Checklist');
        inputHelpers.clicker('[data-testid="pass-button-fp_condition"]')
        inputChecker.clickOnCheck('[data-testid="pass-button-temp_data_conform"]','be.disabled');
      },

      //C24814, C28158, C28527
      fpConditionToggleWithoutReasonNegative: () => {
        cy.log('Finished Product Receipt Checklist');
        inputHelpers.clicker('[data-testid="fail-button-fp_condition"]');
        inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/fp_condition_reason-input"]','be.visible');
        inputChecker.nextButtonCheck('be.disabled');
      },

      //C24815, C28159, C28528
      fpConditionTogglePositive: () => {
        cy.log('Finished Product Receipt Checklist');
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/fp_condition_reason-input"]', regressionInput.infusion.finishedProductReceiptChecklist.positivePleaseProvideRationaleForResponseTwo,'not.be.disabled');
      },

      //C25133, C28160, C28529
      additionalCommentBoxPositive: () => {
        cy.log('Finished Product Receipt Checklist');
        inputChecker.nextButtonCheck('not.be.disabled')
      },

      //C24817, C28161, C28530
      backButtonPositive: () => {
        cy.log('Finished Product Receipt Checklist');
        inputHelpers.clicker('[data-testid="fail-button-temp_data_conform"]');
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/temp_data_conform_reason-input"]', regressionInput.infusion.finishedProductReceiptChecklist.positivePleaseProvideRationaleForResponseOne,'not.be.disabled');
        inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/fp_receipt_comment-input"]',
        inputs.infusion.global.addFpComment);
        actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
          apiAliases: ['@patchProcedureSteps', '@getProcedures']
        });
        cy.wait(1500);
        inputChecker.checkDataSavingWithBackButton('not.be.disabled','[data-test-id="infusion_finished_product_receipt_checklist"]');
        inputChecker.checkToggle('[data-testid="fail-button-temp_data_conform"]');
        inputChecker.checkToggle('[data-testid="fail-button-fp_condition"]');
        inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/fp_receipt_comment-input"]', inputs.infusion.global.addFpComment);
        inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/temp_data_conform_reason-input"]', regressionInput.infusion.finishedProductReceiptChecklist.positivePleaseProvideRationaleForResponseOne);
        inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/fp_condition_reason-input"]', regressionInput.infusion.finishedProductReceiptChecklist.positivePleaseProvideRationaleForResponseTwo);
        inputChecker.checkState('[data-testid="bag-identifier-1-check-mark"]','be.visible');
        inputChecker.checkState('[data-testid="bag-identifier-3-check-mark"]','be.visible');
        actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
          apiAliases: ['@patchProcedureSteps', '@getProcedures']
        });
        inputChecker.explicitWait('[data-test-id="infusion_finished_product_receipt_summary"]');
        actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
          apiAliases: ['@patchProcedureSteps', '@getProcedures']
        });
        signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
        cy.wait(1500);
        inputChecker.checkDataSavingWithBackButton('not.be.disabled','[data-test-id="infusion_finished_product_receipt_checklist"]');
        inputHelpers.clicker('[data-testid="pass-button-temp_data_conform"]')
        inputHelpers.clicker('[data-testid="pass-button-fp_condition"]');
        actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        });
        inputChecker.checkState('[data-testid="reason-for-change-textarea"]','be.visible');
      }
    },

    finishedProductReceiptSummary:{
      previousHappyPathSteps: (scope) => {
        infusionStepsHappyPath.shipmentReceiptChecklist();
        infusionStepsHappyPath.shipmentReceiptSummary();
        infusionStepsHappyPath.finishedProductReceiptChecklist(scope);
      },

      // C24343
      verifyOrderAfterSignature: () => {
        cy.wait(2000);
        actionButtonsHelper.checkActionButtonIsEnabled('primary');
        actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
          apiAliases: ['@patchProcedureSteps', '@getProcedures']});
        signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
        actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
          apiAliases: ['@patchProcedureSteps', '@getProcedures']
        });

      }
    },

    sponsorReleaseDocuments:{
      previousHappyPathSteps: (scope) => {
        infusionStepsHappyPath.shipmentReceiptChecklist();
        infusionStepsHappyPath.shipmentReceiptSummary();
        infusionStepsHappyPath.finishedProductReceiptChecklist(scope);
        infusionStepsHappyPath.finishedProductReceiptSummary();
      },
    },

    checkStatusesOfInfusionModule: (scope) => {
      cy.get(`@coi`).then((coi) => {
        inputChecker.explicitWait('[data-test-id="infusion_shipment_receipt_checklist"]');
        inputChecker.clickOnHeader('infusion')
        cy.checkStatus(coi,regressionInput.infusion.statuses.shipmentReceiptChecklist,'infusion',4)
        infusionStepsHappyPath.shipmentReceiptChecklist(scope.treatment);
        inputChecker.explicitWait('[data-test-id="infusion_shipment_receipt_summary"]');

        inputChecker.clickOnHeader('infusion')
        cy.checkStatus(coi,regressionInput.infusion.statuses.shipmentReceiptSummary,'infusion',4)
        infusionStepsHappyPath.shipmentReceiptSummary();
        inputChecker.explicitWait('[data-test-id="infusion_finished_product_receipt_checklist"]');

        inputChecker.clickOnHeader('infusion')
        cy.checkStatus(coi,regressionInput.infusion.statuses.finishedProductReceiptChecklist,'infusion',4)
        infusionStepsHappyPath.finishedProductReceiptChecklist(scope);
        inputChecker.explicitWait('[data-test-id="infusion_finished_product_receipt_summary"]');

        inputChecker.clickOnHeader('infusion')
        cy.checkStatus(coi,regressionInput.infusion.statuses.finishedProductReceiptSummary,'infusion',4)
        infusionStepsHappyPath.finishedProductReceiptSummary();
        inputChecker.explicitWait('[data-test-id="infusion_sponsor_release_documents"]');

        inputChecker.clickOnHeader('infusion')
        cy.checkStatus(coi,regressionInput.infusion.statuses.sponsorReleaseDocuments,'infusion',4)
        infusionStepsHappyPath.sponsorReleaseDocuments();
        infusionStepsHappyPath.shipmentReceiptChecklistLoop(scope.treatment);
        infusionStepsHappyPath.shipmentReceiptSummaryLoop();
        infusionStepsHappyPath.finishedProductReceiptChecklistLoop(scope);
        infusionStepsHappyPath.finishedProductReceiptSummaryLoop();
        infusionStepsHappyPath.sponsorReleaseDocumentsLoop();

       cy.checkStatus(coi,regressionInput.infusion.statuses.completed,'infusion',4)
      })
    }
  }
