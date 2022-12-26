import order_steps from '../../utils/ordering_steps_cilta';
import cancel_steps from '../../utils/cancel_steps_cilta'
import header from '../../../fixtures/assertions.json';
import input from '../../../fixtures/inputs.json';
import common from '../../../support/index';
import therapies from '../../../fixtures/therapy.json';

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
    const therapy = therapies.emea_ccdc;
  
  
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
        lotNumber: generateRandomNumber(),
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
      scope.patientInformation,
      true, therapy
    );
    order_steps.SelectOrderingSite(
      scope.treatmentInformation,
      header.orderingSite,
      scope.patientHeaderBar,
      header
    );
    order_steps.CheckSchedulingAvailability(therapy);
    cy.wait(4000);
    order_steps.AddSchedulingOrder(header);
    order_steps.SubmitOrder(scope, therapy);
  });

  it('Cancel flow', () => {
   
    common.loginAs('oliver');
    cy.visit('/ordering');
    cy.get('td[data-testid="patient-identifier"]')
      .contains(scope.patientInformation.patientId)
      .click();
      cancel_steps.cancelOption(scope);

  });
});