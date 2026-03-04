import { useProject } from "../../context/ProjectContext";

export default function ProjectHeader({ count, onAdd }) {
  const { project } = useProject();

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-semibold dark:text-white">Members ({count})</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {project?.name} / Members
        </p>
      </div>

      {/* ✅ ADD MEMBER BUTTON */}
      <div className="flex gap-3">
        <button
          onClick={onAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          Add member
        </button>

        <button className="bg-gray-100 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600 transition">
          Edit roles
        </button>
      </div>
    </div>
  );
}
