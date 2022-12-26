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
			translationHelpers.assertSingleField('[data-testid=display-only] >> :nth(2)', scope.patientInformation.dayOfBirth)
			// Month of Birth
			translationHelpers.assertBlockLabel('[data-testid=display-only] >', {
				index: 6,
				label: collectionCiltaAssertion.patientVerification.monthOfBirth
			})
			// Month of Birth Value
			// translationHelpers.assertSingleField('[data-testid=display-only] >> :nth(3)', inputs.monthOfBirth)
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

			translationHelpers.assertSectionChildElement('[data-test-id="enter-and-confirm-block"]', 0 , "div", collectionCiltaAssertion.collectionBagIdentification.scanOrEnterDinSec, 1);
            translationHelpers.assertSectionChildElement('[data-test-id="enter-and-confirm-block"]', 0 , "label", collectionCiltaAssertion.collectionBagIdentification.enter, 0);
            translationHelpers.assertSectionChildElement('[data-test-id="enter-and-confirm-block"]', 0 , "label", collectionCiltaAssertion.collectionBagIdentification.confirm, 1);

			translationHelpers.assertBlockLabel('[id="#/properties/apheresis_date"]>', {
                index: 0,
                label: collectionCiltaAssertion.collectionBagIdentification.dateOfApheresis
            })
		}

		// cy.get('[data-test-id="collection_bag_1_identification"] h1').should('contain', assertions.collectionBagIdentification);
		// cy.get('[data-test-id="enter-and-confirm-block"] div > div').first().should('contain', assertions.euUDNDescription);
		cy.get('[data-testid=primary-button-action]').should('be.disabled');
		// cy.get('[data-test-id="collection_bag_1_identification"] h3').should('contain', assertions.collectionBagSectionHeader);
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

			// translationHelpers.assertBlockLabel('[data-test-id="specimen-block-block"]>>>>>>>', {
			// 	index: 0,
			// 	label: collectionCiltaAssertion.collectionProcedureInformation.enterEndTime
			// })

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


	collectionSummaryEmeaCc: (scope) => { // translations
		if (Cypress.env('runWithTranslations')) { // title
			translationHelpers.assertPageTitles('[data-test-id="collection_collection_summary"]', 'h1', collectionCiltaAssertion.collectionSummary.title)

			// subtitle
			translationHelpers.assertBlockLabel('[data-test-id="ordering-summary-block-block"] >>', {
				index: 0,
				label: collectionCiltaAssertion.collectionSummary.patientData
			})

			translationHelpers.assertBlockLabel('[data-test-id="collection-summary-block"] >>', {
				index: 0,
				label: collectionCiltaAssertion.collectionSummary.procedureDetails
			})
			translationHelpers.assertBlockLabel('[data-test-id="collection-summary-block"] >>', {
				index: 3,
				label: collectionCiltaAssertion.collectionSummary.bagInformation
			})

			// labels
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'div', collectionCiltaAssertion.collectionSummary.coi)

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'span', `${scope.coi
				}`)

			translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'div', collectionCiltaAssertion.collectionSummary.collectionSiteName)
			translationHelpers.assertSectionChildElement('[data-testid=display-only]', 1, 'span', inputs.siteName)

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'div', collectionCiltaAssertion.collectionSummary.dayOfBirth)
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'span', scope.patientInformation.dayOfBirth)

			// translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'div', collectionCiltaAssertion.collectionSummary.monthOfBirth)
			// translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'span', inputs.monthOfBirth)

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'div', collectionCiltaAssertion.collectionSummary.yearOfBirth)
			// value

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 5, 'div', collectionCiltaAssertion.collectionSummary.orderId)
			// translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 5, 'span', scope.patientInformation.patientId)
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


	// EmeaCc and CMLP, CCLP Cilta
	transferProductToShipper: (coi, bag_identifier, therapy = 'us-cclp-cilta', fromSite = 'apheresis-site', toSite = 'satellite-lab') => {
		cy.get(`[data-testid="ln-2-shipper-ship-bags-from-${fromSite}-to-${toSite}-${therapy}-input-field"]`).type(coi)
		cy.get(`[data-testid="ln-2-shipper-ship-bags-from-${fromSite}-to-${toSite}-${therapy}-action-trigger-button"]`).click()
		cy.get(`[data-testid="day-1-bag-1-udn-input-field"]`).type(bag_identifier)
		cy.get(`[data-testid="day-1-bag-1-udn-action-trigger-button"]`).click()
		common.ClickPrimaryActionButton();
	},

	collectionShipmentChecklistEmeaCc: (scope, testId) => {
		if (Cypress.env('runWithTranslations')) {
			translationHelpers.assertPageTitles('[data-test-id="collection_shipment_checklist"]', 'h1', collectionCiltaAssertion.shipmentChecklist.shipmentChecklistTitle)
			translationHelpers.assertBlockLabel('[data-test-id="shipping-checklist-block-block"]>>>>:nth(0)', {
				index: 0,
				label: collectionCiltaAssertion.shipmentChecklist.enterAirWaybillEmea
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
		cy.get('input[id="#/properties/shipping_receipt_checklist/properties/collection_airway_bill-input"]').type('some text');;
		cy.get('[data-testid="h1-header"]').should('contain', assertions.collectionShipmentChecklis);

		inputHelpers.clicker('[data-testid="pass-button-apheresis_not_exposed"]');
		inputHelpers.clicker('[data-testid="pass-button-temperature_monitor_active"]');

		cy.get("body").then($body => {
			if ($body.find('[data-testid=fail-button-idm_placed_into_shipper]').length > 0) { // evaluates as true if button exists at all
				cy.get('[data-testid=fail-button-idm_placed_into_shipper]').then($header => {
					if ($header.is(':visible')) {
						cy.get('[data-testid=fail-button-idm_placed_into_shipper]').click();
						cy.get('[id="#/properties/shipping_receipt_checklist/properties/idm_placed_into_shipper_reason-input"]').type(inputs.reason);
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
			// translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'span', inputs.siteName);

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'div', collectionCiltaAssertion.shipmentSummary.coi);
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'span', scope.coi);

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'div', collectionCiltaAssertion.shipmentSummary.apheresisId);
			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'span', inputs.din);

			translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 5, 'div', collectionCiltaAssertion.shipmentSummary.numberOfBag);

			translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]', {
				index: 1,
				label: collectionCiltaAssertion.shipmentSummary.transferProductToShipper
			});

			// translationHelpers.assertBlockLabel('[data-test-id="label-verification-step-row-block"]>>>', {
			// 	index: 0,
			// 	label: collectionCiltaAssertion.shipmentSummary.dateOfShipmentCc
			// })

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
}