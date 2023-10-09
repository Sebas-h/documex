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
  /**
   * Remove the bullet point `::marker` for `<li><input type="checkbox" />`
   * elements and removes left-padding for the `<ul>` elements which direct
   * children are these elements.
   * This should create parity with GitHub's task/todo list style
   * NOTE: ideally this would be done purely in CSS or completely in the backend
   * but CSS `:has()` is not widely supported yet and no sure how to set the
   * style on elements in the backend
   */
  // useEffect(() => {
  //   // 1. Adjust the list style for <li> elements with checkbox children
  //   props.mdRef?.current?.querySelectorAll("li").forEach((li) => {
  //     if (li.querySelector(':scope > input[type="checkbox"]')) {
  //       li.style.listStyleType = "none";
  //     }
  //   });
  //   // 2. Adjust padding for <ul> elements based on the specified condition
  //   props.mdRef?.current?.querySelectorAll("ul").forEach((ul) => {
  //     // Check if every direct <li> child has a direct <input type="checkbox"> child
  //     const allLiHaveCheckbox = Array.from(ul.children).every((child) => {
  //       return (
  //         child.tagName === "LI" &&
  //         child.querySelector(':scope > input[type="checkbox"]')
  //       );
  //     });
  //     if (allLiHaveCheckbox) {
  //       ul.style.paddingLeft = "0";
  //     }
  //   });
  // }, [props.mainContent, props.mdRef]);

  return (
    <div
      ref={props.mdRef}
      className="relative grow-1 overflow-auto bg-gray-800 rounded-md m-2 p-6"
    >
      {props.mainContent.type !== Fragment && (
        <>
          <div className="sticky top-0 float-right">
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
