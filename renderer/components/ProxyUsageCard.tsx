import { Box, Card, CardContent, Paper, Typography } from "@mui/material";

type Props = {
  host?: string;
  port: number;
};

const ProxyUsageCard: React.FC<Props> = ({ host = "localhost", port }) => {
  const bashZshCmd = {
    name: "bash/zsh",
    prompt: (
      <Box
        component="span"
        sx={{
          color: (theme) => theme.palette.primary.light,
          WebkitUserSelect: "none",
        }}
      >
        ${" "}
      </Box>
    ),
    http: `export http_proxy="http://${host}:${port}"`,
    https: `export https_proxy="http://${host}:${port}"`,
  };
  const psCmd = {
    name: "PowerShell",
    prompt: (
      <Box
        component="span"
        sx={{
          color: (theme) => theme.palette.primary.light,
          WebkitUserSelect: "none",
        }}
      >
        PS C:{">"}{" "}
      </Box>
    ),
    http: `$env:http_proxy="http://${host}:${port}"`,
    https: `$env:http_sproxy="http://${host}:${port}"`,
  };

  return (
    <Card>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="textPrimary" gutterBottom>
          プロキシ設定例
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gridGap: 1,
          }}
        >
          {[bashZshCmd, psCmd].map((cmd, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <Box key={index}>
              <Typography sx={{ fontSize: 14 }} color="textSecondary">
                {cmd.name}
              </Typography>
              <Paper
                sx={{
                  p: (theme) => theme.spacing(1),
                  background: (theme) => theme.palette.common.black,
                  color: (theme) => theme.palette.common.white,
                  WebkitUserSelect: "text",
                }}
                variant="outlined"
              >
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
