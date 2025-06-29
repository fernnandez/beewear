import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverage: true,
  coverageDirectory: './coverage',
  coverageReporters: ['lcov', 'json-summary', 'json', 'text'],
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coveragePathIgnorePatterns: [
    '<rootDir>/src/main.ts',
    '<rootDir>/src/app.module.ts',
    '<rootDir>/src/domain/domain.module.ts',
    '<rootDir>/src/infra/infra.module.ts',
    '<rootDir>/src/infra/database/database.module.ts',
    '<rootDir>/src/infra/database/datasource.ts',
    '<rootDir>/src/config/.*\\.ts',
    '<rootDir>/src/.*\\.module\\.ts',
    '<rootDir>/src/.*\\.dto\\.ts',
    '<rootDir>/src/infra/auth/decorator/.*\\.ts',
    '<rootDir>/src/infra/auth/guard/.*\\.ts',
  ],
  silent: false,
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^test/(.*)$': '<rootDir>/test/$1',
    '^src/domain/(.*)$': '<rootDir>/src/domain/$1',
  },
};

export default config;
