import orderingStepsHappyPath from '../../../utils/HappyPath_steps/CD30_US_SG_HappyPath/ordering_steps';
import collectionStepsHappyPath from "../../HappyPath_steps/CD30_US_SG_HappyPath/collection_steps";
import satelliteLabStepsHappyPath from "../../HappyPath_steps/CD30_US_SG_HappyPath/satellite_lab_steps";
import mfgStepsHappyPath from '../../../utils/HappyPath_steps/CD30_US_SG_HappyPath/manufacturing_steps.js';
import infusionStepsHappyPath from '../../../utils/HappyPath_steps/CD30_US_SG_HappyPath/infusion_steps';
import common from "../../../support/index";
import dayjs from 'dayjs';
Cypress.env('runWithHelpers', false);

export default {
  commonAliases: (therapy) => {
    cy.restoreLocalStorage();
    cy.server();
    cy.intercept('DELETE', '/auth/sign_out').as('logout');
    cy.intercept('GET', '/physicians*').as('getStepPhysicians');
    cy.intercept('POST', '/signatures').as('postSignature');
    cy.intercept('POST', '/procedures').as('postProcedures');
    cy.intercept("POST", "/graphql").as("patients");
    cy.intercept('PATCH', '/procedure_steps/*').as('patchProcedureSteps');
    cy.intercept('GET', '/procedures/*').as('getProcedures');
    cy.intercept('GET', '/scheduling/schedules/*').as('schedulingServiceSchedule');
    cy.intercept('GET', '/scheduling/milestone_definitions/*').as('schedulingMilestones');
    cy.intercept('POST', '/scheduling/schedules').as('schedulingServiceCreate');
    cy.intercept('POST', new RegExp(`/scheduling/schedules/${therapy}/availability`)).as(
      'schedulingServiceAvailability'
    );
    cy.intercept('GET','/v1/institutions/*').as('getInstitutions')
    cy.intercept('GET', '/procedures?procedure_type=*').as('getProcedureTypeOrdering');
    cy.intercept('GET', '/v1/permissions').as('getPermissions');
    cy.intercept('POST', '/signatures').as('postSignatures');
    cy.intercept('POST', '/documents').as('postDocuments');
    cy.intercept('POST', '/print').as('postPrint');
    cy.intercept('POST', '/label_scans/values').as('createLabelScanValue');
    cy.intercept('POST', '/label_scans/verifications').as('labelVerifications');
  },

  commonOrderingSteps: (therapy, patientData, treatmentInfo, institution, scope, therapyPrefix) => {

    cy.log('login Nina');
    cy.platformLogin('nina@vineti.com');
    orderingStepsHappyPath.orderingAliases('CD30CAR-T:cHL:tesscar001');
    cy.visit('/ordering');
    orderingStepsHappyPath.createOrder();
    orderingStepsHappyPath.selectTherapy(therapy);
    orderingStepsHappyPath.subjectRegistration(scope.patientInformation,scope.treatmentInformation);
    orderingStepsHappyPath.principal_investigator_information(scope.treatmentInformation);
    orderingStepsHappyPath.scheduleCollection(institution);
    orderingStepsHappyPath.confirmOrder(scope.treatmentInformation);
    orderingStepsHappyPath.confirm_subject_eligibility();
    orderingStepsHappyPath.getCoi();
    orderingStepsHappyPath.approveOrder();
    cy.platformLogin('arlene@vineti.com');
    cy.visit('/collection');
    cy.paginationForSubjectId(scope.patientInformation.subjectId);
  },

  commonCollectionHappyPath: (scope) => {
    collectionStepsHappyPath.printApheresisProductLabels();
    collectionStepsHappyPath.idmSampleCollection();
    collectionStepsHappyPath.subjectVerification();
    collectionStepsHappyPath.collectionBagIdentification();
    collectionStepsHappyPath.captureCollectionInformation();
    collectionStepsHappyPath.mncACollection();
    collectionStepsHappyPath.collectionSummary();
    collectionStepsHappyPath.shippingChecklist();
    collectionStepsHappyPath.shippingSummary();
    collectionStepsHappyPath.collectionIdmTestResults();
  },

  commonSatelliteLabPath: (scope) => {
    cy.log('login Phil');
    cy.platformLogin('phil@vineti.com');
    cy.visit('/satellite_lab');
    cy.paginationForCoi();
    satelliteLabStepsHappyPath.collectionSummary();
    satelliteLabStepsHappyPath.shipmentReceiptChecklist();
    satelliteLabStepsHappyPath.shipmentReceiptSummary();
    satelliteLabStepsHappyPath.apheresisProductReceipt();
    satelliteLabStepsHappyPath.apheresisProductReceiptSummary();
    satelliteLabStepsHappyPath.cryopreservationDate();
    satelliteLabStepsHappyPath.pbmcLabels();
    satelliteLabStepsHappyPath.pbmcBagsInformation();
    satelliteLabStepsHappyPath.processPbmcSummary();
    satelliteLabStepsHappyPath.conditionalRelease();
    satelliteLabStepsHappyPath.finalRelease();
    satelliteLabStepsHappyPath.selectBagsToBeShipped();
    satelliteLabStepsHappyPath.shippingChecklist(scope);
    satelliteLabStepsHappyPath.shippingSummary();
  },

  commonManufacturingPath: (scope) => {
    const futureDate = dayjs().add(1, 'day').format('DD-MMM-YYYY');
    const pastDate = dayjs().subtract(1, 'day').format('DD-MMM-YYYY');
    const currentDate = dayjs().format('DD-MMM-YYYY');

    cy.log('login Steph');
    cy.platformLogin('steph@vineti.com');
    cy.visit('/manufacturing');
    cy.paginationForCoi();
    mfgStepsHappyPath.assignLotNumber(scope.treatment);
    mfgStepsHappyPath.collectionSummary();
    mfgStepsHappyPath.shipmentReceiptChecklist();
    mfgStepsHappyPath.shipmentReceiptSummary();
    mfgStepsHappyPath.pbmcReceipt(scope);
    mfgStepsHappyPath.pbmcReceiptSummary();
    mfgStepsHappyPath.temperatureData();
    mfgStepsHappyPath.manufacturingStart();
    mfgStepsHappyPath.harvesting(pastDate, futureDate);
    mfgStepsHappyPath.printFpBagLabels();
    mfgStepsHappyPath.confirmNumberOfBags();
    mfgStepsHappyPath.manufacturingSummary();
    mfgStepsHappyPath.conditionalQualityRelease();
    mfgStepsHappyPath.finalQualityRelease();
    mfgStepsHappyPath.sponserRelease();
    mfgStepsHappyPath.sponserReleaseSummary();
    mfgStepsHappyPath.selectBagsToBeShipped();
    mfgStepsHappyPath.shippingChecklist(scope);
    mfgStepsHappyPath.shippingSummary();
    mfgStepsHappyPath.selectBagsToBeShippedLoop();
    mfgStepsHappyPath.shippingChecklistLoop(scope);
    mfgStepsHappyPath.shippingSummaryLoop();
    cy.log('login Phil');
    cy.platformLogin('Phil@vineti.com');
    cy.visit('/infusion');
    cy.paginationForCoi();
  },

  commonInfusionHappyPath : (scope) =>{
    infusionStepsHappyPath.shipmentReceiptChecklistEu(scope.treatment);
    infusionStepsHappyPath.shipmentReceiptSummaryEu();
    infusionStepsHappyPath.finishedProductReceiptChecklist(scope);
    infusionStepsHappyPath.finishedProductReceiptSummary();
    infusionStepsHappyPath.sponsorReleaseDocuments();
    infusionStepsHappyPath.shipmentReceiptChecklistLoopEu(scope.treatment);
    infusionStepsHappyPath.shipmentReceiptSummaryLoopEu();
    infusionStepsHappyPath.finishedProductReceiptChecklistLoop(scope);
    infusionStepsHappyPath.finishedProductReceiptSummaryLoop();
    infusionStepsHappyPath.sponsorReleaseDocumentsLoop();
  },
}
