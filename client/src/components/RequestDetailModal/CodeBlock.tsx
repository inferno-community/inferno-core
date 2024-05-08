import React, { FC } from 'react';
import { Box, Card, CardContent, CardHeader, Collapse, Divider } from '@mui/material';
import { useEffectOnce } from '~/hooks/useEffectOnce';
import { RequestHeader } from '~/models/testSuiteModels';
import CollapseButton from '~/components/_common/CollapseButton';
import CopyButton from '~/components/_common/CopyButton';

import { formatBodyIfJSON } from './helpers';
import useStyles from './styles';

export interface CodeBlockProps {
  body?: string | null;
  headers?: RequestHeader[] | null | undefined;
  title?: string;
}

const CodeBlock: FC<CodeBlockProps> = ({ body, headers, title }) => {
  const { classes } = useStyles();
  const [collapsed, setCollapsed] = React.useState(true);
  const [jsonBody, setJsonBody] = React.useState<string>('');

  useEffectOnce(() => {
    if (body && body.length > 0) {
      setJsonBody(formatBodyIfJSON(body, headers));
    }
  });

  if (body && body.length > 0) {
    return (
      <Card variant="outlined" className={classes.codeblock} data-testid="code-block">
        <CardHeader
          title={title || 'Code'}
          titleTypographyProps={{ sx: { fontSize: 20, cursor: 'pointer' } }}
          action={
            <Box display="flex">
              <CopyButton copyText={jsonBody} />
              <CollapseButton setCollapsed={setCollapsed} collapsed={collapsed} />
            </Box>
          }
          onClick={() => setCollapsed(!collapsed)}
        />
        <Collapse in={!collapsed}>
          <Divider />
          <CardContent sx={{ pt: 0 }}>
            <pre data-testid="pre">
              <code data-testid="code" className={classes.code}>
                {jsonBody}
              </code>
            </pre>
          </CardContent>
        </Collapse>
      </Card>
    );
  } else {
    return null;
  }
};

export default CodeBlock;
