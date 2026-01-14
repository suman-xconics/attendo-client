import Avvvatars from "avvvatars-react";

type UserAvatarProps = {
  name?: string | null;
  displayValue?: string | null;
  style?: "character" | "shape";
  size?: number;
  shadow?: boolean;
  radius?: number;
  border?: boolean;
  borderSize?: number;
  borderColor?: string;
};

export const UserAvatar = ({
  name,
  displayValue,
  style = "character",
  size = 40,
  shadow = false,
  radius,
  border = false,
  borderSize = 2,
  borderColor = "#e4e4e7",
}: UserAvatarProps) => (
  <Avvvatars
    border={border}
    borderColor={borderColor}
    borderSize={borderSize}
    displayValue={displayValue ?? undefined}
    radius={radius}
    shadow={shadow}
    size={size}
    style={style}
    value={name ?? "Anonymous"}
  />
);
