import common from '../../../support/index.js';
import translationHelpers from '../../shared_block_helpers/translationHelpers'
import wdcAssertions from '../../../fixtures/wdcAssertions.json'
import inputs from '../../../fixtures/inputs.json'
import actionButtonsHelper from '../../shared_block_helpers/actionButtonHelpers'
import signatureHelpers from '../../shared_block_helpers/signatureHelpers.js'
import inputHelpers from '../../shared_block_helpers/inputFieldHelpers.js'

const wdcHeaderTranslations = (coi) => {
    translationHelpers.assertSingleField('[data-testid="patientInformationHeader.coi"]',
    wdcAssertions.headers.coi)

    translationHelpers.assertSingleField('[data-testid="patientInformationHeader.coi-value"]',
    coi)

    translationHelpers.assertSingleField('[data-testid="patientInformationHeader.lot_number"]',
    wdcAssertions.headers.lotNumber)

    translationHelpers.assertSingleField('[data-testid="patientInformationHeader.lot_number-value"]',
    inputs.lotNumber)

    translationHelpers.assertSingleField('[data-testid="patientInformationHeader.therapy"]',
    wdcAssertions.headers.therapy)

    translationHelpers.assertSingleField('[data-testid="patientInformationHeader.therapy-value"]',
    wdcAssertions.headers.therapyValue)
  }

  const wdcSidebarTranslations = () => {
    translationHelpers.assertSingleField('[data-testid="progress-creation_of_final_product_shipment-name"]',
    wdcAssertions.sidebar.createFPshipment)

    translationHelpers.assertSingleField('[data-testid="progress-shipping_receipt-name"]',
    wdcAssertions.sidebar.shippingReciept)

    translationHelpers.assertSingleField('[data-testid="progress-storage-name"]',
    wdcAssertions.sidebar.storage)

    translationHelpers.assertSingleField('[data-testid="progress-product_receipt-name"]',
    wdcAssertions.sidebar.productReciept)

    translationHelpers.assertSingleField('[data-testid="progress-qp_release-name"]',
    wdcAssertions.sidebar.qpRelease)

    translationHelpers.assertSingleField('[data-testid="progress-labels-name"]',
    wdcAssertions.sidebar.labels)

    translationHelpers.assertSingleField('[data-testid="progress-shipping-name"]',
    wdcAssertions.sidebar.shipping)
  }

  const getWDCAirWayBillEmea = (scope, shippingRow) => {
    common.loginAs('oliver')
    cy.visit('/ordering')
    cy.wait(8000)
    cy.get('td[data-testid="patient-identifier"]')
      .contains(scope.patientInformation.patientId)
      .click()
    cy.get('[data-testid="td-stage-plane-icon"]')
      .eq(shippingRow)
      .parent()
      .parent()
      .parent()
      .find('[data-testid="td-stage-site-details"]')
      .invoke('text')
      .then((text) => {
        scope.manAirwayBill = text.substring(9, text.length)
        common.loginAs('steph')
        cy.visit('/wdc')
        cy.contains(scope.coi).click()

        inputHelpers.scanAndVerifyCoi('wdc-airway-bill', scope.manAirwayBill)
        cy.log('wdcAirWayBill', scope.manAirwayBill)
      })
  }

  export default {
      wdcVerifyShipper: (therapy, coi) => {
        if (Cypress.env('runWithTranslations')) {
          //TITLE
          translationHelpers.assertPageTitles("[data-test-id='wdc_verify_shipper']",
          "h1", wdcAssertions.verifyShipper.title)

          //SECTION HEADING
          translationHelpers.assertSingleField('[data-testid="section-heading-title"]',
          wdcAssertions.verifyShipper.sectionHeading)

          translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]',
          wdcAssertions.verifyShipper.scanCOICommercial)
      
          translationHelpers.assertChildElement('[data-test-id="bags-creation-block-block"]',
          'p', wdcAssertions.verifyShipper.numberOfBags)
        }

        inputHelpers.scanAndVerifyCoi(`ln-2-shipper-ship-bags-from-manufacturing-site-to-world-distribution-center${therapy}`, coi)
        
        inputHelpers.inputSingleField('[id="#/properties/item_count-input"]', 1)
        actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
          apiAliases: ['@patchProcedureSteps', '@getProcedures'],
        })
      },

      wdcShipmentReceiptChecklist: () => {
        if (Cypress.env('runWithTranslations')) {
          //TITLE
          translationHelpers.assertPageTitles("[data-test-id='wdc_shipment_receipt_checklist']",
          "h1",  wdcAssertions.shippingRecieptChecklist.title)

          //SECTION HEADING
          translationHelpers.assertSingleField('[data-testid="section-heading-title"]',
          wdcAssertions.shippingRecieptChecklist.sectionHeading)

          translationHelpers.assertSingleField('[data-testid="section-heading-description"]',
          wdcAssertions.shippingRecieptChecklist.description)

          //TOGGLES
          translationHelpers.assertSingleField('[data-testid="question-text-shipping_container_condition"]',
          wdcAssertions.shippingRecieptChecklist.labels.caseIntactCommercial)   

          translationHelpers.assertSingleField('[data-testid="question-text-zip_ties_secured_no_case"]',
          wdcAssertions.shippingRecieptChecklist.labels.containerSecure)

          translationHelpers.assertSingleField('[data-testid="question-text-shipper_label"]',
          wdcAssertions.shippingRecieptChecklist.labels.shipperLabelCommercial)

          translationHelpers.assertSingleField('[data-testid="txt-field-layout-Please enter the last 4-digits of the EVO-IS Number on the LN2 shipper lid."]',
          wdcAssertions.shippingRecieptChecklist.labels.evoIsNumber)

          translationHelpers.assertSingleField('[data-testid="question-text-evo_match"]',
          wdcAssertions.shippingRecieptChecklist.labels.evoListenedAWB)

          translationHelpers.assertSingleField('[data-testid="question-text-red_wire_tamper_seal"]',
          wdcAssertions.shippingRecieptChecklist.labels.redTamper)

          translationHelpers.assertSingleField('[data-testid="txt-field-layout-Please enter the Tamper Seal Number on LN2 shipper lid."]',
          wdcAssertions.shippingRecieptChecklist.labels.sealNumber)

          translationHelpers.assertSingleField('[data-testid="question-text-tamper_seal_match"]',
          wdcAssertions.shippingRecieptChecklist.labels.sealNumberonAWB)
        }

        cy.get('[data-testid="h1-header"]').should('contain', 'Shipment Receipt Checklist')
        inputHelpers.clicker('[data-testid=pass-button-shipping_container_condition]')
        inputHelpers.clicker('[data-testid=pass-button-zip_ties_secured_no_case]')
        inputHelpers.clicker('[data-testid=pass-button-consignee_pouch_inside]')
        inputHelpers.clicker('[data-testid=pass-button-shipper_label]')
        inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/evo_last_4_digits-input"]', inputs.evoLast4Digits)
        inputHelpers.clicker('[data-testid=pass-button-evo_match]')
        inputHelpers.clicker('[data-testid=pass-button-red_wire_tamper_seal]')
        inputHelpers.inputSingleField('[id="#/properties/shipping_receipt_checklist/properties/tamper_seal_number-input"]', inputs.tamperSealNumber)
        inputHelpers.clicker('[data-testid=pass-button-tamper_seal_match]')
        actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
          apiAliases: ['@patchProcedureSteps', '@getProcedures'],
        })
      },

    wdcShipmentReceiptChecklistSummary: (therapy, scope, patientData) => {
        // getManufAirWayBill(scope,shippingRow)
        if (Cypress.env('runWithTranslations')) {

             //TITLE
             translationHelpers.assertPageTitles("[data-test-id='wdc_shipment_receipt_checklist_summary']",
             "h1",  wdcAssertions.shippingRecieptChecklistSummary.title)

            //SECTION HEADING
            translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]',
            {index: 0,label: wdcAssertions.shippingRecieptChecklistSummary.sectionHeading})
            
            translationHelpers.assertSingleField('[data-test-id="label-verification-step-row-block"] >>> :nth(0)',
              wdcAssertions.shippingRecieptChecklistSummary.labels.labelIDCommercial)
            
            translationHelpers.assertSingleField('[data-testid="input-value"]',
              scope.coi)

            translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            0, 'div', wdcAssertions.shippingRecieptChecklistSummary.labels.manufacturingSite, 0)

            translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            1, 'div', wdcAssertions.shippingRecieptChecklistSummary.labels.treatmentSite, 0)

            //translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'span', patientData, 0)

            translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            2, 'div', wdcAssertions.shippingRecieptChecklistSummary.labels.manAWB, 0)

            // translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            // 2,'span', manAirwayBill,0);

            translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            3,'div', wdcAssertions.shippingRecieptChecklistSummary.labels.orderID,0);

            translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            4,'div', wdcAssertions.shippingRecieptChecklistSummary.labels.product,0);

            translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            4,'span', wdcAssertions.shippingRecieptChecklistSummary.labels.productValue,0);

            //SECTION HEADING 2
            translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]',
            {index: 1, label: wdcAssertions.shippingRecieptChecklistSummary.sectionHeading2});

            translationHelpers.assertTxtFieldLayout(wdcAssertions.shippingRecieptChecklistSummary.labels.caseIntactCommercial);
            translationHelpers.assertTxtFieldLayout(wdcAssertions.shippingRecieptChecklistSummary.labels.containerSecure);
            translationHelpers.assertTxtFieldLayout(wdcAssertions.shippingRecieptChecklistSummary.labels.kitPouch);
            translationHelpers.assertTxtFieldLayout(wdcAssertions.shippingRecieptChecklistSummary.labels.shipperLabelCommercial);
            translationHelpers.assertTxtFieldLayout(wdcAssertions.shippingRecieptChecklistSummary.labels.evoIsNumber, inputs.evoLast4Digits);
            translationHelpers.assertTxtFieldLayout(wdcAssertions.shippingRecieptChecklistSummary.labels.evoListenedAWB);
            translationHelpers.assertTxtFieldLayout(wdcAssertions.shippingRecieptChecklistSummary.labels.redTamper);
            translationHelpers.assertTxtFieldLayout(wdcAssertions.shippingRecieptChecklistSummary.labels.sealNumber, inputs.tamperSealNumber);
            translationHelpers.assertTxtFieldLayout(wdcAssertions.shippingRecieptChecklistSummary.labels.sealNumberonAWB);
        }

        const verifier = 'quela@vineti.com';
        common.doubleSignature(verifier);
        common.ClickPrimaryActionButton();
    },

    wdcProductRecieptSummary: (therapy, patientData) => {

        // getManufAirWayBill(scope,shippingRow)
        if (Cypress.env('runWithTranslations')) {

            //TITLE
            translationHelpers.assertPageTitles("[data-test-id='wdc_product_receipt_summary']",
            "h1",  wdcAssertions.productRecieptSummary.title)

            //SECTION HEADING
            translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]',
            {index: 0,label: wdcAssertions.productRecieptSummary.sectionHeading});

            
              translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
              0,'div', wdcAssertions.productRecieptSummary.labels.orderId,0);
            
              translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
              1,'div', wdcAssertions.productRecieptSummary.labels.product,0)

              translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
              1,'span', wdcAssertions.productRecieptSummary.labels.productValue,0)
           
            translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            2,'div', wdcAssertions.productRecieptSummary.labels.manAWB,0);

            // translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            // 2,'span', manAirwayBill,0);

            translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            3,'div', wdcAssertions.productRecieptSummary.labels.manufacturingSite,0);

            // translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            // 3,'span', patientData.siteNumber,0);
            
              translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
              4, 'div', wdcAssertions.productRecieptSummary.labels.collectionSiteName ,0)
           
            //SECTION HEADING 2
            if(therapy.unique_id == '_emea_ccdc_qr'||therapy.unique_id == '_emea_lcdc_qr' || therapy.unique_id == '_emea_lcdc'){
              translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]',
             {index: 1,label: wdcAssertions.productRecieptSummary.sectionHeading2});
            }
            else{
              translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]',
             {index: 1,label: wdcAssertions.productRecieptSummary.bagDetails});
            }
            

            translationHelpers.assertSingleField('[data-test-id="multiple-scan-block-block"] >>>> :nth(0)',
            wdcAssertions.productRecieptSummary.labels.packingLN2Shipper);

            translationHelpers.assertSingleField('[data-test-id="multiple-scan-block-block"] >>>> :nth(4)',
            wdcAssertions.productRecieptSummary.labels.bagIdPlaced);

            // cy.get('[data-test-id="multiple-scan-block-block"]').contains(wdcAssertions.productRecieptSummary.labels.sipperLabel)
            // cy.get('[data-te st-id="multiple-scan-block-block"]').contains(wdcAssertions.productRecieptSummary.labels.cryoApheresisProduct)


            //SECTION HEADING 3
            translationHelpers.assertChildElement('[data-test-id="step-header-block"]',
            'h3', wdcAssertions.productRecieptSummary.sectionHeading3);

            translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            5, 'div', wdcAssertions.productReciept.labels.apheresisID)

            translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            5, 'span', inputs.day1Bag1Udn)

            translationHelpers.assertSingleField('[data-testid="txt-field-layout-Lot number"]',
            wdcAssertions.productRecieptSummary.labels.lotNumber);

            //Confirm
            //translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 6, 'span', inputs.lotNumber)

            translationHelpers.assertTxtFieldLayout(wdcAssertions.productRecieptSummary.labels.confirmCrt);
            
            translationHelpers.assertTxtFieldLayout(wdcAssertions.productRecieptSummary.labels.sealPlace);
            translationHelpers.assertTxtFieldLayout(wdcAssertions.productRecieptSummary.labels.temperatureMonitor, "No")
            translationHelpers.assertTxtFieldLayout(wdcAssertions.productRecieptSummary.labels.expectedConditionCcdcQr);

            if(therapy.unique_id == "_emea_ccdc_qr"){
            translationHelpers.assertTxtFieldLayout(wdcAssertions.productRecieptSummary.labels.vaporPhase);
            }

            translationHelpers.assertSingleField('[data-testid="txt-field-layout-Please enter the expiry date as last 8 digits of the SEC-Product Identification Sequence (SEC-PIS) Number (Format needed: 12/JAN/2015 = 20150112). Please do not overwrite the pre-populated first 11 digits or you will not be able to proceed."]', wdcAssertions.productRecieptSummary.labels.expireDate);

            //Confirm
            translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 19, 'div', wdcAssertions.productRecieptSummary.labels.additionalComm)

        }

        const verifier = 'quela@vineti.com';
        common.doubleSignature(verifier);
        common.ClickPrimaryActionButton();
    },

    wdcPrintPackingInsert: () => {

        if (Cypress.env('runWithTranslations')) {
            //TITLE
           translationHelpers.assertPageTitles('[data-test-id="wdc_print_packing_insert"]',
           "h1", wdcAssertions.printShipperLabel.title)

           translationHelpers.assertSectionChildElement('[data-testid="print-block-container"]',
            0, 'p', wdcAssertions.printShipperLabel.labels.packingInsertCoi)

            translationHelpers.assertSectionChildElement('[data-testid="btn-print"]',
            0, 'span', wdcAssertions.printShipperLabel.labels.sipperLabelButton)

           translationHelpers.assertSingleField('[data-testid="txt-field-layout-Confirm packing insert is printed successfully"]',
           wdcAssertions.printShipperLabel.labels.packingPrinted);
        }
        cy.get('[id="#/properties/data/properties/is_confirmed"]').click();
        common.ClickPrimaryActionButton();
        common.singleSignature();
        common.ClickPrimaryActionButton();
    },

    wdcTransferProductToStorageEmea: (coi, therapy) => {
        if (Cypress.env('runWithTranslations')) {
            //TITLE
            translationHelpers.assertPageTitles("[data-test-id='wdc_transfer_product_to_storage']",
            "h1",wdcAssertions.transferProductStorage.title)

           //SECTION HEADING
           translationHelpers.assertChildElement('[data-test-id="multiple-scan-block-block"]',
           'h3', wdcAssertions.transferProductStorage.sectionHeading);

           if (therapy.unique_id == "_emea_ccdc_qr" || therapy.unique_id == '_emea_ccdc'|| therapy.unique_id == '_emea_lcdc_qr' || therapy.unique_id == '_emea_lcdc'){
            translationHelpers.assertSingleField('[data-testid="bag-1-desc"]',
            wdcAssertions.transferProductStorage.description3);
           }else {
           translationHelpers.assertSingleField('[data-testid="bag-1-desc"]',
           wdcAssertions.transferProductStorage.description);
           }

            // Labels
           translationHelpers.assertSingleField('[data-test-id="multiple-scan-block-block"] >>>>> :nth(0)',
           wdcAssertions.transferProductStorage.labels.coiScanLN2CcdcQr)

           translationHelpers.assertSingleField('[data-test-id="multiple-scan-block-block"] >>>>> :nth(2)',
           wdcAssertions.transferProductStorage.labels.coiScanCassetteCcdcQr)

       }
       cy.get('[data-testid="h1-header"]').should('contain', 'Transfer Product To Storage')

       inputHelpers.scanAndVerifyBags('cassette-1', `${coi}-FP-01`)

       inputHelpers.scanAndVerifyBags('ln-2-shipper-1', coi)

       actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
         apiAliases: ['@patchProcedureSteps', '@getProcedures'],
       })
     },

    wdcProductReceiptEmea: (therapy, pisNumber) => {
        if (Cypress.env('runWithTranslations')) {
            //TITLE
            translationHelpers.assertPageTitles("[data-test-id='wdc_product_receipt']",
            "h1",  wdcAssertions.productReciept.titleCcdcQr)

           //SECTION HEADING
           translationHelpers.assertSingleField('[data-testid="section-heading-title"]',
           wdcAssertions.productReciept.sectionHeading);

           //Labels
           translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
           0, 'div', wdcAssertions.productReciept.labels.apheresisID)

           translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
           0, 'span', inputs.day1Bag1Udn)

        //    translationHelpers.assertSingleField('[data-testid="question-text-investigational_product"]',
        //    wdcAssertions.productReciept.labels.inverstProduct);

           translationHelpers.assertSingleField('[data-testid=question-text-cart_product]',
           wdcAssertions.productReciept.labels.cartProduct);

           translationHelpers.assertSingleField('[data-testid="question-text-seal_in_place"]',
           wdcAssertions.productReciept.labels.sealPlace);

           translationHelpers.assertSingleField('[data-testid=question-text-temperature_monitor]',
           wdcAssertions.productReciept.labels.temperatureMonitorCcdcQr);

           translationHelpers.assertSingleField('[data-testid="question-text-expected_condition"]',
           wdcAssertions.productReciept.labels.expectedConditionCcdcQr);

           if(therapy.unique_id == "_emea_ccdc"){
            translationHelpers.assertSingleField('[data-testid="question-text-vapor_phase"]',
            wdcAssertions.productReciept.labels.vaporPhaseEmeaCCDC);
           }
           else{
            translationHelpers.assertSingleField('[data-testid="question-text-vapor_phase"]',
            wdcAssertions.productReciept.labels.vaporPhase);
           }


           translationHelpers.assertSingleField('[data-testid="txt-field-layout-Please enter the expiry date as last 8 digits of the SEC-Product Identification Sequence (SEC-PIS) Number (Format needed: 12/JAN/2015 = 20150112). Please do not overwrite the pre-populated first 11 digits or you will not be able to proceed."]',
           wdcAssertions.productReciept.labels.expireDate);

        //    translationHelpers.assertSingleField('[data-testid="question-text-expiry_match"]',
        //    wdcAssertions.productReciept.labels.expityMatch);

           translationHelpers.assertSingleField('[id="#/properties/product_receipt_checklist/properties/comments"]',
           wdcAssertions.productReciept.labels.additionalComm);

       }
        cy.get('[data-testid="h1-header"]').should('contain', 'Product Receipt');
        cy.get('[data-testid=pass-button-cart_product]').click();
        cy.get('[data-testid=pass-button-seal_in_place]').click();
        cy.get('[data-testid=pass-button-temperature_monitor]').click();
        cy.get('[data-testid=pass-button-expected_condition]').click();
        cy.get('[data-testid=pass-button-vapor_phase]').click();
        cy.get('[id="#/properties/product_receipt_checklist/properties/pis_number-input"]').type(pisNumber);
        // cy.get('[data-testid=pass-button-expiry_match]').click();
        common.ClickPrimaryActionButton();

    },

    wdcPrintShipperLabels: () => {
      if (Cypress.env('runWithTranslations')) {
        //TITLE
        translationHelpers.assertPageTitles("[data-test-id='wdc_print_shipper_labels']","h1",
        wdcAssertions.printShipperLabel.title)

        translationHelpers.assertSectionChildElement('[data-testid="print-block-container"]',
        0, 'p', wdcAssertions.printShipperLabel.labels.sipperLabelCoi)

        translationHelpers.assertSectionChildElement('[data-testid="btn-print"]',
        0, 'span', wdcAssertions.printShipperLabel.labels.sipperLabelButton)

        translationHelpers.assertSingleField('[data-testid="txt-field-layout-Confirm labels are printed successfully"]',
        wdcAssertions.printShipperLabel.labels.labelsPrinted)
      }
      inputHelpers.clicker('[id="#/properties/data/properties/is_confirmed"]')
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
      signatureHelpers.clickSignDocumentButton('approver', ['@postSignature'])
      actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
        apiAliases: ['@patchProcedureSteps', '@getProcedures'],
      })
    },

    wdcTransferProductToShipperEmeaCcdc: coi => {
        if (Cypress.env('runWithTranslations')) {
            //TITLE
            translationHelpers.assertPageTitles("[data-test-id='wdc_transfer_product_to_shipper']",
            "h1",wdcAssertions.transferShipper.title)

            translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            0, 'div', wdcAssertions.transferShipper.labels.apheresisID)

            translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            0, 'span', inputs.day1Bag1Udn)

            translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
            1, 'div', wdcAssertions.transferShipper.labels.shipperFromWDC)

            translationHelpers.assertSingleField('[data-testid="display-only"] > :nth(4)',
            wdcAssertions.transferShipper.labels.manufacturingSite)

            translationHelpers.assertSingleField('[data-testid="display-only"] > :nth(6)',
            wdcAssertions.transferShipper.labels.product)

            translationHelpers.assertSingleField('[data-testid="display-only"] > :nth(8)',
            wdcAssertions.transferShipper.labels.orderId)

            translationHelpers.assertSingleField('[data-testid="display-only"] > :nth(10)',
            wdcAssertions.transferShipper.labels.shipmentToTreatmentSite)

            translationHelpers.assertSingleField('[data-testid="display-only"] > :nth(12)',
            wdcAssertions.transferShipper.labels.airwayBill)

            translationHelpers.assertSingleField('[data-testid="display-only"] > :nth(14)',
            wdcAssertions.transferShipper.labels.numberOfBags);

            translationHelpers.assertSingleField('[data-testid="question-text-container_damaged"]',
            wdcAssertions.transferShipper.labels.containerDamagedCcdcQr);

            translationHelpers.assertSingleField('[data-testid="question-text-tempreture_alarm"]',
            wdcAssertions.transferShipper.labels.temperatureAlarmCcdcQr);

            translationHelpers.assertSingleField('[data-testid="question-text-shipper_kit_pouch_included"]',
            wdcAssertions.transferShipper.labels.kitPouch);

            //SECTION HEADING 2
            translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]',
            {index: 0,label: wdcAssertions.transferShipper.sectionHeading});

            translationHelpers.assertSingleField('[data-testid="section-heading-description"]',
            wdcAssertions.transferShipper.labels.description1);

            //SECTION HEADING 3
            translationHelpers.assertBlockLabel('[data-testid="h1-header"]',
            {index: 1,label: wdcAssertions.transferShipper.sectionHeading2});

            translationHelpers.assertSingleField('[data-testid=bag-1-desc]',
            wdcAssertions.transferShipper.labels.description);

            translationHelpers.assertSingleField('[data-test-id="multiple-scan-block-block"] >>>>> :nth(0)',
            wdcAssertions.transferShipper.labels.coiBagIdentifier);

            translationHelpers.assertSingleField('[data-test-id="multiple-scan-block-block"] >>>>> :nth(2)',
            wdcAssertions.transferShipper.labels.scanPacking);

       }
       inputHelpers.clicker('[data-testid=pass-button-container_damaged]')
       inputHelpers.clicker('[data-testid=pass-button-tempreture_alarm]')
       inputHelpers.clicker('[data-testid=pass-button-shipper_kit_pouch_included]')
       inputHelpers.scanAndVerifyBags('cassette-1', `${coi}-FP-01`)

       inputHelpers.scanAndVerifyBags('ln-2-shipper-1', coi)

       actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
         apiAliases: ['@patchProcedureSteps', '@getProcedures'],
       })
     },
     wdcShippingWorldDistributionCenterEmeaCcdc: (shippingRow, scope, evoLast4Digits, tamperSealNumber) => {

      if (Cypress.env('runWithTranslations')) {
          //TITLE
          translationHelpers.assertPageTitles("[data-test-id='wdc_shipping_world_distribution_center']",
          "h1",wdcAssertions.shippingWDC.title)

          translationHelpers.assertSingleField('[data-test-id="shipping-checklist-summary-block-block"] >>>> :nth(0)',
          wdcAssertions.shippingWDC.labels.dateOfShipment)

          translationHelpers.assertSingleField('[data-test-id="label-step-row-description"]',
          wdcAssertions.shippingWDC.labels.awb)

          translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
          1, 'div',wdcAssertions.shippingWDC.labels.lotNumber)
          //translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'span', lotnumber)

          translationHelpers.assertSingleField('[data-test-id="shipping-checklist-summary-block-block"] >>>> :nth(6)',
          wdcAssertions.shippingWDC.labels.orderId)

          //SECTION HEADING 2
          translationHelpers.assertSingleField('[data-testid="section-heading-title"]',
          wdcAssertions.shippingWDC.sectionHeading);

          translationHelpers.assertSingleField('[data-testid="question-text-confirm_not_exposed"]',
          wdcAssertions.shippingWDC.labels.confirmNorExposedEmeaCcdc)

          translationHelpers.assertSingleField('[data-testid=question-text-evo_airway_bill_wdc]',
          wdcAssertions.shippingWDC.labels.awbMatchEmeaCcdc);

          translationHelpers.assertChildElement('[id="#/properties/shipping_checklist/properties/evo_last_4_digits_wdc"]', 'label',
          wdcAssertions.shippingWDC.labels.digitsWDC)

          translationHelpers.assertSingleField('[data-testid="question-text-evo_airway_bill_wdc"]',
          wdcAssertions.shippingWDC.labels.evoAWB);

          translationHelpers.assertChildElement('[id="#/properties/shipping_checklist/properties/tamper_seal_number_wdc"]', 'label',
          wdcAssertions.shippingWDC.labels.sealNumberWDC)

          translationHelpers.assertSingleField('[data-testid="question-text-tamper_seal_number_listed"]',
          wdcAssertions.shippingWDC.labels.sealNumberListened);

          translationHelpers.assertSingleField('[data-testid="question-text-red_wire_tamper"]',
          wdcAssertions.shippingWDC.labels.wireTamperEmeaCcdc);

          translationHelpers.assertSingleField('[data-testid="question-text-red_wire_tamper_shipper"]',
          wdcAssertions.shippingWDC.labels.wiretamperShipper);

          translationHelpers.assertSingleField('[data-testid="question-text-shipper_label_placed_wdc"]',
          wdcAssertions.shippingWDC.labels.shipperPlacedEmeaCcdc);

          translationHelpers.assertSingleField('[data-testid="question-text-consignee_kit_pouch_inside"]',
          wdcAssertions.shippingWDC.labels.kitPouch);

          translationHelpers.assertSingleField('[data-testid="question-text-secured_container"]',
          wdcAssertions.shippingWDC.labels.secureContainerEmeaCcdc);

          translationHelpers.assertChildElement('[id="#/properties/shipping_checklist/properties/issues"]',
          'label', wdcAssertions.shippingWDC.labels.additionalComment)
     }

     getWDCAirWayBillEmea(scope, shippingRow)
     inputHelpers.clicker('[data-testid=pass-button-confirm_not_exposed]')
     cy.get('[id="#/properties/shipping_checklist/properties/evo_last_4_digits_wdc-input"]')
       .clear()
       .first()
       .type(evoLast4Digits)
     inputHelpers.clicker('[data-testid=pass-button-evo_airway_bill_wdc]')
     cy.get('[id="#/properties/shipping_checklist/properties/tamper_seal_number_wdc-input"]')
       .clear()
       .first()
       .type(tamperSealNumber)
     inputHelpers.clicker('[data-testid=pass-button-tamper_seal_number_listed]')
     inputHelpers.clicker('[data-testid=pass-button-red_wire_tamper]')
     inputHelpers.clicker('[data-testid=pass-button-red_wire_tamper_shipper]')
     inputHelpers.clicker('[data-testid=pass-button-shipper_label_placed_wdc]')
     inputHelpers.clicker('[data-testid=pass-button-consignee_kit_pouch_inside]')
     inputHelpers.clicker('[data-testid=pass-button-secured_container]')
     actionButtonsHelper.clickActionButton(actionButtonsHelper.actionButtonKeys.PRIMARY, {
       apiAliases: ['@patchProcedureSteps', '@getProcedures'],
     })
   },

   wdcShippingWorldDistributionCenterSummaryEmeaCcdc: (therapy, coi) => {

    if (Cypress.env('runWithTranslations')) {

        //TITLE
      translationHelpers.assertPageTitles("[data-test-id='wdc_shipping_world_distribution_center_summary']","h1",  wdcAssertions.shippingWDCSummary.title)

       //SECTION HEADING
       if(therapy.unique_id == "_emea_ccdc"){
         translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]',
         {index: 0, label: wdcAssertions.shippingWDCSummary.sectionHeading1 })
       }
       else{
        translationHelpers.assertSingleField('[data-testid=section-heading-title]',
        wdcAssertions.shippingWDCSummary.sectionHeading1);
       }

       translationHelpers.assertSingleField('[data-test-id="ordering-summary-block-block"] >>>>>> :nth(0)',
       wdcAssertions.shippingWDCSummary.labels.orderId);

       translationHelpers.assertSingleField('[data-test-id="ordering-summary-block-block"] >>>>>> :nth(2)',
       wdcAssertions.shippingWDCSummary.labels.product)

       translationHelpers.assertSingleField('[data-test-id="ordering-summary-block-block"] >>>>>> :nth(4)',
       wdcAssertions.shippingWDCSummary.labels.shipmentFrom)

       translationHelpers.assertSingleField('[data-test-id="ordering-summary-block-block"] >>>>>> :nth(6)',
       wdcAssertions.shippingWDCSummary.labels.siteNumber)

       translationHelpers.assertSingleField('[data-test-id="ordering-summary-block-block"] >>>>>> :nth(8)',
       wdcAssertions.shippingWDCSummary.labels.dateOfShipment)

       translationHelpers.assertSingleField('[data-testid=display-only] > :nth(12)',
       wdcAssertions.shippingWDCSummary.labels.manAWB)

       if(therapy.unique_id == "_emea_ccdc_qr"){
        translationHelpers.assertSingleField('[data-testid=display-only] > :nth(14)',
        wdcAssertions.shippingWDCSummary.labels.apheresisID)
       }
       else{
        translationHelpers.assertSingleField('[data-testid=display-only] > :nth(14)',
        wdcAssertions.shippingWDCSummary.labels.apheresisID)
       }

       translationHelpers.assertSingleField('[data-testid=display-only] > :nth(16)',
       wdcAssertions.shippingWDCSummary.labels.numberOfBags)

       translationHelpers.assertSingleField('[data-test-id="multiple-scan-block-block"] >>>> :nth(0)',
       wdcAssertions.shippingWDCSummary.labels.coiBagIdentifier)

       translationHelpers.assertSingleField('[data-test-id="multiple-scan-block-block"] >>>> :nth(4)',
       wdcAssertions.shippingWDCSummary.labels.scanPacking)

       cy.get('[data-test-id="multiple-scan-block-block"] >>>> :nth(2)').contains( `${coi}-FP-01`);

       cy.get('[data-test-id="multiple-scan-block-block"] >>>> :nth(6)').contains( coi);

       //SECTION HEADING 2
       if(therapy.unique_id == "_emea_ccdc"){
        translationHelpers.assertBlockLabel('[data-testid="section-heading-title"]',
        {index: 1, label: wdcAssertions.shippingWDCSummary.sectionHeading2})
      }
      else{
       translationHelpers.assertSingleField('[data-test-id="step-header-block"] >> :nth(0)',
       wdcAssertions.shippingWDCSummary.sectionHeading2)
      }
       translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the shipping container case intact? If the shipping container is damaged or not in expected condition, please contact Janssen Vein to Vein team."]',
       wdcAssertions.shippingWDCSummary.labels.caseIntactEmeaCcdc);

       if(therapy.unique_id == "_emea_ccdc_qr"||therapy.unique_id == "_emea_lcdc_qr" | therapy.unique_id == "_emea_lcdc"){
        translationHelpers.assertSingleField('[data-testid="txt-field-layout-Was there a temperature out-of-range alarm received? If yes, contact immediately CDT and do NOT proceed until further instructions are given."]',
        wdcAssertions.shippingWDCSummary.labels.temperatureAlarm);
       }
       else{
         translationHelpers.assertSingleField('[data-testid="txt-field-layout-Was there a temperature out-of-range alarm received? If yes, contact Janssen Vein to Vein team immediately and do NOT proceed until further instructions are given."]',
         wdcAssertions.shippingWDCSummary.labels.temperatureAlarmCcdcQr)
       }
       translationHelpers.assertSingleField('[data-testid="txt-field-layout-Are the Shipper kit pouch and Consignee kit pouch included with the LN2 shipper?"]',
       wdcAssertions.shippingWDCSummary.labels.kitPouchIncluded);

       translationHelpers.assertSingleField('[data-testid="txt-field-layout-Confirm CAR-T product cassette(s) were not exposed to ambient temperature greater than 3 minutes."]',
       wdcAssertions.shippingWDCSummary.labels.investProductEmeaCcdc);

       translationHelpers.assertSingleField('[data-testid="txt-field-layout-Please enter the last 4-digits of the EVO-IS Number on the LN2 shipper lid."]',
       wdcAssertions.shippingWDCSummary.labels.evoIsNumber);

       translationHelpers.assertSingleField('[data-testid="txt-field-layout-Does the EVO-IS Number listed on the Air Waybill match the EVO-IS Number on the LN2 shipper lid?"]',
       wdcAssertions.shippingWDCSummary.labels.evoListenedAWB);

       translationHelpers.assertSingleField('[data-testid="txt-field-layout-Please enter the Tamper Seal Number on LN2 shipper lid."]',
       wdcAssertions.shippingWDCSummary.labels.sealNumber);

       translationHelpers.assertSingleField('[data-testid="txt-field-layout-Does the Tamper Seal Number listed on the Air Waybill match the Tamper Seal Number on the LN2 shipper lid?"]',
       wdcAssertions.shippingWDCSummary.labels.sealNumberonAWB);

       translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the red wire tamper seal labeled “RACK” in place on the cassette rack?"]',
       wdcAssertions.shippingWDCSummary.labels.wireTamperEmeaCcdc);

       translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the red wire tamper seal in place for LN2 shipper lid?"]',
       wdcAssertions.shippingWDCSummary.labels.redWire)

       translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the packing insert included with the shipper?"]',
       wdcAssertions.shippingWDCSummary.labels.shipperLabelEmeaCcdc);

       translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the Consignee kit pouch included with the shipper?"]',
       wdcAssertions.shippingWDCSummary.labels.kitPouch);

       translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the shipper container secured?"]',
       wdcAssertions.shippingWDCSummary.labels.containerSecuredEmeaCcdc)

       translationHelpers.assertSingleField('[data-testid="display-only"] > :nth(66)',
       wdcAssertions.shippingWDCSummary.labels.additionalComment)

      //  translationHelpers.assertSingleField('[data-test-id="multiple-scan-block-block"] >>>> :nth(8)',
      //  wdcAssertions.shippingWDCSummary.labels.scanCoi)
   }

   const verifier = 'quela@vineti.com';
   common.doubleSignature(verifier);
   common.ClickPrimaryActionButton();

},
   }
