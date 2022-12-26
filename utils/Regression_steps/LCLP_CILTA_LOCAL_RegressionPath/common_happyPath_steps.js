import ordering_steps from '../../HappyPath_steps/LCLP_CILTA_LOCAL_HappyPath/ordering_steps_cilta';
import collection_steps from '../../HappyPath_steps/LCLP_CILTA_LOCAL_HappyPath/collection_steps_cilta';
import mftg_steps from '../../HappyPath_steps/LCLP_CILTA_LOCAL_HappyPath/manufacturing_steps_cilta';
import inf_steps from '../../HappyPath_steps/LCLP_CILTA_LOCAL_HappyPath/infusion_steps_cilta';
import header from '../../../fixtures/assertions.json';
import input from '../../../fixtures/inputs.json';
import common from '../../../support/index';
import therapies from '../../../fixtures/therapy.json'
Cypress.env('runWithTranslations', false);
const therapy = therapies.lclp_cilta

export default {
  commonAliases: () => {
    cy.server();
    cy.route('DELETE', '/auth/sign_out').as('logout');
    cy.route('GET', '/physicians*').as('getStepPhysicians');
    cy.route('POST', '/signatures').as('postSignature');
    cy.route('POST', '/graphql').as('patients');
    cy.route('GET', '/therapies').as('products');
    cy.route('POST', '/procedures').as('postProcedures');
    cy.route('PATCH', '/procedure_steps/*').as('patchProcedureSteps');
    cy.route('GET', '/procedures/*').as('getProcedures');
    cy.route('GET', '/scheduling/schedules/*').as('schedulingServiceSchedule');
    cy.route('POST', '/scheduling/schedules').as('schedulingServiceCreate');
    cy.route('POST', new RegExp('/scheduling/schedules/US:Cilta-Cel:jnj/draft')).as(
      'schedulingServiceDraft'
    );
    cy.route('POST', new RegExp('/scheduling/schedules/US:Cilta-Cel:jnj/availability')).as(
      'schedulingServiceAvailability'
    );
    cy.route('GET', '/procedures?procedure_type=ordering').as('getProcedureTypeOrdering');
    cy.route('POST', '/print').as('postPrint');
    cy.route('POST', '/label_scans/verifications').as('labelVerifications');
    cy.route('POST', '/label_scans/values').as('createLabelScanValue');
    cy.route('GET', 'v1/institution_types').as('getInstitutions');
  },

  commonOrderingHappyPath: (scope,therapy) => {
    common.loginAs('nina');
    cy.visit('/ordering');
    ordering_steps.CreateOrder(header.orders);
    ordering_steps.SelectTherapy(therapy.context);
    ordering_steps.AddPatientInformation(scope.patientInformation, "", therapy);
    ordering_steps.SelectOrderingSite(scope.treatmentInformation,header.orderingSite,scope.patientHeaderBar,header);
    ordering_steps.schedulingCheckAvailability(therapy)
    ordering_steps.AddSchedulingOrder(header);
    ordering_steps.SubmitOrder(scope, therapy);
    cy.invokeCoi();
    cy.openOrder('collection','arlene')
    cy.commonPagination(scope.patientInformation.patientId,'Patients')
  },  

  commonCollectionHappyPath:(scope) => {
    cy.get(`@coi`).then(coi => { 
      collection_steps.patientVerificationCilta(therapy, scope);
      collection_steps.collectionBagIdentificationCilta();
      collection_steps.collectionInformationPrinting();
      collection_steps.collectionProcedureInformation();
      collection_steps.collectionSummaryCilta(scope);
      cy.openOrder('collection','phil')
      cy.commonPagination(scope.patientInformation.patientId,'Patients')
      collection_steps.cryopreservationLabels();
      collection_steps.cryopreservationBagLabelsAndPackingInsert(scope.coi, therapy);
      collection_steps.cryopreservationSummary(scope);
      collection_steps.cryopreservationTransferProductToShipper(scope.coi, 'us-lclp-cilta');
      collection_steps.cryopreservationShipmentChecklist(scope, therapy);
      collection_steps.collectionShippingSummaryEmeaLc(scope, therapy);
      cy.openOrder('manufacturing','steph')
      cy.commonPagination(coi,'Reservations')
    });
},

  commonManufacturingHappyPath:(scope) => {
    cy.get(`@coi`).then(coi => { 
      mftg_steps.manufacturingCollectionSummary(therapy);
      mftg_steps.manufacturingVerifyShipper(coi, therapy, 'from-apheresis-site', 'to-manufacturing-site');
      mftg_steps.manufacturingShipmentReceiptChecklist(input.evoLast4Digits, input.tamperSealNumber);
      mftg_steps.manufacturingShipReceiptSummaryVerify(therapy, scope);
      mftg_steps.manufacturingTransferProductToStorage(coi, therapy);
      mftg_steps.manufacturingTransferProductToStorage2(coi);
      mftg_steps.manufacturingProductReceipt(scope.patientInformation.patientId, therapy);
      mftg_steps.manufacturingProductReceiptSummaryVerifyEmeaLc(therapy, scope);
      mftg_steps.manufacturingData(input.expiryDate, scope.patientInformation.orderingLotNumber);
      mftg_steps.manufacturingFinalLabels(therapy);
      mftg_steps.manufacturingLabelApplication(coi, therapy);
      mftg_steps.manufacturingQualityApproval();
      mftg_steps.manufacturingBagSelection();
      mftg_steps.manufacturingTransferProductToShipper(coi, therapy);
      mftg_steps.shippingManufacturing(1, scope, input.subjectNumberInput, input.evoLast4Digits, input.tamperSealNumber, therapy);
      mftg_steps.manufacturingShippingManufacturingSummaryVerifyCilta(therapy, scope)
      cy.openOrder('infusion','phil');
      cy.commonPagination(coi,'Reservations');
    });
  },
  commonInfusionHappyPath:(therapy,scope) => {
    cy.get(`@coi`).then(coi => { 
      inf_steps.infusionReceiveShipment('manufacturing-site', therapy,coi);
      inf_steps.infusionShipmentReceiptChecklist(therapy, input.evoLast4Digits, input.tamperSealNumber);
      inf_steps.infusionShipmentReceiptSummary(scope, therapy);
      inf_steps.infusionProductReceiptChecklist(therapy);
      inf_steps.infusionProductReceiptSummary(scope, therapy);
    });
  }
}
