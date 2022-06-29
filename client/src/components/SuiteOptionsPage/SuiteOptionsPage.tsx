import React, { FC } from 'react';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Typography,
  Container,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Grid,
  Radio,
  RadioGroup
} from '@mui/material';
import { TestSuite, TestSession, SuiteOption, SuiteOptionChoice } from 'models/testSuiteModels';
import useStyles from './styles';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { postTestSessions } from 'api/TestSessionApi';
import Header from 'components/Header';

export interface SuiteOptionsPageProps {
  testSuites: TestSuite[] | undefined;
}

const SuiteOptionsPage: FC<SuiteOptionsPageProps> = ({ testSuites }) => {
  const [testSuiteChosen, setTestSuiteChosen] = React.useState('');
  const styles = useStyles();
  const history = useHistory();

  function createTestSession(): void {
    postTestSessions(testSuiteChosen)
      .then((testSession: TestSession | null) => {
        if (testSession && testSession.test_suite) {
          history.push('test_sessions/' + testSession.id);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }


  const { test_suite_id } = useParams<{ test_suite_id: string }>();

  const testSuite = testSuites?.find((suite: TestSuite) => suite.id == test_suite_id);

  return (
    <>
      <Header />
      <Container maxWidth="lg" className={styles.main} role="main">
        <Grid container spacing={10} justifyContent="center">
          <Grid container item xs={6} alignItems="center">
            <Grid item>
              <Typography variant="h2" component="h1">
                FHIR Testing with Inferno
              </Typography>
              <Typography variant="h5" component="h2">
                Test your server's conformance to authentication, authorization, and FHIR content
                standards.
              </Typography>
            </Grid>
          </Grid>
          <Grid container item xs={6} alignItems="center" justifyContent="center">
            <Grid item>
              <Paper elevation={4} className={styles.getStarted}>
                <Typography variant="h4" component="h2" align="center">
                  { testSuite?.title}
                </Typography>
                <FormControl>
                  {testSuite?.suite_options?.map((suiteOption: SuiteOption, i) => (
                    <div>
                      <FormLabel>{suiteOption.title}</FormLabel>
                      <RadioGroup>
                        {suiteOption.list_options.map((option, k) => (
                        <FormControlLabel value={option.value} control={<Radio />} label={option.label} />
                        ))}
                      </RadioGroup>
                    </div>
                  ))}

                </FormControl>
                <List>
                </List>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  fullWidth
                  disabled={!testSuiteChosen}
                  data-testid="go-button"
                  className={styles.startTestingButton}
                  onClick={() => createTestSession()}
                >
                  Start Testing
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default SuiteOptionsPage;
