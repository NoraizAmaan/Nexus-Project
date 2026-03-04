import { useState, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import ProjectLayout from "../components/project/ProjectLayout";
import AddPhaseModal from "../components/project/AddPhaseModal";
import api from "../services/api";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function ProjectRoadmap() {
    const { project } = useProject();
    const [phases, setPhases] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [phaseToEdit, setPhaseToEdit] = useState(null);

    const fetchPhases = async () => {
        if (!project?._id) return;

        try {
            const { data } = await api.get(`/phases?projectId=${project._id}`);
            setPhases(data);
        } catch (error) {
            console.error("Error fetching phases:", error);
        }
    };

    useEffect(() => {
        fetchPhases();
    }, [project]);

    const handleEdit = (phase) => {
        setPhaseToEdit(phase);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this phase?")) {
            try {
                await api.delete(`/phases/${id}`);
                fetchPhases();
            } catch (error) {
                console.error("Error deleting phase:", error);
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setPhaseToEdit(null);
    };


    const getStatusColor = (status) => {
        switch (status) {
            case "Completed":
                return "bg-green-100 text-green-700 border-green-200";
            case "In Progress":
                return "bg-blue-100 text-blue-700 border-blue-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <ProjectLayout>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">Roadmap</h1>
                    <p className="text-sm text-gray-500">{project?.name} / Roadmap</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                    Add Phase
                </button>
            </div>

            {/* Timeline */}
            <div className="relative border-l-2 border-indigo-200 ml-3 space-y-8 pb-8">
                {phases.map((phase) => (
                    <div key={phase._id} className="relative pl-8">
                        {/* Dot */}
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 border-4 border-white shadow-sm"></div>

                        {/* Content Card */}
                        <div className="bg-white p-6 rounded-xl shadow border border-gray-100 dark:bg-slate-800 dark:border-slate-700">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{phase.title}</h3>
                                    <p className="text-sm text-indigo-600 font-medium">{phase.date}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(phase.status)}`}>
                                        {phase.status}
                                    </span>
                                    <button
                                        onClick={() => handleEdit(phase)}
                                        className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                        title="Edit Phase"
                                    >
                                        <PencilSquareIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(phase._id)}
                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                        title="Delete Phase"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-gray-600 mb-4 dark:text-gray-300">{phase.description}</p>

                            {/* Tasks */}
                            <div className="bg-gray-50 rounded-lg p-3 dark:bg-slate-900">
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 dark:text-gray-400">Key Tasks</h4>
                                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 dark:text-gray-300">
                                    {phase.tasks.map((task, i) => (
                                        <li key={i}>{task}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AddPhaseModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAdd={fetchPhases}
                initialData={phaseToEdit}
                projectId={project?._id}
            />
        </ProjectLayout>
    );
}
