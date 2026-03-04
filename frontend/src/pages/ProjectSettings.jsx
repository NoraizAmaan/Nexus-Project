import { useState, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import { useNavigate } from "react-router-dom";
import ProjectLayout from "../components/project/ProjectLayout";
import api from "../services/api";

export default function ProjectSettings() {
    const { project, loading, updateProject } = useProject();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        projectName: "",
        description: "",
        privacy: "Private",
        status: "Active",
    });

    useEffect(() => {
        if (project) {
            setFormData({
                projectName: project.name || "",
                description: project.description || "",
                privacy: project.privacy || "Private",
                status: project.status || "Active",
            });
        }
    }, [project]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!project) return;

        try {
            const { data } = await api.put(`/projects/${project._id}`, {
                name: formData.projectName,
                description: formData.description,
                status: formData.status,
                privacy: formData.privacy,
            });

            updateProject(data);
            alert("Settings saved successfully!");
        } catch (error) {
            console.error("Error saving settings:", error);
        }
    };

    const handleArchive = async () => {
        if (!project) return;
        if (!window.confirm("Are you sure you want to archive this project?")) return;

        try {
            const { data } = await api.put(`/projects/${project._id}`, { status: "Archived" });
            updateProject(data);
            setFormData({ ...formData, status: "Archived" });
            alert("Project archived.");
        } catch (error) {
            console.error("Error archiving project:", error);
        }
    };

    const handleDelete = async () => {
        if (!project) return;
        if (!window.confirm("Are you sure you want to DELETE this project? This cannot be undone.")) return;

        try {
            await api.delete(`/projects/${project._id}`);
            alert("Project deleted.");
            // Redirect or reset app state here
            navigate('/');
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <ProjectLayout>
            <div className="flex-1 space-y-8 max-w-4xl">
                <div>
                    <h1 className="text-2xl font-semibold">Settings</h1>
                    <p className="text-sm text-gray-500">{project?.name} / Settings</p>
                </div>

                {/* General Settings */}
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100 space-y-6 dark:bg-slate-800 dark:border-slate-700">
                    <h2 className="text-lg font-semibold border-b pb-4">General Settings</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</label>
                            <input
                                type="text"
                                name="projectName"
                                value={formData.projectName}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                            >
                                <option value="Active">Active</option>
                                <option value="Archived">Archived</option>
                                <option value="On Hold">On Hold</option>
                            </select>
                        </div>

                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-700 dark:text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Privacy</label>
                            <div className="flex items-center gap-4 mt-1">
                                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer dark:text-gray-300">
                                    <input
                                        type="radio"
                                        name="privacy"
                                        value="Public"
                                        checked={formData.privacy === "Public"}
                                        onChange={handleChange}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    Public
                                </label>
                                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer dark:text-gray-300">
                                    <input
                                        type="radio"
                                        name="privacy"
                                        value="Private"
                                        checked={formData.privacy === "Private"}
                                        onChange={handleChange}
                                        className="text-indigo-600 focus:ring-indigo-500"
                                    />
                                    Private
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleSave}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 p-6 rounded-xl border border-red-100 space-y-4 dark:bg-red-900/10 dark:border-red-900/20">
                    <h2 className="text-lg font-semibold text-red-700">Danger Zone</h2>
                    <p className="text-sm text-red-600">
                        Irreversible actions. Be careful with these settings.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-red-100 dark:bg-slate-800 dark:border-red-900/20">
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Archive Project</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Hide this project from the dashboard but keep data.</p>
                        </div>
                        <button
                            onClick={handleArchive}
                            className="text-red-600 hover:bg-red-50 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                            Archive
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-red-100 dark:bg-slate-800 dark:border-red-900/20">
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">Delete Project</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Permanently remove this project and all associated data.</p>
                        </div>
                        <button
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                        >
                            Delete Project
                        </button>
                    </div>
                </div>

            </div>
        </ProjectLayout>
    );
}
