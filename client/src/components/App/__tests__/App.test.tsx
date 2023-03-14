import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { act } from 'react-dom/test-utils';
import { SnackbarProvider } from 'notistack';

import App from '../App';
import * as testSuitesApi from '~/api/TestSuitesApi';
import { testSuites } from '../__mocked_data__/mockData';

// Mock out a complex child component, react-testing-library advises
// against this but we are in the App component, so maybe make an exception?
vi.mock('~/components/TestSuite/TestSessionWrapper', () => ({
  default: vi.fn(() => {
    return <div>mock</div>;
  }),
}));

describe('The App Root Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sets Test Suite state on mount', () => {
    const getTestSuites = vi.spyOn(testSuitesApi, 'getTestSuites');
    getTestSuites.mockResolvedValue(testSuites);

    act(() => {
      render(
        <SnackbarProvider>
          <App />
        </SnackbarProvider>
      );
    });

    expect(getTestSuites).toBeCalledTimes(1);
  });
});
