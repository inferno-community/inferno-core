import React, { FC } from 'react';
import { ListItem, TextField } from '@mui/material';
import { TestInput } from '~/models/testSuiteModels';
import FieldLabel from './FieldLabel';
import useStyles from './styles';
import lightTheme from 'styles/theme';

export interface InputTextAreaProps {
  requirement: TestInput;
  index: number;
  inputsMap: Map<string, unknown>;
  setInputsMap: (map: Map<string, unknown>, edited?: boolean) => void;
}

const InputTextArea: FC<InputTextAreaProps> = ({ requirement, index, inputsMap, setInputsMap }) => {
  const { classes } = useStyles();
  const [hasBeenModified, setHasBeenModified] = React.useState(false);

  const isMissingInput =
    hasBeenModified && !requirement.optional && !inputsMap.get(requirement.name);

  return (
    <ListItem>
      <TextField
        disabled={requirement.locked}
        required={!requirement.optional}
        error={isMissingInput}
        id={`requirement${index}_input`}
        className={classes.inputField}
        variant="standard"
        fullWidth
        label={<FieldLabel requirement={requirement} isMissingInput={isMissingInput} />}
        helperText={requirement.description}
        value={inputsMap.get(requirement.name)}
        multiline
        rows={4}
        onBlur={(e) => {
          if (e.currentTarget === e.target) {
            setHasBeenModified(true);
          }
        }}
        onChange={(event) => {
          const value = event.target.value;
          inputsMap.set(requirement.name, value);
          setInputsMap(new Map(inputsMap));
        }}
        FormHelperTextProps={{
          sx: { '&.Mui-disabled': { color: lightTheme.palette.common.grayDark } },
        }}
      />
    </ListItem>
  );
};

export default InputTextArea;
