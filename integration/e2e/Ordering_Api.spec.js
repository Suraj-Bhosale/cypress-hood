import {
  createPatientQuery,
  mockPatientBaseInfo,
} from '../../utils/graphql/patients';
import {
  pollCreateOrderEventTransactions,
  failedEventErrors
} from '../../utils/graphql/notifications';
import {
  createOrderVariables,
  missingPropsOrderMutationRequest,
  orderMutationRequest,
  makeGraphqlCypressRequest
} from '../../utils/graphql';
import { getWso2AccessToken } from '../api/api_wso2'
import { getToken } from '../api/api_permission_token'
import { loginApi } from '../api/api_login';
import { forEach } from 'lodash';
import userSteps from '../users/_steps/index';
import faker from 'faker';
import { get } from 'lodash';
import { createApiUser } from '../api/api_api_users';
import { createClientIdentity } from '../api/api_client_identity';
import { globalPermissions } from '../rolesAndPermissions/_steps';

describe('Happy Path Ordering Api', () => {
  let apiFimUser = 'internal_ga_test_user@vineti.com';
  let apiFimUserPassword = 'Password123';

  let apiUserFirstName = faker.name.firstName();
  let apiUserLastName = faker.name.lastName();
  let apiUserEmail = faker.internet.email(apiUserFirstName);

  let apiUserId;

  let wso2ConsumerKey;
  let wso2ConsumerSecret;

  let tokenData;

  const failedEventBodyPath = 'attributes.payload.payload.events[0].body';


  let patientBaseInfo = mockPatientBaseInfo();
  const nonClinicalIdentifier = faker.random.alphaNumeric(10);

  let patientData = {
    ...patientBaseInfo,
    sites: [
      {
        resourceIdentifier: {
          identifierType: "external_site_id",
          identifier: "ESI-001"
        }
      },
    ],
    resourceIdentifiers: [
      {
        identifierType: 'Non-Clinical',
        identifier: nonClinicalIdentifier
      }
    ]
  };

  let patientsData = {
    patients: [patientData]
  };

  // US and EMEA contexts
  let executionContexts = {
    // 'cilta-cel-jnj-us-lclp': {
    //   product: 'Cilta-Cel',
    //   indication: 'jnj',
    //   region: 'US',
    //   workflowVariants: {
    //     cryoType: 'LOCAL',
    //     printingType: 'LOCAL',
    //     distributionCenter: 'NO',
    //     qualityRelease: 'NO'
    //   }
    // },
    'cilta-cel-jnj-us-cclp': {
      product: 'Cilta-Cel',
      indication: 'jnj',
      region: 'US',
      workflowVariants: {
        cryoType: 'CENTRAL',
        printingType: 'LOCAL',
        distributionCenter: 'NO',
        qualityRelease: 'NO'
      }
    },
    'cilta-cel-jnj-us-cmlp': {
      product: 'Cilta-Cel',
      indication: 'jnj',
      region: 'US',
      workflowVariants: {
        cryoType: 'RARITAN',
        printingType: 'LOCAL',
        distributionCenter: 'NO',
        qualityRelease: 'NO'
      }
    },
    'cilta-cel-jnj-emea-cclp-dc': {
      product: 'Cilta-Cel',
      indication: 'jnj',
      region: 'EU',
      workflowVariants: {
        cryoType: 'CENTRAL',
        printingType: 'LOCAL',
        distributionCenter: 'YES',
        qualityRelease: 'NO'
      }
    },
    'cilta-cel-jnj-emea-lclp-dc-qr': {
      product: 'Cilta-Cel',
      indication: 'jnj',
      region: 'EU',
      workflowVariants: {
        cryoType: 'LOCAL',
        printingType: 'LOCAL',
        distributionCenter: 'YES',
        qualityRelease: 'YES'
      }
    },
    'cilta-cel-jnj-emea-lclp-dc': {
      product: 'Cilta-Cel',
      indication: 'jnj',
      region: 'EU',
      workflowVariants: {
        cryoType: 'LOCAL',
        printingType: 'LOCAL',
        distributionCenter: 'YES',
        qualityRelease: 'NO'
      }
    },
    // 'cilta-cel-jnj-emea-cc': {
    //   product: 'Cilta-Cel',
    //   indication: 'jnj',
    //   region: 'EU',
    //   workflowVariants: {
    //     cryoType: 'CENTRAL',
    //     printingType: 'LOCAL',
    //     distributionCenter: 'NO',
    //     qualityRelease: 'NO'
    //   }
    // },
    'cilta-cel-jnj-emea-cclp-dc-qr': {
      product: 'Cilta-Cel',
      indication: 'jnj',
      region: 'EU',
      workflowVariants: {
        cryoType: 'CENTRAL',
        printingType: 'LOCAL',
        distributionCenter: 'YES',
        qualityRelease: 'YES'
      }
    },
    'cilta-cel-jnj-emea-lclp': {
      product: 'Cilta-Cel',
      indication: 'jnj',
      region: 'EU',
      workflowVariants: {
        cryoType: 'LOCAL',
        printingType: 'LOCAL',
        distributionCenter: 'NO',
        qualityRelease: 'NO'
      }
    },
    'cilta-cel-jnj-emea-cclp-qr': {
      product: 'Cilta-Cel',
      indication: 'jnj',
      region: 'EU',
      workflowVariants: {
        cryoType: 'CENTRAL',
        printingType: 'LOCAL',
        distributionCenter: 'NO',
        qualityRelease: 'YES'
      }
    },
    'cilta-cel-jnj-emea-lclp-qr': {
      product: 'Cilta-Cel',
      indication: 'jnj',
      region: 'EU',
      workflowVariants: {
        cryoType: 'LOCAL',
        printingType: 'LOCAL',
        distributionCenter: 'NO',
        qualityRelease: 'YES'
      }
    }
  };

  // let ecNames = ['cilta-cel-jnj-us-cclp','cilta-cel-jnj-emea-cclp-dc','cilta-cel-jnj-emea-cclp-qr','cilta-cel-jnj-us-cmlp','cilta-cel-jnj-emea-lclp-dc-qr','cilta-cel-jnj-emea-lclp'];

  // let executionContext = executionContexts[ecName];

  let ecDisplayNames = ['cilta-cel-jnj-us-central', 'cilta-cel-jnj-emea-cclp-dc', 'cilta-cel-jnj-emea-cclp-qr', 'cilta-cel-jnj-us-raritan', 'cilta-cel-jnj-emea-lclp-dc', 'cilta-cel-jnj-emea-lclp-dc-qr', 'cilta-cel-jnj-emea-cclp-dc-qr', 'cilta-cel-jnj-emea-lclp'];

  before(() => {
    cy.intercept('GET', '/user_roles').as('getAllRoles');
    cy.intercept('GET', '/execution_contexts').as('execution-contexts-list-request');
    cy.intercept('PATCH', /user_roles\/\d+/).as('userRole-update-request');
    cy.intercept('GET', '/v1/permissions').as('getPermissions');
    cy.intercept('PATCH', /user_roles\/\d+/).as('updateUserRole');
    cy.intercept('GET', /users\/\d+/).as('user-show-request');
    cy.intercept('GET', /access_contexts\?user_id=\d+/).as('access-contexts-list-request');
    cy.intercept('GET', '/base_permissions').as('basePermissions-list-request');
    cy.intercept('POST', '/user_roles/*/base_permissions').as('basePermission-create-request');
    cy.intercept('PATCH', /users\/\d+/).as('user-update-request');
    cy.intercept('GET', '/users').as('users-list-request');
    cy.intercept('GET', '/execution_contexts').as('getExecutionContexts');
    cy.intercept('GET', '/v1/institutions').as('getSites');
    cy.intercept('POST', '/access_contexts/batch_update').as(
      'access-contexts-batch-update-request'
    );
    cy.intercept('GET', /users\?page=\d+/).as('users-list-page');

    loginApi(apiFimUser, apiFimUserPassword)
      .then(token => {
        tokenData = token;
        createApiUser({
          first_name: apiUserFirstName,
          last_name: apiUserLastName,
          email: apiUserEmail,
          phone_number: '1000000',
          country_code: 'US',
          belongs_to_all_institutions: true,
          headers: tokenData,
        });
      })
      .then(response => {
        apiUserId = get(response, 'body.data.id');
        createClientIdentity({
          default: true,
          name: apiUserFirstName,
          user_email: apiUserEmail,
          headers: tokenData,
        })
          .then(response => {
            wso2ConsumerKey = response.body.data.attributes.wso2_consumer_key;
            wso2ConsumerSecret = response.body.data.attributes.wso2_consumer_secret;
          })
          .then(_response => {
            userSteps.addTherapyAccess(
              apiUserId,
              'ordering_nurse_cilta',
              ecDisplayNames
            );
            userSteps.AssignGlobalRole('ordering_nurse_global');
            userSteps.AssignSitesToUser(apiUserId, ['Test COE 1', 'Test COE 2', 'Test COE 3']);
          })
          .then(_response => {
            cy.visit('/roles');
            cy.contains('ordering_nurse_global').click();
            cy.contains('GLOBAL PERMISSIONS').click();
          })
          .then(_response => {
            globalPermissions.AssignPermissionsToGlobalRole()
          })
          .then(_response => {
            getWso2AccessToken(wso2ConsumerKey, wso2ConsumerSecret)
              .then((authnResponse) => {
                expect(authnResponse).not.to.have.property('errors');
                getToken(authnResponse)
                  .then((authzResponse) => {
                    expect(authzResponse).not.to.have.property('errors');
                    expect(authzResponse).to.have.property('authorizationToken');
                    tokenData["X-AuthZ-Header"] = authzResponse.authorizationToken;
                    tokenData["Authorization"] = `Bearer ${authnResponse}`
                  })
              })
          })
          .then(_response => {
            loginApi(apiFimUser, apiFimUserPassword);
          })
          .then(token => {
            makeGraphqlCypressRequest(
              createPatientQuery,
              patientsData,
              { tokenData: token, skipSamlAuthToken: true }
            );
          })
          .then(response => {
            expect(response.status).to.eq(200);
            expect(response.body).not.to.have.property('errors');
          })
      })
  })


  context('when mutation is asynchronous (createApprovedOrderTransaction)', () => {

    let mutationQuery = 'createApprovedOrderTransaction';

    let mutationResponse = `
      transaction {
        uuid
      }
    `;

    let cois = {};

    let approvedOrdersIdentifiers = {};

    let uuid;

    let approvedOrdersUuids = {};

    let orderFailedEvent = "create_approved_order_failed";

    let orderApprovedEvent = "create_approved_order_completed";

    context('and checking the asynchronous response transaction', () => {

      it('selects an execution context and returns an order object', () => {
        // iterates over all the ecs
        forEach(executionContexts, (executionContext, ecKey) => {

          const orderVariables = createOrderVariables(executionContext, patientData);
          makeGraphqlCypressRequest(
            orderMutationRequest(mutationQuery, mutationResponse, ecKey),
            orderVariables,
            { tokenData, skipSamlAuthToken: true }
          )
            .then(response => {
              uuid = response.body.data.createApprovedOrderTransaction.transaction.uuid;
              expect(response).not.to.have.property('errors');
              expect(uuid).to.have.lengthOf(36);
            })
            .then(() => {
              loginApi(apiFimUser, apiFimUserPassword)
                .then(response => {
                  const userToken = response;
                  pollCreateOrderEventTransactions(
                    userToken,
                    uuid,
                    orderApprovedEvent
                  )
                })
            })
            .then(response => {
              const bodyPath = 'attributes.payload.events[0].body';
              expect(get(response, bodyPath)).not.to.have.property('errors');
              expect(get(response, bodyPath)).to.have.property('order');
              expect(get(response, `${bodyPath}.order`)).to.have.property('coi');
              cois[`${ecKey}`] = get(response, `${bodyPath}.order.coi`);
              approvedOrdersIdentifiers[`${ecKey}`] = orderVariables.orderIdentifier;
              approvedOrdersUuids[`${ecKey}`] = uuid;
            });
        });
      });

      it('returns an error if a patient is not found', () => {

        forEach(executionContexts, (executionContext, ecKey) => {

          const orderVariables = createOrderVariables(executionContext, patientData);

          orderVariables.nonClinicalIdentifier = "invalid value";
          orderVariables.nonClinicalIdentifierType = "invalid value";

          makeGraphqlCypressRequest(
            orderMutationRequest(mutationQuery, mutationResponse, ecKey),
            orderVariables,
            { tokenData, skipSamlAuthToken: true }
          )
            .then(response => {
              uuid = response.body.data.createApprovedOrderTransaction.transaction.uuid;
              expect(response).not.to.have.property('errors');
              expect(uuid).to.have.lengthOf(36);
            })
            .then(() => {
              loginApi(apiFimUser, apiFimUserPassword)
                .then(response => {
                  const userToken = response;
                  pollCreateOrderEventTransactions(
                    userToken,
                    uuid,
                    orderFailedEvent
                  )
                    .then(events => {
                      const event = failedEventErrors(events, uuid);
                      expect(get(event, failedEventBodyPath)).to.have.property('errors');
                      expect(get(event, `${failedEventBodyPath}.errors[0]`)).to.deep.eq(
                        {
                          "path": ["patient"],
                          "status": "not_found",
                          "message": ["Patient cannot be found."]
                        }
                      )
                    });
                })
            })

        })

      });

      it('returns an error if an execution context is not found', () => {

        forEach(executionContexts, (executionContext, ecKey) => {
          const orderVariables = createOrderVariables(executionContext, patientData);

          orderVariables.region = 'FOO';

          makeGraphqlCypressRequest(
            orderMutationRequest(mutationQuery, mutationResponse),
            orderVariables,
            { tokenData, skipSamlAuthToken: true }
          )
            .then(response => {
              uuid = response.body.data.createApprovedOrderTransaction.transaction.uuid;
              expect(response).not.to.have.property('errors');
              expect(uuid).to.have.lengthOf(36);
            })
            .then(() => {
              loginApi(apiFimUser, apiFimUserPassword)
                .then(response => {
                  const userToken = response;
                  pollCreateOrderEventTransactions(
                    userToken,
                    uuid,
                    orderFailedEvent
                  )
                    .then(events => {
                      const event = failedEventErrors(events, uuid);
                      expect(get(event, failedEventBodyPath)).to.have.property('errors');
                      expect(get(event, `${failedEventBodyPath}.errors[0]`)).to.deep.eq(
                        {
                          "path": [],
                          "status": "unprocessable_entity",
                          "message": ["No Execution Context models found."]
                        }
                      )
                    });
                })
            })
        })
      });

      it('returns an error if an institution is not found', () => {

        forEach(executionContexts, (executionContext, ecKey) => {

          const orderVariables = createOrderVariables(executionContext, patientData);

          const fakeIdentifier = 'FOO'

          orderVariables.collectionSiteIdentifier = fakeIdentifier;

          makeGraphqlCypressRequest(
            orderMutationRequest(mutationQuery, mutationResponse, ecKey),
            orderVariables,
            { tokenData, skipSamlAuthToken: true }
          )
            .then(response => {
              uuid = response.body.data.createApprovedOrderTransaction.transaction.uuid;
              expect(response).not.to.have.property('errors');
              expect(uuid).to.have.lengthOf(36);
            })
            .then(() => {
              loginApi(apiFimUser, apiFimUserPassword)
                .then(response => {
                  const userToken = response;
                  pollCreateOrderEventTransactions(
                    userToken,
                    uuid,
                    orderFailedEvent
                  )
                    .then(events => {
                      const event = failedEventErrors(events, uuid);
                      expect(get(event, failedEventBodyPath)).to.have.property('errors');
                      expect(get(event, `${failedEventBodyPath}.errors[0]`)).to.deep.eq(
                        {
                          "path": ["uuid/identifier"],
                          "status": "not_found",
                          "message": [`Active Institutions with these resource identifiers were not found: ${fakeIdentifier}, ${fakeIdentifier}`]
                        }
                      )
                    });
                })
            })
        })
      });
    });

    context('returns synchronous errors if the request is wrong', () => {
      it('when a data type is incorrect', () => {

        forEach(executionContexts, (executionContext, ecKey) => {

          const orderVariables = createOrderVariables(executionContext, patientData);
          orderVariables.orderIdentifier = 12345;

          makeGraphqlCypressRequest(
            orderMutationRequest(mutationQuery, mutationResponse, ecKey),
            orderVariables,
            { tokenData, skipSamlAuthToken: true }
          )
            .then(response => {
              expect(response.body).to.have.property('errors')
              expect(response.body.errors[0].message).to.eq(
                `Variable "$orderIdentifier" got invalid value ${orderVariables.orderIdentifier}; String cannot represent a non string value: ${orderVariables.orderIdentifier}`
              )
              expect(response.body).not.to.have.property('data');
            });
        })

      });

      it('when required fields are missing', () => {

        forEach(executionContexts, (executionContext) => {
          const orderVariables = createOrderVariables(executionContext, patientData);

          makeGraphqlCypressRequest(
            missingPropsOrderMutationRequest(mutationQuery, mutationResponse),
            orderVariables,
            { tokenData, skipSamlAuthToken: true }
          )
            .then(response => {
              expect(response.body).to.have.property('errors')
              expect(response.body.errors[0].message).to.eq(
                `Field "CreateApprovedOrderTransactionInput.patient" of required type "PatientInput!" was not provided.`
              )
              expect(response.body).not.to.have.property('data');
            });
        })
      });

      it('when a patient is not found', () => {

        forEach(executionContexts, (executionContext, ecKey) => {
          const orderVariables = createOrderVariables(executionContext, patientData);

          orderVariables.nonClinicalIdentifier = null;
          orderVariables.nonClinicalIdentifierType = null;

          makeGraphqlCypressRequest(
            orderMutationRequest(mutationQuery, mutationResponse, ecKey),
            orderVariables,
            { tokenData, skipSamlAuthToken: true }
          )
            .then(response => {
              expect(response.body).to.have.property('errors')
              expect(response.body.errors[0].message).to.eq(
                `Variable "$nonClinicalIdentifier" of non-null type "String!" must not be null.`
              )
              expect(response.body).not.to.have.property('data');
            });
        })
      });

      it('when an execution context is not found', () => {

        forEach(executionContexts, (executionContext, ecKey) => {
          const orderVariables = createOrderVariables(executionContext, patientData);

          orderVariables.region = null;

          makeGraphqlCypressRequest(
            orderMutationRequest(mutationQuery, mutationResponse, ecKey),
            orderVariables,
            { tokenData, skipSamlAuthToken: true }
          )
            .then(response => {
              expect(response.body).to.have.property('errors')
              expect(response.body.errors[0].message).to.eq(
                `Variable "$region" of non-null type "String!" must not be null.`
              )
              expect(response.body).not.to.have.property('data');
            });
        })

      });

      it('when institutions are not found', () => {

        forEach(executionContexts, (executionContext, ecKey) => {
          const orderVariables = createOrderVariables(executionContext, patientData);

          orderVariables.collectionSiteIdentifier = 'FOO';

          makeGraphqlCypressRequest(
            orderMutationRequest(mutationQuery, mutationResponse, ecKey),
            orderVariables,
            { tokenData, skipSamlAuthToken: true }
          )
            .then(response => {
              expect(response.body.errors).to.be.eq(undefined);
              expect(response.body.data.createApprovedOrderTransaction.transaction.uuid).to.exist
            });
        })
      });

      it('when region is not defined', () => {

        forEach(executionContexts, (executionContext, ecKey) => {
          const orderVariables = createOrderVariables(executionContext, patientData);
          orderVariables.region = null;

          makeGraphqlCypressRequest(
            orderMutationRequest(mutationQuery, mutationResponse, ecKey),
            orderVariables,
            { tokenData, skipSamlAuthToken: true }
          )
            .then(response => {
              expect(response.body).to.have.property('errors');
              expect(response.body.errors[0].message).to.be.eq(
                `Variable "$region" of non-null type "String!" must not be null.`
              );
            });
        })
      });

      it('when product is not defined', () => {

        forEach(executionContexts, (executionContext, ecKey) => {
          const orderVariables = createOrderVariables(executionContext, patientData);
          orderVariables.product = null;

          makeGraphqlCypressRequest(
            orderMutationRequest(mutationQuery, mutationResponse, ecKey),
            orderVariables,
            { tokenData, skipSamlAuthToken: true }
          )
            .then(response => {
              expect(response.body).to.have.property('errors');
              expect(response.body.errors[0].message).to.be.eq(
                `Variable "$product" of non-null type "String!" must not be null.`
              );
            });
        })
      });

      it('when indication is not defined', () => {

        forEach(executionContexts, (executionContext, ecKey) => {
          const orderVariables = createOrderVariables(executionContext, patientData);
          orderVariables.indication = null;

          makeGraphqlCypressRequest(
            orderMutationRequest(mutationQuery, mutationResponse, ecKey),
            orderVariables,
            { tokenData, skipSamlAuthToken: true }
          )
            .then(response => {
              expect(response.body).to.have.property('errors');
              expect(response.body.errors[0].message).to.be.eq(
                `Variable "$indication" of non-null type "String!" must not be null.`
              );
            });
        })
      });

      it('when milestones are not defined', () => {

        forEach(executionContexts, (executionContext, ecKey) => {
          const orderVariables = createOrderVariables(executionContext, patientData);
          orderVariables.collectionSiteIdentifier = null;

          makeGraphqlCypressRequest(
            orderMutationRequest(mutationQuery, mutationResponse, ecKey),
            orderVariables,
            { tokenData, skipSamlAuthToken: true }
          )
            .then(response => {
              expect(response.body).to.have.property('errors');
              expect(response.body.errors[0].message).to.be.eq(
                `Variable "$collectionSiteIdentifier" of non-null type "String!" must not be null.`
              );
            });
        })

      });
    });

    context('sends the succesfull transaction to the webhook', () => {

      let payloads = {};

      let eventNamePaths = {};

      let bodyPaths = {};

      let bodyPath = 'event.body';

      let eventNamePath = 'event.eventName';

      let requests;


      it('visits the webhook site and checks if the succesfull transaction is there', () => {


        cy.request({
          url: Cypress.env('WEBHOOK_SITE_API_URL'),
          method: 'GET'
        })
          .then(response => {
            requests = get(JSON.parse(JSON.stringify(response)), 'body.data');

            let postRequests = requests.filter(request => get(request, 'method') === 'POST');

            forEach(executionContexts, (_executionContext, ecKey) => {
              let transactionData = postRequests.find(request => {
                let requestContent = get(request, 'content')
                let payloadObject = JSON.parse(requestContent);
                let correctUuid = get(payloadObject, 'event.body.transaction.uuid') === approvedOrdersUuids[`${ecKey}`];
                let correctCoi = get(payloadObject, 'event.body.order.coi') === cois[`${ecKey}`];
                let correctUuidLongPath = get(payloadObject, 'events[0].body.transaction.uuid') === approvedOrdersUuids[`${ecKey}`];
                let correctCoiLongPath = get(payloadObject, 'events[0].body.order.coi') === cois[`${ecKey}`];
                if (correctUuidLongPath || correctCoiLongPath) {
                  bodyPath = 'events[0].body'
                  eventNamePath = 'events[0].event_name'
                }
                return (correctUuid || correctUuidLongPath) && (correctCoi || correctCoiLongPath)
              })

              eventNamePaths[`${ecKey}`] = eventNamePath;
              bodyPaths[`${ecKey}`] = bodyPath;
              payloads[`${ecKey}`] = JSON.parse(get(transactionData, 'content'));
            })
          })
      })

      it('The payload\'s event name is correct.', () => {
        forEach(executionContexts, (_executionContext, ecKey) => {
          let payload = payloads[`${ecKey}`];
          let eventNamePath = eventNamePaths[`${ecKey}`];
          expect(get(payload, eventNamePath)).to.eq(orderApprovedEvent);
        })
      })


      it('The payload has attribute order.', () => {
        forEach(executionContexts, (_executionContext, ecKey) => {
          let payload = payloads[`${ecKey}`];
          let bodyPath = bodyPaths[`${ecKey}`];
          expect(get(payload, `${bodyPath}`)).to.have.property('order');
        })
      })


      it('The order has correct resourceIdentifiers.', () => {
        forEach(executionContexts, (_executionContext, ecKey) => {
          let payload = payloads[`${ecKey}`];
          let orderIdentifier = approvedOrdersIdentifiers[`${ecKey}`];
          let bodyPath = bodyPaths[`${ecKey}`];
          expect(get(payload, `${bodyPath}.order`)).to.have.property('resourceIdentifiers');
          expect(get(payload, `${bodyPath}.order.resourceIdentifiers[0]`)).to.have.property('identifier');
          expect(get(payload, `${bodyPath}.order.resourceIdentifiers[0].identifier`)).to.eq(orderIdentifier);
        })
      })

      it('The order has attribute treatment.', () => {
        forEach(executionContexts, (_executionContext, ecKey) => {
          let payload = payloads[`${ecKey}`];
          let bodyPath = bodyPaths[`${ecKey}`];
          expect(get(payload, `${bodyPath}.order`)).to.have.property('treatment');
        })
      })

      it('The treatment has attibute schedule', () => {
        forEach(executionContexts, (_executionContext, ecKey) => {
          let payload = payloads[`${ecKey}`];
          let bodyPath = bodyPaths[`${ecKey}`];
          expect(get(payload, `${bodyPath}.order.treatment`)).to.have.property('schedule');
        })
      })

      it('The schedule has attribute milestones', () => {
        forEach(executionContexts, (_executionContext, ecKey) => {
          let payload = payloads[`${ecKey}`];
          let bodyPath = bodyPaths[`${ecKey}`];
          expect(get(payload, `${bodyPath}.order.treatment.schedule`)).to.have.property('milestones');
          expect(get(payload, `${bodyPath}.order.treatment.schedule.milestones`).length).to.be.greaterThan(1);
        })
      })

    })
  });
});
