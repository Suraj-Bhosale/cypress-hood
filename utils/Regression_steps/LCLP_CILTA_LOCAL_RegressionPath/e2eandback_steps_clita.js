
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";

export default {
   
   e2e:  {
       backbutton: (scope,therap) => {
       //C40684    
        cy.openOrder('ordering','oliver')
        cy.commonPagination(scope.patientInformation.patientId,'Treatments per Patient')
        cy.getCoiFromOSTPage();
        cy.openOrder('infusion','phil')
        cy.get(`@coi`).then(coi => { 
          cy.commonPagination(coi,'Reservations')   
          for(let i=1;i<6;i++){
          inputChecker.nextButtonCheck('be.enabled');
          inputChecker.backButtonCheck('[data-testid=back-nav-link]');
          }
        })

        cy.openOrder('ordering','oliver')
        cy.commonPagination(scope.patientInformation.patientId,'Treatments per Patient')
        cy.getCoiFromOSTPage();
        cy.openOrder('manufacturing','steph')
        cy.get(`@coi`).then(coi => {   
          cy.commonPagination(coi,'Reservations') 
          inputChecker.backButtonCheck('[data-testid=back-nav-link]'); 
          for(let i=1;i<10;i++){
            inputChecker.nextButtonCheck('be.enabled');
            inputChecker.backButtonCheck('[data-testid=back-nav-link]');
            }
         });

        cy.openOrder('collection','arlene')
        cy.commonPagination(scope.patientInformation.patientId,'Patients')
        cy.get(`@coi`).then(coi => { 
          for(let i=1;i<2;i++){
            inputChecker.nextButtonCheck('be.enabled');
            inputChecker.backButtonCheck('[data-testid=back-nav-link]');
            }
        });

        cy.openOrder('ordering','nina');
        cy.commonPagination(scope.patientInformation.patientId,'Patients')
        cy.get(`@coi`).then(coi => { 
          cy.get('[data-testid="document-text"]').find('a').eq(0).click();
          for(let i=1;i<4;i++){
            inputChecker.backButtonCheck('[data-testid=back-nav-link]');
            }
        });
          }
          }
      }