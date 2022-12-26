import rolesConstants from '../../../constants/roles.json';

const generateRandomString = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 5);

const clickOnWorkFlowPermission = (moduleDisplayName, module, accessLevel) => {
  cy.get('[data-testid="span-phase-name"]')
    .contains(new RegExp(`^${moduleDisplayName}$`))
    .parents('[data-testid ^= "collapse-"]')
    .first()
    .find(`[data-testid="label-${module}-${accessLevel}"]`)
    .click();
};

const domainPermissions = [
  {
    name: "scheduling",
    accessLevel: "write"
  },
  {
    name: "create_orders",
    accessLevel: "write"
  },
  {
    name: "execution_contexts",
    accessLevel: "write"
  },
  {
    name: "physicians",
    accessLevel: "write"
  },
  {
    name: "sites",
    accessLevel: "write"
  },
  {
    name: "subprocesses",
    accessLevel: "write"
  },
  {
    name: "users",
    accessLevel: "write"
  },
  {
    name: "procedure_steps",
    accessLevel: "write"
  },
  {
    name: "procedures",
    accessLevel: "write"
  },
  {
    name: "treatments",
    accessLevel: "write"
  }
]

export const globalPermissions = {
  _GenerateRandomString: generateRandomString,
  NavigateToRolesListPage: () => {
    cy.log('rolesAndPermissions/_steps/index.NavigateToRolesListPage');
    cy.visit('/roles');
    cy.wait(['@getAllRoles', '@execution-contexts-list-request']);
  },
  AssertPageLoad: () => {
    cy.log('rolesAndPermissions/_steps/index.AssertPageLoad');
    cy.get('header h1').contains(rolesConstants.userRolesAndPermissions);
  },
  CreateGlobalRole: (roleName, idpRoleName) => {
    cy.log('rolesAndPermissions/_steps/index.CreateGlobalRole');
    cy.get('header button').click();
    cy.wait('@execution-contexts-list-request');

    cy.get("[data-testid='label-isGlobal-true']").click();
    cy.get("button[data-testid='btn-next']").click();

    cy.get(".role-page input[name='name']").type(roleName);

    cy.selectFromDropDown('[data-testid="select-external-idp"]', 'default');
    cy.get(".role-page input[name='idpUserRoleName']").type(idpRoleName);

    cy.get("button[data-testid='btn-next']").click();
    cy.wait(['@userRole-create-request', '@getUserRole', '@basePermissions-list-request']);
  },
  AssignPermissionsToGlobalRole: () => {
    cy.log('rolesAndPermissions/_steps/index.AssignPermissionsToGlobalRole');

    domainPermissions.forEach((domainPermission) => {
      const name = domainPermission.name;
      const accessLevel = domainPermission.accessLevel;
      cy.get(`[data-testid='label-${name}-${accessLevel}']`).click();
    })
    cy.wait(5000);
    cy.get("[data-testid='btn-next']").click();
    cy.wait(['@basePermission-create-request','@getAllRoles', '@execution-contexts-list-request']);
  },
  VerifyAssignedPermissions: (roleName, permissionName, accessLevel) => {
    cy.log('rolesAndPermissions/_steps/index.VerifyAssignedPermissions');
    cy.get('tbody', { timeout: 3000 })
      .contains(roleName)
      .closest('tr')
      .click();

    cy.wait(['@getUserRole', '@execution-contexts-list-request']);

    cy.get("button[data-testid='btn-next']").click();
    cy.wait(['@userRole-update-request', '@getUserRole', '@basePermissions-list-request']);

    const name = permissionName.toLowerCase();
    cy.get(`[data-testid='${name}-${accessLevel}']`).should('be.checked');
  },
  AssertPermissionSet: permissions => {
    cy.log('rolesAndPermissions/_steps/index.AssertPermissionSet');
    cy.get('[data-testid^="collapse-chevron-"]')
      .then(elements =>
        elements
          .toArray()
          .map(element => element.dataset.testid.match(/^collapse-chevron-(.*)$/)[1])
          .sort()
      )
      .should('have.members', permissions.sort());
  },
  NavigateToGlobalPermissions: () => {
    cy.log('rolesAndPermissions/_steps/index.NavigateToGlobalPermissions');
    cy.get('[data-testid="admin-link-assign-global-permissions-name"]').click();
    cy.wait(['@getPermissions', '@basePermissions-list-request']);
  },
  assignAllPermissionsForGlobalRole: permissions => {
    cy.log('rolesAndPermissions/_steps/index.AssignPermissionsToGlobalRole');

    permissions.forEach(permission => {
      cy.get(
        `[data-testid='label-${permission.permissionName.toLowerCase()}-${permission.accessLevel}']`
      ).click();
    });
    cy.get("[data-testid='btn-next']").click();
    cy.waitForApi([
      { alias: '@basePermission-create-request', respCode: 200 },
      { alias: '@getAllRoles', respCode: 200 },
      { alias: '@execution-contexts-list-request', respCode: 200 },
    ]);
  },
};

export const assignPermissions = {
  NavigateToRolesPermissionPage: roleName => {
    cy.log('rolesAndPermissions/_steps/index.NavigateToRolesPermissionPage');
    cy.visit('/roles');
    cy.wait(['@getAllRoles']);

    cy.get('tbody', { timeout: 3000 })
      .contains(new RegExp(`^${roleName}$`))
      .closest('tr')
      .click();

    cy.wait(['@getUserRole', '@execution-contexts-list-request']);

    cy.selectFromMultiSelect(
      "[data-testid='multiselect-select-selectProductJourneyS']",
      'therapyVn1Ida'
    );
    cy.get("[data-testid='btn-next']").click();
    cy.wait([
      '@updateUserRole',
      '@getWorkflowPermissionsRequest',
      '@getExecutionContextPermissionsRequest',
    ]);
  },

  assertCountOfSubTherapies: (therapyPageHeader, count) => {
    cy.log('rolesAndPermissions/_steps/index.assertCountOfSubTherapies');
    cy.get('[data-testid="therapy-container"] h1').contains(therapyPageHeader);
    cy.get('[data-testid="therapy-item-therapy_vn1"]')
      .children()
      .should('have.length', count);
  },

  assertTherapyDoesNotExist: therapyName => {
    cy.log('rolesAndPermissions/_steps/index.assertTherapyDoesNotExist');
    cy.get('[data-testid="therapy-container"]')
      .contains(therapyName)
      .should('not.exist');
  },

  assertTherapyExists: therapyName => {
    cy.log('rolesAndPermissions/_steps/index.assertTherapyDoesNotExist');
    cy.get('[data-testid="therapy-container"]').contains(therapyName);
  },

  SelectTherapy: therapyIdentifier => {
    cy.log('rolesAndPermissions/_steps/index.SelectTherapy');
    cy.get(`[data-testid="execution-context-${therapyIdentifier}"]`).click();
    cy.wait('@getProcedure').then(xhr => {
      expect(xhr.status).to.eq(200, 'GET /procedures response status');
    });
  },

  CreateOrder: ordersHeader => {
    cy.log('rolesAndPermissions/_steps/index.CreateOrder');
    cy.get('[data-testid="nav_li_ordering"]').click();
    cy.get('[data-testid="ordering-header"]').contains(ordersHeader);
    cy.get('[data-testid="add-patient-button"]').click();
    cy.wait(['@getTherapies', '@getPermissions']);
  },

  NavigateToRoleDetails: roleName => {
    cy.log('rolesAndPermissions/_steps/index.NavigateToRoleDetails');
    cy.visit('/roles');
    cy.wait(['@getAllRoles', '@getPermissions', '@execution-contexts-list-request']);
    cy.wait(5000); // eslint-disable-line
    cy.get('tbody')
      .contains(new RegExp(`^${roleName}$`))
      .closest('tr')
      .click();
    cy.wait(['@execution-contexts-list-request']);
  },

  assignAllProductJourneysForAllTherapies: () => {
    cy.log('rolesAndPermissions/_steps/index.assignAllProductJourneysForAllTherapies');
    let counter;
    let listingCount;
    cy.get('[data-testid="multiselect-select-selectProductJourneyS"] input').click();
    cy.get('[data-testid="multiselect-select-selectProductJourneyS"]')
      .find('div [role="menuitem"]')
      .then(listing => {
        listingCount = Cypress.$(listing).length;
        cy.log(listingCount);
        for (counter = 0; counter < listingCount; counter++) {
          cy.get('[data-testid="multiselect-select-selectProductJourneyS"] input').click();
          cy.get('div [role="menuitem"]')
            .first()
            .click();
        }
      });
  },

  assignProductJorneyForTherapy: therapyName => {
    cy.log('rolesAndPermissions/_steps/index.assignProductJorneyForTherapy');
    cy.get('[data-testid="multiselect-select-selectProductJourneyS"] input').click();
    cy.get('[data-testid="multiselect-select-selectProductJourneyS"]')
      .find('div [role="menuitem"]')
      .contains(therapyName)
      .click();
  },

  removeListOfProductJourneys: therapyList => {
    cy.log('rolesAndPermissions/_steps/index.removeListOfProductJourneys');
    therapyList.forEach(therapyName => {
      cy.get(`[data-testid="remove-selection-${therapyName}"]`).click();
    });
  },

  removeAllProductJourneysForTherapy: therapyName => {
    cy.log('rolesAndPermissions/_steps/index.removeAllProductJourneysForTherapy');
    cy.get('[type="radio"][data-testid="isGlobal-false"]').click({ force: true }); // eslint-disable-line
    let selector = `[data-testid^="remove-selection-${therapyName}"]`;
    let count = Cypress.$(selector).length;
    cy.log('count' + count);

    cy.get(`[data-testid^="remove-selection-${therapyName}"]`).each($el => {
      cy.wrap($el).click();
    });
    cy.get("[data-testid='btn-next']").click();
    cy.wait(['@updateUserRole', '@getWorkflowPermissionsRequest']);
  },

  ClearAssignedProductJourney: (roleName, replaceWith = undefined) => {
    cy.log('rolesAndPermissions/_steps/index.ClearAssignedProductJourney');
    cy.visit('/roles');
    cy.wait(['@getAllRoles']);

    cy.get('tbody', { timeout: 3000 })
      .contains(roleName)
      .closest('tr')
      .click();

    cy.wait(['@getUserRole', '@execution-contexts-list-request']);
    cy.get('[data-testid="multi-select-clear-all"]').click();

    if (replaceWith) {
      cy.selectFromMultiSelect(
        "[data-testid='multiselect-select-selectProductJourneyS']",
        replaceWith
      );
    }

    cy.get('[data-testid="save-and-close"]').click();
  },

  AssertPageLoad: () => {
    cy.log('rolesAndPermissions/_steps/index.AssertPageLoad');
    cy.get('.role-page h1').contains(rolesConstants.assignPermissions);
  },

  AssignPermission: (phaseName, accessLevel) => {
    cy.log('rolesAndPermissions/_steps/index.AssignPermission');
    const name = phaseName.toLowerCase();
    cy.get(`[data-testid='label-${name}-${accessLevel}']`).click();
    cy.get("[data-testid='btn-next']").click();
    cy.wait(['@updatePermission', '@getAllRoles'], { requestTimeout: 10 * 1000 });
  },

  AssignPermissionOnly: (phaseName, accessLevel) => {
    cy.log('rolesAndPermissions/_steps/index.AssignPermissionOnly');
    const name = phaseName.toLowerCase();
    cy.get(`[data-testid='label-${name}-${accessLevel}']`).click();
  },

  AssignPermissionSet: phaseAndAccess => {
    cy.log('rolesAndPermissions/_steps/index.AssignPermissionSet');
    phaseAndAccess.forEach(element => {
      const name = element.phaseName.toLowerCase().replace(/ /g, '_');
      cy.get(`[data-testid='${name}-${element.accessLevel}']`).check({ force: true }); // eslint-disable-line
      if (element.esigAccess !== undefined) {
        cy.get(`[data-testid='${name}-${element.esigAccess}']`).check({ force: true }); // eslint-disable-line
      }
    });
  },

  AssignTherapyPermissionsToRole: (role, therapy, permissions, roleConstants) => {
    cy.log('rolesAndPermissions/_steps/index.AssignTherapyPermissionsToRole');
    assignPermissions.NavigateToRoleDetails(role);
    assignPermissions.assignProductJorneyForTherapy(therapy);
    assignPermissions.clickButtonSaveAndClose();
    assignPermissions.NavigateToRoleDetails(role);
    assignPermissions.NavigateToWorkflowPermissions(therapy, roleConstants);
    assignPermissions.AssignPermissionSet(permissions);
    cy.get('[data-testid="btn-save-and-close"]').click();
    cy.get('.role-list h1').contains(roleConstants.userRolesAndPermissions);
  },

  NavigateToWorkflowPermissions: (productJourney, roleConstants) => {
    cy.log('rolesAndPermissions/_steps/index.NavigateToWorkflowPermissions');
    cy.get('.role-page h1').contains(roleConstants.createUserRole);
    cy.get('[data-testid="admin-link-assign-permissions-name"]')
      .contains(productJourney)
      .click();
    cy.get('.role-page h1').contains(roleConstants.assignWorkflowPermissions);
    cy.get('[ data-testid="div-permissions-subheading"] span').contains(
      `PERMISSIONS ${productJourney.toUpperCase()}`
    );
  },

  SubmitPermissions: () => {
    cy.log('rolesAndPermissions/_steps/index.SubmitPermissions');
    cy.get("[data-testid='btn-next']").click();
    cy.wait(['@updatePermission', '@getAllRoles'], { requestTimeout: 10 * 1000 });
  },

  clickButtonNext: () => {
    cy.log('rolesAndPermissions/_steps/index.clickButtonNext');
    cy.get("[data-testid='btn-next']").click();
    //cy.wait(['@userRole-update-request'], { requestTimeout: 10 * 1000 });
  },

  clickButtonSave: () => {
    cy.log('rolesAndPermissions/_steps/index.clickButtonSave');
    cy.get("[data-testid='btn-next']").click();
  },

  clickButtonSaveAndClose: () => {
    cy.log('rolesAndPermissions/_steps/index.clickButtonSaveAndClose');
    cy.get('[data-testid="save-and-close"]').click();
    cy.wait(['@updateUserRole', '@getAllRoles', '@execution-contexts-list-request']);
  },

  updateRolePermissionForTherapy: roleName => {
    cy.log(
      `rolesAndPermissions/_steps/index.updateRolePermissionForTherapy : roleName-${roleName}`
    );
    let objCount = 0;

    cy.get('[data-testid="admin-link-assign-permissions-name"]').each($el => {
      if ($el.text() === roleName) {
        cy.get('[data-testid="admin-link-assign-permissions-name"]')
          .eq(objCount)
          .click();
        try {
          cy.get("[data-testid='label-patient-write']").click();
          cy.get("[data-testid='label-confirmation-verifier']").click();
          cy.get("[data-testid='label-order_status_tracking-write']").click();
          cy.get('[data-testid="label-procedure_start-write"]').click();

          cy.get("[data-testid='btn-save-and-close']").click();
          cy.wait(['@updatePermission', '@getAllRoles', '@execution-contexts-list-request'], {
            requestTimeout: 10 * 1000,
          });
        } catch (error) {}
      }
      objCount = objCount + 1;
    });
  },

  UncheckSignatureBox: (phaseName, accessLevel) => {
    cy.log('rolesAndPermissions/_steps/index.UncheckSignatureBox');
    const name = phaseName.toLowerCase();
    cy.get(`[data-testid='${name}-${accessLevel}']`).uncheck();
    cy.get("[data-testid='btn-next']").click();
    cy.wait(['@updatePermission', '@getAllRoles'], { requestTimeout: 10 * 1000 });
  },

  UncheckSignatureBoxOnly: (phaseName, accessLevel) => {
    cy.log('rolesAndPermissions/_steps/index.UncheckSignatureBoxOnly');
    const name = phaseName.toLowerCase();
    cy.get(`[data-testid='label-${name}-${accessLevel}']`).click();
  },

  AssertPermission: (phaseName, accessLevel, check = true) => {
    cy.log('rolesAndPermissions/_steps/index.AssertPermission');
    const name = phaseName.toLowerCase();
    const shouldBe = check ? 'be.checked' : 'not.be.checked';
    cy.get(`[data-testid='${name}-${accessLevel}']`).should(shouldBe);
  },

  AssertPhaseName: (phaseName, orderingPatient) => {
    cy.log('rolesAndPermissions/_steps/index.AssertPhaseName');
    cy.get(`[data-testid='collapse-chevron-${phaseName.toLowerCase()}']`).click();
    cy.wait('@getPhaseKey');
    cy.get(`[data-testid='collapse-chevron-phase-${orderingPatient}']`)
      .first()
      .click();
    cy.get(`[data-testid='collapse-phase-${orderingPatient}']`).contains(
      rolesConstants.currentStep
    );
    cy.get(`[data-testid='collapse-phase-${orderingPatient}']`).contains(
      rolesConstants.previousStep
    );
  },

  CheckPhiBox: () => {
    cy.get('[data-testid="checkbox-with-phi"]').should('not.be.checked');
    cy.get('[data-testid="checkbox-with-phi"]').check({ force: true }); // eslint-disable-line
  },

  UncheckPhiBox: () => {
    cy.get('[data-testid="checkbox-with-phi"]').should('be.checked');
    cy.get('[data-testid="checkbox-with-phi"]').uncheck({ force: true }); // eslint-disable-line
  },

  updateOrderingRolePermissionForTherapy: therapyName => {
    cy.log(
      `rolesAndPermissions/_steps/index.updateOrderingRolePermissionForTherapy : roleName-${therapyName}`
    );
    let objCount = 0;

    cy.get('[data-testid="admin-link-assign-permissions-name"]').each($el => {
      if ($el.text() === therapyName) {
        cy.get('[data-testid="admin-link-assign-permissions-name"]')
          .contains(therapyName)
          .click();
        cy.waitForApi([{ alias: '@getPermissions', respCode: 200 }]);
        cy.wait(5000); // eslint-disable-line
        try {
          cy.get("[data-testid='label-patient-write']").click();
          cy.get("[data-testid='label-ordering_site-write']").click();
          cy.get("[data-testid='label-prescriber-write']").click();
          cy.get("[data-testid='label-consent-write']").click();
          cy.get("[data-testid='label-scheduling-write']").click();
          cy.get("[data-testid='label-confirmation-write']").click();
          cy.get("[data-testid='label-confirmation-verifier']").click();
          cy.get("[data-testid='label-approval-write']").click();

          cy.get("[data-testid='label-cancel_reason-write']").click();
          cy.get("[data-testid='label-cancel_reason-approver']").click();

          cy.get("[data-testid='label-order_status_tracking-write']").click();

          cy.get('[data-testid="label-procedure_start-write"]').click();

          cy.get("[data-testid='btn-save-and-close']").click();
          cy.waitForApi([
            { alias: '@getAllRoles', respCode: 200 },
            { alias: '@execution-contexts-list-request', respCode: 200 },
            { alias: '@getPermissions', respCode: 200 },
            { alias: '@updatePermission', respCode: 200 },
          ]);
        } catch (error) {}
      }
      objCount = objCount + 1;
    });
  },

  updateOrderingRolePermissionForTherapyEuVn1: therapyName => {
    cy.log(
      `rolesAndPermissions/_steps/index.updateOrderingRolePermissionForTherapyEuVn1 : roleName-${therapyName}`
    );
    let objCount = 0;

    cy.get('[data-testid="admin-link-assign-permissions-name"]').each($el => {
      if ($el.text() === therapyName) {
        cy.get('[data-testid="admin-link-assign-permissions-name"]')
          .contains(therapyName)
          .click();
        cy.waitForApi([{ alias: '@getPermissions', respCode: 200 }]);
        cy.wait(5000); // eslint-disable-line
        try {
          cy.get("[data-testid='label-patient-write']").click();
          cy.get("[data-testid='label-ordering_site-write']").click();
          cy.get("[data-testid='label-scheduling-write']").click();
          cy.get("[data-testid='label-confirmation-write']").click();
          cy.get("[data-testid='label-confirmation-verifier']").click();
          cy.get("[data-testid='label-approval-write']").click();

          cy.get("[data-testid='label-cancel_reason-write']").click();
          cy.get("[data-testid='label-cancel_reason-approver']").click();

          cy.get("[data-testid='label-order_status_tracking-write']").click();

          cy.get('[data-testid="label-procedure_start-write"]').click();

          cy.get("[data-testid='btn-save-and-close']").click();
          cy.waitForApi([
            { alias: '@getAllRoles', respCode: 200 },
            { alias: '@execution-contexts-list-request', respCode: 200 },
            { alias: '@getPermissions', respCode: 200 },
            { alias: '@postPermissions', respCode: 200 },
          ]);
        } catch (error) {}
      }
      objCount = objCount + 1;
    });
  },

  updateOrderingRolePermissionForTherapyEuVn2: therapyName => {
    cy.log(
      `rolesAndPermissions/_steps/index.updateOrderingRolePermissionForTherapyEuVn2 : roleName-${therapyName}`
    );
    let objCount = 0;

    cy.get('[data-testid="admin-link-assign-permissions-name"]').each($el => {
      if ($el.text() === therapyName) {
        cy.get('[data-testid="admin-link-assign-permissions-name"]')
          .contains(therapyName)
          .click();
        cy.waitForApi([
          { alias: '@getPermissions', respCode: 200 },
          { alias: '@getUserRole', respCode: 200 },
        ]);
        cy.wait(5000); // eslint-disable-line
        try {
          cy.get("[data-testid='label-patient-write']").click();
          cy.get("[data-testid='label-ordering_site-write']").click();
          cy.get("[data-testid='label-scheduling-write']").click();
          cy.get("[data-testid='label-confirmation-write']").click();
          cy.get("[data-testid='label-confirmation-verifier']").click();
          cy.get("[data-testid='label-approval-write']").click();

          cy.get("[data-testid='label-cancel_reason-write']").click();
          cy.get("[data-testid='label-cancel_reason-approver']").click();

          cy.get("[data-testid='label-order_status_tracking-write']").click();

          cy.get('[data-testid="label-procedure_start-write"]').click();

          cy.get("[data-testid='btn-save-and-close']").click();
          cy.waitForApi([
            { alias: '@getAllRoles', respCode: 200 },
            { alias: '@execution-contexts-list-request', respCode: 200 },
            { alias: '@getPermissions', respCode: 200 },
            { alias: '@postPermissions', respCode: 200 },
          ]);
        } catch (error) {}
      }
      objCount = objCount + 1;
    });
  },

  updateCaseManagerRolePermissionForTherapy: (therapyName, isLastTherapy = false) => {
    cy.log(
      `rolesAndPermissions/_steps/index.updateCaseManagerRolePermissionForTherapy : roleName-${therapyName}`
    );
    let objCount = 0;

    cy.get('[data-testid="admin-link-assign-permissions-name"]').each($el => {
      if ($el.text() === therapyName) {
        cy.get('[data-testid="admin-link-assign-permissions-name"]')
          .contains(therapyName)
          .click();
        cy.wait(5000); // eslint-disable-line
        try {
          cy.get("[data-testid='label-patient-write']").click();
          cy.get("[data-testid='label-ordering_site-write']").click();
          cy.get("[data-testid='label-prescriber-write']").click();
          cy.get("[data-testid='label-consent-write']").click();
          cy.get("[data-testid='label-scheduling-write']").click();
          cy.get("[data-testid='label-confirmation-write']").click();
          cy.get("[data-testid='label-approval-write']").click();
          cy.get("[data-testid='label-approval-approver']").click();

          cy.get("[data-testid='label-cancel_reason-write']").click();
          cy.get("[data-testid='label-cancel_reason-approver']").click();

          cy.get("[data-testid='label-order_status_tracking-write']").click();

          cy.get('[data-testid="label-procedure_start-write"]').click();

          cy.get("[data-testid='btn-next']").click();
          if (isLastTherapy) {
            cy.wait('@getAllRoles');
            cy.get('header h1').contains(rolesConstants.userRolesAndPermissions);
          } else {
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(5000); //eslint-disable
          }
        } catch (error) {}
      }
      objCount = objCount + 1;
    });
  },

  updateCaseManagerRolePermissionForTherapyEuVn2: therapyName => {
    cy.log(
      `rolesAndPermissions/_steps/index.updateCaseManagerRolePermissionForTherapyEuVn2 : roleName-${therapyName}`
    );
    let objCount = 0;

    cy.get('[data-testid="admin-link-assign-permissions-name"]').each($el => {
      if ($el.text() === therapyName) {
        cy.get('[data-testid="admin-link-assign-permissions-name"]')
          .contains(therapyName)
          .click();
        cy.get('[data-testid="span-phase-name"]')
          .contains('Ordering Lean Patient')
          .should('not.exist');
        cy.waitForApi([
          { alias: '@getPermissions', respCode: 200 },
          { alias: '@getUserRole', respCode: 200 },
        ]);
        cy.wait(5000); // eslint-disable-line
        try {
          clickOnWorkFlowPermission('Ordering Lean 2 Patient', 'patient', 'write');
          clickOnWorkFlowPermission('Ordering Lean 2 Ordering Site', 'ordering_site', 'write');
          clickOnWorkFlowPermission('Ordering Lean 2 Scheduling', 'scheduling', 'write');
          clickOnWorkFlowPermission('Ordering Lean 2 Confirmation', 'confirmation', 'write');
          clickOnWorkFlowPermission('Ordering Lean 2 Approval', 'approval', 'write');
          clickOnWorkFlowPermission('Ordering Lean 2 Approval', 'approval', 'approver');

          cy.get("[data-testid='label-cancel_reason-write']").click();
          cy.get("[data-testid='label-cancel_reason-approver']").click();

          cy.get("[data-testid='label-order_status_tracking-write']").click();

          cy.get('[data-testid="label-procedure_start-write"]').click();

          cy.get("[data-testid='btn-next']").click();
          cy.waitForApi([
            { alias: '@execution-contexts-list-request', respCode: 200 },
            { alias: '@getPermissions', respCode: 200 },
            { alias: '@postPermissions', respCode: 200 },
            { alias: '@getAllRoles', respCode: 200 },
          ]);
        } catch (error) {}
      }
      objCount = objCount + 1;
    });
  },

  updateCaseManagerRolePermissionForTherapyUsVn2: (therapyName, isLastTherapy = false) => {
    cy.log(
      `rolesAndPermissions/_steps/index.updateCaseManagerRolePermissionForTherapyUsVn2 : roleName-${therapyName}`
    );
    let objCount = 0;

    cy.get('[data-testid="admin-link-assign-permissions-name"]').each($el => {
      if ($el.text() === therapyName) {
        cy.get('[data-testid="admin-link-assign-permissions-name"]')
          .contains(therapyName)
          .click();
        cy.waitForApi([
          { alias: '@getPermissions', respCode: 200 },
          { alias: '@getUserRole', respCode: 200 },
        ]);
        cy.wait(5000); // eslint-disable-line
        try {
          clickOnWorkFlowPermission('Ordering Us 2 Patient', 'patient', 'write');
          clickOnWorkFlowPermission('Ordering Us 2 Ordering Site', 'ordering_site', 'write');
          clickOnWorkFlowPermission('Ordering Us 2 Scheduling', 'scheduling', 'write');
          clickOnWorkFlowPermission('Ordering Us 2 Confirmation', 'confirmation', 'write');
          clickOnWorkFlowPermission('Ordering Us 2 Approval', 'approval', 'write');
          clickOnWorkFlowPermission('Ordering Us 2 Approval', 'approval', 'approver');
          clickOnWorkFlowPermission('Ordering Us 2 Prescriber', 'prescriber', 'write');
          clickOnWorkFlowPermission('Ordering Us 2 Consent', 'consent', 'write');
          cy.get("[data-testid='label-cancel_reason-write']").click();
          cy.get("[data-testid='label-cancel_reason-approver']").click();

          cy.get("[data-testid='label-order_status_tracking-write']").click();

          cy.get('[data-testid="label-procedure_start-write"]').click();

          cy.get("[data-testid='btn-next']").click();
          if (isLastTherapy) {
            cy.wait('@getAllRoles');
            cy.get('header h1').contains(rolesConstants.userRolesAndPermissions);
          } else {
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(5000);
          }
        } catch (error) {}
      }
      objCount = objCount + 1;
    });
  },

  updateCaseManagerRolePermissionForTherapyEuVn1: (therapyName, isLastTherapy = false) => {
    cy.log(
      `rolesAndPermissions/_steps/index.updateCaseManagerRolePermissionForTherapyEuVn1 : roleName-${therapyName}`
    );
    let objCount = 0;

    cy.get('[data-testid="admin-link-assign-permissions-name"]').each($el => {
      if ($el.text() === therapyName) {
        cy.get('[data-testid="admin-link-assign-permissions-name"]')
          .contains(therapyName)
          .click();
        cy.get('[data-testid="span-phase-name"]')
          .contains('Ordering Lean 2 Patient')
          .should('not.exist');
        cy.waitForApi([
          { alias: '@getPermissions', respCode: 200 },
          { alias: '@getUserRole', respCode: 200 },
        ]);
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(5000);
        try {
          clickOnWorkFlowPermission('Ordering Lean Patient', 'patient', 'write');
          clickOnWorkFlowPermission('Ordering Lean Ordering Site', 'ordering_site', 'write');
          clickOnWorkFlowPermission('Ordering Lean Scheduling', 'scheduling', 'write');
          clickOnWorkFlowPermission('Ordering Lean Confirmation', 'confirmation', 'write');
          clickOnWorkFlowPermission('Ordering Lean Approval', 'approval', 'write');
          clickOnWorkFlowPermission('Ordering Lean Approval', 'approval', 'approver');

          cy.get("[data-testid='label-cancel_reason-write']").click();
          cy.get("[data-testid='label-cancel_reason-approver']").click();

          cy.get("[data-testid='label-order_status_tracking-write']").click();

          cy.get('[data-testid="label-procedure_start-write"]').click();

          cy.get("[data-testid='btn-next']").click();
          if (isLastTherapy) {
            cy.wait('@getAllRoles');
            cy.get('header h1').contains(rolesConstants.userRolesAndPermissions);
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(5000);
          } else {
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(5000);
          }
        } catch (error) {}
      }
      objCount = objCount + 1;
    });
  },

  updateCapacityManagerRolePermissionForTherapy: (therapyName, isLastTherapy = false) => {
    cy.log(
      `rolesAndPermissions/_steps/index.updateCapacityManagerRolePermissionForTherapy : therapyName-${therapyName}`
    );
    let objCount = 0;
    cy.get('[data-testid="execution-context-display-name"]').contains(therapyName.toUpperCase());
    cy.get('[data-testid="admin-link-assign-permissions-name"]').each($el => {
      if ($el.text() === therapyName) {
        cy.get('[data-testid="admin-link-assign-permissions-name"]')
          .contains(therapyName)
          .click();
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(5000);
        try {
          cy.get("[data-testid='label-order_status_tracking-write']").click();
          cy.get("[data-testid='label-procedure_start-write']").click();
          cy.get("[data-testid='btn-next']").click();
          cy.waitForApi([
            { alias: '@getUserRole', respCode: 200 },
            { alias: '@getUserRole', respCode: 200 },
          ]);
          if (isLastTherapy) {
            cy.wait('@getAllRoles');
            cy.get('header h1').contains(rolesConstants.userRolesAndPermissions);
          } else {
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(5000);
          }
        } catch (error) {}
      }
      objCount = objCount + 1;
    });
  },

  updateAphNurseRolePermissionForTherapy: (therapyName, isLastTherapy = false) => {
    cy.log(
      `rolesAndPermissions/_steps/index.updateAphNurseRolePermissionForTherapy : roleName-${therapyName}`
    );
    let objCount = 0;

    cy.get('[data-testid="admin-link-assign-permissions-name"]').each($el => {
      if ($el.text() === therapyName) {
        cy.get('[data-testid="admin-link-assign-permissions-name"]')
          .contains(therapyName)
          .click();
        cy.wait(5000); // eslint-disable-line
        try {
          cy.get("[data-testid='label-idm-write']").click();
          cy.get("[data-testid='label-label_printing-write']").click();
          cy.get("[data-testid='label-collection-write']").click();
          cy.get("[data-testid='label-collection-approver']").click();
          cy.get("[data-testid='label-collection-verifier']").click();

          cy.get("[data-testid='label-handoff_give-write']").click();
          cy.get("[data-testid='label-handoff_give-approver']").click();

          cy.get("[data-testid='label-order_status_tracking-write']").click();

          cy.get('[data-testid="label-procedure_start-write"]').click();

          cy.get("[data-testid='btn-next']").click();
          if (isLastTherapy) {
            cy.wait('@getAllRoles');
            cy.get('header h1').contains(rolesConstants.userRolesAndPermissions);
          } else {
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(5000);
          }
        } catch (error) {}
      }
      objCount = objCount + 1;
    });
  },

  updateAphNurseRolePermissionForTherapyEuVn1: (therapyName, isLastTherapy = false) => {
    cy.log(
      `rolesAndPermissions/_steps/index.updateAphNurseRolePermissionForTherapyEuVn1 : roleName-${therapyName}`
    );
    let objCount = 0;

    cy.get('[data-testid="admin-link-assign-permissions-name"]').each($el => {
      if ($el.text() === therapyName) {
        cy.get('[data-testid="admin-link-assign-permissions-name"]')
          .contains(therapyName)
          .click();
        cy.wait(5000); // eslint-disable-line
        try {
          cy.get("[data-testid='label-idm-write']").click();
          cy.get("[data-testid='label-collection-write']").click();
          cy.get("[data-testid='label-collection-approver']").click();
          cy.get("[data-testid='label-collection-verifier']").click();

          cy.get("[data-testid='label-handoff_give-write']").click();
          cy.get("[data-testid='label-handoff_give-approver']").click();

          cy.get("[data-testid='label-order_status_tracking-write']").click();

          cy.get('[data-testid="label-procedure_start-write"]').click();

          cy.get("[data-testid='btn-next']").click();
          cy.waitForApi([{ alias: '@postPermissions', respCode: 200 }]);
          if (isLastTherapy) {
            cy.wait('@getAllRoles');
            cy.get('header h1').contains(rolesConstants.userRolesAndPermissions);
          } else {
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(5000);
          }
        } catch (error) {}
      }
      objCount = objCount + 1;
    });
  },

  updateAphNurseRolePermissionForTherapyEuVn2: (therapyName, isLastTherapy = false) => {
    cy.log(
      `rolesAndPermissions/_steps/index.updateAphNurseRolePermissionForTherapyEuVn2 : roleName-${therapyName}`
    );
    let objCount = 0;

    cy.get('[data-testid="admin-link-assign-permissions-name"]').each($el => {
      if ($el.text() === therapyName) {
        cy.get('[data-testid="admin-link-assign-permissions-name"]')
          .contains(therapyName)
          .click();
        cy.get('[data-testid="span-phase-name"]')
          .contains('Collection Us 2 Idm')
          .should('not.exist');
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(5000);
        try {
          clickOnWorkFlowPermission('Collection Lean 2 Idm', 'idm', 'write');
          cy.get("[data-testid='label-collection-write']").click();
          cy.get("[data-testid='label-collection-approver']").click();
          cy.get("[data-testid='label-collection-verifier']").click();
          cy.get("[data-testid='label-handoff_give-write']").click();
          cy.get("[data-testid='label-handoff_give-approver']").click();
          cy.get("[data-testid='label-order_status_tracking-write']").click();
          cy.get('[data-testid="label-procedure_start-write"]').click();
          cy.get("[data-testid='label-handoff_receipt-write']").click();
          cy.get('[data-testid="label-cryopreservation_summary-approver"]').click();
          cy.get('[data-testid="label-cryopreservation_summary-verifier"]').click();
          cy.get('[data-testid="label-transfer_to_shipper-approver"]').click();
          cy.get('[data-testid="label-transfer_to_shipper-verifier"]').click();

          clickOnWorkFlowPermission('Collection Lean 2 Pbmc Bags', 'pbmc_bags', 'write');
          clickOnWorkFlowPermission('Collection Lean 2 Bag Storage', 'bag_storage', 'write');
          clickOnWorkFlowPermission('Collection Lean 2 Apply Labels', 'apply_labels', 'write');
          clickOnWorkFlowPermission('Collection Lean 2 Apply Labels', 'apply_labels', 'verifier');
          clickOnWorkFlowPermission(
            'Collection Lean 2 Cryopreservation Data',
            'cryopreservation_data',
            'write'
          );
          clickOnWorkFlowPermission(
            'Collection Lean 2 Cryopreservation Summary',
            'cryopreservation_summary',
            'write'
          );
          clickOnWorkFlowPermission('Collection Lean 2 Bag Selection', 'bag_selection', 'write');
          clickOnWorkFlowPermission(
            'Collection Lean 2 Quality Release',
            'quality_release',
            'write'
          );
          clickOnWorkFlowPermission(
            'Collection Lean 2 Transfer To Shipper',
            'transfer_to_shipper',
            'write'
          );
          clickOnWorkFlowPermission(
            'Collection Lean 2 Shipping Checklist',
            'shipping_checklist',
            'write'
          );
          clickOnWorkFlowPermission(
            'Collection Lean 2 Handoff Receipt',
            'handoff_receipt',
            'approver'
          );
          clickOnWorkFlowPermission(
            'Collection Lean 2 Shipping Summary',
            'shipping_summary',
            'write'
          );
          clickOnWorkFlowPermission(
            'Collection Lean 2 Shipping Summary',
            'shipping_summary',
            'approver'
          );
          clickOnWorkFlowPermission(
            'Collection Lean 2 Shipping Summary',
            'shipping_summary',
            'verifier'
          );
          cy.get("[data-testid='btn-next']").click();
          cy.waitForApi([{ alias: '@postPermissions', respCode: 200 }]);
          if (isLastTherapy) {
            cy.get('header h1').contains(rolesConstants.userRolesAndPermissions);
          } else {
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(5000);
          }
        } catch (error) {}
      }
      objCount = objCount + 1;
    });
  },

  updateCellLabOperatorRolePermissionForTherapy: (therapyName, isLastTherapy = false) => {
    cy.log(
      `rolesAndPermissions/_steps/index.updateCellLabOperatorRolePermissionForTherapy : roleName-${therapyName}`
    );
    let objCount = 0;

    cy.get('[data-testid="admin-link-assign-permissions-name"]').each($el => {
      if ($el.text() === therapyName) {
        cy.get('[data-testid="admin-link-assign-permissions-name"]')
          .contains(therapyName)
          .click();
        cy.waitForApi([{ alias: '@getUserRole', respCode: 200 }]);
        cy.wait(5000); // eslint-disable-line
        try {
          cy.get("[data-testid='label-handoff_receipt-write']").click();
          cy.get("[data-testid='label-handoff_receipt-approver']").click();

          clickOnWorkFlowPermission('Collection Shipping', 'shipping', 'write');
          clickOnWorkFlowPermission('Collection Shipping', 'shipping', 'approver');
          clickOnWorkFlowPermission('Collection Shipping', 'shipping', 'verifier');

          cy.get("[data-testid='label-shipment_receipt-write']").click();
          cy.get("[data-testid='label-shipment_receipt-approver']").click();
          cy.get("[data-testid='label-shipment_receipt-verifier']").click();

          clickOnWorkFlowPermission('Infusion Product Receipt', 'product_receipt', 'write');
          clickOnWorkFlowPermission('Infusion Product Receipt', 'product_receipt', 'approver');
          clickOnWorkFlowPermission('Infusion Product Receipt', 'product_receipt', 'verifier');

          cy.get("[data-testid='label-order_status_tracking-write']").click();

          cy.get('[data-testid="label-procedure_start-write"]').click();

          cy.get("[data-testid='btn-next']").click();
          //cy.waitForApi([{ alias: '@postPermissions', respCode: 200 }]);
          if (isLastTherapy) {
            cy.waitForApi([
              { alias: '@getAllRoles', respCode: 200 },
              { alias: '@execution-contexts-list-request', respCode: 200 },
              { alias: '@getPermissions', respCode: 200 },
            ]);
            cy.get('header h1').contains(rolesConstants.userRolesAndPermissions);
          } else {
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(5000);
          }
        } catch (error) {}
      }
      objCount = objCount + 1;
    });
  },
  updateQualityRolePermissionForTherapy: (therapyName, isLastTherapy = false) => {
    cy.log(
      `rolesAndPermissions/_steps/index.updateQualityRolePermissionForTherapy : therapyName-${therapyName}`
    );
    let objCount = 0;
    cy.get('[data-testid="execution-context-display-name"]').contains(therapyName.toUpperCase());
    cy.get('[data-testid="admin-link-assign-permissions-name"]').each($el => {
      if ($el.text() === therapyName) {
        cy.get('[data-testid="admin-link-assign-permissions-name"]')
          .contains(therapyName)
          .click();
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(5000);
        try {
          cy.get("[data-testid='label-order_status_tracking-write']").click();
          cy.get("[data-testid='label-procedure_start-write']").click();

          cy.get("[data-testid='btn-next']").click();
          if (isLastTherapy) {
            cy.wait('@getAllRoles');
            cy.get('header h1').contains(rolesConstants.userRolesAndPermissions);
          } else {
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(5000);
          }
        } catch (error) {}
      }
      objCount = objCount + 1;
    });
  },
  updateManufacturingTechnicianRolePermissionForTherapy: (therapyName, isLastTherapy = false) => {
    cy.log(
      `rolesAndPermissions/_steps/index.updateManufacturingTechnicianRolePermissionForTherapy : roleName-${therapyName}`
    );
    let objCount = 0;

    cy.get('[data-testid="admin-link-assign-permissions-name"]').each($el => {
      if ($el.text() === therapyName) {
        cy.get('[data-testid="admin-link-assign-permissions-name"]')
          .contains(therapyName)
          .click();
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(5000);
        try {
          [
            {
              moduleDisplayName: 'Manufacturing Lot Number',
              module: 'lot_number',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Summary Documents',
              module: 'summary_documents',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Verify Shipment',
              module: 'verify_shipment',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Shipping Receipt Checklist',
              module: 'shipping_receipt_checklist',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Shipping Receipt Checklist Summary',
              module: 'shipping_receipt_checklist_summary',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Product Receipt',
              module: 'product_receipt',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Product Receipt Checklist',
              module: 'product_receipt_checklist',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Product Receipt Summary',
              module: 'product_receipt_summary',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Manufacturing Start',
              module: 'manufacturing_start',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing First Stimulation',
              module: 'first_stimulation',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Second Stimulation',
              module: 'second_stimulation',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Harvesting',
              module: 'harvesting',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Final Product Labels',
              module: 'final_product_labels',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Final Product Bags',
              module: 'final_product_bags',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Apply Labels',
              module: 'apply_labels',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Bag Selection',
              module: 'bag_selection',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Quality Release',
              module: 'quality_release',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Transfer Product To Shipper',
              module: 'transfer_product_to_shipper',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Shipping Checklist',
              module: 'shipping_checklist',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Shipping Summary',
              module: 'shipping_summary',
              accessLevel: 'write',
            },
          ].forEach(workFlowPermission => {
            clickOnWorkFlowPermission(
              workFlowPermission.moduleDisplayName,
              workFlowPermission.module,
              workFlowPermission.accessLevel
            );
          });

          [
            {
              moduleDisplayName: 'Manufacturing Shipping Receipt Checklist Summary',
              module: 'shipping_receipt_checklist_summary',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing Product Receipt Summary',
              module: 'product_receipt_summary',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing Manufacturing Start',
              module: 'manufacturing_start',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing First Stimulation',
              module: 'first_stimulation',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing Second Stimulation',
              module: 'second_stimulation',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing Harvesting',
              module: 'harvesting',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing Final Product Labels',
              module: 'final_product_labels',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing Final Product Bags',
              module: 'final_product_bags',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing Apply Labels',
              module: 'apply_labels',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing Quality Release',
              module: 'quality_release',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing Transfer Product To Shipper',
              module: 'transfer_product_to_shipper',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing Shipping Summary',
              module: 'shipping_summary',
              accessLevel: 'approver',
            },
          ].forEach(workFlowPermission => {
            clickOnWorkFlowPermission(
              workFlowPermission.moduleDisplayName,
              workFlowPermission.module,
              workFlowPermission.accessLevel
            );
          });

          [
            {
              moduleDisplayName: 'Manufacturing Shipping Receipt Checklist Summary',
              module: 'shipping_receipt_checklist_summary',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Manufacturing Product Receipt Summary',
              module: 'product_receipt_summary',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Manufacturing Final Product Bags',
              module: 'final_product_bags',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Manufacturing Apply Labels',
              module: 'apply_labels',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Manufacturing Quality Release',
              module: 'quality_release',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Manufacturing Transfer Product To Shipper',
              module: 'transfer_product_to_shipper',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Manufacturing Shipping Summary',
              module: 'shipping_summary',
              accessLevel: 'verifier',
            },
          ].forEach(workFlowPermission => {
            clickOnWorkFlowPermission(
              workFlowPermission.moduleDisplayName,
              workFlowPermission.module,
              workFlowPermission.accessLevel
            );
          });

          [
            {
              moduleDisplayName: 'Wdc Summary Documents',
              module: 'summary_documents',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Wdc Verify Shipment',
              module: 'verify_shipment',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Wdc Shipment Receipt Checklist',
              module: 'shipment_receipt_checklist',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Wdc Product Receipt',
              module: 'product_receipt',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Wdc Bag Selection',
              module: 'bag_selection',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Wdc Quality Release',
              module: 'quality_release',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Wdc Shipping',
              module: 'shipping',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Wdc Shipment Schedule',
              module: 'shipment_schedule',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Wdc Shipper Labels',
              module: 'shipper_labels',
              accessLevel: 'write',
            },
          ].forEach(workFlowPermission => {
            clickOnWorkFlowPermission(
              workFlowPermission.moduleDisplayName,
              workFlowPermission.module,
              workFlowPermission.accessLevel
            );
          });

          [
            {
              moduleDisplayName: 'Wdc Shipment Receipt Checklist',
              module: 'shipment_receipt_checklist',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Wdc Product Receipt',
              module: 'product_receipt',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Wdc Quality Release',
              module: 'quality_release',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Wdc Shipping',
              module: 'shipping',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Wdc Shipper Labels',
              module: 'shipper_labels',
              accessLevel: 'approver',
            },
          ].forEach(workFlowPermission => {
            clickOnWorkFlowPermission(
              workFlowPermission.moduleDisplayName,
              workFlowPermission.module,
              workFlowPermission.accessLevel
            );
          });

          [
            {
              moduleDisplayName: 'Wdc Shipment Receipt Checklist',
              module: 'shipment_receipt_checklist',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Wdc Product Receipt',
              module: 'product_receipt',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Wdc Quality Release',
              module: 'quality_release',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Wdc Shipping',
              module: 'shipping',
              accessLevel: 'verifier',
            },
          ].forEach(workFlowPermission => {
            clickOnWorkFlowPermission(
              workFlowPermission.moduleDisplayName,
              workFlowPermission.module,
              workFlowPermission.accessLevel
            );
          });

          [
            {
              moduleDisplayName: 'Satellite Lab Summary Documents',
              module: 'summary_documents',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Satellite Lab Verify Shipment',
              module: 'verify_shipment',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Satellite Lab Shipment Receipt Checklist',
              module: 'shipment_receipt_checklist',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Satellite Lab Shipment Receipt Checklist Summary',
              module: 'shipment_receipt_checklist_summary',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Satellite Lab Pbmc Labels',
              module: 'pbmc_labels',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Satellite Lab Pbmc Bags',
              module: 'pbmc_bags',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Satellite Lab Apply Labels',
              module: 'apply_labels',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Satellite Lab Cryopreservation Data',
              module: 'cryopreservation_data',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Satellite Lab Bag Storage',
              module: 'bag_storage',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Satellite Lab Cryopreservation Summary',
              module: 'cryopreservation_summary',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Satellite Lab Bag Selection',
              module: 'bag_selection',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Satellite Lab Quality Release',
              module: 'quality_release',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Satellite Lab Transfer To Shipper',
              module: 'transfer_to_shipper',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Satellite Lab Shipping Checklist',
              module: 'shipping_checklist',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Satellite Lab Shipping Summary',
              module: 'shipping_summary',
              accessLevel: 'write',
            },
            ,
          ].forEach(workFlowPermission => {
            clickOnWorkFlowPermission(
              workFlowPermission.moduleDisplayName,
              workFlowPermission.module,
              workFlowPermission.accessLevel
            );
          });

          [
            {
              moduleDisplayName: 'Satellite Lab Shipment Receipt Checklist Summary',
              module: 'shipment_receipt_checklist_summary',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Satellite Lab Pbmc Labels',
              module: 'pbmc_labels',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Satellite Lab Apply Labels',
              module: 'apply_labels',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Satellite Lab Cryopreservation Summary',
              module: 'cryopreservation_summary',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Satellite Lab Quality Release',
              module: 'quality_release',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Satellite Lab Transfer To Shipper',
              module: 'transfer_to_shipper',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Satellite Lab Shipping Summary',
              module: 'shipping_summary',
              accessLevel: 'approver',
            },
            ,
          ].forEach(workFlowPermission => {
            clickOnWorkFlowPermission(
              workFlowPermission.moduleDisplayName,
              workFlowPermission.module,
              workFlowPermission.accessLevel
            );
          });

          [
            {
              moduleDisplayName: 'Satellite Lab Shipment Receipt Checklist Summary',
              module: 'shipment_receipt_checklist_summary',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Satellite Lab Apply Labels',
              module: 'apply_labels',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Satellite Lab Cryopreservation Summary',
              module: 'cryopreservation_summary',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Satellite Lab Transfer To Shipper',
              module: 'transfer_to_shipper',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Satellite Lab Shipping Summary',
              module: 'shipping_summary',
              accessLevel: 'verifier',
            },
            ,
          ].forEach(workFlowPermission => {
            clickOnWorkFlowPermission(
              workFlowPermission.moduleDisplayName,
              workFlowPermission.module,
              workFlowPermission.accessLevel
            );
          });

          cy.get("[data-testid='label-order_status_tracking-write']").click();

          cy.get('[data-testid="label-procedure_start-write"]').click();

          cy.get("[data-testid='btn-next']").click();
          cy.waitForApi([{ alias: '@postPermissions', respCode: 200 }]);
          if (isLastTherapy) {
            cy.wait('@getAllRoles');
            cy.get('header h1').contains(rolesConstants.userRolesAndPermissions);
          } else {
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(5000);
          }
        } catch (error) {}
      }
      objCount = objCount + 1;
    });
  },
  updateManufacturingQARolePermissionForTherapy: (therapyName, isLastTherapy = false) => {
    cy.log(
      `rolesAndPermissions/_steps/index.updateManufacturingQARolePermissionForTherapy : roleName-${therapyName}`
    );
    let objCount = 0;

    cy.get('[data-testid="admin-link-assign-permissions-name"]').each($el => {
      if ($el.text() === therapyName) {
        cy.get('[data-testid="admin-link-assign-permissions-name"]')
          .contains(therapyName)
          .click();
        cy.wait(5000); // eslint-disable-line
        try {
          [
            {
              moduleDisplayName: 'Manufacturing Lot Number',
              module: 'lot_number',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Summary Documents',
              module: 'summary_documents',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Verify Shipment',
              module: 'verify_shipment',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Shipping Receipt Checklist',
              module: 'shipping_receipt_checklist',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Shipping Receipt Checklist Summary',
              module: 'shipping_receipt_checklist_summary',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Product Receipt',
              module: 'product_receipt',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Product Receipt Checklist',
              module: 'product_receipt_checklist',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Product Receipt Summary',
              module: 'product_receipt_summary',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Manufacturing Start',
              module: 'manufacturing_start',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing First Stimulation',
              module: 'first_stimulation',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Second Stimulation',
              module: 'second_stimulation',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Harvesting',
              module: 'harvesting',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Final Product Labels',
              module: 'final_product_labels',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Final Product Bags',
              module: 'final_product_bags',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Apply Labels',
              module: 'apply_labels',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Bag Selection',
              module: 'bag_selection',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Quality Release',
              module: 'quality_release',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Transfer Product To Shipper',
              module: 'transfer_product_to_shipper',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Shipping Checklist',
              module: 'shipping_checklist',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Manufacturing Shipping Summary',
              module: 'shipping_summary',
              accessLevel: 'write',
            },
          ].forEach(workFlowPermission => {
            clickOnWorkFlowPermission(
              workFlowPermission.moduleDisplayName,
              workFlowPermission.module,
              workFlowPermission.accessLevel
            );
          });

          [
            {
              moduleDisplayName: 'Manufacturing Shipping Receipt Checklist Summary',
              module: 'shipping_receipt_checklist_summary',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing Product Receipt Summary',
              module: 'product_receipt_summary',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing Manufacturing Start',
              module: 'manufacturing_start',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing First Stimulation',
              module: 'first_stimulation',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing Second Stimulation',
              module: 'second_stimulation',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing Harvesting',
              module: 'harvesting',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing Final Product Labels',
              module: 'final_product_labels',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing Final Product Bags',
              module: 'final_product_bags',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing Apply Labels',
              module: 'apply_labels',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing Quality Release',
              module: 'quality_release',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing Transfer Product To Shipper',
              module: 'transfer_product_to_shipper',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Manufacturing Shipping Summary',
              module: 'shipping_summary',
              accessLevel: 'approver',
            },
          ].forEach(workFlowPermission => {
            clickOnWorkFlowPermission(
              workFlowPermission.moduleDisplayName,
              workFlowPermission.module,
              workFlowPermission.accessLevel
            );
          });

          [
            {
              moduleDisplayName: 'Manufacturing Shipping Receipt Checklist Summary',
              module: 'shipping_receipt_checklist_summary',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Manufacturing Product Receipt Summary',
              module: 'product_receipt_summary',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Manufacturing Final Product Bags',
              module: 'final_product_bags',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Manufacturing Apply Labels',
              module: 'apply_labels',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Manufacturing Quality Release',
              module: 'quality_release',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Manufacturing Transfer Product To Shipper',
              module: 'transfer_product_to_shipper',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Manufacturing Shipping Summary',
              module: 'shipping_summary',
              accessLevel: 'verifier',
            },
          ].forEach(workFlowPermission => {
            clickOnWorkFlowPermission(
              workFlowPermission.moduleDisplayName,
              workFlowPermission.module,
              workFlowPermission.accessLevel
            );
          });

          [
            {
              moduleDisplayName: 'Wdc Summary Documents',
              module: 'summary_documents',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Wdc Verify Shipment',
              module: 'verify_shipment',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Wdc Shipment Receipt Checklist',
              module: 'shipment_receipt_checklist',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Wdc Product Receipt',
              module: 'product_receipt',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Wdc Bag Selection',
              module: 'bag_selection',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Wdc Quality Release',
              module: 'quality_release',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Wdc Shipping',
              module: 'shipping',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Wdc Shipment Schedule',
              module: 'shipment_schedule',
              accessLevel: 'write',
            },
            {
              moduleDisplayName: 'Wdc Shipper Labels',
              module: 'shipper_labels',
              accessLevel: 'write',
            },
          ].forEach(workFlowPermission => {
            clickOnWorkFlowPermission(
              workFlowPermission.moduleDisplayName,
              workFlowPermission.module,
              workFlowPermission.accessLevel
            );
          });

          [
            {
              moduleDisplayName: 'Wdc Shipment Receipt Checklist',
              module: 'shipment_receipt_checklist',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Wdc Product Receipt',
              module: 'product_receipt',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Wdc Quality Release',
              module: 'quality_release',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Wdc Shipping',
              module: 'shipping',
              accessLevel: 'approver',
            },
            {
              moduleDisplayName: 'Wdc Shipper Labels',
              module: 'shipper_labels',
              accessLevel: 'approver',
            },
          ].forEach(workFlowPermission => {
            clickOnWorkFlowPermission(
              workFlowPermission.moduleDisplayName,
              workFlowPermission.module,
              workFlowPermission.accessLevel
            );
          });

          [
            {
              moduleDisplayName: 'Wdc Shipment Receipt Checklist',
              module: 'shipment_receipt_checklist',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Wdc Product Receipt',
              module: 'product_receipt',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Wdc Quality Release',
              module: 'quality_release',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Wdc Shipping',
              module: 'shipping',
              accessLevel: 'verifier',
            },
          ].forEach(workFlowPermission => {
            clickOnWorkFlowPermission(
              workFlowPermission.moduleDisplayName,
              workFlowPermission.module,
              workFlowPermission.accessLevel
            );
          });

          [
            {
              moduleDisplayName: 'Satellite Lab Pbmc Labels',
              module: 'pbmc_labels',
              accessLevel: 'write',
            },
          ].forEach(workFlowPermission => {
            clickOnWorkFlowPermission(
              workFlowPermission.moduleDisplayName,
              workFlowPermission.module,
              workFlowPermission.accessLevel
            );
          });

          [
            {
              moduleDisplayName: 'Satellite Lab Pbmc Labels',
              module: 'pbmc_labels',
              accessLevel: 'approver',
            },
          ].forEach(workFlowPermission => {
            clickOnWorkFlowPermission(
              workFlowPermission.moduleDisplayName,
              workFlowPermission.module,
              workFlowPermission.accessLevel
            );
          });

          [
            {
              moduleDisplayName: 'Satellite Lab Shipment Receipt Checklist Summary',
              module: 'shipment_receipt_checklist_summary',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Satellite Lab Apply Labels',
              module: 'apply_labels',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Satellite Lab Cryopreservation Summary',
              module: 'cryopreservation_summary',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Satellite Lab Transfer To Shipper',
              module: 'transfer_to_shipper',
              accessLevel: 'verifier',
            },
            {
              moduleDisplayName: 'Satellite Lab Shipping Summary',
              module: 'shipping_summary',
              accessLevel: 'verifier',
            },
            ,
          ].forEach(workFlowPermission => {
            clickOnWorkFlowPermission(
              workFlowPermission.moduleDisplayName,
              workFlowPermission.module,
              workFlowPermission.accessLevel
            );
          });

          cy.get("[data-testid='label-order_status_tracking-write']").click();

          cy.get('[data-testid="label-procedure_start-write"]').click();

          cy.get("[data-testid='btn-next']").click();
          cy.waitForApi([{ alias: '@postPermissions', respCode: 200 }]);
          if (isLastTherapy) {
            cy.wait('@getAllRoles');
            cy.get('header h1').contains(rolesConstants.userRolesAndPermissions);
          } else {
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(5000);
          }
        } catch (error) {}
      }
      objCount = objCount + 1;
    });
  },
};

export default {
  _GenerateRandomString: generateRandomString,

  AssertRolesListPageHeader: () => {
    cy.log('rolesAndPermissions/_steps/index.AssertRolesListPageHeader');
    cy.get('li[data-testid="nav_li_roles"]').click();
    //cy.wait('@getAllRoles');
    cy.get('header h1').contains(rolesConstants.userRolesAndPermissions);
  },

  AssertNewRoleCreated: roleName => {
    cy.log('rolesAndPermissions/_steps/index.AssertNewRoleCreated');
    cy.get("tr[data-testid='role-row']").contains(roleName);
  },

  CreateNewRoleWithAssociatedIdpRole: (roleName, idpRoleName) => {
    cy.log('rolesAndPermissions/_steps/index.CreateNewRoleWithAssociatedIdpRole');
    cy.get('header button').click();
    cy.wait('@execution-contexts-list-request');

    cy.get("button[data-testid='save-and-close']").click();
    cy.get('div[data-testid="role-name"] p').contains(rolesConstants.mustBeFilledText);

    cy.selectFromDropDown('[data-testid="select-external-idp"]', 'default');
    cy.get(".role-page input[name='name']").type(roleName);
    cy.get(".role-page input[name='idpUserRoleName']").type(idpRoleName);

    cy.get("[data-testid='multiselect-select-selectProductJourneyS']").click();
    cy.get("[role='menuitem']")
      .first()
      .click();

    cy.get("button[data-testid='save-and-close']").click();
    cy.wait('@userRole-create-request');
  },

  CreateDuplicateRole: (roleName, idpRoleName, roleNameDup) => {
    cy.log('rolesAndPermissions/_steps/index.CreateDuplicateRole');
    cy.get('header button').click();
    cy.wait('@execution-contexts-list-request');

    cy.get(".role-page input[name='name']").type(roleName);
    cy.selectFromDropDown('[data-testid="select-external-idp"]', 'default');
    cy.get("button[data-testid='save-and-close']").click();
    cy.get('div[data-testid="role-name"] p').contains(rolesConstants.mustBeUniqueText);

    cy.get(".role-page input[name='name']").clear();
    cy.get(".role-page input[name='name']").type(roleNameDup);
    cy.get("[data-testid='multiselect-select-selectProductJourneyS']").click();
    cy.get("[role='menuitem']")
      .first()
      .click();

    cy.get(".role-page input[name='idpUserRoleName']").type(idpRoleName);
    cy.get("button[data-testid='save-and-close']").click();
    // need to add logic to handle multiple languages
    cy.get('div[data-testid="idp-role-name"] p').contains(
      `The Idp User Role ${idpRoleName} is already associated with a User Role`
    );
  },

  AssertIdpRole: idpRoleName => {
    cy.log('rolesAndPermissions/_steps/index.AssertIdpRole');
    cy.get('input[name="idpUserRoleName"]')
      .invoke('val')
      .should('eq', idpRoleName);
  },

  UpdateIdpRole: newIdpRoleName => {
    cy.log('rolesAndPermissions/_steps/index.UpdateIdpRole');
    cy.get(".role-page input[name='idpUserRoleName']").type(newIdpRoleName);
    cy.get("[data-testid='multiselect-select-selectProductJourneyS']").click();
    cy.get("[role='menuitem']")
      .first()
      .click();
    cy.get("button[data-testid='save-and-close']").click();
    cy.wait('@userRole-update-request');
  },

  UpdateIdpRoleName: (role, newIdpRoleName, saveAndClose = true) => {
    cy.log('rolesAndPermissions/_steps/index.UpdateIdpRoleName');
    assignPermissions.NavigateToRoleDetails(role);
    cy.get(".role-page input[name='idpUserRoleName']")
      .clear()
      .type(newIdpRoleName);
    if (saveAndClose) {
      cy.get("button[data-testid='save-and-close']").click();
    }
  },

  AssertRoleUpdated: (roleName, therapyName) => {
    cy.log('rolesAndPermissions/_steps/index.AssertRoleUpdated');
    cy.get('tbody')
      .contains(roleName)
      .closest('tr')
      .contains(therapyName);
  },

  GotoRolePage: roleName => {
    cy.log('rolesAndPermissions/_steps/index.GotoRolePage');
    cy.get('li[data-testid="nav_li_roles"]').click();
    cy.get('header h1').contains(rolesConstants.userRolesAndPermissions);
    cy.get('tbody')
      .contains(roleName)
      .closest('tr')
      .click();
    cy.wait('@getUserRole');
  },

  // specify which role is being deleted
  DeleteRole: () => {
    cy.log('rolesAndPermissions/_steps/index.DeleteRole');
    cy.get("[data-testid='span-delete-role']").click();
    cy.get("[data-testid='button-yes-delete']").click();
    cy.wait('@userRole-delete-request');
  },

  AssertRoleDeleted: roleName => {
    cy.log('rolesAndPermissions/_steps/index.AssertRoleDeleted');
    cy.get('tbody').should('not.contain', roleName);
  },
  assignPermissions,
  globalPermissions,
};
