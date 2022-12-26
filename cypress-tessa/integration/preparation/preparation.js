

export function PrepareContexts(unique_id) {
    it('Check-outing contexts and roles', () => {
        cy.exec('git checkout config/context.yml config/fixtures/roles.yml').then((result) => {
            console.log(result)});
        cy.exec('ruby contexts_remover '+ unique_id).then((result) => {
            console.log(result)});
        cy.exec('sh replace.sh').then((result) => {
            console.log(result)});
        cy.exec('cd ../vineti-platform/platform && bundle exec rails db:reset && foreman start -f Procfile.dev').then((result) => {
            console.log(result)});
    });
}




