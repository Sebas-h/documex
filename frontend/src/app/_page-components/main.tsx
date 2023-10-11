import { Fragment, MouseEventHandler, MutableRefObject } from "react";
import { ButtonIcon } from "../_components/button";
import { FileTreeNodeFile } from "../_components/file-tree-navigator";

type MainProps = {
  props: {
    mdRef: MutableRefObject<HTMLDivElement | null>;
    selectedFile: FileTreeNodeFile | null;
    leftSideBarToggleOnClick: MouseEventHandler;
    rightSideBarToggleOnClick: MouseEventHandler;
    mainContent: JSX.Element;
    // Reveal file in FileTreeNavigator
    revealFileOnClick: MouseEventHandler;
  };
};

export default function Main({ props }: MainProps) {
  return (
    <div
      ref={props.mdRef}
      className="relative grow-1 overflow-auto bg-gray-800 rounded-md m-2 p-6"
    >
      {props.mainContent.type !== Fragment && (
        <>
          <div className="sticky top-0 float-right z-50">
            <ButtonIcon
              icon="arrow-up"
              onClick={() => props.mdRef?.current?.scrollTo({ top: 0 })}
            />
          </div>
          <div className="markdown-body prose dark:prose-invert max-w-none">
            {props.mainContent}
          </div>
        </>
      )}
    </div>
  );
}
