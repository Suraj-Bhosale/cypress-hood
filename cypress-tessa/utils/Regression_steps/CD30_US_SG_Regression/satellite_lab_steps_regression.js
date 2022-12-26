import regressionInput from '../../../fixtures/inputsRegression.json';
import inputChecker from '../../../utils/shared_block_helpers/inputFieldCheckHelpers';
import inputHelpers from '../../../utils/shared_block_helpers/inputFieldHelpers';
import actionButtonsHelper from '../../../utils/shared_block_helpers/actionButtonHelpers';
import documentUploadHelper from '../../../utils/shared_block_helpers/documentUploadHelpers';
import signatureHelpers from '../../../utils/shared_block_helpers/signatureHelpers';
import translationHelpers from "../../../utils/shared_block_helpers/translationHelpers";
import common from '../../../support/index';
import inputs from "../../../fixtures/inputs.json";
import satelliteLabStepsHappyPath from "../../HappyPath_steps/CD30_US_SG_HappyPath/satellite_lab_steps";
import satelliteLabAssertions from '../../../fixtures/satelliteLabAssertions.json';
import satelliteLabOpenOrder from '../../../utils/Regression_steps/CD30_US_SG_Regression/satellite_lab_steps_regression.js';

export default {
  satelliteLabAliases: () => {
    cy.server();
    cy.intercept('POST', '/documents').as('postDocuments');
    cy.intercept('POST', '/signatures').as('postSignatures');
    cy.intercept('POST', '/print').as('postPrint');
    cy.intercept('PATCH', '/procedure_steps/*').as('patchProcedureSteps');
    cy.intercept('GET', '/procedures/*').as('getProcedures');
    cy.intercept('POST', '/label_scans/values').as('createLabelScanValue');
    cy.intercept('POST', '/label_scans/verifications').as('labelVerifications');
  },

  openOrder: (scope) => {
    //cy.getCoi(scope.patientInformation)
    cy.log('login Phil');
    cy.platformLogin('phil@vineti.com');
    cy.visit('/satellite_lab');
    cy.paginationForCoi();
  },

  collectionSummary: (scope) => {
    satelliteLabOpenOrder.openOrder(scope);
    common.ClickPrimaryActionButton();
  },

  shipmentReceiptChecklist: {
    previousHappyPathSteps: (scope) => {
      satelliteLabOpenOrder.openOrder(scope);
      satelliteLabStepsHappyPath.collectionSummary();
    },
    //C36697
    emptyAwd: () => {
      cy.log('Shipment Receipt Checklist')
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.clickOnCheck('[data-testid="fail-button-collection_awb_match"]', "be.disabled");
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/collection_awb_not_match_reason-input"]',regressionInput.satelliteLab.shipmentReceiptChecklist.positivePleaseProvideReason, "not.be.enabled");
      inputChecker.clickOnCheck('[data-testid="fail-button-shipping_container_intact"]', "be.disabled");
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/shipping_container_not_intact_rationale-input"]',regressionInput.satelliteLab.shipmentReceiptChecklist.positivePleaseProvideReason, "not.be.enabled");
      inputChecker.clickOnCheck('[data-testid="fail-button-shipper_seal_intact"]', "not.be.enabled");
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/shipper_seal_not_intact_rationale-input"]',regressionInput.satelliteLab.shipmentReceiptChecklist.positivePleaseProvideReason, "be.enabled");
    },
    //C36698
    positiveToggle: () => {
      cy.log('Shipment Receipt Checklist')
      inputChecker.clickOnCheck('[data-testid="back-nav-link"]', "be.enabled");
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.clickOnCheck('[data-testid="pass-button-collection_awb_match"]', "be.disabled");
      inputChecker.clickOnCheck('[data-testid="pass-button-shipping_container_intact"]', "be.disabled");
      inputChecker.clickOnCheck('[data-testid="pass-button-shipper_seal_intact"]', "be.enabled");
    },
    //C21304
    validAwb: () => {
      cy.log('Shipment Receipt Checklist')
      inputChecker.clickOnCheck('[data-testid="back-nav-link"]', "be.enabled");
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.inputSingleFieldCheck('[data-testid="air-waybill-number-input-field"]', regressionInput.satelliteLab.shipmentReceiptChecklist.correctAwb,"be.disabled")
      inputChecker.clickOnCheck("[data-testid='air-waybill-number-action-trigger-button']", "be.disabled");
      inputChecker.checkState('.big-green-check-mark','be.visible');
      inputChecker.clickOnCheck('[data-testid="pass-button-collection_awb_match"]', "be.disabled");
      inputChecker.clickOnCheck('[data-testid="pass-button-shipping_container_intact"]', "be.disabled");
      inputChecker.clickOnCheck('[data-testid="pass-button-shipper_seal_intact"]', "be.enabled");
    },
    //C21294
    nextButtonPositive: () => {
      cy.log('Shipment Receipt Checklist')
      inputHelpers.clicker("[data-testid='primary-button-action']");
      inputChecker.checkDataSavingWithBackButton('not.be.disabled','[data-test-id="satellite_lab_shipment_receipt_checklist"]')
      inputChecker.checkToggle('[data-testid="pass-button-collection_awb_match"]');
      inputChecker.checkToggle('[data-testid="pass-button-shipping_container_intact"]');
      inputChecker.checkToggle('[data-testid="pass-button-shipper_seal_intact"]');
    },
    //C21302
    changeValue: () => {
      cy.log('Shipment Receipt Checklist')
      inputChecker.clickOnCheck('[data-testid="fail-button-collection_awb_match"]', "be.disabled");
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/collection_awb_not_match_reason-input"]',regressionInput.satelliteLab.shipmentReceiptChecklist.positivePleaseProvideReason, "be.enabled");
      inputChecker.nextButtonCheck('not.be.disabled');
      inputHelpers.clicker("[data-testid='primary-button-action']");
      inputHelpers.inputSingleField('[data-testid="reason-for-change-textarea"]',regressionInput.satelliteLab.shipmentReceiptChecklist.positiveResonForChange);
      inputHelpers.clicker('[data-testid="reason-for-change-save"]');
    },
    //C21313
    nextButtonDisable: () => {
      cy.log('Shipment Receipt Checklist')
      inputChecker.clickOnCheck('[data-testid="back-nav-link"]', "not.be.disabled");
      inputChecker.clickOnCheck('[data-testid="fail-button-shipper_seal_intact"]', "be.disabled");
      inputChecker.checkToggle('[data-testid="fail-button-shipper_seal_intact"]');
    }
  },

  shipmentReceiptSummary: {
    previousHappyPathSteps: (scope) => {
      satelliteLabOpenOrder.openOrder(scope);
      satelliteLabStepsHappyPath.collectionSummary();
      satelliteLabStepsHappyPath.shipmentReceiptChecklist();
    },
    //C21710
    verifyEdit: () => {
      cy.log('Shipment Receipt Summary')
      inputHelpers.clicker('[data-testid="edit-shipment_receipt_checklist"]');
      inputHelpers.inputSingleField('[data-testid="air-waybill-number-input-field"]','567');
      inputHelpers.clicker('[data-testid="air-waybill-number-action-trigger-button"]');
      inputHelpers.clicker('[data-testid="pass-button-collection_awb_match"]');
      inputHelpers.clicker('[data-testid="fail-button-shipping_container_intact"]');
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/shipping_container_not_intact_rationale-input"]','Test 01');
      inputHelpers.clicker('[data-testid="fail-button-shipper_seal_intact"]');
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/shipper_seal_not_intact_rationale-input"]','Test 02');
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/additional_comments-input"]','Test 03');
      inputHelpers.clicker('[data-testid="primary-button-action"]');
      inputHelpers.inputSingleField('[data-testid="reason-for-change-textarea"]','Regression');
      inputHelpers.clicker('[data-testid="reason-for-change-save"]');
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
          0,'div', 'Did the Air Waybill Number match the expected value?',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
          0,'span', 'Yes',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
          1,'div', 'Is the shipping container in good intact condition?',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
          1,'span', 'No',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
          2,'div', 'Please provide rationale for response.',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
          2,'span', 'Test 01',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
          3,'div', 'Is the seal on the shipper intact?',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
          3,'span', 'No',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
          4,'div', 'Please provide rationale for response.',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
          4,'span', 'Test 02',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
          5,'div', 'Additional Comments',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
          5,'span', 'Test 03',0);
    },
    //C21711
    verifyWithoutSignature: () => {
      cy.log('Shipment Receipt Summary')
      inputHelpers.clicker('[data-testid="primary-button-action"]');
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C21712
    verifyWithSignature: () => {
      cy.log('Shipment Receipt Summary')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      inputChecker.nextButtonCheck('not.be.disabled');
    }
  },

  apheresisProductReceipt: {
    previousHappyPathSteps: (scope) => {
      satelliteLabOpenOrder.openOrder(scope);
      satelliteLabStepsHappyPath.collectionSummary();
      satelliteLabStepsHappyPath.shipmentReceiptChecklist();
      satelliteLabStepsHappyPath.shipmentReceiptSummary();
    },
    // C21338
    invalidCoi:()=>{
      cy.log('Apheresis Product Receipt');
      inputHelpers.inputSingleField('[data-testid="coi-input-field"]','test');
      inputHelpers.clicker('[data-testid="coi-action-trigger-button"]');
      inputHelpers.clicker('[data-testid="pass-button-temperature_data"]');
      inputHelpers.clicker('[data-testid="pass-button-collection_bag_condition"]');
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/apheresis_additional_comment-input"]','Additional Box');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },
    // C21339
    emptyReasonField:(coi)=>{
      cy.log('Apheresis Product Receipt');
      cy.get(`@coi`).then(coi =>{
        inputHelpers.inputSingleField('[data-testid="coi-input-field"]',coi);
      })
      inputHelpers.clicker('[data-testid="coi-action-trigger-button"]');
      inputHelpers.clicker('[data-testid="fail-button-temperature_data"]');
      inputHelpers.clicker('[data-testid="fail-button-collection_bag_condition"]');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },
    // C21340
    reasonFieldFilled:()=>{
      cy.log('Apheresis Product Receipt');
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/temperature_data_reason-input"]','test01');
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/collection_bag_condition_reason-input"]','test02');
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    }
  },

  apheresisProductReceiptSummary:  {
    previousHappyPathSteps: (scope) => {
      satelliteLabOpenOrder.openOrder(scope);
      satelliteLabStepsHappyPath.collectionSummary();
      satelliteLabStepsHappyPath.shipmentReceiptChecklist();
      satelliteLabStepsHappyPath.shipmentReceiptSummary();
      satelliteLabStepsHappyPath.apheresisProductReceipt(scope.treatment.coi);
    },
    //C21337
    withoutSignCheckNextButtonNegative:() =>  {
      cy.log('Apheresis Product Receipt Summary');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C21334
    verifyViewSummaryPositive:() =>  {
      cy.log('Apheresis Product Receipt Summary');
      inputChecker.checkState('[name="viewDocumentViewSummary"]','be.disabled')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
      inputChecker.checkState('[name="viewDocumentViewSummary"]','not.be.disabled')
    },

    //C21331
    verifyEditButtonPositive:() =>  {
      cy.log('Apheresis Product Receipt Summary');
      inputHelpers.clicker("div[data-test-id='step-header-block'] button[type='button']");
      inputChecker.nextButtonCheck('not.be.disabled');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.explicitWait("div[data-test-id='collection-summary-block'] button[type='button']");
      inputHelpers.clicker("div[data-test-id='collection-summary-block'] button[type='button']");
      inputChecker.nextButtonCheck('not.be.disabled');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    },
    //C21333
    verifySignatureAfterEditButtonPositive:(scope) =>  {
      cy.log('Apheresis Product Receipt Summary');
      inputHelpers.clicker("div[data-test-id='step-header-block'] button[type='button']")
      inputChecker.explicitWait("[data-testid='fail-button-temperature_data']");
      inputHelpers.clicker("[data-testid='fail-button-temperature_data']");
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/temperature_data_reason-input"]',regressionInput.satelliteLab.apheresisProductReceiptSummary.positivePleaseProvideRationaleForResponseOne);
      inputHelpers.clicker("[data-testid='fail-button-collection_bag_condition']");
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/collection_bag_condition_reason-input"]',regressionInput.satelliteLab.apheresisProductReceiptSummary.positivePleaseProvideRationaleForResponseTwo);
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/apheresis_additional_comment-input"]',regressionInput.satelliteLab.apheresisProductReceiptSummary.positiveAdditionalComments);
      inputChecker.nextButtonCheck('not.be.disabled')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      });
      inputChecker.explicitWait('[data-testid="reason-for-change-textarea"]');
      inputHelpers.inputSingleField('[data-testid="reason-for-change-textarea"]',regressionInput.satelliteLab.apheresisProductReceiptSummary.positiveResonForChange);
      inputHelpers.clicker('[data-testid="reason-for-change-save"]');
      inputChecker.explicitWait('[data-testid="display-only"]');

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            0,'div', regressionInput.satelliteLab.apheresisProductReceiptSummary.tempDataconfirmToggleLabel,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            0,'span', 'No',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            1,'div', regressionInput.satelliteLab.apheresisProductReceiptSummary.rationalResponse,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            1,'span', regressionInput.satelliteLab.apheresisProductReceiptSummary.positivePleaseProvideRationaleForResponseOne,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            2,'div', regressionInput.satelliteLab.apheresisProductReceiptSummary.collectionBagExpectedToggleLabel,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            2,'span', 'No',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            3,'div', regressionInput.satelliteLab.apheresisProductReceiptSummary.rationalResponse,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            3,'span', regressionInput.satelliteLab.apheresisProductReceiptSummary.positivePleaseProvideRationaleForResponseTwo,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            4,'div', regressionInput.satelliteLab.apheresisProductReceiptSummary.positiveAdditionalComments,0);//
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            4,'span', regressionInput.satelliteLab.apheresisProductReceiptSummary.positiveAdditionalComments,0);//
      inputChecker.nextButtonCheck('be.disabled');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
      inputHelpers.clicker("div[data-test-id='collection-summary-block'] button[type='button']");
      inputChecker.explicitWait("[data-testid='pass-button-temperature_data']");
      inputHelpers.clicker("[data-testid='pass-button-temperature_data']");
      inputHelpers.clicker("[data-testid='pass-button-collection_bag_condition']");
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/apheresis_additional_comment-input"]',regressionInput.satelliteLab.apheresisProductReceiptSummary.positiveAadditionalCommentsSecond);
      inputChecker.nextButtonCheck('not.be.disabled')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      });
      inputChecker.explicitWait('[data-testid="reason-for-change-textarea"]');
      inputHelpers.inputSingleField('[data-testid="reason-for-change-textarea"]',regressionInput.satelliteLab.apheresisProductReceiptSummary.positiveResonForChange);
      inputHelpers.clicker('[data-testid="reason-for-change-save"]');
      inputChecker.explicitWait('[data-testid="display-only"]');
      cy.get(`@coi`).then(coi =>{
        translationHelpers.assertSingleField('[data-testid=coi-value]',coi);
      })
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            0,'div', regressionInput.satelliteLab.apheresisProductReceiptSummary.tempDataconfirmToggleLabel,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            0,'span', 'Yes',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            1,'div', regressionInput.satelliteLab.apheresisProductReceiptSummary.collectionBagExpectedToggleLabel,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            1,'span', 'Yes',0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            2,'div', regressionInput.satelliteLab.apheresisProductReceiptSummary.positiveAdditionalComments,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            2,'span', regressionInput.satelliteLab.apheresisProductReceiptSummary.positiveAadditionalCommentsSecond,0);
      inputChecker.nextButtonCheck('be.disabled');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
    }
  },

  cryopreservationDate:{
    previousHappyPathSteps: (scope) => {
      satelliteLabOpenOrder.openOrder(scope);
      satelliteLabStepsHappyPath.collectionSummary();
      satelliteLabStepsHappyPath.shipmentReceiptChecklist();
      satelliteLabStepsHappyPath.shipmentReceiptSummary();
      satelliteLabStepsHappyPath.apheresisProductReceipt(scope.treatment.coi);
      satelliteLabStepsHappyPath.apheresisProductReceiptSummary();
    },
    // C25861
    verifySaveandClose: (coi)=>{
      cy.log('Cryopreservation Date');
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/date_of_cryopreservation-input"]',inputs.satelliteLab.global.cryopreservationDate);
      inputChecker.checkDataSavingWithSaveAndClose('','not.be.disabled',coi);
      inputHelpers.checkValue('[id="#/properties/custom_fields/properties/date_of_cryopreservation-input"]',
        inputs.satelliteLab.global.cryopreservationDate)
      inputChecker.nextButtonCheck('not.be.disabled');
    },
    // 	C25860
    verifyNextButton: ()=>{
      cy.log('Cryopreservation Date');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputHelpers.clicker('[data-testid="back-nav-link"]');
      inputHelpers.checkValue('[id="#/properties/custom_fields/properties/date_of_cryopreservation-input"]',
        inputs.satelliteLab.global.cryopreservationDate)
    }
  },

  pbmcLabels: {
    previousHappyPathSteps: (scope) => {
      satelliteLabOpenOrder.openOrder(scope);
      satelliteLabStepsHappyPath.collectionSummary();
      satelliteLabStepsHappyPath.shipmentReceiptChecklist();
      satelliteLabStepsHappyPath.shipmentReceiptSummary();
      satelliteLabStepsHappyPath.apheresisProductReceipt(scope.treatment.coi);
      satelliteLabStepsHappyPath.apheresisProductReceiptSummary();
      satelliteLabStepsHappyPath.cryopreservationDate();
    },
    //C21345
    verifyNextButtonNegative: () => {
      cy.log('Pbmc Labels');
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.clicker('[data-testid="btn-print"]')
      inputChecker.nextButtonCheck('be.disabled');
      },
    //C21346
    saveAndCloseButton: (coi) => {
      cy.log('Pbmc Labels');
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.clicker('[data-testid="btn-print"]')
      inputHelpers.clicker('[id="#/properties/data/properties/expected_labels_printed"]')
      inputChecker.nextButtonCheck('not.be.disabled');
      inputChecker.checkState("[data-testid='secondary-button-action']","be.enabled");
      inputHelpers.clicker("[data-testid='primary-button-action']");
      inputChecker.checkState("[data-testid='approver-sign-button']",'not.be.disabled');
      // inputChecker.nextButtonCheck('be.disabled'); Bug
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      inputChecker.nextButtonCheck('not.be.disabled');
      inputChecker.checkState("[data-testid='secondary-button-action']","be.enabled");
      inputChecker.checkDataSavingWithSaveAndClose('','not.be.disabled',coi);
      inputChecker.nextButtonCheck('not.be.disabled');
    },
    //C22042
    retainValue: () => {
      cy.log('Pbmc Labels');
      inputChecker.nextButtonCheck('not.be.disabled');
      inputChecker.explicitWait('[data-testid="primary-button-action"]');
      inputHelpers.clicker("[data-testid='primary-button-action']");
      inputChecker.checkDataSavingWithBackButton('not.be.disabled','[data-test-id="satellite_lab_pbmc_labels"]')
    }
  },

  pbmcBagsInformation : {
    previousHappyPathSteps: (scope) => {
      satelliteLabOpenOrder.openOrder(scope);
      satelliteLabStepsHappyPath.collectionSummary();
      satelliteLabStepsHappyPath.shipmentReceiptChecklist();
      satelliteLabStepsHappyPath.shipmentReceiptSummary();
      satelliteLabStepsHappyPath.apheresisProductReceipt(scope.treatment.coi);
      satelliteLabStepsHappyPath.apheresisProductReceiptSummary();
      satelliteLabStepsHappyPath.cryopreservationDate();
      satelliteLabStepsHappyPath.pbmcLabels();
    },
    //C21428
    bagsLessThanZeroAndCheckBoxChecked: () =>{
      cy.log('Pbmc Bags Information');
      inputChecker.inputStringValue('[id="#/properties/item_count-input"]', regressionInput.satelliteLab.pbmcBagsInformation.negativeNumberOfBags)
      inputHelpers.clicker('[id="#/properties/data/properties/is_applied"]')
      inputChecker.checkState("[data-testid='primary-button-action']", 'be.disabled')
    },
    //C21335
    pbmcBagsFilledAndCheckboxIsChecked: () =>{
      cy.log('Pbmc Bags Information');
      inputChecker.inputStringValue('[id="#/properties/item_count-input"]', regressionInput.satelliteLab.pbmcBagsInformation.positiveNumberOfBags)
      inputChecker.checkState("[data-testid='primary-button-action']", 'be.enabled')
      inputHelpers.clicker("[data-testid='primary-button-action']")
    },
    //C21429
    nextDisabledUntilSign: () =>{
      cy.log('Pbmc Bags Information');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    }
  },

  processPbmcSummary: {
    previousHappyPathSteps: (scope) => {
      satelliteLabOpenOrder.openOrder(scope);
      satelliteLabStepsHappyPath.collectionSummary();
      satelliteLabStepsHappyPath.shipmentReceiptChecklist();
      satelliteLabStepsHappyPath.shipmentReceiptSummary();
      satelliteLabStepsHappyPath.apheresisProductReceipt(scope.treatment.coi);
      satelliteLabStepsHappyPath.apheresisProductReceiptSummary();
      satelliteLabStepsHappyPath.cryopreservationDate();
      satelliteLabStepsHappyPath.pbmcLabels();
      satelliteLabStepsHappyPath.pbmcBagsInformation();
    },
    //C21448
    verifyEditButtonPositive:() =>  {
      cy.log('Process Pbmc Summary');
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.clicker('[data-testid=edit-cryopreservation_date]');
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_cryopreservation_date"]','h1',
      satelliteLabAssertions.cryopreservationDate.stepTitle)
      inputChecker.nextButtonCheck('not.be.disabled');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    },
    //C21449
    verifyViewSummaryPositive:() =>  {
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.checkState('[name="viewDocumentViewSummary"]','be.disabled');
      inputChecker.checkState("[data-testid='approver-sign-button']",'not.be.disabled');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
      inputChecker.checkState('[name="viewDocumentViewSummary"]','not.be.disabled');
      inputChecker.nextButtonCheck('not.be.disabled');
    }
 },

  selectBagsToBeShipped:{
    previousHappyPathSteps: (scope) => {
      satelliteLabOpenOrder.openOrder(scope);
      satelliteLabStepsHappyPath.collectionSummary();
      satelliteLabStepsHappyPath.shipmentReceiptChecklist();
      satelliteLabStepsHappyPath.shipmentReceiptSummary();
      satelliteLabStepsHappyPath.apheresisProductReceipt(scope.treatment.coi);
      satelliteLabStepsHappyPath.apheresisProductReceiptSummary();
      satelliteLabStepsHappyPath.cryopreservationDate();
      satelliteLabStepsHappyPath.pbmcLabels();
      satelliteLabStepsHappyPath.pbmcBagsInformation();
      satelliteLabStepsHappyPath.processPbmcSummary();
      satelliteLabStepsHappyPath.conditionalRelease();
      satelliteLabStepsHappyPath.finalRelease();
    },
    //C21467
    allBagsDoNotShip: () =>{
      cy.log('Select Bags To Be Shipped');
      inputHelpers.clicker('[data-testid="fail-button-0"]');
      inputHelpers.clicker('[data-testid="fail-button-1"]');
      inputHelpers.clicker('[data-testid="fail-button-2"]');
      inputHelpers.clicker('[data-testid="fail-button-3"]');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },
    // C21514
    singleBagShip: () => {
      cy.log('Select Bags To Be Shipped');
      inputHelpers.clicker('[data-testid="pass-button-0"]');
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    }
  },

  shippingChecklist : {
    previousHappyPathSteps: (scope) => {
      satelliteLabOpenOrder.openOrder(scope);
      satelliteLabStepsHappyPath.collectionSummary();
      satelliteLabStepsHappyPath.shipmentReceiptChecklist();
      satelliteLabStepsHappyPath.shipmentReceiptSummary();
      satelliteLabStepsHappyPath.apheresisProductReceipt(scope.treatment.coi);
      satelliteLabStepsHappyPath.apheresisProductReceiptSummary();
      satelliteLabStepsHappyPath.cryopreservationDate();
      satelliteLabStepsHappyPath.pbmcLabels();
      satelliteLabStepsHappyPath.pbmcBagsInformation();
      satelliteLabStepsHappyPath.processPbmcSummary();
      satelliteLabStepsHappyPath.conditionalRelease();
      satelliteLabStepsHappyPath.finalRelease();
      satelliteLabStepsHappyPath.selectBagsToBeShipped();
    },
    //C21431
    incorrectBagID: () =>{
      cy.get(`@coi`).then(coi =>{
        inputChecker.inputCoiWithPlaceholder('[data-testid="bag-identifier-1-input"]',coi, '-APH-01')
        inputHelpers.clicker('[data-testid="bag-identifier-1-button"]');
      });
      cy.get(`@coi`).then(coi =>{
        inputChecker.inputCoiWithPlaceholder('[data-testid="bag-identifier-3-input"]',coi, '-PRC-01')
        inputHelpers.clicker('[data-testid="bag-identifier-3-button"]');
      });
      //delete
      inputHelpers.clicker('[data-testid="pass-button-shipping_labels_attached"]');
      inputHelpers.clicker('[data-testid="pass-button-fp_into_shipper"]');
      inputHelpers.clicker('[data-testid="pass-button-summary_documents"]');
      inputHelpers.clicker('[data-testid="pass-button-shipper_sealed"]');
      inputChecker.inputStringValue('[data-testid="input-enter-satellite_awb"]', regressionInput.satelliteLab.shippingChecklist.satelliteAwb)
      inputChecker.inputStringValue('[data-testid="input-confirm-satellite_awb"]', regressionInput.satelliteLab.shippingChecklist.satelliteAwb)
      inputHelpers.inputEnterAndConfirm('satellite_awb', regressionInput.satelliteLab.shippingChecklist.satelliteAwb)
      inputChecker.checkState("[data-testid='primary-button-action']", 'be.disabled')
      //delete
    },
    //C21430
    correctBagID: () =>{
      inputChecker.clearField('[data-testid="bag-identifier-1-input"]')
      inputChecker.clearField('[data-testid="bag-identifier-3-input"]')

      cy.get(`@coi`).then(coi =>{
        inputChecker.inputCoiWithPlaceholder('[data-testid="bag-identifier-1-input"]',coi, '-PRC-01')
        inputHelpers.clicker('[data-testid="bag-identifier-1-button"]');
      });
      cy.get(`@coi`).then(coi =>{
        inputChecker.inputCoiWithPlaceholder('[data-testid="bag-identifier-3-input"]',coi, '-PRC-03')
        inputHelpers.clicker('[data-testid="bag-identifier-3-button"]');
      });
      inputHelpers.clicker('[data-testid="pass-button-shipping_labels_attached"]');
      inputHelpers.clicker('[data-testid="pass-button-fp_into_shipper"]');
      inputHelpers.clicker('[data-testid="pass-button-summary_documents"]');
      inputHelpers.clicker('[data-testid="pass-button-shipper_sealed"]');
      inputChecker.checkState("[data-testid='primary-button-action']", 'be.enabled')
    },

    //C21433
    oneToggleButtonNO: () =>{
      cy.log('Shipping Checklist');
      inputHelpers.clicker('[data-testid="fail-button-shipping_labels_attached"]')
      inputChecker.checkState("[data-testid='primary-button-action']", 'be.disabled')
    },
    //C21454
    noTextNoNext: () =>{
      cy.log('Shipping Checklist');
      inputChecker.inputStringValue('[data-testid="#/properties/shipping_checklist/properties/shipping_labels_attached_reason-input"]', 'test04')
      inputChecker.checkState("[data-testid='primary-button-action']", 'not.be.disabled')
    },
    //C21460
    viewSummary: () =>{
      cy.log('Shipping Checklist');
      inputChecker.checkState('[data-testid="pass-button-summary_documents"]', 'not.be.disabled');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    }
  },

  shippingSummary:{
    previousHappyPathSteps: (scope) => {
      satelliteLabOpenOrder.openOrder(scope);
      satelliteLabStepsHappyPath.collectionSummary();
      satelliteLabStepsHappyPath.shipmentReceiptChecklist();
      satelliteLabStepsHappyPath.shipmentReceiptSummary();
      satelliteLabStepsHappyPath.apheresisProductReceipt(scope.treatment.coi);
      satelliteLabStepsHappyPath.apheresisProductReceiptSummary();
      satelliteLabStepsHappyPath.cryopreservationDate();
      satelliteLabStepsHappyPath.pbmcLabels();
      satelliteLabStepsHappyPath.pbmcBagsInformation();
      satelliteLabStepsHappyPath.processPbmcSummary();
      satelliteLabStepsHappyPath.conditionalRelease();
      satelliteLabStepsHappyPath.finalRelease();
      satelliteLabStepsHappyPath.selectBagsToBeShipped();
      satelliteLabStepsHappyPath.shippingChecklist(scope);
    },
    //C21468
    editAndNextButtonOnPrevPage: () =>{
      cy.log('Shipping Summary');
      inputHelpers.clicker('[data-testid="edit-select_bags_to_be_shipped"]')
      inputHelpers.clicker("[data-testid='primary-button-action']")
    },
    //C21469
    viewSummaryBeforeAndAfterSign: () =>{
      cy.log('Shipping Summary');
      inputChecker.checkState('[name="viewDocumentViewSummary"]', 'be.disabled')
      inputHelpers.clicker("[data-testid='primary-button-action']")
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures'])
      inputChecker.checkState('[name="viewDocumentViewSummary"]', 'be.enabled')
      inputChecker.checkState("[data-testid='primary-button-action']", 'be.enabled')
    },

    //C21471
    nextButtonDisabledUntilSignature: (coi) =>{
      inputHelpers.clicker('[data-testid="edit-select_bags_to_be_shipped"]');
      inputHelpers.clicker('[data-testid="pass-button-1"]');
      inputHelpers.clicker("[data-testid='primary-button-action']")
      inputChecker.explicitWait('[data-testid="reason-for-change-textarea"]');
      inputHelpers.inputSingleField('[data-testid="reason-for-change-textarea"]',regressionInput.satelliteLab.shippingSummary.positiveReasonForChange)
      inputHelpers.clicker('[data-testid="reason-for-change-save"]')
      translationHelpers.assertSectionChildElement('[data-test-id="specimen-status-block"]',
            0,'span', regressionInput.satelliteLab.shippingSummary.totalNumOfBags, 2);
      translationHelpers.assertSectionChildElement('[data-test-id="specimen-status-block"]',
            0,'span', regressionInput.satelliteLab.shippingSummary.shippedNumberOfBags, 3);
      translationHelpers.assertSectionChildElement('[data-test-id="specimen-status-block"]',
            0,'span', regressionInput.satelliteLab.shippingSummary.bagIdentifier1, 4);
      cy.get(`@coi`).then(coi =>{
        translationHelpers.assertSectionChildElement('[data-test-id="specimen-status-block"]',
            0,'div', regressionInput.satelliteLab.shippingSummary.bagIdentifier1 + coi +'-PRC-01', 5);
      });
      translationHelpers.assertSectionChildElement('[data-test-id="specimen-status-block"]',
            0,'span', regressionInput.satelliteLab.shippingSummary.bagIdentifier2, 6);
      cy.get(`@coi`).then(coi =>{
      translationHelpers.assertSectionChildElement('[data-test-id="specimen-status-block"]',
            0,'div', regressionInput.satelliteLab.shippingSummary.bagIdentifier2+ coi +'-PRC-02', 6);
      })
      translationHelpers.assertSectionChildElement('[data-test-id="specimen-status-block"]',
            0,'span', regressionInput.satelliteLab.shippingSummary.bagIdentifier3, 8);
      cy.get(`@coi`).then(coi =>{
      translationHelpers.assertSectionChildElement('[data-test-id="specimen-status-block"]',
            0,'div', regressionInput.satelliteLab.shippingSummary.bagIdentifier3+ coi +'-PRC-03', 7);
      })
      translationHelpers.assertSectionChildElement('[data-test-id="specimen-status-block"]',
            1,'span', regressionInput.satelliteLab.shippingSummary.totalNumOfBags, 2);
      translationHelpers.assertSectionChildElement('[data-test-id="specimen-status-block"]',
            1,'span', regressionInput.satelliteLab.shippingSummary.unShippedNumberOfBags, 3);
      translationHelpers.assertSectionChildElement('[data-test-id="specimen-status-block"]',
            1,'span', 'Bag 4 Identifier', 4);
      cy.get(`@coi`).then(coi =>{
      translationHelpers.assertSectionChildElement('[data-test-id="specimen-status-block"]',
            1,'div', 'Bag 4 Identifier'+ coi +'-PRC-04', 5);
      })
      inputHelpers.clicker('[data-testid="edit-shipping_checklist"]')
      cy.get(`@coi`).then(coi =>{
        inputChecker.inputCoiWithPlaceholder('[data-testid="bag-identifier-2-input"]', coi, '-PRC-02')
      });
      inputHelpers.clicker('[data-testid="bag-identifier-2-button"]')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.explicitWait('[data-test-id="satellite_lab_shipping_summary"]');
      translationHelpers.assertSectionChildElement('[data-test-id="multiple-scan-block-block"] > div', 1, 'div', regressionInput.satelliteLab.shippingSummary.scanEnterPBMCBag2, 2);
      cy.get(`@coi`).then(coi =>{
        translationHelpers.assertSingleField('[data-testid="bag-identifier-2-value"]', coi +'-PRC-02')
      });
      inputChecker.explicitWait('[data-testid="edit-shipping_checklist"]')
      inputChecker.explicitWait('[data-testid="edit-shipping_checklist"]')
      inputHelpers.clicker('[data-testid="edit-shipping_checklist"]')
      inputChecker.explicitWait('[data-testid="fail-button-shipping_labels_attached"]')
      inputHelpers.clicker('[data-testid="fail-button-shipping_labels_attached"]')
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/shipping_labels_attached_reason-input"]', regressionInput.satelliteLab.shippingSummary.positiveReasonForChange)
      inputHelpers.clicker("[data-testid='primary-button-action']")
      inputChecker.explicitWait('[data-testid="reason-for-change-textarea"]');
      inputChecker.explicitWait('[data-testid="reason-for-change-textarea"]')
      inputHelpers.inputSingleField('[data-testid="reason-for-change-textarea"]',regressionInput.satelliteLab.shippingSummary.positiveReasonForChange)
      inputHelpers.clicker('[data-testid="reason-for-change-save"]')
      inputChecker.explicitWait('[data-testid= "txt-field-layout-Attach shipping labels to shipper."]')
      translationHelpers.assertSingleField('[data-testid= "txt-field-layout-Attach shipping labels to shipper."]', regressionInput.satelliteLab.shippingSummary.shipperLabels)
      translationHelpers.assertSectionChildElement('[data-testid="txt-field-layout-Attach shipping labels to shipper.-answer"]>>>> div', 0, 'span', 'No', 0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
          3,'div', regressionInput.satelliteLab.shippingSummary.positiveToggleReason, 0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
          3,'span',regressionInput.satelliteLab.shippingSummary.positiveReasonForChange, 0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
          4,'div', regressionInput.satelliteLab.shippingSummary.scanAirway, 0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
          4,'span',regressionInput.satelliteLab.shippingSummary.airwayNumber,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
          6,'div', regressionInput.satelliteLab.shippingSummary.addComments, 0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
          6,'span', regressionInput.satelliteLab.shippingSummary.awbComment, 0);
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Pack and load the PBMC bags into the shipper according to the instructions provided."]',
          regressionInput.satelliteLab.shippingSummary.packingInstructions)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Place summary documents in the shipper."]',
          regressionInput.satelliteLab.shippingSummary.summaryDocuments)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Shipper has been sealed."]',
          regressionInput.satelliteLab.shippingSummary.shipperSealed)
      inputChecker.checkState("[data-testid='approver-sign-button']", 'be.enabled')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      inputChecker.checkState("[data-testid='primary-button-action']", 'be.enabled')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    }
  },

  conditionalRelease: {
    previousHappyPathSteps: (scope) => {
      satelliteLabOpenOrder.openOrder(scope);
      satelliteLabStepsHappyPath.collectionSummary();
      satelliteLabStepsHappyPath.shipmentReceiptChecklist();
      satelliteLabStepsHappyPath.shipmentReceiptSummary();
      satelliteLabStepsHappyPath.apheresisProductReceipt(scope.treatment.coi);
      satelliteLabStepsHappyPath.apheresisProductReceiptSummary();
      satelliteLabStepsHappyPath.cryopreservationDate();
      satelliteLabStepsHappyPath.pbmcLabels();
      satelliteLabStepsHappyPath.pbmcBagsInformation();
      satelliteLabStepsHappyPath.processPbmcSummary();
    },
    //C21342
    verifyNextButtonNeg: () => {
      cy.log('Conditional Release');
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C25332
    saveAndCloseButtonPositive: () => {
      cy.log('Conditional Release');
      documentUploadHelper.multipleDocumentsUpload(['validpdf.pdf'], {
        encoding: 'base64',
        selector: '.btn-file-input input',
        type: 'application/pdf',
        inputType: 'input',
      });
      inputChecker.checkDataSavingWithSaveAndClose('','not.be.disabled','');
      inputChecker.checkState('button[name="conditional_release"]','not.be.disabled');
    },
    //C25333
    verifyNextButtonWithoutSignaturePositive: () => {
      cy.log('Conditional Release');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.nextButtonCheck('be.disabled');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    },
    //C21356
    backButtonPositive: () => {
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.checkDataSavingWithBackButton('not.be.disabled','[data-test-id="satellite_lab_conditional_release"]');
    }
  },

  finalRelease: {
    previousHappyPathSteps: (scope) => {
      satelliteLabOpenOrder.openOrder(scope);
      satelliteLabStepsHappyPath.collectionSummary();
      satelliteLabStepsHappyPath.shipmentReceiptChecklist();
      satelliteLabStepsHappyPath.shipmentReceiptSummary();
      satelliteLabStepsHappyPath.apheresisProductReceipt(scope.treatment.coi);
      satelliteLabStepsHappyPath.apheresisProductReceiptSummary();
      satelliteLabStepsHappyPath.cryopreservationDate();
      satelliteLabStepsHappyPath.pbmcLabels();
      satelliteLabStepsHappyPath.pbmcBagsInformation();
      satelliteLabStepsHappyPath.processPbmcSummary();
      satelliteLabStepsHappyPath.conditionalRelease();
    },
    //C21343
    verifyNextButtonNeg: () => {
      cy.log('Final Release');
      inputChecker.nextButtonCheck('be.disabled')
    },
    //C25335
    saveAndCloseButtonPositive: () => {
      cy.log('Final Release');
      documentUploadHelper.multipleDocumentsUpload(['validpdf.pdf'], {
        encoding: 'base64',
        selector: '.btn-file-input input',
        type: 'application/pdf',
        inputType: 'input',
      });
      inputChecker.checkDataSavingWithSaveAndClose('','not.be.disabled','');
      inputChecker.checkState('button[name="final_release"]','not.be.disabled');
    },
    //C25336
    verifyNextButtonWithoutSignaturePositive: () => {
      cy.log('Final Release');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.nextButtonCheck('be.disabled');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    },
    //C21360
    backButtonPositive: () => {
      cy.log('Final Release');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.checkDataSavingWithBackButton('not.be.disabled','[data-test-id="satellite_lab_final_release"]');
    }
  },

  checkStatusesOfSatelliteLabModule: (scope) => {
    cy.get(`@coi`).then((coi) => {
      satelliteLabOpenOrder.openOrder(scope);
      inputChecker.explicitWait('[data-test-id="satellite_lab_collection_summary"]');
      inputChecker.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.collectionSummary,'Reservations',2)
      satelliteLabStepsHappyPath.collectionSummary();
      inputChecker.explicitWait('[data-test-id="satellite_lab_shipment_receipt_checklist"]');

      inputChecker.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.shipmentReceiptChecklist,'Reservations',2)
      satelliteLabStepsHappyPath.shipmentReceiptChecklist();
      inputChecker.explicitWait('[data-test-id="satellite_lab_shipment_receipt_summary"]');

      inputChecker.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.shipmentReceiptSummary,'Reservations',2)
      satelliteLabStepsHappyPath.shipmentReceiptSummary();
      inputChecker.explicitWait('[data-test-id="satellite_lab_apheresis_product_receipt"]');

      inputChecker.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.apheresisProductReceipt,'Reservations',2)
      satelliteLabStepsHappyPath.apheresisProductReceipt();
      inputChecker.explicitWait('[data-test-id="satellite_lab_apheresis_product_receipt_summary"]');

      inputChecker.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.apheresisProductReceiptSummary,'Reservations',2)
      satelliteLabStepsHappyPath.apheresisProductReceiptSummary();
      inputChecker.explicitWait('[data-test-id="satellite_lab_cryopreservation_date"]');

      inputChecker.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.cryopreservationDate,'Reservations',2)
      satelliteLabStepsHappyPath.cryopreservationDate();
      inputChecker.explicitWait('[data-test-id="satellite_lab_pbmc_labels"]');

      inputChecker.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.pbmcLabels,'Reservations',2)
      satelliteLabStepsHappyPath.pbmcLabels();
      inputChecker.explicitWait('[data-test-id="satellite_lab_pbmc_bags_information"]');

      inputChecker.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.pbmcBagsInformation,'Reservations',2)
      satelliteLabStepsHappyPath.pbmcBagsInformation();
      inputChecker.explicitWait('[data-test-id="satellite_lab_process_pbmc_summary"]');

      inputChecker.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.processPbmcSummary,'Reservations',2)
      satelliteLabStepsHappyPath.processPbmcSummary();
      inputChecker.explicitWait('[data-test-id="satellite_lab_conditional_release"]');

      inputChecker.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.conditionalRelease,'Reservations',2)
      satelliteLabStepsHappyPath.conditionalRelease();
      inputChecker.explicitWait('[data-test-id="satellite_lab_final_release"]');

      inputChecker.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.finalRelease,'Reservations',2)
      satelliteLabStepsHappyPath.finalRelease();
      inputChecker.explicitWait('[data-test-id="satellite_lab_select_bags_to_be_shipped"]');

      inputChecker.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.selectBagsToBeShipped,'Reservations',2)
      satelliteLabStepsHappyPath.selectBagsToBeShipped();
      inputChecker.explicitWait('[data-test-id="satellite_lab_shipping_checklist"]');

      inputChecker.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.shippingChecklist,'Reservations',2)
      satelliteLabStepsHappyPath.shippingChecklist(scope);
      inputChecker.explicitWait('[data-test-id="satellite_lab_shipping_summary"]');

      inputChecker.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.shippingSummary,'Reservations',2)
      satelliteLabStepsHappyPath.shippingSummary();

      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.completed,'Reservations',2)
    })
  }
}

