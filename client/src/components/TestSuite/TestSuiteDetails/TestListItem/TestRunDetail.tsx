import React, { FC, useEffect, useMemo } from 'react';
import { Box, Card, Divider, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import { Message, Request, Test, TestInput, TestOutput } from '~/models/testSuiteModels';
import { shouldShowDescription } from '~/components/TestSuite/TestSuiteUtilities';
import TabPanel from '~/components/TestSuite/TestSuiteDetails/TestListItem/TabPanel';
import MessageList from '~/components/TestSuite/TestSuiteDetails/TestListItem/MessageList';
import RequestList from '~/components/TestSuite/TestSuiteDetails/TestListItem/RequestList';
import InputOutputList from '~/components/TestSuite/TestSuiteDetails/TestListItem/InputOutputList';
import lightTheme from '~/styles/theme';
import useStyles from './styles';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface TestRunDetailProps {
  test: Test;
  currentTabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  updateRequest?: (requestId: string, resultId: string, request: Request) => void;
  tabs: TabProps[];
}

export interface TabProps {
  label: string;
  value: Message[] | Request[] | TestInput[] | TestOutput[] | string | null | undefined;
}

const TestRunDetail: FC<TestRunDetailProps> = ({
  test,
  currentTabIndex,
  setTabIndex,
  updateRequest,
  tabs,
}) => {
  const { classes } = useStyles();

  useEffect(() => {
    setTabIndex(currentTabIndex);
  }, [currentTabIndex]);

  const testDescription: JSX.Element = (
    <Box mx={2}>
      <Typography variant="subtitle2" component="div">
        {useMemo(
          () => (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{test.description || ''}</ReactMarkdown>
          ),
          [test.description]
        )}
      </Typography>
    </Box>
  );

  const a11yProps = (index: number) => ({
    id: `${test.id}-tab-${index}`,
    'aria-controls': `${test.id}-tabpanel-${index}`,
  });

  const renderTab = (tab: TabProps, index: number) => {
    const darkTabText = {
      '&.Mui-selected': {
        color: lightTheme.palette.common.orangeDarker,
      },
    };

    if ((!tab.value || tab.value.length === 0) && tab.label !== 'About') {
      return (
        <Tab
          key={`${tab.label}-${index}`}
          label={
            <Tooltip title={`No ${tab.label.toLowerCase()} available`}>
              <Typography variant="button">{tab.label}</Typography>
            </Tooltip>
          }
          {...a11yProps(index)}
          disabled
          sx={darkTabText}
          style={{ pointerEvents: 'auto' }}
        />
      );
    }

    return (
      <Tab key={`${tab.label}-${index}`} label={tab.label} {...a11yProps(index)} sx={darkTabText} />
    );
  };

  return (
    <Card data-testid="test-run-detail">
      <Tabs
        value={currentTabIndex}
        variant="scrollable"
        className={classes.tabs}
        onChange={(e, newIndex: number) => {
          setTabIndex(newIndex);
        }}
      >
        {tabs.map((tab, i) => renderTab(tab, i))}
      </Tabs>
      <Divider />
      <TabPanel id={test.id} currentTabIndex={currentTabIndex} index={0}>
        <MessageList messages={test.result?.messages || []} />
      </TabPanel>
      <TabPanel id={test.id} currentTabIndex={currentTabIndex} index={1}>
        {updateRequest && (
          <RequestList
            requests={test.result?.requests || []}
            resultId={test.result?.id || ''}
            updateRequest={updateRequest}
            view="run"
          />
        )}
      </TabPanel>
      <TabPanel id={test.id} currentTabIndex={currentTabIndex} index={2}>
        <InputOutputList
          inputOutputs={test.result?.inputs || []}
          noValuesMessage="No Inputs"
          headerName="Input"
        />
      </TabPanel>
      <TabPanel id={test.id} currentTabIndex={currentTabIndex} index={3}>
        <InputOutputList
          inputOutputs={test.result?.outputs || []}
          noValuesMessage="No Outputs"
          headerName="Output"
        />
      </TabPanel>
      <TabPanel id={test.id} currentTabIndex={currentTabIndex} index={4}>
        {shouldShowDescription(test, testDescription) ? (
          testDescription
        ) : (
          <Box p={2}>
            <Typography variant="subtitle2" component="p">
              No Description
            </Typography>
          </Box>
        )}
      </TabPanel>
    </Card>
  );
};

export default TestRunDetail;
