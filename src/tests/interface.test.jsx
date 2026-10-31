// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '../main.jsx';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('App Interface & Navigation Tests', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-root';
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (root) {
      act(() => {
        root.unmount();
      });
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it('renders AlgoArena App with sidebar, topbar, and dashboard', async () => {
    await act(async () => {
      root = createRoot(container);
      root.render(<App />);
    });

    // Check brand title
    expect(container.textContent).toContain('AlgoArena');
    expect(container.textContent).toContain('DSA BATTLE LAB');

    // Check Dashboard elements
    expect(container.textContent).toContain('Master Data Structures & Algorithms');
    expect(container.textContent).toContain('Sorting Lab');
    expect(container.textContent).toContain('Data Structures');
  });

  it('navigates to Sorting Workbench when clicked', async () => {
    await act(async () => {
      root = createRoot(container);
      root.render(<App />);
    });

    const sortingBtn = Array.from(container.querySelectorAll('button.nav-item')).find(
      btn => btn.textContent.includes('Sorting Lab')
    );
    expect(sortingBtn).toBeDefined();

    await act(async () => {
      sortingBtn.click();
    });

    expect(container.textContent).toContain('SORTING LABORATORY');
    expect(container.textContent).toContain('Merge Sort');
  });

  it('navigates to Practice & Quizzes', async () => {
    await act(async () => {
      root = createRoot(container);
      root.render(<App />);
    });

    const quizBtn = Array.from(container.querySelectorAll('button.nav-item')).find(
      btn => btn.textContent.includes('Practice & Quizzes')
    );
    expect(quizBtn).toBeDefined();

    await act(async () => {
      quizBtn.click();
    });

    expect(container.textContent).toContain('TOPIC');
    expect(container.textContent).toContain('DIFFICULTY');
  });
});
