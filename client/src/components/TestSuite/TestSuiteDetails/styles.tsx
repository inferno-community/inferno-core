import { Theme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';

export default makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  testIcon: {
    padding: '0 8px 0 0',
    display: 'inline-flex',
  },
  testGroupCardHeader: {
    padding: '8px 16px',
    fontWeight: 600,
    fontSize: '16px',
    borderBottom: '1px solid rgba(0,0,0,.12)',
    backgroundColor: theme.palette.common.blueGrayLightest,
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
    display: 'flex',
    minHeight: '36.5px',
    alignItems: 'center',
  },
  testGroupCard: {
    marginBottom: '24px',
  },
  testGroupCardList: {
    padding: 0,
  },
  testGroupCardHeaderText: {
    flexGrow: 1,
  },
  testGroupCardHeaderButton: {
    minWidth: 'fit-content',
  },
  descriptionPanel: {
    padding: '16px',
    overflow: 'auto',
  },
  currentItem: {
    fontWeight: 600,
  },
  accordion: {
    '&:before': {
      display: 'none',
    },
    '&:not(last-child)': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
  },
  accordionDetailContainer: {
    backgroundColor: theme.palette.common.grayLighter,
  },
  accordionDetail: {
    backgroundColor: theme.palette.common.white,
    padding: 0,
    margin: '8px 0 0 0',
    borderRadius: '4px',
  },
  nestedDescription: {
    padding: '8px 16px 24px 16px',
  },
  nestedDescriptionHeader: {
    fontWeight: 'bolder !important',
    color: theme.palette.common.orangeDarker,
  },
  nestedDescriptionContainer: {
    backgroundColor: theme.palette.common.grayLighter,
    padding: '8px 0',
  },
  folderIcon: {
    padding: '0 8px 0 0',
    color: theme.palette.common.grayLight,
  },
  printButton: {
    '@media print' : {
      display: 'none'
    }
  }
}));
