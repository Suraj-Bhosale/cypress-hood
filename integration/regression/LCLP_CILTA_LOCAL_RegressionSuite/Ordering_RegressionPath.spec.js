import ordering_steps from '../../../utils/HappyPath_steps/LCLP_CILTA_LOCAL_HappyPath/ordering_steps_cilta';
import commonHappyPath from "../../../utils/Regression_steps/LCLP_CILTA_LOCAL_RegressionPath/common_happyPath_steps"
import regressionOrderingSteps from '../../../utils/Regression_steps/LCLP_CILTA_LOCAL_RegressionPath/ordering_steps_cilta'
import therapies from '../../../fixtures/therapy.json'
import header from '../../../fixtures/assertions.json';



context('LCLP US Therapy Ordering Regression Path', () => {
  const scope = {};
  const therapy = therapies.lclp_cilta
  const region = 'US';

  beforeEach(() => {
    cy.clearCookies();
    ordering_steps.orderingData(scope);
    commonHappyPath.commonAliases();
  });

  it('Patient Information', () => {
    regressionOrderingSteps.selectTherapyHappyPath(therapy.context)

    //C40142 [NEG] Verify the 'Next' button to be disabled without providing any data in 'First Name' input field.
    regressionOrderingSteps.patientInformation.firstNameNegative(scope.patientInformation,scope.treatmentInformation);

    //C40143 [NEG] Verify the 'Next' button to be disabled without providing any data in 'Last Name' input field.
    regressionOrderingSteps.patientInformation.lastNameNegative(scope.patientInformation,scope.treatmentInformation);

    //C40144 [POS] Verify that "Day of Birth" is optional field
    regressionOrderingSteps.patientInformation.dayOfBirthPositive(scope.patientInformation,scope.treatmentInformation);

    //C40145 [POS] Verify that "Month of Birth" is optional field
    regressionOrderingSteps.patientInformation.monthOfBirthNegative(scope.patientInformation,scope.treatmentInformation);

    //C40146 [POS] Verify the 'Next' button without giving data in 'Year Of Birth' field.
    regressionOrderingSteps.patientInformation.yearOfBirthPositive(scope.patientInformation,scope.treatmentInformation);

    //C40147 [NEG] Verify 'Year Of Birth' input field with negative test data.
    regressionOrderingSteps.patientInformation.yearOfBirthNegative(scope.patientInformation,scope.treatmentInformation);

    //C40148 [NEG] Verify the 'Next' button to be disabled without providing any data in 'Order ID' input field. 
    regressionOrderingSteps.patientInformation.orderIdNegative(scope.patientInformation,scope.treatmentInformation);

    //C40149 [NEG] Verify the 'Next' button to be disabled without providing any data in 'Medical Record Number' input field.
    regressionOrderingSteps.patientInformation.medicalRecordNoNegative(scope.patientInformation,scope.treatmentInformation);

    //C40150 [NEG] Verify the 'Next' button to be disabled without providing any data in 'Treatment Ordering Site' dropdown.
    regressionOrderingSteps.patientInformation.treatmentSiteNegative(scope.patientInformation,scope.treatmentInformation);

    //C40151 [POS] Verify if the data is retained upon clicking 'Save & Close' button.
    regressionOrderingSteps.patientInformation.dataSavingWithsaveAndClosePositive(scope.patientInformation,scope.treatmentInformation);

    //C40152 [POS]Verify if data retained after clicking next and coming back
    regressionOrderingSteps.patientInformation.dataSavingWithBackButtonPositive(scope.patientInformation,scope.treatmentInformation);

    //C40153 [POS] Verify that a reason for change is asked upon changing values.
    regressionOrderingSteps.patientInformation.checkReasonForChangePositive(scope.patientInformation,scope.treatmentInformation);
  });


  it('Scheduling', () => {
    regressionOrderingSteps.selectTherapyHappyPath(therapy.context)
    regressionOrderingSteps.scheduling.previousHappyPathSteps(scope.patientInformation,therapy,scope.treatmentInformation,
      header.orderingSite,
      scope.patientHeaderBar,
      header); 

  //C29484	[NEG] Verify if the 'Next' button is disabled when date is not selected in collection part
    regressionOrderingSteps.scheduling.collectionDateNotSelectedScheduleCollection()

	//C29485	[POS] Verify if the 'Schedule' button is enabled after selecting date in collection, satellite lab and drug product delivery section.			
    regressionOrderingSteps.scheduling.scheduleButtonEnabled(therapy)

	//C29487	[POS] Verify if the data is retained upon clicking 'Save & Close' button.			
  regressionOrderingSteps.scheduling.dataSavingWithsaveAndClosePositive(scope.patientInformation,scope.treatmentInformation);

	//C29488	[POS]Verify if Back button is working
  regressionOrderingSteps.scheduling.dataSavingWithBackButtonPositive();

  //C29486	[POS] verify if "Order Cancellation Request" page is opened by clicking cancel order link.	
  regressionOrderingSteps.scheduling.orderCancellationRequest()

});

  it('Confirmation', () => {
    regressionOrderingSteps.selectTherapyHappyPath(therapy.context)
    regressionOrderingSteps.confirmation.previousHappyPathSteps(scope.patientInformation,therapy, scope.treatmentInformation,
      header.orderingSite,
      scope.patientHeaderBar,
      header);

    //C29493[POS] Verify if the 'Submit Order' button is enabled after verifier's signature is signed
    //C29494[NEG] Verify if the 'Approve' button is disabled after confirmer's signature is  signed.
    regressionOrderingSteps.confirmation.verifySubmitOrderButtonStatus();

    //C29489 [POS] Verify if patient information can be edited by clicking on the 'Edit' button next to patient information section.
    regressionOrderingSteps.confirmation.verifyEditButton1();

    //C29490 [POS] Verify if collection details can be edited by clicking on the 'Edit' button next to collection section.
    regressionOrderingSteps.confirmation.verifyEditButton2();

    //C29492 [POS] Verify if drug product delivery details can be edited by clicking on 'Edit' button next to drug product delivery section.
    regressionOrderingSteps.confirmation.verifyEditButton3();
  });

  it('Check Statuses Of Ordering Module', () => {
    regressionOrderingSteps.selectTherapyHappyPath(therapy.context)
    regressionOrderingSteps.checktheStatusesOfOrderingModule(therapy,scope)
  });
});
