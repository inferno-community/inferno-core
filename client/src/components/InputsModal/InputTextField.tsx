import React, { FC } from 'react';
import { FormControl, FormLabel, Input, ListItem } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { TestInput } from '~/models/testSuiteModels';
import FieldLabel from './FieldLabel';
import useStyles from './styles';

export interface InputTextFieldProps {
  input: TestInput;
  index: number;
  inputsMap: Map<string, unknown>;
  setInputsMap: (map: Map<string, unknown>, edited?: boolean) => void;
}

const InputTextField: FC<InputTextFieldProps> = ({ input, index, inputsMap, setInputsMap }) => {
  const { classes } = useStyles();
  const [hasBeenModified, setHasBeenModified] = React.useState(false);

  const isMissingInput = hasBeenModified && !input.optional && !inputsMap.get(input.name);

  return (
    <ListItem>
      <FormControl
        component="fieldset"
        id={`requirement${index}_control`}
        disabled={input.locked}
        required={!input.optional}
        error={isMissingInput}
        fullWidth
        className={classes.inputField}
      >
        <FormLabel htmlFor={`requirement${index}_input`} className={classes.inputLabel}>
          <FieldLabel requirement={input} isMissingInput={isMissingInput} />
        </FormLabel>
        {input.description && (
          <ReactMarkdown className={classes.inputDescription} remarkPlugins={[remarkGfm]}>
            {input.description}
          </ReactMarkdown>
        )}
        <Input
          disabled={input.locked}
          required={!input.optional}
          error={isMissingInput}
          id={`requirement${index}_input`}
          className={classes.inputField}
          color="secondary"
          fullWidth
          multiline={input.type === 'textarea'}
          minRows={input.type === 'textarea' ? 4 : 1}
          maxRows={20}
          value={inputsMap.get(input.name) || ''}
          onBlur={(e) => {
            if (e.currentTarget === e.target) {
              setHasBeenModified(true);
            }
          }}
          onChange={(event) => {
            const value = event.target.value;
            inputsMap.set(input.name, value);
            setInputsMap(new Map(inputsMap));
          }}
        />
      </FormControl>
    </ListItem>
  );
};

export default InputTextField;
