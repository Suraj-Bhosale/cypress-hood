export const executionContext = `
  query($productName: String, $regionName: String, $studyNumber: String) {
    executionContext(
	  productName: $productName
	  regionName: $regionName
	  studyNumber: $studyNumber
    ) {
	    id
	    uniqueId
	  }
  }
`;
