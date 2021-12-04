import React from "react";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import { Box, Card, CardContent, Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    title: {
      fontSize: 14,
    },
    console: {
      padding: theme.spacing(1),
      background: theme.palette.common.black,
      color: theme.palette.common.white,
      WebkitUserSelect: "text",
    },
    exampleBox: {
      display: "flex",
      flexDirection: "column",
      gridGap: theme.spacing(1),
    },
    prompt: {
      color: theme.palette.primary.light,
      WebkitUserSelect: "none",
    },
  })
);

type Props = {
  host?: string;
  port: number;
};

const ProxyUsageCard: React.FC<Props> = ({ host = "localhost", port }) => {
  const classes = useStyles({});

  const bashZshCmd = {
    name: "bash/zsh",
    prompt: <span className={classes.prompt}>$ </span>,
    http: `export http_proxy="http://${host}:${port}"`,
    https: `export https_proxy="http://${host}:${port}"`,
  };
  const psCmd = {
    name: "PowerShell",
    prompt: <span className={classes.prompt}>PS C:{">"} </span>,
    http: `$env:http_proxy="http://${host}:${port}"`,
    https: `$env:http_sproxy="http://${host}:${port}"`,
  };

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography className={classes.title} color="textPrimary" gutterBottom>
          プロキシ設定例
        </Typography>

        <Box className={classes.exampleBox}>
          {[bashZshCmd, psCmd].map((cmd, index) => (
            <Box key={index}>
              <Typography className={classes.title} color="textSecondary">
                {cmd.name}
              </Typography>
              <Paper className={classes.console} variant="outlined">
                <Typography>
                  {cmd.prompt}
                  {cmd.http}
                </Typography>
                <Typography>
                  {cmd.prompt}
                  {cmd.https}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProxyUsageCard;
