import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['src/**/*.(t|j)s'],
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    // Isso mapeia 'src/*' para a pasta 'src/' do seu projeto
    '^src/(.*)$': '<rootDir>/src/$1',
    // Isso mapeia 'src/domain/*' especificamente para a pasta 'src/domain/'
    '^src/domain/(.*)$': '<rootDir>/src/domain/$1',
    // Adicione outros mapeamentos conforme seus aliases em tsconfig.json
  },
};

export default config;
