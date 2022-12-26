import ordering_steps from '../../../utils/HappyPath_steps/CMLP_CILTA_RARITAN_HappyPath/ordering_steps_cilta';
import commonHappyPath from "../../../utils/Regression_steps/CMLP_CILTA_RARITAN_RegressionPath/common_happyPath_steps"
import regressionOrderingSteps from '../../../utils/Regression_steps/CMLP_CILTA_RARITAN_RegressionPath/ordering_steps_cilta'
import therapies from '../../../fixtures/therapy.json'
import header from '../../../fixtures/assertions.json';



context('CMLP US Therapy Ordering Regression Path', () => {
  const scope = {};
  const therapy = therapies.cmlp_cilta
  const region = 'US';

  beforeEach(() => {
    cy.clearCookies();
    ordering_steps.orderingData(scope);
    commonHappyPath.commonAliases();
  });

  it('Patient Information', () => {
    regressionOrderingSteps.selectTherapyHappyPath(therapy.context)

    //C40155 [NEG] Verify the 'Next' button to be disabled without providing any data in 'First Name' input field.
    regressionOrderingSteps.patientInformation.firstNameNegative(scope.patientInformation,scope.treatmentInformation);

    //C40156 [NEG] Verify the 'Next' button to be disabled without providing any data in 'Last Name' input field.
    regressionOrderingSteps.patientInformation.lastNameNegative(scope.patientInformation,scope.treatmentInformation);

    //C40157 [POS] Verify that "Day of Birth" is optional field
    regressionOrderingSteps.patientInformation.dayOfBirthPositive(scope.patientInformation,scope.treatmentInformation);

    //C40158 [POS] Verify that "Month of Birth" is optional field
    regressionOrderingSteps.patientInformation.monthOfBirthNegative(scope.patientInformation,scope.treatmentInformation);

    //C40159 [POS] Verify the 'Next' button without giving data in 'Year Of Birth' field.
    regressionOrderingSteps.patientInformation.yearOfBirthPositive(scope.patientInformation,scope.treatmentInformation);

    //C40160 [NEG] Verify 'Year Of Birth' input field with negative test data.
    regressionOrderingSteps.patientInformation.yearOfBirthNegative(scope.patientInformation,scope.treatmentInformation);

    //C40161 [NEG] Verify the 'Next' button to be disabled without providing any data in 'Order ID' input field. 
    regressionOrderingSteps.patientInformation.orderIdNegative(scope.patientInformation,scope.treatmentInformation);

    //C40162 [NEG] Verify the 'Next' button to be disabled without providing any data in 'Medical Record Number' input field.
    regressionOrderingSteps.patientInformation.medicalRecordNoNegative(scope.patientInformation,scope.treatmentInformation);

    //C40163 [NEG] Verify the 'Next' button to be disabled without providing any data in 'Treatment Ordering Site' dropdown.
    regressionOrderingSteps.patientInformation.treatmentSiteNegative(scope.patientInformation,scope.treatmentInformation);

    //C40164 [POS] Verify if the data is retained upon clicking 'Save & Close' button.
    regressionOrderingSteps.patientInformation.dataSavingWithsaveAndClosePositive(scope.patientInformation,scope.treatmentInformation);

    //C40165 [POS]Verify if data retained after clicking next and coming back
    regressionOrderingSteps.patientInformation.dataSavingWithBackButtonPositive(scope.patientInformation,scope.treatmentInformation);

    //C40166 [POS] Verify that a reason for change is asked upon changing values.
    regressionOrderingSteps.patientInformation.checkReasonForChangePositive(scope.patientInformation,scope.treatmentInformation);
  });

  it('Scheduling', () => {
    regressionOrderingSteps.selectTherapyHappyPath(therapy.context)
    regressionOrderingSteps.scheduling.previousHappyPathSteps(scope.patientInformation,therapy,scope.treatmentInformation,
      header.orderingSite,
      scope.patientHeaderBar,
      header); 

    //C36654	[NEG] Verify if the 'Next' button is disabled when date is not selected in collection part
    regressionOrderingSteps.scheduling.collectionDateNotSelectedScheduleCollection()

	  //C36655	[POS] Verify if the 'Schedule' button is enabled after selecting date in collection, satellite lab and drug product delivery section.			
    regressionOrderingSteps.scheduling.scheduleButtonEnabled(therapy)

	  //C36657	[POS] Verify if the data is retained upon clicking 'Save & Close' button.			
    regressionOrderingSteps.scheduling.dataSavingWithsaveAndClosePositive(scope.patientInformation,scope.treatmentInformation);

	  //C36658	[POS]Verify if Back button is working
    regressionOrderingSteps.scheduling.dataSavingWithBackButtonPositive();

    //C36656	[POS] verify if "Order Cancellation Request" page is opened by clicking cancel order link.	
    regressionOrderingSteps.scheduling.orderCancellationRequest()
});

  it('Confirmation', () => {
    regressionOrderingSteps.selectTherapyHappyPath(therapy.context)
    regressionOrderingSteps.confirmation.previousHappyPathSteps(scope.patientInformation,therapy, scope.treatmentInformation,
      header.orderingSite,
      scope.patientHeaderBar,
      header);

    //C36663 [NEG] Verify if the 'Approve' button is disabled after confirmer's signature is  signed.
    //C36664 [POS] Verify if the 'Submit Order' button is enabled after verifier's signature is signed.
    regressionOrderingSteps.confirmation.verifySubmitOrderButtonStatus();

    //C36659 [POS] Verify if patient information can be edited by clicking on the 'Edit' button next to patient information section.
    regressionOrderingSteps.confirmation.verifyEditButton1();

    //C36660 [POS] Verify if collection details can be edited by clicking on the 'Edit' button next to collection section.
    regressionOrderingSteps.confirmation.verifyEditButton2();

    //C36661 [POS] Verify if satellite lab details can be edited by clicking on the 'Edit' button next to satellite lab section.
    regressionOrderingSteps.confirmation.verifyEditButton3();

    //C36662[POS] Verify if drug product delivery details can be edited by clicking on the 'Edit' button next to drug product delivery section.
    regressionOrderingSteps.confirmation.verifyEditButton4();
  });
  it('Check Statuses Of Ordering Module', () => {
    regressionOrderingSteps.selectTherapyHappyPath(therapy.context)
    regressionOrderingSteps.checktheStatusesOfOrderingModule(therapy,scope)
  });
});