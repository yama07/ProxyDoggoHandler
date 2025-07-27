import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import { type Profile, protocols } from "$/preference/profilePreference";

import DogBreadsIcon from "./DogBreadsIcon";

type Props = {
  profiles: Profile[];
  onEditButtonClick: (index: number) => void;
  onDeleteClick: (ndex: number) => void;
};

const ProfileTable: React.FC<Props> = ({ profiles, onEditButtonClick, onDeleteClick }) => {
  return (
    <TableContainer>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell> {/* icon */} </TableCell>
            <TableCell align="center">Name</TableCell>
            <TableCell align="center">Protocol</TableCell>
            <TableCell align="center">Host</TableCell>
            <TableCell align="center">Port</TableCell>
            <TableCell> {/* edit */} </TableCell>
            <TableCell> {/* delete */} </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {profiles.map((profile, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: profiles are disposable, so index is fine.
            <TableRow key={index}>
              <TableCell align="center">
                <DogBreadsIcon iconId={profile.icon} style="lineal" />
              </TableCell>

              <TableCell sx={{ width: "30%", maxWidth: 0 }}>
                <Typography noWrap>{profile.name}</Typography>
              </TableCell>

              <TableCell>
                <Typography noWrap>
                  {protocols[profile.connectionSetting.protocol].label}
                </Typography>
              </TableCell>

              <TableCell sx={{ width: "50%", maxWidth: 0 }}>
                <Box display="flex" alignItems="center" width="100%">
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
                      : (profile.connectionSetting.host ?? "")}
                  </Typography>
                </Box>
              </TableCell>

              <TableCell align="right">
                <Typography noWrap>
                  {profile.connectionSetting.protocol === "direct"
                    ? ""
                    : (profile.connectionSetting.port ?? "")}
                </Typography>
              </TableCell>

              <TableCell>
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => {
                    onEditButtonClick(index);
                  }}
                >
                  <Tooltip title="編集">
                    <EditIcon />
                  </Tooltip>
                </IconButton>
              </TableCell>

              <TableCell>
                <IconButton
                  size="small"
                  color="error"
                  disabled={0 === index}
                  onClick={() => {
                    onDeleteClick(index);
                  }}
                >
                  <Tooltip title="削除">
                    <DeleteIcon />
                  </Tooltip>
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProfileTable;
