import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import ProjectMembers from "./pages/ProjectMembers";
import ProjectOverview from "./pages/ProjectOverview";
import ProjectRoadmap from "./pages/ProjectRoadmap";
import ProjectDocuments from "./pages/ProjectDocuments";
import ProjectSettings from "./pages/ProjectSettings";
import Projects from "./pages/Projects";
import Help from "./pages/Help";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import WhatWeDo from "./pages/WhatWeDo";

import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Layout wrapper */}
      <Route element={<Layout />}>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/help" element={<Help />} />
        <Route path="/what-we-do" element={<WhatWeDo />} />

        {/* Protected (any logged-in user) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/project-members" element={<ProjectMembers />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project-overview" element={<ProjectOverview />} />
          <Route path="/project-roadmap" element={<ProjectRoadmap />} />
          <Route path="/project-documents" element={<ProjectDocuments />} />
          <Route path="/project-settings" element={<ProjectSettings />} />
        </Route>

        {/* Admin-only routes */}
        <Route element={<ProtectedRoute role="Admin" />}>
          <Route path="/users" element={<Users />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Route>
    </Routes>
  );
}
