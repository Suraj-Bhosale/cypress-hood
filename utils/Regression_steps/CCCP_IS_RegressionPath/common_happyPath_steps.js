import order_steps from '../../HappyPath_steps/CCCP_IS_HappyPath/ordering_steps';
import col_steps from '../../HappyPath_steps/CCCP_IS_HappyPath/collection_steps';
import sat_steps from '../../HappyPath_steps/CCCP_IS_HappyPath/satelite_lab_steps';
import m_steps from '../../HappyPath_steps/CCCP_IS_HappyPath/manufacturing_steps.js';
import inf_steps from '../../HappyPath_steps/CCCP_IS_HappyPath/infusion_steps';
import header from '../../../fixtures/assertions.json';
import input from '../../../fixtures/inputs.json';
import common from '../../../support/index';
import therapies from '../../../fixtures/therapy.json'

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
    cy.route('POST', new RegExp('/scheduling/schedules/IS:jnj68284528:jnj:68284528MMY2003/draft')).as(
      'schedulingServiceDraft'
    );
    cy.route('POST', new RegExp('/scheduling/schedules/IS:jnj68284528:jnj:68284528MMY2003/availability')).as(
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
    order_steps.schedulingCheckAvailability(therapy, 'IS');
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
    cy.get(`@coi`).then(coi => {
      col_steps.centralLabelPrinting(therapy);
      col_steps.labelShipping();
      col_steps.patientVerification(therapy);
      col_steps.collectionBagIdentification(therapy);
      col_steps.collectionBagLabel(therapy);
      col_steps.collectionProcedureInformation();
      col_steps.bagDataEntryDay(scope.coi);
      col_steps.collectionSummary(scope, therapy);
      col_steps.changeOfCustody(scope.coi, );
    })
    cy.openOrder('collection', 'phil')
    cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
    cy.get(`@coi`).then(coi => {
      col_steps.confirmChangeOfCustody(scope.coi);
      col_steps.collectionTransferProductToShipper(scope.coi, "ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cccp-is");
      col_steps.collectionShipmentChecklist(scope, "#/properties/shipping_checklist/properties/collection_airway_bill-input", therapy);
      col_steps.collectionShippingSummary(scope);
    })
    cy.openOrder('satellite_lab', 'steph')
    cy.get(`@coi`).then((coi) => {
      cy.commonPagination(coi, 'Reservations')
    });
  },

commonSatelliteHappyPath: (scope) => {
    sat_steps.satLabCollectionSummary(scope)
    cy.get(`@coi`).then(coi => {
      sat_steps.satLabVerifyShipment('satellite-lab', '-cccp-is', coi);
      sat_steps.satLabShipmentChecklist(coi);
      sat_steps.satLabShipmentChecklistSummary(scope)
      sat_steps.satLabCryopreservation(input.itemCount);
      sat_steps.satLabCryopreservationLabels(coi);
      sat_steps.satLabBagStorageEU(coi);
      sat_steps.satLabCryopreservationData(input, coi);
      sat_steps.satLabCryopreservationSummary(scope)
      sat_steps.satLabPrintShipperLabels();
      sat_steps.satLabBagSelection();
      sat_steps.satLabTransferProductToShipper(coi);
    });
    sat_steps.satLabShippingChecklist(0, input.evoLast4Digits, input.tamperSealNumber, scope);
    sat_steps.satShippingSummaryVerify(scope)
    common.loginAs('steph');
    cy.visit('/manufacturing');
    cy.get(`@coi`).then((coi) => {
      cy.commonPagination(coi, 'change the header')
    });
  },

commonManufacturingHappyPath: (scope, therapy) => {
    cy.get(`@coi`).then(coi => {
      m_steps.manufacturingCollectionSummary(therapy);
      m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '-cccp-is');
      m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
      m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
      m_steps.manufacturingTransferProductToStorage(coi);
      m_steps.manufacturingTransferProductToStorage2(coi);
      m_steps.manufacturingProductReceipt(scope.patientInformation);
      m_steps.manufacturingProductReceiptSummary(therapy, scope);
      m_steps.manufacturingStart();
      m_steps.manufacturingLotNumber();
      m_steps.manufacturingConfirmExpiryDate();
      m_steps.manufacturingFinalLabels(therapy);
      m_steps.manufacturingLabelApplicationIS(coi);
      m_steps.manufacturingConfirLabelApplicationIS(coi);
      m_steps.manufacturingQualityRelease();
      m_steps.manufacturingBagSelection();
      m_steps.manufacturingTransferProductToShipper(coi);
      m_steps.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, therapy);
      m_steps.manufacturingShippingManufacturingSummary(therapy);

      //Login As Phil
      cy.openOrder('infusion', 'phil')
      cy.commonPagination(coi, 'change the header')
    });
  },

  commonInfusionHappyPath: (scope) => {
    cy.get(`@coi`).then(coi => {
      inf_steps.infusionReceiveShipment('manufacturing-site', '-cccp-is', coi);
      inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
      inf_steps.infusionShipmentReceiptSummary(scope);
      inf_steps.infusionTransferProductToStorage(coi);

      inf_steps.infusionProductReceiptChecklist();
      inf_steps.infusionProductReceiptSummary(scope);
      inf_steps.infusionQualityRelease();
    });
  }
}