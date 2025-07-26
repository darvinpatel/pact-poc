# Pact Contract Testing POC

[![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)](https://nodejs.org/)
[![Pact](https://img.shields.io/badge/Pact-9.11.1-blue.svg)](https://pact.io/)
[![Jest](https://img.shields.io/badge/Jest-27.5.1-yellow.svg)](https://jestjs.io/)
[![Express](https://img.shields.io/badge/Express-4.17.1-red.svg)](https://expressjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive Proof of Concept demonstrating **consumer-driven contract testing** with [Pact](https://pact.io/). This project showcases how to implement contract testing in a microservices architecture using JavaScript/Node.js.

## 🎯 Overview

Contract testing ensures that two applications can communicate with each other reliably. This POC demonstrates the consumer-driven contracts approach where:

- **Consumer** defines the expected API contract
- **Provider** verifies it matches the actual implementation
- **Pact** generates and manages the contracts

## 🏗️ Architecture

```
┌─────────────────┐    Contract    ┌─────────────────┐
│   Consumer      │◄──────────────►│   Provider      │
│   (Client)      │                │   (API Server)  │
└─────────────────┘                └─────────────────┘
         │                                   │
         ▼                                   ▼
┌─────────────────┐                ┌─────────────────┐
│   Pact Tests    │                │   Verification  │
│   (Mock Server) │                │   Tests         │
└─────────────────┘                └─────────────────┘
```

## 📁 Project Structure

```
pact-poc/
├── consumer/                     # Consumer application
│   ├── src/
│   │   └── userApi.js           # API client implementation
│   ├── __tests__/
│   │   └── user.pact.test.js    # Pact contract tests
│   ├── pacts/                   # Generated contract files
│   ├── package.json
│   └── publish.pact.js          # Pact broker publishing script
├── provider/                     # Provider application
│   ├── app.js                   # Express server implementation
│   ├── verify.pact.test.js      # Contract verification tests
│   └── package.json
├── pact-broker/                  # Pact broker configuration
├── README.md
└── LICENSE                       # MIT License
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd pact-poc
   ```

2. **Install dependencies**
   ```bash
   # Install consumer dependencies
   cd consumer
   npm install
   
   # Install provider dependencies
   cd ../provider
   npm install
   ```

## 🧪 Running the POC

### Step 1: Generate Contracts (Consumer Tests)

Run the consumer tests to create mock provider and generate Pact contracts:

```bash
cd consumer
npm run test:pact
```

**What happens:**
- ✅ Starts a mock provider server
- ✅ Runs tests against the mock
- ✅ Generates contract files in `consumer/pacts/`

### Step 2: Verify Provider Implementation

Verify that the actual provider matches the generated contracts:

```bash
cd provider
npm run test:pact
```

**What happens:**
- ✅ Starts the actual provider server
- ✅ Verifies against consumer contracts
- ✅ Reports any mismatches

### Step 3: Test Real Integration

Test the actual consumer-provider integration:

1. **Start the provider server:**
   ```bash
   cd provider
   npm start
   ```

2. **Test the consumer against real provider:**
   ```bash
   cd consumer
   node -e "
   const UserApi = require('./src/userApi');
   const api = new UserApi('http://localhost:3000');
   
   async function test() {
     try {
       const user = await api.getUser(1);
       console.log('✅ User:', user);
       
       const users = await api.getUsers();
       console.log('✅ Users:', users);
     } catch (error) {
       console.error('❌ Error:', error.message);
     }
   }
   
   test();
   "
   ```

## 🔄 Understanding the Flow

1. **Consumer Test** → Creates mock provider and defines API expectations
2. **Contract Generation** → Pact generates contract files based on expectations
3. **Provider Verification** → Real provider is tested against contracts
4. **Integration Confidence** → Both services can integrate reliably

## 📡 API Endpoints

The provider implements these REST endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/user/:id` | Get a specific user by ID |
| `GET` | `/users` | Get all users |
| `GET` | `/health` | Health check endpoint |

### Example Responses

**GET /user/1**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

**GET /users**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
]
```

## 🔧 Pact Broker Integration

For team collaboration and contract management:

### Setup Environment Variables

```bash
export PACT_BROKER_BASE_URL=http://localhost:8000
export PACT_BROKER_USERNAME=darvin
export PACT_BROKER_PASSWORD=darvin
```

### Publish Contracts

```bash
cd consumer
npm run pact:publish
```

This will:
- 📤 Upload contracts to Pact Broker
- 🏷️ Tag the version as `main`
- 📊 Make contracts available for team review

## 💡 Benefits of Contract Testing

| Benefit | Description |
|---------|-------------|
| **🚨 Early Detection** | Catch integration issues before deployment |
| **🎯 Confidence** | Deploy with confidence knowing services work together |
| **📚 Documentation** | Contracts serve as living API documentation |
| **🔄 Safe Evolution** | Safely evolve APIs with backward compatibility |
| **⚡ Fast Feedback** | Get immediate feedback on breaking changes |

## 🛠️ Development

### Available Scripts

**Consumer:**
```bash
npm run test          # Run all tests
npm run test:pact     # Run Pact tests only
npm run pact:publish  # Publish contracts to broker
```

**Provider:**
```bash
npm start             # Start the server
npm run test          # Run all tests
npm run test:pact     # Run Pact verification tests
```

### Adding New Endpoints

1. **Update consumer tests** in `consumer/__tests__/user.pact.test.js`
2. **Implement provider endpoint** in `provider/app.js`
3. **Run consumer tests** to generate new contracts
4. **Run provider verification** to ensure compatibility

## 🚀 Next Steps

- [ ] Add authentication and authorization scenarios
- [ ] Implement error handling and edge cases
- [ ] Integrate with CI/CD pipelines (GitHub Actions, Jenkins)
- [ ] Add contract testing to existing microservices
- [ ] Implement Pact Broker for team collaboration
- [ ] Add performance testing scenarios
- [ ] Create Docker containers for easy deployment

## 📚 Resources

- **[Pact Documentation](https://docs.pact.io/)** - Official Pact documentation
- **[Pact Workshop](https://github.com/pact-foundation/pact-workshop-js)** - Hands-on tutorial
- **[Contract Testing Best Practices](https://docs.pact.io/best_practices)** - Best practices guide
- **[Microservices Testing](https://martinfowler.com/articles/microservice-testing/)** - Testing strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Darvin Patel** - [GitHub Profile](https://github.com/darvinpatel)

---

⭐ **Star this repository if you found it helpful!**