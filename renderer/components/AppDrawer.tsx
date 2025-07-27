import { Pets, Traffic, Tune } from "@mui/icons-material";
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback } from "react";

const contents = [
  {
    key: "profiles",
    text: "Profiles",
    href: "/preferences/profiles",
    icon: <Pets />,
  },
  {
    key: "proxy-server",
    text: "Proxy",
    href: "/preferences/proxy-server",
    icon: <Traffic />,
  },
  {
    key: "appearance",
    text: "Appearance",
    href: "/preferences/appearance",
    icon: <Tune />,
  },
] as const;

const contentKeys = contents.map((v) => v.key);
export type MenuContentType = (typeof contentKeys)[number];

const AppDrawer: React.FC = () => {
  const router = useRouter();
  const onClickHandler = useCallback(
    (path: string) => router.pathname !== path && router.replace(path),
    [router],
  );

  console.log(router.pathname);
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: (theme) => theme.spacing(24),
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: (theme) => theme.spacing(24),
          pt: (theme) => theme.spacing(8),
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ overflow: "auto" }}>
        <List>
          {contents.map((content) => (
            <ListItemButton
              key={content.key}
              onClick={() => onClickHandler(content.href)}
              selected={router.pathname === content.href}
            >
              <ListItemIcon>{content.icon}</ListItemIcon>
              <ListItemText primary={content.text} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default AppDrawer;
