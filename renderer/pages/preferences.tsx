import React from "react";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";

import AppHeader from "../components/AppHeader";
import AppSideMenu from "../components/AppSideMenu";
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
  const [selectedMenuIndex, setSelectedMenuIndex] = React.useState(0);
  const onSideMenuSelect = React.useCallback((index: number) => {
    setSelectedMenuIndex(index);
  }, []);

  return (
    <React.Fragment>
      <div className={classes.root}>
        <AppHeader />

        <AppSideMenu onClick={onSideMenuSelect} />

        {selectedMenuIndex == 0 && <GeneralPreferencesContainer />}
        {selectedMenuIndex == 1 && <ProxyPreferencesContainer />}
        {selectedMenuIndex == 2 && <UpstreamsPreferencesContainer />}
      </div>
    </React.Fragment>
  );
};

export default preferences;
