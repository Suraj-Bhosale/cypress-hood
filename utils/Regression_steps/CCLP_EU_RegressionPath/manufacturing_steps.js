import common from '../../../support/index.js'
import dayjs from 'dayjs';
import input from '../../../fixtures/inputs.json';
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers'
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers'
import regressionInput from '../../../fixtures/inputsRegression.json'
import m_steps from '../../../utils/HappyPath_steps/CCLP_EU_HappyPath/manufacturing_steps';

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

    //
    invalidCoi: () => {
     inputChecker.clearValueAndCheckForButton('[data-testid=ln-2-shipper-ship-bags-from-satellite-lab-to-manufacturing-site-input-field]','be.disabled')
    cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-satellite-lab-to-manufacturing-site', `${coi}-FP-01`, 'not.be.visible', 'be.disabled');
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-satellite-lab-to-manufacturing-site', `${coi}-APH-01`, 'not.be.visible', 'be.disabled')
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-satellite-lab-to-manufacturing-site', `${coi}-PRC-01`, 'not.be.visible', 'be.disabled');
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-satellite-lab-to-manufacturing-site', `${coi}`, 'be.visible', 'not.be.disabled');
      });
    },

    //
    checkForBackButton: () => {
      inputHelpers.onClick('[data-testid="primary-button-action"]')
      inputChecker.checkDataSavingWithBackButton('not.be.disabled');
    }
    
  },

  shipmentReceiptChecklist: {
    previousHappyPathSteps: () => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '');
      })
    },

    //
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

    //
    invalidTamperSealNo: ()  => {
        inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
        inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]','not.be.enabled')
      },


    // 
    toggleShippingCaseContainerCaseNeg: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
      inputHelpers.clicker('[data-testid=pass-button-shipping_container_intact]');
      inputChecker.nextButtonCheck("not.be.enabled");
      inputHelpers.clicker('[data-testid=fail-button-shipping_container_intact]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_intact_reason-input"]');
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    //
    toggleShippingCaseContaineWithReason: () => {
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/shipping_container_intact_reason-input"]','test1','be.enabled')
    },

   //
    toggleShippingContainerSecuredNeg: () => {
        inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured_no_case"]');
        inputChecker.nextButtonCheck("not.be.enabled");
        inputHelpers.clicker('[data-testid="fail-button-zip_ties_secured_no_case"]');
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]');
        inputChecker.nextButtonCheck("not.be.enabled");
      },

    //
      toggleShippingContainerSecuredWithReason: () => {
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/zip_ties_secured_reason-input"]','test1','be.enabled')
      },

      //
      toggleShipperLabelsNeg: () => {
        inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]');
        inputChecker.nextButtonCheck("not.be.enabled");
        inputHelpers.clicker('[data-testid="fail-button-shipper_label_placed"]');
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/shipper_label_placed_reason-input"]');
        inputChecker.nextButtonCheck("not.be.enabled");
      },

      //
      toggleShipperLabelsWithReason: () => {
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/shipper_label_placed_reason-input"]','test1','be.enabled')
      },

      toggleConsigneeKitPouchNeg: () => {
        inputHelpers.clicker('[data-testid="pass-button-consignee_pouch_inside"]');
        inputChecker.nextButtonCheck("not.be.enabled");
        inputHelpers.clicker('[data-testid="fail-button-consignee_pouch_inside"]');
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]');
        inputChecker.nextButtonCheck("not.be.enabled");
      },

      //
      toggleConsigneeKitPouchWithReason: () => { 
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/consignee_pouch_inside_reason-input"]','test1','be.enabled')
      },

      //
      toggleEvoIsNumberNeg: () => {
        inputHelpers.clicker('[data-testid="pass-button-evo_is_number"]');
        inputChecker.nextButtonCheck("not.be.enabled");
        inputHelpers.clicker('[data-testid="fail-button-evo_is_number"]');
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_is_number_reason-input"]');
        inputChecker.nextButtonCheck("not.be.enabled");
      },

      //
      toggleEvoIsNumberwithReason: () => {
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/evo_is_number_reason-input"]','test1','be.enabled')
      },

      //
      toggleRedWireTamperSealNeg: () => {
        inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal"]');
        inputChecker.nextButtonCheck("not.be.enabled");
        inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_seal"]');
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]');
        inputChecker.nextButtonCheck("not.be.enabled");
      },

      //
      toggleRedWireTamperSealwithReason: () => {
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/red_wire_tamper_seal_reason-input"]','test1','be.enabled')
      },

      //
      toggleTamperSealNumberNeg: () => {
        inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
        inputChecker.nextButtonCheck("not.be.enabled");
        inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]');
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]');
        inputChecker.nextButtonCheck("not.be.enabled");
      },

      //
      toggleTamperSealNumberWithReason: () => {
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/tamper_seal_match_reason-input"]','test1','be.enabled')
      },


    //
    saveAndClosePos: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
      })
      inputChecker.nextButtonCheck("be.enabled");
    },
    
   //	
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
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '');
      })
      m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
    },

    // 
    nextButtonCheckWithOrWithoutSignature: () => {
      inputChecker.checkNextButtonWithAndWithoutSignature(2);
    },

    // 
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
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '');
      })
      m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
      m_steps.manufacturingShipmentReceiptChecklistSummary(scope)
  },
  //
  negLn2Shipper: () => {
      inputChecker.keepFieldsEmptymultiBags("ln-2-shipper-1", "be.disabled")
      cy.get(`@coi`).then(coi => {
          inputChecker.scanAndVerifyMultipleNeg("ln-2-shipper-1", coi+`-FP-0${1}`)
          inputChecker.scanAndVerifyMultipleNeg("ln-2-shipper-1", coi+`-APH-0${1}`)
          inputChecker.scanAndVerifyMultipleNeg("ln-2-shipper-1", coi+`-PRC-0${1}`)
          inputChecker.nextButtonCheck("be.disabled");
      })
  },
  //
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
  //
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
  //
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
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '');
      m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
      m_steps.manufacturingShipmentReceiptChecklistSummary(scope)
      m_steps.manufacturingTransferProductToStorage(coi)
      })
    },
  //
  posNextButtonCheck: () => {
      inputChecker.nextButtonCheck("be.enabled")
  }
   
  },

  productReceipt: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '')
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber)
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope)
        m_steps.manufacturingTransferProductToStorage(coi)
        m_steps.manufacturingTransferProductToStorage2(coi)
      })
    },

    subjectNumberNeg: () => {
      // 
      inputHelpers.clicker(['[data-testid="pass-button-ambient_temperature"]','[data-testid="pass-button-seal_in_place"]', '[data-testid="pass-button-expected_condition"]',
      '[data-testid="pass-button-free_from_cracks"]', '[data-testid="pass-button-placed_into_storage"]'])
      inputChecker.nextButtonCheck('be.disabled')
      inputChecker.scanAndVerifyCheck('patient-id', '1234', 'not.be.visible', 'be.disabled')
    },

    ambientTemperatureToggleNeg: (scope) => {
      // 
      inputChecker.scanAndVerifyCheck('patient-id', scope.patientInformation.subjectNumber, 'be.visible', 'not.be.disabled')
      inputChecker.clickOnCheck('[data-testid="pass-button-ambient_temperature"]','be.disabled')
      inputHelpers.clicker('[data-testid="fail-button-ambient_temperature"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/ambient_temperature_reason-input"]')
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    ambientTemperatureTogglePos: () => {
       // 
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/ambient_temperature_reason-input"]','test1')
      inputChecker.nextButtonCheck("be.enabled");
    },

    sealInPlaceToggleNeg: () => {
      // 
      inputHelpers.clicker('[data-testid="pass-button-ambient_temperature"]')
      inputChecker.clickOnCheck('[data-testid="pass-button-seal_in_place"]','be.disabled')
      inputHelpers.clicker('[data-testid="fail-button-seal_in_place"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]')
      inputChecker.nextButtonCheck("not.be.enabled");
    },
    sealInPlaceTogglePos: () => {
      // 
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/seal_in_place_reason-input"]','test1')
      inputChecker.nextButtonCheck("be.enabled");
    },

    expectedConditionToggleNeg: () => {
      // 
      inputHelpers.clicker('[data-testid="pass-button-seal_in_place"]')
      inputChecker.clickOnCheck('[data-testid="pass-button-expected_condition"]','be.disabled')
      inputHelpers.clicker('[data-testid="fail-button-expected_condition"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]')
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    expectedConditionTogglePos: () => {
      // 
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/expected_condition_reason-input"]','test1')
      inputChecker.nextButtonCheck("be.enabled");
    },

    freeFromCracksToggleNeg: () => {
      // 
      inputHelpers.clicker('[data-testid="pass-button-expected_condition"]')
      inputChecker.clickOnCheck('[data-testid="pass-button-free_from_cracks"]','be.disabled')
      inputHelpers.clicker('[data-testid="fail-button-free_from_cracks"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/free_from_cracks_reason-input"]')
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    freeFromCracksTogglePos: () => {
      // 
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/free_from_cracks_reason-input"]','test1')
      inputChecker.nextButtonCheck("be.enabled");
    },

    placedIntoStorageToggleNeg: () => {
      // 
      inputHelpers.clicker('[data-testid="pass-button-free_from_cracks"]')
      inputChecker.clickOnCheck('[data-testid="pass-button-placed_into_storage"]','be.disabled')
      inputHelpers.clicker('[data-testid="fail-button-placed_into_storage"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]')
      inputChecker.nextButtonCheck("not.be.enabled");
    },

    placedIntoStorageTogglePos: () => {
      // 
      inputHelpers.inputSingleField('[data-testid="#/properties/product_receipt_checklist/properties/placed_into_storage_reason-input"]','test1')
      inputChecker.nextButtonCheck("be.enabled");
    },

    saveAndClosePos: () => {
      // 
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
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '')
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
      })
      m_steps.manufacturingProductReceipt(scope.patientInformation);
    },

    verifySignaturePos: () => {
      // 
      inputChecker.checkNextButtonWithAndWithoutSignature('2')
    },
    
  },

  manufacturingStart: {
    previousHappyPathSteps: (scope, therapy) => {
      m_steps.manufacturingCollectionSummary();
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '')
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
      })
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(therapy, scope);
    },

    checkboxNeg: () => {
      // 
      inputChecker.nextButtonCheck('be.disabled')
    },

   
    saveAndClosePos: () => {
      // 
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
        m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '')
        m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
        m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
        m_steps.manufacturingTransferProductToStorage(coi);
        m_steps.manufacturingTransferProductToStorage2(coi);
      })
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(therapy, scope);
      m_steps.manufacturingStart()
  },
  //
  negExpiryDate: () => {
      inputHelpers.inputSingleField('[id="#/properties/lot_number-input"]', input.lotNumber)
      inputHelpers.inputSingleField('[id="#/properties/item_count-input"]', input.itemCount)
      inputChecker.nextButtonCheck('be.disabled')
      inputChecker.inputDateFieldCheck('input[id="#/properties/item_expiry_date-input"]', regressionInput.manufacturing.invalidExpiryDate, 'be.disabled')
      inputChecker.nextButtonCheck('be.disabled')
  },
  //
  negNumberOfBags: () => {
      inputChecker.clearDateField('input[id="#/properties/item_expiry_date-input')
      inputHelpers.inputDateField('input[id="#/properties/item_expiry_date-input', input.expiryDateValid)
      inputChecker.clearField('[id="#/properties/item_count-input"]')
      inputChecker.nextButtonCheck('be.disabled')
      inputHelpers.inputSingleField('[id="#/properties/item_count-input"]', regressionInput.manufacturing.invalidNumberofBags)
      inputChecker.nextButtonCheck('be.disabled')
  },
  //
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
    m_steps.manufacturingCollectionSummary();
    cy.get(`@coi`).then(coi => {
      m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '');;
      m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
      m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
      m_steps.manufacturingTransferProductToStorage(coi);
      m_steps.manufacturingTransferProductToStorage2(coi);
    })
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(scope)
      m_steps.manufacturingStart();
      m_steps.manufacturingLotNumber();
  },

  //	C40182
  verifySignaturePos: () => {
      inputChecker.checkNextButtonWithAndWithoutSignature('2')
  },

  //C40183
  posAskToResign: () => {
      inputChecker.backButtonCheck(`[data-testid="back-nav-link"]`)
      inputChecker.clearDateField('input[id="#/properties/item_expiry_date-input')
      inputHelpers.inputDateField('input[id="#/properties/item_expiry_date-input', regressionInput.manufacturing.validExpiryDate)
      inputChecker.reasonForChange();
      inputChecker.checkLabelAfterNext('[data-test-id="manufacturing_confirm_lot_number"]', '[data-testid=display-only] >>:nth(1)', regressionInput.manufacturing.validExpiryDate)
      inputChecker.nextButtonCheck('be.disabled')
  },

  //C40184
  saveAndClosePos: () => {
      inputChecker.checkNextButtonWithAndWithoutSignature('2')
      cy.get(`@coi`).then(coi => {
          inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
      })
  }
},

printFinalProductLabels: {
  previousHappyPathSteps: (scope) => {
    m_steps.manufacturingCollectionSummary();
    cy.get(`@coi`).then(coi => {
      m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '');;
      m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
      m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
      m_steps.manufacturingTransferProductToStorage(coi);
      m_steps.manufacturingTransferProductToStorage2(coi);
    })
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(scope)
      m_steps.manufacturingStart();
      m_steps.manufacturingLotNumber();
      m_steps.manufacturingConfirmExpiryDate();
  },

  //C40215
  PosPrintLabelMessage: () => {
      inputChecker.nextButtonCheck('be.disabled')
      inputChecker.popupMessageVisible('btn-print','banner-container-0')
  },

  //C40216
  confirmPrintLabelNeg: () => {
      inputChecker.nextButtonCheck('be.disabled')
  },

  //C40217
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

  //C40218
  saveAndClosePos: () => {
      cy.get(`@coi`).then(coi => {
          inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
      })
  }
},

confirmationOfLabelApplication: {
  previousHappyPathSteps: (scope) => {
    m_steps.manufacturingCollectionSummary();
    cy.get(`@coi`).then(coi => {
      m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '');
      m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
      m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
      m_steps.manufacturingTransferProductToStorage(coi);
      m_steps.manufacturingTransferProductToStorage2(coi);
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(scope);
      m_steps.manufacturingStart();
      m_steps.manufacturingLotNumber();
      m_steps.manufacturingConfirmExpiryDate();
      m_steps.manufacturingFinalLabels();
  })
  },

  checkboxNeg: () => {
   //C40237
    inputChecker.clickOnCheck('[data-testid="right-button-radio"]','be.disabled');
  },

  noOptionSelectedRadioButtonNeg: () => {
    cy.reload();
    //C40239
    inputChecker.clickOnCheck('[id="#/properties/data/properties/is_confirmed"]','be.disabled');
  },

  seventyMLButtonSelectedPos: () => {
    //	C40236
    inputChecker.clickOnCheck('[data-testid="left-button-radio"]','not.be.disabled');
  },

  saveAndClosePos: () => {
    //C40238
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
      m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '');
      m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
      m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
      m_steps.manufacturingTransferProductToStorage(coi);
      m_steps.manufacturingTransferProductToStorage2(coi);
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(scope);
      m_steps.manufacturingStart();
      m_steps.manufacturingLotNumber();
      m_steps.manufacturingConfirmExpiryDate();
      m_steps.manufacturingFinalLabels();
      m_steps.manufacturingLabelApplication(coi);
    })
  },

  negBagId: () => {
    //C40231
    inputHelpers.clicker('[id="#/properties/data/properties/destruction_confirmed"]');
    inputChecker.keepFieldsEmptymultiBags('bag-identifier-1','be.disabled')
    cy.get(`@coi`).then(coi => { 
      inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi+`-FP-0${1}`)
      inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi+`-APH-0${1}`)
      inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi)
    })
  },
  cassetteNeg: () => {
    //C40232
    cy.get(`@coi`).then(coi => { 
      inputChecker.scanAndVerifyMultiplePos("bag-identifier-1",coi+`-FPS-0${1}`,"be.visible")
      inputChecker.scanAndVerifyFieldAsEmpty('cassette-1','be.disabled')
      inputChecker.scanAndVerifyMultipleNeg("cassette-1",coi+`-FP-0${1}`)
      inputChecker.scanAndVerifyMultipleNeg("cassette-1",coi+`-APH-0${1}`)
      inputChecker.scanAndVerifyMultipleNeg("cassette-1",coi+`-PRC-0${1}`)
    })
  },

  checkboxNeg: () => {
    //C40234
    cy.get(`@coi`).then(coi => { 
      inputChecker.scanAndVerifyMultiplePos("cassette-1",coi+`-FPS-0${1}`,"be.visible")
   })
    inputChecker.clickOnCheck('[id="#/properties/data/properties/destruction_confirmed"]','be.disabled');
  },

  saveAndClosePos: () => {
    //C40235
    inputHelpers.clicker('[id="#/properties/data/properties/destruction_confirmed"]');
    cy.get(`@coi`).then(coi => {
      inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
    })
    inputChecker.nextButtonCheck("be.enabled");
    inputChecker.checkForGreenCheck("cassette-1")
    inputChecker.checkForGreenCheck("bag-identifier-1")
  }
},

qualityRelease : {
  previousHappyPathSteps: (scope, therapy) => {
    m_steps.manufacturingCollectionSummary();
    cy.get(`@coi`).then(coi => {
      m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '');
      m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
      m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
      m_steps.manufacturingTransferProductToStorage(coi);
      m_steps.manufacturingTransferProductToStorage2(coi);
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(scope);
      m_steps.manufacturingStart();
      m_steps.manufacturingLotNumber();
      m_steps.manufacturingConfirmExpiryDate();
      m_steps.manufacturingFinalLabels();
      m_steps.manufacturingLabelApplication(coi);
      m_steps.confirmationOfLabelApplication(coi)
  })
  },

  checkBoxNeg: () => {
    //C40228
    inputChecker.nextButtonCheck('be.disabled');
  },

  checkNextButtonWithAndWithoutSignature: () => {
    //	C40229
    inputHelpers.clicker('[id="#/properties/data/properties/is_verified"]');
    inputHelpers.clicker('[data-testid="primary-button-action"]')
    inputChecker.nextButtonCheck('be.disabled')
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    inputChecker.nextButtonCheck('be.enabled')
  },

  saveAndClosePos: () => {
  //	C40230
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
    m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '');;
    m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
    m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
    m_steps.manufacturingTransferProductToStorage(coi);
    m_steps.manufacturingTransferProductToStorage2(coi);
    m_steps.manufacturingProductReceipt(scope.patientInformation);
    m_steps.manufacturingProductReceiptSummary(scope)
    m_steps.manufacturingStart();
    m_steps.manufacturingLotNumber();
    m_steps.manufacturingConfirmExpiryDate();
    m_steps.manufacturingFinalLabels();
    m_steps.manufacturingLabelApplication(coi);
    m_steps.confirmationOfLabelApplication(coi)
    m_steps.manufacturingQualityRelease();
    })
    
  },
  noOptionSelected: () => {
    //C40241
    inputChecker.nextButtonCheck('be.disabled');
  },

  doNotShipBag : () => {
    //C40240
    inputHelpers.clicker('[data-testid="fail-button-0"]')
    inputChecker.nextButtonCheck('be.disabled')
  },

  saveAndClosePos : () => {
   //C40242
   inputHelpers.clicker('[data-testid="pass-button-0"]')
    cy.get(`@coi`).then(coi => {
      inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
    },)
  }
},


transferProductToShipper: {
  previousHappyPathSteps: (scope) => {
    m_steps.manufacturingCollectionSummary();
    cy.get(`@coi`).then(coi => {
      m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '');;
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(scope)
      m_steps.manufacturingStart();
      m_steps.manufacturingLotNumber();
      m_steps.manufacturingConfirmExpiryDate();
      m_steps.manufacturingFinalLabels();
      m_steps.manufacturingLabelApplication(coi);
      m_steps.confirmationOfLabelApplication(coi)
      m_steps.manufacturingQualityRelease();
      m_steps.manufacturingBagSelection();
  });
  },
    //C40243
    invalidBagIdentifier: () => {
      inputChecker.scanAndVerifyFieldAsEmpty('cassette-1', 'be.disabled');
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyMultipleNeg('cassette-1',`${coi}-FP-01`)
      inputChecker.scanAndVerifyMultipleNeg('cassette-1',`${coi}-APH-01`)
      inputChecker.scanAndVerifyMultipleNeg('cassette-1',`${coi}-PRC-01`)
      inputChecker.scanAndVerifyMultipleNeg('cassette-1',`${coi}`)
      })
    },

    //C40244
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

  //C40250
    negNothingSelectedForIsShippingContainer: () => {
      cy.get(`@coi`).then(coi => {
        inputHelpers.scanAndVerifyBags('ln-2-shipper-1', coi);
      });
      inputHelpers.clicker('[data-testid="pass-button-manufacturing_checklist_intact"]');
      inputChecker.nextButtonCheck("be.disabled");
    },

    //C40249
    negToggleSelectedShippingContainerIntact: () => {
      inputHelpers.clicker('[data-testid="fail-button-manufacturing_checklist_intact"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/manufacturing_checklist_intact_reason-input"]');
      inputChecker.nextButtonCheck("be.disabled");
    },

  //C40247
    posToggleIsShippingContainerIntact: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/manufacturing_checklist_intact_reason-input"]', 'some reason', "be.enabled");
    },

    //C40252
    negNothingSelectedForWasThereATemperature: () => {
      inputHelpers.clicker('[data-testid="pass-button-manufacturing_checklist_temp_out_of_range"]');
      inputChecker.nextButtonCheck("be.disabled");
    },

    //C40251
    negToggleWasThereATemperature: () => {
      inputHelpers.clicker('[data-testid="fail-button-manufacturing_checklist_temp_out_of_range"]');
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/manufacturing_checklist_temp_out_of_range_reason-input"]');
    },

    //C40248
    posToggleWasThereATemperature: () => {
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/manufacturing_checklist_temp_out_of_range_reason-input"]', 'some reason', "be.enabled");
    },

   //C40246
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
  previousHappyPathSteps: (scope) => {
    m_steps.manufacturingCollectionSummary();
    cy.get(`@coi`).then(coi => {
      m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '');;
      m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
      m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
      m_steps.manufacturingTransferProductToStorage(coi);
      m_steps.manufacturingTransferProductToStorage2(coi);
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(scope)
      m_steps.manufacturingStart();
      m_steps.manufacturingLotNumber();
      m_steps.manufacturingConfirmExpiryDate();
      m_steps.manufacturingFinalLabels();
      m_steps.manufacturingLabelApplication(coi);
      m_steps.confirmationOfLabelApplication(coi)
      m_steps.manufacturingQualityRelease();
      m_steps.manufacturingBagSelection();
      m_steps.manufacturingTransferProductToShipper(coi);
    });
  },

 //	C40186	
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

  //C40187
  negSubjectNumberOnAirWaybillNotEntered: (scope) => {
    cy.get(`@coi`).then((coi) => {
    getManufAirWayBill(scope, 1,coi);
    })
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

  //C40188
  invalidEvoIsNumber: () => {
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/subject_number-input"]', regressionInput.manufacturing.subjectNumber);
    inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]','be.disabled')
    inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', "name",'not.be.enabled');
    inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', "111111",'not.be.enabled'); 
    inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', "111",'not.be.enabled'); 
    inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', "0",'not.be.enabled'); 
  },

  //C40189	
  negTamperSealNumberFieldLeftEmpty: () => {
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]', regressionInput.manufacturing.evoIsNumber);
    inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]','be.disabled')
  },

 //C40191
  negNothingSelectedForConfirmInvestigational: () => {
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.tamperSealNumber);
    inputHelpers.clicker('[data-testid="pass-button-investigational_product"]')
    inputChecker.nextButtonCheck("be.disabled");
  },

  //	C40190
   negToggleConfirmInvestigational: () => {
    inputHelpers.clicker('[data-testid="fail-button-investigational_product"]')
    inputChecker.nextButtonCheck("be.disabled");
    inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/investigational_product_reason-input"]');
  },

  //C40192
  posToggleConfirmInvestigational: () => {
    inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/investigational_product_reason-input"]', 'some reason', "be.enabled");
  },

 //C40194
  negNothingSelectedForIsRedWireTamperSeal: () => {
    inputHelpers.clicker('[data-testid="pass-button-cry_rack_label"]')
    inputChecker.nextButtonCheck("be.disabled");
  },

//	C40193
  negToggleIsRedWireTamperSeal: () => {
    inputHelpers.clicker('[data-testid="fail-button-cry_rack_label"]')
    inputChecker.nextButtonCheck("be.disabled");
    inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/cry_rack_label_reason-input"]');
  },

  //C40195
  posToggleIsRedWireTamperSeal: () => {
    inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/cry_rack_label_reason-input"]', 'some reason', "be.enabled");
  },

//C40197
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

  //	C40196
  posToggleDoesEvoIsNumberListed: () => {
    inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/evo_airway_bill_reason-input"]', 'some reason', "be.enabled");
  },


 //C40198
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

//C40203	
  posToggleIsTamperSealInPlace: () => {
    inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_shipper_reason-input"]', 'some reason', "be.enabled");
  },

  //	C40203
  negNothingSelectedForDoesTamperSealNumber: () => {
    inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
    inputChecker.nextButtonCheck("be.disabled");
  },

  //C40202
  negToggleDoesTamperSealNumberListed: () => {
    inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]')
    inputChecker.nextButtonCheck("be.disabled");
    inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_match_reason-input"]');
  },

 //C40204	
  posToggleDoesTamperSealNumberListed: () => {
    inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_match_reason-input"]', 'some reason', "be.enabled");
  },

//C40206
  negNothingSelectedForIsShipperLabelsIncluded: () => {
    inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]')
    inputChecker.nextButtonCheck("be.disabled");
  },

  //C40205
  negToggleIsShipperLabelsIncluded: () => {
    inputHelpers.clicker('[data-testid="fail-button-shipper_label_placed"]')
    inputChecker.nextButtonCheck("be.disabled");
    inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/shipper_label_placed_reason-input"]');
  },

  //C40207
  posToggleIsShipperLabelsIncluded: () => {
    inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/shipper_label_placed_reason-input"]', 'some reason', "be.enabled");
  },

  //C40209
   negNothingSelectedForIsConsigneeKitPouch: () => {
    inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]')
    inputChecker.nextButtonCheck("be.disabled");
  },

  ///C40208
  negToggleIsConsigneeKitPouch: () => {
    inputHelpers.clicker('[data-testid="fail-button-consignee_kit_pouch_inside"]')
    inputChecker.nextButtonCheck("be.disabled");
    inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/consignee_kit_pouch_inside_reason-input"]');
  },

  //C40210
  posToggleIsConsigneeKitPouch: () => {
    inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/consignee_kit_pouch_inside_reason-input"]', 'some reason', "be.enabled");
  },

 //C40212
  negNothingSelectedForIsShippingContainer: () => {
    inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]')
    inputChecker.nextButtonCheck("be.disabled");
  },

  //C40211
  negToggleIsShippingContainerSecured: () => {
    inputHelpers.clicker('[data-testid="fail-button-zip_ties_secured"]')
    inputChecker.nextButtonCheck("be.disabled");
    inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/zip_ties_secured_reason-input"]');
  },

 //C40213
  posToggleIsShippingContainerSecured: () => {
    inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/zip_ties_secured_reason-input"]', 'some reason', "be.enabled");
  },

 //C40214
  posSaveAndCloseButtonCheck: () => {
    cy.get(`@coi`).then(coi => {
      inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations");
    });
    inputChecker.checkForGreenCheck("manufacturing-airway-bill");
    inputChecker.nextButtonCheck("be.enabled");
  },
},

shippingManufacturingSummary: {
  previousHappyPathSteps: (scope) => {
    m_steps.manufacturingCollectionSummary();
    cy.get(`@coi`).then(coi => {
      m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '');;
      m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
      m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
      m_steps.manufacturingTransferProductToStorage(coi);
      m_steps.manufacturingTransferProductToStorage2(coi);
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(scope)
      m_steps.manufacturingStart();
      m_steps.manufacturingLotNumber();
      m_steps.manufacturingConfirmExpiryDate();
      m_steps.manufacturingFinalLabels();
      m_steps.manufacturingLabelApplication(coi);
      m_steps.confirmationOfLabelApplication(coi)
      m_steps.manufacturingQualityRelease();
      m_steps.manufacturingBagSelection();
      m_steps.manufacturingTransferProductToShipper(coi);
      m_steps.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber);
  });
  },

//	C40219
  posCheckForEditButtonWorking: () => {
    inputHelpers.clicker('[data-testid="edit-shipping_manufacturing"]')
    inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.changedTamperSealNumber);
    inputChecker.reasonForChange()
    inputChecker.checkValue('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', regressionInput.manufacturing.changedTamperSealNumber);
  },

  //C40220
  negDoneButtonCheck: () => {
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    inputChecker.nextButtonCheck("be.disabled");
  },

  //C40221
  posDoneButtonCheck: () => {
    const verifier = 'quela@vineti.com';
    signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], verifier);
    inputChecker.nextButtonCheck("be.enabled");
  },

  //C40222
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

//C40223
  posSaveAndCloseButtonCheck: () => {
    cy.get(`@coi`).then(coi => {
      inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations");
    });
    inputChecker.nextButtonCheck("be.enabled");
  },
},

checkStatusesOfManufacturingModule: (scope, therapy) => {
  //C40072
   cy.get(`@coi`).then((coi) => {
      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi,regressionInput.manufacturing.statuses.collectionStatus,'Reservations',4)
      m_steps.manufacturingCollectionSummary()

      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi,regressionInput.manufacturing.statuses.verifyShipper,'Reservations',4)
      m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '');

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
      m_steps.manufacturingLabelApplication(coi);

      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi,regressionInput.manufacturing.statuses.confirmLabelApplication2,'Reservations',4)
      m_steps.confirmationOfLabelApplication(coi)

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
      m_steps.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, coi);

      inputHelpers.clickOnHeader('manufacturing')
      cy.checkStatus(coi,regressionInput.manufacturing.statuses.shippingManufacturingSummary,'Reservations',4)
      m_steps.manufacturingShippingManufacturingSummary(therapy);

      cy.checkStatus(coi,regressionInput.manufacturing.statuses.shippingSummary,'Reservations',4)
  })
}
}
    

