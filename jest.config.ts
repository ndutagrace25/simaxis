import type { Config } from '@jest/types';
import 'ts-node/register';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
};

export default config;
