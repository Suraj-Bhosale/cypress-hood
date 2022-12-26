import order_steps from '../../utils/HappyPath_steps/CMLP_CILTA_RARITAN_HappyPath/ordering_steps_cilta';
import col_steps from '../../utils/HappyPath_steps/CMLP_CILTA_RARITAN_HappyPath/collection_steps_cilta';
import m_steps from '../../utils/HappyPath_steps/CMLP_CILTA_RARITAN_HappyPath/manufacturing_steps_cilta.js';
import inf_steps from '../../utils/HappyPath_steps/CMLP_CILTA_RARITAN_HappyPath/infusion_steps_cilta';
import sat_steps from '../../utils/HappyPath_steps/CMLP_CILTA_RARITAN_HappyPath/satelite_lab_steps_cilta'
import header from '../../fixtures/assertions.json';
import input from '../../fixtures/inputs.json';
import therapies from '../../fixtures/therapy.json'

import faker from 'faker';
import {
  createPatientQuery,
  mockPatientBaseInfo,
} from '../../utils/graphql/patients';
import {
  pollCreateOrderEventTransactions,
} from '../../utils/graphql/notifications';
import { getWso2AccessToken } from '../api/api_wso2'
import { getToken } from '../api/api_permission_token'
import { loginApi } from '../api/api_login';
import { get } from 'lodash';
import { createApiUser } from '../api/api_api_users';
import { createClientIdentity } from '../api/api_client_identity';
import { globalPermissions } from '../rolesAndPermissions/_steps';
import userSteps from '../users/_steps/index';
import common from '../../support/index';
import {
  createOrderVariables,
  orderMutationRequest,
  makeGraphqlCypressRequest
} from '../../utils/graphql';

context('US CMLP CILTA Therapy Happy Path', () => {

  let apiFimUser = 'internal_ga_test_user@vineti.com';
  let apiFimUserPassword = 'Password123';

  let apiUserFirstName = faker.name.firstName();
  let apiUserLastName = faker.name.lastName();
  let apiUserEmail = faker.internet.email(apiUserFirstName);

  let apiUserId;

  let wso2ConsumerKey;
  let wso2ConsumerSecret;

  let tokenData;

  const generateRandomNumber = () => {
    //generate a random 3 digit number
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

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
    patients: [ patientData ]
  };

  const executionContext = {
    product: 'Cilta-Cel',
    indication: 'jnj',
    region: 'US',
    workflowVariants: {
      cryoType: 'RARITAN',
      printingType: 'LOCAL',
      distributionCenter: 'NO',
      qualityRelease: 'NO'
    }
  }

  const institutions = ['Test COE 1 (US)', 'Test COE 2', 'Test COE 3'];

  before(() => {
    cy.intercept('GET', '/user_roles').as('getAllRoles');
    cy.intercept('GET', '/execution_contexts').as('execution-contexts-list-request');
    cy.intercept('PATCH', /user_roles\/\d+/).as('userRole-update-request');
    cy.intercept('GET', '/v1/permissions').as('getPermissions');
    cy.intercept('PATCH', /user_roles\/\d+/).as('updatUSserRole');
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

    loginApi(apiFimUser,apiFimUserPassword)
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
      apiUserId = get(response,'body.data.id');
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
          ['cilta-cel-jnj-us-raritan']
        );
        userSteps.AssignGlobalRole('ordering_nurse_global');
        userSteps.AssignSitesToUser(apiUserId, institutions);
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

  beforeEach(() => {
    cy.server();
    cy.route('DELETE', '/auth/sign_out').as('logout');
    cy.route('GET', '/physicians*').as('getStepPhysicians');
    cy.route('POST', '/signatures').as('postSignature');
    cy.route('POST', '/graphql').as('patients');
    cy.route('GET', '/therapies').as('products');
    cy.route('GET', '/scheduling/milestone_definitions/*').as('schedulingMilestones');
    cy.route('POST', '/procedures').as('postProcedures');
    cy.route('PATCH', '/procedure_steps/*').as('patchProcedureSteps');
    cy.route('GET', '/procedures/*').as('getProcedures');
    cy.route('GET', '/scheduling/schedules/*').as('schedulingServiceSchedule');
    cy.route('POST', '/scheduling/schedules').as('schedulingServiceCreate');
    cy.route('POST', new RegExp('/scheduling/schedules/US:Cilta-Cel:jnj/draft')).as(
      'schedulingServiceDraft'
    );
    cy.route('POST', new RegExp('/scheduling/schedules/US:Cilta-Cel:jnj/availability')).as(
      'schedulingServiceAvailability'
    );
    cy.route('GET', '/procedures?procedure_type=ordering').as('getProcedureTypeOrdering');
    cy.route('POST', '/print').as('postPrint');
    cy.route('POST', '/label_scans/verifications').as('labelVerifications');
    cy.route('POST', '/label_scans/values').as('createLabelScanValue');
    cy.route('GET', 'v1/institution_types').as('getInstitutions');
  });

  const scope = {};
  const region = 'US';
  const therapy = therapies.cmlp_cilta;

  it('Creates and Approves an order through api', () => {

    let mutationQuery = 'createApprovedOrderTransaction';

    let mutationResponse = `
      transaction {
        uuid
      }
    `;

    let uuid;

    const orderApprovedEvent = "create_approved_order_completed";

    const orderVariables = createOrderVariables(executionContext, patientData);
    makeGraphqlCypressRequest(
      orderMutationRequest(mutationQuery, mutationResponse, 'cilta-cel-jnj-us-cmlp'),
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
      expect(get(response,bodyPath)).not.to.have.property('errors');
      expect(get(response,bodyPath)).to.have.property('order');
      expect(get(response,`${bodyPath}.order`)).to.have.property('coi');
      scope.coi = get(response,`${bodyPath}.order.coi`);
      scope.orderIdentifier = orderVariables.orderIdentifier;
      scope.patientInformation = {
        patientId: patientData.resourceIdentifiers[0].identifier,
        orderingLotNumber: generateRandomNumber(),
        firstName: patientData.firstName,
        lastName: patientData.lastName,
        middleName: input.middleName,
        dayOfBirth: patientData.customFields.dayOfBirth,
        dateOfBirth: input.dateOfBirth,
        dataOfBirthHeaderFormat: input.dataOfBirthHeaderFormat,
        orderId: generateRandomNumber(),
        screeningDate: input.screeningDate,
        screeningDateFormatted: input.screeningDateFormatted,
        siteNumber: generateRandomNumber(),
        orderingLotNumber: generateRandomNumber(),
        medicalRecordNumber: generateRandomNumber(),
      };
      scope.treatmentInformation = {
        prescriber_select_index: 1,
        institution_select_index: 1,
      };
      scope.confirmOrder = {
        confirmation: header.confirmation,
        confirmApproveMessage: header.confirmApproveMessage,
        passwordString: header.passwordString,
        closeButtonText: header.closeButtonText,
        confirmerName: header.orderingNurseName,
        confirmerPrompt: header.confirmerPrompt,
        confirmerRole: header.confirmerRole,
        approverName: header.caseManagerName,
        approverPrompt: header.approverPrompt,
        approverRole: header.approverRole,
        approval: header.approval,
        goBack: true,
      };
      scope.patientHeaderBar = {
        nameLabel: header.nameLabel,
        dateOfBirthLabel: header.dateOfBirthLabel,
        subjectNumberLabel: header.subjectNumberLabel,
        studyNumberLabel: header.studyNumber,
        coiLabel: header.coiLabel,
      };
      scope.patientVerification = {
        passwordString: header.passwordString,
      };
    });
  });

  it('Collection flow', () => {
    cy.openOrder('collection','arlene')
    cy.commonPagination(scope.patientInformation.patientId,'Patients')
    col_steps.patientVerificationCilta(therapy, scope);
    col_steps.collectionBagIdentificationCilta();
    col_steps.collectionInformationPrinting();
    col_steps.collectionProcedureInformation();
    col_steps.collectionSummaryCilta(scope);
    cy.openOrder('collection','phil')
    cy.commonPagination(scope.patientInformation.patientId,'Patients')
    col_steps.transferProductToShipper(scope.coi, input.day1Bag1Udn, 'us-cmlp-cilta', 'apheresis-site', 'manufacturing-site');
    col_steps.collectionShipmentChecklist(scope);
    col_steps.collectionShippingSummaryCcCilta(scope);
  });

  it('Satellite Lab flow', () => {
    cy.openOrder('ordering','oliver')
    cy.commonPagination(scope.patientInformation.patientId,'Treatments per Patient')
    cy.getCoiFromOSTPage();
    cy.openOrder('satellite_lab','steph')
    cy.get(`@coi`).then(coi => { 
      cy.commonPagination(coi,'Reservations') 
      sat_steps.satLabPrintCryopreservationLabels();
      sat_steps.satLabCollectionSummary(scope, therapy);
      sat_steps.satLabVerifyShipment(coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');
      sat_steps.satLabShipmentChecklist(input.day1Bag1Udn, therapy);
      sat_steps.satLabShipmentChecklistSummary(scope, therapy);
      sat_steps.satLabCryopreservation(input.itemCount);
      sat_steps.satLabCryopreservationLabels(coi, therapy);
      sat_steps.satLabCryopreservationData(input.productVolume);
      sat_steps.satSummaryVerify(scope, therapy);
    });
  });

  it('Manufacturing flow', () => {
    cy.openOrder('ordering','oliver')
    cy.commonPagination(scope.patientInformation.patientId,'Treatments per Patient')
    cy.getCoiFromOSTPage();
    cy.openOrder('manufacturing','steph')
    cy.get(`@coi`).then(coi => {   
      cy.commonPagination(coi,'Reservations')  
      m_steps.manufacturingData(input.expiryDate, scope.patientInformation.orderingLotNumber);
      m_steps.manufacturingFinalLabels(therapy);
      m_steps.manufacturingLabelApplication(coi, therapy);
      m_steps.manufacturingQualityApproval();
      m_steps.manufacturingBagSelection();
      m_steps.manufacturingTransferProductToShipper(coi, therapy);
      m_steps.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, therapy);
      m_steps.manufacturingShippingManufacturingSummaryVerifyCilta(therapy, scope)
    });
  });

  it('Infusion flow', () => {
    cy.openOrder('ordering','oliver')
    cy.commonPagination(scope.patientInformation.patientId,'Treatments per Patient')
    cy.getCoiFromOSTPage();
    cy.openOrder('infusion','phil')
    cy.get(`@coi`).then(coi => { 
      cy.commonPagination(coi,'Reservations')  
      inf_steps.infusionReceiveShipment('manufacturing-site', therapy, coi);
      inf_steps.infusionShipmentReceiptChecklist(therapy, input.evoLast4Digits, input.tamperSealNumber);
      inf_steps.infusionShipmentReceiptSummary(scope, therapy);
      inf_steps.infusionProductReceiptChecklist(therapy);
      inf_steps.infusionProductReceiptSummary(scope, therapy);
    });
  });
});
