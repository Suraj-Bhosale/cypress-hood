import actionButtonsHelper from '../../../utils/shared_block_helpers/actionButtonHelpers';
import regressionInput from '../../../fixtures/inputsRegression.json';
import inputChecker from '../../../utils/shared_block_helpers/inputFieldCheckHelpers';
import inputHelpers from '../../../utils/shared_block_helpers/inputFieldHelpers';
import documentUploadHelper from '../../../utils/shared_block_helpers/documentUploadHelpers';
import signatureHelpers from '../../../utils/shared_block_helpers/signatureHelpers';
import manufacturingAssertions from '../../../fixtures/manufacturingAssertions.json';
import translationHelpers from "../../../utils/shared_block_helpers/translationHelpers";
import inputs from "../../../fixtures/inputs.json";
import dayjs from 'dayjs';
import mfgStepsHappyPath from '../../../utils/HappyPath_steps/CD30_US_HappyPath/manufacturing_steps.js';
import mfgStepsOpenOrder from '../../../utils/Regression_steps/CD30_US_Regression/manufacturing_steps_regression.js';

export default {
  manufacturingAliases: () => {
    cy.server();
    cy.intercept('POST', '/documents').as('postDocuments');
    cy.intercept('POST', '/signatures').as('postSignatures');
    cy.intercept('POST', '/print').as('postPrint');
    cy.intercept('POST', '/procedures').as('postProcedures');
    cy.intercept('PATCH', '/procedure_steps/*').as('patchProcedureSteps');
    cy.intercept('GET', '/procedures/*').as('getProcedures');
  },

  openOrder:(scope) => {
    cy.getCoi(scope.patientInformation)
    cy.log('login Steph');
    cy.platformLogin('steph@vineti.com');
    cy.visit('/manufacturing');
    cy.paginationForCoi();
  },

  lotNumber:{
    //C21663
    emptyData:(scope) =>  {
      cy.log('Lot Number')
      mfgStepsOpenOrder.openOrder(scope);
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C21671
    retainValue:() =>  {
      cy.log('Lot Number')
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.enterAndConfirmCheck('lot_number',regressionInput.manufacturing.assignLotNumber.positiveLotNumber,'be.visible','not.be.disabled')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.explicitWait('[data-test-id="manufacturing_collection_summary"]');
      inputChecker.checkDataSavingWithBackButton('not.be.disabled','[data-test-id="manufacturing_lot_number"]')
      inputChecker.checkState('[data-testid="green-checkmark-lot_number"]','not.be.disabled')
    }
  },

  collectionSummary:{
    previousHappyPathSteps: (scope) => {
      mfgStepsOpenOrder.openOrder(scope);
      mfgStepsHappyPath.assignLotNumber(scope.treatment);
    },
  },

  shipmentReceiptChecklist: {
    previousHappyPathSteps: (scope) => {
      mfgStepsOpenOrder.openOrder(scope);
      mfgStepsHappyPath.assignLotNumber(scope.treatment);
      mfgStepsHappyPath.collectionSummary();
    },
    //C21972
    emptyAwb: (trigger_id) => {
      cy.log('Shipment Receipt Checklist')
      inputChecker.checkState(trigger_id, "be.disabled");
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C21973
    invalidAwb: (awb_id, trigger_id, error_id) => {
      cy.log('Shipment Receipt Checklist')
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.inputSingleFieldCheck(awb_id, "123", "be.disabled");
      inputChecker.clickOnCheck(trigger_id, "be.disabled");
      inputChecker.checkValue(error_id, 'Does not match', 'have.text');
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C21974
    optionalField: (awb_pass_id, container_condition_id, shipping_seal_id) => {
      cy.log('Shipment Receipt Checklist')
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.clickOnCheck(awb_pass_id, "be.disabled");
      inputChecker.clickOnCheck(container_condition_id, "be.disabled");
      inputChecker.clickOnCheck(shipping_seal_id, "be.enabled");
    },
    //C21975
    retainValue: (awb_pass_id, container_condition_id, shipping_seal_id) => {
      cy.log('Shipment Receipt Checklist')
      inputChecker.clickOnCheck("[data-testid='primary-button-action']", "be.enabled");
      inputChecker.explicitWait('[data-test-id="manufacturing_shipment_receipt_summary"]');
      inputChecker.clickOnCheck('[data-testid="back-nav-link"]', "be.enabled");
      inputChecker.checkToggle(awb_pass_id);
      inputChecker.checkToggle(container_condition_id);
      inputChecker.checkToggle(shipping_seal_id);
      inputChecker.nextButtonCheck('be.enabled');
    },
    //C21976
    reasonForChange: (awb_fail_id, awb_reason_id) => {
      cy.log('Shipment Receipt Checklist')
      inputChecker.clickOnCheck("[data-testid='primary-button-action']", "be.enabled");
      inputChecker.explicitWait('[data-test-id="manufacturing_shipment_receipt_summary"]');
      inputChecker.clickOnCheck('[data-testid="back-nav-link"]', "be.enabled");
      inputChecker.clickOnCheck(awb_fail_id, "be.disabled");
      inputChecker.inputSingleFieldCheck(awb_reason_id, "Test", "be.enabled");
      inputHelpers.clicker("[data-testid='primary-button-action']");
      inputHelpers.inputSingleField("[data-testid='reason-for-change-textarea']", "Test");
      inputHelpers.clicker('[data-testid="reason-for-change-save"]');
    },
    //C21977
    nextButtonDisabled: (shipping_seal_id) => {
      cy.log('Shipment Receipt Checklist')
      inputChecker.nextButtonCheck('be.enabled');
      cy.wait(1000);
      inputChecker.clickOnCheck('[data-testid="back-nav-link"]', "be.enabled");
      inputChecker.clickOnCheck(shipping_seal_id, "be.disabled");
    }
  },


  shipmentReceiptSummaryUs:{
    previousHappyPathSteps: (scope) => {
      mfgStepsOpenOrder.openOrder(scope);
      mfgStepsHappyPath.assignLotNumber(scope.treatment);
      mfgStepsHappyPath.collectionSummary();
      mfgStepsHappyPath.shipmentReceiptChecklist();
    },
    //C21787
    viewSummary: () => {
      cy.log('Shipment Receipt Summary')
      inputChecker.nextButtonCheck('not.be.disabled');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.checkState('[name="viewDocumentViewSummary"]','be.disabled');
      inputChecker.checkState("[data-testid='approver-sign-button']",'not.be.disabled');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
      inputChecker.checkState('[name="viewDocumentViewSummary"]','not.be.disabled');
      inputChecker.nextButtonCheck('not.be.disabled');
    },
    editButton: () => {
      cy.log('Shipment Receipt Summary')
      inputHelpers.clicker('[data-testid="edit-shipment_receipt_checklist"]')
      inputHelpers.clicker('[data-testid="fail-button-shipping_seal_intact"]')
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_seal_intact_reason-input"]',regressionInput.manufacturing.shipmentReceiptSummary.positivePleaseProvideRationaleForResponse)
      inputChecker.nextButtonCheck('not.be.disabled');
      inputHelpers.clicker("[data-testid='primary-button-action']")
      inputHelpers.inputSingleField("[data-testid='reason-for-change-textarea']",regressionInput.manufacturing.shipmentReceiptSummary.positiveResonForChange)
      inputHelpers.clicker('[data-testid="reason-for-change-save"]')
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.checkState("[data-testid='approver-sign-button']",'not.be.disabled');
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the seal on the shipper intact?"]',
      manufacturingAssertions.shipmentReceiptSummary.shippingSealIntact);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
          3,'span', 'No',0);
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
      inputChecker.nextButtonCheck('not.be.disabled');
    }
  },

  pbmcReceipt:{
    previousHappyPathSteps: (scope) => {
      mfgStepsOpenOrder.openOrder(scope);
      mfgStepsHappyPath.assignLotNumber(scope.treatment);
      mfgStepsHappyPath.collectionSummary();
      mfgStepsHappyPath.shipmentReceiptChecklist();
      mfgStepsHappyPath.shipmentReceiptSummary();
    },
    invalidBagId: (scope)=> {
      cy.log('Pbmc Receipt')
      inputHelpers.clicker('[data-testid="pass-button-pbmc_bag_condition"]');
      inputHelpers.clicker('[data-testid="pass-button-received_number_of_bags"]');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/pbmc_receipt_comment-input"]',inputs.manufacturing.global.optCommentTwo);
      cy.get(`@coi`).then(coi =>{
        inputChecker.inputCoiWithPlaceholder('[data-testid="bag-identifier-1-input"]',coi,'-APH-01')
      });
      cy.get(`@coi`).then(coi =>{
        inputChecker.inputCoiWithPlaceholder('[data-testid="bag-identifier-3-input"]',coi,'-APH-03')
      });
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },
    responseEmpty: (scope)=> {
      cy.log('Pbmc Receipt')
      inputChecker.clearField('[data-testid="bag-identifier-1-input"]')
      inputChecker.clearField('[data-testid="bag-identifier-3-input"]')
      cy.get(`@coi`).then(coi =>{
        inputChecker.inputCoiWithPlaceholder('[data-testid="bag-identifier-1-input"]',coi,'-PRC-01')
        inputHelpers.clicker('[data-testid="bag-identifier-1-button"]');
      });
      cy.get(`@coi`).then(coi =>{
        inputChecker.inputCoiWithPlaceholder('[data-testid="bag-identifier-3-input"]',coi,'-PRC-03')
        inputHelpers.clicker('[data-testid="bag-identifier-3-button"]');
      });
      inputHelpers.clicker('[data-testid="fail-button-pbmc_bag_condition"]');
      inputHelpers.clicker('[data-testid="fail-button-received_number_of_bags"]');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },
    responseFilled: ()=> {
      cy.log('Pbmc Receipt')
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/pbmc_bag_condition_reason-input"]','test01');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/received_number_of_bags_reason-input"]','test02');
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    }
  },

  pbmcReceiptSummary: {
    previousHappyPathSteps: (scope) => {
      mfgStepsOpenOrder.openOrder(scope);
      mfgStepsHappyPath.assignLotNumber(scope.treatment);
      mfgStepsHappyPath.collectionSummary();
      mfgStepsHappyPath.shipmentReceiptChecklist();
      mfgStepsHappyPath.shipmentReceiptSummary();
      mfgStepsHappyPath.pbmcReceipt(scope);
    },
    //C21761
    viewSummary: () => {
      cy.log('Pbmc Receipt Summary')
      inputChecker.nextButtonCheck('not.be.disabled');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.checkState('[name="viewDocumentViewSummary"]','be.disabled');
      inputChecker.checkState("[data-testid='approver-sign-button']",'not.be.disabled');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
      inputChecker.checkState('[name="viewDocumentViewSummary"]','not.be.disabled');
      inputChecker.nextButtonCheck('not.be.disabled');
    },
    //C21762
    editButton: () => {
      cy.log('Pbmc Receipt Summary')
      inputHelpers.clicker('[data-testid="edit-pbmc_receipt"]')
      inputHelpers.clicker('[data-testid="fail-button-received_number_of_bags"]')
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/received_number_of_bags_reason-input"]',regressionInput.manufacturing.pbmcReceiptSummary.positiveTotalNumberOfBags)
      inputHelpers.clicker("[data-testid='primary-button-action']")
      inputHelpers.inputSingleField("[data-testid='reason-for-change-textarea']",regressionInput.manufacturing.pbmcReceiptSummary.positiveResonForChange)
      inputHelpers.clicker('[data-testid="reason-for-change-save"]')
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.checkState("[data-testid='approver-sign-button']",'not.be.disabled');
      inputHelpers.checkSummaryValue('[data-testid="txt-field-layout-I have received the total number of bags as displayed above."]', 'I have received the total number of bags as displayed above.',
          1, 'span', 'No');
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-I have received the total number of bags as displayed above."]',
      'I have received the total number of bags as displayed above.');
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
          1,'span', 'No',0);
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
      inputChecker.nextButtonCheck('not.be.disabled');
    }
  },

  apheresisProductReceiptUs:{
    previousHappyPathSteps: (scope) => {
      mfgStepsOpenOrder.openOrder(scope);
      mfgStepsHappyPath.assignLotNumber(scope.treatment);
      mfgStepsHappyPath.collectionSummary();
      mfgStepsHappyPath.shipmentReceiptChecklist();
      mfgStepsHappyPath.shipmentReceiptSummary();
    },
    //C34278
    scanAndVerifyPositives: () => {
      cy.log('Apheresis Product Receipt');
      inputHelpers.clicker('[data-testid="pass-button-aphereis_temperature_data"]');
      inputHelpers.clicker('[data-testid="pass-button-aphereis_bag_condition"]');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C34279
    scanAndVerifyNegative: () => {
      cy.log('Apheresis Product Receipt');
      inputHelpers.inputSingleField('[data-testid="coi-input-field"]',
        regressionInput.manufacturing.apheresisProductReceipt.negativeCoi);
      inputHelpers.clicker('[data-testid="coi-action-trigger-button"]')
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C34286
    withoutSelectingTemToggleButtonPositive: () => {
      cy.log('Apheresis Product Receipt');
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck(`coi`, coi,'be.visible','be.disabled');
      });
      inputHelpers.clicker('[data-testid="pass-button-aphereis_bag_condition"]');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C34287
    temtoggleButtonNegative: () => {
      cy.log('Apheresis Product Receipt');
      inputHelpers.clicker('[data-testid="fail-button-aphereis_temperature_data"]');
      inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/aphereis_temperature_data_reason-input"]','be.visible');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C34288
    temtoggleButtonPositive: () => {
      cy.log('Apheresis Product Receipt');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/aphereis_temperature_data_reason-input"]', regressionInput.manufacturing.apheresisProductReceipt.positivePleaseProvideRationaleForResponseOne,'not.be.disabled');
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },

    //C34280
    withoutSelectingBagConditionToggleButtonPositive: () => {
      cy.log('Apheresis Product Receipt');
      cy.reload();
      inputHelpers.clicker('[data-testid="pass-button-aphereis_temperature_data"]');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C34281
    bagConditiontoggleButtonNegative: () => {
      cy.log('Apheresis Product Receipt');
      inputHelpers.clicker('[data-testid="fail-button-aphereis_bag_condition"]');
      inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/aphereis_bag_condition_reason-input"]','be.visible');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C34282
    bagConditiontoggleButtonPositive: () => {
      cy.log('Apheresis Product Receipt');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/aphereis_bag_condition_reason-input"]', regressionInput.manufacturing.apheresisProductReceipt.positivePleaseProvideRationaleForResponseTwo,'not.be.disabled');
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },

    //C34283
    additionalCommentPositive: () => {
      cy.log('Apheresis Product Receipt');
      cy.reload();
      inputHelpers.clicker('[data-testid="pass-button-aphereis_temperature_data"]');
      inputHelpers.clicker('[data-testid="pass-button-aphereis_bag_condition"]');
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },

    //C34284
    saveAndCloseButtonPositive: (coi) => {
      cy.log('Apheresis Product Receipt');
      inputHelpers.clicker('[data-testid="fail-button-aphereis_temperature_data"]');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/aphereis_temperature_data_reason-input"]', regressionInput.manufacturing.apheresisProductReceipt.positivePleaseProvideRationaleForResponseOne,'not.be.disabled');
      inputHelpers.clicker('[data-testid="fail-button-aphereis_bag_condition"]');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/aphereis_bag_condition_reason-input"]', regressionInput.manufacturing.apheresisProductReceipt.positivePleaseProvideRationaleForResponseTwo,'not.be.disabled');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/apheresis_optional_comments-input"]',
      inputs.manufacturing.us.optCommentAph)
      inputChecker.checkDataSavingWithSaveAndClose('','not.be.disabled',coi);
      inputChecker.checkToggle('[data-testid="fail-button-aphereis_temperature_data"]');
      inputChecker.checkToggle('[data-testid="fail-button-aphereis_bag_condition"]');
      inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/aphereis_temperature_data_reason-input"]', regressionInput.manufacturing.apheresisProductReceipt.positivePleaseProvideRationaleForResponseOne);
      inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/aphereis_bag_condition_reason-input"]', regressionInput.manufacturing.apheresisProductReceipt.positivePleaseProvideRationaleForResponseTwo);
      inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/apheresis_optional_comments-input"]', inputs.manufacturing.us.optCommentAph);
      inputChecker.checkState('.big-green-check-mark','be.visible');
    },

    //C34285
    backButtonPositive: () => {
      cy.log('Apheresis Product Receipt');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.explicitWait('[data-test-id="manufacturing_apheresis_product_receipt_summary"]');
      inputChecker.checkDataSavingWithBackButton('not.be.disabled','[data-test-id="manufacturing_apheresis_product_receipt"]');
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
      inputChecker.checkToggle('[data-testid="fail-button-aphereis_temperature_data"]');
      inputChecker.checkToggle('[data-testid="fail-button-aphereis_bag_condition"]');
      inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/aphereis_temperature_data_reason-input"]', regressionInput.manufacturing.apheresisProductReceipt.positivePleaseProvideRationaleForResponseOne);
      inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/aphereis_bag_condition_reason-input"]', regressionInput.manufacturing.apheresisProductReceipt.positivePleaseProvideRationaleForResponseTwo);
      inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/apheresis_optional_comments-input"]', inputs.manufacturing.us.optCommentAph);
      inputChecker.checkState('.big-green-check-mark','be.visible');
    }
  },

  apheresisProductReceiptSummaryUs:{
    previousHappyPathSteps: (scope) => {
      mfgStepsOpenOrder.openOrder(scope);
      mfgStepsHappyPath.assignLotNumber(scope.treatment);
      mfgStepsHappyPath.collectionSummary();
      mfgStepsHappyPath.shipmentReceiptChecklist();
      mfgStepsHappyPath.shipmentReceiptSummary();
      mfgStepsHappyPath.apheresisProductReceiptUs(scope);
    },

    //C34291
    verifyNextButtonWithoutSignaturePositive: () => {
      cy.log('Apheresis Product Receipt Summary');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.checkState("button[name='viewDocumentViewSummary']",'be.disabled');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      cy.reload();
      inputChecker.checkState("button[name='viewDocumentViewSummary']",'not.be.disabled');
    },

    //C34292
    verifyDataWithEditButtonPositive: () => {
      cy.log('Apheresis Product Receipt Summary');
      inputHelpers.clicker("[data-testid='edit-apheresis_product_receipt']")
      inputChecker.explicitWait("[data-testid='fail-button-aphereis_temperature_data']");
      inputHelpers.clicker("[data-testid='fail-button-aphereis_temperature_data']");
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/aphereis_temperature_data_reason-input"]',regressionInput.manufacturing.apheresisProductReceiptSummary.positivePleaseProvideRationaleForResponseTempData);
      inputHelpers.clicker("[data-testid='fail-button-aphereis_bag_condition']");
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/aphereis_bag_condition_reason-input"]',regressionInput.manufacturing.apheresisProductReceiptSummary.positivePleaseProvideRationaleForResponseConditionData);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/apheresis_optional_comments-input"]',regressionInput.manufacturing.apheresisProductReceiptSummary.positiveAdditionalCommentsOne);
      inputChecker.nextButtonCheck('not.be.disabled')
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      });
      inputChecker.explicitWait('[data-testid="reason-for-change-textarea"]');
      inputHelpers.inputSingleField('[data-testid="reason-for-change-textarea"]',regressionInput.manufacturing.apheresisProductReceiptSummary.positiveResonForChange);
      inputHelpers.clicker('[data-testid="reason-for-change-save"]');
      inputChecker.explicitWait("[data-testid='txt-field-layout-Does the temperature data conform to standards?']");
      translationHelpers.assertSingleField("[data-testid='txt-field-layout-Does the temperature data conform to standards?']",
        regressionInput.manufacturing.apheresisProductReceiptSummary.positiveTempDataconfirmToggleLabel);
      translationHelpers.assertSingleField("[data-testid='txt-field-layout-Does the temperature data conform to standards?-answer'] span",
        regressionInput.manufacturing.apheresisProductReceiptSummary.positiveNoData);

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        1,'div', regressionInput.manufacturing.apheresisProductReceiptSummary.positiveRationalResponse,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        1,'span', regressionInput.manufacturing.apheresisProductReceiptSummary.positivePleaseProvideRationaleForResponseTempData,0);

      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the collection bag in expected good condition?"]',
        regressionInput.manufacturing.apheresisProductReceiptSummary.positiveCollectionBagExpectedToggleLabel);
      translationHelpers.assertSingleField("[data-testid='txt-field-layout-Is the collection bag in expected good condition?-answer'] span",
        regressionInput.manufacturing.apheresisProductReceiptSummary.positiveNoData);

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        3,'div', regressionInput.manufacturing.apheresisProductReceiptSummary.positiveRationalResponse,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        3,'span', regressionInput.manufacturing.apheresisProductReceiptSummary.positivePleaseProvideRationaleForResponseConditionData,0);

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        4,'div', regressionInput.manufacturing.apheresisProductReceiptSummary.positiveAdditionalComments,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        4,'span', regressionInput.manufacturing.apheresisProductReceiptSummary.positiveAdditionalCommentsOne,0);

      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      inputHelpers.clicker("[data-testid='edit-apheresis_product_receipt']")
      inputChecker.explicitWait("[data-testid='pass-button-aphereis_temperature_data']");
      inputHelpers.clicker("[data-testid='pass-button-aphereis_temperature_data']");
      inputHelpers.clicker("[data-testid='pass-button-aphereis_bag_condition']");
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/apheresis_optional_comments-input"]',regressionInput.manufacturing.apheresisProductReceiptSummary.positiveAdditionalCommentsTwo);
      inputChecker.nextButtonCheck('not.be.disabled')
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      });
      inputChecker.explicitWait('[data-testid="reason-for-change-textarea"]');
      inputHelpers.inputSingleField('[data-testid="reason-for-change-textarea"]',regressionInput.manufacturing.apheresisProductReceiptSummary.positiveResonForChange);
      inputHelpers.clicker('[data-testid="reason-for-change-save"]');
      inputChecker.explicitWait("[data-testid='txt-field-layout-Does the temperature data conform to standards?']");
      cy.get(`@coi`).then(coi =>{
        translationHelpers.assertSingleField('[data-testid=coi-value]',coi);
      })
      translationHelpers.assertSingleField("[data-testid='txt-field-layout-Does the temperature data conform to standards?']",
        regressionInput.manufacturing.apheresisProductReceiptSummary.positiveTempDataconfirmToggleLabel);
      translationHelpers.assertSingleField("[data-testid='txt-field-layout-Does the temperature data conform to standards?-answer'] span",
        regressionInput.manufacturing.apheresisProductReceiptSummary.positiveYesData);
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the collection bag in expected good condition?"]',
        regressionInput.manufacturing.apheresisProductReceiptSummary.positiveCollectionBagExpectedToggleLabel);
      translationHelpers.assertSingleField("[data-testid='txt-field-layout-Is the collection bag in expected good condition?-answer'] span",
        regressionInput.manufacturing.apheresisProductReceiptSummary.positiveYesData);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        2,'div', regressionInput.manufacturing.apheresisProductReceiptSummary.positiveAdditionalComments,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        2,'span', regressionInput.manufacturing.apheresisProductReceiptSummary.positiveAdditionalCommentsTwo,0);
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    }
  },

  manufacturingStartUs:{
    previousHappyPathSteps: (scope) => {
      mfgStepsOpenOrder.openOrder(scope);
      mfgStepsHappyPath.assignLotNumber(scope.treatment);
      mfgStepsHappyPath.collectionSummary();
      mfgStepsHappyPath.shipmentReceiptChecklist();
      mfgStepsHappyPath.shipmentReceiptSummary();
      mfgStepsHappyPath.apheresisProductReceiptUs(scope);
      mfgStepsHappyPath.apheresisProductReceiptSummary();
    },
    //C28068
    nextButtonNegative: (pastDate,currentDate,futureDate) => {
      cy.log('Manufacturing Start');
      inputHelpers.clicker('[id="#/properties/is_confirmed"]');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
      inputChecker.inputDateFieldCheck('input[id="#/properties/date-input"]',pastDate,'not.be.disabled');
      inputChecker.inputDateFieldCheck('input[id="#/properties/date-input"]',currentDate,'not.be.disabled');
      inputChecker.inputDateFieldCheck('input[id="#/properties/date-input"]',futureDate,'be.disabled');
    },
    //C28069
    checkBoxNegative: (pastDate) => {
      cy.log('Manufacturing Start');
      cy.reload();
      inputChecker.explicitWait('input[id="#/properties/date-input"]');
      inputChecker.inputDateFieldCheck('input[id="#/properties/date-input"]',pastDate,'be.disabled');
    },
    //C28070
    saveAndCloseButtonPositive: (pastDate) => {
      cy.log('Manufacturing Start');
      inputHelpers.clicker('[id="#/properties/is_confirmed"]');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.nextButtonCheck('not.be.disabled');//[BUG] Next button should be disabled
      inputChecker.checkDataSavingWithSaveAndClose('','be.disabled','');
      inputChecker.checkValue('input[id="#/properties/date-input"]', pastDate);
    },
    //C28071
    verifyNextButtonWithoutSignaturePositive: () => {
      cy.log('Manufacturing Start');
      inputChecker.nextButtonCheck('be.disabled');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    },
    //C28072
    backButtonPositive: (pastDate,currentDate) => {
      cy.log('Manufacturing Start');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.explicitWait('[data-test-id="manufacturing_harvesting"]');
      inputChecker.checkDataSavingWithBackButton('not.be.disabled','[data-test-id="manufacturing_manufacturing_start"]');
      inputChecker.checkValue('input[id="#/properties/date-input"]', pastDate);
      inputChecker.inputDateFieldCheck('input[id="#/properties/date-input"]',currentDate,'not.be.disabled');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      });
      inputChecker.explicitWait('[data-testid="reason-for-change-textarea"]');
      inputChecker.checkState('[data-testid="reason-for-change-textarea"]','be.visible');
      inputHelpers.inputSingleField('[data-testid="reason-for-change-textarea"]',regressionInput.manufacturing.manufacturingStart.positiveResonForChange);
      inputHelpers.clicker('[data-testid="reason-for-change-save"]');
      inputChecker.explicitWait('input[id="#/properties/custom_fields/properties/harvest_start_date-input"]');
      inputChecker.explicitWait('[data-test-id="manufacturing_harvesting"]');
      inputChecker.checkDataSavingWithBackButton('be.disabled', '[data-test-id="manufacturing_manufacturing_start"]');
      inputChecker.checkState('button[data-testid="approver-sign-button"]','be.visible');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      inputChecker.checkValue('input[id="#/properties/date-input"]', currentDate);
    }
  },

  harvestingUs:{
    previousHappyPathSteps: (scope) => {
      mfgStepsOpenOrder.openOrder(scope);
      mfgStepsHappyPath.assignLotNumber(scope.treatment);
      mfgStepsHappyPath.collectionSummary();
      mfgStepsHappyPath.shipmentReceiptChecklist();
      mfgStepsHappyPath.shipmentReceiptSummary();
      mfgStepsHappyPath.apheresisProductReceiptUs(scope);
      mfgStepsHappyPath.apheresisProductReceiptSummary();
      mfgStepsHappyPath.manufacturingStart();
    },
    //C33050
    negativeTotalVolume: (futureDate) => {
      cy.log('Harvesting ');
      inputHelpers.dropDownSelect('select[id="#/properties/custom_fields/properties/harvesting_contents"]', 0,
        inputs.manufacturing.us.optionTwoCarPositiveViableTCells)
      inputHelpers.inputDateField('input[id="#/properties/custom_fields/properties/harvest_start_date-input"]',
        inputs.manufacturing.global.harvestStartDate)
      inputHelpers.inputDateField('input[id="#/properties/custom_fields/properties/harvest_end_date-input"]',futureDate)
      inputChecker.explicitWait("[data-testid='primary-button-action']");
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C33051
    negativeContents: (futureDate) => {
      cy.log('Harvesting 1');
      inputChecker.explicitWait("[data-testid='back-nav-link']");
      inputHelpers.clicker('[data-testid="back-nav-link"]')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputHelpers.dropDownSelect('select[id="#/properties/custom_fields/properties/harvesting_total_volume"]', 0,
        inputs.manufacturing.us.optionOnePerBag)
      inputHelpers.inputDateField('input[id="#/properties/custom_fields/properties/harvest_start_date-input"]',
        inputs.manufacturing.global.harvestStartDate)
      inputHelpers.inputDateField('input[id="#/properties/custom_fields/properties/harvest_end_date-input"]',futureDate)
      inputChecker.explicitWait("[data-testid='primary-button-action']");
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C28135
    verifyManufacturedOnNegative: (futureDate) => {
      cy.log('Harvesting 2');
      inputChecker.explicitWait("[data-testid='back-nav-link']");
      inputHelpers.clicker('[data-testid="back-nav-link"]')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.dropDownSelect('select[id="#/properties/custom_fields/properties/harvesting_contents"]', 0,
        inputs.manufacturing.us.optionTwoCarPositiveViableTCells)
      inputHelpers.dropDownSelect('select[id="#/properties/custom_fields/properties/harvesting_total_volume"]', 0,
        inputs.manufacturing.us.optionOnePerBag)
      inputHelpers.inputSingleField('input[id="#/properties/custom_fields/properties/harvest_end_date-input"]',futureDate);
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C28136
    verifyExpirationDateNegative: (pastDate) => {
      cy.log('Harvesting 3');
      inputChecker.explicitWait("[data-testid='back-nav-link']");
      inputHelpers.clicker('[data-testid="back-nav-link"]')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.dropDownSelect('select[id="#/properties/custom_fields/properties/harvesting_contents"]', 0,
        inputs.manufacturing.us.optionTwoCarPositiveViableTCells)
      inputHelpers.dropDownSelect('select[id="#/properties/custom_fields/properties/harvesting_total_volume"]', 0,
        inputs.manufacturing.us.optionOnePerBag)
      inputHelpers.inputSingleField('input[id="#/properties/custom_fields/properties/harvest_start_date-input"]',pastDate);
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.inputSingleField('input[id="#/properties/custom_fields/properties/harvest_end_date-input"]',pastDate);
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C28137
    saveAndCloseButtonPositive: (currentDate,coi) => {
      cy.log('Harvesting 4');
      inputHelpers.inputSingleField('input[id="#/properties/custom_fields/properties/harvest_end_date-input"]',currentDate);
      inputChecker.checkDataSavingWithSaveAndClose('','not.be.disabled',coi);
      inputChecker.nextButtonCheck('not.be.disabled');
    },
    //C28138
    backButtonPositive: () => {
      cy.log('Harvesting 5');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.explicitWait('[data-test-id="manufacturing_print_fp_bag_labels"]');
      inputHelpers.clicker('[data-testid="back-nav-link"]')
      inputChecker.explicitWait('[data-test-id="manufacturing_harvesting"]');
      inputChecker.nextButtonCheck('not.be.disabled');
    }
  },

  printFpBagLabelsUs:{
    previousHappyPathSteps: (scope) => {
      const futureDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      const pastDate = dayjs().subtract(1, 'day').format('DD-MMM-YYYY');
      const currentDate = dayjs().format('DD-MMM-YYYY');

      mfgStepsOpenOrder.openOrder(scope);
      mfgStepsHappyPath.assignLotNumber(scope.treatment);
      mfgStepsHappyPath.collectionSummary();
      mfgStepsHappyPath.shipmentReceiptChecklist();
      mfgStepsHappyPath.shipmentReceiptSummary();
      mfgStepsHappyPath.apheresisProductReceiptUs(scope);
      mfgStepsHappyPath.apheresisProductReceiptSummary();
      mfgStepsHappyPath.manufacturingStart();
      mfgStepsHappyPath.harvestingUs(pastDate, futureDate);
    },
    //C28088
    verifyNextButtonNegative: () => {
      cy.log('Print finished Bag Label');
      inputChecker.clickOnCheck('[data-testid="btn-print"]','be.disabled');
    },
    //C28089
    saveAndCloseButtonPositive: () => {
      cy.log('Print finished Bag Label');
      inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.nextButtonCheck('not.be.disabled');//[BUG] Next button should be disabled
      inputChecker.checkDataSavingWithSaveAndClose('','be.disabled','');
    },
    //C28090
    verifyNextButtonWithoutSignaturePositive: () => {
      cy.log('Print finished Bag Label');
      inputChecker.nextButtonCheck('be.disabled');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    },
    //C28091
    backButtonPositive: () => {
      cy.log('Print finished Bag Label');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.explicitWait('[data-test-id="manufacturing_confirm_number_of_bags"]');
      inputChecker.checkDataSavingWithBackButton('not.be.disabled','[data-test-id="manufacturing_print_fp_bag_labels"]');
      inputHelpers.clicker('[data-testid="btn-print"]');
      inputChecker.explicitWait('strong[data-testid="banner-title-0"]');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      });
      inputChecker.explicitWait('[data-testid="reason-for-change-textarea"]');
      inputChecker.checkState('[data-testid="reason-for-change-textarea"]','be.visible');
      inputHelpers.inputSingleField('[data-testid="reason-for-change-textarea"]',regressionInput.manufacturing.printFpBagLabels.positiveResonForChange);
      inputHelpers.clicker('[data-testid="reason-for-change-save"]');
      inputChecker.explicitWait('[id="#/properties/item_count-input"]');
      inputChecker.explicitWait('[data-test-id="manufacturing_confirm_number_of_bags"]');
      inputChecker.checkDataSavingWithBackButton('not.be.disabled','[data-test-id="manufacturing_print_fp_bag_labels"]');//[BUG] Next button should be disabled
    }
  },

  confirmNumberOfBagsUs:{
    previousHappyPathSteps: (scope) => {
      const futureDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      const pastDate = dayjs().subtract(1, 'day').format('DD-MMM-YYYY');
      const currentDate = dayjs().format('DD-MMM-YYYY');

      mfgStepsOpenOrder.openOrder(scope);
      mfgStepsHappyPath.assignLotNumber(scope.treatment);
      mfgStepsHappyPath.collectionSummary();
      mfgStepsHappyPath.shipmentReceiptChecklist();
      mfgStepsHappyPath.shipmentReceiptSummary();
      mfgStepsHappyPath.apheresisProductReceiptUs(scope);
      mfgStepsHappyPath.apheresisProductReceiptSummary();
      mfgStepsHappyPath.manufacturingStart();
      mfgStepsHappyPath.harvestingUs(pastDate, futureDate);
      mfgStepsHappyPath.printFpBagLabels();
    },
    //C28148
    emptyData: () => {
      cy.log('Confirm Number Of Bags ');
      inputHelpers.clicker('[id="#/properties/data/properties/consent_received"]')
      inputChecker.nextButtonCheck('be.disabled');
    },
     //C28149
    invalidData: () =>{
      cy.log('Confirm Number Of Bags ');
      inputHelpers.inputSingleField('[id="#/properties/item_count-input"]',regressionInput.manufacturing.confirmNumberOfBags.negativeInvalidBagsCount);
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.inputSingleField('[id="#/properties/item_count-input"]',regressionInput.manufacturing.confirmNumberOfBags.negativeInvalidBagsCount1)
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C28150
    saveAndClose: (coi) => {
      cy.log('Confirm Number Of Bags ');
      inputHelpers.inputSingleField('[id="#/properties/item_count-input"]',regressionInput.manufacturing.confirmNumberOfBags.positiveNumberOfBags);
      inputChecker.nextButtonCheck('not.be.disabled');
      inputChecker.checkDataSavingWithSaveAndClose('','not.be.disabled',coi);
      inputChecker.nextButtonCheck('not.be.disabled');
    },
    //C28147
    retainValue: () => {
      cy.log('Confirm Number Of Bags ');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.explicitWait('[data-test-id="manufacturing_manufacturing_summary"]');
      inputChecker.checkDataSavingWithBackButton('not.be.disabled','[data-test-id="manufacturing_confirm_number_of_bags"]')
    }
  },

  manufacturingSummaryUs:{
    previousHappyPathSteps: (scope) => {
      const futureDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      const pastDate = dayjs().subtract(1, 'day').format('DD-MMM-YYYY');
      const currentDate = dayjs().format('DD-MMM-YYYY');
      mfgStepsOpenOrder.openOrder(scope);
      mfgStepsHappyPath.assignLotNumber(scope.treatment);
      mfgStepsHappyPath.collectionSummary();
      mfgStepsHappyPath.shipmentReceiptChecklist();
      mfgStepsHappyPath.shipmentReceiptSummary();
      mfgStepsHappyPath.apheresisProductReceiptUs(scope);
      mfgStepsHappyPath.apheresisProductReceiptSummary();
      mfgStepsHappyPath.manufacturingStart();
      mfgStepsHappyPath.harvestingUs(pastDate, futureDate);
      mfgStepsHappyPath.printFpBagLabels();
      mfgStepsHappyPath.confirmNumberOfBags();
    },
    //C28098
    viewSummary: () => {
      cy.log('Manufacturing Summary');
      inputChecker.nextButtonCheck('not.be.disabled');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.checkState('[name="viewDocumentViewSummary"]','be.disabled');
      inputChecker.checkState("[data-testid='approver-sign-button']",'not.be.disabled');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
      cy.reload();
      inputChecker.checkState('[name="viewDocumentViewSummary"]','not.be.disabled');
      inputChecker.nextButtonCheck('not.be.disabled');
    },
    //C28099
    editButton1: () => {
      cy.log('Manufacturing Summary');
      inputHelpers.clicker('[data-testid="edit-manufacturing_start"]')
      inputChecker.nextButtonCheck('not.be.disabled');
      inputHelpers.inputSingleField('input[id="#/properties/date-input"]',regressionInput.manufacturing.manufacturingSummary.positiveManufacturingStartDate);
      //inputChecker.checkState("[data-testid='approver-sign-button']",'not.be.disabled'); Bug
      //inputChecker.nextButtonCheck('be.disabled'); 
      //signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      inputChecker.nextButtonCheck('not.be.disabled');
        actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      });
      inputChecker.explicitWait('[data-testid="reason-for-change-textarea"]');
      inputHelpers.inputSingleField('[data-testid="reason-for-change-textarea"]',regressionInput.manufacturing.manufacturingSummary.positiveReasonForChange);
      inputChecker.clickOnCheck('[data-testid="reason-for-change-save"]',"be.disabled")
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      2,'div','Manufacturing Start Date',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      2,'span', '02-Jun-2021',0);
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.checkState("[data-testid='approver-sign-button']",'be.enabled');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
      inputChecker.nextButtonCheck('not.be.disabled');
    },
    //C22100
    editButton2: () => {
      cy.log('Manufacturing Summary');
      inputHelpers.clicker('[data-testid="edit-harvesting"]')
      inputHelpers.inputSingleField('input[id="#/properties/custom_fields/properties/harvest_start_date-input"]',regressionInput.manufacturing.manufacturingSummary.positiveManufacturedOn);
      inputChecker.nextButtonCheck('not.be.disabled');
        actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      });
      inputChecker.explicitWait('[data-testid="reason-for-change-textarea"]');
      inputHelpers.inputSingleField('[data-testid="reason-for-change-textarea"]',regressionInput.manufacturing.manufacturingSummary.positiveReasonForChange);
      inputChecker.clickOnCheck('[data-testid="reason-for-change-save"]',"be.disabled")
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      4,'div','Total Volume',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      4,'span', '10-30 mL per bag',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      5,'div','Contents',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      5,'span', '3E8 to 7E8 CAR-positive viable T cells',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      6,'div','Manufactured on',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      6,'span', '22-Mar-2019',0);
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.checkState("[data-testid='approver-sign-button']",'be.enabled');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
      inputChecker.nextButtonCheck('not.be.disabled');
    },
    //C28101
    editButton3: () => {
      cy.log('Manufacturing Summary');
      inputHelpers.clicker('[data-testid="edit-print_fp_bag_labels"]')
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_print_fp_bag_labels"]','h1',
      manufacturingAssertions.printFpBagLabels.title)
      inputChecker.nextButtonCheck('not.be.disabled');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      });
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Confirm that the expected bag labels printed correctly and are legible."]', 'Confirm that the expected bag labels printed correctly and are legible.')
      inputChecker.nextButtonCheck('not.be.disabled');
    },
    //C22102
    editButton4: () => {
      cy.log('Manufacturing Summary');
      inputChecker.clickOnCheck('[data-testid="edit-confirm_number_of_bags"]','not.be.disabled')
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_confirm_number_of_bags"]','h1',
      manufacturingAssertions.confirmNumberOfBags.title)
      inputChecker.nextButtonCheck('not.be.disabled');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      });
      inputChecker.nextButtonCheck('not.be.disabled');
    }
  },

  qaRelease:{
    previousHappyPathSteps: (scope) => {
      const futureDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      const pastDate = dayjs().subtract(1, 'day').format('DD-MMM-YYYY');
      const currentDate = dayjs().format('DD-MMM-YYYY');
      mfgStepsOpenOrder.openOrder(scope);
      mfgStepsHappyPath.assignLotNumber(scope.treatment);
      mfgStepsHappyPath.collectionSummary();
      mfgStepsHappyPath.shipmentReceiptChecklist();
      mfgStepsHappyPath.shipmentReceiptSummary();
      mfgStepsHappyPath.apheresisProductReceiptUs(scope);
      mfgStepsHappyPath.apheresisProductReceiptSummary();
      mfgStepsHappyPath.manufacturingStart();
      mfgStepsHappyPath.harvestingUs(pastDate, futureDate);
      mfgStepsHappyPath.printFpBagLabels();
      mfgStepsHappyPath.confirmNumberOfBags();
      mfgStepsHappyPath.manufacturingSummaryUs();
    },
    //C28073
    verifyNextButtonNegative: () => {
      cy.log('QA Release');
      inputChecker.nextButtonCheck('be.disabled')
    },
    //C28074
    saveAndCloseButtonPositive: () => {
      cy.log('QA Release');
      documentUploadHelper.multipleDocumentsUpload(['validpdf.pdf'], {
        encoding: 'base64',
        selector: '.btn-file-input input',
        type: 'application/pdf',
        inputType: 'input',
      });
      inputChecker.checkDataSavingWithSaveAndClose('','not.be.disabled','');
      inputChecker.checkState("button[name='final_qa_release_certificate']",'not.be.disabled');
    },
    //C28076
    verifyNextButtonWithoutSignaturePositive: () => {
      cy.log('QA Release');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.nextButtonCheck('be.disabled');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    },
    //C28077
    backButtonPositive: () => {
      cy.log('QA Release');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.explicitWait('[data-test-id="manufacturing_sponser_release"]');
      inputChecker.checkDataSavingWithBackButton('not.be.disabled','[data-test-id="manufacturing_qa_release"]');
    }
  },

  sponserReleaseUs:{
    previousHappyPathSteps: (scope) => {
      const futureDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      const pastDate = dayjs().subtract(1, 'day').format('DD-MMM-YYYY');
      const currentDate = dayjs().format('DD-MMM-YYYY');
      mfgStepsOpenOrder.openOrder(scope);
      mfgStepsHappyPath.assignLotNumber(scope.treatment);
      mfgStepsHappyPath.collectionSummary();
      mfgStepsHappyPath.shipmentReceiptChecklist();
      mfgStepsHappyPath.shipmentReceiptSummary();
      mfgStepsHappyPath.apheresisProductReceiptUs(scope);
      mfgStepsHappyPath.apheresisProductReceiptSummary();
      mfgStepsHappyPath.manufacturingStart();
      mfgStepsHappyPath.harvestingUs(pastDate, futureDate);
      mfgStepsHappyPath.printFpBagLabels();
      mfgStepsHappyPath.confirmNumberOfBags();
      mfgStepsHappyPath.manufacturingSummaryUs();
      mfgStepsHappyPath.qaRelease();
    },
    //C28082
    verifyViewDocumentButtonPositive: () => {
      cy.log('Sponsor Release');
      inputChecker.checkState("button[name='final_qa_release_certificate']",'not.be.disabled');
    },
    //C28083
    verifyNextButtonNegative: () => {
      cy.log('Sponsor Release');
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C28084
    saveAndCloseButtonPositive: () => {
      cy.log('Sponsor Release');
      cy.wait(2000);
      documentUploadHelper.multipleDocumentsUpload(['validpdf.pdf'], {
        encoding: 'base64',
        selector: '.btn-file-input input',
        type: 'application/pdf',
        inputType: 'input',
      });
      inputChecker.checkDataSavingWithSaveAndClose('','not.be.disabled','');
      inputChecker.checkState("button[name='final_qa_release_certificate']",'not.be.disabled');
    },
    //C28085
    verifyNextButtonWithoutSignaturePositive: () => {
      cy.log('Sponsor Release');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.nextButtonCheck('be.disabled');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    },
    //C28086
    backButtonPositive: () => {
      cy.log('Sponsor Release');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.explicitWait('[data-test-id="manufacturing_sponser_release_summary"]');
      inputChecker.checkDataSavingWithBackButton('not.be.disabled','[data-test-id="manufacturing_sponser_release"]');
    }
  },

  sponserReleaseSummary:{
    previousHappyPathSteps: (scope) => {
      const futureDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      const pastDate = dayjs().subtract(1, 'day').format('DD-MMM-YYYY');
      const currentDate = dayjs().format('DD-MMM-YYYY');
      mfgStepsOpenOrder.openOrder(scope);
      mfgStepsHappyPath.assignLotNumber(scope.treatment);
      mfgStepsHappyPath.collectionSummary();
      mfgStepsHappyPath.shipmentReceiptChecklist();
      mfgStepsHappyPath.shipmentReceiptSummary();
      mfgStepsHappyPath.apheresisProductReceiptUs(scope);
      mfgStepsHappyPath.apheresisProductReceiptSummary();
      mfgStepsHappyPath.manufacturingStart();
      mfgStepsHappyPath.harvestingUs(pastDate, futureDate);
      mfgStepsHappyPath.printFpBagLabels();
      mfgStepsHappyPath.confirmNumberOfBags();
      mfgStepsHappyPath.manufacturingSummaryUs();
      mfgStepsHappyPath.qaRelease();
      mfgStepsHappyPath.sponserReleaseUs();
    },
  },

  selectBagsToBeShippedUs:{
    previousHappyPathSteps: (scope) => {
      const futureDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      const pastDate = dayjs().subtract(1, 'day').format('DD-MMM-YYYY');
      const currentDate = dayjs().format('DD-MMM-YYYY');
      mfgStepsOpenOrder.openOrder(scope);
      mfgStepsHappyPath.assignLotNumber(scope.treatment);
      mfgStepsHappyPath.collectionSummary();
      mfgStepsHappyPath.shipmentReceiptChecklist();
      mfgStepsHappyPath.shipmentReceiptSummary();
      mfgStepsHappyPath.apheresisProductReceiptUs(scope);
      mfgStepsHappyPath.apheresisProductReceiptSummary();
      mfgStepsHappyPath.manufacturingStart();
      mfgStepsHappyPath.harvestingUs(pastDate, futureDate);
      mfgStepsHappyPath.printFpBagLabels();
      mfgStepsHappyPath.confirmNumberOfBags();
      mfgStepsHappyPath.manufacturingSummaryUs();
      mfgStepsHappyPath.qaRelease();
      mfgStepsHappyPath.sponserReleaseUs();
      mfgStepsHappyPath.sponserReleaseSummary();
    },
    // C22114
    defaultValue: ()  =>  {
      cy.log('Select Bags To Be Shipped ');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },
    // C22115
    allBagsNegative: () => {
      cy.log('Select Bags To Be Shipped ');
      inputHelpers.clicker('[data-testid="fail-button-0"]');
      inputHelpers.clicker('[data-testid="fail-button-1"]');
      inputHelpers.clicker('[data-testid="fail-button-2"]');
      inputHelpers.clicker('[data-testid="fail-button-3"]');
      cy.get("[data-testid='primary-button-action']").should('be.disabled');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },
    // C22116
    singleBagPositive: () => {
      cy.log('Select Bags To Be Shipped ');
      inputHelpers.clicker('[data-testid="pass-button-0"]');
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },
    // C22117
    nextAndBack: () => {
      cy.log('Select Bags To Be Shipped ');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.explicitWait('[data-test-id="manufacturing_shipping_checklist"]');
      inputHelpers.clicker("[data-testid='back-nav-link']");
    }
  },

  selectBagsToBeShippedGeneral:{
    previousHappyPathSteps: (scope) => {
      const futureDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      const pastDate = dayjs().subtract(1, 'day').format('DD-MMM-YYYY');
      const currentDate = dayjs().format('DD-MMM-YYYY');
      mfgStepsOpenOrder.openOrder(scope);
      mfgStepsHappyPath.assignLotNumber(scope.treatment);
      mfgStepsHappyPath.collectionSummary();
      mfgStepsHappyPath.shipmentReceiptChecklist();
      mfgStepsHappyPath.shipmentReceiptSummary();
      mfgStepsHappyPath.apheresisProductReceiptUs(scope);
      mfgStepsHappyPath.apheresisProductReceiptSummary();
      mfgStepsHappyPath.manufacturingStart();
      mfgStepsHappyPath.harvestingUs(pastDate, futureDate);
      mfgStepsHappyPath.printFpBagLabels();
      mfgStepsHappyPath.confirmNumberOfBagsGeneral();
      mfgStepsHappyPath.manufacturingSummaryUs();
      mfgStepsHappyPath.qaRelease();
      mfgStepsHappyPath.sponserReleaseUs();
      mfgStepsHappyPath.sponserReleaseSummary();
    },

    //C36665
    positiveFlowWithThreeBagsShipped: () => {
      cy.log('Select Bags To Be Shipped ');
      inputHelpers.clicker('[data-testid="pass-button-0"]');
      inputHelpers.clicker('[data-testid="pass-button-1"]');
      inputHelpers.clicker('[data-testid="pass-button-2"]');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      cy.get(`@coi`).then(coi =>{
        inputHelpers.scanAndVerifyBags('bag-identifier-1', coi+'-FP-01')
      });
      cy.get(`@coi`).then(coi =>{
        inputHelpers.scanAndVerifyBags('bag-identifier-2', coi+'-FP-02')
      });
      cy.get(`@coi`).then(coi =>{
        inputHelpers.scanAndVerifyBags('bag-identifier-3', coi+'-FP-03')
      });
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/manufacturing_awb-input"]',
        inputs.manufacturing.us.manufacturingAwb)
      inputHelpers.clicker('[data-testid="pass-button-attach_shipping_labels_to_shipper"]')
      inputHelpers.clicker('[data-testid="pass-button-load_fp_into_shipper"]')
      inputHelpers.clicker('[data-testid="pass-button-summary_documents_in_shipper"]')
      inputHelpers.clicker('[data-testid="pass-button-manufacturing_shipper_sealed"]')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']});
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    },

    // C36670	
    threeIterations: (scope) => {
      cy.log('Select Bags To Be Shipped ');
      inputHelpers.clicker('[data-testid="pass-button-0"]');
      inputHelpers.clicker('[data-testid="fail-button-1"]');
      inputHelpers.clicker('[data-testid="fail-button-2"]');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      cy.get(`@coi`).then(coi =>{
        inputHelpers.scanAndVerifyBags('bag-identifier-1', coi+'-FP-01')
      });
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/manufacturing_awb-input"]',
        inputs.manufacturing.us.manufacturingAwb)
      inputHelpers.clicker('[data-testid="pass-button-attach_shipping_labels_to_shipper"]')
      inputHelpers.clicker('[data-testid="pass-button-load_fp_into_shipper"]')
      inputHelpers.clicker('[data-testid="pass-button-summary_documents_in_shipper"]')
      inputHelpers.clicker('[data-testid="pass-button-manufacturing_shipper_sealed"]')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']});
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      
    // second iteration
      inputHelpers.clicker('[data-testid="pass-button-0"]');
      inputHelpers.clicker('[data-testid="fail-button-1"]');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      cy.get(`@coi`).then(coi =>{
        inputHelpers.scanAndVerifyBags('bag-identifier-2', coi+'-FP-02')
      });
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/manufacturing_awb-input"]',
        inputs.manufacturing.us.manufacturingAwb)
      inputHelpers.clicker('[data-testid="pass-button-attach_shipping_labels_to_shipper"]')
      inputHelpers.clicker('[data-testid="pass-button-load_fp_into_shipper"]')
      inputHelpers.clicker('[data-testid="pass-button-summary_documents_in_shipper"]')
      inputHelpers.clicker('[data-testid="pass-button-manufacturing_shipper_sealed"]')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']});
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      
      // third iteration
      inputHelpers.clicker('[data-testid="pass-button-0"]');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      cy.get(`@coi`).then(coi =>{
        inputHelpers.scanAndVerifyBags('bag-identifier-3', coi+'-FP-03')
      });
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/manufacturing_awb-input"]',
        inputs.manufacturing.us.manufacturingAwb)
      inputHelpers.clicker('[data-testid="pass-button-attach_shipping_labels_to_shipper"]')
      inputHelpers.clicker('[data-testid="pass-button-load_fp_into_shipper"]')
      inputHelpers.clicker('[data-testid="pass-button-summary_documents_in_shipper"]')
      inputHelpers.clicker('[data-testid="pass-button-manufacturing_shipper_sealed"]')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']});
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    },
   
  },


  shippingChecklistUs : {
    shippingChecklistHappyPath: (scope) => {
      mfgStepsHappyPath.shippingChecklist(scope);
    },
    previousHappyPathSteps: (scope) => {
      const futureDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      const pastDate = dayjs().subtract(1, 'day').format('DD-MMM-YYYY');
      const currentDate = dayjs().format('DD-MMM-YYYY');
      mfgStepsOpenOrder.openOrder(scope);
      mfgStepsHappyPath.assignLotNumber(scope.treatment);
      mfgStepsHappyPath.collectionSummary();
      mfgStepsHappyPath.shipmentReceiptChecklist();
      mfgStepsHappyPath.shipmentReceiptSummary();
      mfgStepsHappyPath.apheresisProductReceiptUs(scope);
      mfgStepsHappyPath.apheresisProductReceiptSummary();
      mfgStepsHappyPath.manufacturingStart();
      mfgStepsHappyPath.harvestingUs(pastDate, futureDate);
      mfgStepsHappyPath.printFpBagLabels();
      mfgStepsHappyPath.confirmNumberOfBags();
      mfgStepsHappyPath.manufacturingSummaryUs();
      mfgStepsHappyPath.qaRelease();
      mfgStepsHappyPath.sponserReleaseUs();
      mfgStepsHappyPath.sponserReleaseSummary();
      mfgStepsHappyPath.selectBagsToBeShipped();
    },
    //C28141
    incorrectBagID: () =>{
      cy.log('Shipping Checklist');
      //wrong
      cy.get(`@coi`).then(coi =>{
        inputChecker.inputCoiWithPlaceholder('[data-testid="bag-identifier-1-input"]',coi , '-APH-01')
        inputHelpers.clicker('[data-testid="bag-identifier-1-button"]');
      });
      cy.get(`@coi`).then(coi =>{
        inputChecker.inputCoiWithPlaceholder('[data-testid="bag-identifier-3-input"]',coi , '-PRC-01')
        inputHelpers.clicker('[data-testid="bag-identifier-3-button"]');
      });
      //all toggle selected as Yes
      inputHelpers.clicker('[data-testid="pass-button-attach_shipping_labels_to_shipper"]');
      inputHelpers.clicker('[data-testid="pass-button-load_fp_into_shipper"]');
      inputHelpers.clicker('[data-testid="pass-button-summary_documents_in_shipper"]');
      inputHelpers.clicker('[data-testid="pass-button-manufacturing_shipper_sealed"]');
      //airwaybill
      inputChecker.inputStringValue('[data-testid="#/properties/shipping_checklist/properties/manufacturing_awb-input"]', inputs.manufacturing.usEu.manufacturingAwb)
      inputChecker.checkState("[data-testid='primary-button-action']", 'be.disabled')
    },
    //C28142
    correctBagID: () =>{
      cy.log('Shipping Checklist');
      inputChecker.clearField('[data-testid="bag-identifier-1-input"]');
      inputChecker.clearField('[data-testid="bag-identifier-3-input"]');
      cy.get(`@coi`).then(coi =>{
        inputChecker.inputCoiWithPlaceholder('[data-testid="bag-identifier-1-input"]', coi, '-FP-01');
        inputHelpers.clicker('[data-testid="bag-identifier-1-button"]');
      });
      cy.get(`@coi`).then(coi =>{
        inputChecker.inputCoiWithPlaceholder('[data-testid="bag-identifier-3-input"]', coi, '-FP-03');
        inputHelpers.clicker('[data-testid="bag-identifier-3-button"]');
      });
      inputChecker.checkState("[data-testid='primary-button-action']", 'not.be.disabled')
    },
    //C28143
    allTogglesYesAirwayBillFilled: () =>{
      cy.log('Shipping Checklist');
      inputHelpers.clicker('[data-testid="back-nav-link"]')
      inputHelpers.clicker('[data-testid="back-nav-link"]')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputHelpers.clicker('[data-testid="pass-button-attach_shipping_labels_to_shipper"]');
      inputHelpers.clicker('[data-testid="pass-button-load_fp_into_shipper"]');
      inputHelpers.clicker('[data-testid="pass-button-summary_documents_in_shipper"]');
      inputHelpers.clicker('[data-testid="pass-button-manufacturing_shipper_sealed"]');
      //airwayBill
      inputChecker.inputStringValue('[data-testid="#/properties/shipping_checklist/properties/manufacturing_awb-input"]', inputs.manufacturing.usEu.manufacturingAwb)
      inputChecker.checkState("[data-testid='primary-button-action']", 'be.enabled')
    },
    //C28144
    oneToggleButtonNO: () =>{
      cy.log('Shipping Checklist');
      inputHelpers.clicker('[data-testid="fail-button-attach_shipping_labels_to_shipper"]')
      inputChecker.checkState("[data-testid='primary-button-action']", 'be.disabled')
    },
    //C28145
    noTextNoNext: () =>{
      cy.log('Shipping Checklist');
      inputChecker.inputStringValue('[data-testid="#/properties/shipping_checklist/properties/attach_shipping_labels_to_shipper_reason-input"]', 'test890')
      inputChecker.checkState("[data-testid='primary-button-action']", 'be.enabled')
    },
    //C28146
    printSummary: () =>{
      cy.log('Shipping Checklist');
      inputChecker.checkState('[name="manufacturingPhaseCd30UsShippingChecklistPrintSummary"]', 'be.enabled')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    }
  },


  shippingSummaryUs:{
    previousHappyPathSteps: (scope) => {
      const futureDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      const pastDate = dayjs().subtract(1, 'day').format('DD-MMM-YYYY');
      const currentDate = dayjs().format('DD-MMM-YYYY');
      mfgStepsOpenOrder.openOrder(scope);
      mfgStepsHappyPath.assignLotNumber(scope.treatment);
      mfgStepsHappyPath.collectionSummary();
      mfgStepsHappyPath.shipmentReceiptChecklist();
      mfgStepsHappyPath.shipmentReceiptSummary();
      mfgStepsHappyPath.apheresisProductReceiptUs(scope);
      mfgStepsHappyPath.apheresisProductReceiptSummaryUs();
      mfgStepsHappyPath.manufacturingStart();
      mfgStepsHappyPath.harvestingUs(pastDate, futureDate);
      mfgStepsHappyPath.printFpBagLabels();
      mfgStepsHappyPath.confirmNumberOfBags();
      mfgStepsHappyPath.manufacturingSummaryUs();
      mfgStepsHappyPath.qaRelease();
      mfgStepsHappyPath.sponserReleaseUs();
      mfgStepsHappyPath.sponserReleaseSummary();
      mfgStepsHappyPath.selectBagsToBeShipped();
      mfgStepsHappyPath.shippingChecklist(scope);
    },
    verifyWithoutSignature: (summary_btn_id) => {
      cy.log('Shipping Summary');
      inputChecker.clickOnCheck("[data-testid='primary-button-action']", 'be.disabled');
      inputChecker.checkState(summary_btn_id, 'be.disabled');
    },
    verifyWithSignature: (summary_btn_id) => {
      cy.log('Shipping Summary');
      inputChecker.nextButtonCheck('be.disabled');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      inputChecker.checkState(summary_btn_id, 'be.enabled');
      inputChecker.nextButtonCheck('be.enabled');
    }
  },

  checkStatusesOfManufacturingModule: (scope) => {
    const futureDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
    const pastDate = dayjs().subtract(1, 'day').format('DD-MMM-YYYY');
    const currentDate = dayjs().format('DD-MMM-YYYY');

    cy.get(`@coi`).then((coi) => {
      mfgStepsOpenOrder.openOrder(scope);
      inputChecker.explicitWait('[data-test-id="manufacturing_lot_number"]'); 
      inputChecker.clickOnHeader('manufacturing')
      cy.checkStatus(coi,regressionInput.manufacturing.statuses.assignLotNumber,'Reservations',4)
      mfgStepsHappyPath.assignLotNumber(scope.treatment);
      inputChecker.explicitWait('[data-test-id="manufacturing_collection_summary"]');

      inputChecker.clickOnHeader('manufacturing')
      cy.checkStatus(coi,regressionInput.manufacturing.statuses.collectionSummary,'Reservations',4)
      mfgStepsHappyPath.collectionSummary();
      inputChecker.explicitWait('[data-test-id="manufacturing_shipment_receipt_checklist"]');

      inputChecker.clickOnHeader('manufacturing')
      cy.checkStatus(coi,regressionInput.manufacturing.statuses.shipmentReceiptChecklist,'Reservations',4)
      mfgStepsHappyPath.shipmentReceiptChecklist();
      inputChecker.explicitWait('[data-test-id="manufacturing_shipment_receipt_summary"]');  

      inputChecker.clickOnHeader('manufacturing')
      cy.checkStatus(coi,regressionInput.manufacturing.statuses.shipmentReceiptSummary,'Reservations',4)
      mfgStepsHappyPath.shipmentReceiptSummary();
      inputChecker.explicitWait('[data-test-id="manufacturing_apheresis_product_receipt"]');

      inputChecker.clickOnHeader('manufacturing')
      cy.checkStatus(coi,regressionInput.manufacturing.statuses.apheresisProductReceipt,'Reservations',4)
      mfgStepsHappyPath.apheresisProductReceiptUs(scope);
      inputChecker.explicitWait('[data-test-id="manufacturing_apheresis_product_receipt_summary"]');

      inputChecker.clickOnHeader('manufacturing')
      cy.checkStatus(coi,regressionInput.manufacturing.statuses.apheresisProductReceiptSummary,'Reservations',4)
      mfgStepsHappyPath.apheresisProductReceiptSummary();
      inputChecker.explicitWait('[data-test-id="manufacturing_manufacturing_start"]'); 

      inputChecker.clickOnHeader('manufacturing')
      cy.checkStatus(coi,regressionInput.manufacturing.statuses.manufacturingStart,'Reservations',4)
      mfgStepsHappyPath.manufacturingStart();
      inputChecker.explicitWait('[data-test-id="manufacturing_harvesting"]');

      inputChecker.clickOnHeader('manufacturing')
      cy.checkStatus(coi,regressionInput.manufacturing.statuses.harvesting,'Reservations',4)
      mfgStepsHappyPath.harvestingUs(pastDate, futureDate);
      inputChecker.explicitWait('[data-test-id="manufacturing_print_fp_bag_labels"]');

      inputChecker.clickOnHeader('manufacturing')
      cy.checkStatus(coi,regressionInput.manufacturing.statuses.printFpBagLabels,'Reservations',4)
      mfgStepsHappyPath.printFpBagLabels();
      inputChecker.explicitWait('[data-test-id="manufacturing_confirm_number_of_bags"]'); 

      inputChecker.clickOnHeader('manufacturing')
      cy.checkStatus(coi,regressionInput.manufacturing.statuses.confirmNumberOfBags,'Reservations',4)
      mfgStepsHappyPath.confirmNumberOfBags();
      inputChecker.explicitWait('[data-test-id="manufacturing_manufacturing_summary"]');

      inputChecker.clickOnHeader('manufacturing')
      cy.checkStatus(coi,regressionInput.manufacturing.statuses.manufacturingSummary,'Reservations',4)
      mfgStepsHappyPath.manufacturingSummaryUs();
      inputChecker.explicitWait('[data-test-id="manufacturing_qa_release"]'); 

      inputChecker.clickOnHeader('manufacturing')
      cy.checkStatus(coi,regressionInput.manufacturing.statuses.qaRelease,'Reservations',4)
      mfgStepsHappyPath.qaRelease();
      inputChecker.explicitWait('[data-test-id="manufacturing_sponser_release"]');

      inputChecker.clickOnHeader('manufacturing')
      cy.checkStatus(coi,regressionInput.manufacturing.statuses.sponserRelease,'Reservations',4)
      mfgStepsHappyPath.sponserReleaseUs();
      inputChecker.explicitWait('[data-test-id="manufacturing_sponser_release_summary"]'); 

      inputChecker.clickOnHeader('manufacturing')
      cy.checkStatus(coi,regressionInput.manufacturing.statuses.sponserReleaseSummary,'Reservations',4)
      mfgStepsHappyPath.sponserReleaseSummary();
      inputChecker.explicitWait('[data-test-id="manufacturing_select_bags_to_be_shipped"]');

      inputChecker.clickOnHeader('manufacturing')
      cy.checkStatus(coi,regressionInput.manufacturing.statuses.selectBagsToBeShipped,'Reservations',4)
      mfgStepsHappyPath.selectBagsToBeShipped();
      inputChecker.explicitWait('[data-test-id="manufacturing_shipping_checklist"]');

      inputChecker.clickOnHeader('manufacturing')
      cy.checkStatus(coi,regressionInput.manufacturing.statuses.shippingChecklist,'Reservations',4)
      mfgStepsHappyPath.shippingChecklist();
      inputChecker.explicitWait('[data-test-id="manufacturing_shipping_summary"]');

      inputChecker.clickOnHeader('manufacturing')
      cy.checkStatus(coi,regressionInput.manufacturing.statuses.shippingSummary,'Reservations',4)
      mfgStepsHappyPath.shippingSummary();
      mfgStepsHappyPath.selectBagsToBeShippedLoop();
      mfgStepsHappyPath.shippingChecklistLoop(scope);
      mfgStepsHappyPath.shippingSummaryLoop();

     cy.checkStatus(coi,regressionInput.manufacturing.statuses.completed,'Reservations',4)
    })
  }
}
