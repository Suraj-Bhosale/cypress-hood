import input from '../../../fixtures/inputs.json';
import header from '../../../fixtures/assertions.json'
import common from '../../../support/index';
import schedulingSteps from '../scheduling_steps';
import translationHelpers from "../../shared_block_helpers/translationHelpers";
import orderingAssertionsCilta from '../../../fixtures/ordering_assertions_cilta.json';
import inputs from '../../../fixtures/inputs.json';
import actionButtonHelper from '../../shared_block_helpers/actionButtonHelpers';

const NavigateProgress = (headerTitle, phaseTestId) => {
  cy.log('NavigateProgress');
  // start on a separate page
  cy.get('[data-testid="h1-header"]').should($p => {
    expect($p).to.not.contain(headerTitle);
  });

  cy.waitForElementAndClick(`[data-testid="${phaseTestId}"]`);

  // assert that it is on the specified page
  cy.get('[data-testid="h1-header"]').should('contain', headerTitle);
};

const ViewTreatmentInformation = (data, headerTitle) => {
  NavigateProgress(headerTitle, 'progress-phase-treatment');
  common.ConfirmTreatmentInformation(data);
  common.ClickPrimaryActionButton();
};
const getCoi = scope => {
  cy.get('[data-testid = "patientInformationHeader.coi-value"]')
    .invoke('text')
    .then((text) => {
      cy.log("The coi", text)
      scope.coi = text
    })
  cy.wait(2000)
}
const orderingHeaderTranslations = () => {
  // patient name
  translationHelpers.assertSingleField('[data-testid="patientInformationHeader.patientName"]', orderingAssertionsCilta.orderHeader.patientName);
  //order id
  translationHelpers.assertSingleField('[data-testid="patientInformationHeader.patient_id"]', orderingAssertionsCilta.orderHeader.orderId);
  //coi
  translationHelpers.assertSingleField('[data-testid="patientInformationHeader.coi"]', orderingAssertionsCilta.orderHeader.coi);
};

const orderingPhasesTranslations = () => {
  //patient
  translationHelpers.assertSingleField('[data-testid=progress-patient-name]', orderingAssertionsCilta.orderPhases.patient);
  //scheduling
  translationHelpers.assertSingleField('[data-testid=progress-scheduling-name]', orderingAssertionsCilta.orderPhases.scheduling);
  //confirmation
  translationHelpers.assertSingleField('[data-testid=progress-confirmation-name]', orderingAssertionsCilta.orderPhases.confirmation);
};

const actionButtonTranslationCheck = (
  primaryBtnlabel = actionButtonHelper.translationKeys.NEXT,
  secondaryBtnLabel = actionButtonHelper.translationKeys.SAVE_AND_CLOSE
) => {
  actionButtonHelper.checkActionButtonLabel(actionButtonHelper.actionButtonKeys.PRIMARY, primaryBtnlabel);
  actionButtonHelper.checkActionButtonLabel(actionButtonHelper.actionButtonKeys.SECONDARY, secondaryBtnLabel);

}
export default {
  CreateOrder: ordersHeader => {
    cy.get('[data-testid="nav_li_ordering"]').should('be.visible');
    cy.waitForElementAndClick('[data-testid="nav_li_ordering"]');
    cy.get('[data-testid="ordering-header"]').should('contain', ordersHeader);
    cy.waitForElementAndClick('[data-testid="add-patient-button"]');
  },

  SelectTherapy: therapy => {
    //cy.wait('@products', { timeout: 120000 });
    cy.wait(5000)
    cy.get('[data-testid=' + therapy + ']').click();
    cy.wait(['@postProcedures', '@getProcedures', '@getProcedures']);
  },

  AddPatientInformation: (
    patientData,
    isEMEA = false, therapy
  ) => {
    cy.log('Add Patient Information')
    //translations
    if (Cypress.env('runWithTranslations')) {

      orderingHeaderTranslations();
      orderingPhasesTranslations();

      //title
      translationHelpers.assertPageTitles('[data-test-id="ordering_patient"]', 'h1', orderingAssertionsCilta.patientInformation.title);

      //section title
      translationHelpers.assertMultiField('[data-testid=section-heading-title]', orderingAssertionsCilta.patientInformation.patientInfo);
      translationHelpers.assertMultiField('[data-testid=section-heading-title]', orderingAssertionsCilta.patientInformation.orderDetails, 1);
      translationHelpers.assertPageTitles('[data-test-id="ordering_patient"]', 'h4', orderingAssertionsCilta.patientInformation.selectTreatment);

      //description translation
      translationHelpers.assertMultiField('[data-testid=section-heading-description]', orderingAssertionsCilta.patientInformation.patientInfoDescriptionKey);
      translationHelpers.assertMultiField('[data-testid=section-heading-description]', orderingAssertionsCilta.patientInformation.orderDescription, 1);
      translationHelpers.assertBlockLabel('[data-test-id="treatment-info-block-block"]>>>', { index: 2, label: orderingAssertionsCilta.patientInformation.institutionDropdown });

      //label translation
      //first name
      translationHelpers.assertSingleField('[id="#/properties/first_name"]', orderingAssertionsCilta.patientInformation.firstName);
      //last name
      translationHelpers.assertSingleField('[id="#/properties/last_name"]', orderingAssertionsCilta.patientInformation.lastName);
      //day of birth
      translationHelpers.assertBlockLabel('[data-testid=select-control-label]', { index: 0, label: orderingAssertionsCilta.patientInformation.dayOfBirth });
      //month of birth
      translationHelpers.assertBlockLabel('[data-testid=select-control-label]', { index: 1, label: orderingAssertionsCilta.patientInformation.monthOfBirth });
      //year of birth
      translationHelpers.assertSingleField('[id="#/properties/custom_fields/properties/year_of_birth"]', orderingAssertionsCilta.patientInformation.yearOfBirth);
      //order id
      translationHelpers.assertSingleField('[id="#/properties/identifier"]', orderingAssertionsCilta.patientInformation.orderId);

      // NOTE: therapy.region == 'emea_lc' includes EMEA LCDC and EMEA LC
      
      // patient ID
      translationHelpers.assertSingleField('[id="#/properties/custom_fields/properties/patient_id"]', orderingAssertionsCilta.patientInformation.patientId);
      
      //treatment ordering site
      translationHelpers.assertBlockLabel('[data-testid=institution_id]>', { index: 0, label: orderingAssertionsCilta.patientInformation.treatmentOrderingSite })

      //button translation
      actionButtonTranslationCheck();

    }
    cy.log('AddPatientInformation');
    cy.get("[data-testid='#/properties/first_name-input']")
      .first()
      .clear()
      .type(patientData.firstName);
    cy.get("[data-testid='#/properties/last_name-input']")
      .clear()
      .type(patientData.lastName);
    // cy.get("[id*='#/properties/custom_fields/properties/year_of_birth-input']").type('1980')
    cy.get("[id*='#/properties/custom_fields/properties/day_of_birth']")
      .eq(1)
      .select('01');
    cy.get("[id*='#/properties/custom_fields/properties/month_of_birth']")
      .eq(1)
      .select('Feb');
    cy.get("[id*='#/properties/custom_fields/properties/year_of_birth-input']").type(input.yearOfBirth)
    cy.get("[data-testid='#/properties/identifier-input']")
      .clear()
      .type(patientData.patientId);
    
    cy.get('[data-testid="#/properties/custom_fields/properties/patient_id-input"]')
        .type(patientData.patientId);
  },

  SelectOrderingSite: (data) => {
    cy.waitForElementAndClick('[data-testid="institution_id"] .select');
    cy.get(`[data-testid="institution_id"] .select-content li:nth-child(${data.prescriber_select_index})`)
      .should('be.visible')
    cy.waitForElementAndClick(
      `[data-testid="institution_id"] .select-content li:nth-child(${data.prescriber_select_index})`
    );

    actionButtonHelper.clickActionButton(actionButtonHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })

  },

  ViewTreatmentInformation,

  schedulingCheckAvailability: (therapy, region = 'US') => {

    //translations
    if (Cypress.env('runWithTranslations')) {

      //title
      translationHelpers.assertPageTitles('[data-test-id="ordering_scheduling"]', 'h1', orderingAssertionsCilta.scheduling.title);

      //section heading
      translationHelpers.assertSingleField(`[data-testid=lbl-schedule-title-collection${therapy.scheduler_suffix}]`, orderingAssertionsCilta.scheduling.collection);
      translationHelpers.assertSingleField(`[data-testid=lbl-schedule-title-infusion${therapy.scheduler_suffix}`, orderingAssertionsCilta.scheduling.drugProduct);

      //label
      //site name
      translationHelpers.assertSingleField(`[data-testid=lbl-site-select-collection${therapy.scheduler_suffix}]`, orderingAssertionsCilta.scheduling.selectSite);
      translationHelpers.assertSingleField(`[data-testid=lbl-site-select-infusion${therapy.scheduler_suffix}]`, orderingAssertionsCilta.scheduling.selectSite);
      //contact person
      translationHelpers.assertSingleField(`[data-testid=lbl-contact-person-collection${therapy.scheduler_suffix}]`, orderingAssertionsCilta.scheduling.contactPerson);
      translationHelpers.assertSingleField(`[data-testid=lbl-contact-person-infusion${therapy.scheduler_suffix}]`, orderingAssertionsCilta.scheduling.contactPerson);
      //contact phone number
      translationHelpers.assertSingleField(`[data-testid=lbl-phone-number-collection${therapy.scheduler_suffix}]`, orderingAssertionsCilta.scheduling.phoneNumber);
      translationHelpers.assertSingleField(`[data-testid=lbl-phone-number-infusion${therapy.scheduler_suffix}]`, orderingAssertionsCilta.scheduling.phoneNumber);
      //additional notes
      translationHelpers.assertSingleField(`[data-testid=lbl-additional-notes-collection${therapy.scheduler_suffix}]`, orderingAssertionsCilta.scheduling.additionalNotes);
      translationHelpers.assertSingleField(`[data-testid=lbl-additional-notes-collection${therapy.scheduler_suffix}]`, orderingAssertionsCilta.scheduling.additionalNotes);

    }
    cy.wait('@schedulingServiceSchedule').then(resp => {
      expect(resp.status).eq(404);
    });
    //cy.wait(1000)
    cy.wait('@schedulingServiceAvailability');
    schedulingSteps.fillInstitutionInformation(
      header,
      `infusion${therapy.scheduler_suffix}`,
      header['infusionInstrName' + region]
    );
    cy.scheduleFirstAvailableDate({ institutionType: `collection${therapy.scheduler_suffix}` });
    //cy.wait(2000)
    cy.wait('@schedulingServiceDraft');

    cy.get('[data-testid="btn-schedule"]')
      .click()
      .then(() => {
        cy.wait('@schedulingServiceCreate');
      });
    //cy.wait(2000)
  },

  AddSchedulingOrder: (sharedConstants, nextOrSave = 'next', reasonForChange = false) => {

    if (nextOrSave === 'next') {

      actionButtonTranslationCheck();
    } else {
      actionButtonHelper.checkActionButtonLabel(actionButtonHelper.actionButtonKeys.PRIMARY, actionButtonHelper.translationKeys.SAVE)

    }
    cy.get('[data-testid="primary-button-action"]').should('be.enabled');
    if (reasonForChange) {
      cy.waitForElementAndClick('[data-testid="primary-button-action"]');
      common.AddValueToReasonForChange();
    } else {

      actionButtonHelper.clickActionButton(actionButtonHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })

    }
  },

  SubmitOrder: (scope, therapy) => {
    cy.log('Submit Order')
    const verifier = input.oliverEmail;
    getCoi(scope);
    if (Cypress.env('runWithTranslations')) {

      //title
      translationHelpers.assertPageTitles('[data-test-id="ordering_confirmation"]', 'h1', orderingAssertionsCilta.confirmation.title);

      //section title
      translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3', orderingAssertionsCilta.confirmation.therapy, 0);
      translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3', orderingAssertionsCilta.confirmation.patientInfo, 1);
      translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3', orderingAssertionsCilta.confirmation.treatment, 2);
      translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3', orderingAssertionsCilta.confirmation.collection, 3);
     
      translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3', orderingAssertionsCilta.confirmation.drugProduct, 4);
      
      translationHelpers.assertSingleField('[data-testid=section-heading-title]', orderingAssertionsCilta.confirmation.summaryConfirm);

      //label translation
      //product
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'div', orderingAssertionsCilta.confirmation.product, 0);
      //first name
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'div', orderingAssertionsCilta.confirmation.firstName);
      //value
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'span', scope.patientInformation.firstName);

      //last name
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'div', orderingAssertionsCilta.confirmation.lastName);
      //value
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'span', scope.patientInformation.lastName);

      //day of birth
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'div', orderingAssertionsCilta.confirmation.dayOfBirth);

      //month of birth
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 4, 'div', orderingAssertionsCilta.confirmation.monthOfBirth);

      //year of birth
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 5, 'div', orderingAssertionsCilta.confirmation.yearOfBirth);

      //order id
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 6, 'div', orderingAssertionsCilta.confirmation.orderId);
      //value
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 6, 'span', scope.patientInformation.patientId);

      // NOTE: therapy.category == 'emea_lc'includes EMEA LCDC and EMEA LC
      //patient id or medical record
      
        cy.log('Medical record number')
        //medical record number
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 7, 'div', orderingAssertionsCilta.confirmation.patientId);
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 7, 'span', scope.patientInformation.patientId);
      
      //treatment ordering site
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 8, 'div', orderingAssertionsCilta.confirmation.treatmentOrderingSite);
      //value
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 8, 'span', inputs.testCoe1);

      // (collection)
      //EMEA LCDC does not show value that is why they are commented out, but apart from that they work for other therapies.
      //apheresis site
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 9, 'div', orderingAssertionsCilta.confirmation.apheresisSite);
      //value
      // translationHelpers.assertSectionChildElement('[data-testid=display-only]', 9 , 'span', inputs.testCoe1);

      // apheresis date
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 10, 'div', orderingAssertionsCilta.confirmation.apheresisDate);

      //street address
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 11, 'div', orderingAssertionsCilta.confirmation.streetAddress);
      //value
      // translationHelpers.assertSectionChildElement('[data-testid=display-only]', 11 , 'span', inputs.streetAddress);

      //contact name
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 12, 'div', orderingAssertionsCilta.confirmation.contactName);
      //value
      // translationHelpers.assertSectionChildElement('[data-testid=display-only]', 12 , 'span', inputs.Vasya);

      //phone number
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 13, 'div', orderingAssertionsCilta.confirmation.phoneNumber);
      //value
      // translationHelpers.assertSectionChildElement('[data-testid=display-only]', 13 , 'span', inputs.number1);

      //additional notes
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 14, 'div', orderingAssertionsCilta.confirmation.additionalNotes);
      
        //(drug product delivery)
        //delivery site
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 15, 'div', orderingAssertionsCilta.confirmation.deliverySite);
        // //value
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 15 , 'span', inputs.testCoe1);

        //delivery date
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 16, 'div', orderingAssertionsCilta.confirmation.deliveryDate);

        //street address
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 17, 'div', orderingAssertionsCilta.confirmation.streetAddress);
        //value
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 17 , 'span', inputs.dropOffAddress);

        //contact
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 18, 'div', orderingAssertionsCilta.confirmation.contactName);
        //value
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 18 , 'span', inputs.Lui);

        //number
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 19, 'div', orderingAssertionsCilta.confirmation.phoneNumber);
        //value
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 19 , 'span', inputs.number3);

        //additional delivery notes
        translationHelpers.assertSectionChildElement('[data-testid=display-only]', 20, 'div', orderingAssertionsCilta.confirmation.additionalDeliveryNotes);

      //signature
      translationHelpers.assertSingleField('[data-testid=verifier-prompt]', orderingAssertionsCilta.confirmation.verifyPrompt);
      translationHelpers.assertSingleField('[data-testid=approver-prompt]', orderingAssertionsCilta.confirmation.approverPrompt);

      //button
      actionButtonHelper.checkActionButtonLabel(actionButtonHelper.actionButtonKeys.PRIMARY, actionButtonHelper.translationKeys.SUBMIT_ORDER);
      actionButtonHelper.checkActionButtonLabel(actionButtonHelper.actionButtonKeys.SECONDARY, actionButtonHelper.translationKeys.CLOSE);

    }


    common.doubleSignatureOrdering(verifier);
    getCoi(scope);
    actionButtonHelper.clickActionButton(actionButtonHelper.actionButtonKeys.PRIMARY, {
      apiAliases: ['@patchProcedureSteps', '@getProcedures'],
    })

  }
}
