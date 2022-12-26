import input from '../../../fixtures/inputs.json';
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
  ) => {
    cy.log('AddPatientInformation');
    cy.get("[data-testid='#/properties/first_name-input']")
      .first()
      .clear()
      .type(patientData.firstName);
    cy.get("[data-testid='#/properties/middle_name-input']")
      .clear()
      .type(patientData.middleName);
    cy.get("[data-testid='#/properties/last_name-input']")
      .clear()
      .type(patientData.lastName);
    cy.get("[id*='#/properties/custom_fields/properties/day_of_birth']")
      .eq(1)
      .select('01');
    cy.get("[id*='#/properties/custom_fields/properties/month_of_birth']")
      .eq(1)
      .select('Feb');
    // cy.get("[id*='#/properties/custom_fields/properties/year_of_birth-input']").type('1980')
    cy.get("[id*='#/properties/custom_fields/properties/year_of_birth-input']").type(input.yearOfBirth)
    cy.get("[id*='#/properties/biological_sex']")
      .eq(1)
      .select('Male');
    cy.get("[data-testid='#/properties/identifier-input']")
      .clear()
      .type(patientData.subjectNumber);
    cy.get("[id*='#/properties/screening_date'")
      .last()
      .clear()
      .type(patientData.screeningDateFormatted);
    cy.get('[data-testid="#/properties/custom_fields/properties/site_number-input"]')
      .type(patientData.siteNumber);
    cy.get("body").then($body => {
      if ($body.find("[id*='#/properties/custom_fields/properties/patient_id-input']").length > 0) {
        cy.get("[id*='#/properties/custom_fields/properties/patient_id-input']").then($header => {
          if ($header.is(':visible')) {
            cy.get("[id*='#/properties/custom_fields/properties/patient_id-input']").type(input.patientID);
          }
        });
      }
    });
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

  SelectPrescriber: (data, sharedConstants) => {
    cy.log('SelectPrescriber');
    cy.get("[data-testid='primary-button-action']").should('be.disabled');
    cy.waitForElementAndClick('[data-testid="physician_user_id"] .select');
    cy.waitForElementAndClick(
      `[data-testid="physician_user_id"] .select-content li:nth-child(${data.prescriber_select_index
      })`
    );
    cy.get('[data-testid="primary-button-action"]').should('contain', sharedConstants.next);
    cy.get('[data-testid="secondary-button-action"]').should(
      'contain',
      sharedConstants.saveAndClose
    );
    common.ClickPrimaryActionButton();
  },

  ViewTreatmentInformation,

  CheckSchedulingAvailability: (therapy, region = 'US') => {
    cy.wait('@schedulingServiceAvailability');
    schedulingSteps.fillInstitutionInformation(
      header,
      `collection${therapy}`,
      header['infusionInstrName' + region]
    );
    cy.scheduleFirstAvailableDate({ institutionType: `collection${therapy}` }, region);
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

  SubmitOrder: () => {
    const verifier = input.oliverEmail;
    common.doubleSignatureOrdering(verifier);
    common.ClickPrimaryActionButton();
  },

  ApproveOrder: (scope) => {
    getCoi(scope)
    cy.get('[data-testid="approver-sign-button"]').click();
    cy.get('[data-testid="password-field"]').type(input.password);
    cy.get('input[value="Sign Document"]').click();
    cy.wait('@postSignature');
    common.ClickPrimaryActionButton();
    common.ClickPrimaryActionButton();
  }
}
