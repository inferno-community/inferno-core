import React, { FC } from 'react';
import useStyles from './styles';
import icon from 'images/inferno_icon.png';
import { AppBar, Box, Button, IconButton, Stack, Toolbar, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { getStaticPath } from 'api/infernoApiService';

export interface HeaderProps {
  suiteTitle?: string;
  suiteVersion?: string;
  drawerOpen?: boolean;
  windowIsSmall?: boolean;
  toggleDrawer?: (drawerOpen: boolean) => void;
}

const Header: FC<HeaderProps> = ({
  suiteTitle,
  suiteVersion,
  windowIsSmall,
  drawerOpen,
  toggleDrawer,
}) => {
  const styles = useStyles();
  const history = useHistory();

  const returnHome = () => {
    history.push('/');
  };

  return suiteTitle ? (
    <AppBar color="default" className={styles.appbar}>
      <Toolbar className={styles.toolbar}>
        <Box display="flex" justifyContent="center">
          <IconButton
            size="small"
            edge="start"
            aria-label="menu"
            disabled={!windowIsSmall}
            onClick={() => {
              if (toggleDrawer) toggleDrawer(!drawerOpen);
            }}
          >
            <img
              src={getStaticPath(icon as string)}
              alt="Inferno logo - start new session"
              className={styles.logo}
            />
          </IconButton>
          <Box className={styles.titleContainer}>
            <Typography variant="h5" component="h1" className={styles.title}>
              {suiteTitle}
            </Typography>
            {suiteVersion && (
              <Typography variant="overline" className={styles.version}>
                {`v.${suiteVersion}`}
              </Typography>
            )}
          </Box>
        </Box>
        <Stack direction="row" spacing={2} sx={{ minWidth: windowIsSmall ? '' : 'fit-content' }}>
          <Button
            disableElevation
            color="secondary"
            size="small"
            variant="contained"
            startIcon={<NoteAddIcon />}
            onClick={returnHome}
          >
            New Session
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  ) : (
    <></>
  );
};

export default Header;
