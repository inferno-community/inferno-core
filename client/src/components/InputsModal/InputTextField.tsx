import React, { FC } from 'react';
import { ListItem, TextField } from '@mui/material';
import { TestInput } from '~/models/testSuiteModels';
import FieldLabel from './FieldLabel';
import useStyles from './styles';
import lightTheme from 'styles/theme';

export interface InputTextFieldProps {
  requirement: TestInput;
  index: number;
  inputsMap: Map<string, unknown>;
  setInputsMap: (map: Map<string, unknown>) => void;
}

const InputTextField: FC<InputTextFieldProps> = ({
  requirement,
  index,
  inputsMap,
  setInputsMap,
}) => {
  const styles = useStyles();

  return (
    <ListItem>
      <TextField
        disabled={requirement.locked}
        required={!requirement.optional}
        id={`requirement${index}_input`}
        className={styles.inputField}
        variant="standard"
        fullWidth
        label={<FieldLabel requirement={requirement} />}
        helperText={requirement.description}
        value={inputsMap.get(requirement.name)}
        onChange={(event) => {
          const value = event.target.value;
          inputsMap.set(requirement.name, value);
          setInputsMap(new Map(inputsMap));
        }}
        InputLabelProps={{ shrink: true }}
        FormHelperTextProps={{
          sx: { '&.Mui-disabled': { color: lightTheme.palette.common.grayDark } },
        }}
      />
    </ListItem>
  );
};

export default InputTextField;
