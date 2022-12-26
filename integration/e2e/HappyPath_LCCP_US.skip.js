import order_steps from '../../utils/HappyPath_steps/LCCP_US_HappyPath/ordering_steps';
import col_steps from '../../utils/HappyPath_steps/LCCP_US_HappyPath/collection_steps';
import m_steps from '../../utils/HappyPath_steps/LCCP_US_HappyPath/manufacturing_steps.js';
import inf_steps from '../../utils/HappyPath_steps/LCCP_US_HappyPath/infusion_steps';
import header from '../../fixtures/assertions.json';
import input from '../../fixtures/inputs.json';
import common from '../../support/index';
import therapies from '../../fixtures/therapy.json'

context('LCCP US Therapy Happy Path', () => {
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
  const therapy = therapies.lccp_us
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
    order_steps.schedulingCheckAvailability(therapy);
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
    col_steps.centralLabelPrinting(therapy);
    col_steps.labelShipping();
    col_steps.patientVerification(therapy);
    col_steps.collectionBagIdentification(therapy);
    col_steps.collectionBagLabel(therapy);
    col_steps.collectionProcedureInformation();
    col_steps.bagDataEntryDay(scope.coi);
    col_steps.collectionSummary(scope, therapy);
    col_steps.changeOfCustody(scope.coi);
    common.loginAs('phil');
    cy.visit('/collection');
    common.loadCollection();
    cy.get(`tr[data-testid="treatment-${scope.coi}"]`).click();
    col_steps.confirmChangeOfCustody(scope.coi);
    col_steps.confirmNumberofBags();
    col_steps.shipperLabels(scope.coi, therapy);
    col_steps.collectionBagStorage(scope.coi);
    col_steps.cryopreservationDataLocal(scope.coi);
    col_steps.cryopreservationSummary(scope);
    col_steps.cryopreservationBagSelection();
    col_steps.cryopreservationTransferProductToShipper(scope.coi);
    col_steps.cryopreservationShipmentChecklist(scope, therapy);
    col_steps.cryopreservationShippingSummary(scope, therapy);
  });

  it('Manufacturing flow', () => {
    common.loginAs('steph');
    cy.visit('/manufacturing');

    cy.get(`td[data-testid="manufacturing-row-${scope.coi}-step"]`).click();
    m_steps.manufacturingCollectionSummary(therapy);
    m_steps.manufacturingVerifyShipper(scope.coi, 'apheresis-site', '-lccp');
    m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
    m_steps.manufacturingShipmentReceiptChecklistSummary(scope);
    m_steps.manufacturingTransferProductToStorage(scope.coi);
    m_steps.manufacturingTransferProductToStorage2(scope.coi);
    m_steps.manufacturingProductReceipt(scope.patientInformation);
    m_steps.manufacturingProductReceiptSummary(therapy, scope);
    m_steps.manufacturingStart();
    m_steps.manufacturingSelectExpiryData();
    m_steps.manufacturingConfirmExpiryData();
    m_steps.manufacturingFinalLabels(therapy);
    m_steps.manufacturingLabelApplication(scope.coi);
    m_steps.manufacturingQualityRelease();
    m_steps.manufacturingBagSelection();
    m_steps.manufacturingTransferProductToShipper(scope.coi);
    m_steps.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, therapy);
    m_steps.manufacturingShippingManufacturingSummary(therapy);
  });

  it('Infusion flow', () => {
    common.loginAs('phil');
    cy.visit('/infusion');
    cy.get(".patient-id")
      .contains(scope.patientInformation.subjectNumber)
      .click();
    inf_steps.infusionReceiveShipment('manufacturing-site', '-lccp', scope.coi);
    inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
    inf_steps.infusionShipmentReceiptSummary(scope);
    inf_steps.infusionTransferProductToStorage(scope.coi);
    inf_steps.infusionProductReceiptChecklist();
    inf_steps.infusionProductReceiptSummary(scope);
  });
});
