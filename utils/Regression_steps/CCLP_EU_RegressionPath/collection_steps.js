import common from '../../../support/index'
import assertions from '../../../fixtures/assertions.json'
import inputs from '../../../fixtures/inputs.json'
import collectionAssertion from '../../../fixtures/collectionAssertions.json'
import translationHelpers from '../../shared_block_helpers/translationHelpers.js'
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers'
import inputChecker from '../../shared_block_helpers/inputFieldCheckHelpers'
import dayjs from 'dayjs';
import tableHelpers from "../../shared_block_helpers/tableHelpers"
import collectionStepsRegression from '../../Regression_steps/CCLP_EU_RegressionPath/collection_steps';
import col_steps from '../../../utils/HappyPath_steps/CCLP_EU_HappyPath/collection_steps';
import regressionInput from '../../../fixtures/inputsRegression.json'
import collection_steps from '../../../utils/HappyPath_steps/CCLP_EU_HappyPath/collection_steps'
// import therapies from "../fixtures/therapy.json";

const todaysDate = dayjs().format('DD-MMM-YYYY')

export const getCollAirWayBill = (uniqueId,selectorIncludesInputField=true) => {
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

      cy.openOrder('collection', 'phil')
      cy.commonPagination(uniqueId, 'Patients')
      if(selectorIncludesInputField==true){
        inputHelpers.scanAndVerifyCoi('collection-airway-bill', airWayBill)
        } else{
          inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/collection_airway_bill-input"]', airWayBill)
        }
      cy.wait(1000)
      cy.log('collectionAirwayBill', airWayBill)
    })
}

export default {
  patientVerification:  {
    previousHappyPathSteps: (scope) => {
      cy.openOrder('collection','arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
    },
    nextButtonPos: () => {
        //C22538
        inputChecker.nextButtonCheck('be.disabled')
        signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
        signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], inputs.verifier[0])
        inputChecker.nextButtonCheck('not.be.disabled')
        actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
            apiAliases: ['@patchProcedureSteps', '@getProcedures'] })
      },
  },
     
  collectionBagIdentification: {
    previousHappyPathSteps: (scope) => {
        cy.openOrder('collection','arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      col_steps.patientVerification();
    },
  
    apheresisDateEmpty: () => {
      //C40404
      inputHelpers.clicker('[id="#/properties/custom_fields/properties/pre_collection_label_applied"]')
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/din_entry-input"]', inputs.din)
      inputChecker.nextButtonCheck('be.disabled')
  },
  
    apheresisDateFutureNeg: () => {
      //C40402
      inputChecker.inputDateFieldCheck("[id*='#/properties/apheresis_date-input']",regressionInput.collection.apheresisDateFuture,'be.disabled')
  },
  
    apheresisDatePos: () => {
      //C40403
      inputChecker.inputDateFieldCheck("[id*='#/properties/apheresis_date-input']",todaysDate,'not.be.disabled')
    },
  
    apheresisIdNeg: () => {
      //C40400
      inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/custom_fields/properties/din_entry-input"]','be.disabled')
    },
  
    isSiteLabelsAppliedNeg: () => {
      //C40401
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/din_entry-input"]', inputs.din)
      inputHelpers.clicker('[id="#/properties/custom_fields/properties/pre_collection_label_applied"]')
      inputChecker.nextButtonCheck('be.disabled')
    
    },
    
    checkForInfoSaved :() => {
      //C40405
      inputHelpers.clicker('[id="#/properties/custom_fields/properties/pre_collection_label_applied"]')
      inputChecker.checkForTheInfoSavedClickingNextAndBack();
      inputChecker.nextButtonCheck('not.be.disabled');
    },
  },

  collectionBagLabelPrinting: {
    previousHappyPathSteps: (scope) => {
      cy.openOrder('collection','arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
        col_steps.patientVerification()
        col_steps.collectionBagIdentification()
    },

    printLablesClickable: () => {
        // C22544
        inputChecker.nextButtonCheck('be.disabled')
        inputChecker.popupMessageVisible('btn-print','banner-container-0')
    },

    confirmPrintLabelNeg: () => {
        // C22545
        inputHelpers.clicker('[id="#/properties/data/properties/is_verified"]')
        inputChecker.nextButtonCheck('be.disabled')
    },

    verifyApplyLabelNeg: () => {
        // C22546
        cy.reload();
        inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]')
        inputChecker.nextButtonCheck('be.disabled')
    },

    checkForInfoSaved: (scope) => {
      //  C22547
        cy.reload();
        inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]')
        inputHelpers.clicker('[id="#/properties/data/properties/is_verified"]')
        actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
            apiAliases: ['@patchProcedureSteps', '@getProcedures'] })
        signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
        inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients")
        inputChecker.nextButtonCheck('not.be.disabled')
    }
  },

    collectionProcedureInformation: {
      previousHappyPathSteps: (scope,therapy) => {
        cy.openOrder('collection','arlene')
        cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
        col_steps.patientVerification();
        col_steps.collectionBagIdentification();
        col_steps.collectionBagLabel(therapy);
      },


      verifyInvalidPatientWait: () => {
        //C40370
        inputChecker.nextButtonCheck('be.disabled')
        inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/patient_weight-input"]',regressionInput.collection.zeroValue,'be.disabled');
        inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/patient_weight-input"]',regressionInput.collection.invalidweight,'be.disabled');
        inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/patient_weight-input"]',regressionInput.collection.decimalWeight,'be.disabled');
        inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/patient_weight-input"]',regressionInput.collection.moreDigitValue,'be.disabled');
        inputHelpers.inputSingleField('[id="#/properties/patient_weight-input"]', regressionInput.collection.negativeValue)
        inputChecker.checkValue('[id="#/properties/patient_weight-input"]',regressionInput.collection.positiveValue)
        inputChecker.nextButtonCheck('not.be.disabled')

      }
    },

    bagDataEntryDay:  {
      previousHappyPathSteps: (scope,therapy) => {
        cy.openOrder('collection','arlene')
        cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
        col_steps.patientVerification();
        col_steps.collectionBagIdentification();
        col_steps.collectionBagLabel(therapy);
        col_steps.collectionProcedureInformation();
      },

    bagCoiAsEmpty: () => {
      //C40371
      inputHelpers.inputSingleField('[id="#/properties/collected_product_volume-input"]', inputs.collectedProductVolume)
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', inputs.wholeBloodProcessed)
      inputHelpers.inputSingleField('[data-testid="#/properties/anticoagulant_type-input"]', inputs.anticoagulantType)
      inputHelpers.inputSingleField('[id="#/properties/anticoagulant_volume-input"]', inputs.anticoagulantVolume)
      inputHelpers.inputSingleField('[id="collection_start_time"]', inputs.collectionStartTime)
      inputHelpers.inputSingleField('[id="collection_end_time"]', inputs.collectionEndTime)
      inputChecker.nextButtonCheck('be.disabled')
    },

    invalidProductVolume: () => {
      //C40372
      cy.get(`@coi`).then(coi => {
        inputHelpers.scanAndVerifyCoi('bag-1-identifier', `${coi}-APH-01`)
      })
      inputChecker.clearValueAndCheckForButton('[id="#/properties/collected_product_volume-input"]','be.disabled')
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/collected_product_volume-input"]',regressionInput.collection.zeroValue,'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/collected_product_volume-input"]',regressionInput.collection.decimalVol,'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/collected_product_volume-input"]',regressionInput.collection.moreDigitValue,'be.disabled');
      inputHelpers.inputSingleField('[id="#/properties/collected_product_volume-input"]', regressionInput.collection.negativeValue)
      inputChecker.checkValue('[id="#/properties/collected_product_volume-input"]',regressionInput.collection.positiveValue)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    invalidBloodProcessed: () => {
      //C40373
      inputChecker.clearValueAndCheckForButton('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]','be.disabled')
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]',regressionInput.collection.zeroValue,'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]',regressionInput.collection.moreDigitValue,'be.disabled');
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', regressionInput.collection.negativeValue)
      inputChecker.checkValue('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]',regressionInput.collection.positiveValue)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    anticoagulantTypeAsEmpty: () => {
      //C40374
    inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/anticoagulant_type-input"]','be.disabled')
    },

    invalidAnticoagulantVolume: () => {
      //C40375
      inputHelpers.inputSingleField('[data-testid="#/properties/anticoagulant_type-input"]', inputs.anticoagulantType)
      inputChecker.clearValueAndCheckForButton('[id="#/properties/anticoagulant_volume-input"]','be.disabled')
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/anticoagulant_volume-input"]',regressionInput.collection.zeroValue,'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/anticoagulant_volume-input"]',regressionInput.collection.moreDigitValue,'be.disabled');
      inputHelpers.inputSingleField('[id="#/properties/anticoagulant_volume-input"]', regressionInput.collection.negativeValue)
      inputChecker.checkValue('[id="#/properties/anticoagulant_volume-input"]',regressionInput.collection.positiveValue)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    invalidStartTime: () => {
      //C40376
    inputChecker.clearValueAndCheckForButton('[id="collection_start_time"]','be.disabled')
    inputChecker.checkNextButtonWithVariousInputs('[id="collection_start_time"]',regressionInput.collection.invalidTime,'be.disabled');
    inputChecker.checkNextButtonWithVariousInputs('[id="collection_start_time"]',regressionInput.collection.incorrectStartTime,'be.disabled');
    },

    invalidEndTime: () => {
      //C40378
    inputHelpers.inputSingleField('[id="collection_start_time"]', inputs.collectionStartTime)
    inputChecker.clearValueAndCheckForButton('[id="collection_end_time"]','be.disabled')
    inputChecker.checkNextButtonWithVariousInputs('[id="collection_end_time"]',regressionInput.collection.invalidTime,'be.disabled');
    inputChecker.checkNextButtonWithVariousInputs('[id="collection_end_time"]',regressionInput.collection.incorrectEndTime,'be.disabled');
    },

    checkForInfoSaved: (scope) => {
      //C40377
    inputHelpers.inputSingleField('[id="collection_end_time"]', inputs.collectionEndTime)
    inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients")
    inputChecker.checkValue('[id="collection_start_time"]', inputs.collectionStartTime)
    inputChecker.checkValue('[id="collection_end_time"]', inputs.collectionEndTime)
    inputChecker.checkValue('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]',regressionInput.collection.positiveValue)
    inputChecker.checkValue('[data-testid="#/properties/anticoagulant_type-input"]', inputs.anticoagulantType)
    }
  },
    
    collectionSummary:  {
      previousHappyPathSteps: (scope,therapy) => {
        cy.openOrder('collection','arlene')
        cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
        col_steps.patientVerification();
        col_steps.collectionBagIdentification();
        col_steps.collectionBagLabel(therapy);
        col_steps.collectionProcedureInformation();
        cy.get(`@coi`).then(coi => {
        col_steps.bagDataEntryDay(coi);
        })
      },

      posEditButton: () => { 
        //C40398
        inputHelpers.clicker('[data-testid="edit-procedure_details"]')
        inputHelpers.inputSingleField('[data-testid="#/properties/patient_weight-input"]', regressionInput.collection.changedWeight)
        inputChecker.reasonForChange()
        inputChecker.checkValue('[data-testid="#/properties/patient_weight-input"]',regressionInput.collection.changedWeight)

        inputHelpers.clicker('[data-testid="edit-bag_1_details"]')
        inputHelpers.inputSingleField('[id="#/properties/anticoagulant_volume-input"]', regressionInput.collection.changedVolume)
        inputChecker.reasonForChange()
        inputChecker.checkValue('[id="#/properties/anticoagulant_volume-input"]',regressionInput.collection.changedVolume)
    },

    checkNextButtonWithAndWithoutSig: () => {
      //C40399
      inputChecker.nextButtonCheck('be.disabled')
      inputChecker.checkNextButtonWithAndWithoutSignature('0')
    }
  },

  confirmChangeOfCustodyArlene:  {
    previousHappyPathSteps: (scope,therapy) => {
        cy.openOrder('collection','arlene')
        cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')

        col_steps.patientVerification();
        col_steps.collectionBagIdentification();
        col_steps.collectionBagLabel(therapy);
        col_steps.collectionProcedureInformation();
        cy.get(`@coi`).then(coi => {
        col_steps.bagDataEntryDay(coi);
        col_steps.collectionSummary(scope, therapy);
      })
    },

    negVerifyInvalidBagId: () => {
      // C40389
      inputChecker.nextButtonCheck('be.disabled')
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyCheck('bag-1-identifier', coi,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-FP-01`,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-PRC-01`,'not.be.visible','be.disabled')
      })
    },

    posCheckNextButtonWithAndWithoutSig: () => {
      // C40390
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-APH-01`,'be.visible','not.be.disabled')
      });
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
      inputChecker.nextButtonCheck('be.disabled')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.nextButtonCheck('be.enabled');
    },

    posDataOnNext: (scope) => {
      // C40391
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      });
      common.loadCollection();
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients', 'be.enabled')
      inputChecker.checkDataSavingWithBackButton('be.enabled');
    },
  },
  
  confirmChangeOfCustodyPhil:  {
    previousHappyPathSteps: (scope,therapy) => {
        cy.openOrder('collection','arlene')
        cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')

        col_steps.patientVerification();
        col_steps.collectionBagIdentification();
        col_steps.collectionBagLabel(therapy);
        col_steps.collectionProcedureInformation();
        cy.get(`@coi`).then(coi => {
        col_steps.bagDataEntryDay(coi);
        col_steps.collectionSummary(scope, therapy);
        col_steps.changeOfCustody(coi);

        cy.openOrder('collection','phil')
        cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
    })
    },

    negVerifyInvalidBagId: () => {
      // C40395
      inputChecker.nextButtonCheck('be.disabled')
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyCheck('bag-1-identifier', coi,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-FP-01`,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-PRC-01`,'not.be.visible','be.disabled')
      })
    },

    posCheckNextButtonWithAndWithoutSig: () => {
      //C40396
      cy.get(`@coi`).then(coi => { 
      inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-APH-01`,'be.visible','not.be.disabled')
      });
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
      inputChecker.nextButtonCheck('be.disabled')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.nextButtonCheck('be.enabled');
    },

    posDataOnNext: () => {
      // C40397
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      });
      inputChecker.checkDataSavingWithBackButton('be.enabled');
    },
  },

  collectionTransferProductToShipper: {
    previousHappyPathSteps: (scope) => {
      cy.openOrder('collection','arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      col_steps.patientVerification();
      col_steps.collectionBagIdentification();
      col_steps.collectionBagLabel();
      col_steps.collectionProcedureInformation();
      cy.get(`@coi`).then(coi => {
        col_steps.bagDataEntryDay(coi);
        col_steps.collectionSummary(scope);
        col_steps.changeOfCustody(coi);
      })
      cy.openOrder('collection','phil')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      cy.get(`@coi`).then(coi => {
        col_steps.confirmChangeOfCustody(coi);
      })
    },
    
    negCoi: () => {
      // C40392
      inputChecker.nextButtonCheck('be.disabled')
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab', `${coi}-PRC-01`,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab', `${coi}-FP-01`,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab', `${coi}-APH-01`,'not.be.visible','be.disabled')
      })
    },
    
    saveAndClosePos: (scope) => {
      // C40393
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab', `${coi}`,'be.visible','not.be.disabled')
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients")
      inputChecker.nextButtonCheck('not.be.disabled')
      })
    },
    
    posDataOnNext: () => {
      // C40394
      inputChecker.checkDataSavingWithBackButton('be.enabled');
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      }
    },
      
    shipmentChecklist: {
      previousHappyPathSteps: (scope) => {
        cy.openOrder('collection','arlene')
        cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
        col_steps.patientVerification();
        col_steps.collectionBagIdentification();
        col_steps.collectionBagLabel();
        col_steps.collectionProcedureInformation();
        cy.get(`@coi`).then(coi => {
          col_steps.bagDataEntryDay(coi);
          col_steps.collectionSummary(scope);
          col_steps.changeOfCustody(coi);
        })
        cy.openOrder('collection','phil')
        cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
        cy.get(`@coi`).then(coi => {
          col_steps.confirmChangeOfCustody(coi);
          col_steps.collectionTransferProductToShipper(scope.coi, "ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab");
          })
      },
    
      airWaybillEmpty: () =>{
        // C40381
          inputHelpers.clicker('[data-testid=pass-button-idm_placed_into_shipper]')
          inputHelpers.clicker('[data-testid="pass-button-apheresis_not_exposed"]')
          inputHelpers.clicker('[data-testid="pass-button-temperature_monitor_active"]')
          inputChecker.nextButtonCheck('be.disabled')
      },
    
      negApheresisNotExposedToTemp:(scope)=>{
        // C40382
        getCollAirWayBill(scope.patientInformation.subjectNumber,false)
        inputHelpers.clicker('[data-testid="pass-button-idm_placed_into_shipper"]')
        inputChecker.clickOnCheck('[data-testid="pass-button-temperature_monitor_active"]','be.disabled')
        inputHelpers.clicker('[data-testid="fail-button-apheresis_not_exposed"]')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/apheresis_not_exposed_reason-input"]','be.visible')
      },
    
      posApheresisNotExposedToTempNoWithDescription:()=>{
        // C40386
        inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-apheresis_not_exposed"]')
      },
    
      negHasInfectiousDiseaseMarker:() => {
        // C40383
        inputHelpers.clicker('[data-testid="pass-button-apheresis_not_exposed"]')
        inputChecker.clickOnCheck('[data-testid="pass-button-idm_placed_into_shipper"]','be.disabled')
        inputHelpers.clicker('[data-testid="fail-button-idm_placed_into_shipper"]')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/idm_placed_into_shipper_reason-input"]','be.visible')
    
      },
        
      posHasInfectiousDiseaseMarkerNoWithDescription:() => {
        // C40387
        inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-idm_placed_into_shipper"]')
      },
    
      negHasTemperatureMonitorActivated:()=>{
        // C40384
        inputHelpers.clicker('[data-testid="pass-button-idm_placed_into_shipper"]')
        inputChecker.clickOnCheck('[data-testid="pass-button-temperature_monitor_active"]','be.disabled')
        inputHelpers.clicker('[data-testid="fail-button-temperature_monitor_active"]')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/temperature_monitor_active_reason-input"]','be.visible')
      },
    
      posHasTemperatureMonitorActivatedNoWithReason:()=>{
        // C40388
        inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-temperature_monitor_active"]')
      },
    
      checkForDataSaved:(scope)=>{
        // C40385
      inputHelpers.clicker('[data-testid="pass-button-temperature_monitor_active"]')
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients")
      inputChecker.checkValue('[data-testid=pass-button-idm_placed_into_shipper]', 'true')
      inputChecker.checkValue('[data-testid="pass-button-apheresis_not_exposed"]', 'true')
      inputChecker.checkValue('[data-testid="pass-button-temperature_monitor_active"]', 'true')
      }
    },
      
  cryopreservationShippingSummary: {
      
    previousHappyPathSteps: (scope,therapy) => {
      cy.openOrder('collection','arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      col_steps.patientVerification();
      col_steps.collectionBagIdentification();
      col_steps.collectionBagLabel();
      col_steps.collectionProcedureInformation();
      cy.get(`@coi`).then(coi => {
      col_steps.bagDataEntryDay(coi);
      col_steps.collectionSummary(scope);
      col_steps.changeOfCustody(coi);
    })
      cy.openOrder('collection','phil')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      cy.get(`@coi`).then(coi => {
        col_steps.confirmChangeOfCustody(coi);
        col_steps.collectionTransferProductToShipper(coi, "ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab");
        col_steps.collectionShipmentChecklist(scope, "#/properties/shipping_checklist/properties/collection_airway_bill-input", therapy);
        })
    },
      
    posEditButton: ()=>{
      // C40379
      inputHelpers.clicker('[data-testid="edit-shipment_checklist"]')
      inputHelpers.clicker('[data-testid="fail-button-apheresis_not_exposed"]')
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/apheresis_not_exposed_reason-input"]',regressionInput.collection.additionalComments)
      inputChecker.reasonForChange()
      inputChecker.checkLabelAfterNext(
        '[data-test-id="collection_shipping_summary"]',
        '[data-testid="txt-field-layout-Confirm MNC, Apheresis was not exposed to ambient temperature greater than 60 minutes.-answer"] >>>>>>:nth(1)',
        'No'
      )
    },
    
    checkNextButtonWithAndWithoutSignature: () => {
      // C40380
      inputChecker.checkNextButtonWithAndWithoutSignature('1')
      }
    },
    checkStatusesOfCollectionModule: (scope,therapy) => {

      cy.openOrder('collection','arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      cy.get(`@coi`).then((coi) => {
    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.patientVerification,'Patients',4)
    col_steps.patientVerification();
  

    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.collectionBagIdentification,'Patients',4)
    col_steps.collectionBagIdentification(therapy);;

    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.collectionBagLabelPrinting,'Patients',4)
    col_steps.collectionBagLabel(therapy);

    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.collectionProcedureInformation,'Patients',4)
    col_steps.collectionProcedureInformation();

    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.bagDataEntry,'Patients',4)
    col_steps.bagDataEntryDay(coi);

    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.collectionSummary,'Patients',4)
    col_steps.collectionSummary(scope, therapy);

    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.changeOfCustody,'Patients',4)
    col_steps.changeOfCustody(coi);

    cy.openOrder('collection','phil')
    cy.commonPagination(scope.patientInformation.subjectNumber,'Patients',4)

    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.confirmChangeOfCustody,'Patients',4)
    col_steps.confirmChangeOfCustody(coi);

    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.transferBagToShipper,'Patients',4)
    col_steps.collectionTransferProductToShipper(scope.coi, "ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab");

    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.shipmentChecklist,'Patients',4)
    col_steps.collectionShipmentChecklist(scope, "#/properties/shipping_checklist/properties/collection_airway_bill-input", therapy);

    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.shipmentSummary,'Patients',4)
    col_steps.collectionShippingSummary(scope, therapy);

    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.completed,'Patients',4)

      })
    }
  }
