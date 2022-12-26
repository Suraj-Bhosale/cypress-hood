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
import order_steps from '../../../utils/HappyPath_steps/CCLP_US_HappyPath/ordering_steps';
import regressionOrderingSteps from '../../../utils/Regression_steps/CCLP_US_RegressionPath/ordering_steps'



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
      
        negYearOfBirthAndScreeningDate: (patientData) => {
         //C39975
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
          
        },
    
        firstLastNamesEmpty: (patientData) => 
        {
         //C39971
          inputHelpers.inputSingleField("[id*='#/properties/custom_fields/properties/year_of_birth-input']", input.yearOfBirth)
          inputChecker.clearInputField('#/properties/first_name');
          inputChecker.nextButtonCheck('be.disabled')
          inputHelpers.inputSingleField("[data-testid='#/properties/first_name-input']", patientData.firstName)
          inputHelpers.inputSingleField("[data-testid='#/properties/first_name-input']", patientData.firstName)
          inputChecker.clearInputField('#/properties/last_name');
          inputChecker.nextButtonCheck('be.disabled')
        },
    
        keepSubjectNumberAsEmpty: (patientData) => {
          //C39973
          inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']", patientData.lastName);
          inputChecker.clearInputField('#/properties/identifier');
          inputChecker.nextButtonCheck('be.disabled')
        },
    
        keepSiteNumberAsEmpty: (patientData) => 
        {
          //	C39974
          inputHelpers.inputSingleField("[data-testid='#/properties/identifier-input']", patientData.subjectNumber);
          inputChecker.clearInputField('#/properties/custom_fields/properties/site_number');
          inputChecker.nextButtonCheck('be.disabled')
        },
    
        verifyNextButtonWithoutSelectingSex: (patientData) => {
          //C39972
          inputHelpers.inputSingleField('[data-testid="#/properties/custom_fields/properties/site_number-input"]', patientData.siteNumber)
          inputHelpers.dropDownSelect("[id*='#/properties/biological_sex']", 1, "")
          inputChecker.nextButtonCheck('be.disabled')
        },
    
        checkForInfoSavedAfterClickingNext: (patientData) => {
         //C39976
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
            //C39977
            inputChecker.nextButtonCheck('be.disabled')
          },
    
          posSaveAndClose: (data,scope) => {
            //	C39978
            cy.waitForElementAndClick('[data-testid="physician_user_id"] .select')
            cy.waitForElementAndClick(`[data-testid="physician_user_id"] .select-content li:nth-child(${data.prescriber_select_index})`)
            inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Treatments per Patient")
          },
    
          posVerifyReasonForChange: () => {
           //C39979
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
           //C39969
          inputChecker.clearField('[data-testid="txt-contact-person-collection_cclp"]');
          inputChecker.clearField('[data-testid="txt-contact-person-infusion_cclp"]');
          inputChecker.clearField('[data-testid="txt-contact-person-satellite_lab_cclp"]');
          inputChecker.nextButtonCheck('be.disabled');
          },

        contactPhoneNumber: () => {
         //C39970
          inputHelpers.inputSingleField('[data-testid="txt-contact-person-collection_cclp"]',input.contactPerson);
          inputHelpers.inputSingleField('[data-testid="txt-contact-person-infusion_cclp"]',input.contactPerson);
          inputHelpers.inputSingleField('[data-testid="txt-contact-person-satellite_lab_cclp"]',input.contactPerson);
          inputChecker.clearField('[data-testid="txt-phone-number-collection_cclp"]');
          inputChecker.clearField('[data-testid="txt-phone-number-infusion_cclp"]');
          inputChecker.clearField('[data-testid="txt-phone-number-satellite_lab_cclp"]');
          inputChecker.nextButtonCheck('be.disabled');
        },
  
        checkNextButtonWithoutScheduling: () => {
          //C39965
          inputHelpers.inputSingleField('[data-testid="txt-phone-number-collection_cclp"]',input.contactNumber);
          inputHelpers.inputSingleField('[data-testid="txt-phone-number-infusion_cclp"]',input.contactNumber);
          inputHelpers.inputSingleField('[data-testid="txt-phone-number-satellite_lab_cclp"]',input.contactNumber);
          inputChecker.nextButtonCheck('be.disabled')
        },
    
        posvalues: (region,therapy) => {
          //	C39966
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
         //C39967
          inputChecker.checkDataSavingWithSaveAndClose(scope.patientInformation.subjectNumber,"be.enabled","Treatments per Patient")
        },
    
        checkForTheInfoSaved: () => {
           //C39968
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
            ////C39958
             // Patient Info
            inputHelpers.clicker('[data-testid="edit-patient"]');
            inputHelpers.inputSingleField('[data-testid="#/properties/first_name-input"]','Z');
            inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']",'A');
            inputChecker.reasonForChange()
            translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span','Z',1);
            translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span','A',3);
          },
          
          verifyEditButton2: () => {
            //C39959
            // Prescriber Information
            inputHelpers.clicker('[data-testid="edit-prescriber"]');
            inputHelpers.dropDownSelectTwo('[data-testid="physician_user_id"] .select', 1);
            inputChecker.reasonForChange()
            translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span',"Dr. Barbara McClintok",10);
          },
  
          verifyEditButton3: () => {
           //C39960
            // Scheduling
          inputChecker.clickEdit('[data-testid="edit-scheduling"]',0);
          inputChecker.nextButtonCheck('not.be.disabled');
          inputChecker.explicitWait('[data-testid="btn-clear-date-collection_cclp"]')
          inputHelpers.clicker('[data-testid="btn-clear-date-collection_cclp"]')
          inputHelpers.changeInstitutionData(header.collectionInstNameUS,'collection_cclp','Jhonseen','45378')
          inputChecker.explicitWait('[data-testid="btn-clear-date-collection_cclp"]')
          inputChecker.inputSingleFieldCheck('[data-testid="txt-phone-number-collection_cclp"]',regressionInput.ordering.confirmation.positivePhoneNumber,'not.be.enabled')
          inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-collection_cclp"]',regressionInput.ordering.confirmation.positiveContactName,'not.be.enabled')
          inputChecker.inputSingleFieldCheck('[data-testid="txt-phone-number-satellite_lab_cclp"]','6543','not.be.enabled')
          inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-satellite_lab_cclp"]','Richard','not.be.enabled')
          inputChecker.inputSingleFieldCheck('[data-testid="txt-phone-number-infusion_cclp"]','93333','not.be.enabled')
          inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-infusion_cclp"]','Anne','not.be.enabled')
          inputChecker.explicitWait('[data-testid="btn-schedule"]')
          inputHelpers.clicker('[data-testid="btn-schedule"]')
          inputChecker.explicitWait('[data-testid="primary-button-action"]')
          inputHelpers.clicker('[data-testid="primary-button-action"]')
          translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "John ",31 );
          translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "+1-45677 ",33);
          translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "Richard ",43 );
          translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "+1-6543 ",45);
          translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "Anne ",55 );
          translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "+1-93333 ",57);
        },
        
        verifyEditButton4: () => {
         //	C39963
          inputChecker.clickEdit('[data-testid="edit-scheduling"]',1);
          inputChecker.nextButtonCheck('not.be.disabled');
          translationHelpers.assertPageTitles('[data-test-id="ordering_scheduling"]', 'h1', orderingAssertions.scheduling.title)
          inputHelpers.clicker('[data-testid="primary-button-action"]')
        },
  
         verifyEditButton5: () => {
          //C39964
          inputChecker.clickEdit('[data-testid="edit-scheduling"]',2);
          inputChecker.nextButtonCheck('not.be.disabled');
          translationHelpers.assertPageTitles('[data-test-id="ordering_scheduling"]', 'h1', orderingAssertions.scheduling.title)
          inputHelpers.clicker('[data-testid="primary-button-action"]')
        },
            
        verifySubmitButtonWithAndWithoutSign:()=>{
          //C39961
          inputChecker.nextButtonCheck('be.disabled');
          signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'])
          signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'], input.oliverEmail)
          inputChecker.nextButtonCheck('be.enabled');
          },
  
          posCloseButton: (scope) => {
            //C39962
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
           //C39953	
             // Patient Info
          inputHelpers.clicker('[data-testid="edit-patient"]');
          inputHelpers.inputSingleField('[data-testid="#/properties/first_name-input"]','Z');
          inputHelpers.inputSingleField("[data-testid='#/properties/last_name-input']",'A');
          inputChecker.reasonForChange()
          translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span','Z',1);
          translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span','A',3);
          },
          
          verifyEditButton2: () => {
           //C39954
            // Prescriber Information
          inputHelpers.clicker('[data-testid="edit-prescriber"]');
          inputHelpers.dropDownSelectTwo('[data-testid="physician_user_id"] .select', 1);
          inputChecker.reasonForChange()
          translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>>span',"Dr. Barbara McClintok",10);
          },
  
          verifyEditButton3: () => {
           //C39955
           inputChecker.clickEdit('[data-testid="edit-scheduling"]',0);
           inputChecker.nextButtonCheck('not.be.disabled');
           inputChecker.explicitWait('[data-testid="btn-clear-date-collection_cclp"]')
           inputHelpers.clicker('[data-testid="btn-clear-date-collection_cclp"]')
           inputHelpers.changeInstitutionData(header.collectionInstNameUS,'collection_cclp','Jhonseen','45378')
           inputChecker.explicitWait('[data-testid="btn-clear-date-collection_cclp"]')
           inputChecker.inputSingleFieldCheck('[data-testid="txt-phone-number-collection_cclp"]',regressionInput.ordering.confirmation.positivePhoneNumber,'not.be.enabled')
           inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-collection_cclp"]',regressionInput.ordering.confirmation.positiveContactName,'not.be.enabled')
           inputChecker.inputSingleFieldCheck('[data-testid="txt-phone-number-satellite_lab_cclp"]','6543','not.be.enabled')
           inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-satellite_lab_cclp"]','Richard','not.be.enabled')
           inputChecker.inputSingleFieldCheck('[data-testid="txt-phone-number-infusion_cclp"]','93333','not.be.enabled')
           inputChecker.inputSingleFieldCheck('[data-testid="txt-contact-person-infusion_cclp"]','Anne','not.be.enabled')
           inputChecker.explicitWait('[data-testid="btn-schedule"]')
           inputHelpers.clicker('[data-testid="btn-schedule"]')
           inputChecker.explicitWait('[data-testid="primary-button-action"]')
           inputHelpers.clicker('[data-testid="primary-button-action"]')
           translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "John ",31 );
           translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "+1-45677 ",33);
           translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "Richard ",43 );
           translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "+1-6543 ",45);
           translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "Anne ",55 );
           translationHelpers.assertBlockValueWithIndex('[data-testid=display-only]>div', "+1-93333 ",57);
        },
        
         verifyEditButton4: () => {
         //	C39956
          inputChecker.clickEdit('[data-testid="edit-scheduling"]',1);
          inputChecker.nextButtonCheck('not.be.disabled');
          translationHelpers.assertPageTitles('[data-test-id="ordering_scheduling"]', 'h1', orderingAssertions.scheduling.title)
          inputHelpers.clicker('[data-testid="primary-button-action"]')
        },
  
         verifyEditButton5: () => {
           //C39957
          inputChecker.clickEdit('[data-testid="edit-scheduling"]',2);
          inputChecker.nextButtonCheck('not.be.disabled');
          translationHelpers.assertPageTitles('[data-test-id="ordering_scheduling"]', 'h1', orderingAssertions.scheduling.title)
          inputHelpers.clicker('[data-testid="primary-button-action"]')
        },
          verifySubmitButtonWithAndWithoutSign:()=>{
          //	C39951
          inputChecker.nextButtonCheck('be.disabled');
          signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'])
          signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'], input.oliver3Email)
          signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
          inputChecker.nextButtonCheck('be.enabled');
          },
          
          posCloseButton: (scope) => {
           //C39952
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
  