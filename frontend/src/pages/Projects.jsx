import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useProject } from "../context/ProjectContext";
import ProjectLayout from "../components/project/ProjectLayout";
import AddProjectModal from "../components/project/AddProjectModal";
import { PlusIcon, FolderOpenIcon } from "@heroicons/react/24/outline";

export default function Projects() {
    const { t } = useTranslation();
    const { projects, project: activeProject, switchProject, createProject } = useProject();
    const [openModal, setOpenModal] = useState(false);

    const handleAddProject = async (data) => {
        await createProject(data);
    };

    return (
        <ProjectLayout>
            <div className="flex-1 space-y-6">
                <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
                    <div>
                        <h1 className="text-2xl font-bold dark:text-white">{t('projects.participatingProjects')}</h1>
                        <p className="text-sm text-gray-500">{t('projects.manageSwitchProjects')}</p>
                    </div>
                    <button
                        onClick={() => setOpenModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm"
                    >
                        <PlusIcon className="w-5 h-5" />
                        {t('projects.newProject')}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((p) => (
                        <div
                            key={p._id || p.id}
                            className={`group relative bg-white dark:bg-slate-800 rounded-xl p-6 border transition-all duration-200 hover:shadow-md 
                ${activeProject?._id === p._id ? "border-indigo-500 ring-1 ring-indigo-500" : "border-gray-200 dark:border-slate-700"}`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                                    <FolderOpenIcon className="w-6 h-6" />
                                </div>
                                {activeProject?._id === p._id && (
                                    <span className="px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                                        {t('projects.active')}
                                    </span>
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 transition-colors">
                                {p.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-10">
                                {p.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                                <span className={`text-xs px-2 py-1 rounded-full ${p.privacy === "Private"
                                    ? "bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-300"
                                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    }`}>
                                    {p.privacy === "Private" ? t('projects.private') : t('projects.public')}
                                </span>

                                <button
                                    onClick={() => switchProject(p._id)}
                                    className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                                >
                                    {t('projects.openProject')} &rarr;
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {openModal && (
                <AddProjectModal
                    onClose={() => setOpenModal(false)}
                    onAdd={handleAddProject}
                />
            )}
        </ProjectLayout>
    );
}
