
import common from '../../../support/index.js'
import dayjs from 'dayjs'
import input from '../../../fixtures/inputs.json'
import translationHelpers from '../../shared_block_helpers/translationHelpers'
import manufacturingAssertions from '../../../fixtures/manufacturingAssertions.json'
import therapies from '../../../fixtures/therapy.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers.js'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers.js'
import m_steps from '../../../utils/HappyPath_steps/CMLP_US_HappyPath/manufacturing_steps';
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";
import regressionInput from '../../../fixtures/inputsRegression.json'

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

  manufacturingStart: {
    checkboxNeg: () => {
      // C39559
      inputChecker.nextButtonCheck('be.disabled')
    },

   
    saveAndClosePos: () => {
      // C39560
      inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]');
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      })
      inputChecker.nextButtonCheck('be.enabled')
    },
  },

  selectExpiryData: {
    previousHappyPathSteps: () => {
        m_steps.manufacturingStart()
    },
    // C39561
    negExpiryDate: () => {
        inputHelpers.inputSingleField('[id="#/properties/lot_number-input"]', input.lotNumber)
        inputHelpers.inputSingleField('[id="#/properties/item_count-input"]', input.itemCount)
        inputChecker.nextButtonCheck('be.disabled')
        inputChecker.inputDateFieldCheck('input[id="#/properties/item_expiry_date-input"]', regressionInput.manufacturing.invalidExpiryDate, 'be.disabled')
        inputChecker.nextButtonCheck('be.disabled')
    },
    //C39562
    negNumberOfBags: () => {
        inputChecker.clearDateField('input[id="#/properties/item_expiry_date-input')
        inputHelpers.inputDateField('input[id="#/properties/item_expiry_date-input', input.expiryDateValid)
        inputChecker.clearField('[id="#/properties/item_count-input"]')
        inputChecker.nextButtonCheck('be.disabled')
        inputHelpers.inputSingleField('[id="#/properties/item_count-input"]', regressionInput.manufacturing.invalidNumberofBags)
        inputChecker.nextButtonCheck('be.disabled')
    },
    //C39563
    negEmptyLot: () => {
        inputChecker.clearField('[id="#/properties/item_count-input"]')
        inputHelpers.inputSingleField('[id="#/properties/item_count-input"]', input.itemCount)
        inputChecker.clearField('[id="#/properties/lot_number-input"]')
        inputChecker.nextButtonCheck('be.disabled')
    },
    // C39564
    saveAndClosePos: () => {
        inputHelpers.inputSingleField('[id="#/properties/lot_number-input"]', input.lotNumber)
        cy.get(`@coi`).then(coi => {
            inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
        })
        inputChecker.nextButtonCheck('not.be.disabled')
    }

},

  confirmExpiryData: {
    previousHappyPathSteps: () => {
      m_steps.manufacturingStart();
      m_steps.manufacturingLotNumber();
    },

    verifySignaturePos: () => {
      // C39565
        inputChecker.checkNextButtonWithAndWithoutSignature('2')
    },

    posAskToResign: () => {
      // C39566
        inputChecker.backButtonCheck(`[data-testid="back-nav-link"]`)
        inputChecker.clearDateField('input[id="#/properties/item_expiry_date-input')
        inputHelpers.inputDateField('input[id="#/properties/item_expiry_date-input', regressionInput.manufacturing.validExpiryDate)
        inputChecker.reasonForChange();
        inputChecker.checkLabelAfterNext('[data-test-id="manufacturing_confirm_lot_number"]', '[data-testid=display-only] >>:nth(1)', regressionInput.manufacturing.validExpiryDate)
        inputChecker.nextButtonCheck('be.disabled')
    },

    saveAndClosePos: () => {
      // C39567
        inputChecker.checkNextButtonWithAndWithoutSignature('2')
        cy.get(`@coi`).then(coi => {
            inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
        })
    }
  },


  printFinalProductLabels: {
    previousHappyPathSteps: () => {
        m_steps.manufacturingStart();
        m_steps.manufacturingLotNumber();
        m_steps.manufacturingConfirmExpiryDate();
    },

    PosPrintLabelMessage: () => {
      // C36417
      inputChecker.nextButtonCheck('be.disabled')
      inputChecker.popupMessageVisible('btn-print','banner-container-0')
  },

  confirmPrintLabelNeg: () => {
    // C36418
      inputChecker.nextButtonCheck('be.disabled')
  },

  verifySignaturePos: () => {
    // C36419
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
    previousHappyPathSteps: () => {
      m_steps.manufacturingStart();
      m_steps.manufacturingLotNumber();
      m_steps.manufacturingConfirmExpiryDate();
      m_steps.manufacturingFinalLabels();
    },

    checkboxNeg: () => {
      // C36422
      inputChecker.clickOnCheck('[data-testid="right-button-radio"]','be.disabled');
    },

    noOptionSelectedRadioButtonNeg: () => {
      cy.reload();
      // C36421
      inputChecker.clickOnCheck('[id="#/properties/data/properties/is_confirmed"]','be.disabled');
    },

    seventyMLButtonSelectedPos: () => {
      // C39534
      inputChecker.clickOnCheck('[data-testid="left-button-radio"]','not.be.disabled');
    },

    saveAndClosePos: () => {
      // C36424
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
      })
      inputChecker.nextButtonCheck("be.enabled");
    }
  },

  confirmationOfLabelApplicationPart2: {
    previousHappyPathSteps: () => {
      m_steps.manufacturingStart();
      m_steps.manufacturingLotNumber();
      m_steps.manufacturingConfirmExpiryDate();
      m_steps.manufacturingFinalLabels();
      m_steps.manufacturingLabelApplication();
    },

    negBagId: () => {
      //C36426
      inputHelpers.clicker('[id="#/properties/data/properties/destruction_confirmed"]');
      inputChecker.keepFieldsEmptymultiBags('bag-identifier-1','be.disabled')
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi+`-FP-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi+`-APH-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi)
      })
    },
    cassetteNeg: () => {
      //C36427
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
  
    checkboxNeg: () => {
      // C36428
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultiplePos("cassette-1",coi+`-FPS-0${1}`,"be.visible")
      })
      inputChecker.clickOnCheck('[id="#/properties/data/properties/destruction_confirmed"]','be.disabled');
    },

    saveAndClosePos: () => {
      // C36431
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
    previousHappyPathSteps: () => {
      m_steps.manufacturingStart();
      m_steps.manufacturingLotNumber();
      m_steps.manufacturingConfirmExpiryDate();
      m_steps.manufacturingFinalLabels();
      m_steps.manufacturingLabelApplication();
      cy.get(`@coi`).then(coi => { 
      m_steps.manufacturingConfirmLabelApplication(coi);
      })
    },

    checkBoxNeg: () => {
      //C39531
      inputChecker.nextButtonCheck('be.disabled');
    },

    checkNextButtonWithAndWithoutSignature: () => {
      // C39533
      inputHelpers.clicker('[id="#/properties/data/properties/is_verified"]');
      inputHelpers.clicker('[data-testid="primary-button-action"]')
      inputChecker.nextButtonCheck('be.disabled')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.nextButtonCheck('be.enabled')
    },

    saveAndClosePos: () => {
      // C39532
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      })
      inputChecker.nextButtonCheck('be.enabled')
    },
  },

  bagSelection: {
    previousHappyPathSteps: () => {
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingStart();
        m_steps.manufacturingLotNumber();
        m_steps.manufacturingConfirmExpiryDate();
        m_steps.manufacturingFinalLabels();
        m_steps.manufacturingLabelApplication();
       m_steps.manufacturingConfirmLabelApplication(coi);
       m_steps.manufacturingQualityRelease();
      })
    },
    noOptionSelected: () => {
      //	C39632
      inputChecker.nextButtonCheck('be.disabled');
    },

    doNotShipBag : () => {
      //C39630
      inputHelpers.clicker('[data-testid="fail-button-0"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    saveAndClosePos : () => {
     //C39633
     inputHelpers.clicker('[data-testid="pass-button-0"]')
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      },)
    }
  },


  transferProductToShipper: {
    previousHappyPathSteps: () => {
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingStart();
        m_steps.manufacturingLotNumber();
        m_steps.manufacturingConfirmExpiryDate();
        m_steps.manufacturingFinalLabels();
        m_steps.manufacturingLabelApplication();
       m_steps.manufacturingConfirmLabelApplication(coi);
       m_steps.manufacturingQualityRelease();
       m_steps.manufacturingBagSelection();
      })
    },
      //C39643
      invalidBagIdentifier: () => {
        inputChecker.scanAndVerifyFieldAsEmpty('cassette-1', 'be.disabled');
        cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyMultipleNeg('cassette-1',`${coi}-FP-01`)
        inputChecker.scanAndVerifyMultipleNeg('cassette-1',`${coi}-APH-01`)
        inputChecker.scanAndVerifyMultipleNeg('cassette-1',`${coi}-PRC-01`)
        inputChecker.scanAndVerifyMultipleNeg('cassette-1',`${coi}`)
        })
      },

      //C39644
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

      //C39650
      negNothingSelectedForIsShippingContainer: () => {
        cy.get(`@coi`).then(coi => {
          inputHelpers.scanAndVerifyBags('ln-2-shipper-1', coi);
        });
        inputHelpers.clicker('[data-testid="pass-button-manufacturing_checklist_intact"]');
        inputChecker.nextButtonCheck("be.disabled");
      },

      //C39649	
      negToggleSelectedShippingContainerIntact: () => {
        inputHelpers.clicker('[data-testid="fail-button-manufacturing_checklist_intact"]')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/manufacturing_checklist_intact_reason-input"]');
        inputChecker.nextButtonCheck("be.disabled");
      },

     //	C39647
      posToggleIsShippingContainerIntact: () => {
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/manufacturing_checklist_intact_reason-input"]', 'some reason', "be.enabled");
      },

      //	C39652
      negNothingSelectedForWasThereATemperature: () => {
        inputHelpers.clicker('[data-testid="pass-button-manufacturing_checklist_temp_out_of_range"]');
        inputChecker.nextButtonCheck("be.disabled");
      },

      //C39651
      negToggleWasThereATemperature: () => {
        inputHelpers.clicker('[data-testid="fail-button-manufacturing_checklist_temp_out_of_range"]');
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/manufacturing_checklist_temp_out_of_range_reason-input"]');
      },

      //C39648
      posToggleWasThereATemperature: () => {
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/manufacturing_checklist_temp_out_of_range_reason-input"]', 'some reason', "be.enabled");
      },

      //C39646
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
    previousHappyPathSteps: () => {
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingStart();
        m_steps.manufacturingLotNumber();
        m_steps.manufacturingConfirmExpiryDate();
        m_steps.manufacturingFinalLabels();
        m_steps.manufacturingLabelApplication();
       m_steps.manufacturingConfirmLabelApplication(coi);
       m_steps.manufacturingQualityRelease();
       m_steps.manufacturingBagSelection();
       m_steps.manufacturingTransferProductToShipper(coi);
      })
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
    previousHappyPathSteps: (scope,therapy) => {
      cy.get(`@coi`).then(coi => {
        m_steps.manufacturingStart();
        m_steps.manufacturingLotNumber();
        m_steps.manufacturingConfirmExpiryDate();
        m_steps.manufacturingFinalLabels();
        m_steps.manufacturingLabelApplication();
       m_steps.manufacturingConfirmLabelApplication(coi);
       m_steps.manufacturingQualityRelease();
       m_steps.manufacturingBagSelection();
       m_steps.manufacturingTransferProductToShipper(coi);
       m_steps.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, therapy);
      })
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
    //C40081
    cy.openOrder('manufacturing','steph')
    cy.get(`@coi`).then((coi) => {
    cy.commonPagination(coi, 'Reservations')

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
        m_steps.manufacturingLabelApplication();

	      inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.confirmLabelApplication2,'Reservations',4)
        m_steps.manufacturingConfirmLabelApplication(coi);

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


