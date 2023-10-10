"use client";

import { useEffect, useRef, useState } from "react";
import { FileTreeNodeFile } from "../_components/file-tree-navigator";
import { OnPageNavigation } from "../_components/on-page-navigator";
import { useStateStoreDispatch } from "../_context/state-store-context";
import Main from "../_page-components/main";
import { buildPaths, getFilePathDirParts } from "../_helpers/utils";
import { usePathname } from "next/navigation";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

export default function Page() {
  const pathname = usePathname();
  const [selectedFile, setSelectedFile] = useState<FileTreeNodeFile | null>(
    null
  );
  // TODO: Think about inverting this, i.e. only nodes in this list are shown
  // In that case an empty list will mean the directory tree is fully collapsed
  const [nodesToHide, setNodesToHide] = useState<string[]>([]);
  const [leftSidebarHidden, setLeftSidebarHidden] = useState<boolean>(false);
  const [rightSidebarHidden, setRightSidebarHidden] = useState<boolean>(false);
  const mdRef = useRef<HTMLDivElement | null>(null);

  const [content, setContent] = useState<string>("");

  const dispatch = useStateStoreDispatch();

  useEffect(() => {
    const dataFetch = async (filename: string) => {
      const response = await fetch("/file", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename }),
      });
      // TODO: Validate the reponse
      const data = (await response.json()) as {
        html: string;
        headers: OnPageNavigation[];
      };
      setContent(data.html);
      dispatch({ type: "setSelectedFileHeaders", data: data.headers });
    };
    const pname = pathname.slice(1);
    if (!pname) return;
    dataFetch(pname);
  }, [setContent, pathname]);

  useEffect(() => {
    const copyButtons = document.querySelectorAll("button.copy-btn");
    copyButtons.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const code = btn.parentElement?.querySelector("code")?.innerText;
        if (!code) return;
        await navigator.clipboard.writeText(code);
        if (btn.classList.contains("copy-effect")) {
          btn.classList.remove("copy-effect");
          await sleep(10);
        }
        btn.classList.add("copy-effect");
      });
    });
  }, [content]);

  return (
    <Main
      props={{
        mdRef,
        selectedFile,
        leftSideBarToggleOnClick: () =>
          setLeftSidebarHidden(!leftSidebarHidden),
        rightSideBarToggleOnClick: () =>
          setRightSidebarHidden(!rightSidebarHidden),
        mainContent: content ? (
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        ) : !pathname || pathname == "/" ? (
          <div>No file selected</div>
        ) : (
          <div>404 - File Not Found</div>
        ),
        revealFileOnClick: async () => {
          if (!selectedFile) return;
          const subPaths = buildPaths(getFilePathDirParts(selectedFile));
          setNodesToHide(nodesToHide.filter((n) => !subPaths.includes(n)));
          // TODO: quite ugly to put in a sleep here
          //  Can we somehow trigger the `.scrollIntoView` after the
          //  re-render that `setNodesToHide` triggers has finished?
          await sleep(10);
          document
            .querySelector(`[data-id="${selectedFile.id}"]`)
            ?.scrollIntoView({ block: "center" });
        },
      }}
    />
  );
}
