import { Box, Typography } from '@mui/material';
import React, { FC } from 'react';
import clsx from 'clsx';
import useStyles from './styles';

import Cancel from '@mui/icons-material/Cancel';
import Warning from '@mui/icons-material/Warning';
import Info from '@mui/icons-material/Info';

type MessageTypeProps = {
  type: 'warning' | 'error' | 'info';
};

const MessageType: FC<MessageTypeProps> = ({ type }) => {
  const styles = useStyles();
  const style = styles[type];

  let icon;
  if (type === 'error') {
    icon = <Cancel className={style} />;
  } else if (type === 'warning') {
    icon = <Warning className={style} />;
  } else if (type === 'info') {
    icon = <Info className={style} />;
  }

  return (
    <Box display="flex" alignItems="center">
      {icon}
      <Typography
        variant="subtitle2"
        component="p"
        p={1}
        className={clsx([styles.bolderText, style])}
      >
        {type}
      </Typography>
    </Box>
  );
};

export default MessageType;
