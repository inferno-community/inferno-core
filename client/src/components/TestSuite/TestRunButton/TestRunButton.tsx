import React, { FC, Fragment } from 'react';
import { Button, Tooltip, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
  TestGroup,
  RunnableType,
  TestSuite,
  Test,
  runnableIsTestSuite,
} from 'models/testSuiteModels';

export interface TestRunButtonProps {
  runnable: TestSuite | TestGroup | Test;
  runTests: (runnableType: RunnableType, runnableId: string) => void;
  testRunInProgress: boolean;
  buttonText?: string;
}

const TestRunButton: FC<TestRunButtonProps> = ({
  runTests,
  runnable,
  testRunInProgress,
  buttonText,
}) => {
  const runnableType = 'tests' in runnable ? RunnableType.TestGroup : RunnableType.TestSuite;
  const showRunButton = runnableIsTestSuite(runnable) || (runnable as TestGroup).user_runnable;
  const runButton = showRunButton ? (
    <Tooltip title={testRunInProgress ? 'Disabled - Ongoing Test.' : ''} arrow>
      <div>
        {buttonText ? (
          <Button
            variant="contained"
            disabled={testRunInProgress}
            color="secondary"
            size="small"
            disableElevation
            onClick={() => {
              runTests(runnableType, runnable.id);
            }}
            endIcon={<PlayArrowIcon />}
            data-testid={`runButton-${runnable.id}`}
          >
            {buttonText}
          </Button>
        ) : (
          <IconButton
            disabled={testRunInProgress}
            color="secondary"
            edge="end"
            size="small"
            onClick={() => {
              runTests(runnableType, runnable.id);
            }}
            data-testid={`runButton-${runnable.id}`}
          >
            <PlayArrowIcon />
          </IconButton>
        )}
      </div>
    </Tooltip>
  ) : (
    <Fragment />
  );

  return runButton;
};

export default TestRunButton;
