import {
  FileTree,
  FileTreeNode,
  FileTreeNodeDir,
  FileTreeNodeFile,
} from "../_components/file-tree-navigator";

export function extractDirectoryIds(tree: FileTree): string[] {
  let ids: string[] = [];
  for (const node of tree) {
    if (node.type === "directory") {
      ids.push(node.id);
      if (node.subtree) {
        ids = ids.concat(extractDirectoryIds(node.subtree));
      }
    }
  }
  return ids;
}

export const getDirPath = (f: FileTreeNodeFile) =>
  f.path.split("/").slice(0, -1).join("/");

export const getFilePathDirParts = (f: FileTreeNodeFile) =>
  f.path.split("/").slice(0, -1);

export function buildPaths(subdirs: string[]) {
  return subdirs.reduce((acc, curr) => {
    const dir: string = (acc.length ? acc[acc.length - 1] + "/" : "") + curr;
    acc.push(dir);
    return acc;
  }, [] as string[]);
}

function findParents(node: FileTreeNode, tree: FileTree): FileTreeNodeDir[] {
  let parents: FileTreeNodeDir[] = [];
  function _rec_find(
    node: FileTreeNode,
    currentTree: FileTree,
    currentParents: FileTreeNodeDir[]
  ): void {
    if (!currentTree || typeof currentTree[Symbol.iterator] !== "function") {
      return;
    }
    for (const current of currentTree) {
      if (current.id === node.id) {
        parents = currentParents;
        return;
      }
      if (current.type === "directory") {
        _rec_find(node, current.subtree, [...currentParents, current]);
      }
    }
  }
  _rec_find(node, tree, []);
  return parents;
}

export function getFileByPathname(
  fileTree: FileTree,
  pathname: string
): FileTreeNodeFile | null {
  for (const node of fileTree) {
    // If the current node is a file and matches the pathname
    if (node.type === "file" && node.path === pathname) {
      return node;
    }

    // If the current node is a directory, recursively search its subtree
    if (node.type === "directory") {
      const result = getFileByPathname(node.subtree, pathname);
      if (result) {
        return result;
      }
    }
  }

  // If no file is found, return null
  return null;
}
