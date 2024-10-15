import AddIcon from "@mui/icons-material/Add";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback, useContext, useState } from "react";

import DogBreadsIcon from "~/components/DogBreadsIcon";
import AddOrEditDialog from "~/components/upstreamSettingDialogs/AddOrEditDialog";
import DeleteDialog from "~/components/upstreamSettingDialogs/DeleteDialog";
import { setUpstreamsPrefContext, upstreamsPrefContext } from "~/contexts/UpstreamsPrefContext";

const Upstreams: React.FC = () => {
  const upstreamsPref = useContext(upstreamsPrefContext);
  const setUpstreamsPref = useContext(setUpstreamsPrefContext);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const updateUpstreamsPref = useCallback(
    (preference: UpstreamsPreferenceType) => setUpstreamsPref(preference),
    [setUpstreamsPref],
  );

  // 追加ダイアログのハンドリング
  const openAddDialog = () => setIsAddDialogOpen(true);
  const closeAddDialog = () => setIsAddDialogOpen(false);
  const addSetting = useCallback(
    (newSetting: UpstreamType) => {
      const newSelectedIndex = upstreamsPref.selectedIndex;
      const newUpstreams = upstreamsPref.upstreams.concat(newSetting);

      updateUpstreamsPref({
        selectedIndex: newSelectedIndex,
        upstreams: newUpstreams,
      });
    },
    [updateUpstreamsPref, upstreamsPref],
  );

  // 編集ダイアログのハンドリング
  const openEditDialog = () => setIsEditDialogOpen(true);
  const closeEditDialog = () => setIsEditDialogOpen(false);
  const handleEditButton = (index: number) => {
    setSelectedIndex(index);
    openEditDialog();
  };
  const editSetting = useCallback(
    (index: number, newSetting: UpstreamType) => {
      const newSelectedIndex = upstreamsPref.selectedIndex;
      const newUpstreams = upstreamsPref.upstreams.slice();
      newUpstreams[index] = newSetting;

      updateUpstreamsPref({
        selectedIndex: newSelectedIndex,
        upstreams: newUpstreams,
      });
    },
    [updateUpstreamsPref, upstreamsPref],
  );

  // 削除ダイアログのハンドリング
  const openDeleteDialog = () => setIsDeleteDialogOpen(true);
  const closeDeleteDialog = () => setIsDeleteDialogOpen(false);
  const handleDeleteButton = (index: number) => {
    setSelectedIndex(index);
    openDeleteDialog();
  };
  const deleteSetting = useCallback(
    (index: number) => {
      const newIndex: number = ((deletedIndex, selectedIndex) => {
        // 選択されている設定を消す場合は、0番目の設定に変更
        // それ以外の場合は、選択されている設定が変わらないようにする
        if (deletedIndex === selectedIndex) {
          return 0;
        }
        if (deletedIndex < selectedIndex) {
          return selectedIndex - 1;
        }
        return selectedIndex;
      })(index, upstreamsPref.selectedIndex);
      const newUpstreams = [
        ...upstreamsPref.upstreams.slice(0, index),
        ...upstreamsPref.upstreams.slice(index + 1),
      ];

      updateUpstreamsPref({
        selectedIndex: newIndex,
        upstreams: newUpstreams,
      });
    },
    [updateUpstreamsPref, upstreamsPref],
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Tooltip title="追加">
        <Button
          sx={{ textTransform: "none", float: "right" }}
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
            <TableCell> {/* icon */} </TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Host</TableCell>
            <TableCell align="center">Port</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {upstreamsPref.upstreams.map((upstream, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <TableRow key={index}>
              <TableCell align="center">
                <DogBreadsIcon iconId={upstream.icon} style="lineal" />
              </TableCell>
              <TableCell>
                <Typography noWrap>{upstream.name}</Typography>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <BadgeOutlinedIcon
                    fontSize="small"
                    sx={{
                      visibility: upstream.connectionSetting?.credentials ? "visible" : "hidden",
                      mr: (theme) => theme.spacing(1),
                    }}
                  />
                  <Typography noWrap>{upstream.connectionSetting?.host ?? ""}</Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Typography noWrap>{upstream.connectionSetting?.port ?? ""}</Typography>
              </TableCell>
              <TableCell>
                <Tooltip title="編集">
                  <EditIcon
                    color="primary"
                    onClick={() => {
                      handleEditButton(index);
                    }}
                  />
                </Tooltip>
              </TableCell>

              {0 < index && (
                <TableCell>
                  <Tooltip title="削除">
                    <DeleteIcon
                      color="primary"
                      onClick={() => {
                        handleDeleteButton(index);
                      }}
                    />
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isAddDialogOpen && <AddOrEditDialog onDismiss={closeAddDialog} onConfirm={addSetting} />}

      {isEditDialogOpen && (
        <AddOrEditDialog
          oldUpstream={upstreamsPref.upstreams[selectedIndex]}
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
          upstream={upstreamsPref.upstreams[selectedIndex]}
          onDismiss={() => {
            closeDeleteDialog();
          }}
          onConfirm={() => {
            deleteSetting(selectedIndex);
          }}
        />
      )}
    </Box>
  );
};

export default Upstreams;
