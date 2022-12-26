import order_steps from '../../utils/HappyPath_steps/LCLP_US_HappyPath/ordering_steps';
import cancel_steps from '../../utils/Regression_steps/cancel_steps'
import header from '../../fixtures/assertions.json';
import input from '../../fixtures/inputs.json';
import common from '../../support/index';
import therapies from '../../fixtures/therapy.json'

context('CANCEL CCLP EU', () => {
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

  let scope = {};
  const therapy = therapies.lclp_us

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
      subjectNumber: generateRandomNumber(),
      screeningDate: input.screeningDate,
      screeningDateFormatted: input.screeningDateFormatted,
      siteNumber: generateRandomNumber(),
    };
    scope.treatmentInformation = {
      prescriber_select_index: 1,
      institution_select_index: 1,
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
    order_steps.SelectTherapy("execution-context-jnj68284528mmy2003");
    order_steps.patient(
      scope.patientInformation,
      header,
      scope.patientHeaderBar,
      header
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
    order_steps.confirmation(scope,scope);

    // Login as Oliver;
    common.loginAs('oliver');
    cy.visit('/ordering');
    cy.get('td[data-testid="patient-identifier"]')
      .contains(scope.patientInformation.subjectNumber)
      .click();

    order_steps.approval(scope,scope);
  });

  it('Cancel flow', () => {

    common.loginAs('oliver');
    cy.visit('/ordering');
    cy.get('td[data-testid="patient-identifier"]')
      .contains(scope.patientInformation.subjectNumber)
      .click();
      cancel_steps.cancelOption(scope);

  });

});

