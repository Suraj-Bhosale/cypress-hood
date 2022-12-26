import steps from '../capacity/steps'

context('Add Capacity', () => {
    beforeEach(() => {
        cy.server();
        cy.route('PATCH', '/procedure_steps/*').as('patchProcedureSteps');
        cy.route('PATCH', /^\/v1\/institutions\/\d\/update_qualifications\/\d/).as('patchQualifications');
        cy.route('GET', '/procedures/*').as('getProcedures');
        cy.route('GET', '/scheduling/capacity_registries*').as('capacityRegistries')
      });
    it('Update Institution', ()=>{
        cy.platformLogin('orlando@vineti.com','password one two three');
        cy.visit('/sites');
        steps.institutionManufShared();
    });

    it('Setup capacity', () => {
        cy.platformLogin('casper@vineti.com','password one two three');
        cy.visit('/capacity');
        cy.wait('@capacityRegistries')
        steps.setUpCapacity(40,8)
    });

});
