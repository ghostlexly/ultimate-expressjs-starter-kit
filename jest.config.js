module.exports = {
  moduleFileExtensions: ["js", "json"],
  rootDir: "dist/src",
  collectCoverageFrom: ["**/*.js"],
  coverageDirectory: "../coverage",
  setupFilesAfterEnv: ["<rootDir>/common/test/jest-setup.js"],
  testEnvironment: "node",
};
