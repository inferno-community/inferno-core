import React, { FC, Fragment } from 'react';
import { Result } from 'models/testSuiteModels';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Tooltip } from '@mui/material';
import { green, red, purple } from '@mui/material/colors';

export interface CondensedResultIconProps {
  result?: Result;
}

const CondensedResultIcon: FC<CondensedResultIconProps> = ({ result }) => {
  if (result) {
    switch (result.result) {
      case 'pass':
        return (
          <Tooltip title="passed">
            <FiberManualRecordIcon
              style={{
                color: result.optional ? green[100] : green[500],
                width: '0.5em',
                height: '0.5em',
              }}
              data-testid={`${result.id}-${result.result}`}
            />
          </Tooltip>
        );
      case 'fail':
        return (
          <Tooltip title="failed">
            <FiberManualRecordIcon
              style={{
                color: result.optional ? red[100] : red[500],
                width: '0.5em',
                height: '0.5em',
              }}
              data-testid={`${result.id}-${result.result}`}
            />
          </Tooltip>
        );
      case 'skip':
        return (
          <Tooltip title="skipped">
            <FiberManualRecordIcon
              style={{ width: '0.5em', height: '0.5em' }}
              data-testid={`${result.id}-${result.result}`}
            />
          </Tooltip>
        );
      case 'omit':
        return (
          <Tooltip title="omitted">
            <FiberManualRecordIcon
              style={{ width: '0.5em', height: '0.5em' }}
              data-testid={`${result.id}-${result.result}`}
            />
          </Tooltip>
        );
      case 'error':
        return (
          <Tooltip title="error">
            <FiberManualRecordIcon
              style={{ color: result.optional ? purple[100] : purple[500], width: '0.5em', height: '0.5em' }}
              data-testid={`${result.id}-${result.result}`}
            />
          </Tooltip>
        );
      default:
        return <Fragment />;
    }
  } else {
    return <Fragment />;
  }
};

export default CondensedResultIcon;
