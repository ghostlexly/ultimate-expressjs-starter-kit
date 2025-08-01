// more infos: https://stackoverflow.com/questions/10265798/determine-project-root-from-a-running-node-js-application

import path from "path";
import fs from "fs";

let memoizedAppDir: string | null = null;
let memoizedRootDir: string | null = null;

/**
 * Get the root directory of the application (where the app.ts file is located).
 * On your app.ts file, add this line:
 * ```ts
 * import path from "path";
 * global.appRoot = path.resolve(__dirname);
 * ```
 */
export const getAppDir = () => {
  // Return memoized value if available
  if (memoizedAppDir) {
    return memoizedAppDir;
  }

  // Start from the current directory and traverse up until we find app.ts or app.js
  let currentDir = __dirname;
  while (currentDir !== path.parse(currentDir).root) {
    const appTsPath = path.join(currentDir, "app.ts");
    const appJsPath = path.join(currentDir, "app.js");

    if (fs.existsSync(appTsPath) || fs.existsSync(appJsPath)) {
      // Found the directory containing app.ts or app.js
      global.appRoot = currentDir;
      memoizedAppDir = currentDir;
      return currentDir;
    }

    // Move up one directory
    currentDir = path.dirname(currentDir);
  }

  // Fallback to error if no app.ts or app.js is found
  throw new Error("No app.ts or app.js found in the project");
};

/**
 * Get the root directory of the application (where the package.json file is located).
 * @returns
 */
export const getRootDir = () => {
  // Return memoized value if available
  if (memoizedRootDir) {
    return memoizedRootDir;
  }

  // Start from the current directory and traverse up until we find package.json
  let currentDir = __dirname;
  while (currentDir !== path.parse(currentDir).root) {
    const packageJsonPath = path.join(currentDir, "package.json");

    if (fs.existsSync(packageJsonPath)) {
      // Found the directory containing package.json
      memoizedRootDir = currentDir;
      return currentDir;
    }

    // Move up one directory
    currentDir = path.dirname(currentDir);
  }

  // Fallback to error if no package.json is found
  throw new Error("No package.json found in the project");
};
