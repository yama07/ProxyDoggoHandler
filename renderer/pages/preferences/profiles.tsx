import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Tooltip } from "@mui/material";
import { useCallback, useContext, useState } from "react";

import type { Profile, ProfilesPreference } from "$/preference/profilePreference";

import ProfileTable from "~/components/ProfileTable";
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
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      <Tooltip title="追加">
        <Button
          sx={{ textTransform: "none", margin: "0 0 0 auto" }}
          variant="text"
          color="primary"
          onClick={() => {
            openAddDialog();
          }}
        >
          <AddIcon />
        </Button>
      </Tooltip>

      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          width: "100%",
        }}
      >
        <ProfileTable
          profiles={profilesPref.profiles}
          onEditButtonClick={handleEditButton}
          onDeleteClick={handleDeleteButton}
        />
      </Box>

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
