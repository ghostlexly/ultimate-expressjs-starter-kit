import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import express from "express";

export const initializeSwagger = async ({
  app,
}: {
  app: express.Application;
}) => {
  let swaggerSpec: any = null;

  // Serve Swagger JSON
  app.get("/api/docs/json", (req: express.Request, res: express.Response) => {
    if (swaggerSpec) {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerSpec);
    } else {
      res.setHeader("Content-Type", "application/json");
      res.send({ message: "Swagger documentation is being generated..." });
    }
  });

  // Serve Swagger UI
  app.use("/api/docs", swaggerUi.serve, (req, res, next) => {
    if (swaggerSpec) {
      swaggerUi.setup(swaggerSpec, {
        explorer: true,
        swaggerOptions: {
          filter: true,
          showRequestDuration: true,
          persistAuthorization: true,
          tagsSorter: "alpha",
          operationsSorter: "alpha",
        },
      })(req, res, next);
    } else {
      res.send("Swagger documentation is being generated...");
    }
  });

  // Asynchronous Swagger generation without blocking
  Promise.resolve().then(async () => {
    swaggerSpec = await swaggerJSDoc({
      definition: {
        openapi: "3.1.0",
        info: {
          title: "API Documentation",
          description: "Welcome to the API documentation.",
          version: "1.0.0",
        },
        // security: [
        //   {
        //     bearerAuth: [], // apply to all routes
        //   },
        // ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              name: "access-token",
            },
          },
        },
        servers: [
          {
            url: "http://localhost",
            description: "Local development server",
          },
          {
            url: "https://dispomenage.fr",
            description: "Production server",
          },
        ],
      },
      apis: [
        "./src/modules/**/*.routes.ts",
        "./src/modules/**/*.controller.ts",
      ],
    });
  });
};
