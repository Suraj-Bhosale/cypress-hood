import { uuidv4 } from './../graphql';
import faker from 'faker';

export const mockPatientBaseInfo = () => {
  // let dob = "15-Nov-1970";

  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    customFields: {
      patientId: faker.random.alphaNumeric(10),
      dayOfBirth: "15",
      monthOfBirth: "nov",
      yearOfBirth: 2000
    }
  };
};

export const mockPatientBaseInfoEmeaCcDc = () => {
  // let dob = "15-Nov-1970";

  return {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    customFields: {
      patientId: faker.random.alphaNumeric(10),
      dayOfBirth: "15",
      monthOfBirth: "Nov",
      yearOfBirth: 2000
    }
  };
};



export const generateResourceIdentifiers = () => {
  return [ uuidv4(), uuidv4(), uuidv4(), uuidv4() ];
}

export const createPatientQuery = `
  mutation($patients: [CreatePatientAttributes!]!) {
    createPatients(
      input: {
        patients: $patients
      }
    ) {
      patients {
        firstName
        lastName
        resourceIdentifiers {
          identifierType
          identifier
        }
        sites {
          uuid
          resourceIdentifiers {
            identifierType
            identifier
          }
        }
        customFields {
          dayOfBirth
          monthOfBirth
          yearOfBirth
          patientId
        }
      }
    }
  } 
`;

export const updatePatientsQuery = `
  mutation(
    $identifierType1: String
    $identifier1: String
    $firstName1: String
    $lastName1: String
    $identifierType2: String
    $identifier2: String
    $firstName2: String
    $lastName2: String
  ) {
    updatePatients(
      input: {
        patients: [
          {
            resourceIdentifier: {
              identifierType: $identifierType1
              identifier: $identifier1
            }
            firstName: $firstName1
            lastName: $lastName1
          }
          { resourceIdentifier: {
              identifierType: $identifierType2
              identifier: $identifier2
            }
            firstName: $firstName2
            lastName: $lastName2
          }
        ]
      }
    ) {
      patients {
        firstName
        lastName
        resourceIdentifiers {
          identifierType
          identifier
        }
        sites {
          uuid
          resourceIdentifiers {
            identifierType
            identifier
          }
        }
      }
    }
  }
  
`;

export const updatePatientsQuerySingle = `
  mutation(
    $firstName: String
    $lastName: String
    $dob: String
    $mob: String
    $yob: Int
    $subjectIdentifierType: String
    $subjectIdentifier: String
    $poplwIdentifierType: String
    $poplwIdentifier: String
    $martIdentifierType: String
    $martIdentifier: String
  ) {
    updatePatients(
      input: {
        patients: [
          {
            firstName: $firstName
            lastName: $lastName
            customFields: {
              dayOfBirth: $dob
              monthOfBirth: $mob
              yearOfBirth: $yob
            }
            resourceIdentifier:
            {
                identifierType: $subjectIdentifierType
                identifier: $subjectIdentifier
            }
            upsertIdentifiers: [
              {
                identifierType: $poplwIdentifierType
                identifier: $poplwIdentifier
              },
              {
                identifierType: $martIdentifierType
                identifier: $martIdentifier
              }
            ]
          }
        ]
      }
    ) {
      patients {
        firstName
        lastName
        customFields {
          dayOfBirth
          monthOfBirth
          yearOfBirth
        }
        resourceIdentifiers {
          identifierType
          identifier
        }
        sites {
          uuid
          resourceIdentifiers {
            identifierType
            identifier
          }
        }
      }
    }
  }
`;

export const createPatientsQuerySingle = `
  mutation(
    $firstName: String
    $lastName: String
    $dob: String
    $mob: String
    $yob: Int
    $subjectIdentifier: String
    $nonClinicalIdentifier: String
    $siteuuid: String
    $siteIdentifiertype: String
    $siteIdentifier: String
  ) {
    createPatients(
      input: {
        patients: [
          {
            firstName: $firstName
            lastName: $lastName
            customFields: {
              dayOfBirth: $dob
              monthOfBirth: $mob
              yearOfBirth: $yob
            }
            resourceIdentifiers: [
              { identifierType: "subject", identifier: $subjectIdentifier }
              { identifierType: "Non-Clinical", identifier: $nonClinicalIdentifier }
            ]
            sites: [
              { uuid: $siteuuid }
              { resourceIdentifier: { identifierType: $siteIdentifiertype, identifier: $siteIdentifier } }
            ]
          }
        ]
      }
    ) {
      patients {
        firstName
        lastName
        customFields {
          dayOfBirth
          monthOfBirth
          yearOfBirth
        }
        resourceIdentifiers {
          identifierType
          identifier
        }
        sites {
          uuid
          resourceIdentifiers {
            identifierType
            identifier
          }
        }
      }
    }
  }
`;

export const createPatientsQuerySiteUuid = `
  mutation(
    $firstName: String
    $lastName: String
    $dob: String
    $mob: String
    $yob: Int
    $subjectIdentifier: String
    $nonClinicalIdentifier: String
    $siteuuid: String
  ) {
    createPatients(
      input: {
        patients: [
          {
            firstName: $firstName,
            lastName: $lastName,
            customFields: {
              dayOfBirth: $dob
              monthOfBirth: $mob
              yearOfBirth: $yob
            },
            resourceIdentifiers: [
              { identifierType: "subject", identifier: $subjectIdentifier }
              { identifierType: "Non-Clinical", identifier: $nonClinicalIdentifier }
            ],
            sites: [
              { uuid: $siteuuid }
            ]
          }
        ]
      }
    ) {
      patients {
        firstName
        lastName
        customFields {
          dayOfBirth
          monthOfBirth
          yearOfBirth
        }
        resourceIdentifiers {
          identifierType
          identifier
        }
        sites {
          uuid
          resourceIdentifiers {
            identifierType
            identifier
          }
        }
      }
    }
  }
`;

export const createPatientsQuerySiteResourceIdentifier = `
  mutation(
    $firstName: String
    $lastName: String
    $dob: String
    $mob: String
    $yob: Int
    $subjectIdentifier: String
    $nonClinicalIdentifier: String
    $siteIdentifiertype: String
    $siteIdentifier: String
  ) {
    createPatients(
      input: {
        patients: [
          {
            firstName: $firstName
            lastName: $lastName
            customFields: {
              dayOfBirth: $dob
              monthOfBirth: $mob
              yearOfBirth: $yob
            }
            resourceIdentifiers: [
              { identifierType: "subject", identifier: $subjectIdentifier }
              { identifierType: "Non-Clinical", identifier: $nonClinicalIdentifier }
            ]
            sites: [
              { resourceIdentifier: { identifierType: $siteIdentifiertype, identifier: $siteIdentifier } }
            ]
          }
        ]
      }
    ) {
      patients {
        firstName
        lastName
        customFields {
          dayOfBirth
          monthOfBirth
          yearOfBirth
        }
        resourceIdentifiers {
          identifierType
          identifier
        }
        sites {
          uuid
          resourceIdentifiers {
            identifierType
            identifier
          }
        }
      }
    }
  }
`;

export const updatePatientQuerySingle = `
  mutation($patients: [UpdatePatientAttributes!]!) {
    updatePatients(
      input: {
        patients: $patients
      }
    ) {
      patients {
        firstName
        lastName
        resourceIdentifiers {
          identifierType
          identifier
        }
        sites {
          uuid
          resourceIdentifiers {
            identifierType
            identifier
          }
        }
        customFields {
          dayOfBirth
          monthOfBirth
          yearOfBirth
        }
      }
    }
  } 
`;

export const pagedPatientsQuery = `
  query PagedPatientsQuery {
    patients {
      id
      dob
      firstName
      lastName
      email
      resourceIdentifiers {
          identifier
          identifierType
      }
    }
  }
`;