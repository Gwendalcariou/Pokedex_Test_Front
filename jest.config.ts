// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',

  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  testEnvironment: 'jest-environment-jsdom',

  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.html$',
      },
    ],
  },

  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],

  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
};

export default config;
