import {
  createPatientsQuerySiteResourceIdentifier,
  updatePatientQuerySingle,
  mockPatientBaseInfo,
  generateResourceIdentifiers
} from '../../utils/graphql/patients';
import { loginApi } from '../api/api_login';
import faker from 'faker';
import { getAllRoles, addGlobalPermissionsToRole } from '../api/api_roles';
import { getInstitutions, getInstitutionUuidByName } from '../api/api_general_functions';
import {
  makeGraphqlCypressRequest,
  uuidv4,
} from '../../utils/graphql';
import { sortBy } from 'lodash';

describe('Patient batch create api', () => {
  let apiUser = 'internal_ga_test_user@vineti.com';
  let apiUserPassword = 'Password123';

  let globalNurse = 'nina@vineti.com';
  let globalNursePassword = 'password one two three';

  let instuuid;
  let otherInstuuid;
  let newIdentifiers;
  let tokenData;

  let updatedPatientData;
  let institutionName = 'Test COE 1';
  let institutionExternalSiteId = 'ESI-001';
  let otherInstitutionName = 'Test COE 2';


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
  newIdentifiers = generateResourceIdentifiers();
  let patientData = {
    ...mockPatientBaseInfo(),
    subjectIdentifier: newIdentifiers[0],
    nonClinicalIdentifier: newIdentifiers[1],
    siteIdentifiertype: 'external_site_id',
    siteIdentifier: institutionExternalSiteId,
  };

  context('When supplying either a single resource identifier or a Vineti ID when referencing a resource', () => {
    it('creates a patient and updates it', () => {
      let newIdentifierType = faker.lorem.word();
      let newIdentifier = uuidv4();

      loginApi(globalNurse, globalNursePassword)
          .then(token => {
            tokenData = token
            makeGraphqlCypressRequest(
                createPatientsQuerySiteResourceIdentifier,
                patientData,
                {tokenData, skipSamlAuthToken: true}
            );
          })
          .then(response => {
            expect(response.status).to.eq(200);

            expect(response.body).not.to.have.property('errors');
          })
          .then(_ => {
            updatedPatientData = {
              patients: [
                {
                  firstName: faker.name.firstName(),
                  lastName: faker.name.lastName(),
                  resourceIdentifier: {
                    identifierType: 'Non-Clinical',
                    identifier: patientData.nonClinicalIdentifier
                  },
                  upsertIdentifiers: [
                    {
                      identifierType: newIdentifierType,
                      identifier: newIdentifier
                    }
                  ]
                }
              ]
            }
            makeGraphqlCypressRequest(
                updatePatientQuerySingle,
                updatedPatientData,
                {tokenData, skipSamlAuthToken: true}
            );

          })
          .then(response => {
            expect(response.status).to.eq(200);
            expect(response.body).not.to.have.property('errors');
            let patientResponse = response.body.data.updatePatients.patients[0];
            expect(patientResponse.firstName).to.eq(updatedPatientData.patients[0].firstName);
            expect(patientResponse.lastName).to.eq(updatedPatientData.patients[0].lastName);

            let resourceIdentifiers = sortBy(patientResponse.resourceIdentifiers, 'identifierType');
            expect(resourceIdentifiers[0].identifierType).to.eq('Non-Clinical');
            expect(resourceIdentifiers[0].identifier).to.eq(patientData.nonClinicalIdentifier);
            expect(resourceIdentifiers[1].identifierType).to.eq(newIdentifierType);
            expect(resourceIdentifiers[1].identifier).to.eq(newIdentifier);
          });
    });
  })
})
