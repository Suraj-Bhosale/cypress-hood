export const cancelApiOrder = `
  mutation($coi: String) {
    cancelApiOrder(input: { coi: $coi }) {
	  order {
		coi
	  }
	}
  }
`;
