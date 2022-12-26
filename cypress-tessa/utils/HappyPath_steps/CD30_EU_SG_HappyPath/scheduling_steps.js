import schedulingConstants from '../fixtures/assertions.json';
//import { scheduledDate } from '../support/index.js';
import dayjs from 'dayjs';

const navigateToMonth = ({ direction, institutionType, monthName }) => {
  return cy.get(`[data-testid="lbl-current-month-${institutionType}"]`).then($dom => {
    if ($dom.text() === monthName) {
      return;
    }
    switch (direction) {
      case 'previous':
        cy.get(`[data-testid="btn-prev-${institutionType}"]`).click();
        break;
      default:
        cy.get(`[data-testid="btn-next-${institutionType}"]`).click();
    }
    return navigateToMonth({ direction, institutionType, monthName });
  });
};

const scheduledDate = ({ days }) => {
  let scheduDate;
  if (days === 6) {
    scheduDate = dayjs()
      .add(1, 'month')
      .format('DD-MMM-YYYY');
  } else {
    scheduDate = dayjs()
      .add(1, 'month')
      .add(days - 7, 'days')
      .format('DD-MMM-YYYY');
  }
  return scheduDate;
}

export default {
  fillInstitutionInformation: (schedulingData, site, siteName, dropDown = true) => {
    if (dropDown === true) {
      cy.selectFromMultiSelect(`[data-testid="ddl-site-${site}"]`, siteName);
    }
    cy.get(`[data-testid="txt-contact-person-${site}"]`)
      .clear()
      .type(schedulingData.contactPerson);

    cy.get(`[data-testid="txt-phone-number-${site}"]`)
      .clear()
      .type(schedulingData.phoneNumber);
  },

  LoginAndOpenOrder: (procedureId, stepId) => {
    cy.platformLogin('nina@vineti.com');
    cy.visit(`/workflow/${procedureId}/${stepId}`);
  },


  removeAndVerifyScheduledDate: institutionType => {
    cy.get(`[data-testid="btn-clear-date-${institutionType}"]`).click();
    cy.wait('@schedulingServiceAvailability');
    cy.get(`[data-testid="lbl-selected-date-${institutionType}"]`).should(
      'have.text',
      schedulingConstants.schedulerText
    );
  },

  scheduleDate: (institutionType, days = 15, schedulingServiceCreate = true, clickNext = false) => {
    const date = dayjs()
      .add(0, 'month')
      .add(days, 'days')
      .format('YYYY-MM-DD');
    let scheduleDate = scheduledDate(days);
    const day = parseInt(scheduleDate.split('-')[0], 10);

    if (clickNext) {
      cy.get(`[data-testid="btn-next-${institutionType}"]`).click();
      cy.wait('@schedulingServiceAvailability');
    }

    cy.get(`[data-testid="day-available-${institutionType}-${day}"]`).click();
    cy.wait('@schedulingServiceDraft');

    cy.get('[data-testid="btn-schedule"]').click();
    // if (schedulingServiceCreate === true) {
    //   cy.wait(6000)
    //   cy.wait('@schedulingServiceCreate');
    // } else {
    //   cy.wait('@schedulingServiceUpdate');
    // }
    return scheduleDate;
  },

  verifyInstitutionInformation: (title, site, siteName) => {
    cy.get(`[data-testid="lbl-schedule-title-${site}"]`).should('contain', title);
    cy.get(`[data-testid="ddl-site-${site}"]`).should('contain', siteName);
    cy.get(`[data-testid="txt-contact-person-${site}"]`)
      .invoke('attr', 'value')
      .then($value => {
        expect($value).to.eq(schedulingConstants.contactPerson);
      });

    cy.get(`[data-testid="txt-phone-number-${site}"]`)
      .invoke('attr', 'value')
      .then($value => {
        expect($value).to.eq(schedulingConstants.phoneNumber);
      });
  },

  verifyNavigationButtons: ({ direction, institutionType, fromDate }) => {
    switch (direction) {
      case 'next':
        const nextMonth = fromDate.add(1, 'month');
        const nextMonthName = nextMonth.format('MMMM YYYY');

        return navigateToMonth({
          direction: 'next',
          institutionType: institutionType,
          monthName: nextMonthName,
        }).then(() => {
          return nextMonth;
        });
      case 'previous':
        const prevMonth = fromDate.subtract(1, 'month');
        const prevMonthName = prevMonth.format('MMMM YYYY');

        return navigateToMonth({
          direction: 'previous',
          institutionType: institutionType,
          monthName: prevMonthName,
        }).then(() => {
          return prevMonth;
        });
      default:
        return fromDate();
    }
  },

  VerifySchedulingHeader: () => {
    cy.get('[data-testid="h1-header"]').should('contain', schedulingConstants.pageHeader);
  },

  // VerifySchedulerDate: (institutionType, date) => {
  //   let scheduledDate = Cypress.moment(date).format('LL');

  //   scheduledDate =
  //     date.split('-')[2] +
  //     ' ' +
  //     scheduledDate.split(' ')[0].substr(0, 3) +
  //     ', ' +
  //     scheduledDate.split(' ')[2];

  //   cy.get(`[data-testid="lbl-selected-date-${institutionType}"]`).should(
  //     'have.text',
  //     scheduledDate
  //   );
  // },
};




