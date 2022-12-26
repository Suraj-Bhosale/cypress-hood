import inputChecker from '../../shared_block_helpers/inputFieldCheckHelpers';
import infusionAssertions from '../../../fixtures/infusionAssertions.json';
import translationHelpers from "../../../utils/shared_block_helpers/translationHelpers";
import manufacturingAssertions from '../../../fixtures/manufacturingAssertions.json';
import collectionAssertions from '../../../fixtures/collectionAssertions.json';
import orderingassertions from '../../../fixtures/orderingAssertions.json'
import inputs from '../../../fixtures/inputs.json';

export default {
  shipmentReceiptSummaryEu: () => {
    cy.log('Shipment Receipt Summary');
    translationHelpers.assertPageTitles('[data-test-id="infusion_shipment_receipt_summary"]','h1',
      infusionAssertions.shipmentReceiptSummary.title)
    translationHelpers.assertSingleField('[data-testid="progress-receive_product-name"]',
      infusionAssertions.shipmentReceiptSummary.phaseName);
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]',
      infusionAssertions.shipmentReceiptSummary.sectionChecklist,0)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]',
      infusionAssertions.shipmentReceiptSummary.sectionCondition,1)  
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the shipping container in good intact condition?"]',
      infusionAssertions.shipmentReceiptSummary.shippingIntact)
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the seal on the shipper intact?"]',
      infusionAssertions.shipmentReceiptSummary.sealIntact)
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Additional Comments (Optional)"]',
      infusionAssertions.shipmentReceiptSummary.additionalComments)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="section-heading-title"]',
      infusionAssertions.shipmentReceiptSummary.review,2)
    inputChecker.nextButtonCheck('be.enabled');
    inputChecker.backButtonCheck('[data-testid=back-nav-link]');
  },

  finishedProductReceiptSummary: (i) => {
    cy.log('Finished Product Receipt Summary');
    translationHelpers.assertPageTitles('[data-test-id="infusion_finished_product_receipt_summary"]','h1',
      infusionAssertions.finishedProductReceiptSummary.title)
    translationHelpers.assertSingleField('[data-testid="progress-receive_product-name"]',
      infusionAssertions.finishedProductReceiptChecklist.phaseName);
      cy.log("i is :"+i)
      if(i == 3){
        translationHelpers.assertSectionChildElement('[data-test-id="multiple-scan-block-block"]>div>div>div',
          0,'div', infusionAssertions.finishedProductReceiptSummary.scanBag2,0);
        cy.get(`@coi`).then(coi =>{
        translationHelpers.assertSectionChildElement('[data-test-id="multiple-scan-block-block"]>div>div>div',
          1,'div', `${coi}-FP-02`,0);
        translationHelpers.assertSectionChildElement('[data-test-id="multiple-scan-block-block"]>div>div>div',
          2,'div', infusionAssertions.finishedProductReceiptSummary.scanBag4,0);
        translationHelpers.assertSectionChildElement('[data-test-id="multiple-scan-block-block"]>div>div>div',
          3,'div', `${coi}-FP-04`,0);
        });
      } else if (i == 5){
        translationHelpers.assertSectionChildElement('[data-test-id="multiple-scan-block-block"]>div>div>div',
          0,'div', infusionAssertions.finishedProductReceiptSummary.scanBag1,0);
        cy.get(`@coi`).then(coi =>{  
        translationHelpers.assertSectionChildElement('[data-test-id="multiple-scan-block-block"]>div>div>div',
          1,'div', `${coi}-FP-01`,0);
        translationHelpers.assertSectionChildElement('[data-test-id="multiple-scan-block-block"]>div>div>div',
          2,'div', infusionAssertions.finishedProductReceiptSummary.scanBag3,0);
        translationHelpers.assertSectionChildElement('[data-test-id="multiple-scan-block-block"]>div>div>div',
          3,'div', `${coi}-FP-03`,0);
        });   
      }
      translationHelpers.assertSectionChildElement('[data-test-id="multiple-scan-block-block"]>div>div>div',
        0,'div', "Confirmed",1);
      translationHelpers.assertSectionChildElement('[data-test-id="multiple-scan-block-block"]>div>div>div',
        2,'div', "Confirmed",1);
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Does the temperature data conform to standards?"]',
        infusionAssertions.finishedProductReceiptSummary.tempData)
      translationHelpers.assertSingleField('[data-testid="#/properties/shipment/properties/shipping_receipt_checklist/properties/temp_data_conform"]',
        "Yes")
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the finished product bag in expected good condition?"]',
          infusionAssertions.finishedProductReceiptSummary.expectedGoodCond)  
      translationHelpers.assertSingleField('[data-testid="#/properties/shipment/properties/shipping_receipt_checklist/properties/fp_condition"]',
        'Yes')
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Additional Comments (Optional)"]',
        infusionAssertions.finishedProductReceiptSummary.addData)
      translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',1,'h3',
        infusionAssertions.finishedProductReceiptSummary.review,0)
      inputChecker.nextButtonCheck('be.enabled');
      inputChecker.backButtonCheck('[data-testid=back-nav-link]');
  },

  collectionSummary: () => {
    cy.log('Collection Summary');
    translationHelpers.assertPageTitles('[data-test-id="manufacturing_collection_summary"]','h1',
    manufacturingAssertions.collectionSummary.title)
    translationHelpers.assertSingleField('[data-testid="progress-receive_materials-name"]',
      manufacturingAssertions.collectionSummary.phaseName)
    translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',
      0,'div', manufacturingAssertions.collectionSummary.sectionFirst,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      0,'div', manufacturingAssertions.collectionSummary.collectionDate,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      1,'div', manufacturingAssertions.collectionSummary.collectionIDMResults,0); 
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      1,'span', manufacturingAssertions.collectionSummary.collectionIDMResultsValue,0); 
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      2,'div', manufacturingAssertions.collectionSummary.dinUdn,0); 
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      2,'span', manufacturingAssertions.collectionSummary.dinUdnValue,0); 
    translationHelpers.assertSectionChildElement('[data-test-id="view-document-block"]',
      0,'p', manufacturingAssertions.collectionSummary.orderSummary,0);
    translationHelpers.assertSectionChildElement('[data-test-id="view-document-block"]',
      1,'p', manufacturingAssertions.collectionSummary.collectionSummary,0);
    inputChecker.nextButtonCheck('be.enabled');
    inputChecker.backButtonCheck('[data-testid=back-nav-link]');
  },

  shipmentReceiptSummary: () => {
    cy.log('Shipment Receipt Summary');
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_shipment_receipt_summary"]','h1',
        manufacturingAssertions.shipmentReceiptSummary.title)
      translationHelpers.assertSingleField('[data-testid="progress-receive_materials-name"]',
        manufacturingAssertions.shipmentReceiptSummary.phaseName)
      translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',0,'h3',
        manufacturingAssertions.shipmentReceiptSummary.headerFirst)
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',0,'div',
        manufacturingAssertions.shipmentReceiptSummary.airwayBillno,0)
      translationHelpers.assertSectionChildElement('[data-test-id="step-header-block"]',0,'h3',
        manufacturingAssertions.shipmentReceiptSummary.headerSecond,0)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the shipping container in good intact condition?"]',
        manufacturingAssertions.shipmentReceiptSummary.shippingContainerCondition)
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the seal on the shipper intact?"]',
        manufacturingAssertions.shipmentReceiptSummary.shippingSealIntact);
      inputChecker.nextButtonCheck('be.enabled');
      inputChecker.backButtonCheck('[data-testid=back-nav-link]');
  },

    apheresisProductReceiptSummaryEu: () => {
      cy.log('Apheresis Product Receipt Summary');
      translationHelpers.assertPageTitles('[data-test-id="manufacturing_apheresis_product_receipt_summary"]','h1',
      manufacturingAssertions.apheresisProductReceiptSummary.title)
      translationHelpers.assertSingleField('[data-testid="progress-receive_materials-name"]',
        manufacturingAssertions.apheresisProductReceiptSummary.phaseName)
      translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',0,
        'h3', manufacturingAssertions.apheresisProductReceiptSummary.bagScan,0);
      translationHelpers.assertSectionChildElement('[data-test-id="shipping-checklist-summary-block-block"]',0,
        'h3', manufacturingAssertions.apheresisProductReceiptSummary.materialConditionDetails,0);
      translationHelpers.assertSingleField('[data-testid="txt-field-layout-Is the collection bag in expected good condition?"]',
        manufacturingAssertions.apheresisProductReceiptSummary.collectionBagCondition)
      inputChecker.nextButtonCheck('be.enabled');
      inputChecker.backButtonCheck('[data-testid=back-nav-link]');
    },

  manufacturingSummary: () => {
    cy.log('Manufacturing Summary');
    translationHelpers.assertPageTitles('[data-test-id="manufacturing_manufacturing_summary"]','h1',
    manufacturingAssertions.manufacturingSummary.title)
    translationHelpers.assertSingleField('[data-testid="progress-manufacture_complete-name"]',
      manufacturingAssertions.manufacturingSummary.phaseName)
    translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]', 0, 'h3',
      manufacturingAssertions.manufacturingSummary.headingSubjectInformation)
    translationHelpers.assertSectionChildElement('[data-test-id="step-header-block"]', 0, 'h3',
      manufacturingAssertions.manufacturingSummary.headingManufacturingStart)
    translationHelpers.assertSectionChildElement('[data-test-id="shipping-checklist-summary-block-block"]', 0, 'h3',
      manufacturingAssertions.manufacturingSummary.headingHarvesting)
    translationHelpers.assertSectionChildElement('[data-test-id="step-header-block"]', 1, 'h3',
      manufacturingAssertions.manufacturingSummary.headingPrint)
    translationHelpers.assertSectionChildElement('[data-test-id="shipping-checklist-summary-block-block"]', 1, 'h3',
      manufacturingAssertions.manufacturingSummary.headingConfirmBags)
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 0, 'div',
      manufacturingAssertions.manufacturingSummary.subjectId,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 1, 'div',
      manufacturingAssertions.manufacturingSummary.apheresisId);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 2, 'div',
      manufacturingAssertions.manufacturingSummary.manufacturingStart);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 3, 'div',
      manufacturingAssertions.manufacturingSummary.manufacturingProcess);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 4, 'div',
      manufacturingAssertions.manufacturingSummary.totalVolume);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 5, 'div',
      manufacturingAssertions.manufacturingSummary.contents);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 6, 'div',
      manufacturingAssertions.manufacturingSummary.manufacturedOn);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]', 7, 'div',
      manufacturingAssertions.manufacturingSummary.expiration);
    translationHelpers.assertSectionChildElement('[data-test-id="checkbox-block-block"]', 0, 'p',
      manufacturingAssertions.manufacturingSummary.confirmBags);
    translationHelpers.assertSectionChildElement('[data-test-id="checkbox-block-block"]', 1, 'p',
      manufacturingAssertions.manufacturingSummary.applyBags);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',9,
    'div',manufacturingAssertions.manufacturingSummary.howManyBags,0)
      inputChecker.nextButtonCheck('be.enabled');
      inputChecker.backButtonCheck('[data-testid=back-nav-link]');
    },

  sponserReleaseSummary: () => {
    cy.log('Sponsor Release Summary');
    translationHelpers.assertPageTitles('[data-test-id="manufacturing_sponser_release_summary"]','h1',
      manufacturingAssertions.sponserReleaseSummary.title)
    translationHelpers.assertSingleField('[data-testid="progress-sponser_release-name"]',
      manufacturingAssertions.sponserReleaseSummary.phaseName)
    translationHelpers.assertChildElement('[data-test-id="view-document-block"]', 'p',
      manufacturingAssertions.sponserReleaseSummary.summaryText)
    inputChecker.nextButtonCheck('be.enabled');
    inputChecker.backButtonCheck('[data-testid=back-nav-link]');
  },

  shippingSummary: () => {
    cy.log('Shipping Summary');
    translationHelpers.assertPageTitles('[data-test-id="manufacturing_shipping_summary"]','h1',
      manufacturingAssertions.shippingSummary.title)
    translationHelpers.assertSingleField('[data-testid="progress-ship_product-name"]',
      manufacturingAssertions.shippingSummary.phaseName)
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Attach shipping labels to shipper."]',
      manufacturingAssertions.shippingSummary.attachLabels);
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Scan or enter the Air Waybill number on the shipping labels"]',
      manufacturingAssertions.shippingSummary.awbNumber)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>div',manufacturingAssertions.shippingSummary.additionalComments,4)
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Pack and load the finished product into the shipper according to the instructions provided."]',
      manufacturingAssertions.shippingSummary.packLoadFp)
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Place summary documents in the shipper."]',
      manufacturingAssertions.shippingSummary.summaryDocuments)
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Shipper has been sealed."]',
      manufacturingAssertions.shippingSummary.shipperSealed)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>div',manufacturingAssertions.shippingSummary.additionalComments,12)
    inputChecker.nextButtonCheck('be.enabled');
    inputChecker.backButtonCheck('[data-testid=back-nav-link]');
  },

  shippingSummaryCollection: () => {
    cy.log('Shipping Summary');
    translationHelpers.assertPageTitles('[data-test-id="collection_shipping_summary"]','h1',
      collectionAssertions.shippingSummary.stepTitle)
    translationHelpers.assertSingleField('[data-testid=progress-ship_materials-name]',
      collectionAssertions.shippingSummary.phaseName)
    translationHelpers.assertBlockLabelWithIndex('[data-test-id="collection-summary-block"]>>h3', collectionAssertions.shippingSummary.sectionHeading1, 0);
    translationHelpers.assertBlockLabelWithIndex('[data-test-id="collection-summary-block"]>>h3', collectionAssertions.shippingSummary.sectionHeading2, 1);
    translationHelpers.assertBlockLabelWithIndex('[data-test-id="collection-summary-block"]>>h3', collectionAssertions.shippingSummary.sectionHeading3, 2);
    translationHelpers.assertSingleField('[data-testid="section-heading-title"]', collectionAssertions.shippingSummary.sectionHeading4);
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 0, label: collectionAssertions.shippingSummary.attachShipperLabel, value: collectionAssertions.shippingSummary.attachShipperLabelValue})
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 1, label: collectionAssertions.shippingSummary.scanOrEnterAirway, value: collectionAssertions.shippingSummary.scanOrEnterAirwayValue})
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 3, label: collectionAssertions.shippingSummary.placeProductIntoShipper, value: collectionAssertions.shippingSummary.placeProductIntoShipperValue})  
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 4, label: collectionAssertions.shippingSummary.placeSummaryDoc, value: collectionAssertions.shippingSummary.placeSummaryDocValue})
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 5, label: collectionAssertions.shippingSummary.shipperSealed, value: collectionAssertions.shippingSummary.shipperSealedValue})
    translationHelpers.assertBlockLabel('[data-testid="display-only"]',
      {index: 6, label: collectionAssertions.shippingSummary.additionalComment})
    inputChecker.nextButtonCheck('be.enabled');
    inputChecker.backButtonCheck('[data-testid=back-nav-link]');
  },

  collectionSummaryCollection: () => {
    cy.log('Collection Summary');
    translationHelpers.assertPageTitles('[data-test-id="collection_collection_summary"]','h1',
      collectionAssertions.collectionSummary.stepTitle)
    translationHelpers.assertSingleField('[data-testid=progress-perform_collection-name]',
      collectionAssertions.collectionSummary.phaseName)
    translationHelpers.assertSectionChildElement('[data-test-id="collection-summary-block"]',
      0,'h3', collectionAssertions.collectionSummary.sectionHeading1, 0);
    translationHelpers.assertSectionChildElement('[data-test-id="collection-summary-block"]',
      1,'h3', collectionAssertions.collectionSummary.sectionHeading2, 0);
    translationHelpers.assertSectionChildElement('[data-test-id="collection-summary-block"]',
      2,'h3', collectionAssertions.collectionSummary.sectionHeading3, 0);
    translationHelpers.assertSectionChildElement('[data-test-id="section-heading-block-block"]',
      0,'h3', collectionAssertions.collectionSummary.sectionHeading4, 0);
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Scan or enter the DIN/Unique Donation Number/Apheresis ID from your site\'s labels."]',
      collectionAssertions.collectionSummary.enterAndConfirmDescription);
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Confirm that your site\'s pre-collection label has been applied to the bag."]',
      collectionAssertions.collectionSummary.checkbox1Description);
    translationHelpers.assertSingleField('[data-testid="txt-field-layout-Confirm that you have applied the sponsor-provided label to the collection bag."]',
      collectionAssertions.collectionSummary.checkbox2Description);
    translationHelpers.assertSectionChildElement('[data-test-id="label-verification-step-row-block"]',
      0, 'div', collectionAssertions.collectionSummary.scanAndVerifyLabel, 2);
    cy.get(`@coi`).then(coi => { 
        translationHelpers.assertBlockLabelWithIndex('[data-test-id="label-verification-step-row-block"]>>>div', coi, 2)
    })
    translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>div',
      collectionAssertions.collectionSummary.dinNumber , 1)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>div',
      collectionAssertions.collectionSummary.yesLabel, 2)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>div',
      collectionAssertions.collectionSummary.yesLabel, 4)
    translationHelpers.assertBlockLabelWithIndex('[data-test-id="label-verification-step-row-block"]>>> div',
      collectionAssertions.collectionSummary.confirmed, 1)  
    translationHelpers.assertBlockData('[data-testid="display-only"]',
        {index: 3, label: collectionAssertions.collectionSummary.subjectHeightLabel, value: collectionAssertions.collectionSummary.subjectHeightValue})
    translationHelpers.assertBlockData('[data-testid="display-only"]',
        {index: 4, label: collectionAssertions.collectionSummary.subjectWeightLabel, value: collectionAssertions.collectionSummary.subjectWeightValue})
    translationHelpers.assertBlockData('[data-testid="display-only"]',
        {index: 5, label: collectionAssertions.collectionSummary.mnAaCollectionInformation, value: collectionAssertions.collectionSummary.mnAaCollectionInformationValue})
    translationHelpers.assertBlockData('[data-testid="display-only"]',
        {index: 6, label: collectionAssertions.collectionSummary.collectionProgram, value: collectionAssertions.collectionSummary.collectionProgramValue})
    translationHelpers.assertBlockData('[data-testid="display-only"]',
        {index: 7, label: collectionAssertions.collectionSummary.venousAccess, value: collectionAssertions.collectionSummary.venousAccessValue});
    translationHelpers.assertBlockData('[data-testid="display-only"]',
        {index: 8, label: collectionAssertions.collectionSummary.criticalSuppliesInspected, value: collectionAssertions.collectionSummary.criticalSuppliesInspectedValue});
    translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>div',
        collectionAssertions.collectionSummary.collectionDate , 20)
    translationHelpers.assertSingleField('[data-testid="#/properties/collection_session/properties/apheresis_date"]',
        inputs.collection.global.mncInputDate);
    translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>div',
        collectionAssertions.collectionSummary.collectionStartTime , 22)
    translationHelpers.assertBlockLabelWithIndex('[data-testid="display-only"]>div',
        collectionAssertions.collectionSummary.collectionEndTime , 24)
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 13, label: collectionAssertions.collectionSummary.wholeBloodVolumeProcessed, value: collectionAssertions.collectionSummary.wholeBloodVolumeProcessedValue});
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      13,'span', inputs.collection.global.bloodProcessedInput,0);
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 14, label: collectionAssertions.collectionSummary.totalAnticoagulantInProduct, value: collectionAssertions.collectionSummary.totalAnticoagulantInProductValue});
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      14,'span', inputs.collection.global.anticoagulantVolumeInput,0);
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 15, label: collectionAssertions.collectionSummary.enterAnticoagulantType, value: collectionAssertions.collectionSummary.enterAnticoagulantTypeValue});
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      15,'span', inputs.collection.global.anticoagulantTypeInput,0);
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 16, label: collectionAssertions.collectionSummary.additionalAnticoagulantAdded, value: collectionAssertions.collectionSummary.additionalAnticoagulantAddedValue});
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 17, label: collectionAssertions.collectionSummary.autologousPlasmaVolume, value: collectionAssertions.collectionSummary.autologousPlasmaVolumeValue});
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 18, label: collectionAssertions.collectionSummary.productVolume, value: collectionAssertions.collectionSummary.productVolumeValue});
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      18,'span', inputs.collection.global.productVolumeInput,0);
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 19, label: collectionAssertions.collectionSummary.totalMncYield, value:collectionAssertions.collectionSummary.totalMncYieldValue});
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      19,'span', inputs.collection.global.totalYieldInput,0); 
    translationHelpers.assertBlockData('[data-testid="display-only"]',
      {index: 20, label: collectionAssertions.collectionSummary.totalProductVolume, value: collectionAssertions.collectionSummary.totalProductVolumeValue});
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      20,'span', inputs.collection.global.totalVolumeInput,0);   
    inputChecker.nextButtonCheck('be.enabled');
    inputChecker.backButtonCheck('[data-testid=back-nav-link]');
  },

  approveOrder: (subjectId) => {
    cy.log('Approve Order');
    translationHelpers.assertPageTitles('[data-test-id="ordering_approve_order"]','h1',
      orderingassertions.approveOrder.title);
    translationHelpers.assertSingleField('[data-testid=progress-approve_order-name]',
      orderingassertions.approveOrder.phaseName);
    translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3',
      orderingassertions.approveOrder.subjectInformationHeading);
    translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3',
      orderingassertions.approveOrder.studyInformationHeading, 1);
    translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3',
      orderingassertions.approveOrder.treatmentOrderingSiteHeading, 2);
    translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3',
      orderingassertions.approveOrder.principalInvestigatorheading, 3);
    cy.wait(3000);
    translationHelpers.assertChildElement('[data-test-id="section-heading-block-block"]', 'h3',
      orderingassertions.approveOrder.reviewedAndConfirmed, 0);
    translationHelpers.assertChildElement('[data-test-id="section-heading-block-block"]', 'h3',
      orderingassertions.approveOrder.approveOrder, 1)  
    translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3',
      orderingassertions.approveOrder.schedulingHeading, 4)
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      0,'div', orderingassertions.approveOrder.dateOfBirth,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      0,'span', inputs.ordering.global.patientDateOfBirth,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      1,'div', orderingassertions.approveOrder.product,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      1,'span', orderingassertions.approveOrder.productName,0);   
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      2,'div', orderingassertions.approveOrder.indication,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      2,'span', orderingassertions.approveOrder.indicationName,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      3,'div', orderingassertions.approveOrder.subjectId,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      3,'span', subjectId,0);    
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      4,'div', orderingassertions.approveOrder.toggleDescription,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      4,'span', orderingassertions.approveOrder.toggleDescriptionValue,0);  

    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      5,'div', orderingassertions.confirmSubjectEligibility.subjectEligibilityConfirmed,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      5,'span', orderingassertions.approveOrder.subjectEligibilityConfirmedValue,0);  

    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      6,'div', orderingassertions.approveOrder.siteName,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      6,'span', orderingassertions.approveOrder.siteNameValue,0);  
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      7,'div', orderingassertions.approveOrder.siteNumber,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      8,'div', orderingassertions.approveOrder.siteAddress,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      8,'span', orderingassertions.approveOrder.siteAddressValue,0);  
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      9,'div', orderingassertions.approveOrder.siteCity,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      9,'span', orderingassertions.approveOrder.siteCityValue,0);  
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      10,'div', orderingassertions.approveOrder.siteCountry,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      10,'span', orderingassertions.approveOrder.siteCountryValue,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      11,'div', orderingassertions.approveOrder.sitePostalCode,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      11,'span', orderingassertions.approveOrder.sitePostalCodeValue,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      12,'div', orderingassertions.approveOrder.principalInvestigatorName,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      12,'span', orderingassertions.approveOrder.principalInvestigatorNameValue,0);  
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      13,'div', orderingassertions.approveOrder.collectionDate,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      14,'div', orderingassertions.approveOrder.collectionSiteName,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      14,'span', orderingassertions.approveOrder.collectionSiteNameValue,0);  
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      15,'div', orderingassertions.approveOrder.collectionSiteNumber,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      16,'div', orderingassertions.approveOrder.collectionSiteAddress,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      16,'span', orderingassertions.approveOrder.collectionSiteAddressValue,0);   
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      17,'div', orderingassertions.approveOrder.siteCity,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      17,'span', orderingassertions.approveOrder.siteCityValue,0);  
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      18,'div', orderingassertions.approveOrder.siteCountry,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      18,'span', orderingassertions.approveOrder.siteCountryValue,0); 
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      19,'div', orderingassertions.approveOrder.sitePostalCode,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      19,'span', orderingassertions.approveOrder.sitePostalCodeValue,0); 
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      20,'div', orderingassertions.approveOrder.collectionSiteContactName,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      20,'span', orderingassertions.approveOrder.collectionSiteContactNameValue,0);   
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      21,'div', orderingassertions.approveOrder.collectionSiteContactNumber,0);
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      21,'span', orderingassertions.approveOrder.collectionSiteContactNumberValue,0);    
    translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
      22,'div', orderingassertions.approveOrder.collectionSiteAdditionalNotes,0);
    inputChecker.backButtonCheck('[data-testid=back-nav-link]');
  },

  confirmOrder: (subjectId) => {
    cy.log('Confirm Order');
      translationHelpers.assertPageTitles('[data-test-id="ordering_confirm_order"]','h1',
        orderingassertions.confirmOrder.title);
      translationHelpers.assertSingleField('[data-testid="progress-confirm_order-name"]',
        orderingassertions.confirmOrder.phaseName);
      translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3',
        orderingassertions.confirmOrder.subjectInformationHeading);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        0,'div', orderingassertions.confirmOrder.dateOfBirth,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        0,'span', inputs.ordering.global.patientDateOfBirth,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        1,'div', orderingassertions.confirmOrder.product,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        1,'span', orderingassertions.confirmOrder.productName,0);  
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        2,'div', orderingassertions.confirmOrder.indication,0);
        translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        2,'span', orderingassertions.confirmOrder.indicationName,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        3,'div', orderingassertions.confirmOrder.subjectId,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        3,'span', subjectId,0);  
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        4,'div', orderingassertions.confirmOrder.toggleDescription,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        4,'span', orderingassertions.confirmOrder.toggleDescriptionValue,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        5,'div', orderingassertions.confirmOrder.siteName,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        5,'span', orderingassertions.confirmOrder.siteNameValue,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        6,'div', orderingassertions.confirmOrder.siteNumber,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        7,'div', orderingassertions.confirmOrder.siteAddress,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        7,'span', orderingassertions.confirmOrder.siteAddressValue,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        8,'div', orderingassertions.confirmOrder.siteCity,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        8,'span', orderingassertions.confirmOrder.siteCityValue,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        9,'div', orderingassertions.confirmOrder.siteCountry,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        9,'span', orderingassertions.confirmOrder.siteCountryValue,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        10,'div', orderingassertions.confirmOrder.sitePostalCode,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        10,'span', orderingassertions.confirmOrder.sitePostalCodeValue,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        11,'div', orderingassertions.confirmOrder.principalInvestigatorName,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        11,'span', orderingassertions.confirmOrder.principalInvestigatorNameValue,0);
      cy.wait(3000);

      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        12,'div', orderingassertions.confirmOrder.collectionDate,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        13,'div', orderingassertions.confirmOrder.collectionSiteName,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        13,'span', orderingassertions.confirmOrder.collectionSiteNameValue,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        14,'div', orderingassertions.confirmOrder.collectionSiteNumber,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        15,'div', orderingassertions.confirmOrder.collectionSiteAddress,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        15,'span', orderingassertions.confirmOrder.collectionSiteAddressValue,0);  
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        16,'div', orderingassertions.confirmOrder.siteCity,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        16,'span', orderingassertions.confirmOrder.siteCityValue,0);  
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        17,'div', orderingassertions.confirmOrder.siteCountry,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        17,'span', orderingassertions.confirmOrder.siteCountryValue,0);  
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        18,'div', orderingassertions.confirmOrder.sitePostalCode,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        18,'span', orderingassertions.confirmOrder.sitePostalCodeValue,0);  
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        19,'div', orderingassertions.confirmOrder.collectionSiteContactName,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        19,'span', orderingassertions.confirmOrder.collectionSiteContactNameValue,0);  
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        20,'div', orderingassertions.confirmOrder.collectionSiteContactNumber,0);
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        20,'span', orderingassertions.confirmOrder.collectionSiteContactNumberValue,0);  
      translationHelpers.assertSectionChildElement('[data-testid="display-only"]',
        21,'div', orderingassertions.confirmOrder.collectionSiteAdditionalNotes,0);
      translationHelpers.assertSingleField('[data-test-id="section-heading-block-block"]',
        orderingassertions.confirmOrder.reviewAndConfirm);
      translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3',
        orderingassertions.confirmOrder.treatmentOrderingSiteHeading, 2);
      translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3',
        orderingassertions.confirmOrder.principalInvestigatorheading, 3);
      translationHelpers.assertChildElement('[data-test-id="ordering-summary-block"]', 'h3',
        orderingassertions.confirmOrder.schedulingHeading, 4);
      inputChecker.backButtonCheck('[data-testid=back-nav-link]');
  },
}