export const getPriorityId = (steps, procedureStepId) => {
  const procedureStep = steps.find(step => step.id === procedureStepId);
  return procedureStep ? procedureStep.attributes.priority : '';
};

export const getShipmentLegId = (steps, legName) => {
  const shipmentLegStep = steps.find(
    step => step.type === 'shipment_legs' && step.attributes.name === legName
  );
  return shipmentLegStep ? shipmentLegStep.id : '';
};

export const getShipmentId = (steps, shipmentLegId) => {
  const shipmentStep = steps.find(
    step => step.type === 'shipments' && step.relationships.leg.data.id === shipmentLegId
  );
  return shipmentStep ? shipmentStep.id : '';
};

export const getResourceIds = (steps, resourceType = 'specimens') => {
  return steps
    .filter(step => step.type === resourceType)
    .map(step => step.id)
    .sort((a, b) => b - a); // DESC
};

export const getLatestProcedureStepId = steps => getResourceIds(steps, 'procedure_steps')[0];

export const getProcedureBody = (
  tokenData,
  procedureId,
  failOnStatusCode = true,
  responseStatusCode = 200
) => {
  return cy
    .request({
      failOnStatusCode,
      method: 'GET',
      url: `${Cypress.env('PLATFORM_URL')}/procedures/${procedureId}`,
      headers: tokenData,
    })
    .then(response => {
      expect(response.status).to.eq(responseStatusCode, `/procedures/${procedureId} API call`);
      return response.body;
    });
};

export const getInstitutions = (tokenData, failOnStatusCode = true) => {
  return cy
    .request({
      failOnStatusCode,
      method: 'GET',
      url: `${Cypress.env('PLATFORM_URL')}/v1/institutions`,
      headers: tokenData,
    })
    .then(response => {
      return response.body;
    });
};

export const getSchedulingBody = (tokenData, coi) => {
  return cy.request({
    method: 'GET',
    url: `${Cypress.env('PLATFORM_URL')}/scheduling/schedules/${coi}`,
    headers: tokenData,
  });
};

export const getProcedureDateIds = steps => getResourceIds(steps, 'procedure_dates');

export const getInstUUID = (steps, procedure) => {
  const stepMatchingProcedure = steps.find(step => step.institutionCapabilityType === procedure);
  return stepMatchingProcedure ? stepMatchingProcedure.institutionExternalId : '';
};
export const getSpecimensIDs = specimens => {
  let ids = [];
  specimens.forEach(specimen => {
    if ('id' in specimen) {
      ids.push(specimen.id);
    }
  });
  return ids;
};
export const generateSubjectNumber = () => {
  // generate a unique integer-based value
  return new Date().getTime().toString();
};

export const getPatientId = procedures => {
  const patient = procedures.find(({ type }) => type === 'patients');
  return patient ? patient.id : undefined;
};

export const randomAlphaNumericStrByLength = lengthOfID => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < lengthOfID; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const getInstitutionUuidByName = (siteData, siteName) => {
  const institute = siteData.find(
    site => site.attributes.primary_address.location_name === siteName
  );
  return institute ? institute.attributes.uuid : undefined;
};

export const getInstitutionId = (siteData, siteName) => {
  const institute = siteData.find(
    site => site.attributes.primary_address.location_name === siteName
  );
  return institute ? institute.id : undefined;
};
