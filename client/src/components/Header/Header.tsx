import React, { FC } from 'react';
import useStyles from './styles';
import icon from 'images/inferno_icon.png';
import { AppBar, Box, Button, Link, Stack, Toolbar, Typography } from '@mui/material';
import { useHistory } from 'react-router-dom';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { getStaticPath } from 'api/infernoApiService';
import { PresetSummary } from 'models/testSuiteModels';
import PresetsSelector from 'components/PresetsSelector/PresetsSelector';

export interface HeaderProps {
  suiteTitle?: string;
  suiteVersion?: string;
  presets?: PresetSummary[];
  testSessionId?: string;
  getSessionData?: (testSessionId: string) => void;
}

const Header: FC<HeaderProps> = ({
  suiteTitle,
  suiteVersion,
  presets,
  testSessionId,
  getSessionData,
}) => {
  const styles = useStyles();
  const history = useHistory();

  const returnHome = () => {
    history.push('/');
  };

  const presetButton = (
    <>
      {presets && presets.length > 0 && testSessionId && getSessionData && (
        <Box>
          <PresetsSelector
            presets={presets}
            testSessionId={testSessionId}
            getSessionData={getSessionData}
          />
        </Box>
      )}
    </>
  );

  return suiteTitle ? (
    <AppBar color="default" className={styles.appbar}>
      <Toolbar className={styles.toolbar}>
        <Box display="flex" justifyContent="center">
          <Link href="/inferno">
            <img
              src={getStaticPath(icon as string)}
              alt="Inferno logo - start new session"
              className={styles.logo}
            />
          </Link>
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
        <Stack direction="row" spacing={2}>
          {presetButton}
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
