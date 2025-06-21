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
  coverageReporters: ['lcov', 'json-summary'],
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

  testEnvironment: 'node',
  moduleNameMapper: {
    // Isso mapeia 'src/*' para a pasta 'src/' do seu projeto
    '^src/(.*)$': '<rootDir>/src/$1',
    // Isso mapeia 'test/*' para a pasta 'test/' do seu projeto
    '^test/(.*)$': '<rootDir>/test/$1',
    // Isso mapeia 'src/domain/*' especificamente para a pasta 'src/domain/'
    '^src/domain/(.*)$': '<rootDir>/src/domain/$1',
    // Adicione outros mapeamentos conforme seus aliases em tsconfig.json
  },
};

export default config;
