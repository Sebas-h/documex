import { Dispatch, SetStateAction } from "react";
import { extractDirectoryIds } from "../_helpers/utils";
import Link from "next/link";

export type FileTree = FileTreeNode[];

type NonEmptyArray<T> = [T, ...T[]];
type _FileTreeNodePart = {
  name: string;
  id: string;
  path: string;
};
export type FileTreeNodeFile = {
  type: "file";
} & _FileTreeNodePart;
export type FileTreeNodeDir = {
  type: "directory";
  subtree: NonEmptyArray<FileTreeNode>;
} & _FileTreeNodePart;
export type FileTreeNode = FileTreeNodeFile | FileTreeNodeDir;

export type IFileTreeNavigatorProps = {
  data: FileTree;
  selectedFile: FileTreeNodeFile | null;
  // setSelectedFile: Dispatch<SetStateAction<FileTreeNodeFile | null>>;
  nodesToHide: string[];
  setNodesToHide: Dispatch<SetStateAction<string[]>>;

  handleFileClick: (file: FileTreeNodeFile) => () => void;
  handleDirClick: (dir: FileTreeNodeDir) => () => void;
  
  pathname: string;
};

export type FileTreeNavigatorProps = {
  props: IFileTreeNavigatorProps;
};

type RecursiveFileTreeProps = FileTreeNavigatorProps & {
  props: {
    treeLevel: number;
    /**
     * List of `0` and `1` where each value's index refers to a level in tree and
     * the value whether (`1`) or not (`0`) to apply a particular prefix for a
     * particular node at the given tree level.
     * E.g.
     * ```txt
     * src
     * ├── dir_one
     * │   ├── a.md
     * │   └── dir_one_one
     * │       └── b.txt
     * ├── dir_three
     * │   └── d.md
     * └── dir_two
     *     └── dir_two_one
     *         └── c.png
     * ```
     * Here every node on "src" level will have `[]` and every node on the level
     * below (i.e. with "dir_one" etc) will also have `[]` because there is no
     * prefix to consider for these besides the one directly in front it them.
     * For the rest it will be:
     * - "a.md": [1]
     * - "dir_one_one": [1]
     * - "b.txt": [1, 0]
     * - "d.md": [1]
     * - "dir_two_one": [0]
     * - "c.png": [0, 0]
     * In each list the first value indicates whether a vertical bar `|` is
     * required and the first column-level (i.e. below "src"), the second value
     * the same but for the 2nd column-level, and so on.
     */
    prefixStyleIndicators: number[];
    // Used to be able to hide nodes below an internal node (i.e. directory)
    directDescendantOf: string | null;
  };
};

function getPrefixGuidelines(
  level: number,
  prefixStyleIndicators: number[]
): string {
  if (level < 2) return "";
  // NOTE: '\u00a0' == unicode-Space; `' '` gets trimmed when used in
  // HTMLElement, i.e. <div>{" x"}</div> becomes `<div>x</div>` and
  // <div>{"\u00a0x"}</div> becomes `<div> x</div>`
  return [...prefixStyleIndicators]
    .map((lvl) => (lvl == 0 ? `\u00a0\u00a0` : "│\u00a0"))
    .join("");
}

function getNodeIndicator(index: number, len: number): string {
  if (len == 1 || index == len - 1) {
    return `└`;
  } else if (index == 0) {
    return `├`;
  }
  return `├`;
}

function newPrefixStyleIndicators(
  currentPrefixStyleIndicators: number[],
  nodeIdxOnLevel: number,
  numNodesOnLevel: number,
  treeLevel: number
) {
  let levelsCopy = [...currentPrefixStyleIndicators];
  if (treeLevel > 0) {
    if (nodeIdxOnLevel == numNodesOnLevel - 1) {
      levelsCopy.push(0);
    } else {
      levelsCopy.push(1);
    }
  }
  return levelsCopy;
}

const determineHide = (
  nodesToHide: string[],
  directDescendantOf: string | null
): string => {
  if (directDescendantOf && nodesToHide.includes(directDescendantOf))
    return "hidden";
  return "";
};

const styleClasses = {
  treeNodePrefix: "select-none text-gray-500 font-mono",
  treeNode: "hover:bg-sky-700 cursor-pointer",
  treeNodeDir: "cursor-pointer",
  directoryName: "font-bold",
};

/**
 * Recursive built up file tree like component from file tree data
 *
 * On recursive components: https://blog.logrocket.com/recursive-components-react-real-world-example/
 */
function RecursiveFileTree({ props }: RecursiveFileTreeProps) {
  const data = props.data;
  const treeLevel = props.treeLevel;
  const prefixStyleIndicators = props.prefixStyleIndicators;
  const numNodesOnLevel = Object.keys(data).length;
  const handleFileClick = props.handleFileClick;
  const handleDirClick = props.handleDirClick;

  return (
    <>
      {data.map((treeNode, index) => {
        const nodeIdxOnLevel = index;
        const prefixGuidelines = getPrefixGuidelines(
          treeLevel,
          prefixStyleIndicators
        );
        const nodeIndicator = getNodeIndicator(nodeIdxOnLevel, numNodesOnLevel);

        // It's a file!
        if (treeNode.type === "file") {
          return (
            <Link
              key={`${treeLevel}${nodeIdxOnLevel}`}
              href={`/${treeNode.path}`}
            >
              <div
                key={`${treeLevel}${nodeIdxOnLevel}`}
                className={[
                  styleClasses.treeNode,
                  treeNode.id === props.pathname.slice(1) ? "bg-gray-600" : "",
                  // props.selectedFile && props.selectedFile.id === treeNode.id
                  //   ? "bg-gray-600"
                  //   : "",
                  determineHide(props.nodesToHide, props.directDescendantOf),
                ].join(" ")}
                data-name="tree-leaf-node"
                data-id={treeNode.id}
                onClick={handleFileClick(treeNode)}
              >
                {treeLevel > 0 && (
                  <span
                    className={styleClasses.treeNodePrefix}
                    data-name="tree-node-prefix"
                  >
                    {prefixGuidelines}
                    {nodeIndicator}
                    {`─\u00a0`}
                  </span>
                )}
                <span
                  className={[styleClasses.treeNode].join(" ")}
                  data-name="node-file"
                >
                  {treeNode.name}
                </span>
              </div>
            </Link>
          );
        }

        // It's a directory
        return (
          <div
            key={`${treeLevel}${nodeIdxOnLevel}`}
            data-name="subtree"
            className={determineHide(
              props.nodesToHide,
              props.directDescendantOf
            )}
          >
            <div
              className={[styleClasses.treeNodeDir, "flex flex-row gap-1"].join(
                " "
              )}
              data-name="tree-internal-node"
            >
              <span
                className="grow hover:bg-sky-700"
                onClick={handleDirClick(treeNode)}
                title={treeNode.name.trim()}
              >
                <span
                  className={styleClasses.treeNodePrefix}
                  data-name="tree-node-prefix"
                >
                  {treeLevel > 0 && (
                    <>
                      {prefixGuidelines}
                      {nodeIndicator}
                      {`\u00a0`}
                    </>
                  )}
                  {`🗂️\u00a0`}
                </span>
                <span
                  className={[
                    styleClasses.treeNode,
                    styleClasses.directoryName,
                  ].join(" ")}
                  data-name="node-directory"
                >
                  {treeNode.name}
                </span>
              </span>
              <span>
                <span
                  className="text-gray-600 hover:text-sky-700"
                  onClick={() => {
                    // Expand subtree recursively"
                    props.setNodesToHide(
                      props.nodesToHide.filter(
                        (n) => !n.startsWith(treeNode.id)
                      )
                    );
                  }}
                >
                  [+]
                </span>
                <span
                  className="text-gray-600 hover:text-sky-700"
                  onClick={() => {
                    // Collapse subtree recursively"
                    props.setNodesToHide([
                      ...props.nodesToHide,
                      treeNode.id,
                      ...extractDirectoryIds(treeNode.subtree),
                    ]);
                  }}
                >
                  [-]
                </span>
              </span>
            </div>
            <RecursiveFileTree
              props={{
                ...props,
                data: treeNode.subtree,
                treeLevel: treeLevel + 1,
                prefixStyleIndicators: newPrefixStyleIndicators(
                  prefixStyleIndicators,
                  nodeIdxOnLevel,
                  numNodesOnLevel,
                  treeLevel
                ),
                directDescendantOf: treeNode.id,
              }}
            />
          </div>
        );
      })}
    </>
  );
}

export function FileTreeNavigator({ props }: FileTreeNavigatorProps) {
  return (
    <div className="text-sm whitespace-nowrap">
      <RecursiveFileTree
        props={{
          ...props,
          treeLevel: 0,
          prefixStyleIndicators: [],
          directDescendantOf: null,
        }}
      />
    </div>
  );
}
