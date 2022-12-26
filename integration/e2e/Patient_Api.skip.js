import {
  createPatientQuery,
  createPatientsQuerySingle,
  createPatientsQuerySiteUuid,
  createPatientsQuerySiteResourceIdentifier,
  mockPatientBaseInfo,
  generateResourceIdentifiers
} from '../../utils/graphql/patients';
import { loginApi } from '../api/api_login';
import { getAllRoles, addGlobalPermissionsToRole } from '../api/api_roles';
import { getInstitutions, getInstitutionUuidByName } from '../api/api_general_functions';
import {
  makeGraphqlCypressRequest,
  templateQuery_createPatients,
} from '../../utils/graphql';
import { sortBy } from 'lodash';

describe('Patient batch create api', () => {
  let apiUser = 'internal_ga_test_user@vineti.com';
  let apiUserPassword = 'Password123';

  let globalNurse = 'nina@vineti.com';
  let globalNursePassword = 'password one two three';
 
  let patientData;
  let instuuid;
  let otherInstuuid;
  let newIdentifiers;
  
  let institutionName = 'Test COE 1';
  let institutionExternalSiteId = 'ESI-001';

  let otherInstitutionName = 'Test COE 2';
  let otherInstitutionExternalSiteId = 'ESI-002';

  let tokenData;    

  before(() => {
    loginApi(apiUser, apiUserPassword)
      .then(token => {
        tokenData = token;
        return getAllRoles(tokenData);
      })
      .then(response => {
        return addGlobalPermissionsToRole('ordering_nurse', response, tokenData);
      })
      .then(_response => {
        return getInstitutions(tokenData);
      })
      .then(response => {
        instuuid = getInstitutionUuidByName(response.data, institutionName);
        otherInstuuid = getInstitutionUuidByName(response.data, otherInstitutionName);
      });
  });

  beforeEach(() => {
    newIdentifiers = generateResourceIdentifiers();
  });

  context('When supplying either a single resource identifier or a Vineti ID when referencing a resource', () => {
    it('errors when supplying multiple site identifiers to reference a single site', () => {
      let patientsData = {
        patients: [
          {
            ...mockPatientBaseInfo(),
            sites: [
              { uuid: instuuid },
              { resourceIdentifier: { identifierType: 'external_site_id', identifier: institutionExternalSiteId } },
            ],
            resourceIdentifiers: [
              { identifierType: 'Non-Clinical', identifier: newIdentifiers[0] },
              { identifierType: 'subject', identifier: newIdentifiers[1] }
            ]
          }
        ]
      };
      loginApi(globalNurse, globalNursePassword)
        .then(tokenData => {
          makeGraphqlCypressRequest(
            createPatientQuery,
            patientsData,
            { tokenData, skipSamlAuthToken: true }
          );
        })
        .then(response => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.property('errors');
          expect(response.body.errors[0].path[0]).to.eq(0);
          expect(response.body.errors[0].path[1]).to.eq('uuid::ResourceIdentifier');
          expect(response.body.errors[0].message).to.eq(
            'Duplicate sites with identifiers: [{:identifier_type=>"external_site_id", :identifier=>"ESI-001"}] found for the patient.'
          );
          expect(response.body.errors[0].extensions.status).to.eq('not_found');
        });
    });

    it('creates a patient when supplying a single site UUID', () => {
      patientData = {
        ...mockPatientBaseInfo(),
        subjectIdentifier: newIdentifiers[0],
        nonClinicalIdentifier: newIdentifiers[1],
        siteuuid: instuuid,
      };

      loginApi(globalNurse, globalNursePassword)
        .then(tokenData => {
          makeGraphqlCypressRequest(
            createPatientsQuerySiteUuid,
            patientData,
            { tokenData, skipSamlAuthToken: true }
          );
        })
        .then(response => {
          expect(response.status).to.eq(200);
          expect(response.body).not.to.have.property('errors');

          // validate patient
          let patientResponse = response.body.data.createPatients.patients[0];
          expect(patientResponse.firstName).to.eq(patientData.firstName);
          expect(patientResponse.lastName).to.eq(patientData.lastName);

          // validate resource identifiers
          let resourceIdentifiers = sortBy(patientResponse.resourceIdentifiers, 'identifierType');
          expect(resourceIdentifiers[0].identifierType).to.eq('Non-Clinical');
          expect(resourceIdentifiers[0].identifier).to.eq(patientData.nonClinicalIdentifier);
          expect(resourceIdentifiers[1].identifierType).to.eq('subject');
          expect(resourceIdentifiers[1].identifier).to.eq(patientData.subjectIdentifier);

          // validate site
          let patientSite = patientResponse.sites[0];
          expect(patientSite.uuid).to.eq(patientData.siteuuid);
        });
    });

    it('creates a patient when supplying a single site resource identifier', () => {
      patientData = {
        ...mockPatientBaseInfo(),
        subjectIdentifier: newIdentifiers[0],
        nonClinicalIdentifier: newIdentifiers[1],
        siteIdentifiertype: 'external_site_id',
        siteIdentifier: institutionExternalSiteId,
      };

      loginApi(globalNurse, globalNursePassword)
        .then(tokenData => {
          makeGraphqlCypressRequest(
            createPatientsQuerySiteResourceIdentifier,
            patientData,
            { tokenData, skipSamlAuthToken: true }
          );
        })
        .then(response => {
          expect(response.status).to.eq(200);

          expect(response.body).not.to.have.property('errors');

          // validate patient
          let patientResponse = response.body.data.createPatients.patients[0];
          expect(patientResponse.firstName).to.eq(patientData.firstName);
          expect(patientResponse.lastName).to.eq(patientData.lastName);

          // validate resource identifiers
          let resourceIdentifiers = sortBy(patientResponse.resourceIdentifiers, 'identifierType');
          expect(resourceIdentifiers[0].identifierType).to.eq('Non-Clinical');
          expect(resourceIdentifiers[0].identifier).to.eq(patientData.nonClinicalIdentifier);
          expect(resourceIdentifiers[1].identifierType).to.eq('subject');
          expect(resourceIdentifiers[1].identifier).to.eq(patientData.subjectIdentifier);

          // validate sites
          let patientSite = patientResponse.sites[0];
          expect(patientSite.resourceIdentifiers[0].identifierType).to.eq(patientData.siteIdentifiertype);
          expect(patientSite.resourceIdentifiers[0].identifier).to.eq(patientData.siteIdentifier);
        });
    });
  });

  context('When sending an external patient identifier', () => {
    it('creates patients with associated identifiers', () => {
      const patients = [
        {
          ...mockPatientBaseInfo(),
          sites: [{ uuid: otherInstuuid }],
          resourceIdentifiers: [{ identifierType: 'subject', identifier: newIdentifiers[0] }],
        },
        {
          ...mockPatientBaseInfo(),
          sites: [{ uuid: otherInstuuid }],
          resourceIdentifiers: [{ identifierType: 'subject', identifier: newIdentifiers[1] }],
        },
        {
          ...mockPatientBaseInfo(),
          sites: [{ uuid: otherInstuuid }],
          resourceIdentifiers: [{ identifierType: 'subject', identifier: newIdentifiers[2] }],
        },
        {
          ...mockPatientBaseInfo(),
          sites: [{ uuid: otherInstuuid }],
          resourceIdentifiers: [{ identifierType: 'subject', identifier: newIdentifiers[3] }],
        },
      ];
      const patientsData = { patients: patients };

      loginApi(globalNurse, globalNursePassword)
        .then(tokenData => {
          makeGraphqlCypressRequest(
            createPatientQuery,
            patientsData,
            { tokenData, skipSamlAuthToken: true }
          );
        })
        .then(response => {
          const observedPatients = response.body.data.createPatients.patients;
          observedPatients.forEach((patient, index) => {
            expect(patient.biologicalSex).to.eq(patients[index].biologicalSex);
            expect(patient.email).to.eq(patients[index].email);
            expect(patient.firstName).to.eq(patients[index].firstName);
            expect(patient.lastName).to.eq(patients[index].lastName);
            expect(patient.gender).to.eq(patients[index].gender);
            expect(patient.resourceIdentifiers[0].identifier).to.eq(newIdentifiers[index]); //
            expect(patient.resourceIdentifiers[0].identifierType).to.eq(
              patients[index].resourceIdentifiers[0].identifierType
            );
          });
        });
    });
  });

  context('When sending site resource identifiers', () => {
    it('creates a patient and associates the patients to the sites', () => {
      const newIdentifierType = 'subject';
      const newIdentifier = newIdentifiers[0];   
      const patients = [
        {
          ...mockPatientBaseInfo(),
          resourceIdentifiers: [{ identifierType: newIdentifierType, identifier: newIdentifier }],
          sites: [{ uuid: instuuid }],
        }
      ]; 
      const patientsData = { patients: patients };

      loginApi(globalNurse, globalNursePassword)
        .then(tokenData => {
          makeGraphqlCypressRequest(
            createPatientQuery,
            patientsData,
            { tokenData, skipSamlAuthToken: true }
          );
        })
        .then(response => {
          const observedPatients = response.body.data.createPatients.patients;
          observedPatients.forEach((patient, index) => {
            expect(patient.customDayOfBirth).to.eq(patients[index].customDayOfBirth);
            expect(patient.customMonthOfBirth).to.eq(patients[index].customMonthOfBirth);
            expect(patient.customYearOfBirth).to.eq(patients[index].customYearOfBirth);
            expect(patient.firstName).to.eq(patients[index].firstName);
            expect(patient.lastName).to.eq(patients[index].lastName);

            // validate resource identifiers
            let resourceIdentifier = patient.resourceIdentifiers[0];
            let patientIdentifier = patients[index].resourceIdentifiers[0];
            expect(resourceIdentifier.identifier).to.eq(newIdentifier);
            expect(resourceIdentifier.identifierType).to.eq(patientIdentifier.identifierType);

            // validate site identifiers
            let siteIdentifier = patient.sites[0].resourceIdentifiers[0];
            expect(siteIdentifier.identifier).to.eq(institutionExternalSiteId);
            expect(siteIdentifier.identifierType).to.eq('external_site_id');
          });
        });
    });

    it('creates a patient when providing site resource identifiers', () => {
      const newIdentifier = newIdentifiers[0];
      const patients = [
        {
          ...mockPatientBaseInfo(),
          resourceIdentifiers: [{ identifierType: 'subject', identifier: newIdentifier }],
          sites: [
            {
              resourceIdentifier: {
                identifier: institutionExternalSiteId,
                identifierType: 'external_site_id',
              },
            },
          ],
        },
      ];
      const patientsData = { patients: patients };

      loginApi(globalNurse, globalNursePassword)
        .then(tokenData => {
          makeGraphqlCypressRequest(
            createPatientQuery,
            patientsData,
            { tokenData, skipSamlAuthToken: true }
          );
        })
        .then(response => {
          const observedPatients = response.body.data.createPatients.patients;
          observedPatients.forEach((patient, index) => {
            expect(patient.customDayOfBirth).to.eq(patients[index].customDayOfBirth);
            expect(patient.customMonthOfBirth).to.eq(patients[index].customMonthOfBirth);
            expect(patient.customYearOfBirth).to.eq(patients[index].customYearOfBirth);
            expect(patient.firstName).to.eq(patients[index].firstName);
            expect(patient.lastName).to.eq(patients[index].lastName);

            // validate resource identifiers
            let resourceIdentifier = patient.resourceIdentifiers[0];
            let patientIdentifier = patients[index].resourceIdentifiers[0];
            expect(resourceIdentifier.identifier).to.eq(newIdentifier);
            expect(resourceIdentifier.identifierType).to.eq(patientIdentifier.identifierType);

            // validate site identifiers
            let siteIdentifier = patient.sites[0].resourceIdentifiers[0];
            expect(siteIdentifier.identifier).to.exist;
            expect(siteIdentifier.identifierType).to.exist;
          });
        });
    });

    it('errors when sending invalid resource identifiers for site', () => {
      const newIdentifier = newIdentifiers[0];
      const patients = [
        {
          ...mockPatientBaseInfo(),
          resourceIdentifiers: [{ identifierType: 'subject', identifier: newIdentifier }],
          sites: [
            {
              resourceIdentifier: {
                identifier: 'IID01',
                identifierType: 'IID0',
              },
            },
          ],
        },
      ];
      const patientsData = { patients: patients };

      loginApi(globalNurse, globalNursePassword)
        .then(tokenData => {
          makeGraphqlCypressRequest(
            createPatientQuery,
            patientsData,
            { tokenData, skipSamlAuthToken: true }
          );
        })
        .then(response => {
          expect(response.body.errors[0].extensions.status).to.eq('not_found');
          expect(response.body.errors[0].message).to.eq(
            'Institutions with these resource identifiers were not found: [{:identifier_type=>"IID0", :identifier=>"IID01"}]'
          );
          expect(response.body.errors[0].path[1]).to.eq('uuid::ResourceIdentifier');
        });
    });

    it('errors when sending invalid UUID for site', () => {
      const newIdentifier = newIdentifiers[0];
      const badInstitutionUUID = '8200b176-e4f5-49b9-85f9-3aa0425621380';
      const patients = [
        {
          ...mockPatientBaseInfo(),
          resourceIdentifiers: [{ identifierType: 'subject', identifier: newIdentifier }],
          sites: [ { uuid: badInstitutionUUID } ],
        },
      ];
      const patientsData = { patients: patients };

      loginApi(globalNurse, globalNursePassword)
        .then(tokenData => {
          makeGraphqlCypressRequest(
            createPatientQuery,
            patientsData,
            { tokenData, skipSamlAuthToken: true }
          );
        })
        .then(response => {
          expect(response.body.errors[0].extensions.status).to.eq('not_found');
          expect(response.body.errors[0].message).to.eq(
            `Institutions with these UUIDs were not found: ["${badInstitutionUUID}"]`
          );
          expect(response.body.errors[0].path[1]).to.eq('uuid::ResourceIdentifier');
        });
    });

    it('errors when sending UUID and resource identifier for the same site', () => {
      const newIdentifier = newIdentifiers[0];
      const patients = [
        {
          ...mockPatientBaseInfo(),
          resourceIdentifiers: [{ identifierType: 'subject', identifier: newIdentifier }],
          sites: [
            { uuid: instuuid },
            {
              resourceIdentifier: {
                identifier: institutionExternalSiteId,
                identifierType: 'external_site_id',
              },
            },
          ],
        },
      ];
      const patientsData = { patients: patients };

      loginApi(globalNurse, globalNursePassword)
        .then(tokenData => {
          makeGraphqlCypressRequest(
            createPatientQuery,
            patientsData,
            { tokenData, skipSamlAuthToken: true }
          );
        })
        .then(response => {
          expect(response.body.errors[0].extensions.status).to.eq('not_found');
          expect(response.body.errors[0].message).to.eq(
            'Duplicate sites with identifiers: [{:identifier_type=>"external_site_id", :identifier=>"ESI-001"}] found for the patient.'
          );
          expect(response.body.errors[0].path[1]).to.eq('uuid::ResourceIdentifier');
        });
    });

    it('errors when sending invalid UUID for a site and resource identifier of existing patient', () => {
      const newIdentifier = newIdentifiers[0];
      const newIdentifierType = 'subject';
      const invalidInstitutionUUID = newIdentifiers[1];
      const patientsData = {
        patients: [
          {
            customFields: {
              dayOfBirth: '23',
              monthOfBirth: 'feb',
              yearOfBirth: 1973,
            },
            firstName: 'Andy',
            lastName: 'Banner',
            resourceIdentifiers: [{ identifierType: newIdentifierType, identifier: newIdentifier }],
            sites: [{ uuid: instuuid }],
          },
        ]
      };
      const invalidData = {
        patients: [
          {
            customFields: {
              dayOfBirth: '23',
              monthOfBirth: 'feb',
              yearOfBirth: 1973,
            },
            firstName: 'Andy',
            lastName: 'Banner',
            resourceIdentifiers: [{ identifierType: newIdentifierType, identifier: newIdentifier }],
            sites: [{ uuid: invalidInstitutionUUID }],
          },
        ]
      };

      loginApi(globalNurse, globalNursePassword)
        .then(token => {
          tokenData = token;
          makeGraphqlCypressRequest(
            createPatientQuery,
            patientsData,
            { tokenData, skipSamlAuthToken: true }
          );
        })
        .then(response => {
          makeGraphqlCypressRequest(
            createPatientQuery,
            invalidData,
            { tokenData, skipSamlAuthToken: true }
          );
        })
        .then(response => {
          expect(response.body.errors[0].message).to.eq(
            `The patient already exists for identifier_type: ${newIdentifierType} and identifier: ${newIdentifier}`
          );
          expect(response.body.errors[1].message).to.eq(
            `Institutions with these UUIDs were not found: ["${invalidInstitutionUUID}"]`
          );
        });
    });

    it('errors when sending invalid resource identifiers for a site and resource identifier of existing patient', () => {
      const newIdentifier = newIdentifiers[0];
      const patientsData = {
        patients: [
          {
            customFields: {
              dayOfBirth: '23',
              monthOfBirth: 'feb',
              yearOfBirth: 1973,
            },
            firstName: 'Andy',
            lastName: 'Banner',
            resourceIdentifiers: [{ identifierType: 'subject', identifier: newIdentifier }],
            sites: [{ uuid: instuuid }],
          },
        ]
      };
      const invalidSite = {
        resourceIdentifier: {
          identifier: 'IID01',
          identifierType: 'IID0',
        },
      };
      const invalidPatients = [
        {
          customFields: {
            dayOfBirth: '23',
            monthOfBirth: 'feb',
            yearOfBirth: 1973,
          },
          firstName: 'Andy',
          lastName: 'Banner',
          resourceIdentifiers: [{ identifierType: 'subject', identifier: newIdentifier }],
          sites: [ invalidSite ],
        },
      ];
      const invalidData = { patients: invalidPatients };

      loginApi(globalNurse, globalNursePassword)
        .then(token => {
          let tokenData = token;
          makeGraphqlCypressRequest(
            createPatientQuery,
            patientsData,
            { tokenData, skipSamlAuthToken: true }
          );
        })
        .then(response => {
          makeGraphqlCypressRequest(
            createPatientQuery,
            invalidData,
            { tokenData, skipSamlAuthToken: true }
          );
        })
        .then(response => {
          expect(response.body.errors[0].message).to.eq(
            `The patient already exists for identifier_type: subject and identifier: ${newIdentifier}`
          );
          expect(response.body.errors[1].message).to.eq(
            `Institutions with these resource identifiers were not found: [{:identifier_type=>"${invalidSite.resourceIdentifier.identifierType}", :identifier=>"${invalidSite.resourceIdentifier.identifier}"}]`
          );
        });
    });
  });
});
