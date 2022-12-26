import orderingassertions from '../../../fixtures/orderingAssertions.json'
import translationHelpers from "../../../utils/shared_block_helpers/translationHelpers"
import signatureHelpers from '../../../utils/shared_block_helpers/signatureHelpers';
import actionButtonsHelper from '../../../utils/shared_block_helpers/actionButtonHelpers';
import inputHelpers from '../../../utils/shared_block_helpers/inputFieldHelpers';
import inputChecker from '../../shared_block_helpers/inputFieldCheckHelpers';
import inputs from '../../../fixtures/inputs.json';

export default {
  orderingAliases: (therapy) => {
    cy.restoreLocalStorage();
    cy.server();
    cy.intercept('GET', '/physicians*').as('getStepPhysicians');
    cy.intercept('POST', '/signatures').as('postSignature');
    cy.intercept('POST', '/procedures').as('postProcedures');
    cy.intercept("POST", "/graphql").as("patients");
    cy.intercept('PATCH', '/procedure_steps/*').as('patchProcedureSteps');
    cy.intercept('GET', '/procedures/*').as('getProcedures');
    cy.intercept('GET', '/scheduling/schedules/*').as('schedulingServiceSchedule');
    cy.intercept('GET', '/scheduling/milestone_definitions/*').as('schedulingMilestones');
    cy.intercept('POST', '/scheduling/schedules').as('schedulingServiceCreate');
    cy.intercept('POST', new RegExp(`/scheduling/schedules/${therapy}/availability`)).as(
      'schedulingServiceAvailability'
    );
    cy.intercept('GET','/v1/institutions/*').as('getInstitutions')
    cy.intercept('GET', '/procedures?procedure_type=*').as('getProcedureTypeOrdering');
    cy.intercept('GET', '/v1/permissions').as('getPermissions');
    cy.intercept('POST', '/signatures').as('postSignatures');
  },
  orderingData: (scope) => {
    //generate a random 3 digit number
    const generateRandomNumber = () => {
      return Math.floor(100 + Math.random() * 899).toString();
    };
    const firstNameList = ['Bruce', 'Peter', 'Jane', 'Gwen', 'Tony'];
    const pickRandomName = firstNameList[Math.floor(Math.random() * firstNameList.length)];
    const lastNameList = ['Banner', 'Parker', 'Wayne', 'Stark', 'Stacy'];
    const pickRandomLastName = lastNameList[Math.floor(Math.random() * lastNameList.length)];

    scope.patientId = `${new Date().getTime()}`.substring(0,11);
    scope.patientInformation = {
      firstName: pickRandomName,
      lastName: pickRandomLastName,
      middleName: '$',
      patientId: scope.patientId,
      subjectId: generateRandomNumber() + - + generateRandomNumber(),
      screeningDate: '05222019',
      siteNumber: generateRandomNumber(),
    };
    scope.treatmentInformation = {
      prescriber_select_index: 1,
      institution_select_index: 1,
    };
    scope.treatment = {
      coi: ""
    }
  },

  createOrder: () => {
    cy.get('[data-testid="add-patient-button"]',{timeout:90000});
    cy.get('[data-testid="add-patient-button"]').click();
  },

  selectTherapy: (contextId) => {
    cy.get(`[data-testid="execution-context-${contextId}"]`,{timeout:90000});
    cy.get(`[data-testid="execution-context-${contextId}"]`).click();
    cy.wait('@postProcedures');
    cy.wait('@getPermissions');
  },

  subjectRegistration: (patientData,treatmentInfo,therapy) => {
    cy.log('Subjects Registration');
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertSingleField(`[data-testid="orderingPhase.${therapy}.patientInformationHeader.subject_id"]`,
        orderingassertions.registerSubject.headerSubjectId);
      translationHelpers.assertSingleField(`[data-testid="orderingPhase.${therapy}.patientInformationHeader.product"]`,
        orderingassertions.registerSubject.headerProduct);
      translationHelpers.assertSingleField(`[data-testid="orderingPhase.${therapy}.patientInformationHeader.protocol"]`,
        orderingassertions.registerSubject.headerProtocol);
      translationHelpers.assertSingleField(`[data-testid="orderingPhase.${therapy}.patientInformationHeader.coi"]`,
        orderingassertions.registerSubject.headerCoi);
      translationHelpers.assertPageTitles('[data-test-id="ordering_subject_registration"]','h1',
        orderingassertions.registerSubject.title);
      translationHelpers.assertSingleField('[data-testid="progress-register_subject-name"]',
        orderingassertions.registerSubject.phaseName);
      translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',
        0,'h3', orderingassertions.registerSubject.headerFirst,0);
      translationHelpers.assertSingleField('[data-testid="section-heading-description"]',
        orderingassertions.registerSubject.description);
      translationHelpers.assertSectionChildElement('[id="#/properties/custom_fields/properties/dob"]',
        0,'label', orderingassertions.registerSubject.textDateOfBirth,0);
      translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',
        1,'h3', orderingassertions.registerSubject.headerSecond,0);
      translationHelpers.assertSingleField('[id="#/properties/identifier"]',
        orderingassertions.registerSubject.textSubjectId);
      translationHelpers.assertSingleField('[data-testid="question-text-subject_consent_toggle"]',
        orderingassertions.registerSubject.checkboxQuestion);
      translationHelpers.assertSingleField('[data-testid="pass-button-subject_consent_toggle"]',
        orderingassertions.registerSubject.yesToggle);
      translationHelpers.assertSingleField('[data-testid="fail-button-subject_consent_toggle"]',
        orderingassertions.registerSubject.noToggle);
      translationHelpers.assertSingleField('div[class="institution"] h4',
        orderingassertions.registerSubject.headerThird);
      translationHelpers.assertSingleField('div[class="institution-dropdown-key"]',
        orderingassertions.registerSubject.orderingSiteDescription);
      translationHelpers.assertSingleField('div[class="select-box"] label',
        orderingassertions.registerSubject.orderingSiteDropdownTitle);
      }
    inputHelpers.inputDateField("[data-testid='#/properties/custom_fields/properties/dob-input']",
      inputs.ordering.global.patientDateOfBirth)
    inputHelpers.inputSingleField('[data-testid="#/properties/identifier-input"]', patientData.subjectId)
    cy.get("[data-testid='primary-button-action']").should('be.disabled');
    inputHelpers.clicker('[data-testid="pass-button-subject_consent_toggle"]')
    cy.get("[data-testid='primary-button-action']").should('be.visible');
    cy.waitForElementAndClick('[data-testid="institution_id"] .select');
    cy.get(`[data-testid="institution_id"] .select-content li:nth-child(${treatmentInfo.prescriber_select_index})`)
      .should('be.visible')
    cy.waitForElementAndClick(`[data-testid="institution_id"] .select-content li:nth-child(${treatmentInfo.prescriber_select_index})`);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  principal_investigator_information: (treatmentInfo) => {
    cy.log('Principal Investigator Information');
   if (Cypress.env('runWithHelpers')) {
    translationHelpers.assertPageTitles('[data-test-id="ordering_principal_investigator_information"]','h1',
      orderingassertions.principalInvestigatorInformation.title)
    translationHelpers.assertSingleField('[data-testid="progress-register_subject-name"]',
      orderingassertions.principalInvestigatorInformation.phaseName)
    translationHelpers.assertPrescriberTitle('div[class="prescriber"] h4',
      orderingassertions.principalInvestigatorInformation.headerFirstAardvark,
      orderingassertions.principalInvestigatorInformation.headerFirstRichmond)
    translationHelpers.assertSingleField('span[class="prescriber-dropdown-key"]',
      orderingassertions.principalInvestigatorInformation.description)
    translationHelpers.assertSingleField('div[class="select-box"] label',
      orderingassertions.principalInvestigatorInformation.dropDownLabel)
    translationHelpers.assertSingleField('[data-testid="secondary-button-action"]',
      orderingassertions.principalInvestigatorInformation.saveAndCloseButton)
    translationHelpers.assertSingleField('.select-title.empty',
      orderingassertions.principalInvestigatorInformation.dropdownPlaceholder)
    }
    cy.get("[data-testid='primary-button-action']").should('be.disabled');
    inputHelpers.clicker('[data-testid="physician_user_id"] .select')
    inputHelpers.clicker(`[data-testid="physician_user_id"] .select-content li:nth-child(${
      treatmentInfo.prescriber_select_index})`)

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  scheduleCollection: (institution) => {
    cy.log('Schedule Collection');
    if (Cypress.env('runWithHelpers')) {
    translationHelpers.assertPageTitles('[data-test-id="ordering_schedule_collection"]','h1',
      orderingassertions.scheduling.title)
    translationHelpers.assertSingleField('[data-testid="progress-schedule_collection-name"]',
      orderingassertions.scheduling.phaseName)
    translationHelpers.assertSingleField(`[data-testid="lbl-schedule-title-${institution}"]`,
      orderingassertions.scheduling.header)
    translationHelpers.assertSingleField(`[data-testid="lbl-site-select-${institution}"]`,
      orderingassertions.scheduling.dropdownLabel)
    translationHelpers.assertSingleField(`[data-testid="lbl-contact-person-${institution}"]`,
      orderingassertions.scheduling.textContactName)
    translationHelpers.assertSingleField(`[data-testid="lbl-phone-number-${institution}"]`,
      orderingassertions.scheduling.textContactPhoneNumber)
    translationHelpers.assertSingleField(`[data-testid="lbl-additional-notes-${institution}"]`,
      orderingassertions.scheduling.textAdditionalNotes)
    translationHelpers.assertSingleField(`[data-testid="lbl-selected-date-${institution}"]`,
      orderingassertions.scheduling.description)
    translationHelpers.assertSingleField('[data-testid="btn-schedule"]',
      orderingassertions.scheduling.textButton)    
    translationHelpers.assertSingleField('.scheduler-detachedDateLabel-26',
      orderingassertions.scheduling.resectionAndEstimatedDate)
    }
    inputChecker.explicitWait('[data-test-id="ordering_schedule_collection"]');
    cy.wait("@getProcedures")
    cy.wait("@schedulingMilestones");
    cy.waitForSchedulingLoader({ institutionType: institution })
    cy.scheduleFirstAvailableDate({ institutionType: institution });
    cy.get('[data-testid="btn-schedule"]').click().then(() => {
        cy.wait('@schedulingServiceCreate');
      });
    cy.get(`[data-testid="btn-schedule"]`).should('be.disabled');

    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },


  confirmOrder: (subjectId) => {
    cy.log('Confirm Order');
    if (Cypress.env('runWithHelpers')) {
      translationHelpers.assertPageTitles('[data-test-id="ordering_confirm_order"]','h1',
        orderingassertions.confirmOrder.title);
      translationHelpers.assertSingleField('[data-testid="progress-confirm_order-name"]',
        orderingassertions.confirmOrder.phaseName);
      translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3',
        orderingassertions.confirmOrder.subjectInformationHeading);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        0,'div', orderingassertions.confirmOrder.dateOfBirth,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        0,'span', inputs.ordering.global.patientDateOfBirth,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        1,'div', orderingassertions.confirmOrder.product,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        1,'span', orderingassertions.confirmOrder.productName,0);  
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        2,'div', orderingassertions.confirmOrder.indication,0);
        translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        2,'span', orderingassertions.confirmOrder.indicationName,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        3,'div', orderingassertions.confirmOrder.subjectId,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        3,'span', subjectId,0);  
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        4,'div', orderingassertions.confirmOrder.toggleDescription,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        4,'span', orderingassertions.confirmOrder.toggleDescriptionValue,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        5,'div', orderingassertions.confirmOrder.siteName,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        5,'span', orderingassertions.confirmOrder.siteNameValue,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        6,'div', orderingassertions.confirmOrder.siteNumber,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        7,'div', orderingassertions.confirmOrder.siteAddress,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        7,'span', orderingassertions.confirmOrder.siteAddressValue,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        8,'div', orderingassertions.confirmOrder.siteCity,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        8,'span', orderingassertions.confirmOrder.siteCityValue,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        9,'div', orderingassertions.confirmOrder.siteCountry,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        9,'span', orderingassertions.confirmOrder.siteCountryValue,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        10,'div', orderingassertions.confirmOrder.sitePostalCode,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        10,'span', orderingassertions.confirmOrder.sitePostalCodeValue,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        11,'div', orderingassertions.confirmOrder.principalInvestigatorName,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        11,'span', orderingassertions.confirmOrder.principalInvestigatorNameValue,0);
      cy.wait(3000);

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        12,'div', orderingassertions.confirmOrder.collectionDate,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        13,'div', orderingassertions.confirmOrder.collectionSiteName,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        13,'span', orderingassertions.confirmOrder.collectionSiteNameValue,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        14,'div', orderingassertions.confirmOrder.collectionSiteNumber,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        15,'div', orderingassertions.confirmOrder.collectionSiteAddress,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        15,'span', orderingassertions.confirmOrder.collectionSiteAddressValue,0);  
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        16,'div', orderingassertions.confirmOrder.siteCity,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        16,'span', orderingassertions.confirmOrder.siteCityValue,0);  
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        17,'div', orderingassertions.confirmOrder.siteCountry,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        17,'span', orderingassertions.confirmOrder.siteCountryValue,0);  
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        18,'div', orderingassertions.confirmOrder.sitePostalCode,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        18,'span', orderingassertions.confirmOrder.sitePostalCodeValue,0);  
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        19,'div', orderingassertions.confirmOrder.collectionSiteContactName,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        19,'span', orderingassertions.confirmOrder.collectionSiteContactNameValue,0);  
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        20,'div', orderingassertions.confirmOrder.collectionSiteContactNumber,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        20,'span', orderingassertions.confirmOrder.collectionSiteContactNumberValue,0);  
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        21,'div', orderingassertions.confirmOrder.collectionSiteAdditionalNotes,0);
      translationHelpers.assertSingleField('[data-test-id="section-heading-block-block"]',
        orderingassertions.confirmOrder.reviewAndConfirm);
      translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3',
        orderingassertions.confirmOrder.treatmentOrderingSiteHeading, 2);
      translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3',
        orderingassertions.confirmOrder.principalInvestigatorheading, 3);
      translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3',
        orderingassertions.confirmOrder.schedulingHeading, 4);
      translationHelpers.assertSingleField('[data-testid="secondary-button-action"]',
        orderingassertions.confirmOrder.saveAndCloseButton)  
      translationHelpers.assertSingleField('[data-testid="primary-button-action"]',
        orderingassertions.confirmOrder.submitOrder)  
      }
    inputChecker.explicitWait('[data-test-id="ordering_confirm_order"]'); 
    cy.wait(3000);
    cy.get('[data-testid="display-only"]',{timeout:60000}).eq(12).find('span').eq(0).invoke('text');
    cy.get('[data-testid="display-only"]',{timeout:60000}).eq(15).find('span').eq(0).invoke('text');
    cy.get('[data-testid="display-only"]',{timeout:60000}).eq(16).find('span').eq(0).invoke('text');
    cy.get('[data-testid="display-only"]',{timeout:60000}).eq(18).find('span').eq(0).invoke('text');
    cy.get('[data-testid="display-only"]',{timeout:60000}).eq(20).find('span').eq(0).invoke('text');
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  confirm_subject_eligibility: () => {
    cy.log('Confirm Subject Eligibility');
    if (Cypress.env('runWithHelpers')) {
    translationHelpers.assertPageTitles('[data-test-id="ordering_confirm_subject_eligibility"]','h1',
      orderingassertions.confirmSubjectEligibility.title);
    translationHelpers.assertSingleField('[data-testid=progress-approve_order-name]',
      orderingassertions.confirmSubjectEligibility.phaseName);
    translationHelpers.assertSingleField('[data-testid="section-heading-title"]',
      orderingassertions.confirmSubjectEligibility.subjectInformationHeading);
    translationHelpers.assertSingleField('[data-testid="question-text-subject_eligibility_confirmed_toggle"]',
      orderingassertions.confirmSubjectEligibility.subjectEligibilityConfirmed);
    translationHelpers.assertSingleField('[data-testid="pass-button-subject_eligibility_confirmed_toggle"]',
      orderingassertions.registerSubject.yesToggle);
    translationHelpers.assertSingleField('[data-testid="fail-button-subject_eligibility_confirmed_toggle"]',
      orderingassertions.registerSubject.noToggle);  
    translationHelpers.assertSingleField('[data-testid="secondary-button-action"]',
      orderingassertions.confirmSubjectEligibility.saveAndCloseButton)  
    }
    inputChecker.explicitWait('[data-test-id="ordering_confirm_subject_eligibility"]');
    inputHelpers.clicker('[data-testid="pass-button-subject_eligibility_confirmed_toggle"]')
    cy.get("[data-testid='primary-button-action']").should('be.visible');
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  approveOrder: (subjectId) => {
    cy.log('Approve Order');
     if (Cypress.env('runWithHelpers')) {
    translationHelpers.assertPageTitles('[data-test-id="ordering_approve_order"]','h1',
      orderingassertions.approveOrder.title);
    translationHelpers.assertSingleField('[data-testid=progress-approve_order-name]',
      orderingassertions.approveOrder.phaseName);
    translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3',
      orderingassertions.approveOrder.subjectInformationHeading);
    translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3',
      orderingassertions.approveOrder.studyInformationHeading, 1);
    translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3',
      orderingassertions.approveOrder.treatmentOrderingSiteHeading, 2);
    translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3',
      orderingassertions.approveOrder.principalInvestigatorheading, 3);
    cy.wait(3000);
    translationHelpers.assertChildElement('[data-test-id="section-heading-block-block"]', 'h3',
      orderingassertions.approveOrder.reviewedAndConfirmed, 0);
    translationHelpers.assertChildElement('[data-test-id="section-heading-block-block"]', 'h3',
      orderingassertions.approveOrder.approveOrder, 1)  
    translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3',
      orderingassertions.approveOrder.schedulingHeading, 4)
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      0,'div', orderingassertions.approveOrder.dateOfBirth,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      0,'span', inputs.ordering.global.patientDateOfBirth,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      1,'div', orderingassertions.approveOrder.product,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      1,'span', orderingassertions.approveOrder.productName,0);   
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      2,'div', orderingassertions.approveOrder.indication,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      2,'span', orderingassertions.approveOrder.indicationName,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      3,'div', orderingassertions.approveOrder.subjectId,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      3,'span', subjectId,0);    
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      4,'div', orderingassertions.approveOrder.toggleDescription,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      4,'span', orderingassertions.approveOrder.toggleDescriptionValue,0);  

    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      5,'div', orderingassertions.confirmSubjectEligibility.subjectEligibilityConfirmed,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      5,'span', orderingassertions.approveOrder.subjectEligibilityConfirmedValue,0);  

    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      6,'div', orderingassertions.approveOrder.siteName,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      6,'span', orderingassertions.approveOrder.siteNameValue,0);  
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      7,'div', orderingassertions.approveOrder.siteNumber,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      8,'div', orderingassertions.approveOrder.siteAddress,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      8,'span', orderingassertions.approveOrder.siteAddressValue,0);  
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      9,'div', orderingassertions.approveOrder.siteCity,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      9,'span', orderingassertions.approveOrder.siteCityValue,0);  
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      10,'div', orderingassertions.approveOrder.siteCountry,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      10,'span', orderingassertions.approveOrder.siteCountryValue,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      11,'div', orderingassertions.approveOrder.sitePostalCode,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      11,'span', orderingassertions.approveOrder.sitePostalCodeValue,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      12,'div', orderingassertions.approveOrder.principalInvestigatorName,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      12,'span', orderingassertions.approveOrder.principalInvestigatorNameValue,0);  
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      13,'div', orderingassertions.approveOrder.collectionDate,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      14,'div', orderingassertions.approveOrder.collectionSiteName,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      14,'span', orderingassertions.approveOrder.collectionSiteNameValue,0);  
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      15,'div', orderingassertions.approveOrder.collectionSiteNumber,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      16,'div', orderingassertions.approveOrder.collectionSiteAddress,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      16,'span', orderingassertions.approveOrder.collectionSiteAddressValue,0);   
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      17,'div', orderingassertions.approveOrder.siteCity,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      17,'span', orderingassertions.approveOrder.siteCityValue,0);  
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      18,'div', orderingassertions.approveOrder.siteCountry,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      18,'span', orderingassertions.approveOrder.siteCountryValue,0); 
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      19,'div', orderingassertions.approveOrder.sitePostalCode,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      19,'span', orderingassertions.approveOrder.sitePostalCodeValue,0); 
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      20,'div', orderingassertions.approveOrder.collectionSiteContactName,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      20,'span', orderingassertions.approveOrder.collectionSiteContactNameValue,0);   
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      21,'div', orderingassertions.approveOrder.collectionSiteContactNumber,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      21,'span', orderingassertions.approveOrder.collectionSiteContactNumberValue,0);    
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      22,'div', orderingassertions.approveOrder.collectionSiteAdditionalNotes,0);
    translationHelpers.assertSingleField('[data-testid="secondary-button-action"]',
      orderingassertions.approveOrder.saveAndCloseButton)  
    translationHelpers.assertSingleField('[data-testid="primary-button-action"]',
      orderingassertions.approveOrder.approveOrderButton)    
    }
    inputChecker.explicitWait('[data-test-id="ordering_approve_order"]');
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']});
    inputChecker.explicitWait('[data-testid="approver-sign-button"]');
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
    
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    });
  },

  getCoi: () => {
    cy.get(`[data-testid="orderingPhase.cd30Eu.patientInformationHeader.coi-value"]`)
    .invoke(`text`)
    .as(`coi`);
    cy.get(`@coi`).then((coi) => {
      cy.log("COI is :", coi);
    });
  }
}
