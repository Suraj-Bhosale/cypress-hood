import order_steps from '../../HappyPath_steps/CCLP_EU_HappyPath/ordering_steps'
import col_steps from '../../HappyPath_steps/CCLP_EU_HappyPath/collection_steps';
import sat_steps from '../../HappyPath_steps/CCLP_EU_HappyPath/satelite_lab_steps';
import m_steps from '../../HappyPath_steps/CCLP_EU_HappyPath/manufacturing_steps.js';
import inf_steps from '../../HappyPath_steps/CCLP_EU_HappyPath/infusion_steps';
import wdc_steps from '../../HappyPath_steps/CCLP_EU_HappyPath/wdc_steps';
import header from '../../../fixtures/assertions.json';
import schedulingSteps from '../../HappyPath_steps/scheduling_steps.js';
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
    cy.route('PATCH', '/scheduling/schedules/*').as('schedulingServiceUpdate');
    cy.route('POST', new RegExp('/scheduling/schedules/EU:jnj68284528:jnj:68284528MMY2003/draft')).as(
      'schedulingServiceDraft'
    );
    cy.route('POST', new RegExp('/scheduling/schedules/EU:jnj68284528:jnj:68284528MMY2003/availability')).as(
      'schedulingServiceAvailability'
    );
    cy.route('GET', '/procedures?procedure_type=ordering').as('getProcedureTypeOrdering');
    cy.route('POST', '/print').as('postPrint');
    cy.route('POST', '/label_scans/verifications').as('labelVerifications');
    cy.route('POST', '/label_scans/values').as('createLabelScanValue');
    cy.route('GET', 'v1/institution_types').as('getInstitutions');
  },

  commonOrderingHappyPath: ( scope,therapy) => {
    cy.openOrder('ordering','nina')
    order_steps.CreateOrder(header.orders);
    order_steps.SelectTherapy(therapy.context);
    order_steps.patient(scope.patientInformation);
    order_steps.prescriber(scope.treatmentInformation,header.orderingSite,scope.patientHeaderBar,header);
    order_steps.SelectPrescriber(scope.treatmentInformation, header);
    order_steps.schedulingCheckAvailability(therapy,'EU');
    order_steps.AddSchedulingOrder(header);
    order_steps.confirmation(scope, therapy);

    // Login as Oliver;
    cy.openOrder('ordering','oliver')
    cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
    order_steps.approval(scope,therapy);
    cy.invokeCoi()
  },

  commonCollectionHappyPath:(scope,therapy) => {
    cy.get(`@coi`).then(coi => {
    cy.openOrder('collection','arlene')
    cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
    col_steps.patientVerification();
    col_steps.collectionBagIdentification();
    col_steps.collectionBagLabel(therapy);
    col_steps.collectionProcedureInformation();
    col_steps.bagDataEntryDay(coi);
    col_steps.collectionSummary(scope);
    col_steps.changeOfCustody(coi);
    cy.openOrder('collection','phil')
    cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
    col_steps.confirmChangeOfCustody(coi);
    col_steps.collectionTransferProductToShipper(coi, "ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab");
    col_steps.collectionShipmentChecklist(scope, "#/properties/shipping_checklist/properties/collection_airway_bill-input", therapy);
    col_steps.collectionShippingSummary(scope);
    cy.openOrder('satellite_lab','steph')
    cy.commonPagination(coi,'Reservations')
      });
  },

  commonSatelliteHappyPath:(scope) => {
    cy.get(`@coi`).then((coi) => {
    sat_steps.satLabCollectionSummary(scope)
    sat_steps.satLabVerifyShipment('satellite-lab', '', coi);
    sat_steps.satLabShipmentChecklist(coi);
    sat_steps.satLabShipmentChecklistSummary(scope)
    sat_steps.satLabCryopreservation(input.itemCount);
    sat_steps.satLabCryopreservationLabels(coi);
    sat_steps.satLabBagStorageEU(coi);
    sat_steps.satLabCryopreservationData(input, coi);
    sat_steps.satLabCryopreservationSummary(scope)
    sat_steps.satLabPrintShipperLabelsEU();
    sat_steps.satLabBagSelection();
    sat_steps.satLabTransferProductToShipper(coi);
    sat_steps.satLabShippingChecklistEU(0, input.evoLast4Digits, input.tamperSealNumber, scope);
    sat_steps.satShippingSummaryVerify(scope)
    cy.openOrder('/manufacturing','steph')
    cy.commonPagination(coi,'Reservations')
    })
  },

  commonManufacturingHappyPath:(scope,therapy) => {
    cy.get(`@coi`).then((coi) => {
    m_steps.manufacturingCollectionSummary(therapy);
    m_steps.manufacturingVerifyShipper(coi, 'satellite-lab', '');
    m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
    m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
    m_steps.manufacturingTransferProductToStorage(coi);
    m_steps.manufacturingTransferProductToStorage2(coi);
    m_steps.manufacturingProductReceipt(scope.patientInformation);
    m_steps.manufacturingProductReceiptSummary(scope);
    m_steps.manufacturingStart();
    m_steps.manufacturingLotNumber();
    m_steps.manufacturingConfirmExpiryDate();
    m_steps.manufacturingFinalLabels(therapy);
    m_steps.manufacturingLabelApplication();
    m_steps.confirmationOfLabelApplication(coi)
    m_steps.manufacturingQualityRelease();
    m_steps.manufacturingBagSelection();
    m_steps.manufacturingTransferProductToShipper(coi);
    m_steps.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, therapy);
    m_steps.manufacturingShippingManufacturingSummary(therapy);
    cy.openOrder('/wdc', 'steph')
    cy.commonPagination(coi, 'Reservations')
    });
  },

  commonWDCHappyPath:(scope,therapy) => {
    cy.get(`@coi`).then((coi) => {
    wdc_steps.wdcScheduleFinalProductShipment(coi, schedulingSteps, 'wdc_eu');
    wdc_steps.wdcVerifyShipper(coi, '');
    wdc_steps.wdcShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber, true);
    wdc_steps.wdcShipmentReceiptChecklistSummary(coi, scope.patientInformation);
    wdc_steps.wdcTransferProductToStorage(coi, therapy);
    wdc_steps.wdcProductReceipt(input.pisNumber, input.lotNumber, therapy);
    wdc_steps.wdcProductRecieptSummary(therapy, scope.patientInformation);
    wdc_steps.wdcQualityRelease(scope, scope.patientInformation);
    wdc_steps.wdcPrintShipperLabels(therapy);
    wdc_steps.wdcTransferProductToShipper(coi, scope.patientInformation);
    wdc_steps.wdcShippingWorldDistributionCenter(2, scope, input.evoLast4Digits, input.tamperSealNumber)
    wdc_steps.wdcShippingWorldDistributionCenterSummary(scope.coi, scope.patientInformation);
    cy.openOrder('infusion','phil')
    cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
  })
}
}
