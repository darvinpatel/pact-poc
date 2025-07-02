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
    const pactFile = path.resolve(__dirname, '../consumer/pacts/userconsumer-userprovider.json');
    const opts = {
      provider: 'UserProvider',
      providerBaseUrl: 'http://localhost:3000',
      publishVerificationResult: false,
      providerVersion: '1.0.0',
      logLevel: 'INFO',
      pactUrls: [pactFile]
    };

    // Only use broker if environment variables are set
    if (process.env.PACT_BROKER_BASE_URL) {
      opts.pactBrokerUrl = process.env.PACT_BROKER_BASE_URL;
      opts.pactBrokerUsername = process.env.PACT_BROKER_USERNAME || 'pact_workshop';
      opts.pactBrokerPassword = process.env.PACT_BROKER_PASSWORD || 'pact_workshop';
      opts.publishVerificationResult = true;
      delete opts.pactUrls; // Remove local pactUrls when using broker
    }

    const verifier = new Verifier(opts);
    
    try {
      await verifier.verifyProvider();
    } catch (error) {
      console.error('Pact verification failed:', error);
      throw error;
    }
  });
});