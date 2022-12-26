import regressionOrderingSteps from '../../../utils/Regression_steps/CMCP_US_RegressionPath/ordering_steps'
import regressionCollectionSteps from '../../../utils/Regression_steps/CMCP_US_RegressionPath/collection_steps'
import regressionManufacturingSteps from '../../../utils/Regression_steps/CMCP_US_RegressionPath/manufacturing_steps'
import regressionInfusionSteps from '../../../utils/Regression_steps/CMCP_US_RegressionPath/infusion_steps'
import regressionCommonHappyPath from '../../../utils/Regression_steps/CMCP_US_RegressionPath/common_happyPath_steps'
import therapies from "../../../fixtures/therapy.json"
import order_steps from '../../../utils/HappyPath_steps/CMCP_US_HappyPath/ordering_steps'


context('CMCP US Therapy Collection Regression Path', () => {
    beforeEach(() => {
        cy.clearCookies();
        order_steps.orderingData(scope);
        regressionCommonHappyPath.commonAliases();
    });

    const scope = {};
    const therapy = therapies.cmcp_us

    it('Check Status Of Infusion Module', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope, therapy)
        regressionInfusionSteps.checkStatusOfInfusionModule(scope);

    });

    it('Receive Shipment', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope, therapy)


        // 	[NEG]Check the 'COI number found on LN2 packing insert' with Negative data  
        regressionInfusionSteps.receiveShipment.negCoi()

        // [POS]Verify if data is saving by clicking Next and then Back button. 
        regressionInfusionSteps.receiveShipment.posDataOnNext()
    });

    it('Product Receipt Checklist', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope, therapy)
        regressionInfusionSteps.productReceiptChecklist.previousHappyPathSteps()

        // [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Confirm investigational product cassette(s) were not exposed to ambient temperature greater than 3 minutes.' 
        regressionInfusionSteps.productReceiptChecklist.nothingSelectedForInvestigationProductNeg()

        // [NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Confirm investigational product cassette(s) were not exposed to ambient temperature greater than 3 minutes.' 
        regressionInfusionSteps.productReceiptChecklist.noSelectedForInvestigationProductNeg()

        // [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Confirm investigational product cassette(s) were not exposed to ambient temperature greater than 3 minutes' 
        regressionInfusionSteps.productReceiptChecklist.reasonFilledForInvestigationProductPOS()

        // [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Was the tamper evident seal in place on the cassette rack?.' 
        regressionInfusionSteps.productReceiptChecklist.nothingSelectedForSealInPlaceNeg()

        // [NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Was the tamper evident seal in place on the cassette rack?' 
        regressionInfusionSteps.productReceiptChecklist.noSelectedForSealInPlaceNeg()

        // [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Was the tamper evident seal in place on the cassette rack?' 
        regressionInfusionSteps.productReceiptChecklist.reasonFilledForSealInPlacePos()

        // [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Was there a temperature out-of-range alarm received? If yes, contact Janssen immediately and follow instructions in the CTPPM.' 
        regressionInfusionSteps.productReceiptChecklist.nothingSelectedForTempRangeNeg()

        // [NEG] Verify if 'next' button is disabled if 'Yes' selected for toggle ' Was there a temperature out-of-range alarm received? If yes, contact Janssen immediately and follow instructions in the CTPPM.' 
        regressionInfusionSteps.productReceiptChecklist.noSelectedForTempRangeNeg()

        // [POS]Verify if 'next' button is Enabled after filling reason for Yes toggle 'Was there a temperature out-of-range alarm received? If yes, contact Janssen immediately and follow instructions in the CTPPM' 
        regressionInfusionSteps.productReceiptChecklist.reasonFilledForTempRangedPos()

        // [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Is each bag and cassette in the expected condition (e.g. no cassette damage, label adhered)? If bag(s) or cassette(s) is not in expected condition, please contact Janssen for ' 
        regressionInfusionSteps.productReceiptChecklist.nothingSelectedForExpecCondtionNeg()

        // [NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Is each bag and cassette in the expected condition (e.g. no cassette damage, label adhered)? If bag(s) or cassette(s) is not in expected condition, please contact Janssen for f.' 
        regressionInfusionSteps.productReceiptChecklist.noSelectedForExpecCondtionNeg()

        // [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Is each bag and cassette in the expected condition (e.g. no cassette damage, label adhered)? If bag(s) or cassette(s) is not in expected condition, please contact Janssen fo' 
        regressionInfusionSteps.productReceiptChecklist.reasonFilledForForExpecCondtionPos()

        // [NEG]Verify if 'next' button is disabled if Nothing selected for toggle ' Has the investigational product cassette(s) been placed into storage as per the cassette label: Store at ≤-120°C (-184°F), vapor phase of liquid nitrogen? This should be done.' 
        regressionInfusionSteps.productReceiptChecklist.nothingSelectedForStorageNeg()

        // [NEG] Verify if 'next' button is disabled if 'No' selected for toggle ' Has the investigational product cassette(s) been placed into storage as per the cassette label: Store at ≤-120°C (-184°F), vapor phase of liquid nitrogen? This should be done ev' 
        regressionInfusionSteps.productReceiptChecklist.noSelectedForStorageNeg()

        // [POS]Verify if 'next' button is Enabled after filling reason for No toggle 'Has the investigational product cassette(s) been placed into storage as per the cassette label: Store at ≤-120°C (-184°F), vapor phase of liquid nitrogen? This should be don' 
        regressionInfusionSteps.productReceiptChecklist.reasonFilledForStoragePos()

        //   [POS] Verify that the data is saving after clicking "Save and Close" button.  
        regressionInfusionSteps.productReceiptChecklist.posSaveAndCloseButtonCheck(scope)
    });

    it('Product Receipt Summary', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy)
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionCommonHappyPath.commonManufacturingHappyPath(scope, therapy)
        regressionInfusionSteps.productReceiptSummary.previousHappyPathSteps()

        //[POS]Verify if the next button remains disabled until the user signs the document 
        regressionInfusionSteps.productReceiptSummary.nextButtonPos()
    });
})