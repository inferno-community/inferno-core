import React, { FC, useEffect } from 'react';
import useStyles from './styles';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Error, Warning } from '@mui/icons-material';
import InputOutputsList from '../TestListItem/InputOutputsList';
import { Request, RunnableType, Test, TestGroup, ViewType } from '~/models/testSuiteModels';
import ResultIcon from '../ResultIcon';
import TestRunButton from '../../TestRunButton/TestRunButton';
import TestListItem from '../TestListItem/TestListItem';
import NavigableGroupListItem from './NavigableGroupListItem';
import NestedDescriptionPanel from './NestedDescriptionPanel';
import ProblemBadge from '../TestListItem/ProblemBadge';

interface TestGroupListItemProps {
  testGroup: TestGroup;
  runTests?: (runnableType: RunnableType, runnableId: string) => void;
  updateRequest?: (requestId: string, resultId: string, request: Request) => void;
  showReportDetails?: boolean;
  view: ViewType;
}

const TestGroupListItem: FC<TestGroupListItemProps> = ({
  testGroup,
  runTests,
  updateRequest,
  showReportDetails,
  view,
}) => {
  const styles = useStyles();
  const [warningCount, setWarningCount] = React.useState(0);
  const [errorCount, setErrorCount] = React.useState(0);
  const [groupMouseHover, setGroupMouseHover] = React.useState(false);
  const [manualExpand, setManualExpand] = React.useState(false);
  const [expanded, setExpanded] = React.useState(
    testGroup.result?.result === 'cancel' ||
      testGroup.result?.result === 'fail' ||
      testGroup.result?.result === 'error' ||
      testGroup.result?.result === 'skip' ||
      view === 'report'
  );

  useEffect(() => {
    if (!manualExpand) {
      setExpanded(
        testGroup.result?.result === 'cancel' ||
          testGroup.result?.result === 'fail' ||
          testGroup.result?.result === 'error' ||
          testGroup.result?.result === 'skip' ||
          view === 'report'
      );
    }
    setWarningCount(getProblemCount(testGroup, 'warning'));
    setErrorCount(getProblemCount(testGroup, 'error'));
  }, [testGroup.result]);

  const getProblemCount = (testGroup: TestGroup, problemType: string): number => {
    // Number of problems of problemType nested inside internal TestGroups
    const nestedProblemCount = testGroup.test_groups
      .map((tg) => getProblemCount(tg, problemType))
      .reduce((sum, val) => sum + val, 0);

    // Number of problems of problemType inside Tests
    const testProblemCount = testGroup.tests
      .map(
        (test) =>
          test.result?.messages?.filter((message) => message.type === problemType).length || 0
      )
      .reduce((sum, val) => sum + val, 0);

    return testProblemCount + nestedProblemCount;
  };

  const renderGroupListItems = (): JSX.Element[] => {
    return testGroup.test_groups.map((tg: TestGroup) => (
      <TestGroupListItem
        key={`li-${tg.id}`}
        testGroup={tg}
        runTests={runTests}
        updateRequest={updateRequest}
        showReportDetails={showReportDetails}
        view={view}
      />
    ));
  };

  const renderTestListItems = (): JSX.Element[] => {
    return testGroup.tests.map((test: Test) => (
      <TestListItem
        key={`li-${test.id}`}
        test={test}
        runTests={runTests}
        updateRequest={updateRequest}
        showReportDetails={showReportDetails}
        view={view}
      />
    ));
  };

  const expandedGroupListItem = (
    <Accordion
      disableGutters
      className={styles.accordion}
      sx={view === 'report' ? { pointerEvents: 'none' } : {}}
      expanded={expanded}
      onChange={() => {
        setExpanded(!expanded);
        setManualExpand(!expanded);
      }}
      TransitionProps={{ unmountOnExit: true }}
      onMouseEnter={() => setGroupMouseHover(true)}
      onMouseLeave={() => setGroupMouseHover(false)}
    >
      <AccordionSummary
        id={groupMouseHover ? '' : `${testGroup.id}-summary`}
        data-testid={`${testGroup.id}-summary`}
        aria-controls={`${testGroup.id}-detail`}
        className={styles.accordionSummary}
        expandIcon={view === 'run' && <ExpandMoreIcon sx={{ userSelect: 'auto' }} />}
      >
        <Box display="flex" alignItems="center" width="100%">
          <Box display="inline-flex">
            <ResultIcon result={testGroup.result} isRunning={testGroup.is_running} />
          </Box>
          <List sx={{ px: 1, width: '100%' }}>
            <ListItem sx={{ padding: 0 }}>
              <ListItemText
                primary={
                  <>
                    {testGroup.short_id && (
                      <Typography className={styles.shortId}>{`${testGroup.short_id} `}</Typography>
                    )}
                    <Typography className={styles.labelText}>{testGroup.title}</Typography>
                  </>
                }
                secondary={testGroup.result?.result_message}
              />
            </ListItem>
          </List>
          <Box display="flex" justifyContent="flex-end" width="100%">
            {warningCount > 0 && (
              <ProblemBadge
                Icon={Warning}
                counts={warningCount}
                color={styles.warning}
                badgeStyle={styles.warningBadge}
                description={`${warningCount} message(s)`}
                view={view}
                setOpen={setExpanded}
              />
            )}
            {errorCount > 0 && (
              <ProblemBadge
                Icon={Error}
                counts={errorCount}
                color={styles.error}
                badgeStyle={styles.errorBadge}
                description={`${errorCount} message(s)`}
                view={view}
                setOpen={setExpanded}
              />
            )}
          </Box>
          {view === 'run' && runTests && (
            <TestRunButton
              runnable={testGroup}
              runnableType={RunnableType.TestGroup}
              runTests={runTests}
            />
          )}
        </Box>
      </AccordionSummary>
      <Divider />
      {view === 'report' &&
        testGroup.run_as_group &&
        testGroup.user_runnable &&
        testGroup.result && (
          <InputOutputsList headerName="Input" inputOutputs={testGroup.result?.inputs || []} />
        )}
      <AccordionDetails
        title={groupMouseHover ? '' : `${testGroup.id}-detail`}
        data-testid={`${testGroup.id}-detail`}
        className={styles.accordionDetailContainer}
      >
        {testGroup.description && view === 'run' && (
          <NestedDescriptionPanel testGroup={testGroup} />
        )}
        <Box className={styles.accordionDetail}>
          {'test_groups' in testGroup && renderGroupListItems()}
          {'tests' in testGroup && renderTestListItems()}
        </Box>
      </AccordionDetails>
    </Accordion>
  );

  if (testGroup.expanded || view === 'report') {
    return expandedGroupListItem;
  } else {
    return <NavigableGroupListItem testGroup={testGroup} />;
  }
};

export default TestGroupListItem;
