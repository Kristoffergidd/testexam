import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { server } from './src/mocks/setup';
import { TextEncoder, TextDecoder } from 'util';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}

afterEach(() => {
  cleanup();
});

// Innan alla tester körs så starta och lyssna på servern
beforeAll(() => {
  server.listen();
});

// Efter alla tester körts så stäng ner servern
afterAll(() => {
  server.close();
});