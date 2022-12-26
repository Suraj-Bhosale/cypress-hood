import common from '../../../support/index'
import assertions from '../../../fixtures/assertions.json'
import inputs from '../../../fixtures/inputs.json'
import collectionAssertion from '../../../fixtures/collectionAssertions.json'
import translationHelpers from '../../shared_block_helpers/translationHelpers.js'
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers'
import col_steps from '../../../utils/HappyPath_steps/CCCP_EU_HappyPath/collection_steps';
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";


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
  
}
