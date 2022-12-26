// deprecated: use cy.loginApi(username, { password: 'asdf', content: 'jsonApi' })
const loginResponseToToken = (response, contentType) => {
  switch (contentType) {
    case 'jsonApi':
      contentType = 'application/vnd.api+json';
      break;
    case 'nonJsonApi':
      contentType = response.headers['content-type'];
      break;
    default:
      break;
  }

  return {
    'access-token': response.headers['access-token'],
    client: response.headers.client,
    uid: response.headers.uid,
    'content-type': contentType,
  };
};

export const loginApi = (
  username,
  password = 'password one two three',
  contentType = 'jsonApi'
) => {
  return cy
    .request({
      method: 'POST',
      url: `${Cypress.env('PLATFORM_URL')}/auth/sign_in`,
      body: {
        email: username,
        password,
      },
      headers: {
        'TOKEN-TO-SKIP-SAML-AUTH': Cypress.env('TOKEN_TO_SKIP_SAML_AUTH'),
      },
    })
    .should(response => {
      expect(response.status).to.eq(200, `API User "${username}" Login API call`);
      expect(response.headers.uid).to.eq(username);
    })
    .then(response => loginResponseToToken(response, contentType));
};

export const logoffApi = tokenData => {
  return cy
    .request({
      method: 'DELETE',
      url: `${Cypress.env('PLATFORM_URL')}/auth/sign_out`,
      headers: tokenData,
    })
    .should(response => {
      expect(response.status).to.eq(200, 'sign_out API call');
    });
};
