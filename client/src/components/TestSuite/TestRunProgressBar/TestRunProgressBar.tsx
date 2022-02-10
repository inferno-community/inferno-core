import React, { FC } from 'react';
import { TestRun, Result } from 'models/testSuiteModels';
import {
  Box,
  IconButton,
  CircularProgress,
  LinearProgress,
  Snackbar,
  Tooltip,
  Typography,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';
import QueueIcon from '@mui/icons-material/Queue';
import withStyles from '@mui/styles/withStyles';

export interface TestRunProgressBarProps {
  showProgressBar: boolean;
  setShowProgressBar: (show: boolean) => void;
  cancelTestRun: () => void;
  duration: number | null;
  testRun: TestRun | null;
  resultsMap: Map<string, Result>;
}

const StyledProgressBar = withStyles((_theme) => ({
  root: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  bar: {
    borderRadius: 4,
  },
}))(LinearProgress);

const StatusIndicator = (status: string | null | undefined) => {
  switch (status) {
    case 'running':
      return (
        <Tooltip title="Running">
          <CircularProgress size={24} />
        </Tooltip>
      );
    case 'cancelling':
      return (
        <Tooltip title="Cancelling">
          <CircularProgress size={24} />
        </Tooltip>
      );
    case 'waiting':
      return (
        <Tooltip title="Waiting">
          <AccessTimeIcon color="primary" />
        </Tooltip>
      );
    case 'queued':
      return (
        <Tooltip title="Queued">
          <QueueIcon color="primary" />
        </Tooltip>
      );
    case 'done':
      return (
        <Tooltip title="Done">
          <DoneIcon color="primary" />
        </Tooltip>
      );
    default:
      return null;
  }
};

const completedTestCount = (resultsMap: Map<string, Result>, testRun: TestRun | null) => {
  let count = 0;
  resultsMap.forEach((result) => {
    if (result.test_id && result.test_run_id === testRun?.id) {
      count++;
    }
  });
  return count;
};

const TestRunProgressBar: FC<TestRunProgressBarProps> = ({
  showProgressBar,
  setShowProgressBar,
  cancelTestRun,
  duration,
  testRun,
  resultsMap,
}) => {
  const statusIndicator = StatusIndicator(testRun?.status);
  const testCount = testRun?.test_count || 0;
  const completedCount = completedTestCount(resultsMap, testRun);
  const value = testCount !== 0 ? (100 * completedCount) / testCount : 0;

  const cancellable = () => {
    return testRun?.status != 'cancelling' && testRun?.status != 'done';
  };

  return (
    <Snackbar
      open={showProgressBar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      autoHideDuration={duration}
      onClose={() => setShowProgressBar(false)}
      ClickAwayListenerProps={{ mouseEvent: false }}
      sx={{ zIndex: 6000 }}
    >
      <Box
        display="flex"
        alignItems="center"
        bgcolor="text.secondary"
        p="0.5em"
        borderRadius="0.5em"
      >
        <Box mr={1} mt={0.3}>
          {statusIndicator}
        </Box>
        <Box minWidth={200} mr={1} color="background.paper">
          {testRun?.status == 'cancelling' ? (
            <Typography variant="body1">Cancelling Test Run...</Typography>
          ) : (
            <StyledProgressBar variant="determinate" value={value} />
          )}
        </Box>
        <Box color="background.paper">
          <Typography variant="body1">
            {completedCount}/{testCount}
          </Typography>
        </Box>
        <Tooltip title="Cancel Test Run">
          <IconButton
            aria-label="cancel"
            disabled={!cancellable()}
            color="primary"
            onClick={cancelTestRun}
          >
            <CancelIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Snackbar>
  );
};

export default TestRunProgressBar;
