import {
  mockedTest,
  mockedTestGroup,
  mockedTestSuite,
} from '~/components/_common/__mocked_data__/mockData';
import { RunnableType } from '~/models/testSuiteModels';

export const mockedRunTests = (runnableType: RunnableType, runnableId: string) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const data = [runnableType, runnableId];
};

export const mockedTestRunButtonData = {
  test: mockedTest,
  testGroup: mockedTestGroup,
  testSuite: mockedTestSuite,
  runTests: mockedRunTests,
};
