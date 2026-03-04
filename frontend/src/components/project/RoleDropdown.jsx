import { useState } from "react";

const ROLES = ["Administrator", "Developer"];

export default function RoleDropdown({ value = [], onChange }) {
  const [open, setOpen] = useState(false);

  const toggle = (role) => {
    onChange(
      value.includes(role)
        ? value.filter((r) => r !== role)
        : [...value, role]
    );
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="border rounded-lg px-3 py-1 text-sm bg-gray-50 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
      >
        {value.length ? value.join(", ") : "Select roles"}
      </button>

      {open && (
        <div className="absolute z-10 bg-white shadow rounded-lg mt-2 p-2 w-40 dark:bg-slate-800 dark:border dark:border-slate-700">
          {ROLES.map((r) => (
            <label
              key={r}
              className="flex items-center gap-2 text-sm py-1 cursor-pointer dark:text-gray-300 dark:hover:text-white"
            >
              <input
                type="checkbox"
                checked={value.includes(r)}
                onChange={() => toggle(r)}
                className="dark:bg-slate-700 dark:border-slate-600"
              />
              {r}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
