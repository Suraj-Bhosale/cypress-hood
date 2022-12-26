import order_steps from '../../utils/HappyPath_steps/CCLP_US_HappyPath/ordering_steps';
import col_steps from '../../utils/HappyPath_steps/CCLP_US_HappyPath/collection_steps';
import sat_steps from '../../utils/HappyPath_steps/CCLP_US_HappyPath/satelite_lab_steps';
import m_steps from '../../utils/HappyPath_steps/CCLP_US_HappyPath/manufacturing_steps.js';
import inf_steps from '../../utils/HappyPath_steps/CCLP_US_HappyPath/infusion_steps';
import header from '../../fixtures/assertions.json';
import input from '../../fixtures/inputs.json';
import common from '../../support/index';
import therapies from '../../fixtures/therapy.json'


context('CCLP US Therapy CCLP Happy Path', () => {
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
  });

  const scope = {};
  const therapy = therapies.cclp_us
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
    common.loginAs('oliver');
    cy.visit('/ordering');
    cy.get('td[data-testid="patient-identifier"]')
      .contains(scope.patientInformation.subjectNumber)
      .click();

    order_steps.approval(scope, therapy);
  });

  it('Collection flow', () => {
    common.loginAs('arlene');
    cy.visit('/collection');
    common.loadCollection();
    cy.waitForElementAndClick(`tr[data-testid="treatment-${scope.coi}"]`);
    col_steps.patientVerification();
    col_steps.collectionBagIdentification();
    col_steps.collectionBagLabel(therapy);
    col_steps.collectionProcedureInformation();
    col_steps.bagDataEntryDay(scope.coi);
    col_steps.collectionSummary(scope);
    col_steps.changeOfCustody(scope.coi,);
    common.loginAs('phil');
    cy.visit('/collection');
    common.loadCollection();
    cy.get(`tr[data-testid="treatment-${scope.coi}"]`).click();
    col_steps.confirmChangeOfCustody(scope.coi);
    col_steps.collectionTransferProductToShipper(scope.coi, "ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-cclp");
    col_steps.collectionShipmentChecklist(scope, "", therapy);
    col_steps.collectionShippingSummary(scope);
  })

  it('Satellite Lab flow', () => {
    common.loginAs('steph');
    cy.visit('/satellite_lab');
    cy.contains(scope.coi).click();
    sat_steps.satLabCollectionSummary(scope)
    sat_steps.satLabVerifyShipment('satellite-lab', '-cclp', scope.coi);
    sat_steps.satLabShipmentChecklist(scope.coi);
    sat_steps.satLabShipmentChecklistSummary(scope)
    sat_steps.satLabCryopreservation(input.itemCount);
    sat_steps.satLabCryopreservationLabels(scope.coi);
    sat_steps.satLabBagStorage(scope.coi);
    sat_steps.satLabCryopreservationData(input, scope.coi);
    sat_steps.satLabCryopreservationSummary(scope)
    sat_steps.satLabPrintShipperLabels();
    sat_steps.satLabBagSelection();
    sat_steps.satLabTransferProductToShipper(scope.coi);
    sat_steps.satLabShippingChecklist(1, input.evoLast4Digits, input.tamperSealNumber, scope);
    sat_steps.satShippingSummaryVerify(scope)
  });

  it('Manufacturing flow', () => {
    common.loginAs('steph');
    cy.visit('/manufacturing');
    cy.get('.manufacturing-row_coi')
      .contains('div', scope.coi)
      .click();
    m_steps.manufacturingCollectionSummary();
    m_steps.manufacturingVerifyShipper(scope.coi, 'satellite-lab', '-cclp');
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
    m_steps.confirmLabelApplication(scope.coi)
    m_steps.manufacturingQualityRelease();
    m_steps.manufacturingBagSelection();
    m_steps.manufacturingTransferProductToShipper(scope.coi);
    m_steps.shippingManufacturing(2, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, scope.coi);
    m_steps.manufacturingShippingManufacturingSummary();
  });

  it('Infusion flow', () => {
    common.loginAs('phil');
    cy.visit('/infusion');
    cy.wait(5000);
    cy.contains(scope.patientInformation.subjectNumber).click();
    inf_steps.infusionReceiveShipment('manufacturing-site', '-cclp', scope.coi);
    inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
    inf_steps.infusionShipmentReceiptSummary(scope);
    inf_steps.infusionTransferProductToStorage(scope.coi);
    inf_steps.infusionProductReceiptChecklist();
    inf_steps.infusionProductReceiptSummary(scope);
  });
});
