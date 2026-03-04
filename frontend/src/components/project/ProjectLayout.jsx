import { useState } from "react";
import ProjectSidebar from "./ProjectSidebar";

import { Link, useLocation } from "react-router-dom";
import { useProject } from "../../context/ProjectContext";

export default function ProjectLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { project, loading } = useProject();
    const location = useLocation();
    const isProjectsPage = location.pathname === '/projects';

    // Loading State
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row gap-6 relative">
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
                <ProjectSidebar variant="desktop" />
            </div>

            {/* Mobile Sidebar Toggle */}
            <div className="md:hidden flex justify-between items-center mb-4">
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg font-medium dark:bg-slate-800 dark:text-white"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    Menu
                </button>
            </div>

            {/* Mobile Sidebar Content (Drawer) */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    ></div>

                    {/* Sidebar Panel */}
                    <div className="relative bg-white dark:bg-slate-900 w-64 h-full shadow-2xl p-6 flex flex-col transition-transform transform translate-x-0">
                        <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-slate-800 pb-4">
                            <span className="font-bold text-lg dark:text-white">Menu</span>
                            <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <ProjectSidebar variant="mobile" />
                    </div>
                </div>
            )}

            <div className="flex-1 space-y-6 overflow-hidden">
                {!project && !isProjectsPage ? (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">No Project Selected</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">
                            You don't have an active project selected. Please select one from the list or create a new one.
                        </p>
                        <Link
                            to="/projects"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition"
                        >
                            Go to Projects
                        </Link>
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
}
