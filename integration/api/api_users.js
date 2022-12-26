const USER_TYPE = 'users';
import faker from 'faker';

export const getAllUsers = (tokenData, failOnStatusCode = true, responseStatusCode = 200) => {
  return cy
    .request({
      failOnStatusCode,
      method: 'GET',
      url: `${Cypress.env('PLATFORM_URL')}/users`,
      headers: tokenData,
    })
    .should(response => {
      expect(response.status).to.eq(responseStatusCode, 'User List API call');
      if (responseStatusCode === 200) {
        response.body.data.forEach(user => expect(user.type).to.eq(USER_TYPE));
      }
    })
    .then(data => {
      return data.body;
    });
};

export const getUserById = (tokenData, userId) => {
  return cy
    .request({
      method: 'GET',
      url: `${Cypress.env('PLATFORM_URL')}/users/${userId}`,
      headers: tokenData,
    })
    .then(data => {
      return data.body;
    });
};

export const getUserInfo = (response, email) =>
  response.data.find(user => user.attributes.email === email);

export const updateUserInfo = (
  tokenData,
  userInfo,
  failOnStatusCode = true,
  responseStatusCode = 200
) => {
  return cy
    .request({
      failOnStatusCode,
      method: 'PATCH',
      url: `${Cypress.env('PLATFORM_URL')}/users/${userInfo.id}`,
      headers: tokenData,
      body: {
        data: userInfo,
      },
    })
    .should(response => {
      expect(response.status).to.eq(
        responseStatusCode,
        `Update User with ID "${userInfo.id}" API call`
      );
      if (responseStatusCode === 200) {
        expect(response.body.data.type).to.eq(USER_TYPE);
      }
    })
    .then(response => response);
};

export const updateUserLanguage = (tokenData, userInfo) => {
  return cy.request({
    method: 'PATCH',
    url: `${Cypress.env('PLATFORM_URL')}/users/${userInfo.id}/update_preferred_language/${
      userInfo.id
    }`,
    headers: tokenData,
    body: {
      data: userInfo,
    },
  });
};

export const createApiUser = (tokenData, userObject = {}) => {
  return cy
    .request({
      method: 'POST',
      url: `${Cypress.env('PLATFORM_URL')}/api_users`,
      headers: tokenData,
      form: true,
      body: {
        'user[first_name]': userObject.firstName ? userObject.firstName : faker.name.firstName(),
        'user[last_name]': userObject.lastName ? userObject.lastName : faker.name.lastName(),
        'user[email]': userObject.email ? userObject.email : faker.internet.email(),
        'user[phone_number]': userObject.phoneNumber
          ? userObject.phoneNumber
          : faker.phone.phoneNumber(),
        'user[country_code]': userObject.countryCode ? userObject.countryCode : 'US',
        'user[belongs_to_all_institutions]': userObject.isBelongToAllInstitutions
          ? userObject.isBelongToAllInstitutions
          : true,
      },
    })
    .then(response => response.body);
};

export const updateApiUser = ({ id, first_name, last_name, email, headers }) => {
  return cy.request({
    method: 'PATCH',
    url: `${Cypress.env('PLATFORM_URL')}/api_users/${id}`,
    body: {
      user: {
        first_name,
        last_name,
        email,
      },
    },
    headers,
  });
};

