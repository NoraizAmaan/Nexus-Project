import { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const ProjectContext = createContext();

export const ProjectProvider = ({ children, disableAutoFetch = false }) => {
    const [projects, setProjects] = useState([]);
    const [project, setProject] = useState(null); // active project
    const [loading, setLoading] = useState(!disableAutoFetch);

    const fetchProjects = async () => {
        try {
            const { data } = await api.get("/projects");
            setProjects(data);

            // If no active project, set the first one or restore from localStorage if needed
            if (!project && data.length > 0) {
                // Check if there is a saved ID in localStorage
                const savedId = localStorage.getItem("activeProjectId");
                const found = savedId ? data.find(p => p._id === savedId) : null;
                setProject(found || data[0]);
            } else if (data.length === 0) {
                setProject(null);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!disableAutoFetch) {
            fetchProjects();
        }
    }, [disableAutoFetch]);

    // Effect to persist active project ID
    useEffect(() => {
        if (project?._id) {
            localStorage.setItem("activeProjectId", project._id);
        }
    }, [project]);

    const createProject = async (newProjectData) => {
        try {
            const { data } = await api.post("/projects", newProjectData);
            setProjects([...projects, data]);
            setProject(data); // Switch to new project automatically?
            return true;
        } catch (error) {
            console.error("Error creating project:", error);
        }
        return false;
    };

    const switchProject = (projectId) => {
        const found = projects.find(p => p._id === projectId);
        if (found) setProject(found);
    };

    const updateProject = async (updatedProject) => {
        // Optimistic update
        setProject(updatedProject);
        setProjects(projects.map(p => p._id === updatedProject._id ? updatedProject : p));

        // Can add API call here if needed, usually separate from context update logic depending on usage
    };

    return (
        <ProjectContext.Provider value={{ project, projects, loading, fetchProjects, switchProject, createProject, updateProject }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProject = () => {
    return useContext(ProjectContext);
};
