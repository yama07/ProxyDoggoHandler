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

import { type Profile, type ProfilesPreference, protocols } from "$/preference/profilePreference";

import DogBreadsIcon from "~/components/DogBreadsIcon";
import AddOrEditDialog from "~/components/profileSettingDialogs/AddOrEditDialog";
import DeleteDialog from "~/components/profileSettingDialogs/DeleteDialog";
import { profilesPrefContext, setProfilesPrefContext } from "~/contexts/ProfilesPrefContext";

const Profiles: React.FC = () => {
  const profilesPref = useContext(profilesPrefContext);
  const setProfilesPref = useContext(setProfilesPrefContext);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const updateProfilesPref = useCallback(
    (preference: ProfilesPreference) => setProfilesPref(preference),
    [setProfilesPref],
  );

  // 追加ダイアログのハンドリング
  const openAddDialog = () => setIsAddDialogOpen(true);
  const closeAddDialog = () => setIsAddDialogOpen(false);
  const addSetting = useCallback(
    (newSetting: Profile) => {
      const newSelectedIndex = profilesPref.selectedIndex;
      const newProfiles = profilesPref.profiles.concat(newSetting);

      updateProfilesPref({
        selectedIndex: newSelectedIndex,
        profiles: newProfiles,
      });
    },
    [updateProfilesPref, profilesPref],
  );

  // 編集ダイアログのハンドリング
  const openEditDialog = () => setIsEditDialogOpen(true);
  const closeEditDialog = () => setIsEditDialogOpen(false);
  const handleEditButton = (index: number) => {
    setSelectedIndex(index);
    openEditDialog();
  };
  const editSetting = useCallback(
    (index: number, newSetting: Profile) => {
      const newSelectedIndex = profilesPref.selectedIndex;
      const newProfiles = profilesPref.profiles.slice();
      newProfiles[index] = newSetting;

      updateProfilesPref({
        selectedIndex: newSelectedIndex,
        profiles: newProfiles,
      });
    },
    [updateProfilesPref, profilesPref],
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
      })(index, profilesPref.selectedIndex);
      const newProfiles = [
        ...profilesPref.profiles.slice(0, index),
        ...profilesPref.profiles.slice(index + 1),
      ];

      updateProfilesPref({
        selectedIndex: newIndex,
        profiles: newProfiles,
      });
    },
    [updateProfilesPref, profilesPref],
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
            <TableCell align="center">Protocol</TableCell>
            <TableCell align="center">Host</TableCell>
            <TableCell align="center">Port</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {profilesPref.profiles.map((profile, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <TableRow key={index}>
              <TableCell align="center">
                <DogBreadsIcon iconId={profile.icon} style="lineal" />
              </TableCell>
              <TableCell>
                <Typography noWrap>{profile.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography noWrap>
                  {protocols[profile.connectionSetting.protocol].label}
                </Typography>
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center">
                  <BadgeOutlinedIcon
                    fontSize="small"
                    sx={{
                      visibility:
                        profile.connectionSetting.protocol !== "direct" &&
                        profile.connectionSetting.credential !== undefined
                          ? "visible"
                          : "hidden",
                      mr: (theme) => theme.spacing(1),
                    }}
                  />
                  <Typography noWrap>
                    {profile.connectionSetting.protocol === "direct"
                      ? ""
                      : profile.connectionSetting.host ?? ""}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell align="right">
                <Typography noWrap>
                  {profile.connectionSetting.protocol === "direct"
                    ? ""
                    : profile.connectionSetting.port ?? ""}
                </Typography>
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
          oldProfile={profilesPref.profiles[selectedIndex]}
          onDismiss={() => {
            closeEditDialog();
          }}
          onConfirm={(newProfile: Profile) => {
            editSetting(selectedIndex, newProfile);
          }}
        />
      )}

      {isDeleteDialogOpen && (
        <DeleteDialog
          profile={profilesPref.profiles[selectedIndex]}
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

export default Profiles;
