const { Pact, Matchers } = require('@pact-foundation/pact');
const UserApi = require('../src/userApi');

describe('User API Pact', () => {
  let provider;
  let userApi;

  beforeAll(async () => {
    provider = new Pact({
      consumer: 'UserConsumer',
      provider: 'UserProvider',
      port: 8081,
      log: './logs/pact.log',
      dir: './pacts',
      logLevel: 'INFO',
      spec: 2
    });

    await provider.setup();
    userApi = new UserApi(provider.mockService.baseUrl);
  });

  afterAll(async () => {
    if (provider) {
      await provider.finalize();
    }
  });

  afterEach(async () => {
    if (provider) {
      await provider.verify();
    }
  });

  describe('getting a user', () => {
    it('should return a user when it exists', async () => {
      const expectedUser = {
        id: 1,
        name: 'Darvin Patel',
        email: 'darvin.patel@example.com'
      };

      await provider.addInteraction({
        state: 'a user exists',
        uponReceiving: 'a request for a user',
        withRequest: {
          method: 'GET',
          path: '/user/1'
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': Matchers.term({
              generate: 'application/json; charset=utf-8',
              matcher: 'application\\/json(; ?charset=utf-8)?'
            })
          },
          body: expectedUser
        }
      });

      const user = await userApi.getUser(1);
      expect(user).toEqual(expectedUser);
    });

    it('should return null when user does not exist', async () => {
      await provider.addInteraction({
        state: 'a user does not exist',
        uponReceiving: 'a request for a non-existent user',
        withRequest: {
          method: 'GET',
          path: '/user/999'
        },
        willRespondWith: {
          status: 404
        }
      });

      const user = await userApi.getUser(999);
      expect(user).toBeNull();
    });
  });

  describe('getting all users', () => {
    it('should return a list of users', async () => {
      const expectedUsers = [
        {
          id: 1,
          name: 'Darvin Patel',
          email: 'darvin.patel@example.com'
        },
        {
          id: 2,
          name: 'Seemons Patel',
          email: 'seemons.patel@example.com'
        }
      ];

      await provider.addInteraction({
        state: 'users exist',
        uponReceiving: 'a request for all users',
        withRequest: {
          method: 'GET',
          path: '/users'
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': Matchers.term({
              generate: 'application/json; charset=utf-8',
              matcher: 'application\\/json(; ?charset=utf-8)?'
            })
          },
          body: expectedUsers
        }
      });

      const users = await userApi.getUsers();
      expect(users).toEqual(expectedUsers);
    });
  });
});