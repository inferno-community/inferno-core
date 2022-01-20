import React, { FC } from 'react';
import { RunnableType, TestGroup, TestSuite } from 'models/testSuiteModels';
import { Typography, Box } from '@mui/material';
import useStyles from './styles';
import CondensedResultIcon from './CondensedResultIcon';
import TestRunButton from '../TestRunButton/TestRunButton';

export interface TreeItemLabelProps {
  runnable: TestSuite | TestGroup;
  runTests: (runnableType: RunnableType, runnableId: string) => void;
  testRunInProgress: boolean;
}

const TreeItemLabel: FC<TreeItemLabelProps> = ({ runnable, runTests, testRunInProgress }) => {
  const styles = useStyles();
  return (
    <Box className={styles.labelRoot} data-testid={`tiLabel-${runnable.id}`}>
      <Box className={styles.labelContainer}>
        <Typography className={styles.labelText}>{runnable.title}</Typography>
        {runnable.optional && <Typography className={styles.optionalLabel}>Optional</Typography>}
      </Box>
      <CondensedResultIcon result={runnable.result} />
      <TestRunButton
        runnable={runnable}
        runTests={runTests}
        testRunInProgress={testRunInProgress}
      />
    </Box>
  );
};

export default TreeItemLabel;
