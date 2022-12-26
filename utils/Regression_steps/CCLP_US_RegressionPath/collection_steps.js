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
import collectionStepsRegression from '../../Regression_steps/CCLP_US_RegressionPath/collection_steps';
import col_steps from '../../../utils/HappyPath_steps/CCLP_US_HappyPath/collection_steps';
import regressionInput from '../../../fixtures/inputsRegression.json'
import collection_steps from '../../../utils/HappyPath_steps/CCLP_US_HappyPath/collection_steps'
// import therapies from "../fixtures/therapy.json";

const todaysDate = dayjs().format('DD-MMM-YYYY')

// export const getCollAirWayBill = (scope, testId) => {
//   cy.openOrder('ordering', 'oliver')
//   cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')

export const getCollAirWayBill = (uniqueId) => {
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

      inputHelpers.scanAndVerifyCoi('collection-airway-bill', airWayBill)
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
        //C25356
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
      //C38435
      inputHelpers.clicker('[id="#/properties/custom_fields/properties/pre_collection_label_applied"]')
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/din_entry-input"]', inputs.din)
      inputChecker.nextButtonCheck('be.disabled')
  },
  
    apheresisDateFutureNeg: () => {
      //C38436
      inputChecker.inputDateFieldCheck("[id*='#/properties/apheresis_date-input']",regressionInput.collection.apheresisDateFuture,'be.disabled')
  },
  
    apheresisDatePos: () => {
      //C38437
      inputChecker.inputDateFieldCheck("[id*='#/properties/apheresis_date-input']",todaysDate,'not.be.disabled')
    },
  
    apheresisIdNeg: () => {
      //C38438
      inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/custom_fields/properties/din_entry-input"]','be.disabled')
    },
  
    isSiteLabelsAppliedNeg: () => {
      //C38439
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/din_entry-input"]', inputs.din)
      inputHelpers.clicker('[id="#/properties/custom_fields/properties/pre_collection_label_applied"]')
      inputChecker.nextButtonCheck('be.disabled')
    
    },
    
    checkForInfoSaved :() => {
      //C38440
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
        // C38443
        inputChecker.nextButtonCheck('be.disabled')
        inputChecker.popupMessageVisible('btn-print','banner-container-0')
    },

    confirmPrintLabelNeg: () => {
        // C38444
        inputHelpers.clicker('[id="#/properties/data/properties/is_verified"]')
        inputChecker.nextButtonCheck('be.disabled')
    },

    verifyApplyLabelNeg: () => {
        // C38441
        cy.reload();
        inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]')
        inputChecker.nextButtonCheck('be.disabled')
    },

    checkForInfoSaved: (scope) => {
      //  C38442
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
        //C25357
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
      //C25359
      inputHelpers.inputSingleField('[id="#/properties/collected_product_volume-input"]', inputs.collectedProductVolume)
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', inputs.wholeBloodProcessed)
      inputHelpers.inputSingleField('[data-testid="#/properties/anticoagulant_type-input"]', inputs.anticoagulantType)
      inputHelpers.inputSingleField('[id="#/properties/anticoagulant_volume-input"]', inputs.anticoagulantVolume)
      inputHelpers.inputSingleField('[id="collection_start_time"]', inputs.collectionStartTime)
      inputHelpers.inputSingleField('[id="collection_end_time"]', inputs.collectionEndTime)
      inputChecker.nextButtonCheck('be.disabled')
    },

    invalidProductVolume: () => {
      //C25360
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
      //C25361
      inputChecker.clearValueAndCheckForButton('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]','be.disabled')
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]',regressionInput.collection.zeroValue,'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]',regressionInput.collection.moreDigitValue,'be.disabled');
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', regressionInput.collection.negativeValue)
      inputChecker.checkValue('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]',regressionInput.collection.positiveValue)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    anticoagulantTypeAsEmpty: () => {
      //C25362
    inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/anticoagulant_type-input"]','be.disabled')
    },

    invalidAnticoagulantVolume: () => {
      //C25363
      inputHelpers.inputSingleField('[data-testid="#/properties/anticoagulant_type-input"]', inputs.anticoagulantType)
      inputChecker.clearValueAndCheckForButton('[id="#/properties/anticoagulant_volume-input"]','be.disabled')
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/anticoagulant_volume-input"]',regressionInput.collection.zeroValue,'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/anticoagulant_volume-input"]',regressionInput.collection.moreDigitValue,'be.disabled');
      inputHelpers.inputSingleField('[id="#/properties/anticoagulant_volume-input"]', regressionInput.collection.negativeValue)
      inputChecker.checkValue('[id="#/properties/anticoagulant_volume-input"]',regressionInput.collection.positiveValue)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    invalidStartTime: () => {
      //C25364
    inputChecker.clearValueAndCheckForButton('[id="collection_start_time"]','be.disabled')
    inputChecker.checkNextButtonWithVariousInputs('[id="collection_start_time"]',regressionInput.collection.invalidTime,'be.disabled');
    inputChecker.checkNextButtonWithVariousInputs('[id="collection_start_time"]',regressionInput.collection.incorrectStartTime,'be.disabled');
    },

    invalidEndTime: () => {
      //C38445
    inputHelpers.inputSingleField('[id="collection_start_time"]', inputs.collectionStartTime)
    inputChecker.clearValueAndCheckForButton('[id="collection_end_time"]','be.disabled')
    inputChecker.checkNextButtonWithVariousInputs('[id="collection_end_time"]',regressionInput.collection.invalidTime,'be.disabled');
    inputChecker.checkNextButtonWithVariousInputs('[id="collection_end_time"]',regressionInput.collection.incorrectEndTime,'be.disabled');
    },

    checkForInfoSaved: (scope) => {
      //C25365
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
        //C25366
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
      //C25367
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
      // C25369
      inputChecker.nextButtonCheck('be.disabled')
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyCheck('bag-1-identifier', coi,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-FP-01`,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-PRC-01`,'not.be.visible','be.disabled')
      })
    },

    posCheckNextButtonWithAndWithoutSig: () => {
      // C25370
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
      // C38446
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
      // C25371
      inputChecker.nextButtonCheck('be.disabled')
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyCheck('bag-1-identifier', coi,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-FP-01`,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-PRC-01`,'not.be.visible','be.disabled')
      })
    },

    posCheckNextButtonWithAndWithoutSig: () => {
      // C25372
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
      // C38447
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
      // C38448
      inputChecker.nextButtonCheck('be.disabled')
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cclp', `${coi}-PRC-01`,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cclp', `${coi}-FP-01`,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cclp', `${coi}-APH-01`,'not.be.visible','be.disabled')
      })
    },
    
    saveAndClosePos: (scope) => {
      // C38449
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cclp', `${coi}`,'be.visible','not.be.disabled')
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients")
      inputChecker.nextButtonCheck('not.be.disabled')
      })
    },
    
    posDataOnNext: () => {
      // C38450
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
          col_steps.collectionTransferProductToShipper(scope.coi, "ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cclp");
          })
      },
    
      airWaybillEmpty: () =>{
        // C38451
          inputHelpers.clicker('[data-testid=pass-button-idm_placed_into_shipper]')
          inputHelpers.clicker('[data-testid="pass-button-apheresis_not_exposed"]')
          inputHelpers.clicker('[data-testid="pass-button-temperature_monitor_active"]')
          inputChecker.nextButtonCheck('be.disabled')
      },
    
      negApheresisNotExposedToTemp:(scope)=>{
        // C38452
        getCollAirWayBill(scope.patientInformation.subjectNumber,false)
        inputHelpers.clicker('[data-testid="pass-button-idm_placed_into_shipper"]')
        inputChecker.clickOnCheck('[data-testid="pass-button-temperature_monitor_active"]','be.disabled')
        inputHelpers.clicker('[data-testid="fail-button-apheresis_not_exposed"]')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/apheresis_not_exposed_reason-input"]','be.visible')
      },
    
      posApheresisNotExposedToTempNoWithDescription:()=>{
        // C38456
        inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-apheresis_not_exposed"]')
      },
    
      negHasInfectiousDiseaseMarker:() => {
        // C38453
        inputHelpers.clicker('[data-testid="pass-button-apheresis_not_exposed"]')
        inputChecker.clickOnCheck('[data-testid="pass-button-idm_placed_into_shipper"]','be.disabled')
        inputHelpers.clicker('[data-testid="fail-button-idm_placed_into_shipper"]')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/idm_placed_into_shipper_reason-input"]','be.visible')
    
      },
        
      posHasInfectiousDiseaseMarkerNoWithDescription:() => {
        // C38457
        inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-idm_placed_into_shipper"]')
      },
    
      negHasTemperatureMonitorActivated:()=>{
        // C38454
        inputHelpers.clicker('[data-testid="pass-button-idm_placed_into_shipper"]')
        inputChecker.clickOnCheck('[data-testid="pass-button-temperature_monitor_active"]','be.disabled')
        inputHelpers.clicker('[data-testid="fail-button-temperature_monitor_active"]')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/temperature_monitor_active_reason-input"]','be.visible')
      },
    
      posHasTemperatureMonitorActivatedNoWithReason:()=>{
        // C38458
        inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-temperature_monitor_active"]')
      },
    
      checkForDataSaved:(scope)=>{
        // C38455
      inputHelpers.clicker('[data-testid="pass-button-temperature_monitor_active"]')
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients")
      inputChecker.checkValue('[data-testid=pass-button-idm_placed_into_shipper]', 'true')
      inputChecker.checkValue('[data-testid="pass-button-apheresis_not_exposed"]', 'true')
      inputChecker.checkValue('[data-testid="pass-button-temperature_monitor_active"]', 'true')
      }
    },
      
  cryopreservationShippingSummary: {
      
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
        col_steps.collectionTransferProductToShipper(scope.coi, "ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cclp");
        col_steps.collectionShipmentChecklist(scope, "");
        })
    },
      
    posEditButton: ()=>{
      // C38459
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
      // C38460
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
    col_steps.collectionTransferProductToShipper(scope.coi, "ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cclp");

    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.shipmentChecklist,'Patients',4)
    col_steps.collectionShipmentChecklist(scope, "", therapy);

    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.shipmentSummary,'Patients',4)
    col_steps.collectionShippingSummary(scope, therapy);

    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.completed,'Patients',4)

      })
    }
  }
