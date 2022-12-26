import common from '../../../support/index.js'
import translationHelpers from '../../shared_block_helpers/translationHelpers'
import wdcAssertions from '../../../fixtures/wdcAssertions.json'
import input from '../../../fixtures/inputs.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers.js'
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers.js'
import inputChecker from '../../shared_block_helpers/inputFieldCheckHelpers'
import wdc_steps from '../../HappyPath_steps/CCLP_EU_HappyPath/wdc_steps'
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

  },

  checkStatusForWdcModule: (scope, therapy, schedulingSteps) => {
    cy.get(`@coi`).then(coi => { 
        inputHelpers.clickOnHeader('wdc')
        cy.checkStatus(coi,regressionInput.wdc.statuses.scheduleFinalProductShipment, 'Reservations',3)
        wdc_steps.wdcScheduleFinalProductShipment(coi, schedulingSteps, 'wdc_eu');

        inputHelpers.clickOnHeader('wdc')
        cy.checkStatus(coi,regressionInput.wdc.statuses.verifyShipper, 'Reservations',3)
        wdc_steps.wdcVerifyShipper(coi, '');

        inputHelpers.clickOnHeader('wdc')
        cy.checkStatus(coi,regressionInput.wdc.statuses.shipmentReceiptChecklist, 'Reservations',3)
        wdc_steps.wdcShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber, true);

        inputHelpers.clickOnHeader('wdc')
        cy.checkStatus(coi,regressionInput.wdc.statuses.shipmentReceiptChecklistSummary, 'Reservations',3)
        wdc_steps.wdcShipmentReceiptChecklistSummary(coi, scope.patientInformation);

        inputHelpers.clickOnHeader('wdc')
        cy.checkStatus(coi,regressionInput.wdc.statuses.transferProductToStorage, 'Reservations',3)
        wdc_steps.wdcTransferProductToStorage(coi, therapy);

        inputHelpers.clickOnHeader('wdc')
        cy.checkStatus(coi,regressionInput.wdc.statuses.productReceipt, 'Reservations',3)
        wdc_steps.wdcProductReceipt(input.pisNumber, input.lotNumber, therapy);

        inputHelpers.clickOnHeader('wdc')
        cy.checkStatus(coi,regressionInput.wdc.statuses.productReceiptSummary, 'Reservations',3)
        wdc_steps.wdcProductRecieptSummary(therapy, scope.patientInformation);

        inputHelpers.clickOnHeader('wdc')
        cy.checkStatus(coi,regressionInput.wdc.statuses.qualityRelease, 'Reservations',3)
        wdc_steps.wdcQualityRelease(scope, scope.patientInformation);

        inputHelpers.clickOnHeader('wdc')
        cy.checkStatus(coi,regressionInput.wdc.statuses.printShipperLabels, 'Reservations',3)
        wdc_steps.wdcPrintShipperLabels(therapy);

        inputHelpers.clickOnHeader('wdc')
        cy.checkStatus(coi,regressionInput.wdc.statuses.transferProductToShipper, 'Reservations',3)
        wdc_steps.wdcTransferProductToShipper(coi, scope.patientInformation);

        inputHelpers.clickOnHeader('wdc')
        cy.checkStatus(coi,regressionInput.wdc.statuses.shippingWorldDistributionCenter, 'Reservations',3)
        wdc_steps.wdcShippingWorldDistributionCenter(2, scope, input.evoLast4Digits, input.tamperSealNumber)

        inputHelpers.clickOnHeader('wdc')
        cy.checkStatus(coi,regressionInput.wdc.statuses.shippingWorldDistributionSummary, 'Reservations',3)
        wdc_steps.wdcShippingWorldDistributionCenterSummary(coi, scope.patientInformation);

        cy.checkStatus(coi,regressionInput.wdc.statuses.completed,'Reservations',3)
        
      })
    }
  
}
