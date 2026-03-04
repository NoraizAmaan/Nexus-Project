const tabs = ["All", "Member", "Group"];

export default function ProjectTabs({ active, onChange }) {
  return (
    <div className="flex gap-4 border-b dark:border-slate-700">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`pb-2 ${active === t
              ? "border-b-2 border-indigo-600 font-medium dark:text-white"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
        >
          {t}s
        </button>
      ))}
    </div>
  );
}
