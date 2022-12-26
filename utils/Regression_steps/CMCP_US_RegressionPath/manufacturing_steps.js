import common from '../../../support/index.js'
import dayjs from 'dayjs'
import input from '../../../fixtures/inputs.json'
import translationHelpers from '../../shared_block_helpers/translationHelpers'
import manufacturingAssertions from '../../../fixtures/manufacturingAssertions.json'
import therapies from '../../../fixtures/therapy.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers.js'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers.js'
import m_steps from '../../../utils/HappyPath_steps/CMCP_US_HappyPath/manufacturing_steps';
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";
import regressionInput from '../../../fixtures/inputsRegression.json'

const verifier = 'quela@vineti.com'
const date = dayjs()
  .add(1, 'month')
  .add(0, 'days')
  .format('DD-MMM-YYYY')

const getManufAirWayBill = (scope, shippingRow) => {
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
      cy.visit('/manufacturing')
      inputHelpers.clicker(`tr[data-testid="manufacturing-${scope.coi}"]`)

      inputHelpers.scanAndVerifyCoi('manufacturing-airway-bill', scope.airWayBill)
      cy.log('manufacturingAirwayBill', scope.airWayBill)
    })
}

export default {
  manufacturingStart: {
    checkboxNeg: () => {
      // C41085
      inputChecker.nextButtonCheck('be.disabled')
    },

    saveAndClosePos: () => {
      // C36020
      inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]');
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
      })
      inputChecker.nextButtonCheck('be.enabled')
    },
  },

  printFinalProductLabels: {
    previousHappyPathSteps: () => {
      m_steps.manufacturingStart();
      m_steps.manufacturingLotNumber();
      m_steps.manufacturingConfirmExpiryDate();
    },

    PosPrintLabelMessage: () => {
      // C36046	
      inputChecker.nextButtonCheck('be.disabled')
      inputChecker.popupMessageVisible('btn-print', 'banner-container-0')
    },

    confirmPrintLabelNeg: () => {
      // C40945
      inputChecker.nextButtonCheck('be.disabled')
    },

    verifySignaturePos: () => {
      // C40946
      inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]')
      inputChecker.nextButtonCheck('not.be.disabled')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
      //Bug
      //inputChecker.nextButtonCheck('be.disabled')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    saveAndClosePos: () => {
      //C36048
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
      })
    }
  },

  confirmationOfLabelApplication: {
    previousHappyPathSteps: () => {
      m_steps.manufacturingStart();
      m_steps.manufacturingSelectExpiryData();
      m_steps.manufacturingConfirmExpiryData();
      m_steps.manufacturingFinalLabels();
    },

    checkboxNeg: () => {
      // C36051
      inputChecker.clickOnCheck('[data-testid="right-button-radio"]', 'be.disabled');
    },

    noOptionSelectedRadioButtonNeg: () => {
      cy.reload();
      // C36050
      inputChecker.clickOnCheck('[id="#/properties/data/properties/is_confirmed"]', 'be.disabled');
    },

    seventyMLButtonSelectedPos: () => {
      // C40929	
      inputChecker.clickOnCheck('[data-testid="left-button-radio"]', 'not.be.disabled');
    },

    saveAndClosePos: () => {
      // C36053	
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
      })
      inputChecker.nextButtonCheck("be.enabled");
    }
  },

  confirmationOfLabelApplicationPart2: {
    previousHappyPathSteps: () => {
      m_steps.manufacturingStart();
      m_steps.manufacturingSelectExpiryData();
      m_steps.manufacturingConfirmExpiryData();
      m_steps.manufacturingFinalLabels();
      m_steps.manufacturingLabelApplicationIS();
    },

    //C41075
    confirmButtonDisabledforCoiBag: () => {
      inputChecker.checkState('[data-testid="bag-identifier-1-button"]', 'be.disabled');
    },

    //C41076
    confirmButtonDisbaledForCassette: () => {
      inputChecker.checkState('[data-testid="cassette-1-button"]', 'be.disabled');
    },

    //C41077
    confirmButtonEnabledForCoiBag: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.inputStringValue('[data-testid="bag-identifier-1-input"]', `${coi}-FPS-01`);
        inputChecker.checkState('[data-testid="bag-identifier-1-button"]', 'not.be.disabled');
      });
    },

    //C41078
    confirmButtonEnabledForcassette: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.inputStringValue('[data-testid="cassette-1-input"]', `${coi}-FPS-01`);
        inputChecker.checkState('[data-testid="cassette-1-button"]', 'not.be.disabled');
      });
    },

    //C41083
    invalidDataForCoiBag: () => {
      inputChecker.scanAndVerifyMultipleNeg('bag-identifier-1', 'abcdef');
      inputChecker.scanAndVerifyMultipleNeg('bag-identifier-1', '12345');
    },

    //C41084
    invalidDataForCassette: () => {
      inputChecker.scanAndVerifyMultipleNeg('cassette-1', 'abcdef');
      inputChecker.scanAndVerifyMultipleNeg('cassette-1', '12345');
    },

    //C41079
    confirmCheckboxUnchecked:  () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.scanAndVerifyMultiplePos('bag-identifier-1', `${coi}-FPS-01`, 'not.be.disabled');
        inputChecker.scanAndVerifyMultiplePos('cassette-1', `${coi}-FPS-01`, 'not.be.disabled');
        inputChecker.checkState('[data-testid="primary-button-action"]', 'be.disabled');
      })
    },

    //C41080
    confirmCheckboxChecked: () => {
      inputHelpers.clicker('[id="#/properties/data/properties/destruction_confirmed"]');
      inputChecker.checkState('[data-testid="primary-button-action"]', 'not.be.disabled');
    },

    //C41082
    saveAndClose: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations");
      });
      inputChecker.nextButtonCheck("be.enabled");
    }
  }
}