const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "<rootDir>/renderer",
});

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
};

module.exports = createJestConfig(customJestConfig);
