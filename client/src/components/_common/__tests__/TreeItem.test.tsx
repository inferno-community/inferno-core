import React from 'react';
import { Router } from 'react-router';
import TreeView from '@mui/lab/TreeView';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TreeItemLabel from 'components/TestSuite/TestSuiteTree/TreeItemLabel';
import ThemeProvider from 'components/ThemeProvider';
import { createMemoryHistory } from 'history';
import CustomTreeItem from '../TreeItem';
import { mockedTestSuite } from '../__mocked_data__/mockData';

test('renders custom TreeItem', () => {
  render(
    <ThemeProvider>
      <TreeView>
        <CustomTreeItem
          nodeId={mockedTestSuite.id}
          label={<TreeItemLabel runnable={mockedTestSuite} />}
          ContentProps={{ testId: mockedTestSuite.id } as any}
        />
      </TreeView>
    </ThemeProvider>
  );

  const treeItemElement = screen.getByRole('treeitem');
  expect(treeItemElement).toBeInTheDocument();
});

test('TreeItem expansion should not be toggled when label is clicked', () => {
  const history = createMemoryHistory();

  render(
    <Router history={history}>
      <ThemeProvider>
        <TreeView expanded={[mockedTestSuite.id]}>
          <CustomTreeItem
            nodeId={mockedTestSuite.id}
            label={<TreeItemLabel runnable={mockedTestSuite} />}
            ContentProps={{ testId: mockedTestSuite.id } as any}
          >
            <></>
          </CustomTreeItem>
        </TreeView>
      </ThemeProvider>
    </Router>
  );

  const labelElement = screen.getAllByTestId('tiLabel', { exact: false })[0];
  const treeItemElement = screen.getAllByRole('treeitem')[0];
  expect(labelElement).toBeInTheDocument();
  expect(treeItemElement).toHaveAttribute('aria-expanded', 'true');

  userEvent.click(labelElement);
  expect(treeItemElement).toHaveAttribute('aria-expanded', 'true');
});

test('clicking on TreeItem should navigate to group or test instance', () => {
  const history = createMemoryHistory({ initialEntries: ['/test_sessions/:test_session_id'] });

  render(
    <Router history={history}>
      <ThemeProvider>
        <TreeView>
          <CustomTreeItem
            nodeId={mockedTestSuite.id}
            label={<TreeItemLabel runnable={mockedTestSuite} />}
            ContentProps={{ testId: mockedTestSuite.id } as any}
          />
        </TreeView>
      </ThemeProvider>
    </Router>
  );

  const labelElement = screen.getAllByTestId('tiLabel', { exact: false })[0];
  expect(labelElement).toBeInTheDocument();

  userEvent.click(labelElement);
  expect(history.location.hash).toBe(`#${mockedTestSuite.id}`);
});
