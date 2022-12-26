import order_steps from '../../utils/HappyPath_steps/EMEA_LCLP_DC_HappyPath/ordering_steps_cilta';
import col_steps from '../../utils/HappyPath_steps/EMEA_LCLP_DC_HappyPath/collection_steps_cilta';
import wdc_steps from '../../utils/HappyPath_steps/EMEA_LCLP_DC_HappyPath/wdc_steps_cilta'
import m_steps from '../../utils/HappyPath_steps/EMEA_LCLP_DC_HappyPath/manufacturing_steps_cilta.js';
import inf_steps from '../../utils/HappyPath_steps/EMEA_LCLP_DC_HappyPath/infusion_steps_cilta';
import header from '../../fixtures/assertions.json';
import input from '../../fixtures/inputs.json';
import common from '../../support/index';
import therapies from '../../fixtures/therapy.json';


context('EMEA LCDC Therapy Happy Path', () => {
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
  const therapy = therapies.emea_lcdc;
  const region = 'US';
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

  it('Create and Approve Order', () => {
    common.loginAs('nina');
    cy.visit('/ordering');
    order_steps.CreateOrder(header.orders);
    order_steps.SelectTherapy(therapy.context);
    order_steps.AddPatientInformation(
      scope.patientInformation,true, therapy
    );
    order_steps.SelectOrderingSite(
      scope.treatmentInformation,
      header.orderingSite,
      scope.patientHeaderBar,
      header
    );
//    order_steps.SelectPrescriber(scope.treatmentInformation, header);
    order_steps.schedulingCheckAvailability(therapy);
    order_steps.AddSchedulingOrder(header);
    order_steps.SubmitOrder(scope, therapy);
  });

  it('Collection flow', () => {
    common.loginAs('arlene');
    cy.visit('/collection');
    common.loadCollection();
    cy.waitForElementAndClick(`tr[data-testid="treatment-${scope.coi}"]`);
    col_steps.patientVerificationEmeaLc(therapy, scope);
    col_steps.collectionBagIdentificationEmeaLc(therapy);
    col_steps.collectionInformationPrinting();
    col_steps.collectionProcedureInformation();
    col_steps.collectionSummaryEmeaLc(scope,therapy);
    common.loginAs('phil');
    cy.visit('/collection');
    common.loadCollection();
    cy.get(`tr[data-testid="treatment-${scope.coi}"]`).click();
    col_steps.cryopreservationLabels();
    col_steps.cryopreservationBagLabelsAndPackingInsert(scope.coi);
    col_steps.cryopreservationSummary(scope);
    col_steps.cryopreservationTransferProductToShipperEmeaLc(scope.coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');
    col_steps.cryopreservationShipmentChecklist(scope);
    col_steps.collectionShippingSummaryEmeaLc(scope,therapy);
  });

  it('Manufacturing flow', () => {
    common.loginAs('steph');
    cy.visit('/manufacturing');
    cy.get('.manufacturing-row_coi')
      .contains('div', scope.coi)
      .click();
    m_steps.manufacturingCollectionSummary(therapy);
    m_steps.manufacturingVerifyShipper(scope.coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');
    m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
    m_steps.manufacturingShipReceiptSummaryVerify(therapy,scope);
    m_steps.manufacturingTransferProductToStorage(scope.coi, therapy);
    m_steps.manufacturingTransferProductToStorage2(scope.coi, therapy);
    m_steps.manufacturingProductReceipt(scope.patientInformation.patientId, therapy);
    m_steps.manufacturingProductReceiptSummaryVerifyEmeaLc(therapy, scope);
    m_steps.manufacturingData(input.expiryDate, scope.patientInformation.orderingLotNumber);
    m_steps.manufacturingFinalLabels(therapy);
    m_steps.manufacturingLabelApplication(scope.coi, therapy);
    m_steps.manufacturingQualityApproval();
    m_steps.manufacturingBagSelection();
    m_steps.manufacturingTransferProductToShipper(scope.coi, therapy);
    m_steps.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, therapy);
    m_steps.manufacturingShippingManufacturingSummaryVerifyEmeaLc(therapy,scope)
  });

    it('WDC flow', () => {
    common.loginAs('steph');
    cy.visit('/wdc');
    cy.get('.wdc-row_coi')
      .contains('div', scope.coi)
      .click();
    wdc_steps.wdcVerifyShipper('-emea-lcdc', scope.coi);
    wdc_steps.wdcShipmentReceiptChecklist();
    wdc_steps.wdcShipmentReceiptChecklistSummary(therapy, scope, scope.patientInformation.siteNumber);
    wdc_steps.wdcTransferProductToStorageEmea(scope.coi, therapy);
    wdc_steps.wdcProductReceiptEmea(therapy, input.pisNumber);
    wdc_steps.wdcProductRecieptSummary(therapy, scope.patientInformation);
    wdc_steps.wdcPrintPackingInsert();
    wdc_steps.wdcTransferProductToShipperEmeaCcdc(scope.coi);
    wdc_steps.wdcShippingWorldDistributionCenterEmeaCcdc(2,scope, input.lotNumberNeumeric, scope.coi, input.evoLast4Digits, input.tamperSealNumber);
    wdc_steps.wdcShippingWorldDistributionCenterSummaryEmeaCcdc(therapy, scope.coi);
  });

  it('Infusion flow', () => {
    common.loginAs('phil');
    cy.visit('/infusion');
    cy.get('.patient-id')
      .contains(scope.patientInformation.patientId)
      .click();
    inf_steps.infusionReceiveShipment('world-distribution-center', therapy, scope.coi);
    inf_steps.infusionShipmentReceiptChecklist(therapy, input.evoLast4Digits, input.tamperSealNumber);
    inf_steps.infusionShipmentReceiptSummary(scope,therapy);
    inf_steps.infusionProductReceiptChecklist(therapy);
    inf_steps.infusionProductReceiptSummary(scope, therapy);
  });
});
