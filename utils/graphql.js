import faker from 'faker';

const makeGraphqlCypressParams = (query, variables = {}, failOnStatusCode = false) => {
  return {
    method: 'POST',
    url: `${Cypress.env('GATEWAY_URL')}/graphql`,
    body: { query, variables }, // or { query: query } depending if you are writing with es6
    failOnStatusCode, // not a must but in case the fail code is not 200 / 400
  };
};

const makeGraphqlCypressHeaders = (tokenData, skipSamlAuthToken = false) => {
  const headers = Object.assign(tokenData, {
    'content-type': 'application/json',
  });

  if (skipSamlAuthToken) {
    headers['TOKEN-TO-SKIP-SAML-AUTH'] = Cypress.env('TOKEN_TO_SKIP_SAML_AUTH');
  }

  return {
    headers,
  };
};

export const makeGraphqlCypressRequest = (query, variables, options, failOnStatusCode = false) => {
  const { tokenData, skipSamlAuthToken } = options;
  const params = makeGraphqlCypressParams(query, variables, failOnStatusCode);
  const headers = makeGraphqlCypressHeaders(tokenData, skipSamlAuthToken);
  const data = Object.assign({}, params, headers);
  return cy.request(data);
};

export const templateQuery_createPatients = patients => {
  let patientsArrayString = '[';
  patients.forEach(patient => {
    const patientString = JSON.stringify(patient);
    const unquotedPatientString = patientString.replace(/"([^"]+)":/g, '$1:');
    patientsArrayString = patientsArrayString.concat(unquotedPatientString, ',');
  });
  patientsArrayString = patientsArrayString.concat(']');

  const query =
    'mutation { createPatients( input: { patients:' +
    patientsArrayString +
    `} ) {
    patients {
      id
      dob
      firstName
      middleName
      lastName
      initials
      phoneNumber
      email
      biologicalSex
      gender
      vinetiCorePatientId
      customWeight
      resourceIdentifiers {
        id
        identifierType
        identifier
      }
      sites {
        uuid
        resourceIdentifiers {
          identifierType
          identifier
        }
      }
    } } }`;

  return query;
};

export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const createOrderVariables = (executionContext, patientData) => {
  return {
    "product": executionContext.product,
    "indication": executionContext.indication,
    "region": executionContext.region,
    "workflowVariants": executionContext.workflowVariants,
    "orderIdentifier": faker.random.alphaNumeric(8),
    "orderIdentifierType": 'external order',
    "orderingSiteIdentifier": patientData.sites[0].resourceIdentifier.identifier,
    "orderingSiteIdentifierType": patientData.sites[0].resourceIdentifier.identifierType,
    "collectionSiteIdentifier": "ESI-002",
    "collectionSiteIdentifierType": "external_site_id",
    "nonClinicalIdentifier": patientData.resourceIdentifiers[0].identifier,
    "nonClinicalIdentifierType": patientData.resourceIdentifiers[0].identifierType,
    "dateTime": "2021-09-20T22:52:08Z",
    "medicalRecordNumber": faker.random.alphaNumeric(4)
  }
};

export const missingPropsOrderMutationRequest = (mutationQuery, mutationResponse) => {
  return `
    mutation(
      $product: String
      $indication: String
      $region: String
      $workflowVariants: JSON
      $orderIdentifier: String
      $orderIdentifierType: String
      $collectionSiteIdentifier: String
      $collectionSiteIdentifierType: String
    ) {
      ${mutationQuery}(input: {
        product: $product,
        indication: $indication,
        region: $region,
        workflowVariants: $workflowVariants,
        resourceIdentifiers: [
          {
            identifier: $orderIdentifier,
            identifierType: $orderIdentifierType,
          }
        ],
        milestones: [
          {
            capability: "collection",
            name: "apheresis_date",
            site: {
              resourceIdentifier: {
                identifier: $collectionSiteIdentifier,
                identifierType: $collectionSiteIdentifierType
              }
            }
          }
        ]
      }) {
        ${mutationResponse}
      }
    }
  `
};

export const orderMutationRequest = (mutationQuery, mutationResponse, executionContext) => {
  let simplifiedQuery = 
    `mutation(
      $nonClinicalIdentifier: String!
      $nonClinicalIdentifierType: String!
      $product: String!
      $indication: String!
      $region: String!
      $workflowVariants: JSON
      $orderIdentifier: String!
      $orderIdentifierType: String!
      $orderingSiteIdentifier: String!
      $orderingSiteIdentifierType: String!
      $collectionSiteIdentifier: String!
      $collectionSiteIdentifierType: String!
      $dateTime: DateTime!
      $medicalRecordNumber: String!
    ) {
      ${mutationQuery}(input: {
        patient: {
            resourceIdentifier: {
                identifier: $nonClinicalIdentifier,
                identifierType: $nonClinicalIdentifierType,
            },
        },
        product: $product,
        indication: $indication,
        region: $region,
        workflowVariants: $workflowVariants,
        resourceIdentifiers: [
            {
                identifier: $orderIdentifier,
                identifierType: $orderIdentifierType,
            }
        ],
        site: {
            resourceIdentifier: {
                identifier: $orderingSiteIdentifier,
                identifierType: $orderingSiteIdentifierType
            }
        },
        customFields: {
            medicalRecordNumber: $medicalRecordNumber,
            resourceIdentifier: $orderIdentifier
        },
        milestones: [
            {
                name: "apheresis_date",
                dateTime: $dateTime, 
                site: {
                    resourceIdentifier: {
                        identifier: $collectionSiteIdentifier,
                        identifierType: $collectionSiteIdentifierType
                    }
                }
            },
            {
                name: "receipt_at_clinical_site",
                site: {
                    resourceIdentifier: {
                        identifier: $collectionSiteIdentifier,
                        identifierType: $collectionSiteIdentifierType
                    }
                }
            }
        ]
      }) {
        ${mutationResponse}
      }
    }
    `
  switch(executionContext){
    case 'cilta-cel-jnj-us-cclp':
    case 'cilta-cel-jnj-emea-cclp-dc':
    case 'cilta-cel-jnj-emea-cclp-qr':
    case 'cilta-cel-jnj-us-cmlp':
    case 'cilta-cel-jnj-emea-lclp-dc-qr':
    case 'cilta-cel-jnj-emea-cclp-dc-qr':
    case 'cilta-cel-jnj-emea-lclp':
      return simplifiedQuery
    default: 
      return simplifiedQuery;
  }
};