import React, { FC, useMemo } from 'react';
import useStyles from './styles';
import { TestGroup, RunnableType, TestSuite } from '~/models/testSuiteModels';
import InputOutputsList from './TestListItem/InputOutputsList';
import { Box, Card, Divider, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import ResultIcon from './ResultIcon';
import TestRunButton from '../TestRunButton/TestRunButton';
import { shouldShowDescription } from '../TestSuiteUtilities';

interface TestGroupCardProps {
  runnable: TestSuite | TestGroup;
  runTests?: (runnableType: RunnableType, runnableId: string) => void;
  testRunInProgress: boolean;
  view: 'report' | 'run';
}

const TestGroupCard: FC<TestGroupCardProps> = ({
  runnable,
  runTests,
  children,
  testRunInProgress,
  view,
}) => {
  const styles = useStyles();

  const buttonText = runnable.run_as_group ? 'Run Tests' : 'Run All Tests';

  // render markdown once on mount - it's too slow with re-rendering
  const description = useMemo(() => {
    return runnable.description ? <ReactMarkdown>{runnable.description}</ReactMarkdown> : undefined;
  }, [runnable.description]);

  const resultSpan = runnable.result && (
    <span className={styles.testIcon}>
      <ResultIcon result={runnable.result} />
    </span>
  );

  const runnableType = 'tests' in runnable ? RunnableType.TestGroup : RunnableType.TestSuite;

  return (
    <Card className={styles.testGroupCard} variant="outlined">
      <div className={styles.testGroupCardHeader}>
        {resultSpan}
        <span className={styles.testGroupCardHeaderText}>
          <Typography color="text.primary" className={styles.currentItem} component="div">
            {'short_id' in runnable && (
              <Typography className={styles.shortId}>{`${runnable.short_id} `}</Typography>
            )}
            {runnable.title}
          </Typography>
        </span>
        <span className={styles.testGroupCardHeaderButton}>
          {view === 'run' && runTests && (
            <TestRunButton
              buttonText={buttonText}
              runnable={runnable}
              runnableType={runnableType}
              runTests={runTests}
              testRunInProgress={testRunInProgress}
            />
          )}
        </span>
      </div>
      {view === 'run' && shouldShowDescription(runnable, description) && (
        <>
          <Box margin="20px">{description}</Box>
          <Divider />
        </>
      )}
      {view === 'report' &&
        runnable.run_as_group &&
        (runnable as TestGroup).user_runnable &&
        runnable.result && (
          <InputOutputsList headerName="Input" inputOutputs={runnable.result?.inputs || []} />
        )}
      <Box>{children}</Box>
    </Card>
  );
};

export default TestGroupCard;
