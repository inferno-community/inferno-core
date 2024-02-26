import { Theme } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';

export default makeStyles()((_theme: Theme) => ({
  modalTitle: {
    fontWeight: 600,
    fontSize: '1.5rem',
  },
  modalTitleURL: {
    overflow: 'hidden',
    maxHeight: '1.6em',
    wordBreak: 'break-all',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: '1',
  },
  headerName: {
    fontWeight: 600,
  },
  codeblock: {
    overflow: 'auto',
    fontSize: 'small',
    marginTop: '16px',
  },
  code: {
    textWrap: 'wrap',
  },
  inputIcon: {
    float: 'right',
    verticalAlign: 'middle',
    marginTop: '4px',
  },
}));
