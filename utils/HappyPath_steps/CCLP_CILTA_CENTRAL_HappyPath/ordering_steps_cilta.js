import inputs from '../../../fixtures/inputs.json';
import header from '../../../fixtures/assertions.json';
import common from '../../../support/index';
import schedulingSteps from '../scheduling_steps';

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
    isEMEA = false
  ) => {
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
    cy.get("[id*='#/properties/custom_fields/properties/year_of_birth-input']").type(inputs.yearOfBirth)
    cy.get("[data-testid='#/properties/identifier-input']")
      .clear()
      .type(patientData.patientId);
    if (isEMEA) {
      cy.get('[data-testid="#/properties/custom_fields/properties/patient_id-input"]')
        .type(patientData.patientId);
    }
    else {
      cy.get('[data-testid="#/properties/custom_fields/properties/medical_record_number-input"]')
        .type(patientData.medicalRecordNumber);
    }
  },

  SelectOrderingSite: (data) => {
    cy.waitForElementAndClick('[data-testid="institution_id"] .select');
    cy.get(`[data-testid="institution_id"] .select-content li:nth-child(${data.prescriber_select_index})`)
      .should('be.visible')
    cy.waitForElementAndClick(
      `[data-testid="institution_id"] .select-content li:nth-child(${data.prescriber_select_index})`
    );
    common.ClickPrimaryActionButton();
  },

  // SelectPrescriber: (data, sharedConstants) => {
  //   cy.log('SelectPrescriber');
  //   cy.get("[data-testid='primary-button-action']").should('be.disabled');
  //   cy.waitForElementAndClick('[data-testid="physician_user_id"] .select');
  //   cy.waitForElementAndClick(
  //     `[data-testid="physician_user_id"] .select-content li:nth-child(${
  //       data.prescriber_select_index
  //       })`
  //   );
  //   cy.get('[data-testid="primary-button-action"]').should('contain', sharedConstants.next);
  //   cy.get('[data-testid="secondary-button-action"]').should(
  //     'contain',
  //     sharedConstants.saveAndClose
  //   );
  //   common.ClickPrimaryActionButton();
  // },

  ViewTreatmentInformation,

  CheckSchedulingAvailability: (therapy, region = 'US') => {
    cy.wait('@schedulingServiceSchedule').then(resp => {
      expect(resp.status).eq(404);
    });
    cy.wait(1000)
    cy.wait('@schedulingServiceAvailability');
    schedulingSteps.fillInstitutionInformation(
      header,
      `infusion${therapy}`,
      header['infusionInstrName' + region]
    );
    cy.scheduleFirstAvailableDate({ institutionType: `collection${therapy}` });
    cy.wait(2000)
    cy.wait('@schedulingServiceDraft');

    cy.get('[data-testid="btn-schedule"]')
      .click()
      .then(() => {
        cy.wait('@schedulingServiceCreate');
      });
    cy.wait(2000)
  },

  AddSchedulingOrder: (sharedConstants, nextOrSave = 'next', reasonForChange = false) => {
    if (nextOrSave === 'next') {
      cy.get('[data-testid="primary-button-action"]').should('contain', sharedConstants.next);
      cy.get('[data-testid="secondary-button-action"]').should('be.enabled');
    } else {
      cy.get('[data-testid="primary-button-action"]').should(
        'contain',
        sharedConstants.saveButtonText
      );
    }
    cy.get('[data-testid="primary-button-action"]').should('be.enabled');
    if (reasonForChange) {
      cy.waitForElementAndClick('[data-testid="primary-button-action"]');
      common.AddValueToReasonForChange();
    } else {
      common.ClickPrimaryActionButton();
    }
  },

  SubmitOrder: (scope) => {
    const verifier = inputs.oliverEmail;
    common.doubleSignatureOrdering(verifier);
    common.ClickPrimaryActionButton();
    getCoi(scope)
  }
}
