import input from '../../../fixtures/inputs.json';
import regressionInput from '../../../fixtures/inputsRegression.json';
import inputChecker from '../../../utils/shared_block_helpers/inputFieldCheckHelpers';
import signatureHelpers from '../../../utils/shared_block_helpers/signatureHelpers';
import actionButtonsHelper from '../../../utils/shared_block_helpers/actionButtonHelpers';
import inputHelpers from '../../../utils/shared_block_helpers/inputFieldHelpers';
import orderingStepsHappyPath from '../../../utils/HappyPath_steps/CD30_US_HappyPath/ordering_steps';
import translationHelpers from '../../../utils/shared_block_helpers/translationHelpers';

export default {
  orderingData: (scope) => {
    const generateRandomNumber = () => {
      //generate a random 3 digit number
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
      dateOfBirth: input.ordering.global.patientDateOfBirth,
      dataOfBirthHeaderFormat: '15-Nov-1970',
      patientId: scope.patientId,
      subjectId: generateRandomNumber() + - + generateRandomNumber()+ - + generateRandomNumber(),
      icfDateFormatted: '03-Sep-2020',
      screeningDate: '05222019',
      screeningDateFormatted: '04-Oct-2020',
      siteNumber: generateRandomNumber(),
    };

    scope.treatmentInformation = {
      prescriber_select_index: 1,
      prescriber_select_index_0: 2,
      institution_select_index: 1,
      idmDate: '10-Oct-1980'
    };

    scope.treatment = {
      coi: ""
    };

    scope.therapyInfo = {
      productNumber: "AUTO4",
      indication: "TCL",
      protocolNumber: "AUTO4-TL1"
    }
  },

  selectTherapyHappyPath: (contextId) => {
    cy.log('login Nina');
    cy.platformLogin('nina@vineti.com');
    cy.visit('/ordering');
    inputHelpers.clicker('[data-testid="add-patient-button"]');
    inputHelpers.clicker(`[data-testid="execution-context-${contextId}"]`);
    cy.wait('@postProcedures');
    cy.wait('@getPermissions');
  },

  subjectRegistration: {
    subjectRegistrationHappyPath: (scope,therapy) => {
      orderingStepsHappyPath.subjectRegistration(scope.patientInformation,scope.treatmentInformation,therapy);
    },
    //C26449, C28487, C28259
    dobNegative: (patientData, treatmentInfo) => {
      cy.log('SubjectRegistration');
      inputHelpers.inputSingleField('[data-testid="#/properties/identifier-input"]',patientData.subjectId);
      inputHelpers.clicker('[data-testid="pass-button-subject_consent_toggle"]');
      inputChecker.dropDownSelect('[data-testid="institution_id"] .select',treatmentInfo.institution_select_index);
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/dob-input"]',regressionInput.ordering.subjectRegistration.negativeInvalidDateValidMonthValidYear,'be.disabled');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/dob-input"]',regressionInput.ordering.subjectRegistration.negativeValidDateInvalidMonthValidYear,'be.disabled');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/dob-input"]',regressionInput.ordering.subjectRegistration.negativeValidDatenegativeValidMonthInvalidYear,'be.disabled');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/dob-input"]',regressionInput.ordering.subjectRegistration.negativeInalidMonthValidYear,'be.disabled');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/dob-input"]',regressionInput.ordering.subjectRegistration.negativeValidMonthInvalidYear,'be.disabled');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/dob-input"]',regressionInput.ordering.subjectRegistration.negativeRandomDob,'be.disabled');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/dob-input"]',regressionInput.ordering.subjectRegistration.negativeCheckSpecialCharacter1,'be.disabled');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/dob-input"]',regressionInput.ordering.subjectRegistration.negativeInvalidYear,'be.disabled');
    },

    //C20923, C28488, C28260
    dobPositive: (patientData) => {
      cy.log('SubjectRegistration');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/dob-input"]',patientData.dateOfBirth,'not.be.disabled');
    },

    //C20911, C28489, C28261
    subjectIdNegative: () => {
      cy.log('SubjectRegistration');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/identifier-input"]',regressionInput.ordering.subjectRegistration.negativeInvalidSubjectIdAlphabet,'be.disabled');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/identifier-input"]',regressionInput.ordering.subjectRegistration.negativeInvalidSubjectIdSpecialCharacter,'be.disabled');
    },
    //C20924, C28490, C28262
    subjectIdPositive: (patientData) => {
      cy.log('SubjectRegistration');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/identifier-input"]',patientData.subjectId,'not.be.disabled');
    },

    //C20922, C28491, C28263
    toggleButtonNegative: () => {
      cy.log('SubjectRegistration');
      inputChecker.clickOnCheck('[data-testid="pass-button-subject_consent_toggle"]','be.disabled');
    },
    //C26455, C28492, C28264
    toggleButtonPositive: () => {
      cy.log('SubjectRegistration');
      inputChecker.clickOnCheck('[data-testid="fail-button-subject_consent_toggle"]','be.disabled');
      inputChecker.clickOnCheck('[data-testid="pass-button-subject_consent_toggle"]','not.be.disabled');
    },
    //C20751, C28493, C28265
    siteNameDropDownNegative: (patientData) => {
      cy.log('SubjectRegistration');
      cy.reload();
      inputHelpers.inputSingleField('[data-testid="#/properties/identifier-input"]',patientData.subjectId);
      inputHelpers.clicker('[data-testid="pass-button-subject_consent_toggle"]');
      inputChecker.inputSingleFieldCheck('[data-testid="#/properties/custom_fields/properties/dob-input"]',patientData.dateOfBirth,'be.disabled');
    },
    //C26453, C28494, C28266
    nextButtonPositive: (patientData,treatmentInfo) =>{
      cy.log('SubjectRegistration');
      inputChecker.dropDownSelect('[data-testid="institution_id"] .select',treatmentInfo.institution_select_index);
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputHelpers.clicker('[data-testid="back-nav-link"]');
      inputChecker.checkValue('[data-testid="#/properties/identifier-input"]',patientData.subjectId);
      inputChecker.checkValue("[data-testid='#/properties/custom_fields/properties/dob-input']",patientData.dateOfBirth);
      inputChecker.checkDropdownValue('.select',regressionInput.ordering.subjectRegistration.siteName);
      inputChecker.checkToggle('[data-testid="pass-button-subject_consent_toggle"]');
      inputHelpers.inputSingleField('[data-testid="#/properties/identifier-input"]',regressionInput.ordering.subjectRegistration.positiveSubjectId);
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      });
      inputChecker.checkState('[data-testid="reason-for-change-textarea"]','be.visible');
    }
  },

  principalInvestigatorInformation: {
    previousHappyPathSteps: (scope,therapy) => {
      orderingStepsHappyPath.subjectRegistration(scope.patientInformation,scope.treatmentInformation,therapy);
    },
    //C20691
    defaultdropdownPositive: () => {
      cy.log('Principal Investigator Information');
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled')
    },
    //C20695
    backbuttonPositive: (treatmentInfo) => {
      cy.log('Principal Investigator Information');
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled')
      inputChecker.dropDownSelect('[data-testid="physician_user_id"] .select',treatmentInfo.prescriber_select_index);
      inputChecker.nextButtonCheck('not.be.disabled');
      inputHelpers.clicker('[data-testid="back-nav-link"]');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled')
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C20696
    saveandcloseButtonPositive: (treatmentInfo,subjectId) => {
      cy.log('Principal Investigator Information');
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled')
      inputChecker.dropDownSelect('[data-testid="physician_user_id"] .select',treatmentInfo.prescriber_select_index);
      inputChecker.checkDataSavingWithSaveAndClose(subjectId,'not.be.disabled','');
      inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled')
    },
    //C20698
    nextbuttonPositive: (treatmentInfo) => {
      cy.log('Principal Investigator Information');
      inputChecker.dropDownSelect('[data-testid="physician_user_id"] .select',treatmentInfo.prescriber_select_index_0);
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.checkDataSavingWithBackButton('not.be.disabled','[data-test-id="ordering_principal_investigator_information"]')
    }
  },

  scheduleCollection: {
    previousHappyPathSteps: (scope,therapy) => {
      orderingStepsHappyPath.subjectRegistration(scope.patientInformation,scope.treatmentInformation,therapy);
      orderingStepsHappyPath.principal_investigator_information(scope.treatmentInformation);
    },
    //C20802
    collectionDateNotSelectedScheduleCollection: () => {
      cy.log('Schedule Collection');
      inputChecker.checkState(`[data-testid="btn-schedule"]`,'be.disabled')
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C20690
    blankContactNameScheduleCollection: (institution) => {
      cy.log('Schedule Collection');
      cy.scheduleFirstAvailableDate({ institutionType: institution });
      cy.get('[data-testid="btn-schedule"]')
        .click()
        .then(() => {
          cy.wait('@schedulingServiceCreate');
        });
      inputChecker.checkState(`[data-testid="btn-schedule"]`,'be.disabled')
      inputChecker.clearField('[data-testid="txt-contact-person-collection_cd30_us_eu"]');
      inputChecker.clickOnCheck('[data-testid="btn-schedule"]','be.disabled');
      translationHelpers.assertSingleField(`[data-testid="contact-person-invalid-collection_cd30_us_eu"]`,"Field can't be blank");
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C20801
    blankContactPhoneNumberScheduleCollection: () => {
      cy.log('Schedule Collection');
      inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-collection_cd30_us_eu"]', "Test Name", 'be.disabled');
      inputChecker.clearField('[data-testid="txt-phone-number-collection_cd30_us_eu"]');
      inputChecker.clickOnCheck('[data-testid="btn-schedule"]','be.disabled');
      translationHelpers.assertSingleField(`[data-testid="phone-number-invalid-collection_cd30_us_eu"]`,"Field can't be blank");
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C20803
    validDataScheduleCollection: () => {
      cy.log('Schedule Collection');
      inputHelpers.inputSingleField('[data-testid="txt-phone-number-collection_cd30_us_eu"]','123456789');
      inputChecker.clickOnCheck('[data-testid="btn-schedule"]', 'be.enabled');
    },
    //C20982
    verifySaveAndCloseScheduleCollection: (patientInformation) => {
      cy.log('Schedule Collection');
      inputChecker.checkDataSavingWithSaveAndClose(patientInformation.subjectId, 'be.enabled');
      inputChecker.checkValue('[data-testid="txt-contact-person-collection_cd30_us_eu"]','Test Name');
      inputChecker.checkValue('[data-testid="txt-phone-number-collection_cd30_us_eu"]','123456789');
    },
    //C20812
    verifyOnNextScheduleCollection: () => {
      cy.log('Schedule Collection');
      inputHelpers.clicker(`[data-testid="primary-button-action"]`);
      inputChecker.checkDataSavingWithBackButton('be.enabled','[data-test-id="ordering_schedule_collection"]');
      inputChecker.checkValue('[data-testid="txt-contact-person-collection_cd30_us_eu"]','Test Name');
      inputChecker.checkValue('[data-testid="txt-phone-number-collection_cd30_us_eu"]','123456789');
    }
  },

  scheduleCollectionUs: {
    previousHappyPathSteps: (scope,therapy) => {
      orderingStepsHappyPath.subjectRegistration(scope.patientInformation,scope.treatmentInformation,therapy);
      orderingStepsHappyPath.principal_investigator_information(scope.treatmentInformation);
    },
    //C28503
    collectionDateNotSelectedScheduleCollection: () => {
      cy.log('Schedule Collection');
      inputChecker.checkState(`[data-testid="btn-schedule"]`,'be.disabled')
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C28501
    blankContactNameScheduleCollection: (institution) => {
      cy.log('Schedule Collection');
      cy.scheduleFirstAvailableDate({ institutionType: institution });
      cy.get('[data-testid="btn-schedule"]')
        .click()
        .then(() => {
          cy.wait('@schedulingServiceCreate');
        });
      inputChecker.checkState(`[data-testid="btn-schedule"]`,'be.disabled')
      inputChecker.clearField('[data-testid="txt-contact-person-collection_cd30_us"]');
      inputChecker.clickOnCheck('[data-testid="btn-schedule"]','be.disabled');
      translationHelpers.assertSingleField(`[data-testid="contact-person-invalid-collection_cd30_us"]`,"Field can't be blank");
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C28502
    blankContactPhoneNumberScheduleCollection: () => {
      cy.log('Schedule Collection');
      inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-collection_cd30_us"]', "Test Name", 'be.disabled');
      inputChecker.clearField('[data-testid="txt-phone-number-collection_cd30_us"]');
      inputChecker.clickOnCheck('[data-testid="btn-schedule"]','be.disabled');
      translationHelpers.assertSingleField(`[data-testid="phone-number-invalid-collection_cd30_us"]`,"Field can't be blank");
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C28504
    validDataScheduleCollection: () => {
      cy.log('Schedule Collection');
      inputHelpers.inputSingleField('[data-testid="txt-phone-number-collection_cd30_us"]','123456789');
      inputChecker.clickOnCheck('[data-testid="btn-schedule"]', 'be.enabled');
    },
    //C28506
    verifySaveAndCloseScheduleCollection: (patientInformation) => {
      cy.log('Schedule Collection');
      inputChecker.checkDataSavingWithSaveAndClose(patientInformation.subjectId, 'be.enabled');
      inputChecker.checkValue('[data-testid="txt-contact-person-collection_cd30_us"]','Test Name');
      inputChecker.checkValue('[data-testid="txt-phone-number-collection_cd30_us"]','123456789');
    },
    //C28505
    verifyOnNextScheduleCollection: () => {
      cy.log('Schedule Collection');
      inputHelpers.clicker(`[data-testid="primary-button-action"]`);
      inputChecker.checkDataSavingWithBackButton('be.enabled','[data-test-id="ordering_schedule_collection"]');
      inputChecker.checkValue('[data-testid="txt-contact-person-collection_cd30_us"]','Test Name');
      inputChecker.checkValue('[data-testid="txt-phone-number-collection_cd30_us"]','123456789');
    }
  },

  scheduleCollectionEu: {
    previousHappyPathSteps: (scope,therapy) => {
      orderingStepsHappyPath.subjectRegistration(scope.patientInformation,scope.treatmentInformation,therapy);
      orderingStepsHappyPath.principal_investigator_information(scope.treatmentInformation);
    },
    //C28275
    collectionDateNotSelectedScheduleCollection: () => {
      cy.log('Schedule Collection');
      inputChecker.checkState(`[data-testid="btn-schedule"]`,'be.disabled')
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C28273
    blankContactNameScheduleCollection: (institution) => {
      cy.log('Schedule Collection');
      cy.scheduleFirstAvailableDate({ institutionType: institution });
      cy.get('[data-testid="btn-schedule"]')
        .click()
        .then(() => {
          cy.wait('@schedulingServiceCreate');
        });
      inputChecker.checkState(`[data-testid="btn-schedule"]`,'be.disabled')
      inputChecker.clearField('[data-testid="txt-contact-person-collection_cd30_eu_sg"]');
      inputChecker.clickOnCheck('[data-testid="btn-schedule"]','be.disabled');
      translationHelpers.assertSingleField(`[data-testid="contact-person-invalid-collection_cd30_eu_sg"]`,"Field can't be blank");
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C28274
    blankContactPhoneNumberScheduleCollection: () => {
      cy.log('Schedule Collection');
      inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-collection_cd30_eu_sg"]', "Test Name", 'be.disabled');
      inputChecker.clearField('[data-testid="txt-phone-number-collection_cd30_eu_sg"]');
      inputChecker.clickOnCheck('[data-testid="btn-schedule"]','be.disabled');
      translationHelpers.assertSingleField(`[data-testid="phone-number-invalid-collection_cd30_eu_sg"]`,"Field can't be blank");
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C28276
    validDataScheduleCollection: () => {
      cy.log('Schedule Collection');
      inputHelpers.inputSingleField('[data-testid="txt-phone-number-collection_cd30_eu_sg"]','123456789');
      inputChecker.clickOnCheck('[data-testid="btn-schedule"]', 'be.enabled');
    },
    //C28278
    verifySaveAndCloseScheduleCollection: (patientInformation) => {
      cy.log('Schedule Collection');
      inputChecker.checkDataSavingWithSaveAndClose(patientInformation.subjectId, 'be.enabled');
      inputChecker.checkValue('[data-testid="txt-contact-person-collection_cd30_eu_sg"]','Test Name');
      inputChecker.checkValue('[data-testid="txt-phone-number-collection_cd30_eu_sg"]','123456789');
    },
    //C28277
    verifyOnNextScheduleCollection: () => {
      cy.log('Schedule Collection');
      inputHelpers.clicker(`[data-testid="primary-button-action"]`);
      inputChecker.checkDataSavingWithBackButton('be.enabled','[data-test-id="ordering_schedule_collection"]');
      inputChecker.checkValue('[data-testid="txt-contact-person-collection_cd30_eu_sg"]','Test Name');
      inputChecker.checkValue('[data-testid="txt-phone-number-collection_cd30_eu_sg"]','123456789');
    }
  },

  confirmOrder: {
    previousHappyPathSteps: (scope,institution,therapy) => {
      orderingStepsHappyPath.subjectRegistration(scope.patientInformation,scope.treatmentInformation,therapy);
      orderingStepsHappyPath.principal_investigator_information(scope.treatmentInformation);
      orderingStepsHappyPath.scheduleCollection(institution);
    },
    //C21044 && C28287 && C28515
    verifyWithoutSignature: () => {
      cy.log('Confirm Order');
      inputHelpers.clicker('[data-testid="primary-button-action"]');
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.checkState('[name="viewDocumentViewSummary"]','be.disabled')
    },
    //C21045 && C28288 && C28516
    verifyWithSignature: () => {
      cy.log('Confirm Order');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      cy.reload();
      inputChecker.checkState('[name="viewDocumentViewSummary"]','not.be.disabled')
      inputChecker.nextButtonCheck('be.enabled');
    },
    //C24334 && C28289 && C28517
    verifyEdit: (name_id, contact_number_id, notes_id) => {
      const newSubjectId = Math.floor(100 + Math.random() * 899).toString() + - + Math.floor(100 + Math.random() * 899).toString();
      cy.log('Confirm Order');
      inputChecker.clickEdit('[data-testid="edit-subject_registration"]', 0);
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/dob-input"]','14-Mar-2020')
      inputHelpers.inputSingleField('[data-testid="#/properties/identifier-input"]', newSubjectId);
      inputChecker.dropDownSelect('[data-testid="institution_id"] .select', 2);
      inputHelpers.clicker(`[data-testid="primary-button-action"]`);
      inputHelpers.inputSingleField('[data-testid="reason-for-change-textarea"]','Regression');
      inputHelpers.clicker('[data-testid="reason-for-change-save"]');
      translationHelpers.assertBlockLabelWithIndex('[data-test-id="ordering-summary-block"]>>>>>>div', "Date of Birth", 0);
      inputHelpers.clicker('[data-testid="edit-principal_investigator_information"]');
      inputChecker.dropDownSelect('[data-testid="physician_user_id"] .select', 2);
      inputHelpers.clicker(`[data-testid="primary-button-action"]`);
      inputHelpers.inputSingleField('[data-testid="reason-for-change-textarea"]','Regression');
      inputHelpers.clicker('[data-testid="reason-for-change-save"]');
      inputHelpers.clicker('[data-testid="edit-schedule_collection"]');
      cy.wait(2000);
      inputHelpers.inputSingleField(name_id,'Test Name');
      inputHelpers.inputSingleField(contact_number_id,'123123123');
      inputHelpers.inputSingleField(notes_id,'Additional Comments');
      inputHelpers.clicker('[data-testid="btn-schedule"]');
      cy.reload();
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    }
  },

  confirmSubjectEligibilty:{
    previousHappyPathSteps: (scope,institution,therapy) => {
      orderingStepsHappyPath.subjectRegistration(scope.patientInformation,scope.treatmentInformation,therapy);
      orderingStepsHappyPath.principal_investigator_information(scope.treatmentInformation);
      orderingStepsHappyPath.scheduleCollection(institution);
      orderingStepsHappyPath.confirmOrder(scope.treatmentInformation);
    },
    // C21040
    toggleButtonNegativeConfirmSubjectEligibility: ()=>{
      cy.log('Confirm Subject Eligibilty');
      inputHelpers.clicker('[data-testid="fail-button-subject_eligibility_confirmed_toggle"]')
      inputChecker.nextButtonCheck('be.disabled');
    },
    // C21042
    saveAndClosePositiveConfirmSubjectEligibility: (patientInformation) => {
      cy.log('Confirm Subject Eligibilty');
      inputHelpers.clicker('[data-testid="pass-button-subject_eligibility_confirmed_toggle"]')
      inputChecker.checkDataSavingWithSaveAndClose(patientInformation.subjectId,'not.be.disabled','');
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },
    toggleButtonPositiveConfirmSubjectEligibility: () => {
    // C21101
      cy.log('Confirm Subject Eligibilty');
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    }
  },

  confirmSubjectEligibiltyUs:{
    previousHappyPathSteps: (scope,institution,therapy) => {
      orderingStepsHappyPath.subjectRegistration(scope.patientInformation,scope.treatmentInformation,therapy);
      orderingStepsHappyPath.principal_investigator_information(scope.treatmentInformation);
      orderingStepsHappyPath.scheduleCollectionUs(institution);
      orderingStepsHappyPath.confirmOrder(scope.treatmentInformation);
    },
    // C21040
    toggleButtonNegativeConfirmSubjectEligibility: ()=>{
      cy.log('Confirm Subject Eligibilty');
      inputHelpers.clicker('[data-testid="fail-button-subject_eligibility_confirmed_toggle"]')
      inputChecker.nextButtonCheck('be.disabled');
    },
    // C21042
    saveAndClosePositiveConfirmSubjectEligibility: (patientInformation) => {
      cy.log('Confirm Subject Eligibilty');
      inputHelpers.clicker('[data-testid="pass-button-subject_eligibility_confirmed_toggle"]')
      inputChecker.checkDataSavingWithSaveAndClose(patientInformation.subjectId,'not.be.disabled','');
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },
    toggleButtonPositiveConfirmSubjectEligibility: () => {
    // C21101
      cy.log('Confirm Subject Eligibilty');
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    }
  },

  confirmSubjectEligibiltyEu:{
    previousHappyPathSteps: (scope,institution,therapy) => {
      orderingStepsHappyPath.subjectRegistration(scope.patientInformation,scope.treatmentInformation,therapy);
      orderingStepsHappyPath.principal_investigator_information(scope.treatmentInformation);
      orderingStepsHappyPathEu.scheduleCollectionEu(institution);
      orderingStepsHappyPath.confirmOrder(scope.treatmentInformation);
    },
    // C21040
    toggleButtonNegativeConfirmSubjectEligibility: ()=>{
      cy.log('Confirm Subject Eligibilty');
      inputHelpers.clicker('[data-testid="fail-button-subject_eligibility_confirmed_toggle"]')
      inputChecker.nextButtonCheck('be.disabled');
    },
    // C21042
    saveAndClosePositiveConfirmSubjectEligibility: (patientInformation) => {
      cy.log('Confirm Subject Eligibilty');
      inputHelpers.clicker('[data-testid="pass-button-subject_eligibility_confirmed_toggle"]')
      inputChecker.checkDataSavingWithSaveAndClose(patientInformation.subjectId,'not.be.disabled','');
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },
    toggleButtonPositiveConfirmSubjectEligibility: () => {
    // C21101
      cy.log('Confirm Subject Eligibilty');
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    }
  },

  approveOrder: {
    previousHappyPathSteps: (scope, institution,therapy) => {
      orderingStepsHappyPath.subjectRegistration(scope.patientInformation,scope.treatmentInformation,therapy);
      orderingStepsHappyPath.principal_investigator_information(scope.treatmentInformation);
      orderingStepsHappyPath.scheduleCollection(institution);
      orderingStepsHappyPath.confirmOrder(scope.treatmentInformation);
      orderingStepsHappyPath.confirm_subject_eligibility();
    },
    //C21049
    verifyWithoutSignature: () => {
      cy.log('Approve Order');
      inputChecker.explicitWait('[data-test-id="ordering_approve_order"]');
      inputHelpers.clicker('[data-testid="primary-button-action"]');
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.checkState('[name="viewDocumentViewSummary"]','be.disabled')
    },
    //C21050
    verifyWithSignature: () => {
      cy.log('Approve Order');
      signatureHelpers.clickSignDocumentButtonAfterEdit(0, 'approver', ['@postSignatures']);
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignatures']);
      cy.reload();
      inputChecker.checkState('[name="viewDocumentViewSummary"]','be.enabled');
      inputChecker.nextButtonCheck('be.enabled');
    },
    //C24334
    verifyEdit: (name_id, contact_number_id, notes_id) => {
      const newSubjectId = Math.floor(100 + Math.random() * 899).toString() + - + Math.floor(100 + Math.random() * 899).toString();
      cy.log('Approve Order');
      inputChecker.clickEdit('[data-testid="edit-subject_registration"]', 0);
      inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/dob-input"]','14-Mar-2020')
      inputHelpers.inputSingleField('[data-testid="#/properties/identifier-input"]', newSubjectId);
      inputChecker.dropDownSelect('[data-testid="institution_id"] .select', 2);
      inputHelpers.clicker(`[data-testid="primary-button-action"]`);
      inputHelpers.inputSingleField('[data-testid="reason-for-change-textarea"]','Regression');
      inputHelpers.clicker('[data-testid="reason-for-change-save"]');
      translationHelpers.assertBlockLabelWithIndex('[data-test-id="ordering-summary-block"]>>>>>>div', "Date of Birth", 0);
      inputHelpers.clicker('[data-testid="edit-principal_investigator_information"]');
      inputChecker.dropDownSelect('[data-testid="physician_user_id"] .select', 2);
      inputHelpers.clicker(`[data-testid="primary-button-action"]`);
      inputHelpers.inputSingleField('[data-testid="reason-for-change-textarea"]','Regression');
      inputHelpers.clicker('[data-testid="reason-for-change-save"]');
      inputHelpers.clicker('[data-testid="edit-schedule_collection"]');
      cy.wait(2000);
      inputHelpers.inputSingleField(name_id,'Test Name');
      inputHelpers.inputSingleField(contact_number_id,'123123123');
      inputHelpers.inputSingleField(notes_id,'Additional Comments');
      inputHelpers.clicker('[data-testid="btn-schedule"]');
      cy.reload();
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
    }
  },

  checkStatusesOfOrderingModule: (scope) => {
    orderingStepsHappyPath.subjectRegistration(scope.patientInformation,scope.treatmentInformation,'cd30Eu');
    inputChecker.explicitWait('[data-test-id="ordering_principal_investigator_information"]');

    inputChecker.clickOnHeader('ordering')
    cy.checkStatus(scope.patientInformation.subjectId,regressionInput.ordering.statuses.created,'Treatments per Subject',4)
    orderingStepsHappyPath.principal_investigator_information(scope.treatmentInformation);
    inputChecker.explicitWait('[data-test-id="ordering_schedule_collection"]');

    inputChecker.clickOnHeader('ordering')
    cy.checkStatus(scope.patientInformation.subjectId,regressionInput.ordering.statuses.created,'Treatments per Subject',4)
    orderingStepsHappyPath.scheduleCollection('collection_cd30_us');
    inputChecker.explicitWait('[data-test-id="ordering_confirm_order"]');  

    inputChecker.clickOnHeader('ordering')
    cy.checkStatus(scope.patientInformation.subjectId,regressionInput.ordering.statuses.created,'Treatments per Subject',4)
    orderingStepsHappyPath.confirmOrder(scope.treatmentInformation);
    inputChecker.explicitWait('[data-test-id="ordering_confirm_subject_eligibility"]');

    inputChecker.clickOnHeader('ordering')
    cy.checkStatus(scope.patientInformation.subjectId,regressionInput.ordering.statuses.submitted,'Treatments per Subject',4)
    orderingStepsHappyPath.confirm_subject_eligibility();
    inputChecker.explicitWait('[data-test-id="ordering_approve_order"]');

    inputChecker.clickOnHeader('ordering')
    cy.checkStatus(scope.patientInformation.subjectId,regressionInput.ordering.statuses.submitted,'Treatments per Subject',4)
    orderingStepsHappyPath.approveOrder();
  
    cy.checkStatus(scope.patientInformation.subjectId,regressionInput.ordering.statuses.approved,'Treatments per Subject',4)
  },

  getCoi: (scope, therapyPrefix) => {
    cy.get(`[data-testid="orderingPhase.${therapyPrefix}.patientInformationHeader.coi-value"]`)
    .invoke('text')
    .then((text) => {
      cy.log("The coi", text)
      scope.treatment.coi = text
    })
  }
}
