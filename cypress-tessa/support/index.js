import './commands';
import common from "../support/index";

// export const createApiToken = ({ baseUrl, password, username }) => {
//     return cy
//       .request({
//         method: 'POST',
//         body: {
//           email: username,
//           password,
//         },
//         url: `${baseUrl}/auth/sign_in`,
//         headers: {
//           'TOKEN-TO-SKIP-SAML-AUTH': Cypress.env('TOKEN_TO_SKIP_SAML_AUTH'),
//         },
//       })
//       .then(response => {
//         return {
//           statusCode: response.status,
//           tokenData: {
//             accessToken: response.headers['access-token'],
//             clientToken: response.headers.client,
//             uid: response.headers.uid,
//           },
//         };
//       });
//   };

// export const updateConfiguration = ({ name, tokenData }) => {
//     const method = 'POST';
//     const fileName = `${name}.zip`;
//     const fileType = 'application/x-zip-compressed';

//     return cy.fixture(fileName, 'binary').then(file => {
//       return Cypress.Blob.binaryStringToBlob(file, fileType).then(blob => {
//         const url = `${Cypress.env('PLATFORM_URL')}/configuration`;
//         const formData = new FormData();
//         formData.append('bundle', blob, fileName);

//         cy.XMLHttpRequest({
//           formData,
//           method,
//           tokenData,
//           url,
//         });
//       });
//     });
//   };

const PLATFORM_AUTH_HEADERS = ['access-token', 'token-type', 'uid', 'client'];

export default {

  singleSignature: () => {
    cy.get('[data-testid="approver-sign-button"]').click();
    cy.get('[data-testid="password-field"]').type('password one two three');
    cy.waitForElementAndClick('.modal-buttons');
    cy.wait('@postSignature');
    cy.get('.e-signature-modal').should('not.exist');
  },

  ClickPrimaryActionButton: () => {
    // click on primary button
    cy.get('[data-testid="primary-button-action"]')
      .should('be.visible')
      .should('not.be.disabled')
      .should('exist')
      .click();
    cy.wait(['@patchProcedureSteps', '@getProcedures']);
  },

  doubleSignature: (verifier) => {
    cy.get('[data-testid="approver-sign-button"]').click();
    cy.get('[data-testid="password-field"]').type('password one two three');
    cy.waitForElementAndClick('.modal-buttons');
    cy.wait('@postSignature');
    cy.get('.e-signature-modal').should('not.exist');

    cy.get('[data-testid="verifier-sign-button"]').click();
    cy.get('#email').type(verifier);
    cy.get('[data-testid=password-field]').type('password one two three');
    cy.get('input[value="Sign Document"]').click();
    cy.wait('@postSignature');
    cy.wait('@getProcedures');
    cy.get('.e-signature-modal').should('not.exist');
  },

  loginAs: (username) => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('PLATFORM_URL')}/auth/sign_in`,
      body: { email: `${username}@vineti.com`, password: 'password one two three' },
      headers: {
        'TOKEN-TO-SKIP-SAML-AUTH': Cypress.env('TOKEN_TO_SKIP_SAML_AUTH'),
      },
    }).then(resp => {
      expect(resp.status).to.eq(200);
       PLATFORM_AUTH_HEADERS.forEach(header => {
        localStorage.setItem(header, resp.headers[header]);
      });
    });
  },

  logout: username => {
    cy.get('header',{timeout:60000});
    cy.get('header').then(($header) => {
      if ($header.text().includes('Subjects')) {
         common.loadCollection();
      };
    });
    cy.get("ul.list-pager > li:not(.next):not(.previous)",{timeout:90000});
    cy.get('ul.nav-links .nav-user',{timeout:60000});
    cy.contains(`${username}`).click();
    cy.get('.menu-action',{timeout:60000});
    cy.waitForElementAndClick('.menu-action');
    cy.wait('@logout',{timeout:90000})
  },
  
  loadCollection: ()=> {
    cy.wait(3000)
    cy.waitForElementAndClick(`div[data-testid="filter-appointment"]`);
    cy.waitForElementAndClick(`li[data-value="ALL"]`);
  },
  ConfirmTreatmentInformation: data => {
    cy.waitForElementAndClick('[data-testid="institution_id"] .select');
    cy.get(
      `[data-testid="institution_id"] .select-content li[role="option"]:nth-child(${
        data.institution_select_index
        })`
    ).then(() => {
      //close dropdown
      cy.waitForElementAndClick('[data-testid="institution_id"] .select');
    });
    // refactor to either have a helper method to select by index or change the data to be based on the displayed text instead of select index
    // open dropdown to get option's text of the expected select title
    cy.waitForElementAndClick('[data-testid="physician_user_id"] .select');
    cy.get(
      `[data-testid="physician_user_id"] .select-content li[role="option"]:nth-child(${
        data.prescriber_select_index
        })`
    ).then(() => {
      //close dropdown
      cy.waitForElementAndClick('[data-testid="physician_user_id"] .select');
    });
  },

  AddValueToReasonForChange: (text = 'test reason') => {
    cy.get('[data-testid="reason-for-change-textarea"]').type(text);
    cy.get('[data-testid="reason-for-change-save"]').click();
    cy.wait(['@patchProcedureSteps', '@getProcedures']);
  },
};
