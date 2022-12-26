export default {
  /**
   * Verify text exist.
   * @param {Map<string,string>} headers - map of header element key to expected text
   */
  verifyText: headers => {
    for (let [key, value] of headers) {
      cy.get(key).should('contain', value);
    }
  },
};
