import order_steps from '../../utils/HappyPath_steps/CCLP_EU_HappyPath/ordering_steps';
import col_steps from '../../utils/HappyPath_steps/CCLP_EU_HappyPath/collection_steps';
import sat_steps from '../../utils/HappyPath_steps/CCLP_EU_HappyPath/satelite_lab_steps';
import m_steps from '../../utils/HappyPath_steps/CCLP_EU_HappyPath/manufacturing_steps.js';
import wdc_steps from '../../utils/HappyPath_steps/CCLP_EU_HappyPath/wdc_steps';
import inf_steps from '../../utils/HappyPath_steps/CCLP_EU_HappyPath/infusion_steps';
import schedulingSteps from '../../utils/HappyPath_steps/scheduling_steps.js';
import header from '../../fixtures/assertions.json';
import input from '../../fixtures/inputs.json';
import common from '../../support/index';
import therapies from '../../fixtures/therapy.json'

context('CCLP EU Therapy Happy Path', () => {
  beforeEach(() => {
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
  });

  let scope = {};
  const therapy = therapies.cclp_eu
  const region = therapy.region;

  before(() => {
    order_steps.orderingData(scope);
  });

  it('Create and Approve Order', () => {
    common.loginAs('nina');
    cy.visit('/ordering');
    order_steps.CreateOrder(header.orders);
    order_steps.SelectTherapy(therapy.context);
    order_steps.patient(
      scope.patientInformation, therapy
    );
    order_steps.prescriber(
      scope.treatmentInformation,
      header.orderingSite,
      scope.patientHeaderBar,
      header
    );
    order_steps.SelectPrescriber(scope.treatmentInformation, header);
    order_steps.schedulingCheckAvailability(therapy, region);
    order_steps.AddSchedulingOrder(header);
    order_steps.confirmation(scope, therapy);

    // Login as Oliver;
    cy.openOrder('ordering','oliver')
    cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')

    order_steps.approval(scope, therapy);
  });

  it('Collection flow', () => {
    cy.openOrder('collection','arlene')
    cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
    col_steps.patientVerification(therapy);
    col_steps.collectionBagIdentification(therapy, region);
    col_steps.collectionBagLabel(therapy);
    col_steps.collectionProcedureInformation();
    col_steps.bagDataEntryDay(scope.coi);
    col_steps.collectionSummary(scope, therapy);
    col_steps.changeOfCustody(scope.coi);
    cy.openOrder('collection','phil')
    cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
    col_steps.confirmChangeOfCustody(scope.coi);
    col_steps.collectionTransferProductToShipper(scope.coi, "ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab");
    col_steps.collectionShipmentChecklist(scope, "#/properties/shipping_checklist/properties/collection_airway_bill-input", therapy);
    col_steps.collectionShippingSummary(scope);
  });

  it('Satellite Lab flow', () => {
    cy.openOrder('satellite_lab','steph')
    cy.commonPagination(scope.coi,'Reservations')
    sat_steps.satLabCollectionSummary(scope)
    sat_steps.satLabVerifyShipment('satellite-lab', '', scope.coi);
    sat_steps.satLabShipmentChecklist(scope.coi);
    sat_steps.satLabShipmentChecklistSummary(scope)
    sat_steps.satLabCryopreservation(input.itemCount);
    sat_steps.satLabCryopreservationLabels(scope.coi);
    sat_steps.satLabBagStorageEU(scope.coi);
    sat_steps.satLabCryopreservationData(input, scope.coi);
    sat_steps.satLabCryopreservationSummary(scope)
    sat_steps.satLabPrintShipperLabelsEU();
    sat_steps.satLabBagSelection();
    sat_steps.satLabTransferProductToShipper(scope.coi);
    sat_steps.satLabShippingChecklistEU(0, input.evoLast4Digits, input.tamperSealNumber, scope);
    sat_steps.satShippingSummaryVerify(scope)
  });

  it('Manufacturing flow', () => {
    cy.openOrder('/manufacturing','steph')
    cy.commonPagination(scope.coi,'Reservations')
    m_steps.manufacturingCollectionSummary(therapy);
    m_steps.manufacturingVerifyShipper(scope.coi, 'satellite-lab', '');
    m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
    m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
    m_steps.manufacturingTransferProductToStorage(scope.coi);
    m_steps.manufacturingTransferProductToStorage2(scope.coi);
    m_steps.manufacturingProductReceipt(scope.patientInformation);
    m_steps.manufacturingProductReceiptSummary(therapy, scope);
    m_steps.manufacturingStart();
    m_steps.manufacturingLotNumber();
    m_steps.manufacturingConfirmExpiryDate();
    m_steps.manufacturingFinalLabels(therapy);
    m_steps.manufacturingLabelApplication();
    m_steps.confirmationOfLabelApplication(scope.coi)
    m_steps.manufacturingQualityRelease();
    m_steps.manufacturingBagSelection();
    m_steps.manufacturingTransferProductToShipper(scope.coi);
    m_steps.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, therapy);
    m_steps.manufacturingShippingManufacturingSummary(therapy);
  });

  it('WDC flow', () => {
    common.loginAs('steph');
    cy.visit('/wdc');
    cy.get('.wdc-row_coi')
      .contains('div', scope.coi)
      .click();
    wdc_steps.wdcScheduleFinalProductShipment(schedulingSteps, 'wdc_eu');
    wdc_steps.wdcVerifyShipper('', scope.coi);
    wdc_steps.wdcShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
    wdc_steps.wdcSummary();
    wdc_steps.wdcTransferProductToStorage(scope.coi);
    wdc_steps.wdcProductReceipt(input.pisNumber);
    wdc_steps.wdcSummary();
    wdc_steps.wdcQualityRelease();
    wdc_steps.wdcPrintShipperLabels();
    wdc_steps.wdcTransferProductToShipper(scope.coi);
    wdc_steps.wdcShipping(2,scope, input.lotNumber, scope.coi, input.evoLast4Digits, input.tamperSealNumber);
    wdc_steps.wdcSummary();
  });

  // TODO : WDC Airway bill is generated after `wdcScheduleFinalProductShipment`
  // So after that we need to login as oliver and got to OST and capture the WDC airway bill to use it here

  it('Infusion flow', () => {
    cy.openOrder('infusion','phil')
    cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
    inf_steps.infusionReceiveShipment('world-distribution-center', '', scope.coi);
    inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
    inf_steps.infusionShipmentReceiptSummary(scope);
    inf_steps.infusionTransferProductToStorage(scope.coi);
    inf_steps.infusionProductReceiptChecklist();
    inf_steps.infusionProductReceiptSummary(scope);
  });
});

