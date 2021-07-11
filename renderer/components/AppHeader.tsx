import React from 'react';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import {
    AppBar,
    Toolbar,
    Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        title: {
            flexGrow: 1,
            textAlign: "center",
        },

        appBar: {
            zIndex: theme.zIndex.drawer + 1,
            WebkitAppRegion: "drag",
        },
    })
);

const AppHeader: React.FC = () => {
    const classes = useStyles({});
    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <Typography variant="h6" align="center" className={classes.title} >
                    Proxy Doggo Switcher
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default AppHeader;
