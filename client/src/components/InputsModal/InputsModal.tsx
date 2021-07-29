import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  TextField,
} from '@material-ui/core';
import { RunnableType, TestInput } from 'models/testSuiteModels';
import React, { FC, useEffect } from 'react';
import useStyles from './styles';

export interface InputsModalProps {
  runnableType: RunnableType;
  runnableId: string;
  inputs: TestInput[];
  modalVisible: boolean;
  hideModal: () => void;
  createTestRun: (runnableType: RunnableType, runnableId: string, inputs: TestInput[]) => void;
}

function runnableTypeReadable(runnableType: RunnableType) {
  switch (runnableType) {
    case RunnableType.TestSuite:
      return 'test suite';
    case RunnableType.TestGroup:
      return 'test group';
    case RunnableType.Test:
      return 'test';
  }
}

const InputsModal: FC<InputsModalProps> = ({
  runnableType,
  runnableId,
  inputs,
  modalVisible,
  hideModal,
  createTestRun,
}) => {
  function submitClicked(): void {
    const inputs_with_values: TestInput[] = [];
    inputsMap.forEach((input_value, input_name) => {
      inputs_with_values.push({ name: input_name, value: input_value, type: 'text' });
    });
    createTestRun(runnableType, runnableId, inputs_with_values);
    hideModal();
  }
  const styles = useStyles();
  const [inputsMap, setInputsMap] = React.useState<Map<string, string>>(new Map());
  useEffect(() => {
    inputs.forEach((requirement: TestInput) => {
      inputsMap.set(requirement.name, requirement.value || '');
    });
    setInputsMap(new Map(inputsMap));
  }, [inputs]);

  const inputFields = inputs.map((requirement: TestInput, index: number) => {
    switch (requirement.type) {
      case 'textarea':
        return (
          <ListItem key={`requirement${index}`}>
            <TextField
              id={`requirement${index}_input`}
              fullWidth
              label={requirement.title || requirement.name}
              helperText={requirement.description}
              value={inputsMap.get(requirement.name)}
              multiline
              rows={4}
              inputProps={{ className: styles.textarea }}
              onChange={(event) => {
                const value = event.target.value;
                inputsMap.set(requirement.name, value);
                setInputsMap(new Map(inputsMap));
              }}
            />
          </ListItem>
        );
      default:
        return (
          <ListItem key={`requirement${index}`}>
            <TextField
              id={`requirement${index}_input`}
              fullWidth
              label={requirement.title || requirement.name}
              helperText={requirement.description}
              value={inputsMap.get(requirement.name)}
              onChange={(event) => {
                const value = event.target.value;
                inputsMap.set(requirement.name, value);
                setInputsMap(new Map(inputsMap));
              }}
            />
          </ListItem>
        );
    }
  });
  return (
    <Dialog open={modalVisible} onClose={() => hideModal()} fullWidth={true} maxWidth="sm">
      <DialogTitle>Test Inputs</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please fill out required fields in order to run the {runnableTypeReadable(runnableType)}.
        </DialogContentText>
        <List>{inputFields}</List>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => hideModal()} data-testid="cancel-button">
          Cancel
        </Button>
        <Button color="primary" onClick={() => submitClicked()}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InputsModal;
