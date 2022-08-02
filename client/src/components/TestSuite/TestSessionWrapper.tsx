import React, { FC, useEffect } from 'react';
import {
  Result,
  SuiteOption,
  SuiteOptionChoice,
  TestOutput,
  TestRun,
  TestSession,
  TestSuite,
} from '~/models/testSuiteModels';
import TestSessionComponent from './TestSession';
import { useParams } from 'react-router-dom';
import { Alert, Backdrop, Box } from '@mui/material';
import Header from '~/components/Header';
import Footer from '~/components/Footer';
import {
  getCurrentTestSessionResults,
  getLastTestRun,
  getTestSession,
  getTestSessionData,
} from '~/api/TestSessionApi';
import { getCoreVersion } from '~/api/VersionsApi';

import { useAppStore } from '~/store/app';

const TestSessionWrapper: FC<unknown> = () => {
  const testSuites = useAppStore((state) => state.testSuites);
  const [testRun, setTestRun] = React.useState<TestRun | null>(null);
  const [testSession, setTestSession] = React.useState<TestSession>();
  const [testResults, setTestResults] = React.useState<Result[]>();
  const [sessionData, setSessionData] = React.useState<Map<string, unknown>>(new Map());
  const [attemptedGetRun, setAttemptedGetRun] = React.useState(false);
  const [attemptedGetSession, setAttemptedGetSession] = React.useState(false);
  const [attemptedGetResults, setAttemptedGetResults] = React.useState(false);
  const [attemptedGetSessionData, setAttemptedSessionData] = React.useState(false);
  const [attemptingFetchSessionInfo, setAttemptingFetchSessionInfo] = React.useState(false);
  const [coreVersion, setCoreVersion] = React.useState<string>('');
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  useEffect(() => {
    getCoreVersion()
      .then((version: string) => {
        setCoreVersion(version);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  function tryGetTestSession(test_session_id: string) {
    getTestSession(test_session_id)
      .then((retrievedTestSession) => {
        if (retrievedTestSession) {
          setTestSession(retrievedTestSession);
        } else {
          console.log('failed to load test session');
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setAttemptedGetSession(true));
  }

  function tryGetTestRun(test_session_id: string) {
    getLastTestRun(test_session_id)
      .then((retrievedTestRun) => {
        if (retrievedTestRun) {
          setTestRun(retrievedTestRun);
        } else {
          setTestRun(null);
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setAttemptedGetRun(true));
  }

  function tryGetTestResults(test_session_id: string) {
    getCurrentTestSessionResults(test_session_id)
      .then((results) => {
        if (results) {
          setTestResults(results);
        } else {
          console.log('failed to load test session results');
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setAttemptedGetResults(true));
  }

  function tryGetSessionData(testSessionId: string) {
    getTestSessionData(testSessionId)
      .then((session_data) => {
        if (session_data) {
          session_data?.forEach((initialSessionData: TestOutput) => {
            if (initialSessionData.value) {
              sessionData.set(initialSessionData.name, initialSessionData.value);
            }
          });
          setSessionData(new Map(sessionData));
        } else {
          console.log('failed to load session data');
        }
      })
      .catch((e) => console.log(e))
      .finally(() => setAttemptedSessionData(true));
  }

  function toggleDrawer(newDrawerOpen: boolean) {
    setDrawerOpen(newDrawerOpen);
  }

  if (testSession && testResults && sessionData) {
    // Temporary stopgap to get labels until full choice data is passed to TestSessionWrapper
    const suiteOptionChoices:
      | {
          [key: string]: SuiteOptionChoice[];
        }
      | undefined = testSuites
      ?.find((suite: TestSuite) => suite.id === testSession.test_suite_id)
      ?.suite_options?.reduce(
        (acc, option) => ({ ...acc, [option.id]: option.list_options || [] }),
        {}
      );
    const parsedOptions = suiteOptionChoices
      ? testSession.suite_options
          ?.map((option: SuiteOption) =>
            suiteOptionChoices[option.id].filter(
              (choice: SuiteOptionChoice) => choice.value === option.value
            )
          )
          .flat()
          .filter((v) => v) // Remove empty values
      : [];

    return (
      <Box display="flex" flexDirection="column" flexGrow="1" height="100%">
        <Header
          suiteTitle={testSession.test_suite.title}
          suiteVersion={testSession.test_suite.version}
          suiteOptions={parsedOptions}
          drawerOpen={drawerOpen}
          toggleDrawer={toggleDrawer}
        />
        <TestSessionComponent
          testSession={testSession}
          previousResults={testResults}
          initialTestRun={testRun}
          sessionData={sessionData}
          suiteOptions={parsedOptions}
          drawerOpen={drawerOpen}
          setSessionData={setSessionData}
          getSessionData={tryGetSessionData}
          toggleDrawer={toggleDrawer}
        />
        <Footer version={coreVersion} linkList={testSession.test_suite.links} />
      </Box>
    );
  } else if (
    attemptedGetSession &&
    attemptedGetResults &&
    attemptedGetSessionData &&
    attemptedGetRun
  ) {
    return (
      <div>
        <Alert severity="error">
          Failed to load test session data. Please make sure you entered the correct session id.
        </Alert>
      </div>
    );
  } else {
    const { test_session_id } = useParams<{ test_session_id: string }>();
    if (test_session_id && !attemptingFetchSessionInfo) {
      setAttemptingFetchSessionInfo(true);
      tryGetTestRun(test_session_id);
      tryGetTestSession(test_session_id);
      tryGetTestResults(test_session_id);
      tryGetSessionData(test_session_id);
    }
    return <Backdrop open={true}></Backdrop>;
  }
};

export default TestSessionWrapper;
