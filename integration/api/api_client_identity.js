export const createClientIdentity = ({
  user_email,
  name,
  isDefault = true,
  headers,
  failOnStatusCode = true,
}) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('PLATFORM_URL')}/client_identities`,
    body: {
      data: {
        attributes: {
          default: isDefault,
          name,
          user_email,
        },
        type: 'client_identity',
      },
    },
    headers,
    failOnStatusCode,
  });
};

export const deleteClientIdentity = ({ id, headers }) => {
  return cy.request({
    method: 'DELETE',
    url: `${Cypress.env('PLATFORM_URL')}/client_identities/${id}`,
    headers,
  });
};

export const reactivateClientIdentity = ({ id, headers }) => {
  return cy.request({
    method: 'PUT',
    url: `${Cypress.env('PLATFORM_URL')}/client_identities/${id}/reactivate`,
    headers,
  });
};

export const regenerateClientIdentity = ({ id, headers }) => {
  return cy.request({
    method: 'PUT',
    url: `${Cypress.env('PLATFORM_URL')}/client_identities/${id}/regenerate`,
    headers,
  });
};
