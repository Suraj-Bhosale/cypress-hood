import common from '../../support/index'
import assertions from '../../fixtures/cancelAssertions.json'
import translationHelpers from '../shared_block_helpers/translationHelpers'
import inputs from '../../fixtures/inputs.json'

export default {

    cancelOption: (scope) => {

        cy.get('[data-testid="cancel-button-action"]').click()

        if(Cypress.env('runWithTranslations')) {
            translationHelpers.assertSingleField('[data-testid="patientInformationHeader.name"]', assertions.header.name);
            translationHelpers.assertSingleField('[data-testid="patientInformationHeader.subject_number"]', assertions.header.subjectNumber);
            translationHelpers.assertSingleField('[data-testid="patientInformationHeader.subject_number-value"]', scope.patientInformation.subjectNumber);
            translationHelpers.assertSingleField('[data-testid="patientInformationHeader.study_number"]', assertions.header.studyNumber);
            translationHelpers.assertSingleField('[data-testid="patientInformationHeader.study_number-value"]', assertions.header.studyNumberValue);
            translationHelpers.assertSingleField('[data-testid="patientInformationHeader.coi"]', assertions.header.coi);
            translationHelpers.assertSingleField('[data-testid="patientInformationHeader.coi-value"]', scope.coi);

            translationHelpers.assertSingleField('[data-testid="progress-cancel_reason-name"]', assertions.header.cancelSidebar);

            translationHelpers.assertSingleField('[data-testid="h1-header"]', assertions.title.title);
            translationHelpers.assertSingleField('[data-testid="subtitle1-header"]', assertions.title.description);
            translationHelpers.assertSingleField('[data-testid="section-heading-title"]', assertions.title.header1);
            translationHelpers.assertSingleField('[data-testid="section-heading-description"]', assertions.labels.question);

        }
        cy.get('[data-testid="cancel-page-reason-select"]  > div').click()
        cy.get('.select-content > :nth-child(1)').click();
        cy.get('[data-testid="cancel-page-cancel-button"]').click();
        common.singleSignature();
        cy.get('[data-testid="cancel-page-cancel-button"]').click();

        cy.wait(7000)

        if(Cypress.env('runWithTranslations')) {
            translationHelpers.assertSingleField('[data-testid="h1-header"]', assertions.title.title2);
            translationHelpers.assertSingleField('[data-testid="cancelled-page-cancel-reason"]', inputs.cancelReason);
            translationHelpers.assertSingleField('[data-testid="cancel-page-cancel-button"]', assertions.button.close);
        }

        cy.get('[data-testid="cancel-page-cancel-button"]').click();
        
        
    }

}