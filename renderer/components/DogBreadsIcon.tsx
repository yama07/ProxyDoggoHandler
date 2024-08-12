import { Icon } from "@mui/material";

export const DogIconStyles = [
  "lineal",
  "lineal-w",
  "fill",
  "fill-w",
  "linealColor",
  "flatColor",
] as const;
export type DogIconStyleType = (typeof DogIconStyles)[number];

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const toDogIconStyleType = (value: any): DogIconStyleType | undefined =>
  DogIconStyles.find((style) => style === value);

export const DogIconIds = [...Array(50)].map((_, index) => `${`000${index + 1}`.slice(-3)}-dog`);

const getIconPath = (iconId: string, style: DogIconStyleType): string =>
  `/images/tray-icons/dog-breads/${style}/${iconId}@3x.png`;

type Props = {
  iconId: string;
  style: DogIconStyleType;
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
