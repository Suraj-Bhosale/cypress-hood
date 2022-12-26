import orderingSteps from '../../utils/HappyPath_steps/CD30_EU_SG_HappyPath/ordering_steps';
import collectionSteps from "../../utils/HappyPath_steps/CD30_EU_SG_HappyPath/collection_steps";
import satelliteLabSteps from "../../utils/HappyPath_steps/CD30_EU_SG_HappyPath/satellite_lab_steps";
import mfgStepsEu from '../../utils/HappyPath_steps/CD30_EU_SG_HappyPath/manufacturing_steps.js';
import infusionSteps from '../../utils/HappyPath_steps/CD30_EU_SG_HappyPath/infusion_steps';
import dayjs from 'dayjs';

describe('EU-SG Tesscar Happy Path', () => {
  let scope = {};

  describe('Ordering Flow', () => {
    before(() => {
      cy.log('login Nina');
      cy.platformLogin('nina@vineti.com');
    });
    beforeEach(() => {
      orderingSteps.orderingAliases('CD30CAR-T:cHL:tesscar001');
      orderingSteps.orderingData(scope);
    });
    it('Create and Approve Order', () => {
      cy.visit('/ordering');
      orderingSteps.createOrder();
      orderingSteps.selectTherapy('tesscar001-cd30car-t-eu-sg');
      orderingSteps.subjectRegistration(scope.patientInformation,scope.treatmentInformation,'cd30Eu');
      orderingSteps.principal_investigator_information(scope.treatmentInformation);
      orderingSteps.scheduleCollection('collection_cd30_eu_sg');
      orderingSteps.confirmOrder(scope.patientInformation.subjectId);
      orderingSteps.confirm_subject_eligibility();
      orderingSteps.approveOrder(scope.patientInformation.subjectId);
    });
  });

  describe('Collection Flow', () => {
    before(() => {
      collectionSteps.collectionAliases();
    });
    it('Complete Collection Workflow', () => {
      cy.getCoi(scope.patientInformation)
      cy.log('login Arlene')
      cy.platformLogin('arlene@vineti.com');
      cy.visit('/collection');
      cy.paginationForSubjectId(scope.patientInformation.subjectId);
      collectionSteps.printApheresisProductLabels();
      collectionSteps.idmSampleCollection();
      collectionSteps.subjectVerification();
      collectionSteps.collectionBagIdentification();
      collectionSteps.captureCollectionInformation();
      collectionSteps.mncACollection();
      collectionSteps.collectionSummary();
      collectionSteps.shippingChecklist();
      collectionSteps.shippingSummary();
      collectionSteps.collectionIdmTestResults();
    });
  });

  describe('Satellite Lab Flow', () => {
    before(() => {
      satelliteLabSteps.satelliteLabAliases();
    });
    it('Complete Satellite Lab Workflow', () => {
      cy.getCoi(scope.patientInformation)
      cy.log('login Phil');
      cy.platformLogin('phil@vineti.com');
      cy.visit('/satellite_lab');
      cy.paginationForCoi();
      satelliteLabSteps.collectionSummary();
      satelliteLabSteps.shipmentReceiptChecklist();
      satelliteLabSteps.shipmentReceiptSummary();
      satelliteLabSteps.apheresisProductReceipt();
      satelliteLabSteps.apheresisProductReceiptSummary();
      satelliteLabSteps.cryopreservationDate();
      satelliteLabSteps.pbmcLabels();
      satelliteLabSteps.pbmcBagsInformation();
      satelliteLabSteps.processPbmcSummary();
      satelliteLabSteps.conditionalRelease();
      satelliteLabSteps.finalRelease();
      satelliteLabSteps.selectBagsToBeShipped();
      satelliteLabSteps.shippingChecklist(scope);
      satelliteLabSteps.shippingSummary();
    });
  });

  describe('Manufacturing Flow', () => {
    before(() => {
      mfgStepsEu.manufacturingAliases();
    });
    it('Complete Manufacturing Workflow', () => {
      const futureDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
      const pastDate = dayjs().subtract(1, 'day').format('DD-MMM-YYYY');
      const currentDate = dayjs().format('DD-MMM-YYYY');

      cy.getCoi(scope.patientInformation)
      cy.log('login Steph');
      cy.platformLogin('steph@vineti.com');
      cy.visit('/manufacturing');
      cy.paginationForCoi();
      mfgStepsEu.assignLotNumber(scope.treatment);
      mfgStepsEu.collectionSummary();
      mfgStepsEu.shipmentReceiptChecklist();
      mfgStepsEu.shipmentReceiptSummary();
      mfgStepsEu.pbmcReceiptEu();
      mfgStepsEu.pbmcReceiptSummaryEu();
      mfgStepsEu.temperatureData();
      mfgStepsEu.manufacturingStart();
      mfgStepsEu.harvesting(pastDate, futureDate);
      mfgStepsEu.printFpBagLabels();
      mfgStepsEu.confirmNumberOfBags();
      mfgStepsEu.manufacturingSummary();
      mfgStepsEu.conditionalQualityRelease();
      mfgStepsEu.finalQualityRelease();
      mfgStepsEu.sponserReleaseEu();
      mfgStepsEu.sponserReleaseSummary();
      mfgStepsEu.selectBagsToBeShipped();
      mfgStepsEu.shippingChecklist(scope);
      mfgStepsEu.shippingSummary();
      mfgStepsEu.selectBagsToBeShippedLoop();
      mfgStepsEu.shippingChecklistLoop(scope);
      mfgStepsEu.shippingSummaryLoop();
    });
  });

  describe('Infusion Flow', () => {
    before(() => {
      infusionSteps.infusionAliases();
    });
    it('Complete Infusion Workflow', () => {
      cy.getCoi(scope.patientInformation)
      cy.log('login Phil');
      cy.platformLogin('Phil@vineti.com');
      cy.visit('/infusion');
      cy.paginationForCoi();
      infusionSteps.shipmentReceiptChecklistEu(scope.treatment);
      infusionSteps.shipmentReceiptSummaryEu();
      infusionSteps.finishedProductReceiptChecklist(scope);
      infusionSteps.finishedProductReceiptSummary();
      infusionSteps.sponsorReleaseDocuments();
      infusionSteps.shipmentReceiptChecklistLoopEu(scope.treatment);
      infusionSteps.shipmentReceiptSummaryLoopEu();
      infusionSteps.finishedProductReceiptChecklistLoop(scope);
      infusionSteps.finishedProductReceiptSummaryLoop();
      infusionSteps.sponsorReleaseDocumentsLoop();
    })
  })
})
