import inputHelpers from '../../shared_block_helpers/inputFieldHelpers.js'
import translationHelpers from '../../shared_block_helpers/translationHelpers.js'
import common from '../../../support/index.js'
import therapies from '../../../fixtures/therapy.json'
import satelliteLabAssertions from '../../../fixtures/satelliteLabAssertions.json'
import inputs from '../../../fixtures/inputs.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers.js'
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers"
import sat_steps from "../../HappyPath_steps/CCCP_IS_HappyPath/satelite_lab_steps"
import regressionInput from '../../../fixtures/inputsRegression.json'



const getSatAirWayBill = (uniqueId) => {
  cy.openOrder('ordering', 'oliver')
  cy.commonPagination(uniqueId, 'Treatments per Patient')
  cy.get('[data-testid="td-stage-plane-icon"]')
    .eq(0)
    .parent()
    .parent()
    .parent()
    .find('[data-testid="td-stage-site-details"]')
    .invoke('text')
    .then((text) => {
       let airWayBill = text.substring(9, text.length)
      cy.get(`@coi`).then(coi => { 
      cy.openOrder('satellite_lab', 'steph')
      cy.commonPagination(coi, 'Reservations')
      inputHelpers.scanAndVerifyCoi('satellite-airway-bill', airWayBill)
      cy.wait(1000)
      cy.log('collectionAirwayBill', airWayBill)
  
    })
  })
}

  export default {

    satLabCollectionSummary: {

      //C35907	[POS] Verify if the data is retained upon clicking 'Save & Close' button.
      posSaveAndClose: ()=>{
        cy.get(`@coi`).then(coi => { 
          inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
        })

      },

    },
  
    satLabVerifyShipment:{
      previousHappyPathSteps: (scope,therapy) => {
        sat_steps.satLabCollectionSummary(scope, therapy)
      },
      //C35850
      coiBagIdentifierOnBagNeg: () => {
        inputChecker.keepFieldsEmpty("ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cccp-is","be.disabled")
        cy.get(`@coi`).then(coi => { 
          inputChecker.scanAndVerifyCheck("ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cccp-is",coi+`-FP-0${1}`,"not.be.visible","be.disabled")
          inputChecker.scanAndVerifyCheck("ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cccp-is",coi+`-APH-0${1}`,"not.be.visible","be.disabled")
          inputChecker.scanAndVerifyCheck("ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cccp-is",coi+`-PRC-0${1}`,"not.be.visible","be.disabled")
        })

      },

      //C35851
      saveAndCloseButtonPositive: () => {
        cy.get(`@coi`).then(coi => { 
          inputChecker.scanAndVerifyCheck("ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cccp-is",coi,"be.visible","not.be.disabled")
          inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
        })
        
      },

      //C35852
      retainsValueUponClickingNext: () => {
        inputChecker.checkForTheInfoSavedClickingNextAndBack();
        inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      }
        
    },
  
    satLabShipmentChecklist: {
      previousHappyPathSteps: (toSite,therapy,scope) => {
        sat_steps.satLabCollectionSummary(scope, therapy)
        cy.get(`@coi`).then(coi => {
          sat_steps.satLabVerifyShipment(toSite, therapy, coi);
        })
      },

      //C35877
      coiBagIdentifierOnBagNeg: () => {
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

      //C35878
      toggleEmptyDownloadTemp: () => {
        cy.get(`@coi`).then(coi => { 
          inputChecker.scanAndVerifyMultiplePos("bag-identifier-1",coi+`-APH-0${1}`,"be.visible")
        })
        inputChecker.clickOnCheck('[data-testid=pass-button-does_temperature_conform]',"be.disabled")

      },

      //C35879
      toggleEmptyApheresisBag: () => {
        inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]')
        inputChecker.clickOnCheck('[data-testid=pass-button-cry_aph_bag]',"be.disabled")

      },

      //C35880
      toggleEmptyApheresisTwo: () => {
        inputHelpers.clicker('[data-testid=pass-button-cry_aph_bag]')
        inputChecker.clickOnCheck('[data-testid=pass-button-cold_shipper]',"be.disabled")

      },

      //C35881
      toggleDownloadTempNeg: () => {
        inputHelpers.clicker('[data-testid=pass-button-cold_shipper]');
        inputHelpers.clicker('[data-testid=fail-button-does_temperature_conform]')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/does_temperature_conform_reason-input"]')

      },

      //C35882
      toggleApheresisBagNeg: () => {
        inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]');
        inputHelpers.clicker('[data-testid=fail-button-cry_aph_bag]')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/cry_aph_bag_reason-input"]')

      },

      //C35883
      toggleApheresisTwoNeg: () => {
        inputHelpers.clicker('[data-testid=pass-button-cry_aph_bag]')
        inputHelpers.clicker('[data-testid=fail-button-cold_shipper]')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_receipt_checklist/properties/cold_shipper_reason-input"]')

      },

      //C35884
      toggleApheresisTwoPos: () => {
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/cold_shipper_reason-input"]',inputs.additionalComments,"not.be.disabled")
      },

      //C35885
      toggleApheresisBagPos: () => {
        inputHelpers.clicker('[data-testid=pass-button-cold_shipper]')
        inputHelpers.clicker('[data-testid=fail-button-cry_aph_bag]')
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/cry_aph_bag_reason-input"]',inputs.additionalComments,"not.be.disabled")

      },

      //C35886
      toggleDownloadTempPos: () => {
        inputHelpers.clicker('[data-testid=pass-button-cry_aph_bag]')
        inputHelpers.clicker('[data-testid=fail-button-does_temperature_conform]')
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_receipt_checklist/properties/does_temperature_conform_reason-input"]',inputs.additionalComments,"not.be.disabled")
      },

      //C35887
      saveAndClosePos: () => {
        inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]')
        cy.get(`@coi`).then(coi => { 
          inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
          })
        inputChecker.nextButtonCheck("be.enabled")
      }, 

      //C35888
      retainsValueUponClickingNext: () => {
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
        //C35846
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
        //C35848
        inputChecker.nextButtonCheck('be.disabled');
        const verifier = 'quela@vineti.com'
        signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
        signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], verifier)
        inputChecker.nextButtonCheck('not.be.disabled');
      },
      saveAndClosePos: () => {
        //C35849
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
        //C35905
        inputChecker.nextButtonCheck('be.disabled')
      },
      
      verifySaveAndClose: () => {
        //C35906
        inputHelpers.inputSingleField('input[id="#/properties/item_count-input"]', inputs.itemCount)
        inputChecker.nextButtonCheck('not.be.disabled')
        cy.get(`@coi`).then(coi => {
          inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
        })
      },
    },
  
    satLabCryopreservationLabels: {
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
          //C35889
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
          //C35890
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
          //C35891
          cy.get(`@coi`).then(coi => {
            inputChecker.scanAndVerifyMultiplePos('cassette-1', `${coi}-PRC-01`, "be.visible")
          })
          cy.get('[data-testid="txt-field-layout-Confirm labels are printed successfully-answer"]')
          .find('svg')
          .click()
          inputChecker.nextButtonCheck('be.disabled')
        },
    
        isConfirmLabelsNeg: () => {
          //C35892
          cy.get('[data-testid="txt-field-layout-Verify labels have been attached to all collection bags-answer"]')
          .find('svg')
          .click()
          inputChecker.nextButtonCheck('be.disabled')
        },
    
        verifySignature: () => {
          //C35893
          cy.get('[data-testid="txt-field-layout-Confirm labels are printed successfully-answer"]')
          .find('svg')
          .click()
          cy.get('[data-testid="txt-field-layout-Verify labels have been attached to all collection bags-answer"]')
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
          //C35894
          cy.get(`@coi`).then(coi => { 
            inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations");
            })
        },
    
        retainsValueUponClickingBack: () => {
          // C35895
          inputChecker.checkForTheInfoSavedClickingNextAndBack();
          inputChecker.checkForGreenCheck("cassette-1")
          inputChecker.checkForGreenCheck("bag-identifier-1")
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
        // C35858
        inputChecker.keepFieldsEmptymultiBags("bag-identifier-1","be.disabled")
        cy.get(`@coi`).then(coi => { 
          inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi+`-FP-0${1}`)
          inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi+`-APH-0${1}`)
          inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi)
        })
      },
  
      saveAndCloseButtonPositive: () => {
        // C35859
        cy.get(`@coi`).then(coi => { 
          inputChecker.scanAndVerifyMultiplePos("bag-identifier-1",coi+`-PRC-0${1}`,"be.visible")
          inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
        })
      },
  
      retainsValueUponClickingNext: () => {
        // C35860
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
        // C35899
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
        // C35900
        cy.get(`@coi`).then(coi => { 
          inputChecker.scanAndVerifyMultiplePos("bag-identifier-1",coi+`-PRC-0${1}`,"be.visible")
          inputChecker.clearValueAndCheckForButton('[data-testid=masked-input-control]',"be.disabled")
        })
      },
  
      totalCellFieldNeg: () =>{
        //  C35901
        inputHelpers.inputSingleField('[data-testid=masked-input-control]', inputs.cryoTime)
        inputChecker.clearValueAndCheckForButton('[id="#/properties/custom_fields/properties/total_cells-input"]','be.disabled')
        inputChecker.inputSingleFieldCheck('[id="#/properties/custom_fields/properties/total_cells-input"]',regressionInput.collection.negVolume,'be.disabled');
      },
  
      productVolumeNeg: () =>{
        //C35902
        inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/total_cells-input"]', inputs.totalCells)
        inputChecker.clearValueAndCheckForButton('[id="#/properties/product_volume-input"]','be.disabled')
        inputChecker.inputSingleFieldCheck('[id="#/properties/product_volume-input"]',regressionInput.collection.negVolume,'be.disabled');
      },
  
      saveAndCloseButtonPositive: () => {
        //C35903
        inputHelpers.inputSingleField('[id="#/properties/product_volume-input"]', inputs.productVolume)
        cy.get(`@coi`).then(coi => { 
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
        })
      },
  
      retainsValueUponClickingNext: () => {
        // C35904
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
        //C35819
        inputHelpers.clicker('[data-testid="edit-cryopreservation_data"]')
        inputHelpers.inputSingleField('[id="#/properties/product_volume-input"]', regressionInput.collection.changedVolume)
        inputChecker.reasonForChange()
        inputChecker.checkValue('[id="#/properties/product_volume-input"]',regressionInput.collection.changedVolume)
    },
  
    checkNextButtonWithAndWithoutSig: () => {
        //C35822 
        inputChecker.checkNextButtonWithAndWithoutSignature('2')
    },
    saveAndClosePos: () => {
      //C40121
      cy.get(`@coi`).then(coi => { 
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
        })
    }
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
        // C35896
        inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]')
        inputChecker.popupMessageVisible('btn-print','banner-container-0')
        inputChecker.nextButtonCheck('not.be.disabled')
    },
  
    confirmPrintLabelNeg: () => {
      // C35897
        inputChecker.clickOnCheck('[id="#/properties/data/properties/is_confirmed"]',"be.disabled")
    },
  
    saveAndClosePos: () => {
      // C35898
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
      //C35816
      inputChecker.nextButtonCheck('be.disabled')
    },
  
    negDoNotShipBag: () => {
      //C35817
    inputHelpers.clicker('[data-testid="fail-button-0"]')
    inputChecker.nextButtonCheck('be.disabled')
    },
  
    saveAndClosePos: () => {
      // C35818
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
      //C35862
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
      //C35861
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

      //C35864
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyMultiplePos('ln-2-shipper-1', coi,"be.visible")
      })
      inputHelpers.clicker('[data-testid="pass-button-case_intact_1"]')
      inputChecker.nextButtonCheck('be.disabled')
    },
  
    negToggleCaseIntact: () => {
      //C35863
      inputHelpers.clicker('[data-testid="fail-button-case_intact_1"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/case_intact_1_reason-input"]')
      inputChecker.nextButtonCheck('be.disabled')
    },
  
    posToggleCaseIntact: () => {

      //C35865
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/case_intact_1_reason-input"]',inputs.additionalComments,"not.be.disabled")
    },
  
    negToggleTempRangeEmpty: () => {

      //C35867
      inputHelpers.clicker('[data-testid="pass-button-case_intact_1"]')
      inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"]')
      inputChecker.nextButtonCheck('be.disabled')
    },
  
    negToggleTempRange: () => {

     //C35869
      inputHelpers.clicker('[data-testid="fail-button-temp_out_of_range_1"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/temp_out_of_range_1_reason-input"]')
      inputChecker.nextButtonCheck('be.disabled')
    },
  
    posToggleTempRange: () => {

     //	C35868
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/temp_out_of_range_1_reason-input"]',inputs.additionalComments,"not.be.disabled")
    },
  
    negIsredTamperSealEmpty: () => {
      //	C35868
      inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"]')
      inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]')
      inputChecker.nextButtonCheck('be.disabled')
    },
  
    negIsredTamperSeal: () => {
      // C35869
      inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_seal_labeled_rack"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_seal_labeled_rack_reason-input"]')
      inputChecker.nextButtonCheck('be.disabled')
    },
  
    posIsredTamperSeal: () => {
      // C35870
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_seal_labeled_rack_reason-input"]',inputs.additionalComments,"not.be.disabled")
    },
  
    negToggleProductsStatusEmpty: () => {
      //C35871
      inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]')
      inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"]')
      inputChecker.nextButtonCheck('be.disabled')
    },
  
    negToggleProductsStatus: () => {
      // C35872
      inputHelpers.clicker('[data-testid="fail-button-ambient_temperature_exposure"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/ambient_temperature_exposure_reason-input"]')
      inputChecker.nextButtonCheck('be.disabled')
    },
    posToggleProductsStatus: () => {
      // C35873
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/ambient_temperature_exposure_reason-input"]',inputs.additionalComments,"not.be.disabled")
    },
    posSaveAndClose: () => {
      //	C35874
      inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"]')
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      })
    },
  
    retainsValueUponClickingNext: () => {
      // C35875
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
      sat_steps.satLabTransferProductToShipper(coi,'-cccp-is');
      })
    },
  
    //	C35823
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
  
    //C35824
    negInvalidEvo: (scope) => {
      cy.get(`@coi`).then(coi => { 
      getSatAirWayBill(scope.patientInformation.subjectNumber, coi)
      })
      inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', inputs.tamperSealNumber)
      inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]')
      inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]')
      inputHelpers.clicker('[data-testid="pass-button-red_wire"]')
      inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
      inputHelpers.clicker('[data-testid=pass-button-consignee_kit_pouch_inside]')
      inputHelpers.clicker('[data-testid=pass-button-zip_ties_secured]')
      
  
      inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/evo_is_id-input"]', regressionInput.satelliteLab.evoLast4DigitsTwoDigit);
      inputChecker.nextButtonCheck("be.disabled");
  
      inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/evo_is_id-input"]', 'a');
      inputChecker.nextButtonCheck("be.disabled");
  
      inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/evo_is_id-input"]', regressionInput.satelliteLab.evoLast4DigitsFiveDigit);
      inputChecker.nextButtonCheck("be.disabled");
  
    },
    //C35825
    negTamperSealEmpty: () => {
      inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/evo_is_id-input"]', inputs.evoLast4Digits)
      inputChecker.clearValueAndCheckForButton('input[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]','be.disabled')
    },


    //	C35828
    negEvoNumberListedOnAirWaybillNoSelection: () => {
      inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', inputs.tamperSealNumber)
      inputChecker.clickOnCheck('[data-testid="pass-button-evo_airway_bill"]','be.disabled')
    },
  

    //C35826
    negEvoNumberListedOnAirWaybillNo: () => {
      inputHelpers.clicker('[data-testid="fail-button-evo_airway_bill"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/evo_airway_bill_reason-input"]')
    },

    //C35827
    posEvoNumberListedOnAirWaybillNoWithDetail: () => {
      inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-evo_airway_bill"]')
    },
  

    //C35828
    negRedWireTamperSealNoSelection: () => {
      inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]')
      inputChecker.clickOnCheck('[data-testid="pass-button-red_wire"]','be.disabled')
    },


    //C35829
    negRedWireTamperSealNo: () => {
      inputChecker.clickOnCheck('[data-testid="fail-button-red_wire"]','be.disabled')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/red_wire_reason-input"]')

    },

  //C35830
    posRedWireTamperSealNoWithDetail: () => {
      inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-red_wire"]')
  
    },
  
  //C35832
    negTamperSealNumberListedOnAirWaybillNo: () => {
      inputHelpers.clicker('[data-testid="pass-button-red_wire"]')
      inputChecker.clickOnCheck('[data-testid="pass-button-tamper_seal_match"]','be.disabled')
    
    },

   //C35834
    negnegTamperSealNumberListedOnAirWaybillNoSelection: () => {
      inputChecker.clickOnCheck('[data-testid="fail-button-tamper_seal_match"]','be.disabled')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_match_reason-input"]')
    },
    //C35834
    posTamperSealNumberListedOnAirWaybillNoWithDetail: () => {
      inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-tamper_seal_match"]')
    },
  

  //C35838

    negShipperLabelIncludedWithShipperNo: () => {
      inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
      inputChecker.clickOnCheck('[data-testid="pass-button-shipper_label_placed"]','be.disabled')  
      
    },


    negShipperLabelIncludedWithShipperNoSelection: () => {
      inputChecker.clickOnCheck('[data-testid="fail-button-shipper_label_placed"]','be.disabled') 
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/shipper_label_placed_reason-input"]')

    },

    //	C35836

    posShipperLabelIncludedWithShipperNoWithDetail: () => {
      inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-shipper_label_placed"]')
    },
  
    

  //C35841

    negConsigneeKitPouchIncludedNo: () => {
      inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]')
      inputChecker.clickOnCheck('[data-testid=pass-button-consignee_kit_pouch_inside]','be.disabled')
  
      
    },


  //C35840

    negConsigneeKitPouchIncludedNoSelection: () => {
      inputChecker.clickOnCheck('[data-testid=fail-button-consignee_kit_pouch_inside]','be.disabled')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/consignee_kit_pouch_inside_reason-input"]')

      
    },
  

    //C35839

    posConsigneeKitPouchIncludedNoWithDetails: () => {
      inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-consignee_kit_pouch_inside"]')
    },
  
  //C35841	
    negShippingContainerSecuredNo: () => {
      inputHelpers.clicker('[data-testid=pass-button-consignee_kit_pouch_inside]')
      inputChecker.clickOnCheck('[data-testid=pass-button-zip_ties_secured]','be.disabled')
      
    },


  //	C35843

    negShippingContainerSecuredNoSelection: () => {
      inputChecker.clickOnCheck('[data-testid=fail-button-zip_ties_secured]','be.disabled')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/zip_ties_secured_reason-input"]')
      
    },


  //C35842

    posShippingContainerSecuredNoWithDetail: () => {
      inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-zip_ties_secured"]')
    },
  
    
  //	C35844
    posDataOnSaveAndClose: () => {
      inputHelpers.clicker('[data-testid=pass-button-zip_ties_secured]')
      cy.get(`@coi`).then(coi => { 
      inputChecker.checkDataSavingWithSaveAndClose(coi, 'be.enabled', 'Reservations')
      })
    },
  
    //	C35845
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
      sat_steps.satLabTransferProductToShipper(coi,'-cccp-is');
      sat_steps.satLabShippingChecklist(0, input.evoLast4Digits, input.tamperSealNumber, scope);
      })
    },
  
    //C35853
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
  
    //C35854
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
  
    //C35855
    negNextButtonOnConfirmerSign: () => {
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.nextButtonCheck("be.disabled");
  
    },

  //C35856
    posDoneButtonOnVerifierSign: () => {
      const verifier = 'quela@vineti.com'
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], verifier)
      inputChecker.nextButtonCheck("be.enabled");
  
    },
  //C35857
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
      sat_steps.satLabVerifyShipment('satellite-lab', '-cccp-is', coi);
  
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
      sat_steps.satLabTransferProductToShipper(coi);
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.shipmentChecklist, 'Reservations',2)
      sat_steps.satLabShippingChecklist(0, inputs.evoLast4Digits, inputs.tamperSealNumber, scope);
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.cryoShippingSummary, 'Reservations',2)
      sat_steps.satShippingSummaryVerify(scope, therapy)
  
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.completed,'Reservations',2)
      
    })
  }
}
  

  