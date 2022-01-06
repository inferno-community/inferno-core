import { Theme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';

export default makeStyles((theme: Theme) => ({
  textarea: {
    resize: 'vertical',
    maxHeight: '400px',
    overflow: 'auto !important',
  },
  inputField: {
    '& > label.MuiInputLabel-shrink': {
      fontWeight: 600,
      color: 'rgba(0,0,0,0.85)',
    },
    '& label.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
  inputLabel: {
    fontWeight: 600,
    color: 'rgba(0,0,0,0.85)',
  },
  lockedIcon: {
    marginLeft: '5px',
    verticalAlign: 'text-bottom',
  },
  oauthCard: {
    width: '100%',
    margin: '8px 0',
    borderColor: 'rgba(0,0,0,0.3)',
  },
  radioGroup: {
    marginTop: '16px',
  },
}));
