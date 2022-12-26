import orderingSteps from '../../utils/HappyPath_steps/CD30_US_SG_HappyPath/ordering_steps';
import collectionSteps from "../../utils/HappyPath_steps/CD30_US_SG_HappyPath/collection_steps";
import satelliteLabSteps from "../../utils/HappyPath_steps/CD30_US_SG_HappyPath/satellite_lab_steps";
import mfgSteps from '../../utils/HappyPath_steps/CD30_US_SG_HappyPath/manufacturing_steps.js';
import infusionSteps from '../../utils/HappyPath_steps/CD30_US_SG_HappyPath/infusion_steps';
import dayjs from 'dayjs';

describe('US-SG Tesscar Happy Path', () => {
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
      orderingSteps.selectTherapy('tesscar001-cd30car-t-us-sg');
      orderingSteps.subjectRegistration(scope.patientInformation,scope.treatmentInformation,'cd30UsEu');
      orderingSteps.principal_investigator_information(scope.treatmentInformation);
      orderingSteps.scheduleCollection('collection_cd30_us_sg');
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
      mfgSteps.manufacturingAliases();
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
      mfgSteps.assignLotNumber(scope.treatment);
      mfgSteps.collectionSummary();
      mfgSteps.shipmentReceiptChecklist();
      mfgSteps.shipmentReceiptSummary();
      mfgSteps.pbmcReceipt(scope);
      mfgSteps.pbmcReceiptSummary();
      mfgSteps.temperatureData();
      mfgSteps.manufacturingStart();
      mfgSteps.harvesting(pastDate, futureDate);
      mfgSteps.printFpBagLabels();
      mfgSteps.confirmNumberOfBags();
      mfgSteps.manufacturingSummary();
      mfgSteps.conditionalQualityRelease();
      mfgSteps.finalQualityRelease();
      mfgSteps.sponserRelease();
      mfgSteps.sponserReleaseSummary();
      mfgSteps.selectBagsToBeShipped();
      mfgSteps.shippingChecklist(scope);
      mfgSteps.shippingSummary();
      mfgSteps.selectBagsToBeShippedLoop();
      mfgSteps.shippingChecklistLoop(scope);
      mfgSteps.shippingSummaryLoop();
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
      infusionSteps.shipmentReceiptChecklist(scope.treatment);
      infusionSteps.shipmentReceiptSummary();
      infusionSteps.finishedProductReceiptChecklist(scope);
      infusionSteps.finishedProductReceiptSummary();
      infusionSteps.sponsorReleaseDocuments();
      infusionSteps.shipmentReceiptChecklistLoop(scope.treatment);
      infusionSteps.shipmentReceiptSummaryLoop();
      infusionSteps.finishedProductReceiptChecklistLoop(scope);
      infusionSteps.finishedProductReceiptSummaryLoop();
      infusionSteps.sponsorReleaseDocumentsLoop();
    })
  })
})
