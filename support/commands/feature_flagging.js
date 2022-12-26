import { loginApi, logoffApi } from '../../integration/api/api_login';
import { makeGraphqlCypressRequest } from '../../utils/graphql';
import { CONFIG_VALUE_UPSERT } from '../../utils/graphql/configuration_values';

// Requests
const upsertConfigurationValue = (
  tokenData,
  { configKey, value, failOnStatusCode = true, responseStatusCode = 200, responseMessage }
) => {
  return makeGraphqlCypressRequest(
    CONFIG_VALUE_UPSERT,
    {
      configKey,
      value,
    },
    { tokenData, skipSamlAuthToken: true },
    failOnStatusCode
  ).should(response => {
    expect(response.status).to.eq(responseStatusCode, responseMessage);
  });
};

// Example usage:
//
// describe('Feature flag enablement', () => {
//   before(cy.enableFeatures);
//
//   it('sets multiple feature flags', () => {
//     cy.setFeatures({ foo: 'enabled', bar: 'disabled' });
//   });
// });
Cypress.Commands.add('enableFeatures', (options = {}) => {
  const { test } = Cypress.mocha.getRunner().suite.ctx;

  if (test && test.type === 'hook' && test.hookName === 'before all') {
    test.parent.featuresEnabled = true;
    if (options.ignore) {
      test.parent.ignoredFeatures = options.ignore;
    }
  } else {
    throw featureEnablementError(test);
  }
});

/**
 * Update the feature flag on the server.
 * @param {string} featureName
 * @param {string} featureStatus - 'enabled` or 'disabled'
 */
const setFeature = (featureName, featureStatus) => {
  if (!['enabled', 'disabled'].includes(featureStatus)) {
    throw invalidStatusError({ featureName, featureStatus });
  }

  const configValue = featureStatus === 'enabled' ? 'true' : 'false';
  const message = `Feature ${featureStatus}: ${featureName}`;

  cy.setConfigValue(featureName, configValue, message);
};

// Example usage:
//
// it('sets multiple feature flags', () => {
//   cy.setFeatures({ foo: 'enabled', bar: 'disabled' });
// });
Cypress.Commands.add('setFeatures', featureToggles => {
  Object.entries(featureToggles).forEach(featureToggle => {
    const [featureName, featureStatus] = featureToggle;
    setFeature(featureName, featureStatus);
  });
});

// Example usage:
//
// it('changes a configuration value record', () => {
//   cy.setConfigValue('foo', 'bar');
// });
Cypress.Commands.add('setConfigValue', (configKey, value, message) => {
  // Set a default message
  const responseMessage = message || `{${configKey}: ${value}} - ConfigurationValue mutation`;
  const username = Cypress.env('internalGaSupportUser');
  const password = Cypress.env('internalGaUserPassword');

  loginApi(username, password).then(tokenData => {
    upsertConfigurationValue(tokenData, {
      configKey,
      value,
      responseMessage,
    });
    logoffApi(tokenData);
  });
});

// Structure:
// {
//   specFileName: {
//     groupId: {
//       featureFlagName: [true, false]
//     }
//   }
// }
let featureFlagUsage = {};

Cypress.Commands.add('validateFeatureFlagUsage', () => {
  trackingFeatureUsage = false;

  Object.entries(featureFlagUsage).forEach(featureFlagFileData => {
    const [fileName, flaggedGroups] = featureFlagFileData;

    Object.entries(flaggedGroups).forEach(groupFeatureUsage => {
      const [groupLine, featureUsage] = groupFeatureUsage;

      Object.entries(featureUsage).forEach(featureFlagPair => {
        const [flagName, flagValues] = featureFlagPair;

        cy.wrap(flagValues).then(values => {
          if (!values.includes(true) || !values.includes(false)) {
            assert.fail(featureFlagStatusMissingError({ fileName, groupLine, flagName, values }));
          }
        });
      });
    });
  });
  featureFlagUsage = {};
});

let trackingFeatureUsage = false;
const trackFeatureFlagUsage = flags => {
  const file = Cypress.spec.name;
  const test = determineCurrentTest();
  const line = determineLineNumber(test);
  const groupLine = getFeatureGroupLine(test);
  const ignoredFeatures = getIgnoredFeatures(test);

  // Throw an error on any test that uses feature flags without using the
  //  enableFeatures command
  if (!groupLine) {
    throw featureFlagsNotEnabledError({ flags, file, line });
  }

  setFeatureFlagUsage({ flags, file, groupLine, ignoredFeatures });
};

// called from Platform UI to track when a feature is used in a component
window.Cypress.trackFeatureUsage = ({ name, value }) => {
  if (!trackingFeatureUsage) {
    return;
  }

  // mimic structure used from parsing feature flag headers from an xhr request.
  const flags = [[name, value ? 'true' : 'false']];
  trackFeatureFlagUsage(flags);
};

// Track response headers on platform requests
//
// Only works on calls elicited from interactions in the UI or through the
//  cy.visit() command. cy.request() commands will have to be handled separately
Cypress.Commands.add('trackFeatureFlags', () => {
  trackingFeatureUsage = true;
  cy.server();

  cy.route({
    url: '**',
    onResponse: response => {
      parseAndSetFeatureFlagHeaders(response.response.headers);
    },
  });
});

// Works to track response headers on cy.request() commands
Cypress.Commands.overwrite('request', (original, ...options) => {
  return original(...options).then(response => {
    parseAndSetFeatureFlagHeaders(response.headers);
    return response;
  });
});

// Helper for feature flagging helpers tests
Cypress.Commands.add('runSpecFile', fileName => {
  const suite = 'single';
  const testFiles = `**/${fileName}.spec.js`;

  const command = `SUITE=${suite} TEST_FILES=${testFiles} yarn test`;

  return cy.exec(command, { failOnNonZeroExit: false });
});

// Feature flag support functions
const featureFlagHeader = 'x-vineti-feature-flags';

const parseAndSetFeatureFlagHeaders = headers => {
  if (headers[featureFlagHeader] === '') {
    return;
  }
  if (headers[featureFlagHeader] === undefined) {
    return;
  }

  const flags = parseFeatureFlagHeaders(headers);
  trackFeatureFlagUsage(flags);
};

const parseFeatureFlagHeaders = headers => {
  return headers[featureFlagHeader].split(',').map(i => i.trim().split('='));
};

const setFeatureFlagUsage = ({ flags, file, groupLine, ignoredFeatures }) => {
  featureFlagUsage[file] = featureFlagUsage[file] || {};
  featureFlagUsage[file][groupLine] = featureFlagUsage[file][groupLine] || {};

  flags.forEach(featureFlagPair => {
    const [flagName, flagValue] = featureFlagPair;
    if (!ignoredFeatures.includes(flagName)) {
      featureFlagUsage[file][groupLine][flagName] = (
        featureFlagUsage[file][groupLine][flagName] || []
      ).concat([flagValue === 'true']);
    }
  });
};

// Current test may not be available when we're dealing with hooks,
//  so we default to the file test under those circumstances.
const determineCurrentTest = () => {
  const { currentTest, test: fileTest } = Cypress.mocha.getRunner().suite.ctx;
  return currentTest || fileTest;
};

const getFeatureGroupLine = test => {
  const { parent, featuresEnabled } = test;

  if (featuresEnabled) {
    return determineLineNumber(test);
  }
  if (!parent) {
    return null;
  }

  return getFeatureGroupLine(parent);
};

const getIgnoredFeatures = test => {
  const { parent, ignoredFeatures } = test;

  if (ignoredFeatures) {
    return ignoredFeatures;
  }
  if (!parent) {
    return [];
  }

  return getIgnoredFeatures(parent);
};

// Cypress loses invocation details for tests when the tests are
//  re-run in the Cypress UI. In order to still provide some
//  helpful feedback in those circumstances, instead of the line
//  number, we can provide the full test description.
const determineLineNumber = test => {
  const { invocationDetails, ctx } = test;
  if (invocationDetails) {
    return invocationDetails.line;
  }

  const {
    test: { invocationDetails: ctxInvocationDetails },
  } = ctx;
  if (ctxInvocationDetails) {
    return ctxInvocationDetails.line;
  }

  return buildDescription(test);
};

const buildDescription = ({ title, parent }, description = '') => {
  const fullDescription = [title, description].join(' ');
  if (!parent) {
    return fullDescription;
  }
  return buildDescription(parent, fullDescription);
};

// Feature flagging errors
const featureEnablementError = test => {
  const { type, hookName } = test;
  const line = determineLineNumber(test);
  const testType = type === 'hook' ? `"${hookName}" hook` : 'test';

  return new Error(
    [
      'Feature enablement must be done in a "before" hook',
      `  Enablement was attempted in a ${testType}`,
      `  Line/Test description: ${line}`,
    ].join('\n')
  );
};

const invalidStatusError = ({ featureName, featureStatus }) => {
  return new Error(
    [
      `The "${featureName}" feature was set to "${featureStatus}".`,
      '  This is an invalid value.',
      '  Only "disabled" or "enabled" can be used.',
    ].join('\n')
  );
};

const featureFlagsNotEnabledError = ({ flags, line, file }) => {
  return new Error(
    [
      'Feature flag was used outside of a feature enabled test.',
      `  Flag name: ${flags.map(pair => pair[0]).join(', ')}`,
      `  File name: ${file}`,
      `  Line/Test description: ${line}`,
    ].join('\n')
  );
};

const featureFlagStatusMissingError = ({ flagName, fileName, groupLine, values }) => {
  const enabledTested = values.includes(true);
  const disabledTested = values.includes(false);

  return [
    'Feature flag was used in example group, but both paths were not tested.',
    `  Flag name: ${flagName}`,
    `  File name: ${fileName}`,
    `  Line/Test description: ${groupLine}`,
    `  Enabled path tested: ${enabledTested}`,
    `  Disabled path tested: ${disabledTested}`,
  ].join('\n');
};
