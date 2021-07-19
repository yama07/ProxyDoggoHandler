import React from "react";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";

import AppHeader from "../components/AppHeader";
import AppSideMenu from "../components/AppSideMenu";
import GeneralPreferencesContainer from "../components/GeneralPreferencesContainer";
import ProxiesPreferencesContainer from "../components/ProxiesPreferencesContainer";

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
        {selectedMenuIndex == 1 && <ProxiesPreferencesContainer />}
      </div>
    </React.Fragment>
  );
};

export default preferences;
