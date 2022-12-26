import input from '../../../fixtures/inputs.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers';
import inputChecker from '../../shared_block_helpers/inputFieldCheckHelpers';
import signatureHelpers from '../../shared_block_helpers/signatureHelpers'
import regressionInput from '../../../fixtures/inputsRegression.json'
import satelliteLabHappyPath from '../../../utils/HappyPath_steps/CCLP_CILTA_CENTRAL_HappyPath/satelite_lab_steps_cilta';
import header from '../../../fixtures/assertions.json';
import inputs from '../../../fixtures/inputs.json';
import translationHelpers from '../../../utils/shared_block_helpers/translationHelpers';
import satLabAssertions from '../../../fixtures/satelliteLab_assertions_cilta.json';

const getSatAirWayBill = (scope,coi) => {
    cy.openOrder('ordering', 'oliver')
    cy.commonPagination(scope.patientId,'Patients')
    cy.get('[data-testid="td-stage-plane-icon"]')
      .eq(1)
      .parent()
      .parent()
      .parent()
      .find('[data-testid="td-stage-site-details"]')
      .invoke('text')
      .then((text) => {
         let airWayBill = text.substring(9, text.length)
  
        cy.openOrder('satellite_lab', 'steph')
        cy.commonPagination(coi, 'Reservations')
  
        inputHelpers.scanAndVerifyCoi('satellite-airway-bill', airWayBill)
        cy.wait(1000)
        cy.log('satLabAirWayBill', airWayBill)
      })
  }
export default {

verifyShipper: {
    previousHappyPathSteps: () => {
        satelliteLabHappyPath.satLabCollectionSummary();
    },

    //C25609
    coiNumberPositive: () => {
        cy.log('Verify Shipper');
        actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C25621
    coiNumberNegative: () => {
        cy.log('Verify Shipper');
        inputChecker.identifierCoiLabelCheck('ln-2-shipper-ship-bags-from-satellite-lab-to-manufacturing-site-us-cclp-cilta',regressionInput.satelliteLab.nagativeCoiInput, 'be.disabled');
        actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C25623
    dataSavingWithsaveAndClosePositive: () => {
        cy.log('Verify Shipper');
        cy.get(`@coi`).then(coi => { 
        inputHelpers.scanAndVerifyCoi('ln-2-shipper-ship-bags-from-satellite-lab-to-manufacturing-site-us-cclp-cilta', coi);
        inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
        });
        actionButtonsHelper.checkActionButtonIsEnabled('primary');
        inputChecker.checkState('.big-green-check-mark','be.visible');
    },

    //C38212
    dataSavingWithBackButtonPositive: () => {
        cy.log('Verify Shipper');
        actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
            apiAliases: ['@patchProcedureSteps', '@getProcedures']
        });
        inputChecker.checkDataSavingWithBackButton('be.visible');
        inputChecker.checkState('.big-green-check-mark','be.visible');
    }
  },

  shipmentReceiptChecklist: {
    previousHappyPathSteps: (therapy) => {
      cy.get(`@coi`).then(coi => { 
        satelliteLabHappyPath.satLabCollectionSummary();
        satelliteLabHappyPath.satLabVerifyShipment(coi, therapy, 'from-satellite-lab', 'to-manufacturing-site');
      });
    },

    //C38576
    scanAndEnterPositive: () => {
      cy.log('Shipment Receipt Checklist');
      inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]');
      inputHelpers.clicker('[data-testid=pass-button-cry_aph_bag]');
      inputHelpers.clicker('[data-testid=pass-button-cold_shipper]');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C38577
    scanAndEnterNegative: () => {
      cy.log('Shipment Receipt Checklist');
      inputChecker.reloadPage();
      inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]');
      inputHelpers.clicker('[data-testid=pass-button-cry_aph_bag]');
      inputHelpers.clicker('[data-testid=pass-button-cold_shipper]');
      inputChecker.identifierCoiLabelCheck('day-1-bag-1-udn',regressionInput.satelliteLab.nagativeCoiInput, 'be.disabled');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C38578
    tempMonitoringPositive: (DIN) => {
      cy.log('Shipment Receipt Checklist');
      inputChecker.reloadPage();
      inputHelpers.scanAndVerifyCoi('day-1-bag-1-udn',DIN);
      inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]');
      inputHelpers.clicker('[data-testid=pass-button-cry_aph_bag]');
      inputHelpers.clicker('[data-testid=pass-button-cold_shipper]');
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/monitoring_device_number-input"]',regressionInput.satelliteLab.positiveNoOfTempMonitoringDevices);
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },

    //C38579
    securitySealNoPositive: () => {
      cy.log('Shipment Receipt Checklist');
      inputChecker.reloadPage();
      inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]');
      inputHelpers.clicker('[data-testid=pass-button-cry_aph_bag]');
      inputHelpers.clicker('[data-testid=pass-button-cold_shipper]');
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/security_seal_number-input"]',regressionInput.satelliteLab.positiveSecuritySealNo);
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },

    //C38580
    doesTempConformTogglePositive: () => {
      cy.log('Shipment Receipt Checklist');
      inputChecker.reloadPage();
      inputHelpers.clicker('[data-testid=pass-button-cry_aph_bag]');
      inputHelpers.clicker('[data-testid=pass-button-cold_shipper]');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C38581
    doesTempConformToggleNegative: () => {
      cy.log('Shipment Receipt Checklist');
      inputHelpers.clicker('[data-testid=fail-button-does_temperature_conform]');
      inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/does_temperature_conform_reason-input"]','be.visible');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C38582
    doesTempConformToggleWithDataPositive: () => {
      cy.log('Shipment Receipt Checklist');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/does_temperature_conform_reason-input"]',regressionInput.satelliteLab.positiveDetailsReason);
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },

    //C38583
    apheresisBagCondTogglePositive: () => {
      cy.log('Shipment Receipt Checklist');
      inputChecker.reloadPage();
      inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]');
      inputHelpers.clicker('[data-testid=pass-button-cold_shipper]');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C38584
    apheresisBagCondToggleNegative: () => {
      cy.log('Shipment Receipt Checklist');
      inputHelpers.clicker('[data-testid=fail-button-cry_aph_bag]');
      inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/cry_aph_bag_reason-input"]','be.visible');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C38585
    apheresisBagCondToggleWithDataPositive: () => {
      cy.log('Shipment Receipt Checklist');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/cry_aph_bag_reason-input"]',regressionInput.satelliteLab.positiveDetailsReason);
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },

    //C38586
    coldShipperTogglePositive: () => {
      cy.log('Shipment Receipt Checklist');
      inputChecker.reloadPage();
      inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]');
      inputHelpers.clicker('[data-testid=pass-button-cry_aph_bag]');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C38587
    coldShipperToggleNegative: () => {
      cy.log('Shipment Receipt Checklist');
      inputHelpers.clicker('[data-testid=fail-button-cold_shipper]');
      inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/cold_shipper_reason-input"]','be.visible');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C38588
    coldShipperToggleWithDataPositive: () => {
      cy.log('Shipment Receipt Checklist');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/cold_shipper_reason-input"]',regressionInput.satelliteLab.positiveDetailsReason);
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },

    //C38589
    additionalCommentsPositive: () => {
      cy.log('Shipment Receipt Checklist');
      inputChecker.reloadPage();
      inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]');
      inputHelpers.clicker('[data-testid=pass-button-cry_aph_bag]');
      inputHelpers.clicker('[data-testid=pass-button-cold_shipper]');
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/issues-input"]',regressionInput.satelliteLab.positiveAdditionalComments);
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    }, 

    //C38590
    dataSavingWithSaveAndClosePositive: () => {
      cy.log('Shipment Receipt Checklist');
      inputHelpers.clicker('[data-testid=fail-button-does_temperature_conform]');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/does_temperature_conform_reason-input"]',regressionInput.satelliteLab.positiveDoesTempConformToggle);
      inputHelpers.clicker('[data-testid=fail-button-cry_aph_bag]');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/cry_aph_bag_reason-input"]',regressionInput.satelliteLab.positiveApheresisBagCondToggleToggle);
      inputHelpers.clicker('[data-testid=fail-button-cold_shipper]');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/cold_shipper_reason-input"]',regressionInput.satelliteLab.positiveColdShipperToggle);
      cy.get(`@coi`).then(coi => {
      inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      });
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
      inputChecker.checkState('[alt="Check circle green"]','be.visible');
      inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/does_temperature_conform_reason-input"]',regressionInput.satelliteLab.positiveDoesTempConformToggle);
      inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/cry_aph_bag_reason-input"]',regressionInput.satelliteLab.positiveApheresisBagCondToggleToggle);
      inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/cold_shipper_reason-input"]',regressionInput.satelliteLab.positiveColdShipperToggle);
      inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/issues-input"]',regressionInput.satelliteLab.positiveAdditionalComments);

    },

    //C38591
    dataSavingWithBackButtonPositive: () => {
      cy.log('Shipment Receipt Checklist');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/monitoring_device_number-input"]',regressionInput.satelliteLab.positiveNoOfTempMonitoringDevices);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/security_seal_number-input"]',regressionInput.satelliteLab.positiveSecuritySealNo);
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
          apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.checkDataSavingWithBackButton('be.visible');
      inputChecker.checkState('[alt="Check circle green"]','be.visible');
      inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/does_temperature_conform_reason-input"]',regressionInput.satelliteLab.positiveDoesTempConformToggle);
      inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/cry_aph_bag_reason-input"]',regressionInput.satelliteLab.positiveApheresisBagCondToggleToggle);
      inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/cold_shipper_reason-input"]',regressionInput.satelliteLab.positiveColdShipperToggle);
      inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/monitoring_device_number-input"]',regressionInput.satelliteLab.positiveNoOfTempMonitoringDevices);
      inputChecker.checkValue('[data-testid="#/properties/shipping_receipt_checklist/properties/security_seal_number-input"]',regressionInput.satelliteLab.positiveSecuritySealNo);
    }
  },

  shipmentReceiptChecklistSummary: {
    previousHappyPathSteps: (therapy) => {
      cy.get(`@coi`).then(coi => {
        satelliteLabHappyPath.satLabCollectionSummary();
        satelliteLabHappyPath.satLabVerifyShipment(coi, therapy, 'from-satellite-lab', 'to-manufacturing-site');
        satelliteLabHappyPath.satLabShipmentChecklist(input.day1Bag1Udn, therapy);
      });
    },

    //C38357
    checkNextButtonWithoutSignaturePositive: () => {
      cy.log('Shipment Receipt Checklist Summary');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature']);
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], input.quelaEmail)
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },

    //C38358
    detailsOfShipmentEditButtonPositive: () => {
      cy.log('Shipment Receipt Checklist Summary');
      inputHelpers.clicker('[data-testid="edit-shipment_receipt_checklist"]');
      inputChecker.explicitWait('.big-green-check-mark');
      inputHelpers.clicker('[data-testid="fail-button-does_temperature_conform"]');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/does_temperature_conform_reason-input"]',
        regressionInput.satelliteLab.positiveToggleOne);
      inputHelpers.clicker('[data-testid="pass-button-cry_aph_bag"]');
      inputHelpers.clicker('[data-testid="fail-button-cry_aph_bag"]');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/cry_aph_bag_reason-input"]',
        regressionInput.satelliteLab.positiveToggleTwo); 
      inputHelpers.clicker('[data-testid="fail-button-cold_shipper"]');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/cold_shipper_reason-input"]',
        regressionInput.satelliteLab.positiveToggleThree); 
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/monitoring_device_number-input"]',
        regressionInput.satelliteLab.positiveListSerialNumber);
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/issues-input"]',
        regressionInput.satelliteLab.positiveAdditionalComments);     
      inputChecker.reasonForChange();  
      inputChecker.explicitWait('[data-testid="display-only"]');
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 4, 'span', regressionInput.satelliteLab.positiveListSerialNumber);
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 7, 'span', regressionInput.satelliteLab.positiveToggleOne);
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 9, 'span', regressionInput.satelliteLab.positiveToggleTwo);
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 11, 'span', regressionInput.satelliteLab.positiveToggleThree);
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 12, 'span', regressionInput.satelliteLab.positiveAdditionalComments);
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 6, 'span', satLabAssertions.shipmentReceiptChecklist.no);
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 8, 'span', satLabAssertions.shipmentReceiptChecklist.no);
      translationHelpers.assertSectionChildElement('[data-testid=display-only]', 10, 'span', satLabAssertions.shipmentReceiptChecklist.no);
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature']);
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C38359
    checkVerifierSignature:() => {
      cy.log('Shipment Receipt Checklist Summary');
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], input.quelaEmail)
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    }
},

  cryopreservatioBags : {
    previousHappyPathSteps: (therapy) => {
      cy.get(`@coi`).then(coi => {
      satelliteLabHappyPath.satLabCollectionSummary();
      satelliteLabHappyPath.satLabVerifyShipment(coi, therapy, 'from-satellite-lab', 'to-manufacturing-site');
      satelliteLabHappyPath.satLabShipmentChecklist(input.day1Bag1Udn, therapy);
      satelliteLabHappyPath.satLabShipmentChecklistSummary(therapy);
    });
  },
    //C25747
     confirmNumberOfBags: () => {
        cy.log('Cryopreservation Bags');
        actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },
      //C25748
      selectNumberOfBags: (itemCount) => {
        actionButtonsHelper.checkActionButtonIsDisabled('primary');
        inputChecker.inputStringValue('input[id="#/properties/item_count-input"]',itemCount);
        actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },
    //C25749
    dataSavingWithsaveAndClosePositive: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
      })
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },
  },
  bagStorage: {
    previousHappyPathSteps: (scope,therapy) => {
      cy.get(`@coi`).then(coi => {
        satelliteLabHappyPath.satLabCollectionSummary();
        satelliteLabHappyPath.satLabVerifyShipment(coi, therapy, 'from-satellite-lab', 'to-manufacturing-site');
        satelliteLabHappyPath.satLabShipmentChecklist(input.day1Bag1Udn, therapy);
        satelliteLabHappyPath.satLabShipmentChecklistSummary(scope,therapy)
        satelliteLabHappyPath.satLabCryopreservation(input.itemCount,)
        satelliteLabHappyPath.satLabCryopreservationLabelscclp(scope.coi, 'Cilta-Cel Central Cryopreservation');
        cy.wait(2000)
      });
    },
    verifyNextButtonStatus: () => {
      //C25868
      cy.log('Bag storage')
      cy.reload();
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
    },
    coiNumber:() => {
      //C25869
      cy.log('Bag storage')
      cy.reload();
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyMultiplePos('cassette-1',`${coi}-PRC-01`,'be.visible')
      });
      inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
    },
    saveAndClose:() => {
      //C25870
      cy.log('Bag storage')
      cy.reload();
      inputChecker.nextButtonCheck('not.be.disabled');
      inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
      cy.get(`@coi`).then(coi => {
      inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
      });
      inputChecker.checkState('[data-testid="cassette-1-check-mark"]','be.visible');
      inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
    },
    //C38273
    backButton:() => {
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      })
      cy.wait(2000)
      inputChecker.checkDataSavingWithBackButton("be.enabled")
      cy.wait(2000)
      inputChecker.checkState('[data-testid="cassette-1-check-mark"]','be.visible');
    },
  },
  cryopreservaationSummary: {
    previousHappyPathSteps: (scope,therapy) => {
      cy.get(`@coi`).then(coi => {
      satelliteLabHappyPath.satLabCollectionSummary();
      satelliteLabHappyPath.satLabVerifyShipment(coi, therapy, 'from-satellite-lab', 'to-manufacturing-site');
      satelliteLabHappyPath.satLabShipmentChecklist(input.day1Bag1Udn,therapy);
      satelliteLabHappyPath.satLabShipmentChecklistSummary (therapy)
      satelliteLabHappyPath.satLabCryopreservation(input.itemCount,)
      satelliteLabHappyPath.satLabCryopreservationLabelscclp(scope.coi, 'Cilta-Cel Central Cryopreservation');
      satelliteLabHappyPath.satLabBagStorage(coi)
      cy.wait(2000)
    });
    },
    verifyNextButton: () => {
      //C25891,C25892
      cy.log('Cryopreservaation Summary')
      cy.reload();
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
      //C25896
      cy.log('Cryopreservaation Summary')
      cy.reload();
      cy.get(`@coi`).then(coi => {
      inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
      });
      inputChecker.nextButtonCheck('not.be.disabled');
    },
    verifyEditButton: () => {
      //C25893
      cy.log('Cryopreservaation Summary')
      cy.reload();
      inputHelpers.clicker('[data-testid="edit-bag_storage"]')
      translationHelpers.assertPageTitles('[data-test-id="satellite_lab_bag_storage"]', 'h1', satLabAssertions.bagStorage.title);
      inputChecker.nextButtonCheck('not.be.disabled');
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.nextButtonCheck('not.be.disabled');
    },
  },
  printPackingInserts: {
    previousHappyPathSteps: (scope,therapy) => {
      cy.get(`@coi`).then(coi => {
      satelliteLabHappyPath.satLabCollectionSummary();
      satelliteLabHappyPath.satLabVerifyShipment(coi, therapy, 'from-satellite-lab', 'to-manufacturing-site');
      satelliteLabHappyPath.satLabShipmentChecklist(input.day1Bag1Udn,therapy);
      satelliteLabHappyPath.satLabShipmentChecklistSummary (therapy)
      satelliteLabHappyPath.satLabCryopreservation(input.itemCount,)
      satelliteLabHappyPath.satLabCryopreservationLabelscclp(scope.coi, 'Cilta-Cel Central Cryopreservation');
      satelliteLabHappyPath.satLabBagStorage(coi)
      satelliteLabHappyPath.satSummaryVerify(scope, therapy);
      cy.wait(2000)
    });
    },
    //C25899,C25900
    verifyNextButton: () => {
      cy.log('Cryopreservaation Summary')
      cy.reload();
      inputChecker.nextButtonCheck('be.disabled');
      inputChecker.clickOnCheck('[data-testid="btn-print"]','be.disabled')
      inputChecker.nextButtonCheck('be.disabled');
    },
    //C25901,C25902
    checkBox: () => {
      cy.log('Cryopreservaation Summary')
      cy.reload();
      inputChecker.nextButtonCheck('be.disabled');
      cy.wait(2000)
      inputChecker.clickOnCheck('[id="#/properties/data/properties/is_confirmed"]','not.be.disabled')
      cy.get(`@coi`).then(coi => {
      inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
      }),
      inputChecker.nextButtonCheck('be.enabled');
    },
    //C38274
    backButton: () => {
      cy.log('Cryopreservaation Summary')
      cy.reload();
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures']
      });
      inputChecker.checkDataSavingWithBackButton('be.enabled')
    },
  },
  bagSelection : {
    previousHappyPathSteps: (therapy) => {
      cy.get(`@coi`).then(coi => {
        satelliteLabHappyPath.satLabCollectionSummary();
        satelliteLabHappyPath.satLabVerifyShipment(coi, therapy, 'from-satellite-lab', 'to-manufacturing-site');
        satelliteLabHappyPath.satLabShipmentChecklist(input.day1Bag1Udn, therapy);
        satelliteLabHappyPath.satLabShipmentChecklistSummary(therapy);
        satelliteLabHappyPath.satLabCryopreservation(input.itemCount);
        satelliteLabHappyPath.satLabCryopreservationLabelscclp(coi, 'Cilta-Cel Central Cryopreservation');
        satelliteLabHappyPath.satLabBagStorage(coi);
        satelliteLabHappyPath.satSummaryVerify(therapy);
        satelliteLabHappyPath.satLabPrintShipperLabels(therapy, 'Cilta-Cel Central Cryopreservation');
    });
  },
    //C25903
    bagSelectionPage: () => {
        actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },
      //C25904
      doNotShip: () => {
        inputHelpers.clicker('[data-testid=fail-button-0]')
        actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },
    //C25905
    selectShipToggle: () => {
      inputHelpers.clicker('[data-testid=pass-button-0]')
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
  },
    //C259049
    dataSavingWithsaveAndClosePositive: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
      })
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },
  },
  cryopreservationLabels : {
    previousHappyPathSteps: (therapy) => {
      cy.get(`@coi`).then(coi => {
      satelliteLabHappyPath.satLabCollectionSummary();
      satelliteLabHappyPath.satLabVerifyShipment(coi, therapy, 'from-satellite-lab', 'to-manufacturing-site');
      satelliteLabHappyPath.satLabShipmentChecklist(input.day1Bag1Udn, therapy);
      satelliteLabHappyPath.satLabShipmentChecklistSummary(therapy);
      satelliteLabHappyPath.satLabCryopreservation(input.itemCount);
    });
  },
    //C25750
    cryopreservationLabelsPage: () => {
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },
    //C25753
    printLabelsButton: () => {
      cy.contains('button', 'Print Labels').click({ multiple: true } );
      translationHelpers.assertSingleField('[data-testid="banner-message-0"]', regressionInput.satelliteLab.apheresateLabels.successMessage);
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },
      //C25864
      checkCassetteCoi: () => {
      inputChecker.reloadPage();
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyMultiplePos("cassette-1", coi + `-PRC-0${1}`, "be.visible")
        })
      inputChecker.checkState('[data-testid=cassette-1-check-mark]','be.visible');
      cy.get('[id="#/properties/data/properties/is_verified"]')
        .find('svg')
        .click()
      }, 
          //C25863
      checkBagCoi: () => {
      inputChecker.reloadPage();
      cy.get('[data-testid="txt-field-layout-Confirm labels are printed successfully-answer"]')
      .find('svg')
      .click()     
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyMultiplePos("bag-identifier-1", coi + `-PRC-0${1}`, "be.visible")
    })
      inputChecker.checkState('[data-testid=bag-identifier-1-check-mark]','be.visible');
    },
    //C25754
    confirmLabelsUnticked: () => {
     inputChecker.reloadPage();
     cy.get('[id="#/properties/data/properties/is_verified"]')
      .find('svg')
      .click()
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },
    //C25862
    allCollectionBags: () => {
      inputChecker.reloadPage();
      cy.get('[data-testid="txt-field-layout-Confirm labels are printed successfully-answer"]')
      .find('svg')
      .click()
      inputChecker.checkState('[data-testid=cassette-1-check-mark]','be.visible');
      inputChecker.checkState('[data-testid=bag-identifier-1-check-mark]','be.visible');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },
    //C25865
    filledAndTicked: () => {
      inputChecker.reloadPage();
      cy.get('[data-testid="txt-field-layout-Confirm labels are printed successfully-answer"]')
      .find('svg')
      .click()
      inputChecker.checkState('[data-testid=cassette-1-check-mark]','be.visible');
      inputChecker.checkState('[data-testid=bag-identifier-1-check-mark]','be.visible');
      cy.get('[id="#/properties/data/properties/is_verified"]')
      .find('svg')
      .click()
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },
   //C25866
    dataSavingWithsaveAndClosePositive: () => {
      cy.get(`@coi`).then(coi => {
      inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
      })
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },
  },
    satLabTransferProductToShipper: {
      previousHappyPathSteps: (therapy) => {
        cy.get(`@coi`).then(coi => {
          satelliteLabHappyPath.satLabCollectionSummary();
          satelliteLabHappyPath.satLabVerifyShipment(coi, therapy, 'from-satellite-lab', 'to-manufacturing-site');
          satelliteLabHappyPath.satLabShipmentChecklist(input.day1Bag1Udn, therapy);
          satelliteLabHappyPath.satLabShipmentChecklistSummary(therapy);
          satelliteLabHappyPath.satLabCryopreservation(input.itemCount);
          satelliteLabHappyPath.satLabCryopreservationLabelscclp(coi, 'Cilta-Cel Central Cryopreservation');
          satelliteLabHappyPath.satLabBagStorage(coi);
          satelliteLabHappyPath.satSummaryVerify(therapy);
          satelliteLabHappyPath.satLabPrintShipperLabels(therapy, 'Cilta-Cel Central Cryopreservation');
          satelliteLabHappyPath.satLabBagSelection();
        });
      },
      negBagId: () => {
        //C25913
        inputHelpers.clicker('[data-testid="pass-button-case_intact_1"]')
        inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"]')
        inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"]')
        inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]')
        inputChecker.keepFieldsEmptymultiBags('cassette-1', 'be.disabled')
        cy.get(`@coi`).then(coi => {
          inputChecker.scanAndVerifyMultipleNeg("cassette-1", coi + `-FP-0${1}`)
          inputChecker.scanAndVerifyMultipleNeg("cassette-1", coi + `-APH-0${1}`)
          inputChecker.scanAndVerifyMultipleNeg("cassette-1", coi)
        })
      },
      negCoi: () => {
        //C25908
        cy.get(`@coi`).then(coi => {
          inputChecker.scanAndVerifyMultiplePos("cassette-1", coi + `-PRC-0${1}`, "be.visible")
        })
        inputChecker.scanAndVerifyFieldAsEmpty('ln-2-shipper-1', 'be.disabled')
        cy.get(`@coi`).then(coi => {
          inputChecker.scanAndVerifyMultipleNeg("ln-2-shipper-1", coi + `-FP-0${1}`)
          inputChecker.scanAndVerifyMultipleNeg("ln-2-shipper-1", coi + `-APH-0${1}`)
          inputChecker.scanAndVerifyMultipleNeg("ln-2-shipper-1", coi + `-PRC-0${1}`)
        })
      },

      negToggleCaseIntactEmpty: () => {
        //C25915
        cy.get(`@coi`).then(coi => {
          inputChecker.scanAndVerifyMultiplePos('ln-2-shipper-1', coi, "be.visible")
        })
        inputHelpers.clicker('[data-testid="pass-button-case_intact_1"]')
        inputChecker.nextButtonCheck('be.disabled')
      },

      negToggleCaseIntact: () => {
        // C25914
        inputHelpers.clicker('[data-testid="fail-button-case_intact_1"]')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/case_intact_1_reason-input"]')
        inputChecker.nextButtonCheck('be.disabled')
      },

      posToggleCaseIntact: () => {
        // C25916
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/case_intact_1_reason-input"]', input.additionalComments, "not.be.disabled")
      },

      negToggleTempRangeEmpty: () => {
        //C25917
        inputHelpers.clicker('[data-testid="pass-button-case_intact_1"]')
        inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"]')
        inputChecker.nextButtonCheck('be.disabled')
      },

      negToggleTempRange: () => {
        // C25920
        inputHelpers.clicker('[data-testid="fail-button-temp_out_of_range_1"]')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/temp_out_of_range_1_reason-input"]')
        inputChecker.nextButtonCheck('be.disabled')
      },

      posToggleTempRange: () => {
        // C25921
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/temp_out_of_range_1_reason-input"]', input.additionalComments, "not.be.disabled")
      },

      negIsredTamperSealEmpty: () => {
        //  C25922
        inputHelpers.clicker('[data-testid="pass-button-temp_out_of_range_1"]')
        inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]')
        inputChecker.nextButtonCheck('be.disabled')
      },

      negIsredTamperSeal: () => {
        // C25923
        inputHelpers.clicker('[data-testid="fail-button-red_wire_tamper_seal_labeled_rack"]')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_seal_labeled_rack_reason-input"]')
        inputChecker.nextButtonCheck('be.disabled')
      },

      posIsredTamperSeal: () => {
        // C25924
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/red_wire_tamper_seal_labeled_rack_reason-input"]', input.additionalComments, "not.be.disabled")
      },

      negToggleProductsStatusEmpty: () => {
        //C25925
        inputHelpers.clicker('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]')
        inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"]')
        inputChecker.nextButtonCheck('be.disabled')
      },

      negToggleProductsStatus: () => {
        // C25926
        inputHelpers.clicker('[data-testid="fail-button-ambient_temperature_exposure"]')
        inputChecker.detailsBoxForToggle('[data-testid="#/properties/shipping_checklist/properties/ambient_temperature_exposure_reason-input"]')
        inputChecker.nextButtonCheck('be.disabled')
      },

      posToggleProductsStatus: () => {
        // C25927
        inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/ambient_temperature_exposure_reason-input"]', input.additionalComments, "not.be.disabled")
      },
      posSaveAndClose: () => {
        //  C25929
        inputHelpers.clicker('[data-testid="pass-button-ambient_temperature_exposure"]')
        cy.get(`@coi`).then(coi => {
          inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
        })
      },

      retainsValueUponClickingNext: () => {
        // C38248
        inputChecker.checkForTheInfoSavedClickingNextAndBack();
        inputChecker.checkValue('[data-testid="pass-button-case_intact_1"]', 'true');
        inputChecker.checkValue('[data-testid="pass-button-temp_out_of_range_1"]', 'true');
        inputChecker.checkValue('[data-testid="pass-button-red_wire_tamper_seal_labeled_rack"]', 'true');
        inputChecker.checkValue('[data-testid="pass-button-ambient_temperature_exposure"]', 'true');
        inputChecker.checkForGreenCheck("cassette-1")
        inputChecker.checkForGreenCheck("ln-2-shipper-1")
      }
  },
    
  SatLabShippingChecklist: {
    previousHappyPathSteps: (therapy) => {
        cy.get(`@coi`).then(coi => {
          satelliteLabHappyPath.satLabCollectionSummary();
          satelliteLabHappyPath.satLabVerifyShipment(coi, therapy, 'from-satellite-lab', 'to-manufacturing-site');
          satelliteLabHappyPath.satLabShipmentChecklist(input.day1Bag1Udn, therapy);
          satelliteLabHappyPath.satLabShipmentChecklistSummary(therapy);
          satelliteLabHappyPath.satLabCryopreservation(input.itemCount);
          satelliteLabHappyPath.satLabCryopreservationLabelscclp(coi, 'Cilta-Cel Central Cryopreservation');
          satelliteLabHappyPath.satLabBagStorage(coi);
          satelliteLabHappyPath.satSummaryVerify(therapy);
          satelliteLabHappyPath.satLabPrintShipperLabels(therapy, 'Cilta-Cel Central Cryopreservation');
          satelliteLabHappyPath.satLabBagSelection();
          satelliteLabHappyPath.satLabTransferProductToShipper(coi, therapy);
        });
      },

    negAirwayBillNumber: () => {
      cy.log('C25960')
      inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/evo_is_id-input"]', inputs.evoLast4Digits)
      inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', inputs.tamperSealNumber)
      inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]')
      inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]')
      inputHelpers.clicker('[data-testid="pass-button-red_wire"]')
      inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
      inputHelpers.clicker('[data-testid=pass-button-consignee_kit_pouch_inside]')
      inputHelpers.clicker('[data-testid=pass-button-zip_ties_secured]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    negInvalidEvo: (scope) => {
      cy.log('C25961')
      cy.get(`@coi`).then(coi => {
        getSatAirWayBill(scope, coi)
      })

      inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', inputs.tamperSealNumber)
      inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]')
      inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]')
      inputHelpers.clicker('[data-testid="pass-button-red_wire"]')
      inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
      inputHelpers.clicker('[data-testid=pass-button-consignee_kit_pouch_inside]')
      inputHelpers.clicker('[data-testid=pass-button-zip_ties_secured]')
      inputChecker.nextButtonCheck("be.disabled");

      inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/evo_is_id-input"]', regressionInput.satelliteLab.evoLast4DigitsTwoDigit);
      inputChecker.nextButtonCheck("be.disabled");

      inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/evo_is_id-input"]', 'a');
      inputChecker.nextButtonCheck("be.disabled");

      inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/evo_is_id-input"]', regressionInput.satelliteLab.evoLast4DigitsFiveDigit);
      inputChecker.nextButtonCheck("be.disabled");

    },
  
    negTamperSealEmpty: () => {
      cy.log('C26215')
      inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/evo_is_id-input"]', inputs.evoLast4Digits)
      inputChecker.clearField('input[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    negEvoNumberListedOnAirWaybillNo: () => {
      cy.log('C26234')
      inputHelpers.inputSingleField('input[id="#/properties/shipping_checklist/properties/tamper_seal_number-input"]', inputs.tamperSealNumber)
      inputHelpers.clicker('[data-testid="fail-button-evo_airway_bill"]')
      inputChecker.nextButtonCheck("be.disabled");

    },

    posEvoNumberListedOnAirWaybillNoWithDetail: () => {
      cy.log('C26235')
      inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-evo_airway_bill"]')
    },

    negEvoNumberListedOnAirWaybillNoSelection: () => {
      cy.log('C26219')
      inputHelpers.clicker('[data-testid="fail-button-evo_airway_bill"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    negRedWireTamperSealNo: () => {
      cy.log('C26238')
      inputHelpers.clicker('[data-testid="pass-button-evo_airway_bill"]')
      inputHelpers.clicker('[data-testid="fail-button-red_wire"]')
      inputChecker.nextButtonCheck("be.disabled");

    },

    negRedWireTamperSealNoWithDetail: () => {
      cy.log('C26243')
      inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-red_wire"]')

    },

    negRedWireTamperSealNoSelection: () => {
      cy.log('C26240')
      inputHelpers.clicker('[data-testid="fail-button-red_wire"]')
      inputChecker.nextButtonCheck("be.disabled");

    },

    negTamperSealNumberListedOnAirWaybillNo: () => {
      cy.log('C26245')
      inputHelpers.clicker('[data-testid="pass-button-red_wire"]')
      inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]')
      inputChecker.nextButtonCheck("be.disabled");

    },

    posTamperSealNumberListedOnAirWaybillNoWithDetail: () => {
      cy.log('C26246')
      inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-tamper_seal_match"]')
    },

    negnegTamperSealNumberListedOnAirWaybillNoSelection: () => {
      cy.log('C26244')
      inputHelpers.clicker('[data-testid="fail-button-tamper_seal_match"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    negShipperLabelIncludedWithShipperNo: () => {
      cy.log('C26248')
      inputHelpers.clicker('[data-testid="fail-button-shipper_label_placed"]')
      inputHelpers.clicker('[data-testid="pass-button-tamper_seal_match"]')
      inputChecker.nextButtonCheck("be.disabled");

    },

    posShipperLabelIncludedWithShipperNoWithDetail: () => {
      cy.log('C26250')
      inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-shipper_label_placed"]')
    },

    negShipperLabelIncludedWithShipperNoSelection: () => {
      cy.log('C26247')
      inputHelpers.clicker('[data-testid="fail-button-shipper_label_placed"]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    negConsigneeKitPouchIncludedNo: () => {
      cy.log('C26253')
      inputHelpers.clicker('[data-testid="pass-button-shipper_label_placed"]')
      inputHelpers.clicker('[data-testid=fail-button-consignee_kit_pouch_inside]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    posConsigneeKitPouchIncludedNoWithDetails: () => {
      cy.log('C26254')
      inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-consignee_kit_pouch_inside"]')
    },

    negConsigneeKitPouchIncludedNoSelection: () => {
      cy.log('C26252')
      inputHelpers.clicker('[data-testid=fail-button-consignee_kit_pouch_inside]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    negShippingContainerSecuredNo: () => {
      cy.log('C26276')
      inputHelpers.clicker('[data-testid=pass-button-consignee_kit_pouch_inside]')
      inputHelpers.clicker('[data-testid=fail-button-zip_ties_secured]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    posShippingContainerSecuredNoWithDetail: () => {
      cy.log('C26277')
      inputChecker.toggleNoWithReasonchecker('[data-testid="pass-button-zip_ties_secured"]')
    },

    negShippingContainerSecuredNoSelection: () => {
      cy.log('C26255')
      inputHelpers.clicker('[data-testid=fail-button-zip_ties_secured]')
      inputChecker.nextButtonCheck("be.disabled");
    },

    posDataOnSaveAndClose: () => {
      cy.log('C26291')
      inputHelpers.clicker('[data-testid=pass-button-zip_ties_secured]')
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, 'be.enabled', 'Reservations')
      })
    },

    posDataOnBackAndNext: () => {
      cy.log('C38521')
      inputHelpers.clicker('[data-testid="back-nav-link"]')
      inputHelpers.clicker("[data-testid='primary-button-action']")
      inputChecker.nextButtonCheck("be.enabled");
    }
  },
  cryopreservationShippingSummary: {
    previousHappyPathSteps: (therapy,scope) => {
      cy.get(`@coi`).then(coi => {
        satelliteLabHappyPath.satLabCollectionSummary();
        satelliteLabHappyPath.satLabVerifyShipment(coi, therapy, 'from-satellite-lab', 'to-manufacturing-site');
        satelliteLabHappyPath.satLabShipmentChecklist(input.day1Bag1Udn, therapy);
        satelliteLabHappyPath.satLabShipmentChecklistSummary(therapy);
        satelliteLabHappyPath.satLabCryopreservation(input.itemCount);
        satelliteLabHappyPath.satLabCryopreservationLabelscclp(coi, 'Cilta-Cel Central Cryopreservation');
        satelliteLabHappyPath.satLabBagStorage(coi);
        satelliteLabHappyPath.satSummaryVerify(therapy);
        satelliteLabHappyPath.satLabPrintShipperLabels(therapy, 'Cilta-Cel Central Cryopreservation');
        satelliteLabHappyPath.satLabBagSelection();
        satelliteLabHappyPath.satLabTransferProductToShipper(coi, therapy);
        satelliteLabHappyPath.satLabShippingChecklist(1, input.evoLast4Digits, input.tamperSealNumber, scope)
});
    },
  //C26297
  doneButtonDisabled: () => {
    cy.log('C26297')
    actionButtonsHelper.checkActionButtonIsDisabled('primary');
},
  //C26299
  editButtonTransfer: () => {
    cy.log('C26299')
    inputHelpers.clicker('[data-testid=edit-transfer_product_to_shipper]');
    inputHelpers.clicker('[data-testid="fail-button-case_intact_1"]')
    inputChecker.inputSingleFieldCheck('[data-testid="#/properties/shipping_checklist/properties/case_intact_1_reason-input"]', input.additionalComments, "not.be.disabled")
    inputHelpers.clicker('[data-testid=primary-button-action]')
    inputHelpers.inputSingleField("[data-testid='reason-for-change-textarea']",regressionInput.satelliteLab.positiveNoReason)
    inputHelpers.clicker('[data-testid="reason-for-change-save"]')
    actionButtonsHelper.checkActionButtonIsDisabled('primary');
},
//C26321
editButtonCondition: () => {
  cy.log('C26321')
  inputHelpers.clicker('[data-testid=edit-shipment_checklist]');  
  inputHelpers.clicker('[data-testid=primary-button-action]')
  actionButtonsHelper.checkActionButtonIsEnabled('primary');
},
//C26322
signature: () => {
  cy.log('C26322')
  signatureHelpers.clickSignDocumentButton('approver', ['@postSignature']);
  actionButtonsHelper.checkActionButtonIsDisabled('primary');
  signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], input.quelaEmail)
  actionButtonsHelper.checkActionButtonIsEnabled('primary');
},
//C25749
dataSavingWithsaveAndClosePositive: () => {
  cy.log('C25749')
  cy.get(`@coi`).then(coi => {
    inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
  })
   actionButtonsHelper.checkActionButtonIsEnabled('primary');
},
  },
  checkStatusesOfSatelliteLabModule: (scope, therapy) => {
    //C38199
      cy.get(`@coi`).then(coi => { 
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.collectionSummary, 'Reservations',2)
      satelliteLabHappyPath.satLabCollectionSummary(scope, therapy);
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.verifyShipper, 'Reservations',2)
      satelliteLabHappyPath.satLabVerifyShipment(coi, therapy, 'from-satellite-lab', 'to-manufacturing-site');
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.shipmentReceiptChecklist, 'Reservations',2)
      satelliteLabHappyPath.satLabShipmentChecklist(input.day1Bag1Udn, therapy);
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.shipmentReceiptChecklistSummary, 'Reservations',2)
      satelliteLabHappyPath.satLabShipmentChecklistSummary(scope, therapy);
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.satLabCryopreservation, 'Reservations',2)
      satelliteLabHappyPath.satLabCryopreservation(input.itemCount);
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.cryopreservationLabels, 'Reservations',2)
      satelliteLabHappyPath.satLabCryopreservationLabelscclp(coi, 'Cilta-Cel Central Cryopreservation');
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.bagStorage, 'Reservations',2)
      satelliteLabHappyPath.satLabBagStorage(coi);
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.cryoPreservationSummary, 'Reservations',2)
      satelliteLabHappyPath.satSummaryVerify(scope, therapy);
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.printPackingInserts, 'Reservations',2)
      satelliteLabHappyPath.satLabPrintShipperLabels(therapy, 'Cilta-Cel Central Cryopreservation');
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.bagSelection, 'Reservations',2)
      satelliteLabHappyPath.satLabBagSelection();
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.transferProductToShipper, 'Reservations',2)
      satelliteLabHappyPath.satLabTransferProductToShipper(coi, therapy);
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.shipmentChecklist, 'Reservations',2)
      satelliteLabHappyPath.satLabShippingChecklist(1, input.evoLast4Digits, input.tamperSealNumber, scope);
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.cryoShippingSummary, 'Reservations',2)
      satelliteLabHappyPath.satShippingSummaryVerify(scope, therapy);
  
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.completed,'Reservations',2)
      
    })
  }
}



