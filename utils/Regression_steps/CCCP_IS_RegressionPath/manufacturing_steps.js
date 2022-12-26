import common from '../../../support/index.js'
import dayjs from 'dayjs';
import input from '../../../fixtures/inputs.json';
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers'
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers'
import regressionInput from '../../../fixtures/inputsRegression.json'
import m_steps from '../../../utils/HappyPath_steps/CCCP_IS_HappyPath/manufacturing_steps';

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

  collectionStatus: {
    //	C33915
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

    //C33786
    invalidCoi: () => {
     inputChecker.clearValueAndCheckForButton('[data-testid=ln-2-shipper-ship-bags-from-satellite-lab-to-manufacturing-site-cccp-is-input-field]','be.disabled')
    cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-satellite-lab-to-manufacturing-site-cccp-is', `${coi}-FP-01`, 'not.be.visible', 'be.disabled');
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-satellite-lab-to-manufacturing-site-cccp-is', `${coi}-APH-01`, 'not.be.visible', 'be.disabled')
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-satellite-lab-to-manufacturing-site-cccp-is', `${coi}-PRC-01`, 'not.be.visible', 'be.disabled');
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-satellite-lab-to-manufacturing-site-cccp-is', `${coi}`, 'be.visible', 'not.be.disabled');
      });
    },

    //C33790
    checkForBackButton: () => {
      inputHelpers.onClick('[data-testid="primary-button-action"]')
      inputChecker.checkDataSavingWithBackButton('not.be.disabled');
    }
  },

  shipmentReceiptChecklist: {
    previousHappyPathSteps: () => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '-cccp-is');
      })
    },

    //C33796
    invalidFourDigitEvoIsNo: ()  => {
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker(['[data-testid="pass-button-shipping_container_intact"]', '[data-testid="pass-button-zip_ties_secured_no_case"]',
      '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_pouch_inside"]', '[data-testid="pass-button-evo_is_number"]',
      '[data-testid="pass-button-red_wire_tamper_seal"]', '[data-testid="pass-button-tamper_seal_match"]']);
      inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]','not.be.enabled')
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', "name",'not.be.enabled');
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', "111111",'not.be.enabled'); 
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', "111",'not.be.enabled'); 
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', "0",'not.be.enabled'); 
    },

    //C38916
    invalidTamperSealNo: ()  => {
        inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
        inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]','not.be.enabled')
      },


    // C21917
    toggleShippingCaseContainerCaseNeg: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker('[data-testid=pass-button-shipping_container_intact]');
      inputChecker.nextButtonCheck("not.be.enabled");
      inputHelpers.clicker('[data-testid=fail-button-shipping_container_intact]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_intact_reason-input"]');
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    //C39198
    toggleShippingCaseContaineWithReason: () => {
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_intact_reason-input"]','test1','be.enabled')
    },

   //C38910
    toggleShippingContainerSecuredNeg: () => {
        inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured_no_case"]');
        inputChecker.nextButtonCheck("not.be.enabled");
        inputHelpers.clicker('[data-testid="fail-button-zip_ties_secured_no_case"]');
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]');
        inputChecker.nextButtonCheck("not.be.enabled");
      },

    //C39204
      toggleShippingContainerSecuredWithReason: () => {
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]','test1','be.enabled')
      },

      //C38911
      toggleShipperLabelsNeg: () => {
        inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]');
        inputChecker.nextButtonCheck("not.be.enabled");
        inputHelpers.clicker('[data-testid="fail-button-shipper_label_placed"]');
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/shipper_label_placed_reason-input"]');
        inputChecker.nextButtonCheck("not.be.enabled");
      },

      //C39199
      toggleShipperLabelsWithReason: () => {
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/shipper_label_placed_reason-input"]','test1','be.enabled')
      },

      //C38912
      toggleConsigneeKitPouchNeg: () => {
        inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside"]');
        inputChecker.nextButtonCheck("not.be.enabled");
        inputHelpers.clicker('[data-testid="fail-button-consignee_pouch_inside"]');
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]');
        inputChecker.nextButtonCheck("not.be.enabled");
      },

      //C39200
      toggleConsigneeKitPouchWithReason: () => { 
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]','test1','be.enabled')
      },

      //C38913
      toggleEvoIsNumberNeg: () => {
        inputHelpers.clicker('[data-testid="pass-button-evo_is_number"]');
        inputChecker.nextButtonCheck("not.be.enabled");
        inputHelpers.clicker('[data-testid="fail-button-evo_is_number"]');
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_is_number_reason-input"]');
        inputChecker.nextButtonCheck("not.be.enabled");
      },

      //C39201
      toggleEvoIsNumberwithReason: () => {
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_is_number_reason-input"]','test1','be.enabled')
      },

      //C38914
      toggleRedWireTamperSealNeg: () => {
        inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]');
        inputChecker.nextButtonCheck("not.be.enabled");
        inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_seal"]');
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]');
        inputChecker.nextButtonCheck("not.be.enabled");
      },

      //	C39202
      toggleRedWireTamperSealwithReason: () => {
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]','test1','be.enabled')
      },

      //C38914
      toggleTamperSealNumberNeg: () => {
        inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
        inputChecker.nextButtonCheck("not.be.enabled");
        inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]');
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]');
        inputChecker.nextButtonCheck("not.be.enabled");
      },

      //C39203
      toggleTamperSealNumberWithReason: () => {
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]','test1','be.enabled')
      },


    //C33795
    saveAndClosePos: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
      })
      inputChecker.nextButtonCheck("be.enabled");
    },
    
   //	C33797
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
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '-cccp-is');
      })
      m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
    },

    // C33798
    nextButtonCheckWithOrWithoutSignature: () => {
      inputChecker.checkNextButtonWithAndWithoutSignature(2);
    },

    // C33803
    posAskToResign: () => {
      inputChecker.nextButtonCheck('be.enabled');
      inputChecker.backButtonCheck('[data-testid="back-nav-link"]');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.changedEvoIsNumber);
      inputChecker.reasonForChange();
      inputChecker.checkLabelAfterNext('[data-test-id="manufacturing_shipment_receipt_checklist_summary"]', '[data-testid=display-only] >>:nth(13)', regressionInput.manufacturing.changedEvoIsNumber)
      inputChecker.nextButtonCheck('be.disabled');
    },  
  },

  transferProductToStorage1: {
    previousHappyPathSteps: (scope) => {
        m_steps.manufacturingCollectionSummary();
        cy.get(`@coi`).then(coi => {
          m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '-cccp-is');
        })
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope)
    },
    //C33805
    negLn2Shipper: () => {
        inputChecker.keepFieldsEmptymultiBags("ln-2-shipper-1", "be.disabled")
        cy.get(`@coi`).then(coi => {
            inputChecker.scanAndVerifyMultipleNeg("ln-2-shipper-1", coi+`-FP-0${1}`)
            inputChecker.scanAndVerifyMultipleNeg("ln-2-shipper-1", coi+`-APH-0${1}`)
            inputChecker.scanAndVerifyMultipleNeg("ln-2-shipper-1", coi+`-PRC-0${1}`)
            inputChecker.nextButtonCheck("be.disabled");
        })
    },
    //C33815
    negCassetteLabel: () => {
        inputChecker.keepFieldsEmptymultiBags("cassette-1", "be.disabled")
        cy.get(`@coi`).then(coi => {
            inputChecker.scanAndVerifyMultiplePos("ln-2-shipper-1",coi,"be.visible")
            inputChecker.scanAndVerifyMultipleNeg("cassette-1", coi+`-FP-0${1}`)
            inputChecker.scanAndVerifyMultipleNeg("cassette-1", coi+`-APH-0${1}`)
            inputChecker.scanAndVerifyMultipleNeg("cassette-1", coi)
        })
        inputChecker.nextButtonCheck("be.disabled");
    },
    //C33816
    negBag: () => {
        inputChecker.keepFieldsEmptymultiBags("bag-identifier-1", "be.disabled")
        cy.get(`@coi`).then(coi => {
            inputChecker.scanAndVerifyMultiplePos("cassette-1",coi+`-PRC-0${1}`,"be.visible")
            inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1", coi+`-FP-0${1}`)
            inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1", coi+`-APH-0${1}`)
            inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1", coi)
        })
        inputChecker.nextButtonCheck("be.disabled");
            
    },
    //C33813
    saveAndClosePos: () => {
        cy.get(`@coi`).then(coi => {
            inputChecker.scanAndVerifyMultiplePos("bag-identifier-1",coi+`-PRC-0${1}`,"be.visible")
            inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
        })
        inputChecker.checkGreenCheckMarkVisibilityMultiBags("ln-2-shipper-1")
        inputChecker.checkGreenCheckMarkVisibilityMultiBags("cassette-1")
        inputChecker.checkGreenCheckMarkVisibilityMultiBags("bag-identifier-1")
        inputChecker.nextButtonCheck("be.enabled")
    }
  },

  transferProductToStorage2: {
    previousHappyPathSteps: (scope) => {
        m_steps.manufacturingCollectionSummary();
        cy.get(`@coi`).then(coi => {
          m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '-cccp-is');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope)
        m_steps.manufacturingTransferProductToStorage(coi)
        })
      },
    //C33817
    posNextButtonCheck: () => {
        inputChecker.nextButtonCheck("be.enabled")
    }
  },

  productReceipt: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '-cccp-is')
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber)
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope)
        m_steps.manufacturingTransferProductToStorage(coi)
        m_steps.manufacturingTransferProductToStorage2(coi)
      })
    },

    subjectNumberNeg: () => {
      // C33828
      inputHelpers.clicker(['[data-testid="pass-button-ambient_temperature"]','[data-testid="pass-button-seal_in_place"]', '[data-testid="pass-button-expected_condition"]',
      '[data-testid="pass-button-free_from_cracks"]', '[data-testid="pass-button-placed_into_storage"]'])
      inputChecker.nextButtonCheck('be.disabled')
      inputChecker.scanAndVerifyCheck('patient-id', '1234', 'not.be.visible', 'be.disabled')
    },

    ambientTemperatureToggleNeg: (scope) => {
      // C33829
      inputChecker.scanAndVerifyCheck('patient-id', scope.patientInformation.subjectNumber, 'be.visible', 'not.be.disabled')
      inputChecker.clickOnCheck('[data-testid="pass-button-ambient_temperature"]','be.disabled')
      inputHelpers.clicker('[data-testid="fail-button-ambient_temperature"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/ambient_temperature_reason-input"]')
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    ambientTemperatureTogglePos: () => {
       // C33852
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/ambient_temperature_reason-input"]','test1')
      inputChecker.nextButtonCheck("be.enabled");
    },

    sealInPlaceToggleNeg: () => {
      // C33847
      inputHelpers.clicker('[data-testid="pass-button-ambient_temperature"]')
      inputChecker.clickOnCheck('[data-testid="pass-button-seal_in_place"]','be.disabled')
      inputHelpers.clicker('[data-testid="fail-button-seal_in_place"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]')
      inputChecker.nextButtonCheck("not.be.enabled");
    },
    sealInPlaceTogglePos: () => {
      // C33853
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]','test1')
      inputChecker.nextButtonCheck("be.enabled");
    },

    expectedConditionToggleNeg: () => {
      // C33848
      inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
      inputChecker.clickOnCheck('[data-testid="pass-button-expected_condition"]','be.disabled')
      inputHelpers.clicker('[data-testid="fail-button-expected_condition"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]')
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    expectedConditionTogglePos: () => {
      // C33854
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]','test1')
      inputChecker.nextButtonCheck("be.enabled");
    },

    freeFromCracksToggleNeg: () => {
      // // C33850
      inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
      inputChecker.clickOnCheck('[data-testid="pass-button-free_from_cracks"]','be.disabled')
      inputHelpers.clicker('[data-testid="fail-button-free_from_cracks"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/free_from_cracks_reason-input"]')
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    freeFromCracksTogglePos: () => {
      // C33855
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/free_from_cracks_reason-input"]','test1')
      inputChecker.nextButtonCheck("be.enabled");
    },

    placedIntoStorageToggleNeg: () => {
      // // C33851
      inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]')
      inputChecker.clickOnCheck('[data-testid="pass-button-placed_into_storage"]','be.disabled')
      inputHelpers.clicker('[data-testid="fail-button-placed_into_storage"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]')
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    placedIntoStorageTogglePos: () => {
      // C33856
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]','test1')
      inputChecker.nextButtonCheck("be.enabled");
    },

    saveAndClosePos: () => {
      // C33830
      inputHelpers.clicker('[data-testid="pass-button-placed_into_storage"]')
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      })
    }
  },

  productReceiptSummary: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '-cccp-is')
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
      })
      m_steps.manufacturingProductReceipt(scope.patientInformation);
    },

    verifySignaturePos: () => {
      // C33832
      inputChecker.checkNextButtonWithAndWithoutSignature('2')
    },
  },

  manufacturingStart: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '-cccp-is')
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
      })
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(therapy, scope);
    },

    checkboxNeg: () => {
      // C33839
      inputChecker.nextButtonCheck('be.disabled')
    },

   
    saveAndClosePos: () => {
      // C33842
      inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]');
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      })
      inputChecker.nextButtonCheck('be.enabled')
    },
  },


  selectExpiryData: {
    previousHappyPathSteps: (scope, therapy) => {
        m_steps.manufacturingCollectionSummary();
        cy.get(`@coi`).then(coi => {
          m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '-cccp-is')
          m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
          m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
          m_steps.manufacturingTransferProductToStorage(coi);
          m_steps.manufacturingTransferProductToStorage2(coi);
        })
        m_steps.manufacturingProductReceipt(scope.patientInformation);
        m_steps.manufacturingProductReceiptSummary(therapy, scope);
        m_steps.manufacturingStart()
    },
    //C33844
    negExpiryDate: () => {
        inputHelpers.inputSingleField('[id="#/properties/lot_number-input"]', input.lotNumber)
        inputHelpers.inputSingleField('[id="#/properties/item_count-input"]', input.itemCount)
        inputChecker.nextButtonCheck('be.disabled')
        inputChecker.inputDateFieldCheck('input[id="#/properties/item_expiry_date-input"]', regressionInput.manufacturing.invalidExpiryDate, 'be.disabled')
        inputChecker.nextButtonCheck('be.disabled')
    },
    //C33847
    negNumberOfBags: () => {
        inputChecker.clearDateField('input[id="#/properties/item_expiry_date-input')
        inputHelpers.inputDateField('input[id="#/properties/item_expiry_date-input', input.expiryDateValid)
        inputChecker.clearField('[id="#/properties/item_count-input"]')
        inputChecker.nextButtonCheck('be.disabled')
        inputHelpers.inputSingleField('[id="#/properties/item_count-input"]', regressionInput.manufacturing.invalidNumberofBags)
        inputChecker.nextButtonCheck('be.disabled')
    },
    //C33849
    negEmptyLot: () => {
        inputChecker.clearField('[id="#/properties/item_count-input"]')
        inputHelpers.inputSingleField('[id="#/properties/item_count-input"]', input.itemCount)
        inputChecker.clearField('[id="#/properties/lot_number-input"]')
        inputChecker.nextButtonCheck('be.disabled')
    },

    saveAndClosePos: () => {
        inputHelpers.inputSingleField('[id="#/properties/lot_number-input"]', input.lotNumber)
        cy.get(`@coi`).then(coi => {
            inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
        })
        inputChecker.nextButtonCheck('not.be.disabled')
    }
    
},

  confirmExpiryData: {
    previousHappyPathSteps: (scope, therapy) => {
      //cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '-cccp-is');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
      })
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(therapy, scope)
      m_steps.manufacturingStart();
      m_steps.manufacturingLotNumber();
    },

    verifySignaturePos: () => {
        inputChecker.checkNextButtonWithAndWithoutSignature('2')
    },

    posAskToResign: () => {
        inputChecker.backButtonCheck(`[data-testid="back-nav-link"]`)
        inputChecker.clearDateField('input[id="#/properties/item_expiry_date-input')
        inputHelpers.inputDateField('input[id="#/properties/item_expiry_date-input', regressionInput.manufacturing.validExpiryDate)
        inputChecker.reasonForChange();
        inputChecker.checkLabelAfterNext('[data-test-id="manufacturing_confirm_lot_number"]', '[data-testid=display-only] >>:nth(1)', regressionInput.manufacturing.validExpiryDate)
        inputChecker.nextButtonCheck('be.disabled')
    },

    saveAndClosePos: () => {
        inputChecker.checkNextButtonWithAndWithoutSignature('2')
        cy.get(`@coi`).then(coi => {
            inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
        })
    }
  },

  printFinalProductLabels: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '-cccp-is');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
      })
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(therapy, scope)
      m_steps.manufacturingStart();
      m_steps.manufacturingLotNumber();
      m_steps.manufacturingConfirmExpiryDate();
    },

    PosPrintLabelMessage: () => {
        inputChecker.nextButtonCheck('be.disabled')
        inputChecker.popupMessageVisible('btn-print','banner-container-0')
    },

    confirmPrintLabelNeg: () => {
        inputChecker.nextButtonCheck('be.disabled')
    },

    verifySignaturePos: () => {
        inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]')
        inputChecker.nextButtonCheck('not.be.disabled')
        actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
            apiAliases: ['@patchProcedureSteps', '@getProcedures'],
            })
            //Bug
        //inputChecker.nextButtonCheck('be.disabled')
        signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
        inputChecker.nextButtonCheck('not.be.disabled')
    },

    saveAndClosePos: () => {
        cy.get(`@coi`).then(coi => {
            inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
        })
    }
  },

  confirmationOfLabelApplication: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '-cccp-is')
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
        m_steps.manufacturingProductReceipt(scope.patientInformation);
        m_steps.manufacturingProductReceiptSummary(therapy, scope);
        m_steps.manufacturingStart();
        m_steps.manufacturingLotNumber();
        m_steps.manufacturingConfirmExpiryDate();
        m_steps.manufacturingFinalLabels(therapy);
    })
    },

    checkboxNeg: () => {
      // C33865
      inputChecker.clickOnCheck('[data-testid="right-button-radio"]','be.disabled');
    },

    noOptionSelectedRadioButtonNeg: () => {
      cy.reload();
      // C39458
      inputChecker.clickOnCheck('[id="#/properties/data/properties/is_confirmed"]','be.disabled');
    },

    seventyMLButtonSelectedPos: () => {
      // C33864
      inputChecker.clickOnCheck('[data-testid="left-button-radio"]','not.be.disabled');
    },

    saveAndClosePos: () => {
      // C33868
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
      })
      inputChecker.nextButtonCheck("be.enabled");
    }
  },

  confirmationOfLabelApplicationPart2: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '-cccp-is')
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
        m_steps.manufacturingProductReceipt(scope.patientInformation);
        m_steps.manufacturingProductReceiptSummary(therapy, scope);
        m_steps.manufacturingStart();
        m_steps.manufacturingLotNumber();
        m_steps.manufacturingConfirmExpiryDate();
        m_steps.manufacturingFinalLabels(therapy);
        m_steps.manufacturingLabelApplicationIS(coi);
      })
    },

    negBagId: () => {
      //C33870
      inputHelpers.clicker('[id="#/properties/data/properties/destruction_confirmed"]');
      inputChecker.keepFieldsEmptymultiBags('bag-identifier-1','be.disabled')
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi+`-FP-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi+`-APH-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi)
      })
    },
    cassetteNeg: () => {
      //C33871
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultiplePos("bag-identifier-1",coi+`-FPS-0${1}`,"be.visible")
      })
      inputChecker.scanAndVerifyFieldAsEmpty('cassette-1','be.disabled')
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultipleNeg("cassette-1",coi+`-FP-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("cassette-1",coi+`-APH-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("cassette-1",coi+`-PRC-0${1}`)
      })
    },
  
    hebrewCassetteNeg: () => {
      //C33873
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultiplePos("cassette-1",coi+`-FPS-0${1}`,"be.visible")
      })
      inputChecker.scanAndVerifyFieldAsEmpty('hebrew-cassette-1','be.disabled')
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultipleNeg("hebrew-cassette-1",coi+`-FP-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("hebrew-cassette-1",coi+`-APH-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("hebrew-cassette-1",coi+`-PRC-0${1}`)
      })
    },

    checkboxNeg: () => {
      // C33874
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultiplePos("hebrew-cassette-1",coi+`-FPS-0${1}`,"be.visible")
      })
      inputChecker.clickOnCheck('[id="#/properties/data/properties/destruction_confirmed"]','be.disabled');
    },

    saveAndClosePos: () => {
      // C33877
      inputHelpers.clicker('[id="#/properties/data/properties/destruction_confirmed"]');
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
      })
      inputChecker.nextButtonCheck("be.enabled");
      inputChecker.checkForGreenCheck("cassette-1")
      inputChecker.checkForGreenCheck("bag-identifier-1")
      inputChecker.checkForGreenCheck("hebrew-cassette-1")
    }
  },

  qualityRelease : {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '-cccp-is')
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
        m_steps.manufacturingProductReceipt(scope.patientInformation);
        m_steps.manufacturingProductReceiptSummary(therapy, scope);
        m_steps.manufacturingStart();
        m_steps.manufacturingLotNumber();
        m_steps.manufacturingConfirmExpiryDate();
        m_steps.manufacturingFinalLabels(therapy);
        m_steps.manufacturingLabelApplicationIS(coi);
        m_steps.manufacturingConfirLabelApplicationIS(coi);
    })
    },

    checkBoxNeg: () => {
      //C33879
      inputChecker.nextButtonCheck('be.disabled');
    },

    checkNextButtonWithAndWithoutSignature: () => {
      // C33883
      inputHelpers.clicker('[id="#/properties/data/properties/is_verified"]');
      inputHelpers.clicker('[data-testid="primary-button-action"]')
      inputChecker.nextButtonCheck('be.disabled')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.nextButtonCheck('be.enabled')
    },

    saveAndClosePos: () => {
      // C33881
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      })
      inputChecker.nextButtonCheck('be.enabled')
    },
  },
  
  bagSelection: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
      m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '-cccp-is');
      m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
      m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
      m_steps.manufacturingTransferProductToStorage(coi);
      m_steps.manufacturingTransferProductToStorage2(coi);
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(therapy, scope)
      m_steps.manufacturingStart();
      m_steps.manufacturingLotNumber();
      m_steps.manufacturingConfirmExpiryDate();
      m_steps.manufacturingFinalLabels(therapy);
      m_steps.manufacturingLabelApplicationIS(coi);
      m_steps.manufacturingConfirLabelApplicationIS(coi);
      m_steps.manufacturingQualityRelease();
      })
      
    },
    noOptionSelected: () => {
      //C33888
      inputChecker.nextButtonCheck('be.disabled');
    },

    doNotShipBag : () => {
      //C33887
      inputHelpers.clicker('[data-testid="fail-button-0"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    saveAndClosePos : () => {
     //C33890
     inputHelpers.clicker('[data-testid="pass-button-0"]')
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      },)
    }
  },


  transferProductToShipper: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '-cccp-is');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
        m_steps.manufacturingProductReceipt(scope.patientInformation);
        m_steps.manufacturingProductReceiptSummary(therapy, scope)
        m_steps.manufacturingStart();
        m_steps.manufacturingLotNumber();
        m_steps.manufacturingConfirmExpiryDate();
        m_steps.manufacturingFinalLabels(therapy);
        m_steps.manufacturingLabelApplicationIS(coi);
        m_steps.manufacturingConfirLabelApplicationIS(coi);
        m_steps.manufacturingQualityRelease();
        m_steps.manufacturingBagSelection();
    });
    },
      //C33895
      invalidBagIdentifier: () => {
        inputChecker.scanAndVerifyFieldAsEmpty('cassette-1', 'be.disabled');
        cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyMultipleNeg('cassette-1',`${coi}-FP-01`)
        inputChecker.scanAndVerifyMultipleNeg('cassette-1',`${coi}-APH-01`)
        inputChecker.scanAndVerifyMultipleNeg('cassette-1',`${coi}-PRC-01`)
        inputChecker.scanAndVerifyMultipleNeg('cassette-1',`${coi}`)
        })
      },

      //C33896
      invalidCoiForShipperLabel: () => {
        inputHelpers.clicker(['[data-testid="pass-button-manufacturing_checklist_intact"]',
          '[data-testid="pass-button-manufacturing_checklist_temp_out_of_range"]']);
          cy.get(`@coi`).then(coi => {
          
          inputHelpers.scanAndVerifyBags('cassette-1', `${coi}-FPS-01`);
          inputChecker.scanAndVerifyFieldAsEmpty('ln-2-shipper-1', 'be.disabled');
          inputChecker.scanAndVerifyMultipleNeg('ln-2-shipper-1',`${coi}-PRC-01`)
          inputChecker.scanAndVerifyMultipleNeg('ln-2-shipper-1',`${coi}-APH-01`)
          inputChecker.scanAndVerifyMultipleNeg('ln-2-shipper-1',`${coi}-FPS-01`)
          });
      },

      //C39487
      negNothingSelectedForIsShippingContainer: () => {
        cy.get(`@coi`).then(coi => {
          inputHelpers.scanAndVerifyBags('ln-2-shipper-1', coi);
        });
        inputHelpers.clicker('[data-testid="pass-button-manufacturing_checklist_intact"]');
        inputChecker.nextButtonCheck("be.disabled");
      },

      //C39486
      negToggleSelectedShippingContainerIntact: () => {
        inputHelpers.clicker('[data-testid="fail-button-manufacturing_checklist_intact"]')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/manufacturing_checklist_intact_reason-input"]');
        inputChecker.nextButtonCheck("be.disabled");
      },

      //C39298
      posToggleIsShippingContainerIntact: () => {
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/manufacturing_checklist_intact_reason-input"]', 'some reason', "be.enabled");
      },

      //C39489
      negNothingSelectedForWasThereATemperature: () => {
        inputHelpers.clicker('[data-testid="pass-button-manufacturing_checklist_temp_out_of_range"]');
        inputChecker.nextButtonCheck("be.disabled");
      },

      //C39488
      negToggleWasThereATemperature: () => {
        inputHelpers.clicker('[data-testid="fail-button-manufacturing_checklist_temp_out_of_range"]');
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/manufacturing_checklist_temp_out_of_range_reason-input"]');
      },

      //C39301
      posToggleWasThereATemperature: () => {
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/manufacturing_checklist_temp_out_of_range_reason-input"]', 'some reason', "be.enabled");
      },

      //C33899
      posSaveAndCloseButtonCheck: () => {
        cy.get(`@coi`).then(coi => {
          inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations");
        });
        inputChecker.checkForGreenCheck("cassette-1");
        inputChecker.checkForGreenCheck("ln-2-shipper-1");
        inputChecker.nextButtonCheck("be.enabled");
      }
  },

  shippingManufacturing: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '-cccp-is');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
        m_steps.manufacturingProductReceipt(scope.patientInformation);
        m_steps.manufacturingProductReceiptSummary(therapy, scope)
        m_steps.manufacturingStart();
        m_steps.manufacturingLotNumber();
        m_steps.manufacturingConfirmExpiryDate();
        m_steps.manufacturingFinalLabels(therapy);
        m_steps.manufacturingLabelApplicationIS(coi);
        m_steps.manufacturingConfirLabelApplicationIS(coi);
        m_steps.manufacturingQualityRelease();
        m_steps.manufacturingBagSelection();
        m_steps.manufacturingTransferProductToShipper(coi);
      });
    },

    //C39426	
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

    //C39427
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
      inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]','be.disabled')
    },

    //C39428
    invalidEvoIsNumber: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
      inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]','be.disabled')
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', "name",'not.be.enabled');
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', "111111",'not.be.enabled'); 
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', "111",'not.be.enabled'); 
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', "0",'not.be.enabled'); 
    },

    //C39429	
    negTamperSealNumberFieldLeftEmpty: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
      inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]','be.disabled')
    },

    //C39432
    negNothingSelectedForConfirmInvestigational: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker('[data-testid="pass-button-investigational_product"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

     //C39431	
     negToggleConfirmInvestigational: () => {
      inputHelpers.clicker('[data-testid="fail-button-investigational_product"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/investigational_product_reason-input"]');
    },

    // C38378
    posToggleConfirmInvestigational: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/investigational_product_reason-input"]', 'some reason', "be.enabled");
    },

    //C39435
    negNothingSelectedForIsRedWireTamperSeal: () => {
      inputHelpers.clicker('[data-testid="pass-button-cry_rack_label"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    //	C39434
    negToggleIsRedWireTamperSeal: () => {
      inputHelpers.clicker('[data-testid="fail-button-cry_rack_label"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/cry_rack_label_reason-input"]');
    },

    //C39436
    posToggleIsRedWireTamperSeal: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/cry_rack_label_reason-input"]', 'some reason', "be.enabled");
    },

    //C39438
    negNothingSelectedForDoesEvoIsNumberListed: () => {
      inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    //C39437
    negToggleDoesEvoIsNumberListed: () => {
      inputHelpers.clicker('[data-testid="fail-button-evo_airway_bill"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/evo_airway_bill_reason-input"]');
    },

    //	C39439
    posToggleDoesEvoIsNumberListed: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/evo_airway_bill_reason-input"]', 'some reason', "be.enabled");
    },


     //	C39441
     negNothingSelectedForIsTamperSealInPlace: () => {
      inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    //	C39440
    negToggleIsTamperSealInPlace: () => {
      inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_shipper"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_shipper_reason-input"]');
    },

    // C38390
    posToggleIsTamperSealInPlace: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_shipper_reason-input"]', 'some reason', "be.enabled");
    },

    //C39442
    negNothingSelectedForDoesTamperSealNumber: () => {
      inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    //C39442
    negToggleDoesTamperSealNumberListed: () => {
      inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_match_reason-input"]');
    },

   //C39445
    posToggleDoesTamperSealNumberListed: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_match_reason-input"]', 'some reason', "be.enabled");
    },

    //	C39447
    negNothingSelectedForIsShipperLabelsIncluded: () => {
      inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    //C39446
    negToggleIsShipperLabelsIncluded: () => {
      inputHelpers.clicker('[data-testid="fail-button-shipper_label_placed"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/shipper_label_placed_reason-input"]');
    },


    //C39448
    posToggleIsShipperLabelsIncluded: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/shipper_label_placed_reason-input"]', 'some reason', "be.enabled");
    },

    //C39450
     negNothingSelectedForIsConsigneeKitPouch: () => {
      inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    //C39449
    negToggleIsConsigneeKitPouch: () => {
      inputHelpers.clicker('[data-testid="fail-button-consignee_kit_pouch_inside"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/consignee_kit_pouch_inside_reason-input"]');
    },

    //	C39451
    posToggleIsConsigneeKitPouch: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/consignee_kit_pouch_inside_reason-input"]', 'some reason', "be.enabled");
    },

   //C39453
    negNothingSelectedForIsShippingContainer: () => {
      inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    //C39452
    negToggleIsShippingContainerSecured: () => {
      inputHelpers.clicker('[data-testid="fail-button-zip_ties_secured"]')
      inputChecker.nextButtonCheck("be.disabled");
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/zip_ties_secured_reason-input"]');
    },

   //C39454
    posToggleIsShippingContainerSecured: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/zip_ties_secured_reason-input"]', 'some reason', "be.enabled");
    },

   //C39455
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
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '-cccp-is');
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
        m_steps.manufacturingProductReceipt(scope.patientInformation);
        m_steps.manufacturingProductReceiptSummary(therapy, scope)
        m_steps.manufacturingStart();
        m_steps.manufacturingLotNumber();
        m_steps.manufacturingConfirmExpiryDate();
        m_steps.manufacturingFinalLabels(therapy);
        m_steps.manufacturingLabelApplicationIS(coi);
        m_steps.manufacturingConfirLabelApplicationIS(coi);
        m_steps.manufacturingQualityRelease();
        m_steps.manufacturingBagSelection();
        m_steps.manufacturingTransferProductToShipper(coi);
        m_steps.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, therapy);
    });
    },

    //C39469
    posCheckForEditButtonWorking: () => {
      inputHelpers.clicker('[data-testid="edit-shipping_manufacturing"]')
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.changedTamperSealNumber);
      inputChecker.reasonForChange()
      inputChecker.checkValue('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.changedTamperSealNumber);
    },

    //C39470
    negDoneButtonCheck: () => {
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.nextButtonCheck("be.disabled");
    },

    //C39471
    posDoneButtonCheck: () => {
      const verifier = 'quela@vineti.com';
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], verifier);
      inputChecker.nextButtonCheck("be.enabled");
    },

    //C39472
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

   //C39473
    posSaveAndCloseButtonCheck: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations");
      });
      inputChecker.nextButtonCheck("be.enabled");
    },
  },

  checkStatusesOfManufacturingModule: (scope, therapy) => {
    //C40072
    cy.openOrder('manufacturing','steph')
    cy.get(`@coi`).then((coi) => {
    cy.commonPagination(coi, 'Reservations')
    
        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.collectionStatus,'Reservations',4)
        m_steps.manufacturingCollectionSummary()

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.verifyShipper,'Reservations',4)
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '-cccp-is')

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.shipmentReceiptChecklist,'Reservations',4)
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber)

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.shipmentReceiptChecklistSummary,'Reservations',4)
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.transferProductToStorage1,'Reservations',4)
        m_steps.manufacturingTransferProductToStorage(coi);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.transferProductToStorage2,'Reservations',4)
        m_steps.manufacturingTransferProductToStorage2(coi);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.productReceipt,'Reservations',4)
        m_steps.manufacturingProductReceipt(scope.patientInformation);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.productReceiptSummary,'Reservations',4)
        m_steps.manufacturingProductReceiptSummary(therapy, scope)

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.manufacturingStart,'Reservations',4)
        m_steps.manufacturingStart();

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.selectExpiryData,'Reservations',4)
        m_steps.manufacturingLotNumber();

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.confirmExpiryData,'Reservations',4)
        m_steps.manufacturingConfirmExpiryDate();

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.printFinalProductLabels,'Reservations',4)
        m_steps.manufacturingFinalLabels(therapy);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.confirmLabelApplication1,'Reservations',4)
        m_steps.manufacturingLabelApplicationIS(coi);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.confirmLabelApplication2,'Reservations',4)
        m_steps.manufacturingConfirLabelApplicationIS(coi);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.qualityRelease,'Reservations',4)
        m_steps.manufacturingQualityRelease();

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.bagSelection,'Reservations',4)
        m_steps.manufacturingBagSelection();

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.transferProductToShipper,'Reservations',4)
        m_steps.manufacturingTransferProductToShipper(coi);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.shippingManufacturing,'Reservations',4)
        m_steps.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, therapy);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.shippingManufacturingSummary,'Reservations',4)
        m_steps.manufacturingShippingManufacturingSummary(therapy);

        cy.checkStatus(coi,regressionInput.manufacturing.statuses.shippingSummary,'Reservations',4)
    })
  }
}
    

