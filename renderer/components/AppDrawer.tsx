import {
  Drawer,
  Box,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { Tune, Pets, Traffic } from "@mui/icons-material";
import { useRouter } from "next/router";
import { useCallback } from "react";

const contents = [
  {
    key: "general",
    text: "General",
    href: "/preferences/general",
    icon: <Tune />,
  },
  {
    key: "proxy",
    text: "Proxy",
    href: "/preferences/proxy",
    icon: <Traffic />,
  },
  {
    key: "upstreams",
    text: "Upstreams",
    href: "/preferences/upstreams",
    icon: <Pets />,
  },
] as const;

const contentKeys = contents.map((v) => v.key);
export type MenuContentType = typeof contentKeys[number];

const AppDrawer: React.FC = () => {
  const router = useRouter();
  const onClickHandler = useCallback(
    (path: string) => router.pathname != path && router.replace(path),
    [router]
  );

  console.log(router.pathname);
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: (theme) => theme.spacing(24),
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: (theme) => theme.spacing(24),
          pt: (theme) => theme.spacing(8),
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ overflow: "auto" }}>
        <List>
          {contents.map((content, index) => (
            <ListItemButton
              key={content.key}
              onClick={() => onClickHandler(content.href)}
              selected={router.pathname == content.href}
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
