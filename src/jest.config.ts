export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  moduleNameMapper: {
    // Handle JSON imports
    "\\.(json)$": "<rootDir>/__mocks__/fileMock.js",
  },
};
