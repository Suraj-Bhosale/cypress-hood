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
import collectionStepsRegression from '../../Regression_steps/LCLP_US_RegressionPath/collection_steps';
import col_steps from '../../../utils/HappyPath_steps/LCLP_US_HappyPath/collection_steps';
import regressionInput from '../../../fixtures/inputsRegression.json'
import collection_steps from '../../../utils/HappyPath_steps/LCLP_US_HappyPath/collection_steps'
// import therapies from "../fixtures/therapy.json";

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
    patientVerification:  {
        previousHappyPathSteps: (scope) => {
          cy.openOrder('collection','arlene')
          cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
        },
        nextButtonPos: () => {
            //C21352
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
        col_steps.centralLabelPrinting();
        col_steps.labelShipping();
        col_steps.patientVerification();
      },
    
      apheresisDateEmpty: () => {
        //C25450
        inputHelpers.clicker('[id="#/properties/custom_fields/properties/pre_collection_label_applied"]')
        inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/din_entry-input"]', inputs.din)
        inputChecker.nextButtonCheck('be.disabled')
    },
    
      apheresisDateFutureNeg: () => {
        //C25448
        inputChecker.inputDateFieldCheck("[id*='#/properties/apheresis_date-input']",regressionInput.collection.apheresisDateFuture,'be.disabled')
    },
    
      apheresisDatePos: () => {
        //C25449
        inputChecker.inputDateFieldCheck("[id*='#/properties/apheresis_date-input']",todaysDate,'not.be.disabled')
      },
    
      apheresisIdNeg: () => {
        //C25446
        inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/custom_fields/properties/din_entry-input"]','be.disabled')
      },
    
      isSiteLabelsAppliedNeg: () => {
        //C25447
        inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/din_entry-input"]', inputs.din)
        inputHelpers.clicker('[id="#/properties/custom_fields/properties/pre_collection_label_applied"]')
        inputChecker.nextButtonCheck('be.disabled')
      
      },
      
      checkForInfoSaved :() => {
        //C38348
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
            cy.log('C21533')
            inputChecker.nextButtonCheck('be.disabled')
            inputChecker.popupMessageVisible('btn-print','banner-container-0')
        },

        confirmPrintLabelNeg: () => {
            cy.log('C21537')
            inputHelpers.clicker('[id="#/properties/data/properties/is_verified"]')
            inputChecker.nextButtonCheck('be.disabled')
        },

        verifyApplyLabelNeg: () => {
            cy.log('C21538')
            cy.reload();
            inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]')
            inputChecker.nextButtonCheck('be.disabled')
        },

        checkForInfoSaved: (scope) => {
            cy.log('C21541')
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
            //	C21544
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
          //C21555
          inputHelpers.inputSingleField('[id="#/properties/collected_product_volume-input"]', inputs.collectedProductVolume)
          inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', inputs.wholeBloodProcessed)
          inputHelpers.inputSingleField('[data-testid="#/properties/anticoagulant_type-input"]', inputs.anticoagulantType)
          inputHelpers.inputSingleField('[id="#/properties/anticoagulant_volume-input"]', inputs.anticoagulantVolume)
          inputHelpers.inputSingleField('[id="collection_start_time"]', inputs.collectionStartTime)
          inputHelpers.inputSingleField('[id="collection_end_time"]', inputs.collectionEndTime)
          inputChecker.nextButtonCheck('be.disabled')
        },

        invalidProductVolume: () => {
          //C21557
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
          //C21558
          inputChecker.clearValueAndCheckForButton('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]','be.disabled')
          inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]',regressionInput.collection.zeroValue,'be.disabled');
          inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]',regressionInput.collection.moreDigitValue,'be.disabled');
          inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', regressionInput.collection.negativeValue)
          inputChecker.checkValue('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]',regressionInput.collection.positiveValue)
          inputChecker.nextButtonCheck('not.be.disabled')
        },

       anticoagulantTypeAsEmpty: () => {
         //C21559
        inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/anticoagulant_type-input"]','be.disabled')
       },

       invalidAnticoagulantVolume: () => {
         //	C21560
          inputHelpers.inputSingleField('[data-testid="#/properties/anticoagulant_type-input"]', inputs.anticoagulantType)
          inputChecker.clearValueAndCheckForButton('[id="#/properties/anticoagulant_volume-input"]','be.disabled')
          inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/anticoagulant_volume-input"]',regressionInput.collection.zeroValue,'be.disabled');
          inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/anticoagulant_volume-input"]',regressionInput.collection.moreDigitValue,'be.disabled');
          inputHelpers.inputSingleField('[id="#/properties/anticoagulant_volume-input"]', regressionInput.collection.negativeValue)
          inputChecker.checkValue('[id="#/properties/anticoagulant_volume-input"]',regressionInput.collection.positiveValue)
          inputChecker.nextButtonCheck('not.be.disabled')
       },

       invalidStartTime: () => {
         //C21563
        inputChecker.clearValueAndCheckForButton('[id="collection_start_time"]','be.disabled')
        inputChecker.checkNextButtonWithVariousInputs('[id="collection_start_time"]',regressionInput.collection.invalidTime,'be.disabled');
        inputChecker.checkNextButtonWithVariousInputs('[id="collection_start_time"]',regressionInput.collection.incorrectStartTime,'be.disabled');
       },

       invalidEndTime: () => {
         //C38138
        inputHelpers.inputSingleField('[id="collection_start_time"]', inputs.collectionStartTime)
        inputChecker.clearValueAndCheckForButton('[id="collection_end_time"]','be.disabled')
        inputChecker.checkNextButtonWithVariousInputs('[id="collection_end_time"]',regressionInput.collection.invalidTime,'be.disabled');
        inputChecker.checkNextButtonWithVariousInputs('[id="collection_end_time"]',regressionInput.collection.incorrectEndTime,'be.disabled');
       },

       checkForInfoSaved: (scope) => {
         //C21565
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
            //	C21566
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
          //C21568
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
        inputChecker.nextButtonCheck('be.disabled')
        cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('bag-1-identifier', coi,'not.be.visible','be.disabled')
        inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-FP-01`,'not.be.visible','be.disabled')
        inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-PRC-01`,'not.be.visible','be.disabled')
        })
      },
  
      posCheckNextButtonWithAndWithoutSig: () => {
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
        inputChecker.nextButtonCheck('be.disabled')
        cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('bag-1-identifier', coi,'not.be.visible','be.disabled')
        inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-FP-01`,'not.be.visible','be.disabled')
        inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-PRC-01`,'not.be.visible','be.disabled')
        })
      },
  
      posCheckNextButtonWithAndWithoutSig: () => {
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
        actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
          apiAliases: ['@patchProcedureSteps', '@getProcedures'],
        });
        inputChecker.checkDataSavingWithBackButton('be.enabled');
      },
    },
  
    cryopreservationLabels:  {
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
          col_steps.confirmChangeOfCustody(coi);
      })
      },
  
      negVerifyNumberOfBags: () => {
        inputChecker.inputSingleFieldCheck('[id="#/properties/item_count-input"]', '-2', 'be.disabled' )
      },
  
      verifyNumberOfBagsEmpty: () => {
        inputChecker.nextButtonCheck('be.disabled')
      },
  
      posSaveAndClose: (scope) => {
        inputChecker.inputSingleFieldCheck('[id="#/properties/item_count-input"]', '1', 'be.enabled' )
        inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled","Patients")
      },
  
      posDataOnNext: () => {
        actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
          apiAliases: ['@patchProcedureSteps', '@getProcedures'],
        });
        inputChecker.checkDataSavingWithBackButton('be.enabled');
      },
  
    },

    shipperLabels:  {
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
        col_steps.confirmChangeOfCustody(coi);
        col_steps.confirmNumberofBags();
      })
    },

      coiBagIdentifierOnBagNeg: () => {
        // C21590
        inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]');
        inputChecker.keepFieldsEmptymultiBags("bag-identifier-1","be.disabled")
        cy.get(`@coi`).then(coi => { 
          inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi+`-FP-0${1}`)
          inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi+`-APH-0${1}`)
          inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi)
        })
      },

      coiCassetteOnBagNeg: () => {
        // C21590
        cy.get(`@coi`).then(coi => { 
          inputChecker.scanAndVerifyMultiplePos("bag-identifier-1",coi+`-PRC-0${1}`,"be.visible")
        })
        inputChecker.keepFieldsEmptymultiBags("cassette-1","be.disabled")
        cy.get(`@coi`).then(coi => { 
          inputChecker.scanAndVerifyMultipleNeg("cassette-1",coi+`-FP-0${1}`)
          inputChecker.scanAndVerifyMultipleNeg("cassette-1",coi+`-APH-0${1}`)
          inputChecker.scanAndVerifyMultipleNeg("cassette-1",coi)
        })
      },

      checkboxNeg: () => {
        // C21592
        cy.get(`@coi`).then(coi => { 
          inputChecker.scanAndVerifyMultiplePos("cassette-1",coi+`-PRC-0${1}`,"be.visible")
          inputChecker.clickOnCheck('[id="#/properties/data/properties/is_confirmed"]',"be.disabled");
        })
      },

      saveAndCloseButtonPositive: (scope) => {
        // C21593
        inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]');
        inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients")
        inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]');
      },

      retainsValueUponClickingNext: () => {
        // C38104
        inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]');
        inputChecker.checkForTheInfoSavedClickingNextAndBack();
        inputChecker.checkGreenCheckMarkVisibilityMultiBags("bag-identifier-1");
        inputChecker.checkGreenCheckMarkVisibilityMultiBags("cassette-1");

      },
    },

    collectionBagStorage:  {
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
        col_steps.confirmChangeOfCustody(coi);
        col_steps.confirmNumberofBags();
        col_steps.shipperLabels(coi, therapy);
      })
    },

      coiBagIdentifierOnBagNeg: () => {
        // C21599 
        inputChecker.keepFieldsEmptymultiBags("bag-identifier-1","be.disabled")
        cy.get(`@coi`).then(coi => { 
          inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi+`-FP-0${1}`)
          inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi+`-APH-0${1}`)
          inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi)
        })
      },

      saveAndCloseButtonPositive: (scope) => {
        // C21601
        cy.get(`@coi`).then(coi => { 
          inputChecker.scanAndVerifyMultiplePos("bag-identifier-1",coi+`-PRC-0${1}`,"be.visible")
        })
        inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients")
      },

      retainsValueUponClickingNext: () => {
        // 38105
        inputChecker.checkForTheInfoSavedClickingNextAndBack();
        inputChecker.checkGreenCheckMarkVisibilityMultiBags("bag-identifier-1");
      },
    }, 

    cryopreservationData: {
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
        col_steps.confirmChangeOfCustody(coi);
        col_steps.confirmNumberofBags();
        col_steps.shipperLabels(coi, therapy);
        col_steps.collectionBagStorage(scope.coi);
    })
      },

      coiBagIdentifierOnBagNeg: () => {
        // C21613
        inputHelpers.inputSingleField('[id="#/properties/product_volume-input"]', inputs.productVolume)
        inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/total_cells-input"]', inputs.totalCells)
        inputChecker.keepFieldsEmptymultiBags("bag-identifier-1","be.disabled")
        cy.get(`@coi`).then(coi => { 
          inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi+`-FP-0${1}`)
          inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi+`-APH-0${1}`)
          inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1",coi)
        })
      },
      totalCellFieldNeg: () =>{
        // C21614
        cy.get(`@coi`).then(coi => { 
          inputChecker.scanAndVerifyMultiplePos("bag-identifier-1",coi+`-PRC-0${1}`,"be.visible")
        })
        inputChecker.clearValueAndCheckForButton('[id="#/properties/custom_fields/properties/total_cells-input"]','be.disabled')
        inputChecker.inputSingleFieldCheck('[id="#/properties/custom_fields/properties/total_cells-input"]',regressionInput.collection.negVolume,'be.disabled');
      },

      productVolumeNeg: () =>{
        // C21615
        inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/total_cells-input"]', inputs.totalCells)
        inputChecker.clearValueAndCheckForButton('[id="#/properties/product_volume-input"]','be.disabled')
        inputChecker.inputSingleFieldCheck('[id="#/properties/product_volume-input"]',regressionInput.collection.negVolume,'be.disabled');
      },

      saveAndCloseButtonPositive: (scope) => {
        // C21619
        inputHelpers.inputSingleField('[id="#/properties/product_volume-input"]', inputs.productVolume)
        inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/total_cells-input"]', inputs.totalCells)
        inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients")
      },

      retainsValueUponClickingNext: () => {
        // C38106
        inputChecker.checkForTheInfoSavedClickingNextAndBack();
        inputChecker.checkGreenCheckMarkVisibilityMultiBags("bag-identifier-1");
        inputChecker.checkValue('[id="#/properties/product_volume-input"]',inputs.productVolume);
        inputChecker.checkValue('[id="#/properties/custom_fields/properties/total_cells-input"]',inputs.totalCells);
      },
    },

      cryopreservationSummary:  {
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
            col_steps.confirmChangeOfCustody(coi);
            col_steps.confirmNumberofBags();
            col_steps.shipperLabels(coi, therapy);
            col_steps.collectionBagStorage(coi);
            col_steps.cryopreservationDataLocal(coi);
        })
        },

        posEditButton: () => { 
            //C21603
            inputHelpers.clicker('[data-testid="edit-cryopreservation_data"]')
            inputHelpers.inputSingleField('[id="#/properties/product_volume-input"]', regressionInput.collection.changedVolume)
            inputChecker.reasonForChange()
            inputChecker.checkValue('[id="#/properties/product_volume-input"]',regressionInput.collection.changedVolume)
        },

        checkNextButtonWithAndWithoutSig: () => {
            //C21604
            inputChecker.checkNextButtonWithAndWithoutSignature('1')
        },
    },
  
    cryopreservationBagSelection: {
      previousHappyPathSteps: (scope,therapy) => {
          cy.openOrder('collection','arlene')
          cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
          col_steps.patientVerification();
          col_steps.collectionBagIdentification()
          col_steps.collectionBagLabel(therapy);
          col_steps.collectionProcedureInformation();
          cy.get(`@coi`).then(coi => {
          col_steps.bagDataEntryDay(coi);
          col_steps.collectionSummary(scope, therapy);
          col_steps.changeOfCustody(coi);

          cy.openOrder('collection','phil')
          cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')

          col_steps.confirmChangeOfCustody(coi);
          col_steps.confirmNumberofBags();
          col_steps.shipperLabels(coi, therapy);
          col_steps.collectionBagStorage(coi);
          col_steps.cryopreservationDataLocal(coi);
          col_steps.cryopreservationSummary(scope);
       })
         },

        negNoInputForBagSelection: () => {
            //C21608
          inputChecker.nextButtonCheck('be.disabled')
        },

        negDoNotShipBag: () => {
            //C21610
          inputHelpers.clicker('[data-testid="fail-button-0"]')
          inputChecker.nextButtonCheck('be.disabled')
        }
    },

    cryopreservationTransferProductToShipper:  {

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

        col_steps.confirmChangeOfCustody(coi);
        col_steps.confirmNumberofBags();
        col_steps.shipperLabels(coi, therapy);
        col_steps.collectionBagStorage(coi);
        col_steps.cryopreservationDataLocal(coi);
        col_steps.cryopreservationSummary(scope);
        col_steps.cryopreservationBagSelection();
       })
      },

      negBagId: () => {
        //C21612
        inputChecker.scanAndVerifyFieldAsEmpty('cassette-1','be.disabled')
      },
      negCoi: () => {
        //C21620
        inputChecker.scanAndVerifyFieldAsEmpty('ln-2-shipper-1','be.disabled')
      },

      negToggleCaseIntact: () => {
        //C21622
        cy.get(`@coi`).then(coi => {
        inputHelpers.scanAndVerifyBags('cassette-1', `${coi}-PRC-01`)
        inputHelpers.scanAndVerifyBags('ln-2-shipper-1', coi)
        })
        inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"]')
        inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"]')
        inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]')
        inputChecker.nextButtonCheck('be.disabled')
        inputHelpers.clicker('[data-testid="fail-button-case_intact_1"]')
        inputChecker.nextButtonCheck('be.disabled')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/case_intact_1_reason-input"]')
      },

      negToggleTempRange: () => {
        //C21624
        inputHelpers.clicker('[data-testid="pass-button-case_intact_1"]')
        inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"]')
        inputChecker.nextButtonCheck('be.disabled')
        inputHelpers.clicker('[data-testid="fail-button-temp_out_of_range_1"]')
        inputChecker.nextButtonCheck('be.disabled')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/temp_out_of_range_1_reason-input"]')
      },

      negIsredTamperSeal: () => {
        //	C21626
        inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"]')
        inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]')
        inputChecker.nextButtonCheck('be.disabled')
        inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_seal_labeled_rack"]')
        inputChecker.nextButtonCheck('be.disabled')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_seal_labeled_rack_reason-input"]')
      },
      
      negToggleProductsStatus: () => {
        //C21627
        inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]')
        inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"]')
        inputChecker.nextButtonCheck('be.disabled')
        inputHelpers.clicker('[data-testid="fail-button-ambient_temperature_exposure"]')
        inputChecker.nextButtonCheck('be.disabled')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/ambient_temperature_exposure_reason-input"]')
      },

      posSaveAndClose: (scope) => {
        //	C21628
        inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"]')
        inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients")
        inputChecker.checkValue('[data-testid="pass-button-case_intact_1"]', 'true');
        inputChecker.checkValue('[data-testid="pass-button-temp_out_of_range_1"]', 'true');
        inputChecker.checkValue('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]', 'true');
        inputChecker.checkValue('[data-testid="pass-button-ambient_temperature_exposure"]', 'true');
        inputChecker.checkForGreenCheck("cassette-1")
        inputChecker.checkForGreenCheck("ln-2-shipper-1")
      }
    },

    shipmentChecklist: {
      previousHappyPathSteps: (scope, therapy) =>{
        cy.openOrder('collection','arlene')
        cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')

        col_steps.patientVerification(therapy);
        col_steps.collectionBagIdentification(therapy);
        col_steps.collectionBagLabel(therapy);
        col_steps.collectionProcedureInformation();
        cy.get(`@coi`).then((coi) => {
        col_steps.bagDataEntryDay(coi);
        col_steps.collectionSummary(scope, therapy);
        col_steps.changeOfCustody(coi);

        cy.openOrder('collection','phil')
        cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')

        col_steps.confirmChangeOfCustody(coi);
        col_steps.confirmNumberofBags();
        col_steps.shipperLabels(coi, therapy);
        col_steps.collectionBagStorage(coi);
        col_steps.cryopreservationDataLocal(coi);
        col_steps.cryopreservationSummary(scope);
        col_steps.cryopreservationBagSelection();
        col_steps.cryopreservationTransferProductToShipper(coi);
  });
      },
      airWaybillEmpty: () =>{
        inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_is_id-input"]', inputs.evoLast4Digits)
        inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', inputs.tamperSealNumber)
        inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]')
        inputHelpers.clicker('[data-testid="pass-button-red_wire"]')
        inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
        inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]')
        inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]')
        inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]')
        inputChecker.nextButtonCheck('be.disabled')
        
      },
      negEvoIsNumberMatch: (scope) =>{
        getCollAirWayBill(scope.patientInformation.subjectNumber)
        inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_is_id-input"]', inputs.evoLast4Digits)
        inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', inputs.tamperSealNumber)

        inputHelpers.clicker('[data-testid="pass-button-red_wire"]')
        inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
        inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]')
        inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]')
        inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]')
        
        inputHelpers.clicker('[data-testid="fail-button-evo_airway_bill"]')
        inputChecker.nextButtonCheck('be.disabled')
      },

      negIsRedTamperSeal: () =>{
        inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]')
        inputHelpers.clicker('[data-testid="fail-button-red_wire"]')
        inputChecker.nextButtonCheck('be.disabled')
      },

      negTamperSealNumberMatch: () =>{
        inputHelpers.clicker('[data-testid="pass-button-red_wire"]')
        inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]')
        inputChecker.nextButtonCheck('be.disabled')
        
      },

      negIsShipperLabelIncluded: () =>{
        inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
        inputHelpers.clicker('[data-testid="fail-button-shipper_label_placed"]')
        inputChecker.nextButtonCheck('be.disabled')

      },

      negIsConsigneeKitPouchIncluded: () =>{
        inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]')
        inputHelpers.clicker('[data-testid="fail-button-consignee_kit_pouch_inside"]')
        inputChecker.nextButtonCheck('be.disabled')

      },

      negISZipTiesSecured: () => {
        inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]')
        inputHelpers.clicker('[data-testid="fail-button-zip_ties_secured"]')
        inputChecker.nextButtonCheck('be.disabled')
      },
      
      dataOnSaveAndClose: (scope) =>{
        inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]')
        inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients")
      }
    },

    cryopreservationShippingSummary: {
      previousHappyPathSteps: (scope, therapy) =>{
        cy.openOrder('collection','arlene')
        cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')

        col_steps.patientVerification();
        col_steps.collectionBagIdentification(therapy);
        col_steps.collectionBagLabel(therapy);
        col_steps.collectionProcedureInformation();
        cy.get(`@coi`).then((coi) => {
        col_steps.bagDataEntryDay(coi);
        col_steps.collectionSummary(scope, therapy);
        col_steps.changeOfCustody(coi);

        cy.openOrder('collection','phil')
        cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')

        col_steps.confirmChangeOfCustody(coi);
        col_steps.confirmNumberofBags();
        col_steps.shipperLabels(coi, therapy);
        col_steps.collectionBagStorage(coi);
        col_steps.cryopreservationDataLocal(coi);
        col_steps.cryopreservationSummary(scope);
        col_steps.cryopreservationBagSelection();
        col_steps.cryopreservationTransferProductToShipper(coi);
        col_steps.cryopreservationShipmentChecklist(scope, therapy);
      });
      },
      posEditButton: ()=>{
        inputHelpers.clicker('[data-testid="edit-shipment_checklist"]')
        inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_is_id-input"]', regressionInput.collection.evoLast4Digits)
        inputChecker.reasonForChange()
        inputChecker.checkLabelAfterNext(
                              '[data-test-id="collection_shipping_summary"]',
                              '[data-testid="txt-field-layout-Please enter the last 4 digits of the EVO-IS Number on the LN2 shipper lid-answer"]>>',
                              regressionInput.collection.evoLast4Digits
        )
        inputHelpers.clicker('[data-testid="edit-transfer_product_to_shipper"]')
        inputHelpers.clicker('[data-testid="fail-button-case_intact_1"]')
        inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/case_intact_1_reason-input"]',regressionInput.collection.caseIntactReasonInput)
        inputChecker.reasonForChange()
        inputChecker.checkLabelAfterNext(
          '[data-test-id="collection_shipping_summary"]',
          '[data-testid="txt-field-layout-Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact your Janssen Cell Therapy Coordinator.-answer"] >>>>>>',
          'No'
        )
      },

      checkNextButtonWithAndWithoutSignature: () => {
        inputChecker.checkNextButtonWithAndWithoutSignature('1')
        },
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
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.cryopreservationBags,'Patients',4)
    col_steps.confirmNumberofBags();

    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.applyLabel,'Patients',4)
    col_steps.shipperLabels(coi, therapy);

    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.bagStorage,'Patients',4)
    col_steps.collectionBagStorage(coi);

    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.cryopreservationyData,'Patients',4)
    col_steps.cryopreservationDataLocal(coi);

    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.cryopreservationSummary,'Patients',4)
    col_steps.cryopreservationSummary(scope);

    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.bagSelection,'Patients',4)
    col_steps.cryopreservationBagSelection();

    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.transferBagToShipper,'Patients',4)
    col_steps.cryopreservationTransferProductToShipper(coi);

    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.shipmentChecklist,'Patients',4)
    col_steps.cryopreservationShipmentChecklist(scope, therapy);

    inputHelpers.clickOnHeader('collection')
    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.shipmentSummary,'Patients',4)
    col_steps.cryopreservationShippingSummary(scope, therapy);

    tableHelpers.clickOnFilter('appointment', 'All');
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.collection.statuses.completed,'Patients',4)

      })
    }
  }