export const GET_SITES_LIST = `{
    sites {
      uuid
      name
      createdAt
      updatedAt
      tenantExternalId
      tissueEstablishmentNumber
      facilityIdentificationNumber
      opensTime
      closesTime
      isActive
      primaryLanguage
      primaryAddress {
        id
        locationName
        addressLine1
        addressLine2
        city
        state
        postalCode
        country
        type
        timeZone
      }
      dropOffContact {
        id
        name
        countryCode
        phoneNumber
      }
    }
  }
  `;

export const PATIENT_BY_ID_TOKEN = `{
    patient(id: 1) {
      id
      firstName
      lastName
      email
    }
  }`;
