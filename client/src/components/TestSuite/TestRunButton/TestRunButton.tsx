import React, { FC } from 'react';
import { Button, Tooltip } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { TestGroup, Runnable, RunnableType } from '~/models/testSuiteModels';
import lightTheme from '~/styles/theme';

export interface TestRunButtonProps {
  runnable: Runnable;
  runnableType: RunnableType;
  runTests: (runnableType: RunnableType, runnableId: string) => void;
  testRunInProgress: boolean;
  buttonText?: string;
}

const TestRunButton: FC<TestRunButtonProps> = ({
  runTests,
  runnable,
  runnableType,
  testRunInProgress,
  buttonText,
}) => {
  /* Need to explicitly check against false because undefined needs to be treated
   * as true. */
  const showRunButton = (runnable as TestGroup).user_runnable !== false;

  return (
    <>
      {showRunButton &&
        (buttonText ? (
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
          // Custom icon button to resolve nested interactive control error
          <Tooltip describeChild title={`Run ${runnable.title}`}>
            <PlayCircleIcon
              aria-label={`Run ${runnable.title}${
                testRunInProgress ? ' Disabled - Test Run in Progress' : ''
              }`}
              aria-hidden={false}
              tabIndex={0}
              color={testRunInProgress ? 'disabled' : 'secondary'}
              data-testid={`runButton-${runnable.id}`}
              onClick={() => {
                if (!testRunInProgress) runTests(runnableType, runnable.id);
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter' && !testRunInProgress) {
                  runTests(runnableType, runnable.id);
                }
              }}
              sx={
                testRunInProgress
                  ? {
                      margin: '0 8px',
                      padding: '0.25em 0.25em',
                    }
                  : {
                      margin: '0 8px',
                      padding: '0.25em 0.25em',
                      ':hover': {
                        background: lightTheme.palette.common.grayLightest,
                        borderRadius: '50%',
                      },
                    }
              }
            />
          </Tooltip>
        ))}
    </>
  );
};

export default TestRunButton;
