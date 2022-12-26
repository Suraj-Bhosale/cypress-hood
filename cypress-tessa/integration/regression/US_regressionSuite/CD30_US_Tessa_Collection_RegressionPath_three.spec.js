import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_US_Regression/ordering_steps_regression.js';
import regressionCollectionSteps from "../../../utils/Regression_steps/CD30_US_Regression/collection_steps_regression.js";
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_US_Regression/common_happypath.js';
import dayjs from 'dayjs';
Cypress.env('runWithHelpers', false);

describe('US Tesscar Regression Path', () => {
  let scope = {};

  describe('Collection Flow', () => {
    beforeEach(() => {
      cy.clearCookies();
      regressionOrderingSteps.orderingData(scope);
      regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    });

    it('Collection Summary' , () => {
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us', scope, 'cd30Us');
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
      regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-us', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_us', scope, 'cd30Us');
      regressionCollectionSteps.shippingChecklist.previousHappyPathSteps(scope);

      //C33917 [POS] Verify that the user able to click  "Next "button without entering  data in "Enter and Confirm"  of "Scan or enter the Air Waybill number on the shipping labels" field.
      regressionCollectionSteps.shippingChecklist.enterAndConfirmPositive();

      //C33918 [POS] Verify the "Next" button disabled after not selecting any value from "Attach shipping labels to shipper" toggle button .
      regressionCollectionSteps.shippingChecklist.attachShippingWithoutTogglePositive();

      //C33919 [NEG] Verify the "Next" button while clicking "No" toggle button  of "Attach shipping labels to shipper" and not giving reason in "Please provide rationale for response" textfield.
      regressionCollectionSteps.shippingChecklist.attachShippingToggleWithoutReasonNegative();

      //C33920 [POS]Verify whether the user able to click "Next" button after clicking  "No" toggle value in "Attach shipping labels to shipper" toggle button .
      regressionCollectionSteps.shippingChecklist.attachShippingTogglePositive();

      //C33921 [POS] Verify the "Next" button disabled after not selecting any value from "Pack and load the apheresis product into the shipper according to the instructions provided" toggle button .
      regressionCollectionSteps.shippingChecklist.placeProductIntoShipperWithoutTogglePositive();

      //C33922 [NEG] Verify the "Next" button while clicking "No" toggle button  of "Pack and load the apheresis product into the shipper according to the instructions provided" and not giving reason in "Please provide rationale for response" textfield.
      regressionCollectionSteps.shippingChecklist.placeProductIntoShipperToggleWithoutReasonNegative();

      //C33923 [POS] Verify the "Next" button while clicking "No" of  "Pack and load the apheresis product into the shipper according to the instructions provided" toggle button .
      regressionCollectionSteps.shippingChecklist.placeProductIntoShipperTogglePositive();

      //C33924 [POS]Verify the "View Summary" button enabled for "Check that the Summary documents have been printed" field.
      regressionCollectionSteps.shippingChecklist.checkSummaryDocumentTogglePositive();

      //C33925 [POS] Verify the "Next" button disabled after not selecting any value from "Place summary documents in the shipper." toggle button .
      regressionCollectionSteps.shippingChecklist.placeSummaryDocumentWithoutTogglePositive();

      //C33926 [NEG] Verify the "Next" button while clicking "No" toggle button  of "Place summary documents in the shipper." and not giving reason in "Please provide rationale for response" textfield.
      regressionCollectionSteps.shippingChecklist.placeSummaryDocumentToggleWithoutReasonNegative();

      //C33927 [POS] Verify the "Next" button while clicking "No" of  "Place summary documents in the shipper" toggle button .
      regressionCollectionSteps.shippingChecklist.placeSummaryDocumentTogglePositive();

      //C33928 [POS] Verify the "Next" button disabled after not selecting any value from "Shipper has been sealed." toggle button .
      regressionCollectionSteps.shippingChecklist.shipperSealedWithoutTogglePositive();

      //C33929 [NEG] Verify the "Next" button while clicking "No" toggle button  of "Shipper has been sealed." and not giving reason in "Please provide rationale for response" textfield.
      regressionCollectionSteps.shippingChecklist.shipperSealedToggleWithoutReasonNegative();

      //C33930 [POS] Verify the "Next" button while clicking "No" of  "Shipper has been sealed." toggle button .
      regressionCollectionSteps.shippingChecklist.shipperSealedTogglePositive();

       //C33931 [POS] Verify the "Next" button without entering data in "Additional Comments" optional text field.
      regressionCollectionSteps.shippingChecklist.additionalCommentBoxPositive();

      //C33932 [POS] Verify the datasaving with save and close button.
      regressionCollectionSteps.shippingChecklist.saveAndCloseButtonPositive(scope.patientInformation);

      //C33933 [POS] Verify the datasaving with next and back button.
      regressionCollectionSteps.shippingChecklist.backButtonPositive();
    });
  });
});
