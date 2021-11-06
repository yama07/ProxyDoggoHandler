import React from "react";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import { Icon } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    imageIcon: {
      display: "flex",
      height: "inherit",
      width: "inherit",
    },
    iconRoot: {
      textAlign: "center",
    },
  });
});

type Props = {
  iconId: string;
};

export const DogIconIds = [...Array(50)].map(
  (_, index) => ("000" + (index + 1)).slice(-3) + "-dog"
);

const DogBreadsIcon: React.FC<Props> = ({ iconId }) => {
  const classes = useStyles({});
  return (
    <Icon className={classes.iconRoot}>
      <img
        className={classes.imageIcon}
        src={`/images/dog-breeds/${iconId}.svg`}
        alt={iconId}
        draggable={false}
      />
    </Icon>
  );
};

export default DogBreadsIcon;
