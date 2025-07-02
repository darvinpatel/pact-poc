const pact = require('@pact-foundation/pact-node');

if (!process.env.CI && !process.env.PUBLISH_PACT) {
    console.log("skipping Pact publish...");
    process.exit(0)
}

const gitHash = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString().trim();

const opts = {
    pactFilesOrDirs: ['./pacts/'],
    pactBroker: process.env.PACT_BROKER_BASE_URL || 'http://localhost:8000',
    pactBrokerUsername: process.env.PACT_BROKER_USERNAME || 'pact_workshop',
    pactBrokerPassword: process.env.PACT_BROKER_PASSWORD || 'pact_workshop',
    tags: ['prod', 'test'],
    consumerVersion: gitHash
};

pact
    .publishPacts(opts)
    .then(() => {
        console.log('Pact contract publishing complete!');
        console.log('');
        console.log('Head over to http://localhost:8000');
        console.log('to see your published contracts.')
    })
    .catch(e => {
        console.log('Pact contract publishing failed: ', e)
    }); 