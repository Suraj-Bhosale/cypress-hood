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
import order_steps from '../../../utils/HappyPath_steps/CMCP_US_HappyPath/ordering_steps';
import regressionOrderingSteps from '../../../utils/Regression_steps/CMCP_US_RegressionPath/ordering_steps'

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
    prescriber: (data) => {
      cy.waitForElementAndClick('[data-testid="institution_id"] .select')
      cy.get(`[data-testid="institution_id"] .select-content li:nth-child(${data.prescriber_select_index})`).should('be.visible')
      cy.waitForElementAndClick(`[data-testid="institution_id"] .select-content li:nth-child(${data.prescriber_select_index})`)
    },

    // [C40572]
    negYearOfBirthAndScreeningDate: (patientData) => {
      inputHelpers.inputSingleField("[data-testid='#/properties/first_name-input']", patientData.firstName)
      inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']", patientData.lastName)
      inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/day_of_birth']", 1, '01')
      inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/month_of_birth']", 1, 'Feb')
      inputHelpers.inputSingleField("[id*='#/properties/custom_fields/properties/year_of_birth-input']", input.yearOfBirth)
      inputHelpers.dropDownSelect("[id*='#/properties/biological_sex']", 1, 'Male')
      inputHelpers.inputSingleField("[data-testid='#/properties/identifier-input']", patientData.subjectNumber)
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/site_number-input"]', patientData.siteNumber)
      inputHelpers.inputDateField("[id*='#/properties/screening_date']", regressionInput.ordering.futureScreeningDate)
      inputChecker.nextButtonCheck('be.disabled')
      inputChecker.clearDateField("[id*='#/properties/screening_date']")
      inputChecker.nextButtonCheck('be.disabled')
      inputHelpers.inputDateField("[id*='#/properties/screening_date']", patientData.screeningDateFormatted)
      inputHelpers.inputSingleField("[id*='#/properties/custom_fields/properties/year_of_birth-input']", '1882')
      inputChecker.nextButtonCheck('be.disabled')
      inputChecker.clearValueAndCheckForButton("[id*='#/properties/custom_fields/properties/year_of_birth-input']", 'be.disabled')
      inputChecker.nextButtonCheck('be.disabled')

    },

    // [C40568]
    firstLastNamesEmpty: (patientData) => {
      inputHelpers.inputSingleField("[id*='#/properties/custom_fields/properties/year_of_birth-input']", input.yearOfBirth)
      inputChecker.clearInputField('#/properties/first_name');
      inputChecker.nextButtonCheck('be.disabled')
      inputHelpers.inputSingleField("[data-testid='#/properties/first_name-input']", patientData.firstName)
      inputHelpers.inputSingleField("[data-testid='#/properties/first_name-input']", patientData.firstName)
      inputChecker.clearInputField('#/properties/last_name');
      inputChecker.nextButtonCheck('be.disabled')
    },

    // [C40570]
    keepSubjectNumberAsEmpty: (patientData) => {
      inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']", patientData.lastName);
      inputChecker.clearInputField('#/properties/identifier');
      inputChecker.nextButtonCheck('be.disabled')
    },

    // [C40571] 
    keepSiteNumberAsEmpty: (patientData) => {
      inputHelpers.inputSingleField("[data-testid='#/properties/identifier-input']", patientData.subjectNumber);
      inputChecker.clearInputField('#/properties/custom_fields/properties/site_number');
      inputChecker.nextButtonCheck('be.disabled')
    },

    // [C40569]
    verifyNextButtonWithoutSelectingSex: (patientData) => {
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/site_number-input"]', patientData.siteNumber)
      inputHelpers.dropDownSelect("[id*='#/properties/biological_sex']", 1, "")
      inputChecker.nextButtonCheck('be.disabled')
    },

    // [C40573]
    checkForInfoSavedAfterClickingNext: (patientData) => {
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

    // [C40574]
    negNoPhysicialSelected: () => {
      inputChecker.nextButtonCheck('be.disabled')
    },

    // [C40575] 
    posSaveAndClose: (data, scope) => {
      cy.waitForElementAndClick('[data-testid="physician_user_id"] .select')
      cy.waitForElementAndClick(`[data-testid="physician_user_id"] .select-content li:nth-child(${data.prescriber_select_index})`)
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Treatments per Patient")
    },

    // [C40576]
    posVerifyReasonForChange: () => {
      inputHelpers.clicker('[data-testid="primary-button-action"]')
      inputHelpers.clicker('[data-testid="back-nav-link"]')
      cy.waitForElementAndClick('[data-testid="physician_user_id"] .select')
      cy.waitForElementAndClick(`[data-testid="physician_user_id"] .select-content li:nth-child(2)`)
      inputChecker.reasonForChange()
    }
  },

  Scheduling: {
    previousHappyPathSteps: (scope, therapy) => {
      order_steps.patient(scope.patientInformation, therapy);
      order_steps.prescriber(scope.treatmentInformation, header.orderingSite, scope.patientHeaderBar, header);
      order_steps.SelectPrescriber(scope.treatmentInformation);
    },

    contactPerson: () => {
      //C40671
      inputChecker.clearField('[data-testid="txt-contact-person-collection_cmcp_us"]');
      inputChecker.clearField('[data-testid="txt-contact-person-infusion_cmcp_us"]');
      inputChecker.clearField('[data-testid="txt-contact-person-satellite_lab_cmcp_us"]');
      inputChecker.nextButtonCheck('be.disabled');
    },
    contactPhoneNumber: () => {
      //C40672
      inputHelpers.inputSingleField('[data-testid="txt-contact-person-collection_cmcp_us"]', input.contactPerson);
      inputHelpers.inputSingleField('[data-testid="txt-contact-person-infusion_cmcp_us"]', input.contactPerson);
      inputHelpers.inputSingleField('[data-testid="txt-contact-person-satellite_lab_cmcp_us"]', input.contactPerson);
      inputChecker.clearField('[data-testid="txt-phone-number-collection_cmcp_us"]');
      inputChecker.clearField('[data-testid="txt-phone-number-infusion_cmcp_us"]');
      inputChecker.clearField('[data-testid="txt-phone-number-satellite_lab_cmcp_us"]');
      inputChecker.nextButtonCheck('be.disabled');
    },

    checkNextButtonWithoutScheduling: () => {
      //C40667
      inputHelpers.inputSingleField('[data-testid="txt-phone-number-collection_cmcp_us"]', input.contactNumber);
      inputHelpers.inputSingleField('[data-testid="txt-phone-number-infusion_cmcp_us"]', input.contactNumber);
      inputHelpers.inputSingleField('[data-testid="txt-phone-number-satellite_lab_cmcp_us"]', input.contactNumber);
      inputChecker.nextButtonCheck('be.disabled')
    },

    posvalues: (region, therapy) => {
      //C40669	
      cy.wait('@schedulingServiceAvailability')
      cy.scheduleFirstAvailableDate({
        institutionType: `collection${therapy.scheduler_suffix}`
      }, region)
      cy.wait('@schedulingServiceDraft')

      cy.get('[data-testid="btn-schedule"]')
        .click()
        .then(() => {
          cy.wait('@schedulingServiceCreate')
        })
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    posSaveAndClose: (scope) => {
      //C40669
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Treatments per Patient")
    },

    checkForTheInfoSaved: () => {
      //C40670	
      inputChecker.checkForTheInfoSavedClickingNextAndBack();
      inputChecker.nextButtonCheck('not.be.disabled')
    }
  },

  confirmation: {
    previousHappyPathSteps: (scope, therapy, region) => {
      order_steps.patient(scope.patientInformation, therapy);
      order_steps.prescriber(scope.treatmentInformation, header.orderingSite, scope.patientHeaderBar, header);
      order_steps.SelectPrescriber(scope.treatmentInformation);
      order_steps.schedulingCheckAvailability(therapy, region);
      order_steps.AddSchedulingOrder(header);
    },
    verifyEditButton1: () => {
      // C37756
      inputHelpers.clicker('[data-testid="edit-patient"]');
      inputHelpers.inputSingleField('[data-testid="#/properties/first_name-input"]', 'Z');
      inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']", 'A');
      inputChecker.reasonForChange()
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', 'Z', 1);
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', 'A', 3);
    },

    verifyEditButton2: () => {
      //C37757
      inputHelpers.clicker('[data-testid="edit-prescriber"]');
      inputHelpers.dropDownSelectTwo('[data-testid="physician_user_id"] .select', 1);
      inputChecker.reasonForChange()
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', "Dr. Barbara McClintok", 10);
    },

    verifyEditButton3: () => {
      //C37758
      inputChecker.clickEdit('[data-testid="edit-scheduling"]', 0);
      inputChecker.nextButtonCheck('not.be.disabled');
      inputChecker.explicitWait('[data-testid="btn-clear-date-collection_cmcp_us"]')
      inputHelpers.clicker('[data-testid="btn-clear-date-collection_cmcp_us"]')
      inputHelpers.changeInstitutionData(header.collectionInstNameUS, 'collection_cmcp_us', 'Jhonseen', '45378')
      inputChecker.explicitWait('[data-testid="btn-clear-date-collection_cmcp_us"]')
      inputChecker.inputSingleFieldCheck('[data-testid="txt-phone-number-collection_cmcp_us"]', regressionInput.ordering.confirmation.positivePhoneNumber, 'not.be.enabled')
      inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-collection_cmcp_us"]', regressionInput.ordering.confirmation.positiveContactName, 'not.be.enabled')
      inputChecker.inputSingleFieldCheck('[data-testid="txt-phone-number-satellite_lab_cmcp_us"]', '6543', 'not.be.enabled')
      inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-satellite_lab_cmcp_us"]', 'Richard', 'not.be.enabled')
      inputChecker.inputSingleFieldCheck('[data-testid="txt-phone-number-infusion_cmcp_us"]', '93333', 'not.be.enabled')
      inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-infusion_cmcp_us"]', 'Anne', 'not.be.enabled')
      inputChecker.explicitWait('[data-testid="btn-schedule"]')
      inputHelpers.clicker('[data-testid="btn-schedule"]')
      inputChecker.explicitWait('[data-testid="primary-button-action"]')
      inputHelpers.clicker('[data-testid="primary-button-action"]')
      translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "John ", 31);
      translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "+1-45677 ", 33);
      translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "Richard ", 43);
      translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "+1-6543 ", 45);
      translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "Anne ", 55);
      translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "+1-93333 ", 57);
    },

    verifyEditButton4: () => {
      //C37759
      inputChecker.clickEdit('[data-testid="edit-scheduling"]', 1);
      inputChecker.nextButtonCheck('not.be.disabled');
      translationHelpers.assertPageTitles('[data-test-id="ordering_scheduling"]', 'h1', orderingAssertions.scheduling.title)
      inputHelpers.clicker('[data-testid="primary-button-action"]')
    },

    verifyEditButton5: () => {
      //C37760
      inputChecker.clickEdit('[data-testid="edit-scheduling"]', 2);
      inputChecker.nextButtonCheck('not.be.disabled');
      translationHelpers.assertPageTitles('[data-test-id="ordering_scheduling"]', 'h1', orderingAssertions.scheduling.title)
      inputHelpers.clicker('[data-testid="primary-button-action"]')
    },

    verifySubmitButtonWithAndWithoutSign: () => {
      //C40673	
      inputChecker.nextButtonCheck('be.disabled');
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'])
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'], input.oliverEmail)
      inputChecker.nextButtonCheck('be.enabled');
    },

    posCloseButton: (scope) => {
      //C37763
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Treatments per Patient")
    }
  },

  approval: {
    previousHappyPathSteps: (therapy, scope, region) => {
      order_steps.patient(scope.patientInformation, therapy);
      order_steps.prescriber(scope.treatmentInformation, header.orderingSite, scope.patientHeaderBar, header);
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

    verifyEditButton1: () => {
      //C40677
      inputHelpers.clicker('[data-testid="edit-patient"]');
      inputHelpers.inputSingleField('[data-testid="#/properties/first_name-input"]', 'Z');
      inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']", 'A');
      inputChecker.reasonForChange()
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', 'Z', 1);
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', 'A', 3);
    },

    verifyEditButton2: () => {
      //C40678
      inputHelpers.clicker('[data-testid="edit-prescriber"]');
      inputHelpers.dropDownSelectTwo('[data-testid="physician_user_id"] .select', 1);
      inputChecker.reasonForChange()
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', "Dr. Barbara McClintok", 10);
    },

    verifyEditButton3: () => {
      //C40679
      inputChecker.clickEdit('[data-testid="edit-scheduling"]', 0);
      inputChecker.nextButtonCheck('not.be.disabled');
      inputChecker.explicitWait('[data-testid="btn-clear-date-collection_cmcp_us"]')
      inputHelpers.clicker('[data-testid="btn-clear-date-collection_cmcp_us"]')
      inputHelpers.changeInstitutionData(header.collectionInstNameUS, 'collection_cmcp_us', 'Jhonseen', '45378')
      inputChecker.explicitWait('[data-testid="btn-clear-date-collection_cmcp_us"]')
      inputChecker.inputSingleFieldCheck('[data-testid="txt-phone-number-collection_cmcp_us"]', regressionInput.ordering.confirmation.positivePhoneNumber, 'not.be.enabled')
      inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-collection_cmcp_us"]', regressionInput.ordering.confirmation.positiveContactName, 'not.be.enabled')
      inputChecker.inputSingleFieldCheck('[data-testid="txt-phone-number-satellite_lab_cmcp_us"]', '6543', 'not.be.enabled')
      inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-satellite_lab_cmcp_us"]', 'Richard', 'not.be.enabled')
      inputChecker.inputSingleFieldCheck('[data-testid="txt-phone-number-infusion_cmcp_us"]', '93333', 'not.be.enabled')
      inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-infusion_cmcp_us"]', 'Anne', 'not.be.enabled')
      inputChecker.explicitWait('[data-testid="btn-schedule"]')
      inputHelpers.clicker('[data-testid="btn-schedule"]')
      inputChecker.explicitWait('[data-testid="primary-button-action"]')
      inputHelpers.clicker('[data-testid="primary-button-action"]')
      translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "John ", 31);
      translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "+1-45677 ", 33);
      translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "Richard ", 43);
      translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "+1-6543 ", 45);
      translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "Anne ", 55);
      translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "+1-93333 ", 57);
    },

    verifyEditButton4: () => {
      //C40680
      inputChecker.clickEdit('[data-testid="edit-scheduling"]', 1);
      inputChecker.nextButtonCheck('not.be.disabled');
      translationHelpers.assertPageTitles('[data-test-id="ordering_scheduling"]', 'h1', orderingAssertions.scheduling.title)
      inputHelpers.clicker('[data-testid="primary-button-action"]')
    },

    verifyEditButton5: () => {
      //C40681
      inputChecker.clickEdit('[data-testid="edit-scheduling"]', 2);
      inputChecker.nextButtonCheck('not.be.disabled');
      translationHelpers.assertPageTitles('[data-test-id="ordering_scheduling"]', 'h1', orderingAssertions.scheduling.title)
      inputHelpers.clicker('[data-testid="primary-button-action"]')
    },
    verifySubmitButtonWithAndWithoutSign: () => {
      //C40675	
      inputChecker.nextButtonCheck('be.disabled');
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'])
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'], input.oliver3Email)
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      inputChecker.nextButtonCheck('be.enabled');
    },

    posCloseButton: (scope) => {
      //C40676
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Treatments per Patient")
    }
  },

  checktheStatusesOfOrderingModule: (therapy,scope,region) => {
  
    regressionOrderingSteps.selectTherapyHappyPath(header.orders,therapy.context);

    order_steps.patient(scope.patientInformation, therapy);
    order_steps.prescriber(scope.treatmentInformation);
    inputHelpers.clickOnHeader('ordering')
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.ordering.statuses.coiGenerated,'Patients',4)
    
    order_steps.SelectPrescriber(scope.treatmentInformation);
    inputHelpers.clickOnHeader('ordering')
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.ordering.statuses.coiGenerated,'Patients',4)

    cy.reload();
    order_steps.schedulingCheckAvailability(therapy, region);
    order_steps.AddSchedulingOrder(header);
    inputHelpers.clickOnHeader('ordering')
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.ordering.statuses.scheduled,'Patients',4)

    order_steps.confirmation(scope, therapy);
    inputHelpers.clickOnHeader('ordering')
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.ordering.statuses.submitted,'Patients',4)

    cy.openOrder('ordering','oliver')
    cy.commonPagination(scope.patientInformation.subjectNumber,'Patients')
    order_steps.approval(scope, therapy);
    inputHelpers.clickOnHeader('ordering')
    cy.checkStatus(scope.patientInformation.subjectNumber,regressionInput.ordering.statuses.approved,'Patients',4)
  }
}

