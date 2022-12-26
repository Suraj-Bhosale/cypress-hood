import input from '../../../fixtures/inputs.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers';
import inputChecker from '../../shared_block_helpers/inputFieldCheckHelpers';
import signatureHelpers from '../../shared_block_helpers/signatureHelpers'
import regressionInput from '../../../fixtures/inputsRegression.json'
import satelliteLabHappyPath from '../../../utils/HappyPath_steps/CMLP_CILTA_RARITAN_HappyPath/satelite_lab_steps_cilta';
import header from '../../../fixtures/assertions.json';
import translationHelpers from '../../../utils/shared_block_helpers/translationHelpers';
import satLabAssertions from '../../../fixtures/satelliteLab_assertions_cilta.json';

export default {

verifyShipper: {

    previousHappyPathSteps: () => {
      satelliteLabHappyPath.satLabPrintCryopreservationLabels();
      satelliteLabHappyPath.satLabCollectionSummary();
    },

    //C38215
    coiNumberPositive: () => {
      cy.log('Verify Shipper');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C38216
    coiNumberNegative: () => {
      cy.log('Verify Shipper');
      inputChecker.identifierCoiLabelCheck('ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-us-cmlp-cilta',regressionInput.satelliteLab.nagativeCoiInput, 'be.disabled');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C38217
    dataSavingWithsaveAndClosePositive: () => {
      cy.log('Verify Shipper');
      cy.get(`@coi`).then(coi => {
      inputHelpers.scanAndVerifyCoi('ln-2-shipper-ship-bags-from-apheresis-site-to-manufacturing-site-us-cmlp-cilta', coi);
      inputChecker.checkDataSavingWithSaveAndClose(coi,"be.enabled","Reservations")
      });
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
      inputChecker.checkState('.big-green-check-mark','be.visible');
    },

    //C38218
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
        satelliteLabHappyPath.satLabPrintCryopreservationLabels();
        satelliteLabHappyPath.satLabCollectionSummary();
        satelliteLabHappyPath.satLabVerifyShipment(coi,therapy, 'from-apheresis-site', 'to-manufacturing-site');
      });
    },

    //C36370
    scanAndEnterPositive: () => {
      cy.log('Shipment Receipt Checklist');
      inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]');
      inputHelpers.clicker('[data-testid=pass-button-cry_aph_bag]');
      inputHelpers.clicker('[data-testid=pass-button-cold_shipper]');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C38463
    scanAndEnterNegative: () => {
      cy.log('Shipment Receipt Checklist');
      inputChecker.reloadPage();
      inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]');
      inputHelpers.clicker('[data-testid=pass-button-cry_aph_bag]');
      inputHelpers.clicker('[data-testid=pass-button-cold_shipper]');
      inputChecker.identifierCoiLabelCheck('day-1-bag-1-udn',regressionInput.satelliteLab.nagativeCoiInput, 'be.disabled');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C38476
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

    //C38483
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

    //C36371
    doesTempConformTogglePositive: () => {
      cy.log('Shipment Receipt Checklist');
      inputChecker.reloadPage();
      inputHelpers.clicker('[data-testid=pass-button-cry_aph_bag]');
      inputHelpers.clicker('[data-testid=pass-button-cold_shipper]');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C36372
    doesTempConformToggleNegative: () => {
      cy.log('Shipment Receipt Checklist');
      inputHelpers.clicker('[data-testid=fail-button-does_temperature_conform]');
      inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/does_temperature_conform_reason-input"]','be.visible');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C36373
    doesTempConformToggleWithDataPositive: () => {
      cy.log('Shipment Receipt Checklist');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/does_temperature_conform_reason-input"]',regressionInput.satelliteLab.positiveDetailsReason);
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },

    //C36374
    apheresisBagCondTogglePositive: () => {
      cy.log('Shipment Receipt Checklist');
      inputChecker.reloadPage();
      inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]');
      inputHelpers.clicker('[data-testid=pass-button-cold_shipper]');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C36375
    apheresisBagCondToggleNegative: () => {
      cy.log('Shipment Receipt Checklist');
      inputHelpers.clicker('[data-testid=fail-button-cry_aph_bag]');
      inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/cry_aph_bag_reason-input"]','be.visible');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C36376
    apheresisBagCondToggleWithDataPositive: () => {
      cy.log('Shipment Receipt Checklist');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/cry_aph_bag_reason-input"]',regressionInput.satelliteLab.positiveDetailsReason);
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },

    //C36377
    coldShipperTogglePositive: () => {
      cy.log('Shipment Receipt Checklist');
      inputChecker.reloadPage();
      inputHelpers.clicker('[data-testid=pass-button-does_temperature_conform]');
      inputHelpers.clicker('[data-testid=pass-button-cry_aph_bag]');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C36378
    coldShipperToggleNegative: () => {
      cy.log('Shipment Receipt Checklist');
      inputHelpers.clicker('[data-testid=fail-button-cold_shipper]');
      inputChecker.checkState('[data-testid="#/properties/shipping_receipt_checklist/properties/cold_shipper_reason-input"]','be.visible');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },

    //C36379
    coldShipperToggleWithDataPositive: () => {
      cy.log('Shipment Receipt Checklist');
      inputHelpers.inputSingleField('[data-testid="#/properties/shipping_receipt_checklist/properties/cold_shipper_reason-input"]',regressionInput.satelliteLab.positiveDetailsReason);
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },

    //C38484
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

    //C36380
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

    //C36381
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
        satelliteLabHappyPath.satLabPrintCryopreservationLabels();
        satelliteLabHappyPath.satLabCollectionSummary();
        satelliteLabHappyPath.satLabVerifyShipment(coi,therapy, 'from-apheresis-site', 'to-manufacturing-site');
        satelliteLabHappyPath.satLabShipmentChecklist(input.day1Bag1Udn, therapy);
      });
    },

    //C36318
    checkNextButtonWithoutSignaturePositive: () => {
      cy.log('Shipment Receipt Checklist Summary');
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature']);
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], input.quelaEmail)
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },

    //C36317
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

    //C36319
    checkVerifierSignature:() => {
      cy.log('Shipment Receipt Checklist Summary');
      signatureHelpers.clickSignDocumentButton('verifier', ['@postSignature'], input.quelaEmail)
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    }
  },
  cryopreservatioBags : {
    previousHappyPathSteps: (scope,therapy) => {
      cy.get(`@coi`).then(coi => {
      satelliteLabHappyPath.satLabPrintCryopreservationLabels();
      satelliteLabHappyPath.satLabCollectionSummary();
      satelliteLabHappyPath.satLabVerifyShipment(scope.coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');
      satelliteLabHappyPath.satLabShipmentChecklist(input.day1Bag1Udn, therapy);
      satelliteLabHappyPath.satLabShipmentChecklistSummary(scope, therapy);
    });
  },
    //C36334
     confirmNumberOfBags: () => {
        cy.log('Cryopreservation Bags');
        actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },
      //C39001
      selectNumberOfBags: (itemCount) => {
        actionButtonsHelper.checkActionButtonIsDisabled('primary');
        inputChecker.inputStringValue('input[id="#/properties/item_count-input"]',itemCount);
        actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },
    //C36335
    dataSavingWithsaveAndClosePositive: () => {
      cy.get(`@coi`).then(coi => {
        inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
      })
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },
  },
  cryopreservationLabels : {
    previousHappyPathSteps: (scope,therapy) => {
      cy.get(`@coi`).then(coi => {
      satelliteLabHappyPath.satLabPrintCryopreservationLabels();
      satelliteLabHappyPath.satLabCollectionSummary();
      satelliteLabHappyPath.satLabVerifyShipment(scope.coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');
      satelliteLabHappyPath.satLabShipmentChecklist(input.day1Bag1Udn, therapy);
      satelliteLabHappyPath.satLabShipmentChecklistSummary(scope, therapy);
      satelliteLabHappyPath.satLabCryopreservation(input.itemCount);
    });
  },
    //36330
    checkBagCoi: () => {  
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyMultiplePos("bag-identifier-1", coi + `-PRC-0${1}`, "be.visible")
    })
      inputChecker.checkState('[data-testid=bag-identifier-1-check-mark]','be.visible');
      cy.get('[id="#/properties/data/properties/is_verified"]')
      .find('svg')
      .click()
      actionButtonsHelper.checkActionButtonIsDisabled('primary');
    },
    //36331
    checkCassetteCoi: () => {
      inputChecker.reloadPage();
      cy.get(`@coi`).then(coi => {
      inputChecker.scanAndVerifyMultiplePos("cassette-1", coi + `-PRC-0${1}`, "be.visible")})
      inputChecker.checkState('[data-testid=cassette-1-check-mark]','be.visible');
      cy.get('[id="#/properties/data/properties/is_verified"]')
      .find('svg')
      .click()
    },
     // C36332
     signatureBlock: () => {
      inputHelpers.clicker('[data-testid="primary-button-action"]')
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature']);
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
         },
   //C25866
    dataSavingWithsaveAndClosePositive: () => {
      cy.get(`@coi`).then(coi => {
      inputChecker.checkDataSavingWithSaveAndClose(coi, "be.enabled", "Reservations")
      })
      actionButtonsHelper.checkActionButtonIsEnabled('primary');
    },
        //C36534
    backButton: () => {
      inputHelpers.clicker('[data-testid="back-nav-link"]')
      inputHelpers.clicker("[data-testid='primary-button-action']")
      inputChecker.nextButtonCheck("be.enabled");
        },
  },
  cryopreservationSummary: {
    previousHappyPathSteps: (scope,therapy) => {
      cy.get(`@coi`).then(coi => {
      satelliteLabHappyPath.satLabPrintCryopreservationLabels();
      satelliteLabHappyPath.satLabCollectionSummary();
      satelliteLabHappyPath.satLabVerifyShipment(scope.coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');
      satelliteLabHappyPath.satLabShipmentChecklist(input.day1Bag1Udn, therapy);
      satelliteLabHappyPath.satLabShipmentChecklistSummary(scope, therapy);
      satelliteLabHappyPath.satLabCryopreservation(input.itemCount);
      satelliteLabHappyPath.satLabCryopreservationLabels(scope.coi, therapy);
      })
    },
    verifyNextButton: () => {
      //C36325,C36326
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
      //C36327
      cy.log('Cryopreservaation Summary')
      cy.reload();
      inputChecker.nextButtonCheck('not.be.disabled');
      inputChecker.checkState('[data-testid="secondary-button-action"]','not.be.disabled');
      inputChecker.checkState('[data-testid="approver-signature-name"]','be.visible')
      inputChecker.checkState('[data-testid="verifier-signature-name"]','be.visible')
      cy.get(`@coi`).then(coi => {
      inputChecker.checkDataSavingWithSaveAndClose(coi,'not.be.disabled',"Reservations");
      });
      inputChecker.checkState('[data-testid="approver-signature-name"]','be.visible')
      inputChecker.checkState('[data-testid="verifier-signature-name"]','be.visible')
      inputChecker.nextButtonCheck('not.be.disabled');
    },
  },

  checkStatusesOfSatelliteLabModule: (scope, therapy) => {
    
      cy.get(`@coi`).then(coi => { 
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.cryopreservationLabels, 'Reservations',2)
      satelliteLabHappyPath.satLabPrintCryopreservationLabels();  

      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.collectionSummary, 'Reservations',2)
      satelliteLabHappyPath.satLabCollectionSummary(scope, therapy);
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.verifyShipper, 'Reservations',2)
      satelliteLabHappyPath.satLabVerifyShipment(coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');
  
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
      satelliteLabHappyPath.satLabCryopreservationLabels(coi, therapy);
  
      inputHelpers.clickOnHeader('satellite_lab')
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.cryoPreservationSummary, 'Reservations',2)
      satelliteLabHappyPath.satSummaryVerify(scope, therapy);
  
      cy.checkStatus(coi,regressionInput.satelliteLab.statuses.completed,'Reservations',2)
      
    })
  }
}
