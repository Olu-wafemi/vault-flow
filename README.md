# VaultFlow - Multi-Currency Wallet System 🏦

VaultFlow is a secure, scalable, and high-performance multi-currency wallet system built with NestJS. It supports real-time transactions, fraud detection, and currency conversion, leveraging microservices, event-driven architecture, database sharding, and caching.

## Features

**User Authentication** - Secure OAuth2/JWT authentication for users.  
**Multi-Currency Wallets** - Users can create wallets in different currencies.  
**Atomic Transactions** - Prevents double-spending with database transactions.  
**Idempotency Handling** - Ensures no duplicate transactions occur.  
**Real-Time Currency Conversion** - Fetches live exchange rates.  
**Fraud Detection System** - Monitors and flags suspicious activities.  
**Database Sharding** - Distributes wallet data for scalability.  
**Caching for Performance** - Uses Redis for fast wallet balance lookups.  
**Event-Driven Architecture** - Uses Kafka/RabbitMQ for processing transactions.  
**CI/CD & Docker Deployment** - Automated testing, builds, and deployment with Kubernetes.

## 📦Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Docker & Docker Compose](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Kafka (for event-driven architecture)](https://kafka.apache.org/)

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/Olu-wafemi/vault-flow.git
cd valult-flow
```

### 2️⃣ Install Dependencies

```sh
yarn install  #
or npm install
```

### 3️⃣ Setup Environment Variables

Create a **.env** file in the root directory and configure the following:

```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/vaultflow
REDIS_URL=redis://localhost:6379
KAFKA_BROKER=localhost:9092
JWT_SECRET=your_secret_key
EXCHANGE_RATE_API_KEY=your_api_key
```

### 4️⃣ Start the Services (Dockerized Setup)

```sh
docker-compose up --build
```

### 5️⃣ Run the Application (Non-Docker)

```sh
yarn start:dev
 or npm run start:dev
```
