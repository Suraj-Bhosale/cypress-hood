export const createPatientResourceIdentifier = `
mutation(
  $identifierType: String
  $identifier: String
  $resourceType: String
  $resourceId: Int
) {
  createResourceIdentifier(
    input: {
      identifierType: $identifierType
      identifier: $identifier
      resourceType: $resourceType
      resourceId: $resourceId
    }
  ) {
    resourceIdentifier {
      id
      identifier
      identifierType
      resourceId
      resourceType
    }
  }
}`;

export const fetchResourceIdentifierTemplate = [
  `
{
  resourceIdentifiers(identifierType:"`,
  `") {
    id
    identifierType
    identifier
    resourceType
    resourceId
  }
}`,
];

export const fetchResourceIdentifierByIDTemplate = [
  `
{
  resourceIdentifier(id:`,
  `) {
    id
    identifierType
    identifier
    resourceType
    resourceId
  }
}`,
];

export const fetchResourceIdentifierByIdTypeResIdTemplate = (identifierType, resourceId) => {
  return `{
    resourceIdentifiers(identifierType: "${identifierType}", resourceId: ${resourceId}) {
      id
      identifierType
      identifier
      resourceType
      resourceId
    }
  }`;
};

export const deleteResourceIdentifierTemplate = (identifierType, resourceType, resourceId) => {
  return `mutation {
    destroyResourceIdentifier(
      input: {
        resourceIdentifier: {
          identifierType: "${identifierType}"
          resourceType: "${resourceType}"
          resourceId: ${resourceId}
        }
      }
    ) {
      resourceIdentifier {
        id
        identifier
        identifierType
        resourceId
        resourceType
      }
    }
  }`;
};

export const updateResourceIdentifierTemplate = (
  identifierType,
  resourceType,
  resourceIdentifier_resourceId,
  identifier,
  resourceId
) => {
  return `mutation {
    updateResourceIdentifier(
      input:
        {
          resourceIdentifier: {
            identifierType: "${identifierType}",
            resourceType: "${resourceType}",
            resourceId: ${resourceIdentifier_resourceId} 
          }
          identifier: "${identifier}",
          resourceId: ${resourceId},
        }
    ) {
      resourceIdentifier {
        id,
        identifier,
        identifierType,
        resourceId,
        resourceType
      },
    }
  }`;
};
