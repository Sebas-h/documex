"use client";

import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import _ from "lodash";

interface ResizeState {
  startWidth: number;
  startCursorScreenX: number;
  handleWidth: number;
  maxWidth: number;
}

type ResizeableSidebarProps = {
  children: React.ReactNode;
  props: {
    side: "left" | "right";
    hidden: boolean;
    defaultWidth?: number;
  };
};

/**
 * Resizeable Sidebar component
 *
 * See: https://codepen.io/Zodiase/pen/qmjyKL
 * And: https://stackoverflow.com/a/64287435
 */
export default function ResizeableSidebar({
  children,
  props,
}: ResizeableSidebarProps) {
  const asideRef = useRef<HTMLElement | null>(null);
  const [resizeDataLeft, setResizeData] = useState<ResizeState>({
    startWidth: 0,
    startCursorScreenX: 0,
    handleWidth: 100,
    maxWidth: 0,
  });
  // Starting width
  const [asideWidth, setAsideWidth] = useState<number>(
    props.defaultWidth ? props.defaultWidth : 200
  );
  const [isResizerMoving, setIsResizerMoving] = useState<boolean>(false);
  const side = props.side;
  const hidden = props.hidden;

  const handleResizerMouseDown: MouseEventHandler = (event) => {
    if (event.button !== 0) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const handleElement = event.currentTarget;
    const asideRefCurrent = asideRef.current;
    if (!asideRefCurrent) {
      console.error(new Error("Resize target element not found."));
      return;
    }
    if (!handleElement.parentElement) {
      console.error(new Error("Parent element not found."));
      return;
    }
    // XXX: Which method to use?
    // setResizeDataLeft({ ...resizeDataLeft, startWidth: 0, });
    // resizeDataLeft.startWidth = 0;
    resizeDataLeft.startWidth = asideRefCurrent.offsetWidth;
    resizeDataLeft.startCursorScreenX = event.screenX;
    // XXX: Doesn't feel great do have a dependency on an unknown parentElement
    //      perhaps pass it as a prop?
    resizeDataLeft.maxWidth =
      handleElement.parentElement.offsetWidth - resizeDataLeft.handleWidth;
    // Register commencing of mouse movement
    setIsResizerMoving(true);
    console.log("tracking started");
  };

  // See: https://stackoverflow.com/a/64287435
  const handleResizerMouseMove = useCallback(
    // XXX: Is this the proper way to debounce a callback function?
    _.debounce((event) => {
      const cursorScreenXDelta =
        event.screenX - resizeDataLeft.startCursorScreenX;
      const nw =
        side === "left"
          ? resizeDataLeft.startWidth + cursorScreenXDelta
          : resizeDataLeft.startWidth - cursorScreenXDelta;
      const newWidth = Math.min(nw, resizeDataLeft.maxWidth);
      setAsideWidth(newWidth);
    }, 1),
    []
  );

  const handleResizerMouseUp = useCallback(() => {
    setIsResizerMoving(false);
    console.log("tracking stopped");
  }, []);

  useEffect(() => {
    if (isResizerMoving)
      window.addEventListener("mousemove", handleResizerMouseMove);
    else window.removeEventListener("mousemove", handleResizerMouseMove);
    return () =>
      window.removeEventListener("mousemove", handleResizerMouseMove);
  }, [isResizerMoving, handleResizerMouseMove]);

  useEffect(() => {
    if (isResizerMoving)
      window.addEventListener("mouseup", handleResizerMouseUp);
    else window.removeEventListener("mouseup", handleResizerMouseUp);
    return () => window.removeEventListener("mouseup", handleResizerMouseUp);
  }, [isResizerMoving, handleResizerMouseUp]);

  const Resizer = (
    <div
      className={`${
        hidden ? "hidden" : ""
      } flex-[0_0_auto] select-none cursor-col-resize border-x border-gray-500 w-0.5 h-full`}
      onMouseDown={handleResizerMouseDown}
    ></div>
  );

  return (
    <>
      {side === "right" && Resizer}
      <aside
        className={`${hidden ? "hidden" : ""} flex-[0_0_auto] overflow-auto`}
        ref={asideRef}
        style={{
          width: `${asideWidth}px`,
        }}
      >
        {children}
      </aside>
      {side === "left" && Resizer}
    </>
  );
}
