export const getToken = (signedToken, responseStatusCode = 200, failOnStatusCode = false) => {
  return cy
    .request({
      method: 'GET',
      url: `${Cypress.env('AUTHZ_URL')}/api/token`,
      headers: { Authorization: `Bearer ${signedToken}` },
      failOnStatusCode,
    })
    .should(response => {
      expect(response.status).to.eq(responseStatusCode);
    })
    .then(response => response.body);
};
