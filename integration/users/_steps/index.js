const {
  _: { camelCase },
} = Cypress;
import documentUploadHelper from '../../../shared_block_helpers/documentUploadHelpers';
import steps from '.';

const common = {
  _GenerateRandomString: () => {
    return Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, '')
      .substr(0, 5);
  },
};

const submitCreateUserPage = (clickOnNext = true) => {
  if (clickOnNext) {
    cy.get("[data-testid='btn-next']").click();
    cy.wait('@user-create-request')
      .its('status')
      .should('equal', 200);
    cy.url().should('match', /\/users\/\d+\/product_journey_roles$/);
    cy.wait([
      '@user-show-request',
      '@getAllRoles',
      '@execution-contexts-list-request',
      '@access-contexts-list-request',
    ]).spread((userShow, userRoles, executionContexts, accessContexts) => {
      expect(userShow.status).to.eq(200, 'user show request status');
      expect(userRoles.status).to.eq(200, 'user roles request status');
      expect(executionContexts.status).to.eq(200, 'execution contexts request status');
      expect(accessContexts.status).to.eq(200, 'access contexts request status');
    });
  } else {
    cy.get("[data-testid='btn-save-and-close']").click();

    cy.wait(['@user-create-request', '@users-list-request']).spread((userCreate, userList) => {
      expect(userCreate.status).to.eq(200, 'user create show request status');
      expect(userList.status).to.eq(200, 'user list show request status');
    });
  }
};

const submitProductJourneyRolesPage = () => {
  cy.get("[data-testid='btn-next']").click({ force: true }); // eslint-disable-line
  /**
   * Commenting out below code until we fully migrate from cy.route() to cy.intercept() as part of CGT-7323
   * CGT-7429 is created to make sure we bring below changes back
   */
  cy.wait('@access-contexts-batch-update-request');
  // .its('status')
  // .should('equal', 200);

  cy.url().should('match', /\/users\/\d+\/global_roles/);
  cy.wait(['@user-show-request', '@getAllRoles']);
  // .spread((user, userRoles) => {
  // expect(user.status).to.eq(200, 'user request status');
  // expect(userRoles.status).to.eq(200, 'user roles request status');
  // });
};

const saveAndCloseGlobalRolesPage = () => {
  cy.get("[data-testid='btn-save-and-close']").click();
  /**
   * Commenting out below code until we fully migrate from cy.route() to cy.intercept() as part of CGT-7323
   * CGT-7429 is created to make sure we bring below changes back
   */
  cy.wait('@user-update-request');
  // .its('status')
  // .should('equal', 200);

  cy.url().should('match', /\/users$/);
  cy.wait('@users-list-page')
};

const submitGlobalRolesPage = () => {
  cy.get("[data-testid='btn-save-and-close']").click();
  cy.wait('@user-update-request')
    .its('status')
    .should('equal', 200);

  cy.url().should('match', /\/users$/);
  cy.wait('@users-list-page')
    .its('status')
    .should('equal', 200);
};

export const goToProductJourneyRolesPage = () => {
  cy.get("[data-testid='side-nav-product-journey-roles']").click();
  cy.url().should('match', /\/users\/\d+\/product_journey_roles/);
  cy.wait([
    '@user-show-request',
    '@getAllRoles',
    '@execution-contexts-list-request',
    '@access-contexts-list-request',
  ]);
  /**
   * Commenting out below code until we fully migrate from cy.route() to cy.intercept() as part of CGT-7323
   * CGT-7429 is created to make sure we bring below changes back
   */
  // .spread((userShow, userRoles, executionContexts, accessContext) => {
  //   expect(userShow.status).to.eq(200, 'user show request status');
  //   expect(userRoles.status).to.eq(200, 'user roles request status');
  //   expect(executionContexts.status).to.eq(200, 'execution context request status');
  //   expect(accessContext.status).to.eq(200, 'access context request status');
  // });
};

const goToGlobalRolesPage = () => {
  cy.get("[data-testid='side-nav-global-roles']").click();
  cy.url().should('match', /\/users\/\d+\/global_roles/);
  cy.wait(['@user-show-request', '@getAllRoles']).spread((user, userRoles) => {
    expect(user.status).to.eq(200, 'user request status');
    expect(userRoles.status).to.eq(200, 'user roles request status');
  });
};

const findUserInPaginatedUsersList = (user, page = 1) => {
  cy.get('[data-testid="paginated-table-body"] tr').then($body => {
    if ($body.text().includes(user.value)) {
      cy.get($body).contains(user.value);
      return;
    }

    cy.get('.list-pager li.next').then($el => {
      if (!$el.hasClass('disabled')) {
        cy.wrap($el).click();
        cy.wait('@users-list-page')
          .its('status')
          .should('equal', 200);
        const pageCount = 25;
        const currentPage = page + 1;
        const pageStartRecord = (currentPage - 1) * pageCount + 1;
        cy.get('[data-testid="paging-subhead"]').contains(` ${pageStartRecord}-`);
        findUserInPaginatedUsersList(user, page + 1);
      } else {
        throw new Error(`User with this ${user.type}: ${user.value} not found`);
      }
    });
  });
};

export default {
  _GenerateRandomString: common._GenerateRandomString,
  submitGlobalRolesPage,
  submitCreateUserPage,

  NavigateToUsersListPage: () => {
    cy.get("[data-testid='nav_li_users']").click();
    cy.wait('@users-list-page');
  },

  NavigateToUser: userId => {
    cy.visit(`/users/${userId}`)
    cy.wait('@user-show-request');
  },

  AssertListPageHeader: pageHeader => {
    cy.get('header h1').contains(pageHeader);
  },

  NavigateToAddUserPage: () => {
    cy.get("[data-testid='btn-new-user'] button").click();

    cy.url().should('match', /\/users\/local$/);
    cy.wait('@institutions-list-request')
      .its('status')
      .should('equal', 200);
  },

  NavigateToUserProductJourneyRoles: () => {
    cy.get("[data-testid='side-nav-product-journey-roles']").click();
    cy.url().should('match', /\/users\/\d+\/product_journey_roles/);
    cy.wait([
      '@user-show-request',
      '@getAllRoles',
      '@execution-contexts-list-request',
      '@access-contexts-list-request',
    ]);
  },

  AssertAddUserPageHeader: () => {
    cy.get('.user-page h1').contains('User');
  },

  AssertActive: bool => {
    cy.get(`input[data-testid='active-radio-group-${bool}']:checked`);
  },

  Activate: bool => {
    cy.get(`label[data-testid='label-active-radio-group-${bool}']`).click();
  },
  SaveAndClose: () => {
    cy.get("[data-testid='btn-save-and-close']").click();
  },

  EnsureUserCreationRequiredFieldsAreRed: () => {
    cy.get("[data-testid='btn-next']").click();
    cy.wait('@user-create-request')
      .its('status')
      .should('equal', 422);

    cy.get("[data-testid='input-firstName']")
      .get('p')
      .contains('Required');

    cy.get("[data-testid='input-lastName']")
      .get('p')
      .contains('Required');

    cy.get("[data-testid='select-country-code']").contains('label', 'Required');

    cy.get("[data-testid='input-phoneNumber']")
      .get('p')
      .contains('Required');

    cy.get("[data-testid='input-email']")
      .get('p')
      .contains('Required');

    cy.get("[for='this-user-has-access-to-all-sites']").should('have.class', 'invalid');

    cy.get("[data-testid='label-institution-radio-group-false']").click();

    // Waiting on the bug fix.
    // cy.get("[data-testid='multiselect-error-institutions']").contains(
    //   'Select at least one institution'
    // );
  },

  CreateUser: ({
    firstName = 'Bruce',
    middleName = 'Thomas',
    lastName = 'Wayne',
    email,
    institutionNames = ['Test Institution 1'],
    hasAccesstoAllSites,
    clickOnNext = true,
  }) => {
    cy.get("[data-testid='input-firstName']").type(firstName);
    if (middleName) {
      cy.get("[data-testid='input-middleName']").type(middleName);
    }
    cy.get("[data-testid='input-lastName']").type(lastName);

    cy.selectFromDropDown("[data-testid='select-country-code']", 'United States (+1)');
    cy.get("[data-testid='input-phoneNumber']").type('5555555555');
    cy.selectFromDropDown("[data-testid='select-additional-country-code']", 'United States (+1)');
    cy.get("[data-testid='input-additionalPhoneNumber']").type('4444444444');
    cy.get("[data-testid='input-email']").type(email);

    if (hasAccesstoAllSites) {
      cy.get('[data-testid="label-institution-radio-group-true"]').click();
    } else {
      institutionNames.forEach(institutionName => {
        cy.selectFromMultiSelect(
          'div[data-testid="multiselect-select-institutions"]',
          institutionName
        );
      });
    }
    steps.submitCreateUserPage(clickOnNext);
  },

  AssertUserCreated: email => {
    findUserInPaginatedUsersList({ type: 'email', value: email });
  },

  CreateGlobalRole: (headers, globalRoleName) => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('PLATFORM_URL')}/identity_providers`,
      headers,
    })
      .should(resp => {
        expect(resp.status).to.eq(200, 'identity providers request status');
      })
      .then(resp => {
        const allIdentityProvider = resp.body.data;
        return allIdentityProvider[0].id;
      })
      .then(identityProviderId => {
        cy.request({
          method: 'POST',
          url: `${Cypress.env('PLATFORM_URL')}/user_roles`,
          headers,
          body: {
            _jsonapi: {
              data: {
                type: 'user_roles',
                attributes: {
                  name: globalRoleName,
                  is_sso: false,
                  with_phi: false,
                  is_global: true,
                  idp_user_role_identity_provider_id: identityProviderId,
                  idp_user_role_name: globalRoleName,
                  execution_contexts: [],
                },
              },
            },
          },
        });
      })
      .its('status')
      .should('equal', 201);
  },

  CreateProductJourneyRole: (headers, roleName, executionContexts) => {
    cy.request({
      method: 'GET',
      url: `${Cypress.env('PLATFORM_URL')}/execution_contexts`,
      headers,
    })
      .should(response => {
        expect(response.status).to.eq(200, 'execution contexts request status');
      })
      .then(response => {
        const allExecutionContexts = response.body.data;
        return allExecutionContexts
          .filter(ec => executionContexts.includes(ec.attributes.display_name))
          .map(ec => ({ value: ec.id }));
      })
      .should('not.be.empty')
      .then(executionContextsParams => {
        cy.request({
          method: 'GET',
          url: `${Cypress.env('PLATFORM_URL')}/identity_providers`,
          headers,
        })
          .should(response => {
            expect(response.status).to.eq(200, 'identity providers request status');
          })
          .then(response => {
            const allIdentityProvider = response.body.data;
            return allIdentityProvider[0].id;
          })
          .then(identityProviderId => {
            cy.request({
              method: 'POST',
              url: `${Cypress.env('PLATFORM_URL')}/user_roles`,
              headers,
              body: {
                _jsonapi: {
                  data: {
                    type: 'user_roles',
                    attributes: {
                      name: roleName,
                      is_sso: false,
                      with_phi: false,
                      is_global: false,
                      idp_user_role_identity_provider_id: identityProviderId,
                      idp_user_role_name: roleName,
                      execution_contexts: executionContextsParams,
                    },
                  },
                },
              },
            })
              .its('status')
              .should('equal', 201);
          });
      });
  },

  AssignGlobalRole: globalRoleName => {
    cy.selectFromMultiSelect('div.global-role-multi-select', globalRoleName);

    // This assertions should happen only in case of external IdP Users. So temporarily commenting it untill we add implementation
    // in cypress tests for adding valid external SSO users from cypress tests before assertion
    // alertNotificationCounter = 0;
    // cy.get(`[data-testid='banner-container-${alertNotificationCounter}']`)
    //   .should('have.css', 'background-color')
    //   .and('equal', 'rgb(249, 107, 69)');
    // cy.get(`[data-testid='banner-message-${alertNotificationCounter}']`).contains(globalRoleName);
    // alertNotificationCounter++;

    saveAndCloseGlobalRolesPage();
  },

  UnAssignGlobalRole: globalRoleName => {
    cy.get(`[data-testid='remove-selection-${camelCase(globalRoleName)}']`).click();

    submitGlobalRolesPage();
  },

  AssignProductJourneyRoles: params => {
    params.forEach(({ productJourneys, roleName }) => {
      productJourneys.forEach(productJourney => {
        cy.get(
          `div.${camelCase(productJourney)}-multi-select div[data-testid="multiselect-select-"]`
        )
          .first()
          .click();
        cy.get(
          `div.${camelCase(productJourney)}-multi-select div[data-testid="multiselect-select-"]`
        )
          .contains('div', roleName)
          .click();
      });

      // This assertions should happen only in case of external IdP Users. So temporarily commenting it until we add implementation
      // in cypress tests for adding valid external SSO users from cypress tests before assertion
      // alertNotificationCounter = 0;
      // cy.get(`[data-testid='banner-container-${alertNotificationCounter}']`)
      //   .should('have.css', 'background-color')
      //   .and('equal', 'rgb(249, 107, 69)');
      // cy.get(`[data-testid='banner-message-${alertNotificationCounter}']`).contains(roleName);
    });
    // alertNotificationCounter++;

    submitProductJourneyRolesPage();
  },

  UnAssignProductJourneyRoles: params => {
    goToProductJourneyRolesPage();

    params.forEach(({ productJourneys, roleName }) => {
      productJourneys.forEach(productJourney => {
        cy.get(
          `div.${camelCase(productJourney)}-multi-select [data-testid='remove-selection-${camelCase(
            roleName
          )}']`
        ).click();
      });
    });

    submitProductJourneyRolesPage();
  },

  navigateToUserPage: email => {
    cy.visit('/users');
    cy.wait('@users-list-page')
      .its('status')
      .should('equal', 200);
    cy.url().should('contain', 'users');

    // navigate to the page with the email address
    findUserInPaginatedUsersList({ type: 'email', value: email });

    // click on the user row
    cy.get('tbody')
      .contains(email)
      .closest('tr')
      .find('img')
      .click();

    cy.url().should('match', /\/users\/\d+$/);
    cy.wait(['@user-show-request', '@institutions-list-request']).spread(
      (userShow, institutions) => {
        expect(userShow.status).to.eq(200, 'user show request status');
        expect(institutions.status).to.eq(200, 'institution list request status');
      }
    );
  },

  verifyRoles: (
    params,
    isPJRoleAssigned,
    globalRoleName,
    selectPlaceholder,
    isGlobalRoleAssigned
  ) => {
    goToProductJourneyRolesPage();
    //Product journey roles verification
    params.forEach(({ roleName, productJourneys }) => {
      productJourneys.forEach(productJourney => {
        if (isPJRoleAssigned) {
          cy.get(
            `div.${camelCase(productJourney)}-multi-select [data-testid='selection-${camelCase(
              roleName
            )}']`
          ).contains(roleName);
        } else {
          cy.get(
            `div.${camelCase(productJourney)}-multi-select [data-testid='selection-${camelCase(
              roleName
            )}']`
          ).should('not.exist');
        }
      });
    });

    goToGlobalRolesPage();

    if (isGlobalRoleAssigned) {
      cy.get('[data-testid="multiselect-select-globalRoleS"]').contains(globalRoleName);
    } else {
      cy.get('[data-testid="multiselect-select-globalRoleS"]').contains(selectPlaceholder);
    }
  },

  ClickImportSsoUserViaCsv: () => {
    cy.get("[data-testid='import-sso-users-via-csv-button']").click();
    cy.wait('@identity-providers-request')
      .its('status')
      .should('equal', 200);
  },

  SelectIdp: () => {
    cy.selectFromDropDown("[data-testid='select-related-idp']", 'default (default)');
  },

  UploadUsersCSVFile: () => {
    documentUploadHelper.multipleDocumentsUpload(['sample_sso_users.csv'], {
      encoding: 'base64',
      selector: '.btn-file-input input',
      type: 'text/csv',
      inputType: 'input',
    });
  },

  AssertUsersImportedMessage: () => {
    cy.get("[data-testid='banner-container-0']").contains('2 user accounts have been imported.');
  },

  ClickImportViaCsvButton: () => {
    cy.get("[data-testid='import-users-via-csv-button']").click();
  },

  AssertImportedUsers: () => {
    cy.visit('/users');
    cy.wait('@users-list-page')
      .its('status')
      .should('equal', 200);
    findUserInPaginatedUsersList({ type: 'name', value: 'White, Sam' });
    cy.visit('/users');
    cy.wait('@users-list-page')
      .its('status')
      .should('equal', 200);
    findUserInPaginatedUsersList({ type: 'name', value: 'Red, Alice' });
  },

  checkImportUsersButtonExist: () => {
    cy.get('[name="import-sso-users-via-api"]').should('exist');
  },

  AssertSsoUsersImportedMessage: () => {
    cy.get('.alert-bar > span:nth-child(2)').contains('1 user accounts have been imported.');
  },

  addTherapyAccess: (userId, role, journey) => {
    cy.log('users/_steps/index.addTherapyAccess');
    cy.platformLogin('internal_ga_test_user@vineti.com', 'Password123');
    cy.visit('/users');
    steps.NavigateToUser(userId);
    goToProductJourneyRolesPage();
    steps.AssignProductJourneyRoles([{ roleName: role, productJourneys: journey }]);
  },

  removeTherapyAccess: (user, role, journey, userConstants) => {
    cy.log('users/_steps/index.removeTherapyAccess');
    cy.platformLogin('internal_ga_test_user@vineti.com', 'Password123');
    cy.visit('/users');
    steps.AssertListPageHeader(userConstants.userManagementString);
    steps.NavigateToUser(user);
    steps.UnAssignProductJourneyRoles([{ roleName: role, productJourneys: journey }]);
  },

  removeTherapiesIfApplied: (user, journey, userConstants) => {
    cy.log('users/_steps/index.removeTherapyAccess');
    cy.platformLogin('internal_ga_test_user@vineti.com', 'Password123');
    cy.visit('/users');
    steps.AssertListPageHeader(userConstants.userManagementString);
    steps.NavigateToUser(user);
    goToProductJourneyRolesPage();
    journey.forEach(({ productJourneys, roleName }) => {
      productJourneys.forEach(productJourney => {
        cy.get('.role-page').then(() => {
          const roleSelector = `.${camelCase(
            productJourney
          )}-multi-select [data-testid='remove-selection-${camelCase(roleName)}']`;
          const role = Cypress.$(roleSelector);
          if (role.length > 0) {
            cy.get(
              `div.${camelCase(
                productJourney
              )}-multi-select [data-testid='remove-selection-${camelCase(roleName)}']`
            ).click();
          }
        });
      });
    });
    submitProductJourneyRolesPage();
  },

  ReplaceAllUserRoles: (currentRole, newRole) => {
    cy.get(`[data-testid="selection-${camelCase(currentRole)}"]`)
      .parent('div')
      .each($el => {
        cy.wrap($el)
          .find('[data-testid^="remove-selection-"]')
          .click();
        cy.wrap($el)
          .find('[class*="Kc-placeholder"]')
          .click();
        cy.get('[role="menuitem"]')
          .contains(new RegExp(`^${newRole}$`))
          .click();
        cy.wrap($el).contains(newRole);
      });
  },

  submitProductJourneyRolesPage,
  saveAndCloseGlobalRolesPage,
  goToGlobalRolesPage,

  AssignSitesToUser: (userId, sites, allSites = false) => {
    cy.log('users/_steps/index.AssignSitesToUser');
    steps.NavigateToUser(userId);
    if (allSites) {
      cy.get('[id="this-user-has-access-to-all-sites"]').check({ force: true }); // eslint-disable-line
      steps.SaveAndClose();
    } else {
      cy.get('[id="this-user-only-has-access-to-some-sites"]').check({ force: true }); // eslint-disable-line
      cy.get('.institution-multi-select').then(() => {
        let selector = '[data-testid="multi-select-clear-all"]';
        let exist = Cypress.$(selector).length;

        if (exist > 0) {
          cy.get('[data-testid="multi-select-clear-all"]').click();
        }
        sites.forEach(site => {
          cy.get('[class$="indicatorContainer"] svg').click();
          cy.contains(
            '[data-testid="multiselect-select-institutions"] [id^="react-select"]',
            site
          ).click();
        });
        steps.SaveAndClose();
      });
    }
  },
};
