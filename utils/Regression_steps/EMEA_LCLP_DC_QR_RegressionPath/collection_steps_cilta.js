import common from "../../../support/index"
import assertions from '../../../fixtures/assertions.json';
import inputs from '../../../fixtures/inputs.json';
import collectionCiltaAssertion from "../../../fixtures/collectionCilta_assertion.json";
import translationHelpers from "../../shared_block_helpers/translationHelpers";
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers';
import therapy from '../../../fixtures/therapy.json';
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers';


export const getCollAirWayBill = (scope, testId) => {
	common.loginAs('oliver');
	cy.visit('/ordering');
	cy.get('td[data-testid="patient-identifier"]').contains(scope.patientInformation.patientId).click();
	cy.get('[data-testid="td-stage-plane-icon"]').eq(0).parent().parent().parent().find('[data-testid="td-stage-site-details"]').invoke('text').then((text) => {
		scope.airWayBill = text.substring(9, text.length)
		common.loginAs('phil');
		cy.visit('/collection');
		cy.wait(3000)
		common.loadCollection();
		cy.get(`tr[data-testid="treatment-${scope.coi
			}"]`).click();
		if (testId) {
			cy.get(`[data-testid="collection-airway-bill-input-field"]`).type(scope.airWayBill);
		} else {
			cy.get('[data-testid="collection-airway-bill-input-field"]').type(scope.airWayBill);
			cy.get('[data-testid="collection-airway-bill-action-trigger-button"]').click();
		}
		cy.wait('@labelVerifications');
		cy.log('collectionAirwayBill', scope.airWayBill)
	});
}

const actionButtonsTranslectionCheck = (primaryBtnlabel = actionButtonsHelper.translationKeys.NEXT, secondaryBtnLabel = actionButtonsHelper.translationKeys.CLOSE) => {

	actionButtonsHelper.checkActionButtonLabel(actionButtonsHelper.actionButtonKeys.PRIMARY, primaryBtnlabel)
	actionButtonsHelper.checkActionButtonLabel(actionButtonsHelper.actionButtonKeys.SECONDARY, secondaryBtnLabel)
}
// Header
const collectionCiltaHeaderTranslations = (therapy) => {

	translationHelpers.assertSingleField('[data-testid="patientInformationHeader.name"]', collectionCiltaAssertion.collectionCiltaHeader.name)

	translationHelpers.assertSingleField('[data-testid="patientInformationHeader.patient_id"]', collectionCiltaAssertion.collectionCiltaHeader.orderId)

	translationHelpers.assertSingleField('[data-testid="patientInformationHeader.product"]', collectionCiltaAssertion.collectionCiltaHeader.product)

	if (![
		'_emea_ccdc',
		'_emea_cc',
		'_emea_ccdc_qr',
		'_emea_cc_qr',
		'_emea_lc_qr',
		'_emea_lc',
		'_emea_lcdc'
	].includes(therapy.unique_id)) {
		translationHelpers.assertSingleField('[data-testid="patientInformationHeader.medical_record_number"]', collectionCiltaAssertion.collectionCiltaHeader.medicalRecordNumber)
	}

}
// Phases
const collectionCiltaPhaseTranslations = (therapy) => {

	translationHelpers.assertSingleField('[data-testid=progress-collection_patient_identity-name]', collectionCiltaAssertion.colletionCiltaPhase.patientIdentity)

	translationHelpers.assertSingleField('[data-testid=progress-collection_bag_id-name]', collectionCiltaAssertion.colletionCiltaPhase.bagId)

	translationHelpers.assertSingleField('[data-testid=progress-label_printing-name]', collectionCiltaAssertion.colletionCiltaPhase.labels)

	translationHelpers.assertSingleField('[data-testid=progress-collect-name]', collectionCiltaAssertion.colletionCiltaPhase.collect)

	translationHelpers.assertSingleField('[data-testid=progress-summary-name]', collectionCiltaAssertion.colletionCiltaPhase.summary)

	if (![
		'_cmlp_cilta',
		'_cclp_cilta',
		'_emea_ccdc',
		'_emea_cc',
		'_emea_ccdc_qr',
		'_emea_cc_qr'
	].includes(therapy.unique_id)) {

		translationHelpers.assertSingleField('[data-testid=progress-cryopreservation-name]', collectionCiltaAssertion.colletionCiltaPhase.cryopreservation)

	}

	translationHelpers.assertSingleField('[data-testid=progress-shipping-name]', collectionCiltaAssertion.colletionCiltaPhase.shipping)

}

export default {
	centralLabelPrinting: () => {
		cy.get("[data-testid='h1-header']").should('contain', assertions.centralLabelPrinting);
		cy.get("body").then($body => {
			if ($body.find('[id="#/properties/data/properties/is_collection_labels_confirmed"]').length > 0) { // evaluates as true if button exists at all
				cy.get('[id="#/properties/data/properties/is_collection_labels_confirmed"]').then($header => {
					if ($header.is(':visible')) {
						cy.get('[id="#/properties/data/properties/is_collection_labels_confirmed"]').click();
					}
				});
			}
		});
		cy.get("body").then($body => {
			if ($body.find('[id="#/properties/data/properties/is_cryopreservation_labels_confirmed"]').length > 0) { // evaluates as true if button exists at all
				cy.get('[id="#/properties/data/properties/is_cryopreservation_labels_confirmed"]').then($header => {
					if ($header.is(':visible')) {
						cy.get('[id="#/properties/data/properties/is_cryopreservation_labels_confirmed"]').click();
					}
				});
			}
		});
		cy.get('[id="#/properties/data/properties/is_shipper_labels_confirmed"]').click();
		common.ClickPrimaryActionButton();
		common.singleSignature();
		common.ClickPrimaryActionButton();
	},

	labelShipping: () => {
		cy.get("[data-testid='h1-header']").should('contain', assertions.labelShipping);
		common.singleSignature();
		common.ClickPrimaryActionButton();
	},

	// CILTA
	patientVerificationCilta: (therapy, scope) => {
		cy.log('Patient Verification')
		// translations
		if (Cypress.env('runWithTranslations')) {
			if (!therapy.unique_id == '_emea_lcdc_qr')
				collectionCiltaHeaderTranslations(therapy);

			collectionCiltaPhaseTranslations(therapy);
			actionButtonsTranslectionCheck();

			// title
			translationHelpers.assertPageTitles('[data-test-id="collection_patient_identity"]', 'h1', collectionCiltaAssertion.patientVerification.title)

			// subtitle
			translationHelpers.assertBlockLabel('[data-test-id="ordering-summary-block-block"] >>', {
				index: 0,
				label: collectionCiltaAssertion.patientVerification.patientInformation
			})

			translationHelpers.assertSingleField('[data-testid=section-heading-title]', collectionCiltaAssertion.patientVerification.verifyPatientIdentity)

			// labels
			// Firstname
			translationHelpers.assertBlockLabel('[data-testid=display-only] >', {
				index: 0,
				label: collectionCiltaAssertion.patientVerification.firstName
			})
			// First name Value
			translationHelpers.assertSingleField('[data-testid=display-only] >> :nth(0)', scope.patientInformation.firstName)
			// Last Name
			translationHelpers.assertBlockLabel('[data-testid=display-only] >', {
				index: 2,
				label: collectionCiltaAssertion.patientVerification.lastName
			})
			// Last name Value
			translationHelpers.assertSingleField('[data-testid=display-only] >> :nth(1)', scope.patientInformation.lastName)
			// Date of Birth
			translationHelpers.assertBlockLabel('[data-testid=display-only] >', {
				index: 4,
				label: collectionCiltaAssertion.patientVerification.dayOfBirth
			})
			// Date of Birth Value
			translationHelpers.assertSingleField('[data-testid=display-only] >> :nth(2)', inputs.dayOfBirth)
			// Month of Birth
			translationHelpers.assertBlockLabel('[data-testid=display-only] >', {
				index: 6,
				label: collectionCiltaAssertion.patientVerification.monthOfBirth
			})
			// Month of Birth Value
			translationHelpers.assertSingleField('[data-testid=display-only] >> :nth(3)', inputs.monthOfBirth)
			// Year of Birth
			translationHelpers.assertBlockLabel('[data-testid=display-only] >', {
				index: 8,
				label: collectionCiltaAssertion.patientVerification.yearOfBirth
			})

			translationHelpers.assertBlockLabel('[data-testid=display-only] >', {
				index: 10,
				label: collectionCiltaAssertion.patientVerification.medicalRecordNumber
			})

			translationHelpers.assertBlockLabel('[data-testid=display-only] >', {
				index: 12,
				label: collectionCiltaAssertion.patientVerification.orderId
			})

			translationHelpers.assertSingleField('[data-testid=section-heading-description]', collectionCiltaAssertion.patientVerification.verifyPatientNameAndBirth)

			// signature
			translationHelpers.assertSingleField('[data-testid=approver-prompt]', collectionCiltaAssertion.patientVerification.approver)

			translationHelpers.assertSingleField('[data-testid=verifier-prompt]', collectionCiltaAssertion.patientVerification.verifier)

		}
		common.doubleSignature(inputs.verifier[0]);
		// common.ClickPrimaryActionButton();
		actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
			apiAliases: ['@patchProcedureSteps', '@getProcedures']
		})

	},

	// _emea_cc, _emea_cc_qr, _emea_ccdc_qr, _emea_ccdc
	patientVerificationEmeaCc: (therapy, scope) => {
		cy.log('Patient Verification')
		// translations
		if (Cypress.env('runWithTranslations')) {
			if (!therapy.unique_id == '_emea_lcdc_qr')
				collectionCiltaHeaderTranslations(therapy);

			collectionCiltaPhaseTranslations(therapy);
			actionButtonsTranslectionCheck();

			// title
			translationHelpers.assertPageTitles('[data-test-id="collection_patient_identity"]', 'h1', collectionCiltaAssertion.patientVerification.title)

			// subtitle
			translationHelpers.assertBlockLabel('[data-test-id="ordering-summary-block-block"] >>', {
				index: 0,
				label: collectionCiltaAssertion.patientVerification.patientInformation
			})

			translationHelpers.assertSingleField('[data-testid=section-heading-title]', collectionCiltaAssertion.patientVerification.verifyPatientIdentity)

			// labels
			// Firstname
			translationHelpers.assertBlockLabel('[data-testid=display-only] >', {
				index: 0,
				label: collectionCiltaAssertion.patientVerification.firstName
			})
			// First name Value
			translationHelpers.assertSingleField('[data-testid=display-only] >> :nth(0)', scope.patientInformation.firstName)
			// Last Name
			translationHelpers.assertBlockLabel('[data-testid=display-only] >', {
				index: 2,
				label: collectionCiltaAssertion.patientVerification.lastName
			})
			// Last name Value
			translationHelpers.assertSingleField('[data-testid=display-only] >> :nth(1)', scope.patientInformation.lastName)
			// Date of Birth
			translationHelpers.assertBlockLabel('[data-testid=display-only] >', {
				index: 4,
				label: collectionCiltaAssertion.patientVerification.dayOfBirth
			})
			// Date of Birth Value
			translationHelpers.assertSingleField('[data-testid=display-only] >> :nth(2)', inputs.dayOfBirth)
			// Month of Birth
			translationHelpers.assertBlockLabel('[data-testid=display-only] >', {
				index: 6,
				label: collectionCiltaAssertion.patientVerification.monthOfBirth
			})
			// Month of Birth Value
			translationHelpers.assertSingleField('[data-testid=display-only] >> :nth(3)', inputs.monthOfBirth)
			// Year of Birth
			translationHelpers.assertBlockLabel('[data-testid=display-only] >', {
				index: 8,
				label: collectionCiltaAssertion.patientVerification.yearOfBirth
			})

			translationHelpers.assertBlockLabel('[data-testid=display-only] >', {
				index: 10,
				label: collectionCiltaAssertion.patientVerification.orderId
			})

			translationHelpers.assertBlockLabel('[data-testid=display-only] >', {
				index: 12,
				label: collectionCiltaAssertion.patientVerification.patientId
			})

			translationHelpers.assertSingleField('[data-testid=section-heading-description]', collectionCiltaAssertion.patientVerification.verifyPatientNameAndBirth)

			// signature
			translationHelpers.assertSingleField('[data-testid=approver-prompt]', collectionCiltaAssertion.patientVerification.approver)

			translationHelpers.assertSingleField('[data-testid=verifier-prompt]', collectionCiltaAssertion.patientVerification.verifier)

		}
		common.doubleSignature(inputs.verifier[0]);
		// common.ClickPrimaryActionButton();
		actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
			apiAliases: ['@patchProcedureSteps', '@getProcedures']
		})

	},

	// emea_lc_qr,  emea_lc, _emea_lcdc, _emea_lcdc_qr
	patientVerificationEmeaLc: (therapy, scope) => {
		cy.log('Patient Verification')
		// translations
		if (Cypress.env('runWithTranslations')) {
			if (!therapy.unique_id == '_emea_lcdc_qr')
				collectionCiltaHeaderTranslations(therapy);

			collectionCiltaPhaseTranslations(therapy);
			actionButtonsTranslectionCheck();

			// title
			translationHelpers.assertPageTitles('[data-test-id="collection_patient_identity"]', 'h1', collectionCiltaAssertion.patientVerification.title)

			// subtitle
			translationHelpers.assertBlockLabel('[data-test-id="ordering-summary-block-block"] >>', {
				index: 0,
				label: collectionCiltaAssertion.patientVerification.patientInformation
			})

			translationHelpers.assertSingleField('[data-testid=section-heading-title]', collectionCiltaAssertion.patientVerification.verifyPatientIdentity)

			// labels
			// Firstname
			translationHelpers.assertBlockLabel('[data-testid=display-only] >', {
				index: 0,
				label: collectionCiltaAssertion.patientVerification.firstName
			})
			// First name Value
			translationHelpers.assertSingleField('[data-testid=display-only] >> :nth(0)', scope.patientInformation.firstName)
			// Last Name
			translationHelpers.assertBlockLabel('[data-testid=display-only] >', {
				index: 2,
				label: collectionCiltaAssertion.patientVerification.lastName
			})
			// Last name Value
			translationHelpers.assertSingleField('[data-testid=display-only] >> :nth(1)', scope.patientInformation.lastName)
			// Date of Birth
			translationHelpers.assertBlockLabel('[data-testid=display-only] >', {
				index: 4,
				label: collectionCiltaAssertion.patientVerification.dayOfBirth
			})
			// Date of Birth Value
			translationHelpers.assertSingleField('[data-testid=display-only] >> :nth(2)', inputs.dayOfBirth)
			// Month of Birth
			translationHelpers.assertBlockLabel('[data-testid=display-only] >', {
				index: 6,
				label: collectionCiltaAssertion.patientVerification.monthOfBirth
			})
			// Month of Birth Value
			translationHelpers.assertSingleField('[data-testid=display-only] >> :nth(3)', inputs.monthOfBirth)
			// Year of Birth
			translationHelpers.assertBlockLabel('[data-testid=display-only] >', {
				index: 8,
				label: collectionCiltaAssertion.patientVerification.yearOfBirth
			})

			translationHelpers.assertBlockLabel('[data-testid=display-only] >', {
				index: 10,
				label: collectionCiltaAssertion.patientVerification.orderId
			})

			translationHelpers.assertSingleField('[data-testid=section-heading-description]', collectionCiltaAssertion.patientVerification.verifyPatientNameAndBirth)

			// signature
			translationHelpers.assertSingleField('[data-testid=approver-prompt]', collectionCiltaAssertion.patientVerification.approver)

			translationHelpers.assertSingleField('[data-testid=verifier-prompt]', collectionCiltaAssertion.patientVerification.verifier)

		}
		common.doubleSignature(inputs.verifier[0]);
		// common.ClickPrimaryActionButton();
		actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
			apiAliases: ['@patchProcedureSteps', '@getProcedures']
		})

	},

	collectionBagIdentificationCilta: () => {
		cy.log('Bag Identification')
		// translations
		if (Cypress.env('runWithTranslations')) {

			// collectionCiltaHeaderTranslations();
			// collectionCiltaPhaseTranslations();
			// actionButtonsTranslectionCheck();

			// title
			translationHelpers.assertPageTitles('[data-test-id="collection_bag_1_identification"]', 'h1', collectionCiltaAssertion.collectionBagIdentification.title)

			// subtitle
			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 0,
				label: collectionCiltaAssertion.collectionBagIdentification.identifyBag
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 1,
				label: collectionCiltaAssertion.collectionBagIdentification.preCollectionInformation
			})

			// labels

			translationHelpers.assertBlockLabel('[data-test-id="enter-and-confirm-block"]>>', {
				index: 0,
				label: collectionCiltaAssertion.collectionBagIdentification.scanOrEnterDinSec
			})

			translationHelpers.assertBlockLabel('[data-test-id="enter-and-confirm-block"]>>>>>', {
				index: 0,
				label: collectionCiltaAssertion.collectionBagIdentification.enter
			})

			translationHelpers.assertBlockLabel('[data-test-id="enter-and-confirm-block"]>>>>>', {
				index: 2,
				label: collectionCiltaAssertion.collectionBagIdentification.confirm
			})

			translationHelpers.assertBlockLabel('[data-test-id="collection-session-block-block"]>>>>>>', {
				index: 0,
				label: collectionCiltaAssertion.collectionBagIdentification.dateOfApheresis
			})

		}

		cy.get('[data-test-id="collection_bag_1_identification"] h1').should('contain', assertions.collectionBagIdentification);
		cy.get('[data-test-id="enter-and-confirm-block"] div > div').first().should('contain', assertions.euUDNDescription);
		cy.get('[data-testid=primary-button-action]').should('be.disabled');
		cy.get('[data-test-id="collection_bag_1_identification"] h3').should('contain', assertions.collectionBagSectionHeader);
		cy.get('[data-testid="input-enter-day_1_bag_1_udn"]').first().clear().type(inputs.day1Bag1Udn);
		cy.get('[data-testid="input-confirm-day_1_bag_1_udn"]').first().clear().type(inputs.confirmDay1Bag1Udn);
		cy.get("body").then($body => {
			if ($body.find('[id="#/properties/custom_fields/properties/pre_collection_label_applied"]').length > 0) { // evaluates as true if button exists at all
				cy.get('[id="#/properties/custom_fields/properties/pre_collection_label_applied"]').then($header => {
					if ($header.is(':visible')) {
						cy.get('[id="#/properties/custom_fields/properties/pre_collection_label_applied"]').click();
					}
				});
			}
		});
		cy.get('[data-testid="recordButton-day_1_bag_1_udn"]').should('contain', assertions.record).click();
		cy.wait('@createLabelScanValue');
		cy.get('[data-testid="green-checkmark-day_1_bag_1_udn"]').should('be.visible');
		cy.get('[data-testid="primary-button-action"]').contains(assertions.nextLabel);
		cy.get('input[id="#/properties/apheresis_date-input"]').type(inputs.apheresisDate).blur();
		// common.ClickPrimaryActionButton();
		actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
			apiAliases: ['@patchProcedureSteps', '@getProcedures']
		})

	},

	collectionBagIdentificationEmeaCc: () => {
		cy.log('Bag Identification')
		// translations
		if (Cypress.env('runWithTranslations')) {

			// collectionCiltaHeaderTranslations();
			// collectionCiltaPhaseTranslations();
			// actionButtonsTranslectionCheck();

			// title
			translationHelpers.assertPageTitles('[data-test-id="collection_bag_1_identification"]', 'h1', collectionCiltaAssertion.collectionBagIdentification.title)

			// subtitle
			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 0,
				label: collectionCiltaAssertion.collectionBagIdentification.identifyBag
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 1,
				label: collectionCiltaAssertion.collectionBagIdentification.preCollectionInformation
			})

			// labels

			translationHelpers.assertBlockLabel('[data-test-id="enter-and-confirm-block"]>>', {
				index: 0,
				label: collectionCiltaAssertion.collectionBagIdentification.scanOrEnterDinSec
			})

			translationHelpers.assertBlockLabel('[data-test-id="enter-and-confirm-block"]>>>>>', {
				index: 0,
				label: collectionCiltaAssertion.collectionBagIdentification.enter
			})

			translationHelpers.assertBlockLabel('[data-test-id="enter-and-confirm-block"]>>>>>', {
				index: 2,
				label: collectionCiltaAssertion.collectionBagIdentification.confirm
			})

			translationHelpers.assertBlockLabel('[data-test-id="collection-session-block-block"]>>>>>>', {
				index: 0,
				label: collectionCiltaAssertion.collectionBagIdentification.dateOfApheresis
			})

		}

		cy.get('[data-test-id="collection_bag_1_identification"] h1').should('contain', assertions.collectionBagIdentification);
		cy.get('[data-test-id="enter-and-confirm-block"] div > div').first().should('contain', assertions.euUDNDescription);
		cy.get('[data-testid=primary-button-action]').should('be.disabled');
		cy.get('[data-test-id="collection_bag_1_identification"] h3').should('contain', assertions.collectionBagSectionHeader);
		cy.get('[data-testid="input-enter-day_1_bag_1_udn"]').first().clear().type(inputs.day1Bag1Udn);
		cy.get('[data-testid="input-confirm-day_1_bag_1_udn"]').first().clear().type(inputs.confirmDay1Bag1Udn);
		cy.get("body").then($body => {
			if ($body.find('[id="#/properties/pre_collection_label_applied"]').length > 0) { // evaluates as true if button exists at all
				cy.get('[id="#/properties/pre_collection_label_applied"]').then($header => {
					if ($header.is(':visible')) {
						cy.get('[id="#/properties/pre_collection_label_applied"]').click();
					}
				});
			}
		});
		cy.get('[data-testid="recordButton-day_1_bag_1_udn"]').should('contain', assertions.record).click();
		cy.wait('@createLabelScanValue');
		cy.get('[data-testid="green-checkmark-day_1_bag_1_udn"]').should('be.visible');
		cy.get('[data-testid="primary-button-action"]').contains(assertions.nextLabel);
		cy.get('input[id="#/properties/apheresis_date-input"]').type(inputs.apheresisDate).blur();
		// common.ClickPrimaryActionButton();
		actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
			apiAliases: ['@patchProcedureSteps', '@getProcedures']
		})

	},

	// emea_lc_qr,  emea_lc, _emea_lcdc, _emea_lcdc_qr
	collectionBagIdentificationEmeaLc: (therapy) => {
		cy.log('Bag Identification')
		// translations
		if (Cypress.env('runWithTranslations')) { // title
			translationHelpers.assertPageTitles('[data-test-id="collection_bag_1_identification"]', 'h1', collectionCiltaAssertion.collectionBagIdentification.title)

			// subtitle
			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 0,
				label: collectionCiltaAssertion.collectionBagIdentification.identifyBag
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 1,
				label: collectionCiltaAssertion.collectionBagIdentification.preCollectionInformation
			})

			// labels
			if (therapy.unique_id == '_emea_lc' || therapy.unique_id == '_emea_lcdc' || therapy.unique_id == '_emea_lcdc_qr') {
				translationHelpers.assertBlockLabel('[data-test-id="enter-and-confirm-block"]>>', {
					index: 0,
					label: collectionCiltaAssertion.collectionBagIdentification.scanOrEnterDinSec
				})
			} else {
				translationHelpers.assertBlockLabel('[data-test-id="enter-and-confirm-block"]>>', {
					index: 0,
					label: collectionCiltaAssertion.collectionBagIdentification.scanOrEnterDinSec
				})
			}

			translationHelpers.assertBlockLabel('[data-test-id="enter-and-confirm-block"]>>>>>', {
				index: 0,
				label: collectionCiltaAssertion.collectionBagIdentification.enter
			})

			translationHelpers.assertBlockLabel('[data-test-id="enter-and-confirm-block"]>>>>>', {
				index: 2,
				label: collectionCiltaAssertion.collectionBagIdentification.confirm
			})

			translationHelpers.assertBlockLabel('[data-test-id="collection-session-block-block"]>>>>>>', {
				index: 0,
				label: collectionCiltaAssertion.collectionBagIdentification.dateOfApheresis
			})

		}

		cy.get('[data-test-id="collection_bag_1_identification"] h1').should('contain', assertions.collectionBagIdentification);
		cy.get('[data-test-id="enter-and-confirm-block"] div > div').first().should('contain', assertions.euUDNDescription);
		cy.get('[data-testid=primary-button-action]').should('be.disabled');
		cy.get('[data-test-id="collection_bag_1_identification"] h3').should('contain', assertions.collectionBagSectionHeader);
		cy.get('[data-testid="input-enter-day_1_bag_1_udn"]').first().clear().type(inputs.day1Bag1Udn);
		cy.get('[data-testid="input-confirm-day_1_bag_1_udn"]').first().clear().type(inputs.confirmDay1Bag1Udn);
		cy.get("body").then($body => {
			if ($body.find('[id="#/properties/pre_collection_label_applied"]').length > 0) { // evaluates as true if button exists at all
				cy.get('[id="#/properties/pre_collection_label_applied"]').then($header => {
					if ($header.is(':visible')) {
						cy.get('[id="#/properties/pre_collection_label_applied"]').click();
					}
				});
			}
		});
		cy.get('[data-testid="recordButton-day_1_bag_1_udn"]').should('contain', assertions.record).click();
		cy.wait('@createLabelScanValue');
		cy.get('[data-testid="green-checkmark-day_1_bag_1_udn"]').should('be.visible');
		cy.get('[data-testid="primary-button-action"]').contains(assertions.nextLabel);
		cy.get('input[id="#/properties/apheresis_date-input"]').type(inputs.apheresisDate).blur();
		// common.ClickPrimaryActionButton();
		actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
			apiAliases: ['@patchProcedureSteps', '@getProcedures']
		})

	},

	// Cita and EmeaLc
	collectionInformationPrinting: () => {
		cy.log('Information Printing')
		if (Cypress.env('runWithTranslations')) {

			// collectionCiltaHeaderTranslations();
			// collectionCiltaPhaseTranslations();
			actionButtonsTranslectionCheck();

			// title
			translationHelpers.assertPageTitles('[data-test-id="collection_label_printing"]', 'h1', collectionCiltaAssertion.collectionInformationPrinting.title)

			// subtitle
			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 0,
				label: collectionCiltaAssertion.collectionInformationPrinting.printPackingInsert
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 2,
				label: collectionCiltaAssertion.collectionInformationPrinting.keepPrintedPacking
			})

			// labels
			translationHelpers.assertBlockLabel('[data-testid=print-block-container] >', {
				index: 0,
				label: collectionCiltaAssertion.collectionInformationPrinting.printPackingInsertLabel
			})

			translationHelpers.assertBlockLabel('[data-testid=print-counter-block] >', {
				index: 0,
				label: collectionCiltaAssertion.collectionInformationPrinting.totalPrinted
			})

			translationHelpers.assertSingleField('[data-testid="txt-field-layout-Confirm files are printed successfully"]', collectionCiltaAssertion.collectionInformationPrinting.confirmFiles)

			translationHelpers.assertSingleField('[data-testid=section-heading-description]', collectionCiltaAssertion.collectionInformationPrinting.ensurePacking)


		}
		cy.get('[id="#/properties/data/properties/is_confirmed"]').click();
		common.ClickPrimaryActionButton();
		// signature
		translationHelpers.assertSingleField('[data-testid=approver-prompt]', collectionCiltaAssertion.collectionInformationPrinting.approver)
		common.singleSignature();
		common.ClickPrimaryActionButton();
	},

	collectionInformationPrintingEmeaCc: () => {
		if (Cypress.env('runWithTranslations')) {

			// collectionCiltaHeaderTranslations();
			// collectionCiltaPhaseTranslations();
			actionButtonsTranslectionCheck();

			// title
			translationHelpers.assertPageTitles('[data-test-id="collection_label_printing"]', 'h1', collectionCiltaAssertion.collectionInformationPrinting.title)

			// subtitle
			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 0,
				label: collectionCiltaAssertion.collectionInformationPrinting.printPackingInsert
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 2,
				label: collectionCiltaAssertion.collectionInformationPrinting.keepPrintedPacking
			})

			// labels
			translationHelpers.assertBlockLabel('[data-testid=print-block-container] >', {
				index: 0,
				label: collectionCiltaAssertion.collectionInformationPrinting.printPackingInsertLabel
			})

			translationHelpers.assertBlockLabel('[data-testid=print-counter-block] >', {
				index: 0,
				label: collectionCiltaAssertion.collectionInformationPrinting.totalLabelPrinted
			})

			translationHelpers.assertSingleField('[data-testid="txt-field-layout-Confirm files are printed successfully"]', collectionCiltaAssertion.collectionInformationPrinting.confirmFiles)

			translationHelpers.assertSingleField('[data-testid=section-heading-description]', collectionCiltaAssertion.collectionInformationPrinting.ensurePacking)

		}
		cy.get('[id="#/properties/data/properties/is_confirmed"]').click();
		common.ClickPrimaryActionButton();
		// signature
		translationHelpers.assertSingleField('[data-testid=approver-prompt]', collectionCiltaAssertion.collectionInformationPrinting.approver)
		common.singleSignature();
		common.ClickPrimaryActionButton();
	},

	collectionProcedureInformation: () => { // translations
		if (Cypress.env('runWithTranslations')) { // title
			translationHelpers.assertPageTitles('[data-test-id="collection_procedure_details"]', 'h1', collectionCiltaAssertion.collectionProcedureInformation.title)

			// subtitle
			translationHelpers.assertSingleField('[data-testid=section-heading-title]', collectionCiltaAssertion.collectionProcedureInformation.patientData)

			// label
			translationHelpers.assertBlockLabel('[data-test-id="collection-session-block-block"]>>>>>>', {
				index: 0,
				label: collectionCiltaAssertion.collectionProcedureInformation.patientWeight
			})

			translationHelpers.assertBlockLabel('[data-test-id="specimen-block-block"]>>>>>>>', {
				index: 0,
				label: collectionCiltaAssertion.collectionProcedureInformation.enterEndTime
			})

			translationHelpers.assertSingleField('[data-testid=masked-input-label]', collectionCiltaAssertion.collectionProcedureInformation.endTime)

			actionButtonsHelper.checkActionButtonLabel(actionButtonsHelper.actionButtonKeys.PRIMARY, actionButtonsHelper.translationKeys.NEXT)
		}

		cy.get('[id="#/properties/patient_weight-input"]').type(inputs.patientWeight);
		cy.get('[id="collection_end_time"]').type(inputs.collectionEndTime);
		// common.ClickPrimaryActionButton();
		actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
			apiAliases: ['@patchProcedureSteps', '@getProcedures']
		})
	},

	collectionSummaryCilta: (scope) => { // translations
		if (Cypress.env('runWithTranslations')) { // title
			translationHelpers.assertPageTitles('[data-test-id="collection_collection_summary"]', 'h1', collectionCiltaAssertion.collectionSummary.title)

			// subtitle
			translationHelpers.assertBlockLabel('[data-test-id="collection-summary-block"] >>', {
				index: 0,
				label: collectionCiltaAssertion.collectionSummary.patientData
			})

			translationHelpers.assertBlockLabel('[data-test-id="collection-summary-block"] >>', {
				index: 3,
				label: collectionCiltaAssertion.collectionSummary.procedureDetails
			})
			translationHelpers.assertBlockLabel('[data-test-id="collection-summary-block"] >>', {
				index: 6,
				label: collectionCiltaAssertion.collectionSummary.bagInformation
			})

			// labels
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'div', collectionCiltaAssertion.collectionSummary.coi)

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'span', `${scope.coi
				}`)

			translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'div', collectionCiltaAssertion.collectionSummary.siteName)
			translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'span', inputs.siteName)

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'div', collectionCiltaAssertion.collectionSummary.dayOfBirth)
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'span', inputs.dayOfBirth)

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'div', collectionCiltaAssertion.collectionSummary.monthOfBirth)
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'span', inputs.monthOfBirth)

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'div', collectionCiltaAssertion.collectionSummary.yearOfBirth)
			// value
			// translationHelpers.assertBlockLabel('[data-testid="display-only"]',{index: 9,label: inputs.yearOfBirth})

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 5, 'div', collectionCiltaAssertion.collectionSummary.dateOfApheresis)
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 5, 'span', inputs.dateOfApheresis)
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 6, 'div', collectionCiltaAssertion.collectionSummary.patientWeight)

			// value
			// translationHelpers.assertBlockLabel('[data-testid="display-only"]',{index: 13,label: inputs.patientWeight})

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 7, 'div', collectionCiltaAssertion.collectionSummary.bagDinSec)
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 7, 'span', inputs.din)
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 8, 'div', collectionCiltaAssertion.collectionSummary.endTime)

			translationHelpers.assertSingleField('[data-testid=section-heading-description]', collectionCiltaAssertion.collectionSummary.note)

			// signature
			translationHelpers.assertSingleField('[data-testid=approver-prompt]', collectionCiltaAssertion.collectionSummary.confirmer)

			translationHelpers.assertSingleField('[data-testid=verifier-prompt]', collectionCiltaAssertion.collectionSummary.verifier)

			actionButtonsHelper.checkActionButtonLabel(actionButtonsHelper.actionButtonKeys.PRIMARY, actionButtonsHelper.translationKeys.NEXT)

		}

		cy.get('[data-test-id="collection_collection_summary"] h1').should('contain', assertions.collectionSummary);
		common.doubleSignature(inputs.verifier[0]);
		// common.ClickPrimaryActionButton();
		actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
			apiAliases: ['@patchProcedureSteps', '@getProcedures']
		})
	},

	collectionSummaryEmeaCc: (scope) => { // translations
		if (Cypress.env('runWithTranslations')) { // title
			translationHelpers.assertPageTitles('[data-test-id="collection_collection_summary"]', 'h1', collectionCiltaAssertion.collectionSummary.title)

			// subtitle
			translationHelpers.assertBlockLabel('[data-test-id="collection-summary-block"] >>', {
				index: 0,
				label: collectionCiltaAssertion.collectionSummary.patientData
			})

			translationHelpers.assertBlockLabel('[data-test-id="collection-summary-block"] >>', {
				index: 4,
				label: collectionCiltaAssertion.collectionSummary.procedureDetails
			})
			translationHelpers.assertBlockLabel('[data-test-id="collection-summary-block"] >>', {
				index: 7,
				label: collectionCiltaAssertion.collectionSummary.bagInformation
			})

			// labels
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'div', collectionCiltaAssertion.collectionSummary.coi)

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'span', `${scope.coi
				}`)

			translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'div', collectionCiltaAssertion.collectionSummary.siteName)
			translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'span', inputs.siteName)

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'div', collectionCiltaAssertion.collectionSummary.dayOfBirth)
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'span', inputs.dayOfBirth)

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'div', collectionCiltaAssertion.collectionSummary.monthOfBirth)
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'span', inputs.monthOfBirth)

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'div', collectionCiltaAssertion.collectionSummary.yearOfBirth)
			// value

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 5, 'div', collectionCiltaAssertion.collectionSummary.orderId)
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 5, 'span', scope.patientInformation.patientId)
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 6, 'div', collectionCiltaAssertion.collectionSummary.patientId)

			// value

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 7, 'div', collectionCiltaAssertion.collectionSummary.dateOfApheresis)
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 8, 'div', collectionCiltaAssertion.collectionSummary.patientWeight)

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 9, 'div', collectionCiltaAssertion.collectionSummary.bagDinSec)


			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 10, 'div', collectionCiltaAssertion.collectionSummary.endTime)

			translationHelpers.assertSingleField('[data-testid=section-heading-description]', collectionCiltaAssertion.collectionSummary.note)

			// signature
			translationHelpers.assertSingleField('[data-testid=approver-prompt]', collectionCiltaAssertion.collectionSummary.confirmer)

			translationHelpers.assertSingleField('[data-testid=verifier-prompt]', collectionCiltaAssertion.collectionSummary.verifier)

			actionButtonsHelper.checkActionButtonLabel(actionButtonsHelper.actionButtonKeys.PRIMARY, actionButtonsHelper.translationKeys.NEXT)

		}

		cy.get('[data-test-id="collection_collection_summary"] h1').should('contain', assertions.collectionSummary);
		common.doubleSignature(inputs.verifier[0]);
		// common.ClickPrimaryActionButton();
		actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
			apiAliases: ['@patchProcedureSteps', '@getProcedures']
		})
	},

	collectionSummaryEmeaLc: (scope, therapy) => { // translations
		if (Cypress.env('runWithTranslations')) {

			// collectionCiltaHeaderTranslations();
			// collectionCiltaPhaseTranslations();


			// title
			translationHelpers.assertPageTitles('[data-test-id="collection_collection_summary"]', 'h1', collectionCiltaAssertion.collectionSummary.title)

			// subtitle
			translationHelpers.assertBlockLabel('[data-test-id="collection-summary-block"] >>', {
				index: 0,
				label: collectionCiltaAssertion.collectionSummary.patientData
			})


			translationHelpers.assertBlockLabel('[data-test-id="collection-summary-block"] >>', {
				index: 4,
				label: collectionCiltaAssertion.collectionSummary.procedureDetails
			})
			translationHelpers.assertBlockLabel('[data-test-id="collection-summary-block"] >>', {
				index: 7,
				label: collectionCiltaAssertion.collectionSummary.bagInformation
			})

			// labels
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'div', collectionCiltaAssertion.collectionSummary.coi)

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'span', `${scope.coi
				}`)

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'div', collectionCiltaAssertion.collectionSummary.collectionSiteName)
			// if(!['_emea_lc','_emea_lcdc'].includes(therapy.unique_id)){
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'span', inputs.collectionSiteName)
			// }

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'div', collectionCiltaAssertion.collectionSummary.dayOfBirth)
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'span', inputs.dayOfBirth)

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'div', collectionCiltaAssertion.collectionSummary.monthOfBirth)
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'span', inputs.monthOfBirth)

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'div', collectionCiltaAssertion.collectionSummary.yearOfBirth)

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 5, 'div', collectionCiltaAssertion.collectionSummary.orderId)
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 5, 'span', scope.patientInformation.patientId)
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 6, 'div', collectionCiltaAssertion.collectionSummary.patientId)
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 7, 'div', collectionCiltaAssertion.collectionSummary.dateOfApheresis)
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 7, 'span', inputs.dateOfApheresis)
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 8, 'div', collectionCiltaAssertion.collectionSummary.patientWeight)

			translationHelpers.assertSingleField('[data-testid=section-heading-description]', collectionCiltaAssertion.collectionSummary.note)

			// signature
			translationHelpers.assertSingleField('[data-testid=approver-prompt]', collectionCiltaAssertion.collectionSummary.confirmer)

			translationHelpers.assertSingleField('[data-testid=verifier-prompt]', collectionCiltaAssertion.collectionSummary.verifier)

			actionButtonsHelper.checkActionButtonLabel(actionButtonsHelper.actionButtonKeys.PRIMARY, actionButtonsHelper.translationKeys.NEXT)

		}

		cy.get('[data-test-id="collection_collection_summary"] h1').should('contain', assertions.collectionSummary);
		common.doubleSignature(inputs.verifier[0]);
		// common.ClickPrimaryActionButton();
		actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
			apiAliases: ['@patchProcedureSteps', '@getProcedures']
		})
	},

	// LCLP-CILTA, EmeaLc
	cryopreservationLabels: () => { // translations
		if (Cypress.env('runWithTranslations')) {

			// collectionCiltaHeaderTranslations();
			// collectionCiltaPhaseTranslations();
			actionButtonsTranslectionCheck();

			// title
			translationHelpers.assertPageTitles('[data-test-id="collection_cryopreservation_bags"]', 'h1', collectionCiltaAssertion.cryopreservationLabels.title)

			// subtitle
			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 0,
				label: collectionCiltaAssertion.cryopreservationLabels.identifyThePatient
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 1,
				label: collectionCiltaAssertion.cryopreservationLabels.confirmNumberBag
			})

			// labels
			translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]', collectionCiltaAssertion.cryopreservationLabels.scanOrEnterDinSec)

			translationHelpers.assertSingleField('[data-testid="txt-field-layout-Number of bags formulated for cryopreservation?"]', collectionCiltaAssertion.cryopreservationLabels.numberOfBagFormulated)

		}
		cy.get('[data-testid="day-1-bag-1-udn-input-field"]').type(inputs.day1Bag1Udn);
		cy.get('[data-testid="day-1-bag-1-udn-action-trigger-button"]').click();
		cy.get('[id="#/properties/item_count-input"]').type(inputs.itemCount);
		// common.ClickPrimaryActionButton();
		actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
			apiAliases: ['@patchProcedureSteps', '@getProcedures']
		})
	},

	// LCLP Cilta and EmeaLc
	cryopreservationBagLabelsAndPackingInsert: (coi) => {
		if (Cypress.env('runWithTranslations')) {

			actionButtonsTranslectionCheck();

			// title
			translationHelpers.assertPageTitles('[data-test-id="collection_apply_labels"]', 'h1', collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.titleCryopreservationBagLabel)

			// subtitle
			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 0,
				label: collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.patientDetails
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 1,
				label: collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.applyBag1Labels
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 2,
				label: collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.applyBag2Labels
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 3,
				label: collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.applyBag3Labels
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 4,
				label: collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.applyBag4Labels
			})

			// labels
			translationHelpers.assertBlockLabel('[data-test-id="label-verification-step-row-block"]>>>', {
				index: 0,
				label: collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.dinIDSec
			})

			translationHelpers.assertSingleField('[data-testid=input-value]', inputs.din)

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter the Bag Identifier"]', {
				index: 0,
				label: collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.enterBagIdentifier1
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter the Bag Identifier"]', {
				index: 1,
				label: collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.enterBagIdentifier2
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter the Bag Identifier"]', {
				index: 2,
				label: collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.enterBagIdentifier3
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter the Bag Identifier"]', {
				index: 3,
				label: collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.enterBagIdentifier4
			})

			translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]', collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.scanEnterDinSecBag)

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter the DIN/SEC-DIS/Apheresis ID for Cryopreservation Cassette"]', {
				index: 0,
				label: collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.enterDinSecCassette1
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter the DIN/SEC-DIS/Apheresis ID for Cryopreservation Cassette"]', {
				index: 1,
				label: collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.enterDinSecCassette2
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter the DIN/SEC-DIS/Apheresis ID for Cryopreservation Cassette"]', {
				index: 2,
				label: collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.enterDinSecCassette3
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter the DIN/SEC-DIS/Apheresis ID for Cryopreservation Cassette"]', {
				index: 3,
				label: collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.enterDinSecCassette4
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter DIN/SEC-DIS/Apheresis ID for the Cryopreservation Bag"]', {
				index: 0,
				label: collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.enterDinSecBag2
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter DIN/SEC-DIS/Apheresis ID for the Cryopreservation Bag"]', {
				index: 1,
				label: collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.enterDinSecBag3
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter DIN/SEC-DIS/Apheresis ID for the Cryopreservation Bag"]', {
				index: 2,
				label: collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.enterDinSecBag4
			})

			translationHelpers.assertSingleField('[data-testid="txt-field-layout-Verify that the DIN/SEC-DIS/Apheresis ID match for the bag(s) and cassette(s) and all labels are attached."]', collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.verifyDinSec)

		}
		cy.get('[data-testid="#/properties/shipping_checklist/properties/collection_bag_label_1-input"]').type(`${coi}-PRC-01`);
		cy.get('[data-testid="day-1-bag-1-udn-input-field"]').eq(0).type(inputs.day1Bag1Udn)
		cy.get('[data-testid="day-1-bag-1-udn-action-trigger-button"]').eq(0).click()
		cy.wait('@labelVerifications');
		cy.get('[data-testid="#/properties/shipping_checklist/properties/collection_cassete_label_1-input"]').type(inputs.day1Bag1Udn)
		// cy.wait('@labelVerifications');
		cy.get('[id="#/properties/data/properties/is_confirmed"]').click()
		// common.ClickPrimaryActionButton();
		actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
			apiAliases: ['@patchProcedureSteps', '@getProcedures']
		})
		// signature
		translationHelpers.assertSingleField('[data-testid=approver-prompt]', collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.confirmer)

		translationHelpers.assertSingleField('[data-testid=verifier-prompt]', collectionCiltaAssertion.cryopreservationBagLabelsAndPackingInsert.verifier)

	},

	// LCLP Cilta and EmeaLc
	cryopreservationSummary: (scope) => { // translations
		if (Cypress.env('runWithTranslations')) {

			actionButtonsTranslectionCheck();

			// title
			translationHelpers.assertPageTitles('[data-test-id="collection_cryopreservation_summary"]', 'h1', collectionCiltaAssertion.cryopreservationSummary.cryopreservationSummaryTitle)

			// subtitle
			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 0,
				label: collectionCiltaAssertion.cryopreservationSummary.procedureDetails
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 1,
				label: collectionCiltaAssertion.cryopreservationSummary.verifyBag1
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 2,
				label: collectionCiltaAssertion.cryopreservationSummary.verifyBag2
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 3,
				label: collectionCiltaAssertion.cryopreservationSummary.verifyBag3
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 4,
				label: collectionCiltaAssertion.cryopreservationSummary.verifyBag4
			})

			// labels
			translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'div', collectionCiltaAssertion.cryopreservationSummary.product)
			translationHelpers.assertSectionChildElement('[data-testid=display-only]', 0, 'span', inputs.product)

			translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'div', collectionCiltaAssertion.cryopreservationSummary.siteName)
			translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'span', inputs.collectionSiteName)

			translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'div', collectionCiltaAssertion.cryopreservationSummary.orderId)
			translationHelpers.assertSectionChildElement('[data-testid=display-only]', 2, 'span', `${scope.patientInformation.patientId
				}`)

			translationHelpers.assertSectionChildElement('[data-testid=display-only]', 4, 'div', collectionCiltaAssertion.cryopreservationSummary.dinSec)
			translationHelpers.assertSectionChildElement('[data-testid=display-only]', 4, 'span', inputs.din)

			translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'div', collectionCiltaAssertion.cryopreservationSummary.coi)
			translationHelpers.assertSectionChildElement('[data-testid=display-only]', 3, 'span', `${scope.coi
				}`)

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Bag Identifier"]', {
				index: 0,
				label: collectionCiltaAssertion.cryopreservationSummary.bagIdentifier1
			})

			// value
			translationHelpers.assertSectionChildElement('[data-testid=display-only]', 5, 'span', `${scope.coi
				}-PRC-01`)

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Bag Identifier"]', {
				index: 1,
				label: collectionCiltaAssertion.cryopreservationSummary.bagIdentifier2
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Bag Identifier"]', {
				index: 2,
				label: collectionCiltaAssertion.cryopreservationSummary.bagIdentifier3
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Bag Identifier"]', {
				index: 3,
				label: collectionCiltaAssertion.cryopreservationSummary.bagIdentifier4
			})

			translationHelpers.assertSingleField('[data-test-id="label-verification-step-row-block"] >>> :nth()', collectionCiltaAssertion.cryopreservationSummary.scanEnterDinSec)

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter the DIN/SEC-DIS/Apheresis ID for Cryopreservation Cassette"]', {
				index: 0,
				label: collectionCiltaAssertion.cryopreservationSummary.enterDinSecCassette1
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter the DIN/SEC-DIS/Apheresis ID for Cryopreservation Cassette"]', {
				index: 1,
				label: collectionCiltaAssertion.cryopreservationSummary.enterDinSecCassette2
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter the DIN/SEC-DIS/Apheresis ID for Cryopreservation Cassette"]', {
				index: 2,
				label: collectionCiltaAssertion.cryopreservationSummary.enterDinSecCassette3
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter the DIN/SEC-DIS/Apheresis ID for Cryopreservation Cassette"]', {
				index: 3,
				label: collectionCiltaAssertion.cryopreservationSummary.enterDinSecCassette4
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter DIN/SEC-DIS/Apheresis ID for the Cryopreservation Bag"]', {
				index: 0,
				label: collectionCiltaAssertion.cryopreservationSummary.enterDinSecBag2
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter DIN/SEC-DIS/Apheresis ID for the Cryopreservation Bag"]', {
				index: 1,
				label: collectionCiltaAssertion.cryopreservationSummary.enterDinSecBag3
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter DIN/SEC-DIS/Apheresis ID for the Cryopreservation Bag"]', {
				index: 2,
				label: collectionCiltaAssertion.cryopreservationSummary.enterDinSecBag4
			})

			translationHelpers.assertSingleField('[data-testid="txt-field-layout-Verify that the DIN/SEC-DIS/Apheresis ID match for the bag(s) and cassette(s) and all labels are attached."]', collectionCiltaAssertion.cryopreservationSummary.verifyDinSec)

			// VALUE
			translationHelpers.assertSectionChildElement('[data-testid=display-only]', 6, 'span', inputs.din)

			// signature
			translationHelpers.assertSingleField('[data-testid=approver-prompt]', collectionCiltaAssertion.cryopreservationSummary.confirmer)

			translationHelpers.assertSingleField('[data-testid=verifier-prompt]', collectionCiltaAssertion.cryopreservationSummary.verifier)

		}

		cy.get('[data-testid="h1-header"]').should('contain', assertions.cryopreservationSummary);
		common.doubleSignature(inputs.verifier[1]);
		// common.ClickPrimaryActionButton();
		actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
			apiAliases: ['@patchProcedureSteps', '@getProcedures']
		})
	},

	// LCLP Cilta and EmeaLc
	cryopreservationTransferProductToShipper: (coi, therapy) => {
		cy.log('Transfer Product To Shipper')
		if (Cypress.env('runWithTranslations')) { // Title
			translationHelpers.assertPageTitles('[data-test-id="collection_transfer_product_to_shipper"]', 'h1', collectionCiltaAssertion.transferToShipper.title)

			// Subtitle
			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 2,
				label: collectionCiltaAssertion.transferToShipper.verifyBagLabel1
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 3,
				label: collectionCiltaAssertion.transferToShipper.verifyBagLabel2
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 4,
				label: collectionCiltaAssertion.transferToShipper.verifyBagLabel3
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 5,
				label: collectionCiltaAssertion.transferToShipper.verifyBagLabel4
			})

			// labels
			translationHelpers.assertSingleField('[data-testid=question-text-case_intact_1]', collectionCiltaAssertion.transferToShipper.questionCase)

			translationHelpers.assertSingleField('[data-testid=question-text-temp_out_of_range_1]', collectionCiltaAssertion.transferToShipper.questionTempOutofRange)

			translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]', collectionCiltaAssertion.transferToShipper.scanEnterCoi)

			translationHelpers.assertBlockLabel('[data-testid=section-heading-description]', {
				index: 0,
				label: collectionCiltaAssertion.transferToShipper.importantNote
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-description]', {
				index: 1,
				label: collectionCiltaAssertion.transferToShipper.headingDescription
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Bag Identifier"]', {
				index: 0,
				label: collectionCiltaAssertion.transferToShipper.bagIdentifier
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Bag Identifier"]', {
				index: 1,
				label: collectionCiltaAssertion.transferToShipper.bagIdentifier2
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Bag Identifier"]', {
				index: 2,
				label: collectionCiltaAssertion.transferToShipper.bagIdentifier3
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Bag Identifier"]', {
				index: 3,
				label: collectionCiltaAssertion.transferToShipper.bagIdentifier4
			})

			translationHelpers.assertSingleField('[data-test-id="label-verification-step-row-block"] >>> :nth(3)', collectionCiltaAssertion.transferToShipper.scanEnterDinSecBag)

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter the DIN/SEC-DIS/Apheresis ID for Cryopreservation Cassette"]', {
				index: 0,
				label: collectionCiltaAssertion.transferToShipper.enterDinSecCassette
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter the DIN/SEC-DIS/Apheresis ID for Cryopreservation Cassette"]', {
				index: 1,
				label: collectionCiltaAssertion.transferToShipper.enterDinSecCassette2
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter the DIN/SEC-DIS/Apheresis ID for Cryopreservation Cassette"]', {
				index: 2,
				label: collectionCiltaAssertion.transferToShipper.enterDinSecCassette3
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter the DIN/SEC-DIS/Apheresis ID for Cryopreservation Cassette"]', {
				index: 3,
				label: collectionCiltaAssertion.transferToShipper.enterDinSecCassette4
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter DIN/SEC-DIS/Apheresis ID for the Cryopreservation Bag"]', {
				index: 0,
				label: collectionCiltaAssertion.transferToShipper.enterDinSecBag2
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter DIN/SEC-DIS/Apheresis ID for the Cryopreservation Bag"]', {
				index: 1,
				label: collectionCiltaAssertion.transferToShipper.enterDinSecBag3
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter DIN/SEC-DIS/Apheresis ID for the Cryopreservation Bag"]', {
				index: 2,
				label: collectionCiltaAssertion.transferToShipper.enterDinSecBag4
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-description]', {
				index: 2,
				label: collectionCiltaAssertion.transferToShipper.assumedAllBagsShipped
			})

			translationHelpers.assertSingleField('[data-test-id="shipping-checklist-block-block"] >>>> :nth(8)', collectionCiltaAssertion.transferToShipper.enterbagIdentifierReason)

			translationHelpers.assertSingleField('[data-testid=question-text-ambient_temperature_exposure]', collectionCiltaAssertion.transferToShipper.confirmCryopreservedApheresis)

			translationHelpers.assertSingleField('[data-testid=question-text-red_wire_tamper_seal_labeled_rack]', collectionCiltaAssertion.transferToShipper.redWireTamperSealLabeled)

			translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-case_intact_1] >')
			translationHelpers.assertSingleField('[data-testid=pass-button-temp_out_of_range_1] >', collectionCiltaAssertion.transferToShipper.noToggle)
			translationHelpers.assertSingleField('[data-testid=fail-button-temp_out_of_range_1] >', collectionCiltaAssertion.transferToShipper.yesToggle)

			translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-ambient_temperature_exposure] >')
			translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-red_wire_tamper_seal_labeled_rack] >')
		}
		cy.get('[data-testid="h1-header"]').should('contain', assertions.transferProductToShipper);
		cy.get(`[data-testid=ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-us-lclp-cilta-input-field]`).type(coi)
		cy.get(`[data-testid="ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-us-lclp-cilta-action-trigger-button"]`).click()
		if (therapy === 'us-lclp-cilta') {
			cy.get(`[data-testid="#/properties/shipping_checklist/properties/bags_not_shipped_description-input"]`).type(coi)
		} else {
			cy.get('[data-testid="cassette-1-input"]').type(`${coi}-PRC-01`);
			cy.get('[data-testid="cassette-1-button"]').click();
			cy.wait('@labelVerifications');
			cy.get('[data-testid="ln-2-shipper-1-input"]').type(`${coi}`);
			cy.get('[data-testid="ln-2-shipper-1-button"]').click();
			cy.wait('@labelVerifications');
		}

		cy.get(`[data-testid="#/properties/shipping_checklist/properties/bags_not_shipped_description-input"]`).type(1)

		cy.get('[data-testid="pass-button-ambient_temperature_exposure"').click();
		cy.get('[data-testid="pass-button-case_intact_1"').click();
		cy.get('[data-testid="pass-button-temp_out_of_range_1"').click();
		cy.get('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"').click();
		common.ClickPrimaryActionButton();
	},

	// EmeaCc and CMLP, CCLP Cilta
	transferProductToShipper: (coi, bag_identifier, therapy = 'us-cclp-cilta', fromSite = 'apheresis-site', toSite = 'satellite-lab') => {
		cy.get(`[data-testid="ln-2-shipper-ship-bags-from-${fromSite}-to-${toSite}-${therapy}-input-field"]`).type(coi)
		cy.get(`[data-testid="ln-2-shipper-ship-bags-from-${fromSite}-to-${toSite}-${therapy}-action-trigger-button"]`).click()
		cy.get(`[data-testid="day-1-bag-1-udn-input-field"]`).type(bag_identifier)
		cy.get(`[data-testid="day-1-bag-1-udn-action-trigger-button"]`).click()
		common.ClickPrimaryActionButton();
	},

	// LCLP Cilta and EmeaLc
	cryopreservationTransferProductToShipperEmeaLc: (coi, therapy, fromSite, toSite) => {
		cy.log('Transfer Product To Shipper')
		if (Cypress.env('runWithTranslations')) { // Title
			translationHelpers.assertPageTitles('[data-test-id="collection_transfer_product_to_shipper"]', 'h1', collectionCiltaAssertion.transferToShipper.title)

			// Subtitle
			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 2,
				label: collectionCiltaAssertion.transferToShipper.verifyBagLabel1
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 3,
				label: collectionCiltaAssertion.transferToShipper.verifyBagLabel2
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 4,
				label: collectionCiltaAssertion.transferToShipper.verifyBagLabel3
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-title]', {
				index: 5,
				label: collectionCiltaAssertion.transferToShipper.verifyBagLabel4
			})

			// labels
			translationHelpers.assertSingleField('[data-testid=question-text-case_intact_1]', collectionCiltaAssertion.transferToShipper.questionCase)

			translationHelpers.assertSingleField('[data-testid=question-text-temp_out_of_range_1]', collectionCiltaAssertion.transferToShipper.questionTempOutofRange)

			translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]', collectionCiltaAssertion.transferToShipper.scanPackingInsert)

			translationHelpers.assertBlockLabel('[data-testid=section-heading-description]', {
				index: 0,
				label: collectionCiltaAssertion.transferToShipper.importantNote
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-description]', {
				index: 1,
				label: collectionCiltaAssertion.transferToShipper.headingDescription
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Bag Identifier"]', {
				index: 0,
				label: collectionCiltaAssertion.transferToShipper.bagIdentifier
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Bag Identifier"]', {
				index: 1,
				label: collectionCiltaAssertion.transferToShipper.bagIdentifier2
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Bag Identifier"]', {
				index: 2,
				label: collectionCiltaAssertion.transferToShipper.bagIdentifier3
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Bag Identifier"]', {
				index: 3,
				label: collectionCiltaAssertion.transferToShipper.bagIdentifier4
			})

			translationHelpers.assertSingleField('[data-test-id="label-verification-step-row-block"] >>> :nth(3)', collectionCiltaAssertion.transferToShipper.scanEnterDinSecBag)

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter the DIN/SEC-DIS/Apheresis ID for Cryopreservation Cassette"]', {
				index: 0,
				label: collectionCiltaAssertion.transferToShipper.enterDinSecCassette
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter the DIN/SEC-DIS/Apheresis ID for Cryopreservation Cassette"]', {
				index: 1,
				label: collectionCiltaAssertion.transferToShipper.enterDinSecCassette2
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter the DIN/SEC-DIS/Apheresis ID for Cryopreservation Cassette"]', {
				index: 2,
				label: collectionCiltaAssertion.transferToShipper.enterDinSecCassette3
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter the DIN/SEC-DIS/Apheresis ID for Cryopreservation Cassette"]', {
				index: 3,
				label: collectionCiltaAssertion.transferToShipper.enterDinSecCassette4
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter DIN/SEC-DIS/Apheresis ID for the Cryopreservation Bag"]', {
				index: 0,
				label: collectionCiltaAssertion.transferToShipper.enterDinSecBag2
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter DIN/SEC-DIS/Apheresis ID for the Cryopreservation Bag"]', {
				index: 1,
				label: collectionCiltaAssertion.transferToShipper.enterDinSecBag3
			})

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter DIN/SEC-DIS/Apheresis ID for the Cryopreservation Bag"]', {
				index: 2,
				label: collectionCiltaAssertion.transferToShipper.enterDinSecBag4
			})

			translationHelpers.assertBlockLabel('[data-testid=section-heading-description]', {
				index: 2,
				label: collectionCiltaAssertion.transferToShipper.assumedAllBagsShipped
			})

			translationHelpers.assertSingleField('[data-test-id="shipping-checklist-block-block"] >>>> :nth(8)', collectionCiltaAssertion.transferToShipper.enterbagIdentifierReason)

			translationHelpers.assertSingleField('[data-testid=question-text-ambient_temperature_exposure]', collectionCiltaAssertion.transferToShipper.confirmCryopreservedApheresis)

			translationHelpers.assertSingleField('[data-testid=question-text-red_wire_tamper_seal_labeled_rack]', collectionCiltaAssertion.transferToShipper.redWireTamperSealLabeled)

			translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-case_intact_1] >')
			translationHelpers.assertSingleField('[data-testid=pass-button-temp_out_of_range_1] >', collectionCiltaAssertion.transferToShipper.noToggle)
			translationHelpers.assertSingleField('[data-testid=fail-button-temp_out_of_range_1] >', collectionCiltaAssertion.transferToShipper.yesToggle)
			translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-ambient_temperature_exposure] >')
			translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-red_wire_tamper_seal_labeled_rack] >')
		}

		cy.get('[data-testid="h1-header"]').should('contain', assertions.transferProductToShipper);
		cy.get(`[data-testid="ln-2-shipper-ship-bags-${fromSite}-${toSite}-${therapy.leg_name
			}-input-field"]`).type(`${coi}`);
		cy.get(`[data-testid="ln-2-shipper-ship-bags-${fromSite}-${toSite}-${therapy.leg_name
			}-action-trigger-button"]`).click();
		cy.get(`[data-testid="#/properties/shipping_checklist/properties/bags_not_shipped_description-input"]`).type(1)
		inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"')
		inputHelpers.clicker('[data-testid="pass-button-case_intact_1"')
		inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"')
		inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"')
		actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
			apiAliases: ['@patchProcedureSteps', '@getProcedures']
		})
	},

	// LCLP Cilta and EmeaLc
	cryopreservationShipmentChecklist: scope => {
		if (Cypress.env('runWithTranslations')) {

			// collectionCiltaHeaderTranslations();
			// collectionCiltaPhaseTranslations();
			actionButtonsTranslectionCheck();

			// title
			translationHelpers.assertPageTitles('[data-test-id="collection_shipment_checklist"]', 'h1', collectionCiltaAssertion.shipmentChecklist.shipmentChecklistTitle)

			// subtitle
			if (!['_cmlp_cilta', '_cclp_cilta'].includes(therapy.unique_id)) {
				translationHelpers.assertSingleField('[data-testid=section-heading-title]', collectionCiltaAssertion.shipmentChecklist.documentShippingDetails)
			}

			// labels
			translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]', collectionCiltaAssertion.shipmentChecklist.enterAirWaybill)


			translationHelpers.assertSingleField('[data-test-id="label-verification-step-row-block"] >>> :nth(3)', collectionCiltaAssertion.shipmentChecklist.dateOfShipment)

			translationHelpers.assertSingleField('[data-test-id="shipping-checklist-block-block"] >>>>>> :nth(0)', collectionCiltaAssertion.shipmentChecklist.lastDigitsEvo)

			translationHelpers.assertSingleField('[data-testid=question-text-evo_is_id_match]', collectionCiltaAssertion.shipmentChecklist.airWaybillEvo)

			translationHelpers.assertSingleField('[data-testid=question-text-red_wire]', collectionCiltaAssertion.shipmentChecklist.redWireTamper)

			translationHelpers.assertSingleField('[data-test-id="shipping-checklist-block-block"] >>>>>> :nth(12)', collectionCiltaAssertion.shipmentChecklist.tamperSealNumber)

			translationHelpers.assertSingleField('[data-testid=question-text-tamper_seal_number_match]', collectionCiltaAssertion.shipmentChecklist.tamperSealNumberAirWaybill)

			translationHelpers.assertSingleField('[data-testid=question-text-consignee_kit_pouch_inside]', collectionCiltaAssertion.shipmentChecklist.consigneeKitPouch)

			translationHelpers.assertSingleField('[data-testid=question-text-zip_ties_secured]', collectionCiltaAssertion.shipmentChecklist.shippingSecured)

			translationHelpers.assertSingleField('[data-test-id="shipping-checklist-block-block"] >>>> :nth(19)', collectionCiltaAssertion.shipmentChecklist.additionalComments)

		}
		getCollAirWayBill(scope)

		cy.get('[data-testid="h1-header"]').should('contain', assertions.shipmentChecklist);

		cy.get('[data-testid="#/properties/shipping_checklist/properties/evo_is_id-input"]').type(1234);
		cy.get('[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]').type(1234);
		cy.get('[data-testid="fail-button-evo_is_id_match"]').click();
		cy.get('[id="#/properties/shipping_checklist/properties/evo_is_id_match_reason-input"]').type(inputs.reason);
		cy.get('[data-testid="pass-button-red_wire"]').click();
		cy.get('[data-testid="pass-button-tamper_seal_number_match"]').click();
		cy.get('[data-testid="fail-button-consignee_kit_pouch_inside"]').click();
		cy.get('[id="#/properties/shipping_checklist/properties/consignee_kit_pouch_inside_reason-input"]').type(inputs.reason);
		cy.get('[data-testid="pass-button-zip_ties_secured"]').click();
		common.ClickPrimaryActionButton();
	},

	// CCLP and CMLP
	collectionShipmentChecklist: (scope, therapy, testId) => { // translations
		if (Cypress.env('runWithTranslations')) {

			actionButtonsTranslectionCheck();

			// title
			translationHelpers.assertPageTitles('[data-test-id="collection_shipment_checklist"]', 'h1', collectionCiltaAssertion.shipmentChecklist.shipmentChecklistTitle)

			translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]', collectionCiltaAssertion.shipmentChecklist.enterAirWaybill)

			translationHelpers.assertSingleField('[data-testid=question-text-apheresis_not_exposed]', collectionCiltaAssertion.shipmentChecklist.confirmMnc)

			translationHelpers.assertBlockLabel('[data-test-id="shipping-checklist-block-block"] >>>>', {
				index: 3,
				label: collectionCiltaAssertion.shipmentChecklist.serialNumberTemperature
			})

			translationHelpers.assertBlockLabel('[data-test-id="shipping-checklist-block-block"] >>>>', {
				index: 5,
				label: collectionCiltaAssertion.shipmentChecklist.securitySerialNumber
			})

			translationHelpers.assertSingleField('[data-testid=question-text-idm_placed_into_shipper]', collectionCiltaAssertion.shipmentChecklist.infectionDiseaseMarker)

			translationHelpers.assertSingleField('[data-testid=question-text-temperature_monitor_active]', collectionCiltaAssertion.shipmentChecklist.hasTemperatureMoniter)

			translationHelpers.assertBlockLabel('[data-test-id="shipping-checklist-block-block"] >>>>', {
				index: 13,
				label: collectionCiltaAssertion.shipmentChecklist.additionalComment
			})

		}
		getCollAirWayBill(scope, testId)
		cy.get('[data-testid="h1-header"]').should('contain', assertions.collectionShipmentChecklis);
		cy.get('[data-testid="pass-button-apheresis_not_exposed"]').click();
		cy.get('[data-testid="pass-button-temperature_monitor_active"]').click();

		cy.get("body").then($body => {
			if ($body.find('[data-testid=fail-button-idm_placed_into_shipper]').length > 0) { // evaluates as true if button exists at all
				cy.get('[data-testid=fail-button-idm_placed_into_shipper]').then($header => {
					if ($header.is(':visible')) {
						cy.get('[data-testid=fail-button-idm_placed_into_shipper]').click();
						cy.get('[id="#/properties/shipping_checklist/properties/idm_placed_into_shipper_reason-input"]').type(inputs.reason);
					}
				});
			}
		});
		// common.ClickPrimaryActionButton();
		actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
			apiAliases: ['@patchProcedureSteps', '@getProcedures']
		})
	},


	// EMeaCc

	collectionShipmentChecklistEmeaCc: (scope, testId) => {
		if (Cypress.env('runWithTranslations')) {
			translationHelpers.assertPageTitles('[data-test-id="collection_shipment_checklist"]', 'h1', collectionCiltaAssertion.shipmentChecklist.shipmentChecklistTitle)
			translationHelpers.assertBlockLabel('[data-test-id="shipping-checklist-block-block"]>>>>:nth(0)', {
				index: 0,
				label: collectionCiltaAssertion.shipmentChecklist.enterAirWaybillCc
			})
			translationHelpers.assertSingleField('[data-testid=question-text-apheresis_not_exposed]', collectionCiltaAssertion.shipmentChecklist.confirmMncCc)
			translationHelpers.assertBlockLabel('[data-test-id="shipping-checklist-block-block"] >>>>', {
				index: 5,
				label: collectionCiltaAssertion.shipmentChecklist.serialNumberTemperature
			})
			translationHelpers.assertBlockLabel('[data-test-id="shipping-checklist-block-block"] >>>>', {
				index: 7,
				label: collectionCiltaAssertion.shipmentChecklist.securitySerialNumber
			})
			translationHelpers.assertBlockLabel('[data-test-id="shipping-checklist-block-block"] >>>>>', {
				index: 8,
				label: collectionCiltaAssertion.shipmentChecklist.infectionDiseaseMarker
			})
			translationHelpers.assertSingleField('[data-testid=question-text-temperature_monitor_active]', collectionCiltaAssertion.shipmentChecklist.hasTemperatureMoniter)
			translationHelpers.assertBlockLabel('[data-test-id="shipping-checklist-block-block"] >>>>', {
				index: 15,
				label: collectionCiltaAssertion.shipmentChecklist.additionalComment
			})

			translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-apheresis_not_exposed]>')
			translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-idm_placed_into_shipper] >')
			translationHelpers.assertYesOrNoconditions('[data-testid=pass-button-temperature_monitor_active] >')
		}
		cy.get('input[id="#/properties/shipping_checklist/properties/collection_airway_bill-input"]').type('some text');;
		cy.get('[data-testid="h1-header"]').should('contain', assertions.collectionShipmentChecklis);

		inputHelpers.clicker('[data-testid="pass-button-apheresis_not_exposed"]');
		inputHelpers.clicker('[data-testid="pass-button-temperature_monitor_active"]');

		cy.get("body").then($body => {
			if ($body.find('[data-testid=fail-button-idm_placed_into_shipper]').length > 0) { // evaluates as true if button exists at all
				cy.get('[data-testid=fail-button-idm_placed_into_shipper]').then($header => {
					if ($header.is(':visible')) {
						cy.get('[data-testid=fail-button-idm_placed_into_shipper]').click();
						cy.get('[id="#/properties/shipping_checklist/properties/idm_placed_into_shipper_reason-input"]').type(inputs.reason);
					}
				});
			}
		});
		common.ClickPrimaryActionButton();
	},


	// EmeaCc
	collectionShippingSummaryEmeaCc: (scope) => {
		if (Cypress.env('runWithTranslations')) {
			translationHelpers.assertPageTitles('[data-test-id="collection_shipping_summary"]', 'h1', collectionCiltaAssertion.shipmentSummary.shipmentSummaryTitle);

			translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', {
				index: 0,
				label: collectionCiltaAssertion.shipmentSummary.procedureDetails
			});

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'div', collectionCiltaAssertion.shipmentSummary.orderId);

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'div', collectionCiltaAssertion.shipmentSummary.product);
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'span', inputs.product);

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'div', collectionCiltaAssertion.shipmentSummary.siteName);
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'span', inputs.siteName);

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'div', collectionCiltaAssertion.shipmentSummary.coi);
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'span', scope.coi);

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'div', collectionCiltaAssertion.shipmentSummary.apheresisId);
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'span', inputs.din);

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 5, 'div', collectionCiltaAssertion.shipmentSummary.numberOfBag);

			translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', {
				index: 1,
				label: collectionCiltaAssertion.shipmentSummary.transferProductToShipper
			});

			translationHelpers.assertBlockLabel('[data-test-id="label-verification-step-row-block"]>>>', {
				index: 0,
				label: collectionCiltaAssertion.shipmentSummary.dateOfShipmentCc
			})

			translationHelpers.assertBlockLabel('[data-test-id="step-header-block"]>>', {
				index: 0,
				label: collectionCiltaAssertion.shipmentSummary.conditionOfShipmentCc
			})

			translationHelpers.assertTxtFieldLayout(collectionCiltaAssertion.shipmentSummary.confirmMncCc)
			translationHelpers.assertSingleField('[data-testid="txt-field-layout-List the serial number of the temperature monitoring device (if applicable to your country):"]', collectionCiltaAssertion.shipmentSummary.serialNumberTemperature)
			translationHelpers.assertSingleField('[data-testid="txt-field-layout-List the security seal number on the shipper (if applicable to your country):"]', collectionCiltaAssertion.shipmentSummary.securitySerialNumber)

			translationHelpers.assertTxtFieldLayout(collectionCiltaAssertion.shipmentSummary.infectionDiseaseMarker, "No")
			translationHelpers.assertTxtFieldLayout(collectionCiltaAssertion.shipmentSummary.hasTemperatureMoniter)
			translationHelpers.assertTxtFieldLayout(collectionCiltaAssertion.shipmentSummary.enterAirWaybillCc, "some text")
			translationHelpers.assertSingleField('[data-testid="txt-field-layout-Please enter additional comments about the shipment"]', collectionCiltaAssertion.shipmentSummary.additionalComment)
		}
		common.doubleSignature(inputs.verifier[1]);
		common.ClickPrimaryActionButton();
	},

	// CCLP and CMLP cilta
	collectionShippingSummaryCcCilta: (scope) => {
		if (Cypress.env('runWithTranslations')) {
			translationHelpers.assertPageTitles('[data-test-id="collection_shipping_summary"]', 'h1', collectionCiltaAssertion.shipmentSummary.shipmentSummaryTitle);

			translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', {
				index: 0,
				label: collectionCiltaAssertion.shipmentSummary.procedureDetails
			});

			translationHelpers.assertBlockLabel('[data-test-id="step-header-block"]>>', {
				index: 0,
				label: collectionCiltaAssertion.shipmentSummary.transferProductToShipper
			});

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'div', collectionCiltaAssertion.shipmentSummary.orderId);

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'div', collectionCiltaAssertion.shipmentSummary.product);
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'span', inputs.product);

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'div', collectionCiltaAssertion.shipmentSummary.siteName);
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'span', inputs.siteName);

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'div', collectionCiltaAssertion.shipmentSummary.coi);
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'span', scope.coi);

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'div', collectionCiltaAssertion.shipmentSummary.apheresisId);
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'span', inputs.din);

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 5, 'div', collectionCiltaAssertion.shipmentSummary.numberOfBag);

			translationHelpers.assertBlockLabel('[data-test-id="label-verification-step-row-block"]>>>', {
				index: 0,
				label: collectionCiltaAssertion.shipmentSummary.dateOfShipmentCc
			})

			translationHelpers.assertBlockLabel('[data-test-id="step-header-block"]>>', {
				index: 2,
				label: collectionCiltaAssertion.shipmentSummary.conditionOfShipmentCc
			})

			translationHelpers.assertTxtFieldLayout(collectionCiltaAssertion.shipmentSummary.confirmMnc)
			translationHelpers.assertSingleField('[data-testid="txt-field-layout-List the serial number of the temperature monitoring device (if applicable to your country):"]', collectionCiltaAssertion.shipmentSummary.serialNumberTemperature)
			translationHelpers.assertSingleField('[data-testid="txt-field-layout-List the security seal number on the shipper (if applicable to your country):"]', collectionCiltaAssertion.shipmentSummary.securitySerialNumber)

			translationHelpers.assertTxtFieldLayout(collectionCiltaAssertion.shipmentSummary.infectionDiseaseMarker, "No")
			translationHelpers.assertTxtFieldLayout(collectionCiltaAssertion.shipmentSummary.hasTemperatureMoniter)
			translationHelpers.assertSingleField('[data-testid="txt-field-layout-Air Waybill Number or Shipment Tracking Identification"]', collectionCiltaAssertion.shipmentSummary.airwaybillNumber)
			translationHelpers.assertSingleField('[data-testid="txt-field-layout-Please enter additional comments about the shipment"]', collectionCiltaAssertion.shipmentSummary.additionalComment)
		}
		common.doubleSignature(inputs.verifier[1]);
		common.ClickPrimaryActionButton();
	},

	// LCLP Cilta and EmeaLc
	collectionShippingSummaryEmeaLc: (scope, therapy) => {
		if (Cypress.env('runWithTranslations')) {
			translationHelpers.assertPageTitles('[data-test-id="collection_shipping_summary"]', 'h1', collectionCiltaAssertion.shipmentSummary.shipmentSummaryTitle);

			translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', {
				index: 0,
				label: collectionCiltaAssertion.shipmentSummary.procedureDetails
			});

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'div', collectionCiltaAssertion.shipmentSummary.orderId);

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'div', collectionCiltaAssertion.shipmentSummary.siteName);
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'span', inputs.siteName);

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'div', collectionCiltaAssertion.shipmentSummary.airWaybillLc);

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'div', collectionCiltaAssertion.shipmentSummary.evoIsNumber);
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'span', inputs.evoLast4Digits);

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'div', collectionCiltaAssertion.shipmentSummary.coi);
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'span', scope.coi);

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 5, 'div', collectionCiltaAssertion.shipmentSummary.apheresisId);
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 5, 'span', inputs.din);

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 6, 'div', collectionCiltaAssertion.shipmentSummary.numberOfBag);

			translationHelpers.assertBlockLabel('[data-test-id="label-verification-step-row-block"]>>>', {
				index: 0,
				label: collectionCiltaAssertion.shipmentSummary.dateOfShipmentCc
			})

			translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', {
				index: 1,
				label: collectionCiltaAssertion.shipmentSummary.bag1LablesLc
			});

			translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', {
				index: 2,
				label: collectionCiltaAssertion.shipmentSummary.bag2LablesLc
			});

			translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', {
				index: 3,
				label: collectionCiltaAssertion.shipmentSummary.bag3LablesLc
			});

			translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', {
				index: 4,
				label: collectionCiltaAssertion.shipmentSummary.bag4LablesLc
			});

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Bag Identifier"]', {
				index: 0,
				label: collectionCiltaAssertion.shipmentSummary.bagIdentiferLc
			});

			translationHelpers.assertBlockLabel('[data-test-id="label-verification-step-row-block"]>>>', {
				index: 4,
				label: collectionCiltaAssertion.shipmentSummary.scanOrEnterDinBagLabelLc
			});

			translationHelpers.assertBlockLabel('[data-testid="txt-field-layout-Enter the DIN/SEC-DIS/Apheresis ID for Cryopreservation Cassette"]', {
				index: 0,
				label: collectionCiltaAssertion.shipmentSummary.secDinCassetteLc
			});

			if (therapy.unique_id == '_lclp_cilta' || therapy.unique_id == '_emea_lc_qr' || therapy.unique_id == '_emea_lcdc_qr') {
				translationHelpers.assertBlockLabel('[data-test-id="step-header-block"]>>', {
					index: 0,
					label: collectionCiltaAssertion.shipmentSummary.transferProductToShipper
				});
				translationHelpers.assertBlockLabel('[data-test-id="step-header-block"]>>', {
					index: 2,
					label: collectionCiltaAssertion.shipmentSummary.conditionOfShipmentCc
				})
			} else {
				translationHelpers.assertBlockLabel('[data-test-id="step-header-block"]>>', {
					index: 0,
					label: collectionCiltaAssertion.shipmentSummary.conditionOfShipmentCc
				})
				translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', {
					index: 5,
					label: collectionCiltaAssertion.shipmentSummary.transferProductToShipper
				});
			}

			translationHelpers.assertSingleField('[data-testid=section-heading-description]', collectionCiltaAssertion.shipmentSummary.verifyBagShippedLc);

			translationHelpers.assertSingleField('[data-testid="txt-field-layout-Enter the Bag identifier and reason"]', collectionCiltaAssertion.shipmentSummary.bagIdentifierReasonLc);

			translationHelpers.assertTxtFieldLayout(collectionCiltaAssertion.shipmentSummary.containerCaseLc)
			translationHelpers.assertTxtFieldLayout(collectionCiltaAssertion.shipmentSummary.tempOutOfRangeLc, "No")
			translationHelpers.assertTxtFieldLayout(collectionCiltaAssertion.shipmentSummary.cryoApheresisProLc)
			translationHelpers.assertTxtFieldLayout(collectionCiltaAssertion.shipmentSummary.cryoApheresisProLc)


			translationHelpers.assertBlockLabel('[data-test-id="label-verification-step-row-block"]>>>', {
				index: 8,
				label: collectionCiltaAssertion.shipmentSummary.airWaybillLc2
			});

			translationHelpers.assertTxtFieldLayout(collectionCiltaAssertion.shipmentSummary.evoIsNumberLc, inputs.evoLast4Digits)
			translationHelpers.assertTxtFieldLayout(collectionCiltaAssertion.shipmentSummary.doesEvoIsNumberListedLc, "No")
			translationHelpers.assertTxtFieldLayout(collectionCiltaAssertion.shipmentSummary.isRedWireInplaceLc)
			translationHelpers.assertTxtFieldLayout(collectionCiltaAssertion.shipmentSummary.enterTamperSealNoLc, inputs.evoLast4Digits)
			translationHelpers.assertTxtFieldLayout(collectionCiltaAssertion.shipmentSummary.doesSealNumberListedLc)
			translationHelpers.assertTxtFieldLayout(collectionCiltaAssertion.shipmentSummary.IsConsigneePouchIncludedLc, "No")
			translationHelpers.assertTxtFieldLayout(collectionCiltaAssertion.shipmentSummary.isShippingContainerSecuredLc)
			translationHelpers.assertSingleField('[data-testid="txt-field-layout-Please enter additional comments about the shipment."]', collectionCiltaAssertion.shipmentSummary.additionalCommentLc)
		}
		common.doubleSignature(inputs.verifier[1]);
		common.ClickPrimaryActionButton();
	}
}