import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/ui/sidebar";
import { LayoutDashboard } from "lucide-react";

const AppSidebar = () => {
  const location = useLocation();

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard />,
    },
  ];

  return (
    <Sidebar>
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-16 items-center justify-center border-b border-sidebar-border">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 font-semibold text-lg text-amber-50"
          >
            {/* <img src={Logo} className="w-20 h-auto" /> */}
            Firmable MVP
          </Link>
        </div>
        <nav className="flex-1 overflow-auto py-3">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg px-2 py-3 text-xs transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    location.pathname === item.href
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/70"
                  )}
                >
                  {item.icon}
                  <span className="text-center">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
