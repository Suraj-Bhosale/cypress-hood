const translationHelpers = {
    /**
   * Checks the translation of a child element
   * @param {string} selector - The selecter to get the parent element.
   * @param {number} divIndex - The index of the first-level div.
   * @param {string} childElement - The html element name for the child element.
   * @param {number} childIndex - The index of the child element (default 0,
   * @param {string} correctText - The correct text for the field
   * @example
   * example for selector '[data-test-id="some-id"]'
   * example for childElement 'div'
   * example for childIndex 0, meaning the first div of the selector
   * example for correctText, "Enter Lot Number"
   */
  assertSectionChildElement: (selector,divIndex,childElement,correctText,childIndex = 0) => {
    cy.get(selector)
    .eq(divIndex)
    .find(childElement)
    .eq(childIndex)
    .invoke('text')
    .should('equal',correctText)
  },

  /**
   * Checks the translation of a child element
   * @param {string} selector - The selecter to get the parent element.
   * @param {string} childElement - The html element name for the child element.
   * @param {number} childIndex - The index of the child element (default 0,
   * @param {string} correctText - The correct text for the field
   * @example
   * example for selector '[data-test-id="some-id"]'
   * example for childElement 'div'
   * example for childIndex 0, meaning the first div of the selector
   * example for correctText, "Enter Lot Number"
   */
  assertChildElement: (selector,childElement,correctText,childIndex = 0) => {
    cy.get(selector)
    .find(childElement)
    .eq(childIndex)
    .invoke('text')
    .should('equal',correctText)
  },
  
  /**
   Same example as assertChildElement: above.
   Renamed to exist like assertPageTitles to be usable and descriptive.
   */
   assertPageTitles: (selector,childElement,correctText,childIndex = 0) => {
    cy.get(selector)
    .find(childElement)
    .eq(childIndex)
    .invoke('text')
    .should('equal',correctText)
  },

  /**
   * Checks the translation of a single element
   * @param {string} selector - The selecter to get the element.
   * @param {string} correctText - The correct text for the field
   * @example
   * example for selector '[data-test-id="some-id"]'
   * example for correctText, Enter Lot Number
   */
  assertSingleField: (selector,correctText) => {
    cy.get(selector)
    .invoke('text')
    .should('equal', correctText)
  },

  assertPrescriberTitle: (selector,correctText,correctTextTwo) => {
    cy.get(selector).invoke('text').then((text)=>{
      if (text == correctText) {
        cy.get(selector)
        .invoke("text")
        .should("equal", correctText);
      }else{
        cy.get(selector)
        .invoke("text")
        .should("equal", correctTextTwo);
      }
    })
  },

  assertSingleFieldWithContains: (selector,correctText) => {
    cy.contains(selector)
    .invoke('text')
    .should('equal', correctText)
  },
  assertHeaderExists: (correctText) =>{
  cy.get('[data-testid="h1-header"]').contains(correctText)
  },
  /**
   * Checks the field for the label's translation and value.
   * @param {string} selector - The selector to get the element.
   * @param {object} data - The index,label and value of the field.
   * @param {number} data.index - The index of the element, must be provided in data.
   * @param {string} data.label - The label of the field, must be provided in data.
   * @param {string} data.value - The correct value of the field, must be provided in data.
   * @example
   * example for selector '[data-test-id="some-id"]'
   * exmaple for data {index:0, label: "Lot Number", value: "1234"}
   */
  assertBlockData: (selector, data) => {
    const {index,label,value} = data
    cy.get(selector)
    .eq(index)
    .invoke('text')
    .should('equal', `${label}${value}`)
  },

  /**
   * Check only the translation of the field
   * @param {string} selector - The selector to get the element.
   * @param {object} data - The index,label and value of the field.
   * @param {number} data.index - The index of the element, must be provided in data.
   * @param {string} data.label - The label of the field, must be provided in data.
   * @example
   * example for selector '[data-test-id="some-id"]'
   * exmaple for data {index:0, label: "Scan or Enter COI."}
   */
  assertBlockLabel: (selector, data) => {
    const {index,label} = data
    cy.get(selector)
    .eq(index)
    .invoke('text')
    .should('equal',label)
  },

  assertBlockLabelWithIndex: (selector, label, index) => {
    cy.get(selector)
    .eq(index)
    .invoke('text')
    .should('equal',label)
  }
}

export default translationHelpers
