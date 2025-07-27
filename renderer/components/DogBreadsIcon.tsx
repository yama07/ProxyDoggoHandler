import { Icon } from "@mui/material";

import type { DogIconId } from "$/icon/dogIcon";
import type { IconStyleId } from "$/icon/iconStyle";

const getIconPath = (iconId: DogIconId, style: IconStyleId): string =>
  `/images/tray-icons/dog-breads/${style}/${iconId}@3x.png`;

type Props = {
  iconId: DogIconId;
  style: IconStyleId;
};

const DogBreadsIcon: React.FC<Props> = ({ iconId, style }) => {
  const path = getIconPath(iconId, style);

  return (
    <Icon sx={{ display: "flex" }}>
      <img src={path} alt={iconId} draggable={false} height="inherit" width="inherit" />
    </Icon>
  );
};

export default DogBreadsIcon;
