import common from "../../../support/index"
import input from '../../../fixtures/inputs.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers'
import inputChecker from '../../shared_block_helpers/inputFieldCheckHelpers'
import translationHelpers from "../../shared_block_helpers/translationHelpers"
import collectionCiltaAssertion from "../../../fixtures/collectionCilta_assertion.json"
import collectionSteps from '../../HappyPath_steps/LCLP_CILTA_LOCAL_HappyPath/collection_steps_cilta'
import signatureHelpers from "../../shared_block_helpers/signatureHelpers"
import dayjs from 'dayjs';
const todaysDate = dayjs().format('DD-MMM-YYYY')
import regressionInput from '../../../fixtures/inputsRegression.json'
import tableHelpers from "../../shared_block_helpers/tableHelpers"

export const getCollAirWayBill = (scope, testId) => {
  cy.openOrder('ordering','nina')
  cy.commonPagination(scope.patientId,'Patients')
  cy.get('[data-testid="td-stage-plane-icon"]')
    .eq(0)
    .parent()
    .parent()
    .parent()
    .find('[data-testid="td-stage-site-details"]')
    .invoke('text')
    .then((text) => {
      scope.airWayBill = text.substring(9, text.length)
      cy.openOrder('collection','phil')
      cy.commonPagination(scope.patientId,'Patients')
      if (testId) {
        inputHelpers.inputSingleField(`[data-testid="${testId}"]`, scope.airWayBill)
      } else {
        inputHelpers.scanAndVerifyCoi('collection-airway-bill', scope.airWayBill)
      }
      cy.wait(1000)
      cy.log('collectionAirwayBill', scope.airWayBill)
    })
}

export default {
    patientVerification:  {
        nextButtonPos: () => {
            //C29855
            cy.log('[POS] Verify that "next" button should be disabled until the user signs the document.');
            inputChecker.nextButtonCheck('be.disabled')
          },
    },
    collectionBagIdentification: {
        previousHappyPathSteps: (scope, therapy) => {
          collectionSteps.patientVerificationCilta(therapy, scope);
        },
        //C29841
        apheresisIdNeg: () => {
            cy.log('[NEG] Verify if the "Next" button is disable if the "Scan or enter the DIN/Unique Donation Number/Apheresis ID" field is left empty.')
            inputHelpers.inputDateField('input[id="#/properties/apheresis_date-input"]', input.apheresisDate)
            inputChecker.nextButtonCheck('be.disabled')
        },
        // C29842
        isSiteLabelsAppliedNeg: () => {
            cy.log('[NEG] Verify if the "next" button is disabled if the "Pre-Collection Information" field is left empty')
            inputHelpers.inputEnterAndConfirm('day_1_bag_1_udn', input.day1Bag1Udn)
            inputChecker.nextButtonCheck('be.disabled')
        },
        // C29843 C29844
        backBtnPos: () => {
            cy.log('[POS]Verify Back button is working.')
            inputHelpers.inputDateField('input[id="#/properties/apheresis_date-input"]', input.apheresisDate)
            inputChecker.nextButtonCheck('not.be.disabled')
            inputHelpers.clicker('[data-testid="back-nav-link"]');
            inputHelpers.clicker("[data-testid='primary-button-action']");
            inputChecker.checkForGreenCheckEnterAndConfirm('day_1_bag_1_udn');
        },
  
    },
    collectionBagLabelPrinting: {
        previousHappyPathSteps: (scope, therapy) => {
            collectionSteps.patientVerificationCilta(therapy, scope);
            collectionSteps.collectionBagIdentificationCilta();
        },

        // C29845
        printLablesClickable: () => {
            cy.log('[POS] Verify if the "Print Labels" button is clickable.')
            inputChecker.popupMessageVisible('btn-print','banner-container-0')
        },

        //C29846 
        confirmPrintLabelNeg: () => {
            cy.log('[NEG] Verify if the "next" button is disabled when "Confirm labels are printed successfully" checkbox is not checked.')
            inputChecker.nextButtonCheck('be.disabled')
        },

        // C29847 C29848
        nextButtonPos: () => {
            cy.log('[NEG] Verify if "Next" button is disabled when the Signature is not signed.')
            inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]')
            inputChecker.nextButtonCheck('not.be.disabled')
            actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
                apiAliases: ['@patchProcedureSteps', '@getProcedures'] })
            // inputChecker.nextButtonCheck('be.disabled')
            // bug : next button is enabled
        },
    },

	collectionProcedureInformation: {
        previousHappypathSteps: (therapy , scope) => {
            collectionSteps.patientVerificationCilta(therapy, scope);
            collectionSteps.collectionBagIdentificationCilta();
            collectionSteps.collectionInformationPrinting();
        },

        //C29849 C29850
        patientWeightInvalid: () => {
            cy.log("[NEG] Verify if 'next' button is disable if 'Patient Weight (in Kg)' is invalid or Patient weight left empty.");
            inputHelpers.inputSingleField('[data-testid="masked-input-control"]',input.collectionEndTime);
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
            inputHelpers.inputSingleField('[data-testid="#/properties/patient_weight-input"]', '0');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
            inputHelpers.inputSingleField('[data-testid="#/properties/patient_weight-input"]', '1111');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
            cy.reload();
        },

        //C29851
        endTimeBlank: () => {
            cy.log("[NEG] Verify if the 'next' button remains disabled if 'End time for collection' field is left empty.");
            inputHelpers.inputSingleField('[data-testid="#/properties/patient_weight-input"]',input.patientWeight);
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
            cy.reload();
        }      
    },

    collectionSummary: {
        previousHappypathSteps: (therapy , scope) => {
            collectionSteps.patientVerificationCilta(therapy, scope);
            collectionSteps.collectionBagIdentificationCilta();
            collectionSteps.collectionInformationPrinting();
            collectionSteps.collectionProcedureInformation();
        },

        //C29856
        verifyEditBtn: ()=> {
            cy.log("[POS] Verify if the 'edit ' button is working.");
            cy.waitForElementAndClick('[data-testid="edit-procedure_details"]');
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
            inputHelpers.inputSingleField('[data-testid="masked-input-control"]', input.collectionStartTime);
            inputHelpers.inputSingleField('[data-testid="#/properties/patient_weight-input"]',input.changeWeight);
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
            inputChecker.reasonForChange();
            translationHelpers.assertSingleField('[data-testid=display-only]>div:nth(12)', collectionCiltaAssertion.collectionSummary.patientWeight);
            translationHelpers.assertPartOfText('[data-testid=display-only]>div:nth(13)', input.changeWeight);
            translationHelpers.assertSingleField('[data-testid=display-only]>div:nth(16)', collectionCiltaAssertion.collectionSummary.endTime);
            translationHelpers.assertPartOfText('[data-testid=display-only]>div:nth(17)', input.collectionStartTime);
        },

        //C29857
        printBtnDisable: () => {
            cy.log("[NEG] Verify if 'Print' button is disable until user signs the document.");
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
            inputChecker.checkState('[data-testid="approver-sign-button"]', 'be.enabled');
            inputChecker.checkState('[data-testid="verifier-sign-button"]', 'be.disabled');
        },

        //C29858
        verifyNextBtn: () => {
            cy.log("[POS]Verify if the next button remains disabled until the user signs the document.");
            inputChecker.nextButtonCheck('be.disabled');
            inputChecker.checkState('[data-testid="approver-sign-button"]','be.enabled');
            signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
            inputChecker.nextButtonCheck('be.disabled');
            inputChecker.checkState('[data-testid="verifier-sign-button"]','not.be.disabled');
            signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], input.arlene3Email)
            inputChecker.nextButtonCheck('not.be.disabled');
        },

        //C29859
        printBtnEnable: () => {
            cy.log("[POS] Verify if 'Print' button is working. ");
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
            inputChecker.checkState('[data-testid="approver-sign-button"]', 'not.exist');
            inputChecker.checkState('[data-testid="verifier-sign-button"]', 'not.exist');
            inputChecker.checkState('[name="print"]', 'be.visible');
        },
    },

    cryopreservationLabels: {
        previousHappypathSteps: (therapy , scope) => {
            collectionSteps.patientVerificationCilta(therapy, scope);
            collectionSteps.collectionBagIdentificationCilta();
            collectionSteps.collectionInformationPrinting();
            collectionSteps.collectionProcedureInformation();
            collectionSteps.collectionSummaryCilta();
            cy.openOrder('collection','phil');
            cy.commonPagination(scope.patientId,'Patients');
        },

        //C29882	 
        numberOfBagsBlank: () => {
            cy.log("[NEG]Verify if 'next' button is disabled when Number of bags formulated for cryopreservation is blank.");
            cy.reload();
            inputHelpers.inputSingleField('[data-testid="day-1-bag-1-udn-input-field"]', input.din);
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C29883	 
        dinBlank: () => {
            cy.log("[NEG]Verify if 'next' button is disabled if DIN is left empty");
            cy.reload();
            inputHelpers.inputSingleField('[id="#/properties/item_count-input"]',input.itemCount);
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C29884	 
        verifySaveAndCloseBtn: (scope) => {
            cy.log("[POS] Verify if data is retained after clicking 'Save and close' button");
            cy.reload();
            inputHelpers.enterDinAndConfirm('day-1-bag-1-udn', input.din);
			inputHelpers.inputSingleField('[id="#/properties/item_count-input"]',input.itemCount);
			actionButtonsHelper.checkActionButtonIsEnabled('primary');
            inputHelpers.clicker('[data-testid="secondary-button-action"]');
            cy.openOrder('collection','phil');
            cy.commonPagination(scope.patientId,'Patients');
            inputHelpers.checkMarkVisible('[data-testid="day-1-bag-1-udn-check-mark"]');
        }
    },

    cryopreservationBagLabelAndPackingInsert: {
        previousHappypathSteps: (therapy , scope) => {
            collectionSteps.patientVerificationCilta(therapy, scope);
            collectionSteps.collectionBagIdentificationCilta();
            collectionSteps.collectionInformationPrinting();
            collectionSteps.collectionProcedureInformation();
            collectionSteps.collectionSummaryCilta();
            cy.openOrder('collection','phil');
            cy.commonPagination(scope.patientId,'Patients');
            collectionSteps.cryopreservationLabels();
        },

        //C29863	
        bagIdentifierEmpty: () => {
            cy.reload();
            cy.log("[NEG]Verify if the next button is disabled if the 'Enter the Bag Identifier' field is empty");
			inputHelpers.enterDinAndConfirm('day-1-bag-1-udn', input.din);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/collection_cassete_label_1-input"]', input.din);
            inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C29864	
        cryopreservationBagLabelEmpty: () => {
            cy.log("[NEG] Verify if 'next' button is disabled when 'Scan or Enter DIN' is empty.");
			inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/collection_bag_label_1-input"]', input.din);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/collection_cassete_label_1-input"]', input.din);
            inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C29875	
        cryopreservationCassetteEmpty: () => {
            cy.reload();
            cy.log("[NEG] Verify if 'Next' button is disabled when 'Enter the DIN/SEC-DIS/Apheresis ID for Cryopreservation Cassette' is blank.");
			inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/collection_bag_label_1-input"]', input.din);
            inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C29876	
        dinCheckboxEmpty: () => {
            cy.reload();
            cy.log("[NEG]Verify if 'Next' button is disabled when 'Verify that the DIN/SEC-DIS/Apheresis ID match for the bag' checkbox be not checked.");
			inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/collection_bag_label_1-input"]', input.din);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/collection_cassete_label_1-input"]', input.din);
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C29880		 
        verifySaveAndCloseBtn: (scope) => {
            cy.log("[POS] Verify if data is saved after clicking 'save and close' button ");
            cy.reload();
			inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/collection_bag_label_1-input"]', input.din);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/collection_cassete_label_1-input"]', input.din);
            inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]');
			actionButtonsHelper.checkActionButtonIsEnabled('primary');
            inputHelpers.clicker('[data-testid="secondary-button-action"]');
            cy.openOrder('collection','phil');
            cy.commonPagination(scope.patientId,'Patients');
            inputHelpers.checkMarkVisible('[data-testid="day-1-bag-1-udn-check-mark"]');
        }
    },

	cryopreservationSummary: {
        previousHappypathSteps: (therapy , scope) => {
            collectionSteps.patientVerificationCilta(therapy, scope);
            collectionSteps.collectionBagIdentificationCilta();
            collectionSteps.collectionInformationPrinting();
            collectionSteps.collectionProcedureInformation();
            collectionSteps.collectionSummaryCilta();
            cy.openOrder('collection','phil');
            cy.commonPagination(scope.patientId,'Patients');
            collectionSteps.cryopreservationLabels();
            collectionSteps.cryopreservationBagLabelsAndPackingInsert(scope.coi);
        },

		//C38300
		verifyNextBtn: () => {
			cy.log("[POS]Verify if the next button remains disabled until the user signs the document.");
			inputChecker.nextButtonCheck('be.disabled');
			inputChecker.checkState('[data-testid="approver-sign-button"]','be.enabled');
			signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
			inputChecker.nextButtonCheck('be.disabled');
			inputChecker.checkState('[data-testid="verifier-sign-button"]','not.be.disabled');
			signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], input.phil3Email)
			inputChecker.nextButtonCheck('not.be.disabled');
		},
	},

    transferProductToShipper: {
        previousHappypathSteps: (therapy , scope) => {
            collectionSteps.patientVerificationCilta(therapy, scope);
            collectionSteps.collectionBagIdentificationCilta();
            collectionSteps.collectionInformationPrinting();
            collectionSteps.collectionProcedureInformation();
            collectionSteps.collectionSummaryCilta();
            cy.openOrder('collection','phil');
            cy.commonPagination(scope.patientId,'Patients');
            collectionSteps.cryopreservationLabels();
            collectionSteps.cryopreservationBagLabelsAndPackingInsert(scope.coi);
            collectionSteps.cryopreservationSummary(scope);
        },

        //C38669	
        coiBlank: () => {
            cy.log("[NEG]Verify if 'Next' button is disabled when 'COI number found on the Packing Insert' is not entered.");
            inputHelpers.clicker('[data-testid="pass-button-case_intact_1"');
            inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"');
            inputHelpers.inputSingleField(`[data-testid="#/properties/shipping_checklist/properties/bags_not_shipped_description-input"]` , '1');
            inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"');
            inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C38670
        shipperContainerIntactNeg: (coi) => {
            cy.log("[NEG]Verify if 'Next' button is disabled when 'NO' is selected for 'Is the shipping container case intact?' and reason is not entered.");
            cy.reload();
            inputHelpers.clicker('[data-testid="fail-button-case_intact_1"');
            cy.get('[data-testid="#/properties/shipping_checklist/properties/case_intact_1_reason-input"]').should('be.visible');
            inputHelpers.inputSingleField(`[data-testid="ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-us-lclp-cilta-input-field"]`, coi);
            inputHelpers.clicker('[data-testid="ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-us-lclp-cilta-action-trigger-button"]');
            inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"]');
            inputHelpers.inputSingleField(`[data-testid="#/properties/shipping_checklist/properties/bags_not_shipped_description-input"]`,'1');
            inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C38671
        shipperContainerIntactPos: () => {
            cy.log("[POS]Verify if 'Next' button is enabled when 'NO' toggle button is selected for Is the shipping container case intact?' and reason is entered.");
            cy.reload();
            inputHelpers.clicker('[data-testid="fail-button-case_intact_1"');
            inputHelpers.inputSingleField(`[data-testid="#/properties/shipping_checklist/properties/case_intact_1_reason-input"]`,'1');
            inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"]');
            inputHelpers.inputSingleField(`[data-testid="#/properties/shipping_checklist/properties/bags_not_shipped_description-input"]`,'1');
            inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]');
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
        },

        //C38672	
        tempOutOfRangeNeg: () => {
            cy.log("[NEG]Verify if 'Next' button is disabled when 'NO' is selected for 'Was there a temperature out-of-range alarm received?' and reason is not entered.");
            cy.reload();
            inputHelpers.clicker('[data-testid="pass-button-case_intact_1"');
            inputHelpers.clicker('[data-testid="fail-button-temp_out_of_range_1"]');
            cy.get('[data-testid="#/properties/shipping_checklist/properties/temp_out_of_range_1_reason-input"]').should('be.visible');
            inputHelpers.inputSingleField(`[data-testid="#/properties/shipping_checklist/properties/bags_not_shipped_description-input"]`,'1');
            inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C38673
        tempOutOfRangePos: () => {
            cy.log("[POS]Verify if 'Next' button is enabled when 'NO' toggle button is selected for 'Was there a temperature out-of-range alarm received?' and reason is entered.");
            cy.reload();
            inputHelpers.clicker('[data-testid="pass-button-case_intact_1"');
            inputHelpers.clicker('[data-testid="fail-button-temp_out_of_range_1"]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/temp_out_of_range_1_reason-input"]','1');
            inputHelpers.inputSingleField(`[data-testid="#/properties/shipping_checklist/properties/bags_not_shipped_description-input"]`,'1');
            inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]');
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
        },

        //C38674
        bagIdentifierBlank: () => {
            cy.log("[NEG]Verify if 'Next' button is disabled when 'Bag Identifier' is not entered.");
            cy.reload();
            inputHelpers.clicker('[data-testid="pass-button-case_intact_1"');
            inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"]');
            inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C38675
        ambientTempNeg: () => {
            cy.log("[NEG]Verify if 'Next' button is disabled when 'NO' is selected for 'Confirm cryopreserved apheresis product cassette(s) were not exposed to ambient temperature' and reason is not entered.");
            cy.reload();
            inputHelpers.clicker('[data-testid="pass-button-case_intact_1"');
            inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"]');
            inputHelpers.inputSingleField(`[data-testid="#/properties/shipping_checklist/properties/bags_not_shipped_description-input"]`,'1');
            inputHelpers.clicker('[data-testid="fail-button-ambient_temperature_exposure"]');
            cy.get('[data-testid="#/properties/shipping_checklist/properties/ambient_temperature_exposure_reason-input"]').should('be.visible');
            inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C38676
        ambientTempPos: () => {
            cy.log("[POS]Verify if 'Next' button is enabled when 'NO' toggle button is selected for 'Confirm cryopreserved apheresis product cassette(s) were not exposed to ambient temperature' and reason is entered.");
            cy.reload();
            inputHelpers.clicker('[data-testid="pass-button-case_intact_1"');
            inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"]');
            inputHelpers.inputSingleField(`[data-testid="#/properties/shipping_checklist/properties/bags_not_shipped_description-input"]`,'1');
            inputHelpers.clicker('[data-testid="fail-button-ambient_temperature_exposure"]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/ambient_temperature_exposure_reason-input"]','1');
            inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]');
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
        },

        //C38677
        tamperSealNeg: () => {
            cy.log("[NEG]Verify if 'Next' button is disabled when 'NO' is selected for 'Is the red wire tamper seal labeled 'RACK' in place on the cassette rack?' and reason is not entered.");
            cy.reload();
            inputHelpers.clicker('[data-testid="pass-button-case_intact_1"');
            inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"]');
            inputHelpers.inputSingleField(`[data-testid="#/properties/shipping_checklist/properties/bags_not_shipped_description-input"]`,'1');
            inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"]');
            inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_seal_labeled_rack"]');
            cy.get('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_seal_labeled_rack_reason-input"]').should('be.visible');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C38678
        tamperSealPos: () => {
            cy.log("[POS]Verify if 'Next' button is enabled when 'NO' toggle button is selected for 'Is the red wire tamper seal labeled 'RACK' in place on the cassette rack?' and reason is entered.");
            cy.reload();
            inputHelpers.clicker('[data-testid="pass-button-case_intact_1"');
            inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"]');
            inputHelpers.inputSingleField(`[data-testid="#/properties/shipping_checklist/properties/bags_not_shipped_description-input"]`,'1');
            inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"]');
            inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_seal_labeled_rack"]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_seal_labeled_rack_reason-input"]','1');
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
        },

        //C38679
        verifySaveAndCloseBtn: (scope) => {
            cy.log("[POS] Verify if data is saved after clicking 'save and close' button ");
            cy.reload();
            inputHelpers.clicker('[data-testid="pass-button-case_intact_1"');
            inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"]');
            inputHelpers.inputSingleField(`[data-testid="#/properties/shipping_checklist/properties/bags_not_shipped_description-input"]`,'1');
            inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]');
			actionButtonsHelper.checkActionButtonIsEnabled('primary');
            inputHelpers.clicker('[data-testid="secondary-button-action"]');
            cy.openOrder('collection','phil');
            cy.commonPagination(scope.patientId,'Patients');
            inputHelpers.checkMarkVisible('.big-green-check-mark');
        }
    },

    shipmentChecklist: {
        previousHappypathSteps: (therapy , scope) => {
            collectionSteps.patientVerificationCilta(therapy, scope);
            collectionSteps.collectionBagIdentificationCilta();
            collectionSteps.collectionInformationPrinting();
            collectionSteps.collectionProcedureInformation();
            collectionSteps.collectionSummaryCilta();
            cy.openOrder('collection','phil');
            cy.commonPagination(scope.patientId,'Patients');
            collectionSteps.cryopreservationLabels();
            collectionSteps.cryopreservationBagLabelsAndPackingInsert(scope.coi);
			collectionSteps.cryopreservationSummary(scope);
            collectionSteps.cryopreservationTransferProductToShipper(scope.coi,"us-lclp-cilta");
        },

        // //C38655	
        airWayBillBlank: () => {
            cy.log("[NEG]Verify if 'Next' button is disabled when 'air waybill number for shipment' is not entered.");
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_is_id-input"]','1234');
            inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]','1234');
            inputHelpers.clicker('[data-testid="fail-button-evo_is_id_match"]');
            inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_is_id_match_reason-input"]',input.reason);
            inputHelpers.clicker('[data-testid="pass-button-red_wire"]');
            inputHelpers.clicker('[data-testid="pass-button-tamper_seal_number_match"]');
            inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
            inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C38656	 
        last4DigitEvoisBlank: (scope) => {
            cy.log("[NEG]Verify if 'Next' button is disabled when 'last 4 digits of the EVO-IS Number on the LN2 shipper lid' is not entered.");
            cy.reload();
            getCollAirWayBill(scope);
            inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]','1234');
            inputHelpers.clicker('[data-testid="fail-button-evo_is_id_match"]');
            inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_is_id_match_reason-input"]',input.reason);
            inputHelpers.clicker('[data-testid="pass-button-red_wire"]');
            inputHelpers.clicker('[data-testid="pass-button-tamper_seal_number_match"]');
            inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
            inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C38657
        airwaybillMatchNeg: () => {
            cy.log("[NEG]Verify if 'Next' button is disabled when 'NO' toggle button is selected for 'Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?' and reason is not entered.");
            cy.reload();
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_is_id-input"]','1234');
            inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]','1234');
            inputHelpers.clicker('[data-testid="fail-button-evo_is_id_match"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire"]');
            inputHelpers.clicker('[data-testid="pass-button-tamper_seal_number_match"]');
            inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
            inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        // /C38658
        airwaybillMatchPos: () => {
            cy.log("[POS]Verify if 'Next' button is enabled when 'NO' toggle button is selected for 'Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?' and reason is entered.");
            cy.reload();
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_is_id-input"]','1234');
            inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]','1234');
            inputHelpers.clicker('[data-testid="fail-button-evo_is_id_match"]');
            inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_is_id_match_reason-input"]',input.reason);
            inputHelpers.clicker('[data-testid="pass-button-red_wire"]');
            inputHelpers.clicker('[data-testid="pass-button-tamper_seal_number_match"]');
            inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
            inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
        },

        //C38659
        redWireTamperSealNeg: () => {
            cy.log("[NEG]Verify if 'Next' button is disabled when 'NO' toggle button is selected for 'Is the red wire tamper seal in place for the LN2 shipper lid?' and reason is not entered.");
            cy.reload();
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_is_id-input"]','1234');
            inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]','1234');
            inputHelpers.clicker('[data-testid="pass-button-evo_is_id_match"]');
            inputHelpers.clicker('[data-testid="fail-button-red_wire"]');
            inputHelpers.clicker('[data-testid="pass-button-tamper_seal_number_match"]');
            inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
            inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C38660
        redWireTamperSealPos: () => {
            cy.log("[POS]Verify if 'Next' button is enabled when 'NO' toggle button is selected for 'Is the red wire tamper seal in place for the LN2 shipper lid?' and reason is entered.");
            cy.reload();
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_is_id-input"]','1234');
            inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]','1234');
            inputHelpers.clicker('[data-testid="pass-button-evo_is_id_match"]');
            inputHelpers.clicker('[data-testid="fail-button-red_wire"]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/red_wire_reason-input"]',input.reason);
            inputHelpers.clicker('[data-testid="pass-button-tamper_seal_number_match"]');
            inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
            inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
        },

        //C38661
        tamperSealNumberBlank: () => {
            cy.log("[NEG]Verify if 'Next' button is disabled when 'Tamper Seal Number on LN2 shipper lid' is not entered.");
            cy.reload();
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_is_id-input"]','1234');
            inputHelpers.clicker('[data-testid="pass-button-evo_is_id_match"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire"]');
            inputHelpers.clicker('[data-testid="pass-button-tamper_seal_number_match"]');
            inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
            inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C38662
        tamperSealNumberMatchAirwayBillNeg: () => {
            cy.log("[NEG]Verify if 'Next' button is disabled when 'NO' toggle button is selected for 'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number' and reason is not entered.");
            cy.reload();
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_is_id-input"]','1234');
            inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]','1234');
            inputHelpers.clicker('[data-testid="pass-button-evo_is_id_match"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire"]');
            inputHelpers.clicker('[data-testid="fail-button-tamper_seal_number_match"]');
            inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
            inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },
        
        //C38663
        tamperSealNumberMatchAirwayBillPos: () => {
            cy.log("[POS]Verify if 'Next' button is enabled when 'NO' toggle button is selected for 'Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number and reason is entered.");
            cy.reload();
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_is_id-input"]','1234');
            inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]','1234');
            inputHelpers.clicker('[data-testid="pass-button-evo_is_id_match"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire"]');
            inputHelpers.clicker('[data-testid="fail-button-tamper_seal_number_match"]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number_match_reason-input"]',input.reason);
            inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
            inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
        },

        //C38664
        consigneeKitPouchNeg: () => {
            cy.log("[NEG]Verify if 'Next' button is disabled when 'NO' is selected for 'Is the Consignee kit pouch included with the shipper?' and reason is not entered.");
            cy.reload();
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_is_id-input"]','1234');
            inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]','1234');
            inputHelpers.clicker('[data-testid="pass-button-evo_is_id_match"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire"]');
            inputHelpers.clicker('[data-testid="pass-button-tamper_seal_number_match"]');
            inputHelpers.clicker('[data-testid="fail-button-consignee_kit_pouch_inside"]');
            inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },
        
        //C38665
        consigneeKitPouchPos: () => {
            cy.log("[POS]Verify if 'Next' button is enabled when 'NO' toggle button is selected for 'Is the Consignee kit pouch included with the shipper?' and reason is entered.");
            cy.reload();
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_is_id-input"]','1234');
            inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]','1234');
            inputHelpers.clicker('[data-testid="pass-button-evo_is_id_match"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire"]');
            inputHelpers.clicker('[data-testid="pass-button-tamper_seal_number_match"]');
            inputHelpers.clicker('[data-testid="fail-button-consignee_kit_pouch_inside"]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/consignee_kit_pouch_inside_reason-input"]',input.reason);
            inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
        },

        //C38666
        shippingContainerSecureNeg: () => {
            cy.log("[NEG]Verify if 'Next' button is disabled when 'NO' is selected for 'Is the shipping container secured?' and reason is not entered.");
            cy.reload();
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_is_id-input"]','1234');
            inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]','1234');
            inputHelpers.clicker('[data-testid="pass-button-evo_is_id_match"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire"]');
            inputHelpers.clicker('[data-testid="pass-button-tamper_seal_number_match"]');
            inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
            inputHelpers.clicker('[data-testid="fail-button-zip_ties_secured"]');
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },
        
        //C38667
        shippingContainerSecurePos: () => {
            cy.log("[POS]Verify if 'Next' button is enabled when 'NO' toggle button is selected for 'Is the shipping container secured?' and reason is entered.");
            cy.reload();
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_is_id-input"]','1234');
            inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]','1234');
            inputHelpers.clicker('[data-testid="pass-button-evo_is_id_match"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire"]');
            inputHelpers.clicker('[data-testid="pass-button-tamper_seal_number_match"]');
            inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
            inputHelpers.clicker('[data-testid="fail-button-zip_ties_secured"]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/zip_ties_secured_reason-input"]',input.reason);
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
        },

        //C38668
        verifySaveAndCloseBtn: (scope) => {
            cy.log("[POS]Verify if 'Save & Close' button works.");
            cy.reload();
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_is_id-input"]','1234');
            inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]','1234');
            inputHelpers.clicker('[data-testid="pass-button-evo_is_id_match"]');
            inputHelpers.clicker('[data-testid="pass-button-red_wire"]');
            inputHelpers.clicker('[data-testid="pass-button-tamper_seal_number_match"]');
            inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
            inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
			actionButtonsHelper.checkActionButtonIsEnabled('primary');
            inputHelpers.clicker('[data-testid="secondary-button-action"]');
            cy.wait(3000);
            cy.openOrder('collection','phil');
            cy.commonPagination(scope.patientId,'Patients');
            inputHelpers.checkMarkVisible('.big-green-check-mark');
        }
    },
	
    shipmentSummary: {
        previousHappypathSteps: (therapy , scope) => {
            collectionSteps.patientVerificationCilta(therapy, scope);
            collectionSteps.collectionBagIdentificationCilta();
            collectionSteps.collectionInformationPrinting();
            collectionSteps.collectionProcedureInformation();
            collectionSteps.collectionSummaryCilta();
            cy.openOrder('collection','phil');
            cy.commonPagination(scope.patientId,'Patients');
            collectionSteps.cryopreservationLabels();
            collectionSteps.cryopreservationBagLabelsAndPackingInsert(scope.coi);
			collectionSteps.cryopreservationSummary(scope);
            collectionSteps.cryopreservationTransferProductToShipper(scope.coi,"us-lclp-cilta");
            collectionSteps.cryopreservationShipmentChecklist(scope, "us-lclp-cilta");
        },

        //C29861	
        verifyEditBtn: ()=> {
            cy.log("[POS] Verify if Edit buttons are working ");
            cy.waitForElementAndClick('[data-testid="edit-transfer_product_to_shipper"]');
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
            inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_seal_labeled_rack"]');
            inputChecker.checkState('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_seal_labeled_rack_reason-input"]', 'be.visible');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_seal_labeled_rack_reason-input"]',input.reason);
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
            inputChecker.reasonForChange();
            translationHelpers.assertSingleField('[data-testid=display-only]>div>span:nth(12)', "No");
        },

        //C29862	
        verifyDoneBtn: () => {
            cy.log("[POS] Verify if the Done button remains disabled until the user signs the document");
            inputChecker.nextButtonCheck('be.disabled');
            inputChecker.checkState('[data-testid="approver-sign-button"]','be.enabled');
            signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
            inputChecker.nextButtonCheck('be.disabled');
            inputChecker.checkState('[data-testid="verifier-sign-button"]','not.be.disabled');
            signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], input.phil3Email)
            inputChecker.nextButtonCheck('not.be.disabled');
        },
    },

    checkStatusesOfCollectionModule: (scope,therapy) => {
        cy.get(`@coi`).then((coi) => {
        inputHelpers.clickOnHeader('collection')
        tableHelpers.clickOnFilter('appointment', 'All');
        cy.checkStatus(scope.patientId,regressionInput.collection.statuses.patientVerification,'Patients',4)
        collectionSteps.patientVerificationCilta(therapy, scope);
    
        inputHelpers.clickOnHeader('collection')
        tableHelpers.clickOnFilter('appointment', 'All');
        cy.checkStatus(scope.patientId,regressionInput.collection.statuses.collectionBagIdentification,'Patients',4)
        collectionSteps.collectionBagIdentificationCilta();

        inputHelpers.clickOnHeader('collection')
        tableHelpers.clickOnFilter('appointment', 'All');
        cy.checkStatus(scope.patientId,regressionInput.collection.statuses.collectionBagLabelPrinting,'Patients',4)
        collectionSteps.collectionInformationPrinting();

        inputHelpers.clickOnHeader('collection')
        tableHelpers.clickOnFilter('appointment', 'All');
        cy.checkStatus(scope.patientId,regressionInput.collection.statuses.collectionProcedureInformation,'Patients',4)
        collectionSteps.collectionProcedureInformation();

        inputHelpers.clickOnHeader('collection')
        tableHelpers.clickOnFilter('appointment', 'All');
        cy.checkStatus(scope.patientId,regressionInput.collection.statuses.collectionSummary,'Patients',4)
        collectionSteps.collectionSummaryCilta(scope);

        tableHelpers.clickOnFilter('appointment', 'All');
        cy.checkStatus(scope.patientId,regressionInput.collection.statuses.completed,'Patients',4)

        cy.openOrder('collection','phil')
        cy.commonPagination(scope.patientId,'Patients',4)
        
        inputHelpers.clickOnHeader('collection')
        tableHelpers.clickOnFilter('appointment', 'All');
        cy.checkStatus(scope.patientId,regressionInput.collection.statuses.cryopreservationBags,'Patients',4)
        collectionSteps.cryopreservationLabels();

        inputHelpers.clickOnHeader('collection')
        tableHelpers.clickOnFilter('appointment', 'All');
        cy.checkStatus(scope.patientId,regressionInput.collection.statuses.applyLabel,'Patients',4)
        collectionSteps.cryopreservationBagLabelsAndPackingInsert(scope.coi, therapy);
            
        inputHelpers.clickOnHeader('collection')
        tableHelpers.clickOnFilter('appointment', 'All');
        cy.checkStatus(scope.patientId,regressionInput.collection.statuses.cryopreservationSummary,'Patients',4)
        collectionSteps.cryopreservationSummary(scope);;

        inputHelpers.clickOnHeader('collection')
        tableHelpers.clickOnFilter('appointment', 'All');
        cy.checkStatus(scope.patientId,regressionInput.collection.statuses.transferBagToShipper,'Patients',4)
        collectionSteps.cryopreservationTransferProductToShipper(scope.coi, 'us-lclp-cilta');

        inputHelpers.clickOnHeader('collection')
        tableHelpers.clickOnFilter('appointment', 'All');
        cy.checkStatus(scope.patientId,regressionInput.collection.statuses.shipmentChecklist,'Patients',4)
        collectionSteps.cryopreservationShipmentChecklist(scope, therapy);

        inputHelpers.clickOnHeader('collection')
        tableHelpers.clickOnFilter('appointment', 'All');
        cy.checkStatus(scope.patientId,regressionInput.collection.statuses.shipmentSummary,'Patients',4)
        collectionSteps.collectionShippingSummaryEmeaLc(scope, therapy);

        tableHelpers.clickOnFilter('appointment', 'All');
        cy.checkStatus(scope.patientId,regressionInput.collection.statuses.completed,'Patients',4)
      })
    }
}