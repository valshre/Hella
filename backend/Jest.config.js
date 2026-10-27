export default {
  testEnvironment: 'node',
  transform: {},                       // el backend ya es ESM nativo
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  collectCoverageFrom: ['authRoutes.js'],
  coverageDirectory: 'coverage',
  testTimeout: 20000,
};