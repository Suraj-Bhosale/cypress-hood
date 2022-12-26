import dayjs from 'dayjs';
import { get } from 'lodash';

export const getWebhookNotificationSentEvent = (tokenData, correlationId) =>
  cy.request({
    method: 'GET',
    url: `${Cypress.env('PLATFORM_URL')}/events/${correlationId}`,
    headers: tokenData,
  });

export const getEventTransaction = (tokenData, transactionId) =>
  cy.request({
    method: 'GET',
    url: `${Cypress.env('PLATFORM_URL')}/notifications/event_transactions/${transactionId}`,
    headers: tokenData,
  });

export const getEventTransactionsByName = (tokenData, eventName) =>
  cy.request({
    method: 'GET',
    url: `${Cypress.env(
      'PLATFORM_URL'
    )}/notifications/event_transactions/find_by_event?name=${eventName}`,
    headers: tokenData,
  });

export const pollCreateOrderEventTransactions = (
  token,
  uuid,
  eventType,
  timeout = 60000,
  interval = 6000
) => {
  const findEvent = (stopTime, events) => {
    let event;

    // cy.wait(cypressAlias);
    if (events && eventType === "create_approved_order_failed") {
      event = events.body.data.find(
        obj =>
          obj.attributes.subscriber === null &&
          get(obj, 'attributes.payload.payload.events[0].body.transaction.uuid') === uuid
      );
    } else if (events && eventType === "create_approved_order_completed") {
      event = events.body.data.find(
        obj => get(obj, 'attributes.payload.events[0].body.transaction.uuid') === uuid
      );
    }

    if (event) {
      return Promise.resolve(event);
    }
    if (dayjs() > stopTime) {
      return Promise.reject(eventType + ' event was not found within ' + timeout + ' ms');
    }

    cy.wait(interval); // eslint-disable-line
    return getEventTransactionsByName(token, eventType).then(result =>
      findEvent(stopTime, result)
    );
  };

  let stopTime = dayjs(dayjs()).add(timeout, 'ms');
  return getEventTransactionsByName(token, eventType).then(result => {
    findEvent(stopTime, result)
  });
}

export const failedEventErrors = (events,uuid) => (
  events.body.data.find(
    obj =>
      obj.attributes.subscriber === null &&
      get(obj, 'attributes.payload.payload.events[0].body.transaction.uuid') === uuid
  )
);
