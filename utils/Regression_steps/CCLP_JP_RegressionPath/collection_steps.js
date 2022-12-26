import common from '../../../support/index'
import assertions from '../../../fixtures/assertions.json'
import inputs from '../../../fixtures/inputs.json'
import dayjs from 'dayjs';
import collectionAssertion from '../../../fixtures/collectionAssertions.json'
import translationHelpers from '../../shared_block_helpers/translationHelpers.js'
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers'
import regressionInput from '../../../fixtures/inputsRegression.json'
import col_steps from '../../../utils/HappyPath_steps/CCLP_JP_HappyPath/collection_steps';
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";
import therapy from '../../../fixtures/therapy.json'

const todaysDate = dayjs().format('DD-MMM-YYYY')

export const getCollAirWayBill = (scope, testId) => {
  common.loginAs('oliver')
  cy.visit('/ordering')
  cy.get('td[data-testid="patient-identifier"]')
    .contains(scope.patientInformation.subjectNumber)
    .click()
  cy.get('[data-testid="td-stage-plane-icon"]')
    .eq(0)
    .parent()
    .parent()
    .parent()
    .find('[data-testid="td-stage-site-details"]')
    .invoke('text')
    .then((text) => {
      scope.airWayBill = text.substring(9, text.length)
      common.loginAs('phil')
      cy.visit('/collection')
      cy.wait(3000)
      common.loadCollection()
      inputHelpers.clicker(`tr[data-testid="treatment-${scope.coi}"]`)
      if (testId) {
        inputHelpers.inputSingleField(`[data-testid="${testId}"]`, scope.airWayBill)
      } else {
        inputHelpers.scanAndVerifyCoi('collection-airway-bill', scope.airWayBill)
      }
      cy.wait(1000)
      cy.log('collectionAirwayBill', scope.airWayBill)
    })
}

export default {

  patientVerification: {
    previousHappyPathSteps: (scope) => {
      cy.openOrder('collection', 'arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
    },

    nextButtonPos: () => {
      //C31595
      inputChecker.nextButtonCheck('be.disabled')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.nextButtonCheck('be.disabled')
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], inputs.verifier[0])
      inputChecker.nextButtonCheck('not.be.disabled')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      })
    },
  },

  collectionBagIdentification: {
    previousHappyPathSteps: (scope) => {
      cy.openOrder('collection', 'arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      col_steps.patientVerification();
    },

    apheresisDateEmpty: () => {
      //C41063
      inputHelpers.clicker('[id="#/properties/custom_fields/properties/pre_collection_label_applied"]')
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/din_entry-input"]', inputs.din)
      inputChecker.nextButtonCheck('be.disabled')
    },

    apheresisDateFutureNeg: () => {
      //C41061
      inputChecker.inputDateFieldCheck("[id*='#/properties/apheresis_date-input']", regressionInput.collection.apheresisDateFuture, 'be.disabled')
    },

    apheresisDatePos: () => {
      //C41062	
      inputChecker.inputDateFieldCheck("[id*='#/properties/apheresis_date-input']", todaysDate, 'not.be.disabled')
    },

    apheresisIdNeg: () => {
      //C41059	
      inputChecker.clearValueAndCheckForButton('[data-testid="#/properties/custom_fields/properties/din_entry-input"]', 'be.disabled')
    },

    isSiteLabelsAppliedNeg: () => {
      //C41060
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/din_entry-input"]', inputs.din)
      inputHelpers.clicker('[id="#/properties/custom_fields/properties/pre_collection_label_applied"]')
      inputChecker.nextButtonCheck('be.disabled')

    },

    checkForInfoSaved: () => {
      // C41064	
      inputHelpers.clicker('[id="#/properties/custom_fields/properties/pre_collection_label_applied"]')
      inputChecker.checkForTheInfoSavedClickingNextAndBack();
      inputChecker.nextButtonCheck('not.be.disabled');
    }
  },

  collectionBagLabelPrinting: {
    previousHappyPathSteps: (scope) => {
      cy.openOrder('collection', 'arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      col_steps.patientVerification()
      col_steps.collectionBagIdentification()
    },

    printLablesClickable: () => {
      // C31578
      inputChecker.nextButtonCheck('be.disabled')
      inputChecker.popupMessageVisible('btn-print', 'banner-container-0')
    },

    confirmPrintLabelNeg: () => {
      // C31579	
      inputHelpers.clicker('[id="#/properties/data/properties/is_verified"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    verifyApplyLabelNeg: () => {
      // C31580
      cy.reload();
      inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]')
      inputChecker.nextButtonCheck('be.disabled')
    },

    checkForInfoSaved: (scope) => {
      // C31581	
      cy.reload();
      inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]')
      inputHelpers.clicker('[id="#/properties/data/properties/is_verified"]')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      })
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Patients")
      inputChecker.nextButtonCheck('not.be.disabled')
    }
  },

  collectionProcedureInformation: {
    previousHappyPathSteps: (scope, therapy) => {
      cy.openOrder('collection', 'arlene')
      cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
      col_steps.patientVerification();
      col_steps.collectionBagIdentification();
      col_steps.collectionBagLabel(therapy);
    },


    verifyInvalidPatientWait: () => {
      //  C41089
      inputChecker.nextButtonCheck('be.disabled')
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/patient_weight-input"]', regressionInput.collection.zeroValue, 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/patient_weight-input"]', regressionInput.collection.invalidweight, 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/patient_weight-input"]', regressionInput.collection.decimalWeight, 'be.disabled');
      inputChecker.checkNextButtonWithVariousInputs('[id="#/properties/patient_weight-input"]', regressionInput.collection.moreDigitValue, 'be.disabled');
      inputHelpers.inputSingleField('[id="#/properties/patient_weight-input"]', regressionInput.collection.negativeValue)
      inputChecker.checkValue('[id="#/properties/patient_weight-input"]', regressionInput.collection.positiveValue)
      inputChecker.nextButtonCheck('not.be.disabled')
    }
  },



}