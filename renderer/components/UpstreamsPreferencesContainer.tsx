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
  const [upstreams, setUpstreams] = React.useState<UpstreamType[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // 初回レンダリング時に、設定情報を画面に反映する
  React.useEffect(() => {
    (async () => {
      const upstreamsPreference = await window.store.getUpstreamsPreference();
      setUpstreams(upstreamsPreference.upstreams);
    })();
  }, []);

  const updateUpstreamsPreference = (preference: UpstreamsPreferenceType) => {
    window.store.setUpstreamsPreference(preference);
    setUpstreams(preference.upstreams);
  };

  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };
  const closeAddDialog = () => {
    setIsAddDialogOpen(false);
  };
  const addSetting = React.useCallback(
    async (newSetting: UpstreamType) => {
      const currentPreference = await window.store.getUpstreamsPreference();
      const newSelectedIndex = currentPreference.selectedIndex;
      const newUpstreams = upstreams.concat(newSetting);

      updateUpstreamsPreference({
        selectedIndex: newSelectedIndex,
        upstreams: newUpstreams,
      });
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
    async (index: number, newSetting) => {
      const currentPreference = await window.store.getUpstreamsPreference();
      const newSelectedIndex = currentPreference.selectedIndex;
      const newUpstreams = upstreams.slice();
      newUpstreams[index] = newSetting;

      updateUpstreamsPreference({
        selectedIndex: newSelectedIndex,
        upstreams: newUpstreams,
      });
    },
    [upstreams]
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
    async (index: number) => {
      const currentPreference = await window.store.getUpstreamsPreference();
      const newIndex: number = ((deletedIndex, selectedIndex) => {
        // 選択されている設定を消す場合は、0番目の設定に変更
        // それ以外の場合は、選択されている設定が変わらないようにする
        if (deletedIndex == selectedIndex) {
          return 0;
        } else if (deletedIndex < selectedIndex) {
          return selectedIndex - 1;
        } else {
          return selectedIndex;
        }
      })(index, currentPreference.selectedIndex);
      const newUpstreams = [
        ...upstreams.slice(0, index),
        ...upstreams.slice(index + 1),
      ];

      updateUpstreamsPreference({
        selectedIndex: newIndex,
        upstreams: newUpstreams,
      });
    },
    [upstreams]
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
                <DogBreadsIcon iconId={upstream.icon} style="lineal" />
              </TableCell>
              <TableCell>{upstream.name}</TableCell>
              <TableCell>{upstream.connectionSetting?.host ?? ""}</TableCell>
              <TableCell align="center">
                {upstream.connectionSetting?.credentials != null ? "Yes" : ""}
              </TableCell>

              <TableCell>
                <Tooltip title="編集">
                  <EditIcon
                    onClick={() => {
                      handleEdit(index);
                    }}
                  />
                </Tooltip>
              </TableCell>

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
