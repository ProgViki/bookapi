// jest.d.ts

import '@testing-library/jest-dom';
import '@jest/globals';


declare var describe: jest.Describe;
declare var it: jest.It;
declare var test: jest.It;
declare var beforeAll: jest.Lifecycle;
declare var beforeEach: jest.Lifecycle;
declare var afterAll: jest.Lifecycle;
declare var afterEach: jest.Lifecycle;
// declare var expect: jest.Expect;

declare global {
  namespace jest {
    interface Matchers<R> {
      toExist(): R;
      // Add other custom matchers here
    }
  }
}