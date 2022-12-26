import input from '../../../fixtures/inputs.json'
import header from '../../../fixtures/assertions.json'
import common from '../../../support/index'
import translationHelpers from '../../shared_block_helpers/translationHelpers'
import orderingAssertions from '../../../fixtures/orderingAssertions.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers'
import regressionInput from '../../../fixtures/inputsRegression.json'
import inputChecker from "../../shared_block_helpers/inputFieldCheckHelpers";
import order_steps from '../../../utils/HappyPath_steps/CCLP_EU_HappyPath/ordering_steps';
import regressionOrderingSteps from '../../../utils/Regression_steps/CCLP_EU_RegressionPath/ordering_steps'


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

  selectTherapyHappyPath: (ordersHeader,therapy) => {
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
    
      //C40564
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
        inputChecker.clearValueAndCheckForButton("[id*='#/properties/custom_fields/properties/year_of_birth-input']",'be.disabled')
        inputChecker.nextButtonCheck('be.disabled')
        
      },
  
      firstLastNamesEmpty: (patientData) => 
      {
       //C40560
        inputHelpers.inputSingleField("[id*='#/properties/custom_fields/properties/year_of_birth-input']", input.yearOfBirth)
        inputChecker.clearInputField('#/properties/first_name');
        inputChecker.nextButtonCheck('be.disabled')
        inputHelpers.inputSingleField("[data-testid='#/properties/first_name-input']", patientData.firstName)
        inputHelpers.inputSingleField("[data-testid='#/properties/first_name-input']", patientData.firstName)
        inputChecker.clearInputField('#/properties/last_name');
        inputChecker.nextButtonCheck('be.disabled')
      },
  
      keepSubjectNumberAsEmpty: (patientData) => {
        //C40562
        inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']", patientData.lastName);
        inputChecker.clearInputField('#/properties/identifier');
        inputChecker.nextButtonCheck('be.disabled')
      },
  
      keepSiteNumberAsEmpty: (patientData) => 
      {
        //C40563
        inputHelpers.inputSingleField("[data-testid='#/properties/identifier-input']", patientData.subjectNumber);
        inputChecker.clearInputField('#/properties/custom_fields/properties/site_number');
        inputChecker.nextButtonCheck('be.disabled')
      },
  
      verifyNextButtonWithoutSelectingSex: (patientData) => {
        // //	C40561
        inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/site_number-input"]', patientData.siteNumber)
        inputHelpers.dropDownSelect("[id*='#/properties/biological_sex']", 1, "")
        inputChecker.nextButtonCheck('be.disabled')
      },
  
      checkForInfoSavedAfterClickingNext: (patientData) => {
       //C40565
        inputHelpers.dropDownSelect("[id*='#/properties/biological_sex']", 1, 'Male');
        inputChecker.checkValue("[data-testid='#/properties/first_name-input']", patientData.firstName)
        inputChecker.checkValue("[data-testid='#/properties/last_name-input']", patientData.lastName)
        inputChecker.checkValue("[id*='#/properties/custom_fields/properties/year_of_birth-input']", input.yearOfBirth);
        inputChecker.checkValue("[data-testid='#/properties/identifier-input']", patientData.subjectNumber)
        inputChecker.checkValue('[data-testid="#/properties/custom_fields/properties/site_number-input"]', patientData.siteNumber)
        inputChecker.nextButtonCheck('not.be.disabled')
      }
    },
  
      SelectPrescriber:   {
        previousHappyPathSteps: (scope,therapy) => {
          order_steps.patient(scope.patientInformation, therapy);
          order_steps.prescriber(scope.treatmentInformation,header.orderingSite,scope.patientHeaderBar,header);
        },
  
        negNoPhysicianSelected: () => {
          //C40557
          inputChecker.nextButtonCheck('be.disabled')
        },
  
        posSaveAndClose: (data,scope) => {
          //C40558
          cy.waitForElementAndClick('[data-testid="physician_user_id"] .select')
          cy.waitForElementAndClick(`[data-testid="physician_user_id"] .select-content li:nth-child(${data.prescriber_select_index})`)
          inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Treatments per Patient")
        },
  
        posVerifyReasonForChange: () => {
          //	C40559
          inputHelpers.clicker('[data-testid="primary-button-action"]')
          inputHelpers.clicker('[data-testid="back-nav-link"]')
          cy.waitForElementAndClick('[data-testid="physician_user_id"] .select')
          cy.waitForElementAndClick(`[data-testid="physician_user_id"] .select-content li:nth-child(2)`)
          inputChecker.reasonForChange()
        }
      },
    
      scheduleCollection: {
        previousHappyPathSteps: (therapy,scope) => {
          order_steps.patient(scope.patientInformation, therapy);
          order_steps.prescriber(scope.treatmentInformation);
          order_steps.SelectPrescriber(scope.treatmentInformation);
        },
         
      contactPerson: () => {
         //	C40559
        inputChecker.clearField('[data-testid="txt-contact-person-collection_eu"]');
        inputChecker.clearField('[data-testid="txt-contact-person-infusion_eu"]');
        inputChecker.clearField('[data-testid="txt-contact-person-satellite_lab_eu"]');
        inputChecker.nextButtonCheck('be.disabled');
        },
      contactPhoneNumber: () => {
       //C40550
        inputHelpers.inputSingleField('[data-testid="txt-contact-person-collection_eu"]',input.contactPerson);
        inputHelpers.inputSingleField('[data-testid="txt-contact-person-infusion_eu"]',input.contactPerson);
        inputHelpers.inputSingleField('[data-testid="txt-contact-person-satellite_lab_eu"]',input.contactPerson);
        inputChecker.clearField('[data-testid="txt-phone-number-collection_eu"]');
        inputChecker.clearField('[data-testid="txt-phone-number-infusion_eu"]');
        inputChecker.clearField('[data-testid="txt-phone-number-satellite_lab_eu"]');
        inputChecker.nextButtonCheck('be.disabled');
      },

      checkNextButtonWithoutScheduling: () => {
        //	C40545
        inputHelpers.inputSingleField('[data-testid="txt-phone-number-collection_eu"]',input.contactNumber);
        inputHelpers.inputSingleField('[data-testid="txt-phone-number-infusion_eu"]',input.contactNumber);
        inputHelpers.inputSingleField('[data-testid="txt-phone-number-satellite_lab_eu"]',input.contactNumber);
        inputChecker.nextButtonCheck('be.disabled')
      },
  
      posvalues: (region,therapy) => {
        //C40546
        cy.wait('@schedulingServiceAvailability')
        cy.scheduleFirstAvailableDate({ institutionType: `collection${therapy.scheduler_suffix}` }, region)
        cy.wait('@schedulingServiceDraft')
    
        cy.get('[data-testid="btn-schedule"]')
        .click()
        .then(() => {
            cy.wait('@schedulingServiceCreate')
        })
        inputChecker.nextButtonCheck('not.be.disabled')
      },
  
      posSaveAndClose:(scope) => {
        //C40547
        inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Treatments per Patient")
      },
  
      checkForTheInfoSaved: () => {
         //C40548
        inputChecker.checkForTheInfoSavedClickingNextAndBack();
        inputChecker.nextButtonCheck('not.be.disabled')
      }
    },
  
  
      confirmation: {
        previousHappyPathSteps: (therapy,scope,region) => {
          order_steps.patient(scope.patientInformation, therapy);
          order_steps.prescriber(scope.treatmentInformation);
          order_steps.SelectPrescriber(scope.treatmentInformation);
          order_steps.schedulingCheckAvailability(therapy, region);
          order_steps.AddSchedulingOrder(header);
        },
        verifyEditButton1:()=>{
        //C40538
           // Patient Info
          inputHelpers.clicker('[data-testid="edit-patient"]');
          inputHelpers.inputSingleField('[data-testid="#/properties/first_name-input"]','Z');
          inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']",'A');
          inputChecker.reasonForChange()
          translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span','Z',1);
          translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span','A',3);
        },
        
        verifyEditButton2: () => {
          //C40539
          // Prescriber Information
          inputHelpers.clicker('[data-testid="edit-prescriber"]');
          inputHelpers.dropDownSelectTwo('[data-testid="physician_user_id"] .select', 1);
          inputChecker.reasonForChange()
          translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span',"Dr. Barbara McClintok",10);
        },

        verifyEditButton3: () => {
          //C40540
          // Scheduling
        inputChecker.clickEdit('[data-testid="edit-scheduling"]',0);
        inputChecker.nextButtonCheck('not.be.disabled');
        inputChecker.explicitWait('[data-testid="btn-clear-date-collection_eu"]')
        inputHelpers.clicker('[data-testid="btn-clear-date-collection_eu"]')
        inputHelpers.changeInstitutionData(header.collectionInstNameEU,'collection_eu','Jhonseen','45378')
        inputChecker.explicitWait('[data-testid="btn-clear-date-collection_eu"]')
        inputChecker.inputSingleFieldCheck('[data-testid="txt-phone-number-collection_eu"]',regressionInput.ordering.confirmation.positivePhoneNumber,'not.be.enabled')
        inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-collection_eu"]',regressionInput.ordering.confirmation.positiveContactName,'not.be.enabled')
        inputChecker.inputSingleFieldCheck('[data-testid="txt-phone-number-satellite_lab_eu"]','6543','not.be.enabled')
        inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-satellite_lab_eu"]','Richard','not.be.enabled')
        inputChecker.inputSingleFieldCheck('[data-testid="txt-phone-number-infusion_eu"]','93333','not.be.enabled')
        inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-infusion_eu"]','Anne','not.be.enabled')
        inputChecker.explicitWait('[data-testid="btn-schedule"]')
        inputHelpers.clicker('[data-testid="btn-schedule"]')
        inputChecker.explicitWait('[data-testid="primary-button-action"]')
        inputHelpers.clicker('[data-testid="primary-button-action"]')
        translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "John ",31 );
        translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "+43-45677 ",33);
        translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "Richard ",43 );
        translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "+1-6543 ",45);
        translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "Anne ",55 );
        translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "+1-93333 ",57);
      },
      
      verifyEditButton4: () => {
        //C40543
        inputChecker.clickEdit('[data-testid="edit-scheduling"]',1);
        inputChecker.nextButtonCheck('not.be.disabled');
        translationHelpers.assertPageTitles('[data-test-id="ordering_scheduling"]', 'h1', orderingAssertions.scheduling.title)
        inputHelpers.clicker('[data-testid="primary-button-action"]')
      },

       verifyEditButton5: () => {
         //C40544	
        inputChecker.clickEdit('[data-testid="edit-scheduling"]',2);
        inputChecker.nextButtonCheck('not.be.disabled');
        translationHelpers.assertPageTitles('[data-test-id="ordering_scheduling"]', 'h1', orderingAssertions.scheduling.title)
        inputHelpers.clicker('[data-testid="primary-button-action"]')
      },
          
      verifySubmitButtonWithAndWithoutSign:()=>{
       //C40541
        inputChecker.nextButtonCheck('be.disabled');
        signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'])
        signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'], input.oliverEmail)
        inputChecker.nextButtonCheck('be.enabled');
        },

        posCloseButton: (scope) => {
         //C40542
        inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Treatments per Patient")
        }
  
      },
  
      approval: {
        previousHappyPathSteps: (therapy,scope,region) => {
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
  
        verifyEditButton1:()=>{
          //C40533	
           // Patient Info
        inputHelpers.clicker('[data-testid="edit-patient"]');
        inputHelpers.inputSingleField('[data-testid="#/properties/first_name-input"]','Z');
        inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']",'A');
        inputChecker.reasonForChange()
        translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span','Z',1);
        translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span','A',3);
        },
        
        verifyEditButton2: () => {
          //C40534
          // Prescriber Information
        inputHelpers.clicker('[data-testid="edit-prescriber"]');
        inputHelpers.dropDownSelectTwo('[data-testid="physician_user_id"] .select', 1);
        inputChecker.reasonForChange()
        translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span',"Dr. Barbara McClintok",10);
        },

        verifyEditButton3: () => {
         //C40535
         inputChecker.clickEdit('[data-testid="edit-scheduling"]',0);
         inputChecker.nextButtonCheck('not.be.disabled');
         inputChecker.explicitWait('[data-testid="btn-clear-date-collection_eu"]')
         inputHelpers.clicker('[data-testid="btn-clear-date-collection_eu"]')
         inputHelpers.changeInstitutionData(header.infusionInstrNameEU,'collection_eu','Jhonseen','45378')
         inputChecker.explicitWait('[data-testid="btn-clear-date-collection_eu"]')
         inputChecker.inputSingleFieldCheck('[data-testid="txt-phone-number-collection_eu"]',regressionInput.ordering.confirmation.positivePhoneNumber,'not.be.enabled')
         inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-collection_eu"]',regressionInput.ordering.confirmation.positiveContactName,'not.be.enabled')
         inputChecker.inputSingleFieldCheck('[data-testid="txt-phone-number-satellite_lab_eu"]','6543','not.be.enabled')
         inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-satellite_lab_eu"]','Richard','not.be.enabled')
         inputChecker.inputSingleFieldCheck('[data-testid="txt-phone-number-infusion_eu"]','93333','not.be.enabled')
         inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-infusion_eu"]','Anne','not.be.enabled')
         inputChecker.explicitWait('[data-testid="btn-schedule"]')
         inputHelpers.clicker('[data-testid="btn-schedule"]')
         inputChecker.explicitWait('[data-testid="primary-button-action"]')
         inputHelpers.clicker('[data-testid="primary-button-action"]')
         translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "John ",31 );
         translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "+43-45677 ",33);
         translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "Richard ",43 );
         translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "+1-6543 ",45);
         translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "Anne ",55 );
         translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "+1-93333 ",57);
      },
      
       verifyEditButton4: () => {
        //	C40536
        inputChecker.clickEdit('[data-testid="edit-scheduling"]',1);
        inputChecker.nextButtonCheck('not.be.disabled');
        translationHelpers.assertPageTitles('[data-test-id="ordering_scheduling"]', 'h1', orderingAssertions.scheduling.title)
        inputHelpers.clicker('[data-testid="primary-button-action"]')
      },

       verifyEditButton5: () => {
         //C40537
        inputChecker.clickEdit('[data-testid="edit-scheduling"]',2);
        inputChecker.nextButtonCheck('not.be.disabled');
        translationHelpers.assertPageTitles('[data-test-id="ordering_scheduling"]', 'h1', orderingAssertions.scheduling.title)
        inputHelpers.clicker('[data-testid="primary-button-action"]')
      },

        verifySubmitButtonWithAndWithoutSign:()=>{
        //C40531
        inputChecker.nextButtonCheck('be.disabled');
        signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'])
        signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'], input.oliver3Email)
        signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
        inputChecker.nextButtonCheck('be.enabled');
        },
        
        posCloseButton: (scope) => {
          //	C40532
        inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Treatments per Patient")
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