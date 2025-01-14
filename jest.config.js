module.exports = {
  moduleFileExtensions: ["js", "json"],
  rootDir: "dist/src",
  testRegex: ".*\\.test\\.js$",
  collectCoverageFrom: ["**/*.js"],
  coverageDirectory: "../coverage",
  setupFilesAfterEnv: ["<rootDir>/infrastructure/test/jest-setup.js"],
  testEnvironment: "node",
};
