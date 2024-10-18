// more infos: https://stackoverflow.com/questions/10265798/determine-project-root-from-a-running-node-js-application

import path from "path";

/**
 * Get the root directory of the application (where the main.ts or app.ts file is located).
 * On your main.ts file, add this line:
 * ```ts
 * global.appRoot = path.resolve(__dirname);
 * ```
 * @returns
 */
export const getAppDir = () => {
  // if appRoot is not set, use the main.ts file location from the require cache
  if (!global.appRoot) {
    return path.dirname(require?.main?.filename ?? __dirname);
  }

  return global.appRoot;
};

/**
 * Get the root directory of the application (where the package.json file is located).
 * @returns
 */
export const getRootDir = () => {
  return process.cwd();

  // old method
  // for (const modulePath of module.paths) {
  //   try {
  //     fs.accessSync(modulePath, constants.F_OK);
  //     return path.dirname(modulePath);
  //   } catch (e) {
  //     // Just move on to next path
  //   }
  // }
};
