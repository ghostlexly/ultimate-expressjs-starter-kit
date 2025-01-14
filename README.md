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
- **Dependency Injection**: Service container with type-safe dependency management

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
- **Cron Jobs**: Scheduled tasks using `cron`

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

- Hot-reload
- Performance-optimized architecture

### 💻 Code Quality

- Code formatting with `Prettier`
- Linting with `ESLint`
- Path aliases for clean imports (e.g., `#/common`, `#/modules`)

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your environment variables

👉 You can use the `.env.template` file to create your own `.env` file

👉 Importantly, you need to have a running instance of `redis` and `mysql` on your machine to run this project.
If you need a more complete solution with docker-compose to setup everything, please check this repository: https://github.com/ghostlexly/ultimate-typescript-starter-kit

4. Run the development server: `npm run start:dev`

## 🖥️ CLI Commands

This starter kit includes a set of CLI commands to help you manage your application. Here are some examples:

- `npm run cli test:split-text this-is-a-test -s -`: Split a text into an array
- `npm run cli seed:countries`: Seed the database with countries data
- `npm run cli create:admin-account admin@example.com password`: Create an admin account

For a full list of available commands, run:

```bash
npm run cli
```

## 📚 Documentation

### The Clean Architecture with modules by Tolga MALKOC

#### Directory structure:

```
Project Root
├── core/                          # Core application logic and shared use cases
│   └── use-cases/                 # Business use cases implemented in the app
│
├── modules/                      # Feature-specific modules of the application
│   └── cart/                      # Handles the cart feature functionality
│       ├── controllers/           # Handles requests and response logic for the cart feature
│       │   ├── cart.admin.controller.ts  # Controller for admin-specific cart actions
│       │   └── cart.controller.ts        # General controller for cart actions
│       ├── routes/                # Routing definitions for the cart feature
│       │   ├── cart.admin.routes.ts      # Routes for admin cart actions
│       │   └── cart.routes.ts            # Routes for general cart actions
│       ├── validators/            # Validation logic for cart inputs
│       │   ├── cart.admin.validator.ts   # Validator for admin-specific cart inputs
│       │   └── cart.validator.ts         # Validator for general cart inputs
│       ├── cart.listener.ts          # Event listeners related to the cart feature
│       ├── cart.repository.ts        # Data access logic for cart-related operations
│       └── cart.service.ts           # Business logic for the cart feature
│
├── infrastructure/                # Low-level system interactions and external integrations
│   ├── cache/                    # Caching mechanisms
│   │   └── redis/                # Redis integration for caching
│   │       └── redis.ts
│   ├── cron/                     # Scheduled tasks
│   │   └── update-data.cron.ts      # Cron job for updating data
│   ├── database/                 # Database-related utilities
│   │   └── prisma.ts                # Prisma client setup and interactions
│   ├── email/                    # Email-related integrations
│   │   └── brevo/                # Integration with Brevo email service
│   │       └── brevo.service.ts
│   ├── events/                   # Event-driven programming utilities
│   │   └── events.service.ts
│   ├── payment/                  # Payment processing integrations
│   │   └── mangopay/             # Integration with MangoPay payment service
│   │       └── mangopay.service.ts
│   ├── queue/                    # Task queues and job handling
│   │   └── bull/                 # Integration with BullMQ queue service
│   │       └── bullmq.ts
│   └── storage/                  # File storage integrations
│       └── s3/                   # Integration with Amazon S3 storage service
│           └── s3.service.ts
│
├── cli/                          # Command-line interface utilities
│   ├── cli.ts                       # Entry point for CLI commands
│   └── commands/                 # Individual CLI commands
│       └── create-admin-account.cli.ts  # CLI command for creating admin accounts
│
├── presentation/                 # Presentation layer for handling middleware, guards, and routes
│   ├── guards/                   # Access control logic
│   │   ├── roles.guard.ts           # Guard for role-based access control
│   │   └── sessions.guard.ts        # Guard for session-based access control
│   ├── throttlers/               # Rate-limiting utilities
│   │   ├── global.throttler.ts      # Global rate limiter
│   │   └── strict.throttler.ts      # Strict rate limiter for sensitive routes
│   ├── middlewares/              # Middleware logic for request/response handling
│   └── routes.ts                    # Main route definitions for the app
│
└── shared/                       # Reusable utilities and components shared across the app
    ├── exceptions/               # Custom exception classes
    │   ├── http-exception.ts        # Base exception for HTTP errors
    │   └── validation-exception.ts   # Exception for validation errors
    ├── locales/                  # Localization files
    │   └── zod/
    │       └── fr.json              # French translation for Zod validation errors
    ├── services/                 # Shared service logic
    │   ├── pdf.service.ts           # Service for generating PDF files
    │   └── files.service.ts         # Service for handling file-related operations
    ├── transformers/             # Data transformation utilities
    │   └── phone-number.transformer.ts  # Transformer for phone number formatting
    ├── types/                    # Shared TypeScript type definitions
    │   └── request.d.ts             # Custom types for HTTP requests
    ├── utils/                    # General utility functions
    │   ├── app-dir.ts               # Utility for resolving app directories
    │   └── logger.ts                # Logger utility
    ├── validators/               # Shared validation logic
    │   ├── bic.validator.ts         # Validator for BIC codes
    │   └── phone-number.validator.ts # Validator for phone numbers
    ├── views/                    # Server-rendered views
    │   └── invoices/
    │       └── commission-invoice.ejs # EJS template for commission invoices
    └── static/                   # Static assets for the application
        └── assets/
            ├── css/
            │   └── output.css        # Compiled CSS styles
            └── images/
                └── logo.png          # Application logo
```

# Modern TypeScript Project Structure 🏗️

The Clean Architecture with modules by Tolga MALKOC

## Core (`/core`)

The heart of the application containing essential business logic.

```
core/
  └── use-cases/     # Contains pure business logic implementations
                     # Independent of external frameworks/libraries

```

## Modules (`/modules`)

Modular feature-specific implementations following vertical slice architecture.

```jsx
modules/
  └── cart/                        # Complete cart feature module
      ├── controllers/             # HTTP request handlers
      │   ├── cart.admin.controller.ts  # Admin-specific operations (CRUD for products, pricing)
      │   └── cart.controller.ts        # Public cart operations (add/remove items, checkout)
      │
      ├── routes/                  # Route definitions with type-safe parameters
      │   ├── cart.admin.routes.ts      # Protected admin routes (/admin/cart/)
      │   └── cart.routes.ts            # Public cart endpoints (/cart/)
      │
      ├── validators/              # Input validation schemas
      │   ├── cart.admin.validator.ts   # Admin input validation (product management)
      │   └── cart.validator.ts         # Public cart validation (item quantities, user data)
      │
      ├── cart.listener.ts         # Event subscribers (order completed, stock updates)
      ├── cart.repository.ts       # Data access patterns and persistence logic
      └── cart.service.ts          # Cart-specific business logic implementation
```

## Infrastructure (`/infrastructure`)

External service integrations and technical implementations.

```
infrastructure/
  ├── cache/                # Caching layer implementations
  │   └── redis/           # Redis caching service
  │
  ├── cron/                # Scheduled background tasks
  │   └── update-data.cron.ts  # Periodic data synchronization
  │
  ├── database/            # Database connections and configurations
  │   └── prisma.ts       # Prisma ORM client setup
  │
  ├── email/              # Email service implementations
  │   └── brevo/          # Brevo email provider integration
  │
  ├── events/             # Event bus implementation
  │   └── events.service.ts    # Event publishing/subscription
  │
  ├── payment/            # Payment gateway integrations
  │   └── mangopay/       # MangoPay payment processing
  │
  ├── queue/              # Asynchronous job processing
  │   └── bull/           # BullMQ implementation
  │
  └── storage/            # File storage implementations
      └── s3/             # AWS S3 integration

```

## CLI (`/cli`)

Command-line tools and utilities.

```
cli/
  ├── cli.ts                      # CLI entry point with command registration
  └── commands/                   # Individual CLI command implementations
      └── create-admin-account.cli.ts  # Admin user creation utility

```

## Presentation (`/presentation`)

Request/Response handling and security layers.

```
presentation/
  ├── guards/              # Access control implementations
  │   ├── roles.guard.ts        # Role-based authorization
  │   └── sessions.guard.ts     # Session validation
  │
  ├── throttlers/          # Rate limiting implementations
  │   ├── global.throttler.ts   # Default rate limits
  │   └── strict.throttler.ts   # Enhanced protection for sensitive routes
  │
  ├── middlewares/         # Request processing middleware
  └── routes.ts            # Global route registry

```

## Shared (`/shared`)

Reusable utilities and common functionality.

```
shared/
  ├── exceptions/          # Custom error handling
  ├── locales/            # Internationalization resources
  ├── services/           # Common business services
  ├── transformers/       # Data transformation utilities
  ├── types/              # TypeScript type definitions
  ├── utils/              # Helper functions
  ├── validators/         # Common validation rules
  ├── views/              # Template files (EJS)
  └── static/             # Public assets
      ├── assets/
      │   ├── css/           # Stylesheets
      │   └── images/        # Image assets

```

### Key Benefits of This Structure 🎯

1. **Modularity**: Each module is self-contained with its own MVC components
2. **Scalability**: Easy to add new modules without affecting existing ones
3. **Maintainability**: Clear separation of concerns and predictable file locations
4. **Testability**: Isolated components are easier to unit test
5. **Developer Experience**: Intuitive navigation and reduced cognitive load

### Best Practices 💡

- Keep feature modules independent of each other
- Implement consistent error handling across modules
- Follow the Single Responsibility Principle

This structure follows clean architecture principles while remaining practical for modern TypeScript applications.

### Data-Flow

```jsx
Controller -> Use-Cases -> Services -> Repositories
```

- **Controller** : Receives requests and delegates to use-cases.
- **Use-Case** : Executes a complete business scenario by orchestrating multiple services from different modules.
- **Service** : Provides specialized features (reusable).
- **Repository** : Interacts directly with the database.

### **Who Can Import What?**

| **Layer**      | **Allowed to Import**                     |
| -------------- | ----------------------------------------- |
| **Controller** | Use-Case, Service                         |
| **Use-Case**   | Service, Repository                       |
| **Service**    | Repository                                |
| **Repository** | Models, Database Utilities (e.g., Prisma) |

1. **Controllers**

   - Can only interact with use-case**s** and **Services**.
   - **Why?** They handle HTTP requests and delegate business logic to the **Use-Cases**.

   Flow:

   - Validates input
   - Calls appropriate use-cases
   - Returns responses
   - Handles errors from the use-cases

---

1. **Use-Cases**

   - Can interact with **Services** and **Repositories**.
   - **Why?** They orchestrate business rules but don’t deal with HTTP directly or low-level database logic.

   Flow:

   - Call any services from any modules
   - Access database
   - Throw errors

---

1. **Services**
   - Can interact with **Repositories**.
   - **Why?** They encapsulate reusable logic and may coordinate multiple repositories.

---

1. **Repositories**
   - Can only interact with **Models** or database tools.
   - **Why?** They directly access the data layer and shouldn’t handle business logic.

---

### Use-Cases files naming convention

It’s a good thing that the files grows in numbers, it’s keep all concerns separated.

Good naming conventions help you quickly identify use-cases:

- Use verbs like `Create`, `Update`, `Delete`, `List`, or `Get`.
- Add the feature name for clarity, e.g., `booking-create.usecase.ts` or `cart-update.usecase.ts`

---

### Use-Cases vs Services

Operations that are good candidates for use-cases:

- Complex business logic involving multiple steps
- Operations requiring transaction management
- Operations that coordinate multiple services
- Operations with complex validation rules
- Operations that emit multiple events

Operations that should stay in the service:

- **Will be called in two or more use-cases**
- **Operations that don't require coordination or other services**
- Simple CRUD operations (create, update, delete…)
- Single-step operations
- Internal utility methods

**Use-Cases can’t call other Use-Cases**. If you want to call a function after your update or create crud operation, it’s better to add them into a service and call this service in your use-cases.

## 🤝 Contributing

We welcome contributions!

## 📄 License

This project is licensed under the [MIT License](#).
