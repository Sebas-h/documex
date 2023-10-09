import ResizeableSidebar from "../_components/resizeable-sidebar";

export type RightSidebarProps = {
  children: React.ReactNode;
  props: {
    hidden: boolean;
  };
};

export default function RightSidebar({ children, props }: RightSidebarProps) {
  return (
    <ResizeableSidebar props={{ side: "right", hidden: props.hidden }}>
      <div className="flex flex-col h-screen">
        <div className="overflow-auto bg-gray-800 rounded-md m-2 border-8 border-gray-800">
          {children}
        </div>
      </div>
    </ResizeableSidebar>
  );
}
