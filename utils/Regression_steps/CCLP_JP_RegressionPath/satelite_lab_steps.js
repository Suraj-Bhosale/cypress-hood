import inputHelpers from '../../shared_block_helpers/inputFieldHelpers.js'
import translationHelpers from '../../shared_block_helpers/translationHelpers.js'
import common from '../../../support/index.js'
import therapies from '../../../fixtures/therapy.json'
import satelliteLabAssertions from '../../../fixtures/satelliteLabAssertions.json'
import inputs from '../../../fixtures/inputs.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers.js'
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers"
import sat_steps from "../../HappyPath_steps/CCLP_JP_HappyPath/satelite_lab_steps"
import regressionInput from '../../../fixtures/inputsRegression.json'


const getSatAirWayBill = (subjectNumber,coi) => {
    cy.openOrder('ordering', 'oliver')
    cy.commonPagination(subjectNumber, 'Treatments per Patient')
    cy.get('[data-testid="td-stage-plane-icon"]')
      .eq(1)
      .parent()
      .parent()
      .parent()
      .find('[data-testid="td-stage-site-details"]')
      .invoke('text')
      .then((text) => {
         let airWayBill = text.substring(9, text.length)
  
        cy.openOrder('satellite_lab', 'steph')
        cy.commonPagination(coi, 'Reservations')
  
        inputHelpers.scanAndVerifyCoi('satellite-airway-bill', airWayBill)
        cy.wait(1000)
        cy.log('satLabAirWayBill', airWayBill)
      })
  }
  export default {

  }