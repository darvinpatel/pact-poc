const path = require('path');
const { Verifier } = require('@pact-foundation/pact');
const app = require('./app');

describe('Pact Verification', () => {
  let server;

  beforeAll(async () => {
    server = app.listen(3000, () => {
      console.log('Provider server running on port 3000');
    });
  });

  afterAll(async () => {
    server.close();
  });

  it('validates the expectations of UserConsumer', async () => {
    const opts = {
      provider: 'UserProvider',
      providerBaseUrl: 'http://localhost:3000',
      providerVersion: '1.0.0',
      logLevel: 'DEBUG',
      pactUrls: ['http://127.0.0.1:8000/pacts/provider/UserProvider/consumer/UserConsumer/version/1.0.8'],
      pactBrokerUrl: process.env.PACT_BROKER_BASE_URL || "http://127.0.0.1:8000",
      pactBrokerUsername: process.env.PACT_BROKER_USERNAME || "darvin",
      pactBrokerPassword: process.env.PACT_BROKER_PASSWORD || "darvin",
      publishVerificationResult: process.env.CI || process.env.PACT_BROKER_PUBLISH_VERIFICATION_RESULTS
    };

    console.log('Verification options:', JSON.stringify(opts, null, 2));

    const verifier = new Verifier(opts);
    
    try {
      await verifier.verifyProvider();
    } catch (error) {
      console.error('Pact verification failed:', error);
      throw error;
    }
  });
});