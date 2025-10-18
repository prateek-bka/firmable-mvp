import * as React from "react";
import { cn } from "@/lib/utils";
import { PanelRightClose, PanelRightOpen } from "lucide-react";

const SidebarContext = React.createContext<{
  isOpen: boolean;
  toggle: () => void;
}>({
  isOpen: true,
  toggle: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(true);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      <div className="flex h-screen w-full overflow-hidden">{children}</div>
    </SidebarContext.Provider>
  );
}

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { isOpen } = React.useContext(SidebarContext);

  return (
    <aside
      className={cn(
        "border-r bg-sidebar transition-all duration-300 flex-shrink-0",
        isOpen ? "w-40" : "w-0 overflow-hidden"
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarTrigger({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggle } = React.useContext(SidebarContext);
  const { isOpen } = React.useContext(SidebarContext);

  return (
    <button
      onClick={toggle}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-9 w-9",
        className
      )}
      {...props}
    >
      {isOpen ? <PanelRightOpen /> : <PanelRightClose />}
    </button>
  );
}

export function SidebarInset({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
  );
}
