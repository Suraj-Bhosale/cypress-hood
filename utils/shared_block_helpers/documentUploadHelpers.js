const DocumentUploadFunctions = {
  /**
   * Add documents from fs and verify added document
   * @param {Map<string,string>} documents map of file and filename
   * @param {Object} meta metadata required by uploadAnyFile command
   */
  multipleDocumentsUpload: (documents, { encoding, selector, type, inputType }) => {
    documents.forEach(fileName => {
      let displayedFileName = fileName;
      cy.uploadAnyFile(fileName, encoding, selector, type, inputType);
      if (type === 'application/pdf') {
        // 'validpdf.pdf' => 'validpdf (PDF)'
        displayedFileName = `${fileName.split('.')[0]} (PDF)`;
      }
      cy.get('.file-list-item').should('contain', displayedFileName);
    });
  },

  verifyUploadedDocuments: filenames => {
    filenames.forEach(fileName => {
      cy.get('.file-list-item').should('contain', fileName);
    });
  },

  verifyDownload: (filenames, downloadRequestAlias) => {
    // prevent file from opening
    cy.window().then(win => {
      cy.stub(win, 'open').as('windowOpen');
    });

    filenames.forEach(filename => {
      cy.get(`[data-testid="download-${filename}"]`)
        .first()
        .click();
      cy.wait(downloadRequestAlias)
        .its('status')
        .then(status => expect(status).to.eq(200));

      // expect the file to be opened
      cy.get('@windowOpen').should('be.called');
    });
  },

  removeDocuments: dataTestIds => {
    dataTestIds.forEach(dataTestId => {
      cy.get(`[data-testid="${dataTestId}"]`).click();
    });
  },

  verifyDeletedDocuments: filenames => {
    filenames.forEach(fileName => {
      cy.get('.file-list-item').should('not.contain', fileName);
    });
  },
};

export default DocumentUploadFunctions;
