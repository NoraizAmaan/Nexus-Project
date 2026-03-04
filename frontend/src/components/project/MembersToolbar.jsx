export default function MembersToolbar({
  selectedCount,
  onDelete,
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      {/* LEFT */}
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-full sm:w-56 dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm w-full sm:w-auto dark:bg-slate-900 dark:border-slate-700 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
        >
          <option value="">Roles</option>
          <option value="Administrator">Administrator</option>
          <option value="Developer">Developer</option>
        </select>
      </div>

      {/* RIGHT */}
      {selectedCount > 0 && (
        <button
          onClick={onDelete}
          className="text-red-600 text-sm font-medium"
        >
          Delete ({selectedCount})
        </button>
      )}
    </div>
  );
}
