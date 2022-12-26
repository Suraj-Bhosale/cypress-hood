// import col_steps from '../../utils/collection_steps_cilta';
// import m_steps from '../../utils/manufacturing_steps_cilta.js';
// import inf_steps from '../../utils/infusion_steps_cilta';
// import sat_steps from '../../utils/satelite_lab_steps_cilta'
import order_steps from '../../utils/HappyPath_steps/EMEA_CCLP_DC_QR_HappyPath/ordering_steps_cilta';
import wdc_steps from '../../utils/HappyPath_steps/EMEA_CCLP_DC_QR_HappyPath/wdc_steps_cilta'
import col_steps from '../../utils/HappyPath_steps/EMEA_CCLP_DC_QR_HappyPath/collection_steps_cilta';
import m_steps from '../../utils/HappyPath_steps/EMEA_CCLP_DC_QR_HappyPath/manufacturing_steps_cilta.js';
import inf_steps from '../../utils/HappyPath_steps/EMEA_CCLP_DC_QR_HappyPath/infusion_steps_cilta';
import sat_steps from '../../utils/HappyPath_steps/EMEA_CCLP_DC_QR_HappyPath/satelite_lab_steps_cilta'
import header from '../../fixtures/assertions.json';
import input from '../../fixtures/inputs.json';
// import wdc_steps from '../../utils/wdc_steps_emea';
import faker from 'faker';
import {
  createPatientQuery,
  mockPatientBaseInfo,
  mockPatientBaseInfoEmeaCcDc
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
import therapies from '../../fixtures/therapy.json';

context('EMEA CCDC Therapy Happy Path', () => {

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

  let patientBaseInfoEmeaCcDc = mockPatientBaseInfoEmeaCcDc();

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
    region: 'EU',
    workflowVariants: {
      cryoType: 'CENTRAL',
      printingType: 'LOCAL',
      distributionCenter: 'YES',
      qualityRelease: 'YES'
    }
  }

  const institutions = ['Test COE 1 (US)', 'Test COE 2', 'Test COE 3'];

  before('Creating api user and client identities',() => {
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
          ['cilta-cel-jnj-emea-cclp-dc-qr']
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
  const therapy = therapies.emea_ccdc_qr;

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
      orderMutationRequest(mutationQuery, mutationResponse, 'cilta-cel-jnj-emea-cclp-dc-qr'),
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
        dayOfBirth: patientBaseInfoEmeaCcDc.customFields.dayOfBirth,
        monthOfBirth: patientBaseInfoEmeaCcDc.customFields.monthOfBirth
      }
    });
  });
  
  xit('Create and Approve Order', () => {
    common.loginAs('nina');
    cy.visit('/ordering');
    order_steps.CreateOrder(header.orders);
    order_steps.SelectTherapy(therapy.context);
    order_steps.AddPatientInformation(
      scope.patientInformation,
      true, therapy
    );
    order_steps.SelectOrderingSite(
      scope.treatmentInformation,
      header.orderingSite,
      scope.patientHeaderBar,
      header
    );
    order_steps.schedulingCheckAvailability(therapy);
    order_steps.AddSchedulingOrder(header);
    order_steps.SubmitOrder(scope, therapy);
  });

  it('Collection flow', () => {
    common.loginAs('arlene');
    cy.visit('/collection');
    common.loadCollection();
    cy.waitForElementAndClick(`tr[data-testid="treatment-${scope.coi}"]`);
    col_steps.patientVerificationEmeaCcDc(therapy, scope);
    col_steps.collectionBagIdentificationEmeaCcDcQr();
    col_steps.collectionInformationPrintingEmeaCc();
    col_steps.collectionProcedureInformation();
    col_steps.collectionSummaryEmeaCcDcQr(scope);
    common.loginAs('phil');
    cy.visit('/collection');
    common.loadCollection();
    cy.waitForElementAndClick(`tr[data-testid="treatment-${scope.coi}"]`);
    col_steps.transferProductToShipperCcDcQr(scope.coi, input.day1Bag1Udn, therapy.leg_name);
    col_steps.collectionShipmentChecklistEmeaCc(scope);
    col_steps.collectionShippingSummaryEmeaCcDcQr(scope);
  });

  it('Satellite Lab flow', () => {
    common.loginAs('steph');
    cy.visit('/satellite_lab');
    cy.contains(scope.coi).click();
    sat_steps.satLabCollectionSummaryCcDcQr(scope, therapy);
    sat_steps.satLabVerifyShipmentCcDcQr(scope.coi, therapy, 'from-satellite-lab', 'to-manufacturing-site');
    sat_steps.satLabShipmentChecklistCcDcQr(input.day1Bag1Udn, therapy);
    sat_steps.satLabShipmentChecklistSummaryCcDcQr(scope, therapy);
    sat_steps.satLabCryopreservation(input.itemCount);
    sat_steps.satLabCryopreservationLabelscclp(scope.coi, 'EMEA Cilta-Cel CCDC QR');
    sat_steps.satLabBagStorage(scope.coi);
    sat_steps.satLabCryopreservationData(input.productVolume);
    sat_steps.satSummaryVerifyCcDcQr(scope, therapy);
    sat_steps.satLabPrintShipperLabels(therapy, 'EMEA Cilta-Cel CCDC QR');
    sat_steps.satLabBagSelection();
    sat_steps.satLabTransferProductToShipperCcDcQr(scope.coi, therapy);
    sat_steps.satLabShippingChecklist(0, input.evoLast4Digits, input.tamperSealNumber, scope);
    sat_steps.satShippingSummaryVerifyCcDcQr(scope, therapy);
  });

  it('Manufacturing flow', () => {
    common.loginAs('steph');
    cy.visit('/manufacturing');
    cy.get('.manufacturing-row_coi')
      .contains('div', scope.coi)
      .click();
    m_steps.manufacturingCollectionSummary(therapy);
    m_steps.manufacturingVerifyShipperCcDcQr(scope.coi, therapy, 'from-satellite-lab', 'to-manufacturing-site');
    m_steps.manufacturingShipmentReceiptChecklistCcDcQr(input.evoLast4Digits, input.tamperSealNumber);
    m_steps.manufacturingShipReceiptSummaryVerifyCcDcQr(therapy, scope);
    m_steps.manufacturingTransferProductToStorageCCLP(scope.coi, therapy);
    m_steps.manufacturingTransferProductToStorage2(scope.coi);
    m_steps.manufacturingProductReceiptEmea(scope.patientInformation.patientId);
    m_steps.manufacturingProductReceiptSummaryVerifyEmea();
    m_steps.manufacturingData(input.expiryDate, scope.patientInformation.orderingLotNumber);
    m_steps.manufacturingFinalLabels(therapy);
    m_steps.manufacturingLabelApplication(scope.coi, therapy);
    m_steps.manufacturingReleaseToShip(therapy);
    m_steps.manufacturingBagSelection();
    m_steps.manufacturingTransferProductToShipper(scope.coi, therapy);
    m_steps.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, therapy);
    m_steps.manufacturingShippingManufacturingSummaryVerifyEmeaCc(therapy, scope)
  });

  it('WDC flow', () => {
    common.loginAs('steph');
    cy.visit('/wdc');
    cy.get('.wdc-row_coi')
      .contains('div', scope.coi)
      .click();
    wdc_steps.wdcVerifyShipper('-emea-ccdc-qr', scope.coi);
    wdc_steps.wdcShipmentReceiptChecklist();
    wdc_steps.wdcShipmentReceiptChecklistSummaryCcDcQr(therapy, scope, scope.patientInformation.siteNumber);
    wdc_steps.wdcTransferProductToStorageEmea(scope.coi, therapy);
    wdc_steps.wdcProductReceiptEmeaCcDcQr(therapy, input.pisNumber);
    wdc_steps.wdcProductRecieptSummaryEmeaCcDcQr(therapy);
    wdc_steps.wdcPrintPackingInsert();
    wdc_steps.wdcTransferProductToShipperEmeaCcdc(scope.coi);
    wdc_steps.wdcShippingWorldDistributionCenterEmeaCcdc(2, scope, input.evoLast4Digits, input.tamperSealNumber);
    wdc_steps.wdcShippingWorldDistributionCenterSummaryEmeaCcdcQr(therapy, scope.coi);
  });


  it('Infusion flow', () => {
    common.loginAs('phil');
    cy.visit('/infusion');
    cy.get('.patient-id')
      .contains(scope.patientInformation.patientId)
      .click();
    inf_steps.infusionReceiveShipment('world-distribution-center', therapy, scope.coi);
    inf_steps.infusionShipmentReceiptChecklist(therapy, input.evoLast4Digits, input.tamperSealNumber);
    inf_steps.infusionShipmentReceiptSummaryCcDcQr(scope, therapy);
    inf_steps.infusionProductReceiptChecklist(therapy);
    inf_steps.infusionProductReceiptSummaryCcDcQr(scope, therapy);
    inf_steps.infusionQualityDecision();
  });
});
