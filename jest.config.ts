// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  // On utilise le preset fourni par jest-preset-angular
  preset: 'jest-preset-angular',

  // Fichier de setup global (setupZoneTestEnv)
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

  // Environnement DOM (nécessaire pour les composants Angular)
  testEnvironment: 'jest-environment-jsdom',

  // Où trouver les tests
  testMatch: ['**/+(*.)+(spec).+(ts)'],

  // Extensions prises en charge
  moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],

  // Transformation des fichiers TS/JS/HTML via jest-preset-angular
  transform: {
    '^.+\\.(ts|mjs|js|html)$': 'jest-preset-angular',
  },

  // Options confort
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
};

export default config;
