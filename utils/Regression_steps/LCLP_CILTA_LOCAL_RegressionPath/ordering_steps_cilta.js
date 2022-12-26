import input from '../../../fixtures/inputs.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import orderingAssertionsCilta from '../../../fixtures/ordering_assertions_cilta.json';
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers';
import inputChecker from '../../shared_block_helpers/inputFieldCheckHelpers';
import signatureHelpers from '../../shared_block_helpers/signatureHelpers'
import regressionInput from '../../../fixtures/inputsRegression.json'
import translationHelpers from '../../../utils/shared_block_helpers/translationHelpers';
import orderingHappyPath from '../../../utils/HappyPath_steps/LCLP_CILTA_LOCAL_HappyPath/ordering_steps_cilta';
import header from '../../../fixtures/assertions.json';


export default {
  selectTherapyHappyPath: (therapy) => {
    cy.log('login nina');
    cy.platformLogin('nina@vineti.com');
    cy.visit('/ordering');
    cy.get('[data-testid="nav_li_ordering"]').should('be.visible');
    cy.waitForElementAndClick('[data-testid="nav_li_ordering"]');
    cy.waitForElementAndClick('[data-testid="add-patient-button"]');
    cy.get('[data-testid=' + therapy + ']').click();
    cy.wait(['@postProcedures', '@getProcedures', '@getProcedures']);
},

patientInformation: {

  //C40142
  firstNameNegative:(patientData, data) => {
    cy.log('Patient Information');
    inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']",patientData.lastName);
    inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/day_of_birth']", 1,input.dayOfBirth);
    inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/month_of_birth']", 1,input.monthOfBirth);
    inputHelpers.inputSingleField("[id*='#/properties/custom_fields/properties/year_of_birth-input']",input.yearOfBirth);
    inputHelpers.inputSingleField("[data-testid='#/properties/identifier-input']",patientData.patientId);
    inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/medical_record_number-input"]',patientData.medicalRecordNumber);
    inputChecker.dropDownSelect('[data-testid="institution_id"] .select',data.prescriber_select_index);
    actionButtonsHelper.checkActionButtonIsDisabled('primary');
  },

  //C40143
  lastNameNegative:(patientData, data) => {
    cy.log('Patient Information');
    inputChecker.reloadPage();
    inputHelpers.inputSingleField("[data-testid='#/properties/first_name-input']",patientData.firstName);
    inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/day_of_birth']", 1,input.dayOfBirth);
    inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/month_of_birth']", 1,input.monthOfBirth);
    inputHelpers.inputSingleField("[id*='#/properties/custom_fields/properties/year_of_birth-input']",input.yearOfBirth);
    inputHelpers.inputSingleField("[data-testid='#/properties/identifier-input']",patientData.patientId);
    inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/medical_record_number-input"]',patientData.medicalRecordNumber);
    inputChecker.dropDownSelect('[data-testid="institution_id"] .select',data.prescriber_select_index);
    actionButtonsHelper.checkActionButtonIsDisabled('primary');
  },

  //C40144
  dayOfBirthPositive: (patientData, data) => {
    cy.log('Patient Information');
    inputChecker.reloadPage();
    inputHelpers.inputSingleField("[data-testid='#/properties/first_name-input']",patientData.firstName);
    inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']",patientData.lastName);
    inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/month_of_birth']", 1,input.monthOfBirth);
    inputHelpers.inputSingleField("[id*='#/properties/custom_fields/properties/year_of_birth-input']",input.yearOfBirth);
    inputHelpers.inputSingleField("[data-testid='#/properties/identifier-input']",patientData.patientId);
    inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/medical_record_number-input"]',patientData.medicalRecordNumber);
    inputChecker.dropDownSelect('[data-testid="institution_id"] .select',data.prescriber_select_index);
    actionButtonsHelper.checkActionButtonIsEnabled('primary');
    inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/day_of_birth']", 1,input.dayOfBirth);
    actionButtonsHelper.checkActionButtonIsEnabled('primary');
  },

  //C40145
  monthOfBirthNegative: (patientData, data) => {
    cy.log('Patient Information');
    inputChecker.reloadPage();
    inputHelpers.inputSingleField("[data-testid='#/properties/first_name-input']",patientData.firstName);
    inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']",patientData.lastName);
    inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/day_of_birth']", 1,input.dayOfBirth);
    inputHelpers.inputSingleField("[id*='#/properties/custom_fields/properties/year_of_birth-input']",input.yearOfBirth);
    inputHelpers.inputSingleField("[data-testid='#/properties/identifier-input']",patientData.patientId);
    inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/medical_record_number-input"]',patientData.medicalRecordNumber);
    inputChecker.dropDownSelect('[data-testid="institution_id"] .select',data.prescriber_select_index);
    actionButtonsHelper.checkActionButtonIsEnabled('primary');
    inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/month_of_birth']", 1,input.monthOfBirth);
    actionButtonsHelper.checkActionButtonIsEnabled('primary');
  },

  //C40146
  yearOfBirthPositive: (patientData, data) => {
    cy.log('Patient Information');
    inputChecker.reloadPage();
    inputHelpers.inputSingleField("[data-testid='#/properties/first_name-input']",patientData.firstName);
    inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']",patientData.lastName);
    inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/day_of_birth']", 1,input.dayOfBirth);
    inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/month_of_birth']", 1,input.monthOfBirth);
    inputHelpers.inputSingleField("[data-testid='#/properties/identifier-input']",patientData.patientId);
    inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/medical_record_number-input"]',patientData.medicalRecordNumber);
    inputChecker.dropDownSelect('[data-testid="institution_id"] .select',data.prescriber_select_index);
    actionButtonsHelper.checkActionButtonIsDisabled('primary');
  },

  //C40147
  yearOfBirthNegative: (patientData, data) => {
    cy.log('Patient Information');
    inputChecker.reloadPage();
    inputHelpers.inputSingleField("[data-testid='#/properties/first_name-input']",patientData.firstName);
    inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']",patientData.lastName);
    inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/day_of_birth']", 1,input.dayOfBirth);
    inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/month_of_birth']", 1,input.monthOfBirth);
    inputHelpers.inputSingleField("[data-testid='#/properties/identifier-input']",patientData.patientId);
    inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/medical_record_number-input"]',patientData.medicalRecordNumber);
    inputChecker.dropDownSelect('[data-testid="institution_id"] .select',data.prescriber_select_index);
    inputHelpers.inputSingleField("[id*='#/properties/custom_fields/properties/year_of_birth-input']",'1899');
    actionButtonsHelper.checkActionButtonIsDisabled('primary');
    inputHelpers.inputSingleField("[id*='#/properties/custom_fields/properties/year_of_birth-input']",'3001');
    actionButtonsHelper.checkActionButtonIsDisabled('primary');
  },

  //C40148
  orderIdNegative: (patientData, data) => {
    cy.log('Patient Information');
    inputChecker.reloadPage();
    inputHelpers.inputSingleField("[data-testid='#/properties/first_name-input']",patientData.firstName);
    inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']",patientData.lastName);
    inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/day_of_birth']", 1,input.dayOfBirth);
    inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/month_of_birth']", 1,input.monthOfBirth);
    inputHelpers.inputSingleField("[id*='#/properties/custom_fields/properties/year_of_birth-input']",input.yearOfBirth);
    inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/medical_record_number-input"]',patientData.medicalRecordNumber);
    inputChecker.dropDownSelect('[data-testid="institution_id"] .select',data.prescriber_select_index);
    actionButtonsHelper.checkActionButtonIsDisabled('primary');
  },

  //C40149
  medicalRecordNoNegative: (patientData, data) => {
    cy.log('Patient Information');
    inputChecker.reloadPage();
    inputHelpers.inputSingleField("[data-testid='#/properties/first_name-input']",patientData.firstName);
    inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']",patientData.lastName);
    inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/day_of_birth']", 1,input.dayOfBirth);
    inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/month_of_birth']", 1,input.monthOfBirth);
    inputHelpers.inputSingleField("[id*='#/properties/custom_fields/properties/year_of_birth-input']",input.yearOfBirth);
    inputHelpers.inputSingleField("[data-testid='#/properties/identifier-input']",patientData.patientId);
    inputChecker.dropDownSelect('[data-testid="institution_id"] .select',data.prescriber_select_index);
    actionButtonsHelper.checkActionButtonIsDisabled('primary');
  },

  //C40150
  treatmentSiteNegative: (patientData) => {
    cy.log('Patient Information');
    inputChecker.reloadPage();
    inputHelpers.inputSingleField("[data-testid='#/properties/first_name-input']",patientData.firstName);
    inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']",patientData.lastName);
    inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/day_of_birth']", 1,input.dayOfBirth);
    inputHelpers.dropDownSelect("[id*='#/properties/custom_fields/properties/month_of_birth']", 1,input.monthOfBirth);
    inputHelpers.inputSingleField("[id*='#/properties/custom_fields/properties/year_of_birth-input']",input.yearOfBirth);
    inputHelpers.inputSingleField("[data-testid='#/properties/identifier-input']",patientData.patientId);
    inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/medical_record_number-input"]',patientData.medicalRecordNumber);
    actionButtonsHelper.checkActionButtonIsDisabled('primary');
  },

  //C40151
  dataSavingWithsaveAndClosePositive: (patientData, data) => {
    cy.log('Patient Information');
    inputChecker.dropDownSelect('[data-testid="institution_id"] .select',data.prescriber_select_index);
    inputChecker.checkDataSavingWithSaveAndClose(patientData.patientId,'be.visible','Treatments per Patient');
    actionButtonsHelper.checkActionButtonIsEnabled('primary');
    inputChecker.checkValue("[data-testid='#/properties/first_name-input']",patientData.firstName);
    inputChecker.checkValue("[data-testid='#/properties/last_name-input']",patientData.lastName);
    inputChecker.checkValue("[id*='#/properties/custom_fields/properties/year_of_birth-input']",input.yearOfBirth);
    inputChecker.checkValue("[data-testid='#/properties/identifier-input']",patientData.patientId);
    inputChecker.checkValue('[data-testid="#/properties/custom_fields/properties/medical_record_number-input"]',patientData.medicalRecordNumber);
    inputChecker.checkDropdownValue('.select',regressionInput.ordering.positiveTreatmentSiteLabel);
  },

  //C40152
  dataSavingWithBackButtonPositive: (patientData, data) => {
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures']
    })
    inputChecker.checkDataSavingWithBackButton('be.visible')
    inputChecker.checkValue("[data-testid='#/properties/first_name-input']",patientData.firstName);
    inputChecker.checkValue("[data-testid='#/properties/last_name-input']",patientData.lastName);
    inputChecker.checkValue("[id*='#/properties/custom_fields/properties/year_of_birth-input']",input.yearOfBirth);
    inputChecker.checkValue("[data-testid='#/properties/identifier-input']",patientData.patientId);
    inputChecker.checkValue('[data-testid="#/properties/custom_fields/properties/medical_record_number-input"]',patientData.medicalRecordNumber);
    inputChecker.checkDropdownValue('.select',regressionInput.ordering.positiveTreatmentSiteLabel);
  },

  //C40153
  checkReasonForChangePositive: () => {
    inputHelpers.inputSingleField('[data-testid="#/properties/identifier-input"]','1234');
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
    });
    inputChecker.checkState('[data-testid="reason-for-change-textarea"]','be.visible');
  }
},
scheduling: {
  previousHappyPathSteps: (patientInformation,therapy,treatmentInformation,orderingSite,patientHeaderBar, header,region) => {
    orderingHappyPath.AddPatientInformation(patientInformation, "", therapy);
    orderingHappyPath.SelectOrderingSite( treatmentInformation,
      orderingSite,
      patientHeaderBar,
      header )
    cy.wait(5000);
  },
 // C29484
  collectionDateNotSelectedScheduleCollection: () => {
    inputChecker.nextButtonCheck('be.disabled');
},
//C29485
scheduleButtonEnabled: (therapy, region = 'US') => {
  orderingHappyPath.schedulingCheckAvailability(therapy,region)
  inputChecker.checkState('[data-testid="btn-schedule"]','be.visible');
},
//C29487
dataSavingWithsaveAndClosePositive: (patientData) => {
 inputChecker.checkDataSavingWithSaveAndClose(patientData.patientId,'be.visible');
},
//C29488
dataSavingWithBackButtonPositive: ( ) => {
  actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
    apiAliases: ['@patchProcedureSteps', '@getProcedures']
  })
  inputChecker.checkDataSavingWithBackButton('be.visible')
},
//C294846
orderCancellationRequest: () => {
  cy.get('[data-testid=cancel-button-action]').click();
  inputChecker.checkState('[data-testid=cancel-page-abort-button]','be.visible');
  cy.get('[data-testid=cancel-page-abort-button]').click();
},
},
confirmation: {
  previousHappyPathSteps: (patientInformation,therapy,treatmentInformation,orderingSite,patientHeaderBar, header,region) => {
    orderingHappyPath.AddPatientInformation(patientInformation, "", therapy);
    orderingHappyPath.SelectOrderingSite( treatmentInformation,
      orderingSite,
      patientHeaderBar,
      header )
    orderingHappyPath.schedulingCheckAvailability(therapy,region)
    orderingHappyPath.AddSchedulingOrder(header);
    cy.wait(2000)
  },
  verifySubmitOrderButtonStatus: () => {
    //C29493,C29494
    cy.log('Confirmation')
    cy.reload();
    inputChecker.nextButtonCheck('be.disabled');
    inputChecker.checkState('[data-testid="verifier-sign-button"]','be.enabled');
    inputChecker.checkState('[data-testid="approver-sign-button"]','be.disabled');
    signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'])
    inputChecker.nextButtonCheck('be.disabled');
    inputChecker.checkState('[data-testid="verifier-signature-name"]','be.visible');
    inputChecker.checkState('[data-testid="approver-sign-button"]','be.enabled');
    signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'], input.oliverEmail)
    inputChecker.nextButtonCheck('not.be.disabled');
    inputChecker.checkState('[data-testid="verifier-signature-name"]','be.visible');
    inputChecker.checkState('[data-testid="approver-signature-name"]','be.visible');
  },
  verifyEditButton1: () => {
    //C29489
    cy.log('Confirmation')
    cy.reload();
    inputHelpers.clicker('[data-testid="edit-patient"]')
    translationHelpers.assertPageTitles('[data-test-id="ordering_patient"]', 'h1', orderingAssertionsCilta.patientInformation.title);
    inputChecker.nextButtonCheck('not.be.disabled');
    inputChecker.inputSingleFieldCheck('[id*="#/properties/custom_fields/properties/year_of_birth-input"]',regressionInput.ordering.confirmation.positiveYearOfBirth,"be.enabled");
    actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
    });
    inputChecker.checkState('[data-testid="reason-for-change-textarea"]','be.visible');
    inputHelpers.inputSingleField("[data-testid='reason-for-change-textarea']",regressionInput.ordering.confirmation.positiveReasonForChange)
    inputHelpers.clicker('[data-testid="reason-for-change-save"]')
    translationHelpers.assertBlockLabelWithIndex('[data-testid=display-only]>div', "Year of Birth", 10);
    translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "1981 ", 11);
    inputChecker.nextButtonCheck('be.disabled');
    inputChecker.checkState('[data-testid="verifier-sign-button"]','be.enabled');
    inputChecker.checkState('[data-testid="approver-sign-button"]','be.disabled');  
  },
  verifyEditButton2: () => {
    //C29490
    cy.log('Confirmation')
    cy.reload();
    inputChecker.clickEdit('[data-testid="edit-scheduling"]',0);
    translationHelpers.assertPageTitles('[data-test-id="ordering_scheduling"]', 'h1', orderingAssertionsCilta.scheduling.title);
    inputChecker.nextButtonCheck('not.be.disabled');
    inputChecker.inputSingleFieldCheck('[data-testid="txt-phone-number-collection_us_lclp_cilta"]',regressionInput.ordering.confirmation.positivePhoneNumber,'not.be.enabled')
    inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-collection_us_lclp_cilta"]',regressionInput.ordering.confirmation.positiveContactName,'not.be.enabled')
    inputChecker.checkState('[data-testid="btn-schedule"]','be.enabled')
    inputHelpers.clicker('[data-testid="btn-schedule"]')
    cy.wait(2000)
    inputChecker.checkState('[data-testid="primary-button-action"]','be.disabled');  
    inputHelpers.clicker('[data-testid="primary-button-action"]')
    translationHelpers.assertBlockLabelWithIndex('[data-testid=display-only]>div', "Contact Name",24 );
    translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "John ",25 );
    translationHelpers.assertBlockLabelWithIndex('[data-testid=display-only]>div', "Phone Number",26 );
    translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "+1-45677 ",27);
    inputChecker.nextButtonCheck('be.disabled');
    inputChecker.checkState('[data-testid="verifier-sign-button"]','be.enabled');
    inputChecker.checkState('[data-testid="approver-sign-button"]','be.disabled');  
  },
  verifyEditButton3: () => {
    //C29492
    cy.log('Confirmation')
    cy.reload();
    inputChecker.clickEdit('[data-testid="edit-scheduling"]', 1);
    translationHelpers.assertPageTitles('[data-test-id="ordering_scheduling"]', 'h1', orderingAssertionsCilta.scheduling.title);
    inputChecker.nextButtonCheck('not.be.disabled');
    inputChecker.inputSingleFieldCheck('[data-testid="txt-phone-number-infusion_us_lclp_cilta"]',regressionInput.ordering.confirmation.positivePhoneNumber,'not.be.enabled')
    inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-infusion_us_lclp_cilta"]',regressionInput.ordering.confirmation.positiveContactName,'not.be.enabled')
    inputChecker.checkState('[data-testid="btn-schedule"]','be.enabled')
    inputHelpers.clicker('[data-testid="btn-schedule"]')
    cy.wait(2000)
    inputChecker.checkState('[data-testid="primary-button-action"]','be.disabled');  
    inputHelpers.clicker('[data-testid="primary-button-action"]')
    translationHelpers.assertBlockLabelWithIndex('[data-testid=display-only]>div', "Contact Name",36 );
    translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "John ",37 );
    translationHelpers.assertBlockLabelWithIndex('[data-testid=display-only]>div', "Phone Number",38 );
    translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "+1-45677 ",39);
    inputChecker.nextButtonCheck('be.disabled');
    inputChecker.checkState('[data-testid="verifier-sign-button"]','be.enabled');
    inputChecker.checkState('[data-testid="approver-sign-button"]','be.disabled');  
  }, 
},
checktheStatusesOfOrderingModule: (therapy, scope) => {
  orderingHappyPath.AddPatientInformation(scope.patientInformation, "", therapy);
  orderingHappyPath.SelectOrderingSite(
    scope.treatmentInformation,header.orderingSite,
    scope.patientHeaderBar,header
    );
  inputHelpers.clickOnHeader('ordering')
  cy.checkStatus(scope.patientId, regressionInput.ordering.statuses.created, 'Patients', 4)

  orderingHappyPath.schedulingCheckAvailability(therapy)
  orderingHappyPath.AddSchedulingOrder(header);
  inputHelpers.clickOnHeader('ordering')
  cy.checkStatus(scope.patientId, regressionInput.ordering.statuses.created, 'Patients', 4)

  orderingHappyPath.SubmitOrder(scope, therapy);
  cy.checkStatus(scope.patientId, regressionInput.ordering.statuses.approved, 'Patients', 4)
  }
}