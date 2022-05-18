/** @format */
import { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      babelConfig: {
        presets: ['babel-preset-solid', '@babel/preset-env'],
      },
    },
  },
  displayName: {
    name: 'arcane-flow',
    color: 'cyan',
  },
  // insert setupFiles and other config
  // you probably want to test in browser mode:
  testEnvironment: 'jsdom',
  // unfortunately, solid cannot detect browser mode here,
  // so we need to manually point it to the right versions:
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
  moduleNameMapper: {
    'solid-js/web': '<rootDir>/node_modules/solid-js/web/dist/web.cjs',
    'solid-js': '<rootDir>/node_modules/solid-js/dist/solid.cjs',
  },
  collectCoverage: true,
  coverageThreshold: {
    global: {
      lines: 90,
    },
  },
  setupFilesAfterEnv: ['./jest-setup.ts'],
  setupFiles: ['regenerator-runtime'],
};

export default config;
