import { Result, Runnable, Test, TestGroup, TestSuite } from '~/models/testSuiteModels';

const mapRunnableRecursive = (testGroup: TestGroup, map: Map<string, Runnable>) => {
  map.set(testGroup.id, testGroup);
  testGroup.test_groups.forEach((subGroup: TestGroup) => {
    mapRunnableRecursive(subGroup, map);
  });
  testGroup.tests.forEach((test: Test) => {
    map.set(test.id, test);
  });
};

export const mapRunnableToId = (testSuite: TestSuite): Map<string, Runnable> => {
  const map = new Map<string, Runnable>();
  map.set(testSuite.id, testSuite);
  testSuite?.test_groups?.forEach((testGroup: TestGroup) => {
    mapRunnableRecursive(testGroup, map);
  });
  return map;
};

export const resultsToMap = (results: Result[], map?: Map<string, Result>): Map<string, Result> => {
  let resultsMap: Map<string, Result>;
  if (map === undefined) {
    resultsMap = new Map<string, Result>();
  } else {
    resultsMap = map;
  }
  results.forEach((result: Result) => {
    if (result.test_suite_id) {
      resultsMap.set(result.test_suite_id, result);
    } else if (result.test_group_id) {
      resultsMap.set(result.test_group_id, result);
    } else if (result.test_id) {
      resultsMap.set(result.test_id, result);
    }
  });
  return new Map(resultsMap);
};

export const shouldShowDescription = (
  runnable: Runnable,
  description: JSX.Element | undefined
): boolean => {
  if (description && runnable.description && runnable.description.length > 0) {
    return true;
  } else {
    return false;
  }
};
