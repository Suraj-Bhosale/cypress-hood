
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";
import translations from "../../Regression_steps/CD30_US_SG_Regression/summary_translations"

export default {

   e2e:  {
       backbutton: (scope) => {
        cy.get(`@coi`).then(coi => {
        cy.platformLogin('Phil@vineti.com');
        cy.visit('/infusion');
        cy.paginationForCoi();
          cy.wait(1000)
          for(let i=1;i<=9;i++)  {
            cy.get('[data-testid=h1-header]',{timeout:60000}).then(($header) => {
              cy.wait(3000)
              if ($header.text().includes('Finished Product Receipt Summary')) {
                    translations.finishedProductReceiptSummary(i)
                  } else if ($header.text().includes('Shipment Receipt Summary')){
                    translations.shipmentReceiptSummaryEu(scope,coi)
                  } else {
                    inputChecker.nextButtonCheck('be.enabled');
                    inputChecker.backButtonCheck('[data-testid=back-nav-link]');
                  }
              })
          }

          //[BUG] in e2e backButtonCheck

          // cy.log('login Steph');
          // cy.platformLogin('steph@vineti.com');
          // cy.visit('/manufacturing');
          // cy.paginationForCoi();
          //   cy.wait(1000)
          //   for(let i=1;i<23;i++) {
          //     cy.get('[data-testid=h1-header]',{timeout:60000}).then(($header) => {
          //       cy.wait(3000)
          //       if ($header.text().includes('Shipping Summary')) {
          //         translations.shippingSummary(scope)
          //       }
          //       else if ($header.text().includes('Sponsor Release Summary')) {
          //         translations.sponserReleaseSummary(scope)
          //       }
          //       else if ($header.text().includes('Manufacturing Summary')) {
          //         translations.manufacturingSummary(scope)
          //        }

          //        else if ($header.text().includes('Apheresis Product Receipt Summary')) {
          //         translations.apheresisProductReceiptSummaryEu(scope)
          //        }

          //        else if ($header.text().includes('Shipment Receipt Summary')) {
          //         translations.shipmentReceiptSummary(scope)
          //        }
          //        else if ($header.text().includes('Collection Summary')) {
          //         translations.collectionSummary(scope)
          //        }
          //        else {
          //       inputChecker.nextButtonCheck('be.enabled');
          //       inputChecker.backButtonCheck('[data-testid=back-nav-link]');
          //       }
          //     })
          //   }

          // cy.log('login Phil');
          // cy.platformLogin('phil@vineti.com');
          // cy.visit('/satellite_lab');
          // cy.paginationForCoi();
          // cy.wait(3000)
          //   for(let i=1;i<15;i++) {
          //     cy.get('[data-testid=h1-header]',{timeout:60000}).then(($header) => {
          //       cy.wait(1000)
          //       if ($header.text().includes('Shipping Summary')) {
          //           translations.shippingSummarySat(scope)
          //         }  else if ($header.text().includes('Process PBMC Summary')) {
          //           translations.processPbmcSummarySat(scope)
          //         }  else if ($header.text().includes('Apheresis Product Receipt Summary')) {
          //           translations.apheresisProductReceiptSummarySat(scope)
          //         }  else if ($header.text().includes('Shipment Receipt Summary')) {
          //           translations.shipmentReceiptSummarySat(scope)
          //         }  else if ($header.text().includes('Collection Summary')) {
          //           translations.collectionSummarySat(scope)
          //         } else {
          //           inputChecker.nextButtonCheck('be.enabled');
          //           cy.log('Checking Next button')
          //           inputChecker.backButtonCheck('[data-testid=back-nav-link]');
          //         }
          //       });
          //     }

          // cy.platformLogin('arlene@vineti.com');
          // cy.visit('/collection');
          // cy.paginationForSubjectId(scope.patientInformation.subjectId);
          // cy.wait(3000)
          //   for(let i=1;i<11;i++) {
          //     cy.get('[data-testid=h1-header]',{timeout:60000}).then(($header) => {
          //       cy.wait(1000)
          //       if ($header.text().includes('Shipment Summary')) {
          //           translations.shippingSummaryCollection(scope)
          //         }  else if ($header.text().includes('Collection Summary')) {
          //           translations.collectionSummaryCollection(scope)
          //         } else {
          //           inputChecker.nextButtonCheck('be.enabled');
          //           inputChecker.backButtonCheck('[data-testid=back-nav-link]');
          //         }
          //       });
          //     }

          cy.log('login Nina');
          cy.platformLogin('nina@vineti.com');
          cy.visit('/ordering');
          cy.paginationForSubjectId(scope.patientInformation.subjectId);
          cy.get('[data-testid=document-text] > a',{timeout:60000}).click()
          cy.wait(3000)
            for(let i=1;i<=6;i++) {
              cy.get('[data-testid=h1-header]',{timeout:60000}).then(($header) => {
                cy.wait(1000)
                if ($header.text().includes('Approve Order')) {
                      translations.approveOrder(scope.patientInformation.subjectId)
                  } else if ($header.text().includes('Confirm Order')) {
                      translations.confirmOrder(scope.patientInformation.subjectId)
                  } else {
                      inputChecker.backButtonCheck('[data-testid=back-nav-link]');
                  }
              });
            }
        });
      }
    }
  }