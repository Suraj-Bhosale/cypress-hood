import order_steps from '../../utils/ordering_steps_cilta';
import wdc_steps from '../../utils/wdc_steps'
import order_steps_eu from '../../utils/ordering_steps'
import col_steps from '../../utils/collection_steps_cilta';
import schedulingSteps from '../../utils/scheduling_steps.js';
import m_steps from '../../utils/manufacturing_steps_cilta.js';
import inf_steps from '../../utils/infusion_steps_cilta';
import sat_steps from '../../utils/satelite_lab_steps_cilta'
import header from '../../fixtures/assertions.json';
import input from '../../fixtures/inputs.json';
import common from '../../support/index';
import therapies from '../../fixtures/therapy.json'

context('EMEA CCDC Therapy Happy Path', () => {
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
    cy.route('POST', new RegExp('/scheduling/schedules/EU:Cilta-Cel:jnj/draft')).as(
      'schedulingServiceDraft'
    );
    cy.route('POST', new RegExp('/scheduling/schedules/EU:Cilta-Cel:jnj/availability')).as(
      'schedulingServiceAvailability'
    );
    cy.route('GET', '/procedures?procedure_type=ordering').as('getProcedureTypeOrdering');
    cy.route('POST', '/print').as('postPrint');
    cy.route('POST', '/label_scans/verifications').as('labelVerifications');
    cy.route('POST', '/label_scans/values').as('createLabelScanValue');
    cy.route('GET', 'v1/institution_types').as('getInstitutions');
  });

  const scope = {};

  before(() => {
    const generateRandomNumber = () => {
      //generate a random 3 digit number
      return Math.floor(1000 + Math.random() * 9000).toString();
    };
    const firstNameList = input.firstNameList;
    const pickRandomName = firstNameList[Math.floor(Math.random() * firstNameList.length)]
    const lastNameList = input.lastNameList;
    const pickRandomLastName = lastNameList[Math.floor(Math.random() * lastNameList.length)]
    scope.patientId = `${new Date().getTime()}-id`;
    scope.patientInformation = {
      firstName: pickRandomName,
      lastName: pickRandomLastName,
      middleName: input.middleName,
      dateOfBirth: input.dateOfBirth,
      dataOfBirthHeaderFormat: input.dataOfBirthHeaderFormat,
      patientId: scope.patientId,
      orderId: generateRandomNumber(),
      screeningDate: input.screeningDate,
      screeningDateFormatted: input.screeningDateFormatted,
      siteNumber: generateRandomNumber(),
      orderingLotNumber: generateRandomNumber(),
      patientId: generateRandomNumber(),
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

  it('Create and Approve Order', () => {
    common.loginAs('nina');
    cy.visit('/ordering');
    order_steps.CreateOrder(header.orders);
    order_steps.SelectTherapy("execution-context-cilta-cel-jnj-emea-cclp-dc");
    order_steps.AddPatientInformation(
      scope.patientInformation,
      true
    );
    order_steps.SelectOrderingSite(
      scope.treatmentInformation,
      header.orderingSite,
      scope.patientHeaderBar,
      header
    );
    order_steps.schedulingCheckAvailability('_emea_ccdc')
    order_steps.AddSchedulingOrder(header);
    order_steps.SubmitOrder(scope);
  });

  it('Collection flow', () => {
    common.loginAs('arlene');
    cy.visit('/collection');
    common.loadCollection();
    cy.waitForElementAndClick(`tr[data-testid="treatment-${scope.coi}"]`);
    col_steps.patientVerification();
    col_steps.collectionBagIdentification();
    col_steps.collectionBagLabelCentralPrinting();
    col_steps.collectionProcedureInformation();

    col_steps.collectionSummary(scope);

    common.loginAs('phil');
    cy.visit('/collection');
    common.loadCollection();
    cy.waitForElementAndClick(`tr[data-testid="treatment-${scope.coi}"]`);
    col_steps.transferProductToShipper(scope.coi, input.day1Bag1Udn, 'emea-ccdc');
    col_steps.collectionShipmentChecklistCELLEX(scope);
    col_steps.cryopreservationShippingSummary();
  });

  it('Satellite Lab flow', () => {
    common.loginAs('steph');
    cy.visit('/satellite_lab');
    cy.contains(scope.coi).click();
    sat_steps.satLabCollectionSummary();
    sat_steps.satLabVerifyShipment(scope.coi, 'emea-ccdc', 'from-satellite-lab', 'to-manufacturing-site');
    sat_steps.satLabShipmentChecklist(input.day1Bag1Udn);
    sat_steps.satLabShipmentChecklistSummary();
    sat_steps.satLabCryopreservation(input.itemCount);
    sat_steps.satLabCryopreservationLabelscclp(scope.coi);
    sat_steps.satLabBagStorage(scope.coi);
    sat_steps.satSummaryVerify();
    sat_steps.satLabPrintShipperLabels();
    sat_steps.satLabBagSelection();
    sat_steps.satLabTransferProductToShipper('-emea-ccdc', scope.coi);
    sat_steps.satLabShippingChecklist(0,input.evoLast4Digits, input.tamperSealNumber, scope);
    sat_steps.satSummaryVerify();
  });
  it('Manufacturing flow', () => {
    common.loginAs('steph');
    cy.visit('/manufacturing');
    cy.get('.manufacturing-row_coi')
      .contains('div', scope.coi)
      .click();
    m_steps.manufacturingCollectionSummary();
    m_steps.manufacturingVerifyShipper(scope.coi, 'emea-ccdc', 'from-satellite-lab', 'to-manufacturing-site');
    m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
    m_steps.manufacturingSummaryVerify(header.shipReceiptChecklistSummary);
    m_steps.manufacturingTransferProductToStorageCCLP(scope.coi);
    m_steps.manufacturingTransferProductToStorage2(scope.coi);
    m_steps.manufacturingProductReceipt(scope.patientInformation.patientId);
    m_steps.manufacturingSummaryVerify(header.productReceiptSummary);
    m_steps.manufacturingData(input.expiryDate, scope.patientInformation.orderingLotNumber);
    m_steps.manufacturingFinalLabels();
    m_steps.manufacturingLabelApplication(scope.coi);
    m_steps.manufacturingReleaseToShip();
    m_steps.manufacturingBagSelection();
    m_steps.manufacturingTransferProductToShipper(scope.coi);
    m_steps.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, true);
    m_steps.manufacturingSummaryVerify(header.shippingManufacturing)
  });

  it('WDC flow', () => {
    common.loginAs('steph');
    cy.visit('/wdc');
    cy.get('.wdc-row_coi')
      .contains('div', scope.coi)
      .click();
    wdc_steps.wdcVerifyShipper('-emea-ccdc', scope.coi);
    wdc_steps.wdcShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
    wdc_steps.wdcSummary();
    wdc_steps.wdcTransferProductToStorageEmea(scope.coi);
    wdc_steps.wdcProductReceiptEmea(input.pisNumber, input.lotNumber);
    wdc_steps.wdcSummary();
    wdc_steps.wdcPrintShipperLabels();
    wdc_steps.wdcTransferProductToShipperEmeaCcdc(scope.coi);
    wdc_steps.wdcShippingEmeaCcdc(2,scope, input.lotNumber, scope.coi, input.evoLast4Digits, input.tamperSealNumber);
    wdc_steps.wdcSummary();
  });


  it('Infusion flow', () => {
    common.loginAs('phil');
    cy.visit('/infusion');
    cy.get('.patient-id')
      .contains(scope.patientInformation.patientId)
      .click();
    inf_steps.infusionReceiveShipment('world-distribution-center', '-emea-ccdc', scope.coi);
    inf_steps.infusionShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber,true);
    inf_steps.infusionShipmentReceiptSummary(scope);
    inf_steps.infusionProductReceiptChecklist();
    inf_steps.infusionProductReceiptSummary(scope);
  });
});
