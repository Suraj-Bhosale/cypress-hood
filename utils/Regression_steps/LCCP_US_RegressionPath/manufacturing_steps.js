//import {singleSignature, ClickPrimaryActionButton,doubleSignature} from '../support/index.js';
import common from '../../../support/index.js'
import dayjs from 'dayjs';
import input from '../../../fixtures/inputs.json';
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers'
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers'
import regressionInput from '../../../fixtures/inputsRegression.json'
import manufacturingStepsRegression from '../../Regression_steps/LCCP_US_RegressionPath/manufacturing_steps';
import m_steps from '../../../utils/HappyPath_steps/LCCP_US_HappyPath/manufacturing_steps';

const verifier = 'quela@vineti.com'
const date = dayjs()
  .add(1, 'month')
  .add(0, 'days')
  .format('DD-MMM-YYYY')

const getManufAirWayBill = (scope, shippingRow) => {
  common.loginAs('oliver')
  cy.visit('/ordering')
  cy.get('td[data-testid="patient-identifier"]')
    .contains(scope.patientInformation.subjectNumber)
    .click()
  cy.get('[data-testid="td-stage-plane-icon"]')
    .eq(shippingRow)
    .parent()
    .parent()
    .parent()
    .find('[data-testid="td-stage-site-details"]')
    .invoke('text')
    .then((text) => {
      scope.airWayBill = text.substring(9, text.length)
      common.loginAs('steph')
      cy.visit('/manufacturing')
      inputHelpers.clicker(`tr[data-testid="manufacturing-${scope.coi}"]`)

      inputHelpers.scanAndVerifyCoi('manufacturing-airway-bill', scope.airWayBill)
      cy.log('manufacturingAirwayBill', scope.airWayBill)
    })
}

export default {
  openOrder: (coi) => {
    common.loginAs('steph');
    cy.visit('/manufacturing');
    cy.get('.manufacturing-row_coi')
      .contains('div', coi)
      .click();
  },

  collectionStatus: {
    //C39980
    viewDocumentButtonsEnabled: () => {
      inputChecker.checkState('div.step-view  div[data-test-id]:nth-of-type(5) button', 'not.be.disabled');
      inputChecker.checkState('div.step-view  div[data-test-id]:nth-of-type(6) button', 'not.be.disabled');
      inputChecker.checkState('div.step-view  div[data-test-id]:nth-of-type(7) button', 'not.be.disabled');
    }
  },

  verifyShipper: {
    previousHappyPathSteps: () => {
      m_steps.manufacturingCollectionSummary()
    },

    //C40047
    coiempty: () => {
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C40048
    checkWithInvalidCoiValues: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-lccp', `${coi}-FP-01`, 'not.be.visible', 'be.disabled');
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-lccp', `${coi}-APH-01`, 'not.be.visible', 'be.disabled')
      });
    },

    //C40049
    coiConfirmed: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-lccp', `${coi}`, 'not.be.visible', 'be.disabled')
      });
    },

    //C40050	
    checkForTheInfoSaved: () => {
      inputChecker.checkForTheInfoSavedClickingNextAndBack();
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    //C40051
    checkForBackButton: () => {
      inputChecker.checkDataSavingWithBackButton('not.be.disabled');
    }
  },

  shipmentReceiptChecklist: {
    previousHappyPathSteps: () => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '-lccp');
      })
    },

    // C40458
    invalidFourDigitEvoIsNo: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid="pass-button-shipping_container_intact"]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
        '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
        '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', 'not.be.enabled')
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', "name", 'not.be.enabled');
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', "111111", 'not.be.enabled');
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', "111", 'not.be.enabled');
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', "0", 'not.be.enabled');
    },

    // C40467
    invalidTamperSealNo: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', 'not.be.enabled')
    },


    // C40460
    toggleShippingCaseContainerCaseNeg: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker('[data-testid=pass-button-shipping_container_intact]');
      inputChecker.nextButtonCheck("not.be.enabled");
      inputHelpers.clicker('[data-testid=fail-button-shipping_container_intact]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_intact_reason-input"]');
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    // C40468
    toggleShippingCaseContaineWithReason: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_intact_reason-input"]', 'test1', 'be.enabled')
    },

    // C40461
    toggleShippingContainerSecuredNeg: () => {
      inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured_no_case"]');
      inputChecker.nextButtonCheck("not.be.enabled");
      inputHelpers.clicker('[data-testid="fail-button-zip_ties_secured_no_case"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]');
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    // C40474
    toggleShippingContainerSecuredWithReason: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]', 'test1', 'be.enabled')
    },

    // C40462
    toggleShipperLabelsNeg: () => {
      inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]');
      inputChecker.nextButtonCheck("not.be.enabled");
      inputHelpers.clicker('[data-testid="fail-button-shipper_label_placed"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/shipper_label_placed_reason-input"]');
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    // C40469
    toggleShipperLabelsWithReason: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/shipper_label_placed_reason-input"]', 'test1', 'be.enabled')
    },

    // C40463
    toggleConsigneeKitPouchNeg: () => {
      inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside"]');
      inputChecker.nextButtonCheck("not.be.enabled");
      inputHelpers.clicker('[data-testid="fail-button-consignee_pouch_inside"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]');
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    // C40470
    toggleConsigneeKitPouchWithReason: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]', 'test1', 'be.enabled')
    },

    // C40464
    toggleEvoIsNumberNeg: () => {
      inputHelpers.clicker('[data-testid="pass-button-evo_is_number"]');
      inputChecker.nextButtonCheck("not.be.enabled");
      inputHelpers.clicker('[data-testid="fail-button-evo_is_number"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_is_number_reason-input"]');
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    // C40473
    toggleEvoIsNumberwithReason: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_is_number_reason-input"]', 'test1', 'be.enabled')
    },

    // C40465
    toggleRedWireTamperSealNeg: () => {
      inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]');
      inputChecker.nextButtonCheck("not.be.enabled");
      inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_seal"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]');
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    // C40472
    toggleRedWireTamperSealwithReason: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]', 'test1', 'be.enabled')
    },

    // C40466
    toggleTamperSealNumberNeg: () => {
      inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
      inputChecker.nextButtonCheck("not.be.enabled");
      inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]');
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    // C40471
    toggleTamperSealNumberWithReason: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]', 'test1', 'be.enabled')
    },


    // C40457
    saveAndClosePos: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
      })
      inputChecker.nextButtonCheck("be.enabled");
    },

    // C40459
    reasonForChangeOnChangingValuePos: () => {
      inputHelpers.onClick('[data-testid="primary-button-action"]');
      inputChecker.backButtonCheck('[data-testid="back-nav-link"]');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.changedEvoIsNumber);
      inputChecker.reasonForChange();
    },
  },

  shipmentReceiptChecklistSummary: {
    previousHappyPathSteps: () => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '-lccp');
      })
      m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
    },

    // C40439
    nextButtonCheckWithOrWithoutSignature: () => {
      inputChecker.checkNextButtonWithAndWithoutSignature(2);
    },

    // C40440
    posAskToResign: () => {
      inputChecker.nextButtonCheck('be.enabled');
      inputChecker.backButtonCheck('[data-testid="back-nav-link"]');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.changedEvoIsNumber);
      inputChecker.reasonForChange();
      inputChecker.checkLabelAfterNext('[data-test-id="manufacturing_shipment_receipt_checklist_summary"]', '[data-testid=display-only] >>:nth(13)', regressionInput.manufacturing.changedEvoIsNumber)
      inputChecker.nextButtonCheck('be.disabled');

    },
  },

  transferProductToIntermediaryOrFinalLN2StoragePart1: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '-lccp');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
      })
    },

    //C32426
    nextButtonDisabled: () => {
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C32427
    checkConfirmButtonDisabledForLN2Shipper: () => {
      inputChecker.checkState('[data-testid="ln-2-shipper-1-button"]', 'be.disabled');
    },

    //C32428
    checkConfirmButtonDisabledForCassetteLabel: () => {
      inputChecker.checkState('[data-testid="cassette-1-button"]', 'be.disabled');
    },

    //C32429
    checkConfirmButtonDisabledForCoiOnTheBag: () => {
      inputChecker.checkState('[data-testid="bag-identifier-1-button"]', 'be.disabled');
    },

    //C32430
    checkConfirmButtonEnabledForLN2Shipper: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.clearField('[data-testid="ln-2-shipper-1-input"]');
        inputChecker.inputStringValue('[data-testid="ln-2-shipper-1-input"]', coi);
        inputChecker.checkState('[data-testid="ln-2-shipper-1-button"]', 'not.be.disabled');
      })
    },

    //C32431
    checkConfirmButtonEnabledForCassetteLabel: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.clearField('[data-testid="cassette-1-input"]');
        inputChecker.inputStringValue('[data-testid="cassette-1-input"]', `${coi}-PRC-01`);
        inputChecker.checkState('[data-testid="cassette-1-button"]', 'not.be.disabled');
      })
    },

    //C32432
    checkConfirmButtonEnabledForCoiOnTheBag: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.clearField('[data-testid="bag-identifier-1-input"]');
        inputChecker.inputStringValue('[data-testid="bag-identifier-1-input"]', `${coi}-PRC-01`);
        inputChecker.checkState('[data-testid="bag-identifier-1-button"]', 'not.be.disabled');
      })
    },

    //C32433
    scanAndConfirmAllCoi: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyMultiplePos('ln-2-shipper-1', coi, 'be.visible');
        inputChecker.scanAndVerifyMultiplePos('cassette-1', `${coi}-PRC-01`, 'be.visible');
        inputChecker.scanAndVerifyMultiplePos('bag-identifier-1', `${coi}-PRC-01`, 'be.visible');
        inputChecker.nextButtonCheck('not.be.disabled');
      })
    },

    //C32434
    saveAndClose: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations");
      })
      inputChecker.nextButtonCheck("be.enabled");
    },

    //C32435
    checkInvalidDataForLN2Shipper: () => {
      inputChecker.scanAndVerifyMultipleNeg('ln-2-shipper-1', 'abcdef');
      inputChecker.scanAndVerifyMultipleNeg('ln-2-shipper-1', '123456');
    },

    //C32436
    checkInvalidDataForCassetteLabel: () => {
      inputChecker.scanAndVerifyMultipleNeg('cassette-1', 'abcdef');
      inputChecker.scanAndVerifyMultipleNeg('cassette-1', '123456');
    },

    //C32437
    checkInvalidDataForBag: () => {
      inputChecker.scanAndVerifyMultipleNeg('bag-identifier-1', 'abcdef');
      inputChecker.scanAndVerifyMultipleNeg('bag-identifier-1', '123456');
    }
  },

  transferProductToIntermediaryOrFinalLN2StoragePart2: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '-lccp');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
      })
    },

    //C32438
    nextButtonEnabled: () => {
      inputChecker.nextButtonCheck('be.not.be.disabled');
    },

    //C32439
    checkConfirmButtonDisabledForLN2Shipper: () => {
      inputChecker.checkState('[data-testid="ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-lccp-action-trigger-button"]', 'be.disabled');
    },

    //C32440
    checkConfirmButtonDisabledForCassette: () => {
      inputChecker.checkState('[data-testid="cassette-1-button"]', 'be.disabled');
    },

    //C32441
    checkConfirmButtonEnabledForCassette: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.inputStringValue('[data-testid="cassette-1-input"]', `${coi}-PRC-01`);
        inputChecker.checkState('[data-testid="cassette-1-button"]', 'not.be.disabled');
      })
    },

    //C32442
    checkConfirmButtonEnabledForLN2Shipper: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.inputStringValue('[data-testid="ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-lccp-input-field"]', coi);
        inputChecker.checkState('[data-testid="ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-lccp-action-trigger-button"]', 'not.be.disabled');
        inputChecker.clearField('[data-testid="ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-lccp-input-field"]');
      })
    },

    //C32443
    checkInvalidDataForCassette: () => {
      inputChecker.scanAndVerifyMultipleNeg('cassette-1', 'abcdefg');
      inputChecker.clearField('[data-testid="cassette-1-input"]');
    },

    //C32444
    checkInvalidDataForLN2Shipper: () => {
      inputChecker.scanAndVerify('[data-testid="ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-lccp-input-field"]', '[data-testid="ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-lccp-action-trigger-button"]', 'abcdegf');
    }
  },

  productReceipt: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '-lccp');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
      })
    },

    subjectNumberNeg: () => {
      //C40933
      inputHelpers.clicker(['[data-testid="pass-button-ambient_temperature"]','[data-testid="pass-button-seal_in_place"]', '[data-testid="pass-button-expected_condition"]',
      '[data-testid="pass-button-free_from_cracks"]', '[data-testid="pass-button-placed_into_storage"]']);
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.scanAndVerifyCheck('patient-id', '1234', 'not.be.visible', 'be.disabled');
    },

    ambientTemperatureToggleNeg: (scope) => {
      //C40934
      inputChecker.scanAndVerifyCheck('patient-id', scope.patientInformation.subjectNumber, 'be.visible', 'not.be.disabled');
      inputChecker.clickOnCheck('[data-testid="pass-button-ambient_temperature"]','be.disabled');
      inputHelpers.clicker('[data-testid="fail-button-ambient_temperature"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/ambient_temperature_reason-input"]');
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    ambientTemperatureTogglePos: () => {
      //C40940
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/ambient_temperature_reason-input"]','test1');
      inputChecker.nextButtonCheck("be.enabled");
    },

    sealInPlaceToggleNeg: () => {
      //C40936
      inputHelpers.clicker('[data-testid="pass-button-ambient_temperature"]');
      inputChecker.clickOnCheck('[data-testid="pass-button-seal_in_place"]','be.disabled');
      inputHelpers.clicker('[data-testid="fail-button-seal_in_place"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]');
      inputChecker.nextButtonCheck("not.be.enabled");
    },
    sealInPlaceTogglePos: () => {
      //C40941
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]','test1');
      inputChecker.nextButtonCheck("be.enabled");
    },

    expectedConditionToggleNeg: () => {
      //C40937
      inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]');
      inputChecker.clickOnCheck('[data-testid="pass-button-expected_condition"]','be.disabled');
      inputHelpers.clicker('[data-testid="fail-button-expected_condition"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]');
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    expectedConditionTogglePos: () => {
      //C40942
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]','test1');
      inputChecker.nextButtonCheck("be.enabled");
    },

    freeFromCracksToggleNeg: () => {
      //C40938
      inputHelpers.clicker('[data-testid="pass-button-expected_condition"]');
      inputChecker.clickOnCheck('[data-testid="pass-button-free_from_cracks"]','be.disabled');
      inputHelpers.clicker('[data-testid="fail-button-free_from_cracks"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/free_from_cracks_reason-input"]');
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    freeFromCracksTogglePos: () => {
      //C40942
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/free_from_cracks_reason-input"]','test1');
      inputChecker.nextButtonCheck("be.enabled");
    },

    placedIntoStorageToggleNeg: () => {
      //C40939
      inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]');
      inputChecker.clickOnCheck('[data-testid="pass-button-placed_into_storage"]','be.disabled');
      inputHelpers.clicker('[data-testid="fail-button-placed_into_storage"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]');
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    placedIntoStorageTogglePos: () => {
      //C40944
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]','test1');
      inputChecker.nextButtonCheck("be.enabled");
    },

    saveAndClosePos: () => {
      //C40935
      inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]');
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations");
      })
    }
  },

  productReceiptSummary: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '-lccp');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
      })
      m_steps.manufacturingProductReceipt(scope.patientInformation);
    },

    verifySignaturePos: () => {
      // C32452
      inputChecker.checkNextButtonWithAndWithoutSignature('2')
    },
  },

  manufacturingStart: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '-lccp');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
      })
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(therapy, scope)
    },

    checkboxNeg: () => {
      // C32460
      inputChecker.nextButtonCheck('be.disabled')
    },

    saveAndClosePos: () => {
      // C32463
      inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]');
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      })
      inputChecker.nextButtonCheck('be.enabled')
    }
  },

  selectExpiryData: {
    previousHappyPathSteps: (scope, therapy) => {
      //cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '-lccp');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
      })
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(therapy, scope)
      m_steps.manufacturingStart();
    },

    dataNotEntered: () => {
      //C32464
      inputHelpers.inputSingleField("[id='#/properties/lot_number-input']", regressionInput.manufacturing.inputNothing);
      inputHelpers.inputDateField("input[id='#/properties/item_expiry_date-input']", regressionInput.manufacturing.inputNothing)
      inputHelpers.inputSingleField("[id='#/properties/item_count-input']", regressionInput.manufacturing.inputNothing)
      inputChecker.nextButtonCheck('be.disabled');
    },

    invalidDateEntered: () => {
      //C32465
      inputHelpers.inputDateField("input[id='#/properties/item_expiry_date-input']", regressionInput.manufacturing.invalidExpiryDate)
      inputChecker.nextButtonCheck('be.disabled');

    },
    validDateEntered: () => {
      //C32466
      inputHelpers.inputDateField("input[id='#/properties/item_expiry_date-input']", regressionInput.manufacturing.validExpiryDateOne)

    },
    validNumberOfBagsEntered: () => {
      //C32467
      inputHelpers.inputSingleField('[id="#/properties/item_count-input"]', input.noOfBags)
    },

    invalidNumberOfBagsEntered: () => {
      //C32468
      inputHelpers.inputSingleField('[id="#/properties/item_count-input"]', regressionInput.manufacturing.invalidNumberofBags)
    },

    dateAndBagConfirmed: () => {
      //C32470
      inputHelpers.inputSingleField("[id='#/properties/lot_number-input']", input.lotNumber);
      inputHelpers.inputDateField("input[id='#/properties/item_expiry_date-input']", regressionInput.manufacturing.validExpiryDate)
      inputHelpers.inputSingleField('[id="#/properties/item_count-input"]', regressionInput.manufacturing.validNumberofBags)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    dataOnSaveAndClose: () => {
      //C32469
      inputHelpers.inputSingleField("[id='#/properties/lot_number-input']", input.lotNumber);
      inputHelpers.inputDateField("input[id='#/properties/item_expiry_date-input']", regressionInput.manufacturing.validExpiryDate)
      inputHelpers.inputSingleField('[id="#/properties/item_count-input"]', regressionInput.manufacturing.validNumberofBags)
      inputChecker.nextButtonCheck('not.be.disabled')
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
      })
    },
  },

  confirmExpiryData: {
    previousHappyPathSteps: (scope, therapy) => {
      //cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '-lccp');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
      })
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(therapy, scope)
      m_steps.manufacturingStart();
      m_steps.manufacturingSelectExpiryData();
    },
    signatureNotDone: () => {
      //C32471
      inputChecker.checkState("[data-testid='approver-sign-button']", "not.be.disabled")
      inputChecker.checkState("[data-testid='verifier-sign-button']", "be.disabled")
      inputChecker.nextButtonCheck('be.disabled');
    },
    signForConfirmerEnabled: () => {
      //C32472
      inputChecker.checkState("[data-testid='approver-sign-button']", "not.be.disabled")
    },
    signForVerifierDisabled: () => {
      //C32473
      inputChecker.checkState("[data-testid='verifier-sign-button']", "be.disabled")
    },

    checkNextButtonWithSignature: () => {
      //C32474
      inputChecker.checkNextButtonWithAndWithoutSignature('2')
    },
    askToResign: () => {
      //C32476
      cy.get(`[data-testid="back-nav-link"]`).click();
      inputChecker.nextButtonCheck('not.be.disabled')
      inputHelpers.inputSingleField('[id="#/properties/lot_number-input"]', regressionInput.manufacturing.lotNumberOne)
      inputChecker.reasonForChange();
      inputChecker.checkState("[data-testid='approver-sign-button']", "not.be.disabled")
      inputChecker.checkState("[data-testid='verifier-sign-button']", "be.disabled")
      inputChecker.nextButtonCheck('be.disabled')
    },
  },



  printFinalProductLabels: {
    previousHappyPathSteps: (scope, therapy) => {
      //cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '-lccp');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
      })
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(therapy, scope)
      m_steps.manufacturingStart();
      m_steps.manufacturingSelectExpiryData();
      m_steps.manufacturingConfirmExpiryData();
    },

    printLablesClickable: () => {
      //C40122	
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.popupMessageVisible('btn-print', 'banner-container-0');
    },

    confirmPrintLabelNeg: () => {
      //C40123
      inputChecker.nextButtonCheck('be.disabled');
    },

    confirmPrintLabelPos: () => {
      //C40124
      cy.reload();
      inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]');
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    signToConfirmAppearNextDisabledNeg: () => {
      //C40125
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      })
      actionButtonsHelper.checkActionButtonIsEnabled('primary'); //[BUG] Next button should be disabled without Signature
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature']);
    },

    checkForInfoSaved: (scope) => {
      //C40126
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Patients")
      inputChecker.nextButtonCheck('not.be.disabled')
    }
  },

  confirmationOfLabelApplication: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '-lccp');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
      })
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(therapy, scope)
      m_steps.manufacturingStart();
      m_steps.manufacturingSelectExpiryData();
      m_steps.manufacturingConfirmExpiryData();
      m_steps.manufacturingFinalLabels();
    },

    noOptionSelectedNeg: () => {
      //C40131	
      inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    seventyMLButtonSelectedPos: () => {
      //C40127
      cy.reload();
      inputHelpers.clicker('[data-testid="right-button-radio"]');
      inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]');
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    checkboxUncheckedThirtyMLSelectedNeg: () => {
      //C40128	
      cy.reload();
      inputHelpers.clicker('[data-testid="left-button-radio"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    checkboxUncheckedSeventyMLSelectedNeg: () => {
      //C40129	
      cy.reload();
      inputHelpers.clicker('[data-testid="right-button-radio"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    checkForInfoSaved: (scope) => {
      //C40130	
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Patients")
      inputChecker.nextButtonCheck('not.be.disabled')
    }
  },

  confirmationOfLabelApplicationPart2: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '-lccp');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
        m_steps.manufacturingProductReceipt(scope.patientInformation);
        m_steps.manufacturingProductReceiptSummary(therapy, scope)
        m_steps.manufacturingStart();
        m_steps.manufacturingSelectExpiryData();
        m_steps.manufacturingConfirmExpiryData();
        m_steps.manufacturingFinalLabels();
        m_steps.manufacturingLabelApplicationIS(coi);
      })
    },

    //C32491
    confirmButtonDisabledforCoiBag: () => {
      inputChecker.checkState('[data-testid="bag-identifier-1-button"]', 'be.disabled');
    },

    //C32492
    confirmButtonDisbaledForCassette: () => {
      inputChecker.checkState('[data-testid="cassette-1-button"]', 'be.disabled');
    },

    //C32493
    confirmButtonEnabledForCoiBag: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.inputStringValue('[data-testid="bag-identifier-1-input"]', `${coi}-FPS-01`);
        inputChecker.checkState('[data-testid="bag-identifier-1-button"]', 'not.be.disabled');
      });
    },

    //C32494
    confirmButtonEnabledForcassette: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.inputStringValue('[data-testid="cassette-1-input"]', `${coi}-FPS-01`);
        inputChecker.checkState('[data-testid="cassette-1-button"]', 'not.be.disabled');
      });
    },

    //C40931
    invalidDataForCoiBag: () => {
      inputChecker.scanAndVerifyMultipleNeg('bag-identifier-1', 'abcdef');
      inputChecker.scanAndVerifyMultipleNeg('bag-identifier-1', '12345');
    },

    //C40932
    invalidDataForCassette: () => {
      inputChecker.scanAndVerifyMultipleNeg('cassette-1', 'abcdef');
      inputChecker.scanAndVerifyMultipleNeg('cassette-1', '12345');
    },

    //C32495
    confirmCheckboxUnchecked:  () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyMultiplePos('bag-identifier-1', `${coi}-FPS-01`, 'not.be.disabled');
        inputChecker.scanAndVerifyMultiplePos('cassette-1', `${coi}-FPS-01`, 'not.be.disabled');
        inputChecker.checkState('[data-testid="primary-button-action"]', 'be.disabled');
      })
    },

    //C32496
    confirmCheckboxChecked: () => {
      inputHelpers.clicker('[id="#/properties/data/properties/destruction_confirmed"]');
      inputChecker.checkState('[data-testid="primary-button-action"]', 'not.be.disabled');
    },

    //C32498
    saveAndClose: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations");
      });
      inputChecker.nextButtonCheck("be.enabled");
    }
  },

  qualityRelease : {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '-lccp');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
        m_steps.manufacturingProductReceipt(scope.patientInformation);
        m_steps.manufacturingProductReceiptSummary(therapy, scope)
        m_steps.manufacturingStart();
        m_steps.manufacturingSelectExpiryData();
        m_steps.manufacturingConfirmExpiryData();
        m_steps.manufacturingFinalLabels(therapy);
        m_steps.manufacturingLabelApplication(scope.coi);
       },)

      },
     nextButtonDisabledNeg: () => {
      //C32499
      inputChecker.nextButtonCheck('be.disabled');
    },
    nextButtonAfterTicking: () => {
      // C32501
      inputHelpers.clicker('[id="#/properties/data/properties/is_verified"]');
      inputChecker.nextButtonCheck('be.enabled')
    },
    signButtonEnabledAfterClickingNext: () => {
      // C32503
      cy.get('[data-testid="primary-button-action"]').click();
      inputChecker.checkState("[data-testid='approver-sign-button']", "not.be.disabled")
    },
    nextButtonAfterSignature: () => {
      // C32504
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.nextButtonCheck('be.enabled')
    }
  
  },
  
   bagSelection: {
    previousHappyPathSteps: (scope, therapy) => {
      //cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
        m_steps.manufacturingCollectionSummary();
        cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '-lccp');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
        m_steps.manufacturingProductReceipt(scope.patientInformation);
        m_steps.manufacturingProductReceiptSummary(therapy, scope);
        m_steps.manufacturingStart();
        m_steps.manufacturingLotNumber();
        m_steps.manufacturingConfirmExpiryDate();
        m_steps.manufacturingFinalLabels();
        m_steps.manufacturingLabelApplication(coi);
        m_steps.manufacturingQualityRelease();
      });
    },
     nextButtonDisabledNeg: () => {
      // C32505
      inputChecker.nextButtonCheck('be.disabled');
    },
    doNotShipBag : () => {
      // C40362
      inputHelpers.clicker('[data-testid="fail-button-0"]')
      inputChecker.nextButtonCheck('be.disabled')
    },
    shipBag : ()=> {
      // C40364
      inputHelpers.clicker('[data-testid="pass-button-0"]')
      inputChecker.nextButtonCheck('not.be.disabled')
    },
    saveAndClosePos : () => {
      // C32511
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      },)
    }
 
},                
  
  transferProductToShipper: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(scope.coi, 'apheresis-site', '-lccp');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
        m_steps.manufacturingProductReceipt(scope.patientInformation);
        m_steps.manufacturingProductReceiptSummary(therapy, scope)
        m_steps.manufacturingStart();
        m_steps.manufacturingSelectExpiryData();
        m_steps.manufacturingConfirmExpiryData();
        m_steps.manufacturingFinalLabels(therapy);
        m_steps.manufacturingLabelApplication(scope.coi);
        m_steps.manufacturingQualityRelease();
        m_steps.manufacturingBagSelection();
      })

    },
       // C40447
    invalidBagIdentifier: () => {
      inputChecker.scanAndVerifyFieldAsEmpty('cassette-1', 'be.disabled');
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyMultipleNeg('cassette-1', `${coi}-FP-01`)
        inputChecker.scanAndVerifyMultipleNeg('cassette-1', `${coi}-APH-01`)
        inputChecker.scanAndVerifyMultipleNeg('cassette-1', `${coi}-PRC-01`)
        inputChecker.scanAndVerifyMultipleNeg('cassette-1', `${coi}`)
      })
    },

    // C40448
    invalidCoiForShipperLabel: () => {
      inputHelpers.clicker(['[data-testid="pass-button-manufacturing_checklist_intact"]',
        '[data-testid="pass-button-manufacturing_checklist_temp_out_of_range"]']);
      cy.get(`@coi`).then(coi => {

        inputHelpers.scanAndVerifyBags('cassette-1', `${coi}-FPS-01`);
        inputChecker.scanAndVerifyFieldAsEmpty('ln-2-shipper-1', 'be.disabled');
        inputChecker.scanAndVerifyMultipleNeg('ln-2-shipper-1', `${coi}-PRC-01`)
        inputChecker.scanAndVerifyMultipleNeg('ln-2-shipper-1', `${coi}-APH-01`)
        inputChecker.scanAndVerifyMultipleNeg('ln-2-shipper-1', `${coi}-FPS-01`)
      });
    },

    // C40454
    negNothingSelectedForIsShippingContainer: () => {
      cy.get(`@coi`).then(coi => {
        inputHelpers.scanAndVerifyBags('ln-2-shipper-1', coi);
      });
      inputHelpers.clicker('[data-testid="pass-button-manufacturing_checklist_intact"]');
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C40453
    negToggleSelectedShippingContainerIntact: () => {
      inputHelpers.clicker('[data-testid="fail-button-manufacturing_checklist_intact"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/manufacturing_checklist_intact_reason-input"]');
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C40451
    posToggleIsShippingContainerIntact: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/manufacturing_checklist_intact_reason-input"]', 'some reason', "be.enabled");
    },

    // C40456
    negNothingSelectedForWasThereATemperature: () => {
      inputHelpers.clicker('[data-testid="pass-button-manufacturing_checklist_temp_out_of_range"]');
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C40455
    negToggleWasThereATemperature: () => {
      inputHelpers.clicker('[data-testid="fail-button-manufacturing_checklist_temp_out_of_range"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/manufacturing_checklist_temp_out_of_range_reason-input"]');
    },

    // C40452
    posToggleWasThereATemperature: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/manufacturing_checklist_temp_out_of_range_reason-input"]', 'some reason', "be.enabled");
    },

    // C40450
    posSaveAndCloseButtonCheck: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations");
      });
      inputChecker.checkForGreenCheck("cassette-1");
      inputChecker.checkForGreenCheck("ln-2-shipper-1");
      inputChecker.nextButtonCheck("be.enabled");
    },
  },
  
  shippingManufacturing: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '-lccp');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
        m_steps.manufacturingProductReceipt(scope.patientInformation);
        m_steps.manufacturingProductReceiptSummary(therapy, scope);
        m_steps.manufacturingStart();
        m_steps.manufacturingLotNumber();
        m_steps.manufacturingConfirmExpiryDate();
        m_steps.manufacturingFinalLabels();
        m_steps.manufacturingLabelApplication(coi);
        m_steps.manufacturingQualityRelease();
        m_steps.manufacturingBagSelection();
        m_steps.manufacturingTransferProductToShipper(coi);
      })
    },
    // C40410	
    negAirWaybillNotConfirmed: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputChecker.keepFieldsEmpty('manufacturing-airway-bill', 'be.disabled');
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C40411
    negSubjectNumberOnAirWaybillNotEntered: (scope) => {
      getManufAirWayBill(scope, 1);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid="pass-button-investigational_product"]', '[data-testid="pass-button-cry_rack_label"]',
        '[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire_tamper_shipper"]',
        '[data-testid="pass-button-tamper_seal_match"]', '[data-testid="pass-button-shipper_label_placed"]',
        '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]']);
      inputChecker.checkForGreenCheck("manufacturing-airway-bill");
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', 'be.disabled')
    },

    // C40412
    invalidEvoIsNumber: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', 'be.disabled')
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', "name", 'not.be.enabled');
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', "111111", 'not.be.enabled');
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', "111", 'not.be.enabled');
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', "0", 'not.be.enabled');
    },

    // C40413 
    negTamperSealNumberFieldLeftEmpty: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', 'be.disabled')
    },

    // C40414
    negNothingSelectedForConfirmInvestigational: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker('[data-testid="pass-button-investigational_product"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C40415
    negToggleConfirmInvestigational: () => {
      inputHelpers.clicker('[data-testid="fail-button-investigational_product"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/investigational_product_reason-input"]');
    },

    // C40416
    posToggleConfirmInvestigational: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/investigational_product_reason-input"]', 'some reason', "be.enabled");
    },

    // C40417
    negNothingSelectedForIsRedWireTamperSeal: () => {
      inputHelpers.clicker('[data-testid="pass-button-cry_rack_label"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C40418
    negToggleIsRedWireTamperSeal: () => {
      inputHelpers.clicker('[data-testid="fail-button-cry_rack_label"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/cry_rack_label_reason-input"]');
    },

    // C40419
    posToggleIsRedWireTamperSeal: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/cry_rack_label_reason-input"]', 'some reason', "be.enabled");
    },

    // C40420
    negNothingSelectedForDoesEvoIsNumberListed: () => {
      inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C40421
    negToggleDoesEvoIsNumberListed: () => {
      inputHelpers.clicker('[data-testid="fail-button-evo_airway_bill"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/evo_airway_bill_reason-input"]');
    },

    // C40422
    posToggleDoesEvoIsNumberListed: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/evo_airway_bill_reason-input"]', 'some reason', "be.enabled");
    },


    // C40423
    negNothingSelectedForIsTamperSealInPlace: () => {
      inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C40424
    negToggleIsTamperSealInPlace: () => {
      inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_shipper"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_shipper_reason-input"]');
    },

    // C40425
    posToggleIsTamperSealInPlace: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_shipper_reason-input"]', 'some reason', "be.enabled");
    },

    // C40426
    negNothingSelectedForDoesTamperSealNumber: () => {
      inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C40427
    negToggleDoesTamperSealNumberListed: () => {
      inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_match_reason-input"]');
    },

    // C40428
    posToggleDoesTamperSealNumberListed: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_match_reason-input"]', 'some reason', "be.enabled");
    },

    // C40429
    negNothingSelectedForIsShipperLabelsIncluded: () => {
      inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C40430
    negToggleIsShipperLabelsIncluded: () => {
      inputHelpers.clicker('[data-testid="fail-button-shipper_label_placed"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/shipper_label_placed_reason-input"]');
    },


    // C40431
    posToggleIsShipperLabelsIncluded: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/shipper_label_placed_reason-input"]', 'some reason', "be.enabled");
    },

    // C40432
    negNothingSelectedForIsConsigneeKitPouch: () => {
      inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C40433
    negToggleIsConsigneeKitPouch: () => {
      inputHelpers.clicker('[data-testid="fail-button-consignee_kit_pouch_inside"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/consignee_kit_pouch_inside_reason-input"]');
    },

    // C40434
    posToggleIsConsigneeKitPouch: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/consignee_kit_pouch_inside_reason-input"]', 'some reason', "be.enabled");
    },

    // C40435
    negNothingSelectedForIsShippingContainer: () => {
      inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C40436
    negToggleIsShippingContainerSecured: () => {
      inputHelpers.clicker('[data-testid="fail-button-zip_ties_secured"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/zip_ties_secured_reason-input"]');
    },

    // C40437
    posToggleIsShippingContainerSecured: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/zip_ties_secured_reason-input"]', 'some reason', "be.enabled");
    },

    // C40438
    posSaveAndCloseButtonCheck: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations");
      });
      inputChecker.checkForGreenCheck("manufacturing-airway-bill");
      inputChecker.nextButtonCheck("be.enabled");
    },
  },

  shippingManufacturingSummary: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(scope.coi, 'apheresis-site', '-lccp');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
        m_steps.manufacturingProductReceipt(scope.patientInformation);
        m_steps.manufacturingProductReceiptSummary(therapy, scope);
        m_steps.manufacturingStart();
        m_steps.manufacturingLotNumber();
        m_steps.manufacturingConfirmExpiryDate();
        m_steps.manufacturingFinalLabels();
        m_steps.manufacturingLabelApplication(coi);
        m_steps.manufacturingQualityRelease();
        m_steps.manufacturingBagSelection();
        m_steps.manufacturingTransferProductToShipper(coi);
        m_steps.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, therapy);
      });
    },

    // C40442
    posCheckForEditButtonWorking: () => {
      inputHelpers.clicker('[data-testid="edit-shipping_manufacturing"]')
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.changedTamperSealNumber);
      inputChecker.reasonForChange()
      inputChecker.checkValue('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.changedTamperSealNumber);
    },

    // C40443
    negDoneButtonCheck: () => {
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.nextButtonCheck("be.disabled");
    },

    // C40444
    posDoneButtonCheck: () => {
      const verifier = 'quela@vineti.com';
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], verifier);
      inputChecker.nextButtonCheck("be.enabled");
    },

    // C40445
    posReasonForChangePopUp: () => {
      inputChecker.nextButtonCheck('be.enabled');
      inputChecker.backButtonCheck('[data-testid="back-nav-link"]');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.changedEvoIsNumber);
      inputChecker.reasonForChange();
      inputChecker.nextButtonCheck('be.disabled');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      const verifier = 'quela@vineti.com';
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], verifier);
      inputChecker.nextButtonCheck("be.enabled");
    },

    // C40446
    posSaveAndCloseButtonCheck: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations");
      });
      inputChecker.nextButtonCheck("be.enabled");
    }
  },

  checkStatusOfManufacturingModule: (scope, therapy) => {
    cy.openOrder('manufacturing', 'steph')
    cy.get(`@coi`).then((coi) => {
      cy.commonPagination(coi, 'Reservations')

      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi, regressionInput.manufacturing.statuses.collectionStatus, 'Reservations', 4)
      m_steps.manufacturingCollectionSummary()

      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi, regressionInput.manufacturing.statuses.verifyShipper, 'Reservations', 4)
      m_steps.manufacturingVerifyShipper(coi, 'apheresis-site', '-lccp');

      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi, regressionInput.manufacturing.statuses.shipmentReceiptChecklist, 'Reservations', 4)
      m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);

      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi, regressionInput.manufacturing.statuses.shipmentReceiptChecklistSummary, 'Reservations', 4)
      m_steps.manufacturingShipmentReceiptChecklistSummary(scope);

      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi, regressionInput.manufacturing.statuses.transferProductToStorage1, 'Reservations', 4)
      m_steps.manufacturingTransferProductToStorage(coi);

      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi, regressionInput.manufacturing.statuses.transferProductToStorage2, 'Reservations', 4)
      m_steps.manufacturingTransferProductToStorage2(coi);

      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi, regressionInput.manufacturing.statuses.productReceipt, 'Reservations', 4)
      m_steps.manufacturingProductReceipt(scope.patientInformation);

      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi, regressionInput.manufacturing.statuses.productReceiptSummary, 'Reservations', 4)
      m_steps.manufacturingProductReceiptSummary(therapy, scope);

      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi, regressionInput.manufacturing.statuses.manufacturingStart, 'Reservations', 4)
      m_steps.manufacturingStart();

      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi, regressionInput.manufacturing.statuses.selectExpiryData, 'Reservations', 4)
      m_steps.manufacturingSelectExpiryData();

      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi, regressionInput.manufacturing.statuses.confirmExpiryData, 'Reservations', 4)
      m_steps.manufacturingConfirmExpiryData();

      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi, regressionInput.manufacturing.statuses.printFinalProductLabels, 'Reservations', 4)
      m_steps.manufacturingFinalLabels(therapy);

      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi, regressionInput.manufacturing.statuses.confirmLabelApplication1, 'Reservations', 4)
      m_steps.manufacturingLabelApplication(coi);

      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi, regressionInput.manufacturing.statuses.qualityRelease, 'Reservations', 4)
      m_steps.manufacturingQualityRelease();

      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi, regressionInput.manufacturing.statuses.bagSelection, 'Reservations', 4)
      m_steps.manufacturingBagSelection();

      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi, regressionInput.manufacturing.statuses.transferProductToShipper, 'Reservations', 4)
      m_steps.manufacturingTransferProductToShipper(coi);

      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi, regressionInput.manufacturing.statuses.shippingManufacturing, 'Reservations', 4)
      m_steps.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, therapy);

      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi, regressionInput.manufacturing.statuses.shippingManufacturingSummary, 'Reservations', 4)
      m_steps.manufacturingShippingManufacturingSummary(therapy);

      cy.checkStatus(coi, regressionInput.manufacturing.statuses.shippingSummary, 'Reservations', 4)
    })
  }
}
