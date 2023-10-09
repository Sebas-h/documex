import { MouseEventHandler, ReactElement } from "react";

// See:
// https://blog.logrocket.com/building-reusable-react-components-using-tailwind-css/
// https://blog.logrocket.com/how-to-build-component-library-react-typescript/
// https://dev.to/huferr/reusable-button-with-reactjs-typescript-styled-components-4gj7

type IconType =
  | "collapse"
  | "expand"
  | "sidebar-toggle"
  | "moon"
  | "sun"
  | "circle-half-stroke"
  | "folder-tree"
  | "arrow-up";

export interface ButtonIconProps {
  // text?: string;
  // primary?: boolean;
  // disabled?: boolean;
  // size?: "small" | "medium" | "large";
  icon: IconType;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

// Src: https://fontawesome.com/search?q=expand&o=r&m=free
const CollapseIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    className="w-4 h-4"
    fill="currentColor"
    stroke="currentColor"
  >
    <path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM152 232H296c13.3 0 24 10.7 24 24s-10.7 24-24 24H152c-13.3 0-24-10.7-24-24s10.7-24 24-24z" />
  </svg>
);

// Src: https://fontawesome.com/icons/square-plus?f=classic&s=regular
const ExpandIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    className="w-4 h-4"
    fill="currentColor"
    stroke="currentColor"
  >
    <path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM200 344V280H136c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
  </svg>
);

// Src: https://fontawesome.com/icons/bars?f=classic&s=solid
const SideBarToggleIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    className="w-4 h-4"
    fill="currentColor"
    stroke="currentColor"
  >
    <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
  </svg>
);

// Src: https://fontawesome.com/icons/moon?f=classic&s=solid
const MoonIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    className="w-4 h-4"
    fill="currentColor"
    stroke="currentColor"
  >
    <path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
  </svg>
);

// Src: https://fontawesome.com/icons/sun?f=classic&s=solid
const SunIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className="w-4 h-4"
    fill="currentColor"
    stroke="currentColor"
  >
    <path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM160 256a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zm224 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0z" />
  </svg>
);

// Src: https://fontawesome.com/icons/circle-half-stroke?f=classic&s=solid
const CircleHalfStrokeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className="w-4 h-4"
    fill="currentColor"
    stroke="currentColor"
  >
    <path d="M448 256c0-106-86-192-192-192V448c106 0 192-86 192-192zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256z" />
  </svg>
);

// Src: https://fontawesome.com/icons/arrow-up?f=classic&s=solid
const ArrowUpIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    className="w-4 h-4"
    fill="currentColor"
    stroke="currentColor"
  >
    <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
  </svg>
);

// Src: https://fontawesome.com/icons/folder-tree?f=classic&s=solid
const FolderTreeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 576 512"
    className="w-4 h-4"
    fill="currentColor"
    stroke="currentColor"
  >
    <path d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32v96V384c0 35.3 28.7 64 64 64H256V384H64V160H256V96H64V32zM288 192c0 17.7 14.3 32 32 32H544c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H445.3c-8.5 0-16.6-3.4-22.6-9.4L409.4 9.4c-6-6-14.1-9.4-22.6-9.4H320c-17.7 0-32 14.3-32 32V192zm0 288c0 17.7 14.3 32 32 32H544c17.7 0 32-14.3 32-32V352c0-17.7-14.3-32-32-32H445.3c-8.5 0-16.6-3.4-22.6-9.4l-13.3-13.3c-6-6-14.1-9.4-22.6-9.4H320c-17.7 0-32 14.3-32 32V480z" />
  </svg>
);

const getIcon = (icon: IconType): ReactElement => {
  switch (icon) {
    case "collapse":
      return CollapseIcon;
    case "expand":
      return ExpandIcon;
    case "sidebar-toggle":
      return SideBarToggleIcon;
    case "moon":
      return MoonIcon;
    case "sun":
      return SunIcon;
    case "circle-half-stroke":
      return CircleHalfStrokeIcon;
    case "arrow-up":
      return ArrowUpIcon;
    case "folder-tree":
      return FolderTreeIcon;
  }
};

export function ButtonIcon(props: ButtonIconProps) {
  // See: https://flowbite.com/docs/components/buttons
  return (
    <button
      type="button"
      className={`${"p-1"} text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 z-50`}
      onClick={props.onClick}
    >
      {getIcon(props.icon)}
    </button>
  );
}
