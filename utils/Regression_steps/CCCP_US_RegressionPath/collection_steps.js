import common from '../../../support/index'
import assertions from '../../../fixtures/assertions.json'
import inputs from '../../../fixtures/inputs.json'
import collectionAssertion from '../../../fixtures/collectionAssertions.json'
import translationHelpers from '../../shared_block_helpers/translationHelpers.js'
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers'
import col_steps from '../../../utils/HappyPath_steps/CCCP_US_HappyPath/collection_steps';
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";
import regressionInput from '../../../fixtures/inputsRegression.json'
import dayjs from 'dayjs';
import tableHelpers from "../../shared_block_helpers/tableHelpers"

const todaysDate = dayjs().format('DD-MMM-YYYY')

const getCollAirWayBill = (uniqueId) => {
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
  
  centralLabelPrinting:  {
      previousHappyPathSteps: (scope) => {
        cy.openOrder('collection','arlene')
        cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      },

      collectionLabelCheckbox: () => {
        //C25408
        inputHelpers.clicker('[id="#/properties/data/properties/is_shipper_labels_confirmed"]')
        inputChecker.nextButtonCheck('be.disabled')
      },

      shipperLabelCheckbox: () => {
        //C25409
        inputHelpers.clicker('[id="#/properties/data/properties/is_shipper_labels_confirmed"]')
        inputHelpers.clicker('[id="#/properties/data/properties/is_collection_labels_confirmed"]')
        inputChecker.nextButtonCheck('be.disabled')
      },

      checkForDataSaved : (scope)  => {
        //C25410
        inputHelpers.clicker('[id="#/properties/data/properties/is_shipper_labels_confirmed"]')
        inputHelpers.clicker('[data-testid="primary-button-action"]')
        signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
        inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,'be.enabled','Patients')
      },
  },

  labelShipping:  {

    previousHappyPathSteps: (scope,therapy) => {
      cy.openOrder('collection','arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      col_steps.centralLabelPrinting(therapy);
    },

    verifyNextButtonWithoutSignature: () => {
      //C25412
      inputChecker.nextButtonCheck('be.disabled')
    },

    checkForDataSaved: (scope) => {
      //C25413
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
    inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,'be.enabled','Patients',)
  },
  },

  patientVerification: {
    previousHappyPathSteps: (scope,therapy) => {
      cy.openOrder('collection','arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      col_steps.centralLabelPrinting(therapy);
      col_steps.labelShipping(therapy);
    },
    nextButtonPos: () => {
        //C25373
        inputChecker.nextButtonCheck('be.disabled')
        signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
        signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], inputs.verifier[0])
        inputChecker.nextButtonCheck('not.be.disabled')
        actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
            apiAliases: ['@patchProcedureSteps', '@getProcedures'] })
      },
  },

  collectionBagIdentification: {
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection','arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      col_steps.centralLabelPrinting(therapy);
      col_steps.labelShipping(therapy);
      col_steps.patientVerification(therapy);
    },

    apheresisDateEmpty: () => {
      //C25419
      inputHelpers.clicker('[id="#/properties/custom_fields/properties/pre_collection_label_applied"]')
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/din_entry-input"]', inputs.din)
      inputChecker.nextButtonCheck('be.disabled')
  },

    apheresisDateFutureNeg: () => {
      //C25416
      inputChecker.inputDateFieldCheck("[id*='#/properties/apheresis_date-input']",regressionInput.collection.apheresisDateFuture,'be.disabled')
},

    apheresisDatePos: () => {
      //C25417
      inputChecker.inputDateFieldCheck("[id*='#/properties/apheresis_date-input']",todaysDate,'not.be.disabled')
    },

    apheresisIdNeg: () => {
        //C25414
        inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/custom_fields/properties/din_entry-input"]','be.disabled')
    },

    isSiteLabelsAppliedNeg: () => {
        //C25415
        inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/din_entry-input"]', inputs.din)
        inputHelpers.clicker('[id="#/properties/custom_fields/properties/pre_collection_label_applied"]')
        inputChecker.nextButtonCheck('be.disabled')
    
    },
    
    checkForInfoSaved :() => {
        // C38237
        inputHelpers.clicker('[id="#/properties/custom_fields/properties/pre_collection_label_applied"]')
        inputChecker.checkForTheInfoSavedClickingNextAndBack();
        inputChecker.nextButtonCheck('not.be.disabled');
    },

  },

  collectionBagLabel: {
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection','arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      col_steps.centralLabelPrinting(therapy);
      col_steps.labelShipping(therapy);
      col_steps.patientVerification(therapy);
      col_steps.collectionBagIdentification(therapy);
    },

    checkboxNeg: () => {
      // C25420
      inputChecker.nextButtonCheck('be.disabled');
    },
  
    checkForDataSaved: (scope) => {
      // C25421
      inputChecker.clickOnCheck('[id="#/properties/data/properties/is_verified"]','not.be.disabled');
      inputHelpers.clicker('[data-testid="primary-button-action"]')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,'be.enabled','Patients')
    },
  },

  collectionProcedureInformation: {
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection','arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      col_steps.centralLabelPrinting(therapy);
      col_steps.labelShipping(therapy);
      col_steps.patientVerification(therapy);
      col_steps.collectionBagIdentification(therapy);
      col_steps.collectionBagLabel(therapy);

    },
    
    verifyInvalidPatientWait: () => {
      //	C25423
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

  bagDataEntryDay:{
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection','arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      col_steps.centralLabelPrinting(therapy);
      col_steps.labelShipping(therapy);
      col_steps.patientVerification(therapy);
      col_steps.collectionBagIdentification(therapy);
      col_steps.collectionBagLabel(therapy);
      col_steps.collectionProcedureInformation(therapy);


    },

    bagCoiAsEmpty: () => {
      //C25374
      inputHelpers.inputSingleField('[id="#/properties/collected_product_volume-input"]', inputs.collectedProductVolume)
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', inputs.wholeBloodProcessed)
      inputHelpers.inputSingleField('[data-testid="#/properties/anticoagulant_type-input"]', inputs.anticoagulantType)
      inputHelpers.inputSingleField('[id="#/properties/anticoagulant_volume-input"]', inputs.anticoagulantVolume)
      inputHelpers.inputSingleField('[id="collection_start_time"]', inputs.collectionStartTime)
      inputHelpers.inputSingleField('[id="collection_end_time"]', inputs.collectionEndTime)
      inputChecker.nextButtonCheck('be.disabled')
    },

    invalidProductVolume: () => {
      //C25375
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
      //C25376
      inputChecker.clearValueAndCheckForButton('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]','be.disabled')
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]',regressionInput.collection.zeroValue,'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]',regressionInput.collection.moreDigitValue,'be.disabled');
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', regressionInput.collection.negativeValue)
      inputChecker.checkValue('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]',regressionInput.collection.positiveValue)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

   anticoagulantTypeAsEmpty: () => {
     //C25377
    inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/anticoagulant_type-input"]','be.disabled')
   },

   invalidAnticoagulantVolume: () => {
     //C25378
      inputHelpers.inputSingleField('[data-testid="#/properties/anticoagulant_type-input"]', inputs.anticoagulantType)
      inputChecker.clearValueAndCheckForButton('[id="#/properties/anticoagulant_volume-input"]','be.disabled')
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/anticoagulant_volume-input"]',regressionInput.collection.zeroValue,'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/anticoagulant_volume-input"]',regressionInput.collection.moreDigitValue,'be.disabled');
      inputHelpers.inputSingleField('[id="#/properties/anticoagulant_volume-input"]', regressionInput.collection.negativeValue)
      inputChecker.checkValue('[id="#/properties/anticoagulant_volume-input"]',regressionInput.collection.positiveValue)
      inputChecker.nextButtonCheck('not.be.disabled')
   },

   invalidStartTime: () => {
     //C25379
    inputChecker.clearValueAndCheckForButton('[id="collection_start_time"]','be.disabled')
    inputChecker.checkNextButtonWithVariousInputs('[id="collection_start_time"]',regressionInput.collection.invalidTime,'be.disabled');
    inputChecker.checkNextButtonWithVariousInputs('[id="collection_start_time"]',regressionInput.collection.incorrectStartTime,'be.disabled');
   },

   invalidEndTime: () => {
     //C38242
    inputHelpers.inputSingleField('[id="collection_start_time"]', inputs.collectionStartTime)
    inputChecker.clearValueAndCheckForButton('[id="collection_end_time"]','be.disabled')
    inputChecker.checkNextButtonWithVariousInputs('[id="collection_end_time"]',regressionInput.collection.invalidTime,'be.disabled');
    inputChecker.checkNextButtonWithVariousInputs('[id="collection_end_time"]',regressionInput.collection.incorrectEndTime,'be.disabled');
   },

   checkForInfoSaved: (scope) => {
     //C25380
    inputHelpers.inputSingleField('[id="collection_end_time"]', inputs.collectionEndTime)
    inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients")
    inputChecker.checkValue('[id="collection_start_time"]', inputs.collectionStartTime)
    inputChecker.checkValue('[id="collection_end_time"]', inputs.collectionEndTime)
    inputChecker.checkValue('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]',regressionInput.collection.positiveValue)
    inputChecker.checkValue('[data-testid="#/properties/anticoagulant_type-input"]', inputs.anticoagulantType)
   }
  },

  collectionSummary: {
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection','arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      col_steps.centralLabelPrinting(therapy);
      col_steps.labelShipping(therapy);
      col_steps.patientVerification(therapy);
      col_steps.collectionBagIdentification(therapy);
      col_steps.collectionBagLabel(therapy);
      col_steps.collectionProcedureInformation(therapy);
      cy.get(`@coi`).then(coi => {
        col_steps.bagDataEntryDay(coi, therapy);
        })
    },

    posEditButton: () => { 
      //	C25381
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
    //C25382
    inputChecker.nextButtonCheck('be.disabled')
    inputChecker.checkNextButtonWithAndWithoutSignature('0')
  }
  },

  changeOfCustody: {
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection','arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      col_steps.centralLabelPrinting(therapy);
      col_steps.labelShipping(therapy);
      col_steps.patientVerification(therapy);
      col_steps.collectionBagIdentification(therapy);
      col_steps.collectionBagLabel(therapy);
      col_steps.collectionProcedureInformation(therapy);
      cy.get(`@coi`).then(coi => {
      col_steps.bagDataEntryDay(coi, therapy);
      })
      col_steps.collectionSummary(scope, therapy);
    },

    negVerifyInvalidBagId: () => {
      // C25425
      inputChecker.nextButtonCheck('be.disabled')
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyCheck('bag-1-identifier', coi,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-FP-01`,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-PRC-01`,'not.be.visible','be.disabled')
      })
    },

    posCheckNextButtonWithAndWithoutSig: () => {
      // C25426
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-APH-01`,'not.be.visible','be.disabled')
      });
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
      inputChecker.nextButtonCheck('be.disabled')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.nextButtonCheck('be.enabled');
    },

    posDataOnNext: (scope) => {
      // C38243
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      });
      common.loadCollection();
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients', 'be.enabled')
      inputChecker.checkDataSavingWithBackButton('be.enabled');
    },
  },

  confirmChangeOfCustody:{
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection','arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      col_steps.centralLabelPrinting(therapy);
      col_steps.labelShipping(therapy);
      col_steps.patientVerification(therapy);
      col_steps.collectionBagIdentification(therapy);
      col_steps.collectionBagLabel(therapy);
      col_steps.collectionProcedureInformation(therapy);
      cy.get(`@coi`).then(coi => {
      col_steps.bagDataEntryDay(coi, therapy);
      col_steps.collectionSummary(scope, therapy);
      col_steps.changeOfCustody(coi, therapy);
    })
      cy.openOrder('collection','phil')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
    },

    negVerifyInvalidBagId: () => {
      // C25427
      inputChecker.nextButtonCheck('be.disabled')
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyCheck('bag-1-identifier', coi,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-FP-01`,'not.be.visible','be.disabled')
      inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-PRC-01`,'not.be.visible','be.disabled')
      })
    },

    posCheckNextButtonWithAndWithoutSig: () => {
      // C25428
      cy.get(`@coi`).then(coi => { 
      inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-APH-01`,'not.be.visible','be.disabled')
      });
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
      inputChecker.nextButtonCheck('be.disabled')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.nextButtonCheck('be.enabled');
    },

    posDataOnNext: () => {
      // C38245
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      });
      inputChecker.checkDataSavingWithBackButton('be.enabled');
    },
  },

  collectionTransferProductToShipper: {
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection','arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      col_steps.centralLabelPrinting(therapy);
      col_steps.labelShipping(therapy);
      col_steps.patientVerification(therapy);
      col_steps.collectionBagIdentification(therapy);
      col_steps.collectionBagLabel(therapy);
      col_steps.collectionProcedureInformation(therapy);
      cy.get(`@coi`).then(coi => {
       col_steps.bagDataEntryDay(coi, therapy);
      col_steps.collectionSummary(scope, therapy);

      col_steps.changeOfCustody(coi, therapy);
    })
      cy.openOrder('collection','phil')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      cy.get(`@coi`).then(coi => {
        col_steps.confirmChangeOfCustody(coi);
          })
    },

    negCoi: () => {
      // C25429
      inputChecker.nextButtonCheck('be.disabled')
      cy.get(`@coi`).then(coi => {
    inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cccp', `${coi}-PRC-01`,'not.be.visible','be.disabled')
    inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cccp', `${coi}-FP-01`,'not.be.visible','be.disabled')
    inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cccp', `${coi}-APH-01`,'not.be.visible','be.disabled')
      })
    },
    saveAndClosePos: (scope) => {
      // C25430
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cccp', `${coi}`,'be.visible','not.be.disabled')
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients")
      inputChecker.nextButtonCheck('not.be.disabled')
      })
    },
    
    posDataOnNext: () => {
      // C38299
      inputChecker.checkDataSavingWithBackButton('be.enabled');
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
      }
  },


  collectionShipmentChecklist: {
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection','arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      col_steps.centralLabelPrinting(therapy);
      col_steps.labelShipping(therapy);
      col_steps.patientVerification(therapy);
      col_steps.collectionBagIdentification(therapy);
      col_steps.collectionBagLabel(therapy);
      col_steps.collectionProcedureInformation(therapy);
      cy.get(`@coi`).then(coi => {
        col_steps.bagDataEntryDay(coi, therapy);
        col_steps.collectionSummary(scope, therapy);

        col_steps.changeOfCustody(coi, therapy);
        cy.openOrder('collection','phil')
        cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
        col_steps.confirmChangeOfCustody(coi);
        col_steps.collectionTransferProductToShipper(coi, "ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cccp", therapy);
          })
    },
    airWaybillEmpty: () =>{
      // C25431
        inputHelpers.clicker('[data-testid=pass-button-idm_placed_into_shipper]')
        inputHelpers.clicker('[data-testid="pass-button-apheresis_not_exposed"]')
        inputHelpers.clicker('[data-testid="pass-button-temperature_monitor_active"]')
        inputChecker.nextButtonCheck('be.disabled')
    },
  
    negApheresisNotExposedToTemp:(scope)=>{
      // C25432
      getCollAirWayBill(scope.patientInformation.subjectNumber)
      inputHelpers.clicker('[data-testid="pass-button-idm_placed_into_shipper"]')
      inputChecker.clickOnCheck('[data-testid="pass-button-temperature_monitor_active"]','be.disabled')
      inputHelpers.clicker('[data-testid="fail-button-apheresis_not_exposed"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/apheresis_not_exposed_reason-input"]','be.visible')
    },
  
    posApheresisNotExposedToTempNoWithDescription:()=>{
      // C38281
      inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-apheresis_not_exposed"]')
    },
  
    negHasInfectiousDiseaseMarker:() => {
      // C25433
      inputHelpers.clicker('[data-testid="pass-button-apheresis_not_exposed"]')
      inputChecker.clickOnCheck('[data-testid="pass-button-idm_placed_into_shipper"]','be.disabled')
      inputHelpers.clicker('[data-testid="fail-button-idm_placed_into_shipper"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/idm_placed_into_shipper_reason-input"]','be.visible')
  
    },
      
    posHasInfectiousDiseaseMarkerNoWithDescription:() => {
      // C38282
      inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-idm_placed_into_shipper"]')
    },
  
    negHasTemperatureMonitorActivated:()=>{
      // C25434
      inputHelpers.clicker('[data-testid="pass-button-idm_placed_into_shipper"]')
      inputChecker.clickOnCheck('[data-testid="pass-button-temperature_monitor_active"]','be.disabled')
      inputHelpers.clicker('[data-testid="fail-button-temperature_monitor_active"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/temperature_monitor_active_reason-input"]','be.visible')
    },
  
    posHasTemperatureMonitorActivatedNoWithReason:()=>{
      // C38283
      inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-temperature_monitor_active"]')
    },
  
    checkForDataSaved:(scope)=>{
      // C25435
    inputHelpers.clicker('[data-testid="pass-button-temperature_monitor_active"]')
    inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients")
    inputChecker.checkValue('[data-testid=pass-button-idm_placed_into_shipper]', 'true')
    inputChecker.checkValue('[data-testid="pass-button-apheresis_not_exposed"]', 'true')
    inputChecker.checkValue('[data-testid="pass-button-temperature_monitor_active"]', 'true')
    }

  },

  collectionShippingSummary:{
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection','arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      col_steps.centralLabelPrinting(therapy);
      col_steps.labelShipping(therapy);
      col_steps.patientVerification(therapy);
      col_steps.collectionBagIdentification(therapy);
      col_steps.collectionBagLabel(therapy);
      col_steps.collectionProcedureInformation(therapy);
      cy.get(`@coi`).then(coi => {
        col_steps.bagDataEntryDay(coi, therapy);
        col_steps.collectionSummary(scope, therapy);
        col_steps.changeOfCustody(coi, therapy);
        cy.openOrder('collection','phil')
        cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
        col_steps.confirmChangeOfCustody(coi);
        col_steps.collectionTransferProductToShipper(coi, "ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cccp", therapy);
          })
      col_steps.collectionShipmentChecklist(scope, "", therapy);
    },

    posEditButton: ()=>{
      // C25436
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
      // C25437
      inputChecker.checkNextButtonWithAndWithoutSignature('1')
    }

},
checkStatusesOfCollectionModule: (scope,therapy) => {

  cy.openOrder('collection','arlene')
  cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
  cy.get(`@coi`).then((coi) => {
    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.centralLabelPrinting,'Patients',4)
    col_steps.centralLabelPrinting();

    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.shipLabelsToCollectionSite,'Patients',4)
    col_steps.labelShipping();

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
    col_steps.collectionTransferProductToShipper(coi, "ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cccp", therapy);

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
}}
