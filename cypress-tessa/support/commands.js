import tableHelpers from '../utils/shared_block_helpers/tableHelpers';
import inputChecker from '../utils/shared_block_helpers/inputFieldCheckHelpers';

let LOCAL_STORAGE_MEMORY = {};
import 'cypress-file-upload';

Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})

Cypress.Commands.add('saveLocalStorage', () => {
  Object.keys(localStorage).forEach(key => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key];
  });
});

Cypress.Commands.add('restoreLocalStorage', () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key]);
  });
});

// Performs an XMLHttpRequest instead of a cy.request (able to send data as FormData - multipart/form-data)
Cypress.Commands.add('XMLHttpRequest', ({ formData, method, tokenData, url }) => {
  const { accessToken, uid, clientToken } = tokenData;
  return new Cypress.Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.setRequestHeader('uid', uid);
    xhr.setRequestHeader('client', clientToken);
    xhr.setRequestHeader('access-token', accessToken);
    xhr.onload = function() {
      resolve(xhr);
    };
    xhr.onerror = function(error) {
      reject(error);
    };
    xhr.send(formData);
  });
});

Cypress.Commands.add('uploadFile', (fileUrl, selector, type) => {
  return cy.get(selector).then(subject => {
    return cy
      .fixture(fileUrl, 'base64')
      .then(Cypress.Blob.base64StringToBlob)
      .then(blob => {
        return cy.window().then(win => {
          const el = subject[0];
          const nameSegments = fileUrl.split('/');
          const name = nameSegments[nameSegments.length - 1];
          const testFile = new win.File([blob], name, { type: type });
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(testFile);
          el.files = dataTransfer.files;
          return subject;
        });
      });
  });
});

Cypress.Commands.add('selectFromDropDown', (selector, targetValue) => {
  cy.get(selector)
    .find('div.select')
    .click();
  cy.get(selector)
    .find(`ul.select-content li:contains("${targetValue}"):first`)
    .click();
});

Cypress.Commands.add('selectFromDropDownNoDiv', (selector, targetValue) => {
  cy.get(selector).click();
  cy.get(selector)
    .find(`ul.select-content li:contains("${targetValue}"):first`)
    .click();
});

Cypress.Commands.add('selectFromMultiSelect', (selector, targetValue) => {
  cy.get(selector).click();
  cy.get(selector)
    .contains('div', targetValue)
    .click();
});

Cypress.Commands.add('copyTenantConfigData', ({ destPath, srcPath }) => {
  cy.exec(`cp -rf ${srcPath} ${destPath}`);
});

Cypress.Commands.add('createZipBundle', ({ basePath, fileName }) => {
  cy.exec(`cd ${basePath}; zip -r ../${fileName}.zip .`);
});

Cypress.Commands.add('updateConfig', ({ fileAlias, filePath, textToReplace, replacedText }) => {
  cy.get(fileAlias).then(yml => {
    const modifiedYmlString = yml.replace(textToReplace, replacedText);
    cy.writeFile(filePath, modifiedYmlString);
  });
});

Cypress.Commands.add('uploadAnyFile', (fileName, encoding, selector, type, inputType) => {
  cy.fixture(fileName, encoding).then(fileContent => {
    cy.get(selector).attachFile(
      { fileContent, fileName, mimeType: type, encoding },
      { subjectType: inputType }
    );
  });
});

const PLATFORM_AUTH_HEADERS = ['access-token', 'token-type', 'uid', 'client'];

Cypress.Commands.add('platformLogin', (email, password = 'password one two three') => {
  if (!email.includes('@')) {
    email += '@vineti.com';
  }
  cy.log(`Platform Login as ${email}`);
  cy.request({
    method: 'POST',
    url: `${Cypress.env('PLATFORM_URL')}/auth/sign_in`,
    body: { email, password },
    failOnStatusCode: false,
    headers: {
      'TOKEN-TO-SKIP-SAML-AUTH': Cypress.env('TOKEN_TO_SKIP_SAML_AUTH'),
    },
  }).then(resp => {
    let statusCode = resp.status;
    cy.log('Status code is :'+statusCode)
       for (let i=0; i<20; i++){
         if(statusCode == 200) {
           break;
         }else {
           cy.wait(20000);
           cy.log('Status code is :'+statusCode)
         }
       }  
    PLATFORM_AUTH_HEADERS.forEach(header => {
      localStorage.setItem(header, resp.headers[header]);
    });
  });
});

Cypress.Commands.add('platformRequest', (path, options = {}) => {
  options = Object.assign({ method: 'GET', headers: {} }, options);
  options.url = `${Cypress.env('PLATFORM_URL')}${path}`;
  PLATFORM_AUTH_HEADERS.forEach(header => {
    options.headers[header] = localStorage.getItem(header);
  });
  return cy.request(options);
});

Cypress.Commands.add('waitForElementAndClick', (selector, wait = 100000) => {
  cy.get(selector, { timeout: wait })
    .should('be.visible')
    .should('not.be.disabled')
    .trigger("click");
});

Cypress.Commands.add('waitForElementAndClickAfterSignature', (selector, wait = 22000) => {
  cy.get(selector, { timeout: wait })
    .should('be.visible')
    .should('not.be.disabled')
    .click();
});

Cypress.Commands.add('waitForTextAndClick', (text, wait = 3000) => {
  cy.contains(text, { timeout: wait })
    .should('be.visible')
    .should('not.be.disabled')
    .click();
});

Cypress.Commands.add('waitForSelectorWithTextAndClick', (selector, text, wait = 15000) => {
  cy.contains(selector, text, { timeout: wait })
    .should('be.visible')
    .should('not.be.disabled')
    .click();
});

//Replace cy.visit with this function to avoid flaky test cases due to random logout. Ref: https://vineti.atlassian.net/browse/PLATFORM-1042
Cypress.Commands.add('visitWithUpdatedSessionTimeStamp', (url, options) => {
  localStorage.setItem('sessionTimestamp', Date.now());
  return cy.visit(url, options);
});

Cypress.Commands.add('waitForSchedulingLoader', ({ institutionType }) => {
  cy.get(`[data-testid="scheduling-loader-${institutionType}"]`).should('not.exist');
});

Cypress.Commands.add('pagination',(uniqueId,header) => {
  cy.get('header',{timeout:90000});
    if (header == 'Treatments per Subject' || header =='Subjects') {
      let findInPage = (index) => {
        let found = false;
            let lastPage;
            cy.get(".list-pager li:nth-last-child(2) > a").then(($pages) => {
               lastPage = $pages.text();
              cy.log("Total Pages are:"+ lastPage)
            cy.log("Index is:"+index)
            if(index == 0){ 
               cy.get("a[aria-label='Page 1 is your current page']").click();
            }
            if(index == lastPage){
              cy.log(`Order with this unique_id: ${unique_id} not found`);
              return;
            }
            if(index != 0){     
                cy.get(".next > a").then(($nextButton) => {
                  if (!$nextButton.hasClass('disabled')) {
                    cy.wrap($nextButton).click();
                  } else {
                    cy.log(`Order with this unique_id: ${unique_id} not found`);
                  }
              });
            }  
          cy.wait(5000)
          cy.get("tr > td:nth-child(2)")
            .each((td) => {
              cy.log("Unique ID: " + uniqueId)
              cy.log("SubjectID are : " + td.text())
              const subId = td.text();
              console.log("This is subId: ", subId);
              if (uniqueId === subId) {
                cy.log("Found order => ")
                cy.wait(5000)
                found = true;
                return false;
              } else {
                cy.log('Not found')
              }
            })
            .then(() => {
              if (!found) findInPage(++index);
            });
        });
      };
      findInPage(0);
    }  else  {
      let findInPage = (index) => {
        let found = false;
            let lastPage;
            cy.get(".list-pager li:nth-last-child(2) > a").then(($pages) => {
               lastPage = $pages.text();
              cy.log("Total Pages are:"+ lastPage)
            cy.log("Index is:"+index)
            if(index == 0){ 
               cy.get("a[aria-label='Page 1 is your current page']").click();
            }
            if(index == lastPage){
              cy.log(`Order with this unique_id: ${unique_id} not found`);
              return;
            }
            if(index != 0){     
                cy.get(".next > a").then(($nextButton) => {
                  if (!$nextButton.hasClass('disabled')) {
                    cy.wrap($nextButton).click();
                  } else {
                    cy.log(`Order with this unique_id: ${unique_id} not found`);
                  }
              });
            }  
            cy.wait(5000)
            cy.get('[data-testid="paginated-table-body"]>>')
              .each((td) => {
                cy.get(`@coi`).then(coi =>{
                cy.log("Unique ID COI : " + coi)
                cy.log("COI are : " + td.text())
                const coiNo = td.text();
                if (coi === coiNo) {
                  cy.log("Found order => ")
                  cy.wait(5000)
                  found = true;
                  return false;
                } else {
                  cy.log('Not found COI')
                }
             });
              })
              .then(() => {
                if (!found) findInPage(++index);
              });
          });
        };
        findInPage(0);
      }
})

Cypress.Commands.add('getCoi',(patientInformation) => {
    cy.platformLogin("oliver@vineti.com");
    cy.visit("/ordering");
    let findInPage = (index) => {
      let found = false;
          let lastPage;
          cy.get(".list-pager li:nth-last-child(2) > a").then(($pages) => {
             lastPage = $pages.text();
            cy.log("Total Pages are:"+ lastPage)
          cy.log("Index is:"+index)
          if(index == 0){ 
             cy.get("a[aria-label='Page 1 is your current page']").click();
          }
          if(index == lastPage){
            cy.log(`Order with this unique_id: ${patientInformation} not found`);
            return;
          }
          if(index != 0){     
              cy.get(".next > a").then(($nextButton) => {
                if (!$nextButton.hasClass('disabled')) {
                  cy.wrap($nextButton).click();
                } else {
                  cy.log(`Order with this unique_id: ${patientInformation} not found`);
                }
            });
          }  
          cy.wait(5000)
          cy.get("tr > td:nth-child(2)")
            .each((td) => {
              const subId = td.text();
              console.log("This is subId: ", subId);
              if (patientInformation.subjectId === subId) {
                cy.log("Found order => ")
                cy.wait(5000)
                cy.get("tr > td:nth-child(2)")
                .contains(patientInformation.subjectId)
                .click();
                cy.wait(5000) 
              cy.get("[data-testid=txt-field-header-coi-value]")
                .invoke(`text`)
                .as(`coi`);
              cy.get(`@coi`).then((coi) => {
                cy.log("COI is :", coi);
              });
                found = true;
                return false;
              } else {
                console.log('Not found')
              }
            })
            .then(() => {
              if (!found) findInPage(++index);
            });
        });
      };
      findInPage(0);
  })


Cypress.Commands.add('paginationForSubjectId',(subjectId) => {
  cy.get('header',{timeout:90000});
  cy.get('header').then(($header) => {
    if ($header.text().includes('Treatments per Subject')) {
      let findInPage = (index) => {
        let found = false;
            let lastPage;
            cy.get(".list-pager li:nth-last-child(2) > a").then(($pages) => {
               lastPage = $pages.text();
              cy.log("Total Pages are:"+ lastPage)
            cy.log("Index is:"+index)
            if(index == 0){ 
               cy.get("a[aria-label='Page 1 is your current page']").click();
            }
            if(index == lastPage){
              cy.log(`Order with this unique_id: ${subjectId} not found`);
              return;
            }
            if(index != 0){     
                cy.get(".next > a").then(($nextButton) => {
                  if (!$nextButton.hasClass('disabled')) {
                    cy.wrap($nextButton).click();
                  } else {
                    cy.log(`Order with this unique_id: ${subjectId} not found`);
                  }
              });
            }   
            cy.wait(5000)
            cy.get("tr > td:nth-child(2)")
              .each((td) => {
                const subId = td.text();
                console.log("This is subId: ", subId);
                if (subjectId === subId) {
                  cy.log("Found order => ")
                  cy.wait(5000)
                  cy.get("tr > td:nth-child(2)")
                  .contains(subjectId)
                  .click();
                  found = true;
                  return false;
                } else {
                  console.log('Not found')
                }
              })
              .then(() => {
                if (!found) findInPage(++index);
              });
          });
      };
      findInPage(0);
    } else if ($header.text().includes('Subjects')) {
      inputChecker.explicitWait('[data-testid=header-appointment]')
      tableHelpers.clickOnFilter('appointment', 'All');
      cy.wait(1000)
      tableHelpers.clickOnFilter('appointment', 'All');
      let findInPage = (index) => {
        let found = false;
            let lastPage;
            cy.get(".list-pager li:nth-last-child(2) > a").then(($pages) => {
               lastPage = $pages.text();
              cy.log("Total Pages are:"+ lastPage)
            cy.log("Index is:"+index)
            if(index == 0){ 
               cy.get("a[aria-label='Page 1 is your current page']").click();
            }
            if(index == lastPage){
              cy.log(`Order with this unique_id: ${subjectId} not found`);
              return;
            }
            if(index != 0){     
                cy.get(".next > a").then(($nextButton) => {
                  if (!$nextButton.hasClass('disabled')) {
                    cy.wrap($nextButton).click();
                  } else {
                    cy.log(`Order with this unique_id: ${subjectId} not found`);
                  }
              });
            }  

            cy.wait(5000)
            cy.get("tr > td:nth-child(2)")
              .each((td) => {
                const subId = td.text();
                console.log("This is subId: ", subId);
                if (subjectId === subId) {
                  cy.log("Found order =>")
                  cy.wait(5000)
                  cy.get("tr > td:nth-child(2)")
                  .contains(subjectId)
                  .click();
                  found = true;
                  return false;
                } else {
                  console.log('Not found')
                }
              })
              .then(() => {
                if (!found) findInPage(++index);
              });
          });
        };
        findInPage(0);
      }
   });
 });

  Cypress.Commands.add('paginationForCoi',() => {
    let findInPage = (index) => {
      cy.get(`@coi`).then(coi =>{
      let found = false;
          let lastPage;
          cy.get(".list-pager li:nth-last-child(2) > a").then(($pages) => {
             lastPage = $pages.text();
            cy.log("Total Pages are:"+ lastPage)
          cy.log("Index is:"+index)
          if(index == 0){ 
             cy.get("a[aria-label='Page 1 is your current page']").click();
          }
          if(index == lastPage){
            cy.log(`Order with this unique_id: ${coi} not found`);
            return;
          }
          if(index != 0){     
              cy.get(".next > a").then(($nextButton) => {
                if (!$nextButton.hasClass('disabled')) {
                  cy.wrap($nextButton).click();
                } else {
                  cy.log(`Order with this unique_id: ${coi} not found`);
                }
            });
          } 
          cy.wait(5000)
          cy.get('[data-testid="paginated-table-body"]>>')
            .each((td) => {
              const coiNo = td.text();
              
              if (coi === coiNo) {
                cy.log("Found order => ")
                cy.wait(5000)
                cy.get('[data-testid="paginated-table-body"]>>')
                .contains(coi)
                .click();
                found = true;
                return false;
              } else {
                console.log('Not found')
              }
            });
            })
            .then(() => {
              if (!found) findInPage(++index);
            });
        });
    };
    findInPage(0);
  });

  Cypress.Commands.add('checkStatus',(unique_id,status,header,index) => {
    cy.pagination(unique_id,header);
    cy.log("Checking status")
    cy.contains(unique_id)
        .parents('tr')
        .then(($patient) => {
          cy.get($patient)
            .children('td').eq(index)
            .contains(status)
            .click()
          })
   });  

Cypress.Commands.add('scheduleFirstAvailableDate', ({ institutionType }) => {
  cy.wait(3000)
  //scrolls through the calendar until it finds an available date
  const navigateToAvailableDate = ({ institutionType }) =>
    cy.get(`[data-testid="lbl-current-month-${institutionType}"]`,{timeout:90000});
    cy.get(`[data-testid="lbl-current-month-${institutionType}"]`).then(() => {
      const availableDaySelector = `[data-testid^=day-available-${institutionType}]`;
      const day = Cypress.$(availableDaySelector);

      if (
        day.length > 0 &&
        !day
          .children()
          .first()
          .is(':empty')
      ) {
        return true;
      }
      cy.get(`[data-testid="btn-next-${institutionType}"]`,{timeout:90000}).should('not.be.disabled');
      cy.get(`[data-testid="btn-next-${institutionType}"]`).click({ force: true});
      cy.waitForSchedulingLoader({ institutionType });

      return navigateToAvailableDate({ institutionType });
    });

    // picks the first available date on the screen if the date is available
    const draftDate = ({ institutionType }) =>
      navigateToAvailableDate({ institutionType }).then(() =>
        cy
          .get(`[data-testid^=day-available-${institutionType}]`)
          .first()
          .click()
      );

    return draftDate({ institutionType });

});
