// test/setup.ts
import { beforeEach, vi } from "vitest";
import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Polyfills pour Node.js
Object.assign(globalThis, {
  TextEncoder,
  TextDecoder,
});

// Mock de next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
  usePathname: () => "/",
}));

// Mock de next/headers
vi.mock("next/headers", () => ({
  headers: () => new Headers(),
  cookies: () => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}));

// Mock global fetch pour les tests
global.fetch = vi.fn();

// Réinitialiser les mocks avant chaque test
beforeEach(() => {
  vi.clearAllMocks();
});