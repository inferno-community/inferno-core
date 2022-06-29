import React, { FC } from 'react';
import useStyles from './styles';
import { Table, TableBody, TableRow, TableCell, Typography, TableHead, Box } from '@mui/material';
import { TestInput, TestOutput } from '~/models/testSuiteModels';
import ReactMarkdown from 'react-markdown';

interface InputOutputsListProps {
  inputOutputs: TestInput[] | TestOutput[];
  noValuesMessage?: string;
  headerName: string;
}

const InputsOutputsList: FC<InputOutputsListProps> = ({
  inputOutputs,
  noValuesMessage,
  headerName,
}) => {
  const styles = useStyles();

  const headerTitles = [headerName, 'Value'];
  const inputOutputsListHeader = (
    <TableRow key="inputOutputs-header">
      {headerTitles.map((title) => (
        <TableCell
          key={title}
          className={title === 'Value' ? styles.inputOutputsValue : styles.noPrintSpacing || ''}
        >
          <Typography variant="overline" className={styles.bolderText}>
            {title}
          </Typography>
        </TableCell>
      ))}
    </TableRow>
  );

  const inputOutputsListItems = inputOutputs.map(
    (inputOutputs: TestInput | TestOutput, index: number) => {
      return (
        <TableRow key={`inputOutputsRow-${index}`}>
          <TableCell className={styles.noPrintSpacing}>
            <Typography variant="subtitle2" component="p" className={styles.bolderText}>
              {inputOutputs.name}
            </Typography>
          </TableCell>
          <TableCell className={styles.inputOutputsValue}>
            <ReactMarkdown className={styles.wordWrap}>
              {(inputOutputs?.value as string) || ''}
            </ReactMarkdown>
          </TableCell>
        </TableRow>
      );
    }
  );

  const output =
    inputOutputs.length > 0 ? (
      <Table>
        <TableHead>{inputOutputsListHeader}</TableHead>
        <TableBody>{inputOutputsListItems}</TableBody>
      </Table>
    ) : (
      noValuesMessage && (
        <Box p={2}>
          <Typography variant="subtitle2" component="p">
            {noValuesMessage}
          </Typography>
        </Box>
      )
    );

  return output || <></>;
};

export default InputsOutputsList;
