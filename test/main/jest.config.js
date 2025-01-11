module.exports = {
  clearMocks: true,
  preset: "ts-jest",
  rootDir: "./",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      tsconfig: "./tsconfig.json",
    },
  },
};
