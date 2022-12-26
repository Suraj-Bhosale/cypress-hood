import { setUpCapacity } from "./api_capacity"

describe('Add Capacity', () => {
  it('Add Capacity', () => {
    cy.request({
      method: 'POST',
      url: `${Cypress.env('PLATFORM_URL')}/auth/sign_in`,
      failOnStatusCode: false,
      headers: {
        'TOKEN-TO-SKIP-SAML-AUTH': Cypress.env('TOKEN_TO_SKIP_SAML_AUTH'),
      },
      body: {"email":"casper@vineti.com","password":"password one two three"}
    }).then((response) => {
     let statusCode = response.status;
     cy.log('Status code is :'+statusCode)
        for (let i=0; i<20; i++){
          if(statusCode == 200) {
            cy.platformLogin('casper@vineti.com', 'password one two three');
            cy.visit('/capacity');
            setUpCapacity(25, 70);
            break;
          }else {
            cy.wait(20000);
            cy.log('Status code is :'+statusCode)
          }
        }      
      })
  });
});
