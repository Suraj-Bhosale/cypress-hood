
import input from '../../../fixtures/inputs.json';
import common from '../../../support/index.js';
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers';
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers';
import inputChecker from '../../shared_block_helpers/inputFieldCheckHelpers';
import signatureHelpers from '../../shared_block_helpers/signatureHelpers';
import mftgHappyPath from '../../../utils/HappyPath_steps/CMLP_CILTA_RARITAN_HappyPath/manufacturing_steps_cilta';
import regressionInput from '../../../fixtures/inputsRegression.json';
import translationHelpers from "../../shared_block_helpers/translationHelpers"

const getManufAirWayBill = (scope, shippingRow) => {
   common.loginAs('nina');
   cy.visit('/ordering');
   cy.get('td[data-testid="patient-identifier"]')
     .contains(scope.patientInformation.patientId)
     .click();
   cy.get('[data-testid="td-stage-plane-icon"]').eq(shippingRow).parent().parent().parent().find('[data-testid="td-stage-site-details"]')
     .invoke('text')
     .then((text) => {
       scope.airWayBill = text.substring(9, text.length)
       cy.openOrder('manufacturing','steph')
       cy.get(`@coi`).then(coi => { 
       cy.commonPagination(coi,'Reservations')
       });
       cy.get('[data-testid="manufacturing-airway-bill-input-field"]').type(scope.airWayBill);
       cy.get('[data-testid="manufacturing-airway-bill-action-trigger-button"]').click();
       cy.wait('@labelVerifications');
       cy.log('manufacturingAirwayBill', scope.airWayBill)
     });
 }

export default {

   manufacturingData: {
      emptyDate: () => {
         //C39942
         cy.log("Manufacturing Data")
         inputChecker.nextButtonCheck('be.disabled');
         inputChecker.inputSingleFieldCheck('[data-testid="#/properties/lot_number-input"]',regressionInput.manufacturing.validLotNumber,"be.disabled");
      },
      emptyLotNumber: (currentDate) => {
         //C39943
         cy.log("Manufacturing Data")
         cy.reload();
         inputChecker.nextButtonCheck('be.disabled');
        inputChecker.inputSingleFieldCheck('input[id="#/properties/item_expiry_date-input"]',currentDate,"be.disabled")
      },
      invalidDate: (pastDate) => {
         //C39944
         cy.log("Manufacturing Data")
         cy.reload();
         inputChecker.nextButtonCheck('be.disabled');
         inputChecker.inputSingleFieldCheck('[data-testid="#/properties/lot_number-input"]',regressionInput.manufacturing.validLotNumber,"be.disabled");
         inputChecker.inputSingleFieldCheck('input[id="#/properties/item_expiry_date-input"]',regressionInput.manufacturing.invalidDateFormat,"be.disabled")
         inputChecker.inputSingleFieldCheck('input[id="#/properties/item_expiry_date-input"]',pastDate,"be.disabled")
      },
      signature: (currentDate) => {
         //C39939,C39940
         cy.log("Manufacturing Data")
         cy.reload();
         inputChecker.inputSingleFieldCheck('[data-testid="#/properties/lot_number-input"]',regressionInput.manufacturing.validLotNumber,"be.disabled");
         inputChecker.inputSingleFieldCheck('input[id="#/properties/item_expiry_date-input"]',currentDate,"not.be.disabled")
         actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
         apiAliases: ['@patchProcedureSteps', '@getProcedures'] })
         inputChecker.nextButtonCheck('be.disabled');
         inputChecker.checkState('[data-testid="approver-sign-button"]','be.enabled');
         inputChecker.checkState('[data-testid="verifier-sign-button"]','be.disabled');
         signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
         inputChecker.nextButtonCheck('be.disabled');
         inputChecker.checkState('[data-testid="verifier-sign-button"]','not.be.disabled');
         signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], input.quelaEmail)
         inputChecker.nextButtonCheck('not.be.disabled');
      },
      saveAndClose: () => {
         //C39941
         cy.log("Manufacturing Data")
         inputChecker.nextButtonCheck('not.be.disabled');
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
         cy.get(`@coi`).then(coi => {
         inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
         });
         inputChecker.nextButtonCheck('not.be.disabled');
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
      },
      retainValue: () => {
         //C39945
         cy.log("Manufacturing Data")
         inputChecker.reloadPage();
         inputChecker.nextButtonCheck('not.be.disabled')
         actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
            apiAliases: ['@patchProcedureSteps', '@getProcedures'] })
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.checkDataSavingWithBackButton('be.enabled')
      }
   },
   printFinalProductLabels: {
      previousHappyPathSteps: () => {
         mftgHappyPath.manufacturingData(input.expiryDate, input.lotNumberNeumeric);
      },
      verifyNextButton: () => {
         //C39928,C39929
         cy.log('Print Final Product Labels')
         inputChecker.nextButtonCheck('be.disabled');
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
         inputChecker.clickOnCheck('[data-testid="btn-print"]','be.disabled');
         inputChecker.clickOnCheck('[id="#/properties/data/properties/is_confirmed"]','not.be.disabled')
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
      },
      signature: () => {
         //C39930
         cy.log('Print Final Product Labels')
         actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
            apiAliases: ['@patchProcedureSteps', '@getProcedures']
         });
         inputChecker.checkState("[data-testid='approver-sign-button']",'not.be.disabled');
         //inputChecker.nextButtonCheck('be.disabled'); Bug
         signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
         cy.wait(1000)
         inputChecker.nextButtonCheck('not.be.disabled');
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
      },
      saveAndClose: () => {
         //C39931
         cy.get(`@coi`).then(coi => {
         inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
         });
         inputChecker.nextButtonCheck('not.be.disabled');
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
      },
      retainValue: () => {
        //C39932
         actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
            apiAliases: ['@patchProcedureSteps', '@getProcedures'] })
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.checkDataSavingWithBackButton('be.enabled')
      }
   },

   confirmationOfLabelApplication: {
      previousHappyPathSteps: (therapy) => {
            mftgHappyPath.manufacturingData(input.expiryDate, input.lotNumberNeumeric);
            mftgHappyPath.manufacturingFinalLabels(therapy);  
            cy.wait(2000)
      },
      emptyToggle: () => {
         //C39933
         cy.log("Confirmation Of Label Application")
         inputChecker.reloadPage();
         inputChecker.inputSingleFieldCheck('[id="#/properties/item_count-input"]',regressionInput.manufacturing.validNumberofBags,'be.disabled')
         inputChecker.clickOnCheck('[id="#/properties/data/properties/is_confirmed"]','be.disabled')
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
      },
      emptyBag: () => {
         //C39934
         cy.log("Confirmation Of Label Application")
         inputChecker.reloadPage();
         inputHelpers.clicker('[data-testid="left-button-radio"]')
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.clickOnCheck('[id="#/properties/data/properties/is_confirmed"]','be.disabled')
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
      },
      checkbox: () => {
         //C39935
         cy.log("Confirmation Of Label Application")
         inputChecker.reloadPage();
         inputHelpers.clicker('[data-testid="left-button-radio"]')
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.inputSingleFieldCheck('[id="#/properties/item_count-input"]',regressionInput.manufacturing.validNumberofBags,'be.disabled')
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
      },
      negativeNumberOfBag: () => {
         //C39936
         cy.log("Confirmation Of Label Application")
         inputChecker.reloadPage();
         inputHelpers.clicker('[data-testid="left-button-radio"]')
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.clickOnCheck('[id="#/properties/data/properties/is_confirmed"]','be.disabled')
         inputChecker.inputSingleFieldCheck('[id="#/properties/item_count-input"]',regressionInput.manufacturing.negativedNumberofBags,'be.disabled')
         inputChecker.inputSingleFieldCheck('[id="#/properties/item_count-input"]',regressionInput.manufacturing.invalidData,'be.disabled')
         inputChecker.inputSingleFieldCheck('[id="#/properties/item_count-input"]',regressionInput.manufacturing.negativeSpecialCharecters,'be.disabled')
         inputChecker.inputSingleFieldCheck('[id="#/properties/item_count-input"]',regressionInput.manufacturing.negativeNumber,'be.disabled')
         inputChecker.inputSingleFieldCheck('[id="#/properties/item_count-input"]',regressionInput.manufacturing.negativeData,'be.disabled')
         inputChecker.inputSingleFieldCheck('[id="#/properties/item_count-input"]',regressionInput.manufacturing.validNumberofBags,'not.be.disabled')
      },
      saveAndClose: () => {
         //C39937
         cy.log("Confirmation Of Label Application")
         inputChecker.nextButtonCheck('not.be.disabled');
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
         cy.get(`@coi`).then(coi => {
         inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
         });
         inputChecker.nextButtonCheck('not.be.disabled');
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
      },
      retainValue: () => {
         //C39938
         cy.log("Confirmation Of Label Application")
         inputChecker.reloadPage();
         inputChecker.nextButtonCheck('not.be.disabled')
         actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
            apiAliases: ['@patchProcedureSteps', '@getProcedures'] })
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.checkDataSavingWithBackButton('be.enabled')
         inputChecker.checkValue('[data-testid="left-button-radio"]',"true")
      }
   },
   confirmationOfLabelApplicationPart2: {
      previousHappyPathSteps: (therapy) => {
         cy.get(`@coi`).then(coi => {
            mftgHappyPath.manufacturingData(input.expiryDate, input.lotNumberNeumeric);
            mftgHappyPath.manufacturingFinalLabels(therapy);
            cy.wait(2000)
         })
         inputHelpers.clicker('[data-testid="left-button-radio"]')
         inputChecker.inputSingleFieldCheck('[id="#/properties/item_count-input"]',regressionInput.manufacturing.validNumberofBags,'be.disabled')
         inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]')
         actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
            apiAliases: ['@patchProcedureSteps', '@getProcedures'] })
         cy.wait(2000)
      },
      cassetteLabel: () => {
         //C39947
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
         cy.log('11111')
         cy.get(`@coi`).then(coi => {
         inputChecker.scanAndVerifyMultipleNeg("cassette-1", coi + `-PRC-0${1}`)
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.scanAndVerifyMultipleNeg("cassette-1", coi + `-APH-0${1}`)
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.scanAndVerifyMultipleNeg("cassette-1", coi)
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.scanAndVerifyMultiplePos("cassette-1",`${coi}-FP-01`, "be.visible")
         inputChecker.nextButtonCheck('be.disabled')
      })
      },
      coiField: () => {
         //C39946
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
         cy.log('22222')
         inputChecker.clickOnCheck('[id="#/properties/data/properties/destruction_confirmed"]','be.disabled')
         cy.get(`@coi`).then(coi => {
         inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1", coi + `-PRC-0${1}`)
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1", coi + `-APH-0${1}`)
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.scanAndVerifyMultipleNeg("bag-identifier-1", coi)
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.scanAndVerifyMultiplePos("bag-identifier-1",`${coi}-FP-01`, "be.visible")
         inputChecker.nextButtonCheck('be.enabled')
         })
      },
      checkBox: () => {
         //C39948
         cy.log('3333')
         inputChecker.clickOnCheck('[id="#/properties/data/properties/destruction_confirmed"]','be.disabled')
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
      },
      saveAndClose: () => {
         //C39949
         cy.log('444444')
         inputChecker.nextButtonCheck('be.disabled')
         inputChecker.clickOnCheck('[id="#/properties/data/properties/destruction_confirmed"]','be.enabled')
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
         cy.get(`@coi`).then(coi => {
         inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
         });
         inputChecker.checkState('[data-testid="cassette-1-check-mark"]','be.visible');
         inputChecker.checkState('[data-testid="bag-identifier-1-check-mark"]','be.visible');
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
         inputChecker.nextButtonCheck('be.enabled')
      },
      retainValue: () => {
         //C39950
         cy.log('5555')
         actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
            apiAliases: ['@patchProcedureSteps', '@getProcedures'] })
         inputChecker.nextButtonCheck('not.be.enabled')
         inputChecker.checkDataSavingWithBackButton('be.enabled')
         inputChecker.checkState('[data-testid="cassette-1-check-mark"]','be.visible');
         inputChecker.checkState('[data-testid="bag-identifier-1-check-mark"]','be.visible');
      }
   },


   qualityRelease : {
      previousHappyPathSteps: (scope, therapy) => {
         cy.get(`@coi`).then(coi => {
            mftgHappyPath.manufacturingData(input.expiryDate, input.lotNumberNeumeric);
            mftgHappyPath.manufacturingFinalLabels(therapy);
            mftgHappyPath.manufacturingLabelApplication(coi);
         })
      },

      nextButtonDisabledNeg: () => {
         cy.log("C36765 [NEG] Verify if the 'Next' button is disabled until the checkbox next to 'I verify that this product is approved to ship' is not checked.")
         inputChecker.nextButtonCheck('be.disabled');
      },

      nextButtonAfterTicking: () => {
         cy.log("C36766 [POS] Verify if the 'Next' button is enabled after the 'Confirm labels and packing insert(s) are printed successfully' checkbox is checked.")
         inputHelpers.clicker('[id="#/properties/data/properties/is_verified"]');
         inputChecker.nextButtonCheck('be.enabled')
      },

      signButtonEnabledAfterClickingNext: () => {
         cy.log("C39558 [POS] Verify the 'Sign To Confirm' button should be enabled after clicking on the 'Next' button")
         inputHelpers.clicker('[data-testid="primary-button-action"]');
         inputChecker.checkState("[data-testid='approver-sign-button']", "not.be.disabled")
         inputChecker.nextButtonCheck('be.disabled')
      },

      saveAndClose: () => {
         cy.log("C36767 [POS] Verify if the data is retained after clicking 'Save & Close' button.")
         signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
         inputChecker.nextButtonCheck('be.enabled')
         cy.get(`@coi`).then(coi => {
            inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
         }); 
      }
   },

   bagSelection: {
      previousHappyPathSteps: (scope, therapy) => {
         cy.get(`@coi`).then(coi => {
            mftgHappyPath.manufacturingData(input.expiryDate, input.lotNumberNeumeric);
            mftgHappyPath.manufacturingFinalLabels(therapy);
            mftgHappyPath.manufacturingLabelApplication(coi);
            mftgHappyPath.manufacturingQualityApproval();
         })
      },

      // C26329
      nextButtonDisabledNeg: () => {
         cy.log("[NEG] Verify if the 'Next' button is disabled when any of the 'SHIP' or 'DO NOT SHIP' button on the bag selection page is not selected.") 
         inputChecker.nextButtonCheck('be.disabled');
      },

      // C26330
      doNotShipBag : () => {
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'Do Not Ship' button on the bag selection page is selected.")
         inputHelpers.clicker('[data-testid="fail-button-0"]')
         inputChecker.nextButtonCheck('be.disabled')
      },

      // C26331
      saveAndClosePos : () => {
         cy.log("[POS] Verify if the data is retained after clicking 'Save & Close' button.")
         inputHelpers.clicker('[data-testid="pass-button-0"]')
         inputChecker.nextButtonCheck('not.be.disabled')
         cy.get(`@coi`).then(coi => {
         inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
         });
      }
   },

   transferProductToShipper: {
      previousHappyPathSteps: (scope, therapy) => {
         cy.get(`@coi`).then(coi => {
            mftgHappyPath.manufacturingData(input.expiryDate, input.lotNumberNeumeric);
            mftgHappyPath.manufacturingFinalLabels(therapy);
            mftgHappyPath.manufacturingLabelApplication(coi);
            mftgHappyPath.manufacturingQualityApproval();
            mftgHappyPath.manufacturingBagSelection();
         })
      },
      
      // C36773
      negCoiNotEnteredForBagIdentifier: () => {
         cy.get(`@coi`).then(coi => {
         inputHelpers.scanAndVerifyBags('coi-1', coi);
         inputChecker.scanAndVerifyMultipleNeg("cassette-1", coi + `-PRC-0${1}`)
         inputChecker.scanAndVerifyMultipleNeg("cassette-1", coi + `-APH-0${1}`)
         inputChecker.scanAndVerifyMultipleNeg("cassette-1", coi)
         })
         inputChecker.nextButtonCheck('be.disabled')
      },

      // C36774
      negCoiNotEnteredForShipperLabel: () => {
         inputChecker.checkForGreenCheck("coi-1");
      },

      // C36776
      posSaveAndCloseButtonCheck: () => {
         cy.get(`@coi`).then(coi => {
         inputChecker.scanAndVerifyMultiplePos("cassette-1", `${coi}-FP-01`, "be.visible")
         inputChecker.nextButtonCheck('not.be.disabled')
         inputChecker.checkDataSavingWithSaveAndClose(coi, 'not.be.disabled', "Reservations");
         });
         inputChecker.checkForGreenCheck("cassette-1");
         inputChecker.checkForGreenCheck("coi-1");
      }
   },

   shippingManufacturing : {
      previousHappyPathSteps: (scope,therapy) => {
         cy.get(`@coi`).then(coi => {
            mftgHappyPath.manufacturingData(input.expiryDate, input.lotNumberNeumeric);
            mftgHappyPath.manufacturingFinalLabels(therapy);
            mftgHappyPath.manufacturingLabelApplication(coi);
            mftgHappyPath.manufacturingQualityApproval();
            mftgHappyPath.manufacturingBagSelection();
            mftgHappyPath.manufacturingTransferProductToShipper(coi);
         })
      },

      //C36789
      airwayBillNumberBlank: () => {
         cy.log("[NEG] Verify if the 'Next' button is disabled until the air waybill number for 'Please enter air waybill number for shipment' is not confirmed and all other questions and fields are answered and filled.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36790
      orderIdBlank: (scope) => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled until the order ID for 'Please enter Order ID on air waybill' is not confirmed and all other questions are answered.");
         getManufAirWayBill(scope,2);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36791
      evoLast4DigitsBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled until the EVO-IS Number for 'Please enter the last 4-digits of the EVO-IS Number...' is not entered and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36792
      tamperSealNumberumberBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled until the Tamper Seal Number for 'Please enter the Tamper Seal Number on LN2 shipper lid' is not entered and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36794
      shipperCaseIntactNeg: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the shipping container case intact?' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="fail-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36793
      shipperCaseIntactBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the shipping container case intact?...' and all other questions are answered. ");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36795
      shipperCaseIntactPos: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the shipping container case intact?...' and 'Details' are entered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="fail-button-case_intact_cilta"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/case_intact_cilta_reason-input"]',input.reason);
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
      },
      
      //C36797
      tempOutOfRangeNeg: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Was there a temperature out-of-range....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="fail-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36796
      tempOutOfRangeBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Was there a temperature out-of-range....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36798
      tempOutOfRangePos: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Was there a temperature out-of-range....' and 'Details' are entered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="fail-button-temp_out_cilta"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/temp_out_cilta_reason-input"]',input.reason);
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
      },

      //C36800
      airwayBillMatchTamperNeg: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Does the EVO-IS Number listed on the Air Waybill....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="fail-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36799
      airwayBillMatchTamperBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Does the EVO-IS Number listed on the Air Waybill....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36801
      airwayBillMatchTamperPos: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Does the EVO-IS Number listed on the Air Waybill....' and 'Details' are entered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="fail-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/evo_airway_bill_reason-input"]',input.reason);
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
      },

      //C36803
      tamperSealMatchNeg: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Does the Tamper Seal Number listed on the Air Waybill....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36802
      tamperSealMatchBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Does the Tamper Seal Number listed on the Air Waybill....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36804
      tamperSealMatchPos: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Does the Tamper Seal Number listed on the Air Waybill....' and 'Details' are entered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_match_reason-input"]',input.reason);
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
      },

      //C36806
      cassetteNotExposedNeg: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Confirm cassette(s) were not exposed....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="fail-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36805
      cassetteNotExposedBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Confirm cassette(s) were not exposed....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36807
      cassetteNotExposedPos: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Confirm cassette(s) were not exposed....' and 'Details' are entered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="fail-button-confirm_cassette_not_exposed"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/confirm_cassette_not_exposed_reason-input"]',input.reason);
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
      },

      //C36809
      packingInsertNeg: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the packing insert(s) included....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="fail-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36808
      packingInsertBlank: () => {
         inputChecker.reloadPage();
         cy.log("[[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the packing insert(s) included....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36810
      packingInsertPos: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the packing insert(s) included....' and 'Details' are entered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="fail-button-packing_insert_cilta"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/packing_insert_cilta_reason-input"]',input.reason);
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
      },

      //C36812
      consigneeKitPouchNeg: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the Consignee kit pouch included....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="fail-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36811
      consigneeKitPouchBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the Consignee kit pouch included....' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36813
      consigneeKitPouchPos: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the Consignee kit pouch included....' and 'Details' are entered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="fail-button-consignee_kit_pouch_inside"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/consignee_kit_pouch_inside_reason-input"]',input.reason);
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
      },

      //C36815
      shippingContainerSecureNeg: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the shipping container secured?' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="fail-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36814
      shippingContainerSecureBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the shipping container secured?' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36816
      shippingContainerSecurePos: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the shipping container secured?' and 'Details' are entered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="fail-button-zip_ties_secured"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/zip_ties_secured_reason-input"]',input.reason);
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
      },

      //C36818
      redWireSealLabelNeg: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the red wire tamper seal labeled...' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36817
      redWireSealLabelBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the red wire tamper seal labeled...' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36819
      redWireSealLabelPos: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the red wire tamper seal labeled...' and 'Details' are entered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_reason-input"]',input.reason);
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
      },

      //C36821
      redWireSealInPlaceNeg: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when 'NO' toggle button is selected for the question 'Is the red wire tamper seal...' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36820
      redWireSealInPlaceBlank: () => {
         inputChecker.reloadPage();
         cy.log("[NEG] Verify if the 'Next' button is disabled when any of the 'YES' or 'NO' toggle button is not selected for the question 'Is the red wire tamper seal...' and all other questions are answered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.disabled');
      },

      //C36823
      redWireSealInPlacePos: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the 'Next' button is enabled when all other questions are answered,  'NO' toggle button is selected for the question 'Is the red wire tamper seal...' and 'Details' are entered.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_shipper_reason-input"]',input.reason);
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
      },

      //C36788
      verifySaveAndCloseBtn: () => {
         inputChecker.reloadPage();
         cy.log("[POS] Verify if the data is retained after clicking 'Save & Close' button.");
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/order_id-input"]',input.orderId);
         inputHelpers.inputSingleField('[id="#/properties/shipping_checklist/properties/evo_last_4_digits-input"]',input.evoLast4Digits);
         inputHelpers.clicker('[data-testid="pass-button-case_intact_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-temp_out_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/tamper_seal_number-input"]',input.tamperSealNumber);
         inputHelpers.clicker('[data-testid="pass-button-confirm_cassette_not_exposed"]');
         inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]');
         inputHelpers.clicker('[data-testid="pass-button-packing_insert_cilta"]');
         inputHelpers.clicker('[data-testid="pass-button-consignee_kit_pouch_inside"]');
         inputHelpers.clicker('[data-testid="pass-button-zip_ties_secured"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper"]');
         inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_shipper"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/issues-input"]',input.additionalComments);
         inputChecker.nextButtonCheck('be.enabled');
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
         cy.get(`@coi`).then(coi => {
         inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
         });
         inputChecker.nextButtonCheck('not.be.disabled');
      },
   },

   shippingManufacturingSummary: {
      previousHappyPathSteps: (scope,therapy) => {
         cy.get(`@coi`).then(coi => {
            mftgHappyPath.manufacturingData(input.expiryDate, input.lotNumberNeumeric);
            mftgHappyPath.manufacturingFinalLabels(therapy);
            mftgHappyPath.manufacturingLabelApplication(coi);
            mftgHappyPath.manufacturingQualityApproval();
            mftgHappyPath.manufacturingBagSelection();
            mftgHappyPath.manufacturingTransferProductToShipper(coi);
            mftgHappyPath.shippingManufacturing(2,scope,input.orderId,input.evoLast4Digits,input.tamperSealNumber,therapy);
         })
      },

      //C40034
      verifyEditBtn:() => {
         inputHelpers.clicker('[data-testid="edit-shipping_manufacturing"]');
         inputHelpers.clicker('[data-testid="fail-button-case_intact_cilta"]');
         inputHelpers.inputSingleField('[data-testid="#/properties/shipping_checklist/properties/case_intact_cilta_reason-input"]', input.reason);
         inputChecker.reasonForChange();
         translationHelpers.assertSingleField('[data-testid=display-only]>div>span:nth(9)', "No");
      },

      //C40035
      checkNextButtonWithoutSignatureNeg: () => {
         cy.log('[NEG] Verify if the "Next" button is disabled after confirmers signature is signed.');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
         signatureHelpers.clickSignDocumentButton('approver', ['@postSignature']);
         actionButtonsHelper.checkActionButtonIsEnabled('secondary');
         actionButtonsHelper.checkActionButtonIsDisabled('primary');
      },

      //C40036  
      checkVerifierSignature:() => {
         cy.log('[POS] Verify if the "Next" button is enabled after verifiers signature is signed.');
         signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], input.quelaEmail);
         actionButtonsHelper.checkActionButtonIsEnabled('secondary');
         actionButtonsHelper.checkActionButtonIsEnabled('primary');
      },

      //C40037	
      verifySaveAndCloseBtn: () => {
         cy.log("[POS] Verify if the data is retained after clicking 'Save & Close' button.");
         inputChecker.nextButtonCheck('be.enabled');
         inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
         cy.get(`@coi`).then(coi => {
         inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
         });
         inputChecker.nextButtonCheck('not.be.disabled');
      },
   },

   checkStatusesOfManufacturingModule: (scope, therapy) => {
     cy.get(`@coi`).then((coi) => {
        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.selectExpiryData,'Reservations',4)
        mftgHappyPath.manufacturingData(input.expiryDate, scope.patientInformation.orderingLotNumber);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.printFinalProductLabels,'Reservations',4)
        mftgHappyPath.manufacturingFinalLabels(therapy);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.confirmLabelApplication1,'Reservations',4)
        mftgHappyPath.manufacturingLabelApplication(coi, therapy);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.qualityApproval,'Reservations',4)
        mftgHappyPath.manufacturingQualityApproval();

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.bagSelection,'Reservations',4)
        mftgHappyPath.manufacturingBagSelection();

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.transferProductToShipper,'Reservations',4)
        mftgHappyPath.manufacturingTransferProductToShipper(coi, therapy);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.shippingManufacturing,'Reservations',4)
        mftgHappyPath.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, therapy);

        inputHelpers.clickOnHeader('manufacturing')
        cy.checkStatus(coi,regressionInput.manufacturing.statuses.shippingManufacturingSummary,'Reservations',4)
        mftgHappyPath.manufacturingShippingManufacturingSummaryVerifyCilta(therapy, scope)

        cy.checkStatus(coi,regressionInput.manufacturing.statuses.shippingSummary,'Reservations',4)
    })
  }
}