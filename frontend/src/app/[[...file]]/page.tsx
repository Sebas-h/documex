"use client";

import { useEffect, useRef, useState } from "react";
import { OnPageNavigation } from "../_components/on-page-navigator";
import { useStateStoreDispatch } from "../_context/state-store-context";
import { addEventListenerOnStringHTML } from "../_helpers/utils";
import { usePathname } from "next/navigation";
import { ButtonIcon } from "../_components/button";

export default function Page() {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
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
      // Create Document with copy button event listeners attached
      const doc = addEventListenerOnStringHTML(data.html);
      const current = contentRef?.current;
      if (current) {
        // Remove existing content
        current.innerHTML = "";
        // Append new content of `doc` to Virutal DOM `ref`
        Array.from(doc.body.childNodes).forEach((child) => {
          current.appendChild(child);
        });
      }
      // Set html content on local state (XXX: this might be redundant?)
      setContent(data.html);
      dispatch({ type: "setSelectedFileHeaders", data: data.headers });
    };
    const pname = pathname.slice(1);
    if (!pname) return;
    dataFetch(pname);
  }, [setContent, pathname, contentRef]);

  return (
    <div
      ref={containerRef}
      className="relative grow-1 overflow-auto bg-gray-800 rounded-md m-2 p-6"
    >
      {content && (
        <div className="sticky top-0 float-right z-50">
          <ButtonIcon
            icon="arrow-up"
            onClick={() => containerRef?.current?.scrollTo({ top: 0 })}
          />
        </div>
      )}
      <div
        className="markdown-body prose dark:prose-invert max-w-none"
        ref={contentRef}
      ></div>
    </div>
  );
}
