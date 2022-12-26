import regressionOrderingSteps from '../../../utils/Regression_steps/CMCP_US_RegressionPath/ordering_steps'
import regressionCollectionSteps from '../../../utils/Regression_steps/CMCP_US_RegressionPath/collection_steps'
import regressionManufacturingSteps from '../../../utils/Regression_steps/CMCP_US_RegressionPath/manufacturing_steps'
import regressionInfusionSteps from '../../../utils/Regression_steps/CMCP_US_RegressionPath/infusion_steps'
import regressionCommonHappyPath from '../../../utils/Regression_steps/CMCP_US_RegressionPath/common_happyPath_steps'
import order_steps from '../../../utils/HappyPath_steps/CMCP_US_HappyPath/ordering_steps'
import collection_steps from '../../../utils/HappyPath_steps/CMCP_US_HappyPath/collection_steps'
import manufacturing_steps from '../../../utils/HappyPath_steps/CMCP_US_HappyPath/manufacturing_steps';
import commonHappyPath from "../../../utils/Regression_steps/CMCP_US_RegressionPath/common_happyPath_steps"
import therapies from '../../../fixtures/therapy.json';

context('CMCP US Therapy Manufacturing Regression Path', () => {
    const scope = {};
    const therapy = therapies.cmcp_us
    const region = therapy.region;


    beforeEach(() => {
        cy.clearCookies();
        order_steps.orderingData(scope);
        regressionCommonHappyPath.commonAliases();
    });

    it('Check Status Of Manufacturing Module', () => {

    });
  
    it('manufacturing Start', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);

        // [NEG] Verify the confirmed checkbox is unticked. 
        regressionManufacturingSteps.manufacturingStart.checkboxNeg();

        //[POS] Verify the data is saved upon clicking 'Save & Close' button on Manufacturing Start page. 
        regressionManufacturingSteps.manufacturingStart.saveAndClosePos();
    });

    it('Print Final Product Labels', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionManufacturingSteps.printFinalProductLabels.previousHappyPathSteps();

        //[POS] Verify Print Labels button should send request to print labels on Print final product labels page 
        regressionManufacturingSteps.printFinalProductLabels.PosPrintLabelMessage()

        //[NEG] Verify the 'Next' button should be disabled when 'Confirm labels are printed successfully' checkbox is not checked. 
        regressionManufacturingSteps.printFinalProductLabels.confirmPrintLabelNeg()

        //	[POS] Verify the signature on the Print Final Product Labels page.
        regressionManufacturingSteps.printFinalProductLabels.verifySignaturePos()

        //[POS] Verify the data is saved upon clicking 'Save & Close ' button
        regressionManufacturingSteps.printFinalProductLabels.saveAndClosePos()
    });

    it('confirmation Of Label ApplicationPart1', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionManufacturingSteps.confirmationOfLabelApplication.previousHappyPathSteps();


        //[NEG] Verify that "Next" button is disabled when checkbox is unchecked 
        regressionManufacturingSteps.confirmationOfLabelApplication.checkboxNeg();

        // [NEG]Verify that next button is disabled when "Select label size attached to bag." field kept empty 
        regressionManufacturingSteps.confirmationOfLabelApplication.noOptionSelectedRadioButtonNeg();

        // [POS] Verify that "Next" button is enabled when '70ML' radio button was selected on the confirmation of label application page 
        regressionManufacturingSteps.confirmationOfLabelApplication.seventyMLButtonSelectedPos();

        //C22032 [POS] Verify the data is saved upon clicking 'Save & Close ' button
        regressionManufacturingSteps.confirmationOfLabelApplication.saveAndClosePos();
    });

    it('confirmation Of Label Application Part2', () => {
        regressionCommonHappyPath.commonOrderingHappyPath(scope, therapy);
        regressionCommonHappyPath.commonCollectionHappyPath(scope, therapy);
        regressionCommonHappyPath.commonSatelliteHappyPath(scope);
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.previousHappyPathSteps();

        //C41075 [NEG] Verify the 'Confirm' button is disabled for 'Scan or enter the COI with bag identifier on bag 1.'
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmButtonDisabledforCoiBag();

        //C41076 [NEG] Verify the 'Confirm' button is disabled for 'Scan or enter the COI with bag identifier on cassette 1.'
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmButtonDisbaledForCassette();

        //C41077 [NEG] Verify the 'Confirm' button is enabled for 'Scan or enter the COI with bag identifier on bag 1.'
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmButtonEnabledForCoiBag();

        //C41078 [NEG] Verify the 'Confirm' button is enabled for 'Scan or enter the COI with bag identifier on cassette 1.'
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmButtonEnabledForcassette();

        //C41083 [NEG] Verify the 'Next' button should remain disabled if invalid input is given for 'Scan or enter the COI with bag identifier on bag 1.'
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.invalidDataForCoiBag();

        //C41084 [NEG] Verify the 'Next' button should remain disabled if invalid input is given for 'Scan or enter the COI with bag identifier on cassette 1.'
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.invalidDataForCassette();

        //C41079 [NEG] Verify the 'Next' button remain diabled if checkbox is not checked.
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmCheckboxUnchecked();

        //C41080 [POS] Verify the 'Next' button enabled if checkbox is checked.
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.confirmCheckboxChecked();

        //C41082 [POS] Verify the data is saved upon clicking 'Save & Close ' button
        regressionManufacturingSteps.confirmationOfLabelApplicationPart2.saveAndClose();
    });
})