import { calcAccess } from "../../utils/dateUtils";
import RoleDropdown from "./RoleDropdown";

export default function MembersTable({ members, selected, setSelected, onUpdate }) {
  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected(selected.length === members.length ? [] : members.map((m) => m.id));
  };

  // Deprecated usage of setMembers, using onUpdate now

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto dark:bg-slate-800 dark:border dark:border-slate-700">
      <table className="w-full text-sm dark:text-gray-300">
        <thead className="bg-gray-100 dark:bg-slate-900 dark:text-gray-400">
          <tr>
            <th className="p-3">
              <input type="checkbox" onChange={toggleAll} className="dark:bg-slate-700 dark:border-slate-600" />
            </th>
            <th className="p-3 text-left">Account</th>
            <th className="p-3">Projects</th>
            <th className="p-3">Access expires</th>
            <th className="p-3">Role</th>
            <th className="p-3">Expiration</th>
          </tr>
        </thead>

        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
              <td className="p-3">
                <input type="checkbox" checked={selected.includes(m.id)} onChange={() => toggle(m.id)} className="dark:bg-slate-700 dark:border-slate-600" />
              </td>

              <td className="p-3">
                <div className="font-medium dark:text-white">{m.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{m.email}</div>
              </td>

              <td className="p-3 text-center">{m.projects}</td>

              <td className="p-3 text-center">{m.expiresIn}</td>

              <td className="p-3">
                <RoleDropdown
                  value={m.roles}
                  onChange={(roles) => onUpdate(m.id, { roles })}
                />
              </td>

              <td className="p-3">
                <input
                  type="date"
                  value={m.expirationDate || ""}
                  onChange={(e) =>
                    onUpdate(m.id, {
                      expirationDate: e.target.value,
                      expiresIn: calcAccess(e.target.value),
                    })
                  }
                  className="border rounded px-2 py-1 text-sm dark:bg-slate-900 dark:border-slate-600 dark:text-gray-300"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

