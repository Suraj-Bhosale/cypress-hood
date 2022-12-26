export const getAllRoles = tokenData => {
  return cy
    .request({
      method: 'GET',
      url: `${Cypress.env('PLATFORM_URL')}/user_roles`,
      headers: tokenData,
    })
    .should(response => {
      expect(response.status).to.eq(200, 'Roles List API call');
      //response.body.data.forEach(user => expect(user.type).to.eq(USER_TYPE));
    })
    .then(data => {
      return data.body;
    });
};

export const getRoleId = (response, roleName) => {
  return response.data.find(user => user.attributes.name === roleName);
};

export const updatePermissionsForGlobalRole = (tokenData, roleId, globalRoleAttributes) => {
  return cy
    .request({
      method: 'POST',
      url: `${Cypress.env('PLATFORM_URL')}/user_roles/${roleId}/base_permissions`,
      headers: tokenData,
      body: {
        data: {
          type: `/user_roles/${roleId}/base_permissions`,
          attributes: globalRoleAttributes,
        },
      },
    })
    .should(response => {
      expect(response.status).to.eq(200, `Update Role with ID "${roleId}" API call`);
    })
    .then(response => response);
};

export const addGlobalPermissionsToRole = (roleName, response, tokenData) => {
  let globalRoleAttributes = {};
  let roleInfo = getRoleId(response, roleName);
  let roleId = roleInfo.id;
  const rolePermissions = [
    { name: 'create_orders', access: 'write' },
    { name: 'execution_contexts', access: 'write' },
    { name: 'patients', access: 'write' },
    { name: 'physicians', access: 'write' },
    { name: 'scheduling', access: 'write' },
    { name: 'sites', access: 'write' },
    { name: 'subprocesses', access: 'write' },
    { name: 'users', access: 'write' },
    { name: 'analytics', access: 'none' },
    { name: 'capacity', access: 'none' },
    { name: 'import_sso_users', access: 'none' },
    { name: 'label_management', access: 'none' },
    { name: 'label_printing', access: 'none' },
    { name: 'languages', access: 'none' },
    { name: 'order_status_tracking', access: 'none' },
    { name: 'procedure_dates', access: 'none' },
    { name: 'procedure_steps', access: 'write' },
    { name: 'procedures', access: 'write' },
    { name: 'products', access: 'none' },
    { name: 'reports', access: 'none' },
    { name: 'specimens', access: 'none' },
    { name: 'manufacturing_runs', access: 'none' },
    { name: 'traceability', access: 'none' },
    { name: 'treatments', access: 'write' },
    { name: 'configuration_admin', access: 'none' },
  ];
  rolePermissions.forEach(permission => {
    globalRoleAttributes[permission.name] = {};
    globalRoleAttributes[permission.name].id = permission.name;
    globalRoleAttributes[permission.name].type = 'domain';
    globalRoleAttributes[permission.name].attributes = {};
    globalRoleAttributes[permission.name].attributes.domain = permission.name;
    globalRoleAttributes[permission.name].attributes.access = permission.access;
  });
  return updatePermissionsForGlobalRole(tokenData, roleId, globalRoleAttributes);
}
