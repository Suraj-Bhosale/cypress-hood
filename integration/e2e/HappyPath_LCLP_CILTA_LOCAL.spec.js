import order_steps from '../../utils/HappyPath_steps/LCLP_CILTA_LOCAL_HappyPath/ordering_steps_cilta';
import col_steps from '../../utils/HappyPath_steps/LCLP_CILTA_LOCAL_HappyPath/collection_steps_cilta';
import m_steps from '../../utils/HappyPath_steps/LCLP_CILTA_LOCAL_HappyPath/manufacturing_steps_cilta.js';
import inf_steps from '../../utils/HappyPath_steps/LCLP_CILTA_LOCAL_HappyPath/infusion_steps_cilta';
import header from '../../fixtures/assertions.json';
import input from '../../fixtures/inputs.json';
import common from '../../support/index';
import therapies from '../../fixtures/therapy.json'

context('LCLP CILTA Therapy Happy Path', () => {
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
  const therapy = therapies.lclp_cilta
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
    cy.openOrder('ordering','nina');
    order_steps.CreateOrder(header.orders);
    order_steps.SelectTherapy(therapy.context);
    order_steps.AddPatientInformation(
      scope.patientInformation, "", therapy
    );
    order_steps.SelectOrderingSite(
      scope.treatmentInformation,
      header.orderingSite,
      scope.patientHeaderBar,
      header
    );
    //    order_steps.SelectPrescriber(scope.treatmentInformation, header);
    order_steps.schedulingCheckAvailability(therapy)
    //    order_steps.SelectPrescriber(scope.treatmentInformation, header);
    //  order_steps.CheckSchedulingAvailability(therapy)
    order_steps.AddSchedulingOrder(header);
    order_steps.SubmitOrder(scope, therapy);
  });

  it('Collection flow', () => {
    cy.openOrder('collection','arlene')
    cy.commonPagination(scope.patientInformation.patientId,'Patients')
    col_steps.patientVerificationCilta(therapy, scope);
    col_steps.collectionBagIdentificationCilta();
    col_steps.collectionInformationPrinting();
    col_steps.collectionProcedureInformation();
    col_steps.collectionSummaryCilta(scope);
    cy.openOrder('collection','phil')
    cy.commonPagination(scope.patientInformation.patientId,'Patients')
    col_steps.cryopreservationLabels();
    col_steps.cryopreservationBagLabelsAndPackingInsert(scope.coi, therapy);
    col_steps.cryopreservationSummary(scope);
    col_steps.cryopreservationTransferProductToShipper(scope.coi, 'us-lclp-cilta');
    col_steps.cryopreservationShipmentChecklist(scope, therapy);
    col_steps.collectionShippingSummaryEmeaLc(scope, therapy);
  });

  it('Manufacturing flow', () => {
    cy.openOrder('ordering','oliver');
    cy.commonPagination(scope.patientInformation.patientId,'Treatments per Patient');
    cy.getCoiFromOSTPage();
    cy.openOrder('manufacturing','steph');
    cy.get(`@coi`).then(coi => {   
      cy.commonPagination(coi,'Reservations');
      m_steps.manufacturingCollectionSummary(therapy);
      m_steps.manufacturingVerifyShipper(coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');
      m_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
      m_steps.manufacturingShipReceiptSummaryVerify(therapy, scope);
      m_steps.manufacturingTransferProductToStorage(coi, therapy);
      m_steps.manufacturingTransferProductToStorage2(coi);
      m_steps.manufacturingProductReceipt(scope.patientInformation.patientId, therapy);
      m_steps.manufacturingProductReceiptSummaryVerifyEmeaLc(therapy, scope);
      m_steps.manufacturingData(input.expiryDate, scope.patientInformation.orderingLotNumber);
      m_steps.manufacturingFinalLabels(therapy);
      m_steps.manufacturingLabelApplication(coi, therapy);
      m_steps.manufacturingQualityApproval();
      m_steps.manufacturingBagSelection();
      m_steps.manufacturingTransferProductToShipper(coi, therapy);
      m_steps.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, therapy);
      m_steps.manufacturingShippingManufacturingSummaryVerifyCilta(therapy, scope);
    });
  });

  it('Infusion flow', () => {
    cy.openOrder('ordering','oliver')
    cy.commonPagination(scope.patientInformation.patientId,'Treatments per Patient')
    cy.getCoiFromOSTPage();
    cy.openOrder('infusion','phil')
    cy.get(`@coi`).then(coi => { 
      cy.commonPagination(coi,'Reservations')  
      inf_steps.infusionReceiveShipment('manufacturing-site', therapy,coi);
      inf_steps.infusionShipmentReceiptChecklist(therapy, input.evoLast4Digits, input.tamperSealNumber);
      inf_steps.infusionShipmentReceiptSummary(scope, therapy);
      inf_steps.infusionProductReceiptChecklist(therapy);
      inf_steps.infusionProductReceiptSummary(scope, therapy);
    });
  });
});