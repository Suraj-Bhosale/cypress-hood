export const createApiUser = ({
  first_name,
  last_name,
  email,
  phone_number = '123456',
  country_code = 'US',
  belongs_to_all_institutions = true,
  headers,
}) => {
  return cy.request({
    method: 'POST',
    url: `${Cypress.env('PLATFORM_URL')}/api_users`,
    body: {
      data: {
        attributes: {
          first_name,
          last_name,
          email,
          phone_number,
          country_code,
          belongs_to_all_institutions,
        },
        type: 'user',
      },
    },
    headers,
  });
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

export const deactivateApiUser = ({ id, headers }) => {
  return cy.request({
    method: 'PUT',
    url: `${Cypress.env('PLATFORM_URL')}/api_users/${id}/deactivate`,
    headers,
  });
};

export const reactivateApiUser = ({ id, headers }) => {
  return cy.request({
    method: 'PUT',
    url: `${Cypress.env('PLATFORM_URL')}/api_users/${id}/reactivate`,
    headers,
  });
};
