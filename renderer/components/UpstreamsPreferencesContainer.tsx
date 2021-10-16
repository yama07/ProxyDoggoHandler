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
  Tooltip,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import DogBreadsIcon from "./DogBreadsIcon";
import DeleteDialog from "./upstreamSettingDialogs/DeleteDialog";
import AddOrEditDialog from "./upstreamSettingDialogs/AddOrEditDialog";

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

const UpstreamsPreferencesContainer: React.FC = () => {
  const [upstreams, setUpstreams] = React.useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    if (0 < upstreams.length) {
      window.store.setUpstreamsPreference({
        selectedIndex: 0,
        upstreams: upstreams,
      });
      window.app.updateTray();
    }
  }, [upstreams]);

  React.useEffect(() => {
    const getUpstreamsPreferencePromise = window.store.getUpstreamsPreference();
    getUpstreamsPreferencePromise.then(
      (upstreamsPreference: UpstreamsPreferenceType) => {
        setUpstreams(upstreamsPreference.upstreams);
      }
    );
  }, []);

  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };
  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
  };
  const addSetting = React.useCallback(
    (newSetting: UpstreamType) => {
      setUpstreams(upstreams.concat(newSetting));
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

      <Tooltip title="追加">
        <Button
          className={classes.button}
          variant="text"
          color="primary"
          onClick={() => {
            openAddDialog();
          }}
        >
          <AddIcon />
        </Button>
      </Tooltip>
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
                  <Tooltip title="編集">
                    <EditIcon
                      onClick={() => {
                        handleEdit(index);
                      }}
                    />
                  </Tooltip>
                </TableCell>
              )}
              {0 < index && (
                <TableCell>
                  <Tooltip title="削除">
                    <DeleteIcon
                      onClick={() => {
                        handleDelete(index);
                      }}
                    />
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isAddDialogOpen && (
        <AddOrEditDialog onDismiss={closeAddDialog} onConfirm={addSetting} />
      )}

      {isEditDialogOpen && (
        <AddOrEditDialog
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
        <DeleteDialog
          upstream={upstreams[selectedIndex]}
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

export default UpstreamsPreferencesContainer;
