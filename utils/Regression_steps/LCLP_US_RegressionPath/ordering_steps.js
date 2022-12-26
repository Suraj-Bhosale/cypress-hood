import input from '../../../fixtures/inputs.json'
import header from '../../../fixtures/assertions.json'
import common from '../../../support/index'
import schedulingSteps from '../../../utils/HappyPath_steps/scheduling_steps'
import translationHelpers from '../../shared_block_helpers/translationHelpers'
import orderingAssertions from '../../../fixtures/orderingAssertions.json'
import therapies from '../../../fixtures/therapy.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers'
import regressionInput from '../../../fixtures/inputsRegression.json'
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";
import order_steps from '../../../utils/HappyPath_steps/LCLP_US_HappyPath/ordering_steps';
import regressionOrderingSteps from '../../../utils/Regression_steps/LCLP_US_RegressionPath/ordering_steps'

const NavigateProgress = (headerTitle, phaseTestId) => {
  cy.log('NavigateProgress')
  // start on a separate page
  cy.get('[data-testid="h1-header"]').should(($p) => {
    expect($p).to.not.contain(headerTitle)
  })

  cy.waitForElementAndClick(`[data-testid="${phaseTestId}"]`)

  // assert that it is on the specified page
  cy.get('[data-testid="h1-header"]').should('contain', headerTitle)
}

const ViewTreatmentInformation = (data, headerTitle) => {
  NavigateProgress(headerTitle, 'progress-phase-treatment')
  common.ConfirmTreatmentInformation(data)
  actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
    apiAliases: ['@patchProcedureSteps', '@getProcedures'],
  })
}

export default {
  orderingData: (scope) => {
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
  },

  selectTherapyHappyPath: (ordersHeader, therapy) => {
    cy.log('login Nina');
    cy.platformLogin('nina@vineti.com');
    cy.visit('/ordering');
    cy.get('[data-testid="nav_li_ordering"]').should('be.visible')
    cy.waitForElementAndClick('[data-testid="nav_li_ordering"]')
    cy.get('[data-testid="ordering-header"]').should('contain', ordersHeader)
    cy.waitForElementAndClick('[data-testid="add-patient-button"]')
    cy.wait(5000)
    inputHelpers.clicker('[data-testid=' + therapy + ']')
    cy.wait(['@postProcedures', '@getProcedures', '@getProcedures'])
  },

  patientInformation: {
    //C21778
    negNoTreatmentSelected: (patientData) => {
      inputHelpers.inputSingleField("[data-testid='#/properties/first_name-input']", patientData.firstName)
      inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']", patientData.lastName)
      inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/day_of_birth']", 1, '01')
      inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/month_of_birth']", 1, 'Feb')
      inputHelpers.inputSingleField("[id*='#/properties/custom_fields/properties/year_of_birth-input']", input.yearOfBirth)
      inputHelpers.dropDownSelect("[id*='#/properties/biological_sex']", 1, 'Male')
      inputHelpers.inputSingleField("[data-testid='#/properties/identifier-input']", patientData.subjectNumber)
      inputHelpers.inputDateField("[id*='#/properties/screening_date']", patientData.screeningDateFormatted)
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/site_number-input"]', patientData.siteNumber)
      inputChecker.nextButtonCheck('be.disabled')
    },

    prescriber: (data) => {
      cy.waitForElementAndClick('[data-testid="institution_id"] .select')
      cy.get(`[data-testid="institution_id"] .select-content li:nth-child(${data.prescriber_select_index})`).should('be.visible')
      cy.waitForElementAndClick(`[data-testid="institution_id"] .select-content li:nth-child(${data.prescriber_select_index})`)
    },

    negYearOfBirthAndScreeningDate: (patientData) => {
      //C21930
      inputHelpers.inputDateField("[id*='#/properties/screening_date']", regressionInput.ordering.futureScreeningDate)
      inputChecker.nextButtonCheck('be.disabled')
      inputChecker.clearDateField("[id*='#/properties/screening_date']")
      inputChecker.nextButtonCheck('be.disabled')
      inputHelpers.inputDateField("[id*='#/properties/screening_date']", patientData.screeningDateFormatted)
      // inputHelpers.inputSingleField("[id*='#/properties/custom_fields/properties/year_of_birth-input']", regressionInput.ordering.futureYearOfBith)
      // inputChecker.nextButtonCheck('be.disabled')
      inputChecker.clearValueAndCheckForButton("[id*='#/properties/custom_fields/properties/year_of_birth-input']", 'be.disabled')
      inputChecker.nextButtonCheck('be.disabled')
    },

    firstLastNamesEmpty: (patientData) => {
      //C38094
      inputHelpers.inputSingleField("[id*='#/properties/custom_fields/properties/year_of_birth-input']", input.yearOfBirth)
      inputChecker.clearInputField('#/properties/first_name');
      inputChecker.nextButtonCheck('be.disabled')
      inputHelpers.inputSingleField("[data-testid='#/properties/first_name-input']", patientData.firstName)
      inputHelpers.inputSingleField("[data-testid='#/properties/first_name-input']", patientData.firstName)
      inputChecker.clearInputField('#/properties/last_name');
      inputChecker.nextButtonCheck('be.disabled')
    },

    keepSubjectNumberAsEmpty: (patientData) => {
      //C38095
      inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']", patientData.lastName);
      inputChecker.clearInputField('#/properties/identifier');
      inputChecker.nextButtonCheck('be.disabled')
    },

    keepSiteNumberAsEmpty: (patientData) => {
      //C38096
      inputHelpers.inputSingleField("[data-testid='#/properties/identifier-input']", patientData.subjectNumber);
      inputChecker.clearInputField('#/properties/custom_fields/properties/site_number');
      inputChecker.nextButtonCheck('be.disabled')
    },

    verifyNextButtonWithoutSelectingSex: (patientData) => {
      //C38097
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/site_number-input"]', patientData.siteNumber)
      inputHelpers.dropDownSelect("[id*='#/properties/biological_sex']", 1, "")
      inputChecker.nextButtonCheck('be.disabled')
    },

    checkForInfoSavedAfterClickingNext: (patientData) => {
      //C38098
      inputHelpers.dropDownSelect("[id*='#/properties/biological_sex']", 1, 'Male');
      inputChecker.checkValue("[data-testid='#/properties/first_name-input']", patientData.firstName)
      inputChecker.checkValue("[data-testid='#/properties/last_name-input']", patientData.lastName)
      inputChecker.checkValue("[id*='#/properties/custom_fields/properties/year_of_birth-input']", input.yearOfBirth);
      inputChecker.checkValue("[data-testid='#/properties/identifier-input']", patientData.subjectNumber)
      inputChecker.checkValue('[data-testid="#/properties/custom_fields/properties/site_number-input"]', patientData.siteNumber)
      inputChecker.nextButtonCheck('not.be.disabled')
    }
  },

  SelectPrescriber: {
    previousHappyPathSteps: (scope, therapy) => {
      order_steps.patient(scope.patientInformation, therapy);
      order_steps.prescriber(scope.treatmentInformation, header.orderingSite, scope.patientHeaderBar, header);
    },

    negNoPhysicianSelected: () => {
      //	C21931
      inputChecker.nextButtonCheck('be.disabled')
    },

    posSaveAndClose: (data, scope) => {
      //C21932
      cy.waitForElementAndClick('[data-testid="physician_user_id"] .select')
      cy.waitForElementAndClick(`[data-testid="physician_user_id"] .select-content li:nth-child(${data.prescriber_select_index})`)
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Treatments per Patient")
    },

    posVerifyReasonForChange: () => {
      //	C21933
      inputHelpers.clicker('[data-testid="primary-button-action"]')
      inputHelpers.clicker('[data-testid="back-nav-link"]')
      cy.waitForElementAndClick('[data-testid="physician_user_id"] .select')
      cy.waitForElementAndClick(`[data-testid="physician_user_id"] .select-content li:nth-child(2)`)
      inputChecker.reasonForChange()
    }
  },

  scheduleCollection: {
    previousHappyPathSteps: (therapy, scope) => {
      order_steps.patient(scope.patientInformation, therapy);
      order_steps.prescriber(scope.treatmentInformation);
      order_steps.SelectPrescriber(scope.treatmentInformation);
    },

    contactPerson: () => {
      // C38078
      inputChecker.clearField('[data-testid="txt-contact-person-collection"]');
      inputChecker.clearField('[data-testid="txt-contact-person-infusion"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    contactPhoneNumber: () => {
      // C38079
      inputHelpers.inputSingleField('[data-testid="txt-contact-person-collection"]', input.contactPerson);
      inputHelpers.inputSingleField('[data-testid="txt-contact-person-infusion"]', input.contactPerson);
      inputChecker.clearField('[data-testid="txt-phone-number-collection"]');
      inputChecker.clearField('[data-testid="txt-phone-number-infusion"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    selectDifferentSites: () => {
      //C38080
      inputHelpers.inputSingleField('[data-testid="txt-phone-number-collection"]', input.contactNumber);
      inputHelpers.inputSingleField('[data-testid="txt-phone-number-infusion"]', input.contactNumber);
      inputChecker.selectDifferentSite('[data-testid="ddl-site-collection"]')
      inputChecker.verifyStringValue('[data-testid="ddl-site-collection"]', input.testCoe2)
    },

    checkNextButtonWithoutScheduling: () => {
      //C21934
      inputChecker.nextButtonCheck('be.disabled')
    },

    posvalues: (region, therapy) => {
      //C38081  
      cy.wait('@schedulingServiceAvailability')
      cy.scheduleFirstAvailableDate({ institutionType: `collection${therapy.scheduler_suffix}` }, region)
      // cy.wait(2000)
      cy.wait('@schedulingServiceDraft')

      cy.get('[data-testid="btn-schedule"]')
        .click()
        .then(() => {
          cy.wait('@schedulingServiceCreate')
        })
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    posSaveAndClose: (scope) => {
      // C38082
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Treatments per Patient")
    },

    checkForTheInfoSaved: () => {
      // C38083
      inputChecker.checkForTheInfoSavedClickingNextAndBack();
      inputChecker.nextButtonCheck('not.be.disabled')
    }
  },

  confirmation: {
    previousHappyPathSteps: (therapy, scope, region) => {
      order_steps.patient(scope.patientInformation, therapy);
      order_steps.prescriber(scope.treatmentInformation);
      order_steps.SelectPrescriber(scope.treatmentInformation);
      order_steps.schedulingCheckAvailability(therapy, region);
      order_steps.AddSchedulingOrder(header);
    },
    verifyEditButtons: () => {
      // C38085
      inputHelpers.clicker('[data-testid="edit-patient"]');

      // Patient Info
      inputHelpers.inputSingleField('[data-testid="#/properties/first_name-input"]', 'Z');
      inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']", 'A');
      inputChecker.reasonForChange()
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', 'Z', 1);
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', 'A', 3);

      // Prescriber Information
      inputHelpers.clicker('[data-testid="edit-prescriber"]');
      inputHelpers.dropDownSelectTwo('[data-testid="physician_user_id"] .select', 1);
      inputChecker.reasonForChange()
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', "Dr. Barbara McClintok", 10);

      // Scheduling
      cy.get('[data-testid="edit-scheduling"]').eq(0).click();
      inputChecker.explicitWait('[data-test-id="ordering_scheduling"]')
      inputHelpers.changeInstitutionData(header.infusionInstrNameEU, 'collection', 'Jhonseen', '45378')
      inputChecker.explicitWait('[data-testid="btn-clear-date-collection"]')
      cy.get('[data-testid="btn-schedule"]')
        .click()
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', header.infusionInstrNameEU, 11);
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', 'Jhonseen', 14);
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', '+43-45378', 15);
    },

    verifySubmitButtonWithAndWithoutSign: () => {
      //C21936
      inputChecker.nextButtonCheck('be.disabled');
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'])
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'], input.oliverEmail)
      inputChecker.nextButtonCheck('be.enabled');
    },

  },

  approval: {
    previousHappyPathSteps: (therapy, scope, region) => {
      order_steps.patient(scope.patientInformation, therapy);
      order_steps.prescriber(scope.treatmentInformation);
      order_steps.SelectPrescriber(scope.treatmentInformation);
      order_steps.schedulingCheckAvailability(therapy, region);
      order_steps.AddSchedulingOrder(header);
      order_steps.confirmation(scope, therapy);
      common.loginAs('oliver');
      cy.visit('/ordering');
      cy.get('td[data-testid="patient-identifier"]')
        .contains(scope.patientInformation.subjectNumber)
        .click();
    },

    verifyEditButtons: () => {
      // 38091
      inputHelpers.clicker('[data-testid="edit-patient"]');
      // Patient Info
      inputHelpers.inputSingleField('[data-testid="#/properties/first_name-input"]', 'Z');
      inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']", 'A');
      inputChecker.reasonForChange()
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', 'Z', 1);
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', 'A', 3);

      // // Prescriber Information
      inputHelpers.clicker('[data-testid="edit-prescriber"]');
      inputHelpers.dropDownSelectTwo('[data-testid="physician_user_id"] .select', 1);
      inputChecker.reasonForChange()
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', "Dr. Barbara McClintok", 10);

      // Scheduling
      cy.get('[data-testid="edit-scheduling"]').eq(0).click();
      inputChecker.explicitWait('[data-test-id="ordering_scheduling"]')
      inputHelpers.changeInstitutionData(header.infusionInstrNameEU, 'collection', 'Jhonseen', '45378')
      inputChecker.explicitWait('[data-testid="btn-clear-date-collection"]')
      cy.get('[data-testid="btn-schedule"]')
        .click()
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', header.infusionInstrNameEU, 11);
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', 'Jhonseen', 14);
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', '+43-45378', 15);

    },

    verifySubmitButtonWithAndWithoutSign: () => {
      //	C21943
      inputChecker.nextButtonCheck('be.disabled');
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'])
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'], input.ninaEmail)
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.nextButtonCheck('be.enabled');
    }
  },

  checktheStatusesOfOrderingModule: (therapy, scope, region) => {

    regressionOrderingSteps.selectTherapyHappyPath(header.orders, therapy.context);

    order_steps.patient(scope.patientInformation, therapy);
    order_steps.prescriber(scope.treatmentInformation);
    inputHelpers.clickOnHeader('ordering')
    cy.checkStatus(scope.patientInformation.subjectNumber, regressionInput.ordering.statuses.coiGenerated, 'Patients', 4)

    order_steps.SelectPrescriber(scope.treatmentInformation);
    inputHelpers.clickOnHeader('ordering')
    cy.checkStatus(scope.patientInformation.subjectNumber, regressionInput.ordering.statuses.coiGenerated, 'Patients', 4)

    cy.reload();
    order_steps.schedulingCheckAvailability(therapy, region);
    order_steps.AddSchedulingOrder(header);
    inputHelpers.clickOnHeader('ordering')
    cy.checkStatus(scope.patientInformation.subjectNumber, regressionInput.ordering.statuses.scheduled, 'Patients', 4)

    order_steps.confirmation(scope, therapy);
    inputHelpers.clickOnHeader('ordering')
    cy.checkStatus(scope.patientInformation.subjectNumber, regressionInput.ordering.statuses.submitted, 'Patients', 4)

    cy.openOrder('ordering', 'oliver')
    cy.commonPagination(scope.patientInformation.subjectNumber, 'Patients')
    order_steps.approval(scope, therapy);
    inputHelpers.clickOnHeader('ordering')
    cy.checkStatus(scope.patientInformation.subjectNumber, regressionInput.ordering.statuses.approved, 'Patients', 4)
  }
}
