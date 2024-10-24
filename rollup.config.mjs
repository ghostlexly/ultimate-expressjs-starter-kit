import esbuild from "rollup-plugin-esbuild";
import { nodeExternals } from "rollup-plugin-node-externals";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import { spawn } from "child_process";
import { glob } from "glob";

const isWatchMode = process.env.ROLLUP_WATCH;
let server;

/**
 * Restart the node server process
 * when the files change in watch mode
 */
const restartServer = async () => {
  if (server) {
    await new Promise((resolve) => {
      server.on("close", () => {
        server = null;
        resolve();
      });

      server.kill("SIGTERM");
    });
  }

  server = spawn("node", ["dist/main.js"], { stdio: "inherit" });
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
      sourceMap: false,
    }),

    // restart the server when the files change in watch mode
    {
      name: "watch-and-restart",
      async buildEnd() {
        if (isWatchMode) {
          restartServer();
          typescriptTypesCheck();
        }
      },
    },
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
