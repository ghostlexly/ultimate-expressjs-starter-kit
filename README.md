# ✨ Ultimate ExpressJS Starter ✨

## 🚀 Batteries-included TypeScript ExpressJS Backend (REST API)

This starter kit provides a robust foundation for building scalable and feature-rich REST APIs using ExpressJS and TypeScript.

### 🌟 Key Features

#### 🛠 Core Functionality

- **Logging**: Advanced logging with `Pino` and log rotation using `file-stream-rotator`
- **Database**: Efficient data management with `Prisma ORM`
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

#### 🐳 Deployment

- **Docker Support**: Containerization for easy deployment

### 🔒 Security Features

- CORS protection
- Rate limiting
- Request validation (Query, Parameters, Body)
- Secure authentication (Bearer sessions, OAuth)

### ⚡ Performance Optimization

- Bundled with `SWC` for faster builds
- Hot-reload with `nodemon` for rapid development
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

## 📚 Documentation

For detailed documentation on each feature and how to use this starter kit, please refer to our [Wiki](#).

## 🤝 Contributing

We welcome contributions!

## 📄 License

This project is licensed under the [MIT License](#).
