const changePage = (pageNumber) => {
  cy.get('[data-testid="collection-list-pager"]')
  .find('ul')
  .find('li')
  .as('listButtons')

  cy.get('@listButtons')
  .eq(pageNumber)
  .click()

  cy.wait(10000)
};

const changeOrderingPage = (pageNumber) => {
  cy.get('[data-testid="list-pager"]')
  .find('ul')
  .find('li')
  .as('orderingListButtons')

  cy.get('@orderingListButtons')
  .eq(pageNumber)
  .click()

  cy.wait(10000)
};

export const navigateToOrder = (coi, patientId, pageNumber=1) => {
  if(pageNumber != 1){
    changePage(pageNumber)
  }
  cy.get("body").then($body => {
    if($body.text().includes(patientId)){
      cy.waitForElementAndClick(`tr[data-testid="treatment-${coi}"]`);
    }
    else{
      return navigateToOrder(coi,patientId, pageNumber+1);
    }
  })
};


export const findOrderingPatient = (patientId, pageNumber = 1) => {
  if(pageNumber != 1){
    changeOrderingPage(pageNumber)
  }
  cy.get('[data-testid="ordering-body"]').then($body => {
    if($body.text().includes(patientId)){
      cy.get('td[data-testid="patient-identifier"]')
      .contains(patientId)
      .click();
    }
    else{
      return findOrderingPatient(patientId, pageNumber+1);
    }
  })
};