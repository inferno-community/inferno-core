import React from 'react';
import { act } from 'react-dom/test-utils';
import { render, renderHook, screen } from '@testing-library/react';
import ThemeProvider from 'components/ThemeProvider';
import Header from '../Header';

import { MemoryRouter } from 'react-router-dom';
import { useAppStore } from '~/store/app';

// boilerplate for mocking zustand which uses hooks outside of a component
beforeEach(() => {
  const { result } = renderHook(() => useAppStore((state) => state));

  act(() => {
    result.current.windowIsSmall = false;
  });
});

test('renders wide screen Inferno Header', () => {
  let drawerOpen = true;

  render(
    <MemoryRouter>
      <ThemeProvider>
        <Header
          suiteTitle="Suite Title"
          drawerOpen={drawerOpen}
          toggleDrawer={() => (drawerOpen = !drawerOpen)}
        />
      </ThemeProvider>
    </MemoryRouter>
  );

  const logoElement = screen.getByRole('img');
  expect(logoElement).toHaveAttribute('alt', 'Inferno logo');

  const titleElement = screen.getAllByRole('heading')[0];
  expect(titleElement).toHaveTextContent('Suite Title');
});
