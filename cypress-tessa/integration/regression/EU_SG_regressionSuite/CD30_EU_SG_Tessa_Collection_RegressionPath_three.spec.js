import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_EU_SG_Regression/ordering_steps_regression.js';
import regressionCollectionSteps from "../../../utils/Regression_steps/CD30_EU_SG_Regression/collection_steps_regression.js";
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_EU_SG_Regression/common_happypath.js';
import dayjs from 'dayjs';
Cypress.env('runWithHelpers', false);

describe('EU SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Collection Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Collection Summary' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCollectionSteps.collectionSummary.previousHappyPathSteps(scope);

      // C21208	[POS] Verify that order can be approved after signature is done.
      regressionCollectionSteps.collectionSummary.verifySubmitWithSignature();

      // [POS] Verify that upon editing information from the "Capture collection Information" section, the updated values are reflected in the summary page.
      regressionCollectionSteps.collectionSummary.checkEditFunctionalityCci();

      // [POS] Verify that upon editing information from the "MNC(A) collection Information" section, the updated values are reflected in the summary page.
      regressionCollectionSteps.collectionSummary.checkEditFunctionalityMnc();

      //C21210	[POS] Verify 'View Summary' is enabled when signature is done.
      regressionCollectionSteps.collectionSummary.verifyViewSummaryWithSignature();
    });

    it('Shipping Checklist' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
      regressionCollectionSteps.shippingChecklist.previousHappyPathSteps(scope);

      //C33934 [POS] Verify that the user able to click  "Next "button without entering  data in "Enter and Confirm"  of "Scan or enter the Air Waybill number on the shipping labels" field.
      regressionCollectionSteps.shippingChecklist.enterAndConfirmPositive();

      //C33935 [POS] Verify the "Next" button disabled after not selecting any value from "Attach shipping labels to shipper" toggle button .
      regressionCollectionSteps.shippingChecklist.attachShippingWithoutTogglePositive();

      //C33936 [NEG] Verify the "Next" button while clicking "No" toggle button  of "Attach shipping labels to shipper" and not giving reason in "Please provide rationale for response" textfield.
      regressionCollectionSteps.shippingChecklist.attachShippingToggleWithoutReasonNegative();

      //C33937 [POS]Verify whether the user able to click "Next" button after clicking  "No" toggle value in "Attach shipping labels to shipper" toggle button .
      regressionCollectionSteps.shippingChecklist.attachShippingTogglePositive();

      //C33938 [POS] Verify the "Next" button disabled after not selecting any value from "Pack and load the apheresis product into the shipper according to the instructions provided" toggle button .
      regressionCollectionSteps.shippingChecklist.placeProductIntoShipperWithoutTogglePositive();

      //C33939 [NEG] Verify the "Next" button while clicking "No" toggle button  of "Pack and load the apheresis product into the shipper according to the instructions provided" and not giving reason in "Please provide rationale for response" textfield.
      regressionCollectionSteps.shippingChecklist.placeProductIntoShipperToggleWithoutReasonNegative();

      //C33940 [POS] Verify the "Next" button while clicking "No" of  "Pack and load the apheresis product into the shipper according to the instructions provided" toggle button .
      regressionCollectionSteps.shippingChecklist.placeProductIntoShipperTogglePositive();

      //C33941 [POS]Verify the "View Summary" button enabled for "Check that the Summary documents have been printed" field.
      regressionCollectionSteps.shippingChecklist.checkSummaryDocumentTogglePositive();

      //C33942 [POS] Verify the "Next" button disabled after not selecting any value from "Place summary documents in the shipper." toggle button .
      regressionCollectionSteps.shippingChecklist.placeSummaryDocumentWithoutTogglePositive();

      //C33943 [NEG] Verify the "Next" button while clicking "No" toggle button  of "Place summary documents in the shipper." and not giving reason in "Please provide rationale for response" textfield.
      regressionCollectionSteps.shippingChecklist.placeSummaryDocumentToggleWithoutReasonNegative();

      //C33944 [POS] Verify the "Next" button while clicking "No" of  "Place summary documents in the shipper" toggle button .
      regressionCollectionSteps.shippingChecklist.placeSummaryDocumentTogglePositive();

      //C33945 [POS] Verify the "Next" button disabled after not selecting any value from "Shipper has been sealed." toggle button .
      regressionCollectionSteps.shippingChecklist.shipperSealedWithoutTogglePositive();

      //C33946 [NEG] Verify the "Next" button while clicking "No" toggle button  of "Shipper has been sealed." and not giving reason in "Please provide rationale for response" textfield.
      regressionCollectionSteps.shippingChecklist.shipperSealedToggleWithoutReasonNegative();

      //C33947 [POS] Verify the "Next" button while clicking "No" of  "Shipper has been sealed." toggle button .
      regressionCollectionSteps.shippingChecklist.shipperSealedTogglePositive();

      //C33948 [POS] Verify the "Next" button without entering data in "Additional Comments" optional text field.
      regressionCollectionSteps.shippingChecklist.additionalCommentBoxPositive();

      //C33949 [POS] Verify the datasaving with save and close button.
      regressionCollectionSteps.shippingChecklist.saveAndCloseButtonPositive(scope.patientInformation);

      //C33950 [POS] Verify the datasaving with next and back button.
      regressionCollectionSteps.shippingChecklist.backButtonPositive();
    });
  });
});