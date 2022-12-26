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
import order_steps from '../../../utils/HappyPath_steps/LCCP_US_HappyPath/ordering_steps';
import regressionOrderingSteps from '../../../utils/Regression_steps/LCCP_US_RegressionPath/ordering_steps'



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
    //C22741
    treatmentOrderingSelectNeg: (patientData) => {
      inputHelpers.inputSingleField('[data-testid="#/properties/first_name-input"]', patientData.firstName)
      inputHelpers.inputSingleField('[data-testid="#/properties/last_name-input"]', patientData.lastName)
      inputHelpers.dropDownSelect('[id*="#/properties/custom_fields/properties/day_of_birth"]', 1, '01')
      inputHelpers.dropDownSelect('[id*="#/properties/custom_fields/properties/month_of_birth"]', 1, 'Feb')
      inputHelpers.inputSingleField('[id*="#/properties/custom_fields/properties/year_of_birth-input"]', input.yearOfBirth)
      inputHelpers.dropDownSelect('[id*="#/properties/biological_sex"]', 1, 'Male');
      inputHelpers.inputSingleField('[data-testid="#/properties/identifier-input"]', patientData.subjectNumber)
      inputHelpers.inputDateField('[id*="#/properties/screening_date"]', patientData.screeningDateFormatted)
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/site_number-input"]', patientData.siteNumber)
      inputChecker.nextButtonCheck('not.be.disabled')
    },

    //C22742
    yearOFBirthAndScreeningNeg: (patientData) => {
      //screening date
      inputHelpers.inputDateField("[id*='#/properties/screening_date']", regressionInput.ordering.futureScreeningDate)
      inputChecker.nextButtonCheck('be.disabled')
      inputChecker.clearDateField('[id*="#/properties/screening_date"]')
      inputChecker.nextButtonCheck('be.disabled')
      //year of birth 
      inputChecker.clearDateField('[id*="#/properties/custom_fields/properties/year_of_birth-input"]')
      inputChecker.nextButtonCheck('be.disabled')
      // inputHelpers.inputSingleField('[id*="#/properties/custom_fields/properties/year_of_birth-input"]', regressionInput.ordering.futureYearOfBith)
      // inputChecker.nextButtonCheck('be.disabled')

      inputHelpers.inputSingleField('[id*="#/properties/custom_fields/properties/year_of_birth-input"]', input.yearOfBirth)
      inputHelpers.inputDateField('[id*="#/properties/screening_date"]', patientData.screeningDateFormatted)
    },

    //C38285
    noFirstAndLastNameNeg: (patientData) => {
      inputChecker.clearInputField('#/properties/first_name')
      inputChecker.nextButtonCheck('be.disabled')
      inputHelpers.inputSingleField('[data-testid="#/properties/first_name-input"]', patientData.firstName)
      inputChecker.clearInputField('#/properties/last_name')
      inputChecker.nextButtonCheck('be.disabled')
      inputHelpers.inputSingleField('[data-testid="#/properties/last_name-input"]', patientData.lastName)
    },

    //C38286
    subjectNumberEmpty: (patientData) => {
      inputChecker.clearInputField('#/properties/identifier')
      inputChecker.nextButtonCheck('be.disabled')
      inputHelpers.inputSingleField('[data-testid="#/properties/identifier-input"]', patientData.subjectNumber)
    },

    //C38287
    siteNumberEmpty: (patientData) => {
      inputChecker.clearInputField('#/properties/custom_fields/properties/site_number')
      inputChecker.nextButtonCheck('be.disabled')
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/site_number-input"]', patientData.siteNumber)
    },

    //C38288
    sexFieldEmpty: () => {
      inputHelpers.dropDownSelect("[id*='#/properties/biological_sex']", 1, "")
      inputChecker.nextButtonCheck('be.disabled')
      inputHelpers.dropDownSelect('[id*="#/properties/biological_sex"]', 1, 'Male')
    },

    //C38289
    checkDataSavedForAllFields: (patientData) => {
      inputChecker.checkValue("[data-testid='#/properties/first_name-input']", patientData.firstName)
      inputChecker.checkValue("[data-testid='#/properties/last_name-input']", patientData.lastName)
      inputChecker.checkValue("[id*='#/properties/custom_fields/properties/year_of_birth-input']", input.yearOfBirth);
      inputChecker.checkValue("[data-testid='#/properties/identifier-input']", patientData.subjectNumber)
      inputChecker.checkValue('[data-testid="#/properties/custom_fields/properties/site_number-input"]', patientData.siteNumber)
      inputChecker.nextButtonCheck('not.be.disabled')
    }
  },

  selectPrescriber: {
    previousHappyPathSteps: (scope, therapy) => {
      order_steps.patient(scope.patientInformation, therapy);
      order_steps.prescriber(scope.treatmentInformation, header.orderingSite, scope.patientHeaderBar, header);
    },

    //C22743
    physicianNameNotSelected: () => {
      inputChecker.nextButtonCheck('be.disabled');
    },

    //C22744
    saveAndClose: (data, scope) => {
      cy.waitForElementAndClick('[data-testid="physician_user_id"] .select')
      cy.waitForElementAndClick(`[data-testid="physician_user_id"] .select-content li:nth-child(${data.prescriber_select_index})`)
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Treatments per Patient")
    },

    //C22745
    reasonForChange: () => {
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
      order_steps.prescriber(scope.treatmentInformation,header.orderingSite,scope.patientHeaderBar,header);        
      order_steps.SelectPrescriber(scope.treatmentInformation, header);
    },
    checkNextButtonWithoutScheduling: () => {
      //C22746
      inputChecker.nextButtonCheck('be.disabled')
    },
    contactPerson: () => {
      // C38290
      inputChecker.clearField('[data-testid="txt-contact-person-collection_lccp"]');
      inputChecker.clearField('[data-testid="txt-contact-person-infusion_lccp"]');
      inputChecker.nextButtonCheck('be.disabled');
    },
    contactPhoneNumber: () => {
      // C38291
      inputHelpers.inputSingleField('[data-testid="txt-contact-person-collection_lccp"]', input.contactPerson);
      inputHelpers.inputSingleField('[data-testid="txt-contact-person-infusion_lccp"]', input.contactPerson);
      inputChecker.clearField('[data-testid="txt-phone-number-collection_lccp"]');
      inputChecker.clearField('[data-testid="txt-phone-number-infusion_lccp"]');
      inputChecker.nextButtonCheck('be.disabled');
      inputHelpers.inputSingleField('[data-testid="txt-phone-number-collection_lccp"]', input.contactNumber);
      inputHelpers.inputSingleField('[data-testid="txt-phone-number-infusion_lccp"]', input.contactNumber);
    },
    posvalues: (region, therapy) => {
      //C38293
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
      // C38294
      inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber, "be.enabled", "Treatments per Patient")
    },
    checkForTheInfoSaved: () => {
      // C38295
      inputChecker.checkForTheInfoSavedClickingNextAndBack();
      inputChecker.nextButtonCheck('not.be.disabled')
    }
  },

  confirmation: {
    previousHappyPathSteps: (therapy, scope) => {
      order_steps.patient(scope.patientInformation, therapy);
      order_steps.prescriber(scope.treatmentInformation,header.orderingSite,scope.patientHeaderBar,header);        
      order_steps.SelectPrescriber(scope.treatmentInformation, header);
      order_steps.schedulingCheckAvailability(therapy);
      order_steps.AddSchedulingOrder(header);
    },
    verifyEditButtons:()=>{
      // C22748
      inputHelpers.clicker('[data-testid="edit-patient"]');
    
      //Patient Info
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
      cy.get('[data-testid="edit-scheduling"]').eq (0). click();
      inputChecker.nextButtonCheck('not.be.disabled');
      inputChecker.explicitWait('[data-test-id="ordering_scheduling"]')
      inputHelpers.inputSingleField('[data-testid="txt-contact-person-collection_lccp"]', input.contactName)
      inputHelpers.inputSingleField('[data-testid="txt-phone-number-collection_lccp"]', '45378')
      inputChecker.explicitWait('[data-testid="btn-clear-date-collection_lccp"]')
      cy.get('[data-testid="btn-schedule"]')
        .click()
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', 'Jhonseen', 14);
      translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', '+1-45378', 15);  
    },
      
    verifySubmitButtonWithAndWithoutSign:()=>{
      // C22747
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
        // C22750
        inputHelpers.clicker('[data-testid="edit-patient"]');
      
        //Patient Info
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
        cy.get('[data-testid="edit-scheduling"]').eq (0). click();
        inputChecker.nextButtonCheck('not.be.disabled');
        inputChecker.explicitWait('[data-test-id="ordering_scheduling"]')
        inputHelpers.inputSingleField('[data-testid="txt-contact-person-collection_lccp"]', input.contactName)
        inputHelpers.inputSingleField('[data-testid="txt-phone-number-collection_lccp"]', '45378')
        inputChecker.explicitWait('[data-testid="btn-clear-date-collection_lccp"]')
        cy.get('[data-testid="btn-schedule"]')
          .click()
        actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
          apiAliases: ['@patchProcedureSteps', '@getProcedures'],
        })
        translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', 'Jhonseen', 14);
        translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span', '+1-45378', 15);
      },
  
      verifyApprovalButtonWithAndWithoutSign: () => {
        //	C22749
        inputChecker.nextButtonCheck('be.disabled');
        signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'])
        signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'], input.ninaEmail)
        signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
        inputChecker.nextButtonCheck('be.enabled');
      }
  },

  checktheStatusOfOrderingModule: (therapy, scope, region) => {

    regressionOrderingSteps.selectTherapyHappyPath(header.orders, therapy.context);

    order_steps.patient(scope.patientInformation, therapy);
    order_steps.prescriber(scope.treatmentInformation);
    inputHelpers.clickOnHeader('ordering')
    cy.checkStatus(scope.patientInformation.subjectNumber, regressionInput.ordering.statuses.coiGenerated, 'Patients', 4)

    order_steps.SelectPrescriber(scope.treatmentInformation);
    cy.get('[data-testid*="day-available-collection"]')
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
