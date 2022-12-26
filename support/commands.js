import common from '../support/index';

let LOCAL_STORAGE_MEMORY = {};

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
    xhr.onload = function () {
      resolve(xhr);
    };
    xhr.onerror = function (error) {
      reject(error);
    };
    xhr.send(formData);
  });
});

Cypress.Commands.add('uploadFile', (fileUrl, selector, type) => {
  return cy.get(selector).then(subject => {
    return cy.fixture(fileUrl, 'base64').then(Cypress.Blob.base64StringToBlob).then(blob => {
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
  cy.get(selector).find('div.select').click();
  cy.get(selector).find(`ul.select-content li:contains("${targetValue}"):first`).click();
});

Cypress.Commands.add('selectFromDropDownNoDiv', (selector, targetValue) => {
  cy.get(selector).click();
  cy.get(selector).find(`ul.select-content li:contains("${targetValue}"):first`).click();
});

Cypress.Commands.add('selectFromMultiSelect', (selector, targetValue) => {
  cy.get(selector).click();
  cy.get(selector).contains('div', targetValue).click();
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
    cy.get(selector).upload({
      fileContent,
      fileName,
      mimeType: type,
      encoding
    }, { subjectType: inputType });
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
    url: `${Cypress.env('PLATFORM_URL')
      }/auth/sign_in`,
    body: {
      email,
      password
    },
    headers: {
      'TOKEN-TO-SKIP-SAML-AUTH': Cypress.env('TOKEN_TO_SKIP_SAML_AUTH')
    }
  }).then(resp => {
    expect(resp.status).to.eq(200);
    PLATFORM_AUTH_HEADERS.forEach(header => {
      localStorage.setItem(header, resp.headers[header]);
    });
  });
});

Cypress.Commands.add('platformRequest', (path, options = {}) => {
  options = Object.assign({
    method: 'GET',
    headers: {}
  }, options);
  options.url = `${Cypress.env('PLATFORM_URL')
    }${path}`;
  PLATFORM_AUTH_HEADERS.forEach(header => {
    options.headers[header] = localStorage.getItem(header);
  });
  return cy.request(options);
});

Cypress.Commands.add('waitForElementAndClick', (selector, wait = 10000) => {
  cy.get(selector, { timeout: wait }).should('be.visible').should('not.be.disabled').click();
});

Cypress.Commands.add('waitForTextAndClick', (text, wait = 3000) => {
  cy.contains(text, { timeout: wait }).should('be.visible').should('not.be.disabled').click();
});

Cypress.Commands.add('waitForSelectorWithTextAndClick', (selector, text, wait = 15000) => {
  cy.contains(selector, text, { timeout: wait }).should('be.visible').should('not.be.disabled').click();
});

// Replace cy.visit with this function to avoid flaky test cases due to random logout. Ref: https://vineti.atlassian.net/browse/PLATFORM-1042
Cypress.Commands.add('visitWithUpdatedSessionTimeStamp', (url, options) => {
  localStorage.setItem('sessionTimestamp', Date.now());
  return cy.visit(url, options);
});

Cypress.Commands.add('waitForSchedulingLoader', ({ institutionType }) => {
  cy.get(`[data-testid="scheduling-loader-${institutionType}"]`).should('exist');
  cy.get(`[data-testid="scheduling-loader-${institutionType}"]`).should('not.exist');
});

Cypress.Commands.add('scheduleFirstAvailableDate', ({
  institutionType
}, region) => {
  cy.get(`[data-testid="lbl-current-month-${institutionType}"]`).then(() => {
    if (region == 'EU') {
      cy.get(`[data-testid="btn-next-${institutionType}"]`).click();
      // cy.wait(1000)
      cy.wait('@schedulingServiceAvailability');
      cy.get(`[data-testid="btn-prev-${institutionType}"]`).click();
      // cy.wait(1000)
      cy.wait('@schedulingServiceAvailability');
      // cy.wait(2000)
      return
    }
  });

  // picks the first available date on the screen if the date is available
  const draftDate = ({ institutionType }) => {
    cy.get('body').then((body) => {
      if (body.find(`[data-testid*=day-available-${institutionType}]`).length > 0 && !body.find(`[data-testid*=day-available-${institutionType}]`).children().first().is(':empty')) {
        cy.get(`[data-testid*=day-available-${institutionType}]`).first().click();
      } else {
        cy.get(`[data-testid="btn-next-${institutionType}"]`).click();
        cy.get(`[data-testid*=day-available-${institutionType}]`).first().click()
      }
    })
  }
  return draftDate({ institutionType });
});

Cypress.Commands.add('pagination',(unique_id,header) => {
  cy.get('header').then(($header) => {
    $header.text().includes(header)
      let findInPage = (index) => {
        let found = false;
        cy.get("ul.list-pager > li:not(.next):not(.previous)").as("pages");
        cy.get("@pages")
          .its("length")
          .then((len) => {
            if (index >= len) return;
            cy.get("@pages").eq(index).click();
            cy.wait(5000)
                cy.get('[data-testid="paginated-table-body"]').then(($page)=> {
                  if($page.text().includes(unique_id)) {
                  cy.log("Found order =>")
                     found = true;
                    }
                    if (!found) findInPage(++index);
              })
          });
      };
      findInPage(0);
   });
 });

   /**
   * Common method to check the status of all modules
   * @param {string} unique_id - Unique id of the specific order (COI/OrderID/PatientID).
   * @param {string} status - Status of order on the list page.
   * @param {string} header - Title of the list page.
   * @param {number} index - Index to get 'td' of status.
   * @example
   * example for unique_id 'JJJ.ZIRTRJ.3DF.0, 4534, 676543569-id'
   * example for status 'COI Generated'
   * example for header 'Patients'
   * example for index '3,4,5'
   */
 Cypress.Commands.add('checkStatus',(unique_id,status,header,index) => {
  cy.pagination(unique_id, header);
  cy.contains(unique_id)
      .parents('tr')
      .then(($patient) => {
        cy.get($patient)
          .children('td').eq(index)
          .contains(status)
          .click()
        })
 });

    /**
   * Common method to navigate to the record from record list
   * @param {string} unique_id - Unique id of the specific order (COI/OrderID/PatientID).
   * @param {string} status - Status of order on the list page.
   * @example
   * example for unique_id 'JJJ.ZIRTRJ.3DF.0, 4534, 676543569-id'
   * example for header 'Patients'
   */
 Cypress.Commands.add('commonPagination',(unique_id ,header) => {
  cy.pagination(unique_id, header);
  cy.contains(unique_id)
      .parents('tr')
      .then(($patient) => {
        cy.get($patient)
          .click()
        })
 });

 Cypress.Commands.add('fetchCoi',(scope) => {
  cy.get('[data-testid="patientInformationHeader.coi-value"]')
    .first()
    .invoke('text').then(coi => {
    scope.coi = coi;
    });
 });

 Cypress.Commands.add('openOrder',(module ,user) => {
   cy.platformLogin(`${user}@vineti.com`);
   cy.visit(`/${module}`);
   if(module=="collection"){
   common.loadCollection();
   }
 });

 Cypress.Commands.add('invokeCoi',(selector =`[data-testid = "patientInformationHeader.coi-value"]`) => {
  cy.get(selector)
  .invoke(`text`)
  .as(`coi`);
  cy.get(`@coi`).then((coi) => {
    cy.log("COI : " + coi);
  });
 });

//Capture the COI from OST Page header, mainly use for happyPaths in separate it blocks.
  Cypress.Commands.add('getCoiFromOSTPage',(selector =`[data-testid=txt-field-header-coi-value]`) => {
    cy.get(selector)
    .invoke(`text`)
    .as(`coi`);
    cy.get(`@coi`).then((coi) => {
      cy.log("COI : " + coi);
    });
  });
