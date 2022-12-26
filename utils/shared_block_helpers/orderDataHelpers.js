export default {
  fillScopeData: (scope) => {
    scope.treatment = {
      coi: "YOUR ORDER'S COI",
      apheresisId: "YOUR ORDER'S APHERESIS ID"
    }

    scope.therapyInfo = {
      productNumber: "AUTO4",
      indication: "TCL",
      protocolNumber: "AUTO4-TL1"
    }

    scope.patientInformation = {
      patientId: "YOUR ORDER'S PATIENT ID"
    }
    scope.collectionAirWayBill = "YOUR ORDER'S COLLECTION AIRWAY BILL NUMBER"
    scope.manufacturingAirWayBill = "YOUR ORDER'S MANUFACTURING AIRWAY BILL NUMBER"

    scope.treatment.lotNumber = 123
    scope.treatment.productBagId = 456
    scope.treatment.manufacturingLoggerId = 444
    scope.treatment.manufacturingLn2Id = 777
    scope.treatment.manufacturingLoggerId = 444
  }
}