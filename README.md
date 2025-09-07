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
│   └── use-cases/                 # Contains pure business logic implementations
|   └── event-handlers/           # Events that can be called
│                                 # Independent of external frameworks/libraries
│
├── modules/                       # Modular feature-specific implementations
│   └── cart/                     # Complete cart feature module
│       ├── controllers/          # HTTP request handlers
│       │   ├── cart.admin.controller.ts  # Admin-specific operations
│       │   └── cart.controller.ts        # Public cart operations
│       ├── routes/               # Route definitions with type-safe parameters
│       │   ├── cart.admin.routes.ts      # Protected admin routes
│       │   └── cart.routes.ts            # Public cart endpoints
│       ├── validators/           # Input validation schemas
│       │   ├── cart.admin.validators.ts  # Admin input validation
│       │   └── cart.validators.ts        # Public cart validation
│       ├── cart.listener.ts      # Event subscribers
│       ├── test.config.ts        # Test configuration
│       └── cart.service.ts       # Cart-specific business logic
│
├── cli/                          # Command-line tools and utilities
│   ├── cli.ts                    # CLI entry point with command registration
│   └── commands/                 # Individual CLI command implementations
│       └── create-admin-account.cli.ts
│
└── common/                       # Reusable utilities and common functionality
    ├── constants/                # Constants
    ├── cron/                     # Cron jobs
    ├── database/                 # Database utilities
    ├── events/                   # Event handlers
    ├── exceptions/               # Custom error handling
    ├── guards/                   # Guards
    ├── locales/                  # Internationalization resources
    ├── middlewares/              # Middlewares
    ├── queue/                    # Queue utilities
    ├── services/                 # Common business services
    ├── storage/                  # Storage utilities (S3, local, etc..)
    ├── test/                     # Test utilities
    ├── throttlers/               # Throttlers
    ├── transformers/             # Data transformation utilities
    ├── types/                    # TypeScript type definitions
    ├── utils/                    # Helper functions
    ├── validators/               # Common validation rules
    └── views/                    # Template files (EJS)
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
      │   ├── cart.admin.validators.ts   # Admin input validation (product management)
      │   └── cart.validators.ts         # Public cart validation (item quantities, user data)
      │
      ├── cart.listener.ts         # Event subscribers (order completed, stock updates)
      ├── test.config.ts           # Test configuration
      └── cart.service.ts          # Cart-specific business logic implementation
```

## CLI (`/cli`)

Command-line tools and utilities.

```
cli/
  ├── cli.ts                      # CLI entry point with command registration
  └── commands/                   # Individual CLI command implementations
      └── create-admin-account.cli.ts  # CLI command for creating admin accounts

```

## Common (`/common`)

Reusable utilities and common functionality.

```
common/
  ├── constants/          # Constants
  |── cron/               # Cron jobs
  |── database/           # Database utilities
  |── events/             # Event handlers
  ├── exceptions/         # Custom error handling
  ├── guards/             # Guards
  ├── locales/            # Internationalization resources
  |── middlewares/        # Middlewares
  |── queue/              # Queue utilities
  ├── services/           # Common business services
  |── storage/            # Storage utilities (S3, local, etc..)
  |── test/               # Test utilities
  |── throttlers/         # Throttlers
  ├── transformers/       # Data transformation utilities
  ├── types/              # TypeScript type definitions
  ├── utils/              # Helper functions
  ├── validators/         # Common validation rules
  ├── views/              # Template files (EJS)
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
- **Event-Handlers** : Handles events you can call from the services. The event-handlers can call use-cases. They are in _core/event-handlers_ folder.
- **Service** : Provides specialized features (reusable).
- **Repository** : Interacts directly with the database.

### **Who Can Import What?**

| **Layer**         | **Allowed to Import**                                |
| ----------------- | ---------------------------------------------------- |
| **Controller**    | Use-Case, Service                                    |
| **Use-Case**      | Service, Repository, (and sometimes, other use-case) |
| **Event-Handler** | Use-Case                                             |
| **Service**       | Repository, Event-Handler                            |
| **Repository**    | Models, Database Utilities (e.g., Prisma)            |

1. **Controllers**

   - Can only interact with use-case**s** and **Services**.
   - **Why?** They handle HTTP requests and delegate business logic to the **Use-Cases**.

   Flow:

   - Validates input
   - Calls appropriate use-cases
   - Returns responses
   - Handles errors from the use-cases

---

1. **Use-Cases**

   - Can interact with **Services** and **Repositories**.
   - **Why?** They orchestrate business rules but don't deal with HTTP directly or low-level database logic.

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
   - **Why?** They directly access the data layer and shouldn't handle business logic.

---

### Use-Cases files naming convention

It's a good thing that the files grows in numbers, it's keep all concerns separated.

Good naming conventions help you quickly identify use-cases:

- Use verbs like `Create`, `Update`, `Delete`, `List`, or `Get`.
- Add the feature name for clarity, e.g., `booking-create.usecase.ts` or `cart-update.usecase.ts`

---

### Use-Cases vs Services

Operations that are good candidates for use-cases:

- Complex business logic involving multiple steps
- Operations requiring transaction management
- Operations that coordinate multiple services
- Operations with complex validation rules
- Operations that emit multiple events

Operations that should stay in the service:

- **Will be called in two or more use-cases**
- **Operations that don't require coordination or other services**
- Simple CRUD operations (create, update, delete...)
- Single-step operations
- Internal utility methods

**Use-Cases can't call other Use-Cases**. If you want to call a function after your update or create crud operation, it's better to add them into a service and call this service in your use-cases.
If use-cases need to share functionality and you need to import one use-case into another, you may reference one from another. However, if this creates a circular dependency, extract the common logic into a third independent use-case that both can utilize.

## 🤝 Contributing

We welcome contributions!

## 📄 License

This project is licensed under the [MIT License](#).
