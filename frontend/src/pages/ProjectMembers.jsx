import { useState, useEffect } from "react";
import { useProject } from "../context/ProjectContext";
import { useAuth } from "../context/AuthContext";

import ProjectLayout from "../components/project/ProjectLayout";
import ProjectHeader from "../components/project/ProjectHeader";
import ProjectTabs from "../components/project/ProjectTabs";
import MembersToolbar from "../components/project/MembersToolbar";
import MembersTable from "../components/project/MembersTable";
import Pagination from "../components/project/Pagination";
import AddMemberModal from "../components/project/AddMemberModal";
import api from "../services/api";

export default function ProjectMembers() {
  const { project } = useProject();
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState("All");
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const PER_PAGE = 5;

  const fetchMembers = async () => {
    if (!project?._id) return;

    try {
      const { data } = await api.get(`/members?projectId=${project._id}`);
      // Ensure data is array
      const membersList = Array.isArray(data) ? data : [];
      // Map backend _id to frontend id expectation if necessary
      setMembers(membersList.map(m => ({ ...m, id: m._id })));
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [user, project]);

  // Filtering Logic
  const filtered = members.filter((m) => {
    const matchesTab = tab === "All" || m.type === tab;
    const matchesSearch =
      m.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter ? m.roles?.includes(roleFilter) : true;

    return matchesTab && matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleAddMember = async (newMemberData) => {
    try {
      const payload = {
        name: newMemberData.name,
        email: newMemberData.email,
        role: newMemberData.roles[0],
        roles: newMemberData.roles,
        type: "Member",
        status: "Active",
        budget: "$0/hr",
        projects: newMemberData.projects,
        expiresIn: newMemberData.expiresIn,
        expirationDate: newMemberData.expirationDate,
        projectId: project._id, // Add projectId
      };

      const { status } = await api.post("/members", payload);

      if (status === 201) {
        fetchMembers();
        setOpenModal(false);
      }
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const deleteSelected = async () => {
    if (!window.confirm(`Delete ${selected.length} members?`)) return;

    try {
      await Promise.all(selected.map(id => api.delete(`/members/${id}`)));
      fetchMembers();
      setSelected([]);
    } catch (error) {
      console.error("Error deleting members:", error);
    }
  };

  const handleUpdateMember = async (id, patch) => {
    // Optimistic update locally first
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));

    try {
      await api.put(`/members/${id}`, patch);
      // Success, optimistic update already happened
    } catch (error) {
      console.error("Error updating member:", error);
      fetchMembers(); // Revert/Refresh on error
    }
  };

  return (
    <ProjectLayout>
      <div className="flex-1 space-y-6 overflow-hidden">
        <ProjectHeader count={filtered.length} onAdd={() => setOpenModal(true)} />

        <div className="overflow-x-auto pb-2">
          <ProjectTabs active={tab} onChange={setTab} />
        </div>

        <MembersToolbar
          selectedCount={selected.length}
          onDelete={deleteSelected}
          search={search}
          setSearch={setSearch}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
        />

        <MembersTable
          members={paginated}
          selected={selected}
          setSelected={setSelected}
          setMembers={setMembers}
          onUpdate={handleUpdateMember}
        />

        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </div>

      {openModal && (
        <AddMemberModal
          onClose={() => setOpenModal(false)}
          onAdd={handleAddMember}
        />
      )}
    </ProjectLayout>
  );
}
