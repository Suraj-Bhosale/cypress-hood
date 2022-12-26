import inputHelpers from '../../shared_block_helpers/inputFieldHelpers.js'
import translationHelpers from '../../shared_block_helpers/translationHelpers.js'
import common from '../../../support/index.js'
import therapies from '../../../fixtures/therapy.json'
import satelliteLabAssertions from '../../../fixtures/satelliteLabAssertions.json'
import inputs from '../../../fixtures/inputs.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers.js'
import inputChecker from '../../shared_block_helpers/inputFieldCheckHelpers.js'
import sat_steps from '../../HappyPath_steps/CMLP_US_HappyPath/satelite_lab_steps'
import regressionInput from '../../../fixtures/inputsRegression.json'

const getSatAirWayBill = (scope, shippingRow, testId) => {
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
      cy.visit('/satellite_lab')
      cy.wait(3000)
      cy.contains(scope.coi).click()
      if (testId) {
        inputHelpers.inputSingleField(`[id="${testId}"]`, scope.airWayBill)
      } else {
        inputHelpers.scanAndVerifyCoi('satellite-airway-bill', scope.airWayBill)
      }
      cy.log('satLabAirWayBill', scope.airWayBill)
    })
}

export default {
  satLabCollectionSummary: {
    //C35155
    posSaveAndClose: ()=>{
      cy.get(`@coi`).then(coi => { 
      inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      })
    },
  },

  satLabVerifyShipment:{
    previousHappyPathSteps: (scope) => {
      sat_steps.satLabCollectionSummary(scope)
    },
    coiBagIdentifierOnBagNeg: () => {
      // C35152
      inputChecker.keepFieldsEmpty("ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-2003-cmlp-us","be.disabled")
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyCheck("ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-2003-cmlp-us",coi+`-FP-0${1}`,"not.be.visible","be.disabled")
        inputChecker.scanAndVerifyCheck("ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-2003-cmlp-us",coi+`-APH-0${1}`,"not.be.visible","be.disabled")
        inputChecker.scanAndVerifyCheck("ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-2003-cmlp-us",coi+`-PRC-0${1}`,"not.be.visible","be.disabled")
      })
    },

    saveAndCloseButtonPositive: () => {
      // C35153
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyCheck("ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-2003-cmlp-us",coi,"be.visible","not.be.disabled")
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      })
    },

    retainsValueUponClickingNext: () => {
      // C35154
      inputChecker.checkForTheInfoSavedClickingNextAndBack();
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
    }
  },

  satLabShipmentChecklist: {
    previousHappyPathSteps: (toSite, therapy, scope) => {
      sat_steps.satLabCollectionSummary(scope)
      cy.get(`@coi`).then(coi => {
        sat_steps.satLabVerifyShipment(toSite, therapy, coi);
      })
    },

    coiBagIdentifierOnBagNeg: () => {
      // C35140
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
      // C35141
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultiplePos("bag-identifier-1",coi+`-APH-0${1}`,"be.visible")
      })
      inputChecker.clickOnCheck('[data-testid=pass-button-does_temperature_conform]',"be.disabled")
    },

    toggleEmptyApheresisBag: () => {
      // C35142
      inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]')
      inputChecker.clickOnCheck('[data-testid=pass-button-cry_aph_bag]',"be.disabled")
    },

    toggleEmptyApheresisTwo: () => {
      // C35143
      inputHelpers.clicker('[data-testid=pass-button-cry_aph_bag]')
      inputChecker.clickOnCheck('[data-testid=pass-button-cold_shipper]',"be.disabled")
    },

    toggleDownloadTempNeg: () => {
      // C35144
      inputHelpers.clicker('[data-testid=pass-button-cold_shipper]');
      inputHelpers.clicker('[data-testid=fail-button-does_temperature_conform]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/does_temperature_conform_reason-input"]')
    },

    toggleApheresisBagNeg: () => {
      // C35145
      inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]');
      inputHelpers.clicker('[data-testid=fail-button-cry_aph_bag]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/cry_aph_bag_reason-input"]')
    },

    toggleApheresisTwoNeg: () => {
      // C35146
      inputHelpers.clicker('[data-testid=pass-button-cry_aph_bag]')
      inputHelpers.clicker('[data-testid=fail-button-cold_shipper]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/cold_shipper_reason-input"]')
    },

    toggleApheresisTwoPos: () => {
      // C35147
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/cold_shipper_reason-input"]',inputs.additionalComments,"not.be.disabled")
    },

    toggleApheresisBagPos: () => {
      // C35148
      inputHelpers.clicker('[data-testid=pass-button-cold_shipper]')
      inputHelpers.clicker('[data-testid=fail-button-cry_aph_bag]')
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/cry_aph_bag_reason-input"]',inputs.additionalComments,"not.be.disabled")
    },

    toggleDownloadTempPos: () => {
      // C35149
      inputHelpers.clicker('[data-testid=pass-button-cry_aph_bag]')
      inputHelpers.clicker('[data-testid=fail-button-does_temperature_conform]')
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/does_temperature_conform_reason-input"]',inputs.additionalComments,"not.be.disabled")
    },

    saveAndClosePos: () => {
      // C35150
      inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]')
      cy.get(`@coi`).then(coi => { 
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
        })
      inputChecker.nextButtonCheck("be.enabled")
    },

    retainsValueUponClickingNext: () => {
      // C35151
      inputChecker.checkForTheInfoSavedClickingNextAndBack();
      inputChecker.checkGreenCheckMarkVisibilityMultiBags("bag-identifier-1");
      inputChecker.checkValue('[data-testid=pass-button-does_temperature_conform]','true');
      inputChecker.checkValue('[data-testid=pass-button-cry_aph_bag]','true');
      inputChecker.checkValue('[data-testid=pass-button-cold_shipper]','true')     
    }    
  },

  satLabShipmentChecklistSummary: {
    previousHappyPathSteps: (toSite, therapy, scope) => {
      sat_steps.satLabCollectionSummary(scope)
      cy.get(`@coi`).then(coi => {
        sat_steps.satLabVerifyShipment(toSite, therapy, coi);
        sat_steps.satLabShipmentChecklist(coi)
      })
    },
    verifyEditPos: () => {
      //C35136
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
      inputChecker.nextButtonCheck('be.disabled');
      const verifier = 'quela@vineti.com'
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], verifier)
      inputChecker.nextButtonCheck('not.be.disabled');
    },
   
    saveAndClosePos: () => {
      //C35139
      inputChecker.nextButtonCheck('not.be.disabled')
      inputChecker.checkState('[data-testid=edit-shipment_receipt_checklist]', 'not.be.disabled')
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      })
    }
    
  },

  satLabCryopreservation:  {
    previousHappyPathSteps: (toSite,therapy, scope) => {
      sat_steps.satLabCollectionSummary(scope)
      cy.get(`@coi`).then(coi => {
        sat_steps.satLabVerifyShipment(toSite, therapy, coi);
        sat_steps.satLabShipmentChecklist(coi)
        sat_steps.satLabShipmentChecklistSummary(scope)
        cy.openOrder('satellite_lab', 'central_cell_lab_operator_pharmacist')
        cy.get(`@coi`).then(coi => {
        cy.commonPagination(coi,'Reservations')
        })
      })
    },

    verifyNextButtonNeg: () => {
      //C35134
      inputChecker.nextButtonCheck('be.disabled')
    },
    
    verifySaveAndClose: () => {
      //C35135
      inputHelpers.inputSingleField('input[id="#/properties/item_count-input"]', inputs.itemCount)
      inputChecker.nextButtonCheck('not.be.disabled')
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      })
    },
  },

  satLabCryopreservationLabels: {
    previousHappyPathSteps: (toSite,therapy, scope) => {
      sat_steps.satLabCollectionSummary(scope, therapy)
      cy.get(`@coi`).then(coi => {
        sat_steps.satLabVerifyShipment(toSite, therapy, coi);
        sat_steps.satLabShipmentChecklist(coi)
        sat_steps.satLabShipmentChecklistSummary(scope)
        cy.openOrder('satellite_lab', 'central_cell_lab_operator_pharmacist')
        cy.get(`@coi`).then(coi => {
        cy.commonPagination(coi,'Reservations')
        })
        sat_steps.satLabCryopreservation(inputs.itemCount)
      })
    },

    scanCassetteNeg: () => {
      //C35127
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
      //C35126
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
      //C35124
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyMultiplePos('cassette-1', `${coi}-PRC-01`, "be.visible")
      })
      cy.get('[data-testid="txt-field-layout-Verify labels have been attached to all collection bags-answer"]')
      .find('svg')
      .click()
      inputChecker.nextButtonCheck('be.disabled')
    },

    isConfirmLabelsNeg: () => {
      //C35125
      cy.get('[data-testid="txt-field-layout-Confirm labels are printed successfully-answer"]')
      .find('svg')
      .click()
      inputChecker.nextButtonCheck('be.disabled')
    },

    verifySignature: () => {
      //C35128
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
      //C35129
      cy.get(`@coi`).then(coi => { 
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations");
        })
    },

    retainsValueUponClickingBack: () => {
      // C35130
      inputChecker.checkForTheInfoSavedClickingNextAndBack()
      inputChecker.checkGreenCheckMarkVisibilityMultiBags("bag-identifier-1")
      inputChecker.checkGreenCheckMarkVisibilityMultiBags("cassette-1")
      inputChecker.nextButtonCheck('be.enabled')
    }
  },

  satLabBagStorage:  {
    previousHappyPathSteps: (toSite, therapy, scope) => {
      sat_steps.satLabCollectionSummary(scope, therapy)
      cy.get(`@coi`).then(coi => {
        sat_steps.satLabVerifyShipment(toSite, therapy, coi);
        sat_steps.satLabShipmentChecklist(coi)
        sat_steps.satLabShipmentChecklistSummary(scope)
        cy.openOrder('satellite_lab', 'central_cell_lab_operator_pharmacist')
        cy.get(`@coi`).then(coi => {
        cy.commonPagination(coi,'Reservations')
        sat_steps.satLabCryopreservation(inputs.itemCount)
        sat_steps.satLabCryopreservationLabels(coi);
        })
      })
    },

    coiBagIdentifierOnBagNeg: () => {
      // C35162
      inputChecker.keepFieldsEmptymultiBags("cassette-1","be.disabled")
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultipleNeg("cassette-1",coi+`-FP-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("cassette-1",coi+`-APH-0${1}`)
        inputChecker.scanAndVerifyMultipleNeg("cassette-1",coi)
      })
    },

    saveAndCloseButtonPositive: () => {
      // C35163
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultiplePos("cassette-1",coi+`-PRC-0${1}`,"be.visible")
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      })
    },

    retainsValueUponClickingNext: () => {
      // C35164
      inputChecker.checkForTheInfoSavedClickingNextAndBack();
      inputChecker.checkGreenCheckMarkVisibilityMultiBags("cassette-1");
    },  
  },

  satLabCryopreservationData:  {
    previousHappyPathSteps: (toSite,therapy, scope) => {
      sat_steps.satLabCollectionSummary(scope, therapy)
      cy.get(`@coi`).then(coi => {
        sat_steps.satLabVerifyShipment(toSite, therapy, coi);
        sat_steps.satLabShipmentChecklist(coi)
        sat_steps.satLabShipmentChecklistSummary(scope)
        cy.openOrder('satellite_lab', 'central_cell_lab_operator_pharmacist')
        cy.get(`@coi`).then(coi => {
        cy.commonPagination(coi,'Reservations')
        sat_steps.satLabCryopreservation(inputs.itemCount)
        sat_steps.satLabCryopreservationLabels(coi);
        sat_steps.satLabBagStorage(coi);
        })
      })
    },

    coiBagIdentifierOnBagNeg: () => {
      // C35156
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
      // C35157
      cy.get(`@coi`).then(coi => { 
        inputChecker.scanAndVerifyMultiplePos("bag-identifier-1",coi+`-PRC-0${1}`,"be.visible")
        inputChecker.clearValueAndCheckForButton('[data-testid=masked-input-control]',"be.disabled")
      })
    },

    totalCellFieldNeg: () =>{
      // C35158
      inputHelpers.inputSingleField('[data-testid=masked-input-control]', inputs.cryoTime)
      inputChecker.clearValueAndCheckForButton('[id="#/properties/custom_fields/properties/total_cells-input"]','be.disabled')
      inputChecker.inputSingleFieldCheck('[id="#/properties/custom_fields/properties/total_cells-input"]',regressionInput.collection.negVolume,'be.disabled');
    },

    productVolumeNeg: () =>{
      // C35159
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/total_cells-input"]', inputs.totalCells)
      inputChecker.clearValueAndCheckForButton('[id="#/properties/product_volume-input"]','be.disabled')
      inputChecker.inputSingleFieldCheck('[id="#/properties/product_volume-input"]',regressionInput.collection.negVolume,'be.disabled');
    },

    saveAndCloseButtonPositive: () => {
      // C35160
      inputHelpers.inputSingleField('[id="#/properties/product_volume-input"]', inputs.productVolume)
      cy.get(`@coi`).then(coi => { 
      inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      })
    },

    retainsValueUponClickingNext: () => {
      // C35161
      inputChecker.checkForTheInfoSavedClickingNextAndBack();
      inputChecker.checkGreenCheckMarkVisibilityMultiBags("bag-identifier-1");
      inputChecker.checkValue('[data-testid=masked-input-control]',inputs.cryoTime)
      inputChecker.checkValue('[id="#/properties/product_volume-input"]',inputs.productVolume);
      inputChecker.checkValue('[id="#/properties/custom_fields/properties/total_cells-input"]',inputs.totalCells);
    }  
  },

  satLabCryopreservationSummary:  {
    previousHappyPathSteps: (toSite,therapy, scope, input) => {
        sat_steps.satLabCollectionSummary(scope, therapy)
        cy.get(`@coi`).then(coi => {
        sat_steps.satLabVerifyShipment(toSite, therapy, coi);
        sat_steps.satLabShipmentChecklist(coi)
        sat_steps.satLabShipmentChecklistSummary(scope)
        cy.openOrder('satellite_lab', 'central_cell_lab_operator_pharmacist')
        cy.get(`@coi`).then(coi => {
        cy.commonPagination(coi,'Reservations')
        sat_steps.satLabCryopreservation(inputs.itemCount)
        sat_steps.satLabCryopreservationLabels(coi);
        sat_steps.satLabBagStorage(coi);
        sat_steps.satLabCryopreservationData(input, coi);
      })
    })
    },

    posEditButton: () => { 
      //C35165
      inputHelpers.clicker('[data-testid="edit-cryopreservation_data"]')
      inputHelpers.inputSingleField('[id="#/properties/product_volume-input"]', regressionInput.collection.changedVolume)
      inputChecker.reasonForChange()
      inputChecker.checkValue('[id="#/properties/product_volume-input"]',regressionInput.collection.changedVolume)
  },

  checkNextButtonWithAndWithoutSig: () => {
      //C35166
      inputChecker.checkNextButtonWithAndWithoutSignature('2')
  },

  saveAndClosePos: () => {
    //C35168
    cy.get(`@coi`).then(coi => { 
      inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      })
  }
  },

  satLabBagSelection:  {
    previousHappyPathSteps: (toSite, therapy, scope, input) => {
      sat_steps.satLabCollectionSummary(scope)
      cy.get(`@coi`).then(coi => {
      sat_steps.satLabVerifyShipment(toSite, therapy, coi);
      sat_steps.satLabShipmentChecklist(coi);
      sat_steps.satLabShipmentChecklistSummary(scope)
      })
      cy.openOrder('satellite_lab', 'central_cell_lab_operator_pharmacist')
        cy.get(`@coi`).then(coi => {
        cy.commonPagination(coi,'Reservations')
      sat_steps.satLabCryopreservation(inputs.itemCount);
      sat_steps.satLabCryopreservationLabels(coi);
      sat_steps.satLabBagStorage(coi);
      sat_steps.satLabCryopreservationData(input, coi);
      sat_steps.satLabCryopreservationSummary(scope)
      })
    },
  
    negNoInputForBagSelection: () => {
      //C35131
      inputChecker.nextButtonCheck('be.disabled')
    },
  
    negStorage: () => {
      //C35132
    inputHelpers.clicker('[data-testid="fail-button-0"]')
    inputChecker.nextButtonCheck('be.disabled')
    },
  
    saveAndClosePos: () => {
      // C35133	
      inputHelpers.clicker('[data-testid="pass-button-0"]')
      cy.get(`@coi`).then(coi => { 
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations");
        })
    },
     
  },

  checktheStatusesOfSatelliteModule: () => {
    cy.get(`@coi`).then(coi => { 
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.collectionSummary, 'Reservations',2)
      sat_steps.satLabCollectionSummary(coi)
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.verifyShipper, 'Reservations',2)
      sat_steps.satLabVerifyShipment('manufacturing-site', '-2003-cmlp-us', coi);
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.shipmentReceiptChecklist, 'Reservations',2)
      sat_steps.satLabShipmentChecklist(coi);
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.shipmentReceiptChecklistSummary, 'Reservations',2)
      sat_steps.satLabShipmentChecklistSummary(coi)
      
      cy.openOrder('satellite_lab', 'central_cell_lab_operator_pharmacist')
      cy.commonPagination(coi,'Reservations')
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.satLabCryopreservation, 'Reservations',2)
      sat_steps.satLabCryopreservation(inputs.itemCount);
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.cryopreservationLabels, 'Reservations',2)
      sat_steps.satLabCryopreservationLabels(coi);
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.bagStorage, 'Reservations',2)
      sat_steps.satLabBagStorage(coi);
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.cryoPreservationData, 'Reservations',2)
      sat_steps.satLabCryopreservationData(inputs, coi);
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.cryoPreservationSummary, 'Reservations',2)
      sat_steps.satLabCryopreservationSummary(coi)
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.bagSelection, 'Reservations',2)
      sat_steps.satLabBagSelection();
  
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.completed,'Reservations',2)
      
    })

  }
}
