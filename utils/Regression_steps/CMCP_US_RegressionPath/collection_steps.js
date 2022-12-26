import common from '../../../support/index'
import assertions from '../../../fixtures/assertions.json'
import inputs from '../../../fixtures/inputs.json'
import collectionAssertion from '../../../fixtures/collectionAssertions.json'
import translationHelpers from '../../shared_block_helpers/translationHelpers.js'
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers'
import col_steps from '../../../utils/HappyPath_steps/CMCP_US_HappyPath/collection_steps';
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";
import regressionInput from '../../../fixtures/inputsRegression.json';
// import therapies from "../fixtures/therapy.json";


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

  collectionBagLabel: {
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection', 'arlene');
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients');
      col_steps.centralLabelPrinting(therapy);
      col_steps.labelShipping();
      col_steps.patientVerification();
      col_steps.collectionBagIdentification();
    },

    //C25761
    nextButtonDisabled: () => {
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C25762
    saveAndClose: (scope) => {
      inputHelpers.clicker('[id="#/properties/data/properties/is_verified"]');
      inputChecker.nextButtonCheck('not.be.disabled');
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Patients");
      inputChecker.nextButtonCheck('not.be.disabled');
    },

    //C25763
    retainSignature: (scope) => {
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature']);
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Patients");
      inputChecker.nextButtonCheck('not.be.disabled');
    },
  },

  collectionProcedureInformation: {
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection', 'arlene');
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients');
      col_steps.centralLabelPrinting(therapy);
      col_steps.labelShipping();
      col_steps.patientVerification();
      col_steps.collectionBagIdentification();
      col_steps.collectionBagLabel(therapy);
    },

    //C25554
    nextButonDisabledForPatientWeight: () => {
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C25553
    verifyInvalidPatientWeight: () => {
      inputChecker.nextButtonCheck('be.disabled')
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/patient_weight-input"]', regressionInput.collection.zeroValue, 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/patient_weight-input"]', regressionInput.collection.invalidweight, 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/patient_weight-input"]', regressionInput.collection.decimalWeight, 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/patient_weight-input"]', regressionInput.collection.moreDigitValue, 'be.disabled');
      inputHelpers.inputSingleField('[id="#/properties/patient_weight-input"]', regressionInput.collection.negativeValue);
      inputChecker.checkValue('[id="#/properties/patient_weight-input"]', regressionInput.collection.positiveValue);
      inputChecker.nextButtonCheck('not.be.disabled');
    }
  },

  bagDataEntry: {
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection', 'arlene');
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients');
      col_steps.centralLabelPrinting(therapy);
      col_steps.labelShipping();
      col_steps.patientVerification();
      col_steps.collectionBagIdentification();
      col_steps.collectionBagLabel(therapy);
      col_steps.collectionProcedureInformation();
    },

    //C25558
    coiBagEmpty: () => {
      inputHelpers.inputSingleField('[id="#/properties/collected_product_volume-input"]', inputs.collectedProductVolume);
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', inputs.wholeBloodProcessed);
      inputHelpers.inputSingleField('[data-testid="#/properties/anticoagulant_type-input"]', inputs.anticoagulantType);
      inputHelpers.inputSingleField('[id="#/properties/anticoagulant_volume-input"]', inputs.anticoagulantVolume);
      inputHelpers.inputSingleField('[id="collection_start_time"]', inputs.collectionStartTime);
      inputHelpers.inputSingleField('[id="collection_end_time"]', inputs.collectionEndTime);
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C25558
    bagCoiAsEmpty: () => {
      inputHelpers.inputSingleField('[id="#/properties/collected_product_volume-input"]', inputs.collectedProductVolume);
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', inputs.wholeBloodProcessed);
      inputHelpers.inputSingleField('[data-testid="#/properties/anticoagulant_type-input"]', inputs.anticoagulantType);
      inputHelpers.inputSingleField('[id="#/properties/anticoagulant_volume-input"]', inputs.anticoagulantVolume);
      inputHelpers.inputSingleField('[id="collection_start_time"]', inputs.collectionStartTime);
      inputHelpers.inputSingleField('[id="collection_end_time"]', inputs.collectionEndTime);
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C25559
    invalidProductVolume: () => {
      cy.get(`@coi`).then(coi => {
        inputHelpers.scanAndVerifyCoi('bag-1-identifier', `${coi}-APH-01`);
      })
      inputChecker.clearValueAndCheckForButton('[id="#/properties/collected_product_volume-input"]', 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/collected_product_volume-input"]', regressionInput.collection.zeroValue, 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/collected_product_volume-input"]', regressionInput.collection.decimalVol, 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/collected_product_volume-input"]', regressionInput.collection.moreDigitValue, 'be.disabled');
      inputHelpers.inputSingleField('[id="#/properties/collected_product_volume-input"]', regressionInput.collection.negativeValue);
      inputChecker.checkValue('[id="#/properties/collected_product_volume-input"]', regressionInput.collection.positiveValue);
      inputChecker.nextButtonCheck('not.be.disabled');
    },

    //C25560
    invalidBloodProcessed: () => {
      inputChecker.clearValueAndCheckForButton('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', regressionInput.collection.zeroValue, 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', regressionInput.collection.moreDigitValue, 'be.disabled');
      inputHelpers.inputSingleField('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', regressionInput.collection.negativeValue);
      inputChecker.checkValue('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', regressionInput.collection.positiveValue);
      inputChecker.nextButtonCheck('not.be.disabled');
    },

    //C25561
    anticoagulantTypeAsEmpty: () => {
      inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/anticoagulant_type-input"]', 'be.disabled');
    },

    //C25562
    invalidAnticoagulantVolume: () => {
      inputHelpers.inputSingleField('[data-testid="#/properties/anticoagulant_type-input"]', inputs.anticoagulantType);
      inputChecker.clearValueAndCheckForButton('[id="#/properties/anticoagulant_volume-input"]', 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/anticoagulant_volume-input"]', regressionInput.collection.zeroValue, 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/anticoagulant_volume-input"]', regressionInput.collection.moreDigitValue, 'be.disabled');
      inputHelpers.inputSingleField('[id="#/properties/anticoagulant_volume-input"]', regressionInput.collection.negativeValue);
      inputChecker.checkValue('[id="#/properties/anticoagulant_volume-input"]', regressionInput.collection.positiveValue);
      inputChecker.nextButtonCheck('not.be.disabled');
    },

    //C40970
    invalidStartTime: () => {
      inputChecker.clearValueAndCheckForButton('[id="collection_start_time"]', 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="collection_start_time"]', regressionInput.collection.invalidTime, 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="collection_start_time"]', regressionInput.collection.incorrectStartTime, 'be.disabled');
    },

    //C40971
    invalidEndTime: () => {
      inputHelpers.inputSingleField('[id="collection_start_time"]', inputs.collectionStartTime);
      inputChecker.clearValueAndCheckForButton('[id="collection_end_time"]', 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="collection_end_time"]', regressionInput.collection.invalidTime, 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="collection_end_time"]', regressionInput.collection.incorrectEndTime, 'be.disabled');
    },

    //C25564
    checkForInfoSaved: (scope) => {
      inputHelpers.inputSingleField('[id="collection_end_time"]', inputs.collectionEndTime);
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Patients");
      inputChecker.checkValue('[id="collection_start_time"]', inputs.collectionStartTime);
      inputChecker.checkValue('[id="collection_end_time"]', inputs.collectionEndTime);
      inputChecker.checkValue('[id="#/properties/custom_fields/properties/whole_blood_processed-input"]', regressionInput.collection.positiveValue);
      inputChecker.checkValue('[data-testid="#/properties/anticoagulant_type-input"]', inputs.anticoagulantType);
    }
  },

  collectionSummary: {
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection', 'arlene');
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients');
      col_steps.centralLabelPrinting(therapy);
      col_steps.labelShipping();
      col_steps.patientVerification();
      col_steps.collectionBagIdentification();
      col_steps.collectionBagLabel(therapy);
      col_steps.collectionProcedureInformation();
      cy.get(`@coi`).then(coi => {
        col_steps.bagDataEntryDay(coi);
      })
    },

    //C25565
    posEditButton: () => {
      inputHelpers.clicker('[data-testid="edit-procedure_details"]');
      inputHelpers.inputSingleField('[data-testid="#/properties/patient_weight-input"]', regressionInput.collection.changedWeight);
      inputChecker.reasonForChange();
      inputChecker.checkValue('[data-testid="#/properties/patient_weight-input"]', regressionInput.collection.changedWeight);
      inputHelpers.clicker('[data-testid="edit-bag_1_details"]');
      inputHelpers.inputSingleField('[id="#/properties/anticoagulant_volume-input"]', regressionInput.collection.changedVolume);
      inputChecker.reasonForChange();
      inputChecker.checkValue('[id="#/properties/anticoagulant_volume-input"]', regressionInput.collection.changedVolume);
    },

    //C25566
    checkNextButtonWithAndWithoutSig: () => {
      inputChecker.nextButtonCheck('be.disabled');
      cy.get(`[data-testid="primary-button-action"]`).should('be.disabled');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature']);
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], inputs.verifier[0]);
      cy.get(`[data-testid="primary-button-action"]`).should('not.be.disabled');
    },

    //C25567
    checkPrintButtonEnbaled: () => {
      inputChecker.checkState('[name="print"]', 'not.be.disabled');
    }
  },

  confirmChangeOfCustodyArlene: {
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection', 'arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      col_steps.centralLabelPrinting();
      col_steps.labelShipping();
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
      //C25569
      inputChecker.nextButtonCheck('be.disabled')
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('bag-1-identifier', coi, 'not.be.visible', 'be.disabled')
        inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-FP-01`, 'not.be.visible', 'be.disabled')
        inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-PRC-01`, 'not.be.visible', 'be.disabled')
      })
    },

    posCheckNextButtonWithAndWithoutSig: () => {
      // C25570
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-APH-01`, 'be.visible', 'not.be.disabled')
      });
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
      inputChecker.nextButtonCheck('be.disabled')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.nextButtonCheck('be.enabled');
    },

    posDataOnNext: (scope) => {
      // C41003
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      });
      common.loadCollection();
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients', 'be.enabled')
      inputChecker.checkDataSavingWithBackButton('be.enabled');
    }
  },

  confirmChangeOfCustodyPhil: {
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection', 'arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      col_steps.centralLabelPrinting();
      col_steps.labelShipping();
      col_steps.patientVerification();
      col_steps.collectionBagIdentification();
      col_steps.collectionBagLabel(therapy);
      col_steps.collectionProcedureInformation();
      cy.get(`@coi`).then(coi => {
        col_steps.bagDataEntryDay(coi);
        col_steps.collectionSummary(scope, therapy);
        col_steps.changeOfCustody(coi);

        cy.openOrder('collection', 'phil')
        cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      })
    },

    negVerifyInvalidBagId: () => {
      // C25572
      inputChecker.nextButtonCheck('be.disabled')
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('bag-1-identifier', coi, 'not.be.visible', 'be.disabled')
        inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-FP-01`, 'not.be.visible', 'be.disabled')
        inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-PRC-01`, 'not.be.visible', 'be.disabled')
      })
    },

    posCheckNextButtonWithAndWithoutSig: () => {
      // C25573
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('bag-1-identifier', `${coi}-APH-01`, 'be.visible', 'not.be.disabled')
      });
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
      inputChecker.nextButtonCheck('be.disabled')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.nextButtonCheck('be.enabled');
    },

    posDataOnNext: () => {
      // C41004
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      });
      inputChecker.checkDataSavingWithBackButton('be.enabled');
    },
  },

  collectionTransferProductToShipper: {
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection', 'arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      col_steps.centralLabelPrinting();
      col_steps.labelShipping();
      col_steps.patientVerification(therapy);
      col_steps.collectionBagIdentification(therapy);
      col_steps.collectionBagLabel(therapy);
      col_steps.collectionProcedureInformation(therapy);
      cy.get(`@coi`).then(coi => {
        col_steps.bagDataEntryDay(coi, therapy);
        col_steps.collectionSummary(scope, therapy);
        col_steps.changeOfCustody(coi, therapy);
      })
      cy.openOrder('collection', 'phil')
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      cy.get(`@coi`).then(coi => {
        col_steps.confirmChangeOfCustody(coi);
      })
    },

    negCoi: () => {
      // C25574
      inputChecker.nextButtonCheck('be.disabled')
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-cmcp-us', `${coi}-PRC-01`, 'not.be.visible', 'be.disabled')
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-cmcp-us', `${coi}-FP-01`, 'not.be.visible', 'be.disabled')
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-cmcp-us', `${coi}-APH-01`, 'not.be.visible', 'be.disabled')
      })
    },

    saveAndClosePos: (scope) => {
      // C25575
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-cmcp-us', `${coi}`, 'be.visible', 'not.be.disabled')
        inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Patients")
        inputChecker.nextButtonCheck('not.be.disabled')
      })
    },

    posDataOnNext: () => {
      // C41005
      inputChecker.checkDataSavingWithBackButton('be.enabled');
      inputChecker.checkGreenCheckMarkVisibilityForScanAndVerify();
    },
  },

  shipmentChecklist: {
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection', 'arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      col_steps.centralLabelPrinting();
      col_steps.labelShipping();
      col_steps.patientVerification(therapy);
      col_steps.collectionBagIdentification(therapy);
      col_steps.collectionBagLabel(therapy);
      col_steps.collectionProcedureInformation(therapy);
      cy.get(`@coi`).then(coi => {
        col_steps.bagDataEntryDay(coi, therapy);
        col_steps.collectionSummary(scope, therapy);
        col_steps.changeOfCustody(coi, therapy);
      })
      cy.openOrder('collection', 'phil')
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      cy.get(`@coi`).then(coi => {
        col_steps.confirmChangeOfCustody(coi);
        col_steps.collectionTransferProductToShipper(scope.coi, "ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-cmcp-us");
      })
    },

    airWaybillEmpty: () => {
      // C25577
      inputHelpers.clicker('[data-testid=pass-button-idm_placed_into_shipper]')
      inputHelpers.clicker('[data-testid="pass-button-apheresis_not_exposed"]')
      inputHelpers.clicker('[data-testid="pass-button-temperature_monitor_active"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    negApheresisNotExposedToTemp: (scope) => {
      // C25578
      getCollAirWayBill(scope.patientInformation.subjectNumber)
      inputHelpers.clicker('[data-testid="pass-button-idm_placed_into_shipper"]')
      inputChecker.clickOnCheck('[data-testid="pass-button-temperature_monitor_active"]', 'be.disabled')
      inputHelpers.clicker('[data-testid="fail-button-apheresis_not_exposed"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/apheresis_not_exposed_reason-input"]', 'be.visible')
    },

    posApheresisNotExposedToTempNoWithDescription: () => {
      // C25579
      inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-apheresis_not_exposed"]')
    },

    negHasInfectiousDiseaseMarker: () => {
      //C25580
      inputHelpers.clicker('[data-testid="pass-button-apheresis_not_exposed"]')
      inputChecker.clickOnCheck('[data-testid="pass-button-idm_placed_into_shipper"]', 'be.disabled')
      inputHelpers.clicker('[data-testid="fail-button-idm_placed_into_shipper"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/idm_placed_into_shipper_reason-input"]', 'be.visible')

    },

    posHasInfectiousDiseaseMarkerNoWithDescription: () => {
      // C41006
      inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-idm_placed_into_shipper"]')
    },

    negHasTemperatureMonitorActivated: () => {
      // C41007
      inputHelpers.clicker('[data-testid="pass-button-idm_placed_into_shipper"]')
      inputChecker.clickOnCheck('[data-testid="pass-button-temperature_monitor_active"]', 'be.disabled')
      inputHelpers.clicker('[data-testid="fail-button-temperature_monitor_active"]')
      inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/temperature_monitor_active_reason-input"]', 'be.visible')
    },

    posHasTemperatureMonitorActivatedNoWithReason: () => {
      // C41008
      inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-temperature_monitor_active"]')
    },

    checkForDataSaved: (scope) => {
      // C25581
      inputHelpers.clicker('[data-testid="pass-button-temperature_monitor_active"]')
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Patients")
      inputChecker.checkValue('[data-testid=pass-button-idm_placed_into_shipper]', 'true')
      inputChecker.checkValue('[data-testid="pass-button-apheresis_not_exposed"]', 'true')
      inputChecker.checkValue('[data-testid="pass-button-temperature_monitor_active"]', 'true')
    }
  },

  cryopreservationShippingSummary: {

    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection', 'arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      col_steps.centralLabelPrinting();
      col_steps.labelShipping();
      col_steps.patientVerification(therapy);
      col_steps.collectionBagIdentification(therapy);
      col_steps.collectionBagLabel(therapy);
      col_steps.collectionProcedureInformation(therapy);
      cy.get(`@coi`).then(coi => {
        col_steps.bagDataEntryDay(coi, therapy);
        col_steps.collectionSummary(scope, therapy);
        col_steps.changeOfCustody(coi, therapy);
      })
      cy.openOrder('collection', 'phil')
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      cy.get(`@coi`).then(coi => {
        col_steps.confirmChangeOfCustody(coi);
        col_steps.collectionTransferProductToShipper(scope.coi, "ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-cmcp-us");
        col_steps.collectionShipmentChecklist(scope, "", therapy);
      })
    },

    posEditButton: () => {
      // C25582
      inputHelpers.clicker('[data-testid="edit-shipment_checklist"]')
      inputHelpers.clicker('[data-testid="fail-button-apheresis_not_exposed"]')
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/apheresis_not_exposed_reason-input"]', regressionInput.collection.additionalComments)
      inputChecker.reasonForChange()
      inputChecker.checkLabelAfterNext(
        '[data-test-id="collection_shipping_summary"]',
        '[data-testid="txt-field-layout-Confirm MNC, Apheresis was not exposed to ambient temperature greater than 60 minutes.-answer"] >>>>>>:nth(1)',
        'No'
      )
    },

    checkNextButtonWithAndWithoutSignature: () => {
      // C25583
      inputChecker.checkNextButtonWithAndWithoutSignature('1')
    },
  },

}


