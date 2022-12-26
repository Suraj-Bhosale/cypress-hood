import order_steps from '../../HappyPath_steps/CMLP_US_HappyPath/ordering_steps';
import col_steps from '../../HappyPath_steps/CMLP_US_HappyPath/collection_steps';
import sat_steps from '../../HappyPath_steps/CMLP_US_HappyPath/satelite_lab_steps';
import m_steps from '../../HappyPath_steps/CMLP_US_HappyPath/manufacturing_steps.js';
import inf_steps from '../../HappyPath_steps/CMLP_US_HappyPath/infusion_steps';
import header from '../../../fixtures/assertions.json';
import input from '../../../fixtures/inputs.json';
import common from '../../../support/index';
import therapies from '../../../fixtures/therapy.json'

Cypress.env('runWithTranslations', false);

export default {
  commonAliases: () => {
    cy.server();
    cy.route('DELETE', '/auth/sign_out').as('logout');
    cy.route('GET', '/physicians*').as('getStepPhysicians');
    cy.route('POST', '/signatures').as('postSignature');
    cy.route('GET', '/products').as('products');
    cy.route('POST', '/procedures').as('postProcedures');
    cy.route('PATCH', '/procedure_steps/*').as('patchProcedureSteps');
    cy.route('GET', '/procedures/*').as('getProcedures');
    cy.route('GET', '/scheduling/schedules/*').as('schedulingServiceSchedule');
    cy.route('POST', '/scheduling/schedules').as('schedulingServiceCreate');
    cy.route('PATCH', '/scheduling/schedules/*').as('schedulingServiceUpdate');
    cy.route('POST', new RegExp('/scheduling/schedules/US:jnj68284528:jnj:68284528MMY2003/draft')).as(
      'schedulingServiceDraft'
    );
    cy.route('POST', new RegExp('/scheduling/schedules/US:jnj68284528:jnj:68284528MMY2003/availability')).as(
      'schedulingServiceAvailability'
    );
    cy.route('GET', '/procedures?procedure_type=ordering').as('getProcedureTypeOrdering');
    cy.route('POST', '/print').as('postPrint');
    cy.route('POST', '/label_scans/verifications').as('labelVerifications');
    cy.route('POST', '/label_scans/values').as('createLabelScanValue');
    cy.route('GET', 'v1/institution_types').as('getInstitutions');
  },

  commonOrderingHappyPath: (scope, therapy) => {
    cy.openOrder('ordering', 'nina')
    order_steps.CreateOrder(header.orders);
    order_steps.SelectTherapy(therapy.context);
    order_steps.patient(scope.patientInformation, therapy);
    order_steps.prescriber(scope.treatmentInformation, header.orderingSite, scope.patientHeaderBar, header);
    order_steps.SelectPrescriber(scope.treatmentInformation, header);
    order_steps.schedulingCheckAvailability(therapy);
    order_steps.AddSchedulingOrder(header);
    order_steps.confirmation(scope, therapy);

    // Login as Oliver;
    cy.openOrder('ordering', 'oliver')
    cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
    order_steps.approval(scope, therapy);
    cy.invokeCoi()
  },

  commonCollectionHappyPath: (scope, therapy) => {
    cy.openOrder('collection', 'arlene')
    cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
    col_steps.patientVerification(therapy);
    col_steps.collectionBagIdentification(therapy);
    col_steps.collectionBagLabel(therapy);
    col_steps.collectionProcedureInformation();
    cy.get(`@coi`).then(coi => {
    col_steps.bagDataEntryDay(scope.coi);
    col_steps.collectionSummary(scope, therapy);
    col_steps.changeOfCustody(scope.coi);
    })
    cy.openOrder('collection', 'phil')
    cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
    cy.get(`@coi`).then(coi => {
    col_steps.confirmChangeOfCustody(scope.coi);
    col_steps.collectionTransferProductToShipper(scope.coi, "ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-2003-cmlp-us");
    col_steps.collectionShipmentChecklist(scope, "", therapy);
    col_steps.collectionShippingSummary(scope);
    })
    cy.openOrder('satellite_lab', 'maria')
    cy.get(`@coi`).then(coi => {
    cy.commonPagination(coi,'Reservations')
    })
  },

  commonSatelliteHappyPath: (scope) => {
    cy.get(`@coi`).then(coi => {
    sat_steps.satLabCollectionSummary(scope)
    sat_steps.satLabVerifyShipment('manufacturing-site', '-2003-cmlp-us', coi);
    sat_steps.satLabShipmentChecklist(scope.coi);
    sat_steps.satLabShipmentChecklistSummary(scope)
    })
    cy.openOrder('satellite_lab', 'central_cell_lab_operator_pharmacist')
    cy.get(`@coi`).then(coi => {
      cy.commonPagination(coi,'Reservations')
    sat_steps.satLabCryopreservation(input.itemCount);
    sat_steps.satLabCryopreservationLabels(scope.coi);
    sat_steps.satLabBagStorage(scope.coi);
    sat_steps.satLabCryopreservationData(input, scope.coi);
    sat_steps.satLabCryopreservationSummary(scope)
    sat_steps.satLabBagSelection();
    common.loginAs('steph');
    cy.visit('/manufacturing');
    cy.get(`@coi`).then((coi) => {
      cy.commonPagination(coi, 'Reservations')
    });
    })
  },

  commonManufacturingHappyPath: (scope, therapy) => {
    cy.get(`@coi`).then(coi => {
    m_steps.manufacturingStart();
    m_steps.manufacturingLotNumber();
    m_steps.manufacturingConfirmExpiryDate();
    m_steps.manufacturingFinalLabels();
    m_steps.manufacturingLabelApplication();
    m_steps.manufacturingConfirmLabelApplication(coi);
    m_steps.manufacturingQualityRelease();
    m_steps.manufacturingBagSelection();
    m_steps.manufacturingTransferProductToShipper(scope.coi);
    m_steps.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, therapy);
    m_steps.manufacturingShippingManufacturingSummary(therapy);
    cy.openOrder('infusion','phil')
    cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
    })
  },

  commonInfusionHappyPath: (scope) => {
    common.loginAs('phil');
    cy.visit('/infusion');
    cy.get(".patient-id")
      .contains(scope.patientInformation.subjectNumber)
      .click();
    inf_steps.infusionReceiveShipment('manufacturing-site', '-2003-cmlp-us', scope.coi);
    inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
    inf_steps.infusionShipmentReceiptSummary(scope);
    inf_steps.infusionTransferProductToStorage(scope.coi);
    inf_steps.infusionProductReceiptChecklist();
    inf_steps.infusionProductReceiptSummary(scope);
  }
}
