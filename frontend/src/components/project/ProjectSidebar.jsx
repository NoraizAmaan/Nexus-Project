import { Link, useLocation } from "react-router-dom";
import { useProject } from "../../context/ProjectContext";
import {
  HomeIcon,
  MapIcon,
  DocumentTextIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/outline";

const navigation = [
  { name: "My Projects", href: "/projects", icon: FolderOpenIcon },
  { name: "Overview", href: "/project-overview", icon: HomeIcon },
  { name: "Roadmap", href: "/project-roadmap", icon: MapIcon },
  { name: "Documents", href: "/project-documents", icon: DocumentTextIcon },
  { name: "Members", href: "/project-members", icon: UserGroupIcon },
  { name: "Settings", href: "/project-settings", icon: Cog6ToothIcon },
];

export default function ProjectSidebar({ variant = "desktop" }) {
  const location = useLocation();
  const { project } = useProject();

  return (
    <div data-testid="project-sidebar" className={`flex flex-col h-full ${variant === "desktop" ? "w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700" : "w-full"}`}>
      <div className="p-6 pb-2">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {project?.name || "Project 007"}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Software Project</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                                group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                                ${isActive
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-slate-700/50 dark:hover:text-gray-200"}
                            `}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                  }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
