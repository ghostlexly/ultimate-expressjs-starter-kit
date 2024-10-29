# ✨ Ultimate ExpressJS Starter ✨

## 🚀 Batteries-included TypeScript ExpressJS Backend (REST API)

This starter kit provides a robust foundation for building scalable and feature-rich REST APIs using ExpressJS and TypeScript.

### 🌟 Key Features

#### 🛠 Core Functionality

- **Logging**: Advanced logging with `Pino` and log rotation using `file-stream-rotator`
- **Database**: Efficient data management with `Prisma ORM`
- **Events**: Powerful event handling with `EventEmitter2`
- **Authentication**: Secure bearer sessions and OAuth support (Google, Facebook, Twitter, GitHub) via `passportjs`
- **Authorization**: Fine-grained access control with `Casl`
- **Validation**: Request validation (Body, Parameters, Query) using `Zod`
- **Error Handling**: Comprehensive error management system

#### 📁 File Management

- **File Upload**: S3 integration with `multer`
- **Video Upload**: S3 integration with `multer`
- **Video Processing**: Conversion to browser-compatible formats with `ffmpeg`

#### 🗄 Data Storage & Caching

- **Redis**: In-memory data structure store with `ioredis`
- **Caching**: Improved performance through strategic caching

#### 🚦 Traffic Management

- **Rate Limiting**: Protect your API from abuse with `express-rate-limit`

#### 🔧 Background Processing

- **Queues & Workers**: Efficient task processing with `BullMQ`
- **Cron Jobs**: Scheduled tasks using `node-cron`

#### 🌐 Internationalization

- **i18n**: Multi-language support

#### 📚 Documentation

- **Swagger**: API documentation made easy

#### 📄 Document Generation

- **PDF Generation**: Create PDFs with `playwright`

#### 🖥️ CLI Commands

- **Command-line Interface**: Easy-to-use CLI commands with `commander`

#### 🐳 Deployment

- **Docker Support**: Containerization for easy deployment

### 🔒 Security Features

- CORS protection
- Rate limiting
- Request validation (Query, Parameters, Body)
- Secure authentication (Bearer sessions, OAuth)

### ⚡ Performance Optimization

- Fast build process with `Rollup` and `esbuild`
- Hot-reload
- Performance-optimized architecture

### 💻 Code Quality

- Code formatting with `Prettier`
- Linting with `ESLint`

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `yarn install`
3. Set up your environment variables

👉 You can use the `.env.template` file to create your own `.env` file

👉 Importantly, you need to have a running instance of `redis` and `mysql` on your machine to run this project.
If you need a more complete solution with docker-compose to setup everything, please check this repository: https://github.com/ghostlexly/ultimate-typescript-starter-kit

4. Run the development server: `yarn start:dev`

## 🖥️ CLI Commands

This starter kit includes a set of CLI commands to help you manage your application. Here are some examples:

- `yarn cli test:split-text this-is-a-test -s -`: Split a text into an array
- `yarn cli seed:countries`: Seed the database with countries data
- `yarn cli create:admin-account admin@example.com password`: Create an admin account

For a full list of available commands, run:

```bash
yarn cli
```

## 📚 Documentation

For detailed documentation on each feature and how to use this starter kit, please refer to our [Wiki](#).

## 🤝 Contributing

We welcome contributions!

## 📄 License

This project is licensed under the [MIT License](#).
