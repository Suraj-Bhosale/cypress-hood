import common from '../../../support/index.js'
import translationHelpers from '../../shared_block_helpers/translationHelpers'
import wdcAssertions from '../../../fixtures/wdcAssertions.json'
import inputs from '../../../fixtures/inputs.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers.js'
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers.js'
import inputChecker from '../../shared_block_helpers/inputFieldCheckHelpers'
import wdc_steps from '../../HappyPath_steps/CCCP_EU_HappyPath/wdc_steps'
import regressionInput from '../../../fixtures/inputsRegression.json'


const getWDCAirWayBill = (scope, shippingRow) => {
  common.loginAs('oliver')
  cy.visit('/ordering')
  cy.wait(8000)
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
      cy.visit('/wdc')
      cy.contains(scope.coi).click()

      inputHelpers.scanAndVerifyCoi('wdc-airway-bill', scope.airWayBill)

      cy.log('wdcAirWayBill', scope.airWayBill)
    })
}

export default {
  scheduleFinalProductShipment: {
   
  },

  verifyShipper: {
   
  },

  shipmentReceiptChecklist:  {
   
  },

  shipmentReceiptChecklistSummary: {
  
  },

  transferProductToStorage: {
    
  },

  productReceipt: {
  
  },

  productRecieptSummary: {
   
  },

  wdcQualityRelease: {
   
  },

  wdcPrintShipperLabels: {
   
  },

  wdcTransferProductToShipper: {
    
  },

  shippingWorldDistributionCenter: {
   
  },

  shippingWorldDistributionCenterSummary: {

  }
  
}
