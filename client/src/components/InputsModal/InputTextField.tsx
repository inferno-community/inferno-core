import { ListItem, TextField } from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';
import { TestInput } from 'models/testSuiteModels';
import React, { FC, Fragment } from 'react';
import useStyles from './styles';

export interface InputTextFieldProps {
  requirement: TestInput;
  index: number;
  inputsMap: Map<string, string>;
  setInputsMap: (map: Map<string, string>) => void;
}

const InputTextField: FC<InputTextFieldProps> = ({
  requirement,
  index,
  inputsMap,
  setInputsMap,
}) => {
  const styles = useStyles();
  const fieldLabelText = requirement.title || requirement.name;
  const lockedIcon = requirement.locked ? (
    <LockIcon fontSize="small" className={styles.lockedIcon} />
  ) : null;
  const requiredLabel = !requirement.optional && !requirement.locked ? ' (required)' : '';
  const fieldLabel = (
    <Fragment>
      {fieldLabelText}
      {requiredLabel}
      {lockedIcon}
    </Fragment>
  );

  return (
    <ListItem disabled={requirement.locked}>
      <TextField
        disabled={requirement.locked}
        id={`requirement${index}_input`}
        className={styles.inputField}
        fullWidth
        label={fieldLabel}
        helperText={requirement.description}
        value={inputsMap.get(requirement.name)}
        onChange={(event) => {
          const value = event.target.value;
          inputsMap.set(requirement.name, value);
          setInputsMap(new Map(inputsMap));
        }}
        InputLabelProps={{ shrink: true }}
      />
    </ListItem>
  );
};

export default InputTextField;
