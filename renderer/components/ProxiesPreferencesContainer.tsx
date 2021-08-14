import React from "react";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Button,
  Toolbar,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import DogBreadsIcon from "./DogBreadsIcon";
import AddProxyDialog from "./AddProxyDialog";
import DeleteProxyDialog from "./DeleteProxyDialog";
import EditProxyDialog from "./EditProxyDialog";

const useStyles = makeStyles((theme: Theme) => {
  const baseMargin = 6;
  return createStyles({
    content: {
      flexGrow: 1,
      padding: theme.spacing(baseMargin),
      position: "relative",
      height: "100vh",
    },
    button: {
      textTransform: "none",
      float: "right",
    },
  });
});

const ProxiesPreferencesContainer: React.FC = () => {
  const [upstreams, setUpstreams] = React.useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (0 < upstreams.length) {
      window.store.setProxiesPreference({
        selectedIndex: 0,
        upstreams: upstreams,
      });
      window.app.updateTray();
    }
  }, [upstreams]);

  React.useEffect(() => {
    const getProxiesPreferencePromise = window.store.getProxiesPreference();
    getProxiesPreferencePromise.then((proxiesPreference) => {
      setUpstreams(proxiesPreference["upstreams"]);
    });
  }, []);

  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };
  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
  };
  const addSetting = React.useCallback(
    (
      icon: string,
      name: string,
      host: string,
      port: number,
      credentials?: { user: string; password: string }
    ) => {
      const upstream = {
        name: name,
        icon: icon,
        connectionSetting: {
          host: host,
          port: port,
          credentials: credentials,
        },
      };
      setUpstreams(upstreams.concat(upstream));
    },
    [upstreams]
  );

  const openEditDialog = () => {
    setIsEditDialogOpen(true);
  };
  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
  };
  const handleEdit = React.useCallback((index: number) => {
    setSelectedIndex(index);
    openEditDialog();
  }, []);
  const editSetting = React.useCallback(
    (index: number, newSetting) => {
      const newUpstreams = upstreams.slice();
      newUpstreams[index] = newSetting;
      setUpstreams(newUpstreams);
    },
    [upstreams, selectedIndex]
  );

  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };
  const handleDelete = React.useCallback((index: number) => {
    setSelectedIndex(index);
    openDeleteDialog();
  }, []);
  const deleteSetting = React.useCallback(
    (index: number) => {
      setUpstreams([
        ...upstreams.slice(0, index),
        ...upstreams.slice(index + 1),
      ]);
    },
    [upstreams, selectedIndex]
  );

  const classes = useStyles({});
  return (
    <main className={classes.content}>
      <Toolbar />

      <Button
        className={classes.button}
        variant="text"
        color="primary"
        onClick={() => {
          openAddDialog();
        }}
      >
        <AddIcon />
        Add
      </Button>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Host</TableCell>
            <TableCell align="center">Authentication</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {upstreams.map((upstream, index) => (
            <TableRow key={index}>
              <TableCell align="center">
                <DogBreadsIcon iconId={upstream.icon} />
              </TableCell>
              <TableCell>{upstream.name}</TableCell>
              <TableCell>{upstream.connectionSetting?.host ?? ""}</TableCell>
              <TableCell align="center">
                {upstream.connectionSetting?.credentials != null ? "Yes" : ""}
              </TableCell>
              {0 < index && (
                <TableCell>
                  <EditIcon
                    onClick={() => {
                      handleEdit(index);
                    }}
                  />
                </TableCell>
              )}
              {0 < index && (
                <TableCell>
                  <DeleteIcon
                    onClick={() => {
                      handleDelete(index);
                    }}
                  />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isAddDialogOpen && (
        <AddProxyDialog onDismiss={closeAddDialog} onConfirm={addSetting} />
      )}

      {isEditDialogOpen && (
        <EditProxyDialog
          oldUpstream={upstreams[selectedIndex]}
          onDismiss={() => {
            closeEditDialog();
          }}
          onConfirm={(newUpstream: UpstreamType) => {
            editSetting(selectedIndex, newUpstream);
          }}
        />
      )}

      {isDeleteDialogOpen && (
        <DeleteProxyDialog
          name={upstreams[selectedIndex]?.name}
          onDismiss={() => {
            closeDeleteDialog();
          }}
          onConfirm={() => {
            deleteSetting(selectedIndex);
          }}
        />
      )}
    </main>
  );
};

export default ProxiesPreferencesContainer;
