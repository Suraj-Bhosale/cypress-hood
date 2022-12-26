export const getWso2AccessToken = (username, password, isFullResponseRequired = false) => {
  const credentials = Buffer.from(`${username}:${password}`).toString('base64');
  const auth = `Basic ${credentials}`;
  return cy
    .request({
      method: 'POST',
      url: `${Cypress.env('WSO2_URL')}/token`,
      body: {
        grant_type: 'client_credentials',
      },
      headers: {
        Authorization: auth,
        accept: '*/*',
        'content-type': 'application/x-www-form-urlencoded',
      },
    })
    .should(response => {
      expect(response.status).to.eq(200, 'Get wso2 token');
    })
    .then(response => {
      if (isFullResponseRequired) {
        return response;
      }
      return response.body.access_token;
    });
};
