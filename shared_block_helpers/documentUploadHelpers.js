const displayFileName = (rootName, type) => {
  const typeExtention = type.split('/')[1];
  return `${rootName} (${typeExtention.toUpperCase()})`;
};

// list of file's extensions which should not be modified
const FILE_EXTENSIONS = ['prn', 'csv'];

const DocumentUploadFunctions = {
  /**
   * Add documents from fs and verify added document
   * @param {Map<string,string>} documents map of file and filename
   * @param {Object} meta metadata required by uploadAnyFile command
   */
  multipleDocumentsUpload: (documents, { encoding, selector, type, inputType }) => {
    cy.log('shared_block_helpers/documentUploadHelpers.multipleDocumentsUpload');

    documents.forEach(fileName => {
      const [rootName, extension] = fileName.split('.');
      const displayedFileName = FILE_EXTENSIONS.includes(extension)
        ? fileName
        : displayFileName(rootName, type);

      cy.uploadAnyFile(fileName, encoding, selector, type, inputType);
      cy.get('.file-list-item').should('contain', displayedFileName);
    });
  },

  verifyUploadedDocuments: filenames => {
    cy.log('shared_block_helpers/documentUploadHelpers.verifyUploadedDocuments');
    filenames.forEach(fileName => {
      cy.get('.file-list-item').should('contain', fileName);
    });
  },

  verifyDownload: (filenames, downloadRequestAlias) => {
    cy.log('shared_block_helpers/documentUploadHelpers.verifyDownload');
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
    cy.log('shared_block_helpers/documentUploadHelpers.removeDocuments');
    dataTestIds.forEach(dataTestId => {
      cy.get(`[data-testid="${dataTestId}"]`).click();
    });
  },

  verifyDeletedDocuments: filenames => {
    cy.log('shared_block_helpers/documentUploadHelpers.verifyDeletedDocuments');
    filenames.forEach(fileName => {
      cy.get('.file-list-item').should('not.contain', fileName);
    });
  },
};

export default DocumentUploadFunctions;
