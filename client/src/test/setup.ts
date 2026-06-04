import React from 'react';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

function motionTag(tag: string) {
  return function MotionStub({
    children,
    ...props
  }: React.PropsWithChildren<Record<string, unknown>>) {
    const {
      initial: _i,
      animate: _a,
      exit: _e,
      transition: _t,
      whileHover: _wh,
      whileTap: _wt,
      layout: _l,
      ...dom
    } = props;
    return React.createElement(tag, dom, children);
  };
}

vi.mock('framer-motion', () => ({
  motion: {
    div: motionTag('div'),
    aside: motionTag('aside'),
    section: motionTag('section'),
    span: motionTag('span'),
    button: motionTag('button'),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

class ResizeObserverStub {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
