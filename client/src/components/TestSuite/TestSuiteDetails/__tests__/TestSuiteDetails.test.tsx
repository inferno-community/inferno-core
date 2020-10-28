import React from 'react';
import { render, screen } from '@testing-library/react';
import { TestGroup, Test } from 'models/testSuiteModels';
import TestSuiteDetails, { TestSuiteDetailsProps } from '../TestSuiteDetails';

const setSelectedRunnableMock = jest.fn();
const runTestsMock = jest.fn();
const updateRequestMock = jest.fn();

const test1: Test = {
  id: 'test1',
  title: 'FHIR server makes SMART configuration available from well-known endpoint',
};
const test2: Test = {
  id: 'test2',
  title: 'Well-known configuration contains required fields',
};
const test3: Test = {
  id: 'test3',
  title: 'Client registration endpoint secured by transport layer security',
};
const test4: Test = {
  id: 'test4',
  title: 'Client registration endpoint accepts POST messages',
};

const testList1 = [test1, test2];
const testList2 = [test3, test4];

const sequence1: TestGroup = {
  tests: testList1,
  test_groups: [],
  title: 'SMART on FHIR Discovery',
  id: 'group0',
  inputs: [{ name: 'test input' }],
};

const sequence2: TestGroup = {
  tests: testList2,
  test_groups: [],
  title: 'Dynamic Registration',
  id: 'group1',
  inputs: [{ name: 'second input' }],
};

const nestedGroup: TestGroup = {
  tests: [],
  test_groups: [],
  title: 'nested group',
  id: 'group2',
  inputs: [],
};

const parentGroup: TestGroup = {
  tests: [],
  test_groups: [nestedGroup],
  title: 'i have a nested group',
  id: 'group3',
  inputs: [],
};

const testSuiteDetailsProps: TestSuiteDetailsProps = {
  title: 'DemonstrationSuite',
  id: 'example suite',
  test_groups: [sequence1, sequence2, parentGroup],
  setSelectedRunnable: setSelectedRunnableMock,
  runTests: runTestsMock,
  updateRequest: updateRequestMock,
};

test('Test Suite renders', () => {
  render(<TestSuiteDetails {...testSuiteDetailsProps} />);
  const treeTitle = screen.getByText(testSuiteDetailsProps.title);
  expect(treeTitle).toBeVisible();
  const sequence1Title = screen.getByText(sequence1.title);
  expect(sequence1Title).toBeVisible();
  const sequence2Title = screen.getByText(sequence2.title);
  expect(sequence2Title).toBeVisible();
  const parentGroupTitle = screen.getByText(parentGroup.title);
  expect(parentGroupTitle).toBeVisible();
  const nestedGroupTitle = screen.getByText(nestedGroup.title);
  expect(nestedGroupTitle).toBeVisible();
  [sequence1, sequence2].forEach((testGroup) => {
    testGroup.tests.forEach((test) => {
      const testTitle = screen.getByText(test.title);
      expect(testTitle).toBeVisible();
    });
  });
});
