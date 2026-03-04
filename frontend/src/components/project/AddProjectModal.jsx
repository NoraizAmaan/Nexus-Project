import { useState } from "react";

export default function AddProjectModal({ onClose, onAdd }) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [privacy, setPrivacy] = useState("Private");

    const submit = () => {
        if (!name || !description) return;

        onAdd({
            name,
            description,
            status: "Active",
            privacy,
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-[420px] space-y-4 shadow-xl dark:bg-slate-800 dark:text-white">
                <h2 className="text-lg font-semibold">New Project</h2>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium mb-1">Project Name</label>
                    <input
                        aria-label="Project Name"
                        className="w-full border rounded-lg px-3 py-2 dark:bg-slate-700 dark:border-slate-600"
                        placeholder="e.g. Project Alpha"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        aria-label="Description"
                        className="w-full border rounded-lg px-3 py-2 dark:bg-slate-700 dark:border-slate-600"
                        placeholder="Brief description of the project..."
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                {/* Privacy */}
                <div>
                    <label className="block text-sm font-medium mb-1">Privacy</label>
                    <select
                        aria-label="Privacy"
                        className="w-full border rounded-lg px-3 py-2 dark:bg-slate-700 dark:border-slate-600"
                        value={privacy}
                        onChange={(e) => setPrivacy(e.target.value)}
                    >
                        <option>Private</option>
                        <option>Public</option>
                    </select>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg border dark:border-slate-600 dark:hover:bg-slate-700"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={submit}
                        className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                        Create Project
                    </button>
                </div>
            </div>
        </div>
    );
}
