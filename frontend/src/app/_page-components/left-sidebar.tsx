import { MouseEventHandler } from "react";
import { ButtonIcon } from "../_components/button";
import {
  FileTreeNavigator,
  IFileTreeNavigatorProps,
} from "../_components/file-tree-navigator";
import ResizeableSidebar from "../_components/resizeable-sidebar";

type LeftSideBarProps = {
  children: React.ReactNode;
  props: {
    hidden: boolean;
    collapseAllOnClick: MouseEventHandler;
    expandAllOnClick: MouseEventHandler;
  };
};

export default function LeftSidebar({ children, props }: LeftSideBarProps) {
  return (
    <ResizeableSidebar
      props={{ side: "left", hidden: props.hidden, defaultWidth: 300 }}
    >
      <div className="flex flex-col h-screen" data-name="container">
        <div className="min-h-[35px] max-h-[35px] bg-gray-800 p-2 rounded-md m-2 mb-0 flex flex-row gap-x-1 items-center justify-end">
          <ButtonIcon icon="expand" onClick={props.expandAllOnClick} />
          <ButtonIcon icon="collapse" onClick={props.collapseAllOnClick} />
        </div>
        {/* TODO: Investigate using `scroll-px-N` instead of using `border-N` to create some "padding" */}
        <div className="overflow-auto bg-gray-800 rounded-md border-8 border-gray-800 m-2 scroll-m-8">
          {children}
        </div>
      </div>
    </ResizeableSidebar>
  );
}
