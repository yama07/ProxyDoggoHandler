import { SvgIcon, type SvgIconProps } from "@mui/material";

export const MinimizeIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <line y1="12" x2="24" y2="12" strokeWidth="2" stroke="white" />,
  </SvgIcon>
);

export const MaximizeIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <rect x="1" y="1" width="22" height="22" strokeWidth="2" fill="none" stroke="white" />
  </SvgIcon>
);

export const RestoreIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 2H22V18H20V20H22H24V18V2V0H22H6H4V2V4H6V2Z"
      fill="white"
    />
    <rect x="1" y="5" width="18" height="18" strokeWidth="2" fill="none" stroke="white" />
  </SvgIcon>
);

export const CloseIcon = (props: SvgIconProps) => (
  <SvgIcon {...props}>
    <g clipPath="url(#clip0_27_41)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.0711 20.4853L19.7782 21.1924L21.1924 19.7782L20.4853 19.0711L13.4142 12L20.4853 4.92893L21.1924 4.22183L19.7782 2.80761L19.0711 3.51472L12 10.5858L4.92893 3.51472L4.22182 2.80761L2.80761 4.22183L3.51472 4.92893L10.5858 12L3.51472 19.0711L2.80761 19.7782L4.22182 21.1924L4.92893 20.4853L12 13.4142L19.0711 20.4853Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_27_41">
        <rect width="24" height="24" fill="none" />
      </clipPath>
    </defs>
  </SvgIcon>
);
