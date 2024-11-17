import esbuild from "rollup-plugin-esbuild";
import { nodeExternals } from "rollup-plugin-node-externals";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import { spawn } from "child_process";
import { glob } from "glob";
import retry from "async-retry";
import fs from "fs/promises";

const isWatchMode = process.env.ROLLUP_WATCH;
let server;

/**
 * Create a watch plugin that will restart the server when the files change in watch mode
 */
const createWatchPlugin = () => ({
  name: "watch-and-restart",
  async buildStart() {
    if (isWatchMode) {
      await clearDistFolder();
    }
  },
  async writeBundle() {
    if (isWatchMode) {
      retry(restartServer, {
        retries: 2,
        factor: 2,
        onRetry: (error, attempt) => {
          console.error(`Retry attempt ${attempt}/2 failed:`, error.message);
        },
      }).catch((error) => {
        console.error(
          "Failed to restart server after 2 attempts:",
          error.message
        );
      });

      await typescriptTypesCheck();
    }
  },
});

const clearDistFolder = async () => {
  try {
    await fs.rm("dist", { recursive: true, force: true });
  } catch (error) {
    console.error("Failed to clear dist folder:", error);
  }
};

/**
 * Restart the node server process
 * when the files change in watch mode
 */
const restartServer = async () => {
  await stopServer();
  await startServer();
};

const stopServer = async () => {
  if (!server) return;

  try {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Server shutdown timed out after 5000ms"));
      }, 5000);

      server.on("close", () => {
        clearTimeout(timeout);
        server = null;
        console.log("Previous server process terminated");
        resolve();
      });

      server.kill("SIGTERM");
    });
  } catch (error) {
    server?.kill("SIGKILL");
    server = null;
    throw error;
  }
};

const startServer = async () => {
  console.log("Starting new server process...");

  return new Promise((resolve, reject) => {
    server = spawn("node", ["dist/main.js"], {
      stdio: "inherit",
      env: { ...process.env, FORCE_COLOR: "1" },
    });

    server.on("error", reject);
    server.on("exit", (code, signal) => {
      if (code === 0 || signal) {
        console.log(
          signal
            ? `Server process killed with signal ${signal}`
            : "Server process exited with code 0"
        );
        resolve();
      } else {
        server = null;
        reject(new Error(`Server process exited with code ${code}`));
      }
    });
  });
};

/**
 * Run the typescript types errors check.
 * It's will throw an error if there are any typescript types errors.
 * This is done in a separate process to avoid blocking the main process.
 */
const typescriptTypesCheck = async () => {
  spawn("tsc", ["--noEmit"], { stdio: "inherit" });
};

// --------------------------------------
// List of entry points / files to be built
// ---
// Rollup doesn't support dynamic imports (like for cli commands that are never imported by any other file),
// so we need to list all the files to be built manually here.
// --------------------------------------
const entryPoints = [
  "src/main.ts",
  "src/cli.ts",
  ...glob.sync([
    "src/**/*.worker.ts",
    "src/**/*.crons.ts",
    "src/**/*.command.ts",
    "src/**/*.listener.ts",
  ]),
];

export default {
  input: entryPoints,

  output: {
    format: "cjs", // export as CommonJS modules
    dir: "dist", // output directory
    entryFileNames: "[name].js", // output file names
    preserveModules: true, // preserve the original module structure
    sourcemap: false,
  },

  plugins: [
    // exclude external node_modules dependencies from the bundle
    nodeExternals(),

    // resolve the paths of the imported modules
    typescriptPaths({ preserveExtensions: true }),

    // transpile the typescript code
    esbuild({
      target: "es2022",
      sourceMap: true,
    }),

    // restart the server when the files change in watch mode
    createWatchPlugin(),
  ],

  // watch mode configuration
  watch: {
    clearScreen: false, // disable the clear screen in watch mode
    include: ["src/**"],
    chokidar: {
      usePolling: true, // use polling to watch for file changes
      interval: 1000, // poll every 1000ms (1 second)
    },
  },
};
