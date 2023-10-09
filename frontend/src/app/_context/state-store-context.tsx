import { Dispatch, createContext, useContext, useReducer } from "react";
import { FileTree, FileTreeNodeFile } from "../_components/file-tree-navigator";
import { OnPageNavigation } from "../_components/on-page-navigator";

type State = {
  fileTree: FileTree;
  selectedFile?: FileTreeNodeFile;
  selectedFileHeaders?: OnPageNavigation[];
};

const initialState = { fileTree: [] };

export const StateStoreContext = createContext<State>(initialState);
export const StateStoreDispatchContext = createContext<
  Dispatch<StateStoreAction>
>(() => {});

export type StateStoreAction =
  | {
      type: "set";
      data: FileTree;
    }
  | {
      type: "setSelected";
      data: FileTreeNodeFile;
    }
  | {
      type: "setSelectedFileHeaders";
      data: OnPageNavigation[];
    };

function stateStoreReducer(state: State, action: StateStoreAction): State {
  switch (action.type) {
    case "set": {
      console.log("Set file tree...");
      return { ...state, fileTree: action.data };
    }
    case "setSelected": {
      console.log("Set selected file");
      return { ...state, selectedFile: action.data };
    }
    case "setSelectedFileHeaders": {
      console.log("Set selected file headers", action.data);
      return { ...state, selectedFileHeaders: action.data };
    }
  }
}

export function StateStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stateStore, dispatch] = useReducer(stateStoreReducer, initialState);

  return (
    <StateStoreContext.Provider value={stateStore}>
      <StateStoreDispatchContext.Provider value={dispatch}>
        {children}
      </StateStoreDispatchContext.Provider>
    </StateStoreContext.Provider>
  );
}

export function useStateStore() {
  return useContext(StateStoreContext);
}

export function useStateStoreDispatch() {
  return useContext(StateStoreDispatchContext);
}
