import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_SG_Regression/ordering_steps_regression.js';
import regressionCollectionSteps from "../../../utils/Regression_steps/CD30_US_SG_Regression/collection_steps_regression.js";
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_SG_Regression/common_happypath.js';
import dayjs from 'dayjs';
Cypress.env('runWithHelpers', false);

describe('US-SG Tesscar Regression Path', () => {
  let scope = {};

  describe('Collection Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Collection Summary' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
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
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us_sg', scope, 'cd30UsEu');
      regressionCollectionSteps.shippingChecklist.previousHappyPathSteps(scope);

      //C21152 [POS] Verify that the user able to click  "Next "button without entering  data in "Enter and Confirm"  of "Scan or enter the Air Waybill number on the shipping labels" field.
      regressionCollectionSteps.shippingChecklist.enterAndConfirmPositive();

      //C24886 [POS] Verify the "Next" button disabled after not selecting any value from "Attach shipping labels to shipper" toggle button .
      regressionCollectionSteps.shippingChecklist.attachShippingWithoutTogglePositive();

      //C24887 [NEG] Verify the "Next" button while clicking "No" toggle button  of "Attach shipping labels to shipper" and not giving reason in "Please provide rationale for response" textfield.
      regressionCollectionSteps.shippingChecklist.attachShippingToggleWithoutReasonNegative();

      //C21133 [POS]Verify whether the user able to click "Next" button after clicking  "No" toggle value in "Attach shipping labels to shipper" toggle button .
      regressionCollectionSteps.shippingChecklist.attachShippingTogglePositive();

      // C24892 [POS] Verify the "Next" button disabled after not selecting any value from "Pack and load the apheresis product into the shipper according to the instructions provided" toggle button .
      regressionCollectionSteps.shippingChecklist.placeProductIntoShipperWithoutTogglePositive();

      //C24893 [NEG] Verify the "Next" button while clicking "No" toggle button  of "Pack and load the apheresis product into the shipper according to the instructions provided" and not giving reason in "Please provide rationale for response" textfield.
      regressionCollectionSteps.shippingChecklist.placeProductIntoShipperToggleWithoutReasonNegative();

      //C21135 [POS] Verify the "Next" button while clicking "No" of  "Pack and load the apheresis product into the shipper according to the instructions provided" toggle button .
      regressionCollectionSteps.shippingChecklist.placeProductIntoShipperTogglePositive();

      //C21137 [POS]Verify the "View Summary" button enabled for "Check that the Summary documents have been printed" field.
      regressionCollectionSteps.shippingChecklist.checkSummaryDocumentTogglePositive();

      // C24898 [POS] Verify the "Next" button disabled after not selecting any value from "Place summary documents in the shipper." toggle button .
      regressionCollectionSteps.shippingChecklist.placeSummaryDocumentWithoutTogglePositive();

      //C24899 [NEG] Verify the "Next" button while clicking "No" toggle button  of "Place summary documents in the shipper." and not giving reason in "Please provide rationale for response" textfield.
      regressionCollectionSteps.shippingChecklist.placeSummaryDocumentToggleWithoutReasonNegative();

      //C21139 [POS] Verify the "Next" button while clicking "No" of  "Place summary documents in the shipper" toggle button .
      regressionCollectionSteps.shippingChecklist.placeSummaryDocumentTogglePositive();

      // C24908 [POS] Verify the "Next" button disabled after not selecting any value from "Shipper has been sealed." toggle button .
      regressionCollectionSteps.shippingChecklist.shipperSealedWithoutTogglePositive();

      //C24904 [NEG] Verify the "Next" button while clicking "No" toggle button  of "Shipper has been sealed." and not giving reason in "Please provide rationale for response" textfield.
      regressionCollectionSteps.shippingChecklist.shipperSealedToggleWithoutReasonNegative();

      //C21143 [POS] Verify the "Next" button while clicking "No" of  "Shipper has been sealed." toggle button .
      regressionCollectionSteps.shippingChecklist.shipperSealedTogglePositive();

       //C21146 [POS] Verify the "Next" button without entering data in "Additional Comments" optional text field.
      regressionCollectionSteps.shippingChecklist.additionalCommentBoxPositive();

      //C26457 [POS] Verify the datasaving with save and close button.
      regressionCollectionSteps.shippingChecklist.saveAndCloseButtonPositive(scope.patientInformation);

      //C26458 [POS] Verify the datasaving with next and back button.
      regressionCollectionSteps.shippingChecklist.backButtonPositive();
    });
  });
});


