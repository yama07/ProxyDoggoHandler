import React from 'react';
import { Theme, makeStyles, createStyles } from '@material-ui/core/styles';
import {
    Toolbar,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@material-ui/core';
import TuneIcon from '@material-ui/icons/Tune';
import HistoryIcon from '@material-ui/icons/History';
import PetsIcon from '@material-ui/icons/Pets';

const contents = [
    { key: "general", text: "General", href: "/preferences/general", icon: <TuneIcon /> },
    { key: "proxies", text: "Proxies", href: "/preferences/proxies", icon: <PetsIcon /> },
    // { key: "log", text: "Log", href: "/preferences/log", icon: <HistoryIcon /> },
];

type Props = {
    onClick: (index: number) => void,
}

const drawerWidth = 25;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        drawer: {
            width: theme.spacing(drawerWidth),
            flexShrink: 0,
        },
        drawerPaper: {
            width: theme.spacing(drawerWidth),
        },
        drawerContainer: {
            overflow: 'auto',
        },
    })
);

const AppSideMenu: React.FC<Props> = ({ onClick }) => {
    const classes = useStyles({});
    return (
        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }} >
            <Toolbar />
            <div className={classes.drawerContainer}>
                <List>
                    {contents.map((content, index) => (
                        <ListItem button key={index} onClick={() => { onClick(index) }}>
                            <ListItemIcon>{content.icon}</ListItemIcon>
                            <ListItemText primary={content.text} />
                        </ListItem>
                    ))}
                </List>
            </div>
        </Drawer>
    );
};

export default AppSideMenu;
