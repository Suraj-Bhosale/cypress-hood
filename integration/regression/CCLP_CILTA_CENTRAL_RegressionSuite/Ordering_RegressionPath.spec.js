import ordering_steps from '../../../utils/HappyPath_steps/CCLP_CILTA_CENTRAL_HappyPath/ordering_steps_cilta';
import commonHappyPath from "../../../utils/Regression_steps/CCLP_CILTA_CENTRAL_RegressionPath/common_happyPath_steps"
import regressionOrderingSteps from '../../../utils/Regression_steps/CCLP_CILTA_CENTRAL_RegressionPath/ordering_steps_cilta'
import therapies from '../../../fixtures/therapy.json'
import header from '../../../fixtures/assertions.json';



context('CCLP US Therapy Ordering Regression Path', () => {
  const scope = {};
  const therapy = therapies.cclp_cilta
  const region = 'US';

  beforeEach(() => {
    cy.clearCookies();
    ordering_steps.orderingData(scope);
    commonHappyPath.commonAliases();
  });

  it('Patient Information', () => {
    regressionOrderingSteps.selectTherapyHappyPath(therapy.context)

    //C27789 [NEG] Verify the 'Next' button to be disabled without providing any data in 'First Name' input field.
   regressionOrderingSteps.patientInformation.firstNameNegative(scope.patientInformation,scope.treatmentInformation);

    //C24915 [NEG] Verify the 'Next' button to be disabled without providing any data in 'Last Name' input field.
   regressionOrderingSteps.patientInformation.lastNameNegative(scope.patientInformation,scope.treatmentInformation);

    //C38127 [POS] Verify that "Day of Birth" is optional field
   regressionOrderingSteps.patientInformation.dayOfBirthPositive(scope.patientInformation,scope.treatmentInformation);

    //C38128 [POS] Verify that "Month of Birth" is optional field
   regressionOrderingSteps.patientInformation.monthOfBirthNegative(scope.patientInformation,scope.treatmentInformation);

    //C24916 [POS] Verify the 'Next' button without giving data in 'Year Of Birth' field.
   regressionOrderingSteps.patientInformation.yearOfBirthPositive(scope.patientInformation,scope.treatmentInformation);

    //C38126 [NEG] Verify 'Year Of Birth' input field with negative test data.
    regressionOrderingSteps.patientInformation.yearOfBirthNegative(scope.patientInformation,scope.treatmentInformation);

    //C24917 [NEG] Verify the 'Next' button to be disabled without providing any data in 'Order ID' input field. 
    regressionOrderingSteps.patientInformation.orderIdNegative(scope.patientInformation,scope.treatmentInformation);

    //C24919 [NEG] Verify the 'Next' button to be disabled without providing any data in 'Medical Record Number' input field.
     regressionOrderingSteps.patientInformation.medicalRecordNoNegative(scope.patientInformation,scope.treatmentInformation);

    //C24920 [NEG] Verify the 'Next' button to be disabled without providing any data in 'Treatment Ordering Site' dropdown.
    regressionOrderingSteps.patientInformation.treatmentSiteNegative(scope.patientInformation,scope.treatmentInformation);

    //C27804 [POS] Verify if the data is retained upon clicking 'Save & Close' button.
    regressionOrderingSteps.patientInformation.dataSavingWithsaveAndClosePositive(scope.patientInformation,scope.treatmentInformation);

    //C29442 [POS]Verify if data retained after clicking next and coming back
    regressionOrderingSteps.patientInformation.dataSavingWithBackButtonPositive(scope.patientInformation,scope.treatmentInformation);

    //C38129 [POS] Verify that a reason for change is asked upon changing values.
    regressionOrderingSteps.patientInformation.checkReasonForChangePositive(scope.patientInformation,scope.treatmentInformation);
  });

  it('Scheduling', () => {
    regressionOrderingSteps.selectTherapyHappyPath(therapy.context)
    regressionOrderingSteps.scheduling.previousHappyPathSteps(scope.patientInformation,therapy,scope.treatmentInformation,
      header.orderingSite,
      scope.patientHeaderBar,
      header);

  //C24947	[NEG] Verify if the 'Next' button is disabled when date is not selected in collection part
    regressionOrderingSteps.scheduling.collectionDateNotSelectedScheduleCollection()

	//C24948	[POS] Verify if the 'Schedule' button is enabled after selecting date in collection, satellite lab and drug product delivery section.			
    regressionOrderingSteps.scheduling.scheduleButtonEnabled(therapy)

	//C24950	[POS] Verify if the data is retained upon clicking 'Save & Close' button.			
  regressionOrderingSteps.scheduling.dataSavingWithsaveAndClosePositive(scope.patientInformation,scope.treatmentInformation);

	//C29430	[POS]Verify if Back button is working
  regressionOrderingSteps.scheduling.dataSavingWithBackButtonPositive();

  //C24949	[POS] verify if "Order Cancellation Request" page is opened by clicking cancel order link.	
  regressionOrderingSteps.scheduling.orderCancellationRequest()

});

  it('Confirmation', () => {
    regressionOrderingSteps.selectTherapyHappyPath(therapy.context)
    regressionOrderingSteps.confirmation.previousHappyPathSteps(scope.patientInformation,therapy, scope.treatmentInformation,
      header.orderingSite,
      scope.patientHeaderBar,
      header);

    // [C24955,C24956][NEG] Verify if the 'Approve' button is disabled after confirmer's signature is  signed.
    // [POS] Verify if the 'Submit Order' button is enabled after verifier's signature is signed.
    regressionOrderingSteps.confirmation.verifySubmitOrderButtonStatus();

    // [C24951][POS] Verify if patient information can be edited by clicking on the 'Edit' button next to patient information section.
    regressionOrderingSteps.confirmation.verifyEditButton1();

    // [C24952][POS] Verify if collection details can be edited by clicking on the 'Edit' button next to collection section.
    regressionOrderingSteps.confirmation.verifyEditButton2();

    // [C24953] [POS] Verify if satellite lab details can be edited by clicking on the 'Edit' button next to satellite lab section.
    regressionOrderingSteps.confirmation.verifyEditButton3();

    // [C24954] [POS] Verify if drug product delivery details can be edited by clicking on the 'Edit' button next to drug product delivery section.
    regressionOrderingSteps.confirmation.verifyEditButton4();
  });
  
  it('Check Statuses Of Ordering Module', () => {
    regressionOrderingSteps.selectTherapyHappyPath(therapy.context)
    regressionOrderingSteps.checktheStatusesOfOrderingModule(therapy,scope)
  });
});