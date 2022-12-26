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
import collectionStepsRegression from '../../Regression_steps/LCCP_US_RegressionPath/collection_steps';
import col_steps from '../../../utils/HappyPath_steps/LCCP_US_HappyPath/collection_steps';
import regressionInput from '../../../fixtures/inputsRegression.json'
import collection_steps from '../../../utils/HappyPath_steps/LCCP_US_HappyPath/collection_steps'
// import therapies from "../fixtures/therapy.json";

const todaysDate = dayjs().format('DD-MMM-YYYY')

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
  openOrder: (coi) => {
    common.loginAs('arlene');
    cy.visit('/collection');
    cy.get('.collection-row_coi')
      .contains('div', coi)
      .click();
  },
  centralLabelPrinting: {
    printLablesClickablePos: () => {
      //C39543
      inputChecker.multiplePopupMessagesVisible('[data-testid="btn-print"]', 0, 'banner-container-0');
      inputChecker.multiplePopupMessagesVisible('[data-testid="btn-print"]', 1, 'banner-container-0');
      inputChecker.multiplePopupMessagesVisible('[data-testid="btn-print"]', 2, 'banner-container-0');
    },

    collectionUncheckNextButtonDisabledNeg: () => {
      //C25765
      inputHelpers.clicker('[id="#/properties/data/properties/is_cryopreservation_labels_confirmed"]');
      inputHelpers.clicker('[id="#/properties/data/properties/is_shipper_labels_confirmed"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    shipperUncheckNextButtonDisabledNeg: () => {
      //C25766
      cy.reload();
      inputHelpers.clicker('[id="#/properties/data/properties/is_collection_labels_confirmed"]');
      inputHelpers.clicker('[id="#/properties/data/properties/is_cryopreservation_labels_confirmed"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    cryoUncheckNextButtonDisabledNeg: () => {
      //C25769
      cy.reload();
      inputHelpers.clicker('[id="#/properties/data/properties/is_collection_labels_confirmed"]');
      inputHelpers.clicker('[id="#/properties/data/properties/is_shipper_labels_confirmed"]');
      inputChecker.nextButtonCheck('be.disabled')
    },

    checkForInfoSaved: (scope) => {
      //C21565
      cy.reload();
      inputHelpers.clicker('[id="#/properties/data/properties/is_collection_labels_confirmed"]');
      inputHelpers.clicker('[id="#/properties/data/properties/is_shipper_labels_confirmed"]');
      inputHelpers.clicker('[id="#/properties/data/properties/is_cryopreservation_labels_confirmed"]');
      inputChecker.nextButtonCheck('not.be.disabled')
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Patients")
    },

    signToConfirmAppearNextDisabledNeg: () => {
      //C25768
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      })
      actionButtonsHelper.checkActionButtonIsEnabled('primary'); //[BUG] Next button should be disabled without Signature
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature']);
    }
  },

  shipLabelsToCollectionSite: {
    previousHappyPathSteps: (scope, therapy) => {
      col_steps.centralLabelPrinting(therapy)
    },

    signToConfirmAppearNextDisabledNeg: () => {
      //C25770
      inputChecker.nextButtonCheck('be.disabled')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature']);
      inputChecker.nextButtonCheck('not.be.disabled')
    }
  },

  patientVerification: {
    previousHappyPathSteps: (scope, therapy) => {
      col_steps.centralLabelPrinting(therapy)
      col_steps.labelShipping()
    },

    nextButtonPos: () => {
      //C25351
      inputChecker.nextButtonCheck('be.disabled')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], inputs.verifier[0])
      inputChecker.nextButtonCheck('not.be.disabled')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      })
    }
  },

  collectionBagIdentification: {
    previousHappyPathSteps: (scope, therapy) => {
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
      inputChecker.inputDateFieldCheck("[id*='#/properties/apheresis_date-input']", regressionInput.collection.apheresisDateFuture, 'be.disabled')
    },

    apheresisDatePos: () => {
      //C25417
      inputChecker.inputDateFieldCheck("[id*='#/properties/apheresis_date-input']", todaysDate, 'not.be.disabled')
    },

    apheresisIdNeg: () => {
      //C25414
      inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/custom_fields/properties/din_entry-input"]', 'be.disabled')
    },

    isSiteLabelsAppliedNeg: () => {
      //C25415
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/din_entry-input"]', inputs.din)
      inputHelpers.clicker('[id="#/properties/custom_fields/properties/pre_collection_label_applied"]')
      inputChecker.nextButtonCheck('be.disabled')

    },

    checkForInfoSaved: () => {
      // C38237
      inputHelpers.clicker('[id="#/properties/custom_fields/properties/pre_collection_label_applied"]')
      inputChecker.checkForTheInfoSavedClickingNextAndBack();
      inputChecker.nextButtonCheck('not.be.disabled');
    },
  },

  collectionBagLabelPrinting: {
    previousHappyPathSteps: (scope) => {
      cy.openOrder('collection', 'arlene');
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients');
      col_steps.centralLabelPrinting();
      col_steps.labelShipping();
      col_steps.patientVerification();
      col_steps.collectionBagIdentification();
    },

    // C25778
    negVerifyApheresisCheckboxUnchecked: () => {
      inputChecker.nextButtonCheck('be.disabled');
    },

    // C25779
    posSaveAndCloseButtonCheck: (scope) => {
      inputHelpers.clicker('[id="#/properties/data/properties/is_verified"]');
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Patients");
    },

    // C25780
    checkForInfoSavedAfterSignature: (scope) => {
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      })
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Patients");
      inputChecker.nextButtonCheck('not.be.disabled')
    }
  },

  collectionProcedureInformation: {
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection', 'arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients');
      col_steps.centralLabelPrinting();
      col_steps.labelShipping();
      col_steps.patientVerification();
      col_steps.collectionBagIdentification();
      col_steps.collectionBagLabel(therapy);
    },

    //	C25346
    negVerifyInvalidPatientWeight: () => {
      inputChecker.nextButtonCheck('be.disabled')
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/patient_weight-input"]', regressionInput.collection.zeroValue, 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/patient_weight-input"]', regressionInput.collection.invalidweight, 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/patient_weight-input"]', regressionInput.collection.decimalWeight, 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[data-testid="#/properties/patient_weight-input"]', regressionInput.collection.moreDigitValue, 'be.disabled');
      inputHelpers.inputSingleField('[data-testid="#/properties/patient_weight-input"]', regressionInput.collection.negativeValue);
      inputChecker.checkValue('[data-testid="#/properties/patient_weight-input"]', regressionInput.collection.positiveValue);
      inputChecker.nextButtonCheck('not.be.disabled');
    }
  },

  bagDataEntryDay1: {
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection', 'arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients');
      col_steps.centralLabelPrinting();
      col_steps.labelShipping();
      col_steps.patientVerification();
      col_steps.collectionBagIdentification();
      col_steps.collectionBagLabel(therapy);
      col_steps.collectionProcedureInformation();
    },

    // C40082
    bagCoiAsEmpty: () => {
      inputHelpers.inputSingleField('[id="#/properties/collected_product_volume-input"]', inputs.collectedProductVolume)
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', inputs.wholeBloodProcessed)
      inputHelpers.inputSingleField('[data-testid="#/properties/anticoagulant_type-input"]', inputs.anticoagulantType)
      inputHelpers.inputSingleField('[id="#/properties/anticoagulant_volume-input"]', inputs.anticoagulantVolume)
      inputHelpers.inputSingleField('[id="collection_start_time"]', inputs.collectionStartTime)
      inputHelpers.inputSingleField('[id="collection_end_time"]', inputs.collectionEndTime)
      inputChecker.nextButtonCheck('be.disabled')
    },

    // C40083
    invalidProductVolume: () => {
      cy.get(`@coi`).then(coi => {
        inputHelpers.scanAndVerifyCoi('bag-1-identifier', `${coi}-APH-01`)
      })
      inputChecker.clearValueAndCheckForButton('[id="#/properties/collected_product_volume-input"]', 'be.disabled')
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/collected_product_volume-input"]', regressionInput.collection.zeroValue, 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/collected_product_volume-input"]', regressionInput.collection.decimalVol, 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/collected_product_volume-input"]', regressionInput.collection.moreDigitValue, 'be.disabled');
      inputHelpers.inputSingleField('[id="#/properties/collected_product_volume-input"]', regressionInput.collection.negativeValue)
      inputChecker.checkValue('[id="#/properties/collected_product_volume-input"]', regressionInput.collection.positiveValue)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    // C40084
    invalidBloodProcessed: () => {
      inputChecker.clearValueAndCheckForButton('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', 'be.disabled')
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', regressionInput.collection.zeroValue, 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', regressionInput.collection.moreDigitValue, 'be.disabled');
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', regressionInput.collection.negativeValue)
      inputChecker.checkValue('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', regressionInput.collection.positiveValue)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    // C40085
    anticoagulantTypeAsEmpty: () => {
      inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/anticoagulant_type-input"]', 'be.disabled')
    },

    // C40086
    invalidAnticoagulantVolume: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/anticoagulant_type-input"]', inputs.anticoagulantType)
      inputChecker.clearValueAndCheckForButton('[id="#/properties/anticoagulant_volume-input"]', 'be.disabled')
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/anticoagulant_volume-input"]', regressionInput.collection.zeroValue, 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/anticoagulant_volume-input"]', regressionInput.collection.moreDigitValue, 'be.disabled');
      inputHelpers.inputSingleField('[id="#/properties/anticoagulant_volume-input"]', regressionInput.collection.negativeValue)
      inputChecker.checkValue('[id="#/properties/anticoagulant_volume-input"]', regressionInput.collection.positiveValue)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    // C40087
    invalidStartTime: () => {
      inputChecker.clearValueAndCheckForButton('[id="collection_start_time"]', 'be.disabled')
      inputChecker.checkNextButtonWithVariousInputs('[id="collection_start_time"]', regressionInput.collection.invalidTime, 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="collection_start_time"]', regressionInput.collection.incorrectStartTime, 'be.disabled');
    },

    // C40088
    invalidEndTime: () => {
      inputHelpers.inputSingleField('[id="collection_start_time"]', inputs.collectionStartTime)
      inputChecker.clearValueAndCheckForButton('[id="collection_end_time"]', 'be.disabled')
      inputChecker.checkNextButtonWithVariousInputs('[id="collection_end_time"]', regressionInput.collection.invalidTime, 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="collection_end_time"]', regressionInput.collection.incorrectEndTime, 'be.disabled');
    },

    // C40089
    checkForInfoSaved: (scope) => {
      inputHelpers.inputSingleField('[id="collection_end_time"]', inputs.collectionEndTime)
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Patients")
      inputChecker.checkValue('[id="collection_start_time"]', inputs.collectionStartTime)
      inputChecker.checkValue('[id="collection_end_time"]', inputs.collectionEndTime)
      inputChecker.checkValue('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', regressionInput.collection.positiveValue)
      inputChecker.checkValue('[data-testid="#/properties/anticoagulant_type-input"]', inputs.anticoagulantType)
    }
  },

  collectionSummary: {
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection', 'arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients');
      col_steps.centralLabelPrinting();
      col_steps.labelShipping();
      col_steps.patientVerification();
      col_steps.collectionBagIdentification();
      col_steps.collectionBagLabel(therapy);
      col_steps.collectionProcedureInformation();
      cy.get(`@coi`).then(coi => {
        col_steps.bagDataEntryDay(coi);
      });
    },

    // C40090
    posEditButton: () => {
      inputHelpers.clicker('[data-testid="edit-procedure_details"]');
      inputHelpers.inputSingleField('[data-testid="#/properties/patient_weight-input"]', regressionInput.collection.changedWeight);
      inputChecker.reasonForChange()
      inputChecker.checkValue('[data-testid="#/properties/patient_weight-input"]', regressionInput.collection.changedWeight);

      inputHelpers.clicker('[data-testid="edit-bag_1_details"]')
      inputHelpers.inputSingleField('[id="#/properties/anticoagulant_volume-input"]', regressionInput.collection.changedVolume);
      inputChecker.reasonForChange()
      inputChecker.checkValue('[id="#/properties/anticoagulant_volume-input"]', regressionInput.collection.changedVolume);
    },

    // C40091
    checkNextButtonWithAndWithoutSign: () => {
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.checkNextButtonWithAndWithoutSignature('0');;
    }
  },

  confirmChangeOfCustodyArlene:  {
    previousHappyPathSteps: (scope, therapy) => {
      col_steps.centralLabelPrinting(therapy);
      col_steps.labelShipping(therapy);
      col_steps.patientVerification(therapy);
      col_steps.collectionBagIdentification(therapy)
      col_steps.collectionBagLabel(therapy);
      col_steps.collectionProcedureInformation(therapy);
      cy.get(`@coi`).then(coi => {
        col_steps.bagDataEntryDay(coi);
      col_steps.collectionSummary(therapy);
      })
    },
    
    //40069
    negVerifyInvalidBagId: () => {
      inputChecker.nextButtonCheck('be.disabled')
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('bag-1-identifier', coi,'not.be.visible','be.disabled')
      })
    },

    //40071
    posDataOnNext: (scope) => {
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-APH-01`,'not.be.visible','be.disabled')
      })
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      });
      inputChecker.checkDataSavingWithBackButton('be.enabled');
    },
  },

  confirmChangeOfCustodyPhil:  {
    previousHappyPathSteps: (scope, therapy) => {
      col_steps.centralLabelPrinting(therapy);
      col_steps.labelShipping(therapy);
      col_steps.patientVerification(therapy);
      col_steps.collectionBagIdentification(therapy)
      col_steps.collectionBagLabel(therapy);
      col_steps.collectionProcedureInformation(therapy);
      cy.get(`@coi`).then(coi => {
        col_steps.bagDataEntryDay(coi);
      col_steps.collectionSummary(scope, therapy);
      col_steps.changeOfCustody(coi);
      cy.openOrder('collection','phil')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
    })
    },

    //40073
    negVerifyInvalidBagId: () => {
      inputChecker.nextButtonCheck('be.disabled')
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyCheck('bag-1-identifier', coi,'not.be.visible','be.disabled')
     
      })
    },

    //40074
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

    //40075
    posDataOnNext: () => {
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      });
      inputChecker.checkDataSavingWithBackButton('be.enabled');
    },
  },

  cryopreservationLabels: {
    previousHappyPathSteps: (scope, therapy) => {
      col_steps.centralLabelPrinting(therapy);
      col_steps.labelShipping(therapy);
      col_steps.patientVerification(therapy);
      col_steps.collectionBagIdentification(therapy)
      col_steps.collectionBagLabel(therapy);
      col_steps.collectionProcedureInformation(therapy);
      cy.get(`@coi`).then(coi => {
        col_steps.bagDataEntryDay(coi);
      col_steps.collectionSummary(scope, therapy);
      col_steps.changeOfCustody(coi);
      cy.openOrder('collection','phil')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      col_steps.confirmChangeOfCustody(coi)
    })
    },

    //40077
    verifyNumberOfBagsEmpty: () => {
      inputChecker.nextButtonCheck('be.disabled')
    },

    //40078
    posSaveAndClose: (scope) => {
      inputChecker.inputSingleFieldCheck('[id="#/properties/item_count-input"]', '1', 'be.enabled' )
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled","Patients")
    },

    //40080
    posDataOnNext: () => {
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      });
      inputChecker.checkDataSavingWithBackButton('be.enabled');
    },
  },

  shipperLabels: {
    previousHappyPathSteps: (scope, therapy) => {
      col_steps.centralLabelPrinting(therapy);
      col_steps.labelShipping(therapy);
      col_steps.patientVerification(therapy);
      col_steps.collectionBagIdentification(therapy)
      col_steps.collectionBagLabel(therapy);
      col_steps.collectionProcedureInformation(therapy);
      cy.get(`@coi`).then(coi => {
        col_steps.bagDataEntryDay(coi);
      col_steps.collectionSummary(scope, therapy);
      col_steps.changeOfCustody(coi);
      cy.openOrder('collection','phil')
      cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
      col_steps.confirmChangeOfCustody(coi)
      col_steps.confirmNumberofBags()
    })
    },

    //25785
    checkboxNeg: () => {
      inputChecker.clickOnCheck('[id="#/properties/data/properties/is_confirmed"]',"be.disabled");
      inputChecker.nextButtonCheck('be.disabled');
    },

    //25786
    saveAndCloseButtonPositive: (scope) => {
      cy.get(`@coi`).then(coi => { 
        inputHelpers.inputSingleField('[data-testid="bag-identifier-1-input"]', `${coi}-PRC-01` );
        inputHelpers.clicker('[data-testid="bag-identifier-1-button"]')
        inputHelpers.inputSingleField('[data-testid="cassette-1-input"]', `${coi}-PRC-01`);
        inputHelpers.clicker('[data-testid="cassette-1-button"]')
      })
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients")
    },

    //40093
    retainsValueUponClickingNext: () => {
      inputChecker.checkForTheInfoSavedClickingNextAndBack()
    },
  },

  collectionBagStorage: {
    previousHappyPathSteps: (scope, therapy) => {
      cy.get(`@coi`).then(coi => {
        col_steps.centralLabelPrinting(therapy);
        col_steps.labelShipping();
        col_steps.patientVerification(therapy);
        col_steps.collectionBagIdentification(therapy);
        col_steps.collectionBagLabel(therapy);
        col_steps.collectionProcedureInformation();
        col_steps.bagDataEntryDay(coi);
        col_steps.collectionSummary(scope, therapy);
        col_steps.changeOfCustody(coi);
      });
      cy.openOrder('collection', 'phil')
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      cy.get(`@coi`).then(coi => {
        col_steps.confirmChangeOfCustody(coi);
        col_steps.confirmNumberofBags();
        col_steps.shipperLabels(coi, therapy);
      });
  },
  coiBagIdentifierOnBagNeg: () => {
    // C25787
    inputChecker.nextButtonCheck('be.disabled');
  },
  checkSaveAndClose: (scope) => {
    // C25788
    cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyMultiplePos('bag-identifier-1', coi+`-PRC-0${1}`,"be.visible")
    });
    inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients")
  }
  
  
},

  cryopreservationData: {
    previousHappyPathSteps: (scope, therapy) => {
      cy.get(`@coi`).then(coi => {
        col_steps.centralLabelPrinting(therapy);
        col_steps.labelShipping();
        col_steps.patientVerification(therapy);
        col_steps.collectionBagIdentification(therapy);
        col_steps.collectionBagLabel(therapy);
        col_steps.collectionProcedureInformation();
        col_steps.bagDataEntryDay(coi);
        col_steps.collectionSummary(scope, therapy);
        col_steps.changeOfCustody(coi);
      });
      cy.openOrder('collection', 'phil')
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      cy.get(`@coi`).then(coi => {
        col_steps.confirmChangeOfCustody(coi);
        col_steps.confirmNumberofBags();
        col_steps.shipperLabels(coi, therapy);
        col_steps.collectionBagStorage(coi);
      });
  },
  coiBagIdentifierOnBagNeg: () => {
    // C25796
    inputChecker.nextButtonCheck('be.disabled');
  },
  totalCellFieldNeg: () =>{
    // C25797
    cy.get(`@coi`).then(coi => { 
      inputChecker.scanAndVerifyMultiplePos("bag-identifier-1",coi+`-PRC-0${1}`,"be.visible")
    })
    inputChecker.clearValueAndCheckForButton('[id="#/properties/custom_fields/properties/total_cells-input"]','be.disabled')
    inputChecker.inputSingleFieldCheck('[id="#/properties/custom_fields/properties/total_cells-input"]',regressionInput.collection.negVolume,'be.disabled');
  },
  productVolumeNeg: () =>{
    // C25798
    inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/total_cells-input"]', inputs.totalCells)
    inputChecker.clearValueAndCheckForButton('[id="#/properties/product_volume-input"]','be.disabled')
    inputChecker.inputSingleFieldCheck('[id="#/properties/product_volume-input"]',regressionInput.collection.negVolume,'be.disabled');
  },
  saveAndCloseButtonPositive: (scope) => {
    // C25799
    inputHelpers.inputSingleField('[id="#/properties/product_volume-input"]', inputs.productVolume)
    inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/total_cells-input"]', inputs.totalCells)
    inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients")
  }
  },

  cryopreservationSummary: {
  previousHappyPathSteps: (scope, therapy) => {
      cy.get(`@coi`).then(coi => {
        col_steps.centralLabelPrinting(therapy);
        col_steps.labelShipping();
        col_steps.patientVerification(therapy);
        col_steps.collectionBagIdentification(therapy);
        col_steps.collectionBagLabel(therapy);
        col_steps.collectionProcedureInformation();
        col_steps.bagDataEntryDay(coi);
        col_steps.collectionSummary(scope, therapy);
        col_steps.changeOfCustody(coi);
      });
      cy.openOrder('collection', 'phil')
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      cy.get(`@coi`).then(coi => {
        col_steps.confirmChangeOfCustody(coi);
        col_steps.confirmNumberofBags();
        col_steps.shipperLabels(coi, therapy);
        col_steps.collectionBagStorage(coi);
        col_steps.cryopreservationDataLocal(coi);

      });
  },
  posEditButton: () => { 
    //C25800
    inputHelpers.clicker('[data-testid="edit-cryopreservation_data"]')
    inputHelpers.inputSingleField('[id="#/properties/product_volume-input"]', regressionInput.collection.changedVolume)
    inputChecker.reasonForChange()
    inputChecker.checkValue('[id="#/properties/product_volume-input"]',regressionInput.collection.changedVolume)
},

checkNextButtonWithAndWithoutSig: () => {
    //C25800
    inputChecker.checkNextButtonWithAndWithoutSignature('1')
},
checkSaveandClose: (scope) => {
  // C25802
  inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients")
}
  
  },

  bagSelection: {
    previousHappyPathSteps: (scope, therapy) => {
      col_steps.centralLabelPrinting(therapy)
      col_steps.labelShipping(therapy)
      col_steps.patientVerification(therapy)
      col_steps.collectionBagIdentification(therapy)
      col_steps.collectionBagLabel(therapy)
      col_steps.collectionProcedureInformation(therapy)
      cy.get(`@coi`).then(coi => {
        col_steps.bagDataEntryDay(coi)
        col_steps.collectionSummary(scope, therapy)
        col_steps.changeOfCustody(coi);
        cy.openOrder('collection','phil')
        cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
        col_steps.confirmChangeOfCustody(coi)
        col_steps.confirmNumberofBags()
        col_steps.shipperLabels(coi, therapy)
        col_steps.collectionBagStorage(coi)
        col_steps.cryopreservationData(coi)
        col_steps.cryopreservationSummary(scope)
      })
    },

    //C25818
    noShipmentIsSelected: () => {
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C25819
    doNOtShipOptionSelected: () => {
      inputHelpers.clicker('[data-testid="fail-button-0"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C25820
    saveAndClose: () => {
      inputHelpers.clicker('[data-testid="pass-button-0"]')
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Patients")
      })
    }
  },

  transferProductToShipper: {
    previousHappyPathSteps: (scope, therapy) => {
      col_steps.centralLabelPrinting(therapy)
      col_steps.labelShipping(therapy)
      col_steps.patientVerification(therapy)
      col_steps.collectionBagIdentification(therapy)
      col_steps.collectionBagLabel(therapy)
      col_steps.collectionProcedureInformation(therapy)
      cy.get(`@coi`).then(coi => {
        col_steps.bagDataEntryDay(coi)
        col_steps.collectionSummary(scope, therapy)
        col_steps.changeOfCustody(coi);
        cy.openOrder('collection','phil')
        cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
        col_steps.confirmChangeOfCustody(coi)
        col_steps.confirmNumberofBags()
        col_steps.shipperLabels(coi, therapy)
        col_steps.collectionBagStorage(coi)
        col_steps.cryopreservationData(coi)
        col_steps.cryopreservationSummary(scope)
        col_steps.cryopreservationBagSelection()
      })
    },

    //C25803
    coiBagEmpty: () => {
      inputHelpers.clicker(['[data-testid="pass-button-case_intact_1"]', '[data-testid="pass-button-temp_out_of_range_1"]',
                            '[data-testid="pass-button-ambient_temperature_exposure"]', '[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]'])
      inputChecker.checkState('[data-testid="cassette-1-button"]', 'be.disabled')               
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C25804
    coiLN2ShipperEmpty: () => {
      inputChecker.checkState('[data-testid="ln-2-shipper-1-button"]', 'be.disabled')               
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40682
    checkConfirmButtonForCoiBag: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.inputStringValue('[data-testid="cassette-1-input"]', `${coi}-PRC-01`)
        inputChecker.checkState('[data-testid="cassette-1-button"]', 'not.be.disabled')
        inputChecker.scanAndVerifyMultiplePos('cassette-1', `${coi}-PRC-01`, 'be.visible')
      })
    },

    //C40683
    checkConfirmButtonForLN2Shipper: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.inputStringValue('[data-testid="ln-2-shipper-1-input"]', coi)  
        inputChecker.checkState('[data-testid="ln-2-shipper-1-button"]', 'not.be.disabled')
        inputChecker.scanAndVerifyMultiplePos('ln-2-shipper-1', coi, 'be.visible')
      })
    },

    //C40795
    caseIntactToggleNotSelected: () => {
      inputHelpers.clicker('[data-testid="pass-button-case_intact_1"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40796
    caseIntactSelectNoToggle: () => {
      inputHelpers.clicker('[data-testid="fail-button-case_intact_1"]')
      inputChecker.detailsBoxForToggle('[id="#/properties/shipping_checklist/properties/case_intact_1_reason-input"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40797
    caseIntactWithFillDetailsField: () => {
      inputChecker.inputStringValue('[id="#/properties/shipping_checklist/properties/case_intact_1_reason-input"]', 'Some reason')
      inputChecker.nextButtonCheck('not.be.disabled')
      inputHelpers.clicker('[data-testid="pass-button-case_intact_1"]')
    },

    //C40798
    tempOutOfRangeNotselected: () => {
      inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40799
    tempOutOfRangeSelectNoToggle: () => {
      inputHelpers.clicker('[data-testid="fail-button-temp_out_of_range_1"]')
      inputChecker.detailsBoxForToggle('[id="#/properties/shipping_checklist/properties/temp_out_of_range_1_reason-input"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40800
    tempOutOfRangeWithFillDetailsField: () => {
      inputChecker.inputStringValue('[id="#/properties/shipping_checklist/properties/temp_out_of_range_1_reason-input"]', 'Some reason')
      inputChecker.nextButtonCheck('not.be.disabled')
      inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"]')
    },

    //C40801
    ambientTemperatureNotSelected: () => {
      inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40802
    ambientTemperatureSelectNoToggle: () => {
      inputHelpers.clicker('[data-testid="fail-button-ambient_temperature_exposure"]')
      inputChecker.detailsBoxForToggle('[id="#/properties/shipping_checklist/properties/ambient_temperature_exposure_reason-input"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40803
    ambientTemperatureWithFillDetailsField: () => {
      inputChecker.inputStringValue('[id="#/properties/shipping_checklist/properties/ambient_temperature_exposure_reason-input"]', 'Some reason')
      inputChecker.nextButtonCheck('not.be.disabled')
      inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"]')    
    },

    //C40804
    tamperSealNotSelected: () => {
      inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40805
    amperSealSelectNoToggle: () => {
      inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_seal_labeled_rack"]')
      inputChecker.detailsBoxForToggle('[id="#/properties/shipping_checklist/properties/red_wire_tamper_seal_labeled_rack_reason-input"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40806
    amperSealWithFillDetailsField: () => {
      inputChecker.inputStringValue('[id="#/properties/shipping_checklist/properties/red_wire_tamper_seal_labeled_rack_reason-input"]', 'Some reason')
      inputChecker.nextButtonCheck('not.be.disabled')
      inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]')   
    },

    //C25809
    saveAndClose: (scope) => {
        inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients")
    }
  },

  shipmentChecklist: {
    previousHappyPathSteps: (scope, therapy) => {
      col_steps.centralLabelPrinting(therapy)
      col_steps.labelShipping(therapy)
      col_steps.patientVerification(therapy)
      col_steps.collectionBagIdentification(therapy)
      col_steps.collectionBagLabel(therapy)
      col_steps.collectionProcedureInformation(therapy)
      cy.get(`@coi`).then(coi => {
        col_steps.bagDataEntryDay(coi)
        col_steps.collectionSummary(scope, therapy)
        col_steps.changeOfCustody(coi);
        cy.openOrder('collection','phil')
        cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
        col_steps.confirmChangeOfCustody(coi)
        col_steps.confirmNumberofBags()
        col_steps.shipperLabels(coi, therapy)
        col_steps.collectionBagStorage(coi)
        col_steps.cryopreservationData(coi)
        col_steps.cryopreservationSummary(scope)
        col_steps.cryopreservationBagSelection()
        col_steps.cryopreservationTransferProductToShipper(coi)
      })
    },

    //C25810
    airwayBillNumberEmpty: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_is_id-input"]', inputs.evoLast4Digits)
      inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', inputs.tamperSealNumber)
      inputHelpers.clicker(['[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire"]', '[data-testid="pass-button-tamper_seal_match"]',
                            '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]'])
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40868
    checkConfirmButtonEnabled: (scope) => {
      inputHelpers.inputSingleField('[data-testid="collection-airway-bill-input-field"]', 'abcdef')
      inputChecker.checkState('[data-testid="collection-airway-bill-action-trigger-button"]', 'not.be.disabled')
      getCollAirWayBill(scope.patientInformation.subjectNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_is_id-input"]', inputs.evoLast4Digits)
      inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', inputs.tamperSealNumber)
      inputHelpers.clicker(['[data-testid="pass-button-evo_airway_bill"]', '[data-testid="pass-button-red_wire"]', '[data-testid="pass-button-tamper_seal_match"]',
                            '[data-testid="pass-button-shipper_label_placed"]', '[data-testid="pass-button-consignee_kit_pouch_inside"]', '[data-testid="pass-button-zip_ties_secured"]'])
    },

    //C40869
    evoIsNumberEmpty: () => {
      inputChecker.clearField('[id="#/properties/shipping_checklist/properties/evo_is_id-input"]')
      inputChecker.nextButtonCheck('be.disabled')
    },
 
    //C40870
    evoAirwayBillNotSelected: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_is_id-input"]', inputs.evoLast4Digits)
      inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40871
    evoAirwayBillSelectNoToggle: () => {
      inputHelpers.clicker('[data-testid="fail-button-evo_airway_bill"]')
      inputChecker.detailsBoxForToggle('[id="#/properties/shipping_checklist/properties/evo_airway_bill_reason-input"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40872
    evoAirwayBillWithFillDetailsField: () => {
      inputChecker.inputStringValue('[id="#/properties/shipping_checklist/properties/evo_airway_bill_reason-input"]', inputs.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
      inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]')
    },

    //C40882
    redWireTamperNotSelected: () => {
      inputHelpers.clicker('[data-testid="pass-button-red_wire"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40883
    redWireTamperSelectNoToggle: () => {
      inputHelpers.clicker('[data-testid="fail-button-red_wire"]')
      inputChecker.detailsBoxForToggle('[id="#/properties/shipping_checklist/properties/red_wire_reason-input"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40884
    redWireTamperWithFillDetailsField: () => {
      inputChecker.inputStringValue('[id="#/properties/shipping_checklist/properties/red_wire_reason-input"]', inputs.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
      inputHelpers.clicker('[data-testid="pass-button-red_wire"]')
    },

    //C40897
    tamperSealNumberEmpty: () => {
      inputChecker.clearField('[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40885
    tamperSealNotSelected: () => {
      inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', inputs.evoLast4Digits)
      inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40886
    tamperSealSelectNoToggle: () => {
      inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]')
      inputChecker.detailsBoxForToggle('[id="#/properties/shipping_checklist/properties/tamper_seal_match_reason-input"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40887
    tamperSealWithFillDetailsField: () => {
      inputChecker.inputStringValue('[id="#/properties/shipping_checklist/properties/tamper_seal_match_reason-input"]', inputs.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
      inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
    },

    //C40888
    shipperLabelNotSelected: () => {
      inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40889
    shipperLabelSelectNoToggle: () => {
      inputHelpers.clicker('[data-testid="fail-button-shipper_label_placed"]')
      inputChecker.detailsBoxForToggle('[id="#/properties/shipping_checklist/properties/shipper_label_placed_reason-input"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40890
    shipperLabelWithFillDetailsField: () => {
      inputChecker.inputStringValue('[id="#/properties/shipping_checklist/properties/shipper_label_placed_reason-input"]', inputs.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
      inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]')
    },

    //C40890
    consigneeKitNotSelected: () => {
      inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40892
    consigneeKitSelectNoToggle: () => {
      inputHelpers.clicker('[data-testid="fail-button-consignee_kit_pouch_inside"]')
      inputChecker.detailsBoxForToggle('[id="#/properties/shipping_checklist/properties/consignee_kit_pouch_inside_reason-input"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40893
    consigneeKitWithFillDetailsField: () => {
      inputChecker.inputStringValue('[id="#/properties/shipping_checklist/properties/consignee_kit_pouch_inside_reason-input"]', inputs.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
      inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]')
    },

    //C40894
    zipTiesNotSelected: () => {
      inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40895
    zipTiesSelectNoToggle: () => {
      inputHelpers.clicker('[data-testid="fail-button-zip_ties_secured"]')
      inputChecker.detailsBoxForToggle('[id="#/properties/shipping_checklist/properties/zip_ties_secured_reason-input"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    //C40896
    zipTiesWithFillDetailsField: () => {
      inputChecker.inputStringValue('[id="#/properties/shipping_checklist/properties/zip_ties_secured_reason-input"]', inputs.reason)
      inputChecker.nextButtonCheck('not.be.disabled')
      inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]')
    },

    //C25817
    saveAndCloseShipment: (scope) => {
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Patients")
    }
  },

  cryopreservationShippingSummary: {
    previousHappyPathSteps: (scope, therapy) => {
      col_steps.centralLabelPrinting(therapy)
      col_steps.labelShipping(therapy)
      col_steps.patientVerification(therapy)
      col_steps.collectionBagIdentification(therapy)
      col_steps.collectionBagLabel(therapy)
      col_steps.collectionProcedureInformation(therapy)
      cy.get(`@coi`).then(coi => {
        col_steps.bagDataEntryDay(coi)
        col_steps.collectionSummary(scope, therapy)
        col_steps.changeOfCustody(coi);
        cy.openOrder('collection','phil')
        cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
        col_steps.confirmChangeOfCustody(coi)
        col_steps.confirmNumberofBags()
        col_steps.shipperLabels(coi, therapy)
        col_steps.collectionBagStorage(coi)
        col_steps.cryopreservationData(coi)
        col_steps.cryopreservationSummary(scope)
        col_steps.cryopreservationBagSelection()
        col_steps.cryopreservationTransferProductToShipper(coi)
        col_steps.cryopreservationShipmentChecklist(scope, therapy)
      })
    },

    posEditButton: () => {
      inputHelpers.clicker('[data-testid="edit-transfer_product_to_shipper"]')
      inputHelpers.clicker('[data-testid="fail-button-case_intact_1"]')
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/case_intact_1_reason-input"]',regressionInput.collection.additionalComments)
      inputChecker.reasonForChange()
      inputChecker.checkLabelAfterNext(
        '[data-test-id="collection_shipping_summary"]',
        '[data-testid="txt-field-layout-Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact your Janssen Cell Therapy Coordinator.-answer"]',
        'No'
      )
    }
  }
}
