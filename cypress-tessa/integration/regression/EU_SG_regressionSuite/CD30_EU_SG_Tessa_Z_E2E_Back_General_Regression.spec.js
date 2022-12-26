import orderingSteps from '../../../utils/HappyPath_steps/CD30_EU_SG_HappyPath/ordering_steps';
import collectionSteps from "../../../utils/HappyPath_steps/CD30_EU_SG_HappyPath/collection_steps";
import mfgStepsUs from '../../../utils/HappyPath_steps/CD30_EU_SG_HappyPath/manufacturing_steps.js';
import infusionSteps from '../../../utils/HappyPath_steps/CD30_EU_SG_HappyPath/infusion_steps';
import inputChecker from '../../../utils/shared_block_helpers/inputFieldCheckHelpers';
import regressionCommonHappyPath from '../../../utils/Regression_steps/CD30_EU_SG_Regression/common_happypath.js';
import e2eandback from '../../../utils/Regression_steps/CD30_EU_SG_Regression/e2e_and_back_steps.js';
import common from "../../../support/index";
import regressionOrderingSteps from '../../../utils/Regression_steps/CD30_EU_SG_Regression/ordering_steps_regression.js';

context('EU Therapy', () => {
  let scope = {};

  beforeEach(() => {
    cy.clearCookies();
    regressionOrderingSteps.orderingData(scope);
    regressionCommonHappyPath.commonAliases('CD30CAR-T:cHL:tesscar001');
    regressionCommonHappyPath.commonOrderingSteps('tesscar001-cd30car-t-eu-sg', scope.patientInformation, scope.treatmentInformation, 'collection_cd30_eu_sg', scope, 'cd30Eu');
    regressionCommonHappyPath.commonCollectionHappyPath(scope);
    regressionCommonHappyPath.commonSatelliteLabPath(scope)
    regressionCommonHappyPath.commonManufacturingPathEU(scope);
    regressionCommonHappyPath.commonInfusionHappyPath(scope);
  });

  it('E2E AND BACK', () => {
    e2eandback.e2e.backbutton(scope);
  });
});

