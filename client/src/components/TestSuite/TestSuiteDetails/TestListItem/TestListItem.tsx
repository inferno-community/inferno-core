import React, { FC, Fragment } from 'react';
import useStyles from './styles';
import {
  Box,
  Chip,
  Collapse,
  Container,
  Divider,
  IconButton,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  Tooltip,
} from '@material-ui/core';
import { RunnableType, Test, Request } from 'models/testSuiteModels';
import TabPanel from './TabPanel';
import MessagesList from './MessagesList';
import RequestsList from './RequestsList';
import ResultIcon from '../ResultIcon';
import PublicIcon from '@material-ui/icons/Public';
import MailIcon from '@material-ui/icons/Mail';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReactMarkdown from 'react-markdown';
import TestRunButton from '../../TestRunButton/TestRunButton';

interface TestListItemProps {
  test: Test;
  runTests: (runnableType: RunnableType, runnableId: string) => void;
  updateRequest: (requestId: string, resultId: string, request: Request) => void;
  testRunInProgress: boolean;
}

const TestListItem: FC<TestListItemProps> = ({
  test,
  runTests,
  updateRequest,
  testRunInProgress,
}) => {
  const styles = useStyles();

  const [open, setOpen] = React.useState(false);
  const [panelIndex, setPanelIndex] = React.useState(0);

  const messagesBadge =
    test.result?.messages && test.result.messages.length > 0 ? (
      <Tooltip className={styles.testBadge} title={`${test.result.messages.length} messages`}>
        <Chip
          variant="outlined"
          label={test.result.messages.length}
          avatar={<MailIcon />}
          onClick={() => {
            setPanelIndex(1);
            setOpen(true);
          }}
        />
      </Tooltip>
    ) : null;

  const requestsBadge =
    test.result?.requests && test.result.requests.length > 0 ? (
      <Tooltip className={styles.testBadge} title={`${test.result.requests.length} http requests`}>
        <Chip
          variant="outlined"
          label={test.result.requests.length}
          avatar={<PublicIcon />}
          onClick={() => {
            setPanelIndex(2);
            setOpen(true);
          }}
        />
      </Tooltip>
    ) : null;

  const expandButton = open ? (
    <IconButton onClick={() => setOpen(false)} size="small">
      <ExpandLessIcon />
    </IconButton>
  ) : (
    <IconButton onClick={() => setOpen(true)} size="small">
      <ExpandMoreIcon />
    </IconButton>
  );

  const testDescription =
    test.description && test.description.length > 0 ? (
      <ReactMarkdown>{test.description}</ReactMarkdown>
    ) : (
      'No description'
    );

  return (
    <Fragment>
      <Box className={styles.listItem}>
        <ListItem>
          <div className={styles.testIcon}>{<ResultIcon result={test.result} />}</div>
          <ListItemText primary={test.title} />
          {messagesBadge}
          {requestsBadge}
          {expandButton}
          <TestRunButton
            runnable={test}
            runTests={runTests}
            testRunInProgress={testRunInProgress}
          />
        </ListItem>
        {test.result?.result_message ? (
          <ReactMarkdown className={styles.resultMessageMarkdown}>
            {test.result.result_message}
          </ReactMarkdown>
        ) : null}
      </Box>
      <Collapse in={open} timeout="auto" className={styles.collapsible} unmountOnExit>
        <Divider />
        <Tabs
          value={panelIndex}
          className={styles.tabs}
          onChange={(_event, newIndex) => {
            setPanelIndex(newIndex);
          }}
          variant="fullWidth"
        >
          <Tab label="About" />
          <Tab label="Messages" />
          <Tab label="HTTP Requests" />
        </Tabs>
        <Divider />
        <TabPanel currentPanelIndex={panelIndex} index={0}>
          <Container className={styles.descriptionPanel}>{testDescription}</Container>
          <Divider />
        </TabPanel>
        <TabPanel currentPanelIndex={panelIndex} index={1}>
          <MessagesList messages={test.result?.messages || []} />
        </TabPanel>
        <TabPanel currentPanelIndex={panelIndex} index={2}>
          <RequestsList
            requests={test.result?.requests || []}
            resultId={test.result?.id || ''}
            updateRequest={updateRequest}
          />
        </TabPanel>
      </Collapse>
    </Fragment>
  );
};

export default TestListItem;
