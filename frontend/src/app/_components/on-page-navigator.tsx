import { MutableRefObject, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type OnPageNavigation = {
  id: string;
  name: string;
  children: OnPageNavigation[];
};

export type OnPageNavigatorProps = {
  props: {
    pageHeadings: OnPageNavigation[];
    mdRef: MutableRefObject<HTMLDivElement | null>;
  };
};

type RecursiveOnPageNavProps = {
  props: {
    data: OnPageNavigation[];
    treeLevel: number;
    mdRef: MutableRefObject<HTMLDivElement | null>;
    pathname: string;
  };
};

// NOTE: when calculating the `pl-LEVEL` instead by using `pl-{treeLevel * 2}`
// inside `className={}` it sometimes does work on the frontend. The node will
// have the correct `pl-N` but it just isn't applying the padding. By using this
// hardcoded lookup array the issue seems to have disappeared.
const nodeClasses = ["pl-0", "pl-2", "pl-4", "pl-6", "pl-8"];

const RecursiveOnPageNav = ({ props }: RecursiveOnPageNavProps) => {
  return props.data.map((header) => {
    return (
      <div key={header.id}>
        {/* The above div exists solely to assign a key and get rid of a warning */}
        <Link href={`${props.pathname}#${header.id}`}>
          <div
            className={[
              nodeClasses[props.treeLevel],
              "hover:bg-sky-700 cursor-pointer",
            ].join(" ")}
            title={header.name.trim()}
            // onClick={() => {
            //   // See: https://codefrontend.com/scroll-to-element-in-react/
            //   props.mdRef?.current
            //     ?.querySelector(`[id=${header.id}]`)
            //     ?.scrollIntoView();
            // }}
          >
            {header.name}
          </div>
        </Link>
        {header.children && (
          <RecursiveOnPageNav
            props={{
              ...props,
              data: header.children,
              treeLevel: props.treeLevel + 1,
            }}
          />
        )}
      </div>
    );
  });
};

export function OnPageNavigator({ props }: OnPageNavigatorProps) {
  const pathname = usePathname();
  return (
    <div className="text-xs whitespace-nowrap">
      <RecursiveOnPageNav
        props={{ ...props, data: props.pageHeadings, treeLevel: 0, pathname }}
      />
    </div>
  );
}
