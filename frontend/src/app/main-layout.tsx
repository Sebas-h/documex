"use client";

import { useEffect, useRef, useState } from "react";
import {
  FileTree,
  FileTreeNavigator,
  FileTreeNodeDir,
  FileTreeNodeFile,
} from "./_components/file-tree-navigator";
import {
  OnPageNavigation,
  OnPageNavigator,
} from "./_components/on-page-navigator";
import {
  useStateStore as useStateStore,
  useStateStoreDispatch as useStateStoreDispatch,
} from "./_context/state-store-context";
import LeftSidebar from "./_page-components/left-sidebar";
import RightSidebar from "./_page-components/right-sidebar";
import {
  buildPaths,
  extractDirectoryIds,
  getFileByPathname,
  getFilePathDirParts,
} from "./_helpers/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ButtonIcon } from "./_components/button";
import Link from "next/link";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function MainLayoutV2({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedFile, setSelectedFile] = useState<FileTreeNodeFile | null>(
    null
  );
  // TODO: Think about inverting this, i.e. only nodes in this list are shown
  // In that case an empty list will mean the directory tree is fully collapsed
  const [nodesToHide, setNodesToHide] = useState<string[]>([]);
  const [leftSidebarHidden, setLeftSidebarHidden] = useState<boolean>(false);
  const [rightSidebarHidden, setRightSidebarHidden] = useState<boolean>(false);
  const [filetree, setFiletree] = useState<FileTree>();
  // const [markdownContent, setMarkdownContent] = useState<string>();
  const [onPageNav, setOnPageNav] = useState<OnPageNavigation[]>();
  const mdRef = useRef<HTMLDivElement | null>(null);

  const pathname = usePathname();

  const dispatch = useStateStoreDispatch();
  const state = useStateStore();

  useEffect(() => {
    const dataFetch = async () => {
      // TODO: Validate the reponse
      const data = (await (await fetch("/list")).json()) as FileTree;
      setNodesToHide(extractDirectoryIds(data));
      setFiletree(data);
    };
    dataFetch();
  }, []);

  const handleLeftSideBarToggleOnClick = () =>
    setLeftSidebarHidden(!leftSidebarHidden);

  const handleRightSideBarToggleOnClick = () =>
    setRightSidebarHidden(!rightSidebarHidden);

  const handleRevealFileOnClick = async () => {
    if (!filetree) return;
    const file = getFileByPathname(filetree, pathname.slice(1));
    console.log(file);
    if (!file) return;
    const subPaths = buildPaths(getFilePathDirParts(file));
    setNodesToHide(nodesToHide.filter((n) => !subPaths.includes(n)));
    // TODO: quite ugly to put in a sleep here
    //  Can we somehow trigger the `.scrollIntoView` after the
    //  re-render that `setNodesToHide` triggers has finished?
    await sleep(10);
    document
      .querySelector(`[data-id="${file.id}"]`)
      ?.scrollIntoView({ block: "center" });
  };

  useEffect(() => {
    setOnPageNav(state.selectedFileHeaders);
  }, [state.selectedFileHeaders]);

  return (
    <div
      id="container"
      className="flex h-full content-stretch justify-start items-stretch overflow-hidden"
    >
      <LeftSidebar
        props={{
          hidden: leftSidebarHidden,
          collapseAllOnClick: () =>
            filetree && setNodesToHide(extractDirectoryIds(filetree)),
          expandAllOnClick: () => setNodesToHide([]),
        }}
      >
        <FileTreeNavigator
          props={{
            data: filetree ? filetree : [],
            selectedFile: selectedFile,
            nodesToHide,
            setNodesToHide,
            handleFileClick: (file: FileTreeNodeFile) => () => {
              setSelectedFile(file);
              dispatch({
                type: "setSelected",
                data: file,
              });
            },
            handleDirClick: (dir: FileTreeNodeDir) => () => {
              if (nodesToHide.includes(dir.id))
                return setNodesToHide(
                  nodesToHide.filter((nodeId) => nodeId != dir.id)
                );
              return setNodesToHide([...nodesToHide, dir.id]);
            },
            pathname,
          }}
        />
      </LeftSidebar>

      <main id="main" className="flex-auto overflow-auto">
        <div className="flex flex-col h-screen" data-name="container">
          <div className="min-h-[35px] max-h-[35px] bg-gray-800 p-2 rounded-md m-2 mb-0 flex flex-row gap-x-1 items-center justify-between overflow-hidden">
            <ButtonIcon
              icon="sidebar-toggle"
              onClick={handleLeftSideBarToggleOnClick}
            />
            <div className="flex flex-row gap-2">
              {pathname && pathname !== "/" && (
                <>
                  <ButtonIcon
                    icon="folder-tree"
                    onClick={handleRevealFileOnClick}
                  />
                  <span className="truncate">{decodeURI(pathname)}</span>
                </>
              )}
            </div>
            <div className="flex flex-row gap-1">
              <ButtonIcon
                icon="github"
                href="https://github.com/sebas-h/documex"
              />
              <ButtonIcon icon="circle-half-stroke" />
              <ButtonIcon
                icon="sidebar-toggle"
                onClick={handleRightSideBarToggleOnClick}
              />
            </div>
          </div>
          {children}
        </div>
      </main>

      <RightSidebar props={{ hidden: rightSidebarHidden }}>
        {onPageNav && (
          <OnPageNavigator props={{ pageHeadings: onPageNav, mdRef }} />
        )}
      </RightSidebar>
    </div>
  );
}
