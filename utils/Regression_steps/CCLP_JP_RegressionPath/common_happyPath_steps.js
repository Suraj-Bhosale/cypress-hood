import order_steps from '../../../utils/HappyPath_steps/CCLP_JP_HappyPath/ordering_steps';
import col_steps from '../../../utils/HappyPath_steps/CCLP_JP_HappyPath/collection_steps';
import sat_steps from '../../../utils/HappyPath_steps/CCLP_JP_HappyPath/satelite_lab_steps';
import m_steps from '../../../utils/HappyPath_steps/CCLP_JP_HappyPath/manufacturing_steps.js';
import inf_steps from '../../../utils/HappyPath_steps/CCLP_JP_HappyPath/infusion_steps';
import header from '../../../fixtures/assertions.json';
import input from '../../../fixtures/inputs.json';
import common from '../../../support/index';
import therapy from '../../../fixtures/therapy.json'

Cypress.env('runWithTranslations', false)

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
    cy.route('POST', new RegExp('/scheduling/schedules/JP:jnj68284528:jnj:68284528MMY2003/draft')).as(
      'schedulingServiceDraft'
    );
    cy.route('POST', new RegExp('/scheduling/schedules/JP:jnj68284528:jnj:68284528MMY2003/availability')).as(
      'schedulingServiceAvailability'
    );
    cy.route('GET', '/procedures?procedure_type=ordering').as('getProcedureTypeOrdering');
    cy.route('POST', '/print').as('postPrint');
    cy.route('POST', '/label_scans/verifications').as('labelVerifications');
    cy.route('POST', '/label_scans/values').as('createLabelScanValue');
    cy.route('GET', 'v1/institution_types').as('getInstitutions');
  },

  commonOrderingHappyPath: (scope, therapy, region) => {
    cy.openOrder('ordering', 'nina')
    order_steps.CreateOrder(header.orders);
    order_steps.SelectTherapy(therapy.context);
    order_steps.patient(scope.patientInformation);
    order_steps.prescriber(scope.treatmentInformation, header.orderingSite, scope.patientHeaderBar, header);
    order_steps.SelectPrescriber(scope.treatmentInformation, header);
    order_steps.schedulingCheckAvailability(therapy, region);
    order_steps.AddSchedulingOrder(header);
    order_steps.confirmation(scope);

    // Login as Oliver;
    cy.openOrder('ordering', 'oliver')
    cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
    order_steps.approval(scope);
    cy.invokeCoi()
  },

  commonCollectionHappyPath: (scope, therapy) => {
    cy.openOrder('collection', 'arlene')
    cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
    cy.get(`@coi`).then(coi => {
      col_steps.patientVerification();
      col_steps.collectionBagIdentification();
      col_steps.collectionBagLabel(therapy);
      col_steps.collectionProcedureInformation();
      col_steps.bagDataEntryDay(scope.coi);
      col_steps.collectionSummary(scope);
      col_steps.changeOfCustody(scope.coi);
    })
    cy.openOrder('collection', 'phil')
    cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
    cy.get(`@coi`).then(coi => {
      col_steps.confirmChangeOfCustody(scope.coi);
      ccol_steps.collectionTransferProductToShipper(scope.coi, "ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cclp-jp");
      col_steps.collectionShipmentChecklist(scope, '', therapy);
      col_steps.collectionShippingSummary(scope);
    })
    cy.openOrder('satellite_lab', 'steph')
    cy.get(`@coi`).then((coi) => {
      cy.commonPagination(coi, 'Reservations')
    });
  },

  commonSatelliteHappyPath: (scope) => {
    sat_steps.satLabCollectionSummary(scope)
    sat_steps.satLabVerifyShipment('satellite-lab', '-cclp-jp', scope.coi);
    sat_steps.satLabShipmentChecklist(scope.coi);
    sat_steps.satLabShipmentChecklistSummary(scope);
    sat_steps.satLabCryopreservation(input.itemCount);
    sat_steps.satLabCryopreservationLabels(scope.coi);
    sat_steps.satLabBagStorageEU(scope.coi);
    sat_steps.satLabCryopreservationData(input, scope.coi);
    sat_steps.satLabCryopreservationSummary(scope)
    sat_steps.satLabPrintShipperLabels();
    sat_steps.satLabBagSelection();
    sat_steps.satLabTransferProductToShipper(scope.coi);
    sat_steps.satLabShippingChecklist(1, input.evoLast4Digits, input.tamperSealNumber, scope);
    sat_steps.satShippingSummaryVerify(scope)
    common.loginAs('steph');
    cy.visit('/manufacturing');
    cy.get(`@coi`).then((coi) => {
      cy.commonPagination(coi, 'change the header')
    });
  },

  commonManufacturingHappyPath: (scope) => {
    m_steps.manufacturingCollectionSummary(therapy);
    m_steps.manufacturingVerifyShipper(scope.coi, 'satellite-lab', '-cclp-jp');
    m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
    m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
    m_steps.manufacturingTransferProductToStorage(scope.coi);
    m_steps.manufacturingTransferProductToStorage2(scope.coi);
    m_steps.manufacturingProductReceipt(scope.patientInformation);
    m_steps.manufacturingProductReceiptSummary(scope);
    m_steps.manufacturingStart();
    m_steps.manufacturingLotNumber();
    m_steps.manufacturingConfirmExpiryDate();
    m_steps.manufacturingFinalLabels();
    m_steps.manufacturingLabelApplication(scope.coi);
    m_steps.manufacturingQualityRelease();
    m_steps.manufacturingBagSelection();
    m_steps.manufacturingTransferProductToShipper(scope.coi);
    m_steps.shippingManufacturing(2, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, therapy);
    m_steps.manufacturingShippingManufacturingSummary();
  },

  commonInfusionHappyPath: (scope) => {
    inf_steps.infusionReceiveShipment('manufacturing-site', '-cclp-jp', scope.coi);
    inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
    inf_steps.infusionShipmentReceiptSummary(scope);
    inf_steps.infusionTransferProductToStorage(scope.coi);
    inf_steps.infusionProductReceiptChecklist();
    inf_steps.infusionProductReceiptSummary(scope);
    inf_steps.infusionQualityRelease();
  }
}