import inputHelpers from '../../shared_block_helpers/inputFieldHelpers.js'
import translationHelpers from '../../shared_block_helpers/translationHelpers.js'
import common from '../../../support/index.js'
import therapies from '../../../fixtures/therapy.json'
import satelliteLabAssertions from '../../../fixtures/satelliteLabAssertions.json'
import inputs from '../../../fixtures/inputs.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers.js'
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers"
import sat_steps from "../../HappyPath_steps/CCCP_US_HappyPath/satelite_lab_steps"
import regressionInput from '../../../fixtures/inputsRegression.json'


const getSatAirWayBill = (subjectNumber,coi) => {
    cy.openOrder('ordering', 'oliver')
    cy.commonPagination(subjectNumber, 'Treatments per Patient')
    cy.get('[data-testid="td-stage-plane-icon"]')
      .eq(1)
      .parent()
      .parent()
      .parent()
      .find('[data-testid="td-stage-site-details"]')
      .invoke('text')
      .then((text) => {
         let airWayBill = text.substring(9, text.length)
  
        cy.openOrder('satellite_lab', 'steph')
        cy.commonPagination(coi, 'Reservations')
  
        inputHelpers.scanAndVerifyCoi('satellite-airway-bill', airWayBill)
        cy.wait(1000)
        cy.log('satLabAirWayBill', airWayBill)
      })
  }
  export default {

    collectionSummary: {
      // C34929
      posSaveAndClose: ()=>{
        cy.get(`@coi`).then(coi => { 
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
        })
      },
    },

    satLabVerifyShipment: {
      previousHappyPathSteps: (scope,therapy) => {
        sat_steps.satLabCollectionSummary(scope, therapy)
      },
      coiBagIdentifierOnBagNeg: () => {
        // C34872
        inputChecker.keepFieldsEmpty("ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cccp","be.disabled")
        cy.get(`@coi`).then(coi => { 
          inputChecker.scanAndVerifyCheck("ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cccp",coi+`-FP-0${1}`,"not.be.visible","be.disabled")
          inputChecker.scanAndVerifyCheck("ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cccp",coi+`-APH-0${1}`,"not.be.visible","be.disabled")
          inputChecker.scanAndVerifyCheck("ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cccp",coi+`-PRC-0${1}`,"not.be.visible","be.disabled")
        })
      },

      saveAndCloseButtonPositive: () => {
        // C34873
        cy.get(`@coi`).then(coi => { 
          inputChecker.scanAndVerifyCheck("ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cccp",coi,"be.visible","not.be.disabled")
          inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
        })
      },

      retainsValueUponClickingNext: () => {
        // 34874
        inputChecker.checkForTheInfoSavedClickingNextAndBack();
        inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      }
    },
    satLabShipmentChecklist: {
      previousHappyPathSteps: (scope,therapy,toSite) => {
        sat_steps.satLabCollectionSummary(scope, therapy)
        cy.get(`@coi`).then(coi => {
          sat_steps.satLabVerifyShipment(toSite, therapy, coi);
        })
      },

      coiBagIdentifierOnBagNeg: () => {
        // C34899
        inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]')
        inputHelpers.clicker('[data-testid=pass-button-cry_aph_bag]')
        inputHelpers.clicker('[data-testid=pass-button-cold_shipper]')
        inputChecker.keepFieldsEmptymultiBags("bag-identifier-1","be.disabled")
        cy.get(`@coi`).then(coi => { 
          inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi+`-FP-0${1}`)
          inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi+`-PRC-0${1}`)
          inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi)
          inputChecker.nextButtonCheck("be.disabled");
        })
      },

      toggleEmptyDownloadTemp: () => {
        // C34901
        cy.get(`@coi`).then(coi => { 
          inputChecker.scanAndVerifyMultiplePos("bag-identifier-1",coi+`-APH-0${1}`,"be.visible")
        })
        inputChecker.clickOnCheck('[data-testid=pass-button-does_temperature_conform]',"be.disabled")
      },

      toggleEmptyApheresisBag: () => {
        // C34904
        inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]')
        inputChecker.clickOnCheck('[data-testid=pass-button-cry_aph_bag]',"be.disabled")
      },

      toggleEmptyApheresisTwo: () => {
        // C34907
        inputHelpers.clicker('[data-testid=pass-button-cry_aph_bag]')
        inputChecker.clickOnCheck('[data-testid=pass-button-cold_shipper]',"be.disabled")
      },

      toggleDownloadTempNeg: () => {
        // C34900
        inputHelpers.clicker('[data-testid=pass-button-cold_shipper]');
        inputHelpers.clicker('[data-testid=fail-button-does_temperature_conform]')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/does_temperature_conform_reason-input"]')
      },

      toggleApheresisBagNeg: () => {
        // C34903
        inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]');
        inputHelpers.clicker('[data-testid=fail-button-cry_aph_bag]')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/cry_aph_bag_reason-input"]')
      },

      toggleApheresisTwoNeg: () => {
        // C34906
        inputHelpers.clicker('[data-testid=pass-button-cry_aph_bag]')
        inputHelpers.clicker('[data-testid=fail-button-cold_shipper]')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/cold_shipper_reason-input"]')
      },

      toggleApheresisTwoPos: () => {
        // C34908
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/cold_shipper_reason-input"]',inputs.additionalComments,"not.be.disabled")
      },

      toggleApheresisBagPos: () => {
        // C34905
        inputHelpers.clicker('[data-testid=pass-button-cold_shipper]')
        inputHelpers.clicker('[data-testid=fail-button-cry_aph_bag]')
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/cry_aph_bag_reason-input"]',inputs.additionalComments,"not.be.disabled")
      },

      toggleDownloadTempPos: () => {
        // C34902
        inputHelpers.clicker('[data-testid=pass-button-cry_aph_bag]')
        inputHelpers.clicker('[data-testid=fail-button-does_temperature_conform]')
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/does_temperature_conform_reason-input"]',inputs.additionalComments,"not.be.disabled")
      },

      saveAndClosePos: () => {
        // 34909
        inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]')
        cy.get(`@coi`).then(coi => { 
          inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
          })
        inputChecker.nextButtonCheck("be.enabled")
      },

      retainsValueUponClickingNext: () => {
        // 34910
        inputChecker.checkForTheInfoSavedClickingNextAndBack();
        inputChecker.checkGreenCheckMarkVisibilityMultiBags("bag-identifier-1");
        inputChecker.checkValue('[data-testid=pass-button-does_temperature_conform]','true');
        inputChecker.checkValue('[data-testid=pass-button-cry_aph_bag]','true');
        inputChecker.checkValue('[data-testid=pass-button-cold_shipper]','true')     
      }
  },

  shipmentReceiptChecklistSummary: {
    previousHappyPathSteps: (scope,therapy,toSite) => {
      sat_steps.satLabCollectionSummary(scope, therapy)
      cy.get(`@coi`).then(coi => {
        sat_steps.satLabVerifyShipment(toSite, therapy, coi);
        sat_steps.satLabShipmentChecklist(coi)
      })
    },
    verifyEditPos: () => {
      //C34868
      inputHelpers.clicker('[data-testid=edit-shipment_receipt_checklist]')
      inputHelpers.clicker('[data-testid=fail-button-does_temperature_conform]')
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/does_temperature_conform_reason-input"]', regressionInput.satelliteLab.tempDetails)
      inputChecker.nextButtonCheck('not.be.disabled')
      inputChecker.reasonForChange()
      inputChecker.checkLabelAfterNext(
        '[data-test-id="satellite_lab_shipment_receipt_checklist_summary"]',
        '[data-testid="txt-field-layout-Does the downloaded temperature data from the temperature monitoring device conform to the Janssen shipping profile? If there is an unexpected spike and the temperature goes out-of-range (2-8°C) during transit, please contact your Janssen Cell Therapy Coordinator immediately for further instructions.-answer"]>>',
        regressionInput.satelliteLab.changedTempAnswer)
    },
    verifySignaturePos: () => {
      //C35137	
      inputChecker.checkNextButtonWithAndWithoutSignature('2')
    },

    saveAndClosePos: () => {
      //C34871
      inputChecker.nextButtonCheck('not.be.disabled')
      inputChecker.checkState('[data-testid=edit-shipment_receipt_checklist]', 'not.be.disabled')
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      })
    }
  },

  cryopreservation: {
    previousHappyPathSteps: (scope,therapy,toSite) => {
      sat_steps.satLabCollectionSummary(scope, therapy)
      cy.get(`@coi`).then(coi => {
        sat_steps.satLabVerifyShipment(toSite, therapy, coi);
        sat_steps.satLabShipmentChecklist(coi)
        sat_steps.satLabShipmentChecklistSummary(scope)
      })
    },

    verifyNextButtonNeg: () => {
      //C34927
      inputChecker.nextButtonCheck('be.disabled')
    },
    
    verifySaveAndClose: () => {
      //C34928
      inputHelpers.inputSingleField('input[id="#/properties/item_count-input"]', inputs.itemCount)
      inputChecker.nextButtonCheck('not.be.disabled')
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      })
    },
  },

  cryopreservationLabels: {
    previousHappyPathSteps: (scope,therapy,toSite, input) => {
      sat_steps.satLabCollectionSummary(scope, therapy)
      cy.get(`@coi`).then(coi => {
        sat_steps.satLabVerifyShipment(toSite, therapy, coi);
        sat_steps.satLabShipmentChecklist(coi)
        sat_steps.satLabShipmentChecklistSummary(scope)
        sat_steps.satLabCryopreservation(input.itemCount)
      })
    },

    scanCassetteNeg: () => {
      //C34914
      cy.get('[data-testid="txt-field-layout-Verify labels have been attached to all collection bags-answer"]')
      .find('svg')
      .click()
      cy.get('[data-testid="txt-field-layout-Confirm labels are printed successfully-answer"]')
      .find('svg')
      .click()
      inputChecker.keepFieldsEmptymultiBags("bag-identifier-1","be.disabled")
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyMultipleNeg('bag-identifier-1', `${coi}-FP-01`)
        inputChecker.scanAndVerifyMultipleNeg('bag-identifier-1', `${coi}-APH-01`)
        inputChecker.scanAndVerifyMultipleNeg('bag-identifier-1', `${coi}`)
      })
      inputChecker.nextButtonCheck('be.disabled')
    },

    scanBagNeg: () => {
      //C34913
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyMultiplePos('bag-identifier-1', `${coi}-PRC-01`, "be.visible")
      })
        inputChecker.scanAndVerifyFieldAsEmpty('cassette-1','be.disabled')
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyMultipleNeg("cassette-1",coi+`-FP-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("cassette-1",coi+`-APH-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("cassette-1", coi)
      })
      inputChecker.nextButtonCheck('be.disabled')
    },

    isVerifyLabelsNeg: () => {
      //C34911
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyMultiplePos('cassette-1', `${coi}-PRC-01`, "be.visible")
      })
      cy.get('[data-testid="txt-field-layout-Verify labels have been attached to all collection bags-answer"]')
      .find('svg')
      .click()
      inputChecker.nextButtonCheck('be.disabled')
    },

    isConfirmLabelsNeg: () => {
      //C34912
      cy.get('[data-testid="txt-field-layout-Confirm labels are printed successfully-answer"]')
      .find('svg')
      .click()
      inputChecker.nextButtonCheck('be.disabled')
    },

    verifySignature: () => {
      //C34915
      cy.get('[data-testid="txt-field-layout-Verify labels have been attached to all collection bags-answer"]')
      .find('svg')
      .click()
      cy.get('[data-testid="txt-field-layout-Confirm labels are printed successfully-answer"]')
      .find('svg')
      .click()
      inputChecker.nextButtonCheck('be.enabled')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.nextButtonCheck('be.enabled')
    },

    verifySaveAndClose: () => {
      //C34916
      cy.get(`@coi`).then(coi => { 
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations");
        })
    },

    retainsValueUponClickingBack: () => {
      // C34898
      inputChecker.checkForTheInfoSavedClickingNextAndBack()
      inputChecker.checkGreenCheckMarkVisibilityMultiBags("bag-identifier-1")
      inputChecker.checkGreenCheckMarkVisibilityMultiBags("cassette-1")
      inputChecker.nextButtonCheck('be.enabled')
    }
},

  satLabBagStorage: {
    previousHappyPathSteps: (scope,therapy,toSite,input) => {
      sat_steps.satLabCollectionSummary(scope, therapy)
      cy.get(`@coi`).then(coi => {
      sat_steps.satLabVerifyShipment(toSite, therapy, coi);
      sat_steps.satLabShipmentChecklist(scope.coi);
      sat_steps.satLabShipmentChecklistSummary(scope)
      sat_steps.satLabCryopreservation(input.itemCount);
      sat_steps.satLabCryopreservationLabels(scope.coi);
      })
    },

    coiBagIdentifierOnBagNeg: () => {
      // C34880
      inputChecker.keepFieldsEmptymultiBags("bag-identifier-1","be.disabled")
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi+`-FP-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi+`-APH-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi)
      })
    },

    saveAndCloseButtonPositive: () => {
      // C34881
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultiplePos("bag-identifier-1",coi+`-PRC-0${1}`,"be.visible")
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      })
    },

    retainsValueUponClickingNext: () => {
      // C34882
      inputChecker.checkForTheInfoSavedClickingNextAndBack();
      inputChecker.checkGreenCheckMarkVisibilityMultiBags("bag-identifier-1");
    },
  },
  cryopreservationData: {
    previousHappyPathSteps: (scope,therapy,toSite,input) => {
      sat_steps.satLabCollectionSummary(scope, therapy)
      cy.get(`@coi`).then(coi => {
      sat_steps.satLabVerifyShipment(toSite, therapy, coi);
      sat_steps.satLabShipmentChecklist(scope.coi);
      sat_steps.satLabShipmentChecklistSummary(scope)
      sat_steps.satLabCryopreservation(input.itemCount);
      sat_steps.satLabCryopreservationLabels(scope.coi);
      sat_steps.satLabBagStorageEU(scope.coi);
      })
    },

    coiBagIdentifierOnBagNeg: () => {
      // C34921
      inputHelpers.inputSingleField('[data-testid=masked-input-control]', inputs.maskedInputControl)
      inputHelpers.inputSingleField('[id="#/properties/product_volume-input"]', inputs.productVolume)
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/total_cells-input"]', inputs.totalCells)
      inputChecker.keepFieldsEmptymultiBags("bag-identifier-1","be.disabled")
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi+`-FP-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi+`-APH-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi)
      })
    },

    cryoTimeNeg: () => {
      // C34922
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultiplePos("bag-identifier-1",coi+`-PRC-0${1}`,"be.visible")
        inputChecker.clearValueAndCheckForButton('[data-testid=masked-input-control]',"be.disabled")
      })
    },

    totalCellFieldNeg: () =>{
      // C34923
      inputHelpers.inputSingleField('[data-testid=masked-input-control]', inputs.cryoTime)
      inputChecker.clearValueAndCheckForButton('[id="#/properties/custom_fields/properties/total_cells-input"]','be.disabled')
      inputChecker.inputSingleFieldCheck('[id="#/properties/custom_fields/properties/total_cells-input"]',regressionInput.collection.negVolume,'be.disabled');
    },

    productVolumeNeg: () =>{
      // C34924
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/total_cells-input"]', inputs.totalCells)
      inputChecker.clearValueAndCheckForButton('[id="#/properties/product_volume-input"]','be.disabled')
      inputChecker.inputSingleFieldCheck('[id="#/properties/product_volume-input"]',regressionInput.collection.negVolume,'be.disabled');
    },

    saveAndCloseButtonPositive: () => {
      // C21619
      inputHelpers.inputSingleField('[id="#/properties/product_volume-input"]', inputs.productVolume)
      cy.get(`@coi`).then(coi => { 
      inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      })
    },

    retainsValueUponClickingNext: () => {
      // C38106
      inputChecker.checkForTheInfoSavedClickingNextAndBack();
      inputChecker.checkGreenCheckMarkVisibilityMultiBags("bag-identifier-1");
      inputChecker.checkValue('[data-testid=masked-input-control]',inputs.cryoTime)
      inputChecker.checkValue('[id="#/properties/product_volume-input"]',inputs.productVolume);
      inputChecker.checkValue('[id="#/properties/custom_fields/properties/total_cells-input"]',inputs.totalCells);
    },
  },
  satLabCryopreservationSummary: {
    previousHappyPathSteps: (scope,therapy,toSite,input) => {
      sat_steps.satLabCollectionSummary(scope, therapy)
      cy.get(`@coi`).then(coi => {
      sat_steps.satLabVerifyShipment(toSite, therapy, coi);
      sat_steps.satLabShipmentChecklist(scope.coi);
      sat_steps.satLabShipmentChecklistSummary(scope)
      sat_steps.satLabCryopreservation(input.itemCount);
      sat_steps.satLabCryopreservationLabels(scope.coi);
      sat_steps.satLabBagStorageEU(scope.coi);
      sat_steps.satLabCryopreservationData(input, scope.coi);
      })
    },

    posEditButton: () => { 
      //C34841
      inputHelpers.clicker('[data-testid="edit-cryopreservation_data"]')
      inputHelpers.inputSingleField('[id="#/properties/product_volume-input"]', regressionInput.collection.changedVolume)
      inputChecker.reasonForChange()
      inputChecker.checkValue('[id="#/properties/product_volume-input"]',regressionInput.collection.changedVolume)
  },

  checkNextButtonWithAndWithoutSig: () => {
      //C34842
      inputChecker.checkNextButtonWithAndWithoutSignature('2')
  },

  saveAndClosePos: () => {
    //C34844
    cy.get(`@coi`).then(coi => { 
      inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      })
  },
},

  satLabPrintShipperLabels: {
    previousHappyPathSteps: (scope,therapy,toSite,input) => {
      sat_steps.satLabCollectionSummary(scope, therapy)
      cy.get(`@coi`).then(coi => {
      sat_steps.satLabVerifyShipment(toSite, therapy, coi);
      sat_steps.satLabShipmentChecklist(scope.coi);
      sat_steps.satLabShipmentChecklistSummary(scope)
      sat_steps.satLabCryopreservation(input.itemCount);
      sat_steps.satLabCryopreservationLabels(scope.coi);
      sat_steps.satLabBagStorageEU(scope.coi);
      sat_steps.satLabCryopreservationData(input, scope.coi);
      sat_steps.satLabCryopreservationSummary(scope)
      })
    },

    printLablesClickable: () => {
      // C38175
      inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]')
      inputChecker.popupMessageVisible('btn-print','banner-container-0')
      inputChecker.nextButtonCheck('not.be.disabled')
  },

  confirmPrintLabelNeg: () => {
    // C34918
      inputChecker.clickOnCheck('[id="#/properties/data/properties/is_confirmed"]',"be.disabled")
  },

  saveAndClosePos: () => {
    // C34920
    inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]')
    cy.get(`@coi`).then(coi => { 
      inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations");
    })
  }
},
bagSelection: {
  previousHappyPathSteps: (scope,therapy,toSite,input) => {
    sat_steps.satLabCollectionSummary(scope, therapy)
    cy.get(`@coi`).then(coi => {
    sat_steps.satLabVerifyShipment(toSite, therapy, coi);
    sat_steps.satLabShipmentChecklist(scope.coi);
    sat_steps.satLabShipmentChecklistSummary(scope)
    sat_steps.satLabCryopreservation(input.itemCount);
    sat_steps.satLabCryopreservationLabels(scope.coi);
    sat_steps.satLabBagStorageEU(scope.coi);
    sat_steps.satLabCryopreservationData(input, scope.coi);
    sat_steps.satLabCryopreservationSummary(scope)
    sat_steps.satLabPrintShipperLabels();
    })
  },

  negNoInputForBagSelection: () => {
    //C34838
    inputChecker.nextButtonCheck('be.disabled')
  },

  negDoNotShipBag: () => {
    //C34839
  inputHelpers.clicker('[data-testid="fail-button-0"]')
  inputChecker.nextButtonCheck('be.disabled')
  },

  saveAndClosePos: () => {
    // C34840
    inputHelpers.clicker('[data-testid="pass-button-0"]')
    cy.get(`@coi`).then(coi => { 
      inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations");
      })
  },
},

satLabTransferProductToShipper: {
  previousHappyPathSteps: (scope,therapy,toSite,input) => {
    sat_steps.satLabCollectionSummary(scope, therapy)
    cy.get(`@coi`).then(coi => {
    sat_steps.satLabVerifyShipment(toSite, therapy, coi);
    sat_steps.satLabShipmentChecklist(scope.coi);
    sat_steps.satLabShipmentChecklistSummary(scope)
    sat_steps.satLabCryopreservation(input.itemCount);
    sat_steps.satLabCryopreservationLabels(scope.coi);
    sat_steps.satLabBagStorageEU(scope.coi);
    sat_steps.satLabCryopreservationData(input, scope.coi);
    sat_steps.satLabCryopreservationSummary(scope)
    sat_steps.satLabPrintShipperLabels();
    sat_steps.satLabBagSelection();
    })
  },

  negBagId: () => {
    //C21612
    inputHelpers.clicker('[data-testid="pass-button-case_intact_1"]')
    inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"]')
    inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"]')
    inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]')
    inputChecker.keepFieldsEmptymultiBags('cassette-1','be.disabled')
    cy.get(`@coi`).then(coi => { 
      inputChecker.scanAndVerifyMultipleNeg("cassette-1",coi+`-FP-0${1}`)
      inputChecker.scanAndVerifyMultipleNeg("cassette-1",coi+`-APH-0${1}`)
      inputChecker.scanAndVerifyMultipleNeg("cassette-1",coi)
    })
  },
  negCoi: () => {
    //C21620
    cy.get(`@coi`).then(coi => { 
      inputChecker.scanAndVerifyMultiplePos("cassette-1",coi+`-PRC-0${1}`,"be.visible")
    })
    inputChecker.scanAndVerifyFieldAsEmpty('ln-2-shipper-1','be.disabled')
    cy.get(`@coi`).then(coi => { 
      inputChecker.scanAndVerifyMultipleNeg("ln-2-shipper-1",coi+`-FP-0${1}`)
      inputChecker.scanAndVerifyMultipleNeg("ln-2-shipper-1",coi+`-APH-0${1}`)
      inputChecker.scanAndVerifyMultipleNeg("ln-2-shipper-1",coi+`-PRC-0${1}`)
    })
  },

  negToggleCaseIntactEmpty: () => {
    //C34886
    cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyMultiplePos('ln-2-shipper-1', coi,"be.visible")
    })
    inputHelpers.clicker('[data-testid="pass-button-case_intact_1"]')
    inputChecker.nextButtonCheck('be.disabled')
  },

  negToggleCaseIntact: () => {
    // C34885
    inputHelpers.clicker('[data-testid="fail-button-case_intact_1"]')
    inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/case_intact_1_reason-input"]')
    inputChecker.nextButtonCheck('be.disabled')
  },

  posToggleCaseIntact: () => {
    // C34887
    inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/case_intact_1_reason-input"]',inputs.additionalComments,"not.be.disabled")
  },

  negToggleTempRangeEmpty: () => {
    //C34889
    inputHelpers.clicker('[data-testid="pass-button-case_intact_1"]')
    inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"]')
    inputChecker.nextButtonCheck('be.disabled')
  },

  negToggleTempRange: () => {
    // C34888
    inputHelpers.clicker('[data-testid="fail-button-temp_out_of_range_1"]')
    inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/temp_out_of_range_1_reason-input"]')
    inputChecker.nextButtonCheck('be.disabled')
  },

  posToggleTempRange: () => {
    // C34890
    inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/temp_out_of_range_1_reason-input"]',inputs.additionalComments,"not.be.disabled")
  },

  negIsredTamperSealEmpty: () => {
    //	C34895
    inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"]')
    inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]')
    inputChecker.nextButtonCheck('be.disabled')
  },

  negIsredTamperSeal: () => {
    // C34894
    inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_seal_labeled_rack"]')
    inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_seal_labeled_rack_reason-input"]')
    inputChecker.nextButtonCheck('be.disabled')
  },

  posIsredTamperSeal: () => {
    // C34896
    inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_seal_labeled_rack_reason-input"]',inputs.additionalComments,"not.be.disabled")
  },

  negToggleProductsStatusEmpty: () => {
    //C34892
    inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]')
    inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"]')
    inputChecker.nextButtonCheck('be.disabled')
  },

  negToggleProductsStatus: () => {
    // C34891
    inputHelpers.clicker('[data-testid="fail-button-ambient_temperature_exposure"]')
    inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/ambient_temperature_exposure_reason-input"]')
    inputChecker.nextButtonCheck('be.disabled')
  },
  posToggleProductsStatus: () => {
    // C34893
    inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/ambient_temperature_exposure_reason-input"]',inputs.additionalComments,"not.be.disabled")
  },
  posSaveAndClose: () => {
    //	C34897
    inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"]')
    cy.get(`@coi`).then(coi => {
      inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
    })
  },

  retainsValueUponClickingNext: () => {
    // C34898
    inputChecker.checkForTheInfoSavedClickingNextAndBack();
    inputChecker.checkValue('[data-testid="pass-button-case_intact_1"]', 'true');
    inputChecker.checkValue('[data-testid="pass-button-temp_out_of_range_1"]', 'true');
    inputChecker.checkValue('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]', 'true');
    inputChecker.checkValue('[data-testid="pass-button-ambient_temperature_exposure"]', 'true');
    inputChecker.checkForGreenCheck("cassette-1")
    inputChecker.checkForGreenCheck("ln-2-shipper-1")
  },
},

SatLabShippingChecklist: {
  previousHappyPathSteps: (scope,therapy,toSite,input) => {
    sat_steps.satLabCollectionSummary(scope, therapy)
    cy.get(`@coi`).then(coi => {
    sat_steps.satLabVerifyShipment(toSite, therapy, coi);
    sat_steps.satLabShipmentChecklist(coi);
    sat_steps.satLabShipmentChecklistSummary(scope)
    sat_steps.satLabCryopreservation(input.itemCount);
    sat_steps.satLabCryopreservationLabels(coi);
    sat_steps.satLabBagStorageEU(coi);
    sat_steps.satLabCryopreservationData(input,coi);
    sat_steps.satLabCryopreservationSummary(scope)
    sat_steps.satLabPrintShipperLabels();
    sat_steps.satLabBagSelection();
    sat_steps.satLabTransferProductToShipper('-cccp',coi);
    })
  },

  negAirwayBillNumber: () =>{
    inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/evo_is_id-input"]', inputs.evoLast4Digits)
    inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', inputs.tamperSealNumber)
    inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]')
    inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]')
    inputHelpers.clicker('[data-testid="pass-button-red_wire"]')
    inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
    inputHelpers.clicker('[data-testid=pass-button-consignee_kit_pouch_inside]')
    inputHelpers.clicker('[data-testid=pass-button-zip_ties_secured]')
    inputChecker.nextButtonCheck("be.disabled");
  },

  negInvalidEvo: (scope) => {
    cy.get(`@coi`).then(coi => { 
    getSatAirWayBill(scope.patientIformation.subjectNumber, coi)
    })

    inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', inputs.tamperSealNumber)
    inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]')
    inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]')
    inputHelpers.clicker('[data-testid="pass-button-red_wire"]')
    inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
    inputHelpers.clicker('[data-testid=pass-button-consignee_kit_pouch_inside]')
    inputHelpers.clicker('[data-testid=pass-button-zip_ties_secured]')
    inputChecker.nextButtonCheck("be.disabled");

    inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/evo_is_id-input"]', regressionInput.collection.evoLast4DigitsTwoDigit);
    inputChecker.nextButtonCheck("be.disabled");

    inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/evo_is_id-input"]', 'a');
    inputChecker.nextButtonCheck("be.disabled");

    inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/evo_is_id-input"]', regressionInput.collection.evoLast4DigitsFiveDigit);
    inputChecker.nextButtonCheck("be.disabled");

  },
  
  negTamperSealEmpty: () => {
    inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/evo_is_id-input"]', inputs.evoLast4Digits)
    inputChecker.nextButtonCheck("be.disabled");
  },

  negEvoNumberListedOnAirWaybillNo: () => {
    inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', inputs.tamperSealNumber)
    inputHelpers.clicker('[data-testid="fail-button-evo_airway_bill"]')
    inputChecker.nextButtonCheck("be.disabled");

  },

  posEvoNumberListedOnAirWaybillNoWithDetail: () => {
    inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-evo_airway_bill"]')
  },

  negEvoNumberListedOnAirWaybillNoSelection: () => {
    inputHelpers.clicker('[data-testid="fail-button-evo_airway_bill"]')
    inputChecker.nextButtonCheck("be.disabled");
  },

  negRedWireTamperSealNo: () => {
    inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]')
    inputHelpers.clicker('[data-testid="fail-button-red_wire"]')
    inputChecker.nextButtonCheck("be.disabled");

  },

  negRedWireTamperSealNoWithDetail: () => {
    inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-red_wire"]')

  },

  negRedWireTamperSealNoSelection: () => {
    inputHelpers.clicker('[data-testid="fail-button-red_wire"]')
    inputChecker.nextButtonCheck("be.disabled");

  },

  negTamperSealNumberListedOnAirWaybillNo: () => {
    inputHelpers.clicker('[data-testid="pass-button-red_wire"]')
    inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]')
    inputChecker.nextButtonCheck("be.disabled");

  },

  posTamperSealNumberListedOnAirWaybillNoWithDetail: () => {
    inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-tamper_seal_match"]')
  },

  negnegTamperSealNumberListedOnAirWaybillNoSelection: () => {
    inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]')
    inputChecker.nextButtonCheck("be.disabled");
  },

  negShipperLabelIncludedWithShipperNo: () => {
    inputHelpers.clicker('[data-testid="fail-button-shipper_label_placed"]')
    inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
    inputChecker.nextButtonCheck("be.disabled");

  },

  posShipperLabelIncludedWithShipperNoWithDetail: () => {
    inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-shipper_label_placed"]')
  },

  negShipperLabelIncludedWithShipperNoSelection: () => {
    inputHelpers.clicker('[data-testid="fail-button-shipper_label_placed"]')
    inputChecker.nextButtonCheck("be.disabled");
  },

  negConsigneeKitPouchIncludedNo: () => {
    inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]')
    inputHelpers.clicker('[data-testid=fail-button-consignee_kit_pouch_inside]')

    inputChecker.nextButtonCheck("be.disabled");
  },

  posConsigneeKitPouchIncludedNoWithDetails: () => {
    inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-consignee_kit_pouch_inside"]')
  },

  negConsigneeKitPouchIncludedNoSelection: () => {
    inputHelpers.clicker('[data-testid=fail-button-consignee_kit_pouch_inside]')
    inputChecker.nextButtonCheck("be.disabled");
  },

  negShippingContainerSecuredNo: () => {
    inputHelpers.clicker('[data-testid=pass-button-consignee_kit_pouch_inside]')
    inputHelpers.clicker('[data-testid=fail-button-zip_ties_secured]')
    inputChecker.nextButtonCheck("be.disabled");
  },

  posShippingContainerSecuredNoWithDetail: () => {
    inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-zip_ties_secured"]')
  },

  negShippingContainerSecuredNoSelection: () => {
    inputHelpers.clicker('[data-testid=fail-button-zip_ties_secured]')
    inputChecker.nextButtonCheck("be.disabled");
  },

  posDataOnSaveAndClose: () => {
    inputHelpers.clicker('[data-testid=pass-button-zip_ties_secured]')
    cy.get(`@coi`).then(coi => { 
    inputChecker.checkDataSavingWithSaveAndClose(coi, 'be.enabled', 'Reservations')
    })
  },

  posDataOnBackAndNext: () => {
    inputHelpers.clicker('[data-testid="back-nav-link"]')
    inputHelpers.clicker("[data-testid='primary-button-action']")
    inputChecker.nextButtonCheck("be.enabled");

  },

},


SatShippingSummaryVerify: {
  previousHappyPathSteps: (scope,therapy,toSite,input) => {
    sat_steps.satLabCollectionSummary(scope, therapy)
    cy.get(`@coi`).then(coi => {
    sat_steps.satLabVerifyShipment(toSite, therapy, coi);
    sat_steps.satLabShipmentChecklist(coi);
    sat_steps.satLabShipmentChecklistSummary(scope)
    sat_steps.satLabCryopreservation(input.itemCount);
    sat_steps.satLabCryopreservationLabels(coi);
    sat_steps.satLabBagStorageEU(coi);
    sat_steps.satLabCryopreservationData(input,coi);
    sat_steps.satLabCryopreservationSummary(scope)
    sat_steps.satLabPrintShipperLabels();
    sat_steps.satLabBagSelection();
    sat_steps.satLabTransferProductToShipper('-cccp',coi);
    sat_steps.satLabShippingChecklist(1, input.evoLast4Digits, input.tamperSealNumber, scope);
    })
  },

  posEditTransferProductToShipper: () => {
    inputHelpers.clicker('[data-testid=edit-shipment_checklist]')
    inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/evo_is_id-input"]', regressionInput.collection.evoLast4Digits);
    inputChecker.reasonForChange()
    inputChecker.checkLabelAfterNext(
                          '[data-test-id="satellite_lab_cryopreservation_shipping_summary"]',
                          '[data-testid="txt-field-layout-Please enter the last 4 digits of the EVO-IS Number on the LN2 shipper lid-answer"]>>',
                          regressionInput.collection.evoLast4Digits
    )
  },

  posEditConditionOfShipment: () => {
    inputHelpers.clicker('[data-testid="edit-transfer_product_to_shipper"]')
    inputHelpers.clicker('[data-testid="fail-button-case_intact_1"]')
    inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/case_intact_1_reason-input"]', regressionInput.collection.caseIntactReasonInput)
    inputChecker.reasonForChange()
    inputChecker.checkLabelAfterNext(
      '[data-test-id="satellite_lab_cryopreservation_shipping_summary"]',
      '[data-testid="txt-field-layout-Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact your Janssen Cell Therapy Coordinator.-answer"] >>>>>>',
      'No'
    )
  },

  negNextButtonOnConfirmerSign: () => {
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    inputChecker.nextButtonCheck("be.disabled");

  },

  posDoneButtonOnVerifierSign: () => {
    const verifier = 'quela@vineti.com'
    signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], verifier)
    inputChecker.nextButtonCheck("be.enabled");

  },

  posDataOnSaveAndClose: () => {
    cy.get(`@coi`).then(coi => { 
    inputChecker.checkDataSavingWithSaveAndClose(coi, 'be.enabled', 'Reservations')
    })
  },
},
checkStatusesOfSatelliteLabModule: (scope,therapy) => {
  //C38199
    cy.get(`@coi`).then(coi => { 
    inputHelpers.clickOnHeader('satellite_lab')
    cy.checkStatus(coi,regressionInput.satelliteLab.statuses.collectionSummary, 'Reservations',2)
    sat_steps.satLabCollectionSummary(scope, therapy)

    inputHelpers.clickOnHeader('satellite_lab')
    cy.checkStatus(coi,regressionInput.satelliteLab.statuses.verifyShipper, 'Reservations',2)
    sat_steps.satLabVerifyShipment('satellite-lab', '-cccp', coi);

    inputHelpers.clickOnHeader('satellite_lab')
    cy.checkStatus(coi,regressionInput.satelliteLab.statuses.shipmentReceiptChecklist, 'Reservations',2)
    sat_steps.satLabShipmentChecklist(coi);

    inputHelpers.clickOnHeader('satellite_lab')
    cy.checkStatus(coi,regressionInput.satelliteLab.statuses.shipmentReceiptChecklistSummary, 'Reservations',2)
    sat_steps.satLabShipmentChecklistSummary(scope)

    inputHelpers.clickOnHeader('satellite_lab')
    cy.checkStatus(coi,regressionInput.satelliteLab.statuses.satLabCryopreservation, 'Reservations',2)
    sat_steps.satLabCryopreservation(inputs.itemCount);

    inputHelpers.clickOnHeader('satellite_lab')
    cy.checkStatus(coi,regressionInput.satelliteLab.statuses.cryopreservationLabels, 'Reservations',2)
    sat_steps.satLabCryopreservationLabels(coi);

    inputHelpers.clickOnHeader('satellite_lab')
    cy.checkStatus(coi,regressionInput.satelliteLab.statuses.bagStorage, 'Reservations',2)
    sat_steps.satLabBagStorageEU(coi);

    inputHelpers.clickOnHeader('satellite_lab')
    cy.checkStatus(coi,regressionInput.satelliteLab.statuses.cryoPreservationData, 'Reservations',2)
    sat_steps.satLabCryopreservationData(inputs, coi);

    inputHelpers.clickOnHeader('satellite_lab')
    cy.checkStatus(coi,regressionInput.satelliteLab.statuses.cryoPreservationSummary, 'Reservations',2)
    sat_steps.satLabCryopreservationSummary(scope)

    inputHelpers.clickOnHeader('satellite_lab')
    cy.checkStatus(coi,regressionInput.satelliteLab.statuses.printShipperLabels, 'Reservations',2)
    sat_steps.satLabPrintShipperLabels();

    inputHelpers.clickOnHeader('satellite_lab')
    cy.checkStatus(coi,regressionInput.satelliteLab.statuses.bagSelection, 'Reservations',2)
    sat_steps.satLabBagSelection();

    inputHelpers.clickOnHeader('satellite_lab')
    cy.checkStatus(coi,regressionInput.satelliteLab.statuses.transferProductToShipper, 'Reservations',2)
    sat_steps.satLabTransferProductToShipper('-cccp', coi);

    inputHelpers.clickOnHeader('satellite_lab')
    cy.checkStatus(coi,regressionInput.satelliteLab.statuses.shipmentChecklist, 'Reservations',2)
    sat_steps.satLabShippingChecklist(1, inputs.evoLast4Digits, inputs.tamperSealNumber, scope);

    inputHelpers.clickOnHeader('satellite_lab')
    cy.checkStatus(coi,regressionInput.satelliteLab.statuses.cryoShippingSummary, 'Reservations',2)
    sat_steps.satShippingSummaryVerify(scope, therapy)

    cy.checkStatus(coi,regressionInput.satelliteLab.statuses.completed,'Reservations',2)
    
  })
}
}
