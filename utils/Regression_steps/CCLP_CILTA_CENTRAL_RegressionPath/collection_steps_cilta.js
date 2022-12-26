import common from '../../../support/index'
import assertions from '../../../fixtures/assertions.json'
import collectionAssertion from '../../../fixtures/collectionAssertions.json'
import translationHelpers from '../../shared_block_helpers/translationHelpers.js'
import input from '../../../fixtures/inputs.json';
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers'
import inputChecker from '../../shared_block_helpers/inputFieldCheckHelpers'
import collectionSteps from '../../HappyPath_steps/CCLP_CILTA_CENTRAL_HappyPath/collection_steps_cilta'
import dayjs from 'dayjs';
const todaysDate = dayjs().format('DD-MMM-YYYY');
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
      cy.log('collectionAirwayBill: ', scope.airWayBill)
    })
}

export default {
    patientVerification:  {
        nextButtonPos: () => {
            //C24795
            cy.log('[POS] Verify that "next" button should be disabled until the user signs the document.');
            inputChecker.nextButtonCheck('be.disabled')
          },
    },
    collectionBagIdentification: {
        previousHappyPathSteps: (scope, therapy) => {
            collectionSteps.patientVerificationCilta(therapy, scope);
        },
        //C24852
        apheresisIdNeg: () => {
            cy.log('[NEG] Verify if the "Next" button is disable if the "Scan or enter the DIN/Unique Donation Number/Apheresis ID" field is left empty.')
            inputHelpers.inputDateField('input[id="#/properties/apheresis_date-input"]', input.apheresisDate)
            inputChecker.nextButtonCheck('be.disabled')
        },
        // C24852
        isSiteLabelsAppliedNeg: () => {
            cy.log('[NEG] Verify if the "Next" button is disable if the "Scan or enter the DIN/Unique Donation Number/Apheresis ID" field is left empty.')
            inputHelpers.inputEnterAndConfirm('day_1_bag_1_udn', input.day1Bag1Udn)
            inputChecker.nextButtonCheck('be.disabled')
        },
  
    },
    collectionBagLabelPrinting: {
        previousHappyPathSteps: (scope, therapy) => {
            collectionSteps.patientVerificationCilta(therapy, scope);
            collectionSteps.collectionBagIdentificationCilta();
        },

        // C24854
        printLablesClickable: () => {
            cy.log('[POS] Verify if the "Print Labels" button is clickable.')
            inputChecker.popupMessageVisible('btn-print','banner-container-0')
        },

        //C24856 
        confirmPrintLabelNeg: () => {
            cy.log('[NEG] Verify if the "next" button is disabled when "Confirm labels are printed successfully" checkbox is not checked.')
            inputChecker.nextButtonCheck('be.disabled')
        },

        // C24855
        nextButtonPos: () => {
            cy.log('[NEG] Verify if "Next" button is disabled when the Signature is not signed.')
            inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]')
            actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
                apiAliases: ['@patchProcedureSteps', '@getProcedures'] })
            inputChecker.nextButtonCheck('be.disabled')
            // bug : next button is enabled
        },
    },

    collectionProcedureInformation: {
        previousHappypathSteps: (therapy , scope) => {
            collectionSteps.patientVerificationCilta(therapy, scope);
            collectionSteps.collectionBagIdentificationCilta();
            collectionSteps.collectionInformationPrinting();
        },

        //C24861
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

        //C24862
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

        //C24863
        verifyEditBtn: ()=> {
            cy.log("[POS] Verify if the 'edit ' button is working.");
            cy.waitForElementAndClick('[data-testid="edit-procedure_details"]');
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
            inputHelpers.inputSingleField('[data-testid="masked-input-control"]', input.collectionStartTime);
            inputHelpers.inputSingleField('[data-testid="#/properties/patient_weight-input"]',input.changeWeight);
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
            cy.waitForElementAndClick('[data-testid="primary-button-action"]');
            inputHelpers.inputSingleField('[data-testid="reason-for-change-textarea"]',input.reason);
            cy.waitForElementAndClick('[data-testid="reason-for-change-save"]');
            cy.wait(3000);
            translationHelpers.assertSingleField('[data-testid=display-only]>div:nth(12)', collectionAssertion.collectionSummaryPage.patientWeight);
            translationHelpers.assertPartOfText('[data-testid=display-only]>div:nth(13)', input.changeWeight);
            translationHelpers.assertSingleField('[data-testid=display-only]>div:nth(16)', collectionAssertion.collectionSummaryPage.endTime);
            translationHelpers.assertPartOfText('[data-testid=display-only]>div:nth(17)', input.collectionStartTime);
        },

        //C24864
        printBtnDisable: () => {
            cy.log("[NEG] Verify if 'Print' button is disable until user signs the document.");
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
            inputChecker.checkState('[data-testid="approver-sign-button"]', 'be.enabled');
            inputChecker.checkState('[data-testid="verifier-sign-button"]', 'be.disabled');
        },

        //C24865
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

        //C24866
        printBtnEnable: () => {
            cy.log("[POS] Verify if 'Print' button is working. ");
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
            inputChecker.checkState('[data-testid="approver-sign-button"]', 'not.exist');
            inputChecker.checkState('[data-testid="verifier-sign-button"]', 'not.exist');
            inputChecker.checkState('[name="print"]', 'be.visible');
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
        },

        //C24867	 
        coiBlank: () => {
            cy.log("[NEG]Verify if 'next' button is disabled COI left empty");
            cy.reload();
            inputHelpers.inputSingleField('[data-testid="day-1-bag-1-udn-input-field"]', input.din);
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C24868	 
        dinBlank: (coi) => {
            cy.log("[NEG]Verify if 'next' button is disabled if DIN is left empty");
            cy.reload();
            inputHelpers.inputSingleField('[data-testid="ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-us-cclp-cilta-input-field"]', coi);
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C24869	 
        verifySaveAndCloseBtn: (scope) => {
            cy.log("[POS] Verify if data is retained after clicking 'Save and close' button");
            cy.reload();
            inputHelpers.enterDinAndConfirm('day-1-bag-1-udn', input.din);
            inputHelpers.scanAndVerifyCoi('ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-us-cclp-cilta', scope.coi);
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
            inputHelpers.clicker('[data-testid="secondary-button-action"]');
            cy.openOrder('collection','phil');
            cy.commonPagination(scope.patientId,'Patients');
            inputHelpers.checkMarkVisible('[data-testid="day-1-bag-1-udn-check-mark"]');
            inputHelpers.checkMarkVisible('[data-testid="ln-2-shipper-ship-bags-from-apheresis-site-to-satellite-lab-us-cclp-cilta-check-mark"]');
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
            collectionSteps.transferProductToShipper(scope.coi,input.din);
        },

        //C24870	
        airwayBillEmpty: () => {
            cy.log("[NEG]Verify if the next button is disabled if the 'Please enter air waybill number for shipment.' field is empty ");
            inputHelpers.clicker('[data-testid="pass-button-apheresis_not_exposed"]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/monitoring_device_number-input"]', input.reason);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/security_seal_number-input"]', input.reason);
            inputHelpers.clicker('[data-testid="pass-button-idm_placed_into_shipper"]');
            inputHelpers.clicker('[data-testid="pass-button-temperature_monitor_active"]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/comments-input"]', input.reason);
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C24871
        confirmMncNeg: (scope) => {
            cy.reload();
            cy.log("[NEG] Verify Negative status of toggle for 'Confirm MNC (US only), Apheresis material was not exposed to ambient temperature greater than 60 minutes.'");
            getCollAirWayBill(scope,"collection-airway-bill-input-field");
            inputHelpers.clicker(`[data-testid="collection-airway-bill-input-field-action-trigger-button"]`);
            inputHelpers.clicker('[data-testid="fail-button-apheresis_not_exposed"]');
            inputChecker.checkState('[data-testid="#/properties/shipping_checklist/properties/apheresis_not_exposed_reason-input"]', 'be.visible');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/monitoring_device_number-input"]', input.reason);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/security_seal_number-input"]', input.reason);
            inputHelpers.clicker('[data-testid="pass-button-idm_placed_into_shipper"]');
            inputHelpers.clicker('[data-testid="pass-button-temperature_monitor_active"]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/comments-input"]', input.reason);
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C24872	
        idmSampleNeg: () => {
            cy.reload();
            cy.log("[NEG]Verify Negative status of toggle for ' Has the apheresis material been placed into shipper at 2-8°C as per the apheresis bag Label?'");
            inputHelpers.clicker('[data-testid="pass-button-apheresis_not_exposed"]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/monitoring_device_number-input"]', input.reason);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/security_seal_number-input"]', input.reason);
            inputHelpers.clicker('[data-testid="fail-button-idm_placed_into_shipper"]');
            inputChecker.checkState('[data-testid="#/properties/shipping_checklist/properties/idm_placed_into_shipper_reason-input"]', 'be.visible');
            inputHelpers.clicker('[data-testid="pass-button-temperature_monitor_active"]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/comments-input"]', input.reason);
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C24873	
        tempMonitorNeg: () => {
            cy.reload();
            cy.log("[NEG]Verify Negative status of toggle for ' Has the infectious disease marker (IDM) samples or results been placed into the shipper?If not applicable, select NO and then enter ‘N/A’ in the comments box under question.'");
            inputHelpers.clicker('[data-testid="pass-button-apheresis_not_exposed"]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/monitoring_device_number-input"]', input.reason);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/security_seal_number-input"]', input.reason);
            inputHelpers.clicker('[data-testid="pass-button-idm_placed_into_shipper"]');
            inputHelpers.clicker('[data-testid="fail-button-temperature_monitor_active"]');
            inputChecker.checkState('[data-testid="#/properties/shipping_checklist/properties/temperature_monitor_active_reason-input"]', 'be.visible');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/comments-input"]', input.reason);
            actionButtonsHelper.checkActionButtonIsDisabled('primary');
        },

        //C24875		 
        verifySaveAndCloseBtn: (scope) => {
            cy.log("[POS] Verify if data is saved after clicking 'save and close' button ");
            cy.reload();
            inputHelpers.clicker('[data-testid="pass-button-apheresis_not_exposed"]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/monitoring_device_number-input"]', input.reason);
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/security_seal_number-input"]', input.reason);
            inputHelpers.clicker('[data-testid="pass-button-idm_placed_into_shipper"]');
            inputHelpers.clicker('[data-testid="pass-button-temperature_monitor_active"]');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/comments-input"]', input.reason);
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
            inputHelpers.clicker('[data-testid="secondary-button-action"]');
            cy.openOrder('collection','phil');
            cy.commonPagination(scope.patientId,'Patients');
            inputHelpers.checkMarkVisible('[data-testid="collection-airway-bill-check-mark"]');
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
            collectionSteps.transferProductToShipper(scope.coi,input.din);
            collectionSteps.collectionShipmentChecklist(scope,therapy,"collection-airway-bill-input-field");
        },

        //C24876	
        verifyEditBtn: ()=> {
            cy.log("[POS] Verify if Edit buttons are working ");
            cy.waitForElementAndClick('[data-testid="edit-shipment_checklist"]');
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
            inputHelpers.clicker('[data-testid="fail-button-temperature_monitor_active"]');
            inputChecker.checkState('[data-testid="#/properties/shipping_checklist/properties/temperature_monitor_active_reason-input"]', 'be.visible');
            inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/temperature_monitor_active_reason-input"]',input.reason);
            actionButtonsHelper.checkActionButtonIsEnabled('primary');
            cy.waitForElementAndClick('[data-testid="primary-button-action"]');
            inputHelpers.inputSingleField('[data-testid="reason-for-change-textarea"]',input.reason);
            cy.waitForElementAndClick('[data-testid="reason-for-change-save"]');
            cy.wait(3000);
            translationHelpers.assertSingleField('[data-testid=display-only]>div:nth(25)', "No ");
        },

        //C24877	
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
        cy.checkStatus(scope.patientId,regressionInput.collection.statuses.transferBagToShipper,'Patients',4)
        collectionSteps.transferProductToShipper(coi, input.day1Bag1Udn);

        inputHelpers.clickOnHeader('collection')
        tableHelpers.clickOnFilter('appointment', 'All');
        cy.checkStatus(scope.patientId,regressionInput.collection.statuses.shipmentChecklist,'Patients',4)
        collectionSteps.collectionShipmentChecklist(scope);

        inputHelpers.clickOnHeader('collection')
        tableHelpers.clickOnFilter('appointment', 'All');
        cy.checkStatus(scope.patientId,regressionInput.collection.statuses.shipmentSummary,'Patients',4)
        collectionSteps.collectionShippingSummaryCcCilta(scope);

        tableHelpers.clickOnFilter('appointment', 'All');
        cy.checkStatus(scope.patientId,regressionInput.collection.statuses.completed,'Patients',4)
      })
    }
}