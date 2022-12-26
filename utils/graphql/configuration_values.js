export const CONFIG_VALUE_UPSERT = `
  mutation($configKey: String, $value: String) {
    upsertConfigurationValue(
      input: {
        configKey: $configKey,
        value: $value
      }
    ) {
      configurationValue {
        key
        value
      }
    }
  }
`;
export const CONFIG_VALUE_READ = `
  query($configKey: String!) {
    configurationValueByKey(
        key: $configKey
    ) {
        key
        value
    }
  }
`;
export const CONFIG_VALUE_UPDATE = `
  mutation($configKey: String, $value: String) {
    updateConfigurationValue(
      input: {
        configKey: $configKey,
        value: $value
      }
    ) {
      configurationValue {
        key
        value
      }
    }
  }
`;
export const CONFIG_VALUE_CREATE = `
  mutation($configKey: String, $value: String) {
    createConfigurationValue(
      input: {
        configKey: $configKey,
        value: $value
      }
    ) {
      configurationValue {
        key
        value
      }
    }
  }
`;
