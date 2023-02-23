import React, { FC, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import { postTestSessions } from '~/api/TestSessionApi';
import { getTestSuites } from '~/api/TestSuitesApi';
import { router } from '~/components/App/Router';
import ThemeProvider from '~/components/ThemeProvider';
import { TestSession, TestSuite } from '~/models/testSuiteModels';
import { useAppStore } from '~/store/app';

const App: FC<unknown> = () => {
  const { enqueueSnackbar } = useSnackbar();
  const setFooterHeight = useAppStore((state) => state.setFooterHeight);
  const testSuites = useAppStore((state) => state.testSuites);
  const setTestSuites = useAppStore((state) => state.setTestSuites);
  const testSession = useAppStore((state) => state.testSession);
  const setTestSession = useAppStore((state) => state.setTestSession);
  const smallWindowThreshold = useAppStore((state) => state.smallWindowThreshold);
  const setWindowIsSmall = useAppStore((state) => state.setWindowIsSmall);

  // Update UI on window resize
  useEffect(() => {
    window.addEventListener('resize', handleResize);
  });

  useEffect(() => {
    handleResize();
    getTestSuites()
      .then((testSuites: TestSuite[]) => {
        setTestSuites(testSuites);
      })
      .catch(() => {
        setTestSuites([]);
      });
  }, []);

  useEffect(() => {
    if (testSuites && testSuites.length === 1) {
      postTestSessions(testSuites[0].id, null, null)
        .then((testSession: TestSession | null) => {
          if (testSession && testSession.test_suite) {
            setTestSession(testSession);
          }
        })
        .catch((e: Error) => {
          enqueueSnackbar(`Error while creating test session: ${e.message}`, { variant: 'error' });
        });
    }
  }, [testSuites]);

  const handleResize = () => {
    if (window.innerWidth < smallWindowThreshold) {
      setWindowIsSmall(true);
      setFooterHeight(36);
    } else {
      setWindowIsSmall(false);
      setFooterHeight(56);
    }
  };

  if (!testSuites || (testSuites.length === 1 && !testSession)) {
    return <></>;
  }

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider>
        <RouterProvider router={router(testSuites, testSession)} />
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
