import { useState } from "react";
import { calcAccess } from "../../utils/dateUtils";

export default function AddMemberModal({ onClose, onAdd }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projects, setProjects] = useState(1);
  const [role, setRole] = useState("Developer");
  const [expiration, setExpiration] = useState("");

  const submit = () => {
    if (!name || !email || !expiration) return;

    const expiresIn = calcAccess(expiration);

    onAdd({
      id: Date.now(),              // unique id for selection
      name,
      email,
      projects,
      roles: [role],               // role dropdown
      expirationDate: expiration,  // for <input type="date">
      expiresIn,                   // for Access Expires column
      type: "Member",              // must match existing members
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[420px] space-y-4 shadow-xl">
        <h2 className="text-lg font-semibold">Add Member</h2>

        {/* Name */}
        <input
          aria-label="Full name"
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <input
          aria-label="Email address"
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Projects */}
        <input
          aria-label="Projects count"
          type="number"
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Projects"
          value={projects}
          onChange={(e) => setProjects(+e.target.value)}
        />

        {/* Role */}
        <select
          aria-label="Role"
          className="w-full border rounded-lg px-3 py-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option>Administrator</option>
          <option>Developer</option>
          <option>Viewer</option>
        </select>

        {/* Expiration Date */}
        <input
          aria-label="Access expiration date"
          type="date"
          className="w-full border rounded-lg px-3 py-2"
          value={expiration}
          onChange={(e) => setExpiration(e.target.value)}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

