import orderingSteps from '../../utils/HappyPath_steps/CD30_US_HappyPath/ordering_steps';
import collectionSteps from "../../utils/HappyPath_steps/CD30_US_HappyPath/collection_steps";
import mfgStepsUs from '../../utils/HappyPath_steps/CD30_US_HappyPath/manufacturing_steps.js';
import infusionSteps from '../../utils/HappyPath_steps/CD30_US_HappyPath/infusion_steps';
import dayjs from 'dayjs';

describe('US Tesscar Happy Path', () => {
  let scope = {};

  beforeEach(() => {
    cy.server();
    cy.intercept('POST', new RegExp('/scheduling/schedules/US:CD30CAR-T:cHL:TESSCAR001/draft')).as(
      'schedulingServiceDraft'
    );
    cy.intercept('POST', new RegExp('/scheduling/schedules/US:CD30CAR-T:cHL:TESSCAR001/availability')).as(
      'schedulingServiceAvailability'
    );
  });

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
      cy.log('Test')
      cy.visit('/ordering');
      orderingSteps.createOrder();
      orderingSteps.selectTherapy('tesscar001-cd30car-t-us');
      orderingSteps.subjectRegistration(scope.patientInformation,scope.treatmentInformation,'cd30Us');
      orderingSteps.principal_investigator_information(scope.treatmentInformation);
      orderingSteps.scheduleCollection('collection_cd30_us');
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

  describe('Manufacturing Flow', () => {
    before(() => {
      mfgStepsUs.manufacturingAliases();
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
      mfgStepsUs.assignLotNumber(scope.treatment);
      mfgStepsUs.collectionSummary();
      mfgStepsUs.shipmentReceiptChecklist();
      mfgStepsUs.shipmentReceiptSummary();
      mfgStepsUs.apheresisProductReceiptUs(scope);
      mfgStepsUs.apheresisProductReceiptSummaryUs();
      mfgStepsUs.manufacturingStart();
      mfgStepsUs.harvestingUs(pastDate, futureDate);
      mfgStepsUs.printFpBagLabels();
      mfgStepsUs.confirmNumberOfBags();
      mfgStepsUs.manufacturingSummaryUs();
      mfgStepsUs.qaRelease();
      mfgStepsUs.sponserReleaseUs();
      mfgStepsUs.sponserReleaseSummary();
      mfgStepsUs.selectBagsToBeShipped();
      mfgStepsUs.shippingChecklist(scope);
      mfgStepsUs.shippingSummary();
      mfgStepsUs.selectBagsToBeShippedLoop();
      mfgStepsUs.shippingChecklistLoop(scope);
      mfgStepsUs.shippingSummaryLoop();
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
