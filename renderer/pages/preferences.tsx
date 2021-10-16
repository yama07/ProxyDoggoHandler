import React from "react";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";

import AppHeader from "../components/AppHeader";
import AppSideMenu, { MenuContentType } from "../components/AppSideMenu";
import ProxyPreferencesContainer from "../components/ProxyPreferencesContainer";
import UpstreamsPreferencesContainer from "../components/UpstreamsPreferencesContainer";
import GeneralPreferencesContainer from "../components/GeneralPreferencesContainer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      WebkitUserSelect: "none",
    },
  })
);

const preferences = function () {
  const classes = useStyles({});
  const [selectedMenuContent, setSelectedMenuContent] =
    React.useState<MenuContentType>("general");
  const onSideMenuSelect = React.useCallback((content: MenuContentType) => {
    setSelectedMenuContent(content);
  }, []);

  return (
    <React.Fragment>
      <div className={classes.root}>
        <AppHeader />

        <AppSideMenu onClick={onSideMenuSelect} />

        {selectedMenuContent == "general" && <GeneralPreferencesContainer />}
        {selectedMenuContent == "proxy" && <ProxyPreferencesContainer />}
        {selectedMenuContent == "upstreams" && (
          <UpstreamsPreferencesContainer />
        )}
      </div>
    </React.Fragment>
  );
};

export default preferences;
